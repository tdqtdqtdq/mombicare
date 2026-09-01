"use client";

import {
  FormEvent,
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { createClient } from "@/app/lib/supabase/client";
import { downloadExcel } from "../../excel";
import { CurrencyInput } from "../../components/CurrencyInput";
import { formatVnd } from "../../utils";
import {
  expenseCategoryLabels,
  saleTypeLabels,
  type ExpenseCategory,
  type ExpenseEntry,
  type Profile,
  type RevenueEntry,
  type SaleType,
  type Service,
} from "../../types";

const saleTypes = Object.keys(saleTypeLabels) as SaleType[];
const expenseCategories = Object.keys(
  expenseCategoryLabels,
) as ExpenseCategory[];
const today = () => new Date().toISOString().slice(0, 10);
const daysPerPage = 7;

type EntryForm = {
  service_date: string;
  customer_name: string;
  service_id: string;
  sale_type: SaleType;
  price_snapshot: number;
  revenue_amount: number;
  external_payout_amount: number;
  technician_id: string;
  consultant_id: string;
  notes: string;
};

type ExpenseForm = {
  expense_date: string;
  category: ExpenseCategory;
  description: string;
  amount: number;
  notes: string;
};

const blankForm = (): EntryForm => ({
  service_date: today(),
  customer_name: "",
  service_id: "",
  sale_type: "retail",
  price_snapshot: 0,
  revenue_amount: 0,
  external_payout_amount: 0,
  technician_id: "",
  consultant_id: "",
  notes: "",
});
const blankExpense = (): ExpenseForm => ({
  expense_date: today(),
  category: "materials",
  description: "",
  amount: 0,
  notes: "",
});

type CashbookItem =
  | { kind: "income"; date: string; item: RevenueEntry }
  | { kind: "expense"; date: string; item: ExpenseEntry };

export function RevenueManager({ profile }: { profile: Profile }) {
  const [services, setServices] = useState<Service[]>([]);
  const [people, setPeople] = useState<Profile[]>([]);
  const [entries, setEntries] = useState<RevenueEntry[]>([]);
  const [expenses, setExpenses] = useState<ExpenseEntry[]>([]);
  const [form, setForm] = useState<EntryForm>(blankForm);
  const [expenseForm, setExpenseForm] = useState<ExpenseForm>(blankExpense);
  const [editingEntry, setEditingEntry] = useState<RevenueEntry | null>(null);
  const [editEntryForm, setEditEntryForm] = useState<EntryForm | null>(null);
  const [editingExpense, setEditingExpense] = useState<ExpenseEntry | null>(
    null,
  );
  const [editExpenseForm, setEditExpenseForm] = useState<ExpenseForm | null>(
    null,
  );
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dayPage, setDayPage] = useState(1);
  const [employeeFilter, setEmployeeFilter] = useState("");
  const [saleTypeFilter, setSaleTypeFilter] = useState<SaleType | "">("");
  const [expenseCategoryFilter, setExpenseCategoryFilter] = useState<
    ExpenseCategory | ""
  >("");
  const [statusFilter, setStatusFilter] = useState<"completed" | "void" | "">(
    "",
  );
  const [cashbookTypeFilter, setCashbookTypeFilter] = useState<
    "income" | "expense" | ""
  >("");
  const [openDays, setOpenDays] = useState<Record<string, boolean>>({});

  const canEditAmounts = profile.role === "owner";
  const isExternalTour = form.sale_type === "external_tour";
  const availableSaleTypes = canEditAmounts
    ? saleTypes
    : saleTypes.filter((type) => type !== "external_tour");

  const load = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    const [serviceResult, peopleResult, entriesResult, expenseResult] =
      await Promise.all([
        supabase
          .from("services")
          .select("id, name, default_price, active")
          .eq("active", true)
          .order("name"),
        supabase
          .from("profiles")
          .select("id, display_name, role, is_active")
          .eq("is_active", true)
          .order("display_name"),
        supabase
          .from("revenue_entries")
          .select(
            "id, service_date, customer_name, source_ref, sale_type, service_id, service_name_snapshot, revenue_amount, price_snapshot, external_payout_amount, technician_id, consultant_id, created_by, notes, status, service:services(name), technician:profiles!revenue_entries_technician_id_fkey(display_name), consultant:profiles!revenue_entries_consultant_id_fkey(display_name)",
          )
          .order("service_date", { ascending: false })
          .order("created_at", { ascending: false })
          .limit(500),
        supabase
          .from("expense_entries")
          .select(
            "id, expense_date, category, description, amount, notes, status, created_by",
          )
          .order("expense_date", { ascending: false })
          .order("created_at", { ascending: false })
          .limit(500),
      ]);
    if (
      serviceResult.error ||
      peopleResult.error ||
      entriesResult.error ||
      expenseResult.error
    ) {
      setMessage(
        "Không tải được sổ thu chi. Hãy kiểm tra quyền Supabase và chạy migration SQL mới nhất.",
      );
      setLoading(false);
      return;
    }
    const nextServices = (serviceResult.data ?? []) as Service[];
    setServices(nextServices);
    setPeople((peopleResult.data ?? []) as Profile[]);
    setEntries((entriesResult.data ?? []) as unknown as RevenueEntry[]);
    setExpenses((expenseResult.data ?? []) as ExpenseEntry[]);
    setForm((current) => {
      if (current.service_id || !nextServices[0]) return current;
      const first = nextServices[0];
      return {
        ...current,
        service_id: first.id,
        price_snapshot: Number(first.default_price),
        revenue_amount: Number(first.default_price),
        technician_id: profile.id,
      };
    });
    setLoading(false);
  }, [profile.id]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void load();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  function selectService(serviceId: string) {
    const service = services.find((item) => item.id === serviceId);
    const price = Number(service?.default_price ?? 0);
    setForm((current) => ({
      ...current,
      service_id: serviceId,
      price_snapshot: price,
      revenue_amount:
        current.sale_type === "package_usage" || current.sale_type === "gift"
          ? 0
          : price,
      external_payout_amount:
        current.sale_type === "external_tour" ? Math.round(price * 0.5) : 0,
    }));
  }

  function selectSaleType(saleType: SaleType) {
    setForm((current) => ({
      ...current,
      sale_type: saleType,
      revenue_amount:
        saleType === "package_usage" || saleType === "gift"
          ? 0
          : current.price_snapshot,
      external_payout_amount:
        saleType === "external_tour"
          ? Math.round(current.price_snapshot * 0.5)
          : 0,
      technician_id: saleType === "external_tour" ? "" : current.technician_id,
      consultant_id: saleType === "external_tour" ? "" : current.consultant_id,
    }));
  }

  function openEntryEditor(entry: RevenueEntry) {
    setEditingEntry(entry);
    setEditEntryForm({
      service_date: entry.service_date,
      customer_name: entry.customer_name,
      service_id: entry.service_id,
      sale_type: entry.sale_type,
      price_snapshot: Number(entry.price_snapshot),
      revenue_amount: Number(entry.revenue_amount),
      external_payout_amount: Number(entry.external_payout_amount),
      technician_id: entry.technician_id ?? "",
      consultant_id: entry.consultant_id ?? "",
      notes: entry.notes ?? "",
    });
    setMessage("");
  }

  function selectEditService(serviceId: string) {
    const service = services.find((item) => item.id === serviceId);
    const price = Number(service?.default_price ?? 0);
    setEditEntryForm((current) =>
      current
        ? {
            ...current,
            service_id: serviceId,
            price_snapshot: price,
            revenue_amount:
              current.sale_type === "package_usage" ||
              current.sale_type === "gift"
                ? 0
                : price,
            external_payout_amount:
              current.sale_type === "external_tour"
                ? Math.round(price * 0.5)
                : 0,
          }
        : current,
    );
  }

  function selectEditSaleType(saleType: SaleType) {
    setEditEntryForm((current) =>
      current
        ? {
            ...current,
            sale_type: saleType,
            revenue_amount:
              saleType === "package_usage" || saleType === "gift"
                ? 0
                : current.price_snapshot,
            external_payout_amount:
              saleType === "external_tour"
                ? Math.round(current.price_snapshot * 0.5)
                : 0,
            technician_id:
              saleType === "external_tour" ? "" : current.technician_id,
            consultant_id:
              saleType === "external_tour" ? "" : current.consultant_id,
          }
        : current,
    );
  }

  function openExpenseEditor(expense: ExpenseEntry) {
    setEditingExpense(expense);
    setEditExpenseForm({
      expense_date: expense.expense_date,
      category: expense.category,
      description: expense.description,
      amount: Number(expense.amount),
      notes: expense.notes ?? "",
    });
    setMessage("");
  }

  const cashbookDays = useMemo(() => {
    const incomes: CashbookItem[] =
      cashbookTypeFilter === "expense"
        ? []
        : entries
            .filter((entry) => {
              const employeeMatches =
                !employeeFilter ||
                entry.technician_id === employeeFilter ||
                entry.consultant_id === employeeFilter;
              return (
                employeeMatches &&
                (!saleTypeFilter || entry.sale_type === saleTypeFilter) &&
                (!statusFilter || entry.status === statusFilter)
              );
            })
            .map((item) => ({ kind: "income", date: item.service_date, item }));
    const outgoing: CashbookItem[] =
      cashbookTypeFilter === "income" || employeeFilter || saleTypeFilter
        ? []
        : expenses
            .filter(
              (expense) =>
                (!expenseCategoryFilter ||
                  expense.category === expenseCategoryFilter) &&
                (!statusFilter || expense.status === statusFilter),
            )
            .map((item) => ({
              kind: "expense",
              date: item.expense_date,
              item,
            }));
    const groups = new Map<string, CashbookItem[]>();
    [...incomes, ...outgoing].forEach((item) =>
      groups.set(item.date, [...(groups.get(item.date) ?? []), item]),
    );
    return [...groups.entries()]
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([date, items]) => ({
        date,
        items,
        income: items
          .filter(
            (item) =>
              item.kind === "income" && item.item.status === "completed",
          )
          .reduce(
            (sum, item) =>
              sum +
              Number(item.kind === "income" ? item.item.revenue_amount : 0),
            0,
          ),
        expense: items
          .filter(
            (item) =>
              item.kind === "expense" && item.item.status === "completed",
          )
          .reduce(
            (sum, item) =>
              sum + Number(item.kind === "expense" ? item.item.amount : 0),
            0,
          ),
      }));
  }, [
    cashbookTypeFilter,
    employeeFilter,
    entries,
    expenseCategoryFilter,
    expenses,
    saleTypeFilter,
    statusFilter,
  ]);
  const dayPageCount = Math.max(
    1,
    Math.ceil(cashbookDays.length / daysPerPage),
  );
  const currentDayPage = Math.min(dayPage, dayPageCount);
  const visibleDays = cashbookDays.slice(
    (currentDayPage - 1) * daysPerPage,
    currentDayPage * daysPerPage,
  );

  function exportRevenueExcel() {
    const rows = cashbookDays.flatMap((day) =>
      day.items.map((cashItem) =>
        cashItem.kind === "income"
          ? [
              day.date,
              "Thu",
              cashItem.item.customer_name,
              cashItem.item.service_name_snapshot,
              cashItem.item.technician?.display_name ??
                cashItem.item.consultant?.display_name ??
                "",
              Number(cashItem.item.revenue_amount),
              0,
              Number(cashItem.item.revenue_amount),
              cashItem.item.status === "completed" ? "Hoàn tất" : "Đã hủy",
            ]
          : [
              day.date,
              "Chi",
              cashItem.item.description,
              expenseCategoryLabels[cashItem.item.category],
              "",
              0,
              Number(cashItem.item.amount),
              -Number(cashItem.item.amount),
              cashItem.item.status === "completed" ? "Hoàn tất" : "Đã hủy",
            ],
      ),
    );
    const income = cashbookDays.reduce((sum, day) => sum + day.income, 0);
    const expense = cashbookDays.reduce((sum, day) => sum + day.expense, 0);
    downloadExcel({
      filename: `so-thu-chi-${today()}.xlsx`,
      sheetName: "Sổ thu chi",
      title: "SỔ THU CHI MOMBI CARE SPA",
      columns: [
        "Ngày",
        "Loại",
        "Khách / nội dung",
        "Dịch vụ / nhóm",
        "Nhân viên",
        "Thu",
        "Chi",
        "Chênh",
        "Trạng thái",
      ],
      rows,
      amountColumns: [5, 6, 7],
      summary: [
        ["Tổng thu", income],
        ["Tổng chi", expense],
        ["Chênh lệch", income - expense],
      ],
    });
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const service = services.find((item) => item.id === form.service_id);
    const customerName =
      form.customer_name.trim() ||
      (isExternalTour ? "Khách tua ngoài (không có tên)" : "");
    if (
      !service ||
      !customerName ||
      (!isExternalTour &&
        form.sale_type !== "package_sale" &&
        !form.technician_id)
    ) {
      setMessage(
        isExternalTour || form.sale_type === "package_sale"
          ? "Hãy nhập tên khách và chọn dịch vụ trước khi lưu."
          : "Hãy nhập tên khách, chọn dịch vụ và kỹ thuật viên trước khi lưu.",
      );
      return;
    }
    setSaving(true);
    setMessage("");
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setMessage("Phiên đăng nhập đã hết hạn. Hãy đăng nhập lại.");
      setSaving(false);
      return;
    }
    const { error } = await supabase.from("revenue_entries").insert({
      service_date: form.service_date,
      customer_name: customerName,
      service_id: form.service_id,
      sale_type: form.sale_type,
      service_name_snapshot: service.name,
      price_snapshot: form.price_snapshot,
      revenue_amount: form.revenue_amount,
      external_payout_amount: isExternalTour ? form.external_payout_amount : 0,
      technician_id: isExternalTour ? null : form.technician_id || null,
      consultant_id: isExternalTour ? null : form.consultant_id || null,
      created_by: user.id,
      notes: form.notes.trim() || null,
      status: "completed",
    });
    if (error)
      setMessage(
        error.message.includes("Nhân viên không được")
          ? error.message
          : `Chưa thể lưu: ${error.message}`,
      );
    else {
      setMessage("Đã ghi doanh thu và tính hoa hồng.");
      setForm(() => ({
        ...blankForm(),
        service_id: services[0]?.id ?? "",
        price_snapshot: Number(services[0]?.default_price ?? 0),
        revenue_amount: Number(services[0]?.default_price ?? 0),
        technician_id: profile.id,
      }));
      await load();
    }
    setSaving(false);
  }

  async function submitExpense(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!expenseForm.description.trim() || expenseForm.amount <= 0) {
      setMessage("Hãy nhập nội dung và số tiền chi.");
      return;
    }
    setSaving(true);
    setMessage("");
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setMessage("Phiên đăng nhập đã hết hạn. Hãy đăng nhập lại.");
      setSaving(false);
      return;
    }
    const { error } = await supabase.from("expense_entries").insert({
      expense_date: expenseForm.expense_date,
      category: expenseForm.category,
      description: expenseForm.description.trim(),
      amount: expenseForm.amount,
      notes: expenseForm.notes.trim() || null,
      created_by: user.id,
      status: "completed",
    });
    if (error) setMessage(`Chưa thể lưu khoản chi: ${error.message}`);
    else {
      setMessage("Đã ghi khoản chi vào sổ.");
      setExpenseForm(blankExpense());
      await load();
    }
    setSaving(false);
  }

  async function saveEntryEdit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editingEntry || !editEntryForm || profile.role !== "owner") return;
    const service = services.find(
      (item) => item.id === editEntryForm.service_id,
    );
    const externalTour = editEntryForm.sale_type === "external_tour";
    const customerName =
      editEntryForm.customer_name.trim() ||
      (externalTour ? "Khách tua ngoài (không có tên)" : "");
    if (
      !service ||
      !customerName ||
      (!externalTour &&
        editEntryForm.sale_type !== "package_sale" &&
        !editEntryForm.technician_id)
    ) {
      setMessage(
        "Chưa thể lưu: cần tên khách, dịch vụ và kỹ thuật viên hợp lệ.",
      );
      return;
    }

    setSaving(true);
    setMessage("");
    const technicianId = externalTour
      ? null
      : editEntryForm.technician_id || null;
    const consultantId = externalTour
      ? null
      : editEntryForm.consultant_id || null;
    const externalPayoutAmount = externalTour
      ? Math.max(0, editEntryForm.external_payout_amount)
      : 0;
    const notes = editEntryForm.notes.trim() || null;
    const update: Record<string, string | number | null> = {};

    if (editEntryForm.service_date !== editingEntry.service_date)
      update.service_date = editEntryForm.service_date;
    if (customerName !== editingEntry.customer_name)
      update.customer_name = customerName;
    if (editEntryForm.service_id !== editingEntry.service_id) {
      update.service_id = editEntryForm.service_id;
      update.service_name_snapshot = service.name;
    }
    if (editEntryForm.sale_type !== editingEntry.sale_type)
      update.sale_type = editEntryForm.sale_type;
    if (
      Math.max(0, editEntryForm.price_snapshot) !==
      Number(editingEntry.price_snapshot)
    )
      update.price_snapshot = Math.max(0, editEntryForm.price_snapshot);
    if (
      Math.max(0, editEntryForm.revenue_amount) !==
      Number(editingEntry.revenue_amount)
    )
      update.revenue_amount = Math.max(0, editEntryForm.revenue_amount);
    if (externalPayoutAmount !== Number(editingEntry.external_payout_amount))
      update.external_payout_amount = externalPayoutAmount;
    if (technicianId !== editingEntry.technician_id)
      update.technician_id = technicianId;
    if (consultantId !== editingEntry.consultant_id)
      update.consultant_id = consultantId;
    if (notes !== editingEntry.notes) update.notes = notes;

    if (Object.keys(update).length === 0) {
      setMessage("Không có thay đổi nào để lưu.");
      setSaving(false);
      return;
    }
    const recalculatesCommission = [
      "service_date",
      "service_id",
      "sale_type",
      "price_snapshot",
      "revenue_amount",
      "technician_id",
      "consultant_id",
    ].some((field) => field in update);

    const { data, error } = await createClient()
      .from("revenue_entries")
      .update(update)
      .eq("id", editingEntry.id)
      .eq("status", "completed")
      .select("id")
      .maybeSingle();

    if (error || !data) {
      setMessage(
        error?.message.includes("đã chốt lương")
          ? "Không thể sửa vì hoa hồng của dòng này đã chốt hoặc đã trả."
          : `Không thể lưu chỉnh sửa: ${error?.message ?? "dòng đã thay đổi hoặc bị hủy"}.`,
      );
    } else {
      setMessage(
        recalculatesCommission
          ? "Đã cập nhật doanh thu và tính lại hoa hồng liên quan."
          : "Đã cập nhật thông tin, hoa hồng được giữ nguyên.",
      );
      setEditingEntry(null);
      setEditEntryForm(null);
      await load();
    }
    setSaving(false);
  }

  async function saveExpenseEdit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editingExpense || !editExpenseForm || profile.role !== "owner") return;
    if (!editExpenseForm.description.trim() || editExpenseForm.amount <= 0) {
      setMessage("Cần nhập nội dung và số tiền chi lớn hơn 0.");
      return;
    }

    setSaving(true);
    setMessage("");
    const notes = editExpenseForm.notes.trim() || null;
    const update: Record<string, string | number | null> = {};
    if (editExpenseForm.expense_date !== editingExpense.expense_date)
      update.expense_date = editExpenseForm.expense_date;
    if (editExpenseForm.category !== editingExpense.category)
      update.category = editExpenseForm.category;
    if (editExpenseForm.description.trim() !== editingExpense.description)
      update.description = editExpenseForm.description.trim();
    if (editExpenseForm.amount !== Number(editingExpense.amount))
      update.amount = editExpenseForm.amount;
    if (notes !== editingExpense.notes) update.notes = notes;

    if (Object.keys(update).length === 0) {
      setMessage("Không có thay đổi nào để lưu.");
      setSaving(false);
      return;
    }

    const { data, error } = await createClient()
      .from("expense_entries")
      .update(update)
      .eq("id", editingExpense.id)
      .eq("status", "completed")
      .select("id")
      .maybeSingle();

    if (error || !data) {
      setMessage(
        `Không thể lưu khoản chi: ${error?.message ?? "dòng đã thay đổi hoặc bị hủy"}.`,
      );
    } else {
      setMessage("Đã cập nhật khoản chi.");
      setEditingExpense(null);
      setEditExpenseForm(null);
      await load();
    }
    setSaving(false);
  }

  async function voidEntry(id: string) {
    if (
      !window.confirm("Hủy dòng doanh thu này? Hoa hồng chờ chốt sẽ được xóa.")
    )
      return;
    const { error } = await createClient()
      .from("revenue_entries")
      .update({ status: "void" })
      .eq("id", id);
    setMessage(
      error ? `Không thể hủy: ${error.message}` : "Đã hủy dòng doanh thu.",
    );
    if (!error) await load();
  }

  async function deleteEntry(entry: RevenueEntry) {
    if (
      !window.confirm(
        `Xóa hẳn dòng của ${entry.customer_name}? Thao tác này không thể hoàn tác.`,
      )
    )
      return;
    const { error } = await createClient()
      .from("revenue_entries")
      .delete()
      .eq("id", entry.id);
    setMessage(
      error ? `Không thể xóa: ${error.message}` : "Đã xóa hẳn dòng doanh thu.",
    );
    if (!error) await load();
  }

  async function voidExpense(id: string) {
    if (!window.confirm("Hủy khoản chi này?")) return;
    const { error } = await createClient()
      .from("expense_entries")
      .update({ status: "void" })
      .eq("id", id);
    setMessage(
      error ? `Không thể hủy khoản chi: ${error.message}` : "Đã hủy khoản chi.",
    );
    if (!error) await load();
  }

  async function deleteExpense(expense: ExpenseEntry) {
    if (!window.confirm(`Xóa hẳn khoản chi “${expense.description}”?`)) return;
    const { error } = await createClient()
      .from("expense_entries")
      .delete()
      .eq("id", expense.id);
    setMessage(
      error
        ? `Không thể xóa khoản chi: ${error.message}`
        : "Đã xóa hẳn khoản chi.",
    );
    if (!error) await load();
  }

  return (
    <section>
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#6f9556]">
          Nhật ký hằng ngày
        </p>
        <h1 className="mt-1 font-serif text-4xl text-[#1c2619]">
          Nhập doanh thu
        </h1>
        <p className="mt-2 text-sm text-[#66745f]">
          Ghi dịch vụ đã thực hiện. Giá và thực thu của nhân viên được khóa theo
          bảng giá chủ spa thiết lập.
        </p>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <p className="rounded-xl border border-[#d8e4d2] bg-[#f7faf5] px-4 py-3 text-sm text-[#52624c]">
          <strong className="text-[#2e4627]">KTV:</strong> 50% × giá gói, không
          phụ thuộc khách giảm giá.
        </p>
        <p className="rounded-xl border border-[#d8e4d2] bg-[#f7faf5] px-4 py-3 text-sm text-[#52624c]">
          <strong className="text-[#2e4627]">Người bán:</strong> tỷ lệ cá nhân ×
          thực thu.
        </p>
        <p className="rounded-xl border border-[#d8e4d2] bg-[#f7faf5] px-4 py-3 text-sm text-[#52624c]">
          <strong className="text-[#2e4627]">Gói cũ / Tặng:</strong> thực thu 0,
          KTV vẫn tính theo giá gói.
        </p>
        <p className="rounded-xl border border-[#d8e4d2] bg-[#f7faf5] px-4 py-3 text-sm text-[#52624c]">
          <strong className="text-[#2e4627]">Trả tua ngoài:</strong> chỉ chủ spa
          ghi, tách riêng khỏi lương nhân viên.
        </p>
      </div>

      <form
        onSubmit={submit}
        className="mt-6 rounded-2xl border border-[#d8e4d2] bg-white p-5 shadow-sm sm:p-6"
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <label className="text-sm font-semibold text-[#40533b]">
            Ngày thực hiện
            <input
              required
              type="date"
              value={form.service_date}
              onChange={(event) =>
                setForm({ ...form, service_date: event.target.value })
              }
              className="field"
            />
          </label>
          <label className="text-sm font-semibold text-[#40533b]">
            Tên khách hàng
            <input
              required={!isExternalTour}
              value={form.customer_name}
              onChange={(event) =>
                setForm({ ...form, customer_name: event.target.value })
              }
              className="field"
              placeholder={
                isExternalTour
                  ? "Không có tên thì để trống"
                  : "VD: Chị Nguyễn Thị Lan"
              }
            />
          </label>
          <label className="text-sm font-semibold text-[#40533b]">
            Dịch vụ
            <select
              required
              value={form.service_id}
              onChange={(event) => selectService(event.target.value)}
              className="field"
            >
              {services.length === 0 ? (
                <option value="">Chưa có dịch vụ</option>
              ) : (
                services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name}
                  </option>
                ))
              )}
            </select>
          </label>
          <label className="text-sm font-semibold text-[#40533b]">
            Hình thức
            <select
              value={form.sale_type}
              onChange={(event) =>
                selectSaleType(event.target.value as SaleType)
              }
              className="field"
            >
              {availableSaleTypes.map((value) => (
                <option key={value} value={value}>
                  {saleTypeLabels[value]}
                </option>
              ))}
            </select>
          </label>
          {isExternalTour && (
            <p className="col-span-full -mt-1 rounded-xl border border-[#e0d4ad] bg-[#fffbef] px-3 py-2 text-sm text-[#75643b]">
              Khoản này không gán cho nhân viên và không cộng vào hoa
              hồng/lương.
            </p>
          )}
          {!isExternalTour && (
            <label className="text-sm font-semibold text-[#40533b]">
              Kỹ thuật viên{" "}
              <span className="font-normal text-[#85937e]">
                {form.sale_type === "package_sale"
                  ? "(nếu đã thực hiện dịch vụ)"
                  : ""}
              </span>
              {profile.role === "staff" ? (
                <input
                  readOnly
                  value={profile.display_name}
                  className="field bg-[#f3f7ef]"
                />
              ) : (
                <select
                  required={form.sale_type !== "package_sale"}
                  value={form.technician_id}
                  onChange={(event) =>
                    setForm({ ...form, technician_id: event.target.value })
                  }
                  className="field"
                >
                  <option value="">
                    {form.sale_type === "package_sale"
                      ? "Chưa thực hiện dịch vụ"
                      : "Chọn nhân viên"}
                  </option>
                  {people.map((person) => (
                    <option key={person.id} value={person.id}>
                      {person.display_name}
                    </option>
                  ))}
                </select>
              )}
            </label>
          )}
          {!isExternalTour && (
            <label className="text-sm font-semibold text-[#40533b]">
              Người bán{" "}
              <span className="font-normal text-[#85937e]">(nếu có)</span>
              <select
                value={form.consultant_id}
                onChange={(event) =>
                  setForm({ ...form, consultant_id: event.target.value })
                }
                className="field"
              >
                <option value="">Không có</option>
                {people.map((person) => (
                  <option key={person.id} value={person.id}>
                    {person.display_name}
                  </option>
                ))}
              </select>
            </label>
          )}
          <label className="text-sm font-semibold text-[#40533b]">
            Giá gói{" "}
            <span className="font-normal text-[#85937e]">
              (căn cứ chia KTV)
            </span>
            <CurrencyInput
              readOnly={!canEditAmounts}
              value={form.price_snapshot}
              onValueChange={(price_snapshot) =>
                setForm({ ...form, price_snapshot })
              }
              className={`field ${canEditAmounts ? "" : "cursor-not-allowed bg-[#f3f7ef] text-[#65745f]"}`}
            />
            {!canEditAmounts && (
              <span className="mt-1 block text-xs font-normal text-[#71816c]">
                Giá do chủ spa thiết lập.
              </span>
            )}
          </label>
          <label className="text-sm font-semibold text-[#40533b]">
            Thực thu{" "}
            <span className="font-normal text-[#85937e]">
              (tiền khách trả hôm nay)
            </span>
            <CurrencyInput
              readOnly={!canEditAmounts}
              required
              value={form.revenue_amount}
              onValueChange={(revenue_amount) =>
                setForm({ ...form, revenue_amount })
              }
              className={`field ${canEditAmounts ? "" : "cursor-not-allowed bg-[#f3f7ef] text-[#65745f]"}`}
            />
            {!canEditAmounts && (
              <span className="mt-1 block text-xs font-normal text-[#71816c]">
                Chỉ chủ spa được chỉnh thực thu.
              </span>
            )}
          </label>
          {isExternalTour && (
            <label className="text-sm font-semibold text-[#40533b]">
              Chi trả tua ngoài{" "}
              <span className="font-normal text-[#85937e]">
                (không tính lương nhân viên)
              </span>
              <CurrencyInput
                required
                value={form.external_payout_amount}
                onValueChange={(external_payout_amount) =>
                  setForm({
                    ...form,
                    external_payout_amount,
                  })
                }
                className="field"
              />
            </label>
          )}
          <label className="text-sm font-semibold text-[#40533b]">
            Ghi chú{" "}
            <span className="font-normal text-[#85937e]">(tùy chọn)</span>
            <input
              value={form.notes}
              onChange={(event) =>
                setForm({ ...form, notes: event.target.value })
              }
              className="field"
              placeholder="VD: khách cũ, giảm giá…"
            />
          </label>
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            disabled={saving || services.length === 0}
            className="rounded-xl bg-[#24361e] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#395330] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Đang lưu…" : "Lưu doanh thu"}
          </button>
          {message && (
            <p role="status" className="text-sm text-[#55723f]">
              {message}
            </p>
          )}
        </div>
      </form>

      {profile.role === "owner" && (
        <form
          onSubmit={submitExpense}
          className="mt-6 rounded-2xl border border-[#eadcb9] bg-[#fffdf7] p-5 shadow-sm sm:p-6"
        >
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#9a6a22]">
              Chủ spa quản lý
            </p>
            <h2 className="mt-1 font-serif text-2xl text-[#493719]">
              Ghi khoản chi khác
            </h2>
            <p className="mt-1 text-sm text-[#806c42]">
              Ví dụ: nhập nguyên vật liệu, đồ cúng, điện nước hoặc chi phí vận
              hành.
            </p>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            <label className="text-sm font-semibold text-[#6f5b32]">
              Ngày chi
              <input
                required
                type="date"
                value={expenseForm.expense_date}
                onChange={(event) =>
                  setExpenseForm({
                    ...expenseForm,
                    expense_date: event.target.value,
                  })
                }
                className="field bg-white"
              />
            </label>
            <label className="text-sm font-semibold text-[#6f5b32]">
              Nhóm chi
              <select
                value={expenseForm.category}
                onChange={(event) =>
                  setExpenseForm({
                    ...expenseForm,
                    category: event.target.value as ExpenseCategory,
                  })
                }
                className="field bg-white"
              >
                {expenseCategories.map((category) => (
                  <option key={category} value={category}>
                    {expenseCategoryLabels[category]}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm font-semibold text-[#6f5b32] xl:col-span-2">
              Nội dung
              <input
                required
                value={expenseForm.description}
                onChange={(event) =>
                  setExpenseForm({
                    ...expenseForm,
                    description: event.target.value,
                  })
                }
                className="field bg-white"
                placeholder="VD: Mua dầu gội và khăn dùng một lần"
              />
            </label>
            <label className="text-sm font-semibold text-[#6f5b32]">
              Số tiền chi
              <CurrencyInput
                required
                value={expenseForm.amount}
                onValueChange={(amount) =>
                  setExpenseForm({
                    ...expenseForm,
                    amount,
                  })
                }
                className="field bg-white"
              />
            </label>
            <label className="text-sm font-semibold text-[#6f5b32] xl:col-span-4">
              Ghi chú{" "}
              <span className="font-normal text-[#a18b61]">(tùy chọn)</span>
              <input
                value={expenseForm.notes}
                onChange={(event) =>
                  setExpenseForm({ ...expenseForm, notes: event.target.value })
                }
                className="field bg-white"
                placeholder="VD: mua tại siêu thị, đã thanh toán tiền mặt"
              />
            </label>
          </div>
          <button
            disabled={saving}
            className="mt-5 rounded-xl bg-[#9a6a22] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#80571b] disabled:opacity-50"
          >
            {saving ? "Đang lưu…" : "Lưu khoản chi"}
          </button>
        </form>
      )}

      <div className="mt-7 overflow-hidden rounded-2xl border border-[#d8e4d2] bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-[#e2ebde] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-serif text-2xl">Sổ thu chi</h2>
            <p className="mt-1 text-xs text-[#74846d]">
              Gom theo ngày · {cashbookDays.length} ngày phù hợp bộ lọc
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-[#74846d]">
              Hiển thị {daysPerPage} ngày mỗi trang
            </span>
            <button
              type="button"
              onClick={exportRevenueExcel}
              disabled={cashbookDays.length === 0}
              className="rounded-xl border border-[#b9cfad] bg-white px-4 py-2 text-xs font-bold text-[#48643a] disabled:opacity-40"
            >
              Xuất Excel
            </button>
          </div>
        </div>
        <div className="grid gap-3 border-b border-[#e2ebde] bg-[#fbfdf9] px-5 py-4 sm:grid-cols-2 xl:grid-cols-5">
          <label className="text-xs font-bold uppercase tracking-wide text-[#71816c]">
            Loại sổ
            <select
              value={cashbookTypeFilter}
              onChange={(event) => {
                setCashbookTypeFilter(
                  event.target.value as "income" | "expense" | "",
                );
                setDayPage(1);
              }}
              className="field mt-1 py-2 text-sm"
            >
              <option value="">Tất cả thu & chi</option>
              <option value="income">Chỉ doanh thu</option>
              <option value="expense">Chỉ khoản chi</option>
            </select>
          </label>
          <label className="text-xs font-bold uppercase tracking-wide text-[#71816c]">
            Nhân viên
            <select
              value={employeeFilter}
              onChange={(event) => {
                setEmployeeFilter(event.target.value);
                setDayPage(1);
              }}
              className="field mt-1 py-2 text-sm"
            >
              <option value="">Tất cả nhân viên</option>
              {people
                .filter((person) => person.role === "staff")
                .map((person) => (
                  <option key={person.id} value={person.id}>
                    {person.display_name}
                  </option>
                ))}
            </select>
          </label>
          <label className="text-xs font-bold uppercase tracking-wide text-[#71816c]">
            Hình thức thu
            <select
              value={saleTypeFilter}
              onChange={(event) => {
                setSaleTypeFilter(event.target.value as SaleType | "");
                setDayPage(1);
              }}
              className="field mt-1 py-2 text-sm"
            >
              <option value="">Tất cả hình thức</option>
              {saleTypes.map((type) => (
                <option key={type} value={type}>
                  {saleTypeLabels[type]}
                </option>
              ))}
            </select>
          </label>
          <label className="text-xs font-bold uppercase tracking-wide text-[#71816c]">
            Nhóm chi
            <select
              value={expenseCategoryFilter}
              onChange={(event) => {
                setExpenseCategoryFilter(
                  event.target.value as ExpenseCategory | "",
                );
                setDayPage(1);
              }}
              className="field mt-1 py-2 text-sm"
            >
              <option value="">Tất cả nhóm chi</option>
              {expenseCategories.map((category) => (
                <option key={category} value={category}>
                  {expenseCategoryLabels[category]}
                </option>
              ))}
            </select>
          </label>
          <label className="text-xs font-bold uppercase tracking-wide text-[#71816c]">
            Trạng thái
            <select
              value={statusFilter}
              onChange={(event) => {
                setStatusFilter(
                  event.target.value as "completed" | "void" | "",
                );
                setDayPage(1);
              }}
              className="field mt-1 py-2 text-sm"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="completed">Hoàn tất</option>
              <option value="void">Đã hủy</option>
            </select>
          </label>
        </div>
        {loading ? (
          <p className="p-5 text-sm text-[#71816c]">Đang tải…</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[980px] text-left text-sm">
                <thead className="bg-[#f5f8f2] text-xs uppercase tracking-wide text-[#71816c]">
                  <tr>
                    <th className="px-5 py-3">Loại</th>
                    <th className="px-5 py-3">Khách / nội dung</th>
                    <th className="px-5 py-3">Dịch vụ / nhóm</th>
                    <th className="px-5 py-3">Nhân viên</th>
                    <th className="px-5 py-3">Dòng tiền</th>
                    <th className="px-5 py-3">Trạng thái</th>
                    {profile.role === "owner" && <th className="px-5 py-3" />}
                  </tr>
                </thead>
                <tbody>
                  {visibleDays.map((day, dayIndex) => {
                    const isOpen = openDays[day.date] ?? dayIndex === 0;
                    return (
                      <Fragment key={day.date}>
                        <tr className="border-t border-[#dce7d6] bg-[#f7faf5]">
                          <td
                            colSpan={profile.role === "owner" ? 7 : 6}
                            className="px-5 py-3"
                          >
                            <div className="flex items-center justify-between gap-4">
                              <button
                                type="button"
                                onClick={() =>
                                  setOpenDays((current) => ({
                                    ...current,
                                    [day.date]: !isOpen,
                                  }))
                                }
                                aria-expanded={isOpen}
                                className="inline-flex items-center gap-2 text-left font-serif text-lg text-[#34472e] hover:text-[#6f9556]"
                              >
                                <span className="font-sans text-sm">
                                  {isOpen ? "⌄" : "›"}
                                </span>
                                Ngày {day.date}
                                <span className="font-sans text-xs font-semibold text-[#71816c]">
                                  ({day.items.length} dòng)
                                </span>
                              </button>
                              <span className="text-xs font-semibold text-[#64745d]">
                                Thu {formatVnd(day.income)} · Chi{" "}
                                {formatVnd(day.expense)} · Chênh{" "}
                                {formatVnd(day.income - day.expense)}
                              </span>
                            </div>
                          </td>
                        </tr>
                        {isOpen &&
                          day.items.map((cashItem) =>
                            cashItem.kind === "income" ? (
                              <tr
                                key={`income-${cashItem.item.id}`}
                                className="border-t border-[#edf1ea]"
                              >
                                <td className="px-5 py-4">
                                  <span className="rounded-full bg-[#edf4e8] px-2.5 py-1 text-xs font-bold text-[#50713c]">
                                    Thu
                                  </span>
                                </td>
                                <td className="px-5 py-4 font-semibold">
                                  {cashItem.item.customer_name}
                                </td>
                                <td className="px-5 py-4">
                                  <p className="font-semibold">
                                    {cashItem.item.service_name_snapshot}
                                  </p>
                                  <p className="mt-0.5 text-xs text-[#71816c]">
                                    {saleTypeLabels[cashItem.item.sale_type]}
                                  </p>
                                </td>
                                <td className="px-5 py-4 text-[#596953]">
                                  {cashItem.item.technician?.display_name ??
                                    "—"}
                                  {cashItem.item.consultant?.display_name
                                    ? ` / ${cashItem.item.consultant.display_name}`
                                    : ""}
                                </td>
                                <td className="px-5 py-4 font-semibold text-[#3f6533]">
                                  +{formatVnd(cashItem.item.revenue_amount)}
                                </td>
                                <td className="px-5 py-4">
                                  <span
                                    className={`rounded-full px-2.5 py-1 text-xs font-bold ${cashItem.item.status === "void" ? "bg-red-50 text-red-700" : "bg-[#edf4e8] text-[#50713c]"}`}
                                  >
                                    {cashItem.item.status === "void"
                                      ? "Đã hủy"
                                      : "Hoàn tất"}
                                  </span>
                                </td>
                                {profile.role === "owner" && (
                                  <td className="px-5 py-4">
                                    {cashItem.item.source_ref?.startsWith(
                                      "customer-package-",
                                    ) ||
                                    cashItem.item.source_ref?.startsWith(
                                      "gift-voucher-",
                                    ) ? (
                                      <span className="text-xs font-semibold text-[#71816c]">
                                        Quản lý tại Gói & quà tặng
                                      </span>
                                    ) : cashItem.item.status === "completed" ? (
                                      <div className="flex items-center gap-3 whitespace-nowrap">
                                        <button
                                          type="button"
                                          onClick={() =>
                                            openEntryEditor(cashItem.item)
                                          }
                                          className="text-xs font-bold text-[#50713c] hover:underline"
                                        >
                                          Chỉnh sửa
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() =>
                                            void voidEntry(cashItem.item.id)
                                          }
                                          className="text-xs font-bold text-[#a04c4c] hover:underline"
                                        >
                                          Hủy ghi nhận
                                        </button>
                                      </div>
                                    ) : (
                                      <button
                                        type="button"
                                        onClick={() =>
                                          void deleteEntry(cashItem.item)
                                        }
                                        className="text-xs font-bold text-red-700 hover:underline"
                                      >
                                        Xóa hẳn
                                      </button>
                                    )}
                                  </td>
                                )}
                              </tr>
                            ) : (
                              <tr
                                key={`expense-${cashItem.item.id}`}
                                className="border-t border-[#f2eadc] bg-[#fffdf9]"
                              >
                                <td className="px-5 py-4">
                                  <span className="rounded-full bg-[#fff2dc] px-2.5 py-1 text-xs font-bold text-[#9a6a22]">
                                    Chi
                                  </span>
                                </td>
                                <td className="px-5 py-4 font-semibold">
                                  {cashItem.item.description}
                                </td>
                                <td className="px-5 py-4 text-[#806c42]">
                                  {
                                    expenseCategoryLabels[
                                      cashItem.item.category
                                    ]
                                  }
                                </td>
                                <td className="px-5 py-4 text-[#806c42]">—</td>
                                <td className="px-5 py-4 font-semibold text-[#a04c4c]">
                                  −{formatVnd(cashItem.item.amount)}
                                </td>
                                <td className="px-5 py-4">
                                  <span
                                    className={`rounded-full px-2.5 py-1 text-xs font-bold ${cashItem.item.status === "void" ? "bg-red-50 text-red-700" : "bg-[#fff2dc] text-[#9a6a22]"}`}
                                  >
                                    {cashItem.item.status === "void"
                                      ? "Đã hủy"
                                      : "Hoàn tất"}
                                  </span>
                                </td>
                                {profile.role === "owner" && (
                                  <td className="px-5 py-4">
                                    {cashItem.item.status === "completed" ? (
                                      <div className="flex items-center gap-3 whitespace-nowrap">
                                        <button
                                          type="button"
                                          onClick={() =>
                                            openExpenseEditor(cashItem.item)
                                          }
                                          className="text-xs font-bold text-[#50713c] hover:underline"
                                        >
                                          Chỉnh sửa
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() =>
                                            void voidExpense(cashItem.item.id)
                                          }
                                          className="text-xs font-bold text-[#a04c4c] hover:underline"
                                        >
                                          Hủy khoản chi
                                        </button>
                                      </div>
                                    ) : (
                                      <button
                                        type="button"
                                        onClick={() =>
                                          void deleteExpense(cashItem.item)
                                        }
                                        className="text-xs font-bold text-red-700 hover:underline"
                                      >
                                        Xóa hẳn
                                      </button>
                                    )}
                                  </td>
                                )}
                              </tr>
                            ),
                          )}
                      </Fragment>
                    );
                  })}
                  {visibleDays.length === 0 && (
                    <tr>
                      <td
                        colSpan={profile.role === "owner" ? 7 : 6}
                        className="px-5 py-6 text-center text-[#71816c]"
                      >
                        Không có dòng phù hợp bộ lọc.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between border-t border-[#e2ebde] px-5 py-3 text-sm">
              <span className="text-[#71816c]">
                Trang {currentDayPage} / {dayPageCount}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    setDayPage((current) => Math.max(1, current - 1))
                  }
                  disabled={currentDayPage <= 1}
                  className="rounded-lg border border-[#cddac6] px-3 py-1.5 font-semibold text-[#48643a] disabled:opacity-40"
                >
                  Trước
                </button>
                <button
                  onClick={() =>
                    setDayPage((current) => Math.min(dayPageCount, current + 1))
                  }
                  disabled={currentDayPage >= dayPageCount}
                  className="rounded-lg border border-[#cddac6] px-3 py-1.5 font-semibold text-[#48643a] disabled:opacity-40"
                >
                  Sau
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {profile.role === "owner" && editingEntry && editEntryForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#172015]/55 p-4 backdrop-blur-sm">
          <div className="mx-auto my-6 w-full max-w-4xl rounded-2xl bg-white p-5 shadow-2xl sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#6f9556]">
                  Chủ spa
                </p>
                <h2 className="mt-1 font-serif text-3xl text-[#24361e]">
                  Chỉnh sửa doanh thu
                </h2>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingEntry(null);
                  setEditEntryForm(null);
                  setMessage("");
                }}
                className="rounded-lg px-3 py-2 text-sm font-bold text-[#66745f] hover:bg-[#edf4e8]"
              >
                Đóng
              </button>
            </div>
            <p className="mt-3 rounded-xl border border-[#d8e4d2] bg-[#f5f9f2] px-4 py-3 text-sm leading-6 text-[#52664b]">
              Sửa tên khách hoặc ghi chú sẽ giữ nguyên hoa hồng. Nếu đổi ngày,
              dịch vụ, giá, KTV hoặc tư vấn, hoa hồng chờ chốt sẽ được tính lại
              tự động. Dòng đã chốt lương hoặc đã trả sẽ bị hệ thống từ chối.
            </p>
            <form onSubmit={saveEntryEdit} className="mt-5">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <label className="text-sm font-semibold text-[#40533b]">
                  Ngày thực hiện
                  <input
                    required
                    type="date"
                    value={editEntryForm.service_date}
                    onChange={(event) =>
                      setEditEntryForm({
                        ...editEntryForm,
                        service_date: event.target.value,
                      })
                    }
                    className="field"
                  />
                </label>
                <label className="text-sm font-semibold text-[#40533b]">
                  Tên khách hàng
                  <input
                    required={editEntryForm.sale_type !== "external_tour"}
                    value={editEntryForm.customer_name}
                    onChange={(event) =>
                      setEditEntryForm({
                        ...editEntryForm,
                        customer_name: event.target.value,
                      })
                    }
                    className="field"
                  />
                </label>
                <label className="text-sm font-semibold text-[#40533b]">
                  Dịch vụ
                  <select
                    required
                    value={editEntryForm.service_id}
                    onChange={(event) => selectEditService(event.target.value)}
                    className="field"
                  >
                    {services.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="text-sm font-semibold text-[#40533b]">
                  Hình thức
                  <select
                    value={editEntryForm.sale_type}
                    onChange={(event) =>
                      selectEditSaleType(event.target.value as SaleType)
                    }
                    className="field"
                  >
                    {saleTypes.map((value) => (
                      <option key={value} value={value}>
                        {saleTypeLabels[value]}
                      </option>
                    ))}
                  </select>
                </label>
                {editEntryForm.sale_type !== "external_tour" && (
                  <>
                    <label className="text-sm font-semibold text-[#40533b]">
                      Kỹ thuật viên
                      <select
                        required={editEntryForm.sale_type !== "package_sale"}
                        value={editEntryForm.technician_id}
                        onChange={(event) =>
                          setEditEntryForm({
                            ...editEntryForm,
                            technician_id: event.target.value,
                          })
                        }
                        className="field"
                      >
                        <option value="">Không có</option>
                        {people.map((person) => (
                          <option key={person.id} value={person.id}>
                            {person.display_name}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="text-sm font-semibold text-[#40533b]">
                      Người bán
                      <select
                        value={editEntryForm.consultant_id}
                        onChange={(event) =>
                          setEditEntryForm({
                            ...editEntryForm,
                            consultant_id: event.target.value,
                          })
                        }
                        className="field"
                      >
                        <option value="">Không có</option>
                        {people.map((person) => (
                          <option key={person.id} value={person.id}>
                            {person.display_name}
                          </option>
                        ))}
                      </select>
                    </label>
                  </>
                )}
                <label className="text-sm font-semibold text-[#40533b]">
                  Giá gói
                  <CurrencyInput
                    required
                    value={editEntryForm.price_snapshot}
                    onValueChange={(price_snapshot) =>
                      setEditEntryForm({
                        ...editEntryForm,
                        price_snapshot,
                      })
                    }
                    className="field"
                  />
                </label>
                <label className="text-sm font-semibold text-[#40533b]">
                  Thực thu
                  <CurrencyInput
                    required
                    value={editEntryForm.revenue_amount}
                    onValueChange={(revenue_amount) =>
                      setEditEntryForm({
                        ...editEntryForm,
                        revenue_amount,
                      })
                    }
                    className="field"
                  />
                </label>
                {editEntryForm.sale_type === "external_tour" && (
                  <label className="text-sm font-semibold text-[#40533b]">
                    Chi trả tua ngoài
                    <CurrencyInput
                      required
                      value={editEntryForm.external_payout_amount}
                      onValueChange={(external_payout_amount) =>
                        setEditEntryForm({
                          ...editEntryForm,
                          external_payout_amount,
                        })
                      }
                      className="field"
                    />
                  </label>
                )}
                <label className="text-sm font-semibold text-[#40533b] md:col-span-2">
                  Ghi chú
                  <input
                    value={editEntryForm.notes}
                    onChange={(event) =>
                      setEditEntryForm({
                        ...editEntryForm,
                        notes: event.target.value,
                      })
                    }
                    className="field"
                  />
                </label>
              </div>
              {message && (
                <p className="mt-4 rounded-xl bg-[#f7faf5] px-4 py-3 text-sm text-[#55723f]">
                  {message}
                </p>
              )}
              <div className="mt-5 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setEditingEntry(null);
                    setEditEntryForm(null);
                    setMessage("");
                  }}
                  className="rounded-xl border border-[#cad8c3] px-4 py-2.5 text-sm font-bold text-[#52664b]"
                >
                  Hủy
                </button>
                <button
                  disabled={saving}
                  className="rounded-xl bg-[#24361e] px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50"
                >
                  {saving ? "Đang lưu…" : "Lưu thay đổi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {profile.role === "owner" && editingExpense && editExpenseForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#172015]/55 p-4 backdrop-blur-sm">
          <div className="mx-auto my-12 w-full max-w-2xl rounded-2xl bg-white p-5 shadow-2xl sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#9a6a22]">
                  Chủ spa
                </p>
                <h2 className="mt-1 font-serif text-3xl text-[#493719]">
                  Chỉnh sửa khoản chi
                </h2>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingExpense(null);
                  setEditExpenseForm(null);
                  setMessage("");
                }}
                className="rounded-lg px-3 py-2 text-sm font-bold text-[#806c42] hover:bg-[#fff7e8]"
              >
                Đóng
              </button>
            </div>
            <form onSubmit={saveExpenseEdit} className="mt-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-sm font-semibold text-[#6f5b32]">
                  Ngày chi
                  <input
                    required
                    type="date"
                    value={editExpenseForm.expense_date}
                    onChange={(event) =>
                      setEditExpenseForm({
                        ...editExpenseForm,
                        expense_date: event.target.value,
                      })
                    }
                    className="field"
                  />
                </label>
                <label className="text-sm font-semibold text-[#6f5b32]">
                  Nhóm chi
                  <select
                    value={editExpenseForm.category}
                    onChange={(event) =>
                      setEditExpenseForm({
                        ...editExpenseForm,
                        category: event.target.value as ExpenseCategory,
                      })
                    }
                    className="field"
                  >
                    {expenseCategories.map((category) => (
                      <option key={category} value={category}>
                        {expenseCategoryLabels[category]}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="text-sm font-semibold text-[#6f5b32] sm:col-span-2">
                  Nội dung
                  <input
                    required
                    value={editExpenseForm.description}
                    onChange={(event) =>
                      setEditExpenseForm({
                        ...editExpenseForm,
                        description: event.target.value,
                      })
                    }
                    className="field"
                  />
                </label>
                <label className="text-sm font-semibold text-[#6f5b32]">
                  Số tiền chi
                  <CurrencyInput
                    required
                    value={editExpenseForm.amount}
                    onValueChange={(amount) =>
                      setEditExpenseForm({
                        ...editExpenseForm,
                        amount,
                      })
                    }
                    className="field"
                  />
                </label>
                <label className="text-sm font-semibold text-[#6f5b32] sm:col-span-2">
                  Ghi chú
                  <input
                    value={editExpenseForm.notes}
                    onChange={(event) =>
                      setEditExpenseForm({
                        ...editExpenseForm,
                        notes: event.target.value,
                      })
                    }
                    className="field"
                  />
                </label>
              </div>
              {message && (
                <p className="mt-4 rounded-xl bg-[#fff8e9] px-4 py-3 text-sm text-[#806c42]">
                  {message}
                </p>
              )}
              <div className="mt-5 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setEditingExpense(null);
                    setEditExpenseForm(null);
                    setMessage("");
                  }}
                  className="rounded-xl border border-[#e1d3ae] px-4 py-2.5 text-sm font-bold text-[#806c42]"
                >
                  Hủy
                </button>
                <button
                  disabled={saving}
                  className="rounded-xl bg-[#9a6a22] px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50"
                >
                  {saving ? "Đang lưu…" : "Lưu thay đổi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
