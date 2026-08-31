import Image from "next/image";
import Link from "next/link";
import { Playfair_Display, Be_Vietnam_Pro } from "next/font/google";
import type { Metadata } from "next";
import { client, formatPublishedDate } from "../lib/sanity";
import { SiteFooter, SiteHeader, LuxuryFloatingConcierge } from "../components/SiteChrome";

const playfair = Playfair_Display({ subsets: ["vietnamese"], weight: ["400", "500", "600", "700"] });
const beVietnam = Be_Vietnam_Pro({ subsets: ["vietnamese"], weight: ["300", "400", "500", "600"] });

export const metadata: Metadata = {
  title: "Cẩm Nang Spa & Làm Đẹp Buôn Ma Thuột - Kinh Nghiệm Chăm Sóc Da & Massage",
  description: "Cẩm nang chuyên sâu về chăm sóc da mụn, cấy HA, kỹ thuật gội đầu dưỡng sinh và massage bấm huyệt giải mỏi từ đội ngũ chuyên gia Mombi Care Spa Buôn Ma Thuột.",
  alternates: {canonical: "https://www.mombicarespa.com/chuyen-nha"},
  openGraph: {
    title: "Cẩm Nang Spa & Làm Đẹp Buôn Ma Thuột | Chuyện Nhà Mombi",
    description: "Kiến thức thực tế về chăm sóc da, massage trị liệu và phục hồi sức khỏe.",
    url: "https://www.mombicarespa.com/chuyen-nha",
  },
};

type ArticleCard = { _id: string; title: string; slug: string; excerpt?: string; image?: string; imageAlt?: string; date?: string };

async function getArticles(): Promise<ArticleCard[]> {
  return client.fetch(`
    *[_type == "article" && defined(slug.current) && seo.noIndex != true] | order(publishedAt desc) {
      _id, title, "slug": slug.current, excerpt,
      "image": mainImage.asset->url,
      "imageAlt": coalesce(mainImage.alt, title),
      "date": publishedAt
    }
  `, {}, { next: { revalidate: 60 } });
}

export default async function ChuyenNhaPage() {
  const articles = await getArticles();

  return (
    <div className={`min-h-screen bg-[#faf8f5] text-[#1c2619] ${beVietnam.className}`}>
      <SiteHeader />
      <main>
        {/* Luxury Hero Header */}
        <section className="relative overflow-hidden border-b border-[#dce7d6] bg-[#edf4e8] px-5 py-16 text-center sm:py-24 md:py-32">
          <div className="pointer-events-none absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-[#6f9556]/15 blur-3xl" />
          <div className="relative mx-auto max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.28em] text-[#6f9556]">
              <span className="h-px w-6 bg-[#6f9556]" />
              Tạp chí &amp; Cẩm nang Mombi
              <span className="h-px w-6 bg-[#6f9556]" />
            </div>
            <h1 className={`text-[2.75rem] font-normal leading-[1.04] text-[#1c2619] sm:text-6xl md:text-7xl ${playfair.className}`}>
              Chuyện nhà Mombi
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-sm font-light leading-7 text-[#55694f] sm:text-base sm:leading-8">
              Kiến thức chăm sóc làn da khoa học, kỹ thuật giải tỏa căng mỏi cơ thể và những câu chuyện giúp bạn tìm về một nhịp nghỉ vừa vặn.
            </p>
          </div>
        </section>

        {/* Editorial Articles Grid */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 md:px-8 md:py-28">
          {articles.length ? (
            <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((article, index) => (
                <Link 
                  key={article._id} 
                  href={`/chuyen-nha/${article.slug}`} 
                  className={`group flex flex-col justify-between overflow-hidden rounded-[2.5rem] border border-[#dce7d6] bg-white shadow-sm transition duration-300 hover:-translate-y-1.5 hover:border-[#b8cdb0] hover:shadow-xl ${
                    index === 0 ? "md:col-span-2 lg:col-span-2 lg:grid lg:grid-cols-2" : ""
                  }`}
                >
                  <div className={`relative overflow-hidden bg-[#e1ecd9] ${index === 0 ? "aspect-[16/10] lg:aspect-auto lg:min-h-[380px]" : "aspect-[16/10]"}`}>
                    <Image 
                      src={article.image || "/img/landing-1.jpg"} 
                      alt={article.imageAlt || article.title} 
                      fill 
                      sizes={index === 0 ? "(max-width: 1024px) 100vw, 66vw" : "(max-width: 768px) 100vw, 33vw"} 
                      className="object-cover transition duration-700 group-hover:scale-105" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  </div>
                  
                  <div className={`flex flex-col justify-between p-6 sm:p-8 ${index === 0 ? "lg:p-12" : ""}`}>
                    <div>
                      <time dateTime={article.date} className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#6f9556]">
                        {formatPublishedDate(article.date)}
                      </time>
                      <h2 className={`mt-2 font-serif text-xl font-normal leading-snug text-[#1c2619] transition group-hover:text-[#6f9556] sm:text-2xl ${playfair.className} ${
                        index === 0 ? "sm:text-3xl md:text-4xl" : ""
                      }`}>
                        {article.title}
                      </h2>
                      {article.excerpt && (
                        <p className="mt-3 line-clamp-3 text-xs font-light leading-6 text-[#586c52] sm:text-sm">
                          {article.excerpt}
                        </p>
                      )}
                    </div>

                    <div className="mt-6 pt-4 border-t border-[#e8f0e4]">
                      <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#6f9556] group-hover:text-[#24361e]">
                        <span>Đọc toàn bộ bài viết</span>
                        <span>→</span>
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-[2.5rem] border border-[#dce7d6] bg-white px-6 py-20 text-center">
              <p className={`text-3xl text-[#1c2619] ${playfair.className}`}>Những câu chuyện đầu tiên đang được chuẩn bị</p>
              <p className="mt-3 text-sm text-[#586c52]">Mời bạn quay lại trong ít ngày tới nhé.</p>
            </div>
          )}
        </section>
      </main>
      <LuxuryFloatingConcierge />
      <SiteFooter />
    </div>
  );
}

