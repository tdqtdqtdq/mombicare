"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { SiteHeader, SiteFooter, LuxuryFloatingConcierge } from "./SiteChrome";
import { ManagementLink } from "./ManagementLink";

type HomeArticle = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  image?: string;
  date: string;
};

// Featured treatment items with categories
const interactiveServices = [
  {
    id: "goi-dau-duong-sinh",
    category: "massage",
    title: "Gội đầu dưỡng sinh",
    subtitle: "Thư giãn & giải toả căng thẳng",
    duration: "70 phút",
    price: "150.000đ",
    description: "Kết hợp gội sạch da đầu bằng thảo mộc tự nhiên với kỹ thuật bấm huyệt chuyên sâu vùng đầu, cổ vai gáy.",
    highlights: ["Thảo mộc tự nhiên", "Massage cổ vai gáy", "Sấy tạo kiểu nhẹ"],
    image: "/img/goi-dau.jpg",
    isPopular: true,
    href: "/dich-vu/massage-thu-gian",
  },
  {
    id: "massage-co-vai-gay",
    category: "massage",
    title: "Massage cổ vai gáy",
    subtitle: "Giảm đau mỏi & giải bó cơ",
    duration: "45 phút",
    price: "250.000đ",
    description: "Liệu trình tập trung giải toả căng cứng vùng cổ gáy, thắt lưng cho người làm việc văn phòng hoặc ngồi lâu.",
    highlights: ["Tinh dầu thảo mộc", "Ấn huyệt chuyên sâu", "Chườm ấm ngải cứu"],
    image: "/img/co-vai-gay-tri-lieu.jpg",
    isPopular: true,
    href: "/dich-vu/massage-thu-gian",
  },
  {
    id: "cay-ha-cang-bong",
    category: "skincare",
    title: "Cấy HA căng bóng da",
    subtitle: "Cấp ẩm tầng sâu & phục hồi",
    duration: "90 phút",
    price: "410.000đ",
    description: "Bổ sung Hyaluronic Acid tinh khiết trực tiếp vào tầng biểu bì, giúp da ngậm nước, căng mọng và sáng hồng.",
    highlights: ["HA tinh khiết 100%", "Điện di lạnh dịu da", "Chiếu đèn sinh học"],
    image: "/img/cay-ha.jpg",
    isPopular: true,
    href: "/dich-vu/cham-soc-da",
  },
  {
    id: "cham-soc-da-chuyen-sau",
    category: "skincare",
    title: "Chăm sóc da chuyên sâu",
    subtitle: "Làm sạch sâu & nuôi dưỡng",
    duration: "70 phút",
    price: "200.000đ",
    description: "Quy trình làm sạch tế bào chết, xông hơi hút bã nhờn, massage nâng cơ mặt và đắp mặt nạ phục hồi chuyên biệt.",
    highlights: ["Làm sạch 5 bước", "Massage nâng cơ", "Mặt nạ phục hồi"],
    image: "/img/skin-care.jpg",
    isPopular: false,
    href: "/dich-vu/cham-soc-da",
  },
  {
    id: "massage-body-tinh-dau",
    category: "massage",
    title: "Massage body tinh dầu",
    subtitle: "Thả lỏng toàn thân & cân bằng",
    duration: "60 phút",
    price: "250.000đ",
    description: "Sử dụng tinh dầu thơm tự nhiên kết hợp lực tay êm ái, kích thích tuần hoàn máu và tái tạo năng lượng thể chất.",
    highlights: ["Tinh dầu thiên nhiên", "Ngâm chân thảo dược", "Đá nóng thư giãn"],
    image: "/img/massage body mombi care spa.jpg",
    isPopular: true,
    href: "/dich-vu/massage-thu-gian",
  },
  {
    id: "lay-nhan-mun-chuan-y-khoa",
    category: "skincare",
    title: "Lấy nhân mụn chuẩn y khoa",
    subtitle: "Sạch sâu & diệt khuẩn an toàn",
    duration: "60 phút",
    price: "250.000đ",
    description: "Kỹ thuật viên tay nghề cao lấy sạch cồi mụn bằng dụng cụ vô trùng 1 lần, kết hợp sát khuẩn tia điện tím và làm dịu da.",
    highlights: ["Dụng cụ vô trùng", "Không thâm sẹo", "Điện tím diệt khuẩn"],
    image: "/img/lay-nhan-mun.jpg",
    isPopular: false,
    href: "/dich-vu/cham-soc-da",
  },
];

// Mood Selector Data
const moodOptions = [
  {
    id: "neck-shoulder",
    icon: "💆",
    label: "Căng mỏi cổ vai gáy",
    subtitle: "Ngồi máy tính nhiều, cơ co cứng",
    recommendation: {
      title: "Massage Cổ Vai Gáy Chuyên Sâu (45p)",
      price: "250.000đ",
      desc: "Tập trung giải phóng các nút thắt cơ bắp vùng gáy và hai bả vai bằng tinh dầu ngải cứu ấm.",
      actionLabel: "Đặt lịch giải mỏi ngay",
      serviceSlug: "massage-thu-gian",
    },
  },
  {
    id: "dry-skin",
    icon: "✨",
    label: "Da khô ráp, mệt mỏi",
    subtitle: "Thiếu nước, xỉn màu & sần sùi",
    recommendation: {
      title: "Cấy HA Căng Bóng Da Tầng Sâu (90p)",
      price: "410.000đ",
      desc: "Cấp nước tức thì cho làn da mất ẩm, giúp da căng mướt, đàn hồi và tươi tắn ngay sau buổi làm.",
      actionLabel: "Đặt lịch phục hồi da",
      serviceSlug: "cham-soc-da",
    },
  },
  {
    id: "stress-sleep",
    icon: "🌿",
    label: "Căng thẳng, khó ngủ",
    subtitle: "Đầu óc nặng nề, cần an yên",
    recommendation: {
      title: "Gội Đầu Dưỡng Sinh Thảo Mộc (70p)",
      price: "150.000đ",
      desc: "Nước gội thảo mộc nấu ấm kết hợp bài bấm huyệt kinh lạc vùng đầu giúp xua tan áp lực và dễ ngủ.",
      actionLabel: "Đặt lịch thư giãn đầu",
      serviceSlug: "massage-thu-gian",
    },
  },
  {
    id: "fullbody-fatigue",
    icon: "🧘",
    label: "Mệt mỏi toàn thân",
    subtitle: "Uể oải, suy giảm năng lượng",
    recommendation: {
      title: "Massage Body Tinh Dầu Trị Liệu (60-90p)",
      price: "250.000đ - 400.000đ",
      desc: "Liệu trình toàn diện từ chân, lưng đến tay và đầu, khơi thông khí huyết và phục hồi thể trạng.",
      actionLabel: "Đặt lịch massage body",
      serviceSlug: "massage-thu-gian",
    },
  },
];

const testimonials = [
  {
    name: "Trần Mai Anh",
    role: "Khách hàng thường xuyên",
    service: "Gội đầu dưỡng sinh & Massage cổ vai gáy",
    quote: "Không gian rất yên tĩnh, thơm mùi thảo mộc dịu nhẹ. Kỹ thuật viên chăm sóc vừa lực, không bao giờ chèo kéo mua thêm gói. Mình có cảm giác được nghỉ ngơi thật sự sau tuần làm việc bận rộn.",
    rating: 5,
  },
  {
    name: "Nguyễn Hà My",
    role: "Khách hàng chăm sóc da",
    service: "Cấy HA căng bóng & Chăm sóc da chuyên sâu",
    quote: "Mombi tư vấn da rất có tâm, soi da và giải thích cặn kẽ. Dụng cụ tiệt trùng sạch sẽ, làm xong da ngậm nước căng mướt mà không hề bị đỏ rát. Rất ưng ý!",
    rating: 5,
    isFeatured: true,
  },
  {
    name: "Lê Hoàng Ngọc",
    role: "Khách hàng massage",
    service: "Massage Body tinh dầu thư giãn",
    quote: "Điểm cộng lớn là spa mở cửa linh hoạt cả ngày lẫn đêm, có chỗ đậu ô tô rất tiện. Sau 60 phút massage, phần lưng và vai gáy nhẹ bẫng, tối về ngủ một mạch tới sáng.",
    rating: 5,
  },
];

const faqs = [
  {
    question: "Mombi có chỗ đậu ô tô và xe máy rộng rãi không?",
    answer: "Có. Mombi Care Spa tọa lạc tại 34 Trần Khánh Dư với vỉa hè rộng rãi và bãi đỗ thuận tiện cho cả ô tô lẫn xe máy, có người hỗ trợ hướng dẫn để bạn an tâm tận hưởng buổi chăm sóc.",
  },
  {
    question: "Giá trên bảng dịch vụ đã bao gồm tiền tip chưa?",
    answer: "Mức giá niêm yết là chi phí trọn gói của liệu trình. Mombi tôn trọng sự thoải mái của khách hàng: Tuyệt đối không bắt buộc tip và luôn thông báo rõ ràng trước khi thực hiện.",
  },
  {
    question: "Mombi có phục vụ khách nam và cặp đôi không?",
    answer: "Có. Mombi đón tiếp cả khách nam, khách nữ, các cặp đôi và gia đình. Spa bố trí phòng riêng biệt, rèm ngăn kín đáo đảm bảo không gian yên tĩnh và riêng tư tuyệt đối.",
  },
  {
    question: "Tôi nên đặt lịch trước bao lâu để có phòng ưng ý?",
    answer: "Bạn nên nhắn Mombi qua Zalo hoặc gọi trước từ 1-2 tiếng (đặc biệt vào khung giờ tối hoặc dịp lễ) để chúng mình chuẩn bị phòng xông, nước ngâm chân và kỹ thuật viên chu đáo nhất.",
  },
];

const ArrowIcon = () => (
  <svg aria-hidden="true" width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M3 9h11M10 5l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function HomeClient({ cmsArticles }: { cmsArticles: HomeArticle[] }) {
  const [activeCategory, setActiveCategory] = useState<"all" | "skincare" | "massage">("all");
  const [activeMoodIndex, setActiveMoodIndex] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const filteredServices = activeCategory === "all" 
    ? interactiveServices 
    : interactiveServices.filter(s => s.category === activeCategory);

  return (
    <div className="min-h-screen overflow-hidden bg-[#faf8f5] text-[#1c2619]">
      <SiteHeader />
      <main>
        {/* 🌿 SECTION 1: CINEMATIC LUXURY HERO (10/10 BOUTIQUE SANCTUARY) */}
      <section className="relative flex min-h-[92svh] w-full flex-col justify-between overflow-hidden bg-[#142012] text-white">
        {/* Parallax Image & Atmospheric Luxury Lighting */}
        <div className="pointer-events-none absolute inset-0">
          <Image 
            src="/img/landing-1.jpg" 
            alt="Không gian an yên và thư giãn tại Mombi Care Spa Buôn Ma Thuột" 
            fill 
            priority 
            sizes="100vw" 
            className="object-cover object-[65%_45%] opacity-40 lg:opacity-50" 
          />
          {/* Radial & directional gradients for high contrast and depth */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#10190e] via-[#142012]/90 to-[#142012]/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#10190e] via-transparent to-[#10190e]/60" />
          {/* Ambient luminous orbs */}
          <div className="absolute -left-24 top-10 h-[450px] w-[450px] rounded-full bg-[#6f9556]/20 blur-[130px]" />
          <div className="absolute right-10 top-1/4 h-[400px] w-[400px] rounded-full bg-[#c6a35d]/15 blur-[120px]" />
        </div>

        {/* Main Hero Content */}
        <div className="relative z-20 mx-auto flex w-full max-w-7xl flex-1 items-center px-5 pt-28 pb-10 sm:px-8 sm:pt-32 lg:pt-36 lg:pb-12">
          <div className="grid w-full items-center gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
            {/* Left Column: Headlines & CTA */}
            <div className="max-w-2xl">
              {/* Pill Tag */}
              <div className="mb-4 inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#d6e8cb] backdrop-blur-md sm:text-xs">
                <span className="h-2 w-2 rounded-full bg-[#8bc46d] radar-live" />
                SANCTUARY OF WELLNESS · BUÔN MA THUỘT
              </div>

              {/* Main Headline (Optimized for Local Non-Branded SEO + Luxury Aesthetic) */}
              <h1 className="font-serif text-3xl font-normal leading-[1.12] tracking-[-0.025em] text-white drop-shadow-md sm:text-4xl md:text-5xl lg:text-[3.25rem] xl:text-[3.65rem]">
                <span className="mb-2 block text-xs font-bold uppercase tracking-[0.22em] text-[#a9c994]">
                  Spa Buôn Ma Thuột · Chăm sóc da &amp; Massage trị liệu
                </span>
                Đến Mombi, tìm về một nhịp nghỉ <br className="hidden sm:inline" />
                <span className="font-serif italic font-light text-[#d6ecc5]">vừa vặn &amp; an yên.</span>
              </h1>

              {/* Subtitle */}
              <p className="mt-4 max-w-xl border-l-2 border-[#8bc46d]/70 pl-4 text-xs font-light leading-6 text-[#d7e5d1] sm:mt-5 sm:pl-5 sm:text-sm sm:leading-7 md:text-base md:leading-8">
                Không gian spa thư giãn hàng đầu giữa lòng Buôn Ma Thuột (34 Trần Khánh Dư). Nơi từng cơ bắp được thả lỏng và làn da được nuôi dưỡng bằng sự tận tâm — mở cửa đón bạn cả ngày lẫn đêm.
              </p>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-wrap items-center gap-3 sm:gap-4 md:mt-8">
                <a 
                  href="https://zalo.me/0934250909" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-[#6f9556] px-7 text-xs font-bold uppercase tracking-[0.14em] text-white shadow-[0_10px_30px_rgba(111,149,86,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#7fa863] hover:shadow-[0_14px_35px_rgba(111,149,86,0.45)]"
                >
                  <span>Đặt lịch với Mombi</span>
                  <span className="transition-transform duration-200 group-hover:translate-x-1"><ArrowIcon /></span>
                </a>

                <Link 
                  href="/dich-vu" 
                  className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/30 bg-white/10 px-6 text-xs font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-md transition-all duration-300 hover:bg-white hover:text-[#182515]"
                >
                  Khám phá bảng dịch vụ
                </Link>
                <ManagementLink />
              </div>

              {/* Trust Badges */}
              <div className="mt-7 flex flex-wrap items-center gap-4 border-t border-white/15 pt-5 text-xs text-[#c0d6ba] sm:gap-6 sm:pt-6">
                <div className="flex items-center gap-2">
                  <span className="text-[#c6a35d]">✦</span>
                  <span>Không tip bắt buộc</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#c6a35d]">✦</span>
                  <span>Nam, nữ &amp; cặp đôi</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#c6a35d]">✦</span>
                  <span>Chỗ đậu ô tô rộng rãi</span>
                </div>
              </div>
            </div>

            {/* Right Column: Luxury Floating Showcase Card (WOW Factor) */}
            <div className="hidden lg:block">
              <div className="relative mx-auto max-w-md rounded-[2.5rem] border border-white/20 bg-white/10 p-5 shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl transition duration-500 hover:border-white/30">
                {/* Visual Image Frame */}
                <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-[#1a2916]">
                  <Image 
                    src="/img/ve-mombi.jpg" 
                    alt="Không gian thư giãn đẳng cấp tại Mombi Care Spa" 
                    fill 
                    sizes="(max-width: 1200px) 40vw, 400px" 
                    className="object-cover transition duration-700 hover:scale-105" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#10190e]/80 via-transparent to-transparent" />
                  
                  {/* Top Floating Badge */}
                  <div className="absolute top-3 left-3 rounded-full border border-white/30 bg-black/50 px-3 py-1 text-[10px] font-semibold tracking-wider text-white backdrop-blur-md">
                    ✨ Sanctuary Boutique
                  </div>

                  {/* Bottom Image Caption */}
                  <div className="absolute bottom-3 left-3 right-3 rounded-xl border border-white/15 bg-black/40 p-3 backdrop-blur-md">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#a9c994]">Mombi Care Spa</p>
                    <p className="mt-0.5 text-xs text-white">34 Trần Khánh Dư, TP. Buôn Ma Thuột</p>
                  </div>
                </div>

                {/* Card Info Details */}
                <div className="mt-4 space-y-3 px-1">
                  {/* Rating & Social Proof */}
                  <div className="flex items-center justify-between border-b border-white/15 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-amber-400 text-sm">★★★★★</span>
                      <span className="text-xs font-bold text-white">4.9 / 5.0</span>
                    </div>
                    <span className="text-[11px] font-light text-[#c5dac0]">Hơn 500+ lượt đánh giá</span>
                  </div>

                  {/* Quick Feature Grid */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-[#d6e6d2]">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[#8bc46d]">✔</span>
                      <span>Thảo mộc tự nhiên</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[#8bc46d]">✔</span>
                      <span>Phục vụ cả ngày &amp; đêm</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[#8bc46d]">✔</span>
                      <span>Dụng cụ vô trùng 100%</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[#8bc46d]">✔</span>
                      <span>Giá niêm yết minh bạch</span>
                    </div>
                  </div>

                  {/* Mini CTA inside card */}
                  <a 
                    href="https://zalo.me/0934250909" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-white/15 py-2.5 text-center text-xs font-bold uppercase tracking-wider text-white transition hover:bg-[#6f9556]"
                  >
                    <span>Nhắn Zalo tư vấn trong 5 phút</span>
                    <span>→</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Integrated Bottom Ticker Bar (Always in flow, never clipped) */}
        <div className="relative z-20 w-full border-t border-white/15 bg-[#10190e]/90 backdrop-blur-xl">
          <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-white/15 px-4 py-3.5 sm:px-8 md:grid-cols-4 md:py-4">
            <div className="px-3 md:px-4">
              <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#a9c994]">Thời gian phục vụ</p>
              <p className="mt-0.5 text-xs font-medium text-white sm:text-sm">Cả ngày lẫn đêm (24/7)</p>
            </div>
            <div className="px-3 md:px-4">
              <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#a9c994]">Địa chỉ tại BMT</p>
              <p className="mt-0.5 text-xs font-medium text-white sm:text-sm">34 Trần Khánh Dư, Tân Lợi</p>
            </div>
            <div className="hidden px-4 md:block">
              <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#a9c994]">Liệu trình chuyên sâu</p>
              <p className="mt-0.5 text-sm font-medium text-white">Chăm sóc da · Massage body · Gội đầu</p>
            </div>
            <div className="hidden px-4 md:block">
              <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#a9c994]">Hotline tư vấn</p>
              <a href="tel:0934250909" className="mt-0.5 block text-sm font-bold text-[#c6a35d] hover:underline">
                0934 250 909
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 🌿 SECTION 2: VỀ MOMBI - BRAND PHILOSOPHY & ARTISTRY */}
      <section id="ve-mombi" className="relative px-5 py-20 sm:px-8 sm:py-28 md:py-36">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-20">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.28em] text-[#6f9556]">
              <span className="h-px w-6 bg-[#6f9556]" />
              Về Mombi Care Spa
            </div>
            <h2 className="mt-4 font-serif text-[2.6rem] font-normal leading-[1.08] tracking-[-0.025em] text-[#1c2619] sm:text-5xl md:text-6xl">
              Chăm sóc không cần vội vã.
            </h2>
            <p className="mt-6 text-sm font-light leading-7 text-[#4d5e47] sm:mt-7 sm:text-base sm:leading-8">
              Mombi tin rằng mỗi cơ thể và làn da đều mang một câu chuyện riêng. Chúng mình không áp dụng công thức rập khuôn, mà luôn bắt đầu bằng việc lắng nghe nhịp thở, độ mỏi của cơ bắp và tình trạng da thực tế để mang lại sự dễ chịu trọn vẹn nhất.
            </p>

            {/* 3 Core Steps */}
            <div className="mt-10 grid grid-cols-3 gap-3 border-t border-[#d8e5d3] pt-8 sm:gap-6">
              {[
                { step: "01", title: "Lắng nghe", desc: "Thấu hiểu nhu cầu & thể trạng" },
                { step: "02", title: "Chăm sóc", desc: "Kỹ thuật chuyên sâu vừa lực" },
                { step: "03", title: "Thả lỏng", desc: "An yên trọn vẹn từng phút" },
              ].map((item) => (
                <div key={item.step} className="group">
                  <span className="font-serif text-2xl font-light text-[#6f9556] transition duration-300 group-hover:text-[#c6a35d] sm:text-3xl">
                    {item.step}
                  </span>
                  <p className="mt-2 text-xs font-bold uppercase tracking-wider text-[#22331d] sm:text-sm">
                    {item.title}
                  </p>
                  <p className="mt-1 text-[11px] font-light text-[#65795f]">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-10">
              <Link 
                href="/dich-vu" 
                className="group inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-[#3b5232] transition hover:text-[#6f9556]"
              >
                <span>Khám phá toàn bộ dịch vụ</span>
                <span className="transition-transform duration-200 group-hover:translate-x-1.5">→</span>
              </Link>
            </div>
          </div>

          {/* Asymmetric Arch Images */}
          <div className="relative pb-10 pl-6 sm:pb-14 sm:pl-10">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[2.5rem] bg-[#e1ecd9] shadow-[0_25px_60px_rgba(28,40,24,0.12)]">
              <Image 
                src="/img/ve-mombi1.jpg" 
                alt="Không gian phòng chăm sóc tại Mombi Care Spa" 
                fill 
                sizes="(max-width: 1024px) 100vw, 50vw" 
                className="object-cover transition duration-700 hover:scale-105" 
              />
            </div>
            
            {/* Floating Overlapping Card */}
            <div className="absolute bottom-0 left-0 h-40 w-32 overflow-hidden rounded-[1.75rem] border-4 border-[#faf8f5] bg-[#e5efe0] shadow-2xl sm:h-56 sm:w-44 md:h-64 md:w-52">
              <Image 
                src="/img/ve-mombi2.jpg" 
                alt="Góc nghỉ ngơi uống trà tại Mombi" 
                fill 
                sizes="210px" 
                className="object-cover" 
              />
            </div>

            {/* Floating Boutique Stamp Badge */}
            <div className="absolute -right-2 top-6 rounded-2xl border border-[#d6e3ce] bg-white/90 p-4 shadow-xl backdrop-blur-md sm:right-6 sm:top-10 sm:p-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#6f9556]">Boutique Spa</p>
              <p className="mt-1 font-serif text-lg font-normal text-[#1c2619] sm:text-xl">Một khoảng lặng an lành</p>
              <p className="text-[10px] text-[#71856b]">TP. Buôn Ma Thuột</p>
            </div>
          </div>
        </div>
      </section>

      {/* 🌿 SECTION 3: INTERACTIVE TREATMENT MENU (BẢNG DỊCH VỤ TƯƠNG TÁC) */}
      <section className="border-y border-[#dce7d6] bg-white px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-7xl">
          {/* Header & Category Tabs */}
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#6f9556]">Bảng liệu trình chuẩn mực</p>
              <h2 className="mt-3 font-serif text-[2.4rem] font-normal leading-tight text-[#1c2619] sm:text-5xl md:text-6xl">
                Chọn khoảng nghỉ bạn đang cần.
              </h2>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2 rounded-2xl bg-[#edf4e8] p-1.5">
              <button 
                onClick={() => setActiveCategory("all")}
                className={`rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wider transition ${
                  activeCategory === "all" ? "bg-white text-[#22331d] shadow-sm" : "text-[#586c52] hover:text-[#22331d]"
                }`}
              >
                Tất cả liệu trình
              </button>
              <button 
                onClick={() => setActiveCategory("skincare")}
                className={`rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wider transition ${
                  activeCategory === "skincare" ? "bg-white text-[#22331d] shadow-sm" : "text-[#586c52] hover:text-[#22331d]"
                }`}
              >
                Chăm sóc da
              </button>
              <button 
                onClick={() => setActiveCategory("massage")}
                className={`rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wider transition ${
                  activeCategory === "massage" ? "bg-white text-[#22331d] shadow-sm" : "text-[#586c52] hover:text-[#22331d]"
                }`}
              >
                Massage &amp; Gội đầu
              </button>
            </div>
          </div>

          {/* Service Cards Grid */}
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredServices.map((service) => (
              <article 
                key={service.id}
                className="group flex flex-col justify-between overflow-hidden rounded-[2rem] border border-[#dce7d6] bg-[#faf8f5] transition-all duration-300 hover:-translate-y-1.5 hover:border-[#b8cdb0] hover:shadow-[0_22px_50px_rgba(28,40,24,0.1)]"
              >
                <div>
                  {/* Card Image Banner */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-[#e1ecd9]">
                    <Image 
                      src={service.image} 
                      alt={service.title} 
                      fill 
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" 
                      className="object-cover transition duration-700 group-hover:scale-105" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#142012]/60 via-transparent to-transparent" />
                    
                    {/* Duration Badge */}
                    <span className="absolute bottom-3 left-3 rounded-full border border-white/30 bg-black/40 px-3 py-1 text-[10px] font-semibold tracking-wider text-white backdrop-blur-md">
                      ⏱ {service.duration}
                    </span>

                    {/* Popular Badge */}
                    {service.isPopular && (
                      <span className="gold-badge absolute top-3 right-3 rounded-full px-3 py-1 text-[9px] font-bold uppercase tracking-wider shadow-sm">
                        ★ Yêu thích nhất
                      </span>
                    )}
                  </div>

                  {/* Card Body */}
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-[#6f9556]">
                          {service.subtitle}
                        </p>
                        <h3 className="mt-1 font-serif text-2xl font-normal text-[#1c2619] group-hover:text-[#3b5232]">
                          {service.title}
                        </h3>
                      </div>
                      <span className="font-serif text-lg font-bold text-[#6f9556]">
                        {service.price}
                      </span>
                    </div>

                    <p className="mt-3 text-xs font-light leading-6 text-[#586c52]">
                      {service.description}
                    </p>

                    {/* Highlights */}
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {service.highlights.map((tag) => (
                        <span key={tag} className="rounded-md bg-[#edf4e8] px-2 py-1 text-[10px] font-medium text-[#465b3f]">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Action Link */}
                <div className="border-t border-[#e5eee1] p-4 bg-white/60">
                  <a 
                    href={`https://zalo.me/0934250909`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-between rounded-xl bg-[#edf4e8] px-4 py-2.5 text-xs font-bold text-[#35492e] transition hover:bg-[#6f9556] hover:text-white"
                  >
                    <span>Tư vấn liệu trình này qua Zalo</span>
                    <span>→</span>
                  </a>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link 
              href="/dich-vu"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#b8cdb0] bg-[#faf8f5] px-8 text-xs font-bold uppercase tracking-[0.16em] text-[#35492e] shadow-sm transition hover:bg-[#22331d] hover:text-white"
            >
              Xem chi tiết bảng giá đầy đủ các dịch vụ
            </Link>
          </div>
        </div>
      </section>

      {/* 🌿 SECTION 4: MOOD / CONCERN FINDER (HÔM NAY BẠN CẦN GÌ?) */}
      <section className="px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-7xl rounded-[2.5rem] bg-[#edf4e8] p-6 sm:p-10 md:p-14 lg:p-16">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#6f9556]">Cá nhân hóa trải nghiệm</p>
            <h2 className="mt-3 font-serif text-3xl font-normal text-[#1c2619] sm:text-4xl md:text-5xl">
              Hôm nay cơ thể bạn đang cần gì?
            </h2>
            <p className="mt-3 text-sm font-light text-[#55694f]">
              Chọn cảm giác hoặc nhu cầu hiện tại để Mombi gợi ý liệu trình phù hợp nhất cho bạn:
            </p>
          </div>

          {/* Mood Options Buttons */}
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {moodOptions.map((mood, index) => {
              const isSelected = activeMoodIndex === index;
              return (
                <button
                  key={mood.id}
                  onClick={() => setActiveMoodIndex(index)}
                  className={`flex flex-col items-start rounded-2xl p-5 text-left transition-all duration-300 ${
                    isSelected 
                      ? "border-2 border-[#6f9556] bg-white shadow-xl scale-[1.02]" 
                      : "border border-[#d2dfcb] bg-white/70 hover:bg-white"
                  }`}
                >
                  <span className="text-2xl">{mood.icon}</span>
                  <span className="mt-3 text-sm font-bold text-[#1c2619]">{mood.label}</span>
                  <span className="mt-1 text-xs font-light text-[#63755c]">{mood.subtitle}</span>
                </button>
              );
            })}
          </div>

          {/* Recommended Result Display */}
          <div className="mt-8 rounded-2xl border border-[#d2dfcb] bg-white p-6 sm:p-8">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
              <div>
                <span className="rounded-full bg-[#edf4e8] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#6f9556]">
                  Gợi ý tối ưu dành cho bạn
                </span>
                <h3 className="mt-2 font-serif text-2xl font-normal text-[#1c2619] sm:text-3xl">
                  {moodOptions[activeMoodIndex].recommendation.title}
                </h3>
                <p className="mt-2 max-w-xl text-sm font-light leading-6 text-[#586c52]">
                  {moodOptions[activeMoodIndex].recommendation.desc}
                </p>
              </div>

              <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center md:flex-col md:items-end">
                <div className="text-left md:text-right">
                  <p className="text-[10px] uppercase tracking-wider text-[#73856d]">Giá niêm yết</p>
                  <p className="font-serif text-2xl font-bold text-[#6f9556]">
                    {moodOptions[activeMoodIndex].recommendation.price}
                  </p>
                </div>

                <a 
                  href="https://zalo.me/0934250909"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#24361e] px-6 text-xs font-bold uppercase tracking-wider text-white shadow-md transition hover:bg-[#385130]"
                >
                  {moodOptions[activeMoodIndex].recommendation.actionLabel} →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🌿 SECTION 5: SANCTUARY OF WELLNESS - DARK CONTRAST SECTION */}
      <section className="bg-[#182515] px-5 py-20 text-white sm:px-8 sm:py-28 md:py-36">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-20">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[2.5rem] bg-[#2a3c25] shadow-2xl">
            <Image 
              src="/img/ve-mombi.jpg" 
              alt="Kỹ thuật viên Mombi Care Spa chu đáo tận tâm" 
              fill 
              sizes="(max-width: 1024px) 100vw, 50vw" 
              className="object-cover object-top" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#121c10]/70 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-white/20 bg-black/40 p-4 backdrop-blur-md sm:p-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#a9c994]">Mombi Care Spa</p>
              <p className="mt-0.5 text-sm font-medium text-white">34 Trần Khánh Dư, TP. Buôn Ma Thuột</p>
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#a9c994]">Chuẩn mực dịch vụ</p>
            <h2 className="mt-4 font-serif text-[2.5rem] font-normal leading-[1.08] text-white sm:text-5xl md:text-6xl">
              Sự thư giãn trọn vẹn tạo nên từ từng chi tiết nhỏ.
            </h2>
            <p className="mt-6 text-sm font-light leading-7 text-[#b7cbb7] sm:text-base sm:leading-8">
              Từ ánh sáng dịu nhẹ, hương thơm tinh dầu tự nhiên đến cách kỹ thuật viên điều chỉnh lực tay theo mong muốn — mọi khoảnh khắc tại Mombi đều được sắp đặt để bạn có thể hoàn toàn buông bỏ âu lo.
            </p>

            <div className="mt-10 space-y-6">
              {[
                { number: "01", title: "Không gian riêng tư & Vệ sinh chuẩn mực", desc: "Khăn trải, ga giường và dụng cụ luôn được thay mới và tiệt trùng sau mỗi lượt khách." },
                { number: "02", title: "Tư vấn trung thực & Không chèo kéo", desc: "Liệu trình được xây dựng đúng nhu cầu thực tế. Không ép mua liệu trình dài hạn." },
                { number: "03", title: "Phục vụ linh hoạt cả ngày lẫn đêm", desc: "Dù bạn ghé vào giờ nghỉ trưa hay sau một ngày dài làm việc muộn, Mombi luôn sẵn sàng." },
              ].map((item) => (
                <div key={item.number} className="grid grid-cols-[40px_1fr] gap-4 border-t border-white/15 pt-6">
                  <span className="font-serif text-2xl font-light text-[#c6a35d]">{item.number}</span>
                  <div>
                    <h3 className="font-serif text-xl font-normal text-white">{item.title}</h3>
                    <p className="mt-1.5 text-xs font-light leading-6 text-[#9ab09a]">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 🌿 SECTION 6: TESTIMONIALS & SOCIAL PROOF */}
      <section className="px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#6f9556]">Cảm nhận khách hàng</p>
            <h2 className="mx-auto mt-3 max-w-3xl font-serif text-[2.4rem] font-normal leading-tight text-[#1c2619] sm:text-5xl">
              Những nụ cười ở lại sau một khoảng nghỉ.
            </h2>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {testimonials.map((item) => (
              <figure 
                key={item.name}
                className={`flex flex-col justify-between rounded-[2rem] p-7 sm:p-9 transition-all duration-300 ${
                  item.isFeatured 
                    ? "border-2 border-[#6f9556] bg-[#edf4e8] shadow-xl" 
                    : "border border-[#dce7d6] bg-white shadow-sm hover:shadow-md"
                }`}
              >
                <div>
                  <div className="flex text-sm text-[#c6a35d]" aria-label="5 sao">
                    ★★★★★
                  </div>
                  <blockquote className="mt-6 font-serif text-xl font-normal leading-8 text-[#22331d]">
                    “{item.quote}”
                  </blockquote>
                </div>

                <figcaption className="mt-8 border-t border-[#d5e3cf] pt-5">
                  <p className="font-bold text-[#1c2619] text-sm">{item.name}</p>
                  <p className="text-xs text-[#6f9556] font-medium mt-0.5">{item.service}</p>
                  <p className="text-[11px] text-[#788a73]">{item.role}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* 🌿 SECTION 7: CHUYỆN NHÀ MOMBI - EDITORIAL JOURNAL */}
      <section id="chuyen-nha" className="border-t border-[#dce7d6] bg-[#edf4e8] px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#6f9556]">Chuyện nhà Mombi</p>
              <h2 className="mt-3 font-serif text-[2.4rem] font-normal leading-tight text-[#1c2619] sm:text-5xl">
                Một chút dịu dàng để đọc chậm.
              </h2>
            </div>
            <Link 
              href="/chuyen-nha"
              className="inline-flex min-h-11 items-center gap-3 rounded-full border border-[#b8cdb0] bg-white px-6 text-xs font-bold uppercase tracking-wider text-[#2d3f27] transition hover:bg-[#22331d] hover:text-white"
            >
              <span>Xem tất cả bài viết</span>
              <span>→</span>
            </Link>
          </div>

          {/* Articles list */}
          {cmsArticles && cmsArticles.length > 0 && (
            <div className="mt-12 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
              {/* Featured Main Article */}
              <article className="group overflow-hidden rounded-[2rem] border border-[#d2dfcb] bg-white shadow-sm transition hover:shadow-xl">
                <Link href={`/chuyen-nha/${cmsArticles[0].slug}`} className="relative block aspect-[16/10] overflow-hidden bg-[#e1ecd9]">
                  <Image 
                    src={cmsArticles[0].image || "/img/landing-1.jpg"} 
                    alt={cmsArticles[0].title} 
                    fill 
                    sizes="(max-width: 1024px) 100vw, 65vw" 
                    className="object-cover transition duration-700 group-hover:scale-105" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <span className="absolute bottom-4 left-4 rounded-full bg-white/80 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#22331d] backdrop-blur-md">
                    {cmsArticles[0].date}
                  </span>
                </Link>
                <div className="p-7 sm:p-9">
                  <Link href={`/chuyen-nha/${cmsArticles[0].slug}`}>
                    <h3 className="font-serif text-2xl font-normal text-[#1c2619] transition group-hover:text-[#6f9556] sm:text-3xl">
                      {cmsArticles[0].title}
                    </h3>
                  </Link>
                  {cmsArticles[0].excerpt && (
                    <p className="mt-3 line-clamp-2 text-sm font-light leading-7 text-[#586c52]">
                      {cmsArticles[0].excerpt}
                    </p>
                  )}
                  <Link 
                    href={`/chuyen-nha/${cmsArticles[0].slug}`}
                    className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#6f9556]"
                  >
                    Đọc tiếp câu chuyện →
                  </Link>
                </div>
              </article>

              {/* Secondary Articles Stack */}
              <div className="flex flex-col gap-6">
                {cmsArticles.slice(1, 3).map((article) => (
                  <article key={article._id} className="group overflow-hidden rounded-[1.75rem] border border-[#d2dfcb] bg-white p-5 shadow-sm transition hover:shadow-lg sm:p-6">
                    <div className="flex gap-4">
                      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-[#e1ecd9]">
                        <Image 
                          src={article.image || "/img/landing-1.jpg"} 
                          alt={article.title} 
                          fill 
                          sizes="96px" 
                          className="object-cover transition duration-500 group-hover:scale-105" 
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] font-semibold text-[#6f9556] uppercase tracking-wider">
                          {article.date}
                        </span>
                        <Link href={`/chuyen-nha/${article.slug}`}>
                          <h4 className="mt-1 font-serif text-lg font-normal leading-snug text-[#1c2619] transition group-hover:text-[#6f9556]">
                            {article.title}
                          </h4>
                        </Link>
                        <Link 
                          href={`/chuyen-nha/${article.slug}`}
                          className="mt-2 inline-block text-[11px] font-bold text-[#6f9556]"
                        >
                          Đọc bài viết →
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 🌿 SECTION 8: FAQ ACCORDION */}
      <section className="bg-white px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#6f9556]">Câu hỏi thường gặp</p>
            <h2 className="mt-3 font-serif text-[2.4rem] font-normal leading-tight text-[#1c2619] sm:text-5xl">
              Một vài điều bạn có thể muốn biết.
            </h2>
            <p className="mt-5 text-sm font-light leading-7 text-[#586c52]">
              Nếu còn thắc mắc nào khác, bạn cứ nhắn tin trực tiếp qua Zalo. Đội ngũ Mombi luôn sẵn lòng lắng nghe và tư vấn tận tình.
            </p>
            <div className="mt-8">
              <a 
                href="https://zalo.me/0934250909"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#edf4e8] px-6 text-xs font-bold uppercase tracking-wider text-[#2b3d24] transition hover:bg-[#24361e] hover:text-white"
              >
                Nhắn hỏi Mombi trên Zalo →
              </a>
            </div>
          </div>

          <div className="border-t border-[#dce7d6]">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div key={faq.question} className="border-b border-[#dce7d6]">
                  <button 
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="flex w-full items-center justify-between gap-4 py-6 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="font-serif text-lg font-normal text-[#1c2619] sm:text-xl md:text-2xl">
                      {faq.question}
                    </span>
                    <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[#cbd9c2] text-xl font-light transition duration-300 ${
                      isOpen ? "rotate-45 bg-[#6f9556] text-white" : "text-[#6f9556]"
                    }`}>
                      +
                    </span>
                  </button>
                  <div className={`grid transition-all duration-300 ${isOpen ? "grid-rows-[1fr] pb-6" : "grid-rows-[0fr]"}`}>
                    <div className="overflow-hidden">
                      <p className="text-sm font-light leading-7 text-[#586c52]">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 🌿 SECTION 9: LOCATION & VISIT INVITATION */}
      <section id="lien-he" className="px-5 pb-20 sm:px-8 sm:pb-28">
        <div className="mx-auto grid max-w-7xl overflow-hidden rounded-[2.5rem] bg-[#1a2916] text-white lg:grid-cols-[0.9fr_1.1fr]">
          <div className="flex flex-col justify-between p-8 sm:p-12 md:p-14 lg:p-16">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#a9c994]">Ghé thăm Mombi</p>
              <h2 className="mt-3 font-serif text-[2.4rem] font-normal leading-tight text-white sm:text-5xl">
                Khoảng nghỉ của bạn đang sẵn sàng.
              </h2>
              <div className="mt-8 space-y-4 text-sm font-light text-[#d7e5d1]">
                <p className="flex items-center gap-3">
                  <span className="text-[#a9c994]">📍</span>
                  <span>34 Trần Khánh Dư, phường Tân Lợi, TP. Buôn Ma Thuột</span>
                </p>
                <p className="flex items-center gap-3">
                  <span className="text-[#a9c994]">📞</span>
                  <span>Hotline đặt hẹn: <strong className="font-bold text-white">0934 250 909</strong></span>
                </p>
                <p className="flex items-center gap-3">
                  <span className="text-[#a9c994]">⏱</span>
                  <span>Thời gian phục vụ: <strong className="text-white">Cả ngày lẫn đêm</strong></span>
                </p>
              </div>
            </div>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <a 
                href="https://zalo.me/0934250909"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#6f9556] px-7 text-xs font-bold uppercase tracking-wider text-white shadow-lg transition hover:bg-[#80aa64]"
              >
                <span>Đặt lịch qua Zalo</span>
                <span>→</span>
              </a>
              <a 
                href="tel:0934250909"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/30 px-7 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-white hover:text-[#1a2916]"
              >
                Gọi ngay 0934.250.909
              </a>
            </div>
          </div>

          <div className="min-h-[350px] bg-[#2a3c25] sm:min-h-[420px] lg:min-h-full">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d16495.528009611553!2d108.04502350853478!3d12.68557249339919!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3171f767729424c1%3A0xa17b2040c8d0d5bd!2sMombicare%20spa!5e0!3m2!1svi!2s!4v1783165042726!5m2!1svi!2s" 
              width="100%" 
              height="100%" 
              style={{ border: 0, minHeight: "360px" }} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade" 
              title="Bản đồ đường đến Mombi Care Spa 34 Trần Khánh Dư Buôn Ma Thuột" 
            />
          </div>
        </div>
      </section>

      {/* Floating Concierge Component */}
      <LuxuryFloatingConcierge />

      {/* Luxury Footer Component */}
      <SiteFooter />
    </main>
  </div>
  );
}
