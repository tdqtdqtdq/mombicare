import { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const {slug} = await params;
  const serviceMetadata = {
    "cham-soc-da": {
      title: "Chăm sóc da Buôn Ma Thuột | Mombi Care Spa",
      description: "Chăm sóc da tại Buôn Ma Thuột với liệu trình làm sạch, dưỡng ẩm và chăm sóc chuyên sâu. Xem thời lượng, bảng giá và đặt lịch tại Mombi Care Spa.",
      keywords: ["chăm sóc da Buôn Ma Thuột", "spa chăm sóc da BMT", "lấy nhân mụn Buôn Ma Thuột", "Mombi Care Spa"],
      image: "https://www.mombicarespa.com/img/skin-care.jpg",
    },
    "massage-thu-gian": {
      title: "Massage thư giãn Buôn Ma Thuột | Mombi Care Spa",
      description: "Massage thư giãn tại Buôn Ma Thuột với massage body, cổ vai gáy và gội đầu dưỡng sinh. Xem thời lượng, bảng giá và đặt lịch tại Mombi Care Spa.",
      keywords: ["massage Buôn Ma Thuột", "massage thư giãn BMT", "massage cổ vai gáy", "gội đầu dưỡng sinh Buôn Ma Thuột", "Mombi Care Spa"],
      image: "https://www.mombicarespa.com/img/massage%20body%20mombi%20care%20spa.jpg",
    },
  } as const;

  const service = serviceMetadata[slug as keyof typeof serviceMetadata];
  if (!service) return {};

  const url = `https://www.mombicarespa.com/dich-vu/${slug}`;

  return {
    title: service.title,
    description: service.description,
    keywords: [...service.keywords],
    alternates: { canonical: url },
    robots: {index: true, follow: true},
    openGraph: {
      title: service.title,
      description: service.description,
      url,
      siteName: "Mombi Care Spa",
      images: [
        {
          url: service.image,
          width: 1200,
          height: 630,
          alt: service.title,
        }
      ],
      locale: "vi_VN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: service.title,
      description: service.description,
      images: [service.image],
    }
  };
}

export default function ServiceCategoryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
