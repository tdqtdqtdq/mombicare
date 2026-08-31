import Image from "next/image";
import Link from "next/link";
import type {EventLanding, SeoLanding} from "../lib/seo-content";
import {eventLandings, localLandings} from "../lib/seo-content";
import {SiteFooter, SiteHeader, LuxuryFloatingConcierge} from "./SiteChrome";

const siteUrl = "https://www.mombicarespa.com";

function JsonLd({data}: {data: object}) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{__html: JSON.stringify(data).replace(/</g, "\\u003c")}}
    />
  );
}

export function SeoLandingPage({
  page,
  kind,
}: {
  page: SeoLanding | EventLanding;
  kind: "local" | "event";
}) {
  const isEvent = kind === "event";
  const event = isEvent ? (page as EventLanding) : null;
  const basePath = isEvent ? "/uu-dai-su-kien" : "/spa-buon-ma-thuot";
  const hubLabel = isEvent ? "Dịp lễ & sự kiện" : "Spa Buôn Ma Thuột";
  const relatedPool = isEvent ? eventLandings : localLandings;
  const related = relatedPool.filter((item) => item.slug !== page.slug).slice(0, 3);
  const pageUrl = `${siteUrl}${basePath}/${page.slug}`;

  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {"@type": "ListItem", position: 1, name: "Trang chủ", item: siteUrl},
      {"@type": "ListItem", position: 2, name: hubLabel, item: `${siteUrl}${basePath}`},
      {"@type": "ListItem", position: 3, name: page.title, item: pageUrl},
    ],
  };

  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {"@type": "Answer", text: faq.answer},
    })),
  };

  const serviceData = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: page.title,
    description: page.description,
    url: pageUrl,
    image: `${siteUrl}${page.image}`,
    areaServed: {"@type": "City", name: "Buôn Ma Thuột"},
    provider: {
      "@type": ["DaySpa", "HealthAndBeautyBusiness"],
      name: "Mombi Care Spa",
      url: siteUrl,
      telephone: "+84934250909",
      address: {
        "@type": "PostalAddress",
        streetAddress: "34 Trần Khánh Dư, phường Tân Lợi",
        addressLocality: "Buôn Ma Thuột",
        addressRegion: "Đắk Lắk",
        addressCountry: "VN",
      },
    },
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#1c2619]">
      <JsonLd data={breadcrumbData} />
      <JsonLd data={faqData} />
      <JsonLd data={serviceData} />
      <SiteHeader />
      <main>
        {/* Luxury Hero Header */}
        <section className="relative overflow-hidden border-b border-[#dce7d6] bg-[#edf4e8] px-5 py-16 md:py-24">
          <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-[#6f9556]/15 blur-3xl" />
          <div className="mx-auto max-w-6xl">
            <nav aria-label="Đường dẫn" className="mb-6 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#6f9556]">
              <Link href="/" className="hover:underline">Trang chủ</Link>
              <span aria-hidden="true">/</span>
              <Link href={basePath} className="hover:underline">{hubLabel}</Link>
              <span aria-hidden="true">/</span>
              <span className="text-[#22331d]" aria-current="page">{page.title}</span>
            </nav>
            <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_.95fr]">
              <div>
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.28em] text-[#6f9556]">{page.eyebrow}</p>
                {event && (
                  <time dateTime={event.dateISO} className="mb-4 inline-flex rounded-full bg-white px-4 py-1.5 text-xs font-bold text-[#6f9556] shadow-sm">
                    ⏱ {event.dateLabel}
                  </time>
                )}
                <h1 className="font-serif text-[2.5rem] font-normal leading-[1.06] text-[#1c2619] md:text-5xl lg:text-6xl">{page.title}</h1>
                <p className="mt-6 max-w-2xl text-sm font-light leading-7 text-[#55694f] md:text-base md:leading-8">{page.intent}</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <a 
                    href="https://zalo.me/0934250909" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#24361e] px-7 text-xs font-bold uppercase tracking-[0.16em] text-white shadow-md transition hover:bg-[#385130]"
                  >
                    Đặt lịch qua Zalo →
                  </a>
                  <Link 
                    href={page.serviceHref} 
                    className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#b8cdb0] bg-white px-6 text-xs font-bold uppercase tracking-[0.14em] text-[#24361e] transition hover:bg-[#edf4e8]"
                  >
                    {page.serviceLabel}
                  </Link>
                </div>
              </div>
              <div className="relative aspect-[4/3] overflow-hidden rounded-[2.5rem] bg-[#dfe9d8] shadow-[0_24px_60px_rgba(28,40,24,0.1)]">
                <Image src={page.image} alt={page.imageAlt} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" priority />
              </div>
            </div>
          </div>
        </section>

        {event && (
          <section className="border-b border-[#e1e8dc] bg-[#fffbf2] px-5 py-4">
            <p className="mx-auto max-w-4xl text-center text-xs font-medium text-[#7a5e28]">
              <strong>Lưu ý khi lên lịch:</strong> {event.planningNote}
            </p>
          </section>
        )}

        <article className="mx-auto max-w-4xl px-5 py-16 md:py-24">
          <p className="text-base font-light leading-8 text-[#465741] sm:text-lg">{page.description}</p>
          
          <div className="mt-14 space-y-14">
            {page.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="font-serif text-2xl font-normal text-[#1c2619] sm:text-3xl md:text-4xl">{section.heading}</h2>
                <div className="mt-5 space-y-4 text-sm font-light leading-7 text-[#55694f] sm:text-base sm:leading-8">
                  {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                </div>
                {section.bullets && (
                  <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                    {section.bullets.map((bullet) => (
                      <li key={bullet} className="rounded-2xl border border-[#dce7d6] bg-white p-4 text-xs font-normal leading-6 text-[#465741] shadow-xs">
                        <span className="font-bold text-[#6f9556]">✓ </span>{bullet}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>

          {/* FAQs section */}
          <section className="mt-20 rounded-[2.5rem] border border-[#dce7d6] bg-[#edf4e8] p-8 sm:p-12">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#6f9556]">Giải đáp thắc mắc</p>
            <h2 className="mt-2 font-serif text-2xl font-normal text-[#1c2619] sm:text-3xl">Câu hỏi thường gặp</h2>
            <div className="mt-8 space-y-4">
              {page.faqs.map((faq) => (
                <details key={faq.question} className="group rounded-2xl border border-[#d2dfcb] bg-white p-5 transition hover:border-[#b8cdb0]">
                  <summary className="flex cursor-pointer list-none items-center justify-between font-serif text-base font-normal text-[#1c2619]">
                    <span>{faq.question}</span>
                    <span className="ml-4 font-sans text-lg font-light text-[#6f9556] transition-transform duration-200 group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-4 border-t border-[#eef4ea] pt-3 text-xs font-light leading-6 text-[#586c52] sm:text-sm">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </section>
        </article>

        {/* CTA Banner */}
        <section className="bg-[#182515] px-5 py-16 text-white sm:py-24">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#a9c994]">Mombi Care Spa · Buôn Ma Thuột</p>
            <h2 className="mt-3 font-serif text-3xl font-normal text-white sm:text-4xl md:text-5xl">Giữ một khung giờ cho riêng bạn</h2>
            <p className="mx-auto mt-5 max-w-2xl text-xs font-light leading-7 text-[#b7cbb7] sm:text-sm">
              34 Trần Khánh Dư, phường Tân Lợi · Hotline 0934 250 909. Hãy liên hệ trước để xác nhận dịch vụ và khung giờ phục vụ cả ngày lẫn đêm.
            </p>
            <a 
              href="https://zalo.me/0934250909" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-[#6f9556] px-8 text-xs font-bold uppercase tracking-wider text-white shadow-lg transition hover:bg-[#80aa64]"
            >
              Nhắn Mombi qua Zalo →
            </a>
          </div>
        </section>

        {/* Related Pages */}
        <section className="mx-auto max-w-7xl px-5 py-16 md:py-24">
          <div className="mb-10 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#6f9556]">Khám phá thêm</p>
              <h2 className="mt-2 font-serif text-3xl font-normal text-[#1c2619]">Nội dung liên quan</h2>
            </div>
            <Link href={basePath} className="text-xs font-bold uppercase tracking-wider text-[#6f9556] hover:underline">
              Xem tất cả →
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {related.map((item) => (
              <Link 
                key={item.slug} 
                href={`${basePath}/${item.slug}`} 
                className="flex flex-col justify-between rounded-[2rem] border border-[#dce7d6] bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#b8cdb0] hover:shadow-lg"
              >
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#6f9556]">{item.eyebrow}</p>
                  <h3 className="mt-3 font-serif text-xl font-normal text-[#1c2619]">{item.title}</h3>
                  <p className="mt-3 line-clamp-3 text-xs font-light leading-6 text-[#586c52]">{item.description}</p>
                </div>
                <span className="mt-5 inline-block text-xs font-bold text-[#6f9556]">Xem chi tiết →</span>
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

