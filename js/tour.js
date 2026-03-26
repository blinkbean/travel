/* ================================================
   漫旅中国 ManTravel — Tour Detail Page JS
   ================================================ */

(function () {
  var BASE_URL = location.hostname === 'localhost' ? 'http://localhost:1337' : '';
  'use strict';

  var tourId = new URLSearchParams(window.location.search).get('id');

  /* ---- Navbar scroll ---- */
  var navbar = document.getElementById('navbar');
  function updateNavbar() {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }
  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();

  /* ---- Mobile nav ---- */
  var navToggle = document.getElementById('navToggle');
  var navLinks = document.getElementById('navLinks');
  navToggle.addEventListener('click', function () {
    navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', navLinks.classList.contains('open'));
  });
  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () { navLinks.classList.remove('open'); });
  });
  document.addEventListener('click', function (e) {
    if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove('open');
    }
  });

  /* ---- Back to top ---- */
  var backToTop = document.getElementById('backToTop');
  window.addEventListener('scroll', function () {
    backToTop.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });
  backToTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---- i18n ---- */
  var LANG_KEY = 'mantravel_lang';
  var currentLang = localStorage.getItem(LANG_KEY) || 'zh';
  var LANG_LABELS = { zh: '中文', en: 'English', es: 'Español' };

  function applyTranslations(lang) {
    var t = (typeof TRANSLATIONS !== 'undefined') && TRANSLATIONS[lang];
    if (!t) return;
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (t[key] !== undefined) el.textContent = t[key];
    });
    document.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-aria');
      if (t[key] !== undefined) el.setAttribute('aria-label', t[key]);
    });
    var langMap = { zh: 'zh-CN', en: 'en', es: 'es' };
    document.documentElement.lang = langMap[lang] || lang;
    currentLang = lang;
    localStorage.setItem(LANG_KEY, lang);
  }

  function updateLangUI(lang) {
    var label = document.getElementById('langLabel');
    if (label) label.textContent = LANG_LABELS[lang] || lang;
    document.querySelectorAll('.lang-option').forEach(function (opt) {
      opt.classList.toggle('active', opt.getAttribute('data-lang') === lang);
    });
    var btn = document.getElementById('langDropdownBtn');
    if (btn) btn.setAttribute('aria-expanded', 'false');
    var dropdown = document.getElementById('langSwitcher');
    if (dropdown) dropdown.classList.remove('open');
  }

  var langDropdownBtn = document.getElementById('langDropdownBtn');
  if (langDropdownBtn) {
    langDropdownBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      var dropdown = document.getElementById('langSwitcher');
      var isOpen = dropdown.classList.toggle('open');
      langDropdownBtn.setAttribute('aria-expanded', isOpen);
    });
  }
  document.addEventListener('click', function (e) {
    var dropdown = document.getElementById('langSwitcher');
    if (dropdown && !dropdown.contains(e.target)) {
      dropdown.classList.remove('open');
      if (langDropdownBtn) langDropdownBtn.setAttribute('aria-expanded', 'false');
    }
  });
  document.querySelectorAll('.lang-option').forEach(function (opt) {
    opt.addEventListener('click', function () {
      var lang = this.getAttribute('data-lang');
      if (lang && _tourData) {
        applyTranslations(lang);
        updateLangUI(lang);
        renderTourDetail(lang);
      }
    });
  });
  applyTranslations(currentLang);
  updateLangUI(currentLang);

  /* ---- 加载线路数据 ---- */
  var _tourData = null;

  function loadTourDetail() {
    if (!tourId) { showError(); return; }
    fetch(BASE_URL + '/api/tours/' + encodeURIComponent(tourId))
      .then(function (res) { return res.json(); })
      .then(function (json) {
        if (!json.data) { showError(); return; }
        _tourData = json.data;
        renderTourDetail(currentLang);
      })
      .catch(function () { showError(); });
  }

  function renderTourDetail(lang) {
    if (!_tourData) return;

    var d = _tourData;
    var title    = d['title_'    + lang] || d.title_zh    || '';
    var route    = d['route_'    + lang] || d.route_zh    || '';
    var desc     = d['description_' + lang] || d.description_zh || '';
    var duration = d['duration_' + lang] || d.duration_zh || '';
    var highlights = d['highlights_' + lang] || d.highlights_zh || [];
    var detail = d['detail_' + lang] || d.detail_zh || '';
    var price = d.price ? '￥' + Number(d.price).toLocaleString() : '';
    var imageUrl = d.image || '';

    document.title = title + ' — 漫旅世界·中国 ManTravel';

    /* ---- 背景 ---- */
    var bgStyle = '';
    var bgClass = '';
    if (imageUrl && /^https?:\/\//.test(imageUrl)) {
      bgStyle = 'style="background-image:url(\'' + imageUrl + '\')"';
    } else {
      bgClass = imageUrl || ('tour-img-default');
    }

    /* ---- badge ---- */
    var badgeHtml = '';
    if (d.badge === 'popular') badgeHtml = '<span class="tour-detail-badge">最受欢迎</span>';
    if (d.badge === 'new')     badgeHtml = '<span class="tour-detail-badge tour-detail-badge-new">新线路</span>';

    /* ---- highlights ---- */
    var hlHtml = (Array.isArray(highlights) ? highlights : []).map(function (h) {
      return '<li><span class="hl-dot"></span>' + h + '</li>';
    }).join('');

    /* ---- price label ---- */
    var priceLabel = lang === 'en' ? 'From' : lang === 'es' ? 'Desde' : '起价';
    var perLabel   = lang === 'en' ? '/person' : lang === 'es' ? '/persona' : '/人';
    var ctaLabel   = lang === 'en' ? 'Book This Tour' : lang === 'es' ? 'Reservar ahora' : '立即预订此线路';
    var routeLabel = lang === 'en' ? 'Route' : lang === 'es' ? 'Ruta' : '路线';
    var hlLabel    = lang === 'en' ? 'Highlights' : lang === 'es' ? 'Destacados' : '行程亮点';

    var html =
      /* Hero */
      '<section class="tour-detail-hero">' +
        '<div class="tour-detail-hero-bg ' + bgClass + '" ' + bgStyle + '></div>' +
        '<div class="tour-detail-hero-overlay"></div>' +
        '<div class="tour-detail-hero-content">' +
          // '<div class="tour-detail-meta-row">' +
          //   badgeHtml +
          //   '<span class="tour-detail-duration-tag">' + duration + '</span>' +
          // '</div>' +
          '<h1 class="tour-detail-title" style="display: flex; align-items: center;">' +
            '<a href="javascript:void(0)" onclick="window.history.back()" style="display: inline-flex; align-items: center; justify-content: center; width: 42px; height: 42px; border-radius: 50%; background-color: rgba(255,255,255,0.2); margin-right: 16px; cursor: pointer;">' +
              '<svg viewBox="0 0 24 24" width="22" height="22" fill="none"><path d="M19 12H5M5 12l7-7M5 12l7 7" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
            '</a>' +
            title +
          '</h1>' +
        '</div>' +
      '</section>' +

      /* Body */
      '<div class="tour-detail-body container">' +

        /* Left: main content */
        '<div class="tour-detail-main">' +
          '<p class="tour-detail-desc">' + desc + '</p>' +
          // '<div class="tour-detail-highlights">' +
          //   '<h3 class="tour-detail-section-title">' + hlLabel + '</h3>' +
          //   '<ul class="tour-hl-list">' + hlHtml + '</ul>' +
          // '</div>' +
          (detail ? '<div class="tour-detail-markdown">' + (typeof marked !== 'undefined' ? marked.parse(detail) : detail) + '</div>' : '') +
        '</div>' +

        /* Right: sidebar */
        '<aside class="tour-detail-sidebar">' +
          '<div class="tour-sidebar-card">' +
            '<div class="tour-sidebar-price">' +
              '<span class="sidebar-price-from">' + priceLabel + '</span>' +
              '<span class="sidebar-price-num">' + price + '</span>' +
              '<span class="sidebar-price-per">' + perLabel + '</span>' +
            '</div>' +
            '<div class="tour-sidebar-info">' +
              '<div class="sidebar-info-row">' +
                '<span class="sidebar-info-label">' + routeLabel + '</span>' +
                '<span class="sidebar-info-val">' + route + '</span>' +
              '</div>' +
              '<div class="sidebar-info-row">' +
                '<span class="sidebar-info-label">' + (lang === 'en' ? 'Duration' : lang === 'es' ? 'Duración' : '天数') + '</span>' +
                '<span class="sidebar-info-val">' + duration + '</span>' +
              '</div>' +
            '</div>' +
            // '<a href="index.html#contact" class="btn btn-primary tour-sidebar-cta">' + ctaLabel + '</a>' +
          '</div>' +
        '</aside>' +

      '</div>' +

      /* CTA footer */
      '<section class="dest-detail-cta">' +
        '<div class="container dest-detail-cta-inner">' +
          '<h2 class="dest-detail-cta-title">' + (lang === 'en' ? 'Ready to explore China?' : lang === 'es' ? '¿Listo para explorar China?' : '准备好踏上旅途了吗？') + '</h2>' +
          '<p class="dest-detail-cta-desc">' + (lang === 'en' ? 'Tell us your travel dream and we\'ll create a tailor-made itinerary for you.' : lang === 'es' ? 'Cuéntanos tu sueño de viaje y crearemos un itinerario a medida.' : '告诉我们您的旅行梦想，我们将在 24 小时内为您量身定制专属行程') + '</p>' +
          '<a href="index.html#contact" class="btn btn-primary">' + (lang === 'en' ? 'Customize My Trip' : lang === 'es' ? 'Personalizar mi viaje' : '立即定制行程') + '</a>' +
        '</div>' +
      '</section>';

    var container = document.getElementById('tourContent');
    container.innerHTML = html;
    container.style.display = 'block';

    document.getElementById('tourLoading').style.display = 'none';
  }

  function showError() {
    document.getElementById('tourLoading').style.display = 'none';
    document.getElementById('tourError').style.display = 'flex';
  }

  loadTourDetail();

})();
