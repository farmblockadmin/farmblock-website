// Nội dung popup cho trang 360 vườn Ia Ko. Nội dung tĩnh, không cập nhật thời gian thực.
// Vị trí thiết bị: Dashboard Farmblock (đọc 06/11/2026). Diện tích khu: marketing/ban-do-ia-ko/README.md.
window.FB360 = {
  // Ảnh drone thật: GPS, độ cao so với điểm cất cánh và hướng gimbal đọc trong XMP của ảnh DJI.
  // devices: có hiện điểm thiết bị không (tháng 4 chưa lắp gì). fov: góc nhìn lúc mở cảnh.
  scenes: [
    { id: '0408', src: 'pano/0408', thumb: 'pano/thumb-0408.webp', label: 'Tháng 4', short: 'Tháng 4', date: '08/04/2026', lat: -251.9, lon: 44.3, h: 417.7, yaw: 99.1, fov: 104, tilt: [4, -2], devices: false, trace: true, dry: true, // tháng 4 chưa đào hồ: ranh B1 không khoét chỗ hồ
      meta: 'Bay cao 418 m', sub: 'Đất mới khai hoang, chưa đào hồ, chưa trồng. Góc nhìn rộng nhất, thấy cả vùng xung quanh.' },
    { id: '0711', src: 'pano/0711', thumb: 'pano/thumb-0711.webp', label: 'Tháng 7, trên hồ', short: 'Th.7 hồ', date: '11/07/2026', lat: -118, lon: -97.8, h: 195.3, yaw: 180.5, fov: 98, tilt: [8, -4], devices: true,
      meta: 'Bay 195 m, ngay trên hồ', sub: 'Vườn vừa trồng xong, nhìn thẳng xuống hồ trữ nước và Nhà điều hành.' },
    { id: '0713', src: 'pano/0713', thumb: 'pano/thumb-0713.webp', label: 'Tháng 7, bay thấp', short: 'Th.7 thấp', date: '13/07/2026', lat: -138.8, lon: 13, h: 126.2, yaw: 14.6, fov: 98, tilt: [14, -6], devices: true,
      meta: 'Bay thấp 126 m', sub: 'Nhìn rõ từng hàng cà phê con và các điểm thiết bị đang chạy.' },
    // Ảnh 08/04 phủ hàng cà phê dựng 3D theo quy hoạch (lấy từ tour Panoee "360 flycam"). Luôn ghi minh hoạ.
    { id: '3d', src: 'pano/3d', thumb: 'pano/thumb-3d.webp', label: '3D', short: '3D', date: 'Quy hoạch', illus: true, trace: true, lat: -251.9, lon: 44.3, h: 417.7, yaw: 99.1, fov: 104, tilt: [4, -2], devices: false,
      meta: 'Phối cảnh 3D trên ảnh drone 08/04/2026', sub: 'Vườn Ia Ko theo quy hoạch, dựng 3D trên ảnh drone thật.' }
  ],
  // biển chào mừng đặt phía bắc vườn, cạnh đường vào
  board: { kicker: 'Chào mừng đến', title: 'Vườn cà phê Ia Ko' },
  notice: 'Hình minh hoạ quy hoạch dự kiến, không phải trạng thái thực tế của khu vườn',
  defaultScene: '0713',

  zones: {
    A:  { rgb: '138,255,120', ha: '6,7', text: 'Khu lớn nhất, ở phía tây, giáp đường vào và Nhà điều hành.' },
    B1: { rgb: '80,215,255', ha: '2,6', text: 'Ôm quanh hồ trữ nước. Diện tích đã gồm mặt hồ khoảng 1.800 m².' },
    B2: { rgb: '90,240,200', ha: '1,0', text: 'Khu nhỏ nằm giữa B1 và C2.' },
    C1: { rgb: '255,206,84', ha: '2,2', text: 'Phía bắc, gần cổng vào.' },
    C2: { rgb: '255,140,90', ha: '2,0', text: 'Phía đông nam của vườn.' },
    C3: { rgb: '255,108,128', ha: '1,5', text: 'Nằm giữa C2 và C4.' },
    C4: { rgb: '255,178,60', ha: '4,8', text: 'Khu lớn thứ hai, trải dài phía đông bắc.' },
    C5: { rgb: '255,130,200', ha: '0,2', text: 'Mảnh nhỏ nhất, ở mũi phía đông.' }
  },

  // device: thiết bị là gì · does: công năng · why: vì sao vườn cần nó
  kinds: {
    building: {
      kicker: 'Hạ tầng', name: 'Nhà điều hành', photo: 'img/air-house.webp', photoAlt: 'Nhà điều hành mái pin mặt trời cạnh hồ trữ nước, nhìn từ flycam',
      device: ['68 tấm pin mặt trời, tổng 41,5 kWp', 'Bơm tưới từ giếng khoan sâu 150 m', 'Hai bộ châm phân theo nước tưới'],
      does: 'Nơi đội vườn làm việc hằng ngày, đặt hệ thống điện và máy bơm cho cả vườn. Nước từ đây đi qua khoảng 71 km ống tới 47.388 béc tưới ở gốc cây.',
      why: 'Đặt sát hồ để đường ống bơm ngắn nhất. Mái nhà vừa che nắng vừa làm ra điện, nên bơm tưới chạy bằng năng lượng mặt trời.'
    },
    lake: {
      kicker: 'Hạ tầng', name: 'Hồ trữ nước', photo: 'img/crop-ho.webp', photoAlt: 'Hồ trữ nước lót bạt giữa các hàng cà phê, nhìn từ drone',
      device: ['Mặt hồ khoảng 1.800 m²', 'Lót bạt chống thấm'],
      does: 'Trữ nước giếng và nước mưa để tưới chủ động trong mùa khô.',
      why: 'Mùa khô Tây Nguyên kéo dài nhiều tháng. Có hồ thì vườn không phải bơm giếng liên tục, và vẫn có nước khi giếng yếu.'
    },
    center: {
      kicker: 'Cảm biến', name: 'Trạm trung tâm', photo: 'img/dev-weather.webp', photoAlt: 'Trạm thời tiết gắn trên cột ở vườn Ia Ko',
      device: ['Nhiệt độ, độ ẩm không khí', 'Áp suất, ánh sáng', 'Tốc độ và hướng gió', 'Lượng mưa', 'pH, EC, nhiệt độ nước tưới', 'Lưu lượng hai máy bơm'],
      does: 'Cho biết lúc nào gió nhẹ, trời không mưa để phun thuốc; mưa bao nhiêu để bớt tưới; nước giếng có ổn trước khi châm phân không.',
      why: 'Thời tiết và nước tưới dùng chung cho cả vườn, nên chỉ cần một trạm đặt ở trung tâm, gần hồ và máy bơm.',
      approx: true
    },
    soil: {
      kicker: 'Cảm biến', name: 'Điểm đo đất', photo: 'img/dev-soil.webp', photoAlt: 'Đầu đo cắm trong đất đỏ bazan ở vườn Ia Ko',
      device: ['Độ ẩm đất', 'Nhiệt độ đất', 'pH đất', 'EC, lượng phân hoà tan', 'Đạm, lân, kali'],
      does: 'Biết đất đang khô hay ẩm trước khi mở van tưới. Khu thừa nước thì giảm tưới, khu thiếu thì tưới thêm. Theo dõi pH và phân trong đất để bón đúng lượng.',
      why: 'Mỗi khu có đất và độ dốc riêng. Một điểm đo đại diện cho cả khu, nên vườn được tưới và bón theo từng khu thay vì làm cả vườn một lượt. Vườn thiết kế 9 điểm, đang lắp dần.',
      approx: true
    },
    water: {
      kicker: 'Cảm biến', name: 'Điểm đo nước', photo: 'img/dev-water.webp', photoAlt: 'Hộp đo nước gắn trên cột cạnh đường ống và hồ',
      device: ['Chất lượng nước tưới trên đường ống'],
      does: 'Phát hiện sớm nước bị chua, mặn hoặc quá nhiều phân trước khi nước ra tới gốc cây.',
      why: 'Đặt cạnh hồ và đường ống chính, nơi mọi lượt tưới đều đi qua.'
    },
    camera: {
      kicker: 'Camera', name: 'Camera', photo: 'img/dev-camera.webp', photoAlt: 'Cột camera chạy pin mặt trời giữa hàng cà phê con',
      device: ['Góc nhìn khoảng 110°', 'Chạy pin mặt trời trên cột'],
      does: 'Ghi lại việc tưới, phun, làm cỏ mỗi ngày làm bằng chứng cho nhật ký canh tác. Đối tác và nhà đầu tư xem được vườn từ xa.',
      why: 'Mỗi cột đứng ở chỗ nhìn được nhiều hàng cây nhất của khu. Vườn có 22 vị trí camera, đang lắp dần.'
    }
  },

  // Điểm dừng cho chế độ tự xem (cảnh 13/07)
  tour: [
    { target: 'nha-dieu-hanh', text: 'Nhà điều hành: mái pin mặt trời chạy bơm tưới cho cả vườn.' },
    { target: 'ho', text: 'Hồ trữ nước khoảng 1.800 m², dự trữ cho mùa khô.' },
    { target: 'khu-A', text: 'Khu A, 6,7 ha, khu lớn nhất của vườn.' },
    { target: 'tram', text: 'Trạm trung tâm đo thời tiết và nước tưới.' },
    { target: 'khu-C4', text: 'Khu C4, 4,8 ha, trải dài phía đông bắc.' },
    { target: 'khu-C2', text: 'Khu C2 và C3 ở phía đông nam.' }
  ]
};
