import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Playfair_Display, Be_Vietnam_Pro } from "next/font/google";
import type { Metadata } from "next";
import type { PortableTextBlock } from "@portabletext/react";
import { client, formatPublishedDate } from "../../lib/sanity";
import { ArticleBody } from "../../components/ArticleBody";
import { SiteFooter, SiteHeader } from "../../components/SiteChrome";

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
    <div className={`min-h-screen bg-[#f7f6f1] text-[#2d3d25] ${beVietnam.className}`}>
      <SiteHeader />
      <main>
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(articleJsonLd)}} />
        <header className="relative overflow-hidden border-b border-[#e2e9dc] bg-[#edf3e8] px-3 pb-16 pt-8 text-center sm:px-4 sm:pb-20 sm:pt-12 md:pb-28 md:pt-20">
          <div className="pointer-events-none absolute -left-28 -top-28 h-80 w-80 rounded-full bg-[#c8ddba]/30 blur-3xl" />
          <div className="relative mx-auto max-w-4xl">
            <nav className="mb-4 flex items-center justify-center gap-2 text-[10px] font-medium uppercase tracking-[0.12em] text-[#6f915a] sm:mb-7 sm:text-[11px] sm:tracking-[0.18em]" aria-label="Đường dẫn">
              <Link href="/" className="inline-flex min-h-11 items-center hover:text-[#405237]">Trang chủ</Link>
              <span aria-hidden="true">/</span>
              <Link href="/chuyen-nha" className="inline-flex min-h-11 items-center hover:text-[#405237]">Chuyện nhà Mombi</Link>
            </nav>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#789f5d] sm:mb-5 sm:tracking-[0.24em]">Chăm sóc &amp; an yên</p>
            <h1 className={`text-balance text-[2.5rem] leading-[1.08] text-[#293922] sm:text-5xl md:text-6xl lg:text-7xl ${playfair.className}`}>{article.title}</h1>
            {article.excerpt && <p className="mx-auto mt-5 max-w-2xl text-sm font-normal leading-7 text-[#56664e] sm:mt-7 sm:text-base sm:font-light sm:leading-8 md:text-lg">{article.excerpt}</p>}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-[11px] text-[#718069] sm:mt-8 sm:gap-3 sm:text-xs">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-[#789f5d] font-serif text-base font-bold text-white">M</span>
              <span>Mombi Care Spa</span><span aria-hidden="true">•</span><time dateTime={article.date}>{formatPublishedDate(article.date)}</time>
            </div>
          </div>
        </header>

        <article className="mx-auto -mt-10 mb-14 w-[calc(100%-1rem)] max-w-5xl overflow-hidden rounded-[1.35rem] border border-[#e3eadf] bg-white shadow-[0_24px_70px_rgba(49,67,39,0.09)] sm:-mt-12 sm:mb-20 sm:w-[calc(100%-2rem)] sm:rounded-[1.75rem] md:-mt-16 md:rounded-[2.5rem]">
          {article.image && (
            <div className="relative aspect-[4/3] w-full bg-[#e8efe3] sm:aspect-[16/9]">
              <Image src={article.image} alt={article.imageAlt || article.title} fill sizes="(max-width: 1024px) 100vw, 1024px" className="object-cover" priority />
            </div>
          )}
          <div className="mx-auto max-w-[760px] px-5 py-8 sm:px-6 sm:py-10 md:px-10 md:py-16">
            <ArticleBody value={article.body} />
            <div className="mt-14 border-t border-[#e6ece1] pt-8">
              <Link href="/chuyen-nha" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#6f9555] transition hover:gap-3 hover:text-[#557a3c]">
                <span aria-hidden="true">←</span> Xem thêm Chuyện nhà Mombi
              </Link>
            </div>
          </div>
        </article>

        <section className="mx-auto mb-14 w-[calc(100%-1rem)] max-w-5xl overflow-hidden rounded-[1.35rem] bg-[#26351f] p-5 text-white sm:mb-20 sm:w-[calc(100%-2rem)] sm:rounded-[1.75rem] sm:p-7 md:p-10" aria-labelledby="related-content-title">
          <div className="flex flex-col justify-between gap-5 border-b border-white/15 pb-6 sm:gap-6 sm:pb-8 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#b7d3a4] sm:text-[10px] sm:tracking-[0.22em]">Tiếp tục khám phá</p>
              <h2 id="related-content-title" className={`mt-3 text-[1.75rem] leading-tight sm:text-3xl md:text-4xl ${playfair.className}`}>Chăm sóc phù hợp với bạn</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/dich-vu/massage-thu-gian" className="inline-flex min-h-11 items-center rounded-full border border-white/25 px-4 text-[11px] font-semibold uppercase tracking-[0.1em] transition hover:bg-white hover:text-[#26351f]">Massage thư giãn</Link>
              <Link href="/dich-vu/cham-soc-da" className="inline-flex min-h-11 items-center rounded-full border border-white/25 px-4 text-[11px] font-semibold uppercase tracking-[0.1em] transition hover:bg-white hover:text-[#26351f]">Chăm sóc da</Link>
            </div>
          </div>

          {relatedArticles.length > 0 && (
            <div className="no-scrollbar -mx-5 mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 sm:-mx-7 sm:mt-8 sm:px-7 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0 md:pb-0">
              {relatedArticles.map((relatedArticle) => (
                <article key={relatedArticle._id} className="min-w-[82vw] snap-center rounded-2xl bg-white/[0.07] p-4 sm:min-w-[70vw] sm:p-5 md:min-w-0">
                  <h3 className={`text-xl leading-snug ${playfair.className}`}>
                    <Link href={`/chuyen-nha/${relatedArticle.slug}`} className="transition hover:text-[#c7e4b3]">{relatedArticle.title}</Link>
                  </h3>
                  {relatedArticle.excerpt && <p className="mt-3 line-clamp-2 text-sm font-normal leading-6 text-white/65 sm:font-light">{relatedArticle.excerpt}</p>}
                  <Link href={`/chuyen-nha/${relatedArticle.slug}`} className="mt-4 inline-flex min-h-11 items-center text-[11px] font-semibold uppercase tracking-[0.12em] text-[#b7d3a4] sm:mt-5">Đọc tiếp <span className="ml-2" aria-hidden="true">→</span></Link>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
