import Image from "next/image";
import Link from "next/link";
import { Playfair_Display, Be_Vietnam_Pro } from "next/font/google";
import { Metadata } from "next";

const playfair = Playfair_Display({ subsets: ["vietnamese"], weight: ["400", "500", "600", "700"] });
const beVietnam = Be_Vietnam_Pro({ subsets: ["vietnamese"], weight: ["300", "400", "500", "600"] });

export const metadata: Metadata = {
  title: "Chuyện nhà Mombi | Chia sẻ kiến thức chăm sóc da & thư giãn tại BMT",
  description: "Tổng hợp các bài viết chia sẻ bí quyết chăm sóc da, gội đầu dưỡng sinh và kinh nghiệm thư giãn tại Mombi Care Spa Buôn Ma Thuột.",
};

// ================= MẢNG DỮ LIỆU (Sau này thay thế bằng Sanity fetch) =================
const allArticles = [
  {
    slug: "hanh-trinh-tim-ve-nhip-nghi",
    title: "Hành trình tìm về nhịp nghỉ vừa vặn giữa lòng Buôn Ma Thuột",
    excerpt: "Đôi khi, tất cả những gì chúng ta cần sau một tuần làm việc mệt mỏi là một không gian yên tĩnh, thoảng hương thảo mộc để xoa dịu những căng thẳng...",
    image: "/img/landing-1.jpg",
    date: "12/04/2026",
  },
  {
    slug: "giai-ma-lieu-trinh-goi-dau-duong-sinh",
    title: "Giải mã liệu trình gội đầu dưỡng sinh đánh bay mất ngủ tại BMT",
    excerpt: "Không chỉ đơn thuần là làm sạch tóc, gội đầu dưỡng sinh tại Mombi còn kết hợp các kỹ thuật ấn huyệt cổ vai gáy chuyên sâu giúp tăng cường tuần hoàn máu...",
    image: "/img/landing-2.jpg",
    date: "05/04/2026",
  },
  {
    slug: "vi-sao-cay-ha-cang-bong-duoc-yeu-thich",
    title: "Vì sao Cấy HA căng bóng lại được yêu thích đến vậy?",
    excerpt: "Bước qua tuổi 25, làn da bắt đầu thiếu hụt độ ẩm và collagen. Liệu trình cấy HA tại Mombi mang đến giải pháp cấp ẩm tức thì, trả lại vẻ căng mướt...",
    image: "/img/landing-3.jpg",
    date: "28/03/2026",
  },
  {
    slug: "5-bi-quyet-duy-tri-lan-da-khoe-manh",
    title: "5 Bí quyết duy trì làn da khỏe mạnh sau lấy nhân mụn",
    excerpt: "Sau khi lấy nhân mụn chuẩn y khoa, việc chăm sóc tại nhà quyết định đến 80% khả năng phục hồi và không để lại thâm sẹo. Dưới đây là những lưu ý quan trọng...",
    image: "/img/lay-nhan-mun.jpg",
    date: "20/03/2026",
  }
];

export default function ChuyenNhaPage() {
  return (
    <div className={`min-h-screen bg-[#f9f8f4] text-[#2d3d25] ${beVietnam.className} flex flex-col`}>
      
      {/* HEADER */}
      <header className="w-full bg-[#455c34] text-white z-50 flex justify-between items-center px-4 py-4 md:px-16 md:py-6 text-[11px] md:text-[13px] uppercase tracking-[0.15em] font-medium sticky top-0 shadow-md">
        <div className="flex-1 flex justify-start">
          <Link href="/">
            <div className="relative w-28 h-10 md:w-40 md:h-12 cursor-pointer bg-white rounded px-2">
              <Image src="/img/logo-mombicare.jpg" alt="Mombi Care Spa Logo" fill sizes="160px" priority className="object-contain" />
            </div>
          </Link>
        </div>
        <nav className="hidden xl:flex gap-8 justify-center items-center">
          <Link href="/" className="hover:text-[#8bb96e] transition-colors">Trang chủ</Link>
          <Link href="/dich-vu/cham-soc-da" className="hover:text-[#8bb96e] transition-colors">Chăm sóc da</Link>
          <Link href="/dich-vu/massage-thu-gian" className="hover:text-[#8bb96e] transition-colors">Thư giãn & Massage</Link>
          <Link href="/chuyen-nha" className="text-[#8bb96e]">Chuyện nhà Mombi</Link>
        </nav>
        <div className="flex-1 flex justify-end">
          <a href="https://zalo.me/0934250909" target="_blank" rel="noopener noreferrer" className="hidden md:block bg-[#8bb96e] text-white px-6 py-2.5 rounded-full hover:bg-[#739f55] transition-colors">
            ĐẶT LỊCH NGAY
          </a>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 max-w-7xl mx-auto py-12 md:py-20 px-4 md:px-12 w-full">
        
        {/* Breadcrumb */}
        <nav className="flex text-xs tracking-wider text-[#8bb96e] mb-6 font-medium uppercase">
          <Link href="/" className="hover:text-[#5c6e51]">Trang chủ</Link>
          <span className="mx-2 text-[#5c6e51]">/</span>
          <span className="text-[#5c6e51]">Chuyện nhà Mombi</span>
        </nav>

        {/* Tiêu đề trang */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className={`text-4xl md:text-5xl text-[#2d3d25] mb-4 ${playfair.className}`}>Chuyện nhà Mombi</h1>
          <p className="text-[#5c6e51] font-light text-sm md:text-base">
            Góc nhỏ chia sẻ kiến thức làm đẹp, chăm sóc sức khỏe và những câu chuyện bình yên tại Mombi Care Spa Buôn Ma Thuột.
          </p>
        </div>

        {/* Lưới hiển thị bài viết (Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {allArticles.map((article, index) => (
            <Link key={index} href={`/chuyen-nha/${article.slug}`}>
              <div className="bg-white rounded-3xl shadow-sm hover:shadow-xl hover:shadow-[#8bb96e]/20 transition-all duration-300 border border-[#e4edd9] overflow-hidden flex flex-col h-[420px] group cursor-pointer text-left">
                
                {/* Ảnh */}
                <div className="relative w-full h-[200px] overflow-hidden bg-[#f6f9f2]">
                  <Image src={article.image} alt={article.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out" />
                </div>
                
                {/* Nội dung */}
                <div className="p-6 flex flex-col flex-1">
                  <span className="text-[#8bb96e] text-[10px] uppercase tracking-widest font-medium mb-3">{article.date}</span>
                  <h2 className={`text-[17px] text-[#2d3d25] mb-2 leading-snug line-clamp-2 ${playfair.className} group-hover:text-[#8bb96e] transition-colors`}>
                    {article.title}
                  </h2>
                  <p className="text-[#5c6e51] text-xs font-light leading-relaxed line-clamp-3 mb-4 flex-1">
                    {article.excerpt}
                  </p>
                  
                  <div className="mt-auto flex items-center text-[#8bb96e] text-xs font-medium tracking-wide group-hover:translate-x-1 transition-transform">
                    Đọc bài viết
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                  </div>
                </div>

              </div>
            </Link>
          ))}
        </div>

      </main>

      {/* FOOTER */}
      <footer className="bg-[#2d3d25] py-12 px-6 md:px-16 lg:px-24 mt-auto">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-12">
          <div className="flex flex-col items-start gap-4">
            <div className="relative w-36 h-12 bg-white rounded-xl overflow-hidden px-2 shadow-lg">
               <Image src="/img/logo-mombicare.jpg" alt="Mombi Care Spa" fill sizes="144px" className="object-contain p-1" />
            </div>
            <p className="text-sm text-[#d6e5c9] mt-2 font-light">Tìm về một nhịp nghỉ vừa vặn giữa lòng Buôn Ma Thuột.</p>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white mb-5">Liên kết nhanh</h4>
            <ul className="flex flex-col gap-3 text-sm text-[#d6e5c9] font-light">
              <li><Link href="/" className="hover:text-[#a9d18c]">Trang chủ</Link></li>
              <li><Link href="/chuyen-nha" className="hover:text-[#a9d18c]">Chuyện nhà Mombi</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white mb-5">Liên hệ</h4>
            <ul className="flex flex-col gap-3 text-sm text-[#d6e5c9] font-light">
              <li>📍 34 Trần Khánh Dư, P. Tân Lợi, TP. Buôn Ma Thuột</li>
              <li>📞 0934 250 909</li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}