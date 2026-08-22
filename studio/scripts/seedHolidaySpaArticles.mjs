import {createHash} from 'node:crypto'
import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2026-08-01'})

const key = (value) => createHash('sha1').update(value).digest('hex').slice(0, 12)
const span = (text, marks = []) => ({_type: 'span', _key: key(`${text}-${marks.join('-')}`), text, marks})
const block = (seed, text, style = 'normal') => ({
  _type: 'block',
  _key: key(seed),
  style,
  markDefs: [],
  children: [span(text)],
})
const listItem = (seed, text) => ({...block(seed, text), listItem: 'bullet', level: 1})
const linkBlock = (seed, before, label, href, after = '') => {
  const markKey = key(`${seed}-link`)
  return {
    _type: 'block',
    _key: key(seed),
    style: 'normal',
    markDefs: [{_type: 'link', _key: markKey, href}],
    children: [span(before), span(label, [markKey]), span(after)],
  }
}

const pexelsImage = (id) => ({
  id: String(id),
  imageUrl: `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&fit=crop`,
  sourceUrl: `https://www.pexels.com/photo/${id}/`,
})

const articles = [
  {
    slug: 'spa-bmt-dip-le-2-9-2026-nen-dat-lich-khi-nao',
    title: 'Spa BMT dịp lễ 2/9/2026: Nên đặt lịch khi nào?',
    excerpt: 'Gợi ý chọn thời điểm, liệu trình và cách xác nhận lịch spa tại Buôn Ma Thuột trong kỳ nghỉ Quốc khánh 2/9/2026 để buổi thư giãn diễn ra chủ động hơn.',
    seoTitle: 'Spa BMT dịp lễ 2/9/2026: Kinh nghiệm đặt lịch',
    seoDescription: 'Tìm spa BMT dịp lễ 2/9? Xem cách chọn khung giờ, thời lượng massage, gội đầu hoặc chăm sóc da và lưu ý xác nhận lịch tại Mombi Care Spa.',
    focusKeyword: 'spa BMT dịp lễ 2/9',
    publishedAt: '2026-08-22',
    alt: 'Cờ Việt Nam trang trí trên phố trong dịp lễ Quốc khánh 2/9',
    eventHref: '/uu-dai-su-kien/quoc-khanh-2-9-2026',
    eventLabel: 'xem hướng dẫn lên lịch dịp Quốc khánh 2/9',
    serviceHref: '/dich-vu/massage-thu-gian',
    serviceLabel: 'tham khảo các liệu trình massage và gội đầu',
    ...pexelsImage(31528994),
    intro: [
      'Kỳ nghỉ Quốc khánh thường là lúc nhiều người về Buôn Ma Thuột, gặp gỡ gia đình hoặc tranh thủ nghỉ ngơi sau những ngày di chuyển. Nếu đang tìm spa BMT dịp lễ 2/9, bạn nên bắt đầu từ quỹ thời gian thực tế thay vì chọn liệu trình chỉ vì tên gọi hấp dẫn.',
      'Mombi Care Spa phục vụ tại 34 Trần Khánh Dư, Buôn Ma Thuột. Lịch ngày lễ có thể khác ngày thường, vì vậy việc nhắn trước để xác nhận giờ mở cửa, chỗ trống và thời lượng dịch vụ sẽ giúp bạn tránh phải chờ lâu hoặc thay đổi lịch trình vào phút cuối.',
    ],
    sections: [
      {heading: 'Khung giờ nào thường dễ sắp xếp hơn?', paragraphs: ['Cuối chiều và buổi tối thường được nhiều khách lựa chọn vì thuận tiện sau khi đi chơi hoặc dùng bữa cùng gia đình. Nếu lịch nghỉ linh hoạt, bạn có thể hỏi khung giờ buổi sáng hoặc đầu giờ chiều để có nhiều lựa chọn hơn. Spa chỉ giữ chỗ sau khi hai bên đã xác nhận trực tiếp.'], bullets: ['Gửi ngày, giờ mong muốn và số người khi nhắn đặt lịch', 'Đến sớm khoảng 10 phút nếu đây là lần đầu ghé Mombi', 'Báo trước nếu cần chỗ đậu ô tô hoặc đi theo nhóm']},
      {heading: 'Chọn dịch vụ theo lịch trình ngày lễ', paragraphs: ['Gội đầu dưỡng sinh hoặc massage cổ vai gáy phù hợp khi bạn chỉ có một khoảng trống ngắn. Massage body 60–90 phút thích hợp khi muốn dành riêng một buổi để nghỉ ngơi. Chăm sóc da nên được lựa chọn theo tình trạng da thực tế, nhất là khi bạn có lịch chụp ảnh hoặc dự tiệc trong kỳ nghỉ.']},
      {heading: 'Sau chuyến đi dài nên lưu ý điều gì?', paragraphs: ['Nếu vừa lái xe hoặc ngồi xe nhiều giờ, hãy nói rõ vùng cơ thể đang mỏi và mức lực bạn cảm thấy dễ chịu. Massage tại spa là dịch vụ thư giãn, không thay thế thăm khám khi có đau kéo dài, chấn thương, sưng hoặc triệu chứng bất thường.'], bullets: ['Không ăn quá no ngay trước buổi massage', 'Uống nước vừa đủ và dành thời gian nghỉ sau liệu trình', 'Thông báo tình trạng sức khỏe hoặc vùng cần tránh tác động']},
      {heading: 'Cách đặt lịch spa dịp 2/9 tại Buôn Ma Thuột', paragraphs: ['Bạn có thể gọi hoặc nhắn Zalo 0934 250 909, gửi khung giờ dự kiến và dịch vụ quan tâm. Nhân viên sẽ kiểm tra lịch thực tế, tư vấn thời lượng phù hợp và xác nhận trước khi bạn di chuyển đến spa.']},
    ],
  },
  {
    slug: 'trung-thu-2026-di-spa-bmt-cung-nguoi-than',
    title: 'Trung thu 2026: Đi spa BMT cùng người thân có gì phù hợp?',
    excerpt: 'Một gợi ý nhẹ nhàng cho Trung thu tại Buôn Ma Thuột: cùng người thân chọn massage, gội đầu dưỡng sinh hoặc chăm sóc da theo sở thích và quỹ thời gian.',
    seoTitle: 'Trung thu 2026 đi spa BMT cùng người thân',
    seoDescription: 'Gợi ý lịch đi spa BMT dịp Trung thu 2026 cùng mẹ, chị em hoặc bạn bè; cách chọn massage, gội đầu dưỡng sinh và thời điểm đặt lịch.',
    focusKeyword: 'spa BMT Trung thu 2026',
    publishedAt: '2026-08-21',
    alt: 'Đèn ông sao và lồng đèn truyền thống Việt Nam trong đêm Trung thu',
    eventHref: '/uu-dai-su-kien/trung-thu-2026',
    eventLabel: 'xem gợi ý quà chăm sóc dịp Trung thu 2026',
    serviceHref: '/dich-vu',
    serviceLabel: 'xem toàn bộ dịch vụ tại Mombi Care Spa',
    ...pexelsImage(33896638),
    intro: [
      'Trung thu không chỉ là dịp dành cho trẻ nhỏ. Với nhiều gia đình, đây còn là thời điểm để trở về, ăn một bữa cơm cùng nhau và dành sự quan tâm cho cha mẹ hoặc người thân. Một buổi spa tại BMT có thể trở thành phần nghỉ ngơi nhẹ nhàng trước hoặc sau cuộc gặp mặt.',
      'Điều quan trọng không phải chọn gói dài nhất mà là chọn trải nghiệm khiến người đi cùng cảm thấy thoải mái. Hãy hỏi trước về sở thích, tình trạng sức khỏe và thời gian rảnh thay vì tự quyết định toàn bộ liệu trình cho người nhận.',
    ],
    sections: [
      {heading: 'Gợi ý cho mẹ hoặc người lớn tuổi', paragraphs: ['Một buổi gội đầu dưỡng sinh với nhịp chậm hoặc massage cổ vai gáy mức lực vừa phải thường dễ tiếp cận. Người đặt lịch nên thông báo trước các vấn đề sức khỏe, vùng đau, chấn thương cũ hoặc tình trạng cần tránh tác động để spa tư vấn trong phạm vi dịch vụ.']},
      {heading: 'Đi cùng chị em hoặc bạn bè', paragraphs: ['Bạn có thể chọn hai khung giờ gần nhau và dành phần còn lại của ngày cho bữa ăn hoặc dạo phố. Khả năng phục vụ đồng thời phụ thuộc lịch kỹ thuật viên, do đó hãy gửi số người và dịch vụ mong muốn khi liên hệ.'], bullets: ['Massage body nếu muốn có khoảng nghỉ dài', 'Gội đầu dưỡng sinh khi cần lịch gọn và nhẹ nhàng', 'Chăm sóc da khi đã biết nhu cầu và độ nhạy cảm của da']},
      {heading: 'Có nên mua liệu trình làm quà?', paragraphs: ['Nếu chưa chắc người nhận thích massage hay chăm sóc da, một lời mời đi cùng và quyền tự chọn dịch vụ thường tinh tế hơn. Cách này cũng tránh chọn sai mức lực massage, thời lượng hoặc quy trình da không phù hợp.']},
      {heading: 'Đặt lịch trước cuối tuần Trung thu', paragraphs: ['Trung thu 2026 rơi vào thứ Sáu, nên buổi tối và cuối tuần liền sau có thể được hỏi sớm. Hãy liên hệ Mombi qua hotline hoặc Zalo 0934 250 909 để kiểm tra giờ phục vụ và chỗ trống thực tế.']},
    ],
  },
  {
    slug: 'qua-20-10-spa-bmt-chon-lieu-trinh-nao',
    title: 'Quà 20/10 tại spa BMT: Chọn liệu trình nào cho người nhận?',
    excerpt: 'Cách chọn một buổi chăm sóc làm quà 20/10 tại Buôn Ma Thuột dựa trên sở thích, thời gian và nhu cầu thực tế của mẹ, vợ, người yêu hoặc đồng nghiệp.',
    seoTitle: 'Quà 20/10 tại spa BMT: Chọn liệu trình phù hợp',
    seoDescription: 'Tìm quà 20/10 tại spa BMT? Tham khảo cách chọn massage, gội đầu dưỡng sinh hoặc chăm sóc da phù hợp cho người nhận tại Mombi Care Spa.',
    focusKeyword: 'quà 20/10 spa BMT',
    publishedAt: '2026-08-20',
    alt: 'Người phụ nữ thư giãn sau chăm sóc da và cầm bó hoa tulip',
    eventHref: '/uu-dai-su-kien/ngay-phu-nu-viet-nam-20-10-2026',
    eventLabel: 'xem gợi ý quà 20/10 tại Buôn Ma Thuột',
    serviceHref: '/dich-vu',
    serviceLabel: 'tham khảo dịch vụ và thời lượng tại Mombi',
    ...pexelsImage(5938440),
    intro: [
      'Hoa và lời chúc vẫn luôn ý nghĩa trong ngày 20/10. Nếu muốn món quà có thêm một khoảng nghỉ thật sự, bạn có thể mời người nhận đến spa và để họ chủ động chọn trải nghiệm phù hợp. Đây là cách giảm rủi ro chọn sai liệu trình, đặc biệt với chăm sóc da hoặc massage.',
      'Mombi Care Spa tại Buôn Ma Thuột có các nhóm dịch vụ massage thư giãn, gội đầu dưỡng sinh và chăm sóc da. Mỗi nhóm phù hợp với một nhu cầu khác nhau, vì vậy nên ưu tiên cảm nhận của người nhận hơn giá trị hoặc độ dài của gói.',
    ],
    sections: [
      {heading: 'Tặng mẹ: ưu tiên nhẹ nhàng và dễ sắp xếp', paragraphs: ['Gội đầu dưỡng sinh hoặc massage cổ vai gáy có thời lượng vừa phải, phù hợp khi mẹ không muốn dành cả buổi ở spa. Hãy để mẹ tự chọn khung giờ và nói rõ mức lực dễ chịu với kỹ thuật viên.']},
      {heading: 'Tặng vợ hoặc người yêu: hỏi trước sở thích', paragraphs: ['Nếu người nhận thường chăm sóc da, bạn có thể gợi ý một buổi chăm sóc cơ bản và để spa tư vấn sau khi quan sát da. Nếu họ thích nghỉ ngơi hơn, massage body hoặc gội đầu dưỡng sinh có thể phù hợp hơn. Không nên hứa hẹn hiệu quả da tuyệt đối hay chọn quy trình chuyên sâu khi chưa biết tình trạng thực tế.']},
      {heading: 'Tặng đồng nghiệp: giữ món quà lịch sự và linh hoạt', paragraphs: ['Một lời mời sử dụng dịch vụ với quyền tự chọn thời gian sẽ tạo cảm giác thoải mái hơn việc ấn định sẵn liệu trình cá nhân. Cũng nên cân nhắc quy định nhận quà tại nơi làm việc và giữ thông điệp chúc mừng ngắn gọn, chân thành.']},
      {heading: 'Đặt lịch 20/10 khi nào?', paragraphs: ['20/10/2026 rơi vào thứ Ba nên các khung giờ sau giờ làm và cuối tuần liền trước có thể được quan tâm nhiều. Bạn nên nhắn Mombi sớm khi đã biết ngày, giờ và số người; lịch chỉ được xác nhận sau khi spa phản hồi chỗ trống thực tế.'], bullets: ['Gửi tên dịch vụ hoặc khoảng thời gian mong muốn', 'Cho người nhận quyền đổi khung giờ nếu cần', 'Xác nhận lại giờ phục vụ trước khi đến']},
    ],
  },
  {
    slug: 'qua-20-11-spa-bmt-goi-y-cho-thay-co',
    title: 'Quà 20/11 tại spa BMT: Gợi ý tinh tế dành cho thầy cô',
    excerpt: 'Gợi ý tặng thầy cô một khoảng thời gian nghỉ ngơi dịp 20/11 tại Buôn Ma Thuột, cùng những lưu ý để món quà spa lịch sự, linh hoạt và phù hợp.',
    seoTitle: 'Quà 20/11 tại spa BMT dành cho thầy cô',
    seoDescription: 'Gợi ý quà 20/11 tại spa BMT: massage, gội đầu hoặc chăm sóc da với lịch linh hoạt, phù hợp làm lời cảm ơn dành cho thầy cô ở Buôn Ma Thuột.',
    focusKeyword: 'quà 20/11 spa BMT',
    publishedAt: '2026-08-19',
    alt: 'Bộ quà chăm sóc thư giãn gồm muối tắm, cốc và thanh lăn mặt',
    eventHref: '/uu-dai-su-kien/ngay-nha-giao-viet-nam-20-11-2026',
    eventLabel: 'xem hướng dẫn chọn quà spa dịp 20/11',
    serviceHref: '/dich-vu',
    serviceLabel: 'xem các dịch vụ thư giãn tại Mombi',
    ...pexelsImage(17555294),
    intro: [
      'Một món quà 20/11 phù hợp không cần cầu kỳ; điều quan trọng là sự trân trọng và quyền thoải mái lựa chọn của người nhận. Nếu thầy cô yêu thích chăm sóc cá nhân, một buổi thư giãn tại spa BMT có thể là gợi ý thiết thực sau thời gian giảng dạy bận rộn.',
      'Vì sở thích massage, tình trạng da và lịch làm việc của mỗi người khác nhau, bạn không nên chọn thay mọi chi tiết. Hãy để người nhận chủ động quyết định dịch vụ và thời gian trong phạm vi spa có thể phục vụ.',
    ],
    sections: [
      {heading: 'Dịch vụ nào dễ làm quà?', paragraphs: ['Gội đầu dưỡng sinh phù hợp với người thích trải nghiệm nhẹ nhàng. Massage cổ vai gáy hoặc massage body dành cho người muốn nghỉ ngơi sâu hơn, nhưng mức lực phải được trao đổi trực tiếp. Chăm sóc da phù hợp khi người nhận đã quan tâm đến skincare và có thể dành thời gian tư vấn trước buổi làm.']},
      {heading: 'Tôn trọng quy định nhận quà', paragraphs: ['Trước khi chuẩn bị, phụ huynh hoặc học sinh nên lưu ý quy định của trường và cơ quan nơi thầy cô công tác. Một lời chúc viết tay hoặc tin nhắn chân thành đi kèm lời mời trải nghiệm thường đủ ý nghĩa mà không tạo áp lực cho người nhận.']},
      {heading: 'Không ấn định lịch đúng ngày 20/11', paragraphs: ['Ngày Nhà giáo Việt Nam thường có nhiều hoạt động ở trường, vì vậy một lịch linh hoạt trong những ngày sau đó thực tế hơn. Người nhận có thể liên hệ trực tiếp Mombi để chọn khung giờ, đồng thời trao đổi tình trạng sức khỏe hoặc nhu cầu riêng tư.']},
      {heading: 'Thông tin cần gửi khi hỏi lịch', paragraphs: ['Khi liên hệ hotline hoặc Zalo 0934 250 909, bạn có thể cho biết đây là quà tặng, nhóm dịch vụ dự kiến và khoảng thời gian người nhận thuận tiện. Mombi sẽ kiểm tra khả năng phục vụ thực tế trước khi xác nhận.'], bullets: ['Không tự chọn mức lực massage thay người nhận', 'Không đưa ra cam kết điều trị hoặc hiệu quả tuyệt đối', 'Ưu tiên lịch linh hoạt và thông tin rõ ràng']},
    ],
  },
  {
    slug: 'giang-sinh-2026-di-spa-bmt-cung-ban-be',
    title: 'Giáng sinh 2026: Đi spa BMT cùng bạn bè thế nào cho vui?',
    excerpt: 'Gợi ý sắp xếp một buổi spa tại Buôn Ma Thuột cùng bạn bè hoặc người thân trong mùa Giáng sinh 2026, từ chọn dịch vụ đến xác nhận lịch nhóm.',
    seoTitle: 'Giáng sinh 2026: Đi spa BMT cùng bạn bè',
    seoDescription: 'Lên lịch đi spa BMT dịp Giáng sinh 2026 cùng bạn bè: chọn massage, gội đầu, chăm sóc da và cách xác nhận khung giờ nhóm tại Mombi Care Spa.',
    focusKeyword: 'spa BMT Giáng sinh 2026',
    publishedAt: '2026-08-18',
    alt: 'Hộp quà, nến và cành thông trong không gian Giáng sinh ấm áp',
    eventHref: '/uu-dai-su-kien/giang-sinh-2026',
    eventLabel: 'xem gợi ý lịch spa mùa Giáng sinh 2026',
    serviceHref: '/dich-vu',
    serviceLabel: 'chọn dịch vụ cho buổi hẹn tại Mombi',
    ...pexelsImage(35279896),
    intro: [
      'Mùa Giáng sinh thường có nhiều buổi gặp gỡ, chụp ảnh và tiệc cuối năm. Thay vì xếp thêm một lịch trình náo nhiệt, nhóm bạn có thể dành một khoảng thời gian chậm hơn tại spa BMT rồi cùng nhau dùng bữa hoặc dạo phố.',
      'Mỗi người không nhất thiết phải chọn cùng một liệu trình. Điều cần thống nhất là ngày, khoảng thời gian và số người để spa kiểm tra kỹ thuật viên, phòng dịch vụ và khả năng sắp xếp các khung giờ gần nhau.',
    ],
    sections: [
      {heading: 'Nhóm bạn nên chọn dịch vụ thế nào?', paragraphs: ['Người muốn thư giãn toàn thân có thể chọn massage body; người cần lịch ngắn hơn có thể chọn massage cổ vai gáy hoặc gội đầu dưỡng sinh. Chăm sóc da nên được tư vấn riêng theo da mỗi người, không nên dùng một quy trình giống nhau cho cả nhóm.']},
      {heading: 'Đặt lịch nhóm cần báo những gì?', paragraphs: ['Hãy gửi số người, dịch vụ dự kiến, thời lượng và hai khung giờ có thể thay thế. Nếu muốn được phục vụ gần nhau, cần nói rõ ngay từ đầu vì khả năng sắp xếp phụ thuộc lịch kỹ thuật viên thực tế.'], bullets: ['Chốt số người trước khi đặt', 'Chuẩn bị một khung giờ dự phòng', 'Báo sớm nếu có người lần đầu đi spa', 'Đến đúng giờ để không ảnh hưởng lượt sau']},
      {heading: 'Chăm sóc da trước tiệc Giáng sinh', paragraphs: ['Nếu có kế hoạch chụp ảnh hoặc dự tiệc, hãy tránh thử quá nhiều sản phẩm hay quy trình mới sát giờ. Người có da nhạy cảm nên nói rõ tiền sử kích ứng và chọn chăm sóc nhẹ nhàng theo tư vấn, thay vì chạy theo mong muốn thay đổi nhanh.']},
      {heading: 'Xác nhận lịch phục vụ dịp cuối năm', paragraphs: ['Ngày 24–25/12 không phải lịch phục vụ mặc định giống ngày thường. Bạn nên liên hệ Mombi Care Spa qua 0934 250 909 để kiểm tra giờ mở cửa và chỗ trống trước khi đến.']},
    ],
  },
  {
    slug: 'tet-duong-lich-2027-spa-bmt-lich-thu-gian',
    title: 'Tết Dương lịch 2027: Lên lịch thư giãn tại spa BMT',
    excerpt: 'Gợi ý bắt đầu năm 2027 bằng một buổi massage, gội đầu dưỡng sinh hoặc chăm sóc da tại Buôn Ma Thuột với lịch trình vừa sức và dễ duy trì.',
    seoTitle: 'Tết Dương lịch 2027: Lịch thư giãn tại spa BMT',
    seoDescription: 'Gợi ý đi spa BMT dịp Tết Dương lịch 2027: cách chọn thời lượng massage, gội đầu hoặc chăm sóc da và xác nhận giờ phục vụ tại Mombi.',
    focusKeyword: 'spa BMT Tết Dương lịch 2027',
    publishedAt: '2026-08-17',
    alt: 'Người phụ nữ thư giãn tại spa với nến và sản phẩm chăm sóc cơ thể',
    eventHref: '/uu-dai-su-kien/tet-duong-lich-2027',
    eventLabel: 'xem kế hoạch đi spa dịp Tết Dương lịch 2027',
    serviceHref: '/dich-vu',
    serviceLabel: 'tham khảo dịch vụ và bảng thời lượng',
    ...pexelsImage(32729950),
    intro: [
      'Ngày đầu năm thường đi kèm mong muốn bắt đầu một thói quen mới. Tuy nhiên, chăm sóc bản thân không cần trở thành một mục tiêu gây áp lực. Một buổi spa vừa đủ, phù hợp lịch sinh hoạt và ngân sách sẽ thực tế hơn việc cố chọn liệu trình dài nhất.',
      'Nếu đang tìm spa BMT dịp Tết Dương lịch 2027, bạn nên xác nhận lịch phục vụ trước khi đến. Giờ mở cửa ngày lễ có thể thay đổi và các khung giờ sau kỳ nghỉ đêm giao thừa thường phụ thuộc lượng khách thực tế.',
    ],
    sections: [
      {heading: 'Chọn buổi sáng hay chiều ngày đầu năm?', paragraphs: ['Nếu thức khuya đón năm mới, hãy ưu tiên ngủ đủ và ăn uống bình thường trước khi đến spa. Buổi chiều có thể dễ chịu hơn với người cần phục hồi nhịp sinh hoạt; còn buổi sáng phù hợp khi bạn đã nghỉ ngơi đầy đủ và muốn giữ phần còn lại của ngày cho gia đình.']},
      {heading: 'Một liệu trình vừa sức là đủ', paragraphs: ['Massage body phù hợp với người muốn dành thời gian nghỉ liền mạch. Gội đầu dưỡng sinh hoặc massage cổ vai gáy dễ sắp xếp hơn trong lịch gia đình. Chăm sóc da cơ bản nên tập trung vào sự dễ chịu và hàng rào da, không cần đặt mục tiêu thay đổi tức thời cho ngày đầu năm.'], bullets: ['45–60 phút cho một lịch trình gọn', '60–70 phút nếu muốn kết hợp làm sạch và thư giãn', '90 phút khi có đủ thời gian nghỉ trước và sau buổi massage']},
      {heading: 'Đặt một nhịp chăm sóc có thể duy trì', paragraphs: ['Thay vì mua ngay liệu trình dài hạn, bạn có thể bắt đầu bằng một buổi đơn lẻ, theo dõi cảm nhận và điều chỉnh tần suất theo nhu cầu. Nghỉ ngơi, vận động nhẹ, ngủ đủ và chăm sóc tại nhà vẫn là nền tảng của một nhịp sống cân bằng.']},
      {heading: 'Liên hệ trước khi đến Mombi', paragraphs: ['Mombi Care Spa ở 34 Trần Khánh Dư, Buôn Ma Thuột. Bạn có thể gọi hoặc nhắn Zalo 0934 250 909 để hỏi giờ phục vụ ngày 01/01/2027, chỗ trống, chỗ đậu xe và dịch vụ phù hợp trước khi di chuyển.']},
    ],
  },
]

function toPortableText(article) {
  const body = []
  article.intro.forEach((text, index) => body.push(block(`${article.slug}-intro-${index}`, text)))
  article.sections.forEach((section, sectionIndex) => {
    body.push(block(`${article.slug}-heading-${sectionIndex}`, section.heading, 'h2'))
    section.paragraphs?.forEach((text, index) =>
      body.push(block(`${article.slug}-section-${sectionIndex}-p-${index}`, text)),
    )
    section.bullets?.forEach((text, index) =>
      body.push(listItem(`${article.slug}-section-${sectionIndex}-li-${index}`, text)),
    )
  })
  body.push(
    linkBlock(`${article.slug}-event-link`, 'Bạn có thể ', article.eventLabel, article.eventHref, '.'),
    linkBlock(
      `${article.slug}-service-link`,
      'Trước khi đặt lịch, hãy ',
      article.serviceLabel,
      article.serviceHref,
      '.',
    ),
  )
  return body
}

async function getOrUploadImage(article) {
  const filename = `pexels-${article.id}-1600x900.jpg`
  const existingAssetId = await client.fetch(
    `*[_type == "sanity.imageAsset" && originalFilename == $filename][0]._id`,
    {filename},
  )
  if (existingAssetId) return existingAssetId

  const response = await fetch(article.imageUrl)
  if (!response.ok) throw new Error(`Không tải được ảnh ${article.id}: ${response.status}`)
  const asset = await client.assets.upload('image', Buffer.from(await response.arrayBuffer()), {
    filename,
    title: article.alt,
    description: `Ảnh minh họa từ Pexels: ${article.sourceUrl}`,
    source: {id: `pexels-${article.id}`, name: 'Pexels', url: article.sourceUrl},
  })
  return asset._id
}

for (const article of articles) {
  if (article.seoTitle.length > 65) throw new Error(`SEO title quá dài: ${article.slug}`)
  if (article.seoDescription.length > 165) throw new Error(`SEO description quá dài: ${article.slug}`)

  const existing = await client.fetch(
    `*[_type == "article" && !(_id in path("drafts.**")) && slug.current == $slug][0]{_id}`,
    {slug: article.slug},
  )
  const assetId = await getOrUploadImage(article)
  const document = {
    _type: 'article',
    title: article.title,
    slug: {_type: 'slug', current: article.slug},
    excerpt: article.excerpt,
    publishedAt: article.publishedAt,
    mainImage: {
      _type: 'image',
      asset: {_type: 'reference', _ref: assetId},
      alt: article.alt,
      crop: {_type: 'sanity.imageCrop', top: 0, bottom: 0, left: 0, right: 0},
      hotspot: {_type: 'sanity.imageHotspot', x: 0.5, y: 0.5, height: 1, width: 1},
    },
    body: toPortableText(article),
    seo: {
      _type: 'object',
      title: article.seoTitle,
      description: article.seoDescription,
      focusKeyword: article.focusKeyword,
      noIndex: false,
    },
  }

  if (existing?._id) {
    await client.patch(existing._id).set(document).commit()
    console.log(`Đã cập nhật: ${article.slug}`)
  } else {
    await client.create(document)
    console.log(`Đã tạo: ${article.slug}`)
  }
}

const slugs = articles.map(({slug}) => slug)
const audit = await client.fetch(
  `{
    "totalArticles": count(*[_type == "article" && !(_id in path("drafts.**"))]),
    "holidayArticles": count(*[_type == "article" && !(_id in path("drafts.**")) && slug.current in $slugs]),
    "holidayDistinctImages": count(array::unique(*[_type == "article" && !(_id in path("drafts.**")) && slug.current in $slugs].mainImage.asset._ref)),
    "allDistinctImages": count(array::unique(*[_type == "article" && !(_id in path("drafts.**"))].mainImage.asset._ref)),
    "missing": *[_type == "article" && !(_id in path("drafts.**")) && slug.current in $slugs && (!defined(mainImage.asset._ref) || !defined(mainImage.alt) || seo.noIndex == true)].slug.current
  }`,
  {slugs},
)

console.log('Kiểm tra sau cập nhật:', JSON.stringify(audit, null, 2))
