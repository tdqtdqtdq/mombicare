"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const navItems = [
  { href: "/", label: "Trang chủ" },
  { href: "/#ve-mombi", label: "Về Mombi" },
  { href: "/dich-vu", label: "Dịch vụ" },
  { href: "/spa-buon-ma-thuot", label: "Spa BMT" },
  { href: "/uu-dai-su-kien", label: "Dịp lễ & Sự kiện" },
  { href: "/chuyen-nha", label: "Chuyện nhà Mombi" },
];

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const [isServicesHovered, setIsServicesHovered] = useState(false);

  return (
    <header className="sticky top-0 z-50 transition-all duration-300 glass-header">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:h-20 md:px-8">
        {/* Brand Logo & Name */}
        <Link 
          href="/" 
          className="group flex min-h-11 items-center gap-3" 
          aria-label="Mombi Care Spa - Trang chủ" 
          onClick={() => setIsOpen(false)}
        >
          <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-2xl border border-[#d2dfcb] bg-[#6f9556] shadow-sm transition duration-300 group-hover:scale-105 sm:h-11 sm:w-11">
            <Image src="/img/logo-mombicare.jpg" alt="Mombi Care Spa Logo" fill sizes="44px" className="object-cover" priority />
          </span>
          <div className="flex flex-col">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#22331d] sm:text-xs">
              Mombi Care
            </span>
            <span className="text-[9px] font-medium tracking-[0.24em] text-[#6f9556]">
              SPA & WELLNESS
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-7 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#3d5035] lg:flex" aria-label="Điều hướng chính">
          <Link href="/" className="transition hover:text-[#6f9556]">
            Trang chủ
          </Link>
          
          <div 
            className="relative py-3" 
            onMouseEnter={() => setIsServicesHovered(true)} 
            onMouseLeave={() => setIsServicesHovered(false)}
          >
            <Link 
              href="/dich-vu" 
              className={`flex items-center gap-1 transition ${isServicesHovered ? "text-[#6f9556]" : "hover:text-[#6f9556]"}`}
            >
              Dịch vụ
              <svg className={`h-3 w-3 transition-transform duration-200 ${isServicesHovered ? "rotate-180 text-[#6f9556]" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
              </svg>
            </Link>

            {/* Dropdown Menu */}
            <div className={`absolute left-1/2 top-full z-50 w-72 -translate-x-1/2 pt-2 transition-all duration-300 ${isServicesHovered ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0"}`}>
              <div className="overflow-hidden rounded-2xl border border-[#dce7d6] bg-[#fffdf9]/98 p-2 shadow-[0_20px_50px_rgba(28,40,24,0.12)] backdrop-blur-xl">
                <Link 
                  href="/dich-vu/cham-soc-da" 
                  className="group flex flex-col rounded-xl p-3 transition hover:bg-[#edf4e8]"
                >
                  <span className="text-[11px] font-bold tracking-wider text-[#263720] group-hover:text-[#6f9556]">
                    ✨ CHĂM SÓC DA
                  </span>
                  <span className="mt-0.5 text-[11px] font-light text-[#63755c]">
                    Cấy HA, chăm sóc chuyên sâu & phục hồi
                  </span>
                </Link>
                <div className="my-1 border-t border-[#edf3e8]" />
                <Link 
                  href="/dich-vu/massage-thu-gian" 
                  className="group flex flex-col rounded-xl p-3 transition hover:bg-[#edf4e8]"
                >
                  <span className="text-[11px] font-bold tracking-wider text-[#263720] group-hover:text-[#6f9556]">
                    🌿 MASSAGE & THƯ GIÃN
                  </span>
                  <span className="mt-0.5 text-[11px] font-light text-[#63755c]">
                    Gội đầu dưỡng sinh, massage body & cổ vai gáy
                  </span>
                </Link>
              </div>
            </div>
          </div>

          <Link href="/#ve-mombi" className="transition hover:text-[#6f9556]">
            Về Mombi
          </Link>
          <Link href="/spa-buon-ma-thuot" className="transition hover:text-[#6f9556]">
            Spa BMT
          </Link>
          <Link href="/uu-dai-su-kien" className="transition hover:text-[#6f9556]">
            Dịp lễ
          </Link>
          <Link href="/chuyen-nha" className="transition hover:text-[#6f9556]">
            Chuyện nhà
          </Link>
        </nav>

        {/* Right Status Badge & Primary CTA */}
        <div className="flex items-center gap-3">
          {/* Open Badge Indicator */}
          <div className="hidden items-center gap-2 rounded-full border border-[#d6e3ce] bg-[#edf4e8]/80 px-3.5 py-1.5 text-[10px] font-semibold text-[#445b3a] xl:flex">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#6f9556] opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#6f9556]"></span>
            </span>
            Mở cửa cả ngày & đêm
          </div>

          <a 
            href="https://zalo.me/0934250909" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="group relative inline-flex h-11 items-center justify-center overflow-hidden rounded-full bg-[#24361e] px-5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white shadow-[0_10px_25px_rgba(36,54,30,0.22)] transition-all duration-300 hover:bg-[#344d2c] hover:shadow-[0_12px_30px_rgba(36,54,30,0.3)] sm:px-6"
          >
            <span className="relative z-10 flex items-center gap-2">
              Đặt lịch hẹn
              <span className="text-xs transition-transform duration-200 group-hover:translate-x-0.5">→</span>
            </span>
          </a>

          {/* Mobile Menu Toggle Button */}
          <button 
            type="button" 
            className="grid h-11 w-11 place-items-center rounded-2xl border border-[#d4e1ce] bg-white/80 text-[#3d5035] transition hover:bg-[#edf4e8] lg:hidden" 
            onClick={() => setIsOpen((value) => !value)} 
            aria-expanded={isOpen} 
            aria-controls="mobile-site-menu" 
            aria-label={isOpen ? "Đóng menu" : "Mở menu"}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {isOpen ? (
                <>
                  <path d="M6 6l12 12" />
                  <path d="M18 6L6 18" />
                </>
              ) : (
                <>
                  <path d="M4 7h16" />
                  <path d="M4 12h16" />
                  <path d="M4 17h16" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <div 
        id="mobile-site-menu" 
        className={`absolute inset-x-0 top-full overflow-hidden border-b border-[#dce7d6] bg-[#fffdf9]/98 shadow-[0_25px_50px_rgba(28,40,24,0.16)] backdrop-blur-2xl transition-all duration-300 lg:hidden ${
          isOpen ? "visible max-h-[580px] opacity-100" : "invisible max-h-0 opacity-0"
        }`}
      >
        <nav className="mx-auto max-w-7xl px-5 pb-6 pt-3" aria-label="Điều hướng di động">
          <div className="mb-3 flex items-center justify-between rounded-xl bg-[#edf4e8] px-4 py-2.5 text-xs font-semibold text-[#445b3a]">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#6f9556] radar-live" />
              Mở cửa phục vụ cả ngày & đêm
            </span>
            <span className="text-[10px] uppercase tracking-wider text-[#6f9556]">34 Trần Khánh Dư</span>
          </div>

          {navItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href} 
              onClick={() => setIsOpen(false)} 
              className="flex min-h-12 items-center justify-between border-b border-[#edf3e8] text-sm font-medium text-[#2d3f27] transition hover:text-[#6f9556]"
            >
              <span>{item.label}</span>
              <span aria-hidden="true" className="text-sm text-[#8bb371]">→</span>
            </Link>
          ))}

          <div className="grid grid-cols-2 gap-3 pt-5">
            <a 
              href="tel:0934250909" 
              className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-[#ccdcc6] bg-white text-xs font-bold uppercase tracking-wider text-[#3d5035] shadow-sm transition active:scale-95"
            >
              📞 0934 250 909
            </a>
            <a 
              href="https://zalo.me/0934250909" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-[#24361e] text-xs font-bold uppercase tracking-wider text-white shadow-md transition active:scale-95"
            >
              💬 Nhắn Zalo
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="relative border-t border-[#34482c] bg-[#162214] px-5 py-14 text-[#d7e5d1] md:px-10 md:py-20">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute left-1/4 top-0 h-96 w-96 -translate-y-1/2 rounded-full bg-[#6f9556]/10 blur-3xl" />
      <div className="pointer-events-none absolute right-10 bottom-0 h-80 w-80 rounded-full bg-[#c6a35d]/10 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl gap-10 min-[480px]:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.1fr] lg:gap-12">
        {/* Col 1: Brand & Slogan */}
        <div className="min-[480px]:col-span-2 lg:col-span-1">
          <div className="mb-6 flex items-center gap-3.5">
            <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl border border-white/20 bg-[#6f9556] shadow-md">
              <Image src="/img/logo-mombicare.jpg" alt="Mombi Care Spa" fill sizes="56px" className="object-cover" />
            </span>
            <div>
              <span className="block text-sm font-bold uppercase tracking-[0.24em] text-white">Mombi Care Spa</span>
              <span className="text-[10px] font-medium tracking-[0.2em] text-[#a9c994]">SANCTUARY OF WELLNESS</span>
            </div>
          </div>
          <p className="max-w-sm text-sm font-light leading-7 text-[#b6caba]">
            Một nhịp nghỉ vừa vặn giữa lòng phố Buôn Ma Thuột. Nơi làn da được chăm sóc dịu dàng và cơ thể tìm lại sự cân bằng sau chuỗi ngày bận rộn.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs text-[#a9c994]">
            <span className="h-2 w-2 rounded-full bg-[#8bc46d] radar-live" />
            Phục vụ ngày & đêm • Không bắt buộc tip
          </div>
        </div>

        {/* Col 2: Dịch vụ nổi bật */}
        <div className="border-t border-white/10 pt-6 min-[480px]:border-0 min-[480px]:pt-0">
          <p className="mb-5 font-serif text-base font-semibold tracking-wider text-white">Dịch vụ nổi bật</p>
          <ul className="flex flex-col gap-3 text-sm font-light text-[#bed2be]">
            <li><Link href="/dich-vu/cham-soc-da" className="transition hover:text-white">Cấy HA căng bóng da</Link></li>
            <li><Link href="/dich-vu/cham-soc-da" className="transition hover:text-white">Chăm sóc da chuyên sâu</Link></li>
            <li><Link href="/dich-vu/massage-thu-gian" className="transition hover:text-white">Gội đầu dưỡng sinh</Link></li>
            <li><Link href="/dich-vu/massage-thu-gian" className="transition hover:text-white">Massage cổ vai gáy</Link></li>
            <li><Link href="/dich-vu/massage-thu-gian" className="transition hover:text-white">Massage body tinh dầu</Link></li>
          </ul>
        </div>

        {/* Col 3: Khám phá */}
        <div className="border-t border-white/10 pt-6 min-[480px]:border-0 min-[480px]:pt-0">
          <p className="mb-5 font-serif text-base font-semibold tracking-wider text-white">Khám phá & Cẩm nang</p>
          <ul className="flex flex-col gap-3 text-sm font-light text-[#bed2be]">
            <li><Link href="/#ve-mombi" className="transition hover:text-white">Triết lý chăm sóc</Link></li>
            <li><Link href="/spa-buon-ma-thuot" className="transition hover:text-white">Spa tại Buôn Ma Thuột</Link></li>
            <li><Link href="/uu-dai-su-kien" className="transition hover:text-white">Dịp lễ & Sự kiện</Link></li>
            <li><Link href="/chuyen-nha" className="transition hover:text-white">Chuyện nhà Mombi (Blog)</Link></li>
            <li><a href="https://zalo.me/0934250909" target="_blank" rel="noopener noreferrer" className="transition hover:text-white">Tư vấn đặt lịch nhanh</a></li>
          </ul>
        </div>

        {/* Col 4: Liên hệ & Địa chỉ */}
        <div className="border-t border-white/10 pt-6 min-[480px]:border-0 min-[480px]:pt-0">
          <p className="mb-5 font-serif text-base font-semibold tracking-wider text-white">Liên hệ Mombi</p>
          <div className="space-y-3.5 text-sm font-light leading-6 text-[#bed2be]">
            <a 
              className="group flex items-start gap-2.5 transition hover:text-white" 
              href="https://www.google.com/maps/search/?api=1&query=Mombi+Care+Spa+34+Tran+Khanh+Du+Buon+Ma+Thuot" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <span className="text-[#8bc46d]">📍</span>
              <span>34 Trần Khánh Dư, phường Tân Lợi, TP. Buôn Ma Thuột, Đắk Lắk</span>
            </a>
            <a className="flex items-center gap-2.5 transition hover:text-white" href="tel:0934250909">
              <span className="text-[#8bc46d]">📞</span>
              <strong className="font-semibold text-white">0934 250 909</strong>
            </a>
            <a className="flex items-center gap-2.5 transition hover:text-white" href="mailto:mombicarespa@gmail.com">
              <span className="text-[#8bc46d]">✉️</span>
              <span>mombicarespa@gmail.com</span>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mx-auto mt-12 flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs font-light text-[#8ba58c] sm:flex-row">
        <p>© {new Date().getFullYear()} Mombi Care Spa. Tất cả quyền được bảo lưu.</p>
        <p className="flex items-center gap-3">
          <span>Thiết kế &amp; Vận hành với trọn vẹn yêu thương</span>
          <span className="h-1 w-1 rounded-full bg-[#8ba58c]"></span>
          <span>BMT, Đắk Lắk</span>
        </p>
      </div>
    </footer>
  );
}

export function LuxuryFloatingConcierge() {
  return (
    <>
      {/* Desktop Floating Pill Concierge */}
      <aside 
        aria-label="Tư vấn trực tuyến Mombi" 
        className="fixed bottom-8 right-8 z-40 hidden items-center gap-2.5 rounded-full border border-white/30 bg-[#1e2f1a]/90 px-5 py-3 text-white shadow-[0_18px_45px_rgba(20,35,16,0.35)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:bg-[#283e23] hover:shadow-[0_22px_55px_rgba(20,35,16,0.45)] md:flex"
      >
        <a 
          href="https://zalo.me/0934250909" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wider text-white"
        >
          <span className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#8bc46d] opacity-75"></span>
            <span className="relative inline-flex h-3 w-3 rounded-full bg-[#8bc46d]"></span>
          </span>
          <span>Nhắn Zalo Mombi</span>
        </a>
        <span className="h-4 w-px bg-white/20" />
        <a 
          href="tel:0934250909" 
          className="text-xs text-[#a9c994] transition hover:text-white"
          title="Gọi hotline"
        >
          0934.250.909
        </a>
      </aside>

      {/* Mobile Bottom Navigation Quick Action Bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#d8e5d3] bg-[#fffdfa]/95 px-3 py-2.5 shadow-[0_-10px_30px_rgba(30,45,24,0.1)] backdrop-blur-xl md:hidden">
        <div className="mx-auto grid grid-cols-3 gap-2">
          <Link 
            href="/dich-vu"
            className="flex flex-col items-center justify-center rounded-xl bg-[#edf4e8] py-2 text-[10px] font-bold uppercase tracking-wider text-[#35492e] active:scale-95"
          >
            <span>🌿</span>
            <span>Bảng Giá</span>
          </Link>
          <a 
            href="tel:0934250909"
            className="flex flex-col items-center justify-center rounded-xl border border-[#cfddc9] bg-white py-2 text-[10px] font-bold uppercase tracking-wider text-[#35492e] active:scale-95"
          >
            <span>📞</span>
            <span>Gọi Mombi</span>
          </a>
          <a 
            href="https://zalo.me/0934250909"
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex flex-col items-center justify-center rounded-xl bg-[#24361e] py-2 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm active:scale-95"
          >
            <span>💬</span>
            <span>Nhắn Zalo</span>
          </a>
        </div>
      </div>
    </>
  );
}
