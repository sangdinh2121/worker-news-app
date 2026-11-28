# Worker News

Ứng dụng tin tức gồm frontend React/Vite và backend Express kết nối MySQL. Khi chuyển sang Amazon RDS, backend tiếp tục dùng MySQL; chỉ cần cập nhật biến môi trường database.

## Yêu cầu

- Node.js 20.6 trở lên
- MySQL 8 trở lên

## Khởi tạo MySQL local

1. Mở MySQL Workbench và kết nối MySQL local.
2. Mở, chạy toàn bộ `server/sql/schema.sql`, sau đó mở và chạy `server/sql/seed.sql`.

3. Tạo cấu hình backend rồi nhập mật khẩu MySQL local vào `server/.env`:

```powershell
Copy-Item server\.env.example server\.env
```

Thay `JWT_SECRET` trong `server/.env` bằng một chuỗi bí mật ngẫu nhiên; backend dùng giá trị này để ký token đăng nhập.

Không commit `server/.env`; file này đã được Git ignore.

4. Cấu hình URL API cho frontend:

```powershell
Copy-Item .env.example .env
```

## Chạy ứng dụng

Mở hai terminal trong thư mục dự án:

```powershell
npm run server
```

```powershell
npm run dev
```

Mở địa chỉ frontend do Vite in ra, thường là `http://localhost:5173`.

## API backend

- `GET /api/health` — kiểm tra backend và database
- `GET /api/categories` — danh sách danh mục
- `GET /api/articles` — danh sách bài viết
- `GET /api/articles/:id` — bài viết theo ID
- `GET /api/articles/:id/comments` — bình luận của bài viết
- `POST /api/articles/:id/comments` — gửi bình luận (cần đăng nhập)
- `POST /api/auth/register` và `POST /api/auth/login` — tạo tài khoản và đăng nhập

Hợp đồng endpoint, cấu trúc dữ liệu và mã lỗi được mô tả trong [API_CONTRACT.md](API_CONTRACT.md).

Chạy kiểm thử API:

```powershell
npm run test:server
```

## Chuyển MySQL local sang Amazon RDS

Tạo MySQL database trên RDS, chạy `schema.sql` và `seed.sql` trên database đó, rồi cập nhật `server/.env`:

```env
DB_HOST=<RDS endpoint>
DB_PORT=3306
DB_NAME=worker_news
DB_USER=<database user>
DB_PASSWORD=<database password>
DB_SSL=true
```

Đặt `FRONTEND_URL` thành origin của frontend đã deploy. Mở cổng 3306 trong security group chỉ cho máy chủ backend truy cập; không mở RDS cho toàn Internet. Không đặt thông tin database trong biến `VITE_*` vì các biến đó được đưa vào mã frontend.

RDS chỉ cung cấp database; backend Node.js cần được triển khai riêng. Lưu ý ảnh mẫu hiện nằm trong thư mục `public/images`; khi deploy backend riêng khỏi frontend, cần chuyển ảnh sang kho lưu trữ dùng chung hoặc cập nhật URL ảnh.
