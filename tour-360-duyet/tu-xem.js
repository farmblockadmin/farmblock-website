/* Tự xem kiểu bảo tàng: chọn một hành trình. Ở mỗi điểm dừng máy quay bay tới, cảnh tối dần quanh chỗ cần xem,
   hiệu ứng vẽ thẳng trên ảnh 360 (sóng nước, dòng nước, dữ liệu, góc camera, công trình dự kiến...),
   rồi chú thích nổi hiện ra với ảnh/video tự chiếu, số liệu tự đếm, lớp "vì sao" và giọng đọc.
   Toàn bộ nội dung là dữ liệu trong tu-xem-noi-dung.js (hành trình tự gom từ danh sách hạng mục);
   giọng đọc ở tu-xem/vo/<id>.mp3, thời lượng trong tu-xem/vo/vo.js. Cần app.js đưa ra C.api. */
(() => {
  'use strict';
  const C = window.FB360, T = window.FB360_TUXEM;
  if (!C || !T) return;
  const VO = (window.FB360_VO && window.FB360_VO.d) || {}, VOV = (window.FB360_VO && window.FB360_VO.v) || '';
  const ST = T.trangThai || {}, QH = T.quyHoach || [];
  // gom hành trình từ danh sách hạng mục: mục nào ghi tên hành trình trong hanhTrinh thì vào, xếp theo số thứ tự
  Object.entries(T.tours).forEach(([id, t]) => {
    if (t.sapCo) { t.stops = []; return; }
    t.stops = (T.hangMuc || []).filter(m => m.hanhTrinh && m.hanhTrinh[id] != null).map(m => {
      const v = m.hanhTrinh[id];
      return typeof v === 'object' ? Object.assign({}, m, v, { _o: v.thuTu || 0 }) : Object.assign({}, m, { _o: v });
    }).sort((a, b) => a._o - b._o);
  });
  const MAIN = Object.keys(T.tours).filter(k => !T.tours[k].sapCo && !T.tours[k].nho && T.tours[k].stops.length);
  const $ = (s, r = document) => r.querySelector(s);
  const h = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const ICON = {
    play: '<svg viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5z" fill="currentColor"/></svg>',
    pause: '<svg viewBox="0 0 24 24"><path d="M7 5h3.6v14H7zM13.4 5H17v14h-3.6z" fill="currentColor"/></svg>',
    prev: '<svg viewBox="0 0 24 24"><path d="M15.5 5.5 8.5 12l7 6.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    next: '<svg viewBox="0 0 24 24"><path d="M8.5 5.5 15.5 12l-7 6.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    x: '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>',
    snd: '<svg viewBox="0 0 24 24"><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor"/><path d="M15.5 9a4.2 4.2 0 0 1 0 6M18 6.5a7.7 7.7 0 0 1 0 11" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    mute: '<svg viewBox="0 0 24 24"><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor"/><path d="m16 9.5 5 5m0-5-5 5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    arrow: '<svg viewBox="0 0 24 24"><path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  };
  // chữ thẻ: thoát HTML, rồi biến [cần xác nhận: ...] thành nhãn vàng cho người duyệt
  const rich = s => esc(s).replace(/\[cần xác nhận(?::\s*([^\]]*))?\]/gi, (m, d) => `<mark class="tx-cx">Cần xác nhận${d ? ': ' + d : ''}</mark>`);
  const fmtN = (v, dec, dot) => { const s = v.toFixed(dec).replace('.', ','); return dot ? s.replace(/\B(?=(\d{3})+(?!\d))/g, '.') : s; };

  // ---------- DOM ----------
  const root = h('div', 'txm'); root.id = 'txm';
  root.innerHTML = `
    <div class="tx-lb tx-lb-t" aria-hidden="true"></div><div class="tx-lb tx-lb-b" aria-hidden="true"></div>
    <section class="tx-pick" id="tx-pick" role="dialog" aria-modal="true" aria-labelledby="tx-pick-h" hidden>
      <div class="tx-pick-in">
        <button type="button" class="tx-close" id="tx-pick-x" aria-label="Đóng">${ICON.x}</button>
        <p class="tx-eyebrow"><i></i>Tự xem</p>
        <h2 id="tx-pick-h">Chọn một hành trình qua vườn Ia Ko</h2>
        <p class="tx-pick-sub">Ngồi yên, máy quay và giọng đọc sẽ đưa bạn đi qua từng điểm, như đi cùng một hướng dẫn viên. Kéo ảnh bất cứ lúc nào để tạm dừng.</p>
        <div class="tx-cards" id="tx-cards"></div>
        <div class="tx-more" id="tx-more"></div>
        <div class="tx-opts">
          <p class="tx-legend">${Object.entries(ST).map(([k, v]) => `<span class="tx-tt tx-tt-${k}" style="--st:${v.rgb}">${esc(v.ten)}</span>`).join('')}<small>Nét đứt trên ảnh là công trình dự kiến, chưa có thật.</small></p>
          <label class="tx-sw"><input type="checkbox" id="tx-loop"><i></i><span>Chạy lặp liên tục<small>Cho TV: hết hành trình này tự sang hành trình kia</small></span></label>
        </div>
      </div>
    </section>
    <div class="tx-title" id="tx-title" aria-live="polite" hidden></div>
    <div class="tx-call" id="tx-call" aria-hidden="true"></div>
    <aside class="tx-card" id="tx-card" aria-live="polite" hidden>
      <div class="tx-media" id="tx-media"><div class="tx-cap" id="tx-cap"></div><div class="tx-dots" id="tx-dots"></div></div>
      <div class="tx-body" id="tx-body"></div>
    </aside>
    <div class="tx-bar" id="tx-bar" role="group" aria-label="Điều khiển hành trình" hidden>
      <button type="button" class="tx-b" id="tx-prev" aria-label="Điểm trước">${ICON.prev}</button>
      <button type="button" class="tx-b tx-pp" id="tx-pp" aria-label="Tạm dừng">${ICON.pause}</button>
      <button type="button" class="tx-b" id="tx-next" aria-label="Điểm tiếp">${ICON.next}</button>
      <div class="tx-prog"><p class="tx-now" id="tx-now"></p><div class="tx-segs" id="tx-segs"></div></div>
      <button type="button" class="tx-b tx-snd" id="tx-snd" aria-label="Tắt giọng đọc">${ICON.snd}</button>
      <button type="button" class="tx-b tx-exit" id="tx-exit" aria-label="Thoát Tự xem">${ICON.x}<span>Thoát</span></button>
    </div>`;
  document.body.appendChild(root);
  const pick = $('#tx-pick'), cards = $('#tx-cards'), titleEl = $('#tx-title'), card = $('#tx-card'), mediaEl = $('#tx-media'), capEl = $('#tx-cap'), dotsEl = $('#tx-dots'),
    body = $('#tx-body'), bar = $('#tx-bar'), segsEl = $('#tx-segs'), nowEl = $('#tx-now'), ppBtn = $('#tx-pp'), call = $('#tx-call'), loopEl = $('#tx-loop'), more = $('#tx-more'), sndBtn = $('#tx-snd');

  const mins = t => Math.max(1, Math.round((t.stops.reduce((n, s) => n + dwellOf(s) + 2.1, 0) + 3.4) / 60));
  Object.entries(T.tours).forEach(([id, t]) => {
    if (t.sapCo || t.nho) {
      // hàng nhỏ: tour phụ chạy được, và chỗ để sẵn cho tour sắp có
      const b = h('button', 'tx-mc' + (t.sapCo ? ' soon' : '')); b.type = 'button'; b.dataset.id = id;
      if (t.sapCo) { b.disabled = true; b.setAttribute('aria-disabled', 'true'); }
      b.innerHTML = `<small>${esc(t.kicker)}</small><b>${esc(t.title)}</b><span>${esc(t.sub)}</span>
        <em>${t.sapCo ? 'Sắp có' : `${t.stops.filter(s => s.kieu !== 'chuong').length} hạng mục · khoảng ${mins(t)} phút <i>${ICON.arrow}</i>`}</em>`;
      if (!t.sapCo) b.addEventListener('click', () => start(id));
      more.appendChild(b); return;
    }
    const b = h('button', 'tx-tc'); b.type = 'button'; b.dataset.id = id; b.style.setProperty('--tc', t.tint);
    b.innerHTML = `<span class="tx-tc-img"><img src="${t.cover}" alt="" loading="lazy" decoding="async"></span>
      <span class="tx-tc-t"><small>${esc(t.kicker)}</small><b>${esc(t.title)}</b><span>${esc(t.sub)}</span>
      <em>${t.stops.filter(s => s.kieu !== 'chuong').length} điểm dừng · khoảng ${mins(t)} phút <i>${ICON.arrow}</i></em></span>`;
    b.addEventListener('click', () => start(id));
    cards.appendChild(b);
  });
  // thời gian dừng: theo giọng đọc nếu có, không thì theo độ dài chữ
  function dwellOf(s) {
    if (VO[s.id]) return Math.max(s.kieu === 'chuong' ? 5 : 8, VO[s.id] + 1.6);
    if (s.kieu === 'chuong') return 5.5;
    return Math.min(24, Math.max(10.5, 4 + ((s.text || '').length + (s.lead || '').length + (s.viSao || '').length) * 0.05 + (s.timeline ? 2 : 0)));
  }

  // ---------- trạng thái ----------
  const X = { layout: 'noi', sound: true, loop: false, cx: 0, cy: 0, active: false, playing: false, tour: null, tid: '', i: -1, clock: 0, last: 0, stopAt: 0, cardAt: 0, dwell: 0, fly: 0, fxAt: 0, slides: [], cur: -1, scene: '0713', busy: false, ended: false };
  const api = () => C.api;
  let lastFocus = null;
  // lựa chọn của người xem: nhớ trên máy này (không có cũng chạy bình thường)
  const store = { get(k) { try { return localStorage.getItem('fb360-' + k); } catch (e) { return null; } }, set(k, v) { try { localStorage.setItem('fb360-' + k, v); } catch (e) { /* bỏ qua */ } } };
  // Zyk chốt 26/11: chỉ dùng chú thích nổi (điện thoại, màn thấp vẫn tự chuyển sang tấm thẻ)
  X.loop = store.get('lap') === '1';
  X.sound = store.get('tieng') !== '0';
  loopEl.checked = X.loop;
  loopEl.addEventListener('change', () => { X.loop = loopEl.checked; store.set('lap', X.loop ? '1' : '0'); });
  // chú thích nổi chỉ dùng khi màn đủ rộng; điện thoại dọc và xoay ngang giữ tấm thẻ
  const noi = () => X.layout === 'noi' && !api().portrait() && innerHeight >= 521 && innerWidth >= 900;
  function applyLayout() {
    const on = X.active && noi();
    document.documentElement.classList.toggle('tx-noi', on);
    if (on && mediaEl.parentNode !== call) call.appendChild(mediaEl);
    if (!on && mediaEl.parentNode !== card) card.insertBefore(mediaEl, body);
  }
  addEventListener('resize', () => { if (X.active) applyLayout(); });
  // TV: ẩn chuột và thanh điều khiển khi không ai động vào
  let idleT = 0;
  const wake = () => { document.documentElement.classList.remove('tx-idle'); clearTimeout(idleT); if (X.active && X.loop) idleT = setTimeout(() => document.documentElement.classList.add('tx-idle'), 3500); };
  ['pointermove', 'pointerdown', 'keydown'].forEach(ev => addEventListener(ev, wake, { passive: true }));

  // ---------- giọng đọc ----------
  const vo = new Audio(); vo.preload = 'auto';
  let voFor = '';
  const showSnd = () => { sndBtn.innerHTML = X.sound ? ICON.snd : ICON.mute; sndBtn.setAttribute('aria-label', X.sound ? 'Tắt giọng đọc' : 'Bật giọng đọc'); sndBtn.classList.toggle('off', !X.sound); };
  showSnd();
  sndBtn.addEventListener('click', () => {
    X.sound = !X.sound; store.set('tieng', X.sound ? '1' : '0'); showSnd();
    if (!X.sound) vo.pause(); else if (voFor && X.playing) { const p = vo.play(); if (p) p.catch(() => {}); }
  });
  const voSrc = id => `tu-xem/vo/${id}.mp3${VOV ? '?v=' + VOV : ''}`;
  function playVo(s) {
    vo.pause(); voFor = '';
    if (!VO[s.id]) return;
    voFor = s.id; vo.src = voSrc(s.id); vo.currentTime = 0;
    if (X.sound && X.playing) { const p = vo.play(); if (p) p.catch(() => {}); }
  }
  const stopVo = () => { vo.pause(); voFor = ''; };
  // tải trước giọng của điểm kế tiếp cho khỏi trễ
  const voNext = new Audio(); voNext.preload = 'auto';

  function open() {
    if (!api()) return;
    if (X.active) stop(true);
    lastFocus = document.activeElement;
    pick.hidden = false; requestAnimationFrame(() => pick.classList.add('on'));
    document.documentElement.classList.add('tx-picking');
    setTimeout(() => cards.firstElementChild && cards.firstElementChild.focus({ preventScroll: true }), 60);
  }
  function closePick() {
    pick.classList.remove('on'); document.documentElement.classList.remove('tx-picking');
    setTimeout(() => { if (!pick.classList.contains('on')) pick.hidden = true; }, 350);
  }
  $('#tx-pick-x').addEventListener('click', () => { closePick(); if (lastFocus) lastFocus.focus({ preventScroll: true }); });
  pick.addEventListener('click', e => { if (e.target === pick) closePick(); });

  async function start(id) {
    closePick();
    const A = api(); A.closePop(); A.used();
    stopVo();
    X.tour = T.tours[id]; X.tid = id; X.active = true; X.playing = true; X.ended = false; X.i = -1; X.clock = 0; X.last = performance.now();
    document.documentElement.classList.add('tx-on'); document.documentElement.style.setProperty('--tx', X.tour.tint);
    if (outroEl) { outroEl.classList.remove('on'); outroEl.hidden = true; }
    applyLayout(); wake();
    bar.hidden = false; requestAnimationFrame(() => bar.classList.add('on'));
    nowEl.innerHTML = `<span>${esc(X.tour.kicker)}</span>`;
    segsEl.innerHTML = X.tour.stops.map((s, i) => `<button type="button" class="tx-seg${s.kieu === 'chuong' ? ' ch' : ''}${s.trangThai === 'du-kien' ? ' dk' : ''}" data-i="${i}" aria-label="Điểm ${i + 1}: ${esc(s.title)}"><i></i></button>`).join('');
    segsEl.querySelectorAll('.tx-seg').forEach(b => b.addEventListener('click', () => go(+b.dataset.i)));
    setPP(true);
    // màn tiêu đề như mở màn một buổi diễn
    titleEl.innerHTML = `<p class="tx-eyebrow"><i></i>${esc(X.tour.kicker)}</p><h2>${esc(X.tour.title)}</h2><p>${esc(X.tour.sub)}</p><span class="tx-tl"><i></i></span>`;
    titleEl.hidden = false; requestAnimationFrame(() => titleEl.classList.add('on'));
    X.titleUntil = X.clock + (A.reduce ? 1.6 : 3.4);
    const first = X.tour.stops.find(s => s.scene);
    X.scene = first && first === X.tour.stops[0] ? first.scene : '0713';
    titleEl.classList.remove('chuong');
    await A.setScene(X.scene);
    const g = A.gc(); A.aim(g[0], g[1], 3200, A.portrait() ? 112 : 100, 0, 2);
  }
  function stop(silent) {
    if (!X.active) return;
    X.active = false; X.playing = false; X.tour = null; stopVo();
    document.documentElement.classList.remove('tx-on', 'tx-paused', 'tx-ended');
    hideCard(); titleEl.classList.remove('on'); bar.classList.remove('on'); clearTimeout(X.loopT); clearTimeout(idleT);
    if (outroEl) outroEl.classList.remove('on');
    document.documentElement.classList.remove('tx-noi', 'tx-idle');
    setTimeout(() => { if (!X.active) { titleEl.hidden = true; bar.hidden = true; card.hidden = true; if (outroEl) outroEl.hidden = true; } }, 450);
    const A = api(); A.S.selZone = null; A.markMini(null); A.items.forEach(x => x.el.classList.remove('sel', 'txf'));
    if (!silent && lastFocus && document.contains(lastFocus)) lastFocus.focus({ preventScroll: true });
  }

  // ---------- điểm dừng ----------
  function resolve(at) {
    const A = api();
    if (!at || at === 'vuon') return A.gc();
    if (at.startsWith('khu-')) return A.zoneC(at.slice(4));
    const q = QH.find(o => o.id === at); if (q) return qhC(A, q);
    const it = A.items.find(x => x.id === at); return it ? [it.lon, it.lat] : A.gc();
  }
  async function go(i) {
    const A = api(); if (!X.active || X.busy) return;
    if (i >= X.tour.stops.length) return outro();
    if (i < 0) i = 0;
    X.busy = true; X.ended = false; X.i = i; titleEl.classList.remove('on'); document.documentElement.classList.remove('tx-ended');
    const s = X.tour.stops[i];
    hideCard(); stopVo(); outroEl && outroEl.classList.remove('on');
    const sc = s.scene || (X.scene === '0408' ? '0713' : X.scene);
    const switching = sc !== (A.S.sc && A.S.sc.id);
    X.scene = sc;
    if (switching) await A.setScene(sc);
    // đánh dấu điểm đang xem trên ảnh và sơ đồ nhỏ
    A.items.forEach(x => x.el.classList.toggle('sel', x.id === s.at));
    // chỉ hiện thiết bị liên quan tới điều đang kể, còn lại ẩn đi cho đỡ rối
    const kinds = new Set(); (s.fx || []).forEach(f => { if (f.t === 'pings') [].concat(f.kind).forEach(k => kinds.add(k)); if (f.t === 'links') f.kinds.forEach(k => kinds.add(k)); if (f.t === 'cones') kinds.add('camera'); });
    A.items.forEach(x => x.el.classList.toggle('txf', kinds.has('all') || kinds.has(x.kind) || x.id === (s.fx || []).map(f => f.to).find(Boolean)));
    const zid = s.at && s.at.startsWith('khu-') ? s.at.slice(4) : null; A.S.selZone = zid; A.markMini(zid);
    X.fly = A.reduce ? 0.2 : switching ? 2.6 : 2.9;
    aimStop(s, X.fly * 1000);
    X.stopAt = X.clock; X.fxAt = X.clock + X.fly * 0.55; X.cardAt = X.clock + X.fly * 0.72; X.dwell = dwellOf(s); X.cardShown = false;
    if (s.kieu !== 'chuong') buildCard(s, i);
    preload(X.tour.stops[i + 1]);
    segsEl.querySelectorAll('.tx-seg').forEach((b, k) => { b.classList.toggle('done', k < i); b.classList.toggle('cur', k === i); b.style.setProperty('--p', k < i ? 1 : 0); });
    nowEl.innerHTML = `<b>${String(i + 1).padStart(2, '0')}</b><span>/ ${String(X.tour.stops.length).padStart(2, '0')}</span> ${esc(s.title)}${s.trangThai === 'du-kien' ? ' <em class="tx-now-dk">Dự kiến</em>' : ''}`;
    X.busy = false;
  }
  // khung hình: điểm cần xem nằm giữa phần ảnh còn trống, không bị thẻ che
  function aimStop(s, ms) {
    const A = api(), [lon, lat] = resolve(s.at), W = A.W, H = A.H, fov = Math.min(118, (s.fov || (s.kieu === 'chuong' ? 104 : 80)) + (A.portrait() ? 14 : 0));
    if (s.kieu === 'chuong') { A.aim(lon, lat, ms, fov, 0, 3); return; }
    const vf = Math.min(fov, 100), hf = 2 * Math.atan(Math.tan(vf * Math.PI / 360) * W / H) * 180 / Math.PI;
    let dx = 0, dy = 3;
    const r = sideW();
    if (noi()) { dx = hf * 0.07; dy = -vf * 0.06; }
    else if (A.portrait()) { const sh = Math.min(H * 0.52, 470) + 84, y = (H - sh) * 0.55; dy = -((H / 2 - y) / (H / 2)) * vf / 2 * 0.95; }
    else if (r) { const x = (W - r) / 2; dx = ((W / 2 - x) / (W / 2)) * hf / 2 * 0.9; }
    // lệch khung riêng cho từng điểm (độ): nhin: [sang phải, lên trên]
    if (s.nhin) { dx += s.nhin[0] || 0; dy += s.nhin[1] || 0; }
    A.aim(lon, lat, ms, fov, dx, dy);
  }
  const sideW = () => { const A = api(); if (A.portrait()) return 0; return innerHeight < 521 ? Math.min(A.W * 0.46, 380) + 10 : Math.min(460, Math.max(330, A.W * 0.32)) + 24; };

  // ---------- thẻ trưng bày ----------
  function buildCard(s, i) {
    X.slides.forEach(sl => { if (sl.v) { sl.v.pause(); sl.v.removeAttribute('src'); sl.v.load(); } sl.el.remove(); });
    X.slides = []; X.cur = -1; dotsEl.innerHTML = '';
    (s.media || []).forEach((m, k) => {
      const el = h('figure', 'tx-sl' + (m.phone ? ' ph' : '') + (m.fit ? ' fit' : '') + (m.so ? ' so' : '')), isV = /\.mp4$/i.test(m.src);
      let v = null;
      if (isV) { v = h('video'); v.muted = true; v.loop = true; v.playsInline = true; v.setAttribute('playsinline', ''); v.setAttribute('muted', ''); v.preload = k ? 'none' : 'auto'; v.src = m.src; v.poster = m.src.replace(/\.mp4$/i, '.webp'); el.appendChild(v); }
      else { const im = h('img'); im.alt = m.cap || ''; im.decoding = 'async'; im.src = m.src; el.appendChild(im); }
      if (m.illus) el.appendChild(h('span', 'tx-il', 'Hình minh hoạ'));
      const sl = { el, v, m, bad: false };
      const fail = () => { sl.bad = true; el.remove(); if (X.cur === X.slides.indexOf(sl)) nextSlide(); refreshDots(); };
      (v || el.firstChild).addEventListener('error', fail);
      if (v) v.addEventListener('error', fail, true);
      mediaEl.insertBefore(el, capEl); X.slides.push(sl);
    });
    mediaEl.hidden = !X.slides.length; card.classList.toggle('nomedia', !X.slides.length);
    refreshDots();
    const stats = (s.stats || []).map(([v, u]) => {
      const m = /^[\d.,]+$/.test(v) ? v : null, dot = m && /\.\d{3}/.test(v), dec = m && v.includes(',') ? v.split(',')[1].length : 0;
      const n = m ? parseFloat(v.replace(/\./g, '').replace(',', '.')) : 0;
      return `<div class="tx-st"><b class="num" ${m ? `data-n="${n}" data-dec="${dec}" data-dot="${dot ? 1 : 0}"` : ''}>${esc(m ? fmtN(0, dec, dot) : v)}</b><span>${esc(u)}</span></div>`;
    }).join('');
    const tl = s.timeline ? `<ol class="tx-tline">${s.timeline.map(([d, l], k) => `<li style="--k:${k}"><i></i><b>${esc(d)}</b><span>${esc(l)}</span></li>`).join('')}</ol>` : '';
    const st = ST[s.trangThai], no = X.tour.stops.slice(0, i + 1).filter(q => q.kieu !== 'chuong').length;
    card.classList.toggle('du-kien', s.trangThai === 'du-kien'); call.classList.toggle('du-kien', s.trangThai === 'du-kien');
    body.innerHTML = `
      <div class="tx-c tx-c1"><p class="tx-k"><span class="tx-no num">${String(no).padStart(2, '0')}</span><span>${esc(s.kicker)}</span>${st ? `<span class="tx-tt tx-tt-${s.trangThai}" style="--st:${st.rgb}">${esc(st.ten)}</span>` : ''}</p>
      <h2 class="tx-h">${esc(s.title)}</h2>
      ${s.lead ? `<p class="tx-lead">${rich(s.lead)}</p>` : ''}
      ${s.link ? `<a class="tx-link" href="${s.link[1]}" target="_blank" rel="noopener">${esc(s.link[0])}${ICON.arrow}</a>` : ''}</div>
      <div class="tx-c tx-c2">${stats ? `<div class="tx-sts">${stats}</div>` : ''}
      <p class="tx-text">${rich(s.text || '')}</p>
      ${s.viSao ? `<div class="tx-why"><b>Vì sao ở đây</b><p>${rich(s.viSao)}</p></div>` : ''}
      ${tl}</div>`;
    body.scrollTop = 0;
  }
  function refreshDots() {
    const ok = X.slides.filter(s => !s.bad);
    dotsEl.innerHTML = ok.length > 1 ? ok.map(s => `<i data-k="${X.slides.indexOf(s)}"><b></b></i>`).join('') : '';
    if (!ok.length) { mediaEl.hidden = true; card.classList.add('nomedia'); }
  }
  function showCard() {
    const s = X.tour.stops[X.i];
    playVo(s);
    if (s.kieu === 'chuong') {
      // mở chương: màn tiêu đề giữa cảnh, không thẻ
      titleEl.innerHTML = `<p class="tx-eyebrow"><i></i>${esc(s.kicker)}</p><h2>${esc(s.title)}</h2><p>${rich(s.sub || '')}</p>`;
      titleEl.classList.add('chuong'); titleEl.hidden = false; requestAnimationFrame(() => titleEl.classList.add('on'));
      X.cardShown = true; return;
    }
    card.hidden = false; card.classList.remove('out');
    X.cx = X.cy = null; X.callPick = null;
    requestAnimationFrame(() => { card.classList.add('on'); call.classList.toggle('on', noi() && X.slides.some(s => !s.bad)); });
    X.cardShown = true; X.slideAt = X.clock; X.cur = -1; nextSlide();
    // số tự đếm lên
    const t0 = performance.now(), els = [...body.querySelectorAll('[data-n]')];
    const tick = n => { const k = api().ease((n - t0) / 1400); els.forEach(e => { e.textContent = fmtN(+e.dataset.n * k, +e.dataset.dec, e.dataset.dot === '1'); }); if (k < 1 && X.active) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  }
  function hideCard() {
    if (titleEl.classList.contains('chuong')) { titleEl.classList.remove('on'); setTimeout(() => titleEl.classList.remove('chuong'), 900); }
    if (card.hidden) return;
    card.classList.remove('on'); card.classList.add('out'); call.classList.remove('on');
    X.slides.forEach(s => s.v && s.v.pause());
  }
  function slideLen() { const n = X.slides.filter(s => !s.bad).length || 1; return Math.max(3.8, (X.dwell - 0.6) / n); }
  function nextSlide() {
    const ok = X.slides.map((s, k) => [s, k]).filter(([s]) => !s.bad);
    if (!ok.length) return;
    const pos = ok.findIndex(([, k]) => k === X.cur), [sl, k] = ok[(pos + 1) % ok.length];
    X.slides.forEach((s, j) => { const on = j === k; s.el.classList.toggle('on', on); if (s.v) { if (on) { s.v.preload = 'auto'; s.v.currentTime = 0; const p = s.v.play(); if (p) p.catch(() => {}); } else s.v.pause(); } });
    X.cur = k; X.slideAt = X.clock;
    sl.el.style.setProperty('--d', slideLen() + 1 + 's'); sl.el.classList.toggle('kb2', k % 2 === 1);
    capEl.innerHTML = sl.m.cap ? `<span>${esc(sl.m.cap)}</span>` : '';
    dotsEl.querySelectorAll('i').forEach(d => d.classList.toggle('on', +d.dataset.k === k));
    const nx = X.slides[ok[(pos + 2) % ok.length][1]]; if (nx && nx.v) nx.v.preload = 'auto';
  }
  function preload(s) { if (!s) return; if (VO[s.id]) { voNext.src = voSrc(s.id); } (s.media || []).slice(0, 2).forEach(m => { if (!/\.mp4$/i.test(m.src)) { const i = new Image(); i.src = m.src; } }); }

  // ---------- kết thúc ----------
  let outroEl = null;
  function outro() {
    const A = api(), o = X.tour.outro, other = MAIN.find(k => k !== X.tid);
    hideCard(); stopVo(); X.ended = true; X.playing = false; setPP(false); document.documentElement.classList.add('tx-ended');
    segsEl.querySelectorAll('.tx-seg').forEach(b => { b.classList.add('done'); b.style.setProperty('--p', 1); });
    if (!outroEl) { outroEl = h('div', 'tx-title tx-outro'); root.appendChild(outroEl); }
    const goTo = /^#tu-xem-([\w-]+)/.exec(o.cta[1]);
    outroEl.innerHTML = `<p class="tx-eyebrow"><i></i>Hết hành trình</p><h2>${esc(o.title)}</h2><p>${esc(o.text)}</p>
      <div class="tx-acts">${goTo ? `<button type="button" class="tx-btn pri" data-go="${goTo[1]}">${esc(o.cta[0])}${ICON.arrow}</button>` : `<a class="tx-btn pri" href="${o.cta[1]}" target="_blank" rel="noopener">${esc(o.cta[0])}${ICON.arrow}</a>`}
      ${other && !(goTo && goTo[1] === other) ? `<button type="button" class="tx-btn" data-go="${other}">Xem: ${esc(T.tours[other].title)}</button>` : ''}
      <button type="button" class="tx-btn" data-free>Tự khám phá</button></div>`;
    outroEl.hidden = false; requestAnimationFrame(() => outroEl.classList.add('on'));
    // chạy lặp: nghỉ một lúc ở màn kết rồi sang hành trình kia
    if (X.loop) X.loopT = setTimeout(() => { if (X.active && X.ended) start(other || X.tid); }, 9000);
    outroEl.querySelectorAll('[data-go]').forEach(b => b.addEventListener('click', e => { outroEl.classList.remove('on'); start(e.currentTarget.dataset.go); }));
    outroEl.querySelector('[data-free]').addEventListener('click', () => stop());
    const g = A.gc(); A.aim(g[0], g[1], 3600, A.portrait() ? 118 : 112, 0, 4);
    setTimeout(() => { const f = outroEl.querySelector('.tx-btn'); f && f.focus({ preventScroll: true }); }, 400);
  }

  // ---------- điều khiển ----------
  function setPP(play) { ppBtn.innerHTML = play ? ICON.pause : ICON.play; ppBtn.setAttribute('aria-label', play ? 'Tạm dừng' : 'Xem tiếp'); document.documentElement.classList.toggle('tx-paused', !play); }
  function pause() {
    if (!X.active || !X.playing) return;
    X.playing = false; setPP(false); X.slides.forEach(s => s.v && s.v.pause()); vo.pause();
  }
  function resume() {
    if (!X.active) return;
    if (X.ended) { outroEl && outroEl.classList.remove('on'); X.playing = true; setPP(true); go(0); return; }
    X.playing = true; setPP(true); X.last = performance.now();
    const s = X.tour.stops[X.i]; if (s) aimStop(s, 1200);
    const sl = X.slides[X.cur]; if (sl && sl.v) { const p = sl.v.play(); if (p) p.catch(() => {}); }
    if (voFor && X.sound && !vo.ended) { const p = vo.play(); if (p) p.catch(() => {}); }
  }
  ppBtn.addEventListener('click', () => X.playing ? pause() : resume());
  $('#tx-prev').addEventListener('click', () => { X.playing = true; setPP(true); go(Math.max(0, X.i - 1)); });
  $('#tx-next').addEventListener('click', () => { X.playing = true; setPP(true); go(X.i + 1); });
  $('#tx-exit').addEventListener('click', () => stop());
  addEventListener('keydown', e => {
    if (!pick.hidden && e.key === 'Escape') { closePick(); return; }
    if (!X.active || (e.target && /INPUT|TEXTAREA/.test(e.target.tagName))) return;
    const popOpen = !$('#pop').hidden; if (popOpen) return;
    if (e.key === ' ' && !(e.target && e.target.closest && e.target.closest('button,a'))) { e.preventDefault(); X.playing ? pause() : resume(); }
    else if (e.key === 'ArrowRight' && e.shiftKey) { e.preventDefault(); e.stopPropagation(); go(X.i + 1); }
    else if (e.key === 'ArrowLeft' && e.shiftKey) { e.preventDefault(); e.stopPropagation(); go(X.i - 1); }
    else if (e.key === 'Escape') stop();
  }, true);
  document.addEventListener('visibilitychange', () => { if (document.hidden && !X.loop) pause(); });
  addEventListener('keydown', e => { if (X.active && (e.key === 'm' || e.key === 'M') && !(e.target && /INPUT|TEXTAREA/.test(e.target.tagName))) sndBtn.click(); });

  // ---------- nhịp chạy + hiệu ứng trên cảnh ----------
  C.onFrame = (ctx, now) => {
    if (!X.active) return;
    const A = api(), dt = Math.min(0.1, (now - X.last) / 1000); X.last = now;
    if (X.playing) X.clock += dt;
    if (X.titleUntil && X.clock >= X.titleUntil && X.i < 0 && !X.busy) { X.titleUntil = 0; go(0); }
    const s = X.tour && X.tour.stops[X.i];
    if (s && X.playing && !X.ended) {
      if (!X.cardShown && X.clock >= X.cardAt) showCard();
      if (X.cardShown) {
        const into = X.clock - X.cardAt, k = Math.min(1, into / X.dwell);
        const seg = segsEl.children[X.i]; if (seg) seg.style.setProperty('--p', k.toFixed(3));
        if (X.slides.length && X.clock - X.slideAt >= slideLen()) nextSlide();
        // máy quay trôi rất chậm khi dừng, như lia máy trong phim tài liệu
        if (!A.reduce && !A.flying()) A.S.d += dt * (s.drift || 0.9);
        if (into >= X.dwell && !X.busy) go(X.i + 1);
      }
    }
    if (s && X.cardShown && call.classList.contains('on')) placeCall(ctx, A, s);
    if (!s || X.clock < X.fxAt) return;
    const t = X.clock - X.fxAt;
    (s.fx || []).forEach(f => { const fn = FX[f.t]; if (fn) { ctx.save(); try { fn(ctx, f, t, A, now / 1000); } catch (e) { /* bỏ qua khung lỗi */ } ctx.restore(); } });
  };

  // chú thích nổi: khung ảnh bám cạnh điểm đang kể, nối bằng một đường mảnh
  function placeCall(ctx, A, s) {
    const [lon, lat] = resolve(s.at), p = A.proj(lon, lat), W = A.W, H = A.H;
    const cw = call.offsetWidth, ch = call.offsetHeight, m = 24, top = Math.max(18, Math.min(44, H * 0.042)) + 16, bot = H - card.offsetHeight - 150;
    let tx, ty;
    if (p) {
      // thử bốn chỗ quanh điểm đang kể, chọn chỗ không che tên khu hay thiết bị đang được nhắc tới
      const avoid = [];
      (s.fx || []).forEach(f => { if (f.t === 'zones' && f.label) (f.ids || []).forEach(id => { const c = A.zoneC(id), q = c && A.proj(c[0], c[1]); if (q) avoid.push(q); }); });
      // công trình dự kiến và nhãn của chúng cũng không được che
      (s.fx || []).forEach(f => { if (f.t === 'quyHoach') QH.forEach(o => { if (o.kieu === 'ong') return; const c = qhC(A, o), q = A.proj(c[0], c[1]); if (q) { avoid.push(q); avoid.push([q[0], q[1] - 34]); } }); });
      A.items.forEach(it => { if (it.el.classList.contains('txf') && it.sx != null) avoid.push([it.sx, it.sy]); });
      // hai góc trên cùng là chỗ dự phòng, chỉ dùng khi cạnh điểm kể đều vướng
      const cands = [[p[0] + 90, p[1] - ch - 40, 0], [p[0] - 90 - cw, p[1] - ch - 40, 0], [p[0] + 90, p[1] + 40, 0], [p[0] - 90 - cw, p[1] + 40, 0], [m, top, 0.5], [W - m - cw, top, 0.5]].map(([x, y, pen]) => {
        x = Math.max(m, Math.min(W - m - cw, x)); y = Math.max(top, Math.min(bot - ch, y));
        const hit = pen + avoid.filter(q => q[0] > x - 50 && q[0] < x + cw + 50 && q[1] > y - 24 && q[1] < y + ch + 24).length;
        return { x, y, hit };
      });
      const best = cands.reduce((a, b) => b.hit < a.hit ? b : a);
      if (X.callPick == null || cands[X.callPick].hit > best.hit) X.callPick = cands.indexOf(best);
      tx = cands[X.callPick].x; ty = cands[X.callPick].y;
    } else { tx = W - cw - m; ty = top + 20; }
    if (X.cx == null) { X.cx = tx; X.cy = ty; }
    X.cx += (tx - X.cx) * 0.12; X.cy += (ty - X.cy) * 0.12;
    call.style.transform = `translate(${X.cx.toFixed(1)}px,${X.cy.toFixed(1)}px)`;
    if (!p || X.callPick >= 4) return; // ảnh nằm ở góc thì không kéo đường nối dài qua cảnh
    // đường nối từ điểm tới góc gần nhất của khung
    const ax = Math.max(X.cx, Math.min(X.cx + cw, p[0])), ay = p[1] < X.cy ? X.cy : X.cy + ch;
    const k = Math.min(1, (X.clock - X.cardAt) / 0.8);
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    ctx.strokeStyle = `rgba(${X.tour.tint},${0.85 * k})`; ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(p[0] + (ax - p[0]) * k, p[1] + (ay - p[1]) * k); ctx.stroke();
    ctx.beginPath(); ctx.arc(p[0], p[1], 5, 0, 7); ctx.stroke();
    ctx.fillStyle = `rgba(${X.tour.tint},${k})`; ctx.beginPath(); ctx.arc(p[0], p[1], 2.4, 0, 7); ctx.fill();
    ctx.restore();
  }
  const LIME = '181,227,131';
  const ringPts = (A, lon, lat, r, n = 36, a0 = 0, a1 = Math.PI * 2) => {
    const out = [];
    for (let i = 0; i <= n; i++) { const a = a0 + (a1 - a0) * i / n, [x, y] = A.geoOff(lon, lat, Math.sin(a) * r, Math.cos(a) * r); out.push(A.proj(x, y)); }
    return out;
  };
  const polyPath = pts => { const p = new Path2D(); let pen = false; pts.forEach(q => { if (!q) { pen = false; return; } pen ? p.lineTo(q[0], q[1]) : p.moveTo(q[0], q[1]); pen = true; }); return p; };
  const glowStroke = (ctx, p, rgb, a, w) => {
    ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.strokeStyle = `rgba(${rgb},${0.18 * a})`; ctx.lineWidth = w * 4; ctx.stroke(p);
    ctx.strokeStyle = `rgba(${rgb},${0.85 * a})`; ctx.lineWidth = w; ctx.stroke(p);
    ctx.strokeStyle = `rgba(255,255,255,${0.7 * a})`; ctx.lineWidth = Math.max(1, w * 0.4); ctx.stroke(p);
  };
  const thinLine = (ctx, p, rgb, a) => {
    ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.strokeStyle = `rgba(${rgb},${0.16 * a})`; ctx.lineWidth = 5; ctx.stroke(p);
    ctx.strokeStyle = `rgba(${rgb},${0.9 * a})`; ctx.lineWidth = 1.4; ctx.stroke(p);
  };
  const dot = (ctx, x, y, r, rgb, a = 1) => {
    ctx.globalCompositeOperation = 'lighter';
    const g = ctx.createRadialGradient(x, y, 0, x, y, r * 4); g.addColorStop(0, `rgba(255,255,255,${a})`); g.addColorStop(0.25, `rgba(${rgb},${0.9 * a})`); g.addColorStop(1, `rgba(${rgb},0)`);
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r * 4, 0, 7); ctx.fill();
  };
  const lineSamples = (A, a, b, n = 40) => { const out = []; for (let i = 0; i <= n; i++) out.push(A.proj(a[0] + (b[0] - a[0]) * i / n, a[1] + (b[1] - a[1]) * i / n)); return out; };
  const at = (A, id) => resolve(id);
  const itemsOf = (A, kinds) => A.items.filter(it => it.dir && (kinds === 'all' || [].concat(kinds).includes(it.kind)));
  const ZIDS = ['A', 'B1', 'B2', 'C1', 'C2', 'C3', 'C4', 'C5'];
  // công trình dự kiến: vị trí tính theo khu (giữa khu + lệch dx đông, dy bắc, mét), nên dùng được cho cả bản mét lẫn bản GPS
  function qhC(A, o) {
    if (o.id === 'ho') return A.lake();
    const z = A.zoneC(o.khu) || A.gc(); return A.geoOff(z[0], z[1], o.dx || 0, o.dy || 0);
  }
  const qhRing = (A, o) => {
    const [cx, cy] = qhC(A, o), a = (o.quay || 0) * Math.PI / 180, w = (o.rong || 40) / 2, d = (o.dai || 30) / 2, r = Math.min(w, d) * 0.28, out = [];
    // hình chữ nhật bo góc như hồ đào thật
    [[w, d], [-w, d], [-w, -d], [w, -d]].forEach(([sx, sy], k) => {
      for (let j = 0; j <= 4; j++) {
        const t = (k * 90 + j * 22.5) * Math.PI / 180, x = sx - Math.sign(sx) * r + Math.cos(t) * r, y = sy - Math.sign(sy) * r + Math.sin(t) * r;
        const ex = x * Math.cos(a) - y * Math.sin(a), ny = x * Math.sin(a) + y * Math.cos(a);
        const [lx, ly] = A.geoOff(cx, cy, ex, ny); out.push(A.proj(lx, ly));
      }
    });
    return out;
  };
  // nhãn viên thuốc trên cảnh (nét đứt = dự kiến)
  function pill(ctx, x, y, tx, sub, rgb, k, dashed) {
    ctx.save(); ctx.globalCompositeOperation = 'source-over';
    ctx.font = '600 13px Archivo, system-ui, sans-serif'; const w1 = ctx.measureText(tx).width;
    ctx.font = '500 11px Archivo, system-ui, sans-serif'; const w2 = sub ? ctx.measureText(sub).width + 14 : 0;
    const w = w1 + w2 + 26, hh = 28, x0 = x - w / 2, y0 = y - hh / 2;
    ctx.fillStyle = `rgba(7,17,10,${0.86 * k})`; ctx.beginPath(); ctx.roundRect ? ctx.roundRect(x0, y0, w, hh, 14) : ctx.rect(x0, y0, w, hh); ctx.fill();
    if (dashed) ctx.setLineDash([4, 4]); ctx.strokeStyle = `rgba(${rgb},${0.95 * k})`; ctx.lineWidth = 1.3; ctx.stroke(); ctx.setLineDash([]);
    ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
    ctx.font = '600 13px Archivo, system-ui, sans-serif'; ctx.fillStyle = `rgba(255,255,255,${k})`; ctx.fillText(tx, x0 + 13, y + 0.5);
    if (sub) { ctx.font = '500 11px Archivo, system-ui, sans-serif'; ctx.fillStyle = `rgba(${rgb},${k})`; ctx.fillText(sub, x0 + 13 + w1 + 10, y + 0.5); }
    ctx.restore();
  }

  const QRGB = { ho: '124,195,217', phan: '214,170,110', diem: '245,228,161', ong: '160,215,235' };
  const FX = {
    // quy hoạch: công trình chưa có vẽ nét đứt, có nhãn "dự kiến"; noiBat = id công trình đang được kể
    quyHoach(ctx, f, t, A, s) {
      const nb = f.noiBat, items = QH.filter(o => !f.ids || f.ids.includes(o.id));
      items.forEach((o, i) => {
        const k = A.ease((t - i * 0.35) / 1.1); if (k <= 0) return;
        const hot = !nb || nb === o.id, a = k * (hot ? 1 : 0.45), pul = 0.5 + 0.5 * Math.sin(s * 2.4 + i);
        ctx.save();
        if (o.kieu === 'ong') {
          const pts = (o.qua || []).map(id => { const q = id === 'ho' ? { id: 'ho' } : QH.find(x => x.id === id); return q ? qhC(A, q) : null; }).filter(Boolean);
          for (let j = 0; j < pts.length - 1; j++) {
            const seg = lineSamples(A, pts[j], pts[j + 1], 36), grow = A.ease((t - i * 0.35 - j * 0.4) / 1.4), n = Math.round(36 * grow);
            if (n < 1) continue;
            const P = polyPath(seg.slice(0, n + 1)), rgb = QRGB.ong;
            ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
            ctx.strokeStyle = `rgba(${rgb},${0.16 * a})`; ctx.lineWidth = 6; ctx.stroke(P);
            ctx.setLineDash([7, 9]); ctx.lineDashOffset = -s * 22; ctx.strokeStyle = `rgba(${rgb},${0.95 * a})`; ctx.lineWidth = 2; ctx.stroke(P); ctx.setLineDash([]);
          }
          ctx.restore(); return;
        }
        const c = qhC(A, o), p = A.proj(c[0], c[1]);
        const rgb = o.kieu === 'diem' ? QRGB.diem : /phan/.test(o.id) ? QRGB.phan : QRGB.ho;
        if (o.kieu === 'ho') {
          const P = polyPath(qhRing(A, o).concat([qhRing(A, o)[0]]));
          ctx.globalCompositeOperation = 'lighter';
          ctx.fillStyle = `rgba(${rgb},${(0.08 + (hot ? 0.1 * pul : 0)) * a})`; ctx.fill(P);
          ctx.setLineDash([6, 6]); ctx.lineDashOffset = -s * 10; ctx.strokeStyle = `rgba(${rgb},${0.95 * a})`; ctx.lineWidth = 1.8; ctx.stroke(P); ctx.setLineDash([]);
        } else {
          // điểm đã có thật ngoài vườn (trang trại): vòng nét liền; điểm dự kiến: nét đứt
          const P = polyPath(ringPts(A, c[0], c[1], o.r || 40, 40));
          ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(${rgb},${0.06 * a})`; ctx.fill(P);
          if (!o.coSan) ctx.setLineDash([6, 6]);
          ctx.strokeStyle = `rgba(${rgb},${0.85 * a})`; ctx.lineWidth = 1.5; ctx.stroke(P); ctx.setLineDash([]);
        }
        if (p) {
          if (hot && nb) dot(ctx, p[0], p[1], 3 + pul * 1.5, rgb, a);
          pill(ctx, p[0], p[1] - (o.kieu === 'ho' ? 30 : 36), o.ten, o.coSan ? 'đã có' : 'dự kiến', rgb, a, !o.coSan);
        }
        ctx.restore();
      });
    },
    // rọi đèn: tối dần quanh điểm cần xem
    spot(ctx, f, t, A) {
      const k = A.ease(t / 1.2) * 0.55, [lon, lat] = at(A, f.at), p = A.proj(lon, lat), W = A.W, H = A.H;
      if (!p) { ctx.fillStyle = `rgba(4,10,6,${k * 0.6})`; ctx.fillRect(0, 0, W, H); return; }
      const r0 = Math.min(W, H) * 0.13, r1 = Math.max(W, H) * 0.55, g = ctx.createRadialGradient(p[0], p[1], r0, p[0], p[1], r1);
      g.addColorStop(0, 'rgba(4,10,6,0)'); g.addColorStop(1, `rgba(4,10,6,${k})`); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    },
    // sóng lan trên mặt hồ, vẽ đúng phối cảnh mặt đất
    ripple(ctx, f, t, A) {
      const [lon, lat] = at(A, f.at), rgb = f.rgb || '124,195,217', k = A.ease(t / 1);
      for (let i = 0; i < 4; i++) {
        const ph = ((t * 0.32) + i / 4) % 1, pts = ringPts(A, lon, lat, 6 + ph * 70, 40);
        glowStroke(ctx, polyPath(pts), rgb, (1 - ph) * k * 0.9, 1.6);
      }
      const p = A.proj(lon, lat); if (p) dot(ctx, p[0], p[1], 4, rgb, k);
    },
    // nắng: quầng ấm và tia xoay chậm quanh mái pin
    rays(ctx, f, t, A, s) {
      const [lon, lat] = at(A, f.at), p = A.proj(lon, lat, 8); if (!p) return;
      const k = A.ease(t / 1.4), R = Math.min(A.W, A.H) * 0.09;
      ctx.globalCompositeOperation = 'lighter';
      const g = ctx.createRadialGradient(p[0], p[1], 0, p[0], p[1], R * 2.2); g.addColorStop(0, `rgba(255,236,170,${0.55 * k})`); g.addColorStop(1, 'rgba(255,200,90,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p[0], p[1], R * 2.2, 0, 7); ctx.fill();
      ctx.lineCap = 'round';
      for (let i = 0; i < 16; i++) {
        const a = i / 16 * Math.PI * 2 + s * 0.15, pul = 0.6 + 0.4 * Math.sin(s * 2.2 + i * 1.3), r0 = R * 0.75, r1 = R * (1.15 + 0.55 * pul);
        ctx.strokeStyle = `rgba(255,228,150,${0.55 * k * pul})`; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(p[0] + Math.cos(a) * r0, p[1] + Math.sin(a) * r0 * 0.7); ctx.lineTo(p[0] + Math.cos(a) * r1, p[1] + Math.sin(a) * r1 * 0.7); ctx.stroke();
      }
    },
    // dòng chảy: vạch sáng chạy từ nguồn tới đích, mọc dần ra
    flow(ctx, f, t, A, s) {
      const a = at(A, f.from), rgb = f.rgb || '124,195,217', grow = A.ease(t / 2);
      const tos = f.to === 'zones' ? ZIDS.map(id => A.zoneC(id)) : [at(A, f.to)];
      tos.forEach((b, j) => {
        const pts = lineSamples(A, a, b, 48), n = Math.max(1, Math.round(48 * A.ease((t - j * 0.12) / 1.8))), part = pts.slice(0, n + 1);
        if (part.length < 2) return;
        const p = polyPath(part);
        ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
        ctx.strokeStyle = `rgba(${rgb},${0.22 * grow})`; ctx.lineWidth = 6; ctx.stroke(p);
        ctx.setLineDash([3, 14]); ctx.lineDashOffset = -s * 46; ctx.strokeStyle = `rgba(255,255,255,${0.9 * grow})`; ctx.lineWidth = 2.6; ctx.stroke(p); ctx.setLineDash([]);
        for (let d = 0; d < 2; d++) { const q = part[Math.floor(((s * 0.28 + d / 2 + j * 0.07) % 1) * (part.length - 1))]; if (q) dot(ctx, q[0], q[1], 2.6, rgb, grow); }
        const end = part[part.length - 1]; if (end && n >= 48) { const pul = 0.5 + 0.5 * Math.sin(s * 4 + j); dot(ctx, end[0], end[1], 3 + pul * 1.5, rgb, 0.9); }
      });
    },
    // khu sáng lần lượt (wave: sáng theo nhịp sóng): chỉ phủ màu mềm, không viền saber
    zones(ctx, f, t, A, s) {
      (f.ids || ZIDS).forEach((id, i) => {
        const k = A.ease((t - i * 0.32) / 0.9); if (k <= 0) return;
        const zp = A.zonePath(id); if (!zp || !zp.full) return;
        const zr = f.rgb || C.zones[id].rgb, pul = f.wave ? Math.max(0, Math.sin(s * 1.6 - i * 0.75)) : 0.5 + 0.5 * Math.sin(s * 1.4 + i);
        ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(${zr},${(0.05 + 0.1 * pul) * k})`; ctx.fill(zp.p);
        thinLine(ctx, zp.p, zr, 0.55 * k);
        if (f.label && A.S.selZone !== id) {
          // tên khu ngay trên khu được kể, để biết đang nói tới khu nào
          const c = A.zoneC(id), q = c && A.proj(c[0], c[1]); if (!q) return;
          const tx = 'Khu ' + id; ctx.globalCompositeOperation = 'source-over'; ctx.font = '600 13px Archivo, system-ui, sans-serif';
          const w = ctx.measureText(tx).width + 22;
          ctx.fillStyle = `rgba(7,17,10,${0.82 * k})`; ctx.beginPath(); ctx.roundRect ? ctx.roundRect(q[0] - w / 2, q[1] - 13, w, 26, 13) : ctx.rect(q[0] - w / 2, q[1] - 13, w, 26); ctx.fill();
          ctx.strokeStyle = `rgba(${zr},${0.9 * k})`; ctx.lineWidth = 1.2; ctx.stroke();
          ctx.fillStyle = `rgba(255,255,255,${k})`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(tx, q[0], q[1] + 0.5);
        }
      });
    },
    // sóng radar ở từng thiết bị
    pings(ctx, f, t, A) {
      const KC = { building: '245,228,161', lake: '124,195,217', center: '181,227,131', soil: '232,186,104', water: '111,199,224', camera: '214,226,238' };
      itemsOf(A, f.kind).forEach((it, j) => {
        const k = A.ease((t - j * 0.08) / 0.8); if (k <= 0) return;
        const rgb = f.rgb || KC[it.kind];
        for (let i = 0; i < 2; i++) { const ph = ((t * 0.5) + i / 2 + j * 0.13) % 1; glowStroke(ctx, polyPath(ringPts(A, it.lon, it.lat, 3 + ph * 26, 28)), rgb, (1 - ph) * k, 1.4); }
        const p = A.proj(it.lon, it.lat); if (p) dot(ctx, p[0], p[1], 3, rgb, k);
      });
    },
    // dữ liệu chạy từ các thiết bị về trạm, theo đường cong
    links(ctx, f, t, A, s) {
      const hub = at(A, f.to), H0 = A.proj(hub[0], hub[1]); if (!H0) return;
      const KC = { soil: '232,186,104', water: '111,199,224', camera: '214,226,238' };
      itemsOf(A, f.kinds).filter(it => it.id !== f.to).forEach((it, j) => {
        const p = A.proj(it.lon, it.lat); if (!p) return;
        const k = A.ease((t - j * 0.1) / 1), rgb = KC[it.kind] || LIME;
        const mx = (p[0] + H0[0]) / 2, my = Math.min(p[1], H0[1]) - Math.hypot(p[0] - H0[0], p[1] - H0[1]) * 0.28;
        const P = new Path2D(); P.moveTo(p[0], p[1]); P.quadraticCurveTo(mx, my, H0[0], H0[1]);
        ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = `rgba(${rgb},${0.32 * k})`; ctx.lineWidth = 1.4; ctx.stroke(P);
        for (let d = 0; d < 2; d++) {
          const u = ((s * 0.45) + d / 2 + j * 0.17) % 1, x = (1 - u) * (1 - u) * p[0] + 2 * (1 - u) * u * mx + u * u * H0[0], y = (1 - u) * (1 - u) * p[1] + 2 * (1 - u) * u * my + u * u * H0[1];
          dot(ctx, x, y, 2.2, rgb, k);
        }
        dot(ctx, p[0], p[1], 2.4, rgb, k * 0.8);
      });
      const pul = 0.5 + 0.5 * Math.sin(s * 3);
      dot(ctx, H0[0], H0[1], 5 + pul * 2, LIME, A.ease(t / 0.8));
    },
    // cột sáng đưa dữ liệu lên máy chủ
    uplink(ctx, f, t, A, s) {
      const [lon, lat] = at(A, f.at), p0 = A.proj(lon, lat); if (!p0) return;
      const k = A.ease((t - 0.6) / 1.2); if (k <= 0) return;
      const top = Math.max(A.H * 0.08, p0[1] - A.H * 0.42), x = p0[0];
      ctx.globalCompositeOperation = 'lighter';
      const g = ctx.createLinearGradient(0, p0[1], 0, top); g.addColorStop(0, `rgba(${LIME},${0.9 * k})`); g.addColorStop(1, `rgba(124,195,217,0)`);
      ctx.fillStyle = g; ctx.fillRect(x - 1.5, top, 3, p0[1] - top);
      const g2 = ctx.createLinearGradient(0, p0[1], 0, top); g2.addColorStop(0, `rgba(${LIME},${0.18 * k})`); g2.addColorStop(1, 'rgba(124,195,217,0)');
      ctx.fillStyle = g2; ctx.fillRect(x - 10, top, 20, p0[1] - top);
      for (let i = 0; i < 6; i++) { const u = ((s * 0.4) + i / 6) % 1; dot(ctx, x, p0[1] - (p0[1] - top) * u, 2.2, '124,195,217', k * (1 - u)); }
      for (let i = 0; i < 3; i++) { const ph = ((s * 0.4) + i / 3) % 1; ctx.strokeStyle = `rgba(124,195,217,${(1 - ph) * 0.7 * k})`; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.ellipse(x, top + 6, 8 + ph * 46, (8 + ph * 46) * 0.32, 0, 0, 7); ctx.stroke(); }
    },
    // góc nhìn 110° của từng camera, quét qua lại
    cones(ctx, f, t, A, s) {
      itemsOf(A, 'camera').forEach((it, j) => {
        const k = A.ease((t - j * 0.12) / 1); if (k <= 0) return;
        const zc = A.zoneC(it.zone) || A.gc(), [ex, ny] = [zc[0] - it.lon, zc[1] - it.lat];
        const dir = Math.atan2(D2m(A, ex, it.lat, 'x'), D2m(A, ny, it.lat, 'y')), half = 55 * Math.PI / 180, r = 62;
        const arc = ringPts(A, it.lon, it.lat, r, 18, dir - half, dir + half), c = A.proj(it.lon, it.lat); if (!c) return;
        const P = polyPath([c, ...arc, c]);
        ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(214,226,238,${0.1 * k})`; ctx.fill(P);
        ctx.strokeStyle = `rgba(214,226,238,${0.45 * k})`; ctx.lineWidth = 1; ctx.stroke(P);
        const sw = dir + half * Math.sin(s * 0.9 + j), [sx, sy] = A.geoOff(it.lon, it.lat, Math.sin(sw) * r, Math.cos(sw) * r), q = A.proj(sx, sy);
        if (q) { const L = new Path2D(); L.moveTo(c[0], c[1]); L.lineTo(q[0], q[1]); glowStroke(ctx, L, '214,226,238', k * 0.8, 1.2); }
        dot(ctx, c[0], c[1], 2.6, '214,226,238', k);
      });
    },
    // vẽ lại ranh từng khu bằng nét mảnh như đang số hoá bản đồ (không dùng saber)
    trace(ctx, f, t, A) {
      const rgb = f.rgb || '230,255,210';
      ZIDS.forEach((id, i) => {
        const k = A.ease((t - i * 0.22) / 1.6); if (k <= 0) return;
        const zp = A.zonePath(id, 0, k); if (!zp) return;
        thinLine(ctx, zp.p, rgb, k < 1 ? 0.95 : 0.6);
      });
    },
    // viền cả vườn: một nét mảnh chạy quanh như vạch đo đạc, rồi giữ lại nhẹ
    boundary(ctx, f, t, A, s) {
      const pts = A.boundary().map(p => A.proj(p[0], p[1])); if (pts.filter(Boolean).length < 3) return;
      const k = A.ease(t / 2.2), rgb = f.rgb || LIME, all = pts.concat([pts[0]]), n = Math.max(2, Math.round(all.length * k));
      const P = polyPath(all.slice(0, n));
      thinLine(ctx, P, rgb, 0.9);
      ctx.globalCompositeOperation = 'lighter'; ctx.setLineDash([2, 12]); ctx.lineDashOffset = -s * 30; ctx.strokeStyle = `rgba(255,255,255,${0.55 * k})`; ctx.lineWidth = 1.6; ctx.stroke(P); ctx.setLineDash([]);
      const head = all[n - 1]; if (head && k < 1) dot(ctx, head[0], head[1], 3, rgb, 1);
    }
  };
  // chênh lệch toạ độ ra mét (bản công khai đã là mét)
  function D2m(A, d, lat, axis) { const loc = window.FB360_DATA && window.FB360_DATA.local; return loc ? d : axis === 'x' ? d * 111320 * Math.cos(lat * Math.PI / 180) : d * 110574; }

  C.tuXem = { open, start, stop, pause, resume, get active() { return X.active; } };
  // mở thẳng một hành trình bằng link: #tu-xem-nong, #tu-xem-tech, #tu-xem-sap-toi
  C.onReady = () => {
    const m = location.hash.match(/^#tu-xem-([\w-]+)/); if (!m) return;
    if (m[1] === 'lap') { X.loop = true; loopEl.checked = true; setTimeout(() => start('nong'), 1200); return; }
    if (T.tours[m[1]] && T.tours[m[1]].stops.length) setTimeout(() => start(m[1]), 1200);
  };
  if (C.api) C.onReady();
})();
