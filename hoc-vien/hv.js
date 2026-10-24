/* Học viện Farmblock: bộ đọc nội dung + tự làm nổi bật.
   Dùng chung cho: trang danh sách, trang bài, trang soạn bài, và script dựng sẵn (node). */
(function (root) {
  'use strict';
  var HV = {};
  HV.TOPICS = ['Cơ bản', 'Nâng cao', 'Hóa học đất', 'Sinh học đất', 'Dinh dưỡng cây trồng', 'Nước', 'Hệ thống tưới', 'Sinh lý thực vật', 'Giống và nhân giống', 'Canh tác cà phê', 'Nền tảng bảo vệ thực vật', 'Quan sát và chẩn đoán', 'Nông nghiệp số', 'IoT và cảm biến', 'Camera và thị giác máy tính', 'Dữ liệu vận hành', 'Truy xuất nguồn gốc', 'Tiêu chuẩn và chứng nhận', 'Những khái niệm cơ bản', 'Hệ sinh thái nông nghiệp', 'Cấu tạo và tính chất đất'];
  var MONTHS = ['tháng 1', 'tháng 2', 'tháng 3', 'tháng 4', 'tháng 5', 'tháng 6', 'tháng 7', 'tháng 8', 'tháng 9', 'tháng 10', 'tháng 11', 'tháng 12'];

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  HV.esc = esc;
  /* chữ trong khối: cho phép <b>, <strong>, <i>, <em>, <a href>, <br> */
  function clean(h) {
    h = String(h || '');
    h = h.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
    return h.replace(/<(\/?)([a-z0-9]+)([^>]*)>/gi, function (m, sl, tag, attrs) {
      tag = tag.toLowerCase();
      if (tag === 'strong') tag = 'b';
      if (tag === 'em') tag = 'i';
      if (tag === 'b' || tag === 'i' || tag === 'br') return '<' + sl + tag + '>';
      if (tag === 'a') {
        if (sl) return '</a>';
        var hr = /href\s*=\s*"([^"]*)"/i.exec(attrs) || /href\s*=\s*'([^']*)'/i.exec(attrs);
        var u = hr ? hr[1] : '';
        if (!/^(https?:|mailto:|tel:|#|\.?\/?[a-z0-9])/i.test(u) || /^javascript:/i.test(u)) return '';
        return '<a href="' + esc(u) + '"' + (/^https?:/i.test(u) ? ' target="_blank" rel="noopener"' : '') + '>';
      }
      return '';
    });
  }
  HV.clean = clean;
  function txt(h) { return String(h || '').replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/\s+/g, ' ').trim(); }
  HV.txt = txt;

  HV.slug = function (s) {
    s = String(s || '').toLowerCase().replace(/đ/g, 'd');
    if (s.normalize) s = s.normalize('NFD').replace(/[̀-ͯ]/g, '');
    return s.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80) || 'bai-viet';
  };
  HV.dateLong = function (iso) { var p = String(iso || '').split('-'); if (p.length < 3) return iso || ''; return (+p[2] < 10 ? '0' : '') + (+p[2]) + ' ' + MONTHS[+p[1] - 1] + ', ' + p[0]; };
  HV.dateShort = function (iso) { var p = String(iso || '').split('-'); return p.length < 3 ? (iso || '') : p[2] + '/' + p[1] + '/' + p[0]; };

  /* ---------- 1. đọc văn bản thường ---------- */
  function looksHeading(line, next) {
    if (line.length > 110 || line.length < 4) return false;
    if (/[.;:,!…]$/.test(line)) return false;
    if (/^[-•*\d]/.test(line) && !/^\d+\.\s+[A-ZĐÀ-Ỹ]/.test(line)) return false;
    return !!next && next.length > line.length;
  }
  HV.parseText = function (text) {
    var lines = String(text || '').replace(/\r/g, '').split('\n').map(function (l) { return l.trim(); });
    var paras = [], buf = [];
    lines.forEach(function (l) { if (!l) { if (buf.length) { paras.push(buf); buf = []; } } else buf.push(l); });
    if (buf.length) paras.push(buf);
    var blocks = [];
    paras.forEach(function (ls, pi) {
      var i = 0;
      while (i < ls.length) {
        var l = ls[i], m;
        if ((m = /^(#{1,3})\s+(.+)$/.exec(l))) { blocks.push({ t: m[1].length >= 3 ? 'h3' : 'h2', x: esc(m[2]) }); i++; continue; }
        if (/^[-•*]\s+/.test(l)) {
          var items = [];
          while (i < ls.length && /^[-•*]\s+/.test(ls[i])) { items.push(clean(esc(ls[i].replace(/^[-•*]\s+/, '')).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>'))); i++; }
          blocks.push({ t: 'ul', items: items }); continue;
        }
        if ((m = /^!\[([^\]]*)\]\(([^)]+)\)$/.exec(l))) { blocks.push({ t: 'img', src: m[2], alt: m[1] }); i++; continue; }
        if (ls.length === 1 && looksHeading(l, (paras[pi + 1] || [])[0])) { blocks.push({ t: 'h2', x: esc(l) }); i++; continue; }
        var rest = ls.slice(i).join(' ');
        blocks.push({ t: 'p', x: esc(rest).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>') });
        i = ls.length;
      }
    });
    return blocks;
  };

  /* ---------- 2. đọc nội dung dán từ Word / Google Docs (HTML) ---------- */
  HV.parseHTML = function (html, doc) {
    doc = doc || (typeof document !== 'undefined' ? document : null);
    if (!doc) return HV.parseText(txt(html));
    var box = doc.createElement('div'); box.innerHTML = html;
    var blocks = [];
    function inline(el) {
      var h = '';
      el.childNodes.forEach(function (n) {
        if (n.nodeType === 3) { h += esc(n.nodeValue.replace(/\s+/g, ' ')); return; }
        if (n.nodeType !== 1) return;
        var tag = n.tagName.toLowerCase(), st = (n.getAttribute('style') || '').toLowerCase(), inner = inline(n);
        if (!inner.trim()) { if (tag === 'br') h += ' '; return; }
        var bold = tag === 'b' || tag === 'strong' || /font-weight:\s*(bold|[6-9]00)/.test(st);
        var ital = tag === 'i' || tag === 'em' || /font-style:\s*italic/.test(st);
        if (tag === 'b' && /font-weight:\s*normal/.test(st)) bold = false;
        if (tag === 'a' && n.getAttribute('href')) inner = '<a href="' + esc(n.getAttribute('href')) + '">' + inner + '</a>';
        if (ital) inner = '<i>' + inner + '</i>';
        if (bold) inner = '<b>' + inner + '</b>';
        h += inner;
      });
      return h;
    }
    function walk(el) {
      el.childNodes.forEach(function (n) {
        if (n.nodeType === 3) { var t = n.nodeValue.trim(); if (t) blocks.push({ t: 'p', x: esc(t) }); return; }
        if (n.nodeType !== 1) return;
        var tag = n.tagName.toLowerCase();
        if (/^h[1-2]$/.test(tag) || (n.getAttribute('data-hv') === 'h2')) { var x = txt(n.innerHTML); if (x) blocks.push({ t: 'h2', x: esc(x) }); return; }
        if (/^h[3-6]$/.test(tag) || (n.getAttribute('data-hv') === 'h3')) { var y = txt(n.innerHTML); if (y) blocks.push({ t: 'h3', x: esc(y) }); return; }
        if (tag === 'ul' || tag === 'ol') { var it = []; n.querySelectorAll(':scope > li').forEach(function (li) { var v = clean(inline(li)).trim(); if (v) it.push(v); }); if (it.length) blocks.push({ t: tag, items: it }); return; }
        if (tag === 'img') { var s = n.getAttribute('src'); if (s) blocks.push({ t: 'img', src: s, alt: n.getAttribute('alt') || '' }); return; }
        if (tag === 'figure') { var im = n.querySelector('img'); if (im) blocks.push({ t: 'img', src: im.getAttribute('src'), alt: im.getAttribute('alt') || '', cap: n.querySelector('figcaption') ? txt(n.querySelector('figcaption').innerHTML) : '' }); return; }
        if (tag === 'blockquote') { var q = clean(inline(n)).trim(); if (q) blocks.push({ t: 'quote', x: q }); return; }
        if (tag === 'p' || tag === 'div' || tag === 'li') {
          if (n.querySelector('p,div,ul,ol,h1,h2,h3,h4,img,table')) { walk(n); return; }
          var v = clean(inline(n)).trim(); if (!v) return;
          var plain = txt(v);
          /* đoạn chỉ gồm một dòng in đậm ngắn: coi là tiêu đề */
          if (/^<b>[^<]*<\/b>$/.test(v) && plain.length < 110 && !/[.;,]$/.test(plain)) { blocks.push({ t: 'h2', x: esc(plain) }); return; }
          if (/^#{1,3}\s/.test(plain)) { blocks = blocks.concat(HV.parseText(plain)); return; }
          if (/^[-•]\s+/.test(plain)) { var last = blocks[blocks.length - 1]; var item = v.replace(/^\s*[-•]\s+/, ''); if (last && last.t === 'ul') last.items.push(item); else blocks.push({ t: 'ul', items: [item] }); return; }
          blocks.push({ t: 'p', x: v }); return;
        }
        if (tag === 'table') { n.querySelectorAll('tr').forEach(function (tr) { var c = [].map.call(tr.children, function (td) { return txt(td.innerHTML); }).filter(Boolean); if (c.length) blocks.push({ t: 'p', x: esc(c.join(' – ')) }); }); return; }
        walk(n);
      });
    }
    walk(box);
    /* nếu không có tiêu đề nào: thử nhận diện như văn bản thường */
    if (!blocks.some(function (b) { return b.t === 'h2'; })) {
      for (var i = 0; i < blocks.length - 1; i++) { var b = blocks[i]; if (b.t === 'p' && looksHeading(txt(b.x), txt(blocks[i + 1].x || ''))) blocks[i] = { t: 'h2', x: esc(txt(b.x)) }; }
    }
    return blocks;
  };

  /* ---------- 3. tự làm nổi bật ---------- */
  var STEP_RE = /^(Nguyên tắc|Cách|Các bước|Quy trình|Biện pháp|Giải pháp|Hướng dẫn)/i;
  var NOTE_RE = /^(Tuy nhiên, cần lưu ý|Cần lưu ý|Lưu ý|Chú ý)/i;
  var ROLE_RE = /(?:^|\.\s+)Đối với ([^,]{2,40}),/g;
  function firstSentence(h) { var t = txt(h); var m = /^(.+?[.!?])(\s+[A-ZĐÀ-Ỹ]|$)/.exec(t); return m ? m[1] : t; }
  function words(s) { return txt(s).split(' '); }
  function commonPrefix(list) { var w = words(list[0]); for (var i = 1; i < list.length; i++) { var o = words(list[i]), k = 0; while (k < w.length && k < o.length && w[k].toLowerCase() === o[k].toLowerCase()) k++; w = w.slice(0, k); } return w.join(' '); }
  function cap(s) { s = s.trim(); return s.charAt(0).toUpperCase() + s.slice(1); }

  HV.analyze = function (blocks) {
    /* chia theo tiêu đề lớn */
    var secs = [], cur = { h: null, body: [] };
    blocks.forEach(function (b) { if (b.t === 'h2') { secs.push(cur); cur = { h: b, body: [] }; } else cur.body.push(b); });
    secs.push(cur);
    var found = [];
    var heads = secs.filter(function (s) { return s.h; });
    /* a. định nghĩa nhanh */
    if (heads[0] && /^Định nghĩa/i.test(txt(heads[0].h.x)) && heads[0].body[0] && heads[0].body[0].t === 'p') found.push({ id: 'def', kind: 'def', label: 'Hộp "Định nghĩa nhanh" ở đầu bài', sec: secs.indexOf(heads[0]) });
    /* b. bảng tổng quan cho các tiêu đề cùng chủ đề */
    var groups = {};
    heads.forEach(function (s) {
      var t = txt(s.h.x); if (STEP_RE.test(t) || /^(Định nghĩa|Ý nghĩa)/i.test(t)) return;
      var key = words(t).slice(0, 2).join(' ').toLowerCase(); (groups[key] = groups[key] || []).push(s);
    });
    Object.keys(groups).forEach(function (k, gi) {
      var g = groups[k]; if (g.length < 2) return;
      var pre = commonPrefix(g.map(function (s) { return s.h.x; }));
      found.push({ id: 'tbl-' + HV.slug(k), kind: 'table', label: 'Bảng tổng quan "' + pre + '" (' + g.length + ' mục)', sec: secs.indexOf(g[0]), group: g.map(function (s) { return secs.indexOf(s); }), pre: pre });
    });
    /* c. các bước / nguyên tắc thành thẻ đánh số */
    heads.forEach(function (s) {
      var ps = s.body.filter(function (b) { return b.t === 'p'; });
      if (STEP_RE.test(txt(s.h.x)) && ps.length >= 2 && ps.length === s.body.length) found.push({ id: 'steps-' + secs.indexOf(s), kind: 'steps', label: 'Thẻ đánh số cho "' + txt(s.h.x) + '" (' + ps.length + ' bước)', sec: secs.indexOf(s) });
    });
    /* d. đoạn "Đối với ..." thành các thẻ vai trò */
    secs.forEach(function (s, si) {
      s.body.forEach(function (b, bi) {
        if (b.t !== 'p') return; var m = txt(b.x).match(ROLE_RE);
        if (m && m.length >= 2) found.push({ id: 'roles-' + si + '-' + bi, kind: 'roles', label: 'Tách ' + m.length + ' thẻ màu theo "Đối với…" (' + (s.h ? txt(s.h.x) : 'mở đầu') + ')', sec: si, bi: bi });
      });
    });
    /* e. lưu ý */
    secs.forEach(function (s, si) { s.body.forEach(function (b, bi) { if (b.t === 'p' && NOTE_RE.test(txt(b.x))) found.push({ id: 'note-' + si + '-' + bi, kind: 'note', label: 'Hộp "Lưu ý" màu cam (' + (s.h ? txt(s.h.x) : 'mở đầu') + ')', sec: si, bi: bi }); }); });
    return { secs: secs, found: found };
  };

  var ROLE_C = ['#3A8047', '#2F8FB5', '#C98A12', '#B3121F', '#7EBF3A'];
  var ROLE_I = {
    'chủ đất': '<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>',
    'cơ quan quản lý': '<path d="M3 21h18M4 10h16M12 3l9 5H3z"/><path d="M6 10v8M10 10v8M14 10v8M18 10v8"/>',
    'đối tác kỹ thuật': '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.4-.6-.6-2.4z"/>'
  };
  function roleIcon(r) { var k = Object.keys(ROLE_I).filter(function (x) { return r.toLowerCase().indexOf(x) >= 0; })[0]; return '<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + (k ? ROLE_I[k] : '<circle cx="12" cy="8" r="4"/><path d="M4 21c1-5 5-7 8-7s7 2 8 7"/>') + '</g></svg>'; }

  function block(b) {
    if (b.t === 'p') return '<p>' + clean(b.x) + '</p>';
    if (b.t === 'h3') return '<h3>' + clean(b.x) + '</h3>';
    if (b.t === 'ul' || b.t === 'ol') return '<' + b.t + '>' + b.items.map(function (i) { return '<li>' + clean(i) + '</li>'; }).join('') + '</' + b.t + '>';
    if (b.t === 'quote') return '<blockquote>' + clean(b.x) + '</blockquote>';
    if (b.t === 'img') return '<figure class="hv-fig"><img src="' + esc(b.src) + '" alt="' + esc(b.alt || '') + '" loading="lazy">' + (b.cap ? '<figcaption>' + esc(b.cap) + '</figcaption>' : '') + '</figure>';
    return '';
  }

  /* ---------- 4. dựng bài viết ---------- */
  HV.render = function (post) {
    var off = post.off || [];
    var an = HV.analyze(post.blocks || []), secs = an.secs, heads2 = secs.filter(function (s) { return s.h; });
    var on = an.found.filter(function (f) { return off.indexOf(f.id) < 0; });
    function has(kind, si, bi) { return on.filter(function (f) { return f.kind === kind && f.sec === si && (bi == null || f.bi === bi); })[0]; }
    var toc = [], out = [], wordsN = 0, h2n = 0;
    (post.blocks || []).forEach(function (b) { wordsN += txt(b.x || (b.items || []).join(' ')).split(' ').length; });
    secs.forEach(function (s, si) {
      /* bảng tổng quan đặt trước mục đầu tiên của nhóm */
      on.filter(function (f) { return f.kind === 'table' && f.sec === si; }).forEach(function (f) {
        var rows = f.group.map(function (gi) { var g = secs[gi]; var lab = txt(g.h.x).slice(f.pre.length).trim() || txt(g.h.x); var p = g.body.filter(function (b) { return b.t === 'p'; })[0]; return '<tr><th scope="row"><a href="#muc-' + (heads2.indexOf(g) + 1) + '">' + esc(cap(lab)) + '</a></th><td>' + esc(p ? firstSentence(p.x) : '') + '</td></tr>'; }).join('');
        out.push('<div class="hv-tbl" data-hv="' + f.id + '"><p class="hv-tbl-t"><span class="hv-chip">Tổng quan</span>' + esc(f.pre) + '</p><div class="hv-tbl-s"><table><thead><tr><th scope="col">' + esc(f.pre) + '</th><th scope="col">Điểm chính</th></tr></thead><tbody>' + rows + '</tbody></table></div></div>');
      });
      if (s.h) { h2n++; var id = 'muc-' + h2n; toc.push({ id: id, t: txt(s.h.x) }); out.push('<h2 id="' + id + '">' + clean(s.h.x) + '</h2>'); }
      var stepF = has('steps', si);
      if (stepF) {
        out.push('<ol class="hv-steps" data-hv="' + stepF.id + '">' + s.body.map(function (b, i) { return '<li class="hv-s' + (i % 4) + '"><span class="hv-n" aria-hidden="true">' + (i + 1) + '</span><p>' + clean(b.x) + '</p></li>'; }).join('') + '</ol>');
        return;
      }
      s.body.forEach(function (b, bi) {
        if (bi === 0 && si === (has('def', si) || {}).sec && b.t === 'p') { out.push('<div class="hv-def" data-hv="def"><span class="hv-chip">Định nghĩa nhanh</span><p>' + clean(b.x) + '</p></div>'); return; }
        var rf = has('roles', si, bi);
        if (rf) {
          var t = clean(b.x), parts = t.split(/(?=Đối với [^,]{2,40},)/);
          var lead = parts[0].trim() && !/^Đối với/.test(parts[0]) ? parts.shift() : '';
          if (lead) out.push('<p>' + lead + '</p>');
          out.push('<div class="hv-roles" data-hv="' + rf.id + '">' + parts.map(function (p, i) { var r = (/^Đối với ([^,]{2,40}),/.exec(txt(p)) || [, ''])[1]; return '<div class="hv-role" style="--rc:' + ROLE_C[i % ROLE_C.length] + '"><p class="hv-role-h"><span class="hv-role-i">' + roleIcon(r) + '</span>' + esc(cap(r)) + '</p><p>' + p.trim() + '</p></div>'; }).join('') + '</div>');
          return;
        }
        var nf = has('note', si, bi);
        if (nf) { out.push('<div class="hv-note" data-hv="' + nf.id + '"><span class="hv-chip">Lưu ý</span><p>' + clean(b.x) + '</p></div>'); return; }
        out.push(block(b));
      });
    });
    return { html: out.join('\n'), toc: toc, minutes: Math.max(1, Math.round(wordsN / 230)), found: an.found };
  };

  /* ---------- 5. thẻ bài cho danh sách ---------- */
  HV.card = function (p, base) {
    base = base || '';
    return '<a class="hvc" href="' + base + 'hoc-vien-' + p.slug + '.html" data-page><span class="hvc-img"><img src="' + base + (p.thumb || p.cover) + '" width="800" height="450" alt="" loading="lazy"></span><span class="hvc-tx"><span class="hvc-d">' + esc(HV.dateShort(p.date)) + '</span><b>' + esc(p.title) + '</b><span class="hvc-tags">' + (p.tags || []).map(function (t) { return '<i>' + esc(t) + '</i>'; }).join('') + '</span><span class="hvc-ex">' + esc(p.excerpt) + '</span><span class="hvc-r">Đọc bài<svg aria-hidden="true"><use href="#arr"/></svg></span></span></a>';
  };

  /* ---------- 6. trang bài hoàn chỉnh từ khuôn mẫu ---------- */
  HV.page = function (tpl, post, site) {
    var r = HV.render(post), url = (site || '') + 'hoc-vien-' + post.slug + '.html';
    var tocH = r.toc.map(function (t) { return '<li><a href="#' + t.id + '">' + esc(t.t) + '</a></li>'; }).join('\n');
    var ld = { '@context': 'https://schema.org', '@type': 'Article', headline: post.title, description: post.excerpt, datePublished: post.date, image: (site || '') + post.cover, author: { '@type': 'Organization', name: 'Farmblock' }, publisher: { '@type': 'Organization', name: 'Farmblock' }, mainEntityOfPage: url };
    var map = {
      TITLE: esc(post.title), DESC: esc(post.excerpt), URL: esc(url), OGIMG: esc((site || '') + post.cover), SLUG: esc(post.slug),
      COVER: esc(post.cover), DATE_ISO: esc(post.date), DATE: esc(HV.dateLong(post.date)), MINS: r.minutes, AUTHOR: esc(post.author || 'Farmblock Admin'),
      CAT: esc((post.tags || [])[0] || 'Học viện'), TAGS: (post.tags || []).map(function (t) { return '<span class="hv-tag">' + esc(t) + '</span>'; }).join(''),
      TOC: tocH, BODY: r.html, JSONLD: JSON.stringify(ld).replace(/</g, '\\u003c')
    };
    return tpl.replace(/\{\{([A-Z_]+)\}\}/g, function (m, k) { return map[k] != null ? map[k] : m; });
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = HV; else root.HV = HV;
})(this);
