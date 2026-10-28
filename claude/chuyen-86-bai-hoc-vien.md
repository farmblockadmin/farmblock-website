# Chuyển 86 bài Học viện từ farmblock.vn sang web mới (GitHub Pages)

_Cập nhật: 28/10/2026. Repo: `trungcien0120/farmblock-landing` (nhánh `main`). Web: https://trungcien0120.github.io/farmblock-landing/_

## 0. Trạng thái hiện tại

- [x] Dữ liệu 86 bài, ảnh bìa (172 file WebP), 82 trang bài và `sitemap.xml` đã tải lên repo.
- [x] Đã dọn các file `.json` đặt nhầm ở thư mục gốc.
- [ ] Kiểm tra lần cuối trên web (mục 7): đủ 8 trang × 12 bài, ảnh hiện đủ, mở thử vài bài trên máy tính và điện thoại.
- [ ] Xoá `.github/workflows/xoa-json-thua.yml` nếu đã tải lên repo (file công cụ dùng một lần).

## 1. Kết quả

- **86 bài** (12 bài/trang × 8 trang, trang cuối 2 bài), đăng từ 15/05/2025 đến 02/04/2026, khoảng 103.000 chữ.
- Mỗi bài có đúng 1 ảnh bìa PNG 1672×941. Thân bài chỉ có tiêu đề mục `<h3>` và đoạn văn.
- 4 bài đã có sẵn trong repo từ trước (Tưới Tiêu, Nước Cứng, Chất Lượng Nước Tưới, Tưới Quá Nhiều) được **giữ nguyên**. 82 bài còn lại là bài mới.
- Chủ đề: Cơ bản 69, Nâng cao 17. Theo nội dung: Cấu tạo và tính chất đất 17, Hóa học đất 14, Hệ sinh thái nông nghiệp 13, Dinh dưỡng cây trồng 12, Những khái niệm cơ bản 12, Nước 10, Sinh học đất 7, Hệ thống tưới 1.
- Hệ thống tự nhận biết trên 82 bài mới: 58 hộp Định nghĩa nhanh, 44 bảng tổng quan, 76 nhóm bước đánh số, 74 nhóm thẻ "Đối với…", 1 hộp Lưu ý. Bài nào cũng có ít nhất một điểm nổi bật.
- `sitemap.xml` mới: 95 địa chỉ (9 trang chính + 86 bài).

## 2. Nguồn dữ liệu (API của web cũ)

Trang farmblock.vn/academy/ dựng bằng JavaScript nên không đọc trực tiếp được. Dữ liệu lấy từ API:

- Danh sách: `https://farmblock.vn/api/academies?locale=vi&page=1&per_page=12` (8 trang)
- Bài đơn: `https://farmblock.vn/api/academies/<slug>?locale=vi`
- Ảnh bìa: `https://admin.farmblock.vn/storage/academies/<tên>.png`

Mỗi bài có: `slug`, `title`, `excerpt`, `content` (HTML), `featured_image_url`, `published_at`, `tags`, `author`.

Lưu ý: ảnh ở `admin.farmblock.vn` chặn tải từ trang `farmblock.vn` (lỗi CORS). Muốn tải ảnh phải chạy script trên một tab của chính `admin.farmblock.vn`.

## 3. Quy tắc chuyển đổi

- `<h3>` của web cũ thành mục chính (`h2`) của Học viện mới, nên mục lục không bị trống.
- Bỏ đoạn trống `<p><br></p>`, bỏ chữ in đậm đầu đoạn (giữ nguyên chữ), bỏ số thứ tự đầu mục ở 6 bài cũ ("1. Định nghĩa" thành "Định nghĩa") để hệ thống nhận ra thẻ Định nghĩa.
- 6 tiêu đề viết HOA được đổi về dạng "Năng Suất Là Gì?": Năng Suất Là Gì?, Cây Hàng Năm Và Cây Lâu Năm Khác Nhau Thế Nào?, Chu Kỳ Cây Trồng Là Gì?, Mùa Vụ Là Gì?, Vùng Trồng Là Gì?, Nông Học Là Gì?.
- "FarmBlock" thành "Farmblock". Tác giả ghi "Farmblock Admin".
- Ảnh trỏ tới `img/hv/<slug>.webp` (bìa) và `img/hv/<slug>-s.webp` (ảnh nhỏ cho thẻ bài).
- Số phút đọc tính theo `HV.render` (số chữ / 230).

## 4. Cấu trúc file trong repo

| Loại | Đường dẫn |
|---|---|
| Dữ liệu từng bài | `hoc-vien/bai/<slug>.json` (82 file mới) |
| Danh sách bài | `hoc-vien/index.json` (86 mục, mới nhất trước) |
| Trang bài | `hoc-vien-<slug>.html` ở **thư mục gốc** (82 file mới) |
| Ảnh | `img/hv/<slug>.webp` và `img/hv/<slug>-s.webp` (172 file) |
| Sơ đồ trang | `sitemap.xml` ở thư mục gốc |

Định dạng một file bài: `slug, title, excerpt, date, tags, author, cover, thumb, off, blocks` với `blocks` là mảng `{t:"h2"|"p", x:"chữ"}`.

## 5. Các bước đã làm

1. Lấy nội dung 86 bài từ API thành `noi-dung.json`.
2. Tải 86 ảnh bìa bằng `tai-anh.js` chạy trong Console của tab `admin.farmblock.vn`; script nén sang WebP (ảnh lớn 1672px, ảnh nhỏ 640px) và ghi vào một thư mục đã chọn.
3. Chuyển nội dung sang định dạng Học viện (`convert.py`).
4. Dựng trang bài bằng đúng `hv.js` của dự án (`build_pages.js`). Khuôn trang (`tpl.html`) được suy ra từ trang bài Tưới Tiêu đang chạy. Kiểm tra: dựng lại bài Tưới Tiêu từ khuôn cho kết quả **giống từng ký tự** với trang thật.
5. Tạo `sitemap.xml` và đóng thành 2 gói tải lên.

## 6. Tải lên GitHub (không cần code)

GitHub chỉ nhận khoảng 100 file mỗi lần tải. **File được đặt ở đúng thư mục mà địa chỉ trang tải lên chỉ tới**, nên dùng đúng địa chỉ cho từng nhóm:

| Nhóm | Trang tải lên |
|---|---|
| 172 ảnh WebP (chia 2 lần, mỗi lần 86) | `https://github.com/trungcien0120/farmblock-landing/upload/main/img/hv` |
| 82 file JSON bài | `https://github.com/trungcien0120/farmblock-landing/upload/main/hoc-vien/bai` |
| `index.json` | `https://github.com/trungcien0120/farmblock-landing/upload/main/hoc-vien` |
| 82 trang `.html` + `sitemap.xml` | `https://github.com/trungcien0120/farmblock-landing/upload/main` |

Mỗi lần kéo xong bấm **Commit changes**. Khi kéo thả, chọn các file bên trong thư mục giải nén, không kéo cả thư mục ngoài cùng.

## 7. Kiểm tra sau khi tải lên

1. Đợi 1–2 phút để GitHub Pages cập nhật.
2. Mở `https://trungcien0120.github.io/farmblock-landing/hoc-vien/index.json`: phải thấy danh sách dài, có `nong-hoc-la-gi`.
3. Mở trang `hoc-vien.html` rồi nhấn **Ctrl+F5**: phải có 8 trang, mỗi trang 12 bài, ảnh hiện đủ.
4. Bấm thử vài bài (Nông Học Là Gì, Đất Bazan Là Gì): có mục lục, ảnh bìa, các thẻ nổi bật.

## 8. Việc còn lại / lưu ý

- Sau khi kiểm tra web xong (mục 7), đánh dấu hoàn tất ở mục 0.
- Người viết đăng bài mới qua trang Soạn bài thì bài vào thẳng repo. Trước khi chép đè `index.json` hay `sitemap.xml` lần sau, luôn kiểm tra repo có bài mới không.
- Nếu có đăng ký Google Search Console: gửi lại `sitemap.xml` để Google biết có thêm 82 bài.
- Muốn đổi sang tên miền `farmblock.vn`: sửa `site` trong `hoc-vien/config.json`, thêm file `CNAME`, trỏ DNS về GitHub Pages (xem ghi chú dự án vòng 19).
- Công cụ để dựng lại trang bài (`cong-cu-chuyen-doi.zip`): `convert.py`, `build_pages.js`, `tpl.html`, `verify.js`. Cần Node.js và `hv.js` của dự án.

## 9. Danh sách file bàn giao

| File | Dùng để |
|---|---|
| `goi-1-du-lieu-hoc-vien.zip` | 82 file `hoc-vien/bai/*.json` + `hoc-vien/index.json` |
| `goi-2-trang-bai-va-sitemap.zip` | 82 trang `hoc-vien-<slug>.html` + `sitemap.xml` |
| `tai-anh.js` | Script Console tải và nén 86 ảnh bìa (chạy trên tab `admin.farmblock.vn`) |
| `cong-cu-chuyen-doi.zip` | Script chuyển đổi, dựng trang, khuôn trang |
| `xoa-json-thua.yml` | Workflow xoá file JSON đặt nhầm (dùng một lần) |
