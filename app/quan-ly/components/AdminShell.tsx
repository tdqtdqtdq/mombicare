"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { createClient } from "@/app/lib/supabase/client";
import type { Profile } from "../types";

const commonItems = [
  { href: "/quan-ly", label: "Tổng quan", icon: "◈" },
  { href: "/quan-ly/doanh-thu", label: "Nhập doanh thu", icon: "＋" },
  { href: "/quan-ly/hoa-hong", label: "Hoa hồng & lương", icon: "₫" },
];

const ownerItems = [
  { href: "/quan-ly/dich-vu", label: "Dịch vụ & quy tắc", icon: "◇" },
  { href: "/quan-ly/nhan-vien", label: "Nhân viên", icon: "♙" },
];

export function AdminShell({
  children,
  profile,
}: {
  children: ReactNode;
  profile: Profile;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [changingPassword, setChangingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const items =
    profile.role === "owner" ? [...commonItems, ...ownerItems] : commonItems;

  async function signOut() {
    await createClient().auth.signOut();
    router.replace("/quan-ly/dang-nhap");
    router.refresh();
  }

  async function changePassword() {
    if (newPassword.length < 8) {
      setPasswordMessage("Mật khẩu mới cần ít nhất 8 ký tự.");
      return;
    }
    const { error } = await createClient().auth.updateUser({
      password: newPassword,
    });
    setPasswordMessage(
      error
        ? error.message
        : "Đã đổi mật khẩu. Dùng mật khẩu mới ở lần đăng nhập sau.",
    );
    if (!error) {
      setNewPassword("");
      setChangingPassword(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f6f8f3] text-[#20301c]">
      <header className="border-b border-[#dce7d6] bg-[#fffefa]/95 px-4 py-3 backdrop-blur sm:px-7">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <Link href="/quan-ly" className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#72915d]">
              Mombi Care Spa
            </p>
            <p className="font-serif text-xl text-[#1c2619]">Sổ doanh thu</p>
          </Link>
          <div className="flex items-center gap-3 text-right">
            <div className="hidden sm:block">
              <p className="text-sm font-semibold">{profile.display_name}</p>
              <p className="text-xs text-[#71816c]">
                {profile.role === "owner" ? "Chủ spa" : "Nhân viên"}
              </p>
            </div>
            <button
              onClick={() => {
                setChangingPassword(true);
                setPasswordMessage("");
              }}
              className="rounded-xl border border-[#c9d8c2] px-3 py-2 text-xs font-bold text-[#40533b] transition hover:bg-[#edf4e8]"
            >
              Đổi mật khẩu
            </button>
            <button
              onClick={signOut}
              className="rounded-xl border border-[#c9d8c2] px-3 py-2 text-xs font-bold text-[#40533b] transition hover:bg-[#edf4e8]"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </header>
      {changingPassword && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[#1c2619]/30 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="font-serif text-2xl">Đổi mật khẩu</h2>
            <p className="mt-1 text-sm text-[#71816c]">
              Tự đặt mật khẩu mới cho tài khoản của bạn.
            </p>
            <input
              autoFocus
              type="password"
              minLength={8}
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              placeholder="Ít nhất 8 ký tự"
              className="field mt-4"
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setChangingPassword(false)}
                className="rounded-xl px-4 py-2 text-sm font-bold text-[#52664b]"
              >
                Hủy
              </button>
              <button
                onClick={() => void changePassword()}
                className="rounded-xl bg-[#24361e] px-4 py-2 text-sm font-bold text-white"
              >
                Lưu mật khẩu
              </button>
            </div>
            {passwordMessage && (
              <p className="mt-3 text-sm text-red-700">{passwordMessage}</p>
            )}
          </div>
        </div>
      )}

      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-7 lg:flex-row lg:py-8">
        <nav className="flex gap-2 overflow-x-auto pb-1 lg:w-56 lg:shrink-0 lg:flex-col lg:overflow-visible">
          {items.map((item) => {
            const active =
              item.href === "/quan-ly"
                ? pathname === item.href
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`inline-flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${active ? "bg-[#24361e] text-white shadow-md" : "text-[#52664b] hover:bg-[#e8f0e3]"}`}
              >
                <span aria-hidden="true" className="w-4 text-center">
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
          <Link
            href="/"
            className="mt-0 inline-flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-[#6a7d63] transition hover:bg-[#e8f0e3] lg:mt-3"
          >
            <span aria-hidden="true" className="w-4 text-center">
              ↗
            </span>
            Website công khai
          </Link>
        </nav>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
