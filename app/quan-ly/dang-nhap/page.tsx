import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Đăng nhập quản lý" };

export default function ManagementLoginPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#edf4e8] px-5 py-10">
      <section className="w-full max-w-md rounded-[2rem] border border-[#d6e3ce] bg-[#fffdfa] p-7 shadow-[0_25px_70px_rgba(28,40,24,0.12)] sm:p-10">
        <Link href="/" className="text-xs font-bold uppercase tracking-[0.18em] text-[#6f9556]">← Mombi Care Spa</Link>
        <p className="mt-8 text-xs font-bold uppercase tracking-[0.2em] text-[#6f9556]">Nội bộ</p>
        <h1 className="mt-2 font-serif text-4xl font-normal text-[#1c2619]">Quản lý doanh thu</h1>
        <p className="mt-3 text-sm leading-6 text-[#586c52]">Đăng nhập bằng tài khoản được chủ spa cấp. Dữ liệu lương và hoa hồng không hiển thị công khai.</p>
        <Suspense fallback={<div className="mt-8 h-44 animate-pulse rounded-xl bg-[#edf4e8]" />}>
          <LoginForm />
        </Suspense>
      </section>
    </main>
  );
}
