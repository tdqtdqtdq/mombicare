// Không có "use client" ở đây -> File này chạy hoàn toàn trên Server
import HomeClient from "./components/HomeClient";
import { client, formatPublishedDate } from "./lib/sanity";

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

  return <HomeClient cmsArticles={articles.map((article: { date?: string }) => ({
    ...article,
    date: formatPublishedDate(article.date),
  }))} />;
}
