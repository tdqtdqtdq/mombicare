# Hướng dẫn sử dụng Sổ doanh thu Mombi Care Spa

> Tài liệu dành cho Chủ spa và nhân viên. Truy cập khu vực quản lý tại **Website công khai → Quản lý** hoặc đường dẫn `/quan-ly`.

## 1. Đăng nhập và bảo mật

1. Mở trang **Quản lý doanh thu**.
2. Nhập **Tên đăng nhập** và mật khẩu được bàn giao riêng.
3. Nhấn **Đăng nhập quản lý**.
4. Ngay lần đầu sử dụng, bấm **Đổi mật khẩu** ở góc trên bên phải và tự đặt mật khẩu mới (tối thiểu 8 ký tự).

| Đối tượng | Tên đăng nhập |
| --- | --- |
| Chủ spa | `mombicare` |
| Nhân viên | Dùng tên của mình, không dấu và không khoảng trắng. Ví dụ: `trang`, `mien`, `trinh` |

**Lưu ý bảo mật:** mật khẩu không được ghi trong tài liệu GitHub. Chủ spa bàn giao riêng cho từng người và nhân viên phải đổi sau lần đăng nhập đầu tiên.

## 2. Phân quyền

| Chức năng | Chủ spa | Nhân viên |
| --- | --- | --- |
| Xem tổng quan, mục tiêu tháng | Có | Chỉ mục tiêu/doanh số của mình |
| Nhập doanh thu | Có | Có |
| Sửa giá dịch vụ, quy tắc hoa hồng | Có | Không |
| Ghi khoản chi | Có | Không |
| Xem/chốt/xuất toàn bộ hoa hồng | Có | Chỉ xem dữ liệu liên quan |
| Tạo, tạm ngưng, xóa tài khoản | Có | Không |

## 3. Quy trình dùng mỗi ngày

1. **Chủ spa** kiểm tra danh mục dịch vụ và quy tắc hoa hồng trước khi bắt đầu tháng.
2. **Nhân viên** ghi từng lượt làm dịch vụ ngay khi hoàn thành.
3. **Chủ spa** ghi các khoản chi thực tế trong ngày.
4. Cuối ngày kiểm tra **Sổ thu chi**; các dòng được gom theo ngày và có thể đóng/mở để xem gọn.
5. Cuối tháng đối chiếu **Hoa hồng & lương**, xuất Excel rồi mới chốt kỳ.

## 4. Nhập doanh thu

Vào **Nhập doanh thu**, điền theo từng lượt khách:

1. Chọn **Ngày thực hiện**.
2. Nhập **Tên khách hàng**. Với khách chưa cung cấp tên có thể ghi “Khách lẻ”.
3. Chọn **Dịch vụ** và **Hình thức**.
4. Chọn **Kỹ thuật viên** đã trực tiếp thực hiện.
5. Chọn **Người tư vấn** nếu có.
6. Nhập ghi chú nếu cần, sau đó bấm **Lưu doanh thu**.

### Quy tắc tiền quan trọng

- Giá gói và thực thu ở tài khoản nhân viên được khóa theo danh mục do Chủ spa thiết lập; nhân viên không tự đổi giá.
- **KTV** nhận hoa hồng theo giá gói/giá niêm yết của dịch vụ, không theo số khách được giảm giá.
- **Tư vấn** nhận theo tỷ lệ riêng của người được chọn, tính trên thực thu.
- Với **Gói cũ/Tặng**, thực thu có thể là 0 nhưng KTV vẫn được tính theo giá gói nếu quy tắc áp dụng.
- Với **Trả tua ngoài**, ghi ở nhóm riêng; khoản chi ngoài không trộn vào hoa hồng nội bộ.

### Hủy hoặc xóa một dòng

- Nếu ghi nhầm dòng đã hoàn tất: Chủ spa bấm **Hủy ghi nhận**. Dòng vẫn lưu để đối soát nhưng không tính vào doanh thu/hoa hồng.
- Nếu là dòng đã hủy và chắc chắn không cần lưu: bấm **Xóa hẳn**.

## 5. Ghi khoản chi

Trong trang **Nhập doanh thu**, phần **Ghi khoản chi khác** chỉ dành cho Chủ spa.

1. Chọn ngày chi và nhóm chi.
2. Ghi nội dung rõ ràng, ví dụ: “Mua dầu gội”, “Mua nguyên vật liệu”, “Đồ cúng”.
3. Nhập số tiền chi và ghi chú (nếu có).
4. Bấm **Lưu khoản chi**.

Sổ thu chi hiển thị tiền thu, tiền chi và chênh lệch theo từng ngày. Bấm tiêu đề **Ngày YYYY-MM-DD** để đóng/mở các dòng của ngày đó. Có bộ lọc theo loại sổ, nhân viên, hình thức thu, nhóm chi và trạng thái.

## 6. Dịch vụ và quy tắc hoa hồng (Chủ spa)

Vào **Dịch vụ & quy tắc**:

- Tạo/sửa dịch vụ và giá niêm yết trước khi nhân viên dùng.
- Thiết lập quy tắc KTV theo nhóm dịch vụ hoặc từng dịch vụ.
- Thiết lập quy tắc tư vấn riêng cho từng nhân viên tư vấn.
- Bấm **Hủy áp dụng** để dừng một quy tắc nhưng vẫn giữ lịch sử; chỉ dùng **Xóa hẳn** khi quy tắc được tạo nhầm và không còn cần đối soát.

Quy tắc mới chỉ áp dụng cho các lượt doanh thu tạo sau đó; hoa hồng của lượt cũ được giữ nguyên để sổ không bị lệch.

## 7. Hoa hồng và lương

Vào **Hoa hồng & lương** và chọn tháng xem.

- Phần **Hoa hồng kỹ thuật** và **Hoa hồng tư vấn** được tách riêng.
- Dữ liệu được gom theo ngày; bấm tiêu đề ngày để thu gọn/mở rộng.
- Chọn nhân viên ở từng phần để xem nhanh từng người.
- Bấm **Xuất Excel** để tải bảng có tiêu đề, cột rõ ràng, định dạng tiền và dòng tổng cộng tự tính.
- Chỉ bấm **Chốt kỳ lương** sau khi đã kiểm tra xong. Sau khi chốt, dữ liệu kỳ đó dùng để thanh toán và không nên sửa tùy tiện.

## 8. Mục tiêu tháng

- Chủ spa vào **Tổng quan**, chọn tháng và nhập mục tiêu cho từng nhân viên, sau đó bấm **Lưu mục tiêu**.
- Nhân viên chỉ xem mục tiêu của mình, doanh số hiện có và số còn thiếu.

## 9. Quản lý nhân viên (Chủ spa)

Vào **Nhân viên** để:

- Tạo tài khoản mới: nhập tên hiển thị, chọn vai trò và mật khẩu tạm. Tên đăng nhập tự sinh từ tên hiển thị, không dấu/không khoảng trắng.
- Tra tên đăng nhập tại cột **Tên đăng nhập**.
- Tạm ngưng tài khoản khi nhân viên nghỉ; dữ liệu cũ vẫn được giữ.
- Xóa hẳn chỉ khi tài khoản chưa có doanh thu hoặc hoa hồng. Nếu đã phát sinh dữ liệu, dùng **Tạm ngưng** để không làm mất lịch sử đối soát.

## 10. Xuất file và lưu trữ

- **Sổ thu chi**: bấm **Xuất Excel** tại tiêu đề sổ để nhận file doanh thu/chi phí.
- **Hoa hồng & lương**: bấm **Xuất Excel** để nhận file hoa hồng tháng.
- Nên lưu file cuối tháng trong thư mục theo định dạng `Năm-Tháng`, ví dụ `2026-08`, trước khi chốt lương.

## 11. Checklist cuối tháng

- [ ] Tất cả lượt dịch vụ đã có ngày, khách, dịch vụ và KTV.
- [ ] Các khoản chi đã được nhập đúng ngày và đúng nhóm.
- [ ] Dòng ghi nhầm đã hủy, không xóa mất dữ liệu cần đối soát.
- [ ] Đối chiếu tổng thu/chi với tiền thực tế.
- [ ] Kiểm tra riêng hoa hồng KTV, tư vấn và tua ngoài.
- [ ] Xuất hai file Excel lưu trữ.
- [ ] Chốt kỳ lương sau khi Chủ spa xác nhận.

## 12. Ảnh hướng dẫn

Ảnh chụp từng màn hình sẽ được bổ sung tại đây sau khi trình duyệt bàn giao được kết nối:

1. Màn hình đăng nhập và cách nhập tên đăng nhập.
2. Màn hình Nhập doanh thu với các trường bắt buộc.
3. Sổ thu chi đóng/mở theo ngày và nút Xuất Excel.
4. Hoa hồng kỹ thuật/tư vấn đóng/mở theo ngày.
5. Danh sách nhân viên với cột Tên đăng nhập.
6. Hộp Đổi mật khẩu.
