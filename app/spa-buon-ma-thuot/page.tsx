import type {Metadata} from "next";
import Image from "next/image";
import Link from "next/link";
import {SiteFooter, SiteHeader} from "../components/SiteChrome";
import {localLandings} from "../lib/seo-content";

export const metadata: Metadata = {
  title: "Spa Buôn Ma Thuột: Dịch vụ & kinh nghiệm lựa chọn | Mombi",
  description: "Khám phá massage, gội đầu dưỡng sinh, chăm sóc da và kinh nghiệm chọn spa tại Buôn Ma Thuột. Địa chỉ Mombi Care Spa: 34 Trần Khánh Dư.",
  alternates: {canonical: "/spa-buon-ma-thuot"},
  openGraph: {title: "Spa Buôn Ma Thuột | Mombi Care Spa", description: "Chọn dịch vụ spa theo đúng nhu cầu tại Buôn Ma Thuột.", url: "/spa-buon-ma-thuot", images: [{url: "/img/ve-mombi1.jpg", alt: "Mombi Care Spa Buôn Ma Thuột"}]},
};

export default function LocalSeoHub() {
  return (
    <div className="min-h-screen bg-[#f7f6f1] text-[#2d3d25]">
      <SiteHeader />
      <main>
        <section className="bg-[#edf3e8] px-5 py-16 text-center md:py-24">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#789f5d]">Cẩm nang địa phương</p>
          <h1 className="mx-auto mt-4 max-w-4xl font-serif text-5xl leading-tight md:text-7xl">Spa tại Buôn Ma Thuột: chọn đúng theo nhu cầu</h1>
          <p className="mx-auto mt-6 max-w-2xl text-base font-normal leading-7 text-[#596a51] md:leading-8">Tìm spa gần đây tại Buôn Ma Thuột theo đúng nhu cầu: thông tin dịch vụ, thời lượng, cách chuẩn bị, địa chỉ và đường đi trước khi đặt lịch.</p>
        </section>
        <section className="mx-auto max-w-7xl px-5 py-14 md:py-20">
          <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
            {localLandings.map((item, index) => (
              <Link key={item.slug} href={`/spa-buon-ma-thuot/${item.slug}`} className={`group overflow-hidden rounded-[1.75rem] border border-[#e0e7dc] bg-white transition hover:-translate-y-1 hover:shadow-xl ${index < 2 ? "lg:col-span-1" : ""}`}>
                <div className="relative aspect-[16/10] overflow-hidden bg-[#e1eadb]">
                  <Image src={item.image} alt={item.imageAlt} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition duration-700 group-hover:scale-105" />
                </div>
                <div className="p-6">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#789f5d]">{item.eyebrow}</p>
                  <h2 className="mt-3 font-serif text-3xl text-[#304027]">{item.title}</h2>
                  <p className="mt-3 text-sm font-normal leading-6 text-[#5c6c55]">{item.description}</p>
                  <span className="mt-5 inline-flex text-sm font-semibold text-[#6a8e52]">Xem hướng dẫn →</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
