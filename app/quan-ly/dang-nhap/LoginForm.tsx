"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/app/lib/supabase/client";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(
    searchParams.get("error") === "inactive"
      ? "Tài khoản của bạn đang bị tạm ngưng."
      : "",
  );
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const normalized = username
      .trim()
      .toLocaleLowerCase("vi-VN")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d");
    const email = username.includes("@")
      ? username.trim()
      : normalized === "mombicare"
        ? "chuspa@mombicare.vn"
        : `${normalized}@mombicare.vn`;
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage("Email hoặc mật khẩu chưa đúng.");
      setLoading(false);
      return;
    }

    router.replace("/quan-ly");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-5">
      <label className="block text-sm font-medium text-[#34462e]">
        Tên đăng nhập
        <input
          required
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          className="mt-2 h-12 w-full rounded-xl border border-[#cfddc9] bg-white px-4 outline-none transition focus:border-[#6f9556] focus:ring-4 focus:ring-[#6f9556]/10"
          placeholder="Mombicare hoặc tên nhân viên"
          autoCapitalize="none"
        />
      </label>
      <label className="block text-sm font-medium text-[#34462e]">
        Mật khẩu
        <input
          required
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mt-2 h-12 w-full rounded-xl border border-[#cfddc9] bg-white px-4 outline-none transition focus:border-[#6f9556] focus:ring-4 focus:ring-[#6f9556]/10"
          placeholder="••••••••"
        />
      </label>
      {message && (
        <p
          role="alert"
          className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {message}
        </p>
      )}
      <button
        disabled={loading}
        className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-[#24361e] px-5 text-sm font-bold text-white transition hover:bg-[#395330] disabled:cursor-wait disabled:opacity-60"
      >
        {loading ? "Đang đăng nhập…" : "Đăng nhập quản lý"}
      </button>
    </form>
  );
}
