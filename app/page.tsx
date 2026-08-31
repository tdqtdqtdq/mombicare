import type { Metadata } from "next";
import HomeClient from "./components/HomeClient";
import { client, formatPublishedDate } from "./lib/sanity";

export const metadata: Metadata = {
  title: "Spa Buôn Ma Thuột - Massage Thư Giãn, Gội Đầu Dưỡng Sinh & Chăm Sóc Da",
  description: "Mombi Care Spa - Địa chỉ spa uy tín hàng đầu tại 34 Trần Khánh Dư, Buôn Ma Thuột. Chuyên gội đầu dưỡng sinh thảo mộc, massage cổ vai gáy, massage body tinh dầu, lấy nhân mụn y khoa và cấy HA căng bóng. Phục vụ 24/7 cả ngày lẫn đêm.",
  alternates: {
    canonical: "https://www.mombicarespa.com/",
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://www.mombicarespa.com/#website",
  url: "https://www.mombicarespa.com/",
  name: "Mombi Care Spa Buôn Ma Thuột",
  description: "Trang chủ Mombi Care Spa - Spa massage thư giãn & chăm sóc da tại Buôn Ma Thuột",
  inLanguage: "vi-VN",
  publisher: {"@id": "https://www.mombicarespa.com/#business"},
};

// Lấy các bài đã xuất bản để tạo liên kết nội bộ từ trang chủ.
async function getLatestArticles() {
  const query = `
    *[_type == "article" && defined(slug.current) && seo.noIndex != true]
      | order(publishedAt desc)[0...6] {
      _id,
      title,
      "slug": slug.current,
      excerpt,
      "image": mainImage.asset->url,
      "date": publishedAt
    }
  `;
  return client.fetch(query, {}, {next: {revalidate: 60}});
}

export default async function Page() {
  const articles = await getLatestArticles();

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(websiteJsonLd)}} />
      <HomeClient cmsArticles={articles.map((article: { date?: string }) => ({
        ...article,
        date: formatPublishedDate(article.date),
      }))} />
    </>
  );
}

