import type {Metadata} from "next";
import Image from "next/image";
import Link from "next/link";
import {SiteFooter, SiteHeader} from "../components/SiteChrome";
import {eventLandings} from "../lib/seo-content";

export const metadata: Metadata = {
  title: "Dịp lễ & gợi ý quà spa tại Buôn Ma Thuột | Mombi",
  description: "Lịch sự kiện và gợi ý massage, chăm sóc da, quà trải nghiệm spa tại Buôn Ma Thuột từ Quốc khánh 2/9 đến Tết Dương lịch 2027.",
  alternates: {canonical: "/uu-dai-su-kien"},
  openGraph: {title: "Dịp lễ & gợi ý quà | Mombi Care Spa", description: "Lên kế hoạch một buổi chăm sóc cho các dịp lễ sắp tới.", url: "/uu-dai-su-kien", images: [{url: "/img/landing-2.jpg", alt: "Gợi ý quà spa tại Buôn Ma Thuột"}]},
};

export default function EventHub() {
  return (
    <div className="min-h-screen bg-[#f7f6f1] text-[#2d3d25]">
      <SiteHeader />
      <main>
        <section className="bg-[#edf3e8] px-5 py-16 text-center md:py-24">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#789f5d]">Từ nay đến đầu năm 2027</p>
          <h1 className="mx-auto mt-4 max-w-4xl font-serif text-5xl leading-tight md:text-7xl">Lịch dịp lễ & gợi ý một món quà được chăm sóc</h1>
          <p className="mx-auto mt-6 max-w-2xl text-base font-normal leading-7 text-[#596a51] md:leading-8">Lên lịch sớm cho Quốc khánh, Trung thu, 20/10, 20/11, Giáng sinh và Tết Dương lịch. Mọi khung giờ lễ cần được xác nhận trực tiếp với Mombi.</p>
        </section>
        <section className="mx-auto max-w-6xl px-5 py-14 md:py-20">
          <ol className="relative space-y-8 before:absolute before:bottom-8 before:left-[19px] before:top-8 before:w-px before:bg-[#c9d9bf] md:before:left-1/2">
            {eventLandings.map((item, index) => (
              <li key={item.slug} className={`relative grid items-center gap-7 md:grid-cols-2 ${index % 2 ? "md:[&>*:first-child]:order-2" : ""}`}>
                <div className="absolute left-2 top-8 z-10 grid h-6 w-6 place-items-center rounded-full border-4 border-[#edf3e8] bg-[#789f5d] md:left-1/2 md:-translate-x-1/2" />
                <div className="relative ml-12 aspect-[16/9] overflow-hidden rounded-3xl bg-[#e1eadb] md:ml-0">
                  <Image src={item.image} alt={item.imageAlt} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
                </div>
                <Link href={`/uu-dai-su-kien/${item.slug}`} className="ml-12 rounded-3xl border border-[#e0e7dc] bg-white p-7 transition hover:shadow-lg md:ml-0">
                  <time dateTime={item.dateISO} className="text-xs font-semibold uppercase tracking-[0.16em] text-[#789f5d]">{item.dateLabel}</time>
                  <h2 className="mt-3 font-serif text-3xl text-[#304027]">{item.title}</h2>
                  <p className="mt-3 text-sm font-light leading-7 text-[#5c6c55]">{item.description}</p>
                  <span className="mt-5 inline-flex text-sm font-semibold text-[#6a8e52]">Xem gợi ý →</span>
                </Link>
              </li>
            ))}
          </ol>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
