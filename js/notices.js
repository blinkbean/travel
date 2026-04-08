(function () {
  'use strict';

  var BASE_URL = location.hostname === 'localhost' ? 'http://localhost:1337' : '';
  var listEl = document.getElementById('noticeList');
  var emptyEl = document.getElementById('noticeEmpty');

  function normalizeNoticeEntity(item) {
    if (!item) return null;
    if (item.attributes) return Object.assign({ id: item.id }, item.attributes);
    return item;
  }

  function formatTime(value) {
    if (!value) return '';
    var d = new Date(value);
    if (isNaN(d.getTime())) return String(value);
    return d.getFullYear() + '-' +
      String(d.getMonth() + 1).padStart(2, '0') + '-' +
      String(d.getDate()).padStart(2, '0');
  }

  // 简易 Markdown 渲染（支持标题、列表、加粗、换行）
  function renderMarkdown(md) {
    if (!md) return '';
    return md
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/^#{3}\s+(.+)$/gm, '<h4>$1</h4>')
      .replace(/^#{2}\s+(.+)$/gm, '<h3>$1</h3>')
      .replace(/^#{1}\s+(.+)$/gm, '<h2>$1</h2>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/^[\*\-]\s+(.+)$/gm, '<li>$1</li>')
      .replace(/^(\d+)\.\s+(.+)$/gm, '<li>$2</li>')
      .replace(/(<li>[\s\S]*?<\/li>)/g, function(m) { return '<ul>' + m + '</ul>'; })
      .replace(/<\/ul>\s*<ul>/g, '')
      .replace(/\n{2,}/g, '</p><p>')
      .replace(/\n/g, '<br>')
      .replace(/^(?!<[hul])(.+)$/gm, function(m) {
        return m.startsWith('<') ? m : '<p>' + m + '</p>';
      });
  }

  function imgUrl(img) {
    if (!img) return null;
    var url = img.url || '';
    return url.startsWith('http') ? url : BASE_URL + url;
  }

  function buildNoticeCard(notice, idx) {
    var card = document.createElement('article');
    card.className = 'notice-card';

    var lang = localStorage.getItem('mantravel_lang') || 'zh';
    var t = (typeof TRANSLATIONS !== 'undefined') && TRANSLATIONS[lang];
    var fallback = (t && t.noticesFallbackTitle) || '通知';
    var title = notice.title || (fallback + ' #' + (idx + 1));
    var subtitle = notice.subtitle || '';
    var time = formatTime(notice.time || notice.publishedAt || notice.createdAt);
    var contentHtml = renderMarkdown(notice.content || '');
    var mainImg = imgUrl(notice.img);
    var qrImg = imgUrl(notice.qr_img);

    var qrHtml = qrImg ?
      '<div class="notice-qr-wrap">' +
        '<img class="notice-qr" src="' + qrImg + '" alt="群二维码" />' +
        '<p class="notice-qr-tip">' + ((t && t.noticesQrTip) || '扫码加入活动群') + '</p>' +
      '</div>' : '';

    if (mainImg) {
      card.className += ' notice-card-banner';
      card.innerHTML =
        '<img class="notice-banner-image" src="' + mainImg + '" alt="' + title + '" />' +
        '<div class="notice-banner-body">' +
          '<div class="notice-banner-text">' +
            '<div class="notice-card-head">' +
              '<span class="notice-index">#' + String(idx + 1).padStart(2, '0') + '</span>' +
              (time ? '<span class="notice-time">' + time + '</span>' : '') +
            '</div>' +
            '<h3 class="notice-title">' + title + '</h3>' +
            (subtitle ? '<p class="notice-subtitle">' + subtitle + '</p>' : '') +
          '</div>' +
          qrHtml +
        '</div>' +
        (contentHtml ? '<div class="notice-banner-content">' + contentHtml + '</div>' : '');
    } else {
      card.innerHTML =
        '<div class="notice-card-head">' +
          '<span class="notice-index">#' + String(idx + 1).padStart(2, '0') + '</span>' +
          (time ? '<span class="notice-time">' + time + '</span>' : '') +
        '</div>' +
        '<h3 class="notice-title">' + title + '</h3>' +
        (subtitle ? '<p class="notice-subtitle">' + subtitle + '</p>' : '') +
        (contentHtml ? '<div class="notice-content">' + contentHtml + '</div>' : '') +
        qrHtml;
    }

    return card;
  }

  function renderList(rawList) {
    var list = (rawList || []).map(normalizeNoticeEntity).filter(Boolean);
    if (!list.length) {
      listEl.innerHTML = '';
      emptyEl.style.display = 'block';
      return;
    }
    emptyEl.style.display = 'none';
    listEl.innerHTML = '';
    list.forEach(function (item, idx) { listEl.appendChild(buildNoticeCard(item, idx)); });
  }

  function loadNotices() {
    fetch(BASE_URL + '/api/notices/list')
      .then(function (res) { if (!res.ok) throw new Error(); return res.json(); })
      .then(function (json) { renderList(json && json.data); })
      .catch(function () {
        fetch(BASE_URL + '/api/notices?sort[0]=time:desc&sort[1]=sort_order:asc&sort[2]=createdAt:desc&populate=img,qr_img')
          .then(function (res) { if (!res.ok) throw new Error(); return res.json(); })
          .then(function (json) { renderList(json && json.data); })
          .catch(function () { renderList([]); });
      });
  }

  loadNotices();
})();
