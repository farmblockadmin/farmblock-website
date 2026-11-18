/* Học viện FarmBlock: ảnh bìa vẽ bằng code (chữ bên trái, hình vector bên phải).
   Dùng chung cho trang danh sách, trang bài, trang soạn bài và script dựng sẵn (node).
   Bài mới chưa có trong BAI: tự lấy chữ từ tiêu đề và hình theo chủ đề chính. */
(function (root) {
  'use strict';
  var HV = root.HV || (typeof require === 'function' ? require('./hv.js') : {});

  /* ---------- bảng màu thương hiệu ---------- */
  var C = {
    g1: '#13331C', g2: '#2D6639', g3: '#3A8047', g4: '#61996C', l1: '#86C046', l2: '#B5E383', l3: '#DDF2C4',
    s1: '#2F8FB5', s2: '#51ADCA', s3: '#9ED6E8', s4: '#DDF1F8',
    d1: '#4E2A1C', d2: '#7A3F27', d3: '#A4583A', d4: '#C98C66', d5: '#E6C3A1',
    c1: '#F5E4A1', c2: '#FBF2D3', w: '#FFFFFF', o: '#E3A21A', r: '#C8553D', gr: '#8C9A92'
  };

  /* ---------- 7 nhóm chủ đề (theo lộ trình học) ---------- */
  var T = [
    { id: 'khai-niem', name: 'Khái niệm nền tảng', tags: ['Những khái niệm cơ bản'], m: 'pin', bg: '#EEF5E6', disc: '#DDEBCB', acc: '#3A8047', ds: 'Vùng trồng, năng suất, mùa vụ và cách nông nghiệp hiện đại vận hành.' },
    { id: 'cau-tao-dat', name: 'Cấu tạo và tính chất đất', tags: ['Cấu tạo và tính chất đất'], m: 'soil', bg: '#F6EFE5', disc: '#EBDCC8', acc: '#93512F', ds: 'Đất hình thành ra sao, đất bazan, cấu trúc, độ nén, khả năng giữ và thoát nước.' },
    { id: 'hoa-hoc-dat', name: 'Hóa học đất', tags: ['Hóa học đất'], m: 'ph', bg: '#EDF3EE', disc: '#D5E6DA', acc: '#2D6639', ds: 'pH, đất chua, CEC, EC, độ mặn và chất hữu cơ trong đất.' },
    { id: 'sinh-hoc-dat', name: 'Sinh học đất', tags: ['Sinh học đất'], m: 'microbe', bg: '#F1F6E4', disc: '#DFEBC3', acc: '#5A812E', ds: 'Vi sinh vật, nấm có lợi, giun đất, mùn và phân hữu cơ.' },
    { id: 'dinh-duong', name: 'Dinh dưỡng cây trồng', tags: ['Dinh dưỡng cây trồng'], m: 'elements', bg: '#F8F4E2', disc: '#EFE5BC', acc: '#8A6A12', ds: 'Đạm, lân, kali, trung và vi lượng; bón phân sao cho cân đối.' },
    { id: 'nuoc', name: 'Nước và tưới', tags: ['Nước', 'Hệ thống tưới'], m: 'drop', bg: '#E9F4F8', disc: '#CFE7F0', acc: '#23789A', ds: 'Độ ẩm, điểm héo, chất lượng nước và cách tưới cho cây lâu năm.' },
    { id: 'he-sinh-thai', name: 'Hệ sinh thái nông nghiệp', tags: ['Hệ sinh thái nông nghiệp'], m: 'eco', bg: '#E9F3EA', disc: '#D0E6D2', acc: '#2D6639', ds: 'Xen canh, luân canh, cây che bóng, chắn gió và đa dạng sinh học.' }
  ];
  HV.GROUPS = T;
  HV.group = function (p) {
    var tags = (p && p.tags) || [];
    for (var i = 0; i < T.length; i++) for (var j = 0; j < tags.length; j++) if (T[i].tags.indexOf(tags[j]) >= 0) return T[i];
    return T[0];
  };
  HV.level = function (p) { var t = (p && p.tags) || []; return t.indexOf('Nâng cao') >= 0 ? 'Nâng cao' : 'Cơ bản'; };

  /* ---------- chữ và hình cho từng bài: slug: [chữ lớn, chữ nhỏ, hình, tuỳ chọn] ---------- */
  var BAI = {
    'tuoi-tieu-la-gi': ['Tưới tiêu', 'là gì?', 'drip'],
    'nuoc-cung-la-gi': ['Nước cứng', 'là gì?', 'drop', { hard: 1 }],
    'chat-luong-nuoc-tuoi-la-gi': ['Chất lượng nước tưới', 'là gì?', 'drop', { check: 1 }],
    'tuoi-qua-nhieu-gay-ra-van-de-gi': ['Tưới quá nhiều', 'gây ra vấn đề gì?', 'moisture', { flood: 1 }],
    'cay-thieu-nuoc-co-bieu-hien-gi': ['Cây thiếu nước', 'có biểu hiện gì?', 'wilt'],
    'stress-nuoc-la-gi': ['Stress nước', 'là gì?', 'wilt', { sun: 1 }],
    'kha-nang-giu-nuoc-dong-ruong-la-gi': ['Giữ nước đồng ruộng', 'là gì?', 'moisture'],
    'diem-heo-la-gi': ['Điểm héo', 'là gì?', 'wilt', { gauge: 1 }],
    'do-am-khong-khi-la-gi': ['Độ ẩm không khí', 'là gì?', 'climate', { hum: 1 }],
    'do-am-dat-la-gi': ['Độ ẩm đất', 'là gì?', 'moisture', { probe: 1 }],
    'nuoc-co-vai-tro-gi-doi-voi-cay-trong': ['Vai trò của nước', 'đối với cây trồng', 'drop', { leaf: 1 }],
    'bon-phan-can-doi-la-gi': ['Bón phân cân đối', 'là gì?', 'balance'],
    'phan-bon-tan-cham-la-gi': ['Phân bón tan chậm', 'là gì?', 'bag', { coat: 1 }],
    'bon-goc-la-gi': ['Bón gốc', 'là gì?', 'basal'],
    'phan-bon-la-la-gi': ['Phân bón lá', 'là gì?', 'spray'],
    'thieu-dinh-duong-duoc-nhan-biet-nhu-the-nao': ['Nhận biết thiếu dinh dưỡng', 'như thế nào?', 'lens'],
    'vi-luong-la-gi': ['Vi lượng', 'là gì?', 'elements', { e: ['Zn', 'B', 'Fe'] }],
    'trung-luong-la-gi': ['Trung lượng', 'là gì?', 'elements', { e: ['Ca', 'Mg', 'S'] }],
    'kali-co-vai-tro-gi-doi-voi-cay-trong': ['Kali', 'vai trò đối với cây trồng', 'elements', { e: ['K'] }],
    'lan-co-vai-tro-gi-doi-voi-cay-trong': ['Lân', 'vai trò đối với cây trồng', 'elements', { e: ['P'] }],
    'dam-co-vai-tro-gi-doi-voi-cay-trong': ['Đạm', 'vai trò đối với cây trồng', 'elements', { e: ['N'] }],
    'npk-la-gi': ['NPK', 'là gì?', 'elements', { e: ['N', 'P', 'K'] }],
    'dinh-duong-cay-trong-la-gi': ['Dinh dưỡng cây trồng', 'là gì?', 'roots', { up: 1 }],
    'mun-dat-la-gi': ['Mùn đất', 'là gì?', 'humus'],
    'giun-dat-co-vai-tro-gi-trong-canh-tac-nong-nghiep': ['Giun đất', 'vai trò trong canh tác', 'worm'],
    'phan-vi-sinh-la-gi': ['Phân vi sinh', 'là gì?', 'bag', { mic: 1 }],
    'phan-huu-co-la-gi': ['Phân hữu cơ', 'là gì?', 'humus', { pile: 1 }],
    'nam-co-loi-trong-dat-la-gi': ['Nấm có lợi trong đất', 'là gì?', 'fungi'],
    'he-vi-sinh-vat-vung-re-la-gi': ['Vi sinh vật vùng rễ', 'là gì?', 'microbe', { root: 1 }],
    'vi-sinh-vat-dat-la-gi': ['Vi sinh vật đất', 'là gì?', 'microbe'],
    'cac-phuong-phap-cai-tao-dat-chua': ['Cải tạo đất chua', 'các phương pháp', 'bag', { lime: 1 }],
    'cec-va-kha-nang-giu-dinh-duong-cua-dat': ['CEC và khả năng giữ dinh dưỡng', 'của đất', 'cec', { hold: 1 }],
    'moi-quan-he-giua-ec-do-man-va-stress-tham-thau-o-cay-trong': ['EC, độ mặn và stress thẩm thấu', 'mối quan hệ', 'salt', { root: 1 }],
    'anh-huong-cua-ph-den-kha-nang-hap-thu-dinh-duong-cua-cay-trong': ['pH và khả năng hấp thu dinh dưỡng', 'ảnh hưởng thế nào?', 'ph', { v: 6.3 }],
    'kim-loai-nang-trong-dat-la-gi': ['Kim loại nặng trong đất', 'là gì?', 'metal'],
    'voi-nong-nghiep-co-tac-dung-gi': ['Vôi nông nghiệp', 'có tác dụng gì?', 'bag', { lime: 1 }],
    'dat-chua-la-gi': ['Đất chua', 'là gì?', 'ph', { v: 4.4 }],
    'do-phi-nhieu-cua-dat-la-gi': ['Độ phì nhiêu của đất', 'là gì?', 'soil', { rich: 1 }],
    'carbon-huu-co-trong-dat-la-gi': ['Carbon hữu cơ trong đất', 'là gì?', 'humus', { c: 1 }],
    'chat-huu-co-trong-dat-la-gi': ['Chất hữu cơ trong đất', 'là gì?', 'humus'],
    'cec-la-gi': ['CEC', 'là gì?', 'cec'],
    'do-man-cua-dat-la-gi': ['Độ mặn của đất', 'là gì?', 'salt'],
    'ec-la-gi': ['EC', 'là gì?', 'meter'],
    'ph-dat-la-gi': ['pH đất', 'là gì?', 'ph'],
    'giai-phap-phuc-hoi-dat-nong-nghiep-suy-thoai': ['Phục hồi đất suy thoái', 'giải pháp', 'soil', { restore: 1 }],
    'suy-thoai-dat-tai-cac-vung-canh-tac-lau-nam': ['Suy thoái đất', 'ở vùng canh tác lâu năm', 'erosion', { dry: 1 }],
    'cac-phuong-phap-danh-gia-chat-luong-vat-ly-cua-dat-trong-canh-tac': ['Đánh giá chất lượng vật lý của đất', 'các phương pháp', 'lens', { soil: 1 }],
    'anh-huong-cua-do-nen-dat-den-kha-nang-hap-thu-nuoc-cua-cay-trong': ['Độ nén đất và hấp thu nước', 'ảnh hưởng thế nào?', 'compact', { drop: 1 }],
    'moi-quan-he-giua-cau-truc-dat-va-su-phat-trien-cua-bo-re-cay-trong': ['Cấu trúc đất và bộ rễ', 'mối quan hệ', 'roots', { agg: 1 }],
    'xoi-mon-dat-la-gi': ['Xói mòn đất', 'là gì?', 'erosion'],
    'do-nen-cua-dat-la-gi': ['Độ nén của đất', 'là gì?', 'compact'],
    'do-sau-tang-dat-anh-huong-den-cay-trong-nhu-the-nao': ['Độ sâu tầng đất', 'ảnh hưởng đến cây trồng', 'roots', { ruler: 1 }],
    'kha-nang-thoat-nuoc-cua-dat-la-gi': ['Khả năng thoát nước của đất', 'là gì?', 'soil', { drain: 1 }],
    'kha-nang-giu-nuoc-cua-dat-la-gi': ['Khả năng giữ nước của đất', 'là gì?', 'moisture', { hold: 1 }],
    'do-toi-xop-cua-dat-la-gi': ['Độ tơi xốp của đất', 'là gì?', 'particles', { loose: 1 }],
    'dat-cat-dat-thit-va-dat-set-khac-nhau-nhu-the-nao': ['Đất cát, đất thịt, đất sét', 'khác nhau thế nào?', 'particles', { three: 1 }],
    'thanh-phan-co-gioi-cua-dat-la-gi': ['Thành phần cơ giới của đất', 'là gì?', 'particles', { three: 1, ring: 1 }],
    'cau-truc-dat-la-gi': ['Cấu trúc đất', 'là gì?', 'particles', { agg: 1 }],
    'dat-bazan-la-gi': ['Đất bazan', 'là gì?', 'soil', { red: 1 }],
    'dat-duoc-hinh-thanh-nhu-the-nao': ['Đất được hình thành', 'như thế nào?', 'soil', { rock: 1 }],
    'dat-la-gi': ['Đất', 'là gì?', 'soil'],
    'moi-quan-he-giua-vi-khi-hau-va-sinh-truong-cay-trong-la-gi': ['Vi khí hậu và sinh trưởng', 'của cây trồng', 'climate', { plant: 1 }],
    'thiet-ke-he-thong-xen-canh-cho-cay-lau-nam': ['Thiết kế hệ thống xen canh', 'cho cây lâu năm', 'intercrop', { plan: 1 }],
    'vai-tro-cua-da-dang-sinh-hoc-trong-kha-nang-chong-chiu-cua-vung-trong': ['Đa dạng sinh học và sức chống chịu', 'của vùng trồng', 'eco', { shield: 1 }],
    'anh-huong-cua-he-thong-doc-canh-den-chat-luong-dat-nhu-the-nao': ['Độc canh và chất lượng đất', 'ảnh hưởng thế nào?', 'monocrop', { soil: 1 }],
    'cay-chan-gio-co-vai-tro-gi-trong-canh-tac-cay-cong-nghiep-lau-nam': ['Cây chắn gió', 'vai trò trong canh tác', 'trees', { wind: 1 }],
    'cay-che-bong-co-vai-tro-gi-trong-canh-tac-cay-cong-nghiep-lau-nam': ['Cây che bóng', 'vai trò trong canh tác', 'trees', { shade: 1 }],
    'luan-canh-la-gi': ['Luân canh', 'là gì?', 'rotate'],
    'xen-canh-la-gi': ['Xen canh', 'là gì?', 'intercrop'],
    'doc-canh-la-gi': ['Độc canh', 'là gì?', 'monocrop'],
    'da-dang-sinh-hoc-trong-nong-nghiep-la-gi': ['Đa dạng sinh học', 'trong nông nghiệp', 'eco', { bee: 1 }],
    'vi-khi-hau-la-gi': ['Vi khí hậu', 'là gì?', 'climate'],
    'he-sinh-thai-nong-nghiep-la-gi': ['Hệ sinh thái nông nghiệp', 'là gì?', 'eco'],
    'vi-sao-cung-mot-giong-cay-nhung-nang-suat-giua-cac-vung-khac-nhau': ['Cùng giống cây, khác năng suất', 'vì sao?', 'chart', { cmp: 1 }],
    'nhung-yeu-to-quyet-dinh-nang-suat-cua-mot-vung-trong-la-gi': ['Yếu tố quyết định năng suất', 'của một vùng trồng', 'chart', { keys: 1 }],
    'tu-canh-tac-dua-tren-kinh-nghiem-den-canh-tac-dua-tren-du-lieu': ['Từ kinh nghiệm đến dữ liệu', 'trong canh tác', 'data', { cmp: 1 }],
    'su-phat-trien-cua-cac-he-thong-canh-tac-hien-dai': ['Hệ thống canh tác hiện đại', 'sự phát triển', 'data'],
    'nong-nghiep-truyen-thong-va-hien-dai-khac-nhau-ra-sao': ['Nông nghiệp truyền thống và hiện đại', 'khác nhau ra sao?', 'data', { cmp: 1, hoe: 1 }],
    'chat-luong-nong-san-duoc-danh-gia-nhu-the-nao': ['Chất lượng nông sản', 'được đánh giá thế nào?', 'coffee'],
    'san-luong-la-gi': ['Sản lượng', 'là gì?', 'chart', { sum: 1 }],
    'nang-suat-la-gi': ['Năng suất', 'là gì?', 'chart'],
    'cay-hang-nam-va-cay-lau-nam-khac-nhau-the-nao': ['Cây hằng năm và cây lâu năm', 'khác nhau thế nào?', 'plants2'],
    'chu-ky-cay-trong-la-gi': ['Chu kỳ cây trồng', 'là gì?', 'rotate', { stages: 1 }],
    'mua-vu-la-gi': ['Mùa vụ', 'là gì?', 'calendar'],
    'vung-trong-la-gi': ['Vùng trồng', 'là gì?', 'pin'],
    'nong-hoc-la-gi': ['Nông học', 'là gì?', 'lens', { book: 1 }]
  };
  HV.ARTMAP = BAI;

  /* ---------- mảnh ghép dùng lại ---------- */
  function f(n) { return Math.round(n * 10) / 10; }
  function leaf(x, y, s, rot, col, vein) {
    return '<g transform="translate(' + x + ' ' + y + ') rotate(' + (rot || 0) + ') scale(' + (s || 1) + ')"><path d="M0 0C6-15 22-25 44-24C40-7 23 5 0 0Z" fill="' + (col || C.g3) + '"/>' + (vein === false ? '' : '<path d="M3-1C14-8 26-14 38-20" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width="1.6" stroke-linecap="round"/>') + '</g>';
  }
  function sprout(x, y, s, col) {
    s = s || 1;
    return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')"><path d="M0 0V-34" stroke="' + C.g2 + '" stroke-width="4" stroke-linecap="round"/>' + leaf(0, -24, .72, -150, col || C.l1) + leaf(0, -32, .8, -32, col || C.g3) + '</g>';
  }
  function plant(x, y, s, droop) {
    s = s || 1; var c1 = droop ? '#A7B25B' : C.g3, c2 = droop ? '#C4C072' : C.l1;
    var L = droop ? [[-2, -30, .8, 150, c1], [2, -30, .8, 30, c2], [-2, -52, .7, 170, c2], [2, -52, .7, 10, c1], [0, -66, .6, 80, c1]] : [[-2, -26, .85, -160, c1], [2, -30, .85, -20, c2], [-2, -50, .75, -150, c2], [2, -54, .75, -30, c1], [0, -70, .65, -90, c1]];
    return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')"><path d="M0 0' + (droop ? 'C2-30 0-50 6-66' : 'V-70') + '" fill="none" stroke="' + C.g2 + '" stroke-width="4.5" stroke-linecap="round"/>' + L.map(function (l) { return leaf(l[0], l[1], l[2], l[3], l[4]); }).join('') + '</g>';
  }
  function drop(x, y, s, col, hi) {
    return '<g transform="translate(' + x + ' ' + y + ') scale(' + (s || 1) + ')"><path d="M0-30C8-18 18-6 18 6A18 18 0 0 1-18 6C-18-6-8-18 0-30Z" fill="' + (col || C.s2) + '"/>' + (hi === false ? '' : '<path d="M-9 4A9 9 0 0 0-2 14" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="3" stroke-linecap="round"/>') + '</g>';
  }
  function shadow(cx, cy, rx) { return '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + rx + '" ry="' + f(rx * .09) + '" fill="#0C1F10" opacity=".09"/>'; }
  function txt(x, y, s, t, col, w, anchor) { return '<text x="' + x + '" y="' + y + '" font-family="Archivo,system-ui,sans-serif" font-size="' + s + '" font-weight="' + (w || 700) + '" fill="' + (col || C.w) + '" text-anchor="' + (anchor || 'middle') + '">' + t + '</text>'; }
  function dots(n, x0, y0, w, h, r, col, op, seed) {
    var s = seed || 7, o = '';
    for (var i = 0; i < n; i++) { s = (s * 9301 + 49297) % 233280; var a = s / 233280; s = (s * 9301 + 49297) % 233280; var b = s / 233280; o += '<circle cx="' + f(x0 + a * w) + '" cy="' + f(y0 + b * h) + '" r="' + r + '"/>'; }
    return '<g fill="' + col + '" opacity="' + (op == null ? 1 : op) + '">' + o + '</g>';
  }
  function arrowUp(x, y, s, col) { return '<g transform="translate(' + x + ' ' + y + ') scale(' + (s || 1) + ')" fill="none" stroke="' + (col || C.g3) + '" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><path d="M0 14V-12M-9-3L0-12L9-3"/></g>'; }
  function check(x, y, r) { return '<g transform="translate(' + x + ' ' + y + ')"><circle r="' + r + '" fill="' + C.g3 + '"/><circle r="' + (r - 5) + '" fill="none" stroke="#fff" stroke-opacity=".25" stroke-width="2"/><path d="M' + f(-r * .38) + ' 0L' + f(-r * .1) + ' ' + f(r * .28) + 'L' + f(r * .4) + ' ' + f(-r * .3) + '" fill="none" stroke="#fff" stroke-width="' + f(r * .17) + '" stroke-linecap="round" stroke-linejoin="round"/></g>'; }
  function soilCard(x, y, w, h, layers, id) {
    /* mặt cắt đất bo góc: layers = [[độ dày, màu], ...] từ trên xuống */
    var o = '<clipPath id="' + id + '"><rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="26"/></clipPath><g clip-path="url(#' + id + ')">', yy = y;
    layers.forEach(function (l) { o += '<path d="M' + x + ' ' + yy + (yy === y ? 'H' + (x + w) : 'C' + (x + w * .3) + ' ' + (yy - 6) + ' ' + (x + w * .7) + ' ' + (yy + 6) + ' ' + (x + w) + ' ' + yy) + 'V' + (y + h) + 'H' + x + 'Z" fill="' + l[1] + '"/>'; yy += l[0]; });
    return o + '</g>';
  }
  var uid = 0;

  /* ---------- các hình (khung 320 x 320) ---------- */
  var M = {};
  M.soil = function (o, id) {
    var L = o.red ? [[22, C.l1], [40, C.d1], [70, C.d3], [44, C.d4], [60, '#B9A493']] : [[22, C.l1], [44, C.d1], [56, C.d2], [48, C.d4], [60, '#B9A493']];
    var g = shadow(160, 292, 104) + soilCard(70, 96, 180, 190, L, id + 'c');
    g += '<g clip-path="url(#' + id + 'c)">' + dots(26, 76, 120, 168, 40, 2.2, '#000', .18, 3) + dots(18, 76, 170, 168, 60, 2.6, '#fff', .16, 11);
    g += '<g fill="#9C8B7C"><ellipse cx="104" cy="262" rx="18" ry="11"/><ellipse cx="164" cy="272" rx="24" ry="13"/><ellipse cx="222" cy="258" rx="16" ry="10"/></g>';
    if (o.rock) g += '<g fill="none" stroke="#6E6157" stroke-width="2.4" stroke-linecap="round"><path d="M96 238l14 10 10-6M190 232l12 12 14-4M140 248l8-8"/></g>' + dots(30, 76, 214, 168, 30, 2, '#6E6157', .5, 5);
    if (o.drain) g += [110, 160, 210].map(function (x, i) { return drop(x, 150 + i * 18, .48, C.s2) + '<path d="M' + x + ' ' + (178 + i * 18) + 'v26" stroke="' + C.s3 + '" stroke-width="3" stroke-dasharray="4 6" stroke-linecap="round"/>'; }).join('');
    g += '</g>';
    if (o.rich) g += sprout(112, 98, .9) + plant(160, 98, .9) + sprout(208, 98, .9) + '<g fill="' + C.l2 + '"><circle cx="120" cy="140" r="4"/><circle cx="196" cy="150" r="3.5"/><circle cx="150" cy="176" r="3"/></g>';
    else if (o.restore) g += plant(160, 98, 1) + '<g transform="translate(232 60)"><circle r="24" fill="' + C.l2 + '"/>' + arrowUp(0, 0, 1, C.g1) + '</g>';
    else g += plant(160, 98, 1);
    return g;
  };
  M.ph = function (o) {
    var v = o.v || 5.6, cols = ['#C8553D', '#DB7A35', '#E6B33E', '#B9C84A', '#6FB24A', '#3A8047', '#2F8FB5'], cx = 160, cy = 196, r = 108, n = cols.length, g = shadow(160, 292, 104);
    g += '<path d="M' + (cx - r - 24) + ' ' + cy + 'A' + (r + 24) + ' ' + (r + 24) + ' 0 0 1 ' + (cx + r + 24) + ' ' + cy + 'Z" fill="#fff"/>';
    for (var i = 0; i < n; i++) { var a0 = Math.PI + Math.PI * i / n + .02, a1 = Math.PI + Math.PI * (i + 1) / n - .02; g += '<path d="M' + f(cx + r * Math.cos(a0)) + ' ' + f(cy + r * Math.sin(a0)) + 'A' + r + ' ' + r + ' 0 0 1 ' + f(cx + r * Math.cos(a1)) + ' ' + f(cy + r * Math.sin(a1)) + '" fill="none" stroke="' + cols[i] + '" stroke-width="24"/>'; }
    [[4, '4'], [7, '7'], [10, '10']].forEach(function (t) { var a = Math.PI + Math.PI * (t[0] - 1) / 13; g += txt(f(cx + (r - 34) * Math.cos(a)), f(cy + (r - 34) * Math.sin(a) + 6), 15, t[1], C.g4, 600); });
    var a = Math.PI + Math.PI * (v - 1) / 13;
    g += '<path d="M' + f(cx + 8 * Math.cos(a + 1.57)) + ' ' + f(cy + 8 * Math.sin(a + 1.57)) + 'L' + f(cx + (r - 6) * Math.cos(a)) + ' ' + f(cy + (r - 6) * Math.sin(a)) + 'L' + f(cx + 8 * Math.cos(a - 1.57)) + ' ' + f(cy + 8 * Math.sin(a - 1.57)) + 'Z" fill="' + C.g1 + '"/><circle cx="' + cx + '" cy="' + cy + '" r="14" fill="' + C.g1 + '"/><circle cx="' + cx + '" cy="' + cy + '" r="5" fill="' + C.l2 + '"/>';
    g += '<rect x="96" y="222" width="128" height="58" rx="18" fill="' + C.g1 + '"/>' + txt(160, 262, 34, 'pH ' + String(v).replace('.', ','), C.l2, 700);
    return g;
  };
  M.meter = function () {
    var g = shadow(160, 294, 96) + '<rect x="70" y="246" width="180" height="40" rx="16" fill="' + C.d2 + '"/>' + dots(14, 80, 252, 160, 28, 2.2, '#fff', .18, 4);
    g += '<path d="M146 214V262M174 214V262" stroke="#8C9A92" stroke-width="6" stroke-linecap="round"/>';
    g += '<rect x="102" y="48" width="116" height="176" rx="26" fill="' + C.g1 + '"/><rect x="116" y="64" width="88" height="80" rx="14" fill="' + C.l3 + '"/>' + txt(160, 92, 16, 'EC', C.g3, 700) + txt(160, 128, 30, '1,2', C.g1, 700);
    g += '<circle cx="138" cy="176" r="12" fill="' + C.l2 + '"/><circle cx="182" cy="176" r="12" fill="#fff" fill-opacity=".18"/><rect x="134" y="200" width="52" height="8" rx="4" fill="#fff" fill-opacity=".18"/>';
    g += '<g fill="none" stroke="' + C.s2 + '" stroke-width="3" stroke-linecap="round"><path d="M232 96a24 24 0 0 1 0 40"/><path d="M246 84a40 40 0 0 1 0 64" stroke-opacity=".5"/></g>';
    return g;
  };
  M.cec = function (o) {
    var g = shadow(160, 292, 96) + '<circle cx="160" cy="160" r="112" fill="none" stroke="' + C.g4 + '" stroke-opacity=".35" stroke-width="2" stroke-dasharray="3 9"/>';
    g += '<circle cx="160" cy="160" r="58" fill="' + C.d2 + '"/><circle cx="160" cy="160" r="58" fill="url(#none)"/><path d="M128 132a40 40 0 0 1 28-14" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width="5" stroke-linecap="round"/>';
    [[140, 150], [178, 146], [160, 176], [136, 186], [186, 182], [160, 132]].forEach(function (p) { g += '<path d="M' + (p[0] - 7) + ' ' + p[1] + 'h14" stroke="#fff" stroke-opacity=".85" stroke-width="4" stroke-linecap="round"/>'; });
    var ions = [['Ca', C.s1, -60], ['K', C.l1, 20], ['Mg', C.o, 100], ['NH₄', C.g3, 175], ['H', '#8C9A92', 250]];
    ions.forEach(function (n) { var a = n[2] * Math.PI / 180, x = f(160 + 112 * Math.cos(a)), y = f(160 + 112 * Math.sin(a)); g += '<circle cx="' + x + '" cy="' + y + '" r="25" fill="' + n[1] + '"/>' + txt(x, f(+y + 6), n[0].length > 2 ? 14 : 17, n[0], '#fff', 700) + '<text x="' + f(+x + 14) + '" y="' + f(+y - 10) + '" font-family="Archivo,sans-serif" font-size="13" font-weight="700" fill="#fff">+</text>'; });
    if (o.hold) g += '<g stroke="' + C.d3 + '" stroke-width="2.5" stroke-dasharray="2 6" stroke-linecap="round">' + ions.map(function (n) { var a = n[2] * Math.PI / 180; return '<path d="M' + f(160 + 62 * Math.cos(a)) + ' ' + f(160 + 62 * Math.sin(a)) + 'L' + f(160 + 86 * Math.cos(a)) + ' ' + f(160 + 86 * Math.sin(a)) + '"/>'; }).join('') + '</g>';
    return g;
  };
  M.elements = function (o) {
    var e = o.e || ['N', 'P', 'K'], g = shadow(160, 292, 100), cols = [C.g3, C.o, C.s1];
    if (e.length === 1) {
      var col = { N: C.g3, P: C.o, K: C.s1 }[e[0]] || C.g3, nm = { N: 'Nitơ', P: 'Phốt pho', K: 'Kali' }[e[0]] || '';
      g += leaf(70, 250, 2.6, -40, C.l2, false) + '<rect x="84" y="70" width="152" height="172" rx="34" fill="' + col + '"/><rect x="96" y="82" width="128" height="148" rx="26" fill="none" stroke="#fff" stroke-opacity=".22" stroke-width="2"/>' + txt(160, 186, 104, e[0], '#fff', 700) + txt(160, 218, 17, nm, '#fff', 500);
      g += '<g transform="translate(232 78)"><circle r="26" fill="#fff"/>' + leaf(-12, 10, .6, -50, C.g3) + '</g>';
      return g;
    }
    var pos = [[48, 150], [128, 98], [208, 150]];
    g += '<path d="M60 262C110 230 210 230 262 262" fill="none" stroke="' + C.g4 + '" stroke-opacity=".3" stroke-width="2"/>' + plant(160, 284, 1.25);
    e.forEach(function (x, i) { var p = pos[i]; g += '<rect x="' + p[0] + '" y="' + p[1] + '" width="64" height="64" rx="18" fill="' + cols[i] + '"/>' + txt(p[0] + 32, p[1] + 43, x.length > 1 ? 26 : 32, x, '#fff', 700); });
    return g;
  };
  M.balance = function () {
    var g = shadow(160, 292, 96) + '<path d="M160 120V272" stroke="' + C.g1 + '" stroke-width="10" stroke-linecap="round"/><path d="M120 284h80" stroke="' + C.g1 + '" stroke-width="12" stroke-linecap="round"/><path d="M60 120H260" stroke="' + C.g1 + '" stroke-width="8" stroke-linecap="round"/><circle cx="160" cy="120" r="12" fill="' + C.l2 + '" stroke="' + C.g1 + '" stroke-width="5"/>';
    [[84, 'N', C.g3], [236, 'K', C.s1]].forEach(function (s) { g += '<path d="M' + (s[0] - 34) + ' 186L' + s[0] + ' 124L' + (s[0] + 34) + ' 186" fill="none" stroke="' + C.g4 + '" stroke-width="2.5"/><path d="M' + (s[0] - 46) + ' 186h92a46 22 0 0 1-92 0Z" fill="' + C.g2 + '"/><rect x="' + (s[0] - 22) + '" y="144" width="44" height="44" rx="12" fill="' + s[2] + '"/>' + txt(s[0], 175, 24, s[1], '#fff', 700); });
    g += '<rect x="138" y="56" width="44" height="44" rx="12" fill="' + C.o + '"/>' + txt(160, 87, 24, 'P', '#fff', 700);
    return g;
  };
  M.bag = function (o) {
    var lime = o.lime, body = lime ? '#F4F1E8' : C.c2, band = lime ? '#D9D3C2' : C.c1, g = shadow(160, 292, 100);
    g += '<path d="M98 86C94 70 108 60 122 64L198 64C212 60 226 70 222 86L236 250C238 270 226 282 206 282H114C94 282 82 270 84 250Z" fill="' + body + '"/><path d="M98 86H222" stroke="' + band + '" stroke-width="10"/><path d="M112 64C120 52 200 52 208 64" fill="none" stroke="' + band + '" stroke-width="6" stroke-linecap="round"/>';
    g += '<circle cx="160" cy="166" r="46" fill="' + (lime ? '#fff' : C.g3) + '"/>';
    if (lime) g += txt(160, 176, 30, 'Vôi', C.g2, 700) + txt(160, 236, 17, 'CaCO₃', C.g4, 600);
    else if (o.mic) g += '<g fill="' + C.l2 + '"><rect x="132" y="150" width="34" height="14" rx="7" transform="rotate(-24 149 157)"/><circle cx="178" cy="150" r="9"/><circle cx="170" cy="184" r="7"/><rect x="140" y="176" width="26" height="12" rx="6" transform="rotate(30 153 182)"/></g>' + txt(160, 240, 17, 'Vi sinh', C.g2, 600);
    else g += leaf(140, 188, 1, -50, C.l2) + leaf(162, 184, .8, -120, '#fff') + txt(160, 240, 17, o.coat ? 'Tan chậm' : 'NPK', C.g2, 600);
    if (o.coat) g += [[66, 262], [252, 270], [236, 246]].map(function (p) { return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="13" fill="' + C.s3 + '"/><circle cx="' + p[0] + '" cy="' + p[1] + '" r="7" fill="' + C.g3 + '"/>'; }).join('');
    else if (lime) g += dots(26, 52, 262, 216, 20, 3, '#E7E2D4', 1, 9) + '<g transform="translate(252 92)"><circle r="24" fill="' + C.l2 + '"/>' + txt(0, 6, 15, 'pH', C.g1, 700) + '</g>';
    else g += dots(16, 52, 264, 216, 18, 4.5, C.g3, 1, 2) + dots(10, 60, 268, 200, 14, 4, C.o, 1, 6);
    return g;
  };
  M.basal = function () {
    var g = '<path d="M40 252C90 232 230 232 280 252V286H40Z" fill="' + C.d2 + '"/>' + dots(18, 50, 256, 220, 26, 2.4, '#fff', .15, 8);
    g += '<ellipse cx="160" cy="246" rx="86" ry="18" fill="none" stroke="' + C.g1 + '" stroke-opacity=".18" stroke-width="2" stroke-dasharray="4 6"/>';
    for (var i = 0; i < 14; i++) { var a = i / 14 * Math.PI * 2; g += '<circle cx="' + f(160 + 86 * Math.cos(a)) + '" cy="' + f(246 + 18 * Math.sin(a)) + '" r="5" fill="' + (i % 3 ? C.g3 : C.o) + '"/>'; }
    g += plant(160, 244, 1.9);
    return g;
  };
  M.spray = function () {
    var g = shadow(170, 292, 90) + '<g transform="translate(150 214) rotate(-28)"><path d="M0 0C20-60 90-100 170-92C160-24 90 22 0 0Z" fill="' + C.g3 + '"/><path d="M8-4C60-30 110-56 158-86" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width="3" stroke-linecap="round"/><path d="M50-24l-6-24M90-44l-4-26M120-60l0-20M70-30l20 14M110-50l18 12" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width="2" stroke-linecap="round"/></g>';
    g += '<path d="M150 214l-14 70" stroke="' + C.g2 + '" stroke-width="5" stroke-linecap="round"/>';
    g += '<g transform="translate(46 70)"><rect x="0" y="22" width="44" height="66" rx="12" fill="' + C.s1 + '"/><rect x="12" y="6" width="20" height="18" rx="4" fill="' + C.g1 + '"/><rect x="28" y="8" width="26" height="9" rx="4" fill="' + C.g1 + '"/></g>';
    g += dots(30, 108, 70, 110, 70, 3, C.s2, .8, 12) + dots(18, 120, 82, 80, 50, 2, C.s3, 1, 4);
    return g;
  };
  M.lens = function (o) {
    var g = shadow(150, 292, 100), inner;
    if (o.soil) inner = '<rect x="40" y="70" width="220" height="200" fill="' + C.d2 + '"/>' + dots(30, 60, 90, 180, 160, 9, C.d4, .9, 3) + dots(40, 60, 90, 180, 160, 4, C.d1, .8, 7) + dots(14, 70, 100, 160, 140, 3, C.s3, 1, 15);
    else if (o.book) inner = '<rect x="40" y="70" width="220" height="200" fill="' + C.l3 + '"/>' + plant(150, 228, 1.3) + '<path d="M70 236H230" stroke="' + C.d2 + '" stroke-width="6" stroke-linecap="round"/>';
    else inner = '<rect x="40" y="70" width="220" height="200" fill="' + C.l3 + '"/><g transform="translate(78 222) rotate(-30)"><path d="M0 0C14-48 70-80 136-74C128-20 72 16 0 0Z" fill="' + C.l1 + '"/><path d="M6-3C46-24 88-46 128-70" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="3"/></g><g fill="#D8C24A"><circle cx="150" cy="150" r="9"/><circle cx="176" cy="132" r="7"/><circle cx="124" cy="176" r="6"/><circle cx="190" cy="160" r="5"/></g><g fill="' + C.d3 + '" opacity=".7"><circle cx="150" cy="150" r="3"/><circle cx="176" cy="132" r="2.5"/></g>';
    g += '<defs><clipPath id="lensc' + uid + '"><circle cx="146" cy="150" r="84"/></clipPath></defs><g clip-path="url(#lensc' + uid + ')">' + inner + '</g><circle cx="146" cy="150" r="84" fill="none" stroke="' + C.g1 + '" stroke-width="14"/><path d="M98 104a64 64 0 0 1 40-22" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="6" stroke-linecap="round"/><path d="M208 212L258 262" stroke="' + C.g1 + '" stroke-width="24" stroke-linecap="round"/><path d="M212 216l10 10" stroke="' + C.l2 + '" stroke-width="24"/>';
    return g;
  };
  M.microbe = function (o) {
    var g = shadow(160, 294, 100) + '<circle cx="160" cy="160" r="116" fill="#fff"/><circle cx="160" cy="160" r="116" fill="none" stroke="' + C.g1 + '" stroke-width="8"/><circle cx="160" cy="160" r="104" fill="' + C.l3 + '" fill-opacity=".55"/>';
    if (o.root) g += '<path d="M150 44C160 100 140 150 170 196C186 222 176 250 190 276" fill="none" stroke="' + C.d4 + '" stroke-width="14" stroke-linecap="round"/><path d="M162 140C190 136 210 150 230 140M168 200C140 210 120 200 100 214" fill="none" stroke="' + C.d4 + '" stroke-width="6" stroke-linecap="round"/>';
    var rods = [[100, 120, -30, C.g3], [210, 110, 40, C.s1], [118, 210, 20, C.o], [214, 206, -50, C.g3], [150, 88, 70, C.l1]];
    rods.forEach(function (r) { g += '<g transform="translate(' + r[0] + ' ' + r[1] + ') rotate(' + r[2] + ')"><rect x="-26" y="-11" width="52" height="22" rx="11" fill="' + r[3] + '"/><rect x="-18" y="-5" width="18" height="5" rx="2.5" fill="#fff" fill-opacity=".45"/><path d="M26 0c10 0 10 10 20 8" fill="none" stroke="' + r[3] + '" stroke-width="2.5" stroke-linecap="round"/></g>'; });
    [[160, 160, 16, C.l1], [178, 172, 12, C.g3], [146, 178, 10, C.s2], [88, 168, 10, C.l1], [240, 160, 9, C.o], [200, 246, 9, C.s2]].forEach(function (c) { g += '<circle cx="' + c[0] + '" cy="' + c[1] + '" r="' + c[2] + '" fill="' + c[3] + '"/><circle cx="' + (c[0] - c[2] * .35) + '" cy="' + (c[1] - c[2] * .35) + '" r="' + f(c[2] * .3) + '" fill="#fff" fill-opacity=".5"/>'; });
    return g;
  };
  M.fungi = function () {
    var g = '<rect x="36" y="168" width="248" height="118" rx="26" fill="' + C.d1 + '"/>' + dots(20, 50, 184, 220, 90, 2.5, '#fff', .12, 2);
    g += '<g fill="none" stroke="#F3EBDD" stroke-opacity=".75" stroke-width="2" stroke-linecap="round"><path d="M112 176C116 206 92 222 70 236M112 190C130 220 170 214 190 240C204 256 236 250 254 266M190 240C180 262 150 268 136 276M112 206C100 240 120 258 104 278M210 176C214 200 240 210 262 206"/></g>';
    g += '<path d="M208 168V96" stroke="' + C.g2 + '" stroke-width="4"/>' + leaf(208, 120, .9, -30, C.g3) + leaf(208, 110, .8, -150, C.l1) + '<g fill="none" stroke="' + C.d4 + '" stroke-width="5" stroke-linecap="round"><path d="M208 168C206 200 214 226 210 262M208 190C226 200 240 196 256 206"/></g>';
    g += '<path d="M104 168C104 140 100 120 104 110h16c4 10 0 30 0 58Z" fill="#F3EBDD"/><path d="M60 116C60 70 164 70 164 116C150 122 74 122 60 116Z" fill="' + C.r + '"/><g fill="#fff" fill-opacity=".85"><circle cx="92" cy="96" r="6"/><circle cx="124" cy="88" r="5"/><circle cx="144" cy="104" r="4"/></g>';
    g += '<path d="M152 168C152 150 150 140 152 132h10c2 8 0 18 0 36Z" fill="#F3EBDD"/><path d="M130 136C130 108 184 108 184 136C176 140 138 140 130 136Z" fill="' + C.d4 + '"/>';
    return g;
  };
  M.worm = function () {
    var g = '<rect x="36" y="70" width="248" height="216" rx="28" fill="' + C.d2 + '"/><path d="M36 98C100 90 200 106 284 96V70H36Z" fill="' + C.l1 + '"/>' + dots(24, 50, 110, 220, 160, 3, C.d1, .5, 6) + dots(16, 50, 110, 220, 160, 2.4, '#fff', .15, 1);
    g += '<g fill="none" stroke="' + C.d1 + '" stroke-opacity=".55" stroke-width="20" stroke-linecap="round"><path d="M240 100C230 140 270 170 240 210"/><path d="M80 120C110 150 70 190 100 240"/></g>';
    g += '<path d="M96 196C130 160 170 230 206 196C226 176 246 186 250 204" fill="none" stroke="#D98C7A" stroke-width="22" stroke-linecap="round"/><g stroke="#B9665A" stroke-opacity=".6" stroke-width="2.5"><path d="M118 182v20M140 186v22M164 204v20M188 202v20"/></g><circle cx="246" cy="198" r="2.6" fill="' + C.d1 + '"/>';
    g += sprout(130, 96, .9) + sprout(200, 92, .8);
    return g;
  };
  M.humus = function (o) {
    var g = shadow(160, 292, 110);
    if (o.pile) g += '<path d="M48 284C70 196 120 170 160 170S250 196 272 284Z" fill="' + C.d1 + '"/>' + dots(30, 70, 200, 180, 80, 3.2, C.d3, .9, 5) + leaf(96, 196, .9, -20, C.o) + leaf(206, 208, .8, -160, C.l1) + leaf(150, 184, .7, -60, C.d4) + leaf(120, 230, .7, 20, C.g3) + '<path d="M140 120c0-14 20-14 20 0M168 110c0-14 20-14 20 0M124 140c0-10 14-10 14 0" fill="none" stroke="' + C.gr + '" stroke-opacity=".6" stroke-width="3" stroke-linecap="round"/>';
    else g += soilCard(56, 130, 208, 156, [[28, '#C9A15A'], [60, C.d1], [80, C.d2]], 'hu' + uid) + leaf(76, 140, .9, -10, C.o) + leaf(120, 136, .8, -170, C.d4) + leaf(170, 142, .9, -20, C.l1) + leaf(226, 136, .8, -160, C.o) + '<g clip-path="url(#hu' + uid + ')">' + dots(30, 60, 170, 200, 50, 3, C.d3, .9, 4) + '</g>' + plant(160, 134, 1);
    if (o.c) g += '<g transform="translate(244 78)"><circle r="30" fill="' + C.g1 + '"/>' + txt(0, 10, 30, 'C', C.l2, 700) + '</g>';
    return g;
  };
  M.roots = function (o) {
    var g = '<rect x="46" y="118" width="228" height="168" rx="28" fill="' + C.d2 + '"/><path d="M46 132C120 122 200 140 274 128V118H46Z" fill="' + C.l1 + '"/>';
    if (o.agg) g += dots(22, 60, 140, 200, 130, 10, C.d3, .85, 9) + dots(30, 60, 140, 200, 130, 4, C.d1, .5, 3);
    else g += dots(30, 60, 140, 200, 130, 2.6, '#fff', .15, 5);
    g += '<g fill="none" stroke="' + C.d5 + '" stroke-linecap="round"><path d="M160 128V250" stroke-width="7"/><path d="M160 160C140 176 116 182 96 206M160 160C184 178 206 182 226 208M160 196C142 214 126 232 120 262M160 196C180 214 196 232 204 262M160 226C150 244 150 262 146 276" stroke-width="4"/><path d="M96 206l-12 10M226 208l12 8M120 262l-10 8M204 262l10 8M128 186l-6 14M196 188l8 12" stroke-width="2.4"/></g>';
    g += plant(160, 128, 1.1);
    if (o.ruler) g += '<rect x="248" y="132" width="20" height="148" rx="6" fill="' + C.c2 + '"/>' + [0, 1, 2, 3, 4, 5, 6].map(function (i) { return '<path d="M248 ' + (146 + i * 20) + 'h' + (i % 2 ? 7 : 12) + '" stroke="' + C.g1 + '" stroke-width="2"/>'; }).join('');
    if (o.up) g += arrowUp(110, 250, .9, C.l2) + arrowUp(210, 250, .9, C.l2) + arrowUp(160, 268, .8, C.l2) + '<g fill="' + C.o + '"><circle cx="96" cy="232" r="5"/><circle cx="226" cy="236" r="5"/></g><g fill="' + C.s2 + '"><circle cx="130" cy="272" r="5"/><circle cx="190" cy="276" r="5"/></g>';
    return g;
  };
  M.particles = function (o) {
    var g = shadow(160, 292, 104);
    if (o.three) {
      g += '<circle cx="104" cy="200" r="60" fill="' + C.d5 + '"/>' + dots(10, 70, 166, 66, 66, 4, '#B48A64', .7, 2) + '<circle cx="204" cy="176" r="40" fill="' + C.d4 + '"/>' + dots(12, 182, 154, 44, 44, 2.6, C.d3, .7, 4) + '<circle cx="222" cy="254" r="24" fill="' + C.d2 + '"/>' + dots(10, 208, 240, 28, 28, 1.6, C.d1, .8, 6);
      g += '<path d="M90 166a40 40 0 0 1 24-12" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="5" stroke-linecap="round"/><path d="M190 152a24 24 0 0 1 14-6" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="4" stroke-linecap="round"/>';
      if (o.ring) g += '<circle cx="160" cy="200" r="124" fill="none" stroke="' + C.g4 + '" stroke-opacity=".3" stroke-width="2" stroke-dasharray="2 8"/>';
      return g;
    }
    g += '<circle cx="160" cy="166" r="116" fill="' + C.d2 + '"/>';
    var cl = [[110, 120, 34], [196, 110, 30], [150, 188, 38], [228, 186, 28], [90, 204, 26], [178, 248, 24], [118, 256, 18]], s = o.loose ? 1 : 1.2;
    cl.forEach(function (c, i) { var r = c[2] * (o.loose ? .9 : 1.05); g += '<circle cx="' + c[0] + '" cy="' + c[1] + '" r="' + f(r) + '" fill="' + (i % 2 ? C.d4 : C.d3) + '"/>' + dots(6, c[0] - r * .6, c[1] - r * .6, r * 1.2, r * 1.2, f(r * .18), i % 2 ? C.d3 : C.d2, .9, i + 3) + '<circle cx="' + f(c[0] - r * .4) + '" cy="' + f(c[1] - r * .4) + '" r="' + f(r * .18) + '" fill="#fff" fill-opacity=".35"/>'; });
    if (o.loose) g += [[152, 140], [210, 150], [126, 226], [196, 214]].map(function (p) { return drop(p[0], p[1], .4, C.s3, false); }).join('') + '<g fill="#fff" fill-opacity=".7"><circle cx="70" cy="160" r="4"/><circle cx="250" cy="226" r="4"/><circle cx="160" cy="76" r="4"/></g>';
    return g;
  };
  M.compact = function (o) {
    var g = '<rect x="40" y="170" width="240" height="116" rx="24" fill="' + C.d2 + '"/><rect x="40" y="170" width="240" height="40" rx="20" fill="' + C.d3 + '"/>';
    g += '<g stroke="' + C.d1 + '" stroke-opacity=".6" stroke-width="3" stroke-linecap="round"><path d="M58 224H262M62 240H258M58 256H262M66 272H254"/></g>';
    g += '<g transform="translate(130 112)"><circle r="62" fill="' + C.g1 + '"/><circle r="62" fill="none" stroke="#2A3A30" stroke-width="10" stroke-dasharray="10 8"/><circle r="30" fill="#8C9A92"/><circle r="12" fill="' + C.g1 + '"/></g>';
    g += '<g fill="none" stroke="' + C.r + '" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"><path d="M226 92v44M214 124l12 12 12-12"/><path d="M256 110v30M246 132l10 10 10-10"/></g>';
    if (o.drop) g += drop(244, 200, .55, C.s2) + '<path d="M232 228l24 24M256 228l-24 24" stroke="' + C.r + '" stroke-width="4" stroke-linecap="round" opacity=".0"/>';
    return g;
  };
  M.climate = function (o) {
    var g = '<g transform="translate(112 112)"><g stroke="#E9B53B" stroke-width="6" stroke-linecap="round">' + [0, 45, 90, 135, 180, 225, 270, 315].map(function (a) { var r = a * Math.PI / 180; return '<path d="M' + f(56 * Math.cos(r)) + ' ' + f(56 * Math.sin(r)) + 'L' + f(70 * Math.cos(r)) + ' ' + f(70 * Math.sin(r)) + '"/>'; }).join('') + '</g><circle r="42" fill="#F2C14E"/><circle r="30" fill="#F7D677"/></g>';
    g += '<path d="M118 196a34 34 0 0 1 22-58 46 46 0 0 1 86 6 30 30 0 0 1 8 58H140a26 26 0 0 1-22-6Z" fill="#fff"/><path d="M140 202h94a30 30 0 0 0 22-28 34 34 0 0 1-30 18H138Z" fill="' + C.s4 + '"/>';
    g += '<g transform="translate(250 150)"><rect x="-13" y="-70" width="26" height="110" rx="13" fill="#fff" stroke="' + C.g1 + '" stroke-width="4"/><circle cy="48" r="22" fill="' + C.r + '" stroke="' + C.g1 + '" stroke-width="4"/><rect x="-5" y="-30" width="10" height="72" rx="5" fill="' + C.r + '"/></g>';
    if (o.hum) g += drop(150, 244, .55, C.s2) + drop(190, 262, .45, C.s2) + drop(110, 270, .4, C.s3);
    else g += '<path d="M50 286C110 270 210 270 290 286" stroke="' + C.g3 + '" stroke-width="6" stroke-linecap="round" fill="none"/>' + plant(120, 280, .85) + plant(176, 282, .7) + (o.plant ? arrowUp(212, 248, .9, C.g3) : '');
    return g;
  };
  M.wilt = function (o) {
    var g = '<path d="M44 248H276V280a8 8 0 0 1-8 8H52a8 8 0 0 1-8-8Z" fill="' + C.d4 + '"/><path d="M44 248H276" stroke="' + C.d3 + '" stroke-width="6" stroke-linecap="round"/><g fill="none" stroke="' + C.d2 + '" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M86 252l10 14-6 12M150 252l-8 12 10 14M214 252l12 10-4 14M246 256l-10 12"/></g>';
    g += plant(150, 248, 1.8, true);
    if (o.gauge) g += '<g transform="translate(244 96)"><circle r="38" fill="#fff" stroke="' + C.g1 + '" stroke-width="5"/><path d="M-24 10A26 26 0 0 1 24 10" fill="none" stroke="' + C.r + '" stroke-width="6" stroke-linecap="round"/><path d="M0 8L-18-8" stroke="' + C.g1 + '" stroke-width="5" stroke-linecap="round"/><circle cy="8" r="5" fill="' + C.g1 + '"/></g>';
    else g += '<g transform="translate(246 84)"><circle r="30" fill="#F2C14E"/><g stroke="#E9B53B" stroke-width="5" stroke-linecap="round">' + [0, 60, 120, 180, 240, 300].map(function (a) { var r = a * Math.PI / 180; return '<path d="M' + f(40 * Math.cos(r)) + ' ' + f(40 * Math.sin(r)) + 'L' + f(50 * Math.cos(r)) + ' ' + f(50 * Math.sin(r)) + '"/>'; }).join('') + '</g></g>';
    if (o.sun) g += drop(80, 110, .6, C.s3) + '<path d="M62 92l36 36" stroke="' + C.r + '" stroke-width="5" stroke-linecap="round"/>';
    return g;
  };
  M.moisture = function (o) {
    var g = '<rect x="40" y="140" width="240" height="146" rx="26" fill="' + C.d2 + '"/>' + (o.flood ? '<path d="M40 150C90 136 230 136 280 150V170C230 160 90 160 40 170Z" fill="' + C.s2 + '" opacity=".85"/>' : '<path d="M40 154C110 144 210 160 280 150V140H40Z" fill="' + C.l1 + '"/>');
    g += dots(18, 54, 170, 212, 100, 7, C.d3, .9, 5);
    var w = o.flood ? 22 : 12; g += '<g fill="' + C.s2 + '">' + dots(w, 54, 170, 212, 100, 4.5, C.s2, .95, 11).replace(/^<g[^>]*>|<\/g>$/g, '') + '</g>';
    if (o.probe || o.hold || !o.flood) g += '<g transform="translate(226 60)"><rect x="-30" y="0" width="60" height="70" rx="16" fill="' + C.g1 + '"/><rect x="-20" y="10" width="40" height="28" rx="7" fill="' + C.l3 + '"/>' + txt(0, 31, 16, o.hold ? '35%' : '28%', C.g1, 700) + '<circle cx="0" cy="54" r="6" fill="' + C.l2 + '"/><path d="M-8 70v120M8 70v120" stroke="#8C9A92" stroke-width="5" stroke-linecap="round"/></g>';
    g += plant(110, o.flood ? 148 : 146, 1.2, !!o.flood);
    return g;
  };
  M.drop = function (o) {
    var g = shadow(160, 292, 96) + '<g fill="none" stroke="' + C.s2 + '" stroke-opacity=".5" stroke-width="3"><ellipse cx="160" cy="262" rx="98" ry="18"/><ellipse cx="160" cy="262" rx="62" ry="11"/></g>';
    g += '<path d="M160 40C196 92 236 140 236 188A76 76 0 0 1 84 188C84 140 124 92 160 40Z" fill="' + C.s2 + '"/><path d="M160 40C196 92 236 140 236 188A76 76 0 0 1 160 264Z" fill="' + C.s1 + '" opacity=".35"/><path d="M114 186A46 46 0 0 0 140 230" fill="none" stroke="#fff" stroke-opacity=".75" stroke-width="8" stroke-linecap="round"/>';
    if (o.hard) g += '<g fill="#fff" fill-opacity=".85">' + [[146, 150], [180, 176], [150, 206], [196, 214], [172, 132]].map(function (p) { return '<path d="M' + p[0] + ' ' + (p[1] - 8) + 'l7 4v8l-7 4-7-4v-8Z"/>'; }).join('') + '</g>';
    if (o.check) g += check(226, 92, 30);
    if (o.leaf) g += sprout(160, 214, 1.6, C.l2);
    return g;
  };
  M.drip = function () {
    var g = '<path d="M30 250C100 236 220 236 290 250V286H30Z" fill="' + C.d2 + '"/>' + dots(16, 40, 254, 240, 28, 2.4, '#fff', .15, 3);
    g += '<path d="M28 132H292" stroke="' + C.g1 + '" stroke-width="14" stroke-linecap="round"/>';
    [80, 160, 240].forEach(function (x, i) { g += '<rect x="' + (x - 11) + '" y="124" width="22" height="22" rx="6" fill="' + C.g3 + '"/>' + drop(x, 172, .42, C.s2) + drop(x, 210, .34, C.s3, false) + '<ellipse cx="' + x + '" cy="248" rx="26" ry="6" fill="' + C.s2 + '" opacity=".45"/>' + sprout(x + 22, 248, 1.05); });
    g += '<g fill="none" stroke="' + C.s2 + '" stroke-width="3" stroke-linecap="round" stroke-opacity=".6"><path d="M150 84a14 14 0 0 1 20 0M142 72a26 26 0 0 1 36 0"/></g>';
    return g;
  };
  function tree(x, y, s, kind) {
    var k = kind || 'round', g = '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')"><path d="M0 0V-40" stroke="' + C.d2 + '" stroke-width="9" stroke-linecap="round"/>';
    if (k === 'tall') g += '<path d="M0-150C22-120 26-60 18-36C10-26-10-26-18-36C-26-60-22-120 0-150Z" fill="' + C.g2 + '"/><path d="M0-150C22-120 26-60 18-36C12-30 6-28 0-28Z" fill="#000" opacity=".12"/>';
    else if (k === 'bush') g += '<ellipse cx="0" cy="-48" rx="34" ry="30" fill="' + C.g3 + '"/><ellipse cx="-10" cy="-58" rx="16" ry="12" fill="' + C.l1 + '" opacity=".6"/><g fill="' + C.r + '"><circle cx="12" cy="-40" r="4"/><circle cx="20" cy="-48" r="4"/><circle cx="-14" cy="-34" r="4"/></g>';
    else g += '<circle cx="0" cy="-86" r="54" fill="' + C.g2 + '"/><circle cx="-28" cy="-62" r="34" fill="' + C.g3 + '"/><circle cx="28" cy="-64" r="34" fill="' + C.g3 + '"/><circle cx="-14" cy="-104" r="22" fill="' + C.l1 + '" opacity=".55"/>';
    return g + '</g>';
  }
  M.trees = function (o) {
    var g = '<path d="M30 270C100 256 220 256 290 270V286H30Z" fill="' + C.g4 + '" opacity=".55"/>';
    if (o.shade) {
      g += '<g transform="translate(240 70)"><circle r="26" fill="#F2C14E"/></g><path d="M222 92L140 200" stroke="#F2C14E" stroke-width="3" stroke-dasharray="6 8" opacity=".8"/><ellipse cx="150" cy="270" rx="96" ry="12" fill="#0C1F10" opacity=".14"/>' + tree(150, 268, 1.4) + tree(96, 272, .8, 'bush') + tree(206, 272, .8, 'bush');
    } else {
      g += tree(70, 270, 1.15, 'tall') + tree(108, 270, 1.3, 'tall') + tree(146, 270, 1.05, 'tall') + tree(214, 272, .85, 'bush') + tree(262, 272, .75, 'bush');
      g += '<g fill="none" stroke="' + C.s2 + '" stroke-width="5" stroke-linecap="round"><path d="M10 120h40c14 0 14-18 2-18"/><path d="M10 160h56c14 0 14 18 2 18" stroke-opacity=".7"/></g><g fill="none" stroke="' + C.s3 + '" stroke-width="4" stroke-linecap="round" stroke-dasharray="2 10"><path d="M180 150h80M180 190h60"/></g>';
    }
    return g;
  };
  M.rotate = function (o) {
    var g = '<g fill="none" stroke-width="10" stroke-linecap="round"><path d="M68 140A96 96 0 0 1 232 104" stroke="' + C.g3 + '"/><path d="M252 180A96 96 0 0 1 88 216" stroke="' + C.l1 + '"/></g><path d="M246 88l-2 30-28-10Z" fill="' + C.g3 + '"/><path d="M74 232l2-30 28 10Z" fill="' + C.l1 + '"/>';
    if (o.stages) {
      g += '<g transform="translate(160 176)"><ellipse cx="0" cy="34" rx="70" ry="10" fill="' + C.d2 + '" opacity=".25"/></g><ellipse cx="96" cy="196" rx="12" ry="8" fill="' + C.d3 + '"/>' + sprout(140, 206, 1) + plant(186, 210, .8) + tree(232, 214, .45, 'bush');
    } else {
      [[160, 64, 'c'], [256, 160, 'b'], [160, 256, 's'], [64, 160, 'p']].forEach(function (p) {
        g += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="34" fill="#fff"/>';
        if (p[2] === 'c') g += '<g fill="' + C.r + '"><circle cx="' + (p[0] - 8) + '" cy="' + (p[1] + 4) + '" r="9"/><circle cx="' + (p[0] + 8) + '" cy="' + (p[1] + 6) + '" r="9"/></g>' + leaf(p[0] - 4, p[1] - 6, .5, -60, C.g3);
        else if (p[2] === 'b') g += '<path d="M' + (p[0] - 14) + ' ' + (p[1] + 14) + 'C' + (p[0] - 18) + ' ' + (p[1] - 10) + ' ' + (p[0] + 10) + ' ' + (p[1] - 20) + ' ' + (p[0] + 16) + ' ' + (p[1] - 12) + 'C' + (p[0] + 10) + ' ' + (p[1] + 4) + ' ' + p[0] + ' ' + (p[1] + 16) + ' ' + (p[0] - 14) + ' ' + (p[1] + 14) + 'Z" fill="' + C.l1 + '"/><g fill="' + C.g2 + '"><circle cx="' + (p[0] - 4) + '" cy="' + (p[1] + 4) + '" r="4"/><circle cx="' + (p[0] + 4) + '" cy="' + (p[1] - 4) + '" r="4"/></g>';
        else if (p[2] === 's') g += sprout(p[0], p[1] + 18, .9);
        else g += '<path d="M' + p[0] + ' ' + (p[1] + 20) + 'V' + (p[1] - 18) + '" stroke="' + C.g2 + '" stroke-width="3"/><ellipse cx="' + (p[0] + 6) + '" cy="' + (p[1] - 8) + '" rx="7" ry="14" fill="' + C.o + '"/>' + leaf(p[0], p[1] + 8, .5, -150, C.g3);
      });
      g += '<circle cx="160" cy="160" r="30" fill="' + C.g1 + '"/>' + leaf(146, 170, .6, -50, C.l2);
    }
    return g;
  };
  M.chart = function (o) {
    var g = shadow(160, 292, 110) + '<rect x="40" y="56" width="240" height="228" rx="28" fill="#fff"/><path d="M68 252H252" stroke="' + C.g1 + '" stroke-opacity=".2" stroke-width="2"/>';
    if (o.cmp) {
      [[76, 120, C.g3], [110, 160, C.l1], [178, 70, C.g3], [212, 110, C.l1]].forEach(function (b) { g += '<rect x="' + b[0] + '" y="' + (252 - b[1]) + '" width="28" height="' + b[1] + '" rx="8" fill="' + b[2] + '"/>'; });
      g += txt(108, 274, 15, 'Vùng A', C.g4, 600) + txt(210, 274, 15, 'Vùng B', C.g4, 600) + tree(108, 82, .3, 'bush') + tree(210, 172, .3, 'bush');
      return g;
    }
    var H = [64, 100, 130, 172];
    H.forEach(function (h, i) { g += '<rect x="' + (74 + i * 46) + '" y="' + (252 - h) + '" width="32" height="' + h + '" rx="9" fill="' + (i === 3 ? C.g3 : i % 2 ? C.l1 : C.l2) + '"/>'; });
    if (o.sum) g += '<path d="M66 70h40" stroke="' + C.g1 + '" stroke-width="5" stroke-linecap="round"/>' + txt(124, 82, 22, 'tấn', C.g1, 700, 'start');
    else g += '<path d="M90 176L136 140L182 114L228 70" fill="none" stroke="' + C.g1 + '" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>' + [[90, 176], [136, 140], [182, 114], [228, 70]].map(function (p) { return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="6" fill="#fff" stroke="' + C.g1 + '" stroke-width="3"/>'; }).join('');
    if (o.keys) g += '<g transform="translate(252 66)"><circle r="24" fill="' + C.o + '"/>' + txt(0, 7, 20, '?', '#fff', 700) + '</g>';
    return g;
  };
  M.pin = function () {
    var g = '<path d="M30 230L120 168L290 196L200 270Z" fill="' + C.l3 + '"/>';
    for (var i = 0; i < 6; i++) { var t = i / 6, t2 = (i + .55) / 6; g += '<path d="M' + f(30 + 90 * t) + ' ' + f(230 - 62 * t) + 'L' + f(200 + 90 * t) + ' ' + f(270 - 74 * t) + 'L' + f(200 + 90 * t2) + ' ' + f(270 - 74 * t2) + 'L' + f(30 + 90 * t2) + ' ' + f(230 - 62 * t2) + 'Z" fill="' + (i % 2 ? C.l1 : C.g3) + '" opacity=".8"/>'; }
    g += '<path d="M120 168L290 196" stroke="#fff" stroke-width="3" stroke-dasharray="6 6" opacity=".7"/>';
    g += '<ellipse cx="166" cy="222" rx="30" ry="8" fill="#0C1F10" opacity=".18"/><path d="M166 220C140 180 112 150 112 116A54 54 0 0 1 220 116C220 150 192 180 166 220Z" fill="' + C.g1 + '"/><circle cx="166" cy="114" r="30" fill="#fff"/><g transform="translate(166 114)">' + leaf(-10, 10, .55, -60, C.g3) + leaf(10, 10, .55, -120, C.l1) + '</g>';
    return g;
  };
  M.coffee = function () {
    var g = shadow(150, 292, 100) + '<path d="M40 110C110 120 170 170 210 272" fill="none" stroke="' + C.d2 + '" stroke-width="8" stroke-linecap="round"/>';
    g += leaf(70, 116, 1.4, -40, C.g3) + leaf(120, 134, 1.3, 30, C.g2) + leaf(160, 180, 1.3, -30, C.g3) + leaf(186, 220, 1.2, 40, C.g2);
    [[110, 140], [126, 150], [116, 160], [168, 196], [182, 202], [174, 214], [154, 206]].forEach(function (c, i) { g += '<circle cx="' + c[0] + '" cy="' + c[1] + '" r="13" fill="' + (i === 2 ? C.o : C.r) + '"/><circle cx="' + (c[0] - 4) + '" cy="' + (c[1] - 4) + '" r="3.5" fill="#fff" fill-opacity=".5"/>'; });
    g += check(244, 96, 36);
    return g;
  };
  M.metal = function () {
    var g = '<rect x="40" y="200" width="240" height="86" rx="24" fill="' + C.d2 + '"/>' + dots(18, 50, 210, 220, 66, 2.6, '#fff', .15, 4);
    [[96, 150, 'Pb'], [168, 118, 'Cd'], [232, 160, 'As']].forEach(function (h) { var x = h[0], y = h[1], r = 36; g += '<path d="M' + x + ' ' + (y - r) + 'L' + f(x + r * .87) + ' ' + (y - r / 2) + 'V' + (y + r / 2) + 'L' + x + ' ' + (y + r) + 'L' + f(x - r * .87) + ' ' + (y + r / 2) + 'V' + (y - r / 2) + 'Z" fill="#5E6E67"/>' + txt(x, y + 8, 22, h[2], '#fff', 700); });
    g += '<g fill="#5E6E67" opacity=".7"><circle cx="110" cy="236" r="6"/><circle cx="190" cy="250" r="5"/><circle cx="236" cy="230" r="6"/></g>';
    g += '<g transform="translate(160 54)"><path d="M0-26L28 22H-28Z" fill="' + C.o + '" stroke="' + C.o + '" stroke-width="8" stroke-linejoin="round"/><path d="M0-8V6" stroke="#fff" stroke-width="5" stroke-linecap="round"/><circle cy="14" r="3" fill="#fff"/></g>';
    return g;
  };
  M.erosion = function (o) {
    var g = '<path d="M30 120L290 250V286H30Z" fill="' + C.d2 + '"/><path d="M30 120L290 250" stroke="' + (o.dry ? C.d4 : C.l1) + '" stroke-width="12" stroke-linecap="round"/>';
    g += '<path d="M30 150L290 280" stroke="' + C.d3 + '" stroke-width="22" opacity=".6"/>';
    if (!o.dry) g += '<path d="M60 140C110 160 150 180 200 214S260 250 286 262" fill="none" stroke="' + C.s2 + '" stroke-width="7" stroke-linecap="round"/><g fill="' + C.d3 + '"><circle cx="232" cy="232" r="7"/><circle cx="258" cy="246" r="5"/><circle cx="214" cy="220" r="5"/></g>';
    else g += '<g fill="none" stroke="' + C.d1 + '" stroke-width="2.5" stroke-linecap="round"><path d="M90 160l10 16-6 10M170 200l-8 14 10 12M236 232l10 12"/></g>' + plant(110, 156, .8, true);
    g += '<path d="M60 66a28 28 0 0 1 20-48 40 40 0 0 1 74 4 26 26 0 0 1 4 50H80Z" fill="' + (o.dry ? '#fff' : '#D7E4EA') + '"/>';
    if (!o.dry) g += '<g stroke="' + C.s2 + '" stroke-width="4" stroke-linecap="round"><path d="M86 86l-8 18M114 86l-8 18M142 86l-8 18M100 112l-6 12M128 112l-6 12"/></g>';
    else g += '<g transform="translate(240 70)"><circle r="28" fill="#F2C14E"/></g>';
    if (!o.dry) g += sprout(54, 132, .9);
    return g;
  };
  M.eco = function (o) {
    var g = '<circle cx="160" cy="160" r="122" fill="none" stroke="' + C.g3 + '" stroke-opacity=".35" stroke-width="3" stroke-dasharray="4 10"/>' + '<path d="M38 260C100 240 220 240 282 260V280a8 8 0 0 1-8 8H46a8 8 0 0 1-8-8Z" fill="' + C.g4 + '"/>';
    g += '<g transform="translate(232 82)"><circle r="24" fill="#F2C14E"/></g>' + tree(140, 256, 1.3) + tree(220, 260, .62, 'bush') + plant(80, 258, .8);
    if (o.bee || !o.shield) g += '<g transform="translate(70 104)"><ellipse rx="14" ry="10" fill="' + C.o + '"/><path d="M-4-9v18M4-9v18" stroke="' + C.g1 + '" stroke-width="3"/><ellipse cx="-4" cy="-12" rx="8" ry="6" fill="#fff" opacity=".85"/><ellipse cx="6" cy="-12" rx="8" ry="6" fill="#fff" opacity=".85"/></g><path d="M86 112c20 10 30-6 46 4" fill="none" stroke="' + C.g4 + '" stroke-width="2" stroke-dasharray="3 5"/>';
    if (o.shield) g += '<g transform="translate(250 196)"><path d="M0-34L28-22V2C28 20 14 32 0 38-14 32-28 20-28 2V-22Z" fill="' + C.g1 + '"/><path d="M-11 2L-3 10 12-6" fill="none" stroke="' + C.l2 + '" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></g>';
    return g;
  };
  M.data = function (o) {
    var g = shadow(170, 292, 110);
    if (o.cmp) {
      if (o.hoe) g += '<g transform="translate(70 230) rotate(-30)"><rect x="-4" y="-120" width="8" height="130" rx="4" fill="' + C.d3 + '"/><path d="M-4-120h-30v14h30Z" fill="#8C9A92"/></g>';
      else g += '<g transform="translate(84 168) rotate(-8)"><rect x="-50" y="-70" width="100" height="136" rx="12" fill="' + C.c2 + '"/><g stroke="' + C.d3 + '" stroke-opacity=".5" stroke-width="3" stroke-linecap="round"><path d="M-32-40h64M-32-20h50M-32 0h60M-32 20h40M-32 40h52"/></g></g>';
      g += '<path d="M128 160h22M142 150l10 10-10 10" fill="none" stroke="' + C.g3 + '" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>';
      g += '<g transform="translate(222 166)"><rect x="-62" y="-90" width="124" height="176" rx="20" fill="' + C.g1 + '"/><rect x="-52" y="-78" width="104" height="146" rx="10" fill="#fff"/><path d="M-40 40L-14 10L10 26L40-18" fill="none" stroke="' + C.g3 + '" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><rect x="-40" y="-64" width="50" height="10" rx="5" fill="' + C.l2 + '"/><rect x="-40" y="-46" width="74" height="8" rx="4" fill="' + C.l3 + '"/><circle cx="30" cy="-58" r="10" fill="' + C.s2 + '"/></g>';
      return g;
    }
    g += '<rect x="56" y="62" width="208" height="150" rx="20" fill="' + C.g1 + '"/><rect x="68" y="74" width="184" height="126" rx="10" fill="#fff"/><path d="M128 212l-14 36h92l-14-36" fill="' + C.g2 + '"/><path d="M96 252h128" stroke="' + C.g1 + '" stroke-width="8" stroke-linecap="round"/>';
    g += '<path d="M84 174L120 140L152 156L196 108L236 120" fill="none" stroke="' + C.g3 + '" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><rect x="84" y="88" width="60" height="10" rx="5" fill="' + C.l2 + '"/><rect x="84" y="104" width="40" height="8" rx="4" fill="' + C.l3 + '"/>' + '<g transform="translate(222 92)"><circle r="12" fill="' + C.s2 + '"/></g>' + sprout(272, 280, 1.2);
    return g;
  };
  M.calendar = function () {
    var g = shadow(160, 292, 100) + '<rect x="56" y="70" width="208" height="206" rx="26" fill="#fff"/><path d="M56 96a26 26 0 0 1 26-26h156a26 26 0 0 1 26 26v26H56Z" fill="' + C.g3 + '"/><g stroke="' + C.g1 + '" stroke-width="10" stroke-linecap="round"><path d="M104 56v28M216 56v28"/></g>';
    for (var r = 0; r < 4; r++) for (var c = 0; c < 5; c++) { var on = (r === 1 && c > 1) || (r === 2 && c < 3); g += '<rect x="' + (78 + c * 34) + '" y="' + (138 + r * 32) + '" width="26" height="24" rx="7" fill="' + (on ? C.l2 : C.l3) + '"' + (on ? '' : ' opacity=".7"') + '/>'; }
    g += '<g transform="translate(250 246)"><circle r="30" fill="' + C.g1 + '"/>' + leaf(-10, 10, .6, -60, C.l2) + leaf(8, 8, .5, -120, C.l1) + '</g>';
    return g;
  };
  M.intercrop = function (o) {
    var g = '<path d="M24 262C100 248 220 248 296 262V286H24Z" fill="' + C.d2 + '"/>';
    g += tree(76, 262, .95) + tree(140, 266, .62, 'bush') + tree(200, 262, .95) + tree(262, 266, .62, 'bush');
    g += '<g fill="' + C.l1 + '">' + [108, 170, 232].map(function (x) { return '<ellipse cx="' + x + '" cy="258" rx="12" ry="7"/>'; }).join('') + '</g>';
    if (o.plan) g += '<g stroke="' + C.g1 + '" stroke-opacity=".35" stroke-width="2" stroke-dasharray="4 6"><path d="M76 40V262M200 40V262"/></g><path d="M76 36h124" stroke="' + C.g1 + '" stroke-width="3"/><path d="M76 30v12M200 30v12" stroke="' + C.g1 + '" stroke-width="3"/>';
    return g;
  };
  M.monocrop = function (o) {
    var g = '<path d="M24 236C100 222 220 222 296 236V286H24Z" fill="' + (o.soil ? C.d4 : C.d2) + '"/>';
    if (o.soil) g += '<g fill="none" stroke="' + C.d2 + '" stroke-width="2.5" stroke-linecap="round"><path d="M70 252l10 14-6 10M160 250l-8 12 10 12M246 252l10 12"/></g>';
    [56, 104, 152, 200, 248].forEach(function (x) { g += tree(x + 8, 238, .62, 'bush'); });
    [72, 132, 196].forEach(function (x) { g += tree(x, 162, .42, 'bush'); });
    g += '<path d="M40 166C120 156 200 156 280 166" stroke="' + C.d2 + '" stroke-opacity=".35" stroke-width="3" fill="none"/>';
    return g;
  };
  M.salt = function (o) {
    var g = '<rect x="40" y="168" width="240" height="118" rx="24" fill="' + C.d3 + '"/>' + dots(18, 50, 180, 220, 96, 2.4, '#fff', .2, 7);
    function cube(x, y, s) { return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')"><path d="M0-22L22-11V11L0 22-22 11V-11Z" fill="#EEF3F5"/><path d="M0-22L22-11 0 0-22-11Z" fill="#fff"/><path d="M0 0L22-11V11L0 22Z" fill="#C9D6DC"/></g>'; }
    g += cube(84, 160, 1.3) + cube(120, 172, .9) + cube(236, 162, 1.1) + cube(206, 176, .7);
    if (o.root) g += '<path d="M160 170V270M160 210C140 226 124 230 110 250M160 226C178 240 196 244 210 262" fill="none" stroke="' + C.d5 + '" stroke-width="5" stroke-linecap="round"/>' + plant(160, 170, 1.15, true) + '<g fill="none" stroke="' + C.s1 + '" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><path d="M140 240h-24M122 234l-6 6 6 6M180 250h24M198 244l6 6-6 6"/></g>';
    else g += plant(160, 170, 1.2) + '<g transform="translate(250 84)"><rect x="-26" y="-34" width="52" height="64" rx="12" fill="' + C.g1 + '"/>' + txt(0, 4, 17, 'EC', C.l2, 700) + '</g>';
    return g;
  };
  M.plants2 = function () {
    var g = '<path d="M24 262C100 248 220 248 296 262V286H24Z" fill="' + C.d2 + '"/><path d="M160 60V250" stroke="' + C.g1 + '" stroke-opacity=".15" stroke-width="2" stroke-dasharray="4 6"/>';
    g += '<g transform="translate(92 258)"><path d="M0 0V-120" stroke="' + C.g3 + '" stroke-width="5"/>' + leaf(0, -40, 1.2, -150, C.l1) + leaf(0, -70, 1.1, -30, C.g3) + leaf(0, -96, 1, -150, C.l1) + '<ellipse cx="4" cy="-128" rx="8" ry="18" fill="' + C.o + '"/></g>' + txt(92, 60, 18, '1 năm', C.g2, 600);
    g += tree(228, 260, .95) + txt(228, 60, 18, 'Nhiều năm', C.g2, 600);
    return g;
  };

  /* ---------- tiêu đề tự rút gọn cho bài mới ---------- */
  function sentence(s) {
    return String(s || '').split(' ').map(function (w, i) { if (/^[A-ZĐ]{2,}$/.test(w) || /^pH$/.test(w)) return w; var l = w.toLocaleLowerCase('vi'); return i === 0 ? l.charAt(0).toLocaleUpperCase('vi') + l.slice(1) : l; }).join(' ');
  }
  HV.artInfo = function (p) {
    var a = BAI[p.slug];
    if (a) return { k: a[0], s: a[1], m: a[2], o: a[3] || {} };
    var t = String(p.title || '').trim(), m, k = t, s = '';
    if ((m = /^(.*?)\s+(là gì\??|có tác dụng gì\??|có vai trò gì.*|khác nhau.*|như thế nào\??|gây ra.*)$/i.exec(t))) { k = m[1]; s = m[2]; }
    k = sentence(k); s = s.toLocaleLowerCase('vi');
    return { k: k, s: s, m: HV.group(p).m, o: {} };
  };

  function sizeOf(k) { var n = k.length; return n <= 6 ? 'z1' : n <= 13 ? 'z2' : n <= 22 ? 'z3' : 'z4'; }
  HV.artSVG = function (m, o) {
    uid++; var id = 'hva' + uid, fn = M[m] || M.soil;
    return '<svg class="hva-i" viewBox="0 0 320 320" aria-hidden="true" focusable="false">' + fn(o || {}, id) + '</svg>';
  };
  /* ảnh bìa hoàn chỉnh: big = trang bài (to hơn, có nhãn) */
  HV.art = function (p, big) {
    var g = HV.group(p), a = HV.artInfo(p), esc = HV.esc || function (x) { return x; };
    return '<span class="hva hva-' + sizeOf(a.k) + (big ? ' hva-big' : '') + '" style="--bg:' + g.bg + ';--disc:' + g.disc + ';--acc:' + g.acc + '" role="img" aria-label="Minh hoạ: ' + esc(p.title || a.k) + '">' +
      '<span class="hva-tx"><span class="hva-c">' + esc(g.name) + '</span><span class="hva-k">' + esc(a.k) + '</span>' + (a.s ? '<span class="hva-s">' + esc(a.s) + '</span>' : '') + '</span>' +
      '<span class="hva-v"><i class="hva-d"></i>' + HV.artSVG(a.m, a.o) + '</span>' +
      '<svg class="hva-mk" viewBox="0 0 24 24" aria-hidden="true"><use href="#logo"/></svg></span>';
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = HV; else root.HV = HV;
})(this);
