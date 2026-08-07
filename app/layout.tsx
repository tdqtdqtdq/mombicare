import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin", "vietnamese"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.mombicarespa.com'),
  applicationName: 'Mombi Care Spa',
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: [
      {url: '/favicon-96x96.png', type: 'image/png', sizes: '96x96'},
      {url: '/icon.png', type: 'image/png', sizes: '512x512'},
    ],
    shortcut: '/favicon-96x96.png',
  },
  
  title: "Mombi Care Spa | Spa Thư Giãn & Chăm Sóc Da Tại Buôn Ma Thuột",
  description: "Trải nghiệm massage thư giãn và chăm sóc da tại Mombi Care Spa, trung tâm Buôn Ma Thuột. Không gian yên tĩnh, kỹ thuật viên lành nghề, phục vụ cả ngày lẫn đêm.",
  keywords: "Mombi Care Spa, massage thư giãn, spa Buôn Ma Thuột, chăm sóc da, spa mở cửa ngày đêm",
  openGraph: {
    title: "Mombi Care Spa - Trải nghiệm thư giãn tuyệt đối",
    description: "Đến Mombi Care Spa, tìm về một nhịp nghỉ vừa vặn giữa lòng Buôn Ma Thuột.",
    url: "https://www.mombicarespa.com",
    siteName: "Mombi Care Spa",
    images: [
      {
        url: "/img/landing-1.jpg",
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
      <body className={`${inter.variable} ${playfair.variable} bg-[#f9f8f4] text-gray-800`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'HealthAndBeautyBusiness',
              '@id': 'https://www.mombicarespa.com/#business',
              name: 'Mombi Care Spa',
              url: 'https://www.mombicarespa.com/',
              logo: 'https://www.mombicarespa.com/icon.png',
              image: 'https://www.mombicarespa.com/img/landing-1.jpg',
              telephone: '+84934250909',
              address: {
                '@type': 'PostalAddress',
                streetAddress: '34 Trần Khánh Dư',
                addressLocality: 'Buôn Ma Thuột',
                addressCountry: 'VN',
              },
            }),
          }}
        />
        {children}
      </body>
    </html>
  );
}
