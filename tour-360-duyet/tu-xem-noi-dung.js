// Kịch bản "Tự xem". Mọi thứ ở đây là DỮ LIỆU: thêm một hạng mục mới vào vườn thì thêm một mục vào danh sách
// hangMuc bên dưới, không cần sửa tu-xem.js. Hành trình tự gom các hạng mục có tên mình trong `hanhTrinh`.
//
// ---- Một hạng mục ----
// id            tên ngắn, không dấu, không trùng
// trangThai     'da-co' (đã có) · 'dang-lam' (đang làm) · 'du-kien' (dự kiến, chưa có thật)
// hanhTrinh     { nong: 20, tech: 50 }: có mặt trong hành trình nào, số nhỏ đi trước (để cách 10 cho dễ chen vào giữa)
// kieu          'chuong' = màn tiêu đề mở một chương (chỉ cần kicker, title, sub)
// at            chỗ máy quay bay tới: id điểm nóng ('ho', 'nha-dieu-hanh', 'tram'), 'khu-A'..., 'vuon' (cả vườn)
//               hoặc id một công trình dự kiến trong quyHoach (vd 'ho-phan')
// fov           độ mở khi dừng (nhỏ = gần) · nhin: [độ sang phải, độ lên trên] để chỉnh khung riêng điểm này · scene: đổi cảnh trước khi bay ('0408', '0711', '0713')
// kicker, title, lead, text   chữ trên thẻ
// loi           lời đọc (giọng Hải Đăng), kể đủ cả "vì sao"; đọc xong mới sang điểm sau. Số viết bằng chữ số,
//               đơn vị viết như đọc (mét khối, ki lô oát). Sửa lời thì đọc lại giọng cho riêng mục đó.
// viSao         lớp "Vì sao ở đây": vì sao vườn làm như vậy ở chính mảnh đất này
// stats         [số, đơn vị] (số tự đếm lên) · timeline: [[mốc, việc], ...] · link: [chữ, địa chỉ]
// media         ảnh .webp/.jpg/.svg hoặc video .mp4 (tự chiếu, lỗi thì bỏ qua) · cap: chú thích · illus: ghi "Hình minh hoạ"
//               fit: ảnh màn hình Dashboard (giữ trọn khung) · so: sơ đồ (giữ trọn, nền tối)
// fx            hiệu ứng trên cảnh: spot (rọi đèn), ripple (sóng nước), rays (nắng), flow (dòng chảy từ → tới),
//               zones (khu sáng lần lượt), pings (sóng radar ở thiết bị), links (dữ liệu chạy về trạm),
//               uplink (cột sáng gửi dữ liệu lên), cones (góc nhìn camera), trace (vẽ lại ranh), boundary (viền cả vườn),
//               quyHoach (vẽ nét đứt các công trình dự kiến; noiBat: id công trình cần nhấn)
// Chỗ nào chưa chắc thì viết [cần xác nhận: ...] ngay trong chữ, thẻ sẽ hiện nhãn vàng để người duyệt thấy.
//
// Số liệu theo sự thật đã chốt (hoc-tap/kien-thuc/farmblock.md), nhật ký vườn và tham luận tọa đàm hạn hán 19/11/2026.
window.FB360_TUXEM = {
  trangThai: {
    'da-co': { ten: 'Đã có', rgb: '181,227,131' },
    'dang-lam': { ten: 'Đang làm', rgb: '245,200,90' },
    'du-kien': { ten: 'Dự kiến', rgb: '226,232,240' }
  },

  // Công trình dự kiến, vẽ bằng nét đứt trên ảnh 360 để không lẫn với thứ đã có.
  // Vị trí đặt theo khu (khu + lệch dx mét về đông, dy mét về bắc so với giữa khu). Thêm công trình mới: thêm một dòng.
  // kieu: 'ho' (hình chữ nhật rong × dai mét), 'diem' (một điểm có vòng tròn), 'ong' (đường ống nối các id theo thứ tự)
  quyHoach: [
    { id: 'trai-chan-nuoi', kieu: 'diem', ten: 'Trang trại chăn nuôi', khu: 'C1', dx: -235, dy: -40, r: 55, coSan: true },
    { id: 'ho-phan', kieu: 'ho', ten: 'Hồ phân', khu: 'C1', dx: 20, dy: -10, rong: 34, dai: 26, quay: 8 },
    { id: 'ho-moi', kieu: 'ho', ten: 'Hồ nước mới', khu: 'C3', dx: 0, dy: 0, rong: 46, dai: 32, quay: 8 },
    { id: 'ong-noi', kieu: 'ong', ten: 'Đường ống nối', qua: ['trai-chan-nuoi', 'ho-phan', 'ho', 'ho-moi'] }
  ],

  tours: {
    nong: {
      kicker: 'Hành trình 1 · Nông nghiệp và hạ tầng',
      title: 'Vì sao vườn dựng như thế này',
      sub: 'Giếng, hồ, giống cây, hàng cau, lớp rơm. Mỗi điểm dừng kể vườn làm gì, và vì sao ở Ia Ko phải làm như vậy.',
      cover: '../img/real-rows.webp',
      tint: '181,227,131',
      outro: { title: 'Cảm ơn bà con đã ghé vườn', text: 'Muốn ghi chép vườn nhà mình như vậy? Sổ Rẫy hoàn toàn miễn phí.', cta: ['Mở Sổ Rẫy', 'https://sotay.farmblock.vn/'] }
    },
    tech: {
      kicker: 'Hành trình 2 · Công nghệ',
      title: 'Công nghệ làm riêng cho Ia Ko',
      sub: 'Mỗi thiết bị trả lời một câu: vì sao lắp ở đây, và nó giúp gì cho đất, cho nước, cho cây cà phê ở chính vườn này.',
      cover: '../img/dev-weather.webp',
      tint: '124,195,217',
      outro: { title: 'Hết hành trình công nghệ', text: 'Toàn bộ số đo, nhật ký và camera của vườn được theo dõi trên Dashboard vận hành.', cta: ['Mở Dashboard', 'https://dashboard.farmblock.vn/'] }
    },
    'sap-toi': {
      nho: true,
      kicker: 'Quy hoạch',
      title: 'Sắp tới ở vườn Ia Ko',
      sub: 'Chỉ những hạng mục dự kiến: hồ phân, hồ nước mới, công nghệ cho nước và cho phân.',
      tint: '226,232,240',
      outro: { title: 'Đây là quy hoạch dự kiến', text: 'Vị trí và quy mô có thể còn thay đổi. Mỗi hạng mục làm xong sẽ chuyển sang "Đã có" trong hai hành trình chính.', cta: ['Xem vườn hôm nay', '#tu-xem-nong'] }
    },
    // để chỗ sẵn, chưa làm
    'ket-hop': { sapCo: true, kicker: 'Sắp có', title: 'Một tour, cả hai hành trình', sub: 'Nông nghiệp và công nghệ đan vào nhau theo từng điểm trên vườn.' },
    timelapse: { sapCo: true, kicker: 'Sắp có', title: 'Timelapse toàn trang trại', sub: 'Cả vườn lớn lên theo tháng, ghép với timelapse của từng khung camera.' }
  },

  hangMuc: [
    // =================== HÀNH TRÌNH 1 ===================
    { id: 'dat-dau', trangThai: 'da-co', hanhTrinh: { nong: 10 },
      loi: 'Tháng 4 năm 2026, đây chỉ là một khoảnh đất đỏ bazan vừa khai hoang ở xã Ia Ko, tỉnh Gia Lai. Chưa có hồ, chưa có cây, chỉ có đất và nắng. Đất bazan tơi và sâu, rất hợp với cà phê vối. Nhưng cũng như phần lớn vườn cây công nghiệp ở Gia Lai, mảnh đất này nằm ngoài vùng tưới của thủy lợi. Muốn trồng thì phải tự lo nước trước. Vì vậy, việc đầu tiên ở đây không phải là xuống giống, mà là đi tìm nước.',
      scene: '0408', at: 'vuon', fov: 104, kicker: 'Tháng 4/2026', title: 'Ngày đầu tiên',
      lead: 'Mọi chuyện bắt đầu từ một khoảnh đất trống.',
      text: 'Đất đỏ bazan ở xã Ia Ko, Gia Lai, lúc vừa khai hoang. Chưa có hồ, chưa có cây, chỉ có đất và nắng.',
      viSao: 'Đất bazan tơi, sâu, hợp cà phê vối. Nhưng như hơn 95 trên 100 ha cây công nghiệp ở Gia Lai, vườn nằm ngoài vùng tưới của thủy lợi. Muốn trồng thì phải tự lo nước trước, nên việc đầu tiên không phải xuống giống mà là tìm nước.',
      stats: [['22', 'ha đất vườn'], ['8', 'khu trồng']],
      media: [{ src: 'tu-xem/m/tren-cao-2.mp4', cap: 'Flycam tháng 6: hồ còn là hố đất · 15/06/2026' }, { src: '../img/about-redsoil.webp', cap: 'Đất đỏ bazan Tây Nguyên', illus: true }],
      fx: [{ t: 'boundary' }] },

    { id: 'gieng', trangThai: 'da-co', hanhTrinh: { nong: 20 },
      loi: 'Tháng 6, giàn khoan được đưa vào vườn. Không có kênh mương nào chạy tới đây, nước chỉ nằm dưới lòng đất. Một cái giếng chỉ cho ra một lượng nước có hạn. Vào mùa khô, khi mực nước hạ xuống, giếng ra càng ít. Vì thế ở Ia Ko, vườn không trông vào một giếng. Hiện có 3 giếng khoan, cùng bơm dồn nước về một hồ trữ. Nhiều giếng cùng chạy thì hồ mới đầy kịp, trước khi cây cần nước.',
      scene: '0713', at: 'ho', fov: 66, kicker: 'Tháng 6/2026', title: 'Ba giếng cho một hồ',
      lead: 'Có nước rồi mới có cây.',
      text: 'Trước khi trồng một cây nào, vườn khoan giếng. Hiện có 3 giếng, cùng bơm dồn về hồ trữ.',
      viSao: 'Không có kênh mương nào chạy tới vườn, nước chỉ có dưới đất. Một giếng cho ra lượng nước có hạn, vào mùa khô mực nước hạ thì ra càng ít. Vì vậy ở Ia Ko không trông vào một giếng: nhiều giếng cùng bơm thì hồ mới đầy kịp.',
      stats: [['3', 'giếng khoan'], ['1', 'hồ trữ đang dùng']],
      media: [{ src: 'tu-xem/m/gieng-1.mp4', cap: 'Giàn khoan giếng · 10/06/2026' }, { src: 'tu-xem/m/ho-2.mp4', cap: 'Nước giếng xả xuống hồ · 17/06/2026' }],
      fx: [{ t: 'spot', at: 'ho' }, { t: 'ripple', at: 'ho', rgb: '124,195,217' }] },

    { id: 'ho-tru', trangThai: 'da-co', hanhTrinh: { nong: 30 },
      loi: 'Đây là hồ trữ, lót bạt để nước không thấm mất xuống đất. Hồ chứa khoảng 4.000 mét khối, giữ nước giếng và nước mưa để tưới chủ động. Vì sao phải có hồ? Mùa khô Tây Nguyên kéo dài nhiều tháng, và lúc cây khát nhất cũng là lúc giếng yếu nhất. Chỉ một tuần giữa tháng 11, khi mùa khô còn chưa vào cao điểm, vườn đã dùng khoảng 40 phần trăm lượng nước trong hồ. Một hồ là chưa đủ cho cả vườn, nên quy hoạch sắp tới có thêm hồ.',
      at: 'ho', fov: 74, kicker: 'Hồ lót bạt', title: 'Hồ trữ: nước để dành cho mùa khô',
      lead: 'Giếng bơm từ từ, hồ giữ sẵn cho lúc cây cần.',
      text: 'Hồ lót bạt chống thấm, trữ nước giếng và nước mưa để tưới chủ động.',
      viSao: 'Mùa khô Tây Nguyên kéo dài nhiều tháng, lúc cây khát nhất cũng là lúc giếng yếu nhất. Chỉ một tuần giữa tháng 11, chưa vào cao điểm khô, vườn đã dùng khoảng 40% hồ. Vì thế một hồ chưa đủ cho cả vườn qua mùa khô thật, và quy hoạch có thêm hồ.',
      stats: [['4.000', 'm³ hồ trữ'], ['40', '% hồ dùng trong 1 tuần giữa tháng 11']],
      media: [{ src: 'tu-xem/m/ho-1.mp4', cap: 'Hồ đã tích nước · 18/06/2026' }, { src: 'tu-xem/m/tren-cao-a.webp', cap: 'Hồ có nước, nhìn từ trên cao · 23/06/2026' }, { src: '../img/real-lake.webp', cap: 'Hồ trữ nước' }],
      fx: [{ t: 'spot', at: 'ho' }, { t: 'ripple', at: 'ho', rgb: '124,195,217' }] },

    { id: 'nha-dien', trangThai: 'da-co', hanhTrinh: { nong: 40 },
      loi: 'Sát bờ hồ là Nhà điều hành. Mái nhà lợp 68 tấm pin mặt trời, tổng công suất 41,5 ki lô oát. Ở đây, vườn tự bơm toàn bộ nước tưới, từ giếng lên hồ, rồi từ hồ ra từng gốc cây. Bơm nước là việc tốn điện nhất. Mà nắng Gia Lai gay gắt nhất lại đúng vào mùa khô, lúc phải bơm nhiều nhất. Nên mái nhà được dùng để làm ra điện. Nhà đặt ngay cạnh hồ, để đường ống bơm ngắn nhất, đỡ hao điện, đỡ hao nước.',
      at: 'nha-dieu-hanh', fov: 60, kicker: 'Tháng 7/2026', title: 'Ngôi nhà làm ra điện',
      lead: 'Nắng ở đây chạy máy bơm.',
      text: 'Sát bờ hồ là Nhà điều hành. Mái lợp 68 tấm pin mặt trời, đội vườn làm việc ở đây mỗi ngày.',
      viSao: 'Vườn tự bơm toàn bộ nước tưới: từ giếng lên hồ, từ hồ ra từng gốc. Bơm là việc tốn điện nhất. Nắng Gia Lai nhiều nhất đúng vào mùa khô, lúc phải bơm nhiều nhất, nên mái nhà làm ra điện. Nhà đặt sát hồ để đường ống bơm ngắn nhất.',
      stats: [['68', 'tấm pin'], ['41,5', 'kWp']],
      media: [{ src: 'tu-xem/m/pin-mai.webp', cap: 'Nhà điều hành mái pin sát bờ hồ' }, { src: 'tu-xem/m/nha-1.mp4', cap: 'Nhà đang lợp mái · 13/06/2026' }, { src: 'tu-xem/m/pin-ho.webp', cap: 'Nhà điều hành và hồ, núi phía sau' }],
      fx: [{ t: 'spot', at: 'nha-dieu-hanh' }, { t: 'rays', at: 'nha-dieu-hanh' }] },

    { id: 'tuoi-goc', trangThai: 'da-co', hanhTrinh: { nong: 50 },
      loi: 'Từ hồ, máy bơm đẩy nước qua khoảng 71 km ống, chạy dọc theo từng hàng cây. Ở mỗi gốc cà phê có một béc tưới nhỏ. Cả vườn có 47.388 béc. Phân bón được hoà vào nước, đi thẳng tới chỗ rễ cần. Vì sao phải tưới tận gốc? Vì nước ở đây phải bơm lên từ giếng, mét khối nào cũng tốn công. Tưới tận gốc thì nước không mất dọc đường, không chảy tràn trên mặt đất. Mỗi khối nước giữ lại được, là thêm một ngày tưới trong mùa khô.',
      at: 'ho', fov: 92, kicker: 'Từ hồ tới gốc', title: 'Nước đi tới từng gốc cây',
      lead: 'Mỗi gốc cây có một béc tưới riêng.',
      text: 'Từ hồ, máy bơm đẩy nước qua khoảng 71 km ống chạy dọc các hàng, tới béc tưới nhỏ ở từng gốc. Phân hoà theo nước tới đúng chỗ rễ.',
      viSao: 'Nước ở đây phải bơm lên từ giếng, từng mét khối đều tốn công. Tưới ngay tại gốc thì nước không mất dọc đường, không chảy tràn trên mặt đất. Mỗi khối nước giữ lại được là thêm ngày tưới trong mùa khô.',
      stats: [['71', 'km ống tưới'], ['47.388', 'béc tưới gốc']],
      media: [{ src: 'tu-xem/m/ong-1.mp4', cap: 'Đường ống kéo qua khu mới trồng · 30/07/2026' }, { src: 'tu-xem/m/ong-2.mp4', cap: 'Ống nhỏ chạy sát cây con · 07/07/2026' }],
      fx: [{ t: 'flow', from: 'ho', to: 'zones', rgb: '124,195,217' }] },

    { id: 'giong', trangThai: 'da-co', hanhTrinh: { nong: 60 },
      loi: 'Tháng 7, những cây cà phê con đầu tiên xuống đất. Đất được lên luống trước, rồi mới xuống giống, thẳng hàng như kẻ chỉ. Giống là Robusta ghép, dòng Thiện Trường. Cà phê vối là cây quen thuộc của đất bazan Gia Lai, và cây ghép từ dòng tốt cho vườn đồng đều hơn cây trồng từ hạt. Hàng cách hàng 3 mét, cây cách cây 1 mét rưỡi, khoảng 2.200 cây trên mỗi héc ta. Hàng rộng 3 mét chừa lối đi cho người và xe chăm sóc.',
      at: 'khu-A', fov: 74, kicker: 'Từ 07/07/2026', title: 'Giống cây và khoảng cách trồng',
      lead: 'Robusta ghép, trồng thẳng hàng như kẻ chỉ.',
      text: 'Giống Robusta ghép Thiện Trường. Hàng cách hàng 3 m, cây cách cây 1,5 m, khoảng 2.200 cây mỗi ha.',
      viSao: 'Cà phê vối (Robusta) là cây quen của đất bazan Gia Lai. Cây ghép từ dòng tốt cho vườn đồng đều hơn trồng từ hạt [cần xác nhận: lý do chọn dòng Thiện Trường]. Hàng rộng 3 m chừa lối cho người và xe chăm sóc, cây dày 1,5 m [cần xác nhận: lý do chọn mật độ 2.200 cây/ha].',
      stats: [['2.200', 'cây / ha'], ['3 × 1,5', 'm khoảng cách']],
      media: [{ src: 'tu-xem/m/giong-1.mp4', cap: 'Các luống chạy về phía núi · 01/07/2026' }, { src: 'tu-xem/m/giong-2.mp4', cap: 'Cây vừa trồng ở khu C3, C4 · 23/07/2026' }, { src: 'tu-xem/m/nay-a.webp', cap: 'Cây cà phê sau gần bốn tháng · 31/10/2026' }],
      fx: [{ t: 'spot', at: 'khu-A' }, { t: 'zones', ids: ['A'], label: true }] },

    { id: 'bai-hoc-gio', trangThai: 'da-co', hanhTrinh: { nong: 70 },
      loi: 'Những tháng đầu, vườn gặp bài học đầu tiên. Đất xung quanh còn trống, gió thổi thẳng qua các hàng cây con. Cây non rễ còn nông, gió lùa làm lá mất nước nhanh hơn rễ hút lên, nên lá bị khô. Vườn sửa ngay. Cuối tháng 7, đội vườn đào mương trồng cây chắn gió ở khu C. Rồi trồng xen những hàng cau giữa các hàng cà phê. Vài năm nữa, cau lớn lên sẽ thành bức tường chắn gió, và che bớt nắng gắt cho cà phê.',
      at: 'khu-C3', fov: 92, kicker: 'Bài học giai đoạn đầu', title: 'Gió làm khô cây non',
      lead: 'Đất trống, gió lùa thẳng vào hàng cây con.',
      text: 'Những tháng đầu, vùng đất quanh vườn còn trống, gió thổi qua làm cây non mất nước, khô lá [cần xác nhận: tháng nào, khu nào bị nặng].',
      viSao: 'Vườn rút ra bài học ngay: cuối tháng 7 đào mương trồng cây chắn gió ở khu C, rồi xen hàng cau giữa cà phê. Cau lớn lên sẽ chắn gió và che bớt nắng gắt cho cà phê.',
      stats: [['12 × 1,8', 'm hàng cau'], ['28/07', 'đào mương chắn gió khu C']],
      media: [{ src: 'tu-xem/m/cau-1.mp4', cap: 'Cau giống chờ trồng · 22/09/2026' }, { src: 'tu-xem/m/cau-a.webp', cap: 'Cây cau con trên lớp rơm · 21/10/2026' }, { src: 'tu-xem/m/cau-b.webp', cap: 'Hàng cau xen giữa cà phê' }],
      fx: [{ t: 'zones', ids: ['C1', 'C2', 'C3', 'C4', 'C5'], rgb: '245,228,161', label: true }] },

    { id: 'rom', trangThai: 'da-co', hanhTrinh: { nong: 80 },
      loi: 'Cuối tháng 9, đội vườn phủ rơm quanh từng gốc cây. Luống cũng được đắp cao từ trước. Vì sao phải phủ rơm? Ở đây, nắng và gió làm mặt đất trống bốc hơi rất nhanh. Lớp rơm như một tấm chăn che đất, giữ ẩm lâu hơn. Nhờ vậy, mỗi lượt tưới nuôi cây được lâu hơn, đỡ phải bơm thêm nước. Rơm mục dần lại thành mùn, đất bazan thêm tơi xốp. Hiện đã có 4 khu được phủ rơm.',
      at: 'vuon', fov: 100, kicker: 'Tháng 9 – 10/2026', title: 'Luống cao, rơm giữ ẩm',
      lead: 'Chăm đất trước, cây sẽ khoẻ sau.',
      text: 'Luống được đắp cao, cuối tháng 9 đội vườn phủ rơm quanh gốc.',
      viSao: 'Nắng và gió làm mặt đất trống bốc hơi rất nhanh. Lớp rơm che đất, giữ ẩm lâu hơn, nên mỗi lượt tưới nuôi cây được lâu hơn. Rơm mục dần còn thành mùn, đất bazan thêm tơi.',
      stats: [['4', 'khu đã phủ rơm']],
      media: [{ src: 'tu-xem/m/rom-1.mp4', cap: 'Rơm rải theo hàng cây · 30/09/2026' }, { src: 'tu-xem/m/nay-b.webp', cap: 'Hàng cà phê có rơm quanh gốc · 22/10/2026' }, { src: 'tu-xem/m/rom-b.webp', cap: 'Rơm phủ kín luống' }],
      fx: [{ t: 'zones', ids: ['C4', 'C1', 'C2', 'A'], rgb: '245,228,161', label: true }] },

    { id: 'mot-ngay', trangThai: 'da-co', hanhTrinh: { nong: 90 },
      loi: 'Một ngày trên vườn bắt đầu từ sáng sớm. Sáng làm cỏ, chiều đi kiểm tra từng béc tưới, đến kỳ thì bón phân. Việc nào cũng được ghi vào nhật ký, có ảnh đi kèm. Vì sao phải ghi kỹ như vậy? Vì đây là vườn mới, trên mảnh đất mới, chưa ai có kinh nghiệm sẵn cho đúng chỗ này. Ghi lại khu nào đã bón, đã tưới bao nhiêu, và cây phản ứng ra sao, thì mùa sau vườn làm theo đất Ia Ko, chứ không làm theo thói quen.',
      at: 'khu-B1', fov: 82, kicker: 'Mỗi ngày', title: 'Một ngày trên vườn',
      lead: 'Việc nhỏ mỗi ngày, ghi lại đầy đủ.',
      text: 'Sáng làm cỏ, chiều kiểm tra béc tưới, đến kỳ thì bón phân. Việc nào cũng được ghi vào nhật ký.',
      viSao: 'Vườn mới trồng trên đất mới, chưa ai có kinh nghiệm sẵn cho đúng mảnh đất này. Ghi lại khu nào đã bón, đã tưới bao nhiêu và cây phản ứng ra sao, thì mùa sau làm theo đất Ia Ko chứ không làm theo thói quen.',
      media: [{ src: 'tu-xem/m/nay-1.mp4', cap: 'Buổi sáng trên vườn · 05/10/2026' }, { src: 'tu-xem/m/rom-2.mp4', cap: 'Xe chở rơm vào vườn · 06/10/2026' }, { src: 'tu-xem/m/nay-2.mp4', cap: 'Biển tên khu B2 · 26/10/2026' }],
      fx: [{ t: 'zones', ids: ['B1'], label: true }] },

    { id: 'bao-gio', trangThai: 'dang-lam', hanhTrinh: { nong: 100 },
      loi: 'Bao giờ thì có trái? Cà phê cần khoảng ba năm kiến thiết cơ bản, để bộ rễ ăn sâu và cành khung đủ vững. Năm 2027, năm 2028, và năm 2029 là ba năm chăm sóc. Nếu mọi thứ thuận lợi, vườn sẽ cho mùa trái bói đầu tiên vào khoảng tháng 11 năm 2029. Từ giờ tới đó, mỗi lượt tưới, mỗi đợt bón đều được ghi lại. Để đến mùa trái đầu tiên, vườn biết chính xác cây đã lớn lên như thế nào.',
      at: 'vuon', fov: 96, kicker: 'Lịch của cây', title: 'Bao giờ có trái?',
      lead: 'Ba năm chăm, một mùa bói.',
      text: 'Cà phê cần ba năm kiến thiết cơ bản để bộ rễ và cành khung vững. Nếu thuận lợi, vườn cho mùa trái bói đầu tiên khoảng tháng 11/2029.',
      timeline: [['7/2026', 'Xuống giống'], ['2027', 'Chăm năm 1'], ['2028', 'Chăm năm 2'], ['2029', 'Chăm năm 3'], ['11/2029', 'Thu bói, dự kiến']],
      media: [{ src: '../img/real-flower.webp', cap: 'Hoa cà phê', illus: true }, { src: '../img/coffee-cherries.webp', cap: 'Trái chín', illus: true }],
      fx: [{ t: 'zones', ids: ['A', 'B1', 'B2', 'C1', 'C2', 'C3', 'C4', 'C5'], wave: true, rgb: '255,140,90' }] },

    { id: 'chuong-sap-toi', kieu: 'chuong', trangThai: 'du-kien', hanhTrinh: { nong: 110 },
      loi: 'Đó là những gì vườn đã có. Tiếp theo là quy hoạch sắp tới. Những hạng mục sắp kể chưa có trên vườn, nên trên ảnh, chúng được vẽ bằng nét đứt.',
      kicker: 'Sắp tới · Quy hoạch dự kiến', title: 'Vườn sẽ lớn thêm như thế nào',
      sub: 'Những gì sắp kể chưa có trên vườn. Trên ảnh, chúng được vẽ bằng nét đứt.',
      fx: [{ t: 'quyHoach' }] },

    { id: 'ho-phan', trangThai: 'du-kien', hanhTrinh: { nong: 120, 'sap-toi': 10 },
      loi: 'Hạng mục dự kiến đầu tiên là một hồ phân. Ở góc tây bắc của vườn, chỗ những mái nhà màu xanh, là một trang trại chăn nuôi. Theo quy hoạch, phân từ trang trại sẽ được kéo về hồ, và nước phân dùng để tưới cho cây. Vì sao lại làm như vậy? Cà phê con trên đất mới khai hoang cần thêm chất hữu cơ, để đất tơi, giữ ẩm và nuôi rễ. Phân có sẵn ngay cạnh vườn. Đưa về hồ để tưới thì vừa cải tạo đất, vừa không để phân thành chất thải của cả vùng.',
      at: 'ho-phan', fov: 84, kicker: 'Quy hoạch · Nước phân', title: 'Một hồ phân',
      lead: 'Phân chuồng thành nước tưới, nuôi đất.',
      text: 'Đào một hồ phân [cần xác nhận: vị trí, đang vẽ tạm ở khu C1]. Phân kéo từ trang trại chăn nuôi ở góc tây bắc vườn về hồ, nước phân dùng để tưới.',
      viSao: 'Cà phê con trên đất mới cần thêm chất hữu cơ để đất tơi, giữ ẩm và nuôi rễ. Trang trại chăn nuôi ngay sát vườn có sẵn phân; đưa về hồ để tưới vừa cải tạo đất, vừa không để phân thành chất thải của vùng.',
      media: [{ src: 'tu-xem/m/quy-hoach.svg', cap: 'Sơ đồ dự kiến: trang trại chăn nuôi, hồ phân, hai hồ nước', so: true }],
      fx: [{ t: 'quyHoach', noiBat: 'ho-phan' }] },

    { id: 'ho-moi', trangThai: 'du-kien', hanhTrinh: { nong: 130, 'sap-toi': 20 },
      loi: 'Tiếp theo là một hồ nước mới, cỡ như hồ hiện tại, đặt ở phía bên kia vườn, để tưới cho phân khu đó. 3 giếng đang có đã phục vụ cho hồ cũ, nên hồ mới sẽ cần khoan thêm giếng. Vì sao cần thêm hồ? Một hồ chỉ đủ dùng vài tuần mùa khô, lại nằm ở một phía vườn. Có thêm hồ thì mỗi hồ lo cho phần vườn gần nó, và cả vườn trữ được gấp đôi lượng nước, trước khi khô hạn kéo tới.',
      at: 'ho-moi', fov: 86, kicker: 'Quy hoạch · Nước', title: 'Thêm một hồ nước, thêm giếng',
      lead: 'Hồ thứ hai cho phân khu bên kia.',
      text: 'Đào thêm một hồ nước cỡ như hồ hiện tại, để tưới cho phân khu phía bên này [cần xác nhận: vị trí, đang vẽ tạm ở khu C3]. 3 giếng hiện có đang phục vụ hồ cũ, nên hồ mới cần khoan thêm giếng [cần xác nhận: thêm mấy giếng].',
      viSao: 'Một hồ chỉ đủ dùng vài tuần mùa khô, lại nằm ở một phía vườn. Thêm hồ ở phía đông thì mỗi hồ lo cho phần vườn gần nó, và cả vườn trữ được gấp đôi nước trước khi khô hạn tới.',
      stats: [['2', 'hồ nước khi xong'], ['Thêm', 'giếng khoan mới']],
      media: [{ src: 'tu-xem/m/quy-hoach.svg', cap: 'Sơ đồ dự kiến: hồ nước mới ở phía đông', so: true }, { src: 'tu-xem/m/ho-1.mp4', cap: 'Hồ hiện tại, hồ mới cỡ tương tự · 18/06/2026' }],
      fx: [{ t: 'quyHoach', noiBat: 'ho-moi' }] },

    { id: 'ba-ho', trangThai: 'du-kien', hanhTrinh: { nong: 140, 'sap-toi': 30 },
      loi: 'Khi làm xong, hồ phân và hai hồ nước sẽ nối thông với nhau, nối tiếp với trang trại chăn nuôi. Khu nào thiếu nước có thể lấy từ hồ bên cạnh. Nước phân được pha vào nước tưới, theo lượng chuyên gia đặt cho từng giai đoạn của cây. Vườn cũng sẽ mở rộng thêm khoảng 6 hàng. Cả vườn thành một hệ thống chung, không phải mỗi khu tự lo. Mỗi hạng mục làm xong sẽ chuyển từ dự kiến sang đã có, ngay trong hành trình này.',
      at: 'ho', fov: 112, nhin: [14, -14], kicker: 'Quy hoạch · Cả vườn', title: 'Ba hồ thông nhau',
      lead: 'Nước và phân đi chung một mạng.',
      text: 'Khi xong, hồ phân và hai hồ nước nối thông nhau, nối tiếp với trang trại chăn nuôi. Vườn cũng mở rộng thêm khoảng 6 hàng [cần xác nhận: hàng gì, ở khu nào].',
      viSao: 'Hồ thông nhau thì khu nào thiếu nước lấy được từ hồ bên cạnh, nước phân pha vào nước tưới theo lượng chuyên gia đặt. Cả vườn thành một hệ thống, không phải mỗi khu tự lo.',
      stats: [['3', 'hồ thông nhau'], ['~6', 'hàng mở rộng']],
      media: [{ src: 'tu-xem/m/quy-hoach.svg', cap: 'Sơ đồ dự kiến: ba hồ nối với trang trại chăn nuôi', so: true }],
      fx: [{ t: 'quyHoach' }], drift: 2 },

    // =================== HÀNH TRÌNH 2 ===================
    { id: 'ban-do', trangThai: 'da-co', hanhTrinh: { tech: 10 },
      loi: 'Hành trình này đi qua từng lớp công nghệ của vườn. Lớp đầu tiên là bản đồ. 22 héc ta được chia thành 8 khu trồng, ranh từng khu là dữ liệu bản đồ có toạ độ. Vì sao phải số hoá? Vì đất ở Ia Ko không đồng đều. Mỗi khu có độ dốc, độ ẩm và ngày trồng riêng. Có ranh số, mọi số đo, nhật ký và hình ảnh đều gắn đúng vào khu của nó. Chuyên gia so được khu này với khu kia, và chăm theo từng khu, thay vì coi cả vườn như một.',
      at: 'vuon', fov: 100, kicker: 'Lớp 0 · Bản đồ', title: 'Một khu vườn được số hoá',
      lead: 'Mỗi khu có toạ độ, mỗi số đo có chỗ đứng.',
      text: '22 ha chia thành 8 khu trồng. Ranh từng khu là dữ liệu bản đồ, nên mọi số đo, nhật ký và ảnh đều gắn đúng vào khu của nó.',
      viSao: 'Đất Ia Ko không đồng đều: mỗi khu có độ dốc, độ ẩm và ngày trồng riêng. Có ranh số thì chuyên gia so được khu này với khu kia, chăm theo từng khu thay vì coi 22 ha như một.',
      stats: [['22', 'ha'], ['8', 'khu trồng']],
      media: [{ src: '../img/ban-do-khu.webp', cap: 'Bản đồ 8 khu trồng vườn Ia Ko' }, { src: '../img/dash-ban-do.webp', cap: 'Bản đồ thiết bị trên Dashboard', fit: true }],
      fx: [{ t: 'trace', rgb: '124,195,217' }] },

    { id: 'do-dat', trangThai: 'dang-lam', hanhTrinh: { tech: 20 },
      loi: 'Lớp thứ hai là đất. Đầu đo cắm dưới gốc cây, đo độ ẩm, nhiệt độ, độ chua, lượng phân hoà tan, cùng đạm, lân và kali. Vườn thiết kế 9 điểm đo, đang lắp dần. Vì sao cần nhiều điểm như vậy? Vì đất ở đây không khô đều. Cùng một lúc, chỗ ẩm nhất và chỗ khô nhất trong vườn chênh nhau hơn 50 điểm phần trăm. Đo ở nhiều điểm thì chỉ tưới bù chỗ thiếu, không phải tưới cả khu theo chỗ khô nhất. Vào mùa khô, đó là cả một phần hồ nước được giữ lại.',
      at: 'khu-A', fov: 84, kicker: 'Lớp 1 · Đất', title: 'Điểm đo đất',
      lead: 'Biết đất khô hay ẩm trước khi mở van.',
      text: 'Đầu đo cắm dưới gốc đo độ ẩm, nhiệt độ, pH, EC và đạm, lân, kali. Vườn thiết kế 9 điểm, đang lắp dần.',
      viSao: 'Ở Ia Ko đất không khô đều: cùng một lúc, chỗ ẩm nhất và chỗ khô nhất chênh nhau hơn 50 điểm phần trăm. Đo nhiều điểm thì chỉ tưới bù chỗ thiếu, không phải tưới cả khu theo chỗ khô nhất, đỡ được nước trong mùa khô.',
      stats: [['9', 'điểm đo theo thiết kế'], ['7', 'chỉ số đất']],
      media: [{ src: '../img/dev-soil.webp', cap: 'Đầu đo trong đất đỏ bazan' }, { src: '../img/dev-pole.webp', cap: 'Cột thiết bị giữa hàng' }],
      fx: [{ t: 'pings', kind: 'soil', rgb: '232,186,104' }] },

    { id: 'do-nuoc', trangThai: 'da-co', hanhTrinh: { tech: 30 },
      loi: 'Lớp thứ ba là nước. Cạnh hồ, trên đường ống chính, có một hộp đo độ chua, độ dẫn điện và nhiệt độ của nước tưới. Mọi lượt tưới đều đi qua đây. Vì sao phải đo nước ở Ia Ko? Nước hồ ở đây thường hơi kiềm, có lúc kiềm khá cao. Nước kiềm làm phân bón hoà theo nước kém tác dụng, lại dễ đóng cặn, làm tắc béc tưới. Đo liên tục ngay cạnh hồ, thì biết lúc nào nên hoãn châm phân, tránh bón phí và tránh tắc đường ống.',
      at: 'ho', fov: 66, kicker: 'Lớp 2 · Nước', title: 'Điểm đo nước',
      lead: 'Mọi lượt tưới đều đi qua đây.',
      text: 'Hộp đo trên đường ống cạnh hồ theo dõi pH, EC và nhiệt độ của nước tưới.',
      viSao: 'Nước hồ ở Ia Ko thường kiềm, pH hay trên 7,5, có lúc lên trên 9 [cần xác nhận: kỹ thuật kiểm số pH]. Nước kiềm làm phân châm theo nước kém tác dụng và dễ đóng cặn tắc béc. Đo liên tục ngay cạnh hồ để biết lúc nào nên hoãn châm phân.',
      stats: [['3', 'chỉ số nước'], ['8,5', 'ngưỡng cảnh báo pH']],
      media: [{ src: '../img/dev-water.webp', cap: 'Hộp đo nước cạnh đường ống' }, { src: '../img/real-lake.webp', cap: 'Hồ trữ nước' }],
      fx: [{ t: 'spot', at: 'ho' }, { t: 'pings', kind: 'water', rgb: '111,199,224' }, { t: 'ripple', at: 'ho', rgb: '111,199,224' }] },

    { id: 'tram', trangThai: 'da-co', hanhTrinh: { tech: 40 },
      loi: 'Lớp thứ tư là trời. Một trạm trung tâm đo nhiệt độ, độ ẩm, gió, mưa, ánh sáng, và lưu lượng của hai máy bơm. Thời tiết dùng chung cho cả vườn, nên một trạm là đủ. Vì sao cần đo mưa ngay tại vườn? Mỗi mi li mét mưa là 10 mét khối nước trên một héc ta. Biết mưa bao nhiêu thì hoãn được lượt tưới. Nhưng mưa nhỏ chưa chắc đã đủ. Trận mưa 1,2 mi li mét ngày 12 tháng 11 không làm điểm đo đất nào ẩm lên. Vì vậy, số mưa luôn được đọc cùng độ ẩm đất.',
      at: 'tram', fov: 72, kicker: 'Lớp 3 · Trời', title: 'Trạm trung tâm',
      lead: 'Thời tiết dùng chung, một trạm cho cả vườn.',
      text: 'Một trạm đo nhiệt độ, độ ẩm, gió, mưa, ánh sáng và lưu lượng hai máy bơm.',
      viSao: 'Mỗi milimét mưa là 10 m³ nước trên một ha, nên biết mưa bao nhiêu ngay tại vườn thì hoãn được lượt tưới. Nhưng mưa nhỏ chưa chắc đủ: trận 1,2 mm ngày 12/11 không làm điểm đo đất nào ẩm lên. Vì vậy số mưa luôn được đọc cùng độ ẩm đất.',
      stats: [['10', 'm³ / ha mỗi mm mưa'], ['2', 'máy bơm theo dõi']],
      media: [{ src: '../img/dev-weather.webp', cap: 'Trạm thời tiết trên cột' }, { src: '../img/dash-thoi-tiet.webp', cap: 'Dashboard: nhiệt độ và độ ẩm 7 ngày', fit: true }, { src: '../img/recap-gl-6824.webp', cap: 'Cảm biến gió, mưa' }],
      fx: [{ t: 'spot', at: 'tram' }, { t: 'links', to: 'tram', kinds: ['soil', 'water'] }] },

    { id: 'dong-ho', trangThai: 'da-co', hanhTrinh: { tech: 50 },
      loi: 'Đi cùng với trạm là đồng hồ nước. Mỗi lượt tưới thật sự đi bao nhiêu mét khối, đồng hồ đều ghi lại. Vì sao không đếm theo giờ chạy máy bơm, như nhiều vườn vẫn làm? Vì lượng nước giếng ra khác nhau theo từng giếng, và giảm dần khi mực nước hạ. Đếm theo giờ thì dễ tưới thừa. Ngày 16 tháng 11, nước qua đồng hồ chưa bằng một nửa lượt trước. Sáng hôm sau, hệ thống nhắc đội vườn kiểm tra béc tưới và đường ống.',
      at: 'nha-dieu-hanh', fov: 66, kicker: 'Lớp 3 · Lượng nước', title: 'Đồng hồ nước',
      lead: 'Đếm nước bằng mét khối, không đoán theo giờ bơm.',
      text: 'Đồng hồ trên đường bơm ghi mỗi lượt tưới thật sự đi bao nhiêu nước.',
      viSao: 'Lượng nước giếng ra đổi theo từng giếng và giảm khi mực nước hạ, nên đếm bằng giờ chạy máy dễ tưới thừa. Ngày 16/11, nước qua đồng hồ chưa bằng nửa lượt trước; sáng hôm sau hệ thống nhắc kiểm tra béc và đường ống.',
      stats: [['16/11', 'phát hiện lượt tưới bất thường']],
      media: [{ src: '../img/acad-tuoi-tieu.webp', cap: 'Tưới tại gốc', illus: true }, { src: 'tu-xem/m/ong-2.mp4', cap: 'Ống nhỏ chạy sát cây con · 07/07/2026' }],
      fx: [{ t: 'spot', at: 'nha-dieu-hanh' }, { t: 'flow', from: 'ho', to: 'zones', rgb: '111,199,224' }] },

    { id: 'camera', trangThai: 'dang-lam', hanhTrinh: { tech: 60 },
      loi: 'Lớp thứ năm là hình ảnh. Camera chạy bằng pin mặt trời, gắn trên cột, góc nhìn khoảng 110 độ, đặt ở chỗ thấy được nhiều hàng cây nhất. Vườn có 22 vị trí camera, đang lắp dần. Vì sao cần camera? Vườn được vận hành tập trung, chuyên gia ở xa. Camera cho thấy việc tưới, phun, làm cỏ có được làm thật, có đúng lúc không, và cây đang lên ra sao, mà không cần lái xe lên vườn mỗi ngày. Nhật ký canh tác vì thế có hình làm chứng.',
      at: 'khu-C4', fov: 80, kicker: 'Lớp 4 · Hình ảnh', title: 'Camera trên cột',
      lead: 'Nhật ký có hình làm chứng.',
      text: 'Camera chạy pin mặt trời, góc nhìn khoảng 110°, đặt ở chỗ thấy nhiều hàng cây nhất. Vườn có 22 vị trí, đang lắp dần.',
      viSao: 'Vườn được vận hành tập trung, chuyên gia ở xa. Camera cho thấy việc tưới, phun, làm cỏ có làm thật, đúng lúc, và cây đang lên ra sao, không cần lái xe lên vườn mỗi ngày.',
      stats: [['22', 'vị trí camera'], ['110°', 'góc nhìn']],
      media: [{ src: '../img/dev-camera.webp', cap: 'Cột camera giữa hàng cà phê con' }, { src: '../img/real-camera-rows.webp', cap: 'Camera nhìn dọc hàng cây' }],
      fx: [{ t: 'cones' }] },

    { id: 'dien', trangThai: 'da-co', hanhTrinh: { tech: 70 },
      loi: 'Lớp thứ sáu là năng lượng. Mái Nhà điều hành là dàn pin 41,5 ki lô oát. Điện mặt trời chạy máy bơm từ giếng lên hồ, từ hồ ra đường ống, và chạy hai bộ châm phân theo nước tưới. Vì sao chọn điện mặt trời cho vườn này? Vì vườn tự bơm toàn bộ nước, nên điện là khoản chi chạy theo nước. Mùa khô vừa là lúc nắng nhất, vừa là lúc phải bơm nhiều nhất. Điện mặt trời khớp đúng nhịp của vườn.',
      at: 'nha-dieu-hanh', fov: 62, kicker: 'Lớp 5 · Năng lượng', title: 'Điện từ mái nhà',
      lead: 'Nắng thành điện, điện thành nước.',
      text: 'Mái Nhà điều hành là dàn pin 41,5 kWp, chạy bơm từ giếng lên hồ và từ hồ ra đường ống, kèm hai bộ châm phân theo nước tưới.',
      viSao: 'Vườn tự bơm toàn bộ nước nên điện là khoản chạy theo nước. Mùa khô vừa nắng nhất vừa phải bơm nhiều nhất, nên điện mặt trời khớp đúng nhịp của vườn.',
      stats: [['41,5', 'kWp'], ['2', 'bộ châm phân']],
      media: [{ src: '../img/air-solar.webp', cap: 'Dàn pin trên mái' }, { src: 'tu-xem/m/pin-gan.webp', cap: 'Mái pin nhìn gần' }, { src: '../img/air-house.webp', cap: 'Nhà điều hành cạnh hồ' }],
      fx: [{ t: 'spot', at: 'nha-dieu-hanh' }, { t: 'rays', at: 'nha-dieu-hanh' }, { t: 'flow', from: 'nha-dieu-hanh', to: 'ho', rgb: '245,228,161' }] },

    { id: 'du-lieu', trangThai: 'da-co', hanhTrinh: { tech: 80 },
      loi: 'Lớp thứ bảy là dữ liệu. Khoảng 10 phút một lần, số đo đất, nước và mưa được gửi lên máy chủ, cùng sổ ghi việc hằng ngày, về một màn hình chung là Dashboard vận hành. Mỗi sáng, hệ thống đối chiếu lộ trình tưới mà chuyên gia đặt cho tuổi cây, với số đo thực tế và dự báo thời tiết, rồi gợi ý cho ngày hôm đó. Chỗ nào cần tưới bù, khi nào nên hoãn. Người quản lý xem xét và quyết định. Nhờ vậy, một người theo dõi được nhiều vườn ở nhiều xã.',
      at: 'tram', fov: 94, kicker: 'Lớp 6 · Đám mây', title: 'Dữ liệu về một nơi',
      lead: 'Từ một gốc cây tới một màn hình.',
      text: 'Khoảng 10 phút một lần, số đo đất, nước, mưa được gửi lên máy chủ, cùng sổ ghi việc hằng ngày, về Dashboard vận hành.',
      viSao: 'Mỗi sáng hệ thống đối chiếu lộ trình tưới chuyên gia đặt cho tuổi cây với số đo và dự báo thời tiết, rồi gợi ý cho ngày hôm đó: chỗ nào tưới bù, khi nào hoãn. Người quản lý xem và quyết định. Một người theo dõi được nhiều vườn ở nhiều xã.',
      stats: [['10', 'phút một lần đo']],
      media: [{ src: '../img/dash-nhat-ky.webp', cap: 'Dashboard: nhật ký canh tác kèm ảnh' }, { src: '../img/dash-camera.webp', cap: 'Dashboard: bản đồ camera và hình trực tiếp', fit: true }],
      fx: [{ t: 'links', to: 'tram', kinds: ['soil', 'water', 'camera'] }, { t: 'uplink', at: 'tram' }] },

    { id: 'ho-so', trangThai: 'da-co', hanhTrinh: { tech: 90 },
      loi: 'Lớp thứ tám là hồ sơ. Ranh giới số, mã QR, nhật ký, và các danh mục kiểm tra theo tiêu chuẩn Việt GAP và Global GAP được gom thành hồ sơ vùng trồng của vườn. Vì sao cần ngay từ bây giờ? Vườn khai hoang năm 2026. Quy định chống mất rừng của châu Âu yêu cầu chứng minh đất không phải là rừng bị phá sau ngày 31 tháng 12 năm 2020. Ranh số và nhật ký có hình, ghi lại từ ngày đầu tiên, chính là bằng chứng.',
      at: 'vuon', fov: 104, kicker: 'Lớp 7 · Hồ sơ', title: 'Hồ sơ vùng trồng',
      lead: 'Truy được nguồn gốc tới từng khu.',
      text: 'Ranh giới số cùng mã QR, nhật ký và checklist theo VietGAP, GLOBALG.A.P. và quy định EUDR của châu Âu được gom thành hồ sơ của vườn.',
      viSao: 'Vườn khai hoang mới năm 2026, nên phải chứng minh được đất không phải rừng bị phá sau mốc 31/12/2020 của EUDR. Ranh số và nhật ký có hình ghi từ ngày đầu là bằng chứng sẵn có [cần xác nhận: hiện trạng đất trước khai hoang].',
      stats: [['31/12/2020', 'mốc EUDR']],
      media: [{ src: '../img/ban-do-khu.webp', cap: 'Ranh 8 khu trồng, gắn vào hồ sơ vườn' }, { src: '../img/sotay-3.webp', cap: 'Hồ sơ vùng trồng', phone: true }],
      fx: [{ t: 'boundary', rgb: '181,227,131' }] },

    { id: 'chuong-sap-lap', kieu: 'chuong', trangThai: 'du-kien', hanhTrinh: { tech: 100 },
      loi: 'Đó là những lớp công nghệ đang chạy trên vườn. Tiếp theo là những công nghệ sẽ lắp thêm, theo quy hoạch dự kiến.',
      kicker: 'Sắp tới · Dự kiến', title: 'Công nghệ sẽ lắp thêm',
      sub: 'Hạng mục nào làm xong sẽ chuyển thành một điểm dừng "Đã có" trong hành trình này.',
      fx: [{ t: 'quyHoach' }] },

    { id: 'cn-nuoc', trangThai: 'du-kien', hanhTrinh: { tech: 110, 'sap-toi': 40 },
      loi: 'Khi vườn có ba hồ thông nhau, vườn sẽ cần thêm công nghệ cho nước. Đo mực nước từng hồ, đếm nước từng giếng bơm lên, và lượng nước chuyển giữa các hồ. Vì sao điều này quan trọng ở Ia Ko? Các giếng trong một vùng cùng hút chung một tầng nước ngầm. Khoan thêm giếng không tạo ra nước mới. Đo được từng mét khối, là cách để vườn đi hết mùa khô, mà không hút cạn phần nước của các vườn xung quanh.',
      at: 'ho-moi', fov: 100, kicker: 'Lớp 2 · Nước, mở rộng', title: 'Công nghệ cho ba hồ nước',
      lead: 'Biết từng giếng bơm bao nhiêu, từng hồ còn bao nhiêu.',
      text: 'Khi có ba hồ thông nhau, vườn cần đo mực nước từng hồ, lượng nước từng giếng và nước chuyển giữa các hồ [cần xác nhận: thiết bị cụ thể].',
      viSao: 'Các giếng trong một vùng hút chung một tầng nước, khoan thêm giếng không tạo ra nước mới. Đo được từng khối nước là cách để vườn đi hết mùa khô mà không hút cạn phần nước của các vườn xung quanh.',
      media: [{ src: 'tu-xem/m/quy-hoach.svg', cap: 'Sơ đồ dự kiến: ba hồ thông nhau', so: true }],
      fx: [{ t: 'quyHoach', noiBat: 'ong-noi' }] },

    { id: 'cn-phan', trangThai: 'du-kien', hanhTrinh: { tech: 120, 'sap-toi': 50 },
      loi: 'Cùng với hồ phân là công nghệ xử lý phân. Phân từ trang trại chăn nuôi sẽ được xử lý ở hồ, trước khi pha vào nước tưới. Nước phân cũng được đo trước khi ra đường ống. Vì sao phải kỹ như vậy? Ống nhỏ giọt và béc tưới rất dễ tắc, còn rễ cà phê non lại dễ tổn thương. Xử lý và đo trước, thì vừa tận dụng được nguồn phân ngay cạnh vườn, vừa không hại cây, không hại đường ống.',
      at: 'ho-phan', fov: 90, kicker: 'Lớp 1 · Đất, mở rộng', title: 'Công nghệ xử lý phân',
      lead: 'Phân chuồng phải qua xử lý mới vào ống tưới.',
      text: 'Phân từ trang trại chăn nuôi được xử lý ở hồ phân trước khi pha vào nước tưới; nước phân được đo trước khi ra đường ống [cần xác nhận: cách xử lý, thiết bị đo].',
      viSao: 'Ống nhỏ giọt và béc tưới rất dễ tắc, rễ cà phê non lại dễ tổn thương. Xử lý và đo nước phân trước thì vừa tận dụng được phân của trang trại bên cạnh, vừa không hại cây và đường ống.',
      media: [{ src: 'tu-xem/m/quy-hoach.svg', cap: 'Sơ đồ dự kiến: trang trại chăn nuôi và hồ phân', so: true }],
      fx: [{ t: 'quyHoach', noiBat: 'trai-chan-nuoi' }] },

    { id: 'noi-that', trangThai: 'da-co', hanhTrinh: { tech: 130 },
      loi: 'Cuối cùng, nói thật về những gì công nghệ đang làm được. Hôm nay, hệ thống quan trắc, ghi nhận và hỗ trợ quản lý. Quyết định tưới bao nhiêu, bón lúc nào, vẫn do người làm vườn và chuyên gia đưa ra. Trí tuệ nhân tạo chỉ gợi ý, chuyên gia xác minh. Công nghệ ở đây không đứng một mình. Nó được làm riêng cho đất bazan, cho nguồn nước giếng, và cho cách trồng cà phê ở chính vườn Ia Ko này.',
      at: 'vuon', fov: 114, kicker: 'Nói thật', title: 'Công nghệ đang làm được gì',
      lead: 'Dữ liệu giúp người làm vườn, không thay họ.',
      text: 'Hôm nay hệ thống quan trắc, ghi nhận và hỗ trợ quản lý. Quyết định tưới, bón vẫn do người làm vườn và chuyên gia đưa ra; AI chỉ gợi ý, chuyên gia xác minh.',
      media: [{ src: 'tu-xem/m/thang9-rong.webp', cap: 'Vườn Ia Ko tháng 9/2026' }, { src: 'tu-xem/m/pin-cao.webp', cap: 'Toàn vườn từ trên cao' }],
      link: ['Mở Dashboard', 'https://dashboard.farmblock.vn/'],
      fx: [{ t: 'pings', kind: 'all' }], drift: 2.2 }
  ]
};
