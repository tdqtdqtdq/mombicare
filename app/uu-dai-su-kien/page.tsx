import type {Metadata} from "next";
import Image from "next/image";
import Link from "next/link";
import {SiteFooter, SiteHeader, LuxuryFloatingConcierge} from "../components/SiteChrome";
import {eventLandings} from "../lib/seo-content";

export const metadata: Metadata = {
  title: "Dịp lễ & Gợi ý quà tặng Spa tại Buôn Ma Thuột | Mombi Care Spa",
  description: "Lịch sự kiện và gợi ý massage, chăm sóc da, quà trải nghiệm spa tại Buôn Ma Thuột từ Quốc khánh 2/9 đến Tết Dương lịch 2027.",
  alternates: {canonical: "/uu-dai-su-kien"},
  openGraph: {title: "Dịp lễ & gợi ý quà | Mombi Care Spa", description: "Lên kế hoạch một buổi chăm sóc cho các dịp lễ sắp tới.", url: "/uu-dai-su-kien", images: [{url: "/img/landing-2.jpg", alt: "Gợi ý quà spa tại Buôn Ma Thuột"}]},
};

export default function EventHub() {
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
              Lịch sự kiện &amp; Ưu đãi đặc biệt
              <span className="h-px w-6 bg-[#6f9556]" />
            </div>
            <h1 className="font-serif text-[2.75rem] font-normal leading-[1.04] text-[#1c2619] sm:text-5xl md:text-6xl lg:text-7xl">
              Lịch dịp lễ &amp; Gợi ý quà tặng chăm sóc
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-sm font-light leading-7 text-[#55694f] md:text-base md:leading-8">
              Lên lịch sớm cho Quốc khánh, Trung thu, 20/10, 20/11, Giáng sinh và Tết. Mọi khung giờ lễ được chuẩn bị chu đáo khi xác nhận trực tiếp với Mombi.
            </p>
          </div>
        </section>

        {/* Timeline Hub */}
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 md:px-8 md:py-28">
          <ol className="relative space-y-12 before:absolute before:bottom-8 before:left-[19px] before:top-8 before:w-0.5 before:bg-[#dce7d6] md:before:left-1/2">
            {eventLandings.map((item, index) => (
              <li key={item.slug} className={`relative grid items-center gap-8 md:grid-cols-2 ${index % 2 ? "md:[&>*:first-child]:order-2" : ""}`}>
                <div className="absolute left-2.5 top-8 z-10 grid h-6 w-6 place-items-center rounded-full border-4 border-[#edf4e8] bg-[#6f9556] md:left-1/2 md:-translate-x-1/2" />
                <div className="relative ml-12 aspect-[16/10] overflow-hidden rounded-[2.5rem] bg-[#e1ecd9] shadow-md md:ml-0">
                  <Image src={item.image} alt={item.imageAlt} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                </div>
                <Link 
                  href={`/uu-dai-su-kien/${item.slug}`} 
                  className="group ml-12 flex flex-col justify-between rounded-[2.5rem] border border-[#dce7d6] bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#b8cdb0] hover:shadow-xl md:ml-0"
                >
                  <div>
                    <time dateTime={item.dateISO} className="inline-flex rounded-full bg-[#edf4e8] px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[#6f9556]">
                      ⏱ {item.dateLabel}
                    </time>
                    <h2 className="mt-4 font-serif text-2xl font-normal leading-snug text-[#1c2619] transition group-hover:text-[#6f9556] sm:text-3xl">
                      {item.title}
                    </h2>
                    <p className="mt-3 text-xs font-light leading-6 text-[#586c52] sm:text-sm">
                      {item.description}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-[#edf4e8]">
                    <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#6f9556] group-hover:text-[#24361e]">
                      <span>Xem gợi ý chi tiết</span>
                      <span>→</span>
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ol>
        </section>
      </main>
      <LuxuryFloatingConcierge />
      <SiteFooter />
    </div>
  );
}

