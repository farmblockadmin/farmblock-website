/* Song ngữ Việt – Anh cho website FarmBlock.
   Nạp ĐẦU <head> (không defer). Trang viết bằng tiếng Việt; khi chọn EN, file này nạp từ điển
   i18n/en/chung.js + i18n/en/<trang>.js rồi thay chữ ngay khi trình duyệt dựng trang
   (trước các script hiệu ứng như SplitText), kể cả chữ do JS thêm sau và chữ vẽ trên canvas.
   Câu nào chưa có trong từ điển thì giữ tiếng Việt. Chọn ngôn ngữ: nút VI/EN trên thanh menu,
   hoặc ?lang=en / ?lang=vi trên địa chỉ (được nhớ cho các trang sau). */
(function () {
  var KEY = 'fb-lang', d = document, root = d.documentElement;
  var cs = d.currentScript, base = cs ? cs.src.replace(/lang\.js(\?.*)?$/, '') : '';
  var q = /[?&]lang=(en|vi|collect)\b/.exec(location.search), lang;
  try { if (q && q[1] !== 'collect') localStorage.setItem(KEY, q[1]); lang = (q && q[1]) || localStorage.getItem(KEY); } catch (e) { lang = q && q[1]; }
  lang = lang === 'en' || lang === 'collect' ? lang : 'vi';
  var page = (location.pathname.split('/').pop() || 'index.html').replace(/\.html?$/, '') || 'index';
  if (/\/tour-360\/?$/.test(location.pathname) || /tour-360\/index$/.test(location.pathname + page)) page = 'tour-360';
  var hv = /^hoc-vien-(.+)$/.exec(page);
  var dict = {}, rules = [], html = [];
  var I = window.FBI18N = {
    lang: lang, page: page,
    add: function (o) {
      for (var k in o) {
        if (k === '__re') o[k].forEach(function (r) { rules.push([new RegExp(r[0]), r[1]]); });
        else if (k === '__html') for (var sel in o[k]) html.push([sel, o[k][sel]]); /* thay cả khối (tiêu đề tách nhiều mảnh) */
        else dict[norm(k)] = o[k];
      }
    },
    t: function (s) {
      if (lang !== 'en' || s == null) return s;
      var k = norm(s); if (!k) return s;
      if (Object.prototype.hasOwnProperty.call(dict, k)) return pad(s, dict[k]);
      for (var i = 0; i < rules.length; i++) if (rules[i][0].test(k)) return pad(s, k.replace(rules[i][0], rules[i][1]));
      return s;
    },
    keys: {}
  };
  /* gộp khoảng trắng; "Farmblock" và "FarmBlock" coi là một (trang đang đổi dần sang FarmBlock) */
  function norm(s) { return String(s).replace(/[\s\u00a0]+/g, ' ').replace(/Farmblock/g, 'FarmBlock').trim(); }
  function pad(orig, tr) { var m = /^[\s ]*/.exec(orig)[0], n = /[\s ]*$/.exec(orig)[0]; return m + tr + n; }

  root.lang = lang === 'en' ? 'en' : 'vi';
  root.classList.add('lang-' + root.lang);

  if (lang !== 'vi') {
    var src = hv ? ['chung', 'hv-ds', 'hv-bai', 'hv/' + hv[1]] : ['chung', page];
    if (page === 'hoc-vien') src.push('hv-ds');
    if (lang === 'en') for (var i = 0; i < src.length; i++) d.write('<script src="' + base + 'i18n/en/' + src[i] + '.js"><\/script>');

    var ATTR = ['placeholder', 'title', 'aria-label', 'alt', 'data-cht', 'data-lab', 'data-tip', 'data-l'];
    var SKIP = { SCRIPT: 1, STYLE: 1, NOSCRIPT: 1, TEXTAREA: 1, CODE: 1, PRE: 1 };
    var collect = lang === 'collect';
    var skipEl = function (el) { for (; el && el.nodeType === 1; el = el.parentNode) { if (SKIP[el.nodeName] || el.getAttribute('translate') === 'no' || (el.classList && el.classList.contains('notranslate'))) return true; } return false; };
    var hasWord = /[A-Za-zÀ-ỹ]/;
    var doText = function (n) {
      var v = n.nodeValue; if (!v || !hasWord.test(v) || skipEl(n.parentNode)) return;
      if (collect) { I.keys[norm(v)] = 1; return; }
      var t = I.t(v); if (t !== v) n.nodeValue = t;
    };
    var doAttr = function (el, a) {
      var v = el.getAttribute(a); if (!v || !hasWord.test(v)) return;
      if (collect) { I.keys[norm(v)] = 1; return; }
      var t = I.t(v); if (t !== v) el.setAttribute(a, t);
    };
    var doEl = function (el) {
      if (el.nodeType === 3) return doText(el);
      if (el.nodeType !== 1 || SKIP[el.nodeName]) return;
      if (el.nodeName === 'META') { var nm = el.getAttribute('name') || el.getAttribute('property') || ''; if (/^(description|og:title|og:description|og:image:alt|twitter:title|twitter:description|twitter:image:alt)$/.test(nm)) doAttr(el, 'content'); return; }
      for (var i = 0; i < ATTR.length; i++) if (el.hasAttribute(ATTR[i])) doAttr(el, ATTR[i]);
      if (skipEl(el)) return;
      var w = d.createTreeWalker(el, 5, null), n;
      while ((n = w.nextNode())) {
        if (n.nodeType === 3) doText(n);
        else if (!SKIP[n.nodeName]) { if (n.nodeName === 'META') doEl(n); else for (var j = 0; j < ATTR.length; j++) if (n.hasAttribute(ATTR[j])) doAttr(n, ATTR[j]); }
      }
    };
    /* khối trong __html: thay khi trình duyệt đã dựng xong khối đó (có nút đứng sau nó) */
    var closed = function (el) { for (var e = el; e && e !== root; e = e.parentNode) if (e.nextSibling) return true; return false; };
    var doHtml = function (all) {
      for (var i = 0; i < html.length; i++) {
        if (html[i].done) continue;
        var els = d.querySelectorAll(html[i][0]);
        var v = html[i][1], need = typeof v === 'string' ? 1 : v.length; /* mảng: phần tử thứ j cho khối thứ j */
        if (els.length >= need && (all || closed(els[els.length - 1]))) { for (var j = 0; j < els.length; j++) { var h = typeof v === 'string' ? v : v[j]; if (h != null && h !== '') els[j].innerHTML = h; } html[i].done = 1; }
      }
    };
    var mo = new MutationObserver(function (list) {
      if (lang === 'en' && html.length) doHtml();
      for (var i = 0; i < list.length; i++) {
        var m = list[i];
        if (m.type === 'childList') for (var j = 0; j < m.addedNodes.length; j++) doEl(m.addedNodes[j]);
        else if (m.type === 'characterData') doText(m.target);
        else if (m.type === 'attributes') doAttr(m.target, m.attributeName);
      }
    });
    mo.observe(root, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATTR });
    doEl(root);
    if (lang === 'en') {
      d.addEventListener('DOMContentLoaded', function () { doHtml(1); });
      /* chữ vẽ trên canvas (nhãn sa bàn 3D…) */
      var C = window.CanvasRenderingContext2D && CanvasRenderingContext2D.prototype;
      if (C) ['fillText', 'strokeText'].forEach(function (f) { var o = C[f]; C[f] = function (s) { var a = [].slice.call(arguments); a[0] = I.t(s); return o.apply(this, a); }; });
      var dt = Object.getOwnPropertyDescriptor(Document.prototype, 'title');
      if (dt && dt.set) Object.defineProperty(d, 'title', { get: function () { return dt.get.call(d); }, set: function (v) { dt.set.call(d, I.t(v)); }, configurable: true });
    }
  }

  /* nút chuyển ngôn ngữ trên thanh menu */
  function addSwitch() {
    if (d.getElementById('fbLang')) return;
    var host = d.querySelector('.nav .bar'), before = host && host.querySelector('.go-m');
    if (!host) return;
    var a = d.createElement('a');
    a.id = 'fbLang'; a.className = 'fb-lang'; a.setAttribute('translate', 'no');
    var to = root.lang === 'en' ? 'vi' : 'en';
    a.href = location.pathname + '?lang=' + to + location.hash;
    a.setAttribute('hreflang', to); a.setAttribute('lang', to);
    a.setAttribute('aria-label', to === 'en' ? 'Switch to English' : 'Chuyển sang tiếng Việt');
    a.innerHTML = '<span' + (root.lang === 'vi' ? ' class="on"' : '') + '>VI</span><span' + (root.lang === 'en' ? ' class="on"' : '') + '>EN</span>';
    var st = d.createElement('style');
    st.textContent = '.fb-lang{display:inline-flex;align-items:center;gap:2px;height:52px;padding:0 6px;margin-right:8px;border-radius:999px;border:1px solid rgba(255,255,255,.28);background:rgba(17,38,21,.35);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);color:#fff;text-decoration:none;font:600 15px/1 Archivo,system-ui,sans-serif;letter-spacing:.04em;flex:none;transition:border-color .2s}'
      + '.fb-lang span{display:inline-flex;align-items:center;justify-content:center;min-width:38px;height:38px;border-radius:999px;opacity:.7;transition:background .2s,color .2s,opacity .2s}'
      + '.fb-lang span.on{background:#B5E383;color:#112615;opacity:1}.fb-lang:hover{border-color:#B5E383}.fb-lang:hover span:not(.on){opacity:1}'
      + '@media (max-width:600px){.fb-lang{height:40px;padding:0 3px;margin-right:4px;font-size:12px;gap:0}.fb-lang span{min-width:26px;height:32px}.bar:has(.nav-back) .nav-pg{display:none}}';
    d.head.appendChild(st);
    if (before) host.insertBefore(a, before); else host.appendChild(a);
  }
  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', addSwitch); else addSwitch();
})();
