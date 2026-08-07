import Image from "next/image";
import Link from "next/link";
import { Playfair_Display, Be_Vietnam_Pro } from "next/font/google";
import type { Metadata } from "next";
import { client, formatPublishedDate } from "../lib/sanity";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";

const playfair = Playfair_Display({ subsets: ["vietnamese"], weight: ["400", "500", "600", "700"] });
const beVietnam = Be_Vietnam_Pro({ subsets: ["vietnamese"], weight: ["300", "400", "500", "600"] });

export const metadata: Metadata = {
  title: "Chuyện nhà Mombi | Chăm sóc da & thư giãn",
  description: "Kiến thức chăm sóc da, massage trị liệu và những câu chuyện an yên từ Mombi Care Spa.",
  alternates: {canonical: "/chuyen-nha"},
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
    <div className={`min-h-screen bg-[#f7f6f1] text-[#2d3d25] ${beVietnam.className}`}>
      <SiteHeader />
      <main>
        <section className="relative overflow-hidden bg-[#edf3e8] px-5 py-12 text-center sm:py-16 md:py-24">
          <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-[#bed7ae]/30 blur-3xl" />
          <div className="relative mx-auto max-w-3xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#789f5d] sm:mb-4 sm:tracking-[0.25em]">Góc nhỏ của Mombi</p>
            <h1 className={`text-[2.625rem] leading-[1.05] text-[#293922] sm:text-5xl md:text-7xl ${playfair.className}`}>Chuyện nhà Mombi</h1>
            <p className="mx-auto mt-5 max-w-2xl text-sm font-normal leading-7 text-[#596a51] sm:mt-6 sm:text-base sm:font-light sm:leading-8">Kiến thức chăm sóc làn da, cơ thể và những câu chuyện giúp bạn tìm về một nhịp nghỉ vừa vặn.</p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-3 py-10 sm:px-4 sm:py-14 md:px-8 md:py-20">
          {articles.length ? (
            <div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 md:gap-7 lg:grid-cols-3">
              {articles.map((article, index) => (
                <Link key={article._id} href={`/chuyen-nha/${article.slug}`} className={`group overflow-hidden rounded-[1.35rem] border border-[#e1e8dc] bg-white shadow-[0_8px_30px_rgba(45,61,37,0.05)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(45,61,37,0.12)] sm:rounded-[1.75rem] ${index === 0 ? "md:col-span-2 lg:col-span-2 lg:grid lg:grid-cols-2" : "grid grid-cols-[108px_minmax(0,1fr)] sm:block"}`}>
                  <div className={`relative overflow-hidden bg-[#e7eee2] ${index === 0 ? "aspect-[16/10] lg:aspect-auto lg:min-h-[360px]" : "min-h-[148px] sm:aspect-[16/10] sm:min-h-0 md:aspect-[4/3]"}`}>
                    <Image src={article.image || "/img/landing-1.jpg"} alt={article.imageAlt || article.title} fill sizes={index === 0 ? "(max-width: 1024px) 100vw, 66vw" : "(max-width: 768px) 100vw, 33vw"} className="object-cover transition duration-700 group-hover:scale-105" />
                  </div>
                  <div className={`flex min-w-0 flex-col p-4 sm:p-6 ${index === 0 ? "justify-center p-5 sm:p-7 md:p-10" : ""}`}>
                    <time dateTime={article.date} className="mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#7da361] sm:mb-3 sm:text-[11px] sm:tracking-[0.18em]">{formatPublishedDate(article.date)}</time>
                    <h2 className={`line-clamp-3 text-lg leading-snug text-[#2d3d25] transition group-hover:text-[#66864f] sm:text-2xl ${playfair.className} ${index === 0 ? "mb-3 text-[1.65rem] sm:mb-4 md:text-4xl" : "mb-2 sm:mb-4"}`}>{article.title}</h2>
                    {article.excerpt && <p className={`line-clamp-2 text-[13px] font-normal leading-6 text-[#63705d] sm:text-sm sm:font-light sm:leading-7 ${index === 0 ? "" : "hidden min-[390px]:block sm:block"}`}>{article.excerpt}</p>}
                    <span className={`mt-5 min-h-11 items-center text-[11px] font-semibold uppercase tracking-[0.12em] text-[#729658] sm:mt-6 sm:text-xs sm:tracking-[0.14em] ${index === 0 ? "inline-flex" : "hidden sm:inline-flex"}`}>Đọc bài viết →</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-[#e1e8dc] bg-white px-6 py-16 text-center">
              <p className={`text-3xl text-[#34452b] ${playfair.className}`}>Những câu chuyện đầu tiên đang được chuẩn bị</p>
              <p className="mt-3 text-sm text-[#687461]">Mời bạn quay lại trong ít ngày tới nhé.</p>
            </div>
          )}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
