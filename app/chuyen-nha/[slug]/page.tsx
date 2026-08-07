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
        <header className="relative overflow-hidden border-b border-[#e2e9dc] bg-[#edf3e8] px-4 pb-20 pt-14 text-center md:pb-28 md:pt-20">
          <div className="pointer-events-none absolute -left-28 -top-28 h-80 w-80 rounded-full bg-[#c8ddba]/30 blur-3xl" />
          <div className="relative mx-auto max-w-4xl">
            <nav className="mb-7 flex items-center justify-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-[#6f915a]" aria-label="Đường dẫn">
              <Link href="/" className="hover:text-[#405237]">Trang chủ</Link>
              <span aria-hidden="true">/</span>
              <Link href="/chuyen-nha" className="hover:text-[#405237]">Chuyện nhà Mombi</Link>
            </nav>
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.24em] text-[#789f5d]">Chăm sóc &amp; an yên</p>
            <h1 className={`text-balance text-4xl leading-[1.15] text-[#293922] md:text-6xl lg:text-7xl ${playfair.className}`}>{article.title}</h1>
            {article.excerpt && <p className="mx-auto mt-7 max-w-2xl text-base font-light leading-8 text-[#56664e] md:text-lg">{article.excerpt}</p>}
            <div className="mt-8 flex items-center justify-center gap-3 text-xs text-[#718069]">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-[#789f5d] font-serif text-base font-bold text-white">M</span>
              <span>Mombi Care Spa</span><span aria-hidden="true">•</span><time dateTime={article.date}>{formatPublishedDate(article.date)}</time>
            </div>
          </div>
        </header>

        <article className="mx-auto -mt-12 mb-20 w-[calc(100%-2rem)] max-w-5xl overflow-hidden rounded-[1.75rem] border border-[#e3eadf] bg-white shadow-[0_24px_70px_rgba(49,67,39,0.09)] md:-mt-16 md:rounded-[2.5rem]">
          {article.image && (
            <div className="relative aspect-[16/9] w-full bg-[#e8efe3]">
              <Image src={article.image} alt={article.imageAlt || article.title} fill sizes="(max-width: 1024px) 100vw, 1024px" className="object-cover" priority />
            </div>
          )}
          <div className="mx-auto max-w-[760px] px-6 py-10 md:px-10 md:py-16">
            <ArticleBody value={article.body} />
            <div className="mt-14 border-t border-[#e6ece1] pt-8">
              <Link href="/chuyen-nha" className="inline-flex items-center gap-2 text-sm font-semibold text-[#6f9555] transition hover:gap-3 hover:text-[#557a3c]">
                <span aria-hidden="true">←</span> Xem thêm Chuyện nhà Mombi
              </Link>
            </div>
          </div>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
