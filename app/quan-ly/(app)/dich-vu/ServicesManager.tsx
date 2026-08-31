"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { createClient } from "@/app/lib/supabase/client";
import { commissionTargetLabels, saleTypeLabels, type CommissionRateType, type CommissionRule, type CommissionTarget, type Profile, type SaleType, type Service } from "../../types";
import { formatVnd } from "../../utils";

const saleTypes = Object.keys(saleTypeLabels) as SaleType[];
const targets = Object.keys(commissionTargetLabels) as CommissionTarget[];
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

export function ServicesManager() {
  const [services, setServices] = useState<Service[]>([]);
  const [people, setPeople] = useState<Profile[]>([]);
  const [rules, setRules] = useState<CommissionRule[]>([]);
  const [serviceName, setServiceName] = useState("");
  const [servicePrice, setServicePrice] = useState(0);
  const [rule, setRule] = useState<RuleForm>(blankRule);
  const [editingRuleId, setEditingRuleId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const supabase = createClient();
    const [serviceResult, peopleResult, ruleResult] = await Promise.all([
      supabase.from("services").select("id, name, default_price, active").order("active", { ascending: false }).order("name"),
      supabase.from("profiles").select("id, display_name, role, is_active").eq("is_active", true).order("display_name"),
      supabase.from("commission_rules").select("id, service_id, target, recipient_profile_id, sale_type, rate_type, rate_value, valid_from, valid_to, active, service:services(name), recipient:profiles!commission_rules_recipient_profile_id_fkey(display_name)").order("active", { ascending: false }).order("valid_from", { ascending: false }),
    ]);
    if (serviceResult.error || peopleResult.error || ruleResult.error) {
      setMessage("Không tải được danh mục. Hãy kiểm tra quyền chủ spa và chạy migration SQL mới nhất.");
      return;
    }
    const nextServices = (serviceResult.data ?? []) as Service[];
    setServices(nextServices);
    setPeople((peopleResult.data ?? []) as Profile[]);
    setRules((ruleResult.data ?? []) as unknown as CommissionRule[]);
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

  async function addRule(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (rule.target === "technician" && !rule.service_id) {
      setMessage("Quy tắc KTV cần chọn một dịch vụ.");
      return;
    }
    if (rule.target === "consultant" && !rule.recipient_profile_id) {
      setMessage("Hãy chọn nhân viên nhận hoa hồng tư vấn.");
      return;
    }
    setSaving(true);
    setMessage("");
    const payload = {
      service_id: rule.service_id || null,
      target: rule.target,
      recipient_profile_id: rule.target === "consultant" ? rule.recipient_profile_id : null,
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
      target: item.target,
      recipient_profile_id: item.recipient_profile_id ?? "",
      sale_type: item.sale_type ?? "",
      rate_type: item.rate_type,
      rate_value: Number(item.rate_value),
      valid_from: item.valid_from,
    });
    setMessage("Đang chỉnh sửa quy tắc. Thay đổi chỉ dùng cho doanh thu ghi sau khi cập nhật.");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function changeTarget(target: CommissionTarget) {
    setRule((current) => ({
      ...current,
      target,
      service_id: target === "consultant" ? "" : current.service_id,
      sale_type: target === "consultant" ? "" : current.sale_type || "retail",
      recipient_profile_id: target === "consultant" ? current.recipient_profile_id : "",
      rate_value: target === "technician" ? 50 : current.rate_value === 50 ? 5 : current.rate_value,
    }));
  }

  const serviceGroups = (Object.keys(catalogGroupMeta) as CatalogGroup[]).map((group) => ({
    id: group,
    ...catalogGroupMeta[group],
    services: services.filter((service) => getCatalogGroup(service.name) === group),
  })).filter((group) => group.services.length > 0);

  const consultantRules = rules.filter((ruleItem) => ruleItem.target === "consultant");
  const technicianRuleGroups = (Object.keys(catalogGroupMeta) as CatalogGroup[]).map((group) => ({
    id: group,
    ...catalogGroupMeta[group],
    rules: rules.filter((ruleItem) => ruleItem.target === "technician" && getCatalogGroup(ruleItem.service?.name ?? "") === group),
  })).filter((group) => group.rules.length > 0);

  return <section>
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#6f9556]">Chủ spa thiết lập</p>
      <h1 className="mt-1 font-serif text-4xl text-[#1c2619]">Dịch vụ & hoa hồng</h1>
      <p className="mt-2 text-sm text-[#66745f]">KTV nhận theo giá gói; tư vấn nhận theo tỷ lệ riêng của từng người và tính trên thực thu. Quy tắc mới chỉ áp dụng cho doanh thu phát sinh từ ngày hiệu lực.</p>
    </div>
    {message && <p role="status" className="mt-5 rounded-xl bg-[#edf4e8] px-4 py-3 text-sm text-[#496b35]">{message}</p>}

    <div className="mt-6 grid gap-5 xl:grid-cols-2">
      <form onSubmit={addService} className="rounded-2xl border border-[#d8e4d2] bg-white p-5 shadow-sm">
        <h2 className="font-serif text-2xl">Thêm dịch vụ</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_11rem]">
          <label className="text-sm font-semibold text-[#40533b]">Tên dịch vụ<input required value={serviceName} onChange={(event) => setServiceName(event.target.value)} className="field" placeholder="VD: Gội đầu dưỡng sinh" /></label>
          <label className="text-sm font-semibold text-[#40533b]">Giá niêm yết<input required min="0" type="number" value={servicePrice} onChange={(event) => setServicePrice(Number(event.target.value))} className="field" /></label>
        </div>
        <button disabled={saving} className="mt-5 rounded-xl bg-[#24361e] px-5 py-3 text-sm font-bold text-white disabled:opacity-50">Thêm dịch vụ</button>
      </form>

      <form onSubmit={addRule} className="rounded-2xl border border-[#d8e4d2] bg-white p-5 shadow-sm">
        <h2 className="font-serif text-2xl">{editingRuleId ? "Chỉnh sửa quy tắc hoa hồng" : "Thêm quy tắc hoa hồng"}</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-semibold text-[#40533b]">Người nhận<select value={rule.target} onChange={(event) => changeTarget(event.target.value as CommissionTarget)} className="field">{targets.map((value) => <option key={value} value={value}>{commissionTargetLabels[value]}</option>)}</select></label>
          {rule.target === "consultant" ? <label className="text-sm font-semibold text-[#40533b]">Nhân viên tư vấn<select required value={rule.recipient_profile_id} onChange={(event) => setRule({ ...rule, recipient_profile_id: event.target.value })} className="field"><option value="">Chọn nhân viên</option>{people.filter((person) => person.role === "staff").map((person) => <option key={person.id} value={person.id}>{person.display_name}</option>)}</select></label> : <div className="text-sm font-semibold text-[#40533b]">Phạm vi KTV<p className="field flex items-center bg-[#f3f7ef] font-normal">Áp dụng cho tất cả KTV</p></div>}
          <label className="text-sm font-semibold text-[#40533b]">Dịch vụ<select required={rule.target === "technician"} value={rule.service_id} onChange={(event) => setRule({ ...rule, service_id: event.target.value })} className="field"><option value="">Tất cả dịch vụ</option>{services.filter((service) => service.active).map((service) => <option key={service.id} value={service.id}>{service.name}</option>)}</select></label>
          <label className="text-sm font-semibold text-[#40533b]">Áp dụng cho<select value={rule.sale_type} onChange={(event) => setRule({ ...rule, sale_type: event.target.value as SaleType | "" })} className="field"><option value="">Mọi hình thức</option>{saleTypes.map((value) => <option key={value} value={value}>{saleTypeLabels[value]}</option>)}</select></label>
          <label className="text-sm font-semibold text-[#40533b]">Cách tính<select value={rule.rate_type} onChange={(event) => setRule({ ...rule, rate_type: event.target.value as CommissionRateType })} className="field"><option value="percentage">{rule.target === "technician" ? "Phần trăm giá gói" : "Phần trăm thực thu"}</option><option value="fixed">Số tiền cố định</option></select></label>
          <label className="text-sm font-semibold text-[#40533b]">{rule.rate_type === "percentage" ? "Tỷ lệ (%)" : "Số tiền (đ)"}<input required min="0" step={rule.rate_type === "percentage" ? "0.01" : "1000"} type="number" value={rule.rate_value} onChange={(event) => setRule({ ...rule, rate_value: Number(event.target.value) })} className="field" /></label>
          <label className="text-sm font-semibold text-[#40533b]">Có hiệu lực từ<input required type="date" value={rule.valid_from} onChange={(event) => setRule({ ...rule, valid_from: event.target.value })} className="field" /></label>
        </div>
        <div className="mt-5 flex flex-wrap gap-3"><button disabled={saving || (rule.target === "technician" && services.filter((service) => service.active).length === 0)} className="rounded-xl bg-[#6f9556] px-5 py-3 text-sm font-bold text-white disabled:opacity-50">{editingRuleId ? "Cập nhật quy tắc" : "Lưu quy tắc"}</button>{editingRuleId && <button type="button" onClick={() => { setEditingRuleId(null); setRule(() => ({ ...blankRule(), service_id: services[0]?.id ?? "" })); setMessage(""); }} className="rounded-xl border border-[#cddac6] px-5 py-3 text-sm font-bold text-[#48643a]">Hủy sửa</button>}</div>
      </form>
    </div>

    <div className="mt-7 grid gap-5 xl:grid-cols-2">
      <article className="overflow-hidden rounded-2xl border border-[#d8e4d2] bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-[#e5ede1] px-5 py-4"><h2 className="font-serif text-2xl">Danh mục dịch vụ</h2><span className="text-xs text-[#71816c]">{services.length} dịch vụ</span></div>
        <div className="divide-y divide-[#edf1ea]">{serviceGroups.map((group) => <details key={group.id} className="group"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 marker:hidden"><div><p className="font-semibold text-[#34472e]">{group.label}</p><p className="mt-0.5 text-sm text-[#71816c]">{group.description}</p></div><span className="rounded-full bg-[#edf4e8] px-2.5 py-1 text-xs font-bold text-[#50713c]">{group.services.length} mục</span></summary><div className="border-t border-[#edf1ea] bg-[#fbfdf9]">{group.services.map((service) => <div key={service.id} className="flex items-center justify-between gap-4 border-b border-[#edf1ea] px-5 py-3 last:border-b-0"><div><p className="font-medium">{service.name}</p><p className="text-sm text-[#71816c]">Giá mặc định: {formatVnd(service.default_price)}</p></div><div className="flex shrink-0 items-center gap-2"><button onClick={() => void toggleService(service)} className={`rounded-lg px-3 py-2 text-xs font-bold ${service.active ? "bg-[#edf4e8] text-[#50713c]" : "bg-[#f2f2f2] text-[#758073]"}`}>{service.active ? "Ngừng dùng" : "Áp dụng lại"}</button><button onClick={() => void deleteService(service)} className="rounded-lg px-3 py-2 text-xs font-bold text-red-700 hover:bg-red-50">Xóa hẳn</button></div></div>)}</div></details>)}{services.length === 0 && <p className="px-5 py-5 text-sm text-[#71816c]">Chưa có dịch vụ.</p>}</div>
      </article>
      <article className="overflow-hidden rounded-2xl border border-[#d8e4d2] bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-[#e5ede1] px-5 py-4"><h2 className="font-serif text-2xl">Quy tắc đang lưu</h2><span className="text-xs text-[#71816c]">{rules.length} quy tắc</span></div>
        <div className="divide-y divide-[#edf1ea]">
          {consultantRules.length > 0 && <details className="group"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 marker:hidden"><div><p className="font-semibold text-[#34472e]">Tư vấn theo nhân viên</p><p className="mt-0.5 text-sm text-[#71816c]">Tỷ lệ riêng, áp dụng theo người được chọn</p></div><span className="rounded-full bg-[#edf4e8] px-2.5 py-1 text-xs font-bold text-[#50713c]">{consultantRules.length} mục</span></summary><div className="border-t border-[#edf1ea] bg-[#fbfdf9]">{consultantRules.map((item) => <div key={item.id} className="flex items-center justify-between gap-4 border-b border-[#edf1ea] px-5 py-3 last:border-b-0"><div><p className="font-medium">{item.recipient?.display_name ?? "Nhân viên tư vấn"} · {item.rate_type === "percentage" ? `${item.rate_value}% thực thu` : formatVnd(item.rate_value)}</p><p className="text-sm text-[#71816c]">{item.sale_type ? saleTypeLabels[item.sale_type] : "Mọi hình thức"} · từ {item.valid_from}</p></div><div className="flex shrink-0 items-center gap-2"><button onClick={() => editRule(item)} className="rounded-lg px-3 py-2 text-xs font-bold text-[#48643a] hover:bg-[#edf4e8]">Chỉnh sửa</button><button onClick={() => void toggleRule(item)} className={`rounded-lg px-3 py-2 text-xs font-bold ${item.active ? "bg-[#edf4e8] text-[#50713c]" : "bg-[#f2f2f2] text-[#758073]"}`}>{item.active ? "Hủy áp dụng" : "Áp dụng lại"}</button><button onClick={() => void deleteRule(item)} className="rounded-lg px-3 py-2 text-xs font-bold text-red-700 hover:bg-red-50">Xóa hẳn</button></div></div>)}</div></details>}
          {technicianRuleGroups.map((group) => <details key={group.id} className="group"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 marker:hidden"><div><p className="font-semibold text-[#34472e]">KTV · {group.label}</p><p className="mt-0.5 text-sm text-[#71816c]">{group.description}</p></div><span className="rounded-full bg-[#edf4e8] px-2.5 py-1 text-xs font-bold text-[#50713c]">{group.rules.length} quy tắc</span></summary><div className="border-t border-[#edf1ea] bg-[#fbfdf9]">{group.rules.map((item) => <div key={item.id} className="flex items-center justify-between gap-4 border-b border-[#edf1ea] px-5 py-3 last:border-b-0"><div><p className="font-medium">{item.service?.name ?? "Tất cả dịch vụ"}</p><p className="text-sm text-[#71816c]">{item.sale_type ? saleTypeLabels[item.sale_type] : "Mọi hình thức"} · {item.rate_type === "percentage" ? `${item.rate_value}% giá gói` : formatVnd(item.rate_value)} · từ {item.valid_from}</p></div><div className="flex shrink-0 items-center gap-2"><button onClick={() => editRule(item)} className="rounded-lg px-3 py-2 text-xs font-bold text-[#48643a] hover:bg-[#edf4e8]">Chỉnh sửa</button><button onClick={() => void toggleRule(item)} className={`rounded-lg px-3 py-2 text-xs font-bold ${item.active ? "bg-[#edf4e8] text-[#50713c]" : "bg-[#f2f2f2] text-[#758073]"}`}>{item.active ? "Hủy áp dụng" : "Áp dụng lại"}</button><button onClick={() => void deleteRule(item)} className="rounded-lg px-3 py-2 text-xs font-bold text-red-700 hover:bg-red-50">Xóa hẳn</button></div></div>)}</div></details>)}
          {rules.length === 0 && <p className="px-5 py-5 text-sm text-[#71816c]">Chưa có quy tắc hoa hồng.</p>}
        </div>
      </article>
    </div>
  </section>;
}
