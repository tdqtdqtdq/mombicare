import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://mombicarespa.com'), // BẮT BUỘC THÊM DÒNG NÀY
  
  title: "Mombi Care Spa | Tìm Về Một Nhịp Nghỉ Vừa Vặn",
  description: "Trải nghiệm dịch vụ spa, massage thư giãn, chăm sóc da và Onsen tại trung tâm Buôn Ma Thuột. Không gian yên tĩnh, kỹ thuật viên lành nghề.",
  keywords: "Mombi Care Spa, massage thư giãn, spa Buôn Ma Thuột, onsen Buôn Ma Thuột, chăm sóc da",
  openGraph: {
    title: "Mombi Care Spa - Trải nghiệm thư giãn tuyệt đối",
    description: "Đến Mombi Care Spa, tìm về một nhịp nghỉ vừa vặn giữa lòng Sài Gòn.",
    url: "https://mombicarespa.com",
    siteName: "Mombi Care Spa",
    images: [
      {
        url: "./img/landing.jpg", // Thay bằng link ảnh thực tế của bạn
        width: 1200,
        height: 630,
      },
    ],
    locale: "vi_VN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${inter.className} bg-[#f9f8f4] text-gray-800`}>
        {children}
      </body>
    </html>
  );
}