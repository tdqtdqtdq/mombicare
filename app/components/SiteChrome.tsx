import Image from "next/image";
import Link from "next/link";

const navItems = [
  { href: "/", label: "Trang chủ" },
  { href: "/#ve-mombi", label: "Về Mombi" },
  { href: "/dich-vu", label: "Dịch vụ" },
  { href: "/chuyen-nha", label: "Chuyện nhà Mombi" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#dfe8d7]/80 bg-[#fffdf9]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 md:px-8">
        <Link href="/" className="relative h-11 w-32 shrink-0" aria-label="Mombi Care Spa - Trang chủ">
          <Image src="/img/logo-mombicare.jpg" alt="Mombi Care Spa" fill sizes="128px" className="object-contain object-left" priority />
        </Link>
        <nav className="hidden items-center gap-7 text-[12px] font-medium uppercase tracking-[0.12em] text-[#526348] lg:flex" aria-label="Điều hướng chính">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="transition-colors hover:text-[#7da961]">
              {item.label}
            </Link>
          ))}
        </nav>
        <a href="https://zalo.me/0934250909" target="_blank" rel="noopener noreferrer" className="rounded-full bg-[#789f5d] px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-[#64894b]">
          Đặt lịch
        </a>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-[#26351f] px-5 py-12 text-[#dce8d3] md:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <div className="relative mb-5 h-12 w-36 overflow-hidden rounded-lg bg-white">
            <Image src="/img/logo-mombicare.jpg" alt="Mombi Care Spa" fill sizes="144px" className="object-contain p-1" />
          </div>
          <p className="max-w-sm text-sm font-light leading-7">Một khoảng nghỉ vừa vặn giữa lòng Buôn Ma Thuột, nơi cơ thể được thả lỏng và làn da được chăm sóc bằng sự tận tâm.</p>
        </div>
        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-white">Khám phá</p>
          <div className="flex flex-col gap-3 text-sm">
            <Link href="/chuyen-nha" className="hover:text-white">Chuyện nhà Mombi</Link>
            <Link href="/dich-vu/cham-soc-da" className="hover:text-white">Chăm sóc da</Link>
            <Link href="/dich-vu/massage-thu-gian" className="hover:text-white">Massage thư giãn</Link>
          </div>
        </div>
        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-white">Liên hệ</p>
          <div className="space-y-3 text-sm font-light leading-6">
            <p>34 Trần Khánh Dư, TP. Buôn Ma Thuột</p>
            <a className="block hover:text-white" href="tel:0934250909">0934 250 909</a>
            <a className="block hover:text-white" href="mailto:mombicarespa@gmail.com">mombicarespa@gmail.com</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
