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
    *[_type == "article" && defined(slug.current)] | order(publishedAt desc) {
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
        <section className="relative overflow-hidden bg-[#edf3e8] px-5 py-16 text-center md:py-24">
          <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-[#bed7ae]/30 blur-3xl" />
          <div className="relative mx-auto max-w-3xl">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-[#789f5d]">Góc nhỏ của Mombi</p>
            <h1 className={`text-5xl text-[#293922] md:text-7xl ${playfair.className}`}>Chuyện nhà Mombi</h1>
            <p className="mx-auto mt-6 max-w-2xl text-base font-light leading-8 text-[#596a51]">Kiến thức chăm sóc làn da, cơ thể và những câu chuyện giúp bạn tìm về một nhịp nghỉ vừa vặn.</p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-20">
          {articles.length ? (
            <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((article, index) => (
                <Link key={article._id} href={`/chuyen-nha/${article.slug}`} className={`group overflow-hidden rounded-[1.75rem] border border-[#e1e8dc] bg-white shadow-[0_8px_30px_rgba(45,61,37,0.05)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(45,61,37,0.12)] ${index === 0 ? "md:col-span-2 lg:grid lg:grid-cols-2 lg:col-span-2" : ""}`}>
                  <div className={`relative overflow-hidden bg-[#e7eee2] ${index === 0 ? "aspect-[16/10] lg:aspect-auto lg:min-h-[360px]" : "aspect-[4/3]"}`}>
                    <Image src={article.image || "/img/landing-1.jpg"} alt={article.imageAlt || article.title} fill sizes={index === 0 ? "(max-width: 1024px) 100vw, 66vw" : "(max-width: 768px) 100vw, 33vw"} className="object-cover transition duration-700 group-hover:scale-105" />
                  </div>
                  <div className={`flex flex-col p-7 ${index === 0 ? "justify-center md:p-10" : ""}`}>
                    <time dateTime={article.date} className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7da361]">{formatPublishedDate(article.date)}</time>
                    <h2 className={`mb-4 text-2xl leading-snug text-[#2d3d25] transition group-hover:text-[#66864f] ${playfair.className} ${index === 0 ? "md:text-4xl" : ""}`}>{article.title}</h2>
                    {article.excerpt && <p className="line-clamp-3 text-sm font-light leading-7 text-[#63705d]">{article.excerpt}</p>}
                    <span className="mt-7 text-xs font-semibold uppercase tracking-[0.14em] text-[#729658]">Đọc bài viết →</span>
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
