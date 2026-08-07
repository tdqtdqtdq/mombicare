import Image from 'next/image'
import Link from 'next/link'
import {notFound} from 'next/navigation'
import {SiteFooter, SiteHeader} from '@/app/components/SiteChrome'
import {client} from '@/app/lib/sanity'

type Service = {title: string; time: string; price: string; desc: string}
type RelatedArticle = {_id: string; title: string; slug: string; excerpt?: string}
type Props = {params: Promise<{slug: string}>}

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
  {title: 'Chăm sóc da cơ bản', time: '60 phút', price: '150.000đ', desc: 'Làm sạch sâu, nuôi dưỡng, massage thư giãn và bảo vệ làn da.'},
  {title: 'Cấy HA căng bóng da', time: '90 phút', price: '410.000đ', desc: 'Bổ sung độ ẩm, hỗ trợ da căng mịn và tươi tắn hơn.'},
  {title: 'Cấy tinh chất DNA cá hồi', time: '90 phút', price: '490.000đ', desc: 'Liệu trình chăm sóc và phục hồi dành cho làn da cần tái tạo.'},
  {title: 'Massage mặt Thái chí', time: '75 phút', price: '310.000đ', desc: 'Thả lỏng cơ mặt, hỗ trợ tuần hoàn và mang lại vẻ hồng hào tự nhiên.'},
  {title: 'Massage mặt + Cấy tảo + Điện di', time: '75 phút', price: '330.000đ', desc: 'Kết hợp thư giãn, làm sạch và đưa dưỡng chất chăm sóc vào da.'},
  {title: 'Cấy serum dưỡng sáng da', time: '90 phút', price: '350.000đ', desc: 'Nuôi dưỡng làn da sáng, đều màu và hỗ trợ cải thiện sắc tố.'},
  {title: 'Lấy nhân mụn', time: '60 phút', price: '250.000đ', desc: 'Làm sạch nhân mụn với dụng cụ tiệt trùng và quy trình chăm sóc phù hợp.'},
  {title: 'Lấy nhân mụn chuyên sâu', time: '120 phút', price: '350.000đ', desc: 'Dành cho tình trạng nhiều nhân mụn, kết hợp các bước làm dịu và phục hồi.'},
  {title: 'Chăm sóc da chuyên sâu', time: '70 phút', price: '200.000đ', desc: 'Quy trình chăm sóc toàn diện, điều chỉnh theo nhu cầu của làn da.'},
]

const massageServices: Service[] = [
  {title: 'Gội đầu sạch', time: '45 phút', price: '50.000đ', desc: 'Làm sạch da đầu và thư giãn nhẹ nhàng sau một ngày dài.'},
  {title: 'Gội đầu dưỡng sinh', time: '70 phút', price: '150.000đ', desc: 'Gội đầu kết hợp massage vùng đầu, cổ và vai gáy.'},
  {title: 'Massage vai cổ gáy', time: '45 phút', price: '250.000đ', desc: 'Tập trung thả lỏng vùng cổ, vai và gáy thường xuyên căng mỏi.'},
  {title: 'Massage body', time: '60 phút', price: '250.000đ', desc: 'Massage toàn thân với tinh dầu, giúp cơ thể thư giãn và phục hồi năng lượng.'},
  {title: 'Massage vai cổ gáy chuyên sâu', time: '45 phút', price: '250.000đ', desc: 'Kỹ thuật chuyên sâu tập trung vào những vùng cơ đang căng cứng.'},
  {title: 'Massage body chuyên sâu', time: '60 phút', price: '300.000đ', desc: 'Chăm sóc toàn thân với lực và kỹ thuật được điều chỉnh phù hợp.'},
  {title: 'Massage body chuyên sâu cao cấp', time: '90 phút', price: '400.000đ', desc: 'Khoảng nghỉ dài hơn với liệu trình toàn thân được chăm chút trọn vẹn.'},
  {title: 'Giải bó cơ', time: '30 – 60 phút', price: '200.000đ – 350.000đ', desc: 'Tập trung vào các vùng cơ căng cứng để cơ thể dễ vận động và thư giãn hơn.'},
  {title: 'Massage chân', time: '45 – 60 phút', price: '150.000đ – 250.000đ', desc: 'Ngâm chân, chăm sóc da và massage thư giãn hoặc chuyên sâu.'},
  {title: 'Xông hơi', time: '15 phút', price: '50.000đ', desc: 'Làm ấm và thư giãn cơ thể trước hoặc sau liệu trình.'},
  {title: 'Giác hơi', time: '15 – 20 phút', price: '50.000đ', desc: 'Liệu pháp truyền thống hỗ trợ thả lỏng vùng lưng và vai gáy.'},
]

const pageContent = {
  'cham-soc-da': {
    eyebrow: 'Nuôi dưỡng & phục hồi',
    title: 'Chăm sóc da',
    intro: 'Mỗi làn da có một nhịp riêng. Mombi bắt đầu bằng việc lắng nghe nhu cầu và lựa chọn các bước chăm sóc vừa đủ cho tình trạng da của bạn.',
    image: '/img/skin-care.jpg',
    imageAlt: 'Chăm sóc da tại Mombi Care Spa',
    services: skincareServices,
    otherHref: '/dich-vu/massage-thu-gian',
    otherLabel: 'Khám phá massage thư giãn',
  },
  'massage-thu-gian': {
    eyebrow: 'Thả lỏng & cân bằng',
    title: 'Massage thư giãn',
    intro: 'Từ gội đầu dưỡng sinh đến massage toàn thân, mỗi liệu trình là một khoảng dừng để cơ thể được thả lỏng và trở về trạng thái dễ chịu hơn.',
    image: '/img/massage body mombi care spa.jpg',
    imageAlt: 'Massage thư giãn tại Mombi Care Spa',
    services: massageServices,
    otherHref: '/dich-vu/cham-soc-da',
    otherLabel: 'Khám phá chăm sóc da',
  },
} as const

export default async function ServiceCategoryPage({params}: Props) {
  const {slug} = await params
  const content = pageContent[slug as keyof typeof pageContent]
  if (!content) notFound()
  const relatedArticles = await getRelatedArticles()

  return (
    <div className="min-h-screen bg-[#f8f7f2] text-[#26351f]">
      <SiteHeader />
      <main>
        <section className="mx-auto grid max-w-7xl gap-4 px-3 py-5 sm:gap-8 sm:px-4 sm:py-8 md:px-8 md:py-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-stretch">
          <div className="flex flex-col justify-between rounded-[1.5rem] bg-[#edf3e8] p-5 sm:rounded-[1.75rem] sm:p-7 md:p-12 lg:p-14">
            <div>
              <nav className="mb-7 flex items-center gap-2 text-[10px] uppercase tracking-[0.12em] text-[#738468] sm:mb-12 sm:text-[11px] sm:tracking-[0.15em]" aria-label="Đường dẫn">
                <Link href="/dich-vu" className="inline-flex min-h-11 items-center hover:text-[#587643]">Dịch vụ</Link><span aria-hidden="true">/</span><span>{content.title}</span>
              </nav>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#759959] sm:text-[11px] sm:tracking-[0.28em]">{content.eyebrow}</p>
              <h1 className="mt-4 font-serif text-[2.625rem] leading-[1.05] tracking-[-0.025em] sm:mt-5 sm:text-5xl md:text-7xl">{content.title}</h1>
              <p className="mt-5 max-w-xl text-sm font-normal leading-7 text-[#55664e] sm:mt-7 md:text-base md:leading-8">{content.intro}</p>
            </div>
            <a href="https://zalo.me/0934250909" target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex min-h-11 w-fit items-center gap-3 rounded-full bg-[#789f5d] px-5 text-[11px] font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-[#63874b] sm:mt-12 sm:px-6 sm:text-xs sm:tracking-[0.14em]">Đặt lịch tư vấn <span aria-hidden="true">→</span></a>
          </div>
          <div className="relative aspect-[4/3] min-h-0 overflow-hidden rounded-[1.5rem] bg-[#dfe8d7] sm:min-h-[420px] sm:rounded-[1.75rem] md:min-h-[600px]">
            <Image src={content.image} alt={content.imageAlt} fill priority sizes="(max-width: 1024px) 100vw, 55vw" className="object-cover" />
            <div className="absolute inset-x-3 bottom-3 flex items-center justify-between rounded-xl border border-white/30 bg-[#26351f]/60 px-4 py-3 text-white backdrop-blur-md sm:inset-x-5 sm:bottom-5 sm:rounded-2xl sm:px-5 sm:py-4 md:inset-x-7 md:bottom-7">
              <span className="text-xs font-medium uppercase tracking-[0.14em]">Mombi Care Spa</span>
              <span className="text-xs text-white/80">Buôn Ma Thuột</span>
            </div>
          </div>
        </section>

        <section className="border-y border-[#e0e7db] bg-white px-3 py-12 sm:px-4 sm:py-16 md:px-8 md:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 grid gap-4 sm:mb-10 sm:gap-5 md:mb-14 md:grid-cols-[1fr_0.8fr] md:items-end">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#789b5e] sm:text-[11px] sm:tracking-[0.25em]">Bảng dịch vụ</p>
                <h2 className="mt-3 font-serif text-[2.25rem] leading-tight tracking-[-0.02em] sm:mt-4 sm:text-4xl md:text-5xl">Chọn khoảng nghỉ của bạn</h2>
              </div>
              <p className="text-sm font-normal leading-7 text-[#5d6d56] md:text-right">Thời lượng và mức giá được hiển thị để bạn dễ lựa chọn. Mombi sẽ tư vấn lại trước khi bắt đầu liệu trình.</p>
            </div>

            <div className="grid gap-3 sm:gap-4 lg:grid-cols-2">
              {content.services.map((service, index) => (
                <article key={service.title} className="group rounded-2xl border border-[#e0e7db] bg-[#fbfcf9] p-4 transition hover:border-[#b8cba9] hover:bg-[#f4f8f0] sm:p-5 md:p-7">
                  <div className="flex gap-3 sm:gap-4">
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#e5eee0] text-[10px] font-semibold text-[#6d9154] sm:mt-1 sm:h-8 sm:w-8 sm:text-[11px]">{String(index + 1).padStart(2, '0')}</span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-1.5 border-b border-[#e3e9df] pb-3 sm:flex-row sm:items-start sm:justify-between sm:gap-2 sm:pb-4">
                        <h3 className="font-serif text-lg leading-snug text-[#2a3923] sm:text-xl md:text-2xl">{service.title}</h3>
                        <p className="shrink-0 text-sm font-semibold text-[#6f9455]">{service.price}</p>
                      </div>
                      <p className="mt-3 line-clamp-2 text-[13px] font-normal leading-6 text-[#5c6c55] sm:mt-4 sm:text-sm">{service.desc}</p>
                      <p className="mt-3 inline-flex rounded-full bg-white px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.1em] text-[#718069] sm:mt-4 sm:text-[11px] sm:tracking-[0.12em]">{service.time}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {relatedArticles.length > 0 && (
          <section className="bg-[#edf3e8] px-3 py-10 sm:px-4 sm:py-14 md:px-8 md:py-20" aria-labelledby="service-guides-title">
            <div className="mx-auto max-w-7xl">
              <div className="mb-7 flex flex-col items-start justify-between gap-4 sm:mb-9 sm:gap-5 md:flex-row md:items-end">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#789b5e] sm:text-[11px] sm:tracking-[0.25em]">Chuyện nhà Mombi</p>
                  <h2 id="service-guides-title" className="mt-3 font-serif text-[2rem] leading-tight tracking-[-0.02em] sm:mt-4 sm:text-3xl md:text-5xl">Đọc thêm trước khi chọn liệu trình</h2>
                </div>
                <Link href="/chuyen-nha" className="inline-flex min-h-11 items-center text-[11px] font-semibold uppercase tracking-[0.12em] text-[#688b50] transition hover:text-[#4f7138] sm:text-xs sm:tracking-[0.14em]">Xem tất cả bài viết <span className="ml-2" aria-hidden="true">→</span></Link>
              </div>
              <div className="no-scrollbar -mx-3 flex snap-x snap-mandatory gap-4 overflow-x-auto px-3 pb-2 sm:-mx-4 sm:px-4 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0 md:pb-0">
                {relatedArticles.map((article) => (
                  <article key={article._id} className="min-w-[82vw] snap-center rounded-2xl border border-[#d7e2d0] bg-white p-5 sm:min-w-[70vw] sm:p-6 md:min-w-0 md:p-7">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#82a36b]">Cẩm nang Mombi</p>
                    <h3 className="mt-4 font-serif text-2xl leading-snug text-[#2a3923]">
                      <Link href={`/chuyen-nha/${article.slug}`} className="transition hover:text-[#66894e]">{article.title}</Link>
                    </h3>
                    {article.excerpt && <p className="mt-4 line-clamp-3 text-sm font-light leading-7 text-[#64725d]">{article.excerpt}</p>}
                    <Link href={`/chuyen-nha/${article.slug}`} className="mt-4 inline-flex min-h-11 items-center text-[11px] font-semibold uppercase tracking-[0.12em] text-[#6d8f55] sm:mt-6 sm:tracking-[0.14em]">Đọc bài viết <span className="ml-2" aria-hidden="true">→</span></Link>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="px-3 py-10 sm:px-4 sm:py-14 md:px-8 md:py-20">
          <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-5 rounded-[1.5rem] bg-[#26351f] px-6 py-8 text-white sm:gap-6 sm:rounded-[1.75rem] sm:px-7 sm:py-10 md:flex-row md:items-center md:px-12">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#b8d1a7] sm:text-[11px] sm:tracking-[0.22em]">Một lựa chọn khác</p>
              <h2 className="mt-3 font-serif text-[1.75rem] leading-tight sm:text-3xl md:text-4xl">{content.otherLabel}</h2>
            </div>
            <Link href={content.otherHref} className="inline-flex min-h-11 items-center rounded-full border border-white/35 px-5 text-[11px] font-semibold uppercase tracking-[0.12em] transition hover:bg-white hover:text-[#26351f] sm:px-6 sm:text-xs sm:tracking-[0.14em]">Xem dịch vụ <span className="ml-2" aria-hidden="true">→</span></Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
