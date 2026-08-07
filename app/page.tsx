// Không có "use client" ở đây -> File này chạy hoàn toàn trên Server
import HomeClient from "./components/HomeClient";
import { client, formatPublishedDate } from "./lib/sanity";

// Hàm gọi 4 bài viết mới nhất từ Sanity
async function getLatestArticles() {
  const query = `
    *[_type == "article"] | order(publishedAt desc)[0...4] {
      _id,
      title,
      "slug": slug.current,
      excerpt,
      "image": mainImage.asset->url,
      "date": publishedAt
    }
  `;
  return await client.fetch(query);
}

export default async function Page() {
  // Đợi lấy dữ liệu xong
  const articles = await getLatestArticles();

  // Đẩy dữ liệu xuống file HomeClient để nó vẽ giao diện
  return <HomeClient cmsArticles={articles.map((article: { date?: string }) => ({
    ...article,
    date: formatPublishedDate(article.date),
  }))} />;
}
