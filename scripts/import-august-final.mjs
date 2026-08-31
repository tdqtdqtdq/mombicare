import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

const here = path.dirname(fileURLToPath(import.meta.url));
const workbookPath = process.argv[2];

if (!workbookPath) {
  throw new Error("Cần truyền đường dẫn file Excel: node scripts/import-august-final.mjs <file.xlsx>");
}

const requiredEnvironment = ["IMPORT_OWNER_EMAIL", "IMPORT_OWNER_PASSWORD"];
for (const key of requiredEnvironment) {
  if (!process.env[key]) throw new Error(`Thiếu biến môi trường ${key}.`);
}

const environment = Object.fromEntries(
  readFileSync(path.resolve(here, "../.env.local"), "utf8")
    .split(/\r?\n/)
    .filter((line) => /^[A-Z0-9_]+=/.test(line))
    .map((line) => {
      const separator = line.indexOf("=");
      return [line.slice(0, separator), line.slice(separator + 1).replace(/^"|"$/g, "")];
    }),
);

const { records, totals } = JSON.parse(
  execFileSync("python", [path.resolve(here, "extract-august-final.py"), workbookPath], { encoding: "utf8" }),
);

const publicClient = createClient(environment.NEXT_PUBLIC_SUPABASE_URL, environment.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});
const adminClient = createClient(environment.NEXT_PUBLIC_SUPABASE_URL, environment.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const { data: authData, error: authError } = await publicClient.auth.signInWithPassword({
  email: process.env.IMPORT_OWNER_EMAIL,
  password: process.env.IMPORT_OWNER_PASSWORD,
});
if (authError || !authData.session) throw new Error(authError?.message ?? "Không thể đăng nhập tài khoản chủ spa để nhập dữ liệu.");

const ownerClient = createClient(environment.NEXT_PUBLIC_SUPABASE_URL, environment.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, {
  global: { headers: { Authorization: `Bearer ${authData.session.access_token}` } },
  auth: { autoRefreshToken: false, persistSession: false },
});

const expect = (result, message) => {
  if (result.error) throw new Error(`${message}: ${result.error.message}`);
  return result.data;
};

const profiles = expect(await adminClient.from("profiles").select("id, display_name, is_active"), "Không đọc được danh sách nhân viên");
const profilesByName = new Map(profiles.map((profile) => [profile.display_name, profile]));
const owner = profilesByName.get("Chủ spa");
if (!owner) throw new Error("Không tìm thấy hồ sơ Chủ spa.");

if (!profilesByName.has("Trinh")) {
  const email = process.env.IMPORT_TRINH_EMAIL;
  const password = process.env.IMPORT_TRINH_PASSWORD;
  if (!email || !password || password.length < 8) {
    throw new Error("Trinh chưa có tài khoản. Cần IMPORT_TRINH_EMAIL và IMPORT_TRINH_PASSWORD (ít nhất 8 ký tự) để tạo và gán dữ liệu.");
  }
  const created = await adminClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { display_name: "Trinh" },
  });
  if (created.error || !created.data.user) throw new Error(created.error?.message ?? "Không thể tạo tài khoản Trinh.");
  expect(
    await adminClient.from("profiles").update({ display_name: "Trinh", role: "staff", is_active: true }).eq("id", created.data.user.id),
    "Không cập nhật hồ sơ Trinh",
  );
  profilesByName.set("Trinh", { id: created.data.user.id, display_name: "Trinh", is_active: true });
}

for (const name of ["Miên", "Trang", "Trinh"]) {
  const profile = profilesByName.get(name);
  if (!profile?.is_active) throw new Error(`Tài khoản ${name} chưa hoạt động, không thể gán dữ liệu chuẩn.`);
}

const existingFinalRows = expect(
  await adminClient.from("revenue_entries").select("id").like("source_ref", "excel-t8-final-2026:%"),
  "Không kiểm tra được dữ liệu chuẩn đã nhập",
);
if ((existingFinalRows ?? []).length > 0) throw new Error("Dữ liệu Excel chuẩn tháng 8 đã tồn tại. Dừng để tránh nhập trùng.");

const oldRows = expect(
  await adminClient.from("revenue_entries").select("id").like("source_ref", "excel-t8-2026:%"),
  "Không kiểm tra được dữ liệu nhập nhầm",
);
const oldIds = oldRows.map((row) => row.id);
if (oldIds.length > 0) {
  const closedLedgers = expect(
    await adminClient.from("commission_ledger").select("id").in("revenue_entry_id", oldIds).in("status", ["locked", "paid"]),
    "Không kiểm tra được kỳ lương đã chốt",
  );
  if (closedLedgers.length > 0) throw new Error("Dữ liệu nhập nhầm đã nằm trong kỳ lương chốt/thanh toán. Dừng để không phá số đã khóa.");
}

const serviceDefaults = {
  "Gội đầu sạch": 50000,
  "Gội dưỡng sinh": 150000,
  "Gội thảo dược": 80000,
  "Massage cổ vai gáy 45p": 250000,
  "Massage body": 250000,
  "Massage cổ vai gáy trị liệu 45p": 250000,
  "Massage body trị liệu 60p": 300000,
  "Massage body trị liệu cao cấp 90p": 400000,
  "Massage chân 30p": 150000,
  "Massage chân 60p": 250000,
  "Massage mặt + cấy tảo + điện di": 264000,
  "Massage mặt thái chí": 248000,
  "Chăm sóc da cơ bản": 120000,
  "Chăm sóc da chuyên sâu": 160000,
  "Cấy serum dưỡng trắng da ngăn ngừa sắc tố": 200000,
  "Lấy nhân mụn": 200000,
  "Lấy nhân mụn chuyên sâu": 280000,
  "Ôn ấm": 100000,
  "Giác hơi": 50000,
  "Xông hơi": 50000,
  "Bán gói / thẻ": 0,
  "Dịch vụ chưa ghi": 0,
};

const existingServices = expect(await adminClient.from("services").select("id, name"), "Không đọc được danh mục dịch vụ");
const serviceByName = new Map(existingServices.map((service) => [service.name, service]));
const missingServiceNames = [...new Set(records.map((record) => record.service_name))].filter((name) => !serviceByName.has(name));
if (missingServiceNames.length > 0) {
  const createdServices = expect(
    await ownerClient
      .from("services")
      .insert(missingServiceNames.map((name) => ({ name, default_price: serviceDefaults[name] ?? 0, active: !["Bán gói / thẻ", "Dịch vụ chưa ghi"].includes(name) })))
      .select("id, name"),
    "Không tạo được dịch vụ còn thiếu",
  );
  for (const service of createdServices) serviceByName.set(service.name, service);

  const normalNewServices = createdServices.filter((service) => !["Bán gói / thẻ", "Dịch vụ chưa ghi"].includes(service.name));
  if (normalNewServices.length > 0) {
    expect(
      await ownerClient.from("commission_rules").insert(
        normalNewServices.flatMap((service) => ["retail", "package_sale", "package_usage", "gift"].map((sale_type) => ({
          service_id: service.id,
          target: "technician",
          recipient_profile_id: null,
          sale_type,
          rate_type: "percentage",
          rate_value: 50,
          valid_from: "2026-08-01",
          active: true,
        }))),
      ),
      "Không tạo được quy tắc KTV cho dịch vụ mới",
    );
  }
}

const employeeIds = Object.fromEntries(["Miên", "Trang", "Trinh"].map((name) => [name, profilesByName.get(name).id]));
expect(
  await ownerClient.from("commission_rules").delete().eq("target", "consultant").in("recipient_profile_id", Object.values(employeeIds)),
  "Không thay được quy tắc tư vấn cũ",
);
expect(
  await ownerClient.from("commission_rules").insert(Object.values(employeeIds).map((recipient_profile_id) => ({
    service_id: null,
    target: "consultant",
    recipient_profile_id,
    sale_type: null,
    rate_type: "percentage",
    rate_value: 10,
    valid_from: "2026-08-01",
    active: true,
  }))),
  "Không tạo được quy tắc tư vấn 10%",
);

const rowsToInsert = records.map((record) => {
  const isExternal = record.employee === "Tua ngoài";
  const technicianId = isExternal || record.technician_amount === 0 ? null : employeeIds[record.employee];
  const consultantId = isExternal || record.consultant_amount === 0 ? null : employeeIds[record.employee];
  return {
    source_ref: record.source_ref,
    service_date: record.service_date,
    customer_name: record.customer_name,
    service_id: serviceByName.get(record.service_name).id,
    sale_type: record.sale_type,
    service_name_snapshot: record.service_name,
    price_snapshot: Math.max(record.revenue_amount, record.technician_amount * 2),
    revenue_amount: record.revenue_amount,
    external_payout_amount: isExternal ? record.technician_amount : 0,
    technician_id: technicianId,
    consultant_id: consultantId,
    created_by: owner.id,
    notes: `Nguồn Excel chuẩn tháng 8/2026 — ${record.sheet}, dòng ${record.row}${record.package_tag ? `; ${record.package_tag}` : ""}${record.gift_tag ? `; ${record.gift_tag}` : ""}`,
    status: "completed",
  };
});

const createdEntries = [];
for (let index = 0; index < rowsToInsert.length; index += 100) {
  const batch = expect(
    await ownerClient.from("revenue_entries").insert(rowsToInsert.slice(index, index + 100)).select("id, source_ref"),
    "Không nhập được dòng doanh thu chuẩn",
  );
  createdEntries.push(...batch);
}

const entryIdBySource = new Map(createdEntries.map((entry) => [entry.source_ref, entry.id]));
if (createdEntries.length !== records.length) throw new Error("Số dòng vừa nhập không khớp nguồn Excel; dữ liệu nhập nhầm vẫn chưa bị xóa.");

expect(await adminClient.from("commission_ledger").delete().in("revenue_entry_id", createdEntries.map((entry) => entry.id)), "Không xóa được hoa hồng tự tính để thay bằng số Excel");
const manualLedgers = records.flatMap((record) => {
  if (record.employee === "Tua ngoài") return [];
  const revenueEntryId = entryIdBySource.get(record.source_ref);
  const common = { revenue_entry_id: revenueEntryId, employee_id: employeeIds[record.employee], service_name_snapshot: record.service_name, service_date: record.service_date, status: "pending" };
  return [
    ...(record.technician_amount > 0 ? [{ ...common, target: "technician", amount: record.technician_amount, rate_type: "fixed", rate_value: record.technician_amount }] : []),
    ...(record.consultant_amount > 0 ? [{ ...common, target: "consultant", amount: record.consultant_amount, rate_type: "fixed", rate_value: record.consultant_amount }] : []),
  ];
});
for (let index = 0; index < manualLedgers.length; index += 100) {
  expect(await adminClient.from("commission_ledger").insert(manualLedgers.slice(index, index + 100)), "Không lưu được số hoa hồng chuẩn từ Excel");
}

expect(
  await ownerClient.from("monthly_targets").upsert([
    { profile_id: employeeIds["Miên"], target_month: "2026-08-01", target_amount: 30000000 },
    { profile_id: employeeIds.Trang, target_month: "2026-08-01", target_amount: 15000000 },
    { profile_id: employeeIds.Trinh, target_month: "2026-08-01", target_amount: 10000000 },
  ], { onConflict: "profile_id,target_month" }),
  "Không cập nhật được mục tiêu tháng 8",
);

const insertedRevenue = rowsToInsert.reduce((sum, row) => sum + row.revenue_amount, 0);
const insertedTechnician = manualLedgers.filter((ledger) => ledger.target === "technician").reduce((sum, ledger) => sum + ledger.amount, 0);
const insertedConsultant = manualLedgers.filter((ledger) => ledger.target === "consultant").reduce((sum, ledger) => sum + ledger.amount, 0);
if (insertedRevenue !== totals.revenue || insertedTechnician !== totals.technician - 1100000 || insertedConsultant !== totals.consultant) {
  throw new Error("Đối soát nội bộ trước khi xóa dữ liệu cũ không khớp; dữ liệu cũ vẫn còn nguyên.");
}

if (oldIds.length > 0) {
  expect(await ownerClient.from("revenue_entries").delete().in("id", oldIds), "Đã nhập dữ liệu chuẩn nhưng không xóa được dữ liệu nguồn cũ");
}

console.log(JSON.stringify({
  imported_lines: createdEntries.length,
  revenue: insertedRevenue,
  internal_technician: insertedTechnician,
  consultant: insertedConsultant,
  external_payout: totals.technician - insertedTechnician,
  removed_old_rows: oldIds.length,
}, null, 2));
