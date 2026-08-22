import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2026-08-01'})

const pexelsImage = (id) => ({
  id: String(id),
  imageUrl: `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1600`,
  sourceUrl: `https://www.pexels.com/photo/${id}/`,
})

const assignments = [
  {
    slug: 'spa-gan-day-tai-buon-ma-thuot-chon-theo-nhu-cau',
    alt: 'Không gian spa yên tĩnh với giường massage, khăn và nến thư giãn',
    ...pexelsImage(35884502),
  },
  {
    slug: 'spa-co-cho-dau-o-to-tai-buon-ma-thuot',
    alt: 'Không gian spa thư giãn với khăn cuộn, nến và vật dụng chăm sóc cơ thể',
    ...pexelsImage(374071),
  },
  {
    slug: 'spa-cho-nam-tai-buon-ma-thuot-lan-dau-nen-chon-gi',
    alt: 'Khăn sạch và nến thơm được chuẩn bị cho một buổi chăm sóc tại spa',
    ...pexelsImage(6186752),
  },
  {
    slug: 'lan-dau-di-spa-can-chuan-bi-gi',
    alt: 'Khăn mềm, nến thơm và hoa khô trong không gian chăm sóc thư giãn',
    ...pexelsImage(7795820),
  },
  {
    slug: 'massage-body-buon-ma-thuot-gia-va-thoi-luong',
    alt: 'Kỹ thuật viên thực hiện massage thư giãn trong phòng spa ấm áp',
    ...pexelsImage(6663366),
  },
  {
    slug: 'massage-sau-gio-lam-tai-buon-ma-thuot',
    alt: 'Buổi massage nhẹ nhàng giúp cơ thể thư giãn sau giờ làm việc',
    ...pexelsImage(3865566),
  },
  {
    slug: 'massage-chan-tai-buon-ma-thuot-45-hay-60-phut',
    alt: 'Đôi bàn tay kỹ thuật viên thực hiện massage chân thư giãn',
    ...pexelsImage(9146383),
  },
  {
    slug: 'massage-body-hay-co-vai-gay-nen-chon-loai-nao',
    alt: 'Khách hàng thư giãn khi được massage vùng đầu và cổ vai',
    ...pexelsImage(3760270),
  },
  {
    slug: 'massage-luc-manh-hay-nhe-phu-hop-hon',
    alt: 'Kỹ thuật viên điều chỉnh thao tác massage theo cảm nhận của khách hàng',
    ...pexelsImage(5659011),
  },
  {
    slug: 'sau-khi-massage-nen-lam-gi',
    alt: 'Massage chân nhẹ nhàng trong không gian spa có ánh sáng dịu',
    ...pexelsImage(5240642),
  },
  {
    slug: 'goi-dau-duong-sinh-buon-ma-thuot-gia-bao-nhieu',
    alt: 'Khách hàng thư giãn trong liệu trình chăm sóc và massage vùng đầu',
    ...pexelsImage(5659007),
  },
  {
    slug: 'goi-dau-sach-va-goi-dau-duong-sinh-khac-nhau-the-nao',
    alt: 'Liệu trình chăm sóc vùng đầu kết hợp thao tác thư giãn nhẹ nhàng',
    ...pexelsImage(21047467),
  },
  {
    slug: 'da-dau-nhay-cam-co-nen-goi-duong-sinh',
    alt: 'Sản phẩm dưỡng dạng serum đặt trên lá xanh trong không gian tự nhiên',
    ...pexelsImage(8490222),
  },
  {
    slug: 'cham-soc-da-mua-kho-tai-buon-ma-thuot',
    alt: 'Chai serum dưỡng ẩm bên cạnh lá xanh phù hợp chăm sóc da mùa khô',
    ...pexelsImage(1502209),
  },
  {
    slug: 'da-nhay-cam-di-spa-can-luu-y-gi',
    alt: 'Sản phẩm chăm sóc da dịu nhẹ giữa nền cây xanh tự nhiên',
    ...pexelsImage(15569179),
  },
  {
    slug: 'cham-soc-da-co-ban-hay-chuyen-sau',
    alt: 'Chai tinh chất và ống nhỏ giọt dùng trong quy trình chăm sóc da',
    ...pexelsImage(7796380),
  },
  {
    slug: 'mun-dau-den-va-soi-ba-nhon-khac-nhau-the-nao',
    alt: 'Tinh chất chăm sóc da với thành phần thực vật và lá xanh',
    ...pexelsImage(12602360),
  },
  {
    slug: 'massage-mat-thu-gian-tai-buon-ma-thuot',
    alt: 'Khách hàng được massage mặt nhẹ nhàng trong không gian spa',
    ...pexelsImage(31914689),
  },
  {
    slug: 'spa-mo-cua-buoi-toi-tai-buon-ma-thuot',
    alt: 'Không gian spa buổi tối ấm cúng với nến và khăn sạch',
    ...pexelsImage(7795820),
  },
  {
    slug: 'spa-cuoi-tuan-tai-buon-ma-thuot-dat-lich-the-nao',
    alt: 'Khách hàng tận hưởng buổi massage chân thư giãn vào cuối tuần',
    ...pexelsImage(33723110),
  },
  {
    slug: 'massage-cho-nguoi-lai-xe-nhieu-tai-buon-ma-thuot',
    alt: 'Người lái xe di chuyển trong thành phố và cần thư giãn sau hành trình',
    ...pexelsImage(20328878),
  },
]

// One photo was initially a good thematic fit for two articles. Replace the duplicate
// with another calm spa image so every SEO article has a genuinely unique hero asset.
assignments[18] = {
  ...assignments[18],
  ...pexelsImage(6187855),
  alt: 'Thao tác massage chân cận cảnh trong không gian spa yên tĩnh buổi tối',
}

const articleSlugs = assignments.map(({slug}) => slug)
const articles = await client.fetch(
  `*[_type == "article" && !(_id in path("drafts.**")) && slug.current in $slugs]{_id, "slug": slug.current}`,
  {slugs: articleSlugs},
)
const articleBySlug = new Map(articles.map((article) => [article.slug, article]))

const missing = articleSlugs.filter((slug) => !articleBySlug.has(slug))
if (missing.length) throw new Error(`Không tìm thấy bài viết: ${missing.join(', ')}`)

for (const assignment of assignments) {
  const filename = `pexels-${assignment.id}.jpg`
  let assetId = await client.fetch(
    `*[_type == "sanity.imageAsset" && originalFilename == $filename][0]._id`,
    {filename},
  )

  if (!assetId) {
    const response = await fetch(assignment.imageUrl)
    if (!response.ok) throw new Error(`Không tải được ảnh ${assignment.id}: ${response.status}`)

    const asset = await client.assets.upload('image', Buffer.from(await response.arrayBuffer()), {
      filename,
      title: assignment.alt,
      description: `Ảnh minh họa từ Pexels: ${assignment.sourceUrl}`,
      source: {
        id: `pexels-${assignment.id}`,
        name: 'Pexels',
        url: assignment.sourceUrl,
      },
    })
    assetId = asset._id
    console.log(`Đã tải ảnh Pexels ${assignment.id} lên Sanity CDN`)
  } else {
    console.log(`Dùng lại asset đã tải: ${assignment.id}`)
  }

  const article = articleBySlug.get(assignment.slug)
  await client
    .patch(article._id)
    .set({
      mainImage: {
        _type: 'image',
        asset: {_type: 'reference', _ref: assetId},
        alt: assignment.alt,
        crop: {_type: 'sanity.imageCrop', top: 0, bottom: 0, left: 0, right: 0},
        hotspot: {_type: 'sanity.imageHotspot', x: 0.5, y: 0.5, height: 1, width: 1},
      },
    })
    .commit()
  console.log(`Đã cập nhật: ${assignment.slug}`)
}

const audit = await client.fetch(
  `{
    "articles": count(*[_type == "article" && !(_id in path("drafts.**"))]),
    "allDistinctImages": count(array::unique(*[_type == "article" && !(_id in path("drafts.**"))].mainImage.asset._ref)),
    "seoArticles": count(*[_type == "article" && !(_id in path("drafts.**")) && slug.current in $slugs]),
    "distinctImages": count(array::unique(*[_type == "article" && !(_id in path("drafts.**")) && slug.current in $slugs].mainImage.asset._ref)),
    "missingImage": *[_type == "article" && !(_id in path("drafts.**")) && slug.current in $slugs && !defined(mainImage.asset._ref)].slug.current,
    "missingAlt": *[_type == "article" && !(_id in path("drafts.**")) && slug.current in $slugs && !defined(mainImage.alt)].slug.current
  }`,
  {slugs: articleSlugs},
)

console.log('Kiểm tra sau cập nhật:', JSON.stringify(audit, null, 2))
