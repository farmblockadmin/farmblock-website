# FarmBlock website – tóm tắt dự án (đọc file này thay vì đọc lại Figma/PDF)
_Cập nhật: 28/10/2026, chuyển sang repo mới

## Vòng 25 (30/10/2026) — định vị "doanh nghiệp công nghệ nông nghiệp"
- Câu định vị (CHƯA có giấy chứng nhận DN KH&CN nên KHÔNG viết "doanh nghiệp khoa học và công nghệ"): "Doanh nghiệp công nghệ nông nghiệp, phát triển theo định hướng khoa học công nghệ". Sứ mệnh: "Đưa khoa học và dữ liệu vào từng vùng trồng, để người nông dân Việt Nam làm nhẹ hơn, ghi chép rõ hơn và nông sản Việt đi xa hơn."
- Trang chủ: nhãn hero "Doanh nghiệp công nghệ nông nghiệp", tiêu đề "Kiến tạo hạ tầng vận hành mới cho nông nghiệp Việt Nam" (3 dòng, cỡ chữ 4.1vw/4.1rem); khối mới "Ba việc Farmblock làm, nối thành một vòng" (.pillars.loop) trước lộ trình; 3 thẻ đóng góp dựa trên bằng chứng (Sổ Rẫy miễn phí, chia sẻ kiến thức + tập huấn 04–05/11 — đổi sang thì quá khứ sau 05/11, hồ sơ vùng trồng); khối Niềm tin = ghi nhận thật + 40 ha / 22 ha.
- Chân trang mọi trang + khuôn Học viện: dòng `.fpos` câu định vị dưới tên công ty. Giữ tên "Ia Ko" (chủ dự án không muốn "Vùng trồng 01").
- Bảng tin: 2 bài mới (bai-viet-tap-huan-khuyen-nong-ia-ko.html, bai-viet-vuon-ia-ko.html), dựng từ khung bài Sổ tay đại lý; ảnh bìa cắt từ air-low / air-high2.
- Sổ Rẫy hoàn toàn miễn phí (đã ghi trên trang chủ). Mốc 2028 · 200 ha tạm giữ.

## Vòng 24 (30/10/2026) — sửa theo rà soát nội dung
- Thống nhất tên: "Ia Ko" (bỏ "IaKo #01", "vườn mẫu IaKo" → "vườn Ia Ko"), "Sổ Rẫy", tên pháp lý chân trang "Công ty Cổ phần Công nghệ Nông nghiệp FarmBlock" (thương hiệu trong bài vẫn "Farmblock"). Menu: "Xem vườn trực tuyến". Địa chỉ giữ "Số 7".
- Bỏ ngôn ngữ đầu tư: câu kết "Tối ưu đầu tư." → "Minh bạch từng khu trồng."; thẻ "Nhà đầu tư" (trang chủ) → "Chủ khu trồng"; Mô hình, Chính sách, Sổ tay đại lý (kèm sửa lỗi chữ, "Handbook" → "Sổ tay").
- Học viện: sửa 32 bài (ngôn ngữ đầu tư, kiến thức sai, thiếu tiêu đề "Ý nghĩa…"). Dựng lại trang bài bằng `HV.page(_mau.html, bai/<slug>.json, site)` của `hoc-vien/hv.js` (cho kết quả giống từng ký tự với trang đang chạy) — sửa JSON/khuôn rồi dựng lại cả 86 bài.
- Chưa sửa (chủ dự án dặn để sau): số thiết bị, đối tác quốc tế, câu Sổ Rẫy/AI, Mốc 1 2025, trang Bảng giá phần "một năm ở Ia Ko", ảnh tiêu/sầu riêng/robot. Chưa chuyển farmblock.vn.

## TỪ 28/10/2026: CHỈ DÙNG REPO MỚI
- **Repo duy nhất:** https://github.com/farmblockadmin/farmblock-website (public, nhánh main). Commit đứng tên farmblockadmin <farmblockadmin@gmail.com>, **không** có dòng Co-Authored-By/Claude.
- **Web chạy thật:** https://farmblockadmin.github.io/farmblock-website/ (GitHub Pages). Mọi canonical/og/sitemap/robots và `hoc-vien/config.json` (site + repo) đã đổi sang địa chỉ này.
- Trang Soạn bài đăng bài vào repo mới (đọc `repo` trong `hoc-vien/config.json`); người viết cần fine-grained token của tài khoản farmblockadmin, chỉ repo farmblock-website, Contents: Read and write.
- Repo cũ `trungcien0120/farmblock-landing` và web cũ trungcien0120.github.io/farmblock-landing **không dùng nữa** (để nguyên, không push vào). Mọi chỗ bên dưới nhắc repo/web cũ là lịch sử.
- Ghi chú dự án nằm trong repo: `claude/farmblock-brief.md`, `claude/chuyen-86-bai-hoc-vien.md`. Máy làm việc: bản clone ở `D:\Source\farmblock-landing-repo`.
- Trước khi sửa: luôn `git pull` (người viết có thể vừa đăng bài qua Soạn bài).

## Trạng thái hiện tại
- **Web chạy thật:** https://trungcien0120.github.io/farmblock-landing/ (GitHub Pages)
- **Repo:** https://github.com/trungcien0120/farmblock-landing (nhánh main, gồm `index.html` + `img/`). Commit đứng tên trungcien0120 <trungcien0120@gmail.com>, **không** có dòng Co-Authored-By/Claude. (Phiên 20/10 và 23/10 chỉ có quyền đọc repo — push cần cấp quyền ghi.)
- **Bản xem thử mới nhất (cả 3 trang):** https://claude.ai/artifact/AAWnazEHVQM6rmvMDmgkg6 (v5 = vòng 10). Bản cũ: https://claude.ai/artifact/UrhMxa1aFD4jhsPBD9a1s6 (v11, trước vòng 7).
- Chủ dự án test trên Chrome màn 24,1" 16:9 (1920px) và Safari iPhone 15 Pro Max (430px).
- **Quy tắc:** trước khi push GitHub phải cho chủ dự án xem bản artifact và hỏi ý kiến.

## ĐÃ PUSH ee3c757 (24/10/2026 05:40): cả 7 trang (thêm bang-tin.html, bai-viet-so-tay-dai-ly.html). Xem thử v18 = bản đang chạy.
- Vòng 18b: nút trong mục lục bị kiểu `.toc a` đè (block, viền trái) → `.toc .tool` riêng; ảnh thẻ bài nổi bật phủ kín chiều cao trên máy tính (ảnh absolute, object-fit cover, min-height 340px).

## Vòng 18 (24/10/2026 sáng) — Bảng tin `bang-tin.html` + bài `bai-viet-so-tay-dai-ly.html`
- Nguồn: `blog/article.md` (chữ bài viết chép nguyên văn từ ảnh chụp trang cũ, mỗi dòng một khối: H2/H2s/H3/P/I/L/LV/AR), `blog/blog.css`, `blog_build.py` (khung lấy từ out/mo-hinh.html, bỏ khối kết video). Chạy `python3 blog_build.py` sau khi sửa.
- **Thêm bài mới:** thêm một mục vào mảng `POSTS` trong blog_build.py (slug, title, sub, date, cat, img, ex) + tạo file nội dung; trang danh sách tự dựng: bài mới nhất thành thẻ lớn "Bài mới nhất", các bài khác vào lưới 3 cột, bộ lọc chủ đề (Tất cả / Tài liệu / Tin tức / Câu chuyện vườn), ô "Bài viết mới đang được ươm mầm" khi ít hơn 3 bài.
- Trang bài viết: thanh tiến độ đọc, mục lục dính bên trái (7 mục, sáng theo vị trí đọc; điện thoại thu gọn), 14 phút đọc, nút Sao chép liên kết, cột chữ 68 ký tự; ma trận xử lý vi phạm thành 4 thẻ màu xanh → vàng → cam → đỏ (chữ giữ nguyên).
- Ảnh bìa `img/blog-sotay.webp` (1672×941). Chữ "FarmBlock" trong bài đổi thành "Farmblock" theo quy tắc chung.
- Menu cả 5 trang: "Bảng tin" → bang-tin.html; chân trang "Bảng tin Farmblock" → bang-tin.html; khối Bảng tin trang Về chúng tôi trỏ vào bài viết và trang danh sách. Chỉ còn "Học viện" là Sắp ra mắt.

## ĐÃ PUSH 9b907d6 (24/10/2026 05:20): cả 5 trang (thêm mo-hinh.html, vòng 17–17c). Xem thử v16 = bản đang chạy.

## Vòng 17c (24/10 sáng) — Mô hình
- Hero: bỏ bóng đổ vừa thêm, trả về như cũ (vẫn không có số 01/02/03).
- Khối Từ thực địa: đoạn cuộn ghim 3 → 2,1 màn hình (điện thoại 2,6 → 1,8); nghỉ ở mốc 100% ngắn lại, chụm nhanh hơn, dòng "Mỗi bức ảnh là một vùng trồng" hiện sớm.
- Ảnh thực tế: chạy bằng JS (55px/giây, điện thoại 38), KHÔNG dừng khi rê chuột (lỗi cũ: rê chuột trên khối làm dừng nên tưởng không chạy); kéo chuột/vuốt để xem, có quán tính rồi chạy tiếp; chỉ chạy khi khối trong màn hình.

## Vòng 17b (24/10 sáng) — Mô hình, xem thử v15, CHƯA push
- Hero: bỏ số 01/02/03 trên 3 câu; thêm bóng đổ dưới chữ (h1, câu phụ, 3 câu, chữ gradient).
- Khối Từ thực địa: vị trí ảnh giờ TÍNH THEO KHUNG CHỮ THẬT (`layout()` trong model.js): hàng trên/dưới cách chữ g=36px (điện thoại 22px), 2 ảnh lớn hai bên; mốc bay vào = 3× vị trí, mốc 100% = quanh chữ có khoảng cách, rồi chữ mờ đi và ảnh chụm thành một chồng. Tính lại khi đổi cỡ màn hình. Điện thoại: 2 ảnh lớn nằm ở hai góc chéo.
- Khối Hình ảnh thực tế: tiêu đề + ảnh nằm trong một khối xanh đậm bo góc; ảnh tự chạy liên tục từ trái sang phải (CSS 60s/vòng, điện thoại 45s), rê chuột thì dừng; đã bỏ nút và bộ đếm.

## Vòng 17 (24/10/2026 sáng) — trang Mô hình `mo-hinh.html`, xem thử v14, CHƯA push
- Nguồn: `model/main.html`, `model/model.css`, `model/model.js`; `model_build.py` lấy khung (head, menu, khối kết, chân trang, JS chung) từ `out/ve-chung-toi.html`, thay CSS/JS/nội dung riêng → `out/mo-hinh.html`. Sau khi build có thể sửa thẳng `out/mo-hinh.html`.
- Cấu trúc: Hero ghim 3 nhịp ("Một mô hình chuẩn." / "Cho nhiều vùng trồng." / "Vì nông dân Việt Nam.", ảnh chuyển: cà phê dưới núi → hồ tiêu flycam → nông dân chăm cà phê; CHƯA có video) → 01 Từ thực địa (8 ảnh trang cũ bay vào toả quanh chữ → chụm lại → chồng thành một chồng ảnh; "Mỗi bức ảnh là một vùng trồng.") → 02 Phương pháp canh tác (ảnh robot dính + 4 thẻ chữ gốc, icon SVG tự vẽ, chip GlobalG.A.P/ISO 22000/HACCP thay logo) → 03 MỚI Một mô hình, nhiều vùng sinh thái (4 thẻ mở rộng khi rê: Tây Nguyên đang vận hành; Lâm Đồng, Trung du miền núi phía Bắc, Vùng chuyên canh rau màu = định hướng) → 04 Nhân rộng (chữ gốc, ảnh flycam đoàn xe, nút Liên hệ hợp tác = mailto; MỚI: 4 bước Khảo sát → Lắp đặt → Vận hành & đào tạo → Chuyển giao, 4 lợi ích cho địa phương) → 05 Hình ảnh thực tế (chữ gốc, thư viện vuốt ngang 6 ảnh + nút) → Thấy tận mắt (chữ gốc trang cũ) → chân trang.
- Ảnh `img/model-*.webp` (15 ảnh). Ảnh collage trang cũ nhỏ (260–400px) nên giữ cỡ nhỏ trong bố cục; ảnh hero vườn sầu riêng và đoàn xe cắt từ ảnh chụp toàn trang.
- Menu 4 trang khác: "Mô hình" bấm được → mo-hinh.html; link chân trang "Mô hình vận hành" → mo-hinh.html.

## ĐÃ PUSH 79d7813 (23/10/2026 23:30): cả 4 trang (gồm trang Về chúng tôi mới, vòng 13–16b). Web: /ve-chung-toi.html. Xem thử v13 = bản đang chạy.
- Vòng 16b: khe sáng 1px dưới hero là nền trang lộ ra giữa phần ghim và chương 01 → `.ch1{margin-top:-2px;box-shadow:0 -10px 0 #0C1F10}`, nền tối cho `.ah`/pin-spacer.

## Vòng 16 (23/10/2026 23:30) — Về chúng tôi
- Ảnh Bảng tin: bìa "Sổ tay đại lý" bản nét (`news-sotay.webp` 1200×675).
- Hero mượt hơn: phóng to/thu nhỏ khung chứa video thay vì chính video, bỏ hiệu ứng làm mờ chữ, scrub 1, video nào khuất hẳn thì tạm dừng (`window.__heroMix`).
- Tiêu đề 3 dòng: "Hành trình từ / miền đất đỏ / đến tương lai"; "miền đất đỏ" dùng lớp `.grad-soil` (gradient cam đất → đỏ nâu, có bóng đổ), thêm quầng tối nhẹ sau chữ.
- Sửa khe hở dưới lớp phủ hero (lớp phủ tràn mép, nền + dải 4px cùng màu #0C1F10).
- Dòng chữ "Hôm nay là Gia Lai…" chạy liên tục phải → trái (CSS, 48s/vòng, 2 bản nối nhau; rê chuột thì dừng).

## Vòng 15 (23/10/2026 23:00) — Về chúng tôi: video + ảnh thật, xem thử v11, CHƯA push
- **Nguồn chuẩn trang này giờ là `out/ve-chung-toi.html`** (sửa thẳng; `about/` + `about_build.py` đã cũ, KHÔNG chạy build.py nữa vì sẽ ghi đè). Bản trước lưu ở `out/ve-chung-toi.v14.html`.
- Hero: 2 video thật thay ảnh. Đất đỏ: `about-red.mp4` (flycam luống đất đỏ, 1600px, 12s, 4,8 MB) / điện thoại `about-red-s.mp4` (video dọc ruộng đất đỏ Lâm Đồng, 720px, 1,2 MB). Vườn xanh: `about-green.mp4` (đồi Lâm Đồng nắng sớm, 4,3 MB) / `about-green-s.mp4` (cắt dọc, 1,8 MB). Không tiếng, faststart; poster .webp. Video xanh chỉ tải khi bắt đầu cuộn; tạm dừng khi ra khỏi hero. Gốc 4K (360 MB) do chủ dự án chọn trên Magnific.
- Chương 01, 4 ảnh theo 4 đoạn: `about-redsoil` (khung 4K từ flycam) · `about-cherries` (tay hái cà phê) · `about-grower` (người trồng nâng trái cà phê) · `about-hero-farmer` (nữ nông dân giơ nắm tay, chú thích "Mỗi người nông dân là một người anh hùng").
- Chương 04: ảnh mới `about-farmer` (nét hơn), `about-experts` (2 chuyên gia áo blouse), `about-tech-team` (2 kỹ sư đo đất bằng máy tính bảng). Chữ "Chuyên gia nông nghiệp" và "Đội ngũ công nghệ" lấy NGUYÊN VĂN trang cũ (bỏ chữ "blockchain").
- Chương 05: tiêu đề 2 cột + ảnh `about-tea` (2 nữ nông dân cười bên luống chè).
- Ảnh `about-elder.webp` (cùng người phụ nữ cầm liềm) đã nén nhưng chưa dùng.

## Vòng 14 (23/10/2026 tối) — trang Về chúng tôi `ve-chung-toi.html`, xem thử v10, CHƯA push (chủ dự án muốn xem trước)
- Nguồn: `about/main.html` (nội dung), `about/about.css`, `about/about.js`; `about_build.py` ghép với head/CSS gốc/khối kết/chân trang của `trang-chu.p7.html`, được gọi trong `build.py`. Lớp chương đặt tên `.ch1–.ch6` (không dùng `.c1/.c2/.c3` vì trùng cột chân trang).
- Nội dung trang cũ farmblock.vn/about-us (trang render bằng JS, chỉ đọc được qua ảnh chụp chủ dự án gửi) giữ đủ; bỏ chữ "blockchain" ở Mốc 2 (thay bằng "nền tảng dữ liệu"). Chữ "Chuyên gia nông nghiệp" và "Đội ngũ công nghệ" trang cũ bị đóng, KHÔNG đọc được → tạm viết mới, chờ chủ dự án gửi bản gốc.
- Cấu trúc 6 chương: Hero ghim (ảnh đất đỏ season-dry → vườn xanh season-rain, 3 nhịp chữ: Đất đỏ bazan / Bàn tay người nông dân / Và công nghệ dẫn đường) → 01 Khởi nguồn (4 đoạn chữ sáng dần theo cuộn, ảnh trái đổi theo đoạn) → 02 Vì sao chúng tôi bắt đầu (MỚI: Số 1 Robusta / NHƯNG / EUDR, dữ liệu phân tán, chi phí; nút sang Công nghệ) → 03 Sứ mệnh (dải đồi parallax + 3 thẻ xếp chồng) → 04 Con người (máy tính: ghim + trượt ngang 3 người; mobile: dọc) → 05 Vì nông dân Việt Nam (MỚI: 4 cam kết + dòng chữ chạy "Hôm nay là Gia Lai…") → 06 Hành trình vươn xa (3 mốc, đường sáng dần) → dải hoạ tiết thương hiệu (4 mô-típ: 3 vạch, vòng tròn, đồng hồ cát, sao 4 cánh; tự lật ô) → Bảng tin (Sổ tay đại lý) → "Thấy tận mắt. Tin tận tâm." → chân trang. Chỉ số chương cố định góc trái dưới (máy tính).
- Ảnh mới cắt từ ảnh chụp trang cũ: `about-aerial.webp`, `about-farmer.webp`, `about-highland(-m).webp`, `news-sotay.webp`.
- Menu cả 4 trang: "Về chúng tôi" bấm được. Nút "Khám phá hành trình" ở trang chủ và link chân trang trỏ sang trang mới. Ảnh menu Công nghệ/Bảng giá chụp lại theo hero mới.

## Vòng 12 (23/10 17:50) — ĐÃ PUSH commit f330393 (gồm vòng 11)
- Hero Công nghệ: "Hệ thống công nghệ / cho vườn trồng Tây Nguyên" (dòng 2 gradient), 2 dòng trên máy tính; ≥1101px tiêu đề cột 1–8, cột phải căn giữa theo chiều dọc. Xem thử v8.

## Vòng 11 (23/10/2026 tối)
- **Quy trình dựng:** sửa trên `*.p7.html` (gốc trước menu) → `python3 build.py` (chép p7 → chạy `patch3.py` menu → đổi tên link → đổi mọi chữ "FarmBlock" thành **"Farmblock"**; "FARMBLOCK" là logo SVG nên giữ nguyên) → `out/`. Repo để push: `/home/claude/home/repo` (chép từ `out/`).
- Trang Công nghệ trước đây bị dính phần bọc artifact ở đầu file (hai lần `<!doctype>`), nên trình duyệt bỏ qua favicon; đã bỏ phần bọc, sửa og:url thành cong-nghe.html.
- Hero Công nghệ thoáng hơn: logo cách tiêu đề, tiêu đề line-height 1.14, đoạn mô tả line-height 1.7, nút cách 32px; khoảng cột 40px chỉ áp ≥1101px (áp cho mobile sẽ tràn ngang).
- Nền 3D sáng hơn: lớp phủ tối 34% → 12%, viền tối nhẹ hơn; khi tới "Cơ chế vận hành" (`body.in-mech`) lớp phủ mờ đi và cảnh 3D sáng thêm (brightness 1.35).
- Bảng giá: tiêu đề hero "Chọn cách Farmblock / đồng hành cùng bạn" (2 dòng); bảng so sánh desktop căn giữa tiêu đề cột và ô.
- Trang chủ: ảnh Sổ rẫy cắt lại khít màn hình (bỏ viền khung trong ảnh), cùng cỡ 600×933.

## ĐÃ PUSH GitHub (23/10/2026 17:10) — cả 3 trang đang chạy thật
- Commit c0dee37 (vòng 7–10) + d48a773 (khoảng cách trên Hỏi đáp: `.faq{padding-top}` đặt thẳng vào khối, vì Bốn bước được ghim nên bị bọc trong `.pin-spacer`, quy tắc `.steps+.faq` không ăn).
- Repo đã kết nối quyền ghi trong phiên 23/10; bản clone dùng để push: `/home/claude/home/repo` (đặt tên thật). Web: /, /cong-nghe.html, /bang-gia.html.
- Bản xem thử AAWnazEHVQM6rmvMDmgkg6 v6 = đúng bản đang chạy.

## Vòng 10 (23/10/2026 chiều) — Bảng giá
- Gói (đã chốt nội dung theo chủ dự án): **Giám sát** = cảm biến, camera, trạm IoT + xem trên điện thoại; **Đồng hành** = toàn bộ Giám sát + kỹ sư kiểm tra định kỳ + tư vấn kỹ thuật; **Trọn gói** = tất cả + đội vận hành thường trực, chăm toàn khu (giữ nhật ký/hồ sơ và báo cáo). Sa bàn gói 2 giờ vẫn hiện thiết bị (`var dev=1`).
- Bỏ hàng "Ứng dụng Sổ rẫy" khỏi bảng so sánh và khỏi danh sách gói 2.
- Bảng so sánh mobile: tên hàng nằm trong cột giữa (Đồng hành), xuống dòng trong cột đó; giá trị ở hàng dưới.
- Thêm khoảng cách giữa Bốn bước và Hỏi đáp (`.steps+.faq`).

## Vòng 9 (23/10/2026 chiều) — CHƯA push
- **Bảng giá lấy gốc từ artifact Fgq51CgTTpbDvVRdJdpXUd** (bản này có vòng tối ưu mobile mà bản trong Xk2 thiếu: ảnh `-m.webp`, bảng so sánh xếp chồng trên mobile, "Gói 3", logic vòng sáng theo gói). Đã thêm lại link Công nghệ ở chân trang + prerender. Gốc lưu ở `bang-gia.p7.html`.
- Bảng so sánh mobile: ô giá trị có lề 16px, `text-wrap:balance` để chữ dài xuống dòng, không dính cột bên.
- Menu: ảnh Công nghệ / Bảng giá / Trang chủ là ảnh chụp hero của chính trang đó. Về chúng tôi, Mô hình, Bảng tin, Học viện đều là trang con làm sau: mờ, không bấm được, có biểu tượng ↗, rê/chạm hiện "Sắp ra mắt". Chỉ Trang chủ còn bấm được ở danh sách.
- Lớp thẻ lớn trong menu đổi tên `.pmf` (tên `.ft` trùng hàng cuối bảng so sánh `.cr.ft`). Nền hộp menu và hộp Truy cập đặc (#132a18), không nhìn xuyên.

## Vòng 8 (23/10/2026 chiều) — menu mới cả 3 trang, CHƯA push
- Bỏ hai nút Công nghệ / Bảng giá trên thanh. Hộp Menu chỉ còn 7 mục: cột trái 2 thẻ lớn **Công nghệ**, **Bảng giá** (ảnh thật, viền gradient chạy + phát sáng, chữ gradient, nhãn "Đang xem" khi ở trang đó); cột phải danh sách có ảnh nhỏ: Trang chủ · Về chúng tôi · Mô hình · Bảng tin (farmblock.vn, ↗) · **Học viện** (chưa có: tối màu, không bấm được, rê/chạm hiện "Sắp ra mắt"). Mobile: 2 thẻ lớn nằm cạnh nhau, danh sách bên dưới.
- Đã bỏ khỏi menu: Tải ứng dụng, Liên hệ, Tương lai, nút VN/EN và A+ Chữ to (theo yêu cầu "chỉ có 7 mục").
- Ảnh menu: `img/nav-tech.webp` (từ dev-soil), `nav-price` (air-wide), `nav-home` (pano), `nav-about`, `nav-model`, `nav-news`, `nav-academy`.
- Nút **Truy cập** (thay "Truy cập vườn mẫu"): rê chuột (máy tính) / bấm (điện thoại) xổ ra Truy cập vườn mẫu · Truy cập Dashboard · Truy cập Sổ rẫy. Mở hộp này thì đóng Menu và ngược lại. Mobile ≥400px vẫn hiện chữ "Truy cập".
- Tour 360° ở hero trang chủ đổi sang https://tour.panoee.net/6a6b3b93981c83000850b978.
- Mã: `patch3.py` (hàm `nav(cur)` sinh menu cho từng trang, CSS `.pm2/.ft/.it2/.go-m/.go-p`, script nút Truy cập chèn ngay sau `</header>`). Đã bỏ dòng script Bảng giá đặt aria-current cho `.nav-price`.
- Vòng 7.1: thêm khoảng trống trên khối Hệ sinh thái (`.future+.eco`); câu hero "Bắt đầu từ Gia Lai, …".

## Trang chủ vòng sửa 7 (23/10/2026) — CHƯA push, chờ chủ dự án duyệt
- Bản xem thử AAWnazEHVQM6rmvMDmgkg6 dùng tên file thật: `index.html` = trang chủ, `cong-nghe.html`, `bang-gia.html`, `img/` đủ ảnh cả 3 trang.
- Nguồn trong phiên: `/home/claude/home/` (`trang-chu.html`, `index.html` (= Công nghệ), `bang-gia.html` theo tên kiểu xem thử cũ; `patch1.py` nội dung, `patch2.py` sa bàn mạng lưới, `patch3.py` menu; `out/` bản tên thật; `shot.js` chụp — CDN bị chặn trong máy ảo nên shot.js chuyển Three/GSAP/Lenis/Archivo sang bản npm cục bộ). Phiên mới mất file thì đọc lại từ artifact.
- Hướng mới: **vĩ mô**, nói về bộ công nghệ FarmBlock nhân rộng cho nhiều vườn; IaKo #01 là vườn mẫu đầu tiên.
- Hero: bỏ nút Tháng 10 / Tháng 6; chữ "Kéo để xoay 360° vườn mẫu IaKo" (hiện cả trên mobile); câu phụ về bộ công nghệ + "Bắt đầu từ Gia Lai, hướng tới nhiều vùng trồng…"; nút "Tour 360° vườn mẫu".
- **Bỏ hẳn khối Số liệu.** Về chúng tôi / Giá trị bớt chữ Gia Lai, thêm ý "mô hình vận hành có thể nhân rộng".
- **Sa bàn = Mạng lưới vườn** (mặc định): IaKo #01 ở giữa + 5 vườn định hướng (Cà phê #02, Sầu riêng, Hồ tiêu, Chè, Cây ăn quả — loại cây là đề xuất, chờ xác nhận), tia dữ liệu + gói tin lên khối cầu FarmBlock Cloud, nền lưới chấm. Nút chuyển "Mạng lưới vườn" ↔ "Vườn mẫu IaKo #01" (chế độ chi tiết cũ: thiết bị + khu). Bấm vườn để xem; bấm IaKo thì bay vào chi tiết. Ghi chú: vườn ngoài IaKo là minh hoạ định hướng.
- Công nghệ: thêm nút "Xem đầy đủ công nghệ & thiết bị" → trang Công nghệ. Ba lớp: câu "mỗi vườn vận hành cùng mô hình" + ghi chú định mức theo IaKo #01.
- **Khối mới "Tương lai của FarmBlock"** (`#tuong-lai`, sau Ứng dụng): lộ trình 4 bước Kiểm chứng (đang vận hành) → Chuẩn hoá → Nhân rộng → Kết nối (đường chạy theo cuộn); 3 thẻ đóng góp; nút "Cùng FarmBlock mở rộng mô hình" → Hệ sinh thái (`#doi-tac`).
- Cấu trúc trang chủ: Hero → Về chúng tôi → Giá trị → Mạng lưới vườn/sa bàn → Công nghệ → Ba lớp → Ứng dụng → Tương lai → Hệ sinh thái → Niềm tin → Video kết → Footer.

## Trang Công nghệ `cong-nghe.html` (20/10/2026) — CHƯA push GitHub (chủ dự án dặn chờ)
- **Bản xem thử cũ:** https://claude.ai/artifact/Xk2QS2HZR1rB4XgauFERsR (v10). Trong bản này: `index.html` = Công nghệ, `trang-chu.html` = trang chủ, `bang-gia.html` = Bảng giá (link `cong-nghe.html` đổi thành `./`, `index.html` → `trang-chu.html`). Khi đưa vào repo: dùng bộ tên thật (index / bang-gia / cong-nghe).
- Nguồn phiên 20/10: `/home/claude/tech/` (`src/main.html`, `src/tech.css`, `src/tech.js`, `build.py`; ra `out/repo` và `out/preview`; `shot.js`). Nếu mất file: đọc lại từ artifact.
- Ảnh mới `img/`: `dev-soil/dev-water/dev-weather/dev-pole.webp` (ảnh thật từ tech doc PDF, 720×900), `og-cong-nghe.jpg`. Pin mặt trời dùng `dev-solar.webp`.
- **Phong cách:** nền tối #030904, giữ menu, Archivo, màu brand; nhãn kiểu mono, khung kính có góc ngoặc HUD; không backdrop-filter đè canvas. Chủ dự án đã chốt cảnh 3D này đúng ý.
- **Cảnh 3D (Three r128) cố định xuyên trang:** hàng cà phê bằng hạt sáng trên địa hình đồi + sóng quét từ trạm IoT; 35 thiết bị đúng vị trí sơ đồ thật, hiển thị là huy hiệu kim cương có icon thiết bị + vòng kim cương lan; cung LoRa + gói tin về trạm IoT; cột dữ liệu lên khối cầu FarmBlock Cloud; 2 màn hình hạt (Dashboard, Sổ rẫy); mưa ký tự dữ liệu; bụi sáng. Không có sa bàn. Camera bay theo cuộn qua các mốc `data-cam` (hero, issue, gialai, solve, dir, prin, m0–m5, hw, dev, layers, apps, end), có setViewOffset. Tắt vòng lặp khi ẩn tab; mobile giảm hạt.
- **Cấu trúc:** Hero → 01 Vị thế & thách thức → Gia Lai (3 nhu cầu) → Lời giải (4 thẻ + câu vai trò) → Định hướng (Vườn FarmBlock ↔ SaaS) → Năm nguyên tắc → Cơ chế vận hành 5 bước → Thiết bị (A/B, đếm số) → bộ xem thiết bị 5 tab (ảnh thật; đổi tab thì camera bay tới thiết bị) → Ba lớp vận hành → App & Cloud → "Thấy tận mắt. Tin tận tâm." → chân trang. Thanh chương bên phải (≥1440px).
- **Vòng 2:** hero gọn; con số thành thẻ màu có huy hiệu + icon; từ khoá `b.kw` (lime) / `b.kw.s` (xanh dương), "Số 1" gradient phát sáng; nhãn mục dùng logo nhỏ; bộ icon SVG (`#i-soil`, `#i-water`, `#i-weather`, `#i-cam`, `#i-iot`, `#i-sun`, `#i-lora`, `#i-cloud`, `#i-app`, `#i-tap`…) ở đầu `main.html`, cảnh 3D đọc chính nét vẽ này. 3 thẻ Gia Lai có minh hoạ động SVG/CSS; 4 thẻ Lời giải icon động. Ba lớp: sơ đồ quỹ đạo nghiêng, tự đổi lớp 2,6 giây/lần; mobile ẩn thẻ nhãn.
- **Vòng 3:** "cho vườn cà phê" một dòng, "Tây Nguyên" xuống dòng; giữ cụm từ không ngắt (`span.nw`); bỏ gạch chân sau từ khoá; "Robusta" chữ thường; thẻ số: số + nhãn trái, huy hiệu phải; thẻ nhãn ba lớp rộng 240.
- **Vòng 4:** hero luôn ngắt "Hệ thống công nghệ / vận hành nông nghiệp số"; sửa "Số 1" mất dấu. Tablet 621–1100px giữ 2 cột cho bộ xem thiết bị và ba lớp. Mobile: ảnh thiết bị 16:10 trên tab, sơ đồ ba lớp trên danh sách; bỏ qua resize chỉ đổi chiều cao; DPR mobile ≤1,35.
- **Vòng 5 (mobile ≤620px):** Cơ chế vận hành: thẻ nhỏ sát đáy, cảnh 3D đẩy lên, chạm (+) mở mô tả. Ba lớp: ghim (`.lay-track` 250svh), cuộn đổi lớp 1→2→3 hoặc chạm; thẻ có mũi tên trỏ nút; khung nền đen mờ. Desktop/tablet giữ nguyên.
- **Vòng 6 (23/10):** hero thay dòng "Tài liệu công nghệ…" bằng logo 3D (`#hlogo`); dải hero 8 ô công nghệ; mục 01 bố cục `.duo` (Dẫn đầu / NHƯNG / Chịu sức ép vùng trồng); bỏ "Nguồn tham khảo"; nhãn mục 01–10; nền 3D phủ tối 34%; thu khoảng trống trước lời mời kết.
- Câu chữ lấy nguyên từ tech doc; bỏ dấu * sau "150 mm/giờ".

## Trang Bảng giá `bang-gia.html` (19/10/2026) — CHƯA push GitHub (chủ dự án dặn chờ)
- **Bản xem thử cũ:** https://claude.ai/artifact/Fgq51CgTTpbDvVRdJdpXUd (v10). Bản mới nhất nằm trong artifact AAWnazEHVQM6rmvMDmgkg6.
- Ảnh mới trong `img/`: `air-wide/high/high2/low/house/crew/solar.webp`, `farm-map-light.webp`, `og-bang-gia.jpg`, `season-rain/dry/flower.webp`, `cta.mp4`, `cta-s.mp4`, `cta-poster.webp`.
- Chuyển trang: View Transitions; trình duyệt không hỗ trợ dùng màn che có logo; speculation rules prerender.
- Cấu trúc: Hero "Một năm của cây cà phê" 8 chương → 3 gói (thẻ gói trái, sa bàn phải, `?goi=2`) → Bảng so sánh 9 dòng → Bốn bước → Hỏi đáp → "Thấy tận mắt. Tin tận tâm." (video flycam) → chân trang.
- Gói: xem Vòng 10. Không có giá, không có trang thanh toán.

## Mục tiêu
Landing page showcase FarmBlock: bộ công nghệ vận hành vườn trồng, bắt đầu từ vườn mẫu IaKo #01 (Gia Lai) và hướng tới nhiều vùng trồng, góp phần phát triển nông nghiệp công nghệ cao Việt Nam. **Bỏ mọi nội dung blockchain.** Người xem gồm người Việt lớn tuổi: chữ ≥ 18px, nút ≥ 52px, câu ngắn, rõ.
Hướng: 2D + 3D storytelling (Three.js r128), chuyển động mượt (GSAP 3.13 + ScrollTrigger + SplitText, Lenis 1.1.13).

## Quyết định kỹ thuật / hiệu năng đã chốt
- Ảnh WebP; vòng lặp WebGL dừng khi ẩn tab/ra khỏi màn hình; không animate clip-path theo cuộn; không backdrop-filter đè canvas hay thanh menu khi đã cuộn; `ScrollTrigger.config({ignoreMobileResize:true})`.
- Class `.l2` và `.acc` đã dùng (nền / accordion Hệ sinh thái) — không dùng lại tên này.

## Link & nút bắt buộc
- Thanh điều hướng (từ vòng 8): logo · Menu (Công nghệ, Bảng giá, Trang chủ, Về chúng tôi, Mô hình, Bảng tin, Học viện) · **Truy cập** (Vườn mẫu https://vuonmau.farmblock.vn/ca-phe-mang-yang-1 · Dashboard https://dashboard.farmblock.vn/ · Sổ rẫy https://sotay.farmblock.vn/).
- Tour 360° (hero trang chủ): https://tour.panoee.net/6a6b3b93981c83000850b978

## Brand (Figma iNIXTC5Nq93Q1cyC4Egp7m, node 647-110)
- Font **Archivo**. Xanh chính #3A8047 (đậm #112615; nhạt #EBF2ED). Logo gradient #008242→#7ED839, kem #F5E4A1. Lime #B5E383. Xanh dương #51ADCA.
- Slogan: "Hành trình cùng Tây Nguyên chạm đến tương lai" · "Tiên phong số hóa tài sản nông nghiệp" · "Thấy tận mắt. Tin tận tâm." · "Số hóa nông nghiệp. Chuẩn hóa vận hành. Tối ưu đầu tư."

## Vườn IaKo #01
- Sơ đồ chuẩn: Figma 6fywlUIIgYSdiuMvv9Xtop node 1-2787. Thôn Cây Xoài, xã Iako, Gia Lai. 22 ha · 138 lô · 8 khu (A, B1, B2, C1–C5). Giống Thiện Trường, trồng 2026, xen canh cà phê – cau, 2.200 gốc/ha, 700–800 m.

## Tech doc 10/2026 (đã dùng đầy đủ cho trang Công nghệ)
- Thiết bị: 9 cảm biến đất · 2 cảm biến nước · 1 trạm thời tiết · 22 camera · pin mặt trời · trạm IoT · LoRa · tưới & châm phân · App & Cloud.
- Vận hành 3 lớp: (1) 01 quản lý + 02 kỹ sư thường trực; (2) 02 kỹ sư kiểm tra định kỳ; (3) 01 kỹ sư giám sát từ xa (AI gợi ý điểm cần kiểm tra).
- Phần mềm: Dashboard (chuyên gia & chủ đất) · Sổ rẫy (giọng nói, chụp ảnh khám lá/đất bằng AI, hồ sơ theo vườn/khu/thời gian).

## Liên hệ
Tầng 13, Tòa nhà NIC, Ngõ 7 Tôn Thất Thuyết, Cầu Giấy, Hà Nội · 0354 060 029 · contact@farmblock.ai.

## Quy tắc làm việc
- 23/10 22:26: chủ dự án xóa các chat cũ (landing redesign, subpage, pricing). Các artifact cũ UrhMxa…, Xk2QS…, Fgq51… có thể không còn; mọi thứ đã nằm trong bản xem thử tổng AAWnazEHVQM6rmvMDmgkg6 (đủ 4 trang + 67 ảnh/video) và repo GitHub.
- **Từ 23/10: làm theo `claude/quy-trinh-2-luong.md`.** Luồng chính lo landing, ghép trang, publish bản xem thử tổng và push GitHub; mỗi trang con có một luồng phụ riêng, chỉ xem thử bằng artifact riêng.
- Nguồn chuẩn là file trong bản xem thử tổng AAWnazEHVQM6rmvMDmgkg6 (đã gồm menu mới và chữ "Farmblock"). Các script `build.py`/`patch*.py` chỉ có trong phiên 23/10, phiên mới không dùng được; luồng nào cũng sửa thẳng trên file đọc từ artifact.
- Đọc file này trước; chỉ mở Figma/PDF khi được yêu cầu, chỉ đúng phần cần.
- Sửa nhỏ, mỗi vòng chụp kiểm tra 1920px + 430px; không viết lại cả trang khi không cần.
- (Từ 28/10) Sau mỗi vòng: sửa → tự kiểm tra 1920px + 430px → commit + push thẳng repo farmblock-website (không cần hỏi) → báo link cho chủ dự án → cập nhật file này.
- Không ghi Claude là tác giả trong commit hay bất cứ thứ gì công khai.

## Vòng 19 – Học viện (Academy) + trang Soạn bài (24/10/2026, CHƯA push, chờ duyệt)
- hoc-vien.html: hero chữ gốc, ô tìm (bỏ dấu), chip chủ đề (chủ đề có bài trước, "+ N chủ đề khác"), bài mới nhất nổi bật, lưới thẻ, phân trang 12/trang; đọc hoc-vien/index.json.
- Trang bài hoc-vien-<slug>.html dựng từ khuôn hoc-vien/_mau.html (gốc: trang bài Bảng tin): mục lục, thanh tiến độ, bài liên quan, JSON-LD, canonical/og.
- hv/hv.js (dùng chung trình duyệt + node): đọc văn bản / HTML dán từ Word-Docs; tự nhận biết: Định nghĩa nhanh, bảng tổng quan (tiêu đề cùng tiền tố), thẻ đánh số (Cách/Các bước/Nguyên tắc…), thẻ màu "Đối với…", hộp Lưu ý; tắt từng điểm qua post.off.
- 3 bài mẫu: tuoi-tieu-la-gi, nuoc-cung-la-gi, chat-luong-nuoc-tuoi-la-gi (văn bản gốc trong hv/src). Build: python3 hv_build.py && node hv_posts.js.
- soan-bai.html (noindex, không có trên menu): ảnh bìa tự cắt 16:9 + nén WebP + ảnh nhỏ, tiêu đề → slug tự động, mô tả có đếm ký tự, chủ đề, nội dung soạn/dán, xem trước trực tiếp (máy tính/điện thoại), bảng "Hệ thống tự nhận biết" có công tắc, danh sách kiểm tra, nháp tự lưu (IndexedDB), sửa/gỡ bài đã đăng.
- Xuất bản = 1 commit qua GitHub API (ảnh img/hv/, hoc-vien/bai/<slug>.json, trang html, index.json, sitemap.xml). Cần fine-grained token (Contents: Read and write, chỉ repo farmblock-landing), lưu trong trình duyệt từng máy.
- Đổi sang farmblock.vn: sửa "site" trong hoc-vien/config.json + hv_build.py SITE, thêm file CNAME, DNS A 185.199.108-111.153 (+AAAA), www CNAME trungcien0120.github.io, bật Enforce HTTPS.
- Menu "Học viện" thành link thật trên mọi trang + footer; sửa lỗi toast rỗng ló ở đáy màn hình; robots.txt, sitemap.xml.
- 24/10 10:46: người dùng cho phép ĐẨY THẲNG lên GitHub không cần hỏi lại (vì không xem được artifact trang Soạn bài). Đã push a950beb: ô tiêu đề rõ ràng, khung soạn cố định + nút Mở rộng toàn màn hình, nút ✕ xoá ảnh, bỏ danh sách điều kiện xuất bản (chỉ hỏi lại khi trùng đường dẫn), chữ dài tự xuống dòng. Thêm .nojekyll (để _mau.html được phục vụ).

## Vòng 20 (24/10, đã push 91da726)
- Nền hero Học viện mới (quả cầu sáng + vòng sóng lan, vệt sáng trên/dưới), khác Bảng tin.
- Ảnh nhỏ trong menu = ảnh chụp hero từng trang (img/nav-*-h.webp, 68×50). Nút Hotline 0354 060 029 + Email contact@farmblock.ai dưới 5 mục, đáy khớp với 2 thẻ lớn; bấm = gọi/gửi thư + tự sao chép (máy tính: chỉ sao chép số).
- Trang chinh-sach-bao-mat.html (cs_build.py từ khuôn bài Học viện + cs/text.md, chữ gốc, 15 mục). Chân trang: Chính sách bảo mật → trang mới; Điều khoản + Câu hỏi thường gặp → hover hiện "Sắp ra mắt", không đổi màu/gạch chân.
- Script: site_patch.py (menu/chân trang cho 7 trang gốc) → hv_build.py → hv_posts.js (dựng lại cả bài người viết đăng từ hoc-vien/bai/*.json) → cs_build.py.
- QUAN TRỌNG: người viết đăng bài thẳng lên repo qua trang Soạn bài → luôn git pull + chép hoc-vien/bai, img/hv về out/ trước khi build & push, nếu không sẽ xoá mất bài.

## Vòng 21 (24/10, đã push 54b5660)
- Thanh menu: tên trang hiện cạnh logo (site_patch.set_page; điện thoại ẩn chữ FARMBLOCK, giữ biểu tượng + tên trang). Bài viết Bảng tin/Học viện có nút ← trên cùng bên trái (quay lại trang trước nếu đến từ trong site, không thì về trang danh sách).
- Về chúng tôi: bỏ 01/02/03 ở 3 câu hero; 3 biểu tượng mốc chuyển động (luống cây vươn + lá; sao xoay toả sáng lấp lánh; đồng hồ cát chảy rồi lật), chỉ chạy khi mốc sáng (about_r21.py).
- Địa chỉ thống nhất: Tầng 13, Tòa nhà NIC, Số 7 Tôn Thất Thuyết, Cầu Giấy, Hà Nội (cả trang Chính sách).
- Lỗi thẻ nổi bật Bảng tin/Học viện bị kẹt lệch 60px (gsap.from bị dừng) → đổi sang CSS animation featIn; giãn khoảng cách tới "Tất cả bài viết".

## Vòng 22 (24/10) — Video kết mới (làm ở chat riêng, nhập qua patch: 60c9526, e6f381e)
- img/final.mp4 (1600×900, 4,8 MB) / final-s.mp4 (dọc 720×1280, 2 MB) / final-poster.webp: 16 giây lặp, 8 cảnh (đất đỏ → đồi xanh → hái cà phê → quả chín → tiêu → tưới nhỏ giọt → nông dân + tablet → bình minh sương). Dùng ở trang chủ, Mô hình, Về chúng tôi và Bảng giá (#ctaVid đổi từ cta.* sang final.*). cta.* không còn dùng.

## Vòng 22b (24/10, đã push 0e52bba)
- Biểu tượng 3 mốc: bỏ chuyển động phức tạp, quay về biểu tượng gốc + lật (rotateY) lần lượt mỗi 1,4 giây như hàng hoạ tiết.
- Lỗi menu: trang Học viện để mục Bảng tin là "#top" (đang xem) → không bấm được; đã sửa news_link trong hv_build.py.
- Nền hero Học viện: tông xanh dương (#08161D + vệt xanh dương/xanh lá), logo Farmblock nổi lơ lửng + vòng sóng xanh dương thay quả cầu.
- Ảnh Trang chủ trong menu căn giữa (nav-home-h.webp), ảnh Học viện cập nhật theo nền mới.
- Điện thoại: Về chúng tôi chương 01 — chữ chạy lên sau ảnh bị che hẳn (nền đặc phía trên ảnh + dải mờ dưới ảnh). Menu gọn trong 1 màn hình (thẻ lớn thấp hơn, ẩn mô tả thẻ lớn, mục nhỏ hơn, Hotline/Email chung một hàng, email hiện "Gửi email").
- Nhớ: mỗi lần sửa cũng cập nhật artifact "bản xem thử tổng" (AAWnazEHVQM6rmvMDmgkg6) ngoài việc push.

## Vòng 23 (24/10, đã push f11bb64) — Màn chờ toàn trang
- loader_patch.py: mọi trang (trừ soan-bai) có màn chờ .fbl: nền #F2F8EA + quầng xanh nhạt, logo dọc (biểu tượng 64px + chữ FARMBLOCK 132px), vạch chạy mảnh, không có số.
- Mở: chờ load + font (tối thiểu 0,6 giây, tối đa 4,5 giây) rồi 4 cánh tam giác (clip-path tĩnh) trượt ra 4 hướng bằng transform — chạy trên GPU, không khựng khi trang nặng (bản vòng tròn mask + @property bị khựng, đã bỏ). Rời trang: 4 cánh khép vào giữa (0,62 giây). gsap chạy lại sau 120ms.
- Trong lúc chờ, gsap.globalTimeline bị tạm dừng → hiệu ứng mở đầu mỗi trang chạy đúng lúc màn mở ra. Đã gỡ rèm cũ (.curtain) và @view-transition.
- Thứ tự build: site_patch.py → loader_patch.py → hv_build.py → hv_posts.js → cs_build.py (các script chạy lại an toàn).

## Vòng 23c (24/10) — Màn chờ làm lại (người dùng chê 4 cánh nhọn, màu tối)
- Hai tấm màn bo cong (mép trên/dưới là nửa elip rộng 128% chiều ngang): lớp trước kem sáng #F7FBF0 có quầng xanh lá/xanh dương/vàng kem ở giữa; lớp sau xanh lá nhạt #C9EB9C. Mở: lớp kem nhấc lên (1 giây), lớp xanh theo sau 0,11 giây. Rời trang: lớp xanh trồi lên từ dưới, lớp kem phủ theo 0,08 giây sau, chuyển trang ở 0,86 giây.
- Logo 72px nảy nhẹ khi hiện, lơ lửng, 2 vòng sóng bo tròn lan ra; chữ FARMBLOCK; thanh chạy bo tròn. Chỉ dùng transform/opacity.
- 24/10 13:30: người dùng thấy trang khác vẫn hiện màn chờ 4 cánh cũ → do GitHub Pages cho trình duyệt giữ HTML 10 phút (+ speculationrules tải trước). Đã sửa: bấm link data-page → fetch(href,{cache:'reload'}) trong lúc màn khép rồi mới chuyển (tối đa 3 giây); bỏ speculationrules.

## Farmblock Splash 1.0 (24/10) — gói animation mở app cho dev
- splash/farmblock-splash.md + farmblock-splash-demo.html: đúng animation màn chờ website, bỏ thanh loading. Class .fbs*, API FbSplash.hide() / FbSplash.cover(), data-manual để app tự mở; ~5 KB gzip, chỉ transform/opacity. Có bảng thông số cho native (màu, kích thước, thời lượng, easing) và gợi ý Flutter/React Native, splash hệ điều hành nền #F7FBF0.
