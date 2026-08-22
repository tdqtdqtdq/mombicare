"use client";

import {useState} from "react";
import Image from "next/image";
import Link from "next/link";
import {SiteFooter} from "./SiteChrome";

type HomeArticle = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  image?: string;
  date: string;
};

const serviceCategories = [
  {
    number: "01",
    title: "Chăm sóc da",
    subtitle: "Nuôi dưỡng & phục hồi",
    description: "Lắng nghe làn da trước khi lựa chọn các bước làm sạch, chăm sóc và phục hồi phù hợp.",
    image: "/img/skin-care.jpg",
    href: "/dich-vu/cham-soc-da",
    highlights: ["Cấy HA căng bóng", "Chăm sóc chuyên sâu", "Lấy nhân mụn"],
  },
  {
    number: "02",
    title: "Massage thư giãn",
    subtitle: "Thả lỏng & cân bằng",
    description: "Những liệu trình được điều chỉnh vừa lực để cơ thể chậm lại và tìm về trạng thái dễ chịu.",
    image: "/img/massage body mombi care spa.jpg",
    href: "/dich-vu/massage-thu-gian",
    highlights: ["Gội đầu dưỡng sinh", "Massage cổ vai gáy", "Massage body"],
  },
];

const testimonials = [
  {
    name: "Trần Mai Anh",
    service: "Gội đầu dưỡng sinh",
    quote: "Không gian rất yên tĩnh, kỹ thuật viên chăm sóc vừa lực và chu đáo. Mình có cảm giác được nghỉ thật sự sau một tuần bận rộn.",
  },
  {
    name: "Nguyễn Hà My",
    service: "Chăm sóc da",
    quote: "Mombi tư vấn nhẹ nhàng, không tạo áp lực mua thêm liệu trình. Các bước chăm sóc kỹ, dụng cụ sạch và làn da dễ chịu hơn sau buổi làm.",
  },
  {
    name: "Lê Hoàng Ngọc",
    service: "Massage body",
    quote: "Mình thích nhất mùi hương dịu và không gian riêng tư. Sau liệu trình cơ thể nhẹ hơn, phần vai gáy cũng được thả lỏng rõ rệt.",
  },
];

const faqs = [
  {
    question: "Mombi có chỗ đậu ô tô và xe máy không?",
    answer: "Có. Mombi có khu vực đậu xe thuận tiện ngay phía trước spa để bạn an tâm tận hưởng trọn vẹn thời gian nghỉ ngơi.",
  },
  {
    question: "Giá dịch vụ đã bao gồm tiền tip chưa?",
    answer: "Mức giá trên bảng dịch vụ là chi phí của liệu trình. Khách hàng không bắt buộc tip và Mombi luôn xác nhận dịch vụ trước khi bắt đầu.",
  },
  {
    question: "Mombi có phục vụ khách nam không?",
    answer: "Có. Mombi chào đón cả khách nam và nữ, đồng thời chuẩn bị không gian phù hợp để đảm bảo sự riêng tư và thoải mái.",
  },
  {
    question: "Nên đặt lịch trước bao lâu?",
    answer: "Bạn nên nhắn Mombi trước khoảng 2 giờ để spa có thể chuẩn bị phòng và sắp xếp kỹ thuật viên phù hợp với nhu cầu của bạn.",
  },
];

const ArrowIcon = () => (
  <svg aria-hidden="true" width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M3 9h11M10 5l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function HomeClient({cmsArticles}: {cmsArticles: HomeArticle[]}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <main className="min-h-screen overflow-hidden bg-[#f8f7f2] text-[#26351f]">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes heroReveal { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes heroZoom { from { transform: scale(1.04); } to { transform: scale(1); } }
        .hero-reveal { animation: heroReveal .9s cubic-bezier(.2,.75,.25,1) both; }
        .hero-reveal-delay { animation: heroReveal .9s .18s cubic-bezier(.2,.75,.25,1) both; }
        .hero-reveal-late { animation: heroReveal .9s .34s cubic-bezier(.2,.75,.25,1) both; }
        .hero-image { animation: heroZoom 14s cubic-bezier(.2,.7,.2,1) both; }
        @media (prefers-reduced-motion: reduce) { .hero-reveal, .hero-reveal-delay, .hero-reveal-late, .hero-image { animation: none; } }
      `}} />

      <section className="relative flex min-h-[max(720px,100svh)] w-full items-center overflow-hidden bg-[#1d2b1a] text-white md:h-[100svh] md:max-h-[980px] md:min-h-[760px]">
        <div className="pointer-events-none absolute inset-0">
          <Image src="/img/landing-1.jpg" alt="Không gian xanh và sự chăm sóc tận tâm tại Mombi Care Spa" fill priority sizes="100vw" className="hero-image object-cover object-[52%_63%] md:object-[center_62%]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#142014]/95 via-[#1b2919]/68 to-[#172115]/12" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#10190f]/90 via-transparent to-[#10190f]/35" />
          <div className="absolute inset-0 opacity-[0.16]" style={{backgroundImage: "radial-gradient(circle at 72% 38%, rgba(223,244,206,.9) 0, transparent 31%)"}} />
        </div>

        <header className="absolute inset-x-0 top-0 z-50 border-b border-white/15">
            <div className="mx-auto flex h-[72px] max-w-[1380px] items-center justify-between px-4 md:h-[96px] md:px-10">
            <Link href="/" className="flex items-center gap-3" aria-label="Mombi Care Spa - Trang chủ">
              <span className="relative h-11 w-11 overflow-hidden rounded-xl border border-white/20 shadow-lg md:h-14 md:w-14">
                <Image src="/img/logo-mombicare.jpg" alt="Mombi Care Spa" fill sizes="56px" priority className="object-cover" />
              </span>
              <span className="hidden text-[9px] font-semibold uppercase leading-4 tracking-[0.16em] text-white/85 min-[370px]:block sm:text-[10px] sm:tracking-[0.22em]">Mombi Care<br />Spa</span>
            </Link>

            <nav className="hidden items-center gap-5 text-[10px] font-semibold uppercase tracking-[0.08em] lg:flex xl:text-[11px]" aria-label="Điều hướng chính">
              <Link href="/" className="text-[#c7e4b3]">Trang chủ</Link>
              <div className="relative py-2" onMouseEnter={() => setIsDropdownOpen(true)} onMouseLeave={() => setIsDropdownOpen(false)}>
                <Link href="/dich-vu" className={`transition-colors ${isDropdownOpen ? "text-[#c7e4b3]" : "hover:text-[#c7e4b3]"}`}>Dịch vụ</Link>
                <div className={`absolute left-1/2 top-full z-50 w-60 -translate-x-1/2 pt-3 transition-all duration-300 ${isDropdownOpen ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0"}`}>
                  <div className="flex flex-col overflow-hidden rounded-2xl border border-white/15 bg-[#f9faf7] py-2 text-[#526348] shadow-2xl">
                    <Link href="/dich-vu/cham-soc-da" className="px-6 py-3 text-left text-[10px] tracking-widest transition hover:bg-[#f1f5ed] hover:text-[#729557]">CHĂM SÓC DA</Link>
                    <Link href="/dich-vu/massage-thu-gian" className="px-6 py-3 text-left text-[10px] tracking-widest transition hover:bg-[#f1f5ed] hover:text-[#729557]">MASSAGE THƯ GIÃN</Link>
                  </div>
                </div>
              </div>
              <Link href="#ve-mombi" className="transition-colors hover:text-[#c7e4b3]">Về Mombi</Link>
              <Link href="/spa-buon-ma-thuot" className="transition-colors hover:text-[#c7e4b3]">Spa BMT</Link>
              <Link href="/uu-dai-su-kien" className="transition-colors hover:text-[#c7e4b3]">Dịp lễ</Link>
              <Link href="/chuyen-nha" className="transition-colors hover:text-[#c7e4b3]">Chuyện nhà Mombi</Link>
              <Link href="#lien-he" className="transition-colors hover:text-[#c7e4b3]">Liên hệ</Link>
            </nav>

            <div className="flex items-center gap-3">
              <a href="https://zalo.me/0934250909" target="_blank" rel="noopener noreferrer" className="hidden rounded-full border border-white/25 bg-white/10 px-5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.16em] backdrop-blur-md transition hover:bg-white hover:text-[#24341f] sm:inline-flex">Đặt lịch</a>
              <button className="rounded-full border border-white/20 bg-white/10 p-2.5 text-white backdrop-blur-md transition hover:bg-white/20 lg:hidden" onClick={() => setIsMobileMenuOpen((value) => !value)} aria-label={isMobileMenuOpen ? "Đóng menu" : "Mở menu"}>
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{isMobileMenuOpen ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M4 6h16M4 12h16M4 18h16" />}</svg>
              </button>
            </div>
          </div>
        </header>

        <div className={`absolute left-0 top-[72px] z-40 w-full overflow-hidden border-b border-[#e4edd9] bg-white shadow-2xl transition-all duration-300 md:top-[96px] lg:hidden ${isMobileMenuOpen ? "max-h-[520px] opacity-100" : "max-h-0 opacity-0"}`}>
          <nav className="flex flex-col px-6 py-4 text-xs uppercase tracking-widest text-[#5c6e51]">
            <Link href="/" className="border-b border-[#edf2e9] py-4" onClick={() => setIsMobileMenuOpen(false)}>Trang chủ</Link>
            <div className="flex flex-col border-b border-[#edf2e9]">
              <button className="flex items-center justify-between py-4 text-left uppercase" onClick={() => setIsMobileServicesOpen((value) => !value)}>
                Dịch vụ
                <svg className={`h-4 w-4 transition-transform ${isMobileServicesOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
              </button>
              <div className={`ml-2 flex flex-col overflow-hidden border-l-2 border-[#8bb96e]/30 pl-4 transition-all ${isMobileServicesOpen ? "mb-4 max-h-40" : "max-h-0"}`}>
                <Link href="/dich-vu/cham-soc-da" className="flex min-h-11 items-center" onClick={() => setIsMobileMenuOpen(false)}>Chăm sóc da</Link>
                <Link href="/dich-vu/massage-thu-gian" className="flex min-h-11 items-center" onClick={() => setIsMobileMenuOpen(false)}>Massage thư giãn</Link>
              </div>
            </div>
            <Link href="#ve-mombi" className="border-b border-[#edf2e9] py-4" onClick={() => setIsMobileMenuOpen(false)}>Về Mombi</Link>
            <Link href="/spa-buon-ma-thuot" className="border-b border-[#edf2e9] py-4" onClick={() => setIsMobileMenuOpen(false)}>Spa Buôn Ma Thuột</Link>
            <Link href="/uu-dai-su-kien" className="border-b border-[#edf2e9] py-4" onClick={() => setIsMobileMenuOpen(false)}>Dịp lễ & sự kiện</Link>
            <Link href="/chuyen-nha" className="border-b border-[#edf2e9] py-4" onClick={() => setIsMobileMenuOpen(false)}>Chuyện nhà Mombi</Link>
            <Link href="#lien-he" className="py-4" onClick={() => setIsMobileMenuOpen(false)}>Liên hệ</Link>
          </nav>
        </div>

        <div className="relative z-20 mx-auto w-full max-w-[1380px] px-5 pb-36 pt-28 md:px-10 md:pb-44 md:pt-40">
          <div className="max-w-4xl">
            <div className="hero-reveal mb-6 flex items-center gap-3 sm:gap-4">
              <span className="h-px w-7 shrink-0 bg-[#b9dba3] sm:w-10" />
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#c7e4b3] sm:text-[10px] sm:tracking-[0.3em] md:text-[11px]">Spa thư giãn tại Buôn Ma Thuột</p>
            </div>
            <h1 className="hero-reveal-delay font-serif text-[clamp(2.85rem,13.4vw,3.35rem)] font-normal leading-[0.98] tracking-[-0.035em] drop-shadow-lg sm:hidden">
              Đến Mombi,<br />tìm về một<br />nhịp nghỉ <span className="italic text-[#c9e7b4]">vừa vặn.</span>
            </h1>
            <h1 className="hero-reveal-delay hidden max-w-4xl font-serif font-normal leading-[0.98] tracking-[-0.035em] drop-shadow-lg sm:block sm:text-6xl md:text-7xl lg:text-[5.5rem]">
              Đến Mombi, tìm về<br />một nhịp nghỉ <span className="italic text-[#c9e7b4]">vừa vặn.</span>
            </h1>
            <div className="hero-reveal-late mt-6 max-w-xl border-l border-white/35 pl-4 md:mt-9 md:pl-5">
              <p className="text-[13px] font-light leading-6 text-white/82 sm:text-sm sm:leading-7 md:text-base md:leading-8">Một không gian xanh giữa lòng thành phố, nơi cơ thể được thả lỏng và làn da được chăm sóc bằng sự tận tâm — cả ngày lẫn đêm.</p>
            </div>
            <div className="hero-reveal-late mt-7 flex flex-col gap-2.5 sm:flex-row md:mt-10">
              <a href="https://zalo.me/0934250909" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-[#91bd72] px-6 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#172313] shadow-[0_14px_40px_rgba(112,160,78,.3)] transition hover:-translate-y-0.5 hover:bg-[#a7d386] sm:px-7 sm:text-[11px]">Đặt lịch với Mombi <ArrowIcon /></a>
              <Link href="/dich-vu" className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/35 bg-white/5 px-6 text-[10px] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-sm transition hover:bg-white hover:text-[#24341f] sm:px-7 sm:text-[11px]">Khám phá dịch vụ</Link>
            </div>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 z-30 border-t border-white/15 bg-[#142013]/50 backdrop-blur-md">
          <div className="mx-auto grid max-w-[1380px] grid-cols-2 divide-x divide-white/15 px-5 md:grid-cols-[1fr_1fr_1fr_auto] md:px-10">
            <div className="py-5 pr-4 md:py-6 md:pr-8"><p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#b9dba3]">Thời gian</p><p className="mt-1.5 text-xs text-white/90 md:text-sm">Phục vụ cả ngày & đêm</p></div>
            <div className="py-5 pl-4 md:px-8 md:py-6"><p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#b9dba3]">Địa chỉ</p><p className="mt-1.5 text-xs text-white/90 md:text-sm">34 Trần Khánh Dư</p></div>
            <div className="hidden px-8 py-6 md:block"><p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#b9dba3]">Trải nghiệm</p><p className="mt-1.5 text-sm text-white/90">Massage · Chăm sóc da</p></div>
            <a href="tel:0934250909" className="hidden items-center gap-3 py-6 pl-8 text-sm font-medium text-white transition hover:text-[#c7e4b3] md:flex"><span className="grid h-9 w-9 place-items-center rounded-full border border-white/25">↗</span> 0934 250 909</a>
          </div>
        </div>
      </section>

      <section id="ve-mombi" className="px-5 py-14 sm:py-20 md:px-8 md:py-32">
        <div className="mx-auto grid max-w-7xl gap-9 sm:gap-12 lg:grid-cols-[0.88fr_1.12fr] lg:items-center lg:gap-20">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#759959]">Về Mombi Care</p>
            <h2 className="mt-4 max-w-xl font-serif text-[2.45rem] leading-[1.08] tracking-[-0.025em] sm:mt-5 sm:text-4xl md:text-6xl">Chăm sóc không cần vội.</h2>
            <p className="mt-5 max-w-xl text-sm font-light leading-7 text-[#607058] sm:mt-7 md:text-base md:leading-8">Mombi tin rằng một liệu trình tốt bắt đầu từ việc lắng nghe. Lắng nghe cơ thể, làn da và cả nhịp sống của bạn để mỗi lần ghé spa đều là một khoảng nghỉ vừa đủ.</p>
            <div className="mt-8 grid grid-cols-3 gap-2 border-t border-[#dbe5d5] pt-6 sm:mt-10 sm:gap-6 sm:pt-8">
              {[['01', 'Lắng nghe'], ['02', 'Chăm sóc'], ['03', 'Thả lỏng']].map(([number, label]) => (
                <div key={number}><span className="font-serif text-xl text-[#8aab73] sm:text-2xl">{number}</span><p className="mt-1.5 text-[9px] font-semibold uppercase tracking-[0.1em] text-[#394b31] sm:mt-2 sm:text-xs sm:tracking-[0.14em]">{label}</p></div>
              ))}
            </div>
            <Link href="/dich-vu" className="mt-8 inline-flex min-h-11 items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#66894e] transition hover:gap-4 sm:mt-10 sm:text-xs">Khám phá dịch vụ <ArrowIcon /></Link>
          </div>

          <div className="relative pb-7 pl-4 sm:pb-10 sm:pl-5 md:pb-14 md:pl-16">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-[#dfe8d7] shadow-[0_24px_65px_rgba(39,57,31,.13)] sm:rounded-[2rem]">
              <Image src="/img/ve-mombi1.jpg" alt="Không gian bên trong Mombi Care Spa" fill sizes="(max-width: 1024px) 100vw, 55vw" className="object-cover" />
            </div>
            <div className="absolute bottom-0 left-0 h-32 w-24 overflow-hidden rounded-xl border-[3px] border-[#f8f7f2] bg-[#e5ebdf] shadow-xl sm:h-40 sm:w-32 sm:rounded-2xl sm:border-4 md:h-56 md:w-44">
              <Image src="/img/ve-mombi2.jpg" alt="Góc thư giãn tại Mombi Care Spa" fill sizes="176px" className="object-cover" />
            </div>
            <div className="absolute -right-2 top-4 rounded-xl border border-[#dfe8d9] bg-white/90 px-3.5 py-3 shadow-lg backdrop-blur-md sm:-right-3 sm:top-7 sm:rounded-2xl sm:px-5 sm:py-4 md:right-5">
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#789b5e]">Một nhịp chậm</p>
              <p className="mt-1 font-serif text-base sm:text-xl">giữa lòng phố</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[#dfe7d9] bg-white px-5 py-14 sm:py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mb-9 grid gap-4 sm:mb-12 sm:gap-6 md:grid-cols-[1fr_0.65fr] md:items-end">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#759959]">Dịch vụ tại Mombi</p>
              <h2 className="mt-4 font-serif text-[2.4rem] leading-[1.08] tracking-[-0.025em] sm:mt-5 sm:text-4xl md:text-6xl">Chọn điều cơ thể<br className="hidden md:block" /> đang cần.</h2>
            </div>
            <p className="max-w-lg text-sm font-light leading-7 text-[#607058] md:text-base md:leading-8">Hai hành trình, cùng một mục tiêu: giúp bạn cảm thấy dễ chịu hơn khi rời Mombi.</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {serviceCategories.map((service) => (
              <article key={service.href} className="group overflow-hidden rounded-[1.5rem] border border-[#dfe7d9] bg-[#f9faf7] transition duration-500 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(42,61,33,.12)] sm:rounded-[2rem]">
                <Link href={service.href} className="relative block aspect-[5/4] overflow-hidden bg-[#dfe8d7] sm:aspect-[4/3]">
                  <Image src={service.image} alt={`${service.title} tại Mombi Care Spa`} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover transition duration-700 group-hover:scale-[1.035]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#152013]/65 via-transparent to-transparent" />
                  <p className="absolute bottom-5 left-5 text-[9px] font-semibold uppercase tracking-[0.18em] text-white sm:bottom-6 sm:left-6 sm:text-[10px] sm:tracking-[0.22em]">{service.subtitle}</p>
                </Link>
                <div className="p-5 sm:p-7 md:p-9">
                  <div className="flex items-start justify-between gap-5">
                    <div><p className="text-[10px] font-semibold tracking-[0.18em] text-[#91aa80]">{service.number}</p><h3 className="mt-2 font-serif text-[1.75rem] leading-tight sm:text-3xl md:text-4xl">{service.title}</h3></div>
                    <Link href={service.href} aria-label={`Xem ${service.title}`} className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-[#cbd9c2] text-[#67884f] transition group-hover:bg-[#789f5d] group-hover:text-white"><ArrowIcon /></Link>
                  </div>
                  <p className="mt-4 text-sm font-light leading-7 text-[#65725e] sm:mt-5">{service.description}</p>
                  <ul className="mt-5 flex flex-wrap gap-2 sm:mt-7">
                    {service.highlights.map((highlight) => <li key={highlight} className="rounded-full bg-[#edf3e8] px-3 py-1.5 text-[11px] text-[#516549] sm:px-4 sm:py-2 sm:text-xs">{highlight}</li>)}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#23321e] px-5 py-14 text-white sm:py-20 md:px-8 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-9 sm:gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-20">
          <div className="relative aspect-[5/4] overflow-hidden rounded-[1.5rem] bg-[#33452b] sm:aspect-[4/3] sm:rounded-[2rem] md:aspect-[5/4] lg:aspect-[4/5]">
            <Image src="/img/ve-mombi.jpg" alt="Sự tận tâm tại Mombi Care Spa" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover object-top" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1b2817]/55 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 rounded-xl border border-white/20 bg-[#1f2d1b]/60 px-4 py-3 backdrop-blur-md sm:bottom-6 sm:left-6 sm:right-6 sm:rounded-2xl sm:px-5 sm:py-4">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#bdd6ad]">Mombi Care Spa</p>
              <p className="mt-1 text-sm text-white/85">34 Trần Khánh Dư, Buôn Ma Thuột</p>
            </div>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#b5d3a2]">Trải nghiệm Mombi</p>
            <h2 className="mt-4 font-serif text-[2.35rem] leading-[1.08] tracking-[-0.025em] sm:mt-5 sm:text-4xl md:text-6xl">Sự thư giãn được tạo nên từ những điều nhỏ.</h2>
            <p className="mt-5 max-w-xl text-sm font-light leading-7 text-white/70 sm:mt-7 md:text-base md:leading-8">Từ ánh sáng dịu, hương thơm vừa đủ đến cách kỹ thuật viên lắng nghe lực tay bạn mong muốn — mọi chi tiết đều được chuẩn bị để bạn có thể an tâm thả lỏng.</p>
            <div className="mt-8 space-y-5 sm:mt-10 sm:space-y-6">
              {[
                ['Không gian riêng tư', 'Nhẹ nhàng, sạch sẽ và đủ yên để bạn thật sự nghỉ ngơi.'],
                ['Chăm sóc tận tâm', 'Tư vấn rõ ràng và điều chỉnh liệu trình theo nhu cầu thực tế.'],
                ['Phục vụ ngày & đêm', 'Linh hoạt thời gian để một khoảng nghỉ luôn vừa với lịch của bạn.'],
              ].map(([title, description], index) => (
                <div key={title} className="grid grid-cols-[36px_1fr] gap-4 border-t border-white/15 pt-6">
                  <span className="font-serif text-xl text-[#9fbe8b]">0{index + 1}</span>
                  <div><h3 className="font-serif text-xl">{title}</h3><p className="mt-2 text-sm font-light leading-6 text-white/60">{description}</p></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-14 sm:py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#759959]">Khách hàng chia sẻ</p>
            <h2 className="mx-auto mt-4 max-w-3xl font-serif text-[2.35rem] leading-[1.08] tracking-[-0.025em] sm:mt-5 sm:text-4xl md:text-6xl">Những cảm nhận ở lại sau một khoảng nghỉ.</h2>
          </div>
          <div className="no-scrollbar -mx-5 mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-3 sm:mt-12 lg:mx-0 lg:grid lg:grid-cols-3 lg:overflow-visible lg:px-0 lg:pb-0">
            {testimonials.map((testimonial, index) => (
              <figure key={testimonial.name} className={`flex min-h-[270px] min-w-[84vw] snap-center flex-col justify-between rounded-[1.5rem] border p-6 sm:min-w-[70vw] sm:rounded-[1.75rem] sm:p-7 md:p-9 lg:min-h-[310px] lg:min-w-0 ${index === 1 ? "border-[#789f5d] bg-[#edf3e8]" : "border-[#dfe7d9] bg-white"}`}>
                <div>
                  <div className="flex gap-1 text-[#84a66d]" aria-label="5 sao">★★★★★</div>
                  <blockquote className="mt-7 font-serif text-xl leading-8 text-[#31412a] md:text-2xl md:leading-9">“{testimonial.quote}”</blockquote>
                </div>
                <figcaption className="mt-9 border-t border-[#d8e2d2] pt-5"><p className="text-sm font-semibold">{testimonial.name}</p><p className="mt-1 text-xs text-[#72806c]">{testimonial.service}</p></figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section id="chuyen-nha" className="border-y border-[#dfe7d9] bg-[#edf3e8] px-5 py-14 sm:py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mb-9 flex flex-col items-start justify-between gap-5 sm:mb-12 sm:gap-6 md:flex-row md:items-end">
            <div><p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#759959]">Chuyện nhà Mombi</p><h2 className="mt-4 font-serif text-[2.4rem] leading-[1.08] tracking-[-0.025em] sm:mt-5 sm:text-4xl md:text-6xl">Một chút dịu dàng<br className="hidden sm:block" /> để đọc chậm.</h2></div>
            <Link href="/chuyen-nha" className="inline-flex items-center gap-3 rounded-full border border-[#b7caaa] bg-white/60 px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] transition hover:bg-white">Xem tất cả <ArrowIcon /></Link>
          </div>

          {cmsArticles.length > 0 && (
            <div className="grid items-stretch gap-6 lg:grid-cols-[1.35fr_0.65fr]">
              <article className="group overflow-hidden rounded-[1.5rem] border border-[#d3dfcc] bg-white sm:rounded-[1.75rem]">
                <Link href={`/chuyen-nha/${cmsArticles[0].slug}`} className="relative block aspect-[16/10] overflow-hidden bg-[#dce7d5]">
                  <Image src={cmsArticles[0].image || "/img/landing-1.jpg"} alt={cmsArticles[0].title} fill sizes="(max-width: 1024px) 100vw, 65vw" className="object-cover transition duration-700 group-hover:scale-[1.035]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#182415]/55 via-transparent to-transparent" />
                  <p className="absolute bottom-5 left-5 rounded-full border border-white/25 bg-white/15 px-4 py-2 text-[10px] uppercase tracking-[0.15em] text-white backdrop-blur-md">{cmsArticles[0].date}</p>
                </Link>
                <div className="p-6 md:p-8">
                  <Link href={`/chuyen-nha/${cmsArticles[0].slug}`}><h3 className="font-serif text-2xl leading-snug transition group-hover:text-[#66894e] md:text-3xl">{cmsArticles[0].title}</h3></Link>
                  {cmsArticles[0].excerpt && <p className="mt-4 line-clamp-2 text-sm font-light leading-7 text-[#66725f]">{cmsArticles[0].excerpt}</p>}
                  <Link href={`/chuyen-nha/${cmsArticles[0].slug}`} className="mt-4 inline-flex min-h-11 items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6d8f55] sm:mt-6">Đọc bài viết <ArrowIcon /></Link>
                </div>
              </article>

              <div className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-1">
                {cmsArticles.slice(1, 4).map((article) => (
                  <article key={article._id} className="group min-w-[82vw] snap-start overflow-hidden rounded-[1.5rem] border border-[#d3dfcc] bg-white sm:min-w-0 sm:rounded-[1.75rem]">
                    <Link href={`/chuyen-nha/${article.slug}`} className="relative block aspect-[16/8] overflow-hidden bg-[#dce7d5]">
                      <Image src={article.image || "/img/landing-1.jpg"} alt={article.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 35vw" className="object-cover transition duration-700 group-hover:scale-[1.035]" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#182415]/55 via-transparent to-transparent" />
                      <p className="absolute bottom-4 left-4 rounded-full border border-white/25 bg-white/15 px-3 py-1.5 text-[9px] uppercase tracking-[0.15em] text-white backdrop-blur-md">{article.date}</p>
                    </Link>
                    <div className="p-5 md:p-6">
                      <Link href={`/chuyen-nha/${article.slug}`}><h3 className="font-serif text-xl leading-snug transition group-hover:text-[#66894e] md:text-2xl">{article.title}</h3></Link>
                      <Link href={`/chuyen-nha/${article.slug}`} className="mt-3 inline-flex min-h-11 items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#6d8f55] sm:mt-4">Đọc bài viết <ArrowIcon /></Link>
                    </div>
                  </article>
                ))}
              </div>

              {cmsArticles.length > 4 && (
                <div className="grid gap-3 border-t border-[#d3dfcc] pt-6 sm:grid-cols-2 lg:col-span-2">
                  {cmsArticles.slice(4).map((article) => (
                    <Link key={article._id} href={`/chuyen-nha/${article.slug}`} className="flex items-center justify-between gap-5 rounded-2xl border border-[#d3dfcc] bg-white/60 px-5 py-4 transition hover:bg-white">
                      <span className="font-serif text-lg leading-snug text-[#33432c]">{article.title}</span>
                      <span className="shrink-0 text-[#6d8f55]" aria-hidden="true"><ArrowIcon /></span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <section className="bg-white px-5 py-14 sm:py-20 md:px-8 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div><p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#759959]">Trước khi ghé Mombi</p><h2 className="mt-4 font-serif text-[2.35rem] leading-[1.08] tracking-[-0.025em] sm:mt-5 sm:text-4xl md:text-5xl">Một vài điều bạn có thể muốn biết.</h2><p className="mt-5 text-sm font-light leading-7 text-[#66725f] sm:mt-6">Nếu còn điều gì chưa rõ, hãy nhắn Mombi. Chúng mình sẽ tư vấn nhẹ nhàng trước khi bạn quyết định đặt lịch.</p></div>
          <div className="border-t border-[#dfe7d9]">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div key={faq.question} className="border-b border-[#dfe7d9]">
                  <button onClick={() => setOpenFaq(isOpen ? null : index)} className="flex w-full items-center justify-between gap-5 py-6 text-left" aria-expanded={isOpen}>
                    <span className="font-serif text-xl text-[#31412a] md:text-2xl">{faq.question}</span>
                    <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[#cbd9c2] text-xl font-light transition ${isOpen ? "rotate-45 bg-[#789f5d] text-white" : "text-[#6d8e57]"}`}>+</span>
                  </button>
                  <div className={`grid transition-all duration-300 ${isOpen ? "grid-rows-[1fr] pb-6" : "grid-rows-[0fr]"}`}><div className="overflow-hidden"><p className="max-w-2xl text-sm font-light leading-7 text-[#687462]">{faq.answer}</p></div></div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="lien-he" className="px-5 pb-14 sm:pb-20 md:px-8 md:pb-28">
        <div className="mx-auto grid max-w-7xl overflow-hidden rounded-[1.5rem] bg-[#26351f] sm:rounded-[2rem] lg:grid-cols-[0.85fr_1.15fr]">
          <div className="flex flex-col justify-between p-6 text-white sm:p-7 md:p-12 lg:p-14">
            <div><p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#b7d3a4]">Ghé thăm Mombi</p><h2 className="mt-4 font-serif text-[2.35rem] leading-[1.08] sm:mt-5 sm:text-4xl md:text-5xl">Khoảng nghỉ của bạn đang chờ.</h2><p className="mt-5 text-sm font-light leading-7 text-white/65 sm:mt-6">34 Trần Khánh Dư, Buôn Ma Thuột<br />Hotline: 0934 250 909</p></div>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row"><a href="https://zalo.me/0934250909" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-3 rounded-full bg-[#91bd72] px-6 py-3.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#172313]">Đặt lịch qua Zalo <ArrowIcon /></a><a href="tel:0934250909" className="inline-flex items-center justify-center rounded-full border border-white/25 px-6 py-3.5 text-[11px] font-semibold uppercase tracking-[0.14em]">Gọi Mombi</a></div>
          </div>
          <div className="min-h-[320px] bg-[#dfe8d7] sm:min-h-[420px] lg:min-h-[560px]">
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d16495.528009611553!2d108.04502350853478!3d12.68557249339919!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3171f767729424c1%3A0xa17b2040c8d0d5bd!2sMombicare%20spa!5e0!3m2!1svi!2s!4v1783165042726!5m2!1svi!2s" width="100%" height="100%" style={{border: 0}} loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Bản đồ đường đến Mombi Care Spa" />
          </div>
        </div>
      </section>

      <SiteFooter />

      <a href="https://zalo.me/0934250909" target="_blank" rel="noopener noreferrer" className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-40 grid h-12 w-12 place-items-center rounded-full bg-[#1fce70] text-xs font-semibold text-white shadow-[0_14px_35px_rgba(31,206,112,.32)] transition hover:-translate-y-0.5 md:bottom-7 md:right-7 md:inline-flex md:h-auto md:w-auto md:gap-2 md:px-5 md:py-3" aria-label="Nhắn Mombi qua Zalo">
        <span className="grid h-8 w-8 place-items-center rounded-full bg-white/20 text-[11px] md:h-6 md:w-6 md:text-[10px]">Z</span><span className="hidden md:inline">Nhắn Mombi</span>
      </a>
    </main>
  );
}
