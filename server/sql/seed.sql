USE worker_news;

INSERT INTO categories (slug, name) VALUES
    ('thoi-su', 'Thời sự'),
    ('the-gioi', 'Thế giới'),
    ('kinh-doanh', 'Kinh doanh'),
    ('cong-nghe', 'Công nghệ'),
    ('the-thao', 'Thể thao'),
    ('giai-tri', 'Giải trí')
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO articles
    (id, title, slug, category_slug, summary, image, author, published_at, featured)
VALUES
    (1, 'Giá xăng giảm mạnh từ chiều nay', 'gia-xang-giam-manh', 'kinh-doanh',
     'Giá xăng điều chỉnh giảm, người dân và doanh nghiệp vận tải được hưởng lợi.',
     '/images/background.jpg', 'Nguyễn Văn A', '2026-10-30', TRUE),
    (2, 'Đội tuyển thắng đậm trận mở màn', 'doi-tuyen-thang-dam', 'the-thao',
     'Chiến thắng 3-0 trên sân nhà giúp đội tuyển dẫn đầu bảng.',
     '/images/bg2.jpg', 'Trần Thị B', '2026-10-31', TRUE),
    (3, 'Ra mắt mẫu điện thoại gập mới', 'dien-thoai-gap-moi', 'cong-nghe',
     'Thiết kế mỏng hơn, pin lớn hơn và giá dễ tiếp cận hơn.',
     '/images/bg3.jpg', 'Lê Văn C', '2026-11-01', TRUE),
    (4, 'Lễ hội âm nhạc cuối năm công bố dàn nghệ sĩ', 'le-hoi-am-nhac', 'giai-tri',
     'Hơn 30 nghệ sĩ tham gia đêm nhạc lớn nhất mùa lễ hội.',
     '/images/bg4.jpg', 'Phạm Thị D', '2026-10-29', FALSE),
    (5, 'Kỳ họp Quốc hội thảo luận kế hoạch năm tới', 'ky-hop-quoc-hoi', 'thoi-su',
     'Nhiều nội dung về kinh tế - xã hội được đưa ra thảo luận.',
     '/images/bg5.jpg', 'Hoàng Văn E', '2026-10-28', FALSE),
    (6, 'Thị trường chứng khoán tăng điểm phiên đầu tuần', 'chung-khoan-tang-diem', 'kinh-doanh',
     'Nhóm cổ phiếu ngân hàng dẫn dắt đà tăng của thị trường.',
     '/images/bg6.jpg', 'Đỗ Thị F', '2026-11-02', FALSE)
ON DUPLICATE KEY UPDATE
    title = VALUES(title),
    summary = VALUES(summary),
    image = VALUES(image),
    author = VALUES(author),
    category_slug = VALUES(category_slug),
    published_at = VALUES(published_at),
    featured = VALUES(featured);
