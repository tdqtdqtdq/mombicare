import { NextResponse } from "next/server";
import { createAdminClient } from "@/app/lib/supabase/admin";
import { createClient } from "@/app/lib/supabase/server";

type EmployeePayload = {
  password?: unknown;
  display_name?: unknown;
  role?: unknown;
};

function usernameFromName(name: string) {
  return name
    .toLocaleLowerCase("vi-VN")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\u0111/g, "d")
    .replace(/\s+/g, "");
}

async function getOwnerContext() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return {
      supabase,
      userId: null,
      response: NextResponse.json(
        { error: "Chưa đăng nhập." },
        { status: 401 },
      ),
    };
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, is_active")
    .eq("id", user.id)
    .maybeSingle();
  if (!profile || !profile.is_active || profile.role !== "owner")
    return {
      supabase,
      userId: user.id,
      response: NextResponse.json(
        { error: "Chỉ chủ spa có quyền quản lý nhân viên." },
        { status: 403 },
      ),
    };
  return { supabase, userId: user.id, response: null };
}

export async function GET() {
  const { supabase, response } = await getOwnerContext();
  if (response) return response;
  const { data, error } = await supabase
    .from("profiles")
    .select("id, display_name, role, is_active, created_at")
    .order("display_name");
  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  const { response } = await getOwnerContext();
  if (response) return response;
  const body = (await request.json()) as EmployeePayload;
  const password = typeof body.password === "string" ? body.password : "";
  const displayName =
    typeof body.display_name === "string" ? body.display_name.trim() : "";
  const role = body.role === "owner" ? "owner" : "staff";
  const username = usernameFromName(displayName);
  const email = username ? `${username}@mombicare.vn` : "";
  if (!email || password.length < 8 || !displayName)
    return NextResponse.json(
      { error: "Cần tên và mật khẩu ít nhất 8 ký tự." },
      { status: 400 },
    );

  try {
    const admin = createAdminClient();
    const { data, error } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { display_name: displayName },
    });
    if (error || !data.user)
      return NextResponse.json(
        { error: error?.message ?? "Không tạo được tài khoản." },
        { status: 400 },
      );
    const { error: profileError } = await admin
      .from("profiles")
      .update({ display_name: displayName, role, is_active: true })
      .eq("id", data.user.id);
    if (profileError)
      return NextResponse.json(
        { error: profileError.message },
        { status: 400 },
      );
    return NextResponse.json({ id: data.user.id }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Thiếu cấu hình SUPABASE_SERVICE_ROLE_KEY trên máy chủ." },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  const { supabase, response } = await getOwnerContext();
  if (response) return response;
  const body = (await request.json()) as {
    id?: unknown;
    display_name?: unknown;
    role?: unknown;
    is_active?: unknown;
  };
  if (typeof body.id !== "string")
    return NextResponse.json({ error: "Thiếu mã nhân viên." }, { status: 400 });
  const update: {
    display_name?: string;
    role?: "owner" | "staff";
    is_active?: boolean;
  } = {};
  if (typeof body.display_name === "string" && body.display_name.trim())
    update.display_name = body.display_name.trim();
  if (body.role === "owner" || body.role === "staff") update.role = body.role;
  if (typeof body.is_active === "boolean") update.is_active = body.is_active;
  if (Object.keys(update).length === 0)
    return NextResponse.json(
      { error: "Không có thay đổi nào." },
      { status: 400 },
    );
  const { error } = await supabase
    .from("profiles")
    .update(update)
    .eq("id", body.id);
  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const { supabase, userId, response } = await getOwnerContext();
  if (response) return response;
  const body = (await request.json()) as { id?: unknown };
  if (typeof body.id !== "string")
    return NextResponse.json({ error: "Thiếu mã nhân viên." }, { status: 400 });
  if (body.id === userId)
    return NextResponse.json(
      { error: "Không thể tự xóa tài khoản chủ spa đang đăng nhập." },
      { status: 400 },
    );

  const { data: target, error: targetError } = await supabase
    .from("profiles")
    .select("display_name, role")
    .eq("id", body.id)
    .maybeSingle();
  if (targetError || !target)
    return NextResponse.json(
      { error: "Không tìm thấy tài khoản cần xóa." },
      { status: 404 },
    );
  if (target.role === "owner")
    return NextResponse.json(
      {
        error:
          "Không thể xóa tài khoản chủ spa. Hãy đổi quyền hoặc tạm ngưng tài khoản này.",
      },
      { status: 400 },
    );

  try {
    const admin = createAdminClient();
    const [technicianUsage, consultantUsage, ledgerUsage] = await Promise.all([
      admin
        .from("revenue_entries")
        .select("id", { count: "exact", head: true })
        .eq("technician_id", body.id),
      admin
        .from("revenue_entries")
        .select("id", { count: "exact", head: true })
        .eq("consultant_id", body.id),
      admin
        .from("commission_ledger")
        .select("id", { count: "exact", head: true })
        .eq("employee_id", body.id),
    ]);
    if (technicianUsage.error || consultantUsage.error || ledgerUsage.error)
      return NextResponse.json(
        { error: "Không kiểm tra được dữ liệu liên quan trước khi xóa." },
        { status: 400 },
      );
    if (
      (technicianUsage.count ?? 0) +
        (consultantUsage.count ?? 0) +
        (ledgerUsage.count ?? 0) >
      0
    ) {
      return NextResponse.json(
        {
          error: `Không thể xóa hẳn ${target.display_name} vì đã có doanh thu hoặc hoa hồng. Hãy dùng Tạm ngưng để giữ số liệu đối soát.`,
        },
        { status: 409 },
      );
    }
    const { error } = await admin.auth.admin.deleteUser(body.id);
    if (error)
      return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      {
        error:
          "Không thể xóa tài khoản. Hãy kiểm tra cấu hình SUPABASE_SERVICE_ROLE_KEY.",
      },
      { status: 500 },
    );
  }
}
