"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { createClient } from "@/app/lib/supabase/client";
import { currentMonth, formatVnd, monthBounds } from "../utils";
import { type MonthlyTarget, type Profile, type SaleType } from "../types";

type EntryTotal = {
  id: string;
  revenue_amount: number | string;
  external_payout_amount: number | string;
  sale_type: SaleType;
  technician_id: string | null;
  consultant_id: string | null;
  status: "completed" | "void";
  service_date: string;
};
type LedgerTotal = { amount: number | string; status: "pending" | "locked" | "paid" };

export function DashboardClient({ profile }: { profile: Profile }) {
  const [month, setMonth] = useState(currentMonth());
  const [entries, setEntries] = useState<EntryTotal[]>([]);
  const [ledgers, setLedgers] = useState<LedgerTotal[]>([]);
  const [targets, setTargets] = useState<MonthlyTarget[]>([]);
  const [people, setPeople] = useState<Profile[]>([]);
  const [targetDrafts, setTargetDrafts] = useState<Record<string, number>>({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingTargetId, setSavingTargetId] = useState<string | null>(null);

  const monthStart = `${month}-01`;

  async function load() {
    setLoading(true);
    setMessage("");
    const { from, to } = monthBounds(month);
    const supabase = createClient();
    const [entryResult, ledgerResult, targetResult, peopleResult] = await Promise.all([
      supabase.from("revenue_entries").select("id, revenue_amount, external_payout_amount, sale_type, technician_id, consultant_id, status, service_date").gte("service_date", from).lte("service_date", to).order("service_date", { ascending: false }),
      supabase.from("commission_ledger").select("amount, status").gte("service_date", from).lte("service_date", to),
      supabase.from("monthly_targets").select("id, profile_id, target_month, target_amount").eq("target_month", monthStart),
      profile.role === "owner" ? supabase.from("profiles").select("id, display_name, role, is_active").eq("is_active", true).eq("role", "staff").order("display_name") : Promise.resolve({ data: [], error: null }),
    ]);
    if (entryResult.error || ledgerResult.error || targetResult.error || peopleResult.error) {
      setMessage("Không tải được số liệu hoặc mục tiêu tháng. Hãy chạy migration mới nhất trên Supabase.");
    } else {
      const nextTargets = (targetResult.data ?? []) as MonthlyTarget[];
      setEntries((entryResult.data ?? []) as EntryTotal[]);
      setLedgers((ledgerResult.data ?? []) as LedgerTotal[]);
      setTargets(nextTargets);
      setPeople((peopleResult.data ?? []) as Profile[]);
      setTargetDrafts(Object.fromEntries(nextTargets.map((target) => [target.profile_id, Number(target.target_amount)])));
    }
    setLoading(false);
  }

  useEffect(() => {
    const timer = window.setTimeout(() => { void load(); }, 0);
    return () => window.clearTimeout(timer);
  // load deliberately follows the selected month and current role.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month, profile.role]);

  const stats = useMemo(() => {
    const completed = entries.filter((entry) => entry.status === "completed");
    const revenue = completed.reduce((sum, entry) => sum + Number(entry.revenue_amount), 0);
    const externalTourRevenue = completed.filter((entry) => entry.sale_type === "external_tour").reduce((sum, entry) => sum + Number(entry.revenue_amount), 0);
    const externalTourPayout = completed.filter((entry) => entry.sale_type === "external_tour").reduce((sum, entry) => sum + Number(entry.external_payout_amount), 0);
    const commission = ledgers.reduce((sum, ledger) => sum + Number(ledger.amount), 0);
    const revenueFor = (profileId: string) => completed.filter((entry) => entry.technician_id === profileId || entry.consultant_id === profileId).reduce((sum, entry) => sum + Number(entry.revenue_amount), 0);
    return { revenue, externalTourRevenue, externalTourPayout, commission, count: completed.length, revenueFor, pending: ledgers.filter((ledger) => ledger.status === "pending").reduce((sum, ledger) => sum + Number(ledger.amount), 0) };
  }, [entries, ledgers]);

  const targetFor = (profileId: string) => Number(targets.find((target) => target.profile_id === profileId)?.target_amount ?? 0);
  const ownTarget = targetFor(profile.id);
  const ownRevenue = stats.revenueFor(profile.id);
  const ownerTargetTotal = people.reduce((sum, person) => sum + targetFor(person.id), 0);
  const ownerRemaining = people.reduce((sum, person) => sum + Math.max(0, targetFor(person.id) - stats.revenueFor(person.id)), 0);

  const cards = [
    { label: "Doanh thu đã ghi", value: formatVnd(stats.revenue), hint: `${stats.count} lượt dịch vụ`, tone: "bg-[#24361e] text-white" },
    { label: "Doanh thu tua ngoài", value: formatVnd(stats.externalTourRevenue), hint: `Chi ngoài: ${formatVnd(stats.externalTourPayout)}`, tone: "bg-[#fff9ec] text-[#624c23]" },
    { label: "Hoa hồng phát sinh", value: formatVnd(stats.commission), hint: "Tự tính theo quy tắc", tone: "bg-white text-[#20301c]" },
    { label: profile.role === "owner" ? "Tổng mục tiêu" : "Mục tiêu tháng", value: formatVnd(profile.role === "owner" ? ownerTargetTotal : ownTarget), hint: profile.role === "owner" ? `Còn thiếu: ${formatVnd(ownerRemaining)}` : `Còn thiếu: ${formatVnd(Math.max(0, ownTarget - ownRevenue))}`, tone: "bg-[#edf4e8] text-[#274222]" },
  ];

  async function saveTarget(person: Profile) {
    const amount = Math.max(0, Number(targetDrafts[person.id] ?? 0));
    setSavingTargetId(person.id);
    setMessage("");
    const { error } = await createClient().from("monthly_targets").upsert({ profile_id: person.id, target_month: monthStart, target_amount: amount }, { onConflict: "profile_id,target_month" });
    setMessage(error ? `Không thể lưu mục tiêu: ${error.message}` : `Đã lưu mục tiêu tháng ${month} cho ${person.display_name}.`);
    if (!error) await load();
    setSavingTargetId(null);
  }

  return (
    <section>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#6f9556]">{profile.role === "owner" ? "Toàn spa" : "Số liệu của bạn"}</p>
          <h1 className="mt-1 font-serif text-4xl text-[#1c2619]">Tổng quan doanh thu</h1>
          <p className="mt-2 text-sm text-[#66745f]">Mỗi dòng doanh thu sẽ tự sinh hoa hồng theo bảng quy tắc đã thiết lập.</p>
        </div>
        <label className="text-sm font-semibold text-[#52664b]">Tháng xem
          <input type="month" value={month} onChange={(event) => setMonth(event.target.value)} className="ml-3 rounded-xl border border-[#cddac6] bg-white px-3 py-2 outline-none focus:border-[#6f9556]" />
        </label>
      </div>

      {message && <p role="status" className="mt-5 rounded-xl bg-[#edf4e8] px-4 py-3 text-sm text-[#496b35]">{message}</p>}
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => <article key={card.label} className={`rounded-2xl border border-[#dce7d6] p-5 shadow-sm ${card.tone}`}>
          <p className="text-xs font-bold uppercase tracking-[0.13em] opacity-70">{card.label}</p>
          <p className="mt-3 font-serif text-3xl">{loading ? "…" : card.value}</p>
          <p className="mt-2 text-xs opacity-70">{card.hint}</p>
        </article>)}
      </div>

      {profile.role === "owner" ? <article className="mt-6 overflow-hidden rounded-2xl border border-[#d8e4d2] bg-white shadow-sm">
        <div className="flex flex-col gap-1 border-b border-[#e5ede1] px-5 py-4"><h2 className="font-serif text-2xl">Mục tiêu theo nhân viên</h2><p className="text-sm text-[#71816c]">Chủ spa đặt mục tiêu riêng cho từng tháng. Doanh số và số còn thiếu được tính tự động.</p></div>
        <div className="overflow-x-auto"><table className="w-full min-w-[720px] text-left text-sm"><thead className="bg-[#f5f8f2] text-xs uppercase tracking-wide text-[#71816c]"><tr><th className="px-5 py-3">Nhân viên</th><th className="px-5 py-3">Mục tiêu</th><th className="px-5 py-3">Doanh số</th><th className="px-5 py-3">Còn thiếu</th><th className="px-5 py-3" /></tr></thead><tbody>{people.map((person) => { const target = Number(targetDrafts[person.id] ?? targetFor(person.id)); const revenue = stats.revenueFor(person.id); return <tr key={person.id} className="border-t border-[#edf1ea]"><td className="px-5 py-4 font-semibold">{person.display_name}</td><td className="px-5 py-4"><input min="0" type="number" value={target} onChange={(event) => setTargetDrafts((current) => ({ ...current, [person.id]: Number(event.target.value) }))} className="w-40 rounded-lg border border-[#cfddc9] px-3 py-2 outline-none focus:border-[#6f9556]" /></td><td className="px-5 py-4 font-semibold">{formatVnd(revenue)}</td><td className="px-5 py-4 font-semibold text-[#86632e]">{formatVnd(Math.max(0, target - revenue))}</td><td className="px-5 py-4"><button disabled={savingTargetId === person.id} onClick={() => void saveTarget(person)} className="rounded-lg bg-[#6f9556] px-3 py-2 text-xs font-bold text-white disabled:opacity-50">{savingTargetId === person.id ? "Đang lưu…" : "Lưu mục tiêu"}</button></td></tr>; })}{people.length === 0 && <tr><td colSpan={5} className="px-5 py-5 text-[#71816c]">Chưa có nhân viên đang hoạt động.</td></tr>}</tbody></table></div>
      </article> : <article className="mt-6 rounded-2xl border border-[#d8e4d2] bg-white p-6 shadow-sm"><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#6f9556]">Mục tiêu của bạn · {month}</p><div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><p className="font-serif text-4xl text-[#1c2619]">{loading ? "…" : formatVnd(ownTarget)}</p><p className="mt-1 text-sm text-[#71816c]">Do chủ spa thiết lập cho tháng này.</p></div><div className="sm:text-right"><p className="text-sm text-[#71816c]">Doanh số: <strong className="text-[#34472e]">{formatVnd(ownRevenue)}</strong></p><p className="mt-1 text-sm text-[#86632e]">Còn thiếu: <strong>{formatVnd(Math.max(0, ownTarget - ownRevenue))}</strong></p></div></div></article>}

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <article className="rounded-2xl border border-[#dce7d6] bg-white p-6 shadow-sm">
          <h2 className="font-serif text-2xl">Bắt đầu ghi nhận</h2>
          <p className="mt-2 text-sm leading-6 text-[#65745f]">Chọn dịch vụ, tên khách hàng, kỹ thuật viên, người tư vấn và số tiền thực thu. Giá và thực thu của nhân viên được khóa theo bảng giá chủ spa đã thiết lập.</p>
          <Link href="/quan-ly/doanh-thu" className="mt-5 inline-flex rounded-xl bg-[#6f9556] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#55763f]">+ Nhập doanh thu</Link>
        </article>
        <article className="rounded-2xl border border-[#dce7d6] bg-white p-6 shadow-sm">
          <h2 className="font-serif text-2xl">Quy trình dùng hằng ngày</h2>
          <ol className="mt-3 space-y-2 text-sm leading-6 text-[#65745f]">
            <li>1. Chủ spa tạo dịch vụ, giá và mức hoa hồng.</li>
            <li>2. Nhân viên ghi dịch vụ đã hoàn tất; không tự sửa giá.</li>
            <li>3. Cuối tháng chủ spa kiểm tra, xuất và chốt kỳ.</li>
          </ol>
        </article>
      </div>
    </section>
  );
}
