export type SeoSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
};

export type SeoFaq = {question: string; answer: string};

export type SeoLanding = {
  slug: string;
  title: string;
  metaTitle: string;
  description: string;
  eyebrow: string;
  image: string;
  imageAlt: string;
  intent: string;
  sections: SeoSection[];
  faqs: SeoFaq[];
  serviceHref: string;
  serviceLabel: string;
};

export type EventLanding = SeoLanding & {
  dateLabel: string;
  dateISO: string;
  planningNote: string;
};

const commonBookingFaqs: SeoFaq[] = [
  {
    question: "Có cần đặt lịch trước khi đến Mombi không?",
    answer: "Bạn nên đặt trước ít nhất 2 giờ để Mombi chuẩn bị phòng và sắp xếp kỹ thuật viên. Bạn có thể liên hệ Zalo hoặc gọi 0934 250 909.",
  },
  {
    question: "Mombi Care Spa ở đâu tại Buôn Ma Thuột?",
    answer: "Spa nằm tại 34 Trần Khánh Dư, phường Tân Lợi, thành phố Buôn Ma Thuột, có khu vực đậu xe máy và ô tô.",
  },
];

export const localLandings: SeoLanding[] = [
  {
    slug: "spa-thu-gian",
    title: "Spa thư giãn tại Buôn Ma Thuột",
    metaTitle: "Spa thư giãn Buôn Ma Thuột | Mombi Care Spa",
    description: "Tìm một spa thư giãn yên tĩnh tại Buôn Ma Thuột? Khám phá không gian, liệu trình massage và cách đặt lịch tại Mombi Care Spa.",
    eyebrow: "Một khoảng nghỉ giữa thành phố",
    image: "/img/ve-mombi1.jpg",
    imageAlt: "Không gian xanh yên tĩnh tại Mombi Care Spa Buôn Ma Thuột",
    intent: "Dành cho người cần nghỉ ngơi, giảm cảm giác căng thẳng và tìm một không gian riêng tư ngay trong thành phố.",
    sections: [
      {heading: "Một buổi spa thư giãn nên bắt đầu từ nhu cầu của bạn", paragraphs: ["Có người muốn nghỉ ngắn sau giờ làm, có người cần một buổi massage toàn thân chậm rãi, cũng có người chỉ muốn thả lỏng vùng đầu và vai gáy. Trước khi bắt đầu, hãy nói rõ khu vực đang khó chịu, mức lực mong muốn và quỹ thời gian của bạn để kỹ thuật viên gợi ý liệu trình vừa đủ.", "Mombi ưu tiên trải nghiệm riêng tư, nhịp chăm sóc nhẹ nhàng và bảng giá rõ ràng. Bạn không cần chọn gói dài nhất; lựa chọn phù hợp là lựa chọn khiến cơ thể thoải mái trong suốt buổi chăm sóc."]},
      {heading: "Có thể chọn dịch vụ nào?", paragraphs: ["Các lựa chọn phổ biến gồm gội đầu dưỡng sinh, massage cổ vai gáy 45 phút, massage body 60–90 phút và chăm sóc da. Nếu lần đầu đến spa, bạn có thể bắt đầu bằng một dịch vụ tập trung, sau đó điều chỉnh ở những lần tiếp theo."], bullets: ["Gội đầu dưỡng sinh khi muốn nghỉ nhẹ và chăm sóc vùng đầu", "Massage cổ vai gáy cho người ngồi nhiều hoặc làm việc với máy tính", "Massage body khi muốn thư giãn toàn thân", "Chăm sóc da khi muốn kết hợp làm sạch và nghỉ ngơi"]},
      {heading: "Vị trí thuận tiện tại trung tâm Buôn Ma Thuột", paragraphs: ["Mombi Care Spa nằm tại 34 Trần Khánh Dư, phường Tân Lợi. Không gian có chỗ đậu xe và phù hợp cho lịch hẹn cá nhân, đi cùng bạn bè hoặc chuẩn bị một buổi chăm sóc làm quà tặng."]},
    ],
    faqs: [{question: "Spa có phục vụ cả khách nam và nữ không?", answer: "Có. Mombi đón cả khách nam và nữ, đồng thời bố trí không gian phù hợp để bảo đảm sự riêng tư."}, ...commonBookingFaqs],
    serviceHref: "/dich-vu",
    serviceLabel: "Xem toàn bộ dịch vụ",
  },
  {
    slug: "massage-body",
    title: "Massage body tại Buôn Ma Thuột",
    metaTitle: "Massage body Buôn Ma Thuột 60–90 phút | Mombi Care",
    description: "Massage body 60–90 phút tại Buôn Ma Thuột, bảng giá rõ ràng và tư vấn mức lực theo nhu cầu tại Mombi Care Spa.",
    eyebrow: "Thả lỏng toàn thân",
    image: "/img/massage body mombi care spa.jpg",
    imageAlt: "Phòng massage body tại Mombi Care Spa Buôn Ma Thuột",
    intent: "Phù hợp khi bạn muốn dành một khoảng thời gian liền mạch để thư giãn toàn thân và phục hồi năng lượng sau lịch trình bận rộn.",
    sections: [
      {heading: "Nên chọn massage body 60 hay 90 phút?", paragraphs: ["Gói 60 phút phù hợp cho lần đầu trải nghiệm hoặc khi lịch trình tương đối gọn. Gói 90 phút cho phép nhịp massage chậm hơn và có thêm thời gian tập trung vào những vùng bạn thường cảm thấy căng như lưng, vai hoặc chân.", "Thời lượng dài hơn không tự động đồng nghĩa với phù hợp hơn. Hãy cân nhắc khả năng nằm lâu, lịch trình trong ngày và trao đổi với kỹ thuật viên trước khi chọn."]},
      {heading: "Trước và trong buổi massage", paragraphs: ["Bạn nên thông báo nếu đang có chấn thương, thai kỳ, bệnh nền hoặc vùng cơ thể cần tránh tác động. Trong buổi massage, hãy chủ động yêu cầu tăng hoặc giảm lực; cảm giác dễ chịu quan trọng hơn việc cố chịu lực mạnh."], bullets: ["Đến sớm vài phút để cơ thể ổn định", "Không ăn quá no ngay trước lịch hẹn", "Nói rõ mức lực và vùng cần tập trung", "Uống nước và dành ít phút nghỉ sau liệu trình"]},
      {heading: "Bảng giá minh bạch", paragraphs: ["Massage body thư giãn 60 phút hiện được niêm yết 250.000đ; massage body trị liệu 60 phút 300.000đ và gói 90 phút 400.000đ. Hãy xác nhận lại dịch vụ và giá tại thời điểm đặt lịch vì bảng giá có thể được cập nhật."]},
    ],
    faqs: [{question: "Massage body có bắt buộc tip không?", answer: "Không. Giá niêm yết tại Mombi không kèm yêu cầu tip bắt buộc."}, ...commonBookingFaqs],
    serviceHref: "/dich-vu/massage-thu-gian",
    serviceLabel: "Xem bảng giá massage",
  },
  {
    slug: "massage-co-vai-gay",
    title: "Massage cổ vai gáy tại Buôn Ma Thuột",
    metaTitle: "Massage cổ vai gáy Buôn Ma Thuột | Mombi Care",
    description: "Massage cổ vai gáy 45 phút tại Buôn Ma Thuột cho người ngồi nhiều, làm việc máy tính; tư vấn mức lực và đặt lịch Mombi Care Spa.",
    eyebrow: "Chăm sóc vùng thường xuyên căng mỏi",
    image: "/img/co-vai-gay-tri-lieu.jpg",
    imageAlt: "Massage cổ vai gáy tại Mombi Care Spa Buôn Ma Thuột",
    intent: "Lựa chọn gọn cho dân văn phòng, người lái xe nhiều hoặc thường giữ một tư thế trong thời gian dài.",
    sections: [
      {heading: "Khi nào một buổi 45 phút là lựa chọn hợp lý?", paragraphs: ["Nếu bạn chỉ muốn tập trung vào vùng cổ, vai và lưng trên, 45 phút thường là khoảng thời gian dễ sắp xếp sau giờ làm. Kỹ thuật viên sẽ trao đổi về mức lực và vùng cần tránh trước khi thực hiện.", "Massage tại spa hướng tới thư giãn, không thay thế chẩn đoán hay điều trị y tế. Đau cấp tính, tê lan xuống tay, chấn thương hoặc triệu chứng kéo dài cần được nhân viên y tế đánh giá."]},
      {heading: "Cách giúp trải nghiệm dễ chịu hơn", paragraphs: ["Đừng đợi đến cuối buổi mới phản hồi về lực massage. Việc trao đổi ngay từ những phút đầu giúp kỹ thuật viên điều chỉnh nhịp và lực phù hợp hơn."], bullets: ["Mô tả vùng căng và thói quen làm việc", "Báo trước tiền sử chấn thương hoặc can thiệp gần đây", "Yêu cầu giảm lực nếu thấy đau nhói hoặc khó chịu", "Kết hợp nghỉ ngắn và thay đổi tư thế trong ngày"]},
      {heading: "Đặt lịch gần trung tâm thành phố", paragraphs: ["Mombi nằm trên đường Trần Khánh Dư, thuận tiện để ghé trước hoặc sau giờ làm. Dịch vụ massage vai cổ gáy 45 phút hiện có giá niêm yết 250.000đ."]},
    ],
    faqs: [{question: "Massage cổ vai gáy có phù hợp cho dân văn phòng không?", answer: "Đây là lựa chọn phổ biến cho người ngồi lâu. Tuy nhiên, nếu có đau kéo dài hoặc dấu hiệu bất thường, bạn nên đi khám trước."}, ...commonBookingFaqs],
    serviceHref: "/dich-vu/massage-thu-gian",
    serviceLabel: "Xem liệu trình cổ vai gáy",
  },
  {
    slug: "goi-dau-duong-sinh",
    title: "Gội đầu dưỡng sinh tại Buôn Ma Thuột",
    metaTitle: "Gội đầu dưỡng sinh Buôn Ma Thuột | Mombi Care",
    description: "Gội đầu dưỡng sinh 70 phút tại Buôn Ma Thuột, kết hợp chăm sóc vùng đầu và cổ vai gáy trong không gian yên tĩnh tại Mombi.",
    eyebrow: "Một giờ nghỉ thật chậm",
    image: "/img/goi-dau.jpg",
    imageAlt: "Gội đầu dưỡng sinh tại Mombi Care Spa Buôn Ma Thuột",
    intent: "Dành cho người muốn kết hợp làm sạch tóc, chăm sóc da đầu và thư giãn vùng đầu – cổ – vai gáy.",
    sections: [
      {heading: "Gội đầu dưỡng sinh khác gội đầu thông thường thế nào?", paragraphs: ["Ngoài bước làm sạch tóc và da đầu, liệu trình dành thêm thời gian cho các thao tác thư giãn vùng đầu, cổ và vai gáy. Nhịp thực hiện chậm hơn một lần gội thông thường, phù hợp khi bạn muốn nghỉ ngơi nhưng chưa cần massage toàn thân."]},
      {heading: "Chuẩn bị trước lịch hẹn", paragraphs: ["Hãy báo cho kỹ thuật viên nếu da đầu đang trầy xước, kích ứng, vừa sử dụng hóa chất hoặc bạn dị ứng với thành phần nào. Mombi có thể điều chỉnh thao tác trong giới hạn phù hợp."], bullets: ["Không cần gội đầu trước khi đến", "Cho biết tình trạng da đầu đang nhạy cảm", "Mang theo thông tin sản phẩm nếu có tiền sử dị ứng", "Dự trù thêm ít phút để tóc khô và nghỉ sau liệu trình"]},
      {heading: "Thời lượng và chi phí", paragraphs: ["Gội đầu dưỡng sinh tại Mombi kéo dài khoảng 70 phút, giá niêm yết 150.000đ. Nếu chỉ cần làm sạch nhanh, spa cũng có gói gội đầu sạch 45 phút."]},
    ],
    faqs: [{question: "Gội đầu dưỡng sinh có massage cổ vai gáy không?", answer: "Liệu trình có thao tác thư giãn vùng đầu và cổ vai gáy. Mức độ và phạm vi cụ thể được trao đổi trước khi thực hiện."}, ...commonBookingFaqs],
    serviceHref: "/dich-vu/massage-thu-gian",
    serviceLabel: "Xem dịch vụ gội đầu",
  },
  {
    slug: "cham-soc-da",
    title: "Chăm sóc da tại Buôn Ma Thuột",
    metaTitle: "Chăm sóc da Buôn Ma Thuột | Mombi Care Spa",
    description: "Chăm sóc da cơ bản và chuyên sâu tại Buôn Ma Thuột, quy trình tư vấn theo tình trạng da và bảng giá rõ ràng tại Mombi Care Spa.",
    eyebrow: "Làm sạch, nuôi dưỡng và bảo vệ",
    image: "/img/skin-care.jpg",
    imageAlt: "Chăm sóc da tại Mombi Care Spa Buôn Ma Thuột",
    intent: "Phù hợp khi bạn muốn làm sạch, dưỡng ẩm và xây dựng một nhịp chăm sóc da vừa phải theo tình trạng thực tế.",
    sections: [
      {heading: "Không phải làn da nào cũng cần cùng một quy trình", paragraphs: ["Da khô, da dầu, da nhạy cảm hoặc da đang có dấu hiệu kích ứng cần cách tiếp cận khác nhau. Một buổi chăm sóc nên bắt đầu bằng trao đổi về sản phẩm đang dùng, can thiệp gần đây và phản ứng bất thường của da.", "Mombi lựa chọn các bước theo tình trạng quan sát được thay vì mặc định thêm nhiều sản phẩm hoặc kỹ thuật không cần thiết."]},
      {heading: "Các lựa chọn tại Mombi", paragraphs: ["Bạn có thể bắt đầu với chăm sóc da cơ bản 60 phút hoặc lựa chọn liệu trình chuyên sâu hơn sau khi được tư vấn."], bullets: ["Chăm sóc da cơ bản và chuyên sâu", "Dưỡng ẩm, hỗ trợ bề mặt da căng mịn", "Massage mặt thư giãn", "Làm sạch và chăm sóc da sau lấy nhân mụn"]},
      {heading: "Giới hạn an toàn cần biết", paragraphs: ["Dịch vụ spa không thay thế khám và điều trị da liễu. Nếu da đang viêm nhiều, sưng đau, ngứa kéo dài hoặc có biểu hiện bất thường, hãy gặp bác sĩ da liễu trước khi thực hiện dịch vụ thẩm mỹ."]},
    ],
    faqs: [{question: "Lần đầu chăm sóc da nên chọn gói nào?", answer: "Bạn có thể bắt đầu bằng gói cơ bản và trao đổi tình trạng da tại spa. Kỹ thuật viên sẽ gợi ý lựa chọn phù hợp, không nhất thiết phải dùng gói dài hơn."}, ...commonBookingFaqs],
    serviceHref: "/dich-vu/cham-soc-da",
    serviceLabel: "Xem bảng giá chăm sóc da",
  },
  {
    slug: "lay-nhan-mun",
    title: "Lấy nhân mụn tại Buôn Ma Thuột",
    metaTitle: "Lấy nhân mụn Buôn Ma Thuột | Mombi Care Spa",
    description: "Tìm hiểu quy trình lấy nhân mụn, cách chuẩn bị và chăm sóc sau buổi làm sạch da tại Mombi Care Spa Buôn Ma Thuột.",
    eyebrow: "Ưu tiên vệ sinh và đánh giá da",
    image: "/img/lay-nhan-mun.jpg",
    imageAlt: "Chuẩn bị dụng cụ lấy nhân mụn tại Mombi Care Spa",
    intent: "Dành cho người cần làm sạch nhân mụn phù hợp và muốn được hướng dẫn chăm sóc da sau buổi thực hiện.",
    sections: [
      {heading: "Đánh giá da trước khi thực hiện", paragraphs: ["Không phải mọi nốt mụn đều nên tác động. Kỹ thuật viên cần quan sát bề mặt da, hỏi về sản phẩm đang dùng và xác định vùng có thể xử lý trong giới hạn an toàn. Tình trạng viêm lan rộng hoặc bất thường cần được bác sĩ da liễu đánh giá."]},
      {heading: "Những điều cần lưu ý", paragraphs: ["Vệ sinh tay, dụng cụ và khu vực thực hiện là phần không thể bỏ qua. Sau buổi chăm sóc, làn da có thể nhạy cảm hơn nên quy trình tại nhà cần được giữ đơn giản."], bullets: ["Không tự nặn mụn sát ngày hẹn", "Báo các hoạt chất hoặc thuốc đang sử dụng", "Tránh chà xát và dùng hoạt chất mạnh ngay sau buổi chăm sóc", "Bảo vệ da khỏi nắng và theo dõi phản ứng bất thường"]},
      {heading: "Hai lựa chọn thời lượng", paragraphs: ["Mombi có gói lấy nhân mụn 60 phút giá 250.000đ và gói chuyên sâu 120 phút giá 350.000đ. Tình trạng da, không chỉ số lượng nốt mụn, là yếu tố cần cân nhắc khi chọn gói."]},
    ],
    faqs: [{question: "Da đang viêm nhiều có nên lấy nhân mụn tại spa không?", answer: "Bạn nên ưu tiên khám bác sĩ da liễu khi da viêm nhiều, sưng đau hoặc có tổn thương lan rộng. Spa không thay thế cơ sở y tế."}, ...commonBookingFaqs],
    serviceHref: "/dich-vu/cham-soc-da",
    serviceLabel: "Xem dịch vụ chăm sóc mụn",
  },
  {
    slug: "spa-cho-nam",
    title: "Spa cho nam tại Buôn Ma Thuột",
    metaTitle: "Spa cho nam ở Buôn Ma Thuột | Mombi Care Spa",
    description: "Mombi Care Spa đón khách nam tại Buôn Ma Thuột với các lựa chọn massage, gội đầu dưỡng sinh và chăm sóc da riêng tư.",
    eyebrow: "Chăm sóc không phân biệt giới tính",
    image: "/img/landing-3.jpg",
    imageAlt: "Không gian spa riêng tư dành cho khách nam và nữ tại Buôn Ma Thuột",
    intent: "Dành cho khách nam muốn tìm dịch vụ rõ ràng, không gian lịch sự và quy trình đặt lịch đơn giản.",
    sections: [
      {heading: "Khách nam có thể chọn dịch vụ nào?", paragraphs: ["Mombi phục vụ cả khách nam và nữ. Khách nam thường chọn massage cổ vai gáy, massage body, gội đầu dưỡng sinh hoặc chăm sóc da cơ bản tùy quỹ thời gian và nhu cầu."], bullets: ["Massage cổ vai gáy 45 phút", "Massage body 60 hoặc 90 phút", "Gội đầu dưỡng sinh 70 phút", "Chăm sóc da cơ bản 60 phút"]},
      {heading: "Lần đầu đi spa cần chuẩn bị gì?", paragraphs: ["Bạn chỉ cần đặt lịch, cho biết dịch vụ quan tâm và đến sớm vài phút. Trước khi bắt đầu, hãy nói rõ mức lực massage, vùng cơ thể cần tránh, tình trạng da hoặc vấn đề sức khỏe liên quan."]},
      {heading: "Riêng tư và chi phí rõ ràng", paragraphs: ["Không gian được sắp xếp để khách cảm thấy thoải mái. Giá dịch vụ được công khai và không có yêu cầu tip bắt buộc, giúp bạn dễ chọn liệu trình trước khi đến."]},
    ],
    faqs: [{question: "Mombi có nhận khách nam không?", answer: "Có. Mombi phục vụ cả khách nam và nữ với các lựa chọn massage, gội đầu và chăm sóc da."}, ...commonBookingFaqs],
    serviceHref: "/dich-vu",
    serviceLabel: "Chọn dịch vụ phù hợp",
  },
  {
    slug: "spa-gan-trung-tam",
    title: "Spa gần đây ở trung tâm Buôn Ma Thuột",
    metaTitle: "Spa gần đây ở Buôn Ma Thuột, có chỗ đậu xe | Mombi",
    description: "Tìm spa gần đây ở Buôn Ma Thuột? Mombi Care Spa tại 34 Trần Khánh Dư: dễ tìm, có chỗ đậu ô tô và xe máy, đặt lịch qua Zalo.",
    eyebrow: "Dễ ghé, dễ đặt lịch",
    image: "/img/ve-mombi2.jpg",
    imageAlt: "Mombi Care Spa gần trung tâm Buôn Ma Thuột",
    intent: "Phù hợp khi bạn ưu tiên vị trí thuận tiện, chỗ đậu xe và muốn sắp xếp một lịch hẹn ngắn trong ngày.",
    sections: [
      {heading: "Địa chỉ 34 Trần Khánh Dư, phường Tân Lợi", paragraphs: ["Mombi nằm trong khu vực trung tâm Buôn Ma Thuột, thuận tiện để ghé sau giờ làm, cuối tuần hoặc kết hợp với lịch trình trong thành phố. Bạn có thể mở Google Maps từ website để xem tuyến đường phù hợp với vị trí hiện tại."]},
      {heading: "Có chỗ đậu xe", paragraphs: ["Spa có khu vực đậu xe máy và ô tô trước cửa. Nếu đi theo nhóm hoặc vào khung giờ cao điểm, bạn nên báo khi đặt lịch để spa hỗ trợ chuẩn bị tốt hơn."]},
      {heading: "Chọn liệu trình theo quỹ thời gian", paragraphs: ["Lịch bận không có nghĩa là phải bỏ qua việc nghỉ ngơi. Gói cổ vai gáy 45 phút hoặc chăm sóc da cơ bản 60 phút phù hợp với lịch gọn; massage body 90 phút thích hợp khi bạn có nhiều thời gian hơn."], bullets: ["45 phút: gội sạch hoặc massage cổ vai gáy", "60 phút: massage body hoặc chăm sóc da cơ bản", "70 phút: gội đầu dưỡng sinh", "90 phút: massage body chuyên sâu"]},
    ],
    faqs: [{question: "Spa có chỗ đậu ô tô không?", answer: "Có. Mombi có khu vực đậu ô tô và xe máy trước cửa spa."}, ...commonBookingFaqs],
    serviceHref: "/dich-vu",
    serviceLabel: "Xem dịch vụ và thời lượng",
  },
];

export const eventLandings: EventLanding[] = [
  {
    slug: "quoc-khanh-2-9-2026",
    title: "Gợi ý thư giãn dịp Quốc khánh 2/9 tại Buôn Ma Thuột",
    metaTitle: "Đi spa dịp lễ 2/9 tại Buôn Ma Thuột | Mombi Care",
    description: "Lên lịch massage, gội đầu dưỡng sinh hoặc chăm sóc da trong kỳ nghỉ Quốc khánh 2/9/2026 tại Mombi Care Spa Buôn Ma Thuột.",
    eyebrow: "Kỳ nghỉ Quốc khánh 2026",
    dateLabel: "29/08 – 02/09/2026",
    dateISO: "2026-09-02",
    planningNote: "Kỳ nghỉ dài nên các khung giờ đẹp có thể được hỏi sớm. Hãy nhắn Mombi để xác nhận lịch phục vụ và chỗ trống thực tế.",
    image: "/img/landing-1.jpg",
    imageAlt: "Gợi ý thư giãn dịp Quốc khánh 2/9 tại Mombi Care Spa",
    intent: "Một lịch hẹn ngắn giúp kỳ nghỉ tại Buôn Ma Thuột có thêm khoảng lặng, dù bạn ở lại thành phố hay vừa trở về sau chuyến đi.",
    sections: [
      {heading: "Chọn liệu trình theo lịch nghỉ", paragraphs: ["Nếu ngày nghỉ đã có nhiều hoạt động, gội đầu dưỡng sinh hoặc massage cổ vai gáy là lựa chọn gọn. Khi có một buổi trống, massage body 60–90 phút tạo khoảng thời gian liền mạch hơn để nghỉ ngơi."], bullets: ["45 phút cho lịch trình ngắn", "60–70 phút cho buổi nghỉ vừa đủ", "90 phút khi muốn trải nghiệm chậm hơn"]},
      {heading: "Đặt lịch trước khi khung giờ kín", paragraphs: ["Các dịp nghỉ dài thường tập trung nhu cầu vào cuối chiều và buổi tối. Mombi không tự động giữ chỗ qua lượt xem trang; lịch chỉ được xác nhận sau khi bạn liên hệ trực tiếp."]},
    ],
    faqs: [{question: "Mombi có mở cửa xuyên lễ 2/9 không?", answer: "Lịch phục vụ dịp lễ có thể thay đổi. Bạn vui lòng nhắn Zalo hoặc gọi 0934 250 909 để xác nhận khung giờ trước khi đến."}, ...commonBookingFaqs],
    serviceHref: "/dich-vu/massage-thu-gian",
    serviceLabel: "Chọn liệu trình dịp 2/9",
  },
  {
    slug: "trung-thu-2026",
    title: "Một món quà chăm sóc dịp Trung thu tại Buôn Ma Thuột",
    metaTitle: "Quà Trung thu 2026: Một buổi spa tại Buôn Ma Thuột",
    description: "Gợi ý tặng người thân một buổi massage, gội đầu dưỡng sinh hoặc chăm sóc da dịp Trung thu 25/09/2026 tại Buôn Ma Thuột.",
    eyebrow: "Trung thu – Rằm tháng Tám",
    dateLabel: "Thứ Sáu, 25/09/2026",
    dateISO: "2026-09-25",
    planningNote: "Trung thu 2026 rơi vào thứ Sáu, thuận tiện để chuẩn bị một lịch chăm sóc trước hoặc trong cuối tuần.",
    image: "/img/landing-2.jpg",
    imageAlt: "Quà tặng spa dịp Trung thu tại Buôn Ma Thuột",
    intent: "Thay cho một món quà vật chất, bạn có thể dành tặng cha mẹ, người thân hoặc chính mình một khoảng thời gian được chăm sóc.",
    sections: [
      {heading: "Chọn quà theo người nhận", paragraphs: ["Gội đầu dưỡng sinh phù hợp với người thích trải nghiệm nhẹ nhàng; massage cổ vai gáy dành cho người thường ngồi nhiều; chăm sóc da là lựa chọn cho người quan tâm đến làn da và một buổi nghỉ riêng tư."]},
      {heading: "Đừng chọn thay mọi chi tiết", paragraphs: ["Nếu chưa biết tình trạng sức khỏe, da hoặc mức lực người nhận yêu thích, hãy tặng một lời mời và để người nhận tự chọn dịch vụ. Cách này vừa tinh tế vừa giúp spa chuẩn bị đúng nhu cầu."]},
    ],
    faqs: [{question: "Có thể đặt lịch spa làm quà Trung thu không?", answer: "Có. Bạn có thể liên hệ Mombi để thống nhất dịch vụ hoặc để người nhận chọn liệu trình và khung giờ phù hợp."}, ...commonBookingFaqs],
    serviceHref: "/dich-vu",
    serviceLabel: "Xem gợi ý dịch vụ làm quà",
  },
  {
    slug: "ngay-phu-nu-viet-nam-20-10-2026",
    title: "Quà 20/10 tại Buôn Ma Thuột: Tặng một buổi được chăm sóc",
    metaTitle: "Quà 20/10 tại Buôn Ma Thuột | Mombi Care Spa",
    description: "Gợi ý quà 20/10/2026 tại Buôn Ma Thuột: massage, gội đầu dưỡng sinh hoặc chăm sóc da tại Mombi Care Spa.",
    eyebrow: "Ngày Phụ nữ Việt Nam",
    dateLabel: "Thứ Ba, 20/10/2026",
    dateISO: "2026-10-20",
    planningNote: "20/10 rơi vào ngày làm việc, vì vậy lịch sau giờ làm và cuối tuần liền trước có thể phù hợp hơn với người nhận.",
    image: "/img/cay-ha.jpg",
    imageAlt: "Quà chăm sóc da và thư giãn 20/10 tại Buôn Ma Thuột",
    intent: "Một món quà hướng đến trải nghiệm, phù hợp để tặng mẹ, vợ, người yêu, đồng nghiệp hoặc chính mình.",
    sections: [
      {heading: "Ba cách chọn quà 20/10", paragraphs: ["Bạn có thể đặt sẵn một dịch vụ, dành ngân sách để người nhận tự chọn hoặc cùng nhau đến spa. Nếu không chắc về nhu cầu, quyền tự chọn luôn là phương án an toàn hơn."], bullets: ["Gội đầu dưỡng sinh cho trải nghiệm nhẹ nhàng", "Massage body cho một khoảng nghỉ dài hơn", "Chăm sóc da khi người nhận yêu thích skincare"]},
      {heading: "Xác nhận lịch và nhu cầu trước khi thanh toán", paragraphs: ["Hãy kiểm tra khung giờ, tình trạng sức khỏe và mong muốn của người nhận. Mombi sẽ tư vấn trong phạm vi dịch vụ, không thay thế đánh giá y tế hoặc da liễu."]},
    ],
    faqs: [{question: "Nên đặt lịch 20/10 trước bao lâu?", answer: "Bạn nên liên hệ sớm khi đã biết khung giờ mong muốn, đặc biệt với lịch cuối chiều và buổi tối."}, ...commonBookingFaqs],
    serviceHref: "/dich-vu",
    serviceLabel: "Chọn quà chăm sóc 20/10",
  },
  {
    slug: "ngay-nha-giao-viet-nam-20-11-2026",
    title: "Gợi ý quà 20/11 thiết thực tại Buôn Ma Thuột",
    metaTitle: "Quà 20/11 tại Buôn Ma Thuột | Mombi Care Spa",
    description: "Gợi ý một buổi chăm sóc và thư giãn làm quà Ngày Nhà giáo Việt Nam 20/11/2026 tại Mombi Care Spa Buôn Ma Thuột.",
    eyebrow: "Ngày Nhà giáo Việt Nam",
    dateLabel: "Thứ Sáu, 20/11/2026",
    dateISO: "2026-11-20",
    planningNote: "Một lịch hẹn linh hoạt để thầy cô tự chọn thời gian thường thiết thực hơn việc ấn định sẵn đúng ngày 20/11.",
    image: "/img/goi-dau.jpg",
    imageAlt: "Gợi ý quà spa 20/11 tại Buôn Ma Thuột",
    intent: "Một lời cảm ơn bằng thời gian nghỉ ngơi, phù hợp khi bạn biết người nhận yêu thích các trải nghiệm chăm sóc cá nhân.",
    sections: [
      {heading: "Ưu tiên sự thoải mái của người nhận", paragraphs: ["Thầy cô có lịch làm việc riêng và sở thích khác nhau. Thay vì chọn một liệu trình quá cụ thể, bạn có thể gửi lời mời để người nhận chủ động chọn massage, gội đầu hoặc chăm sóc da."]},
      {heading: "Lời chúc quan trọng hơn giá trị món quà", paragraphs: ["Một lời nhắn ngắn, chân thành đi cùng trải nghiệm nghỉ ngơi giúp món quà có ý nghĩa mà không tạo cảm giác phô trương. Hãy tôn trọng quy định nhận quà của trường hoặc cơ quan nơi thầy cô công tác."]},
    ],
    faqs: [{question: "Có thể để thầy cô tự chọn dịch vụ không?", answer: "Có. Đây cũng là cách phù hợp khi bạn chưa biết rõ tình trạng sức khỏe, da hoặc sở thích của người nhận."}, ...commonBookingFaqs],
    serviceHref: "/dich-vu",
    serviceLabel: "Xem dịch vụ phù hợp làm quà",
  },
  {
    slug: "giang-sinh-2026",
    title: "Hẹn nhau thư giãn mùa Giáng sinh tại Buôn Ma Thuột",
    metaTitle: "Đi spa Giáng sinh 2026 tại Buôn Ma Thuột | Mombi",
    description: "Gợi ý một buổi spa thư giãn hoặc quà trải nghiệm mùa Giáng sinh 2026 tại Mombi Care Spa Buôn Ma Thuột.",
    eyebrow: "Mùa Giáng sinh",
    dateLabel: "24–25/12/2026",
    dateISO: "2026-12-24",
    planningNote: "Cuối năm thường nhiều lịch hẹn và sự kiện. Một buổi chăm sóc trước Giáng sinh giúp bạn có khoảng nghỉ mà không làm lịch trình quá dày.",
    image: "/img/landing-3.jpg",
    imageAlt: "Không gian thư giãn mùa Giáng sinh tại Mombi Care Spa",
    intent: "Gợi ý cho cặp đôi, bạn bè hoặc người thân muốn dành thời gian chăm sóc bản thân giữa mùa gặp gỡ cuối năm.",
    sections: [
      {heading: "Một cuộc hẹn không cần quá cầu kỳ", paragraphs: ["Bạn có thể cùng người thân chọn hai khung giờ gần nhau hoặc tặng một lịch hẹn để người nhận chủ động sắp xếp. Hãy xác nhận khả năng phục vụ theo nhóm khi đặt lịch."]},
      {heading: "Chọn dịch vụ cho mùa cuối năm", paragraphs: ["Massage body phù hợp khi muốn nghỉ dài; gội đầu dưỡng sinh dễ sắp xếp trong ngày; chăm sóc da nên được đặt trước các buổi tiệc đủ thời gian để da ổn định theo tư vấn."], bullets: ["Đặt sớm nếu muốn lịch buổi tối", "Không thử quá nhiều dịch vụ da mới sát sự kiện", "Cho spa biết nếu đi cùng người khác"]},
    ],
    faqs: [{question: "Mombi có nhận lịch đi spa cùng bạn bè không?", answer: "Bạn có thể gửi số người và khung giờ mong muốn để spa kiểm tra khả năng sắp xếp thực tế."}, ...commonBookingFaqs],
    serviceHref: "/dich-vu",
    serviceLabel: "Lên lịch thư giãn Giáng sinh",
  },
  {
    slug: "tet-duong-lich-2027",
    title: "Khởi đầu năm 2027 bằng một khoảng nghỉ tại Buôn Ma Thuột",
    metaTitle: "Spa Tết Dương lịch 2027 tại Buôn Ma Thuột | Mombi",
    description: "Lên kế hoạch massage, gội đầu dưỡng sinh hoặc chăm sóc da dịp Tết Dương lịch 2027 tại Mombi Care Spa Buôn Ma Thuột.",
    eyebrow: "Chào năm mới 2027",
    dateLabel: "Thứ Sáu, 01/01/2027",
    dateISO: "2027-01-01",
    planningNote: "Lịch phục vụ ngày đầu năm có thể khác ngày thường. Hãy xác nhận trực tiếp với Mombi trước khi di chuyển.",
    image: "/img/ve-mombi.jpg",
    imageAlt: "Khởi đầu năm mới bằng một buổi thư giãn tại Mombi Care Spa",
    intent: "Một cách bắt đầu năm mới nhẹ nhàng: dành thời gian cho cơ thể, làn da và xây dựng thói quen nghỉ ngơi thực tế hơn.",
    sections: [
      {heading: "Đừng biến chăm sóc bản thân thành áp lực", paragraphs: ["Bạn không cần một kế hoạch quá lớn cho ngày đầu năm. Một buổi massage vừa thời lượng, chăm sóc da cơ bản hoặc gội đầu dưỡng sinh có thể là điểm bắt đầu dễ duy trì hơn."]},
      {heading: "Đặt lịch theo nhịp sinh hoạt", paragraphs: ["Nếu vừa trải qua đêm giao thừa muộn, hãy chọn khung giờ đủ để ngủ và ăn uống bình thường trước khi đến. Báo cho kỹ thuật viên nếu cơ thể đang mệt hoặc có vùng cần tránh tác động."]},
    ],
    faqs: [{question: "Spa có mở cửa ngày 01/01/2027 không?", answer: "Lịch ngày lễ cần được xác nhận trực tiếp. Vui lòng liên hệ Zalo hoặc hotline trước khi đến."}, ...commonBookingFaqs],
    serviceHref: "/dich-vu",
    serviceLabel: "Chọn liệu trình đầu năm",
  },
];

export const getLocalLanding = (slug: string) => localLandings.find((item) => item.slug === slug);
export const getEventLanding = (slug: string) => eventLandings.find((item) => item.slug === slug);
