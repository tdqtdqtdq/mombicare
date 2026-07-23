// app/sitemap.ts
import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  // Lấy danh sách các bài viết tĩnh đang có trong code của bạn
  const cmsArticles = [
    { slug: "hanh-trinh-tim-ve-nhip-nghi", date: "2026-04-12" },
    { slug: "giai-ma-lieu-trinh-goi-dau-duong-sinh", date: "2026-04-05" },
    { slug: "vi-sao-cay-ha-cang-bong-duoc-yeu-thich", date: "2026-03-28" },
    { slug: "5-bi-quyet-duy-tri-lan-da-khoe-manh", date: "2026-03-20" }
  ];

  // Map các bài viết thành URL cho sitemap
  const articleUrls = cmsArticles.map((article) => ({
    url: `https://mombicarespa.com/chuyen-nha/${article.slug}`,
    lastModified: new Date(article.date),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Khai báo các trang tĩnh (Trang chủ, dịch vụ, quà tặng...)
 // Khai báo các trang tĩnh (Trang chủ, dịch vụ, quà tặng...)
  const routes = [
    '',
    '/dich-vu/cham-soc-da',
    '/dich-vu/massage-thu-gian',
    '/phieu-qua-tang',
    '/chuyen-nha',
  ].map((route) => ({
    url: `https://mombicarespa.com${route}`,
    lastModified: new Date(),
    // Đã sửa dòng dưới đây: Thêm ngoặc và ép kiểu
    changeFrequency: (route === '' ? 'daily' : 'weekly') as "daily" | "weekly", 
    priority: route === '' ? 1 : 0.8,
  }));
  return [...routes, ...articleUrls];
}