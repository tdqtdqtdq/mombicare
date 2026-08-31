"use client";

import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "@/app/lib/supabase/client";
import { downloadExcel } from "../../excel";
import {
  commissionTargetLabels,
  saleTypeLabels,
  type CommissionLedger,
  type CommissionTarget,
  type PayrollPeriod,
  type Profile,
  type RevenueEntry,
} from "../../types";
import { currentMonth, formatVnd, monthBounds } from "../../utils";

const rowsPerPage = 10;
type ExternalTourEntry = Pick<
  RevenueEntry,
  | "id"
  | "service_date"
  | "customer_name"
  | "service_name_snapshot"
  | "revenue_amount"
  | "external_payout_amount"
  | "status"
>;

function groupByDate<T extends { service_date: string }>(items: T[]) {
  const groups = new Map<string, T[]>();
  items.forEach((item) =>
    groups.set(item.service_date, [
      ...(groups.get(item.service_date) ?? []),
      item,
    ]),
  );
  return [...groups.entries()].map(([date, rows]) => ({ date, rows }));
}

function csvCell(value: string | number) {
  return `"${String(value).replaceAll('"', '""')}"`;
}

function employeeTotals(items: CommissionLedger[]) {
  const map = new Map<
    string,
    { id: string; name: string; total: number; pending: number }
  >();
  items.forEach((item) => {
    const previous = map.get(item.employee_id) ?? {
      id: item.employee_id,
      name: item.employee?.display_name ?? "Nhân viên",
      total: 0,
      pending: 0,
    };
    previous.total += Number(item.amount);
    if (item.status === "pending") previous.pending += Number(item.amount);
    map.set(item.employee_id, previous);
  });
  return [...map.values()].sort((a, b) => b.total - a.total);
}

function statusLabel(status: CommissionLedger["status"]) {
  return status === "paid"
    ? "Đã chi"
    : status === "locked"
      ? "Đã chốt"
      : "Chờ chốt";
}

function CommissionTable({
  title,
  description,
  target,
  rows,
  total,
  rowCount,
  employees,
  selectedEmployee,
  onEmployeeChange,
  page,
  pageCount,
  onPrevious,
  onNext,
}: {
  title: string;
  description: string;
  target: CommissionTarget;
  rows: CommissionLedger[];
  total: number;
  rowCount: number;
  employees: ReturnType<typeof employeeTotals>;
  selectedEmployee: string;
  onEmployeeChange: (value: string) => void;
  page: number;
  pageCount: number;
  onPrevious: () => void;
  onNext: () => void;
}) {
  const [openDays, setOpenDays] = useState<Record<string, boolean>>({});
  const isDayOpen = (serviceDate: string) =>
    openDays[serviceDate] ?? serviceDate === rows[0]?.service_date;

  return (
    <article className="overflow-hidden rounded-2xl border border-[#d8e4d2] bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-[#e5ede1] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-serif text-2xl">{title}</h2>
          <p className="mt-1 text-sm text-[#71816c]">
            {description} · {rowCount} dòng
          </p>
        </div>
        <p className="text-sm font-bold text-[#48643a]">{formatVnd(total)}</p>
      </div>
      <div className="border-b border-[#e5ede1] bg-[#fbfdf9] px-5 py-3">
        <label className="text-xs font-bold uppercase tracking-wide text-[#71816c]">
          Nhân viên
          <select
            value={selectedEmployee}
            onChange={(event) => onEmployeeChange(event.target.value)}
            className="field mt-1 max-w-xs py-2 text-sm"
          >
            <option value="">
              Tất cả {target === "technician" ? "KTV" : "tư vấn"}
            </option>
            {employees.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[680px] text-left text-sm">
          <thead className="bg-[#f5f8f2] text-xs uppercase tracking-wide text-[#71816c]">
            <tr>
              <th className="hidden px-5 py-3">Ngày</th>
              <th className="px-5 py-3">Nhân viên</th>
              <th className="px-5 py-3">Dịch vụ</th>
              <th className="px-5 py-3">Mức chi</th>
              <th className="px-5 py-3">Hoa hồng</th>
              <th className="px-5 py-3">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((item, index) => (
              <Fragment key={item.id}>
                {(index === 0 ||
                  rows[index - 1].service_date !== item.service_date) && (
                  <tr className="border-t border-[#d8e4d2] bg-[#f6f9f3]">
                    <td colSpan={6} className="px-5 py-2">
                      <button
                        type="button"
                        onClick={() =>
                          setOpenDays((current) => ({
                            ...current,
                            [item.service_date]: !isDayOpen(item.service_date),
                          }))
                        }
                        className="flex w-full items-center gap-3 text-left text-sm font-bold text-[#40533b]"
                      >
                        <span className="text-lg leading-none">
                          {isDayOpen(item.service_date) ? "⌄" : "›"}
                        </span>
                        <span>Ngày {item.service_date}</span>
                        <span className="text-xs font-semibold text-[#71816c]">
                          Tổng ngày:{" "}
                          {formatVnd(
                            rows
                              .filter(
                                (row) => row.service_date === item.service_date,
                              )
                              .reduce(
                                (sum, row) => sum + Number(row.amount),
                                0,
                              ),
                          )}
                        </span>
                      </button>
                    </td>
                  </tr>
                )}
                <tr
                  className={`border-t border-[#edf1ea] ${isDayOpen(item.service_date) ? "" : "hidden"}`}
                >
                  <td className="hidden px-5 py-4">{item.service_date}</td>
                  <td className="px-5 py-4 font-semibold">
                    {item.employee?.display_name ?? "—"}
                  </td>
                  <td className="px-5 py-4">
                    <p>{item.service_name_snapshot}</p>
                    {item.entry?.sale_type && (
                      <p
                        className={`mt-0.5 text-xs ${item.entry.sale_type === "external_tour" ? "font-bold text-[#9a6a22]" : "text-[#71816c]"}`}
                      >
                        {saleTypeLabels[item.entry.sale_type]}
                      </p>
                    )}
                  </td>
                  <td className="px-5 py-4 text-[#62725b]">
                    {item.rate_type === "percentage"
                      ? `${item.rate_value}%`
                      : formatVnd(item.rate_value)}
                  </td>
                  <td className="px-5 py-4 font-semibold">
                    {formatVnd(item.amount)}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-bold ${item.status === "paid" ? "bg-[#edf4e8] text-[#4c6f38]" : item.status === "locked" ? "bg-[#f5ede1] text-[#86632e]" : "bg-[#eff3ed] text-[#64745d]"}`}
                    >
                      {statusLabel(item.status)}
                    </span>
                  </td>
                </tr>
              </Fragment>
            ))}
            {rows.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-5 py-6 text-center text-[#71816c]"
                >
                  Chưa có hoa hồng{" "}
                  {commissionTargetLabels[target].toLocaleLowerCase("vi")} phù
                  hợp.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between border-t border-[#e5ede1] px-5 py-3 text-sm">
        <span className="text-[#71816c]">
          Trang {page} / {pageCount}
        </span>
        <div className="flex gap-2">
          <button
            onClick={onPrevious}
            disabled={page <= 1}
            className="rounded-lg border border-[#cddac6] px-3 py-1.5 font-semibold text-[#48643a] disabled:opacity-40"
          >
            Trước
          </button>
          <button
            onClick={onNext}
            disabled={page >= pageCount}
            className="rounded-lg border border-[#cddac6] px-3 py-1.5 font-semibold text-[#48643a] disabled:opacity-40"
          >
            Sau
          </button>
        </div>
      </div>
    </article>
  );
}

function ExternalTourTable({
  rows,
  totalRevenue,
  totalPayout,
  page,
  pageCount,
  onPrevious,
  onNext,
}: {
  rows: ExternalTourEntry[];
  totalRevenue: number;
  totalPayout: number;
  page: number;
  pageCount: number;
  onPrevious: () => void;
  onNext: () => void;
}) {
  const [openDays, setOpenDays] = useState<Record<string, boolean>>({});
  const isDayOpen = (serviceDate: string) =>
    openDays[serviceDate] ?? serviceDate === rows[0]?.service_date;

  return (
    <article className="overflow-hidden rounded-2xl border border-[#e4d6b7] bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-[#eee2ca] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-serif text-2xl">Đối soát trả tua ngoài</h2>
          <p className="mt-1 text-sm text-[#806c42]">
            Khoản chi độc lập, không gán và không cộng vào hoa hồng/lương nhân
            viên.
          </p>
        </div>
        <div className="text-sm sm:text-right">
          <p className="font-bold text-[#86632e]">
            Thu: {formatVnd(totalRevenue)}
          </p>
          <p className="mt-1 font-bold text-[#86632e]">
            Chi ngoài: {formatVnd(totalPayout)}
          </p>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-[#fffaf0] text-xs uppercase tracking-wide text-[#806c42]">
            <tr>
              <th className="hidden px-5 py-3">Ngày</th>
              <th className="px-5 py-3">Khách hàng</th>
              <th className="px-5 py-3">Dịch vụ</th>
              <th className="px-5 py-3">Thực thu</th>
              <th className="px-5 py-3">Chi tua ngoài</th>
              <th className="px-5 py-3">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((item, index) => (
              <Fragment key={item.id}>
                {(index === 0 ||
                  rows[index - 1].service_date !== item.service_date) && (
                  <tr
                    onClick={() =>
                      setOpenDays((current) => ({
                        ...current,
                        [item.service_date]: !isDayOpen(item.service_date),
                      }))
                    }
                    className="cursor-pointer border-t border-[#e4d6b7] bg-[#fffaf0] hover:bg-[#fff5df]"
                  >
                    <td
                      colSpan={6}
                      className="px-5 py-3 text-sm font-bold text-[#624c23]"
                    >
                      <span className="mr-2 text-lg leading-none">
                        {isDayOpen(item.service_date) ? "⌄" : "›"}
                      </span>
                      Ngày {item.service_date}
                      <span className="ml-3 text-xs font-semibold text-[#806c42]">
                        Thu:{" "}
                        {formatVnd(
                          rows
                            .filter(
                              (row) => row.service_date === item.service_date,
                            )
                            .reduce(
                              (sum, row) => sum + Number(row.revenue_amount),
                              0,
                            ),
                        )}{" "}
                        · Chi:{" "}
                        {formatVnd(
                          rows
                            .filter(
                              (row) => row.service_date === item.service_date,
                            )
                            .reduce(
                              (sum, row) =>
                                sum + Number(row.external_payout_amount),
                              0,
                            ),
                        )}
                      </span>
                    </td>
                  </tr>
                )}
                <tr
                  className={`border-t border-[#f2eadc] ${isDayOpen(item.service_date) ? "" : "hidden"}`}
                >
                  <td className="hidden px-5 py-4">{item.service_date}</td>
                  <td className="px-5 py-4 font-semibold">
                    {item.customer_name}
                  </td>
                  <td className="px-5 py-4">{item.service_name_snapshot}</td>
                  <td className="px-5 py-4 font-semibold">
                    {formatVnd(item.revenue_amount)}
                  </td>
                  <td className="px-5 py-4 font-semibold text-[#86632e]">
                    {formatVnd(item.external_payout_amount)}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-bold ${item.status === "void" ? "bg-red-50 text-red-700" : "bg-[#fff5df] text-[#86632e]"}`}
                    >
                      {item.status === "void" ? "Đã hủy" : "Hoàn tất"}
                    </span>
                  </td>
                </tr>
              </Fragment>
            ))}
            {rows.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-5 py-6 text-center text-[#806c42]"
                >
                  Chưa có khoản trả tua ngoài trong tháng này.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between border-t border-[#eee2ca] px-5 py-3 text-sm">
        <span className="text-[#806c42]">
          Trang {page} / {pageCount}
        </span>
        <div className="flex gap-2">
          <button
            onClick={onPrevious}
            disabled={page <= 1}
            className="rounded-lg border border-[#e4d6b7] px-3 py-1.5 font-semibold text-[#86632e] disabled:opacity-40"
          >
            Trước
          </button>
          <button
            onClick={onNext}
            disabled={page >= pageCount}
            className="rounded-lg border border-[#e4d6b7] px-3 py-1.5 font-semibold text-[#86632e] disabled:opacity-40"
          >
            Sau
          </button>
        </div>
      </div>
    </article>
  );
}

export function CommissionReport({ profile }: { profile: Profile }) {
  const [month, setMonth] = useState(currentMonth());
  const [ledgers, setLedgers] = useState<CommissionLedger[]>([]);
  const [externalTours, setExternalTours] = useState<ExternalTourEntry[]>([]);
  const [periods, setPeriods] = useState<PayrollPeriod[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusFilter, setStatusFilter] = useState<
    CommissionLedger["status"] | ""
  >("");
  const [dateFrom, setDateFrom] = useState(
    () => monthBounds(currentMonth()).from,
  );
  const [dateTo, setDateTo] = useState(() => monthBounds(currentMonth()).to);
  const [technicianEmployee, setTechnicianEmployee] = useState("");
  const [consultantEmployee, setConsultantEmployee] = useState("");
  const [technicianPage, setTechnicianPage] = useState(1);
  const [consultantPage, setConsultantPage] = useState(1);
  const [externalTourPage, setExternalTourPage] = useState(1);

  const bounds = useMemo(() => monthBounds(month), [month]);
  const currentPeriod = periods.find(
    (period) =>
      period.starts_on === bounds.from && period.ends_on === bounds.to,
  );

  const load = useCallback(async () => {
    setLoading(true);
    setMessage("");
    const supabase = createClient();
    const [ledgerResult, externalResult] = await Promise.all([
      supabase
        .from("commission_ledger")
        .select(
          "id, revenue_entry_id, employee_id, target, amount, rate_type, rate_value, service_name_snapshot, service_date, status, employee:profiles!commission_ledger_employee_id_fkey(display_name), entry:revenue_entries!commission_ledger_revenue_entry_id_fkey(sale_type, customer_name)",
        )
        .gte("service_date", bounds.from)
        .lte("service_date", bounds.to)
        .order("service_date", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(500),
      supabase
        .from("revenue_entries")
        .select(
          "id, service_date, customer_name, service_name_snapshot, revenue_amount, external_payout_amount, status",
        )
        .eq("sale_type", "external_tour")
        .gte("service_date", bounds.from)
        .lte("service_date", bounds.to)
        .order("service_date", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(500),
    ]);
    if (ledgerResult.error || externalResult.error)
      setMessage(
        "Không tải được hoa hồng hoặc tua ngoài. Hãy kiểm tra migration và quyền tài khoản.",
      );
    else {
      setLedgers((ledgerResult.data ?? []) as unknown as CommissionLedger[]);
      setExternalTours((externalResult.data ?? []) as ExternalTourEntry[]);
    }

    if (profile.role === "owner") {
      const periodResult = await supabase
        .from("payroll_periods")
        .select("id, label, starts_on, ends_on, status, locked_at")
        .order("starts_on", { ascending: false })
        .limit(24);
      if (periodResult.error) setMessage("Không tải được lịch sử chốt kỳ.");
      else setPeriods((periodResult.data ?? []) as PayrollPeriod[]);
    }
    setLoading(false);
  }, [bounds.from, bounds.to, profile.role]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void load();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  const technicianLedgers = useMemo(
    () =>
      ledgers.filter(
        (item) =>
          item.target === "technician" &&
          (!statusFilter || item.status === statusFilter),
      ),
    [ledgers, statusFilter],
  );
  const consultantLedgers = useMemo(
    () =>
      ledgers.filter(
        (item) =>
          item.target === "consultant" &&
          (!statusFilter || item.status === statusFilter),
      ),
    [ledgers, statusFilter],
  );
  const technicianGroups = useMemo(
    () => employeeTotals(technicianLedgers),
    [technicianLedgers],
  );
  const consultantGroups = useMemo(
    () => employeeTotals(consultantLedgers),
    [consultantLedgers],
  );
  const filteredTechnicianLedgers = technicianLedgers.filter(
    (item) => !technicianEmployee || item.employee_id === technicianEmployee,
  );
  const filteredConsultantLedgers = consultantLedgers.filter(
    (item) => !consultantEmployee || item.employee_id === consultantEmployee,
  );
  const technicianDayGroups = useMemo(
    () => groupByDate(filteredTechnicianLedgers),
    [filteredTechnicianLedgers],
  );
  const consultantDayGroups = useMemo(
    () => groupByDate(filteredConsultantLedgers),
    [filteredConsultantLedgers],
  );
  const technicianPageCount = Math.max(
    1,
    Math.ceil(technicianDayGroups.length / rowsPerPage),
  );
  const consultantPageCount = Math.max(
    1,
    Math.ceil(consultantDayGroups.length / rowsPerPage),
  );
  const currentTechnicianPage = Math.min(technicianPage, technicianPageCount);
  const currentConsultantPage = Math.min(consultantPage, consultantPageCount);
  const visibleTechnicianLedgers = technicianDayGroups
    .slice(
      (currentTechnicianPage - 1) * rowsPerPage,
      currentTechnicianPage * rowsPerPage,
    )
    .flatMap((group) => group.rows);
  const visibleConsultantLedgers = consultantDayGroups
    .slice(
      (currentConsultantPage - 1) * rowsPerPage,
      currentConsultantPage * rowsPerPage,
    )
    .flatMap((group) => group.rows);
  const technicianTotal = technicianLedgers.reduce(
    (sum, item) => sum + Number(item.amount),
    0,
  );
  const consultantTotal = consultantLedgers.reduce(
    (sum, item) => sum + Number(item.amount),
    0,
  );
  const completedExternalTours = externalTours.filter(
    (item) => item.status === "completed",
  );
  const externalTourRevenue = completedExternalTours.reduce(
    (sum, item) => sum + Number(item.revenue_amount),
    0,
  );
  const externalTourPayout = completedExternalTours.reduce(
    (sum, item) => sum + Number(item.external_payout_amount),
    0,
  );
  const externalTourDayGroups = useMemo(
    () => groupByDate(externalTours),
    [externalTours],
  );
  const externalTourPageCount = Math.max(
    1,
    Math.ceil(externalTourDayGroups.length / rowsPerPage),
  );
  const currentExternalTourPage = Math.min(
    externalTourPage,
    externalTourPageCount,
  );
  const visibleExternalTours = externalTourDayGroups
    .slice(
      (currentExternalTourPage - 1) * rowsPerPage,
      currentExternalTourPage * rowsPerPage,
    )
    .flatMap((group) => group.rows);

  async function lockPeriod() {
    if (
      !window.confirm(
        `Chốt hoa hồng tháng ${month}? Sau khi chốt, các dòng doanh thu trong kỳ sẽ không sửa được.`,
      )
    )
      return;
    setSaving(true);
    setMessage("");
    const { error } = await createClient().rpc("lock_payroll_period", {
      p_label: `Tháng ${month}`,
      p_starts_on: bounds.from,
      p_ends_on: bounds.to,
    });
    setMessage(
      error
        ? `Chưa thể chốt kỳ: ${error.message}`
        : "Đã chốt kỳ lương. Doanh thu và hoa hồng trong kỳ được khóa để đối soát.",
    );
    if (!error) await load();
    setSaving(false);
  }

  async function markPaid() {
    if (
      !currentPeriod ||
      !window.confirm("Xác nhận spa đã chi hoa hồng cho kỳ này?")
    )
      return;
    setSaving(true);
    setMessage("");
    const { error } = await createClient().rpc("mark_payroll_period_paid", {
      p_payroll_period_id: currentPeriod.id,
    });
    setMessage(
      error
        ? `Chưa thể xác nhận: ${error.message}`
        : "Đã đánh dấu kỳ lương là đã chi.",
    );
    if (!error) await load();
    setSaving(false);
  }

  function exportExcel() {
    downloadExcel({
      filename: `hoa-hong-${month}.xlsx`,
      sheetName: "Hoa hồng",
      title: `BẢNG HOA HỒNG THÁNG ${month}`,
      columns: [
        "Nhân viên",
        "Ngày",
        "Dịch vụ",
        "Hình thức",
        "Vai trò",
        "Hoa hồng / chi",
        "Trạng thái",
      ],
      rows: [
        ...ledgers.map((item) => [
          item.employee?.display_name ?? "Nhân viên",
          item.service_date,
          item.service_name_snapshot,
          item.entry?.sale_type ? saleTypeLabels[item.entry.sale_type] : "",
          commissionTargetLabels[item.target],
          Number(item.amount),
          statusLabel(item.status),
        ]),
        ...completedExternalTours.map((item) => [
          "Tua ngoài",
          item.service_date,
          item.service_name_snapshot,
          "Trả tua ngoài",
          "Chi ngoài",
          Number(item.external_payout_amount),
          "Hoàn tất",
        ]),
      ],
      amountColumns: [5],
      summary: [
        ["Tổng KTV", technicianTotal],
        ["Tổng tư vấn", consultantTotal],
        ["Chi tua ngoài", externalTourPayout],
        ["Tổng cần chi nhân viên", technicianTotal + consultantTotal],
      ],
    });
  }

  function exportCsv() {
    const rows = [
      [
        "Nhân viên",
        "Ngày",
        "Dịch vụ",
        "Hình thức",
        "Vai trò",
        "Hoa hồng / chi",
        "Trạng thái",
      ],
      ...ledgers.map((item) => [
        item.employee?.display_name ?? "Nhân viên",
        item.service_date,
        item.service_name_snapshot,
        item.entry?.sale_type ? saleTypeLabels[item.entry.sale_type] : "",
        commissionTargetLabels[item.target],
        Number(item.amount),
        statusLabel(item.status),
      ]),
      ...completedExternalTours.map((item) => [
        "Tua ngoài",
        item.service_date,
        item.service_name_snapshot,
        "Trả tua ngoài",
        "Chi ngoài",
        Number(item.external_payout_amount),
        "Hoàn tất",
      ]),
    ];
    const content = `\uFEFFsep=;\r\n${rows.map((row) => row.map(csvCell).join(";")).join("\r\n")}`;
    const blob = new Blob([content], { type: "text/csv;charset=utf-8" });
    const href = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = href;
    link.download = `hoa-hong-${month}.csv`;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(href), 1000);
  }

  return (
    <section>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#6f9556]">
            Đối soát cuối tháng
          </p>
          <h1 className="mt-1 font-serif text-4xl text-[#1c2619]">
            Hoa hồng & lương
          </h1>
          <p className="mt-2 text-sm text-[#66745f]">
            Tách riêng tiền kỹ thuật, tư vấn và khoản trả tua ngoài để đối soát
            từng nhóm rõ ràng.
          </p>
        </div>
        <label className="text-sm font-semibold text-[#52664b]">
          Tháng xem
          <input
            type="month"
            value={month}
            onChange={(event) => {
              const nextMonth = event.target.value;
              setMonth(nextMonth);
              setTechnicianPage(1);
              setConsultantPage(1);
              setExternalTourPage(1);
            }}
            className="ml-3 rounded-xl border border-[#cddac6] bg-white px-3 py-2 outline-none focus:border-[#6f9556]"
          />
        </label>
      </div>
      <div className="hidden">
        <label className="text-xs font-bold uppercase tracking-wide text-[#71816c]">
          Từ ngày
          <input
            type="date"
            value={dateFrom}
            max={dateTo || undefined}
            onChange={(event) => {
              setDateFrom(event.target.value);
              setTechnicianPage(1);
              setConsultantPage(1);
              setExternalTourPage(1);
            }}
            className="field mt-1 py-2 text-sm"
          />
        </label>
        <label className="text-xs font-bold uppercase tracking-wide text-[#71816c]">
          Đến ngày
          <input
            type="date"
            value={dateTo}
            min={dateFrom || undefined}
            onChange={(event) => {
              setDateTo(event.target.value);
              setTechnicianPage(1);
              setConsultantPage(1);
              setExternalTourPage(1);
            }}
            className="field mt-1 py-2 text-sm"
          />
        </label>
        <button
          type="button"
          onClick={() => {
            setDateFrom(bounds.from);
            setDateTo(bounds.to);
            setTechnicianPage(1);
            setConsultantPage(1);
            setExternalTourPage(1);
          }}
          className="mb-0.5 rounded-xl border border-[#cddac6] px-4 py-2 text-sm font-bold text-[#48643a]"
        >
          Cả tháng
        </button>
        <p className="pb-2 text-sm text-[#71816c]">
          Bộ lọc áp dụng cho tổng tiền, bảng chi tiết và file xuất.
        </p>
      </div>
      {message && (
        <p
          role="status"
          className="mt-5 rounded-xl bg-[#edf4e8] px-4 py-3 text-sm text-[#496b35]"
        >
          {message}
        </p>
      )}
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-2xl bg-[#24361e] p-6 text-white shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/65">
            Tổng kỹ thuật
          </p>
          <p className="mt-3 font-serif text-4xl">
            {loading ? "…" : formatVnd(technicianTotal)}
          </p>
          <p className="mt-2 text-sm text-white/65">
            {technicianLedgers.length} dòng KTV
          </p>
        </article>
        <article className="rounded-2xl border border-[#e4d6b7] bg-[#fffaf0] p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#86632e]">
            Chi tua ngoài
          </p>
          <p className="mt-3 font-serif text-4xl text-[#624c23]">
            {loading ? "…" : formatVnd(externalTourPayout)}
          </p>
          <p className="mt-2 text-sm text-[#806c42]">
            Riêng, không cộng lương KTV
          </p>
        </article>
        <article className="rounded-2xl border border-[#d8e4d2] bg-white p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#6f9556]">
            Tổng tư vấn
          </p>
          <p className="mt-3 font-serif text-4xl text-[#1c2619]">
            {loading ? "…" : formatVnd(consultantTotal)}
          </p>
          <p className="mt-2 text-sm text-[#71816c]">
            {consultantLedgers.length} dòng tư vấn
          </p>
        </article>
        <article className="rounded-2xl border border-[#d8e4d2] bg-white p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#6f9556]">
            Tổng cần chi nhân viên
          </p>
          <p className="mt-3 font-serif text-4xl text-[#1c2619]">
            {loading ? "…" : formatVnd(technicianTotal + consultantTotal)}
          </p>
          <p className="mt-2 text-sm text-[#71816c]">Không gồm chi tua ngoài</p>
        </article>
      </div>
      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <article className="rounded-2xl border border-[#d8e4d2] bg-white p-5 shadow-sm">
          <h2 className="font-serif text-2xl">Theo KTV</h2>
          <div className="mt-3 divide-y divide-[#edf1ea]">
            {technicianGroups.map((group) => (
              <div
                key={group.id}
                className="flex items-center justify-between gap-4 py-2"
              >
                <div>
                  <p className="font-semibold">{group.name}</p>
                  {group.pending > 0 && (
                    <p className="text-xs text-[#72816b]">
                      Chờ chốt: {formatVnd(group.pending)}
                    </p>
                  )}
                </div>
                <p className="font-semibold">{formatVnd(group.total)}</p>
              </div>
            ))}
            {!loading && technicianGroups.length === 0 && (
              <p className="py-3 text-sm text-[#71816c]">
                Chưa có hoa hồng kỹ thuật.
              </p>
            )}
          </div>
        </article>
        <article className="rounded-2xl border border-[#d8e4d2] bg-white p-5 shadow-sm">
          <h2 className="font-serif text-2xl">Theo tư vấn</h2>
          <div className="mt-3 divide-y divide-[#edf1ea]">
            {consultantGroups.map((group) => (
              <div
                key={group.id}
                className="flex items-center justify-between gap-4 py-2"
              >
                <div>
                  <p className="font-semibold">{group.name}</p>
                  {group.pending > 0 && (
                    <p className="text-xs text-[#72816b]">
                      Chờ chốt: {formatVnd(group.pending)}
                    </p>
                  )}
                </div>
                <p className="font-semibold">{formatVnd(group.total)}</p>
              </div>
            ))}
            {!loading && consultantGroups.length === 0 && (
              <p className="py-3 text-sm text-[#71816c]">
                Chưa có hoa hồng tư vấn.
              </p>
            )}
          </div>
        </article>
      </div>
      <div className="mt-6 flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={exportExcel}
            disabled={ledgers.length === 0}
            className="rounded-xl border border-[#b9cfad] bg-white px-4 py-3 text-sm font-bold text-[#48643a] disabled:opacity-40"
          >
            Xuất Excel
          </button>
          {profile.role === "owner" && !currentPeriod && (
            <button
              onClick={() => void lockPeriod()}
              disabled={saving}
              className="rounded-xl bg-[#6f9556] px-4 py-3 text-sm font-bold text-white disabled:opacity-50"
            >
              {saving ? "Đang chốt…" : "Chốt kỳ lương"}
            </button>
          )}
          {profile.role === "owner" && currentPeriod?.status === "locked" && (
            <button
              onClick={() => void markPaid()}
              disabled={saving}
              className="rounded-xl bg-[#24361e] px-4 py-3 text-sm font-bold text-white disabled:opacity-50"
            >
              {saving ? "Đang lưu…" : "Đánh dấu đã chi"}
            </button>
          )}
        </div>
        <label className="text-xs font-bold uppercase tracking-wide text-[#71816c]">
          Trạng thái
          <select
            value={statusFilter}
            onChange={(event) => {
              setStatusFilter(
                event.target.value as CommissionLedger["status"] | "",
              );
              setTechnicianPage(1);
              setConsultantPage(1);
            }}
            className="field mt-1 py-2 text-sm"
          >
            <option value="">Tất cả</option>
            <option value="pending">Chờ chốt</option>
            <option value="locked">Đã chốt</option>
            <option value="paid">Đã chi</option>
          </select>
        </label>
      </div>
      {currentPeriod && (
        <p
          className={`mt-4 inline-flex rounded-xl px-4 py-3 text-sm font-bold ${currentPeriod.status === "paid" ? "bg-[#edf4e8] text-[#4c6f38]" : "bg-[#f5ede1] text-[#86632e]"}`}
        >
          {currentPeriod.status === "paid"
            ? "Kỳ đã chi hoa hồng"
            : "Kỳ đã chốt"}
        </p>
      )}
      {loading ? (
        <p className="mt-7 text-sm text-[#71816c]">Đang tải…</p>
      ) : (
        <>
          <div className="mt-7 grid gap-6">
            <CommissionTable
              title="Hoa hồng kỹ thuật"
              description="Tiền chi cho KTV theo từng dịch vụ đã thực hiện."
              target="technician"
              rows={visibleTechnicianLedgers}
              total={filteredTechnicianLedgers.reduce(
                (sum, item) => sum + Number(item.amount),
                0,
              )}
              rowCount={filteredTechnicianLedgers.length}
              employees={technicianGroups}
              selectedEmployee={technicianEmployee}
              onEmployeeChange={(value) => {
                setTechnicianEmployee(value);
                setTechnicianPage(1);
              }}
              page={currentTechnicianPage}
              pageCount={technicianPageCount}
              onPrevious={() =>
                setTechnicianPage((page) => Math.max(1, page - 1))
              }
              onNext={() =>
                setTechnicianPage((page) =>
                  Math.min(technicianPageCount, page + 1),
                )
              }
            />
            <CommissionTable
              title="Hoa hồng tư vấn"
              description="Tiền tư vấn tính theo tỷ lệ riêng và thực thu."
              target="consultant"
              rows={visibleConsultantLedgers}
              total={filteredConsultantLedgers.reduce(
                (sum, item) => sum + Number(item.amount),
                0,
              )}
              rowCount={filteredConsultantLedgers.length}
              employees={consultantGroups}
              selectedEmployee={consultantEmployee}
              onEmployeeChange={(value) => {
                setConsultantEmployee(value);
                setConsultantPage(1);
              }}
              page={currentConsultantPage}
              pageCount={consultantPageCount}
              onPrevious={() =>
                setConsultantPage((page) => Math.max(1, page - 1))
              }
              onNext={() =>
                setConsultantPage((page) =>
                  Math.min(consultantPageCount, page + 1),
                )
              }
            />
          </div>
          <div className="mt-6">
            <ExternalTourTable
              rows={visibleExternalTours}
              totalRevenue={externalTourRevenue}
              totalPayout={externalTourPayout}
              page={currentExternalTourPage}
              pageCount={externalTourPageCount}
              onPrevious={() =>
                setExternalTourPage((page) => Math.max(1, page - 1))
              }
              onNext={() =>
                setExternalTourPage((page) =>
                  Math.min(externalTourPageCount, page + 1),
                )
              }
            />
          </div>
        </>
      )}
    </section>
  );
}
