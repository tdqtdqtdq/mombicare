import {createHash} from 'node:crypto'
import {createReadStream, existsSync} from 'node:fs'
import {resolve} from 'node:path'
import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2026-08-01'})
const imageRoots = [
  resolve(process.cwd(), '../public/img'),
  resolve(process.cwd(), '../sa-spa-landing/public/img'),
]
const imageRoot = imageRoots.find(existsSync)

if (!imageRoot) throw new Error('Không tìm thấy thư mục ảnh của website.')

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

const articles = [
  {
    slug: 'massage-co-vai-gay-cho-dan-van-phong-buon-ma-thuot',
    title: 'Massage cổ vai gáy cho dân văn phòng tại Buôn Ma Thuột',
    excerpt: 'Gợi ý cách nhận biết lúc cơ thể cần nghỉ, lựa chọn thời lượng massage cổ vai gáy phù hợp và chuẩn bị cho một buổi thư giãn trọn vẹn tại Mombi Care Spa.',
    seoTitle: 'Massage cổ vai gáy tại Buôn Ma Thuột | Mombi Care',
    seoDescription: 'Tìm hiểu massage cổ vai gáy cho người làm văn phòng, cách chọn thời lượng và trải nghiệm thư giãn tại Mombi Care Spa Buôn Ma Thuột.',
    focusKeyword: 'massage cổ vai gáy Buôn Ma Thuột',
    publishedAt: '2026-08-02',
    image: 'co-vai-gay-tri-lieu.jpg',
    alt: 'Không gian massage cổ vai gáy tại Mombi Care Spa Buôn Ma Thuột',
    intro: [
      'Ngồi lâu trước máy tính, lái xe nhiều hoặc thường xuyên dùng điện thoại có thể khiến vùng cổ, vai và lưng trên trở nên căng cứng. Một khoảng nghỉ đúng lúc không chỉ giúp cơ thể dễ chịu hơn mà còn tạo cơ hội để bạn chậm lại sau ngày làm việc bận rộn.',
      'Tại Mombi Care Spa, massage cổ vai gáy được xây dựng như một trải nghiệm thư giãn có nhịp độ vừa phải. Kỹ thuật viên trao đổi trước về vùng cơ thể đang khó chịu, thói quen sinh hoạt và mức lực bạn mong muốn để điều chỉnh thao tác phù hợp.',
    ],
    sections: [
      {heading: 'Khi nào bạn nên dành thời gian cho cổ vai gáy?', paragraphs: ['Cơ thể thường gửi tín hiệu bằng cảm giác nặng vai, khó xoay cổ thoải mái hoặc mỏi tăng lên vào cuối ngày. Đây là lúc bạn nên tạm rời màn hình, vận động nhẹ và sắp xếp một khoảng nghỉ thực sự.'], bullets: ['Vai thường xuyên nhô cao hoặc co cứng khi tập trung làm việc', 'Cảm giác mỏi xuất hiện sau khi ngồi hoặc lái xe lâu', 'Bạn khó thả lỏng dù đã kết thúc công việc', 'Giấc nghỉ bị ảnh hưởng bởi tư thế nằm không thoải mái']},
      {heading: 'Buổi massage tại Mombi diễn ra như thế nào?', paragraphs: ['Trước khi bắt đầu, kỹ thuật viên hỏi về mức lực và những khu vực cần được quan tâm. Các thao tác làm ấm, xoa bóp và ấn nhẹ được thực hiện theo phản hồi thực tế của khách, không áp dụng một mức lực giống nhau cho tất cả mọi người.', 'Không gian yên tĩnh, hương thơm dịu và nhạc nền nhẹ giúp trải nghiệm liền mạch hơn. Bạn nên báo ngay nếu cảm thấy lực quá mạnh, quá nhẹ hoặc có bất kỳ điểm nào không thoải mái.']},
      {heading: 'Chọn liệu trình 45 hay 60 phút?', paragraphs: ['Khoảng 45 phút phù hợp khi bạn muốn tập trung chủ yếu vào cổ, vai và gáy. Nếu cần thêm thời gian cho lưng, cánh tay hoặc muốn nhịp thư giãn chậm hơn, bạn có thể trao đổi để chọn liệu trình dài hơn. Thời lượng phù hợp quan trọng hơn việc cố chọn buổi dài nhất.']},
      {heading: 'Lưu ý để trải nghiệm dễ chịu hơn', bullets: ['Không ăn quá no ngay trước buổi massage', 'Thông báo tình trạng sức khỏe, chấn thương hoặc vùng cần tránh', 'Uống nước vừa đủ và mặc trang phục thoải mái', 'Kết hợp vận động nhẹ, điều chỉnh bàn ghế và nghỉ mắt trong ngày']},
      {heading: 'Một khoảng nghỉ giữa nhịp sống thành phố', paragraphs: ['Mombi Care Spa nằm tại 34 Trần Khánh Dư, Buôn Ma Thuột và phục vụ cả ngày lẫn đêm. Bạn có thể chủ động chọn khung giờ phù hợp sau giờ làm hoặc khi cần một khoảng nghỉ yên tĩnh. Massage là dịch vụ chăm sóc thư giãn và không thay thế việc thăm khám khi có đau kéo dài, chấn thương hoặc triệu chứng bất thường.']},
    ],
    serviceHref: '/dich-vu/massage-thu-gian',
    serviceLabel: 'xem bảng giá massage và gội đầu dưỡng sinh',
  },
  {
    slug: 'goi-dau-duong-sinh-buon-ma-thuot-trai-nghiem-thu-gian',
    title: 'Gội đầu dưỡng sinh tại Buôn Ma Thuột: Một giờ nghỉ thật chậm',
    excerpt: 'Khám phá trải nghiệm gội đầu dưỡng sinh tại Mombi Care Spa, từ bước làm sạch tóc đến massage đầu và cổ vai gáy trong không gian yên tĩnh.',
    seoTitle: 'Gội đầu dưỡng sinh Buôn Ma Thuột | Mombi Care Spa',
    seoDescription: 'Khám phá quy trình gội đầu dưỡng sinh kết hợp massage đầu, cổ vai gáy trong không gian thư giãn tại Mombi Care Spa Buôn Ma Thuột.',
    focusKeyword: 'gội đầu dưỡng sinh Buôn Ma Thuột',
    publishedAt: '2026-07-26',
    image: 'goi-dau.jpg',
    alt: 'Dịch vụ gội đầu dưỡng sinh tại Mombi Care Spa',
    intro: ['Gội đầu dưỡng sinh không chỉ là làm sạch tóc. Điều khiến nhiều người yêu thích trải nghiệm này là khoảng thời gian được nằm xuống, tạm rời điện thoại và để vùng đầu, cổ, vai được chăm sóc trong một nhịp chậm rãi.', 'Một buổi gội đầu tại Mombi được thiết kế để giữ sự cân bằng giữa làm sạch và thư giãn. Quy trình có thể được điều chỉnh theo tình trạng tóc, da đầu và mức lực massage mà mỗi khách cảm thấy dễ chịu.'],
    sections: [
      {heading: 'Gội đầu dưỡng sinh khác gì gội đầu thông thường?', paragraphs: ['Ngoài các bước làm sạch tóc và da đầu, liệu trình dành thêm thời gian cho thao tác massage vùng đầu, trán, cổ và vai gáy. Sự khác biệt nằm ở nhịp độ chậm, không gian riêng và cảm giác được chăm sóc trọn vẹn thay vì hoàn thành thật nhanh.']},
      {heading: 'Các bước trong một buổi trải nghiệm', bullets: ['Trao đổi về tóc, da đầu và mức lực mong muốn', 'Làm sạch tóc và da đầu nhẹ nhàng', 'Massage đầu kết hợp vùng cổ vai gáy', 'Xả sạch, chăm sóc tóc và hoàn thiện liệu trình', 'Nghỉ ngắn cùng trà ấm trước khi rời spa']},
      {heading: 'Ai phù hợp với dịch vụ này?', paragraphs: ['Dịch vụ phù hợp với người làm việc căng thẳng, thường xuyên đội mũ bảo hiểm, muốn làm sạch tóc kết hợp thư giãn hoặc đơn giản cần một khoảng nghỉ trong ngày. Nếu da đầu đang kích ứng, có vết thương hoặc vừa thực hiện thủ thuật, bạn nên thông báo trước để được tư vấn phù hợp.']},
      {heading: 'Nên chuẩn bị gì trước khi đến?', paragraphs: ['Bạn không cần chuẩn bị cầu kỳ. Hãy dành đủ thời gian để không phải vội, hạn chế dùng quá nhiều sản phẩm tạo kiểu và nói rõ nếu bạn dị ứng với một thành phần hoặc mùi hương nào đó. Việc trao đổi thẳng thắn giúp kỹ thuật viên điều chỉnh trải nghiệm tốt hơn.']},
      {heading: 'Gội đầu vào ban ngày hay buổi tối?', paragraphs: ['Buổi trưa thích hợp cho một khoảng nghỉ giữa lịch làm việc, còn buổi tối thường mang lại cảm giác chậm rãi hơn sau khi kết thúc công việc. Mombi phục vụ cả ngày lẫn đêm, vì vậy bạn có thể chọn thời điểm phù hợp với nhịp sinh hoạt của mình.']},
    ],
    serviceHref: '/dich-vu/massage-thu-gian',
    serviceLabel: 'xem liệu trình gội đầu dưỡng sinh',
  },
  {
    slug: 'quy-trinh-cham-soc-da-co-ban-tai-spa',
    title: 'Quy trình chăm sóc da cơ bản tại spa gồm những gì?',
    excerpt: 'Tìm hiểu các bước thường có trong một buổi chăm sóc da cơ bản, cách chuẩn bị trước khi đến spa và cách duy trì làn da dễ chịu sau liệu trình.',
    seoTitle: 'Quy trình chăm sóc da cơ bản tại spa | Mombi Care',
    seoDescription: 'Các bước chăm sóc da cơ bản, cách chuẩn bị và chăm sóc sau liệu trình tại Mombi Care Spa Buôn Ma Thuột.',
    focusKeyword: 'chăm sóc da cơ bản Buôn Ma Thuột',
    publishedAt: '2026-07-19',
    image: 'skin-care.jpg',
    alt: 'Không gian chăm sóc da tại Mombi Care Spa Buôn Ma Thuột',
    intro: ['Một quy trình chăm sóc da cơ bản tốt không cần quá nhiều bước. Điều quan trọng là làm sạch phù hợp, thao tác nhẹ nhàng và lựa chọn sản phẩm dựa trên tình trạng da tại thời điểm thực hiện.', 'Tại Mombi Care Spa, kỹ thuật viên bắt đầu bằng việc trao đổi thói quen chăm sóc tại nhà và quan sát bề mặt da. Đây là cơ sở để điều chỉnh sản phẩm, thời lượng và tránh những bước không cần thiết.'],
    sections: [
      {heading: 'Các bước thường có trong liệu trình', bullets: ['Làm sạch lớp trang điểm, kem chống nắng và bụi bẩn', 'Làm sạch bề mặt da bằng sản phẩm phù hợp', 'Tẩy tế bào chết khi tình trạng da cho phép', 'Massage mặt nhẹ nhàng và đắp mặt nạ', 'Dưỡng ẩm và bảo vệ da sau liệu trình']},
      {heading: 'Vì sao cần cá nhân hóa quy trình?', paragraphs: ['Da dầu, da khô, da nhạy cảm hoặc làn da đang có dấu hiệu kích ứng sẽ không phù hợp với cùng một quy trình. Việc thêm thật nhiều bước không đồng nghĩa với hiệu quả tốt hơn. Kỹ thuật viên cần ưu tiên sự an toàn và cảm giác dễ chịu của làn da.']},
      {heading: 'Chuẩn bị trước khi đến spa', paragraphs: ['Bạn nên cho spa biết các sản phẩm đang sử dụng, tình trạng dị ứng và những can thiệp da gần đây. Trong vài ngày trước buổi chăm sóc, tránh tự thử quá nhiều sản phẩm mới hoặc tẩy da quá mạnh vì có thể khiến da nhạy cảm hơn.']},
      {heading: 'Chăm sóc da sau liệu trình', bullets: ['Giữ quy trình tại nhà đơn giản và dịu nhẹ', 'Dưỡng ẩm đều đặn theo nhu cầu của da', 'Sử dụng kem chống nắng vào ban ngày', 'Không tự cạy, chà xát hoặc dùng hoạt chất mạnh khi da đang nhạy cảm']},
      {heading: 'Khi nào nên gặp chuyên gia y tế?', paragraphs: ['Chăm sóc tại spa không thay thế chẩn đoán hoặc điều trị da liễu. Nếu da viêm kéo dài, đau, ngứa nhiều hoặc có biểu hiện bất thường, bạn nên gặp bác sĩ da liễu trước khi thực hiện dịch vụ thẩm mỹ.']},
    ],
    serviceHref: '/dich-vu/cham-soc-da',
    serviceLabel: 'xem các dịch vụ chăm sóc da tại Mombi',
  },
  {
    slug: 'lay-nhan-mun-can-chuan-bi-va-cham-soc-da-the-nao',
    title: 'Lấy nhân mụn: Cần chuẩn bị và chăm sóc da như thế nào?',
    excerpt: 'Những điều nên biết trước và sau khi lấy nhân mụn, từ vệ sinh, chống nắng đến dấu hiệu cần tham khảo bác sĩ da liễu.',
    seoTitle: 'Lấy nhân mụn tại Buôn Ma Thuột: Điều cần biết',
    seoDescription: 'Hướng dẫn chuẩn bị và chăm sóc da sau khi lấy nhân mụn, cùng những lưu ý an toàn từ Mombi Care Spa Buôn Ma Thuột.',
    focusKeyword: 'lấy nhân mụn Buôn Ma Thuột',
    publishedAt: '2026-07-12',
    image: 'lay-nhan-mun.jpg',
    alt: 'Chuẩn bị dụng cụ chăm sóc da tại Mombi Care Spa',
    intro: ['Lấy nhân mụn là dịch vụ cần sự cẩn trọng vì tác động trực tiếp lên bề mặt da. Một buổi thực hiện phù hợp bắt đầu từ đánh giá tình trạng da, vệ sinh dụng cụ và xác định những vùng có thể xử lý an toàn.', 'Không phải mọi nốt mụn đều nên tác động. Mụn viêm nhiều, tổn thương lan rộng hoặc tình trạng da bất thường cần được bác sĩ da liễu đánh giá thay vì tự xử lý tại nhà hay cố thực hiện tại spa.'],
    sections: [
      {heading: 'Trước khi thực hiện', bullets: ['Thông báo sản phẩm và hoạt chất đang dùng', 'Cho biết tiền sử kích ứng hoặc dị ứng', 'Không tự nặn mụn trong những ngày sát buổi hẹn', 'Hạn chế tẩy tế bào chết mạnh khi da đang nhạy cảm']},
      {heading: 'Vệ sinh và thao tác có vai trò gì?', paragraphs: ['Bề mặt da, tay người thực hiện và dụng cụ cần được vệ sinh theo quy trình. Thao tác nên có kiểm soát và dừng lại khi vùng da không phù hợp để tiếp tục. Cố lấy bằng mọi giá có thể khiến da khó chịu hơn.']},
      {heading: 'Chăm sóc da trong những ngày đầu', paragraphs: ['Sau buổi chăm sóc, hãy giữ da sạch, dưỡng ẩm nhẹ và bảo vệ da khỏi nắng. Tránh chạm tay, cạy vùng đang hồi phục hoặc cùng lúc bổ sung nhiều hoạt chất mạnh. Nếu được hướng dẫn sản phẩm chăm sóc tại nhà, nên dùng đúng lượng và theo dõi phản ứng của da.']},
      {heading: 'Những điều nên tránh', bullets: ['Trang điểm dày ngay khi bề mặt da còn nhạy cảm', 'Xông nóng, chà xát hoặc tập luyện quá sức ngay sau buổi chăm sóc', 'Tự bôi sản phẩm không rõ thành phần', 'Tiếp tục tác động khi da sưng đau hoặc có dấu hiệu bất thường']},
      {heading: 'Đặt sự an toàn lên trước', paragraphs: ['Mục tiêu của chăm sóc da là hỗ trợ làn da trong giới hạn phù hợp, không phải thay thế điều trị y khoa. Với mụn nặng, tái phát kéo dài hoặc có nguy cơ để lại sẹo, thăm khám bác sĩ da liễu là lựa chọn cần thiết.']},
    ],
    serviceHref: '/dich-vu/cham-soc-da',
    serviceLabel: 'tham khảo dịch vụ lấy nhân mụn và chăm sóc da',
  },
  {
    slug: 'cach-chon-thoi-luong-massage-45-60-90-phut',
    title: 'Nên chọn massage 45, 60 hay 90 phút?',
    excerpt: 'So sánh các mốc thời lượng massage phổ biến để bạn chọn liệu trình phù hợp với vùng cần chăm sóc, quỹ thời gian và mức độ thư giãn mong muốn.',
    seoTitle: 'Massage 45, 60 hay 90 phút: Nên chọn thời lượng nào?',
    seoDescription: 'So sánh massage 45, 60 và 90 phút để chọn liệu trình phù hợp tại Mombi Care Spa Buôn Ma Thuột.',
    focusKeyword: 'massage 60 phút Buôn Ma Thuột',
    publishedAt: '2026-07-05',
    image: 'massage body mombi care spa.jpg',
    alt: 'Phòng massage thư giãn tại Mombi Care Spa',
    intro: ['Thời lượng là một trong những câu hỏi phổ biến nhất khi đặt lịch massage. Buổi dài hơn không phải lúc nào cũng tốt hơn; lựa chọn phù hợp phụ thuộc vào vùng muốn tập trung, quỹ thời gian và cảm giác của cơ thể.', 'Một cuộc trao đổi ngắn trước buổi massage sẽ giúp kỹ thuật viên hiểu bạn muốn thư giãn toàn thân hay tập trung vào cổ vai gáy. Từ đó, nhịp độ và thời lượng có thể được sắp xếp hợp lý.'],
    sections: [
      {heading: 'Massage 45 phút', paragraphs: ['Đây là lựa chọn gọn cho người có lịch trình bận hoặc muốn tập trung vào một vùng như cổ, vai và gáy. Khoảng thời gian này phù hợp cho một buổi nghỉ giữa ngày hoặc sau giờ làm mà không chiếm quá nhiều thời gian.']},
      {heading: 'Massage 60 phút', paragraphs: ['Sáu mươi phút tạo đủ khoảng trống để chăm sóc nhiều vùng hơn với nhịp độ cân bằng. Đây thường là lựa chọn dễ bắt đầu cho người lần đầu trải nghiệm massage body hoặc muốn thư giãn toàn thân.']},
      {heading: 'Massage 90 phút', paragraphs: ['Chín mươi phút phù hợp khi bạn muốn nhịp trải nghiệm chậm, có thời gian tập trung kỹ hơn vào một số vùng và không phải vội chuyển giữa các bước. Hãy báo với kỹ thuật viên nếu bạn dễ mệt khi nằm lâu hoặc muốn thay đổi tư thế.']},
      {heading: 'Cách đưa ra lựa chọn', bullets: ['Chọn theo vùng cần tập trung thay vì chỉ nhìn thời lượng', 'Cân nhắc lịch trình để không phải vội trước hoặc sau buổi hẹn', 'Nói rõ mức lực và trải nghiệm massage trước đây', 'Nếu chưa chắc chắn, hãy bắt đầu với thời lượng vừa phải']},
      {heading: 'Lắng nghe cơ thể trong suốt liệu trình', paragraphs: ['Bạn luôn có thể yêu cầu điều chỉnh lực, nhiệt độ, âm thanh hoặc dừng thao tác tại một vùng. Massage tại spa hướng tới thư giãn; nếu bạn đang có chấn thương, đau cấp tính hoặc vấn đề sức khỏe cần theo dõi, hãy tham khảo nhân viên y tế trước.']},
    ],
    serviceHref: '/dich-vu/massage-thu-gian',
    serviceLabel: 'so sánh các gói massage tại Mombi',
  },
  {
    slug: 'kinh-nghiem-chon-spa-thu-gian-tai-buon-ma-thuot',
    title: 'Kinh nghiệm chọn spa thư giãn tại Buôn Ma Thuột',
    excerpt: 'Các tiêu chí thực tế để chọn spa phù hợp: dịch vụ rõ ràng, không gian, vệ sinh, cách tư vấn, vị trí và khung giờ phục vụ.',
    seoTitle: 'Kinh nghiệm chọn spa tại Buôn Ma Thuột | Mombi Care',
    seoDescription: '7 tiêu chí giúp bạn chọn spa thư giãn và chăm sóc da phù hợp tại Buôn Ma Thuột: vệ sinh, tư vấn, giá, vị trí và thời gian.',
    focusKeyword: 'spa Buôn Ma Thuột',
    publishedAt: '2026-06-28',
    image: 've-mombi1.jpg',
    alt: 'Không gian xanh tại Mombi Care Spa Buôn Ma Thuột',
    intro: ['Một spa phù hợp không chỉ được đánh giá qua hình ảnh đẹp. Trải nghiệm thực tế còn phụ thuộc vào cách tư vấn, mức độ sạch sẽ, sự riêng tư, bảng giá và khả năng điều chỉnh dịch vụ theo nhu cầu của từng khách.', 'Nếu bạn đang tìm spa tại Buôn Ma Thuột, hãy dành vài phút xem kỹ thông tin trước khi đặt lịch. Những tiêu chí dưới đây giúp việc lựa chọn rõ ràng hơn và hạn chế cảm giác không thoải mái khi đến nơi.'],
    sections: [
      {heading: '1. Dịch vụ và giá được trình bày rõ ràng', paragraphs: ['Tên liệu trình, thời lượng, các bước chính và mức giá nên được thông tin trước. Bạn có quyền hỏi lại phần chưa rõ và xác nhận tổng chi phí trước khi bắt đầu.']},
      {heading: '2. Tư vấn dựa trên nhu cầu thực tế', paragraphs: ['Một cuộc tư vấn tốt tập trung vào điều bạn đang cần, đồng thời nói rõ giới hạn của dịch vụ. Những cam kết tuyệt đối hoặc thúc ép mua gói dài hạn là điều bạn nên cân nhắc kỹ.']},
      {heading: '3. Vệ sinh và sự riêng tư', paragraphs: ['Hãy quan sát khăn, giường, dụng cụ và cách nhân viên chuẩn bị khu vực dịch vụ. Với chăm sóc da, vệ sinh dụng cụ đặc biệt quan trọng. Không gian riêng tư cũng giúp bạn thả lỏng tốt hơn.']},
      {heading: '4. Kỹ thuật viên biết lắng nghe', paragraphs: ['Mức lực massage và cảm nhận trên da rất khác nhau ở mỗi người. Kỹ thuật viên nên chủ động hỏi và sẵn sàng điều chỉnh thay vì áp dụng một quy trình cứng nhắc.']},
      {heading: '5. Vị trí và thời gian thuận tiện', paragraphs: ['Một địa điểm dễ tìm, có chỗ đậu xe và khung giờ linh hoạt giúp bạn duy trì thói quen chăm sóc mà không tạo thêm áp lực cho lịch trình. Mombi nằm tại 34 Trần Khánh Dư và phục vụ cả ngày lẫn đêm.']},
      {heading: '6. Cảm giác sau trải nghiệm', paragraphs: ['Một buổi spa phù hợp nên để lại cảm giác được tôn trọng và chăm sóc, không phải áp lực mua thêm dịch vụ. Hãy dựa trên trải nghiệm của chính mình để quyết định có quay lại hay không.']},
    ],
    serviceHref: '/dich-vu',
    serviceLabel: 'khám phá toàn bộ dịch vụ của Mombi Care Spa',
  },
]

function toPortableText(article) {
  const body = []
  article.intro.forEach((text, index) => body.push(block(`${article.slug}-intro-${index}`, text)))
  article.sections.forEach((section, sectionIndex) => {
    body.push(block(`${article.slug}-heading-${sectionIndex}`, section.heading, 'h2'))
    section.paragraphs?.forEach((text, index) => body.push(block(`${article.slug}-section-${sectionIndex}-p-${index}`, text)))
    section.bullets?.forEach((text, index) => body.push(listItem(`${article.slug}-section-${sectionIndex}-li-${index}`, text)))
  })
  body.push(linkBlock(`${article.slug}-service-link`, 'Bạn có thể ', article.serviceLabel, article.serviceHref, ' trước khi đặt lịch.'))
  return body
}

async function uploadImage(article, existing) {
  if (existing?.mainImage?.asset?._ref) return existing.mainImage
  const imagePath = resolve(imageRoot, article.image)
  if (!existsSync(imagePath)) throw new Error(`Thiếu ảnh: ${imagePath}`)
  const asset = await client.assets.upload('image', createReadStream(imagePath), {
    filename: article.image,
    title: article.alt,
  })
  return {_type: 'image', asset: {_type: 'reference', _ref: asset._id}, alt: article.alt}
}

for (const article of articles) {
  const existing = await client.fetch(
    '*[_type == "article" && slug.current == $slug][0]{_id,mainImage}',
    {slug: article.slug},
  )
  const mainImage = await uploadImage(article, existing)
  const document = {
    _type: 'article',
    title: article.title,
    slug: {_type: 'slug', current: article.slug},
    excerpt: article.excerpt,
    mainImage,
    publishedAt: article.publishedAt,
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
    console.log(`Updated: ${article.slug}`)
  } else {
    await client.create(document)
    console.log(`Created: ${article.slug}`)
  }
}

console.log(`Seeded ${articles.length} SEO articles.`)
