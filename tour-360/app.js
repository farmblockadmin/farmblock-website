/* Vườn Ia Ko 360°: kéo xoay ảnh drone, đổi cảnh, điểm nóng mở popup, ranh 8 khu kiểu saber.
   Ranh khu và điểm thiết bị chiếu lên ảnh bằng GPS, độ cao và hướng gimbal của chính ảnh:
   x = W·(0.5 + (phương vị − gimbalYaw)/360), y = H·(0.5 − góc ngẩng/180).
   Thu nhỏ quá 82° thì lùi máy ảnh khỏi tâm cầu (giống "little planet" của Panoee) để nhìn được xa hơn. */
(() => {
  'use strict';
  const C = window.FB360, D = window.FB360_DATA;
  const $ = s => document.querySelector(s);
  const RAD = Math.PI / 180, R = 500;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const small = () => innerWidth < 761 || innerHeight < 521; // điện thoại dọc hoặc ngang
  const phone = () => matchMedia('(pointer:coarse)').matches || small();
  const LOWFX = phone();
  const portrait = () => innerWidth < 761 && innerHeight > innerWidth; // điện thoại dọc: cần góc nhìn rộng hơn

  const view = $('#view'), glc = $('#gl'), fx = $('#fx'), ctx = fx.getContext('2d');
  const pinsEl = $('#pins'), tip = $('#tip'), pop = $('#pop'), popIn = $('#pop-in'), scrim = $('#scrim'), hint = $('#hint');
  const subEl = $('#sub'), metaEl = $('#meta'), dateEl = $('#date'), illusEl = $('#illus'), caption = $('#caption'), tourBtn = $('#tour'), mini = $('#mini');
  const cmp = $('#cmp'), cmpT = $('#cmp-t'), cctx = cmp.getContext('2d');

  // ---------- three.js ----------
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas: glc, antialias: !phone(), powerPreference: 'high-performance' }); }
  catch (e) { view.innerHTML = '<img class="fallback" src="pano/0713.webp" alt="Ảnh toàn cảnh vườn Ia Ko">'; return; }
  const scene3 = new THREE.Scene();
  const cam = new THREE.PerspectiveCamera(80, 1, 0.05, 2000);
  const geo = new THREE.SphereGeometry(R, 96, 64); geo.scale(-1, 1, 1);
  const matA = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const matB = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, depthTest: false, depthWrite: false });
  const meshB = new THREE.Mesh(geo, matB); meshB.renderOrder = 1;
  scene3.add(new THREE.Mesh(geo, matA), meshB);
  const loader = new THREE.TextureLoader(), texCache = {}, hiCache = {};
  const prep = t => { t.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy()); t.generateMipmaps = false; t.minFilter = THREE.LinearFilter; return t; };
  const get = url => new Promise((ok, no) => loader.load(url, t => ok(prep(t)), undefined, no));
  // bản 1024 px (10–30 KB) để mở cảnh ngay; bản nét (2048 trên điện thoại, 4096 trên máy tính) tải sau
  const loadTex = sc => texCache[sc.id] || (texCache[sc.id] = get(`${sc.src}-s.webp`));
  const hiRes = sc => hiCache[sc.id] || (hiCache[sc.id] = get(`${sc.src}${phone() || renderer.capabilities.maxTextureSize < 4096 ? '-m' : ''}.webp`));

  // ---------- hình học ----------
  const uvVec = (u, v, out = new THREE.Vector3()) => {
    const phi = u * 2 * Math.PI, th = (1 - v) * Math.PI;
    return out.set(Math.cos(phi) * Math.sin(th), Math.cos(th), Math.sin(phi) * Math.sin(th));
  };
  // z: độ cao so với mặt đất (m)
  function geoAE(sc, lon, lat, z = 0) {
    // D.local: bản công khai đã đổi toạ độ sang mét so với một điểm gốc (không lộ GPS)
    const e = D.local ? lon - sc.lon : (lon - sc.lon) * 111320 * Math.cos(sc.lat * RAD), n = D.local ? lat - sc.lat : (lat - sc.lat) * 110574, d = Math.hypot(e, n);
    return { az: Math.atan2(e, n) / RAD, el: Math.atan2(z - sc.h, d) / RAD, dist: Math.hypot(d, z - sc.h) };
  }
  const aeDir = (sc, a) => uvVec(0.5 + (a.az - sc.yaw) / 360, 0.5 + a.el / 180);
  const geoDir = (sc, lon, lat) => aeDir(sc, geoAE(sc, lon, lat)).multiplyScalar(R);
  const wrap = d => ((d + 540) % 360) - 180;
  const centroid = ring => { let x = 0, y = 0; ring.forEach(p => { x += p[0]; y += p[1]; }); return [x / ring.length, y / ring.length]; };
  const ease = t => 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 3);
  const inPoly = ([x, y], ring) => { let c = false; for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) { const [xi, yi] = ring[i], [xj, yj] = ring[j]; if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c; } return c; };
  const GC = centroid(D.boundary);
  // tâm theo diện tích (không theo số đỉnh), để nhãn khu nằm giữa khu
  const areaC = ring => { let a = 0, x = 0, y = 0; for (let i = 0, n = ring.length; i < n; i++) { const [x0, y0] = ring[i], [x1, y1] = ring[(i + 1) % n], f = x0 * y1 - x1 * y0; a += f; x += (x0 + x1) * f; y += (y0 + y1) * f; } return a ? [x / (3 * a), y / (3 * a)] : centroid(ring); };

  // ---------- trạng thái ----------
  const S = { sc: null, d: 0, el: -30, fov: 90, hoverZone: null, selZone: null, introAt: 0, anim: null, moved: false, tour: null };
  let polys = null;

  // ---------- điểm nóng ----------
  const KC = { building: '245,228,161', lake: '124,195,217', center: '181,227,131', soil: '232,186,104', water: '111,199,224', camera: '214,226,238' };
  const P = D.points, items = [];
  const lc = centroid(D.lake);
  items.push({ id: 'nha-dieu-hanh', kind: 'building', key: true, lat: P.building.lat, lon: P.building.lon, label: 'Nhà điều hành', sub: 'Điện mặt trời, bơm tưới, nơi đội vườn làm việc' });
  items.push({ id: 'ho', kind: 'lake', key: true, lat: lc[1], lon: lc[0], label: 'Hồ trữ nước', sub: 'Khoảng 1.800 m², cạnh Nhà điều hành' });
  items.push({ id: 'tram', kind: 'center', zone: 'A', live: true, lat: P.center.lat, lon: P.center.lon, label: 'Trạm trung tâm', sub: 'Thời tiết và nước tưới cho cả vườn' });
  P.nodes.forEach(([id, zone, lat, lon], i) => items.push({ id: id.toLowerCase(), kind: 'soil', zone, lat, lon, live: true, label: `Điểm đo đất ${i + 1}`, sub: `Khu ${zone}` }));
  P.water.forEach(([id, zone, lat, lon], i) => items.push({ id: id.toLowerCase(), kind: 'water', zone, lat, lon, live: true, label: `Điểm đo nước ${i + 1}`, sub: `Khu ${zone}, cạnh hồ trữ nước` }));
  P.cameras.forEach(([id, zone, lat, lon]) => items.push({ id: id.toLowerCase(), kind: 'camera', zone, lat, lon, live: true, label: `Camera khu ${zone}`, sub: `Khu ${zone}` }));
  items.forEach(it => {
    const k = C.kinds[it.kind], b = document.createElement('div');
    b.className = 'pin off' + (it.key ? ' key' : '');
    b.style.setProperty('--c', KC[it.kind]);
    b.innerHTML = `<span class="gp"></span><span class="stem"></span><button type="button" class="lab" tabindex="-1" aria-label="${it.label}. ${it.sub}. Mở thông tin">${k.photo ? `<span class="pv" aria-hidden="true"><img src="${k.photo.replace('img/', 'img/t-')}" alt="" width="288" height="162" loading="lazy" decoding="async"></span>` : ''}<span class="ic"><svg aria-hidden="true"><use href="#i-${it.kind}"/></svg></span><span class="t"><small>${k.kicker}${it.zone && !it.key ? ' · ' + it.zone : ''}</small><b>${it.label}</b></span></button>`;
    const go = e => { e.stopPropagation(); stopTour(); openItem(it); };
    b.querySelector('.lab').addEventListener('click', go);
    b.querySelector('.gp').addEventListener('click', go);
    it.el = b; it.btn = b.querySelector('.lab');
    it.w = (it.key ? 8.6 : 7.4) * it.label.length + (it.key ? 64 : 54);
    pinsEl.appendChild(b);
  });

  // nhãn khu: nút thật để bấm, dùng được cả bàn phím
  const zoneEls = {};
  D.zones.forEach(z => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'zl off';
    b.innerHTML = `<b>Khu ${z.id}</b><small>${C.zones[z.id].ha} ha</small>`;
    b.style.setProperty('--c', C.zones[z.id].rgb);
    b.setAttribute('aria-label', `Khu ${z.id}, ${C.zones[z.id].ha} héc ta. Mở thông tin`);
    b.addEventListener('click', e => { e.stopPropagation(); stopTour(); openZone(z.id); });
    b.addEventListener('mouseenter', () => { S.hoverZone = z.id; });
    b.addEventListener('mouseleave', () => { S.hoverZone = null; });
    zoneEls[z.id] = b; pinsEl.appendChild(b);
  });

  function buildPolys(sc) {
    const dirs = r => r.map(p => geoDir(sc, p[0], p[1]));
    const T = sc.trace && D.zones3d, uvd = ([u, v]) => uvVec(u, v).multiplyScalar(R);
    return {
      lake: dirs(D.lake),
      zones: D.zones.map(z => {
        const dry = sc.dry && z.id === 'B1' && T && T.b1Dry, c = areaC(z.ring), tr = dry ? dry.ring : T && T.rings[z.id]; // cảnh 3D: ranh dò theo mép vùng dựng 3D trong ảnh
        return { id: z.id, rgb: C.zones[z.id].rgb, pts: tr ? tr.map(uvd) : dirs(z.ring), c, cDir: tr ? uvd(dry ? dry.center : T.centers[z.id]) : geoDir(sc, c[0], c[1]) };
      })
    };
  }

  // ---------- biển chào mừng và dòng thông báo: dựng phẳng trong không gian 3D ----------
  const LOGO = ['M140.967 19.9768C162.647 -1.70319 197.797 -1.70319 219.477 19.9768L340.467 140.967C362.147 162.647 362.147 197.797 340.467 219.477L219.477 340.467C197.797 362.147 162.647 362.147 140.967 340.467L19.9768 219.477C-1.70319 197.797 -1.70319 162.647 19.9768 140.967L140.967 19.9768Z',
    'M64 180L120 150.4L170.4 180L120 209.6Z', 'M296 180L240 150.4L189.6 180L240 209.6Z', 'M118.4 72.8L173.6 104L173.6 162.4L118.4 132.8Z', 'M241.6 72.8L186.4 104L186.4 162.4L241.6 132.8Z', 'M118.4 287.2L173.6 256L173.6 197.6L118.4 227.2Z', 'M241.6 287.2L186.4 256L186.4 197.6L241.6 227.2Z'];
  const FONT = '"Archivo",system-ui,sans-serif';
  function rrect(g, x, y, w, h, r) { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }
  function boardCanvas() {
    const b = C.board, M = 48, PAD = 60, LOGO_S = 236, GAP = 52, STEM = 300;
    const L = [ // dòng chữ: cỡ, giãn chữ, chiều cao chữ hoa, khoảng cách phía trên, màu
      { t: b.kicker.toUpperCase(), f: `500 30px ${FONT}`, ls: 6, h: 22, gap: 0, c: 'rgba(211,240,174,.85)' },
      { t: 'FARMBLOCK', f: `600 92px ${FONT}`, ls: 10, h: 66, gap: 24, c: '#fff' },
      { t: b.title, f: `600 66px ${FONT}`, ls: 0, h: 48, gap: 26, c: 'grad' },
      b.tag && { t: b.tag, f: `400 32px ${FONT}`, ls: 0, h: 24, gap: 26, c: 'rgba(255,255,255,.78)' }].filter(Boolean);
    const cv = document.createElement('canvas'); let g = cv.getContext('2d');
    const spc = v => { if ('letterSpacing' in g) g.letterSpacing = v + 'px'; };
    let tw = 0; L.forEach(l => { g.font = l.f; spc(l.ls); tw = Math.max(tw, g.measureText(l.t).width - l.ls); });
    const th = L.reduce((n, l) => n + l.h + l.gap, 0), bw = Math.ceil(PAD * 2 + LOGO_S + GAP + tw), bh = Math.ceil(Math.max(LOGO_S, th) + PAD * 2);
    cv.width = bw + M * 2; cv.height = M + bh + STEM; g = cv.getContext('2d');
    const x = M, y = M, cx = cv.width / 2;
    // thân cột xuống mặt đất
    const sg = g.createLinearGradient(0, y + bh, 0, cv.height); sg.addColorStop(0, 'rgba(181,227,131,.95)'); sg.addColorStop(1, 'rgba(181,227,131,.25)');
    g.fillStyle = sg; g.fillRect(cx - 2, y + bh, 4, STEM - 14);
    g.beginPath(); g.arc(cx, cv.height - 14, 12, 0, 7); g.fillStyle = '#B5E383'; g.shadowColor = '#B5E383'; g.shadowBlur = 24; g.fill(); g.shadowBlur = 0;
    // mặt biển
    g.save(); g.shadowColor = 'rgba(181,227,131,.55)'; g.shadowBlur = 40;
    rrect(g, x, y, bw, bh, 44); const bg = g.createLinearGradient(x, y, x + bw, y + bh); bg.addColorStop(0, 'rgba(12,31,16,.95)'); bg.addColorStop(1, 'rgba(23,51,28,.92)'); g.fillStyle = bg; g.fill(); g.restore();
    rrect(g, x + 2, y + 2, bw - 4, bh - 4, 42); g.lineWidth = 3; g.strokeStyle = 'rgba(211,240,174,.7)'; g.stroke();
    // logo căn giữa theo chiều dọc
    g.save(); g.translate(x + PAD, y + (bh - LOGO_S) / 2); g.scale(LOGO_S / 360, LOGO_S / 360);
    const lg = g.createLinearGradient(83, 83, 277, 277); lg.addColorStop(0, '#3A8047'); lg.addColorStop(1, '#86C046');
    g.fillStyle = lg; g.fill(new Path2D(LOGO[0])); g.fillStyle = '#F1F7E8'; LOGO.slice(1).forEach(d => g.fill(new Path2D(d))); g.restore();
    // khối chữ căn giữa theo chiều dọc, mỗi dòng xếp theo chiều cao chữ hoa
    const tx = x + PAD + LOGO_S + GAP; let ty = y + (bh - th) / 2;
    g.textBaseline = 'alphabetic';
    L.forEach(l => {
      ty += l.gap + l.h; g.font = l.f; spc(l.ls);
      if (l.c === 'grad') { const tg = g.createLinearGradient(tx, 0, tx + tw, 0); tg.addColorStop(0, '#B5E383'); tg.addColorStop(.55, '#F5E4A1'); tg.addColorStop(1, '#7CC3D9'); g.fillStyle = tg; } else g.fillStyle = l.c;
      g.fillText(l.t, tx, ty);
    });
    return cv;
  }
  const mkPlane = (cv, order) => {
    const t = new THREE.CanvasTexture(cv); t.anisotropy = renderer.capabilities.getMaxAnisotropy();
    const m = new THREE.Mesh(new THREE.PlaneGeometry(1, cv.height / cv.width), new THREE.MeshBasicMaterial({ map: t, transparent: true, depthTest: false, depthWrite: false, opacity: 0 }));
    m.renderOrder = order; m.visible = false; m.userData.asp = cv.height / cv.width; scene3.add(m); return m;
  };
  let board = null;
  const north = D.boundary.reduce((a, p) => p[1] > a[1] ? p : a);
  // máy ảnh tạm ở góc nhìn mặc định của cảnh, để đặt biển và dòng chữ theo đúng chỗ người xem thấy
  const tcam = new THREE.PerspectiveCamera(80, 1, 0.05, 2000);
  function viewCam(sc) {
    const a = geoAE(sc, GC[0], GC[1]), d = a.az - sc.yaw, el = Math.max(-62, a.el + sc.tilt[portrait() ? 1 : 0]), f = sceneFov(sc);
    const fw = uvVec(0.5 + d / 360, 0.5 + el / 180);
    tcam.fov = Math.min(f, 100); tcam.aspect = (W || 1) / (H || 1); tcam.updateProjectionMatrix();
    tcam.position.copy(fw).multiplyScalar(-camOff(f) * R); tcam.lookAt(tcam.position.clone().add(fw)); tcam.updateMatrixWorld();
    return Math.atan(Math.tan(tcam.fov * RAD / 2) * tcam.aspect); // nửa góc ngang
  }
  const RS = 470;
  function placeSigns(sc) {
    if (!board) return;
    const half = viewCam(sc), fr = portrait() ? 0.4 : 0.2;
    // biển: phía bắc vườn cạnh đường vào, đứng thẳng, quay về phía người xem; thu nhỏ nếu chạm thanh menu
    const bLat = north[1] + (D.local ? 88 : 0.0008), bLon = north[0], top = new THREE.Vector3();
    let w = 0;
    for (let n = 0; n < 8; n++) {
      let a = geoAE(sc, bLon, bLat); board.position.copy(aeDir(sc, a)).multiplyScalar(RS);
      if (!n) w = 2 * board.position.distanceTo(tcam.position) * Math.tan(half) * fr;
      a = geoAE(sc, bLon, bLat, w * board.userData.asp / 2 * (a.dist / RS)); // nâng để chân cột chạm đất
      board.position.copy(aeDir(sc, a)).multiplyScalar(RS); board.scale.setScalar(w); board.lookAt(tcam.position); board.updateMatrixWorld();
      top.set(0, 0.5 * board.userData.asp, 0).applyMatrix4(board.matrixWorld).applyMatrix4(tcam.matrixWorldInverse).applyMatrix4(tcam.projectionMatrix);
      if ((1 - top.y) / 2 * H > (small() ? 150 : 128)) break;
      w *= 0.82;
    }
    board.visible = true; board.userData.t0 = performance.now();
  }
  function fadeSigns(now) {
    [board].forEach(m => { if (m && m.visible) m.material.opacity = reduce ? 1 : ease((now - m.userData.t0 - 600) / 900); });
  }
  (document.fonts ? document.fonts.load(`600 40px ${FONT}`).catch(() => {}) : Promise.resolve()).then(() => {
    board = mkPlane(boardCanvas(), 3);
    if (S.sc) placeSigns(S.sc);
  });

  // ---------- chiếu lên màn hình ----------
  const tmp = new THREE.Vector3(), tmpB = new THREE.Vector3(), A = new THREE.Vector3(), B = new THREE.Vector3();
  let W = 0, H = 0, dpr = 1;
  const NEAR = -0.5;
  const toCam = (v, out) => out.copy(v).applyMatrix4(cam.matrixWorldInverse);
  const toScreen = c => { tmp.copy(c).applyMatrix4(cam.projectionMatrix); return [(tmp.x + 1) / 2 * W, (1 - tmp.y) / 2 * H]; };
  // các đoạn màn hình từ phân số `from` tới `to` của đường khép kín, đã cắt ở mặt phẳng gần
  function screenRuns(pts, from = 0, to = 1) {
    const n = pts.length - (pts[0].equals(pts[pts.length - 1]) ? 1 : 0), a0 = from * n, a1 = to * n, runs = []; let run = null;
    for (let i = Math.floor(a0); i < Math.min(n, Math.ceil(a1)); i++) {
      toCam(pts[i], A); toCam(pts[(i + 1) % n], B);
      const P0 = A.clone().lerp(B, Math.max(0, a0 - i)), P1 = A.clone().lerp(B, Math.min(1, a1 - i));
      const in0 = P0.z < NEAR, in1 = P1.z < NEAR;
      if (!in0 && !in1) { run = null; continue; }
      let Q0 = P0, Q1 = P1;
      if (!in0) Q0 = P0.clone().lerp(P1, (NEAR - P0.z) / (P1.z - P0.z));
      if (!in1) Q1 = P0.clone().lerp(P1, (NEAR - P0.z) / (P1.z - P0.z));
      if (!run || !in0) { run = [toScreen(Q0)]; runs.push(run); }
      run.push(toScreen(Q1));
      if (!in1) run = null;
    }
    return runs;
  }
  const allInFront = pts => pts.every(p => toCam(p, tmpB).z < NEAR);
  function pathOf(runs, close) {
    const p = new Path2D();
    runs.forEach(r => { p.moveTo(r[0][0], r[0][1]); for (let i = 1; i < r.length; i++) p.lineTo(r[i][0], r[i][1]); });
    if (close && runs.length === 1) p.closePath();
    return p;
  }
  // saber: quầng màu nhiều lớp cộng sáng, lõi gần trắng ở giữa (giống plugin Saber của After Effects)
  function saber(path, rgb, w, a) {
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    if (!LOWFX) { ctx.strokeStyle = `rgba(${rgb},${0.06 * a})`; ctx.lineWidth = w * 14; ctx.stroke(path); } // điện thoại bỏ lớp quầng rộng nhất
    ctx.strokeStyle = `rgba(${rgb},${0.12 * a})`; ctx.lineWidth = w * 7; ctx.stroke(path);
    ctx.strokeStyle = `rgba(${rgb},${0.38 * a})`; ctx.lineWidth = w * 3.2; ctx.stroke(path);
    ctx.strokeStyle = `rgba(${rgb},${0.9 * a})`; ctx.lineWidth = w * 1.6; ctx.stroke(path);
    ctx.strokeStyle = `rgba(255,255,255,${0.95 * a})`; ctx.lineWidth = Math.max(1, w * 0.6); ctx.stroke(path);
    ctx.restore();
  }

  let zonePaths = [];
  function drawFX(now) {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    zonePaths = [];
    if (!polys) return;
    const t = reduce ? 99 : (now - S.introAt) / 1000;
    const w = small() ? 1.3 : 1.6;

    polys.zones.forEach((z, i) => {
      // vẽ dần dọc ranh khi mở cảnh, rồi sáng ổn định và nhấp nháy rất nhẹ
      const k = ease((t - 0.3 - i * 0.12) / 1.4); if (k <= 0) return;
      const runs = screenRuns(z.pts, 0, k); if (!runs.length) return;
      const p = pathOf(runs, k >= 1), full = allInFront(z.pts);
      if (k >= 1) zonePaths.push({ z, p, full });
      const sel = S.selZone === z.id, hov = S.hoverZone === z.id;
      if (k >= 1 && full) { ctx.fillStyle = `rgba(${z.rgb},${sel ? 0.22 : hov ? 0.14 : S.sc.illus ? 0.03 : 0.07})`; ctx.fill(p); }
      const flick = reduce ? 1 : 0.9 + 0.1 * Math.sin(now * 0.011 + i * 1.7);
      saber(p, z.rgb, sel ? w * 1.5 : hov ? w * 1.2 : w, (sel || hov ? 1 : 0.85) * flick);
      // vệt sáng chạy quanh ranh
      if (k >= 1 && !reduce) {
        const head = ((now / 1000) / 9 + i * 0.137) % 1, len = 0.1;
        const seg = r => r.length && saber(pathOf(r, false), z.rgb, w * 1.6, 1);
        seg(screenRuns(z.pts, head, Math.min(1, head + len)));
        if (head + len > 1) seg(screenRuns(z.pts, 0, head + len - 1));
      }
    });

    if (S.sc.devices) {
      const kl = ease((t - 1.2) / 0.8);
      if (kl > 0) { const r = screenRuns(polys.lake, 0, kl); if (r.length) { ctx.lineWidth = 1.4; ctx.strokeStyle = 'rgba(124,195,217,.9)'; ctx.stroke(pathOf(r, kl >= 1)); } }
    }
  }

  // thẻ nhãn: ưu tiên điểm chính, thẻ nào chồng lên thẻ đã đặt thì thu về chỉ còn biểu tượng
  let labelRects = [];
  const overlaps = (r, list) => list.some(q => r[0] < q[2] && r[2] > q[0] && r[1] < q[3] && r[3] > q[1]);
  function placePins() {
    const on = S.sc && S.sc.devices && (reduce || (performance.now() - S.introAt) / 1000 > 0.9);
    const vis = [];
    items.forEach(it => {
      let ok = on && it.dir, x = 0, y = 0;
      if (ok) { toCam(it.dir, tmpB); ok = tmpB.z < NEAR; }
      if (ok) { [x, y] = toScreen(tmpB); ok = x > -30 && y > 60 && x < W + 30 && y < H + 30; }
      it.sx = ok ? x : null; it.sy = y;
      if (!ok) { if (!it.el.classList.contains('off')) { it.el.classList.add('off'); it.btn.tabIndex = -1; } return; }
      if (it.el.classList.contains('off')) { it.el.classList.remove('off'); it.btn.tabIndex = 0; }
      it.el.style.transform = `translate(${x.toFixed(1)}px,${y.toFixed(1)}px)`;
      vis.push(it);
    });
    const mob = small(); labelRects = [];
    vis.sort((a, b) => (b.key - a.key) || (b.sy - a.sy));
    vis.forEach(it => {
      const st = it.key ? (mob ? 46 : 66) : (mob ? 30 : 44), h = it.key ? 44 : 38, w = mob ? it.w * 0.82 : it.w;
      const r = [it.sx - w / 2, it.sy - 7 - st - h, it.sx + w / 2, it.sy - 7 - st];
      const sel = it.el.classList.contains('sel');
      // cảm biến, camera: chỉ biểu tượng, rê chuột mới hiện tên và ảnh; Nhà điều hành, Hồ giữ thẻ chữ
      let tight = !sel && (!it.key || overlaps([r[0] - 6, r[1] - 4, r[2] + 6, r[3] + 4], labelRects)), dot = false;
      if (tight) { const tr = [it.sx - 18, it.sy - 7 - 26 - 34, it.sx + 18, it.sy - 33]; dot = overlaps(tr, labelRects); if (!dot) labelRects.push(tr); }
      else labelRects.push(r);
      it.el.classList.toggle('tight', tight); it.el.classList.toggle('dotonly', dot);
      it.el.style.zIndex = sel ? 5 : dot ? 1 : tight ? 2 : it.key ? 4 : 3;
    });
  }
  function placeZones() {
    const show = polys && (reduce || (performance.now() - S.introAt) / 1000 > 1.2);
    D.zones.forEach((z0, i) => {
      const el = zoneEls[z0.id], z = polys && polys.zones[i];
      let ok = show, x = 0, y = 0;
      if (ok) { toCam(z.cDir, tmpB); ok = tmpB.z < NEAR; }
      if (ok) { [x, y] = toScreen(tmpB); ok = x > 30 && y > 90 && x < W - 30 && y < H - 30; }
      if (ok) {
        const y0 = y; let put = false;
        for (const dy of [0, 30, -30, 58, -58]) { const r = [x - 42, y0 + dy - 20, x + 42, y0 + dy + 20]; if (!overlaps(r, labelRects)) { y = y0 + dy; labelRects.push(r); put = true; break; } }
        if (!put && S.selZone !== z0.id && S.hoverZone !== z0.id) ok = false;
      }
      el.classList.toggle('off', !ok); el.tabIndex = ok ? 0 : -1;
      el.classList.toggle('on', S.selZone === z0.id || S.hoverZone === z0.id);
      if (ok) el.style.transform = `translate(${x.toFixed(1)}px,${y.toFixed(1)}px) translate(-50%,-50%)`;
    });
  }

  // ---------- la bàn ----------
  const DIRS = ['B', 'ĐB', 'Đ', 'ĐN', 'N', 'TN', 'T', 'TB'];
  function drawCompass() {
    if (!S.sc || cmp.offsetParent === null) return;
    const hd = ((S.d + S.sc.yaw) % 360 + 360) % 360, w = 196, s = 2.2;
    cctx.setTransform(2, 0, 0, 2, 0, 0); cctx.clearRect(0, 0, w, 40);
    cctx.font = `500 11px ${FONT}`; cctx.textAlign = 'center';
    for (let a = Math.floor((hd - 46) / 5) * 5; a <= hd + 46; a += 5) {
      const x = w / 2 + (a - hd) * s, n = ((a % 360) + 360) % 360, big = n % 45 === 0;
      cctx.fillStyle = big ? 'rgba(211,240,174,.95)' : 'rgba(255,255,255,.45)';
      cctx.fillRect(x - 0.5, big ? 22 : 27, 1, big ? 12 : 7);
      if (big) { cctx.fillStyle = n === 0 ? '#B5E383' : 'rgba(255,255,255,.9)'; cctx.fillText(DIRS[n / 45], x, 16); }
    }
    cctx.fillStyle = '#B5E383'; cctx.beginPath(); cctx.moveTo(w / 2 - 5, 40); cctx.lineTo(w / 2 + 5, 40); cctx.lineTo(w / 2, 34); cctx.fill();
    cmpT.textContent = `${String(Math.round(hd) % 360).padStart(3, '0')}° ${DIRS[Math.round(hd / 45) % 8]}`;
  }

  // ---------- vòng lặp ----------
  // lùi máy ảnh khi góc nhìn rộng: nhìn xa hơn mà không méo quá mức
  const camOff = f => 0.66 * Math.pow(Math.min(1, Math.max(0, (f - 82) / 38)), 1.35);
  const fwd = new THREE.Vector3();
  function frame(now) {
    if (S.anim) {
      const a = S.anim, k = ease((now - a.t0) / a.ms);
      S.d = a.d0 + a.dd * k; S.el = a.e0 + (a.e1 - a.e0) * k; S.fov = a.f0 + (a.f1 - a.f0) * k;
      if (k >= 1) S.anim = null;
    }
    S.el = Math.max(-89, Math.min(30, S.el));
    cam.fov = Math.min(S.fov, 100); cam.updateProjectionMatrix();
    uvVec(0.5 + S.d / 360, 0.5 + S.el / 180, fwd);
    cam.position.copy(fwd).multiplyScalar(-camOff(S.fov) * R);
    cam.lookAt(cam.position.clone().add(fwd)); cam.updateMatrixWorld();
    requestAnimationFrame(frame);
    // popup đang mở: vẽ thưa lại cho đỡ tốn pin
    if (pop.classList.contains('on') && !S.anim && (++skip % 4)) return;
    fadeSigns(now);
    renderer.render(scene3, cam);
    placePins(); placeZones(); drawFX(now); drawFan(); drawCompass();
  }
  let skip = 0;
  function resize() {
    W = view.clientWidth; H = view.clientHeight; dpr = Math.min(devicePixelRatio || 1, phone() ? 1.5 : 2);
    renderer.setPixelRatio(dpr); renderer.setSize(W, H, false);
    fx.width = W * dpr; fx.height = H * dpr; cam.aspect = W / H;
  }
  addEventListener('resize', () => { resize(); if (S.sc) placeSigns(S.sc); });

  // ---------- điều khiển ----------
  const FOV = [25, 120];
  const clampF = f => Math.max(FOV[0], Math.min(FOV[1], f));
  const sceneFov = sc => clampF(sc.fov + (portrait() ? 16 : innerHeight < 521 ? 4 : 0));
  function flyTo(d, el, ms = 1100, fov = S.fov) {
    S.anim = { t0: performance.now(), ms: reduce ? 1 : ms, d0: S.d, dd: wrap(d - S.d), e0: S.el, e1: el, f0: S.fov, f1: clampF(fov) };
  }
  function flyGeo(lon, lat, ms, fov) {
    const a = geoAE(S.sc, lon, lat);
    flyTo(a.az - S.sc.yaw, Math.max(-82, Math.min(-6, a.el + (small() ? 10 : 6))), ms, fov);
  }
  function used() { if (S.moved) return; S.moved = true; hint.classList.add('gone'); }

  const ptrs = new Map(); let pinch0 = 0, fov0 = 0, moved = 0;
  view.addEventListener('pointerdown', e => {
    if (e.target.closest('.pin, .zl')) return;
    view.setPointerCapture(e.pointerId); ptrs.set(e.pointerId, [e.clientX, e.clientY]); moved = 0;
    view.classList.add('drag'); S.anim = null; tip.classList.remove('on'); stopTour();
    if (ptrs.size === 2) { const [a, b] = [...ptrs.values()]; pinch0 = Math.hypot(a[0] - b[0], a[1] - b[1]); fov0 = S.fov; }
  });
  view.addEventListener('pointermove', e => {
    const r = view.getBoundingClientRect(), mx = e.clientX - r.left, my = e.clientY - r.top;
    if (!ptrs.has(e.pointerId)) { if (e.pointerType === 'mouse') hover(mx, my); return; }
    const p = ptrs.get(e.pointerId), dx = e.clientX - p[0], dy = e.clientY - p[1];
    ptrs.set(e.pointerId, [e.clientX, e.clientY]); moved += Math.abs(dx) + Math.abs(dy);
    if (moved > 6) used();
    if (ptrs.size === 2) { const [a, b] = [...ptrs.values()]; S.fov = clampF(fov0 * pinch0 / Math.hypot(a[0] - b[0], a[1] - b[1])); return; }
    const k = Math.min(S.fov, 100) / H * (1 + camOff(S.fov) * 1.4); S.d -= dx * k; S.el += dy * k;
  });
  const up = e => { ptrs.delete(e.pointerId); if (!ptrs.size) view.classList.remove('drag'); };
  view.addEventListener('pointerup', e => {
    const r = view.getBoundingClientRect();
    if (moved < 6 && ptrs.size === 1) click(e.clientX - r.left, e.clientY - r.top);
    up(e);
  });
  view.addEventListener('pointercancel', up);
  view.addEventListener('pointerleave', () => { if (!ptrs.size) { S.hoverZone = null; tip.classList.remove('on'); } });
  view.addEventListener('wheel', e => { e.preventDefault(); S.anim = null; stopTour(); S.fov = clampF(S.fov + e.deltaY * 0.05); used(); }, { passive: false });
  view.addEventListener('keydown', e => {
    const st = e.shiftKey ? 20 : 8, m = { ArrowLeft: [-st, 0], ArrowRight: [st, 0], ArrowUp: [0, st], ArrowDown: [0, -st] }[e.key];
    if (m) { e.preventDefault(); stopTour(); flyTo(S.d + m[0], S.el + m[1], 260); used(); }
    else if (e.key === '+' || e.key === '=') flyTo(S.d, S.el, 260, S.fov - 8);
    else if (e.key === '-') flyTo(S.d, S.el, 260, S.fov + 8);
  });
  $('#zin').addEventListener('click', () => flyTo(S.d, S.el, 320, S.fov - 12));
  $('#zout').addEventListener('click', () => flyTo(S.d, S.el, 320, S.fov + 12));
  $('#full').addEventListener('click', () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen();
  });
  if (!document.fullscreenEnabled) $('#full').hidden = true;

  function hit(x, y) {
    for (const o of zonePaths) if (o.full && ctx.isPointInPath(o.p, x * dpr, y * dpr)) return o.z.id;
    return null;
  }
  function hover(x, y) {
    const z = polys && hit(x, y); S.hoverZone = z || null; view.style.cursor = z ? 'pointer' : '';
    if (z) { tip.innerHTML = `<b>Khu ${z}</b> · ${C.zones[z].ha} ha`; tip.style.transform = `translate(${x + 14}px,${y + 16}px)`; tip.classList.add('on'); }
    else tip.classList.remove('on');
  }
  function click(x, y) { const z = polys && hit(x, y); if (z) openZone(z); }

  // ---------- popup ----------
  let lastFocus = null;
  const bg = [view, $('#nav'), $('.top'), $('.ctrl'), $('.dock'), mini];
  function openPop(html, photo, label) {
    if (pop.hidden) lastFocus = document.activeElement;
    popIn.className = 'pop-in' + (photo ? '' : ' np'); pop.classList.toggle('narrow', !photo);
    popIn.innerHTML = html; pop.hidden = false; scrim.hidden = false;
    document.documentElement.classList.add('pop-open'); // thanh menu lùi lên để không che popup
    bg.forEach(el => { if (el) el.inert = true; });
    pop.setAttribute('aria-label', label);
    const sc = pop.querySelector('.pop-b'); if (sc) sc.scrollTop = 0; popIn.scrollTop = 0;
    requestAnimationFrame(() => { pop.classList.add('on'); scrim.classList.add('on'); });
    $('#pop-x').focus({ preventScroll: true, focusVisible: false });
    tip.classList.remove('on'); used();
  }
  function closePop() {
    pop.classList.remove('on'); scrim.classList.remove('on'); S.selZone = null; markMini(null);
    document.documentElement.classList.remove('pop-open');
    bg.forEach(el => { if (el) el.inert = false; });
    items.forEach(i => i.el.classList.remove('sel'));
    setTimeout(() => { if (!pop.classList.contains('on')) { pop.hidden = true; scrim.hidden = true; } }, 300);
    history.replaceState(null, '', location.pathname + location.search);
    if (lastFocus && document.contains(lastFocus)) lastFocus.focus({ preventScroll: true });
  }
  $('#pop-x').addEventListener('click', closePop);
  scrim.addEventListener('click', closePop);
  addEventListener('keydown', e => {
    if (pop.hidden) return;
    if (e.key === 'Escape') closePop();
    if (e.key === 'Tab') { // giữ tiêu điểm trong popup
      const f = [...pop.querySelectorAll('button, a[href], [tabindex="0"]')]; if (!f.length) return;
      const i = f.indexOf(document.activeElement);
      if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
    }
  });
  const sec = (h, body) => `<div class="sec"><h3>${h}</h3>${body}</div>`;
  const list = a => `<ul>${a.map(x => `<li>${x}</li>`).join('')}</ul>`;

  function openItem(it, fly) {
    const k = C.kinds[it.kind];
    items.forEach(i => i.el.classList.toggle('sel', i === it)); S.selZone = null;
    openPop(`
      ${k.photo ? `<div class="pop-ph"><img src="${k.photo}" alt="${k.photoAlt}" width="720" height="720"></div>` : ''}
      <div class="pop-b">
        <p class="kick">${k.kicker}</p>
        <h2 id="pop-title">${it.label}</h2>
        <p class="sub">${it.sub}${it.live ? '<span class="live"><i></i>Đang hoạt động</span>' : ''}</p>
        ${sec('Thiết bị', list(k.device))}
        ${sec('Công năng', `<p>${k.does}</p>`)}
        ${sec('Vì sao có', `<p>${k.why}</p>`)}
        ${k.approx ? '<p class="note">Vị trí trên ảnh là gần đúng, theo sơ đồ trên Dashboard quản lý vườn.</p>' : ''}
      </div>`, k.photo, it.label);
    if (fly) flyGeo(it.lon, it.lat);
    history.replaceState(null, '', '#' + it.id);
  }
  function openZone(id, fly) {
    const z = C.zones[id];
    S.selZone = id; markMini(id);
    items.forEach(i => i.el.classList.remove('sel'));
    const inZ = items.filter(i => i.zone === id), n = k => inZ.filter(i => i.kind === k).length;
    const dev = [n('soil') && `${n('soil')} điểm đo đất`, n('camera') && `${n('camera')} camera`, n('center') && 'Trạm trung tâm', n('water') && `${n('water')} điểm đo nước`].filter(Boolean);
    openPop(`
      <div class="pop-b">
        <p class="kick">Khu trong vườn</p>
        <h2 id="pop-title">Khu ${id}</h2>
        <p class="big">${z.ha}<span>ha</span></p>
        ${sec('Vị trí', `<p>${z.text}</p>`)}
        ${dev.length ? sec('Thiết bị đang chạy trong khu', list(dev)) : ''}
        <p class="note">Ranh khu theo bản vẽ CAD tháng 10/2026, diện tích có thể lệch vài phần trăm. Cà phê Robusta, trồng xong tháng 7/2026.</p>
      </div>`, null, `Khu ${id}`);
    if (fly && polys) { const zc = polys.zones.find(q => q.id === id).c; flyGeo(zc[0], zc[1]); }
    history.replaceState(null, '', '#khu-' + id);
  }

  // ---------- cảnh: thẻ có ảnh xem trước ----------
  const scenesEl = $('#scenes');
  C.scenes.forEach(sc => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'sc'; b.dataset.id = sc.id;
    b.innerHTML = `<span class="th"><img src="${sc.thumb}" alt="" width="320" height="180" decoding="async">${sc.illus ? '<span class="tag3">Minh hoạ</span>' : ''}</span><span class="tx"><b><span class="lgx">${sc.label}</span><span class="shx">${sc.short}</span></b><small>${sc.date}</small></span>`;
    b.setAttribute('aria-label', sc.illus ? `${sc.label}, phối cảnh minh hoạ theo quy hoạch` : `${sc.label}, ảnh ngày ${sc.date}`);
    b.addEventListener('click', () => { stopTour(); used(); setScene(sc.id); });
    scenesEl.appendChild(b);
  });
  let switching = 0;
  // mở cảnh: nhìn về giữa vườn, góc nhìn rộng
  function aimGarden(ms) {
    const a = geoAE(S.sc, GC[0], GC[1]);
    const d = a.az - S.sc.yaw, el = Math.max(-62, a.el + S.sc.tilt[portrait() ? 1 : 0]), f = sceneFov(S.sc);
    if (ms) flyTo(d, el, ms, f); else { S.d = d; S.el = el; S.fov = f; }
  }
  async function setScene(id, first) {
    const sc = C.scenes.find(s => s.id === id) || C.scenes[0];
    if (S.sc && S.sc.id === sc.id) return;
    const my = ++switching;
    [...scenesEl.children].forEach(b => b.setAttribute('aria-pressed', b.dataset.id === sc.id ? 'true' : 'false'));
    const tex = hiReady[sc.id] || await loadTex(sc); if (my !== switching) return;
    const prev = S.sc;
    if (!first && !reduce) {
      matB.map = tex; matB.needsUpdate = true; matB.opacity = 0;
      const t0 = performance.now();
      await new Promise(r => { const step = n => { const k = ease((n - t0) / 700); matB.opacity = k; k < 1 ? requestAnimationFrame(step) : r(); }; requestAnimationFrame(step); });
    }
    matA.map = tex; matA.needsUpdate = true; matB.opacity = 0;
    S.sc = sc;
    if (prev) S.d = wrap(S.d + prev.yaw - sc.yaw); // giữ hướng la bàn khi đổi ảnh
    polys = buildPolys(sc);
    items.forEach(it => { it.dir = sc.devices ? geoDir(sc, it.lon, it.lat) : null; });
    aimGarden(first ? 0 : 1400);
    S.introAt = performance.now() - (first ? 0 : 200);
    placeSigns(sc);
    subEl.textContent = sc.sub; metaEl.textContent = sc.meta; dateEl.textContent = sc.illus ? 'Phối cảnh 3D' : sc.date; illusEl.hidden = !sc.illus;
    if (!pop.hidden && !sc.devices && !S.selZone) closePop();
    drawMini();
    // thay bằng ảnh nét khi tải xong, không làm gián đoạn người xem
    if (!hiReady[sc.id]) hiRes(sc).then(t => { hiReady[sc.id] = t; if (S.sc === sc) { matA.map = t; matA.needsUpdate = true; } }).catch(() => {});
  }
  const hiReady = {};

  // ---------- bản đồ nhỏ ----------
  const svg = $('#mini-svg'), NS = 'http://www.w3.org/2000/svg';
  let mm = null;
  function miniInit() {
    svg.innerHTML = '<defs><radialGradient id="fanG" cx="0" cy="0" r="1" gradientUnits="objectBoundingBox"><stop offset="0" stop-color="#B5E383" stop-opacity=".5"/><stop offset="1" stop-color="#B5E383" stop-opacity=".05"/></radialGradient></defs>';
    let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
    D.boundary.forEach(([x, y]) => { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); });
    const mx = D.local ? 1 : Math.cos((y0 + y1) / 2 * RAD), w = (x1 - x0) * mx, h = y1 - y0, s = Math.min(184 / w, 124 / h);
    const ox = (200 - w * s) / 2, oy = (140 - h * s) / 2;
    mm = { P: ([x, y]) => [ox + (x - x0) * mx * s, oy + (y1 - y) * s] };
    const d = r => 'M' + r.map(p => mm.P(p).map(v => v.toFixed(1)).join(',')).join('L') + 'Z';
    mm.fan = document.createElementNS(NS, 'path'); mm.fan.setAttribute('class', 'fan'); svg.appendChild(mm.fan);
    D.zones.forEach(z => {
      const p = document.createElementNS(NS, 'path'); p.setAttribute('d', d(z.ring)); p.setAttribute('class', 'mz'); p.dataset.z = z.id;
      p.style.setProperty('--c', C.zones[z.id].rgb);
      p.setAttribute('tabindex', '0'); p.setAttribute('role', 'button'); p.setAttribute('aria-label', `Khu ${z.id}`);
      const go = () => { stopTour(); openZone(z.id, true); };
      p.addEventListener('click', go); p.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
      svg.appendChild(p);
    });
    D.zones.forEach(z => {
      const c = mm.P(centroid(z.ring)), t = document.createElementNS(NS, 'text');
      t.setAttribute('x', c[0]); t.setAttribute('y', c[1] + 3); t.setAttribute('text-anchor', 'middle'); t.setAttribute('class', 'mt'); t.textContent = z.id;
      svg.appendChild(t);
    });
    const l = document.createElementNS(NS, 'path'); l.setAttribute('d', d(D.lake)); l.setAttribute('class', 'ml'); svg.appendChild(l);
    mm.me = document.createElementNS(NS, 'circle'); mm.me.setAttribute('r', '3.2'); mm.me.setAttribute('class', 'me'); svg.appendChild(mm.me);
  }
  function drawMini() { if (!mm || !S.sc) return; const [x, y] = mm.P([S.sc.lon, S.sc.lat]); mm.me.setAttribute('cx', x); mm.me.setAttribute('cy', y); mm.pos = [x, y]; }
  function drawFan() {
    if (!mm || !mm.pos || !S.sc) return;
    const az = (S.d + S.sc.yaw) * RAD, half = Math.min(1.4, Math.atan(Math.tan(Math.min(S.fov, 100) * RAD / 2) * (W / H)) * (1 + camOff(S.fov)));
    const r = 80, [x, y] = mm.pos, a = az - half, b = az + half;
    mm.fan.setAttribute('d', `M${x},${y}L${x + r * Math.sin(a)},${y - r * Math.cos(a)}A${r},${r} 0 0 1 ${x + r * Math.sin(b)},${y - r * Math.cos(b)}Z`);
  }
  function markMini(id) { svg.querySelectorAll('.mz').forEach(p => p.classList.toggle('on', p.dataset.z === id)); }

  // ---------- tự xem ----------
  function startTour() {
    if (!pop.hidden) closePop();
    let i = 0;
    tourBtn.setAttribute('aria-pressed', 'true'); tourBtn.querySelector('use').setAttribute('href', '#i-pause'); tourBtn.querySelector('span').textContent = 'Dừng';
    const step = () => {
      const s = C.tour[i % C.tour.length]; i++;
      if (s.target.startsWith('khu-')) {
        const id = s.target.slice(4), zc = polys.zones.find(q => q.id === id).c;
        S.selZone = id; markMini(id); items.forEach(x => x.el.classList.remove('sel'));
        flyGeo(zc[0], zc[1], 2400, small() ? 92 : 78);
      } else {
        const it = items.find(x => x.id === s.target);
        S.selZone = null; markMini(null); items.forEach(x => x.el.classList.toggle('sel', x === it));
        flyGeo(it.lon, it.lat, 2400, small() ? 84 : 66);
      }
      caption.textContent = s.text; caption.classList.add('on');
    };
    const go = () => { if (S.tour !== -1) return; step(); S.tour = setInterval(step, 5600); };
    S.tour = -1;
    if (S.sc.id !== C.defaultScene) setScene(C.defaultScene).then(() => setTimeout(go, 1500)); else go();
  }
  function stopTour() {
    if (!S.tour) return;
    if (S.tour !== -1) clearInterval(S.tour);
    S.tour = null; caption.classList.remove('on');
    tourBtn.setAttribute('aria-pressed', 'false'); tourBtn.querySelector('use').setAttribute('href', '#i-play'); tourBtn.querySelector('span').textContent = 'Tự xem';
    if (pop.hidden) { S.selZone = null; markMini(null); items.forEach(x => x.el.classList.remove('sel')); }
  }
  tourBtn.addEventListener('click', () => { used(); S.tour ? stopTour() : startTour(); });

  // ---------- khởi động ----------
  cmp.width = 392; cmp.height = 80;
  miniInit(); resize();
  setScene(C.defaultScene, true).then(() => {
    const h = decodeURIComponent(location.hash.slice(1));
    const it = items.find(i => i.id === h);
    if (it) openItem(it, true); else if (h.startsWith('khu-') && C.zones[h.slice(4)]) openZone(h.slice(4), true);
    S.introAt = performance.now() + 500; // ranh khu vẽ dần ngay khi màn chờ kéo lên
    requestAnimationFrame(frame);
    if (window.fbReady) window.fbReady();
    // tải sẵn bản nhỏ của các cảnh khác khi rảnh, để đổi cảnh tức thì
    const idle = window.requestIdleCallback || (f => setTimeout(f, 1200));
    idle(() => C.scenes.forEach(x => loadTex(x).catch(() => {})));
    setTimeout(used, 9000);
    C.openZone = openZone; C.setScene = setScene; C.openItem = id => openItem(items.find(i => i.id === id)); C.S = S; // để kiểm thử
  });
})();
