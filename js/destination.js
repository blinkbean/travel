/* ================================================
   漫旅中国 ManTravel — Destination Detail Page JS
   ================================================ */

(function () {
  'use strict';

  /* ---- 读取 URL 参数 ---- */
  function getParam(name) {
    return new URLSearchParams(window.location.search).get(name);
  }

  var slug = getParam('slug');

  /* ---- Navbar scroll effect ---- */
  var navbar = document.getElementById('navbar');
  function updateNavbar() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();

  /* ---- Mobile nav toggle ---- */
  var navToggle = document.getElementById('navToggle');
  var navLinks = document.getElementById('navLinks');

  navToggle.addEventListener('click', function () {
    navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', navLinks.classList.contains('open'));
  });
  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('open');
    });
  });
  document.addEventListener('click', function (e) {
    if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove('open');
    }
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
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-html');
      if (t[key] !== undefined) el.innerHTML = t[key];
    });
    document.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-aria');
      if (t[key] !== undefined) el.setAttribute('aria-label', t[key]);
    });
    if (t.siteTitle) document.title = t.siteTitle;
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
      if (lang) {
        applyTranslations(lang);
        updateLangUI(lang);
        renderDestDetail(lang);
      }
    });
  });
  applyTranslations(currentLang);
  updateLangUI(currentLang);

  /* ---- 加载目的地详情 ---- */
  var _destData = null;

  function loadDestDetail() {
    if (!slug) {
      showError();
      return;
    }
    fetch('/api/destinations?filters[dest_value][$eq]=' + encodeURIComponent(slug) + '&pagination[limit]=1')
      .then(function (res) { return res.json(); })
      .then(function (json) {
        var items = json.data || [];
        if (items.length === 0) {
          showError();
          return;
        }
        _destData = items[0];
        renderDestDetail(currentLang);
      })
      .catch(function () {
        showError();
      });
  }

  function renderDestDetail(lang) {
    if (!_destData) return;

    var name = _destData['name_' + lang] || _destData.name_zh || '';
    var subtitle = _destData['subtitle_' + lang] || _destData.subtitle_zh || '';
    var imageUrl = _destData.image || '';
    var mdContent = _destData['content_' + lang] || _destData.content_zh || '';

    // 更新页面标题
    document.title = name + ' — 漫旅世界·中国 ManTravel';

    // 更新 Hero 区域
    var heroName = document.getElementById('destHeroName');
    var heroSubtitle = document.getElementById('destHeroSubtitle');
    var heroBg = document.getElementById('destHeroBg');

    if (heroName) heroName.textContent = name;
    if (heroSubtitle) heroSubtitle.textContent = subtitle;

    if (heroBg && imageUrl && /^https?:\/\//.test(imageUrl)) {
      heroBg.style.backgroundImage = 'url("' + imageUrl + '")';
    } else if (heroBg) {
      heroBg.className = 'dest-detail-hero-bg dest-hero-bg-' + slug;
    }

    // 渲染 Markdown 内容
    var skeleton = document.getElementById('destMdSkeleton');
    var body = document.getElementById('destMdBody');
    var empty = document.getElementById('destMdEmpty');

    if (skeleton) skeleton.style.display = 'none';

    if (mdContent && mdContent.trim()) {
      if (body) {
        // 使用 marked.js 渲染，开启安全模式
        var rendered = (typeof marked !== 'undefined')
          ? marked.parse(mdContent, { breaks: true })
          : mdContent.replace(/\n/g, '<br>');
        body.innerHTML = rendered;
        body.style.display = 'block';
      }
      if (empty) empty.style.display = 'none';
    } else {
      if (body) body.style.display = 'none';
      if (empty) empty.style.display = 'block';
    }

    // 隐藏 loading，显示内容
    var loading = document.getElementById('destLoading');
    var content = document.getElementById('destContent');
    if (loading) loading.style.display = 'none';
    if (content) content.style.display = 'block';
  }

  function showError() {
    var loading = document.getElementById('destLoading');
    var errorEl = document.getElementById('destError');
    if (loading) loading.style.display = 'none';
    if (errorEl) errorEl.style.display = 'flex';
  }

  loadDestDetail();

})();
