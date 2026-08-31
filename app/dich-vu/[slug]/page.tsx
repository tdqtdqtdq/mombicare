import type {Metadata} from 'next'
import Image from 'next/image'
import Link from 'next/link'
import {notFound} from 'next/navigation'
import {SiteFooter, SiteHeader, LuxuryFloatingConcierge} from '@/app/components/SiteChrome'
import {client} from '@/app/lib/sanity'

type Service = {title: string; time: string; price: string; desc: string}
type RelatedArticle = {_id: string; title: string; slug: string; excerpt?: string}
type Props = {params: Promise<{slug: string}>}

export async function generateStaticParams() {
  return [
    { slug: 'cham-soc-da' },
    { slug: 'massage-thu-gian' },
  ]
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {slug} = await params
  if (slug === 'cham-soc-da') {
    return {
      title: 'Chăm Sóc Da Buôn Ma Thuột - Cấy HA, Lấy Nhân Mụn Y Khoa & Trẻ Hóa',
      description: 'Dịch vụ chăm sóc da chuyên sâu tại Buôn Ma Thuột: Cấy HA căng bóng da, cấy DNA cá hồi, lấy nhân mụn chuẩn y khoa 1 lần vô trùng, điện di tinh chất và massage mặt Thái chí.',
      alternates: {canonical: 'https://www.mombicarespa.com/dich-vu/cham-soc-da'},
      openGraph: {
        title: 'Chăm Sóc Da Buôn Ma Thuột - Cấy HA & Lấy Nhân Mụn | Mombi Care',
        description: 'Liệu trình chăm sóc da chuyên biệt chuẩn y khoa tại 34 Trần Khánh Dư, Buôn Ma Thuột.',
        url: 'https://www.mombicarespa.com/dich-vu/cham-soc-da',
        images: [{url: '/img/skin-care.jpg', alt: 'Chăm sóc da Mombi Care Spa Buôn Ma Thuột'}],
      }
    }
  }
  if (slug === 'massage-thu-gian') {
    return {
      title: 'Gội Đầu Dưỡng Sinh & Massage Body Buôn Ma Thuột - Thư Giãn 24/7',
      description: 'Địa chỉ gội đầu dưỡng sinh thảo mộc và massage body tinh dầu uy tín tại Buôn Ma Thuột. Giải bó cơ, bấm huyệt cổ vai gáy, ngâm chân thảo dược. Phục vụ cả ngày lẫn đêm, không tip.',
      alternates: {canonical: 'https://www.mombicarespa.com/dich-vu/massage-thu-gian'},
      openGraph: {
        title: 'Gội Đầu Dưỡng Sinh & Massage Body Buôn Ma Thuột | Mombi Care',
        description: 'Dịch vụ massage thư giãn và gội đầu dưỡng sinh thảo mộc hàng đầu tại Buôn Ma Thuột.',
        url: 'https://www.mombicarespa.com/dich-vu/massage-thu-gian',
        images: [{url: '/img/massage body mombi care spa.jpg', alt: 'Massage thư giãn Mombi Care Spa Buôn Ma Thuột'}],
      }
    }
  }
  return {
    title: 'Dịch Vụ Spa Buôn Ma Thuột | Mombi Care Spa',
  }
}

async function getRelatedArticles(): Promise<RelatedArticle[]> {
  return client.fetch(`
    *[_type == "article" && defined(slug.current) && seo.noIndex != true]
      | order(publishedAt desc)[0...3] {
        _id,
        title,
        "slug": slug.current,
        excerpt
      }
  `, {}, {next: {revalidate: 60}})
}

const skincareServices: Service[] = [
  {title: 'Chăm sóc da cơ bản', time: '60 phút', price: '150.000đ', desc: 'Làm sạch sâu, tẩy da chết nhẹ nhàng, xông hơi, massage thư giãn mặt và bảo vệ làn da.'},
  {title: 'Cấy HA căng bóng da', time: '90 phút', price: '410.000đ', desc: 'Bổ sung Hyaluronic Acid tinh khiết tầng sâu, hỗ trợ da căng mọng, đàn hồi và tươi tắn.'},
  {title: 'Cấy tinh chất DNA cá hồi', time: '90 phút', price: '490.000đ', desc: 'Liệu trình tái tạo và nuôi dưỡng tế bào dành cho làn da mệt mỏi, cần phục hồi chuyên sâu.'},
  {title: 'Massage mặt Thái chí', time: '75 phút', price: '310.000đ', desc: 'Thả lỏng toàn bộ cơ mặt, kích thích tuần hoàn lưu thông máu mang lại vẻ hồng hào tự nhiên.'},
  {title: 'Massage mặt + Cấy tảo + Điện di', time: '75 phút', price: '330.000đ', desc: 'Kết hợp thư giãn, thải độc tố, đưa vi chất tảo biển và tinh chất làm sáng vào sâu trong da.'},
  {title: 'Cấy serum dưỡng sáng da', time: '90 phút', price: '350.000đ', desc: 'Nuôi dưỡng làn da sáng khỏe, đều màu và hỗ trợ mờ thâm sạm sau mụn.'},
  {title: 'Lấy nhân mụn chuẩn y khoa', time: '60 phút', price: '250.000đ', desc: 'Lấy sạch cồi mụn với dụng cụ vô trùng tiệt trùng 1 lần, kết hợp diệt khuẩn tia điện tím.'},
  {title: 'Lấy nhân mụn chuyên sâu', time: '120 phút', price: '350.000đ', desc: 'Dành cho tình trạng mụn viêm nhiều, kết hợp đắp mặt nạ làm dịu và phục hồi tức thì.'},
  {title: 'Chăm sóc da chuyên sâu', time: '70 phút', price: '200.000đ', desc: 'Quy trình nuôi dưỡng toàn diện, cân bằng độ ẩm và phục hồi màng bảo vệ da.'},
]

const massageServices: Service[] = [
  {title: 'Gội đầu sạch thảo mộc', time: '45 phút', price: '50.000đ', desc: 'Làm sạch da đầu với dầu gội thảo dược và massage thư giãn nhẹ nhàng sau ngày dài.'},
  {title: 'Gội đầu dưỡng sinh chuyên sâu', time: '70 phút', price: '150.000đ', desc: 'Gội đầu nước thảo mộc ấm kết hợp ấn huyệt kinh lạc vùng đầu, cổ vai gáy và sấy tạo kiểu.'},
  {title: 'Massage vai cổ gáy', time: '45 phút', price: '250.000đ', desc: 'Tập trung thả lỏng các bó cơ căng cứng vùng cổ, hai bên vai và vùng lưng trên.'},
  {title: 'Massage body tinh dầu', time: '60 phút', price: '250.000đ', desc: 'Massage toàn thân với tinh dầu thiên nhiên nguyên chất, giúp giải toả mệt mỏi và tái tạo năng lượng.'},
  {title: 'Massage vai cổ gáy chuyên sâu', time: '45 phút', price: '250.000đ', desc: 'Kỹ thuật viên tay nghề cao tập trung bấm huyệt giải phóng triệt để các điểm chèn ép cơ.'},
  {title: 'Massage body chuyên sâu', time: '60 phút', price: '300.000đ', desc: 'Chăm sóc toàn thân với lực tay và kỹ thuật điều chỉnh chuyên sâu theo từng nhóm cơ.'},
  {title: 'Massage body chuyên sâu cao cấp', time: '90 phút', price: '400.000đ', desc: 'Khoảng nghỉ trọn vẹn 90 phút với liệu trình đá nóng, ngâm chân thảo mộc và massage toàn diện.'},
  {title: 'Giải bó cơ trị liệu', time: '30 – 60 phút', price: '200.000đ – 350.000đ', desc: 'Tập trung làm mềm các dải cơ bị xơ cứng cho người hay tập thể thao hoặc ít vận động.'},
  {title: 'Massage chân & Ngâm thảo dược', time: '45 – 60 phút', price: '150.000đ – 250.000đ', desc: 'Ngâm chân nước lá ấm thảo dược, tẩy tế bào chết và massage bấm huyệt lòng bàn chân.'},
  {title: 'Xông hơi thảo dược', time: '15 phút', price: '50.000đ', desc: 'Làm ấm cơ thể, thải độc qua tuyến mồ hôi và thư giãn trước hoặc sau liệu trình.'},
  {title: 'Giác hơi truyền thống', time: '15 – 20 phút', price: '50.000đ', desc: 'Liệu pháp truyền thống hỗ trợ giải trừ hàn khí, thả lỏng vùng lưng và vai gáy.'},
]

const pageContent = {
  'cham-soc-da': {
    eyebrow: 'Nuôi dưỡng & Phục hồi',
    title: 'Chăm sóc da',
    intro: 'Mỗi làn da có một nhịp riêng. Mombi bắt đầu bằng việc lắng nghe nhu cầu và lựa chọn các bước chăm sóc vừa đủ cho tình trạng da của bạn.',
    image: '/img/skin-care.jpg',
    imageAlt: 'Chăm sóc da tại Mombi Care Spa Buôn Ma Thuột',
    services: skincareServices,
    otherHref: '/dich-vu/massage-thu-gian',
    otherLabel: 'Khám phá Massage & Thư giãn',
  },
  'massage-thu-gian': {
    eyebrow: 'Thả lỏng & Cân bằng',
    title: 'Massage thư giãn',
    intro: 'Từ gội đầu dưỡng sinh đến massage toàn thân, mỗi liệu trình là một khoảng dừng để cơ thể được thả lỏng và trở về trạng thái dễ chịu hơn.',
    image: '/img/massage body mombi care spa.jpg',
    imageAlt: 'Massage thư giãn tại Mombi Care Spa Buôn Ma Thuột',
    services: massageServices,
    otherHref: '/dich-vu/cham-soc-da',
    otherLabel: 'Khám phá Chăm sóc da',
  },
} as const

export default async function ServiceCategoryPage({params}: Props) {
  const {slug} = await params
  const content = pageContent[slug as keyof typeof pageContent]
  if (!content) notFound()
  const relatedArticles = await getRelatedArticles()

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#1c2619]">
      <SiteHeader />
      <main>
        {/* Category Hero */}
        <section className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 sm:py-12 md:px-8 md:py-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-stretch">
          <div className="flex flex-col justify-between rounded-[2.5rem] bg-[#edf4e8] p-7 sm:p-10 md:p-14">
            <div>
              <nav className="mb-6 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#6f9556]" aria-label="Đường dẫn">
                <Link href="/dich-vu" className="hover:underline">Dịch vụ</Link>
                <span aria-hidden="true">/</span>
                <span className="text-[#22331d]">{content.title}</span>
              </nav>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#6f9556]">{content.eyebrow}</p>
              <h1 className="mt-4 font-serif text-[2.75rem] font-normal leading-[1.04] text-[#1c2619] sm:text-5xl md:text-6xl">{content.title}</h1>
              <p className="mt-6 text-sm font-light leading-7 text-[#55694f] sm:text-base sm:leading-8">{content.intro}</p>
            </div>
            <div className="mt-10">
              <a 
                href="https://zalo.me/0934250909" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex min-h-12 items-center gap-3 rounded-full bg-[#24361e] px-7 text-xs font-bold uppercase tracking-[0.16em] text-white shadow-md transition hover:bg-[#385130]"
              >
                <span>Đặt lịch tư vấn trực tiếp</span>
                <span>→</span>
              </a>
            </div>
          </div>

          <div className="relative aspect-[4/3] min-h-[320px] overflow-hidden rounded-[2.5rem] bg-[#dfe8d7] shadow-xl sm:min-h-[420px] md:min-h-[500px]">
            <Image src={content.image} alt={content.imageAlt} fill priority sizes="(max-width: 1024px) 100vw, 55vw" className="object-cover" />
            <div className="absolute inset-x-5 bottom-5 flex items-center justify-between rounded-2xl border border-white/30 bg-black/40 px-5 py-3.5 text-white backdrop-blur-md">
              <span className="text-xs font-bold uppercase tracking-[0.16em]">Mombi Care Spa</span>
              <span className="text-xs text-white/90">34 Trần Khánh Dư, BMT</span>
            </div>
          </div>
        </section>

        {/* Pricing & Treatment List */}
        <section className="border-y border-[#dce7d6] bg-white px-4 py-16 sm:px-6 sm:py-20 md:px-8 md:py-28">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#6f9556]">Bảng giá niêm yết</p>
                <h2 className="mt-2 font-serif text-3xl font-normal text-[#1c2619] sm:text-4xl md:text-5xl">
                  Chọn khoảng nghỉ của bạn
                </h2>
              </div>
              <p className="max-w-md text-sm font-light text-[#586c52]">
                Thời lượng và mức giá niêm yết trọn gói. Mombi luôn tư vấn lại trước khi bắt đầu liệu trình.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {content.services.map((service, index) => (
                <article 
                  key={service.title} 
                  className="group flex flex-col justify-between rounded-[2rem] border border-[#dce7d6] bg-[#faf8f5] p-6 transition hover:border-[#b8cdb0] hover:bg-[#f4f8f0] hover:shadow-md sm:p-7"
                >
                  <div>
                    <div className="flex items-start justify-between gap-4 border-b border-[#e5eee1] pb-4">
                      <div className="flex items-start gap-3.5">
                        <span className="mt-0.5 grid h-7 w-7 place-items-center rounded-full bg-[#edf4e8] text-xs font-bold text-[#6f9556]">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <div>
                          <h3 className="font-serif text-xl font-normal text-[#1c2619] group-hover:text-[#385130] sm:text-2xl">
                            {service.title}
                          </h3>
                          <span className="mt-1 inline-block rounded-full bg-white px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#63755c] shadow-xs">
                            ⏱ {service.time}
                          </span>
                        </div>
                      </div>
                      <span className="font-serif text-lg font-bold text-[#6f9556] shrink-0">
                        {service.price}
                      </span>
                    </div>

                    <p className="mt-4 text-xs font-light leading-6 text-[#586c52] sm:text-sm">
                      {service.desc}
                    </p>
                  </div>

                  <div className="mt-5 pt-3">
                    <a 
                      href="https://zalo.me/0934250909"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs font-bold text-[#6f9556] transition hover:text-[#22331d]"
                    >
                      <span>Đặt hẹn gói này qua Zalo</span>
                      <span>→</span>
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Related Articles Section */}
        {relatedArticles.length > 0 && (
          <section className="bg-[#edf4e8] px-4 py-16 sm:px-6 sm:py-20 md:px-8 md:py-28">
            <div className="mx-auto max-w-7xl">
              <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#6f9556]">Chuyện nhà Mombi</p>
                  <h2 className="mt-2 font-serif text-3xl font-normal text-[#1c2619] sm:text-4xl">
                    Đọc thêm trước khi chọn liệu trình
                  </h2>
                </div>
                <Link href="/chuyen-nha" className="text-xs font-bold uppercase tracking-wider text-[#6f9556] hover:underline">
                  Xem tất cả bài viết →
                </Link>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {relatedArticles.map((article) => (
                  <article key={article._id} className="flex flex-col justify-between rounded-[2rem] border border-[#d2dfcb] bg-white p-6 shadow-sm transition hover:shadow-md">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#6f9556]">Cẩm nang Mombi</span>
                      <h3 className="mt-3 font-serif text-xl font-normal text-[#1c2619]">
                        <Link href={`/chuyen-nha/${article.slug}`} className="hover:text-[#6f9556]">
                          {article.title}
                        </Link>
                      </h3>
                      {article.excerpt && (
                        <p className="mt-3 line-clamp-3 text-xs font-light leading-6 text-[#586c52]">
                          {article.excerpt}
                        </p>
                      )}
                    </div>
                    <Link href={`/chuyen-nha/${article.slug}`} className="mt-5 inline-block text-xs font-bold text-[#6f9556]">
                      Đọc bài viết →
                    </Link>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Cross Category Promo */}
        <section className="px-4 py-16 sm:px-6 sm:py-20 md:px-8 md:py-24">
          <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 rounded-[2.5rem] bg-[#1a2916] p-8 text-white sm:p-12 md:flex-row md:items-center">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#a9c994]">Một lựa chọn khác</p>
              <h2 className="mt-2 font-serif text-2xl font-normal text-white sm:text-3xl md:text-4xl">
                {content.otherLabel}
              </h2>
            </div>
            <Link 
              href={content.otherHref} 
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-7 text-xs font-bold uppercase tracking-wider text-[#1a2916] transition hover:bg-[#edf4e8]"
            >
              Khám phá ngay →
            </Link>
          </div>
        </section>
      </main>
      <LuxuryFloatingConcierge />
      <SiteFooter />
    </div>
  )
}

