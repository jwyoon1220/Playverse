// /api/members(D1) 로 멤버 카드를 다시 그린다. 실패하면 HTML에 들어있는 정적 카드를 그대로 쓴다.
(function () {
  var esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };
  var color = function (h) { return /^#[0-9a-fA-F]{3,8}$/.test(h) ? h : ''; };

  function card(m, i) {
    var hex = color(m.colorHex);
    var colorVal = [m.colorName, hex].filter(function (v) { return v && v !== hex || v === hex; })
      .filter(function (v, k, a) { return v && a.indexOf(v) === k; }).join(' ');
    var infos = '<div class="pv-info"><dt>생일</dt><dd>' + esc(m.birthday) + '</dd></div>' +
      '<div class="pv-info"><dt>성별</dt><dd>' + esc(m.gender) + '</dd></div>' +
      (colorVal ? '<div class="pv-info"><dt>퍼스널 컬러</dt><dd>' +
        (hex ? '<span class="pv-swatch" style="background:' + hex + '"></span>' : '') + esc(colorVal) + '</dd></div>' : '');
    var extras = (m.extras || []).map(function (e) {
      return '<div class="pv-info"><dt>' + esc(e[0]) + '</dt><dd>' + esc(e[1]) + '</dd></div>';
    }).join('');
    var notes = (m.notes || []).length
      ? '<ul class="pv-notes">' + m.notes.map(function (n) { return '<li>' + esc(n) + '</li>'; }).join('') + '</ul>' : '';
    var rp = (m.rp || extras || notes)
      ? '<div class="pv-rp"><p class="pv-rp-label">RP</p>' + (m.rp ? '<p class="pv-rp-text">' + esc(m.rp) + '</p>' : '') +
        (extras ? '<dl class="pv-infos pv-infos-sm">' + extras + '</dl>' : '') + notes + '</div>' : '';
    return '<section class="pv-member' + (i % 2 ? ' is-reverse' : '') + '" id="' + esc(m.id) + '">' +
      '<div class="pv-member-media" style="background:' + (hex || '#ffffff') + '"><img src="' + esc(m.image) + '" alt="' +
      esc(m.callName) + ' 캐릭터 이미지" loading="' + (i ? 'lazy' : 'eager') + '"/></div>' +
      '<div class="pv-member-text"><h2 class="pv-member-name">' + esc(m.name) + '</h2>' +
      '<p class="pv-member-call">' + esc(m.callName) + (m.aside ? '<span class="pv-aside"> · ' + esc(m.aside) + '</span>' : '') + '</p>' +
      '<dl class="pv-infos">' + infos + '</dl>' + rp + '</div></section>';
  }

  fetch('/api/members')
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(function (list) {
      var box = document.querySelector('.pv-members');
      if (!box || !list.length) return;
      box.innerHTML = list.map(card).join('');
      var jump = document.querySelector('.pv-jump');
      if (jump) {
        var cls = (jump.querySelector('a') || {}).className || '';
        jump.innerHTML = list.map(function (m) {
          return '<a href="#' + esc(m.id) + '" class="' + cls + '">' + esc(m.callName) + '</a>';
        }).join('');
      }
      if (location.hash) { var t = document.getElementById(location.hash.slice(1)); if (t) t.scrollIntoView(); }
    })
    .catch(function () { /* 정적 카드 유지 */ });
})();
