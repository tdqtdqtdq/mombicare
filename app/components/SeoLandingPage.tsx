import Image from "next/image";
import Link from "next/link";
import type {EventLanding, SeoLanding} from "../lib/seo-content";
import {eventLandings, localLandings} from "../lib/seo-content";
import {SiteFooter, SiteHeader} from "./SiteChrome";

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
    <div className="min-h-screen bg-[#f7f6f1] text-[#2d3d25]">
      <JsonLd data={breadcrumbData} />
      <JsonLd data={faqData} />
      <JsonLd data={serviceData} />
      <SiteHeader />
      <main>
        <section className="border-b border-[#dfe8d9] bg-[#edf3e8] px-5 py-14 md:py-20">
          <div className="mx-auto max-w-6xl">
            <nav aria-label="Đường dẫn" className="mb-7 flex flex-wrap items-center gap-2 text-xs text-[#668451]">
              <Link href="/" className="hover:underline">Trang chủ</Link>
              <span aria-hidden="true">/</span>
              <Link href={basePath} className="hover:underline">{hubLabel}</Link>
              <span aria-hidden="true">/</span>
              <span aria-current="page">{page.title}</span>
            </nav>
            <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_.95fr]">
              <div>
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.12em] text-[#789f5d]">{page.eyebrow}</p>
                {event && (
                  <time dateTime={event.dateISO} className="mb-4 inline-flex rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#668451] shadow-sm">
                    {event.dateLabel}
                  </time>
                )}
                <h1 className="font-serif text-4xl leading-tight text-[#293922] md:text-6xl">{page.title}</h1>
                <p className="mt-6 max-w-2xl text-base font-normal leading-7 text-[#52624b] md:text-lg md:leading-8">{page.intent}</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <a href="https://zalo.me/0934250909" target="_blank" rel="noopener noreferrer" className="rounded-full bg-[#789f5d] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#64894b]">Đặt lịch qua Zalo</a>
                  <Link href={page.serviceHref} className="rounded-full border border-[#789f5d] bg-white px-6 py-3 text-sm font-semibold text-[#64894b] transition hover:bg-[#f5f9f2]">{page.serviceLabel}</Link>
                </div>
              </div>
              <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-[#dfe9d8] shadow-[0_24px_60px_rgba(45,61,37,0.13)]">
                <Image src={page.image} alt={page.imageAlt} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" priority />
              </div>
            </div>
          </div>
        </section>

        {event && (
          <section className="border-b border-[#e1e8dc] bg-white px-5 py-6">
            <p className="mx-auto max-w-4xl text-center text-sm leading-7 text-[#5e6c58]"><strong className="text-[#3e5134]">Lưu ý khi lên lịch:</strong> {event.planningNote}</p>
          </section>
        )}

        <article className="mx-auto max-w-4xl px-5 py-14 md:py-20">
          <p className="text-lg leading-8 text-[#4f6048]">{page.description}</p>
          <div className="mt-12 space-y-12">
            {page.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="font-serif text-3xl text-[#2d3d25] md:text-4xl">{section.heading}</h2>
                <div className="mt-5 space-y-4 text-base font-normal leading-7 text-[#596853] md:leading-8">
                  {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                </div>
                {section.bullets && (
                  <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                    {section.bullets.map((bullet) => <li key={bullet} className="rounded-2xl border border-[#e0e8db] bg-white px-5 py-4 text-sm leading-6 text-[#52624b]">✓ {bullet}</li>)}
                  </ul>
                )}
              </section>
            ))}
          </div>

          <section className="mt-16 rounded-[2rem] bg-[#edf3e8] p-6 md:p-9">
            <h2 className="font-serif text-3xl text-[#2d3d25]">Câu hỏi thường gặp</h2>
            <div className="mt-6 divide-y divide-[#cfddc7]">
              {page.faqs.map((faq) => (
                <details key={faq.question} className="group py-5">
                  <summary className="cursor-pointer list-none pr-8 font-semibold text-[#405237] marker:content-none">{faq.question}</summary>
                  <p className="mt-3 text-sm font-light leading-7 text-[#596853]">{faq.answer}</p>
                </details>
              ))}
            </div>
          </section>
        </article>

        <section className="bg-[#26351f] px-5 py-14 text-white">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b9d5a7]">Mombi Care Spa · Buôn Ma Thuột</p>
            <h2 className="mt-4 font-serif text-3xl md:text-5xl">Giữ một khung giờ cho riêng bạn</h2>
            <p className="mx-auto mt-5 max-w-2xl text-sm font-light leading-7 text-[#d6e3ce]">34 Trần Khánh Dư, phường Tân Lợi · 0934 250 909. Hãy liên hệ trước để xác nhận dịch vụ, giá và khung giờ còn trống.</p>
            <a href="https://zalo.me/0934250909" target="_blank" rel="noopener noreferrer" className="mt-7 inline-flex rounded-full bg-[#8bb96e] px-7 py-3 text-sm font-semibold text-white hover:bg-[#76a459]">Nhắn Mombi trên Zalo</a>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-14 md:py-20">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#789f5d]">Khám phá thêm</p>
              <h2 className="mt-2 font-serif text-3xl text-[#2d3d25]">Nội dung liên quan</h2>
            </div>
            <Link href={basePath} className="text-sm font-semibold text-[#668b4e] hover:underline">Xem tất cả →</Link>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {related.map((item) => (
              <Link key={item.slug} href={`${basePath}/${item.slug}`} className="rounded-3xl border border-[#e0e7dc] bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg">
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#7b9e65]">{item.eyebrow}</p>
                <h3 className="mt-3 font-serif text-2xl text-[#33452a]">{item.title}</h3>
                <p className="mt-3 line-clamp-3 text-sm font-light leading-6 text-[#61705a]">{item.description}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
