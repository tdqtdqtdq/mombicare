import type {Metadata} from "next";
import Image from "next/image";
import Link from "next/link";
import {SiteFooter, SiteHeader, LuxuryFloatingConcierge} from "../components/SiteChrome";
import {localLandings} from "../lib/seo-content";

export const metadata: Metadata = {
  title: "Spa Buôn Ma Thuột: Dịch vụ & Kinh nghiệm lựa chọn | Mombi Care Spa",
  description: "Khám phá massage, gội đầu dưỡng sinh, chăm sóc da và kinh nghiệm chọn spa tại Buôn Ma Thuột. Địa chỉ Mombi Care Spa: 34 Trần Khánh Dư.",
  alternates: {canonical: "/spa-buon-ma-thuot"},
  openGraph: {title: "Spa Buôn Ma Thuột | Mombi Care Spa", description: "Chọn dịch vụ spa theo đúng nhu cầu tại Buôn Ma Thuột.", url: "/spa-buon-ma-thuot", images: [{url: "/img/ve-mombi1.jpg", alt: "Mombi Care Spa Buôn Ma Thuột"}]},
};

export default function LocalSeoHub() {
  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#1c2619]">
      <SiteHeader />
      <main>
        {/* Luxury Hero Header */}
        <section className="relative overflow-hidden border-b border-[#dce7d6] bg-[#edf4e8] px-5 py-16 text-center md:py-24">
          <div className="pointer-events-none absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-[#6f9556]/15 blur-3xl" />
          <div className="relative mx-auto max-w-4xl">
            <div className="mb-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.28em] text-[#6f9556]">
              <span className="h-px w-6 bg-[#6f9556]" />
              Cẩm nang địa phương Buôn Ma Thuột
              <span className="h-px w-6 bg-[#6f9556]" />
            </div>
            <h1 className="font-serif text-[2.75rem] font-normal leading-[1.04] text-[#1c2619] sm:text-5xl md:text-6xl lg:text-7xl">
              Spa tại Buôn Ma Thuột: chọn đúng theo nhu cầu
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-sm font-light leading-7 text-[#55694f] md:text-base md:leading-8">
              Tìm spa uy tín tại Buôn Ma Thuột theo đúng nhu cầu của bạn: thông tin dịch vụ, thời lượng, cách chuẩn bị, địa chỉ và đường đi trước khi đặt lịch.
            </p>
          </div>
        </section>

        {/* Local Pages Grid */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 md:px-8 md:py-28">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {localLandings.map((item) => (
              <Link 
                key={item.slug} 
                href={`/spa-buon-ma-thuot/${item.slug}`} 
                className="group flex flex-col justify-between overflow-hidden rounded-[2.5rem] border border-[#dce7d6] bg-white shadow-sm transition duration-300 hover:-translate-y-1.5 hover:border-[#b8cdb0] hover:shadow-xl"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-[#e1ecd9]">
                  <Image 
                    src={item.image} 
                    alt={item.imageAlt} 
                    fill 
                    sizes="(max-width: 768px) 100vw, 33vw" 
                    className="object-cover transition duration-700 group-hover:scale-105" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                </div>
                <div className="flex flex-col justify-between p-7">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#6f9556]">{item.eyebrow}</p>
                    <h2 className="mt-2 font-serif text-2xl font-normal leading-snug text-[#1c2619] transition group-hover:text-[#6f9556]">{item.title}</h2>
                    <p className="mt-3 text-xs font-light leading-6 text-[#586c52]">{item.description}</p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-[#edf4e8]">
                    <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#6f9556] group-hover:text-[#24361e]">
                      <span>Xem hướng dẫn</span>
                      <span>→</span>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <LuxuryFloatingConcierge />
      <SiteFooter />
    </div>
  );
}

