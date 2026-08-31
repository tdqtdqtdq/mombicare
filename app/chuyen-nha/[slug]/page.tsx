import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Playfair_Display, Be_Vietnam_Pro } from "next/font/google";
import type { Metadata } from "next";
import type { PortableTextBlock } from "@portabletext/react";
import { client, formatPublishedDate } from "../../lib/sanity";
import { ArticleBody } from "../../components/ArticleBody";
import { SiteFooter, SiteHeader, LuxuryFloatingConcierge } from "../../components/SiteChrome";

const playfair = Playfair_Display({ subsets: ["vietnamese"], weight: ["400", "500", "600", "700"] });
const beVietnam = Be_Vietnam_Pro({ subsets: ["vietnamese"], weight: ["300", "400", "500", "600"] });

type Article = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  image?: string;
  imageAlt?: string;
  date?: string;
  updatedAt?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoImage?: string;
  noIndex?: boolean;
  body?: PortableTextBlock[];
};

type RelatedArticle = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
};

const articleQuery = `
  *[_type == "article" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    "image": mainImage.asset->url,
    "imageAlt": coalesce(mainImage.alt, title),
    "date": publishedAt,
    "updatedAt": _updatedAt,
    "seoTitle": coalesce(seo.title, title),
    "seoDescription": coalesce(seo.description, excerpt),
    "seoImage": coalesce(seo.image.asset->url, mainImage.asset->url),
    "noIndex": seo.noIndex == true,
    body[]{
      ...,
      _type == "image" => {
        "url": asset->url,
        "dimensions": asset->metadata.dimensions
      }
    }
  }
`;

async function getArticle(slug: string): Promise<Article | null> {
  return client.fetch(articleQuery, { slug }, { next: { revalidate: 60 } });
}

async function getRelatedArticles(slug: string): Promise<RelatedArticle[]> {
  return client.fetch(`
    *[_type == "article" && defined(slug.current) && slug.current != $slug && seo.noIndex != true]
      | order(publishedAt desc)[0...3] {
        _id,
        title,
        "slug": slug.current,
        excerpt
      }
  `, {slug}, {next: {revalidate: 60}});
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return { title: "Không tìm thấy bài viết | Mombi Care Spa" };

  return {
    title: article.seoTitle,
    description: article.seoDescription,
    alternates: {canonical: `/chuyen-nha/${article.slug}`},
    robots: article.noIndex ? {index: false, follow: false} : {index: true, follow: true},
    openGraph: {
      title: article.seoTitle,
      description: article.seoDescription,
      type: "article",
      publishedTime: article.date,
      modifiedTime: article.updatedAt,
      url: `/chuyen-nha/${article.slug}`,
      images: article.seoImage ? [{ url: article.seoImage, alt: article.imageAlt }] : [],
    },
  };
}

export default async function ArticleDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();
  const relatedArticles = await getRelatedArticles(slug);

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.seoDescription || article.excerpt,
    image: article.seoImage || article.image,
    datePublished: article.date,
    dateModified: article.updatedAt || article.date,
    mainEntityOfPage: `https://www.mombicarespa.com/chuyen-nha/${article.slug}`,
    author: {'@type': 'Organization', name: 'Mombi Care Spa'},
    publisher: {
      '@type': 'Organization',
      name: 'Mombi Care Spa',
      logo: {'@type': 'ImageObject', url: 'https://www.mombicarespa.com/icon.png'},
    },
  };

  return (
    <div className={`min-h-screen bg-[#faf8f5] text-[#1c2619] ${beVietnam.className}`}>
      <SiteHeader />
      <main>
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(articleJsonLd)}} />
        
        {/* Article Header */}
        <header className="relative overflow-hidden border-b border-[#dce7d6] bg-[#edf4e8] px-4 pb-20 pt-10 text-center sm:px-6 sm:pb-24 sm:pt-16 md:pb-32 md:pt-24">
          <div className="pointer-events-none absolute -left-28 -top-28 h-96 w-96 rounded-full bg-[#6f9556]/15 blur-3xl" />
          <div className="relative mx-auto max-w-4xl">
            <nav className="mb-6 flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#6f9556]" aria-label="Đường dẫn">
              <Link href="/" className="hover:underline">Trang chủ</Link>
              <span aria-hidden="true">/</span>
              <Link href="/chuyen-nha" className="hover:underline">Chuyện nhà Mombi</Link>
            </nav>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.28em] text-[#6f9556]">Chăm sóc &amp; An yên</p>
            <h1 className={`text-balance text-[2.5rem] font-normal leading-[1.06] text-[#1c2619] sm:text-5xl md:text-6xl lg:text-7xl ${playfair.className}`}>
              {article.title}
            </h1>
            {article.excerpt && (
              <p className="mx-auto mt-6 max-w-2xl text-sm font-light leading-7 text-[#55694f] sm:text-base sm:leading-8 md:text-lg">
                {article.excerpt}
              </p>
            )}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-xs text-[#63755c]">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-[#6f9556] font-serif text-sm font-bold text-white">M</span>
              <span className="font-semibold text-[#1c2619]">Mombi Care Spa</span>
              <span aria-hidden="true">•</span>
              <time dateTime={article.date}>{formatPublishedDate(article.date)}</time>
            </div>
          </div>
        </header>

        {/* Article Body Content */}
        <article className="mx-auto -mt-12 mb-16 w-[calc(100%-2rem)] max-w-4xl overflow-hidden rounded-[2.5rem] border border-[#dce7d6] bg-white shadow-[0_25px_70px_rgba(28,40,24,0.08)] sm:-mt-16 sm:mb-24 md:-mt-20">
          {article.image && (
            <div className="relative aspect-[16/9] w-full bg-[#e1ecd9]">
              <Image src={article.image} alt={article.imageAlt || article.title} fill sizes="(max-width: 1024px) 100vw, 1024px" className="object-cover" priority />
            </div>
          )}
          <div className="mx-auto max-w-[760px] px-6 py-10 sm:px-10 sm:py-14 md:px-14 md:py-20">
            <ArticleBody value={article.body} />
            
            <div className="mt-14 border-t border-[#e5eee1] pt-8 flex items-center justify-between">
              <Link href="/chuyen-nha" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#6f9556] hover:text-[#24361e]">
                <span>← Trở về Chuyện nhà Mombi</span>
              </Link>
              <a 
                href="https://zalo.me/0934250909" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#edf4e8] px-5 py-2 text-xs font-bold text-[#24361e] hover:bg-[#6f9556] hover:text-white transition"
              >
                Nhắn Mombi tư vấn →
              </a>
            </div>
          </div>
        </article>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="mx-auto mb-16 w-[calc(100%-2rem)] max-w-4xl rounded-[2.5rem] bg-[#1a2916] p-8 text-white sm:mb-24 sm:p-12" aria-labelledby="related-content-title">
            <div className="flex flex-col justify-between gap-4 border-b border-white/15 pb-6 sm:flex-row sm:items-end">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#a9c994]">Tiếp tục khám phá</p>
                <h2 id="related-content-title" className={`mt-2 font-serif text-2xl font-normal text-white sm:text-3xl ${playfair.className}`}>
                  Chăm sóc phù hợp với bạn
                </h2>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link href="/dich-vu/massage-thu-gian" className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold hover:bg-white hover:text-[#1a2916] transition">
                  Massage thư giãn
                </Link>
                <Link href="/dich-vu/cham-soc-da" className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold hover:bg-white hover:text-[#1a2916] transition">
                  Chăm sóc da
                </Link>
              </div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {relatedArticles.map((item) => (
                <article key={item._id} className="flex flex-col justify-between rounded-2xl bg-white/5 p-5 transition hover:bg-white/10">
                  <div>
                    <h3 className={`font-serif text-lg font-normal text-white ${playfair.className}`}>
                      <Link href={`/chuyen-nha/${item.slug}`} className="hover:text-[#a9c994]">
                        {item.title}
                      </Link>
                    </h3>
                    {item.excerpt && (
                      <p className="mt-2 line-clamp-2 text-xs font-light text-[#b2c6b2]">
                        {item.excerpt}
                      </p>
                    )}
                  </div>
                  <Link href={`/chuyen-nha/${item.slug}`} className="mt-4 text-xs font-bold text-[#a9c994]">
                    Đọc tiếp →
                  </Link>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>
      <LuxuryFloatingConcierge />
      <SiteFooter />
    </div>
  );
}

