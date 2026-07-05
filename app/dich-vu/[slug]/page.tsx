"use client";

import { useState, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import ScrollAnimation from "@/app/components/ScrollAnimation";
import { Playfair_Display, Be_Vietnam_Pro } from "next/font/google";

const playfair = Playfair_Display({ subsets: ["vietnamese"], weight: ["400", "500", "600", "700"] });
const beVietnam = Be_Vietnam_Pro({ subsets: ["vietnamese"], weight: ["300", "400", "500", "600"] });

type Props = {
  params: Promise<{ slug: string }>;
};

export default function ServiceCategoryPage({ params }: Props) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  if (slug !== "cham-soc-da" && slug !== "massage-thu-gian") {
    notFound();
  }

  const isSkincare = slug === "cham-soc-da";
  
  // States quản lý UI
  const [openItem, setOpenItem] = useState<number | null>(isSkincare ? 1 : 10);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State cho Mobile Menu
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false); // State cho submenu Dịch vụ trên mobile

  const skincareServices = [
    { id: 1, title: 'Chăm sóc da cơ bản', time: '60 phút', price: '150.000đ', desc: 'Quy trình chuẩn Spa: Làm sạch sâu, tái tạo & nuôi dưỡng, massage thư giãn, bảo vệ & phục hồi.' },
    { id: 2, title: 'Cấy HA căng bóng da', time: '90 phút', price: '410.000đ', desc: 'Cung cấp độ ẩm sâu, giúp làn da căng bóng, mịn màng và giảm thiểu nếp nhăn, mang lại vẻ tươi trẻ.' },
    { id: 3, title: 'Cấy tinh chất tế bào gốc DNA cá hồi', time: '90 phút', price: '490.000đ', desc: 'Phục hồi da tổn thương, kích thích sản sinh collagen, mang lại làn da trẻ trung, rạng rỡ và khỏe mạnh.' },
    { id: 4, title: 'Massage mặt Thái chí', time: '75 phút', price: '310.000đ', desc: 'Kỹ thuật massage chuyên sâu giúp thư giãn cơ mặt, tăng cường tuần hoàn máu, giúp da hồng hào tự nhiên.' },
    { id: 5, title: 'Massage mặt + Cấy tảo + Điện di', time: '75 phút', price: '330.000đ', desc: 'Kết hợp massage thư giãn và cấy tảo giúp thanh lọc da, cung cấp dưỡng chất làm da sáng mịn đều màu.' },
    { id: 6, title: 'Cấy serum dưỡng trắng da ngăn ngừa sắc tố', time: '90 phút', price: '350.000đ', desc: 'Ức chế hắc sắc tố melanin, làm mờ thâm nám, nuôi dưỡng làn da trắng sáng an toàn từ sâu bên trong.' },
    { id: 7, title: 'Lấy nhân mụn', time: '60 phút', price: '250.000đ', desc: 'Xử lý các nhân mụn chuẩn y khoa, dụng cụ tiệt trùng 100%, an toàn, hạn chế tối đa để lại thâm sẹo.' },
    { id: 8, title: 'Lấy nhân mụn chuyên sâu', time: '120 phút', price: '350.000đ', desc: 'Dành cho tình trạng mụn viêm nhiều, làm sạch triệt để ổ mụn, kết hợp các bước phục hồi chuyên sâu.' },
    { id: 9, title: 'Chăm sóc da chuyên sâu', time: '70 phút', price: '200.000đ', desc: 'Giải pháp chăm sóc toàn diện, tập trung cải thiện các khuyết điểm, mang lại làn da khỏe mạnh, căng tràn sức sống.' },
  ];

  const massageServices = [
    { id: 10, title: 'Gội đầu sạch', time: '45 phút', price: '50.000đ', desc: 'Làm sạch da đầu bằng thảo dược thiên nhiên, thư giãn nhẹ nhàng xua tan mệt mỏi.' },
    { id: 11, title: 'Gội đầu dưỡng sinh', time: '70 phút', price: '150.000đ', desc: 'Làm sạch sâu kết hợp massage ấn huyệt vùng đầu, cổ vai gáy, đả thông kinh lạc, mang lại giấc ngủ ngon.' },
    { id: 12, title: 'Massage vai cổ gáy', time: '45 phút', price: '250.000đ', desc: 'Giảm nhanh tình trạng căng cơ, đau nhức vùng cổ vai gáy, đặc biệt thích hợp cho dân văn phòng.' },
    { id: 13, title: 'Massage body', time: '60 phút', price: '250.000đ', desc: 'Thư giãn toàn thân với tinh dầu, giải tỏa căng thẳng mệt mỏi, phục hồi năng lượng tức thì.' },
    { id: 14, title: 'Massage vai cổ gáy trị liệu', time: '45 phút', price: '250.000đ', desc: 'Trị liệu chuyên sâu các vấn đề đau mỏi, gỡ các điểm bó cơ vùng vai gáy hiệu quả.' },
    { id: 15, title: 'Massage body trị liệu', time: '60 phút', price: '300.000đ', desc: 'Trị liệu chuyên sâu toàn thân, bấm huyệt giảm đau nhức, tăng cường lưu thông máu huyết.' },
    { id: 16, title: 'Massage body trị liệu cao cấp', time: '90 phút', price: '400.000đ', desc: 'Liệu trình cao cấp thời gian dài hơn, kết hợp kỹ thuật chuyên sâu mang lại hiệu quả trị liệu tối ưu nhất.' },
    { id: 17, title: 'Giải bó cơ', time: '30 - 60 phút', price: '200.000đ - 350.000đ', desc: 'Tập trung gỡ các điểm tắc nghẽn, xơ cứng cơ bắp lâu ngày, trả lại sự linh hoạt cho cơ thể.' },
    { id: 18, title: 'Massage chân (Thư giãn / Chuyên sâu)', time: '45 - 60 phút', price: '150.000đ - 250.000đ', desc: 'Ngâm chân thảo dược, tẩy tế bào chết, massage bắp chân và bấm huyệt lòng bàn chân. Giúp giảm tê bì, đau nhức và hỗ trợ ngủ ngon.' },
    { id: 19, title: 'Xông hơi', time: '15 phút', price: '50.000đ', desc: 'Thải độc qua da, giãn nở lỗ chân lông, xua tan cảm giác nặng nề của cơ thể.' },
    { id: 20, title: 'Giác hơi', time: '15 - 20 phút', price: '50.000đ', desc: 'Kích thích lưu thông máu, giảm đau mỏi cơ lưng và vai gáy theo phương pháp y học cổ truyền.' },
  ];

  const currentServices = isSkincare ? skincareServices : massageServices;

  const toggleItem = (id: number) => {
    setOpenItem(openItem === id ? null : id);
  };

  return (
    <main className={`min-h-screen relative text-[#2d3d25] bg-white ${beVietnam.className}`}>
      
      {/* HEADER */}
      <header className="w-full flex justify-between items-center px-4 md:px-16 py-4 md:py-6 text-[11px] md:text-[13px] font-medium border-b border-[#e4edd9] bg-white z-50 relative">
        <div className="flex-1 flex justify-start">
          <Link href="/">
            <div className="relative w-28 h-10 md:w-40 md:h-14 cursor-pointer hover:opacity-80 transition-opacity">
              <Image 
                src="/img/logo-mombicare.jpg" 
                alt="Mombi Care Spa Logo" 
                fill 
                className="object-contain object-left" 
              />
            </div>
          </Link>
        </div>
        
        {/* DESKTOP NAVIGATION */}
        <nav className="hidden xl:flex gap-8 justify-center items-center uppercase tracking-[0.15em]">
          <Link href="/" className="hover:text-[#8bb96e] transition-colors text-[#5c6e51]">Trang chủ</Link>
          <Link href="/#ve-mombi" className="hover:text-[#8bb96e] transition-colors text-[#5c6e51]">Về Mombi</Link>
          
          <div 
            className="relative py-2"
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <span className={`cursor-pointer transition-colors border-b-2 pb-1 ${isDropdownOpen ? 'text-[#8bb96e] border-[#8bb96e]' : 'text-[#5c6e51] border-transparent hover:text-[#8bb96e] hover:border-[#8bb96e]'}`}>
              Dịch vụ
            </span>
            
            <div className={`absolute top-full left-1/2 -translate-x-1/2 pt-2 w-56 transition-all duration-300 z-50 ${isDropdownOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}>
              <div className="bg-white rounded-xl shadow-2xl shadow-[#8bb96e]/10 border border-[#e4edd9] flex flex-col py-2 overflow-hidden">
                <Link 
                  href="/dich-vu/cham-soc-da"
                  className={`px-6 py-3 text-left text-[10px] tracking-widest hover:text-[#8bb96e] hover:bg-[#f6f9f2] transition-colors ${isSkincare ? "text-[#8bb96e] bg-[#f6f9f2]" : "text-[#5c6e51]"}`}
                >
                  CHĂM SÓC DA CAO CẤP
                </Link>
                <Link 
                  href="/dich-vu/massage-thu-gian"
                  className={`px-6 py-3 text-left text-[10px] tracking-widest hover:text-[#8bb96e] hover:bg-[#f6f9f2] transition-colors ${!isSkincare ? "text-[#8bb96e] bg-[#f6f9f2]" : "text-[#5c6e51]"}`}
                >
                  THƯ GIÃN & MASSAGE
                </Link>
              </div>
            </div>
          </div>
          
          <Link href="/#chuyen-nha" className="hover:text-[#8bb96e] transition-colors text-[#5c6e51]">Chuyện nhà Mombi</Link>
          <Link href="/phieu-qua-tang" className="hover:text-[#8bb96e] transition-colors text-[#5c6e51]">Phiếu quà tặng</Link>
        </nav>

        {/* RIGHT ACTIONS & MOBILE MENU TOGGLE */}
        <div className="flex-1 flex justify-end items-center gap-4 text-[#5c6e51]">
          <div className="hidden md:flex items-center gap-1 cursor-pointer hover:text-[#8bb96e] transition-colors uppercase tracking-[0.15em]">
            <span>VI</span>
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          
          {/* Hamburger Icon for Mobile */}
          <button 
            className="xl:hidden p-2 text-[#5c6e51] hover:text-[#8bb96e] transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Mobile Menu"
          >
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {isMobileMenuOpen ? (
                <path d="M18 6L6 18M6 6l12 12" /> // Icon X (Đóng)
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" /> // Icon 3 gạch (Mở)
              )}
            </svg>
          </button>
        </div>
      </header>

      {/* MOBILE MENU DROPDOWN */}
      <div className={`xl:hidden absolute top-[73px] left-0 w-full bg-white border-b border-[#e4edd9] shadow-lg transition-all duration-300 ease-in-out z-40 overflow-hidden ${isMobileMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <nav className="flex flex-col py-4 px-6 text-xs uppercase tracking-widest text-[#5c6e51]">
          <Link href="/" className="py-4 border-b border-[#f6f9f2] hover:text-[#8bb96e]">Trang chủ</Link>
          <Link href="/#ve-mombi" className="py-4 border-b border-[#f6f9f2] hover:text-[#8bb96e]">Về Mombi</Link>
          
          {/* Mobile Submenu for Services */}
          <div className="flex flex-col border-b border-[#f6f9f2]">
            <button 
              className="py-4 flex justify-between items-center hover:text-[#8bb96e] text-left uppercase"
              onClick={() => setIsMobileServicesOpen(!isMobileServicesOpen)}
            >
              Dịch vụ
              <svg className={`w-4 h-4 transform transition-transform ${isMobileServicesOpen ? 'rotate-180 text-[#8bb96e]' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            </button>
            <div className={`flex flex-col pl-4 border-l-2 border-[#8bb96e]/30 ml-2 overflow-hidden transition-all duration-300 ${isMobileServicesOpen ? 'max-h-40 mb-4' : 'max-h-0'}`}>
              <Link href="/dich-vu/cham-soc-da" className={`py-3 hover:text-[#8bb96e] ${isSkincare ? "text-[#8bb96e] font-semibold" : ""}`}>Chăm sóc da cao cấp</Link>
              <Link href="/dich-vu/massage-thu-gian" className={`py-3 hover:text-[#8bb96e] ${!isSkincare ? "text-[#8bb96e] font-semibold" : ""}`}>Thư giãn & Massage</Link>
            </div>
          </div>

          <Link href="/#chuyen-nha" className="py-4 border-b border-[#f6f9f2] hover:text-[#8bb96e]">Chuyện nhà Mombi</Link>
          <Link href="/phieu-qua-tang" className="py-4 hover:text-[#8bb96e]">Phiếu quà tặng</Link>
        </nav>
      </div>

      {/* HERO SECTION DỊCH VỤ - Căn chỉnh lại padding cho mobile */}
      <section className="py-12 md:py-24 px-4 text-center max-w-4xl mx-auto bg-white">
        <ScrollAnimation>
          {/* Tối ưu kích thước chữ trên mobile (text-3xl) và desktop (text-5xl) */}
          <h2 className={`text-3xl md:text-5xl lg:text-6xl mb-6 md:mb-8 text-[#2d3d25] ${playfair.className}`}>
            {isSkincare ? "Chăm sóc da cao cấp" : "Thư giãn & Massage"}
          </h2>
          <p className="text-[#5c6e51] text-sm md:text-base leading-loose font-light px-2 md:px-16">
            {isSkincare 
              ? "Các bước trị liệu được thiết kế để điều trị các khuyết điểm, dấu hiệu lão hóa trên khuôn mặt, mang lại cho bạn một làn da phục hồi, căng sáng và trẻ trung."
              : "Thư giãn hôm nay - Sức khỏe trọn vẹn. Các liệu trình massage tại Mombi được tinh chỉnh để giải phóng căng thẳng, lưu thông khí huyết và đưa cơ thể trở về trạng thái cân bằng."}
          </p>
        </ScrollAnimation>
      </section>

      {/* IMAGE BANNER - Giảm chiều cao trên mobile để không chiếm hết màn hình */}
      <section className="w-full h-[35vh] md:h-[60vh] lg:h-[70vh] relative">
        <div className="absolute inset-0 w-full h-full bg-[#e4edd9]">
            <Image 
             src={isSkincare ? "/img/skin-care.jpg" : "/img/massage-hero.jpg"} 
             alt={isSkincare ? "Chăm sóc da chuyên sâu tại Mombi Care Spa" : "Massage thư giãn trị liệu tại Mombi Care Spa"} 
             fill 
             className="object-cover" 
             priority={true}
           /> 
        </div>
      </section>

      {/* DANH SÁCH DỊCH VỤ */}
      <section className="py-16 md:py-24 px-4 bg-[#f6f9f2]">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-4 md:gap-6 mb-12 md:mb-16">
            <div className="h-[1px] w-8 md:w-24 bg-[#8bb96e]"></div>
            <h3 className={`text-2xl md:text-3xl text-[#2d3d25] ${playfair.className}`}>Gói Dịch Vụ</h3>
            <div className="h-[1px] w-8 md:w-24 bg-[#8bb96e]"></div>
          </div>

          <div className="flex flex-col gap-3 md:gap-4">
            {currentServices.map((service) => {
              const isOpen = openItem === service.id;
              return (
                <div key={service.id} className="w-full flex flex-col bg-white rounded-xl md:rounded-2xl shadow-sm border border-[#e4edd9] overflow-hidden transition-all duration-300">
                  <button 
                    onClick={() => toggleItem(service.id)}
                    className={`w-full px-5 md:px-6 py-4 md:py-5 flex justify-between items-center transition-colors ${isOpen ? 'bg-[#8bb96e] text-white' : 'bg-white hover:bg-[#edf4e6] text-[#2d3d25]'}`}
                    aria-expanded={isOpen}
                  >
                    {/* Hỗ trợ flex-col trên màn hình quá bé để tránh chữ bị ép */}
                    <span className="text-sm md:text-base font-medium tracking-wide text-left pr-4 flex flex-col sm:flex-row sm:gap-2">
                      <span>{service.title}</span> 
                      <span className="hidden sm:inline">-</span> 
                      <span className="text-xs sm:text-base opacity-80 sm:opacity-100 mt-1 sm:mt-0">{service.time}</span>
                    </span>
                    <svg className={`w-5 h-5 flex-shrink-0 transform transition-transform duration-300 ${isOpen ? "rotate-180 text-white" : "text-[#8bb96e]"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-[500px] opacity-100 py-5 px-5 md:px-6 bg-[#f6f9f2]" : "max-h-0 opacity-0 py-0 px-5 md:px-6 bg-white"}`}>
                    <div className="text-[#5c6e51] text-sm leading-relaxed mb-5 font-light">{service.desc}</div>
                    <div className="text-[#2d3d25] text-xs md:text-sm font-semibold tracking-wider bg-white inline-block px-4 py-2 rounded-full border border-[#e4edd9]">
                      Giá trị liệu: <span className="text-[#8bb96e] ml-1">{service.price}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FOOTER - Tối ưu margin và grid cho Mobile */}
      <footer className="bg-white py-12 md:py-16 px-6 md:px-16 lg:px-24 border-t border-[#e4edd9]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
          <div className="flex flex-col items-start gap-4">
            <div className="relative w-28 h-10 md:w-32 md:h-12 opacity-90">
               <Image src="/img/logo-mombicare.jpg" alt="Mombi Care Spa Logo Footer" fill className="object-contain object-left" />
            </div>
            <p className="text-xs text-[#5c6e51] mt-2 leading-relaxed pr-6">
              Tìm về một nhịp nghỉ vừa vặn giữa lòng thành phố với không gian xanh mát và sự chăm sóc từ tâm.
            </p>
            <p className="text-xs text-[#5c6e51]/70 mt-1">© 2026 Mombi Care Spa</p>
          </div>
          
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#2d3d25] mb-4 md:mb-6">Liên kết nhanh</h4>
            <ul className="flex flex-col gap-3 text-xs text-[#5c6e51]">
              <li><Link href="/" className="hover:text-[#8bb96e] transition-colors">Trang chủ</Link></li>
              <li><Link href="/#ve-mombi" className="hover:text-[#8bb96e] transition-colors">Về Mombi Care Spa</Link></li>
              <li><Link href="/phieu-qua-tang" className="hover:text-[#8bb96e] transition-colors">Phiếu quà tặng</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#2d3d25] mb-4 md:mb-6">Các dịch vụ</h4>
            <ul className="flex flex-col gap-3 text-xs text-[#5c6e51]">
              <li><Link href="/dich-vu/massage-thu-gian" className="hover:text-[#8bb96e] transition-colors">Gội đầu dưỡng sinh</Link></li>
              <li><Link href="/dich-vu/massage-thu-gian" className="hover:text-[#8bb96e] transition-colors">Massage vai cổ gáy</Link></li>
              <li><Link href="/dich-vu/cham-soc-da" className="hover:text-[#8bb96e] transition-colors">Chăm sóc da cơ bản</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#2d3d25] mb-4 md:mb-6">Thông tin liên hệ</h4>
            <ul className="flex flex-col gap-3 text-xs text-[#5c6e51] leading-relaxed">
              <li>Địa chỉ: 34 Trần Khánh Dư, P. Buôn Ma Thuột, Đắk Lắk</li>
              <li>Điện thoại: 0934 250 909</li>
              <li>Email: mombicarespa@gmail.com</li>
            </ul>
          </div>
        </div>
      </footer>

      {/* FLOATING ACTION BUTTON - Giữ nguyên tối ưu */}
      <aside className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 flex flex-col gap-4">
        <a href="https://zalo.me/0934250909" target="_blank" rel="noopener noreferrer" className="w-12 h-12 md:w-14 md:h-14 bg-[#25D366] rounded-full shadow-xl shadow-[#25D366]/30 flex items-center justify-center hover:scale-110 transition-transform text-white" aria-label="Zalo Mombi Care Spa">
          <svg width="24" height="24" className="md:w-[28px] md:h-[28px]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12c0 2.16.69 4.15 1.84 5.76L2.6 21.6l3.97-1.15C8.06 21.43 9.98 22 12 22c5.52 22 10-4.48 10-10S17.52 2 12 2zm-1.8 15.1l-.1-.1c-1.3-.8-2.6-2.1-3.4-3.4-.1-.1-.1-.2-.1-.3s.1-.3.2-.4l.9-.9c.2-.2.2-.4.1-.6l-1.3-3.2c-.1-.3-.4-.3-.6-.3h-1.3c-.3 0-.6.2-.7.4-.7.9-1.2 2-1.2 3.2 0 1.9.9 3.8 2.2 5.1 1.3 1.3 3.2 2.2 5.1 2.2 1.2 0 2.3-.5 3.2-1.2.2-.2.4-.4.4-.7v-1.3c0-.3-.1-.5-.3-.6l-3.2-1.3c-.2-.1-.4-.1-.6.1l-.9.9c-.1.2-.3.2-.5.1z"/></svg>
        </a>
      </aside>
    </main>
  );
}