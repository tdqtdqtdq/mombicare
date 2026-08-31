# Mombi quản lý nội bộ

1. Tạo một Supabase project và điền các biến trong `.env.local` theo `.env.example`.
2. Mở **SQL Editor** trong Supabase, chạy file `migrations/20260831_management.sql`.
3. Tạo tài khoản chủ đầu tiên ở **Authentication > Users**. Sau đó chạy câu lệnh bootstrap cuối file migration để đổi tài khoản đó thành `owner`.
4. Đăng nhập `/quan-ly`, tạo nhân viên, dịch vụ và quy tắc hoa hồng trước khi nhập doanh thu.

Không đưa `SUPABASE_SERVICE_ROLE_KEY` vào biến bắt đầu bằng `NEXT_PUBLIC_` hoặc gửi qua Zalo/email. Khóa này chỉ dùng cho route tạo nhân viên ở server.
