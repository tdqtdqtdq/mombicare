import { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Giải quyết Promise của Next.js bản mới
  const resolvedParams = await params;
  const isSkincare = resolvedParams.slug === "cham-soc-da";
  
  const keywords = isSkincare 
    ? ["chăm sóc da BMT", "cấy HA Buôn Ma Thuột", "trị mụn chuẩn y khoa", "spa chăm sóc da cao cấp", "Mombi Care Spa"]
    : ["massage thư giãn BMT", "gội đầu dưỡng sinh Buôn Ma Thuột", "massage cổ vai gáy", "Mombi Care Spa", "spa trị liệu"];

  const title = isSkincare 
    ? "Chăm Sóc Da Cao Cấp, Phục Hồi Chuẩn Y Khoa | Mombi Care Spa"
    : "Massage Thư Giãn, Gội Đầu Dưỡng Sinh Trị Liệu | Mombi Care Spa";

  const description = isSkincare
    ? "Trải nghiệm dịch vụ chăm sóc da chuyên sâu, cấy HA căng bóng, điều trị mụn chuẩn y khoa tại Mombi Care Spa Buôn Ma Thuột. Không gian thư giãn, kỹ thuật viên chuyên nghiệp."
    : "Tận hưởng không gian thư giãn tuyệt đối với dịch vụ gội đầu dưỡng sinh, massage cổ vai gáy và massage body trị liệu tại Mombi Care Spa BMT.";

  const url = `https://www.mombicarespa.com/dich-vu/${resolvedParams.slug}`;

  return {
    title,
    description,
    keywords,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "Mombi Care Spa",
      images: [
        {
          url: isSkincare ? "https://www.mombicarespa.com/img/skin-care.jpg" : "https://www.mombicarespa.com/img/massage%20body%20mombi%20care%20spa.jpg",
          width: 1200,
          height: 630,
          alt: title,
        }
      ],
      locale: "vi_VN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    }
  };
}

export default function ServiceCategoryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
