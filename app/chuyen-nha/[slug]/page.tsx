import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Playfair_Display, Be_Vietnam_Pro } from "next/font/google";
import { Metadata } from "next";

const playfair = Playfair_Display({ subsets: ["vietnamese"], weight: ["400", "500", "600", "700"] });
const beVietnam = Be_Vietnam_Pro({ subsets: ["vietnamese"], weight: ["300", "400", "500", "600"] });

// ================= 1. NỘI DUNG TRUYỀN THÔNG (DÀI & CHI TIẾT) =================
const articlesData = {
  "hanh-trinh-tim-ve-nhip-nghi": {
    title: "Hành trình tìm về nhịp nghỉ vừa vặn giữa lòng Buôn phố",
    description: "Khám phá không gian thư giãn yên tĩnh tại Mombi Care Spa - địa chỉ spa uy tín ở BMT giúp bạn đánh bay căng thẳng và phục hồi năng lượng.",
    date: "12/04/2026",
    image: "/img/landing-1.jpg",
    content: (
      <>
        <p className="text-lg font-medium text-[#2d3d25] mb-6 leading-relaxed">
          Giữa nhịp sống hối hả và áp lực công việc không ngừng nghỉ, đôi khi tất cả những gì chúng ta khao khát chỉ là một góc nhỏ yên bình. Một nơi không có tiếng còi xe, không có deadline hối thúc, chỉ có hương thơm thảo mộc và sự tĩnh lặng để tâm hồn được thực sự "thở".
        </p>
        
        <h2 className={`text-2xl md:text-3xl text-[#2d3d25] mt-12 mb-6 ${playfair.className}`}>Không gian chữa lành mang đậm chất "Thiền"</h2>
        <p className="mb-4">
          Tọa lạc tại số 34 Trần Khánh Dư, phường Tân Lợi, <strong>Mombi Care Spa</strong> được thiết kế như một trạm dừng chân tĩnh lặng giữa lòng Buôn Ma Thuột. Ngay từ khoảnh khắc bước qua cánh cửa, bạn sẽ được chào đón bởi ly trà thảo mộc ấm nóng và mùi hương tinh dầu thoang thoảng giúp làm dịu ngay lập tức những nơ-ron thần kinh đang căng thẳng.
        </p>
        <p className="mb-6">
          Chúng tôi chú trọng vào phong cách bài trí tối giản, sạch sẽ (editorial aesthetic) với ánh sáng vàng dịu nhẹ. Từng chiếc khăn, từng ngọn nến đều được chuẩn bị tỉ mỉ để đảm bảo sự riêng tư và thoải mái tuyệt đối cho khách hàng.
        </p>

        <blockquote className="my-10 border-l-4 border-[#8bb96e] pl-6 md:pl-8 py-2 bg-[#f6f9f2] rounded-r-xl italic text-[#5c6e51] text-lg">
          "Không gian yên tĩnh đến mức mình đã ngủ quên lúc nào không hay. Cảm giác như trút bỏ được tảng đá đè nặng trên vai suốt cả tuần dài." - Khách hàng Trần Mai Anh chia sẻ.
        </blockquote>

        <h2 className={`text-2xl md:text-3xl text-[#2d3d25] mt-12 mb-6 ${playfair.className}`}>Trị liệu ngũ quan - Chạm đến sự thư thái trọn vẹn</h2>
        <p className="mb-4">
          Tại Mombi, trị liệu không chỉ nằm ở kỹ thuật tay nghề. Đó là sự kết hợp của <strong>âm nhạc tần số thấp</strong> giúp sóng não thư giãn, <strong>hương thơm tự nhiên</strong> đả thông khứu giác, và <strong>đôi bàn tay điêu luyện</strong> của các kỹ thuật viên gỡ bỏ từng điểm bó cơ trên cơ thể.
        </p>
        <p className="mb-8">
          Dù bạn chọn một gói massage cổ vai gáy ngắn hạn hay một liệu trình chăm sóc da chuyên sâu, Mombi luôn cam kết mang lại một "nhịp nghỉ vừa vặn", giúp bạn nạp lại 100% năng lượng trước khi quay trở lại với guồng quay cuộc sống.
        </p>

        <div className="bg-[#edf4e6] p-8 rounded-2xl text-center mt-12">
          <h3 className={`text-xl text-[#2d3d25] mb-3 ${playfair.className}`}>Bạn đã sẵn sàng cho nhịp nghỉ của riêng mình?</h3>
          <p className="text-sm text-[#5c6e51] mb-6">Đừng để sự mệt mỏi tích tụ. Hãy đặt lịch ngay hôm nay để Mombi chuẩn bị phòng ốc và trà ấm đón bạn.</p>
          <a href="https://zalo.me/0934250909" target="_blank" rel="noopener noreferrer" className="inline-block bg-[#8bb96e] text-white px-8 py-3 rounded-full text-sm tracking-widest font-medium hover:bg-[#739f55] transition-all shadow-md hover:-translate-y-1">
            LIÊN HỆ ĐẶT LỊCH NGAY
          </a>
        </div>
      </>
    )
  },
  "giai-ma-lieu-trinh-goi-dau-duong-sinh": {
    title: "Giải mã liệu trình gội đầu dưỡng sinh đánh bay mất ngủ",
    description: "Khám phá chi tiết liệu trình gội đầu dưỡng sinh 70 phút tại Mombi Care Spa. Giải pháp trị mất ngủ, đau vai gáy hiệu quả bằng thảo mộc tự nhiên.",
    date: "05/04/2026",
    image: "/img/landing-2.jpg",
    content: (
      <>
        <p className="text-lg font-medium text-[#2d3d25] mb-6 leading-relaxed">
          Mất ngủ, đau đầu, rụng tóc và cổ vai gáy luôn trong trạng thái căng cứng... Đây là những "căn bệnh thời đại" của giới văn phòng. Và đó cũng là lý do vì sao liệu trình <strong>Gội đầu dưỡng sinh trị liệu</strong> tại Mombi Care Spa luôn trong tình trạng kín lịch.
        </p>
        
        <h2 className={`text-2xl md:text-3xl text-[#2d3d25] mt-12 mb-6 ${playfair.className}`}>Sự khác biệt của dưỡng sinh chuẩn Đông Y</h2>
        <p className="mb-4">
          Gội đầu dưỡng sinh không chỉ đơn thuần là việc làm sạch da đầu bằng dầu gội công nghiệp. Tại Mombi, đây là một liệu trình 70 phút kết hợp tinh hoa giữa làm sạch sâu và kỹ thuật đả thông kinh lạc.
        </p>
        <p className="mb-6">
          Các chuyên viên sẽ sử dụng phần thịt của ngón tay để ấn huyệt đạo vùng đầu, miết dọc theo đường kinh lạc ở cổ và vai gáy. Lực ấn được điều chỉnh vừa vặn với thể trạng từng người, giúp máu huyết lưu thông, đưa oxy lên não nhanh chóng và làm dịu ngay lập tức các cơn đau nhức nhối.
        </p>

        <h2 className={`text-2xl md:text-3xl text-[#2d3d25] mt-12 mb-6 ${playfair.className}`}>Nước gội thảo mộc nấu thủ công mỗi ngày</h2>
        <p className="mb-4">
          Linh hồn của liệu trình này chính là nồi nước thảo mộc được bếp nhà Mombi ninh nhỏ lửa trong nhiều giờ đồng hồ. Sự kết hợp của:
        </p>
        <ul className="list-none space-y-4 mb-8 pl-4 border-l-2 border-[#8bb96e]">
          <li>🌿 <strong>Bồ kết nướng:</strong> Chứa Saponin giúp kháng viêm, trị gàu và làm đen tóc tự nhiên.</li>
          <li>🌿 <strong>Mần trầu & Hương nhu:</strong> Kích thích nang tóc phát triển, giảm gãy rụng rõ rệt.</li>
          <li>🌿 <strong>Vỏ bưởi & Sả chanh:</strong> Tiết ra tinh dầu tự nhiên, tạo hương thơm an thần, giúp thần kinh thư giãn tuyệt đối.</li>
        </ul>

        <h2 className={`text-2xl md:text-3xl text-[#2d3d25] mt-12 mb-6 ${playfair.className}`}>Hiệu quả nhận được sau 70 phút</h2>
        <p className="mb-8">
          Nhiều khách hàng phản hồi rằng, chỉ sau một liệu trình, tình trạng nặng đầu biến mất hoàn toàn. Thay vào đó là cảm giác nhẹ bẫng, sảng khoái và đặc biệt là tối về có một giấc ngủ rất sâu, không còn mộng mị.
        </p>

        <div className="bg-[#edf4e6] p-8 rounded-2xl text-center mt-12">
          <h3 className={`text-xl text-[#2d3d25] mb-3 ${playfair.className}`}>Trải nghiệm giấc ngủ ngon tối nay!</h3>
          <p className="text-sm text-[#5c6e51] mb-6">Inbox cho Mombi để xí ngay một khung giờ yên tĩnh nhất dành riêng cho bạn.</p>
          <a href="https://zalo.me/0934250909" target="_blank" rel="noopener noreferrer" className="inline-block bg-[#8bb96e] text-white px-8 py-3 rounded-full text-sm tracking-widest font-medium hover:bg-[#739f55] transition-all shadow-md hover:-translate-y-1">
            ĐẶT LỊCH GỘI DƯỠNG SINH
          </a>
        </div>
      </>
    )
  },
  "vi-sao-cay-ha-cang-bong-duoc-yeu-thich": {
    title: "Vì sao Cấy HA căng bóng lại được yêu thích đến vậy?",
    description: "Tìm hiểu cơ chế cấp ẩm sâu của liệu trình Cấy HA căng bóng. Giải pháp cho làn da khô ráp, lỗ chân lông to và lão hóa sớm tại Buôn Ma Thuột.",
    date: "28/03/2026",
    image: "/img/landing-3.jpg",
    content: (
      <>
        <p className="text-lg font-medium text-[#2d3d25] mb-6 leading-relaxed">
          Bạn có bao giờ thắc mắc tại sao mình bôi rất nhiều lớp serum và kem dưỡng đắt tiền, nhưng sáng dậy da vẫn xỉn màu và khô ráp? Câu trả lời nằm ở "hàng rào bảo vệ da". Lớp biểu bì quá dày khiến mỹ phẩm bôi thoa chỉ nằm lại trên bề mặt. Đó là lúc công nghệ <strong>Cấy HA căng bóng</strong> lên ngôi.
        </p>
        
        <h2 className={`text-2xl md:text-3xl text-[#2d3d25] mt-12 mb-6 ${playfair.className}`}>Hyaluronic Acid (HA) là gì?</h2>
        <p className="mb-4">
          HA là một phân tử dạng gel có khả năng ngậm nước cực kỳ xuất sắc. Trong khoa học, 1 gram HA có khả năng giữ tới 6 lít nước. HA vốn tồn tại tự nhiên trong cơ thể người, nhưng từ năm 25 tuổi trở đi, lượng HA tự sản sinh giảm đi rõ rệt, dẫn đến tình trạng da nhăn nheo, chảy xệ và thiếu sức sống.
        </p>

        <h2 className={`text-2xl md:text-3xl text-[#2d3d25] mt-12 mb-6 ${playfair.className}`}>Sức mạnh của việc "Cấy trực tiếp"</h2>
        <p className="mb-6">
          Thay vì bôi ngoài da, kỹ thuật cấy HA sử dụng các đầu kim nano siêu vi, đưa trực tiếp các phân tử HA nguyên chất vào sâu lớp trung bì của da. Điều này mang lại hiệu quả vượt trội:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-[#f6f9f2] p-6 rounded-2xl border border-[#e4edd9]">
            <h4 className="font-bold text-[#8bb96e] mb-2 uppercase text-sm tracking-wider">Cấp ẩm gấp 20 lần</h4>
            <p className="text-sm text-[#5c6e51]">Khắc phục ngay lập tức tình trạng da khô bong tróc, mốc nền khi trang điểm.</p>
          </div>
          <div className="bg-[#f6f9f2] p-6 rounded-2xl border border-[#e4edd9]">
            <h4 className="font-bold text-[#8bb96e] mb-2 uppercase text-sm tracking-wider">Thu nhỏ lỗ chân lông</h4>
            <p className="text-sm text-[#5c6e51]">Khi da ngậm đủ nước, các lỗ chân lông sẽ tự động se khít lại, bề mặt da mịn màng hơn.</p>
          </div>
          <div className="bg-[#f6f9f2] p-6 rounded-2xl border border-[#e4edd9]">
            <h4 className="font-bold text-[#8bb96e] mb-2 uppercase text-sm tracking-wider">Là phẳng nếp nhăn</h4>
            <p className="text-sm text-[#5c6e51]">HA lấp đầy các khoảng trống giữa các sợi collagen, giúp xóa mờ các nếp nhăn li ti ở vùng mắt và khóe miệng.</p>
          </div>
          <div className="bg-[#f6f9f2] p-6 rounded-2xl border border-[#e4edd9]">
            <h4 className="font-bold text-[#8bb96e] mb-2 uppercase text-sm tracking-wider">Căng bóng như gương</h4>
            <p className="text-sm text-[#5c6e51]">Hiệu ứng "Glass Skin" chuẩn Hàn Quốc, da sáng bừng sức sống chỉ sau 1 liệu trình.</p>
          </div>
        </div>

        <h2 className={`text-2xl md:text-3xl text-[#2d3d25] mt-12 mb-6 ${playfair.className}`}>Quy trình chuẩn Y khoa tại Mombi</h2>
        <p className="mb-8">
          Tại Mombi Care Spa, liệu trình Cấy HA được thực hiện trong môi trường vô khuẩn 100%. Mọi dụng cụ đều được tiệt trùng kỹ lưỡng. Kỹ thuật viên tay nghề cao đảm bảo quá trình cấy diễn ra êm ái, không sưng, không đau và không cần nghỉ dưỡng.
        </p>

        <div className="bg-[#edf4e6] p-8 rounded-2xl text-center mt-12">
          <h3 className={`text-xl text-[#2d3d25] mb-3 ${playfair.className}`}>Tái sinh làn da ngay hôm nay</h3>
          <p className="text-sm text-[#5c6e51] mb-6">Liên hệ Mombi để được soi da miễn phí và tư vấn phác đồ cấy HA phù hợp nhất.</p>
          <a href="https://zalo.me/0934250909" target="_blank" rel="noopener noreferrer" className="inline-block bg-[#8bb96e] text-white px-8 py-3 rounded-full text-sm tracking-widest font-medium hover:bg-[#739f55] transition-all shadow-md hover:-translate-y-1">
            NHẬN TƯ VẤN DA MIỄN PHÍ
          </a>
        </div>
      </>
    )
  },
  "5-bi-quyet-duy-tri-lan-da-khoe-manh": {
    title: "5 Bí quyết duy trì làn da khỏe mạnh sau lấy nhân mụn",
    description: "Hướng dẫn chi tiết 5 bước chăm sóc da chuẩn y khoa sau khi nặn mụn giúp vết thương nhanh lành, không để lại thâm sẹo.",
    date: "20/03/2026",
    image: "/img/lay-nhan-mun.jpg",
    content: (
      <>
        <p className="text-lg font-medium text-[#2d3d25] mb-6 leading-relaxed">
          Nhiều bạn nghĩ rằng chỉ cần đến Spa lấy sạch nhân mụn là xong. Sự thật là, 80% kết quả phục hồi da và khả năng không để lại thâm sẹo lại phụ thuộc vào cách bạn chăm sóc da tại nhà trong 7 ngày tiếp theo.
        </p>
        
        <p className="mb-8">
          Làn da sau khi thực hiện <strong>lấy nhân mụn chuẩn Y khoa</strong> đang có những vi tổn thương nhỏ. Lúc này da cực kỳ nhạy cảm và cần được bảo vệ tuyệt đối. Hãy lưu lại ngay 5 nguyên tắc vàng dưới đây từ chuyên gia của Mombi Care Spa:
        </p>

        <div className="space-y-8 mb-10">
          <div className="flex gap-4">
            <div className="w-12 h-12 bg-[#8bb96e] text-white rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0 font-serif">1</div>
            <div>
              <h3 className="text-xl font-semibold text-[#2d3d25] mb-2">Làm sạch siêu dịu nhẹ (3 ngày đầu)</h3>
              <p className="text-[#5c6e51]">Trong 3 ngày đầu, hãy tạm cất các loại sữa rửa mặt tạo bọt nhiều, chứa hạt scrub hay BHA/AHA. Chỉ nên lau mặt bằng nước muối sinh lý, sau đó rửa lại bằng nước sạch. Nếu da quá dầu, chỉ dùng sữa rửa mặt dạng gel cực kỳ dịu nhẹ dành riêng cho da nhạy cảm.</p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="w-12 h-12 bg-[#8bb96e] text-white rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0 font-serif">2</div>
            <div>
              <h3 className="text-xl font-semibold text-[#2d3d25] mb-2">Quy tắc "Bàn tay sạch"</h3>
              <p className="text-[#5c6e51]">Tuyệt đối không dùng tay sờ, nắn, hay cạy các vảy đang đóng mài trên nốt mụn. Bàn tay chứa hàng triệu vi khuẩn, chạm vào vết thương hở sẽ lập tức gây viêm sưng trở lại và tạo thành sẹo rỗ.</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-12 h-12 bg-[#8bb96e] text-white rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0 font-serif">3</div>
            <div>
              <h3 className="text-xl font-semibold text-[#2d3d25] mb-2">Tăng cường cấp ẩm phục hồi (B5, Rau má)</h3>
              <p className="text-[#5c6e51]">Đây là thời điểm vàng để da hấp thụ dưỡng chất phục hồi. Ưu tiên sử dụng các loại Serum chứa Vitamin B5 (Panthenol), chiết xuất Rau má (Centella) hoặc HA để làm dịu các vết đỏ, kích thích tăng sinh tế bào mới nhanh chóng.</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-12 h-12 bg-[#8bb96e] text-white rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0 font-serif">4</div>
            <div>
              <h3 className="text-xl font-semibold text-[#2d3d25] mb-2">Chống nắng là sống còn</h3>
              <p className="text-[#5c6e51]">Da đang tổn thương rất dễ bị tăng sắc tố (thâm đen) nếu tiếp xúc với tia UV. Nếu các nốt mụn còn hở dịch, hãy che chắn bằng vật lý (khẩu trang vải tối màu, mũ rộng vành). Khi mụn đã đóng mài, bắt buộc phải bôi kem chống nắng phổ rộng quang phổ hằng ngày.</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-12 h-12 bg-[#8bb96e] text-white rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0 font-serif">5</div>
            <div>
              <h3 className="text-xl font-semibold text-[#2d3d25] mb-2">Kiểm soát chế độ ăn uống</h3>
              <p className="text-[#5c6e51]">Trong 1 tuần đầu, hãy hạn chế tối đa các thực phẩm cay nóng, đồ ăn nhiều đường (trà sữa, bánh ngọt) và các sản phẩm từ sữa bò. Nhóm thực phẩm này kích thích tuyến bã nhờn hoạt động mạnh, dễ gây bùng viêm mụn trở lại.</p>
            </div>
          </div>
        </div>

        <div className="bg-[#edf4e6] p-8 rounded-2xl text-center mt-12 border border-[#8bb96e]/20">
          <h3 className={`text-xl text-[#2d3d25] mb-3 ${playfair.className}`}>Bạn đang gặp vấn đề về mụn?</h3>
          <p className="text-sm text-[#5c6e51] mb-6">Đến ngay Mombi Care Spa để trải nghiệm quy trình lấy nhân mụn 100% chuẩn y khoa, không sưng, hạn chế thâm sẹo tối đa.</p>
          <a href="https://zalo.me/0934250909" target="_blank" rel="noopener noreferrer" className="inline-block bg-[#8bb96e] text-white px-8 py-3 rounded-full text-sm tracking-widest font-medium hover:bg-[#739f55] transition-all shadow-md hover:-translate-y-1">
            ĐẶT LỊCH LÀM SẠCH MỤN
          </a>
        </div>
      </>
    )
  }
};


// ================= 2. GENERATE METADATA (TỐI ƯU SEO ĐỘNG) =================
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> | any }): Promise<Metadata> {
  const resolvedParams = await params;
  const article = articlesData[resolvedParams.slug as keyof typeof articlesData];
  
  if (!article) return { title: "Không tìm thấy bài viết | Mombi Care Spa" };

  return {
    title: `${article.title} | Mombi Care Spa Buôn Ma Thuột`,
    description: article.description,
    openGraph: {
      title: article.title,
      description: article.description,
      images: [article.image],
    },
  };
}


// ================= 3. RENDER GIAO DIỆN (FULL HEADER/FOOTER) =================
export default async function ArticleDetail({ params }: { params: Promise<{ slug: string }> | any }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const article = articlesData[slug as keyof typeof articlesData];

  if (!article) return notFound();

  return (
    <div className={`min-h-screen bg-[#f9f8f4] text-[#2d3d25] ${beVietnam.className} flex flex-col selection:bg-[#8bb96e] selection:text-white`}>
      
      {/* ================= HEADER ĐỒNG BỘ TRANG CHỦ ================= */}
      <header className="w-full bg-[#455c34] text-white z-50 flex justify-between items-center px-4 py-4 md:px-16 md:py-6 text-[11px] md:text-[13px] uppercase tracking-[0.15em] font-medium sticky top-0 shadow-lg border-b border-white/10">
        <div className="flex-1 flex justify-start">
          <Link href="/">
            <div className="relative w-28 h-10 md:w-40 md:h-12 cursor-pointer hover:opacity-90 transition-opacity filter drop-shadow-md bg-white rounded-lg px-2 flex items-center justify-center">
              <Image src="/img/logo-mombicare.jpg" alt="Mombi Care Spa Logo" fill sizes="160px" priority className="object-contain p-1" />
            </div>
          </Link>
        </div>
        
        <nav className="hidden xl:flex gap-8 justify-center items-center">
          <Link href="/" className="hover:text-[#8bb96e] transition-colors">Trang chủ</Link>
          <div className="relative py-2 group cursor-pointer">
            <span className="hover:text-[#8bb96e] transition-colors pb-1">Dịch vụ</span>
            <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-56 transition-all duration-300 z-50 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0">
              <div className="bg-white rounded-xl shadow-2xl border border-[#e4edd9] flex flex-col py-2 overflow-hidden text-[#5c6e51]">
                <Link href="/dich-vu/cham-soc-da" className="px-6 py-3 text-left text-[10px] tracking-widest hover:text-[#8bb96e] hover:bg-[#f6f9f2] transition-colors">CHĂM SÓC DA CAO CẤP</Link>
                <Link href="/dich-vu/massage-thu-gian" className="px-6 py-3 text-left text-[10px] tracking-widest hover:text-[#8bb96e] hover:bg-[#f6f9f2] transition-colors">THƯ GIÃN & MASSAGE</Link>
              </div>
            </div>
          </div>
          <Link href="/chuyen-nha" className="text-[#8bb96e] transition-colors">Chuyện nhà Mombi</Link>
          <Link href="/phieu-qua-tang" className="hover:text-[#8bb96e] transition-colors">Phiếu quà tặng</Link>
        </nav>

        <div className="flex-1 flex justify-end items-center gap-4">
          <a href="https://zalo.me/0934250909" target="_blank" rel="noopener noreferrer" className="hidden md:block border border-white text-white hover:bg-white hover:text-[#455c34] px-6 py-2.5 rounded-full transition-colors font-semibold">
            ĐẶT LỊCH NGAY
          </a>
        </div>
      </header>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1 w-full max-w-[900px] mx-auto py-10 md:py-16 px-4 md:px-8">
        
        {/* Breadcrumbs (Thanh điều hướng SEO) */}
        <nav className="flex items-center text-[10px] md:text-xs tracking-[0.2em] text-[#8bb96e] mb-8 font-medium uppercase whitespace-nowrap overflow-x-auto no-scrollbar">
          <Link href="/" className="hover:text-[#5c6e51] transition-colors flex-shrink-0">Trang chủ</Link>
          <svg className="w-3 h-3 mx-2 text-[#5c6e51] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
          <Link href="/chuyen-nha" className="hover:text-[#5c6e51] transition-colors flex-shrink-0">Chuyện nhà</Link>
          <svg className="w-3 h-3 mx-2 text-[#5c6e51] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
          <span className="text-[#5c6e51] truncate max-w-[150px] md:max-w-[300px]">{article.title}</span>
        </nav>

        {/* Nội dung bài viết */}
        <article className="bg-white p-6 md:p-12 lg:p-16 rounded-[2rem] shadow-sm border border-[#e4edd9] relative overflow-hidden">
          
          <h1 className={`text-3xl md:text-4xl lg:text-5xl text-[#2d3d25] mb-8 leading-[1.2] ${playfair.className}`}>
            {article.title}
          </h1>
          
          <div className="flex items-center gap-4 mb-10 pb-8 border-b border-[#f6f9f2]">
            <div className="w-12 h-12 bg-[#8bb96e]/10 rounded-full flex items-center justify-center text-[#8bb96e] font-serif font-bold text-xl border border-[#8bb96e]/20">M</div>
            <div>
              <p className="text-sm font-semibold text-[#2d3d25] tracking-wide">Mombi Care Spa</p>
              <p className="text-[#8bb96e] text-[10px] tracking-widest uppercase font-medium mt-1">{article.date}</p>
            </div>
          </div>

          <div className="relative w-full h-[250px] md:h-[450px] lg:h-[500px] mb-12 rounded-2xl overflow-hidden bg-[#f6f9f2]">
            <Image src={article.image} alt={article.title} fill className="object-cover hover:scale-105 transition-transform duration-1000 ease-in-out" priority />
          </div>

          <div className="text-[#5c6e51] text-base md:text-[17px] leading-[1.8] font-light">
            {article.content}
          </div>
        </article>

        {/* ================= SECTION BÀI VIẾT / DỊCH VỤ LIÊN QUAN ================= */}
        <section className="mt-20 mb-8">
          <div className="flex items-center gap-4 mb-10">
            <h3 className={`text-2xl md:text-3xl text-[#2d3d25] ${playfair.className}`}>Có thể bạn quan tâm</h3>
            <div className="h-px bg-[#e4edd9] flex-1"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link href="/dich-vu/cham-soc-da" className="group bg-white p-6 rounded-3xl border border-[#e4edd9] hover:shadow-xl hover:shadow-[#8bb96e]/10 hover:border-[#8bb96e]/50 transition-all duration-300 flex items-center gap-5">
              <div className="w-24 h-24 relative rounded-2xl overflow-hidden flex-shrink-0 bg-[#f6f9f2]">
                <Image src="/img/cay-ha.jpg" alt="Chăm sóc da BMT" fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div>
                <span className="text-[#8bb96e] text-[9px] uppercase tracking-widest font-bold mb-2 block">Dịch vụ nổi bật</span>
                <h4 className={`text-lg text-[#2d3d25] group-hover:text-[#8bb96e] transition-colors mb-2 leading-snug ${playfair.className}`}>Chăm sóc da chuyên sâu</h4>
                <p className="text-xs text-[#5c6e51] line-clamp-2">Lấy nhân mụn y khoa, cấy HA căng bóng giúp phục hồi làn da hoàn hảo.</p>
              </div>
            </Link>
            
            <Link href="/dich-vu/massage-thu-gian" className="group bg-white p-6 rounded-3xl border border-[#e4edd9] hover:shadow-xl hover:shadow-[#8bb96e]/10 hover:border-[#8bb96e]/50 transition-all duration-300 flex items-center gap-5">
              <div className="w-24 h-24 relative rounded-2xl overflow-hidden flex-shrink-0 bg-[#f6f9f2]">
                <Image src="/img/goi-dau.jpg" alt="Gội đầu dưỡng sinh BMT" fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div>
                <span className="text-[#8bb96e] text-[9px] uppercase tracking-widest font-bold mb-2 block">Dịch vụ nổi bật</span>
                <h4 className={`text-lg text-[#2d3d25] group-hover:text-[#8bb96e] transition-colors mb-2 leading-snug ${playfair.className}`}>Thư giãn & Trị liệu</h4>
                <p className="text-xs text-[#5c6e51] line-clamp-2">Gội đầu dưỡng sinh thảo mộc, massage cổ vai gáy giải tỏa căng thẳng triệt để.</p>
              </div>
            </Link>
          </div>
        </section>
      </main>

      {/* ================= FOOTER ĐỒNG BỘ TRANG CHỦ ================= */}
      <footer className="bg-[#2d3d25] py-16 px-6 md:px-16 lg:px-24 mt-10 border-t-4 border-[#8bb96e]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          
          <div className="flex flex-col items-start gap-5">
            <div className="relative w-40 h-14 bg-white rounded-xl overflow-hidden px-2 shadow-lg flex items-center justify-center">
               <Image src="/img/logo-mombicare.jpg" alt="Mombi Care Spa Logo Footer" fill sizes="160px" className="object-contain p-2" />
            </div>
            <p className="text-sm text-[#d6e5c9] mt-2 leading-relaxed font-light">
              Tìm về một nhịp nghỉ vừa vặn giữa lòng thành phố Buôn Ma Thuột với không gian xanh mát và sự chăm sóc từ tâm.
            </p>
            <p className="text-[11px] text-[#8bb96e] mt-2 tracking-widest uppercase font-medium">© 2026 MOMBI CARE SPA</p>
          </div>
          
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white mb-6">Liên kết nhanh</h4>
            <ul className="flex flex-col gap-4 text-sm text-[#d6e5c9] font-light">
              <li><Link href="/" className="hover:text-[#a9d18c] transition-colors flex items-center gap-2"><span className="text-[#8bb96e] text-xs">▹</span> Trang chủ</Link></li>
              <li><Link href="/chuyen-nha" className="hover:text-[#a9d18c] transition-colors flex items-center gap-2"><span className="text-[#8bb96e] text-xs">▹</span> Chuyện nhà Mombi</Link></li>
              <li><Link href="/phieu-qua-tang" className="hover:text-[#a9d18c] transition-colors flex items-center gap-2"><span className="text-[#8bb96e] text-xs">▹</span> Phiếu quà tặng</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white mb-6">Các dịch vụ</h4>
            <ul className="flex flex-col gap-4 text-sm text-[#d6e5c9] font-light">
              <li><Link href="/dich-vu/massage-thu-gian" className="hover:text-[#a9d18c] transition-colors flex items-center gap-2"><span className="text-[#8bb96e] text-xs">▹</span> Gội đầu dưỡng sinh</Link></li>
              <li><Link href="/dich-vu/massage-thu-gian" className="hover:text-[#a9d18c] transition-colors flex items-center gap-2"><span className="text-[#8bb96e] text-xs">▹</span> Massage vai cổ gáy</Link></li>
              <li><Link href="/dich-vu/cham-soc-da" className="hover:text-[#a9d18c] transition-colors flex items-center gap-2"><span className="text-[#8bb96e] text-xs">▹</span> Chăm sóc da cơ bản</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white mb-6">Thông tin liên hệ</h4>
            <ul className="flex flex-col gap-4 text-sm text-[#d6e5c9] font-light leading-relaxed">
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
    </div>
  );
}