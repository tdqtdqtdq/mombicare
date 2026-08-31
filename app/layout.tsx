import type { Metadata } from "next";
import { Be_Vietnam_Pro, Playfair_Display } from "next/font/google";
import "./globals.css";

const beVietnam = Be_Vietnam_Pro({
  subsets: ["vietnamese"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-be-vietnam",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["vietnamese"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.mombicarespa.com'),
  applicationName: 'Mombi Care Spa Buôn Ma Thuột',
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
  
  title: {
    default: "Spa Buôn Ma Thuột - Massage Thư Giãn, Gội Đầu & Chăm Sóc Da | Mombi Care Spa",
    template: "%s | Mombi Care Spa Buôn Ma Thuột",
  },
  description: "Top địa chỉ spa uy tín tại Buôn Ma Thuột (34 Trần Khánh Dư): Gội đầu dưỡng sinh thảo mộc, massage body, massage cổ vai gáy, chăm sóc da & cấy HA. Phục vụ nam nữ cả ngày lẫn đêm, không tip bắt buộc.",
  keywords: [
    "spa buôn ma thuột",
    "spa bmt",
    "spa ở buôn ma thuột",
    "spa uy tín buôn ma thuột",
    "gội đầu dưỡng sinh buôn ma thuột",
    "gội đầu dưỡng sinh bmt",
    "massage thư giãn buôn ma thuột",
    "massage body buôn ma thuột",
    "massage cổ vai gáy bmt",
    "chăm sóc da buôn ma thuột",
    "lấy nhân mụn buôn ma thuột",
    "cấy ha căng bóng buôn ma thuột",
    "spa mở cửa ban đêm buôn ma thuột",
    "spa nam nữ buôn ma thuột",
    "mombi care spa buôn ma thuột",
  ],
  openGraph: {
    title: "Spa Buôn Ma Thuột - Massage Thư Giãn & Chăm Sóc Da | Mombi Care Spa",
    description: "Trải nghiệm không gian spa an yên chuẩn Boutique tại 34 Trần Khánh Dư, Buôn Ma Thuột. Phục vụ cả ngày lẫn đêm, giá niêm yết minh bạch.",
    url: "https://www.mombicarespa.com",
    siteName: "Mombi Care Spa Buôn Ma Thuột",
    images: [
      {
        url: "/img/landing-1.jpg",
        width: 1200,
        height: 630,
        alt: "Không gian Mombi Care Spa Buôn Ma Thuột",
      },
    ],
    locale: "vi_VN",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

const businessJsonLd = {
  '@context': 'https://schema.org',
  '@type': ['DaySpa', 'HealthAndBeautyBusiness'],
  '@id': 'https://www.mombicarespa.com/#business',
  name: 'Mombi Care Spa',
  alternateName: ['Mombi Care', 'Mombicare Spa', 'Spa Mombi Buôn Ma Thuột', 'Spa Buôn Ma Thuột Mombi'],
  description: 'Trung tâm chăm sóc da, gội đầu dưỡng sinh và massage thư giãn trị liệu tại 34 Trần Khánh Dư, phường Tân Lợi, TP. Buôn Ma Thuột, Đắk Lắk. Phục vụ cả ngày lẫn đêm.',
  url: 'https://www.mombicarespa.com/',
  logo: 'https://www.mombicarespa.com/icon.png',
  image: [
    'https://www.mombicarespa.com/img/landing-1.jpg',
    'https://www.mombicarespa.com/img/ve-mombi1.jpg',
    'https://www.mombicarespa.com/img/ve-mombi2.jpg',
  ],
  telephone: '+84934250909',
  email: 'mombicarespa@gmail.com',
  priceRange: '50.000đ–490.000đ',
  currenciesAccepted: 'VND',
  paymentAccepted: 'Tiền mặt, Chuyển khoản ngân hàng, Quét mã QR',
  areaServed: [
    {'@type': 'City', name: 'Buôn Ma Thuột'},
    {'@type': 'AdministrativeArea', name: 'Đắk Lắk'},
  ],
  knowsAbout: [
    'Spa Buôn Ma Thuột',
    'Gội đầu dưỡng sinh Buôn Ma Thuột',
    'Massage body Buôn Ma Thuột',
    'Massage cổ vai gáy trị liệu',
    'Chăm sóc da chuyên sâu BMT',
    'Cấy HA căng bóng da',
    'Lấy nhân mụn chuẩn y khoa',
  ],
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 12.68557249339919,
    longitude: 108.04502350853478,
  },
  address: {
    '@type': 'PostalAddress',
    streetAddress: '34 Trần Khánh Dư, phường Tân Lợi',
    addressLocality: 'Buôn Ma Thuột',
    addressRegion: 'Đắk Lắk',
    postalCode: '630000',
    addressCountry: 'VN',
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '00:00',
      closes: '23:59',
    },
  ],
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    reviewCount: '520',
    bestRating: '5',
    worstRating: '1',
  },
  hasMap: 'https://www.google.com/maps/search/?api=1&query=Mombi+Care+Spa+34+Tran+Khanh+Du+Buon+Ma+Thuot',
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Dịch vụ Mombi Care Spa Buôn Ma Thuột',
    itemListElement: [
      { 
        '@type': 'OfferCatalog', 
        name: 'Massage & Thư Giãn Buôn Ma Thuột', 
        url: 'https://www.mombicarespa.com/dich-vu/massage-thu-gian' 
      },
      { 
        '@type': 'OfferCatalog', 
        name: 'Chăm Sóc Da Chuyên Sâu Buôn Ma Thuột', 
        url: 'https://www.mombicarespa.com/dich-vu/cham-soc-da' 
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${beVietnam.variable} ${playfair.variable} bg-[#faf8f5] text-[#1c2619] bg-grain selection:bg-[#789f5d]/20 selection:text-[#182515]`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(businessJsonLd),
          }}
        />
        {children}
      </body>
    </html>
  );
}
