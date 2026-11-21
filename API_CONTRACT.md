# Tài liệu thống nhất API — Worker News

Tài liệu này là hợp đồng dữ liệu chung giữa frontend và backend. Backend hiện dùng Express và MySQL local; khi chuyển database sang RDS, hợp đồng API không đổi.

## Thông tin chung

- Base URL local: `http://localhost:3001/api`
- Frontend cấu hình base URL qua `VITE_API_URL` trong file `.env` ở thư mục gốc.
- Dữ liệu và lỗi đều trả về JSON; tên trường API dùng `snake_case` khi có nhiều từ.
- Frontend ánh xạ `published_at` thành `publishedAt` trong kiểu `Article`.
- Ngày `published_at` trả về theo chuỗi ISO 8601 do MySQL driver tuần tự hóa, ví dụ `2026-11-02T00:00:00.000Z`.
- API chỉ đọc dữ liệu; hiện chưa có endpoint tạo, sửa hoặc xóa.

## Endpoint

| Method | Đường dẫn | Thành công | Mục đích |
|---|---|---|---|
| `GET` | `/health` | `200` | Kiểm tra API và kết nối database |
| `GET` | `/categories` | `200` | Lấy danh sách danh mục |
| `GET` | `/articles` | `200` | Lấy danh sách bài viết mới nhất trước |
| `GET` | `/articles/:id` | `200` | Lấy một bài viết theo ID |

## Cấu trúc dữ liệu

### Danh mục

`GET /categories` trả về một mảng:

```json
[
  {
    "slug": "the-thao",
    "name": "Thể thao"
  }
]
```

`slug` hiện nhận một trong các giá trị: `thoi-su`, `the-gioi`, `kinh-doanh`, `cong-nghe`, `the-thao`, `giai-tri`.

### Bài viết

`GET /articles` trả về một mảng; `GET /articles/:id` trả về một object:

```json
{
  "id": 2,
  "slug": "doi-tuyen-thang-dam",
  "title": "Đội tuyển thắng đậm trận mở màn",
  "summary": "Chiến thắng 3-0 trên sân nhà giúp đội tuyển dẫn đầu bảng.",
  "content": null,
  "image": "/images/bg2.jpg",
  "author": "Trần Thị B",
  "category": "the-thao",
  "published_at": "2026-10-31T00:00:00.000Z",
  "featured": 1
}
```

| Trường | Kiểu | Quy tắc |
|---|---|---|
| `id` | number | Số nguyên dương, duy nhất |
| `slug` | string | Slug duy nhất của bài |
| `title` | string | Tiêu đề |
| `summary` | string | Nội dung tóm tắt |
| `content` | string hoặc `null` | Nội dung đầy đủ, có thể chưa nhập |
| `image` | string hoặc `null` | URL hoặc đường dẫn ảnh |
| `author` | string hoặc `null` | Tên tác giả |
| `category` | string | Slug danh mục đã khai báo |
| `published_at` | string | Ngày giờ ISO 8601 |
| `featured` | number hoặc boolean | `1`/`true` nếu là tin nổi bật; nếu không là `0`/`false` |

## Lỗi

Lỗi có cấu trúc:

```json
{
  "message": "Article not found."
}
```

| HTTP status | Ý nghĩa |
|---|---|
| `400` | ID không phải số nguyên dương hoặc JSON request sai định dạng |
| `403` | Origin không nằm trong `FRONTEND_URL` |
| `404` | Không tìm thấy bài viết hoặc đường dẫn API |
| `500` | Lỗi xử lý request hoặc truy vấn database |
| `503` | API hoạt động nhưng không kết nối được database (`/health`) |

Ví dụ `GET /articles/abc`:

```json
{
  "message": "Article id must be a positive integer."
}
```

Ví dụ `GET /articles/99999` khi ID không tồn tại:

```json
{
  "message": "Article not found."
}
```

## CORS và cấu hình

- Backend đọc `FRONTEND_URL` từ `server/.env`. Có thể khai báo nhiều origin, phân cách bằng dấu phẩy.
- Frontend đọc `VITE_API_URL` từ `.env` tại thư mục gốc, mặc định là `http://localhost:3001/api`.
- Thông tin MySQL/RDS chỉ được lưu ở cấu hình backend (`server/.env`), không đặt trong biến `VITE_*`.
- Không commit các file `.env` có mật khẩu.

## Thử API local

```powershell
Invoke-RestMethod http://localhost:3001/api/health
Invoke-RestMethod http://localhost:3001/api/categories
Invoke-RestMethod http://localhost:3001/api/articles
Invoke-RestMethod http://localhost:3001/api/articles/1
```
