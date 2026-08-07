"use client";

import { useState, useEffect, useRef } from "react";
import type { RefObject } from "react";
import Image from "next/image";
import Link from "next/link";
import ScrollAnimation from "./ScrollAnimation"; // Đã sửa lại đường dẫn cho đúng thư mục components
import { Playfair_Display, Be_Vietnam_Pro } from "next/font/google";

const playfair = Playfair_Display({ 
  subsets: ["vietnamese"], 
  weight: ["400", "500", "600", "700"] 
});

const beVietnam = Be_Vietnam_Pro({ 
  subsets: ["vietnamese"], 
  weight: ["300", "400", "500", "600"] 
});

type HomeArticle = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  image?: string;
  date: string;
};

// NHẬN DỮ LIỆU TỪ SANITY THÔNG QUA PROPS
export default function HomeClient({ cmsArticles }: { cmsArticles: HomeArticle[] }) {
  const heroImages = [
    "/img/landing-1.jpg",
    "/img/landing-2.jpg",
    "/img/landing-3.jpg"
  ];
  
  // ================= STATES & REFS =================
  const [currentImg, setCurrentImg] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const [showSplash, setShowSplash] = useState(true);
  const [fadeSplash, setFadeSplash] = useState(false);
  const [offsetY, setOffsetY] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [hasClosedPopup, setHasClosedPopup] = useState(false);

  const testimonialsRef = useRef<HTMLDivElement>(null);
  const storiesRef = useRef<HTMLDivElement>(null);

  const scrollLeft = (ref: RefObject<HTMLDivElement | null>) => {
    if (ref.current) ref.current.scrollBy({ left: -350, behavior: 'smooth' });
  };
  const scrollRight = (ref: RefObject<HTMLDivElement | null>) => {
    if (ref.current) ref.current.scrollBy({ left: 350, behavior: 'smooth' });
  };

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFadeSplash(true), 1500);
    const hideTimer = setTimeout(() => setShowSplash(false), 2000);
    const sliderTimer = setInterval(() => {
      setCurrentImg((prev) => (prev + 1) % heroImages.length);
    }, 5000); 

    return () => { 
      clearTimeout(fadeTimer); 
      clearTimeout(hideTimer);
      clearInterval(sliderTimer);
    };
  }, [heroImages.length]);

  useEffect(() => {
    const handleScroll = () => setOffsetY(window.pageYOffset);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const popupTimer = setTimeout(() => {
      if (!hasClosedPopup) setShowPopup(true);
    }, 10000);

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasClosedPopup) setShowPopup(true);
    };
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      clearTimeout(popupTimer);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [hasClosedPopup]);

  const signatureServices = [
    { name: "Gội đầu dưỡng sinh", time: "70 phút", image: "/img/goi-dau.jpg", href: "/dich-vu/massage-thu-gian", desc: "Làm sạch sâu kết hợp massage ấn huyệt vùng đầu, cổ vai gáy, đả thông kinh lạc, mang lại giấc ngủ ngon." },
    { name: "Massage vai cổ gáy trị liệu", time: "45 phút", image: "/img/co-vai-gay-tri-lieu.jpg", href: "/dich-vu/massage-thu-gian", desc: "Trị liệu chuyên sâu, gỡ các điểm bó cơ, giảm nhanh tình trạng căng cơ, đau nhức hiệu quả." },
    { name: "Cấy HA căng bóng da", time: "90 phút", image: "/img/cay-ha.jpg", href: "/dich-vu/cham-soc-da", desc: "Cung cấp độ ẩm sâu, giúp làn da căng bóng, mịn màng và giảm thiểu nếp nhăn, mang lại vẻ tươi trẻ." },
    { name: "Lấy nhân mụn chuẩn Y khoa", time: "60 phút", image: "/img/lay-nhan-mun.jpg", href: "/dich-vu/cham-soc-da", desc: "Xử lý các nhân mụn chuẩn y khoa, dụng cụ tiệt trùng 100%, an toàn, hạn chế tối đa để lại thâm sẹo." },
  ];

  const testimonials = [
    { name: "Trần Mai Anh", service: "Gội đầu dưỡng sinh", quote: "Không gian yên tĩnh đến mức mình đã ngủ quên lúc nào không hay. Các bạn kỹ thuật viên massage gáy rất vừa lực. Chắc chắn sẽ ghé lại Mombi mỗi cuối tuần.", rating: 5 },
    { name: "Nguyễn Hà My", service: "Chăm sóc da chuyên sâu", quote: "Lần đầu tiên đi Spa mà không bị chèo kéo mua gói liệu trình. Da mình sau khi cấy HA căng bóng lên hẳn, quy trình làm rất kỹ và dụng cụ sạch sẽ.", rating: 5 },
    { name: "Lê Hoàng Ngọc", service: "Massage Body Trị Liệu", quote: "Mình làm văn phòng nên vai gáy lúc nào cũng mỏi nhừ. Đến Mombi làm gói trị liệu 90 phút xong thấy người nhẹ bẫng. Rất ưng ý mùi hương tinh dầu.", rating: 5 },
    { name: "Phạm Thúy Vy", service: "Lấy nhân mụn Y khoa", quote: "Lấy mụn không hề bị sưng tấy đỏ như những chỗ khác. Các bạn làm rất nhẹ nhàng, phòng ốc lại thơm tho, nhạc thiền thư giãn vô cùng.", rating: 5 }
  ];

  const features = [
    { name: 'KHÔNG GIAN', svg: "M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" },
    { name: 'HƯƠNG THƠM', svg: "M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" },
    { name: 'ÂM NHẠC', svg: "M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" },
    { name: 'TRÀ & BÁNH', svg: "M15 13V5H5v8a5 5 0 0010 0zM5 5h10M15 7h2a2 2 0 012 2v0a2 2 0 01-2 2h-2" },
    { name: 'SỰ TRỌN VẸN', svg: "M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" }
  ];

  const faqs = [
    { q: "Spa có chỗ đậu xe ô tô không?", a: "Dạ có ạ. Mombi Care Spa có khuôn viên đỗ xe ô tô rộng rãi, an toàn và hoàn toàn miễn phí ngay trước cửa Spa cho khách hàng yên tâm thư giãn." },
    { q: "Giá dịch vụ đã bao gồm tiền Tip chưa?", a: "Tuyệt đối không có chi phí ẩn. Mọi giá dịch vụ tại bảng giá Mombi đã bao gồm 100% chi phí. Khách hàng đến thư giãn không bắt buộc và không cần bận tâm thêm về tiền tip." },
    { q: "Mombi có nhận khách Nam không?", a: "Mombi hoan nghênh cả khách Nam và Nữ. Chúng tôi có các phòng trị liệu riêng biệt để đảm bảo sự thoải mái, lịch sự và riêng tư tối đa cho mọi khách hàng." },
    { q: "Nên đặt lịch trước bao lâu?", a: "Để Mombi có thể chuẩn bị phòng ốc thảo mộc và kỹ thuật viên chu đáo nhất, quý khách nên đặt lịch trước ít nhất 2 tiếng qua Zalo hoặc số Hotline nhé." }
  ];

  return (
    <main className={`min-h-screen relative text-[#2d3d25] ${beVietnam.className}`}>
      
      {showSplash && (
        <div className={`fixed inset-0 z-[9999] bg-[#f6f9f2] flex items-center justify-center transition-opacity duration-500 ${fadeSplash ? "opacity-0" : "opacity-100"}`}>
          <div className="flex flex-col items-center animate-pulse">
            <div className="relative w-48 h-20 opacity-80 mix-blend-multiply">
              <Image src="/img/logo-mombicare.jpg" alt="Mombi Care Spa Loading..." fill sizes="(max-width: 768px) 192px, 192px" priority className="object-contain" />
            </div>
            <p className={`mt-4 tracking-[0.3em] text-[#8bb96e] text-xs uppercase ${playfair.className}`}>Tìm về nhịp nghỉ vừa vặn</p>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes blob { 0% { transform: translate(0px, 0px) scale(1); } 33% { transform: translate(30px, -50px) scale(1.1); } 66% { transform: translate(-20px, 20px) scale(0.9); } 100% { transform: translate(0px, 0px) scale(1); } }
        .animate-blob { animation: blob 10s infinite alternate; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}} />

      <section className="relative h-[80vh] w-full flex items-center justify-center text-white overflow-hidden bg-[#455c34]">
        <div className="absolute inset-0 w-full h-[120%] -top-[10%] z-0 pointer-events-none" style={{ transform: `translateY(${offsetY * 0.4}px)` }}>
          {heroImages.map((src, index) => (
            <div key={index} className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentImg ? "opacity-100" : "opacity-0"}`}>
              <div className="absolute inset-0 bg-[#2d3d25]/40 z-10"></div> 
              <Image src={src} alt={`Mombi Care Spa Banner ${index + 1}`} fill className="object-cover" priority={index === 0} />
            </div>
          ))}
        </div>
        
        <header className="absolute top-0 w-full z-50 flex justify-between items-center px-4 py-4 md:px-16 md:py-6 text-[11px] md:text-[13px] uppercase tracking-[0.15em] font-medium border-b border-white/10">
          <div className="flex-1 flex justify-start">
            <Link href="/">
              <div className="relative w-28 h-10 md:w-40 md:h-14 cursor-pointer hover:opacity-80 transition-opacity filter drop-shadow-md">
                <Image src="/img/logo-mombicare.jpg" alt="Mombi Care Spa Logo" fill sizes="(max-width: 768px) 112px, 160px" priority className="object-contain object-left" />
              </div>
            </Link>
          </div>
          
          <nav className="hidden xl:flex gap-8 justify-center items-center">
            <Link href="/" className="hover:text-[#8bb96e] transition-colors">Trang chủ</Link>
            <div className="relative py-2" onMouseEnter={() => setIsDropdownOpen(true)} onMouseLeave={() => setIsDropdownOpen(false)}>
              <Link href="/dich-vu" className={`transition-colors pb-1 ${isDropdownOpen ? 'text-[#8bb96e]' : 'hover:text-[#8bb96e]'}`}>Dịch vụ</Link>
              <div className={`absolute top-full left-1/2 -translate-x-1/2 pt-2 w-56 transition-all duration-300 z-50 ${isDropdownOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}>
                <div className="bg-white rounded-xl shadow-2xl shadow-[#8bb96e]/10 border border-[#e4edd9] flex flex-col py-2 overflow-hidden text-[#5c6e51]">
                  <Link href="/dich-vu/cham-soc-da" className="px-6 py-3 text-left text-[10px] tracking-widest hover:text-[#8bb96e] hover:bg-[#f6f9f2] transition-colors">CHĂM SÓC DA CAO CẤP</Link>
                  <Link href="/dich-vu/massage-thu-gian" className="px-6 py-3 text-left text-[10px] tracking-widest hover:text-[#8bb96e] hover:bg-[#f6f9f2] transition-colors">THƯ GIÃN & MASSAGE</Link>
                </div>
              </div>
            </div>
            <Link href="#ve-mombi" className="hover:text-[#8bb96e] transition-colors">Về Mombi</Link>
            <Link href="#chuyen-nha" className="hover:text-[#8bb96e] transition-colors">Chuyện nhà Mombi</Link>
            <Link href="/phieu-qua-tang" className="hover:text-[#8bb96e] transition-colors">Phiếu quà tặng</Link>
          </nav>

          <div className="flex-1 flex justify-end items-center gap-4">
            <div className="hidden md:flex items-center gap-1 cursor-pointer hover:text-[#8bb96e] transition-colors">
              <span>VI</span>
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <button className="xl:hidden p-2 text-white hover:text-[#8bb96e] transition-colors" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{isMobileMenuOpen ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M4 6h16M4 12h16M4 18h16" />}</svg>
            </button>
          </div>
        </header>

        <div className={`xl:hidden absolute top-[73px] md:top-[89px] left-0 w-full bg-white border-b border-[#e4edd9] shadow-2xl transition-all duration-300 ease-in-out z-40 overflow-hidden ${isMobileMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
          <nav className="flex flex-col py-4 px-6 text-xs uppercase tracking-widest text-[#5c6e51]">
            <Link href="/" className="py-4 border-b border-[#f6f9f2] hover:text-[#8bb96e]" onClick={() => setIsMobileMenuOpen(false)}>Trang chủ</Link>
            <div className="flex flex-col border-b border-[#f6f9f2]">
              <button className="py-4 flex justify-between items-center hover:text-[#8bb96e] text-left uppercase" onClick={() => setIsMobileServicesOpen(!isMobileServicesOpen)}>
                Dịch vụ
                <svg className={`w-4 h-4 transform transition-transform ${isMobileServicesOpen ? 'rotate-180 text-[#8bb96e]' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
              </button>
              <div className={`flex flex-col pl-4 border-l-2 border-[#8bb96e]/30 ml-2 overflow-hidden transition-all duration-300 ${isMobileServicesOpen ? 'max-h-40 mb-4' : 'max-h-0'}`}>
                <Link href="/dich-vu/cham-soc-da" className="py-3 hover:text-[#8bb96e]" onClick={() => setIsMobileMenuOpen(false)}>Chăm sóc da cao cấp</Link>
                <Link href="/dich-vu/massage-thu-gian" className="py-3 hover:text-[#8bb96e]" onClick={() => setIsMobileMenuOpen(false)}>Thư giãn & Massage</Link>
              </div>
            </div>
            <Link href="#ve-mombi" className="py-4 border-b border-[#f6f9f2] hover:text-[#8bb96e]" onClick={() => setIsMobileMenuOpen(false)}>Về Mombi Care Spa</Link>
            <Link href="#chuyen-nha" className="py-4 border-b border-[#f6f9f2] hover:text-[#8bb96e]" onClick={() => setIsMobileMenuOpen(false)}>Chuyện nhà Mombi</Link>
            <Link href="/phieu-qua-tang" className="py-4 hover:text-[#8bb96e]" onClick={() => setIsMobileMenuOpen(false)}>Phiếu quà tặng</Link>
          </nav>
        </div>

        <div className="z-20 text-center px-4 pt-10">
          <ScrollAnimation>
            <h2 className={`text-4xl md:text-6xl lg:text-7xl mb-2 md:mb-4 font-normal drop-shadow-md ${playfair.className}`}>Đến Mombi, tìm về</h2>
            <h2 className={`text-4xl md:text-6xl lg:text-7xl mb-8 md:mb-12 font-normal drop-shadow-md ${playfair.className}`}>một nhịp nghỉ vừa vặn</h2>
          </ScrollAnimation>
          <ScrollAnimation delay={0.2}>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center px-4">
              <a href="https://zalo.me/0934250909" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto text-center bg-[#8bb96e] text-white rounded-full px-8 md:px-10 py-3 md:py-3.5 text-xs md:text-sm tracking-wider hover:bg-[#739f55] transition-all shadow-lg hover:-translate-y-1">
                ĐẶT LỊCH VỚI MOMBI
              </a>
              <Link href="/phieu-qua-tang" className="w-full sm:w-auto text-center border border-white text-white rounded-full px-8 md:px-10 py-3 md:py-3.5 text-xs md:text-sm tracking-wider hover:bg-white hover:text-[#2d3d25] transition-all">
                PHIẾU QUÀ TẶNG
              </Link>
            </div>
          </ScrollAnimation>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {heroImages.map((_, idx) => (
            <button key={idx} onClick={() => setCurrentImg(idx)} className={`w-2 h-2 rounded-full transition-colors ${idx === currentImg ? 'bg-[#8bb96e]' : 'bg-white/50'}`} />
          ))}
        </div>
      </section>

      <section className="py-12 md:py-16 px-4 md:px-12 lg:px-24 bg-[#f6f9f2] text-center">
        <div className="relative z-10">
          <ScrollAnimation>
            <h3 className={`text-3xl md:text-4xl mb-3 text-[#2d3d25] ${playfair.className}`}>Dịch vụ Nổi bật</h3>
            <p className="max-w-2xl mx-auto text-[#5c6e51] mb-8 md:mb-12 text-sm font-light">
              Chắt lọc những tinh hoa trị liệu và chăm sóc da để mang lại cho bạn sự thư thái trọn vẹn nhất.
            </p>
          </ScrollAnimation>
        </div>

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-10 text-left max-w-7xl mx-auto">
          {signatureServices.map((service, index) => (
            <div key={service.name} className="group bg-white shadow-sm hover:shadow-xl hover:shadow-[#8bb96e]/10 transition-all duration-300 rounded-2xl md:rounded-3xl overflow-hidden flex flex-col h-full border border-transparent hover:border-[#e4edd9]">
              <ScrollAnimation delay={index * 0.1} >
                <Link href={service.href} aria-label={`Xem dịch vụ ${service.name}`} className="block relative w-full h-[160px] md:h-[180px] overflow-hidden bg-[#e4edd9]">
                  <Image src={service.image} alt={service.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                </Link>
                <div className="p-5 md:p-6 flex flex-col flex-1">
                  <p className="text-[10px] tracking-widest text-[#8bb96e] mb-2 uppercase font-medium">{service.time}</p>
                  <Link href={service.href} className="hover:text-[#739f55] transition-colors"><h4 className={`text-lg mb-2 leading-snug ${playfair.className}`}>{service.name}</h4></Link>
                  <p className="text-sm text-[#5c6e51] font-light leading-relaxed mb-5 flex-1">{service.desc}</p>
                  <a href="https://zalo.me/0934250909" target="_blank" rel="noopener noreferrer" className="block text-center border border-[#8bb96e] rounded-full text-[#8bb96e] px-4 py-2.5 text-[10px] uppercase tracking-widest hover:bg-[#8bb96e] hover:text-white transition-colors">Đặt lịch ngay</a>
                </div>
              </ScrollAnimation>
            </div>
          ))}
        </div>
        
        <div className="relative z-10">
          <ScrollAnimation delay={0.4}>
            <Link href="/dich-vu">
              <button className="bg-[#8bb96e] text-white rounded-full px-8 md:px-10 py-3 md:py-3.5 text-xs md:text-sm tracking-widest hover:bg-[#739f55] transition-all shadow-md">XEM TOÀN BỘ BẢNG GIÁ</button>
            </Link>
          </ScrollAnimation>
        </div>
      </section>

      <section id="ve-mombi" className="py-12 md:py-16 px-4 md:px-12 lg:px-24 bg-white border-t border-[#e4edd9]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="text-left relative z-10 order-2 lg:order-1">
            <ScrollAnimation>
              <h3 className={`text-3xl md:text-4xl mb-4 text-[#2d3d25] ${playfair.className}`}>Về Mombi Care Spa</h3>
              <p className="text-[#5c6e51] mb-8 text-sm md:text-base leading-relaxed font-light">
                Từ không gian cho đến dịch vụ ở Mombi đều được chăm chút và thực hiện tỉ mỉ qua đôi bàn tay của những kỹ thuật viên lành nghề. Mang đến cho bạn một trải nghiệm thư giãn tinh tế, đánh thức mọi giác quan qua hương thơm, âm nhạc và những liệu trình chăm sóc trọn vẹn nhất.
              </p>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-5">
                {features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3 group cursor-pointer">
                    <div className="w-10 h-10 rounded-full bg-[#f6f9f2] flex items-center justify-center text-[#8bb96e] group-hover:bg-[#8bb96e] group-hover:text-white transition-all duration-300 shadow-sm flex-shrink-0">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d={feature.svg} /></svg>
                    </div>
                    <span className="text-[10px] font-semibold tracking-widest text-[#5c6e51] group-hover:text-[#8bb96e] transition-colors leading-tight">{feature.name}</span>
                  </div>
                ))}
              </div>
            </ScrollAnimation>
          </div>

          <div className="relative z-10 order-1 lg:order-2">
            <ScrollAnimation delay={0.2}>
              <div className="grid grid-cols-2 gap-3 h-[300px] sm:h-[400px] lg:h-[400px]">
                <div className="relative w-full h-full bg-[#f6f9f2] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <Image src="/img/ve-mombi.jpg" alt="Về Mombi Care Spa" fill className="object-cover" />
                </div>
                <div className="flex flex-col gap-3 h-full">
                  <div className="relative w-full h-[48%] bg-[#edf4e6] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <Image src="/img/ve-mombi1.jpg" alt="Chăm sóc da" fill className="object-cover" />
                  </div>
                  <div className="relative w-full h-[48%] bg-[#8bb96e]/20 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <Image src="/img/ve-mombi2.jpg" alt="Massage body Mombi" fill className="object-cover" />
                  </div>
                </div>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      <section className="relative py-12 md:py-16 bg-[#f6f9f2] text-center overflow-hidden border-t border-[#e4edd9]">
        <div className="absolute top-0 left-[-10%] w-64 h-64 bg-[#8bb96e] rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-blob"></div>
        <div className="absolute top-10 right-[-5%] w-72 h-72 bg-[#d6e5c9] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>

        <div className="relative z-10">
          <ScrollAnimation>
            <h3 className={`text-3xl md:text-4xl mb-3 text-[#2d3d25] ${playfair.className}`}>Khách hàng nói về Mombi</h3>
            <p className="max-w-2xl mx-auto text-[#5c6e51] mb-8 md:mb-12 text-sm font-light px-4">
              Hàng ngàn khách hàng đã trải nghiệm và tìm thấy sự thư thái trọn vẹn tại không gian của chúng tôi.
            </p>
          </ScrollAnimation>
        </div>

        <div className="relative z-10 w-full max-w-[1400px] mx-auto group px-4 md:px-12">
          <button onClick={() => scrollLeft(testimonialsRef)} className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white rounded-full shadow-lg border border-[#e4edd9] text-[#8bb96e] hover:bg-[#8bb96e] hover:text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 hidden md:flex">
             <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
          </button>

          <div ref={testimonialsRef} className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-8 w-full no-scrollbar px-2">
            {testimonials.map((item, index) => (
              <div key={index} className="snap-center shrink-0 w-[280px] md:w-[350px]">
                <ScrollAnimation delay={index * 0.1}>
                  <div className="bg-white/80 backdrop-blur-md p-6 md:p-8 rounded-3xl text-left border border-[#e4edd9] shadow-sm hover:shadow-xl hover:shadow-[#8bb96e]/10 transition-all duration-300 flex flex-col h-full group/card">
                    <div className="flex gap-1 mb-4 text-[#d9a05b]">
                      {[...Array(item.rating)].map((_, i) => (
                        <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                      ))}
                    </div>
                    <p className="text-[#5c6e51] text-sm leading-relaxed italic mb-6 flex-1 group-hover/card:text-[#2d3d25] transition-colors">&ldquo;{item.quote}&rdquo;</p>
                    <div className="flex items-center gap-4 mt-auto">
                      <div className="w-10 h-10 bg-[#8bb96e]/10 rounded-full flex items-center justify-center text-[#8bb96e] font-bold text-base border border-[#8bb96e]/20">{item.name.charAt(0)}</div>
                      <div>
                        <h4 className={`text-[#2d3d25] font-semibold text-sm ${playfair.className}`}>{item.name}</h4>
                        <p className="text-[#8bb96e] text-[9px] uppercase tracking-widest font-medium mt-1">{item.service}</p>
                      </div>
                    </div>
                  </div>
                </ScrollAnimation>
              </div>
            ))}
          </div>

          <button onClick={() => scrollRight(testimonialsRef)} className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white rounded-full shadow-lg border border-[#e4edd9] text-[#8bb96e] hover:bg-[#8bb96e] hover:text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 hidden md:flex">
             <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        </div>
      </section>

      <section className="py-12 md:py-16 px-4 md:px-12 lg:px-24 bg-white text-center border-t border-[#e4edd9]">
        <div className="relative z-10">
          <ScrollAnimation>
            <h3 className={`text-3xl md:text-4xl mb-3 text-[#2d3d25] ${playfair.className}`}>Câu hỏi thường gặp</h3>
            <p className="max-w-2xl mx-auto text-[#5c6e51] mb-8 md:mb-12 text-sm font-light">Giải đáp những thắc mắc phổ biến nhất để bạn an tâm thư giãn tại Mombi.</p>
          </ScrollAnimation>
        </div>
        <div className="relative z-10 max-w-3xl mx-auto flex flex-col gap-3 text-left">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <ScrollAnimation key={index} delay={index * 0.1}>
                <div className="bg-[#f6f9f2] rounded-2xl shadow-sm border border-[#e4edd9] overflow-hidden transition-all duration-300">
                  <button onClick={() => setOpenFaq(isOpen ? null : index)} className={`w-full px-5 py-4 flex justify-between items-center transition-colors ${isOpen ? 'bg-[#8bb96e] text-white' : 'hover:bg-[#edf4e6] text-[#2d3d25]'}`}>
                    <span className="text-sm font-medium tracking-wide pr-4">{faq.q}</span>
                    <svg className={`w-5 h-5 flex-shrink-0 transform transition-transform duration-300 ${isOpen ? "rotate-180 text-white" : "text-[#8bb96e]"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-40 opacity-100 py-4 px-5 bg-white" : "max-h-0 opacity-0 py-0 px-5 bg-white"}`}>
                    <p className="text-[#5c6e51] text-sm leading-relaxed font-light">{faq.a}</p>
                  </div>
                </div>
              </ScrollAnimation>
            );
          })}
        </div>
      </section>

      <section id="chuyen-nha" className="relative py-12 md:py-16 px-4 md:px-12 lg:px-24 bg-[#edf4e6] text-center overflow-hidden">
        <div className="absolute bottom-[-10%] left-[20%] w-80 h-80 bg-white rounded-full mix-blend-overlay filter blur-3xl opacity-40 animate-blob animation-delay-4000"></div>
        <div className="relative z-10">
          <ScrollAnimation>
            <h3 className={`text-3xl md:text-4xl mb-8 md:mb-12 text-[#2d3d25] ${playfair.className}`}>Chuyện nhà Mombi</h3>
          </ScrollAnimation>
        </div>

        <div className="relative z-10 w-full max-w-[1400px] mx-auto group px-4 md:px-12">
          <button onClick={() => scrollLeft(storiesRef)} className="absolute left-0 md:left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white rounded-full shadow-lg border border-[#e4edd9] text-[#8bb96e] hover:bg-[#8bb96e] hover:text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 hidden md:flex">
             <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
          </button>

          <div ref={storiesRef} className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-6 w-full no-scrollbar px-2">
            
            {/* LẶP QUA DỮ LIỆU cmsArticles ĐƯỢC TRUYỀN TỪ SERVER */}
            {cmsArticles.map((article, index) => (
              <div key={article._id} className="snap-center shrink-0 w-[280px] md:w-[350px]">
                <ScrollAnimation delay={index * 0.1}>
                  <Link href={`/chuyen-nha/${article.slug}`}>
                    <div className="bg-white rounded-3xl shadow-sm hover:shadow-xl hover:shadow-[#8bb96e]/20 transition-all duration-300 border border-[#e4edd9] overflow-hidden flex flex-col h-[420px] group/article text-left cursor-pointer">
                      
                      <div className="relative w-full h-[200px] overflow-hidden bg-[#f6f9f2]">
                        {/* THÊM ẢNH FALLBACK ĐỂ TRÁNH LỖI NẾU BÀI CHƯA CÓ ẢNH */}
                        <Image src={article.image || '/img/landing-1.jpg'} alt={article.title} fill className="object-cover group-hover/article:scale-105 transition-transform duration-700 ease-in-out" />
                      </div>
                      
                      <div className="p-6 flex flex-col flex-1">
                        <span className="text-[#8bb96e] text-[10px] uppercase tracking-widest font-medium mb-3">{article.date}</span>
                        <h4 className={`text-[17px] text-[#2d3d25] mb-2 leading-snug line-clamp-2 ${playfair.className} group-hover/article:text-[#8bb96e] transition-colors`}>{article.title}</h4>
                        <p className="text-[#5c6e51] text-xs font-light leading-relaxed line-clamp-3 mb-4 flex-1">{article.excerpt}</p>
                        
                        <div className="mt-auto flex items-center text-[#8bb96e] text-xs font-medium tracking-wide group-hover/article:translate-x-1 transition-transform">
                          Đọc bài viết
                          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                        </div>
                      </div>

                    </div>
                  </Link>
                </ScrollAnimation>
              </div>
            ))}
          </div>

          <button onClick={() => scrollRight(storiesRef)} className="absolute right-0 md:right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white rounded-full shadow-lg border border-[#e4edd9] text-[#8bb96e] hover:bg-[#8bb96e] hover:text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 hidden md:flex">
             <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        </div>

        <div className="relative z-10 mt-6">
          <ScrollAnimation delay={0.3}>
            <Link href="/chuyen-nha">
              <button className="bg-[#8bb96e] text-white rounded-full px-8 md:px-10 py-3 text-xs md:text-sm tracking-widest hover:bg-[#739f55] transition-all shadow-md">
                XEM TẤT CẢ BÀI VIẾT
              </button>
            </Link>
          </ScrollAnimation>
        </div>
      </section>

      <section className="py-12 md:py-16 px-4 md:px-12 lg:px-24 bg-white border-t border-[#e4edd9]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          <ScrollAnimation>
            <div className="flex flex-col gap-5">
              <h3 className={`text-3xl md:text-4xl text-[#2d3d25] ${playfair.className}`}>Vị trí của Mombi</h3>
              <p className="text-[#5c6e51] text-sm md:text-base leading-relaxed font-light">Mombi Care Spa nằm ẩn mình giữa những tán cây xanh mát trên đường Trần Khánh Dư... Chúng tôi có bãi đậu xe ô tô và xe máy rộng rãi.</p>
              <div className="flex items-center gap-4 mt-2">
                <div className="w-10 h-10 bg-[#f6f9f2] rounded-full flex items-center justify-center text-[#8bb96e]">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                </div>
                <div><h4 className="text-[#2d3d25] font-semibold text-sm">Địa chỉ</h4><p className="text-[#5c6e51] text-sm mt-0.5">34 Trần Khánh Dư, P. Tân Lợi, TP. Buôn Ma Thuột</p></div>
              </div>
              <div className="flex items-center gap-4 mt-2">
                <div className="w-10 h-10 bg-[#f6f9f2] rounded-full flex items-center justify-center text-[#8bb96e]">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.896-1.596-5.48-4.18-7.076-7.076l1.293-.97c.362-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>
                </div>
                <div><h4 className="text-[#2d3d25] font-semibold text-sm">Hotline đặt lịch</h4><p className="text-[#5c6e51] text-sm mt-0.5">0934 250 909</p></div>
              </div>
            </div>
          </ScrollAnimation>
          <ScrollAnimation delay={0.2}>
            <div className="w-full h-[300px] md:h-[350px] rounded-3xl overflow-hidden shadow-lg border border-[#e4edd9]">
              <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d16495.528009611553!2d108.04502350853478!3d12.68557249339919!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3171f767729424c1%3A0xa17b2040c8d0d5bd!2sMombicare%20spa!5e0!3m2!1svi!2s!4v1783165042726!5m2!1svi!2s" width="100%" height="100%" style={{ border: 0 }} allowFullScreen={false} loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Bản đồ đường đi"></iframe>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      <footer className="bg-[#2d3d25] py-12 md:py-16 px-6 md:px-16 lg:px-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          
          <div className="flex flex-col items-start gap-4">
            <div className="relative w-36 h-12 bg-white rounded-xl overflow-hidden px-2 shadow-lg">
               <Image src="/img/logo-mombicare.jpg" alt="Mombi Care Spa Logo Footer" fill sizes="(max-width: 768px) 144px, 144px" className="object-contain p-1" />
            </div>
            <p className="text-sm text-[#d6e5c9] mt-2 leading-relaxed pr-6 font-light">
              Tìm về một nhịp nghỉ vừa vặn giữa lòng thành phố với không gian xanh mát và sự chăm sóc từ tâm.
            </p>
            <p className="text-xs text-[#8bb96e] mt-1 tracking-wider">© 2026 MOMBI CARE SPA</p>
          </div>
          
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white mb-5 md:mb-6">Liên kết nhanh</h4>
            <ul className="flex flex-col gap-3 text-sm text-[#d6e5c9] font-light">
              <li><Link href="/" className="hover:text-[#a9d18c] transition-colors">Trang chủ</Link></li>
              <li><Link href="/#ve-mombi" className="hover:text-[#a9d18c] transition-colors">Về Mombi Care Spa</Link></li>
              <li><Link href="/phieu-qua-tang" className="hover:text-[#a9d18c] transition-colors">Phiếu quà tặng</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white mb-5 md:mb-6">Các dịch vụ</h4>
            <ul className="flex flex-col gap-3 text-sm text-[#d6e5c9] font-light">
              <li><Link href="/dich-vu/massage-thu-gian" className="hover:text-[#a9d18c] transition-colors">Gội đầu dưỡng sinh</Link></li>
              <li><Link href="/dich-vu/massage-thu-gian" className="hover:text-[#a9d18c] transition-colors">Massage vai cổ gáy</Link></li>
              <li><Link href="/dich-vu/cham-soc-da" className="hover:text-[#a9d18c] transition-colors">Chăm sóc da cơ bản</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white mb-5 md:mb-6">Thông tin liên hệ</h4>
            <ul className="flex flex-col gap-3 text-sm text-[#d6e5c9] font-light leading-relaxed">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 mt-0.5 flex-shrink-0 text-[#8bb96e]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                <span>34 Trần Khánh Dư, P. Tân Lợi, TP. Buôn Ma Thuột, Đắk Lắk</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 mt-0.5 flex-shrink-0 text-[#8bb96e]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.896-1.596-5.48-4.18-7.076-7.076l1.293-.97c.362-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>
                <span>0934 250 909</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 mt-0.5 flex-shrink-0 text-[#8bb96e]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
                <span>mombicarespa@gmail.com</span>
              </li>
            </ul>
          </div>
          
        </div>
      </footer>

      {showPopup && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center px-4 bg-black/40 backdrop-blur-sm transition-opacity duration-300">
          <div className="bg-white rounded-3xl w-full max-w-md p-8 relative shadow-2xl flex flex-col text-center animate-bounce-in">
            <button onClick={() => { setShowPopup(false); setHasClosedPopup(true); }} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-[#f6f9f2] text-[#5c6e51] hover:bg-[#e4edd9] hover:text-[#2d3d25] transition-colors">
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" viewBox="0 0 24 24"/></svg>
            </button>
            <div className="w-14 h-14 bg-[#edf4e6] rounded-full mx-auto mb-4 flex items-center justify-center text-[#8bb96e]">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>
            </div>
            <h3 className={`text-2xl text-[#2d3d25] mb-2 ${playfair.className}`}>Tặng bạn Voucher 20%</h3>
            <p className="text-sm text-[#5c6e51] font-light mb-5">Dành riêng cho khách hàng trải nghiệm lần đầu tại Mombi. Nhập số Zalo để nhận mã ngay!</p>
            <form className="flex flex-col gap-3" onSubmit={(e) => { e.preventDefault(); setShowPopup(false); setHasClosedPopup(true); alert("Đăng ký thành công! Mombi sẽ liên hệ lại qua Zalo ạ."); }}>
              <input type="tel" placeholder="Nhập số điện thoại/Zalo của bạn" required className="w-full px-5 py-3 rounded-full bg-[#f6f9f2] border border-[#e4edd9] text-sm text-[#2d3d25] focus:outline-none focus:border-[#8bb96e] transition-colors" />
              <button type="submit" className="w-full bg-[#8bb96e] text-white rounded-full px-8 py-3.5 text-xs md:text-sm tracking-widest hover:bg-[#739f55] transition-all shadow-md mt-1">NHẬN ƯU ĐÃI NGAY</button>
            </form>
          </div>
        </div>
      )}
      <style dangerouslySetInnerHTML={{__html: `@keyframes bounceIn { 0% { transform: scale(0.9); opacity: 0; } 50% { transform: scale(1.02); opacity: 1; } 100% { transform: scale(1); opacity: 1; } } .animate-bounce-in { animation: bounceIn 0.4s ease-out forwards; }`}} />

      <aside className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 flex flex-col gap-4">
        <a href="https://zalo.me/0934250909" target="_blank" rel="noopener noreferrer" className="w-12 h-12 md:w-14 md:h-14 bg-[#25D366] rounded-full shadow-xl shadow-[#25D366]/30 flex items-center justify-center hover:scale-110 transition-transform text-white" aria-label="Zalo Mombi Care Spa">
          <svg width="24" height="24" className="md:w-[28px] md:h-[28px]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12c0 2.16.69 4.15 1.84 5.76L2.6 21.6l3.97-1.15C8.06 21.43 9.98 22 12 22c5.52 22 10-4.48 10-10S17.52 2 12 2zm-1.8 15.1l-.1-.1c-1.3-.8-2.6-2.1-3.4-3.4-.1-.1-.1-.2-.1-.3s.1-.3.2-.4l.9-.9c.2-.2.2-.4.1-.6l-1.3-3.2c-.1-.3-.4-.3-.6-.3h-1.3c-.3 0-.6.2-.7.4-.7.9-1.2 2-1.2 3.2 0 1.9.9 3.8 2.2 5.1 1.3 1.3 3.2 2.2 5.1 2.2 1.2 0 2.3-.5 3.2-1.2.2-.2.4-.4.4-.7v-1.3c0-.3-.1-.5-.3-.6l-3.2-1.3c-.2-.1-.4-.1-.6.1l-.9.9c-.1.2-.3.2-.5.1z"/></svg>
        </a>
      </aside>
    </main>
  );
}
