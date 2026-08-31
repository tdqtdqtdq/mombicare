"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import type { AppRole, Profile } from "../../types";

type Employee = Profile & { created_at: string };

function loginName(name: string) {
  return name
    .toLocaleLowerCase("vi-VN")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/\s+/g, "");
}

export function EmployeesManager() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [form, setForm] = useState({
    display_name: "",
    password: "",
    role: "staff" as AppRole,
  });
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const response = await fetch("/api/quan-ly/nhan-vien", {
      cache: "no-store",
    });
    const result = (await response.json()) as {
      data?: Employee[];
      error?: string;
    };
    if (!response.ok) setMessage(result.error ?? "Không tải được nhân viên.");
    else setEmployees(result.data ?? []);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void load();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  async function createEmployee(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    const response = await fetch("/api/quan-ly/nhan-vien", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const result = (await response.json()) as { error?: string };
    if (!response.ok) setMessage(result.error ?? "Không tạo được tài khoản.");
    else {
      setForm({
        display_name: "",
        password: "",
        role: "staff",
      });
      setMessage("Đã tạo tài khoản và phân quyền.");
      await load();
    }
    setSaving(false);
  }

  async function updateEmployee(
    employee: Employee,
    update: Partial<Pick<Employee, "is_active" | "role">>,
  ) {
    const response = await fetch("/api/quan-ly/nhan-vien", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: employee.id, ...update }),
    });
    const result = (await response.json()) as { error?: string };
    setMessage(
      response.ok
        ? "Đã cập nhật phân quyền."
        : (result.error ?? "Không thể cập nhật."),
    );
    if (response.ok) await load();
  }

  async function deleteEmployee(employee: Employee) {
    if (
      !window.confirm(
        `Xóa hẳn tài khoản ${employee.display_name}? Chỉ xóa được tài khoản chưa có doanh thu hoặc hoa hồng.`,
      )
    )
      return;
    setSaving(true);
    setMessage("");
    const response = await fetch("/api/quan-ly/nhan-vien", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: employee.id }),
    });
    const result = (await response.json()) as { error?: string };
    setMessage(
      response.ok
        ? "Đã xóa hẳn tài khoản."
        : (result.error ?? "Không thể xóa tài khoản."),
    );
    if (response.ok) await load();
    setSaving(false);
  }

  return (
    <section>
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#6f9556]">
          Phân quyền đăng nhập
        </p>
        <h1 className="mt-1 font-serif text-4xl text-[#1c2619]">Nhân viên</h1>
        <p className="mt-2 text-sm text-[#66745f]">
          Tài khoản nhân viên chỉ thấy doanh thu và hoa hồng có liên quan đến
          chính họ.
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
      <form
        onSubmit={createEmployee}
        className="mt-6 rounded-2xl border border-[#d8e4d2] bg-white p-5 shadow-sm"
      >
        <h2 className="font-serif text-2xl">Tạo tài khoản mới</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <label className="text-sm font-semibold text-[#40533b]">
            Tên hiển thị
            <input
              required
              value={form.display_name}
              onChange={(event) =>
                setForm({ ...form, display_name: event.target.value })
              }
              className="field"
              placeholder="VD: Thu Hiếu"
            />
          </label>
          <label className="text-sm font-semibold text-[#40533b]">
            Mật khẩu tạm
            <input
              required
              minLength={8}
              type="password"
              value={form.password}
              onChange={(event) =>
                setForm({ ...form, password: event.target.value })
              }
              className="field"
            />
          </label>
          <label className="text-sm font-semibold text-[#40533b]">
            Vai trò
            <select
              value={form.role}
              onChange={(event) => {
                const role = event.target.value as AppRole;
                setForm({
                  ...form,
                  role,
                });
              }}
              className="field"
            >
              <option value="staff">Nhân viên</option>
              <option value="owner">Chủ spa</option>
            </select>
          </label>
        </div>
        <p className="mt-3 text-xs text-[#71816c]">
          Tên đăng nhập được tạo tự động từ tên hiển thị (không dấu, không
          khoảng trắng). Chủ spa tự đặt mật khẩu tạm khi tạo tài khoản mới.
        </p>
        <button
          disabled={saving}
          className="mt-5 rounded-xl bg-[#24361e] px-5 py-3 text-sm font-bold text-white disabled:opacity-50"
        >
          {saving ? "Đang tạo…" : "Tạo tài khoản"}
        </button>
      </form>
      <div className="mt-7 overflow-hidden rounded-2xl border border-[#d8e4d2] bg-white shadow-sm">
        <div className="border-b border-[#e5ede1] px-5 py-4">
          <h2 className="font-serif text-2xl">Danh sách tài khoản</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-[#f5f8f2] text-xs uppercase tracking-wide text-[#71816c]">
              <tr>
                <th className="px-5 py-3">Tên</th>
                <th className="px-5 py-3">Tên đăng nhập</th>
                <th className="px-5 py-3">Vai trò</th>
                <th className="px-5 py-3">Trạng thái</th>
                <th className="px-5 py-3">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee.id} className="border-t border-[#edf1ea]">
                  <td className="px-5 py-4 font-semibold">
                    {employee.display_name}
                  </td>
                  <td className="px-5 py-4 font-mono text-xs font-bold text-[#48643a]">
                    {employee.display_name === "Chủ spa"
                      ? "mombicare"
                      : loginName(employee.display_name)}
                  </td>
                  <td className="px-5 py-4">
                    <select
                      value={employee.role}
                      onChange={(event) =>
                        void updateEmployee(employee, {
                          role: event.target.value as AppRole,
                        })
                      }
                      className="rounded-lg border border-[#cfddc9] px-2 py-1.5 text-xs"
                    >
                      <option value="staff">Nhân viên</option>
                      <option value="owner">Chủ spa</option>
                    </select>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-bold ${employee.is_active ? "bg-[#edf4e8] text-[#50713c]" : "bg-red-50 text-red-700"}`}
                    >
                      {employee.is_active ? "Đang hoạt động" : "Đã tạm ngưng"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-4 whitespace-nowrap">
                      <button
                        disabled={saving}
                        onClick={() =>
                          void updateEmployee(employee, {
                            is_active: !employee.is_active,
                          })
                        }
                        className="text-xs font-bold text-[#526d42] hover:underline disabled:opacity-50"
                      >
                        {employee.is_active ? "Tạm ngưng" : "Kích hoạt"}
                      </button>
                      {employee.role === "staff" && (
                        <button
                          disabled={saving}
                          onClick={() => void deleteEmployee(employee)}
                          className="text-xs font-bold text-red-700 hover:underline disabled:opacity-50"
                        >
                          Xóa hẳn
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {employees.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-5 text-[#71816c]">
                    Chưa có tài khoản nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
