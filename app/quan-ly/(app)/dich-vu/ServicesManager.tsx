"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { createClient } from "@/app/lib/supabase/client";
import { CurrencyInput } from "../../components/CurrencyInput";
import { saleTypeLabels, type CommissionRateType, type CommissionRule, type CommissionTarget, type SaleType, type Service } from "../../types";
import { formatVnd } from "../../utils";

const saleTypes = Object.keys(saleTypeLabels) as SaleType[];
const today = () => new Date().toISOString().slice(0, 10);

type RuleForm = {
  service_id: string;
  target: CommissionTarget;
  recipient_profile_id: string;
  sale_type: SaleType | "";
  rate_type: CommissionRateType;
  rate_value: number;
  valid_from: string;
};

const blankRule = (): RuleForm => ({
  service_id: "",
  target: "technician",
  recipient_profile_id: "",
  sale_type: "retail",
  rate_type: "percentage",
  rate_value: 50,
  valid_from: today(),
});

type CatalogGroup = "hair" | "body" | "skin" | "night" | "other";

type EditingService = {
  id: string;
  name: string;
  defaultPrice: number;
};

const catalogGroupMeta: Record<CatalogGroup, { label: string; description: string }> = {
  hair: { label: "Gội đầu & thư giãn", description: "Gội đầu, gội dưỡng sinh và gội thảo dược" },
  body: { label: "Massage & trị liệu", description: "Massage body, vai gáy, giác hơi, ôn ấm và giải bó cơ" },
  skin: { label: "Da & liệu trình", description: "Chăm sóc da, cấy dưỡng chất và lấy nhân mụn" },
  night: { label: "Dịch vụ đêm", description: "Bảng giá và chi trả dành riêng cho ca đêm" },
  other: { label: "Dịch vụ khác", description: "Triệt và các dịch vụ chưa thuộc nhóm trên" },
};

function getCatalogGroup(serviceName: string): CatalogGroup {
  const name = serviceName.toLocaleLowerCase("vi");
  if (name.includes("(đêm)")) return "night";
  if (name.includes("gội")) return "hair";
  if (name.includes("cấy") || name.includes("chăm sóc da") || name.includes("lấy nhân") || name.includes("massage mặt")) return "skin";
  if (name.includes("massage") || name.includes("giải bó") || name.includes("giác hơi") || name.includes("ôn ấm")) return "body";
  return "other";
}

function ChevronDown({ className = "" }: { className?: string }) {
  return <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className={`h-5 w-5 shrink-0 transition-transform duration-200 ${className}`}>
    <path d="m5 7.5 5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>;
}

export function ServicesManager() {
  const [services, setServices] = useState<Service[]>([]);
  const [rules, setRules] = useState<CommissionRule[]>([]);
  const [serviceName, setServiceName] = useState("");
  const [servicePrice, setServicePrice] = useState(0);
  const [packageSaleRate, setPackageSaleRate] = useState(10);
  const [rule, setRule] = useState<RuleForm>(blankRule);
  const [editingService, setEditingService] = useState<EditingService | null>(null);
  const [editingRuleId, setEditingRuleId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const supabase = createClient();
    const [serviceResult, ruleResult] = await Promise.all([
      supabase.from("services").select("id, name, default_price, active").order("active", { ascending: false }).order("name"),
      supabase.from("commission_rules").select("id, service_id, target, recipient_profile_id, sale_type, rate_type, rate_value, valid_from, valid_to, active, service:services(name), recipient:profiles!commission_rules_recipient_profile_id_fkey(display_name)").order("active", { ascending: false }).order("valid_from", { ascending: false }),
    ]);
    if (serviceResult.error || ruleResult.error) {
      setMessage("Không tải được danh mục. Hãy kiểm tra quyền chủ spa và chạy migration SQL mới nhất.");
      return;
    }
    const nextServices = (serviceResult.data ?? []) as Service[];
    setServices(nextServices);
    const nextRules = (ruleResult.data ?? []) as unknown as CommissionRule[];
    setRules(nextRules);
    const savedPackageSaleRate = nextRules.find((item) =>
      item.target === "consultant" &&
      item.sale_type === "package_sale" &&
      !item.service_id &&
      !item.recipient_profile_id &&
      item.rate_type === "percentage" &&
      item.active,
    );
    setPackageSaleRate(Number(savedPackageSaleRate?.rate_value ?? 10));
    setRule((current) => current.service_id || !nextServices[0] ? current : { ...current, service_id: nextServices[0].id });
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => { void load(); }, 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  async function addService(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!serviceName.trim()) return;
    setSaving(true);
    setMessage("");
    const { error } = await createClient().from("services").insert({ name: serviceName.trim(), default_price: servicePrice, active: true });
    if (error) setMessage(`Chưa thể thêm dịch vụ: ${error.message}`);
    else {
      setServiceName("");
      setServicePrice(0);
      setMessage("Đã thêm dịch vụ.");
      await load();
    }
    setSaving(false);
  }

  async function savePackageSaleRate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (packageSaleRate < 0 || packageSaleRate > 100) {
      setMessage("Hoa hồng bán gói phải nằm trong khoảng 0–100%.");
      return;
    }
    const existing = rules.find((item) =>
      item.target === "consultant" &&
      item.sale_type === "package_sale" &&
      !item.service_id &&
      !item.recipient_profile_id,
    );
    setSaving(true);
    setMessage("");
    const payload = {
      service_id: null,
      target: "consultant" as const,
      recipient_profile_id: null,
      sale_type: "package_sale" as const,
      rate_type: "percentage" as const,
      rate_value: packageSaleRate,
      valid_from: today(),
      active: true,
    };
    const { error } = existing
      ? await createClient().from("commission_rules").update(payload).eq("id", existing.id)
      : await createClient().from("commission_rules").insert(payload);
    setMessage(error ? `Chưa thể lưu hoa hồng bán gói: ${error.message}` : "Đã lưu tỷ lệ hoa hồng bán gói. Tỷ lệ mới áp dụng cho các gói bán sau khi cập nhật.");
    if (!error) await load();
    setSaving(false);
  }

  async function addRule(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!rule.service_id) {
      setMessage("Quy tắc KTV cần chọn một dịch vụ.");
      return;
    }
    setSaving(true);
    setMessage("");
    const payload = {
      service_id: rule.service_id || null,
      target: "technician" as const,
      recipient_profile_id: null,
      sale_type: rule.sale_type || null,
      rate_type: rule.rate_type,
      rate_value: rule.rate_value,
      valid_from: rule.valid_from,
    };
    const { error } = editingRuleId
      ? await createClient().from("commission_rules").update(payload).eq("id", editingRuleId)
      : await createClient().from("commission_rules").insert({ ...payload, active: true });
    if (error) setMessage(`Chưa thể lưu quy tắc: ${error.message}`);
    else {
      setMessage(editingRuleId ? "Đã cập nhật quy tắc. Hoa hồng đã ghi trước đó vẫn giữ nguyên để đối soát." : "Đã lưu quy tắc. Nếu thay đổi tỷ lệ, hãy tạm ngưng quy tắc cũ cùng phạm vi để tránh chồng chéo.");
      setEditingRuleId(null);
      setRule(() => ({ ...blankRule(), service_id: services[0]?.id ?? "" }));
      await load();
    }
    setSaving(false);
  }

  async function toggleService(service: Service) {
    const { error } = await createClient().from("services").update({ active: !service.active }).eq("id", service.id);
    setMessage(error ? `Không thể cập nhật: ${error.message}` : service.active ? "Đã ngừng dùng dịch vụ." : "Đã kích hoạt lại dịch vụ.");
    if (!error) await load();
  }

  function editService(service: Service) {
    setEditingService({
      id: service.id,
      name: service.name,
      defaultPrice: Number(service.default_price),
    });
    setMessage("");
  }

  async function updateService(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editingService?.name.trim()) {
      setMessage("Tên dịch vụ không được để trống.");
      return;
    }

    setSaving(true);
    setMessage("");
    const { error } = await createClient()
      .from("services")
      .update({
        name: editingService.name.trim(),
        default_price: editingService.defaultPrice,
      })
      .eq("id", editingService.id);

    if (error) {
      setMessage(`Chưa thể cập nhật dịch vụ: ${error.message}`);
    } else {
      setEditingService(null);
      setMessage("Đã cập nhật tên và giá dịch vụ. Giá mới sẽ áp dụng cho doanh thu tạo sau thời điểm này.");
      await load();
    }
    setSaving(false);
  }

  async function deleteService(service: Service) {
    if (!window.confirm(`Xóa hẳn dịch vụ “${service.name}”? Không thể xóa nếu dịch vụ đã có doanh thu.`)) return;
    const { error } = await createClient().from("services").delete().eq("id", service.id);
    setMessage(error ? `Không thể xóa dịch vụ: ${error.message}` : "Đã xóa hẳn dịch vụ.");
    if (!error) await load();
  }

  async function toggleRule(item: CommissionRule) {
    const { error } = await createClient().from("commission_rules").update({ active: !item.active }).eq("id", item.id);
    setMessage(error ? `Không thể cập nhật: ${error.message}` : item.active ? "Đã tạm ngưng quy tắc cũ." : "Đã kích hoạt lại quy tắc.");
    if (!error) await load();
  }

  async function deleteRule(item: CommissionRule) {
    if (!window.confirm("Xóa hẳn quy tắc hoa hồng này? Dữ liệu hoa hồng đã ghi sẽ vẫn được giữ nguyên.")) return;
    const { error } = await createClient().from("commission_rules").delete().eq("id", item.id);
    setMessage(error ? `Không thể xóa quy tắc: ${error.message}` : "Đã xóa hẳn quy tắc hoa hồng.");
    if (!error) await load();
  }

  function editRule(item: CommissionRule) {
    setEditingRuleId(item.id);
    setRule({
      service_id: item.service_id ?? "",
      target: "technician",
      recipient_profile_id: "",
      sale_type: item.sale_type ?? "",
      rate_type: item.rate_type,
      rate_value: Number(item.rate_value),
      valid_from: item.valid_from,
    });
    setMessage("Đang chỉnh sửa quy tắc. Thay đổi chỉ dùng cho doanh thu ghi sau khi cập nhật.");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const serviceGroups = (Object.keys(catalogGroupMeta) as CatalogGroup[]).map((group) => ({
    id: group,
    ...catalogGroupMeta[group],
    services: services.filter((service) => getCatalogGroup(service.name) === group),
  })).filter((group) => group.services.length > 0);

  const consultantRules = rules.filter((ruleItem) => ruleItem.target === "consultant" && !(ruleItem.sale_type === "package_sale" && !ruleItem.service_id && !ruleItem.recipient_profile_id));
  const technicianRuleGroups = (Object.keys(catalogGroupMeta) as CatalogGroup[]).map((group) => {
    const groupRules = rules.filter((ruleItem) => ruleItem.target === "technician" && getCatalogGroup(ruleItem.service?.name ?? "") === group);
    const serviceRules = groupRules.reduce<Array<{ id: string; name: string; rules: CommissionRule[] }>>((result, ruleItem) => {
      const id = ruleItem.service_id ?? "all";
      const existing = result.find((item) => item.id === id);
      if (existing) existing.rules.push(ruleItem);
      else result.push({ id, name: ruleItem.service?.name ?? "Tất cả dịch vụ", rules: [ruleItem] });
      return result;
    }, []).sort((left, right) => left.name.localeCompare(right.name, "vi"));

    return {
      id: group,
      ...catalogGroupMeta[group],
      ruleCount: groupRules.length,
      serviceRules,
    };
  }).filter((group) => group.ruleCount > 0);

  return <section>
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#6f9556]">Chủ spa thiết lập</p>
      <h1 className="mt-1 font-serif text-4xl text-[#1c2619]">Dịch vụ & hoa hồng</h1>
      <p className="mt-2 text-sm text-[#66745f]">KTV nhận theo giá gói; người bán nhận theo tỷ lệ riêng của từng người và tính trên thực thu. Quy tắc mới chỉ áp dụng cho doanh thu phát sinh từ ngày hiệu lực.</p>
    </div>
    {message && <p role="status" className="mt-5 rounded-xl bg-[#edf4e8] px-4 py-3 text-sm text-[#496b35]">{message}</p>}

    <form onSubmit={savePackageSaleRate} className="mt-6 rounded-2xl border border-[#d8e4d2] bg-white p-5 shadow-sm">
      <h2 className="font-serif text-2xl">Hoa hồng bán gói</h2>
      <p className="mt-1 text-sm text-[#71816c]">Người bán nhận tỷ lệ này một lần, ngay khi tạo gói. Các buổi dùng gói chỉ tính hoa hồng dịch vụ cho KTV.</p>
      <div className="mt-4 flex flex-wrap items-end gap-3">
        <label className="text-sm font-semibold text-[#40533b]">Tỷ lệ hoa hồng (%)<input required min="0" max="100" step="0.01" type="number" value={packageSaleRate} onChange={(event) => setPackageSaleRate(Number(event.target.value))} className="field w-44" /></label>
        <button disabled={saving} className="rounded-xl bg-[#6f9556] px-5 py-3 text-sm font-bold text-white disabled:opacity-50">Lưu tỷ lệ</button>
      </div>
    </form>

    <div className="mt-6 grid gap-5 xl:grid-cols-2">
      <form onSubmit={addService} className="rounded-2xl border border-[#d8e4d2] bg-white p-5 shadow-sm">
        <h2 className="font-serif text-2xl">Thêm dịch vụ</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_11rem]">
          <label className="text-sm font-semibold text-[#40533b]">Tên dịch vụ<input required value={serviceName} onChange={(event) => setServiceName(event.target.value)} className="field" placeholder="VD: Gội đầu dưỡng sinh" /></label>
          <label className="text-sm font-semibold text-[#40533b]">Giá niêm yết<CurrencyInput required value={servicePrice} onValueChange={setServicePrice} className="field" /></label>
        </div>
        <button disabled={saving} className="mt-5 rounded-xl bg-[#24361e] px-5 py-3 text-sm font-bold text-white disabled:opacity-50">Thêm dịch vụ</button>
      </form>

      <form onSubmit={addRule} className="rounded-2xl border border-[#d8e4d2] bg-white p-5 shadow-sm">
        <h2 className="font-serif text-2xl">{editingRuleId ? "Chỉnh sửa quy tắc hoa hồng" : "Thêm quy tắc hoa hồng"}</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="text-sm font-semibold text-[#40533b]">Người nhận<p className="field flex items-center bg-[#f3f7ef] font-normal">KTV</p></div>
          <div className="text-sm font-semibold text-[#40533b]">Phạm vi KTV<p className="field flex items-center bg-[#f3f7ef] font-normal">Áp dụng cho tất cả KTV</p></div>
          <label className="text-sm font-semibold text-[#40533b]">Dịch vụ<select required value={rule.service_id} onChange={(event) => setRule({ ...rule, service_id: event.target.value })} className="field"><option value="">Chọn dịch vụ</option>{services.filter((service) => service.active).map((service) => <option key={service.id} value={service.id}>{service.name}</option>)}</select></label>
          <label className="text-sm font-semibold text-[#40533b]">Áp dụng cho<select value={rule.sale_type} onChange={(event) => setRule({ ...rule, sale_type: event.target.value as SaleType | "" })} className="field"><option value="">Mọi hình thức</option>{saleTypes.filter((value) => value !== "package_sale").map((value) => <option key={value} value={value}>{saleTypeLabels[value]}</option>)}</select></label>
          <label className="text-sm font-semibold text-[#40533b]">Cách tính<select value={rule.rate_type} onChange={(event) => setRule({ ...rule, rate_type: event.target.value as CommissionRateType })} className="field"><option value="percentage">Phần trăm giá gói</option><option value="fixed">Số tiền cố định</option></select></label>
          <label className="text-sm font-semibold text-[#40533b]">{rule.rate_type === "percentage" ? "Tỷ lệ (%)" : "Số tiền (đ)"}{rule.rate_type === "percentage" ? <input required min="0" step="0.01" type="number" value={rule.rate_value} onChange={(event) => setRule({ ...rule, rate_value: Number(event.target.value) })} className="field" /> : <CurrencyInput required value={rule.rate_value} onValueChange={(rate_value) => setRule({ ...rule, rate_value })} className="field" />}</label>
          <label className="text-sm font-semibold text-[#40533b]">Có hiệu lực từ<input required type="date" value={rule.valid_from} onChange={(event) => setRule({ ...rule, valid_from: event.target.value })} className="field" /></label>
        </div>
        <div className="mt-5 flex flex-wrap gap-3"><button disabled={saving || services.filter((service) => service.active).length === 0} className="rounded-xl bg-[#6f9556] px-5 py-3 text-sm font-bold text-white disabled:opacity-50">{editingRuleId ? "Cập nhật quy tắc" : "Lưu quy tắc"}</button>{editingRuleId && <button type="button" onClick={() => { setEditingRuleId(null); setRule(() => ({ ...blankRule(), service_id: services[0]?.id ?? "" })); setMessage(""); }} className="rounded-xl border border-[#cddac6] px-5 py-3 text-sm font-bold text-[#48643a]">Hủy sửa</button>}</div>
      </form>
    </div>

    <div className="mt-7 grid gap-5 xl:grid-cols-2">
      <article className="overflow-hidden rounded-2xl border border-[#d8e4d2] bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-[#e5ede1] px-5 py-4"><h2 className="font-serif text-2xl">Danh mục dịch vụ</h2><span className="text-xs text-[#71816c]">{services.length} dịch vụ</span></div>
        <div className="divide-y divide-[#edf1ea]">
          {serviceGroups.map((group) => <details key={group.id} className="group/catalog">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 marker:hidden">
              <div><p className="font-semibold text-[#34472e]">{group.label}</p><p className="mt-0.5 text-sm text-[#71816c]">{group.description}</p></div>
              <div className="flex shrink-0 items-center gap-2 text-[#50713c]">
                <span className="rounded-full bg-[#edf4e8] px-2.5 py-1 text-xs font-bold">{group.services.length} mục</span>
                <ChevronDown className="group-open/catalog:rotate-180" />
              </div>
            </summary>
            <div className="border-t border-[#edf1ea] bg-[#fbfdf9]">
              {group.services.map((service) => <div key={service.id} className="border-b border-[#edf1ea] px-5 py-3 last:border-b-0">
                {editingService?.id === service.id ? <form onSubmit={updateService} className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_11rem_auto] sm:items-end">
                  <label className="text-xs font-semibold text-[#40533b]">Tên dịch vụ<input required value={editingService.name} onChange={(event) => setEditingService({ ...editingService, name: event.target.value })} className="field" /></label>
                  <label className="text-xs font-semibold text-[#40533b]">Giá mặc định<CurrencyInput required value={editingService.defaultPrice} onValueChange={(defaultPrice) => setEditingService({ ...editingService, defaultPrice })} className="field" /></label>
                  <div className="flex gap-2">
                    <button disabled={saving} className="rounded-lg bg-[#6f9556] px-3 py-2 text-xs font-bold text-white disabled:opacity-50">Lưu</button>
                    <button type="button" onClick={() => setEditingService(null)} className="rounded-lg border border-[#cddac6] px-3 py-2 text-xs font-bold text-[#48643a]">Hủy</button>
                  </div>
                </form> : <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div><p className="font-medium">{service.name}</p><p className="text-sm text-[#71816c]">Giá mặc định: {formatVnd(service.default_price)}</p></div>
                  <div className="flex shrink-0 flex-wrap items-center gap-2">
                    <button type="button" onClick={() => editService(service)} className="rounded-lg px-3 py-2 text-xs font-bold text-[#48643a] hover:bg-[#edf4e8]">Chỉnh sửa</button>
                    <button type="button" onClick={() => void toggleService(service)} className={`rounded-lg px-3 py-2 text-xs font-bold ${service.active ? "bg-[#edf4e8] text-[#50713c]" : "bg-[#f2f2f2] text-[#758073]"}`}>{service.active ? "Ngừng dùng" : "Áp dụng lại"}</button>
                    <button type="button" onClick={() => void deleteService(service)} className="rounded-lg px-3 py-2 text-xs font-bold text-red-700 hover:bg-red-50">Xóa hẳn</button>
                  </div>
                </div>}
              </div>)}
            </div>
          </details>)}
          {services.length === 0 && <p className="px-5 py-5 text-sm text-[#71816c]">Chưa có dịch vụ.</p>}
        </div>
      </article>
      <article className="overflow-hidden rounded-2xl border border-[#d8e4d2] bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-[#e5ede1] px-5 py-4"><h2 className="font-serif text-2xl">Quy tắc đang lưu</h2><span className="text-xs text-[#71816c]">{rules.length} quy tắc</span></div>
        <div className="divide-y divide-[#edf1ea]">
          {consultantRules.length > 0 && <details className="group/consultant">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 marker:hidden">
              <div><p className="font-semibold text-[#34472e]">Người bán theo nhân viên</p><p className="mt-0.5 text-sm text-[#71816c]">Tỷ lệ riêng, áp dụng theo người được chọn</p></div>
              <div className="flex shrink-0 items-center gap-2 text-[#50713c]">
                <span className="rounded-full bg-[#edf4e8] px-2.5 py-1 text-xs font-bold">{consultantRules.length} mục</span>
                <ChevronDown className="group-open/consultant:rotate-180" />
              </div>
            </summary>
            <div className="border-t border-[#edf1ea] bg-[#fbfdf9]">
              {consultantRules.map((item) => <div key={item.id} className="flex flex-col gap-3 border-b border-[#edf1ea] px-5 py-3 last:border-b-0 sm:flex-row sm:items-center sm:justify-between">
                <div><p className="font-medium">{item.recipient?.display_name ?? "Nhân viên bán hàng"} · {item.rate_type === "percentage" ? `${item.rate_value}% thực thu` : formatVnd(item.rate_value)}</p><p className="text-sm text-[#71816c]">{item.sale_type ? saleTypeLabels[item.sale_type] : "Mọi hình thức"} · từ {item.valid_from}</p></div>
                <div className="flex shrink-0 flex-wrap items-center gap-2"><button type="button" onClick={() => editRule(item)} className="rounded-lg px-3 py-2 text-xs font-bold text-[#48643a] hover:bg-[#edf4e8]">Chỉnh sửa</button><button type="button" onClick={() => void toggleRule(item)} className={`rounded-lg px-3 py-2 text-xs font-bold ${item.active ? "bg-[#edf4e8] text-[#50713c]" : "bg-[#f2f2f2] text-[#758073]"}`}>{item.active ? "Hủy áp dụng" : "Áp dụng lại"}</button><button type="button" onClick={() => void deleteRule(item)} className="rounded-lg px-3 py-2 text-xs font-bold text-red-700 hover:bg-red-50">Xóa hẳn</button></div>
              </div>)}
            </div>
          </details>}
          {technicianRuleGroups.map((group) => <details key={group.id} className="group/rule-category">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 marker:hidden">
              <div><p className="font-semibold text-[#34472e]">KTV · {group.label}</p><p className="mt-0.5 text-sm text-[#71816c]">{group.description}</p></div>
              <div className="flex shrink-0 items-center gap-2 text-[#50713c]">
                <span className="rounded-full bg-[#edf4e8] px-2.5 py-1 text-xs font-bold">{group.ruleCount} quy tắc</span>
                <ChevronDown className="group-open/rule-category:rotate-180" />
              </div>
            </summary>
            <div className="border-t border-[#edf1ea] bg-[#f7faf5] px-3 py-2">
              {group.serviceRules.map((serviceGroup) => <details key={serviceGroup.id} className="group/rule-service my-2 overflow-hidden rounded-xl border border-[#dde7d8] bg-white first:mt-0 last:mb-0">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 marker:hidden">
                  <p className="font-medium text-[#34472e]">{serviceGroup.name}</p>
                  <div className="flex shrink-0 items-center gap-2 text-[#5c7950]">
                    <span className="text-xs font-semibold">{serviceGroup.rules.length} quy tắc</span>
                    <ChevronDown className="h-4 w-4 group-open/rule-service:rotate-180" />
                  </div>
                </summary>
                <div className="divide-y divide-[#edf1ea] border-t border-[#e5ede1] bg-[#fbfdf9]">
                  {serviceGroup.rules.map((item) => <div key={item.id} className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                    <div><p className="text-sm font-medium text-[#40533b]">{item.sale_type ? saleTypeLabels[item.sale_type] : "Mọi hình thức"}</p><p className="mt-0.5 text-sm text-[#71816c]">{item.rate_type === "percentage" ? `${item.rate_value}% giá gói` : formatVnd(item.rate_value)} · từ {item.valid_from}</p></div>
                    <div className="flex shrink-0 flex-wrap items-center gap-2"><button type="button" onClick={() => editRule(item)} className="rounded-lg px-3 py-2 text-xs font-bold text-[#48643a] hover:bg-[#edf4e8]">Chỉnh sửa</button><button type="button" onClick={() => void toggleRule(item)} className={`rounded-lg px-3 py-2 text-xs font-bold ${item.active ? "bg-[#edf4e8] text-[#50713c]" : "bg-[#f2f2f2] text-[#758073]"}`}>{item.active ? "Hủy áp dụng" : "Áp dụng lại"}</button><button type="button" onClick={() => void deleteRule(item)} className="rounded-lg px-3 py-2 text-xs font-bold text-red-700 hover:bg-red-50">Xóa hẳn</button></div>
                  </div>)}
                </div>
              </details>)}
            </div>
          </details>)}
          {rules.length === 0 && <p className="px-5 py-5 text-sm text-[#71816c]">Chưa có quy tắc hoa hồng.</p>}
        </div>
      </article>
    </div>
  </section>;
}
