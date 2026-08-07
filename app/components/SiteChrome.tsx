"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const navItems = [
  { href: "/", label: "Trang chủ" },
  { href: "/#ve-mombi", label: "Về Mombi" },
  { href: "/dich-vu", label: "Dịch vụ" },
  { href: "/chuyen-nha", label: "Chuyện nhà Mombi" },
];

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#dfe8d7]/80 bg-[#fffdf9]/95 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:h-20 md:px-8">
        <Link href="/" className="flex min-h-11 min-w-11 items-center gap-2.5" aria-label="Mombi Care Spa - Trang chủ" onClick={() => setIsOpen(false)}>
          <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl border border-[#dfe8d7] bg-[#789f5d] shadow-sm sm:h-11 sm:w-11">
            <Image src="/img/logo-mombicare.jpg" alt="" fill sizes="44px" className="object-cover" priority />
          </span>
          <span className="hidden text-[10px] font-semibold uppercase leading-4 tracking-[0.16em] text-[#42543a] min-[370px]:block sm:text-[11px]">Mombi Care<br />Spa</span>
        </Link>
        <nav className="hidden items-center gap-7 text-[12px] font-medium uppercase tracking-[0.12em] text-[#526348] lg:flex" aria-label="Điều hướng chính">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="transition-colors hover:text-[#7da961]">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <a href="https://zalo.me/0934250909" target="_blank" rel="noopener noreferrer" className="inline-flex h-11 items-center rounded-full bg-[#789f5d] px-4 text-[10px] font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-[#64894b] sm:px-5 sm:text-xs">
            Đặt lịch
          </a>
          <button type="button" className="grid h-11 w-11 place-items-center rounded-full border border-[#cfdcc8] text-[#526348] transition hover:bg-[#edf3e8] lg:hidden" onClick={() => setIsOpen((value) => !value)} aria-expanded={isOpen} aria-controls="mobile-site-menu" aria-label={isOpen ? "Đóng menu" : "Mở menu"}>
            <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              {isOpen ? <><path d="M6 6l12 12" /><path d="M18 6L6 18" /></> : <><path d="M5 7h14" /><path d="M5 12h14" /><path d="M5 17h14" /></>}
            </svg>
          </button>
        </div>
      </div>

      <div id="mobile-site-menu" className={`absolute inset-x-0 top-full overflow-hidden border-b border-[#dfe8d7] bg-[#fffdf9] shadow-[0_18px_40px_rgba(43,60,35,.12)] transition-all duration-300 lg:hidden ${isOpen ? "visible max-h-[520px] opacity-100" : "invisible max-h-0 opacity-0"}`}>
        <nav className="mx-auto max-w-7xl px-4 pb-5 pt-2" aria-label="Điều hướng di động">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)} className="flex min-h-12 items-center justify-between border-b border-[#e7ede3] text-sm font-medium text-[#405137]">
              {item.label}<span aria-hidden="true" className="text-[#83a76b]">→</span>
            </Link>
          ))}
          <div className="grid grid-cols-2 gap-3 pt-4">
            <a href="tel:0934250909" className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#c8d8bf] text-xs font-semibold uppercase tracking-[0.1em] text-[#526348]">Gọi Mombi</a>
            <a href="https://zalo.me/0934250909" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#789f5d] text-xs font-semibold uppercase tracking-[0.1em] text-white">Nhắn Zalo</a>
          </div>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-[#26351f] px-5 py-10 text-[#dce8d3] md:px-8 md:py-12">
      <div className="mx-auto grid max-w-7xl gap-8 min-[360px]:grid-cols-2 md:grid-cols-[1.3fr_1fr_1fr] md:gap-10">
        <div className="min-[360px]:col-span-2 md:col-span-1">
          <div className="mb-5 flex items-center gap-3">
            <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-white/15 bg-[#789f5d]">
              <Image src="/img/logo-mombicare.jpg" alt="" fill sizes="48px" className="object-cover" />
            </span>
            <span className="text-xs font-semibold uppercase leading-5 tracking-[0.16em] text-white">Mombi Care Spa</span>
          </div>
          <p className="max-w-sm text-sm font-light leading-7">Một khoảng nghỉ vừa vặn giữa lòng Buôn Ma Thuột, nơi cơ thể được thả lỏng và làn da được chăm sóc bằng sự tận tâm.</p>
        </div>
        <div className="border-t border-white/10 pt-6 sm:border-0 sm:pt-0">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-white">Khám phá</p>
          <div className="flex flex-col gap-3 text-sm">
            <Link href="/chuyen-nha" className="inline-flex min-h-11 items-center hover:text-white">Chuyện nhà Mombi</Link>
            <Link href="/dich-vu/cham-soc-da" className="inline-flex min-h-11 items-center hover:text-white">Chăm sóc da</Link>
            <Link href="/dich-vu/massage-thu-gian" className="inline-flex min-h-11 items-center hover:text-white">Massage thư giãn</Link>
          </div>
        </div>
        <div className="border-t border-white/10 pt-6 sm:border-0 sm:pt-0">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-white">Liên hệ</p>
          <div className="space-y-3 text-sm font-light leading-6">
            <p>34 Trần Khánh Dư, TP. Buôn Ma Thuột</p>
            <a className="flex min-h-11 items-center hover:text-white" href="tel:0934250909">0934 250 909</a>
            <a className="flex min-h-11 items-center break-all hover:text-white" href="mailto:mombicarespa@gmail.com">mombicarespa@gmail.com</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
