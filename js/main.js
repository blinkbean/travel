/* ================================================
   漫旅中国 ManTravel — Main JavaScript
   ================================================ */

(function () {
  var BASE_URL = location.hostname === 'localhost' ? 'http://localhost:1337' : '';
  'use strict';

  /* ---- Navbar scroll effect ---- */
  const navbar = document.getElementById('navbar');
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
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  navToggle.addEventListener('click', function () {
    navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', navLinks.classList.contains('open'));
  });

  // Close mobile nav when a link is clicked
  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('open');
    });
  });

  // Close mobile nav when clicking outside
  document.addEventListener('click', function (e) {
    if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove('open');
    }
  });

  /* ---- Hero slide show ---- */
  const slides = document.querySelectorAll('.slide');
  let currentSlide = 0;

  function nextSlide() {
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
  }

  setInterval(nextSlide, 5000);

  /* ---- Smooth scrolling for all anchor links ---- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 72; // navbar height
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  /* ---- Stats counter animation ---- */
  const statNums = document.querySelectorAll('.stat-num');
  let statsAnimated = false;

  function animateStats() {
    if (statsAnimated) return;
    const section = document.querySelector('.stats');
    if (!section) return;
    const rect = section.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.85) {
      statsAnimated = true;
      statNums.forEach(function (el) {
        const target = parseInt(el.getAttribute('data-target'), 10);
        const duration = 1600;
        const step = 16;
        const increment = target / (duration / step);
        let current = 0;
        const timer = setInterval(function () {
          current += increment;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          el.textContent = Math.floor(current).toLocaleString();
        }, step);
      });
    }
  }

  window.addEventListener('scroll', animateStats, { passive: true });
  animateStats();

  /* ---- Reviews slider ---- */
  const dotsContainer = document.getElementById('revDots');
  const prevBtn = document.getElementById('revPrev');
  const nextBtn = document.getElementById('revNext');

  var reviewSliderState = null;

  function initReviewsSlider() {
    var track = document.getElementById('reviewsTrack');
    if (!track) return;
    var cards = track.querySelectorAll('.review-card');
    if (!cards.length) return;

    function getVisibleCount() {
      if (window.innerWidth <= 768) return 1;
      if (window.innerWidth <= 1024) return 2;
      return 3;
    }

    var visibleCount = getVisibleCount();
    var currentIndex = 0;
    var totalSlides = Math.ceil(cards.length / visibleCount);
    var dots = [];

    function buildDots() {
      dotsContainer.innerHTML = '';
      dots = [];
      totalSlides = Math.ceil(cards.length / visibleCount);
      for (var i = 0; i < totalSlides; i++) {
        (function (idx) {
          var dot = document.createElement('button');
          dot.className = 'rev-dot' + (idx === currentIndex ? ' active' : '');
          dot.setAttribute('aria-label', '第' + (idx + 1) + '页');
          dot.addEventListener('click', function () { goTo(idx); });
          dotsContainer.appendChild(dot);
          dots.push(dot);
        })(i);
      }
    }

    function goTo(index) {
      currentIndex = Math.max(0, Math.min(index, totalSlides - 1));
      var cardWidth = cards[0].offsetWidth + 24;
      track.style.transform = 'translateX(-' + (currentIndex * visibleCount * cardWidth) + 'px)';
      dots.forEach(function (d, i) {
        d.classList.toggle('active', i === currentIndex);
      });
    }

    prevBtn.addEventListener('click', function () {
      goTo(currentIndex - 1 < 0 ? totalSlides - 1 : currentIndex - 1);
    });
    nextBtn.addEventListener('click', function () {
      goTo((currentIndex + 1) % totalSlides);
    });

    buildDots();
    goTo(0);

    var autoPlay = setInterval(function () {
      goTo((currentIndex + 1) % totalSlides);
    }, 5000);

    var sliderEl = document.getElementById('reviewsSlider');
    sliderEl.addEventListener('mouseenter', function () { clearInterval(autoPlay); });
    sliderEl.addEventListener('mouseleave', function () {
      autoPlay = setInterval(function () {
        goTo((currentIndex + 1) % totalSlides);
      }, 5000);
    });

    var touchStartX = 0;
    sliderEl.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });
    sliderEl.addEventListener('touchend', function (e) {
      var diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) {
        goTo(diff > 0 ? (currentIndex + 1) % totalSlides : (currentIndex - 1 + totalSlides) % totalSlides);
      }
    }, { passive: true });

    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        var newCount = getVisibleCount();
        if (newCount !== visibleCount) {
          visibleCount = newCount;
          currentIndex = 0;
          buildDots();
          goTo(0);
        }
      }, 200);
    });

    reviewSliderState = { goTo: goTo, buildDots: buildDots };
  }

  /* ---- Scroll reveal animations ---- */
  const revealEls = document.querySelectorAll(
    '.tour-card, .dest-card, .stat-item, .review-card, .about-content, .contact-info, .contact-form'
  );

  revealEls.forEach(function (el, i) {
    el.classList.add('reveal');
    if (i % 3 === 1) el.classList.add('reveal-delay-1');
    if (i % 3 === 2) el.classList.add('reveal-delay-2');
  });

  const revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(function (el) { revealObserver.observe(el); });

  /* ---- Back to top button ---- */
  const backToTop = document.getElementById('backToTop');
  window.addEventListener('scroll', function () {
    backToTop.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });
  backToTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---- Notification widget ---- */
  const notifWidget = document.getElementById('notifWidget');
  const notifClose = document.getElementById('notifClose');
  const notifFab = document.getElementById('notifFab');
  const notifOverlay = document.getElementById('notifOverlay');
  const notifLoading = document.getElementById('notifLoading');
  const notifContent = document.getElementById('notifContent');
  const latestNoticeTitle = document.getElementById('latestNoticeTitle');
  const latestNoticeDesc = document.getElementById('latestNoticeDesc');
  const latestNoticeLink = document.getElementById('latestNoticeLink');

  function isMobile() { return window.innerWidth < 768; }

  // 手机端自动显示遮罩
  if (isMobile()) notifOverlay.classList.add('active');

  function getFabCenter() {
    var r = notifFab.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }

  function hideWidget() {
    var wr = notifWidget.getBoundingClientRect();
    var wx = wr.left + wr.width / 2, wy = wr.top + wr.height / 2;
    var fab = getFabCenter();
    var dx = fab.x - wx, dy = fab.y - wy;
    notifWidget.style.transition = 'none';
    notifWidget.style.transform = '';
    notifWidget.getBoundingClientRect(); // force reflow
    notifWidget.style.transition = '';
    notifWidget.style.transform = 'translate(' + dx + 'px,' + dy + 'px) scale(0)';
    notifWidget.classList.add('notif-hidden');
    notifOverlay.classList.remove('active');
    notifFab.classList.add('visible');
  }

  function showWidget() {
    var fab = getFabCenter();
    var wr = notifWidget.getBoundingClientRect();
    var wx = wr.left + wr.width / 2, wy = wr.top + wr.height / 2;
    var dx = fab.x - wx, dy = fab.y - wy;
    notifWidget.style.transition = 'none';
    notifWidget.style.transform = 'translate(' + dx + 'px,' + dy + 'px) scale(0)';
    notifWidget.classList.remove('notif-hidden');
    notifFab.classList.remove('visible');
    notifWidget.getBoundingClientRect(); // force reflow
    requestAnimationFrame(function() {
      notifWidget.style.transition = '';
      notifWidget.style.transform = '';
      if (isMobile()) notifOverlay.classList.add('active');
    });
  }

  notifClose.addEventListener('click', hideWidget);
  notifFab.addEventListener('click', showWidget);
  notifOverlay.addEventListener('click', hideWidget);

  function normalizeNoticeEntity(item) {
    if (!item) return null;
    if (item.attributes) {
      return Object.assign({ id: item.id, documentId: item.documentId || item.id }, item.attributes);
    }
    return item;
  }

  function stripHtmlTags(text) {
    return String(text || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  }

  function setLatestNoticeView(notice) {
    if (!notice) return;
    var t = (typeof TRANSLATIONS !== 'undefined') && TRANSLATIONS[currentLang];
    var title = notice.title || (t && t.notifHeader) || '最新通知';
    var desc = notice.subtitle || stripHtmlTags(notice.content || '') || (t && t.notifLink) || '点击查看完整通知内容。';

    if (latestNoticeTitle) latestNoticeTitle.textContent = title;
    if (latestNoticeDesc) latestNoticeDesc.textContent = desc.length > 80 ? desc.slice(0, 80) + '...' : desc;
    if (latestNoticeLink) latestNoticeLink.setAttribute('href', 'notices.html');
    
    // 隐藏加载状态，显示数据内容
    if (notifLoading) notifLoading.style.display = 'none';
    if (notifContent) notifContent.style.display = 'block';
  }

  function loadLatestNotice() {
    fetch(BASE_URL + '/api/notices/latest')
      .then(function (res) {
        if (!res.ok) throw new Error('latest request failed');
        return res.json();
      })
      .then(function (json) {
        var latest = normalizeNoticeEntity(json && json.data);
        if (latest) {
          setLatestNoticeView(latest);
          return;
        }

        return fetch(BASE_URL + '/api/notices/list')
          .then(function (res) {
            if (!res.ok) throw new Error('list request failed');
            return res.json();
          })
          .then(function (listJson) {
            var first = normalizeNoticeEntity(listJson && listJson.data && listJson.data[0]);
            if (first) setLatestNoticeView(first);
          });
      })
      .catch(function () {
        // 加载失败时，隐藏加载动画，显示默认提示
        if (notifLoading) notifLoading.style.display = 'none';
        if (notifContent) notifContent.style.display = 'block';
        if (latestNoticeTitle) latestNoticeTitle.textContent = '暂无通知';
        if (latestNoticeDesc) latestNoticeDesc.textContent = '当前没有最新通知，请稍后再查看。';
        if (latestNoticeLink) latestNoticeLink.setAttribute('href', 'notices.html');
      });
  }

  loadLatestNotice();

  /* ---- Contact form handling ---- */
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Basic validation
      const name = form.querySelector('#name').value.trim();
      const phone = form.querySelector('#phone').value.trim();
      const t = (typeof TRANSLATIONS !== 'undefined') && TRANSLATIONS[currentLang];
      if (!name || !phone) {
        showFormError(t ? t.errRequired : '请填写姓名和联系电话');
        return;
      }
      if (!/^[\d\s\+\-\(\)]{7,20}$/.test(phone)) {
        showFormError(t ? t.errPhone : '请输入有效的手机号码');
        return;
      }

      // Submit to Strapi API
      var submitBtn = form.querySelector('button[type="submit"]');
      var originalText = submitBtn.textContent;
      submitBtn.textContent = '发送中…';
      submitBtn.disabled = true;

      var email = form.querySelector('#email').value.trim();
      var destination = form.querySelector('#destination').value.trim();
      var people = form.querySelector('#people').value.trim();
      var message = form.querySelector('#message').value.trim();

      fetch(BASE_URL + '/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: {
            name: name,
            phone: phone,
            email: email || null,
            message: [destination && ('目的地：' + destination), people && ('人数：' + people), message].filter(Boolean).join('\n') || null
          }
        })
      })
      .then(function (res) {
        if (!res.ok) throw new Error('Network error');
        return res.json();
      })
      .then(function () {
        var formParent = form.parentNode;
        form.style.opacity = '0';
        form.style.transform = 'translateY(10px)';
        form.style.transition = 'all .4s ease';
        setTimeout(function () {
          var tl = (typeof TRANSLATIONS !== 'undefined') && TRANSLATIONS[currentLang];
          var successDiv = document.createElement('div');
          successDiv.className = 'contact-form form-success';
          successDiv.innerHTML =
            '<div class="success-icon">✅</div>' +
            '<h4>' + (tl ? tl.successTitle : '咨询已发送！') + '</h4>' +
            '<p>' + (tl ? tl.successMsg : '非常感谢您的咨询，<br>我们将在 24 小时内与您联系。') + '</p>';
          formParent.appendChild(successDiv);
          form.style.display = 'none';
        }, 400);
      })
      .catch(function () {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        showFormError(t ? t.errNetwork || '提交失败，请稍后重试' : '提交失败，请稍后重试');
      });
    });
  }

  function showFormError(msg) {
    const existing = form.querySelector('.form-error');
    if (existing) existing.remove();
    const err = document.createElement('p');
    err.className = 'form-error';
    err.style.cssText = 'color:#c0392b;font-size:.82rem;margin-bottom:12px;text-align:center;';
    err.textContent = msg;
    form.insertBefore(err, form.querySelector('button[type="submit"]'));
    setTimeout(function () { err.remove(); }, 4000);
  }

  /* ================================================
     i18n Language Switcher
     ================================================ */

  var LANG_KEY = 'mantravel_lang';
  var currentLang = localStorage.getItem(LANG_KEY) || 'es';

  function applyTranslations(lang) {
    var t = (typeof TRANSLATIONS !== 'undefined') && TRANSLATIONS[lang];
    if (!t) return;

    // data-i18n → textContent
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (t[key] !== undefined) {
        el.textContent = t[key];
      }
    });

    // data-i18n-html → innerHTML
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-html');
      if (t[key] !== undefined) {
        el.innerHTML = t[key];
      }
    });

    // data-i18n-placeholder → placeholder attribute
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-placeholder');
      if (t[key] !== undefined) {
        el.setAttribute('placeholder', t[key]);
      }
    });

    // data-i18n-aria → aria-label attribute
    document.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-aria');
      if (t[key] !== undefined) {
        el.setAttribute('aria-label', t[key]);
      }
    });

    // Update <title>
    if (t.siteTitle) {
      document.title = t.siteTitle;
    }

    // Update <html lang> attribute
    var langMap = { zh: 'zh-CN', en: 'en', es: 'es' };
    document.documentElement.lang = langMap[lang] || lang;

    currentLang = lang;
    localStorage.setItem(LANG_KEY, lang);
  }

  // Language label map
  var LANG_LABELS = { zh: '中文', en: 'English', es: 'Español' };

  // Update button label and active option
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

  // Dropdown toggle
  var langDropdownBtn = document.getElementById('langDropdownBtn');
  if (langDropdownBtn) {
    langDropdownBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      var dropdown = document.getElementById('langSwitcher');
      var isOpen = dropdown.classList.toggle('open');
      langDropdownBtn.setAttribute('aria-expanded', isOpen);
    });
  }

  // Close on outside click
  document.addEventListener('click', function (e) {
    var dropdown = document.getElementById('langSwitcher');
    if (dropdown && !dropdown.contains(e.target)) {
      dropdown.classList.remove('open');
      if (langDropdownBtn) langDropdownBtn.setAttribute('aria-expanded', 'false');
    }
  });

  // Bind language option clicks
  document.querySelectorAll('.lang-option').forEach(function (opt) {
    opt.addEventListener('click', function () {
      var lang = this.getAttribute('data-lang');
      if (lang) {
        applyTranslations(lang);
        updateLangUI(lang);
        renderTours(lang);
        renderDestinations(lang);
        renderReviews(lang);
        renderMoments(lang);
      }
    });
  });

  // Apply saved or default language on load
  applyTranslations(currentLang);
  updateLangUI(currentLang);
  loadTours();

  /* ================================================
     Tours 动态加载
     ================================================ */

  var _toursCache = null;

  function loadTours() {
    if (_toursCache) {
      renderTours(currentLang);
      return;
    }
    fetch(BASE_URL + '/api/tours?sort=sort_order:asc&pagination[limit]=20')
      .then(function (res) { return res.json(); })
      .then(function (json) {
        _toursCache = (json.data || []).map(function (item) {
          return item;
        });
        renderTours(currentLang);
      })
      .catch(function () {
        // API 失败时隐藏骨架屏、保持空白
        var grid = document.getElementById('toursGrid');
        if (grid) grid.innerHTML = '';
      });
  }

  function renderTours(lang) {
    var grid = document.getElementById('toursGrid');
    if (!grid || !_toursCache) return;
    var t = (typeof TRANSLATIONS !== 'undefined') && TRANSLATIONS[lang];
    var badgePopular = t ? t.tourBadgePopular : '最受欢迎';
    var badgeNew = t ? t.tourBadgeNew : '新线路';
    var priceFrom = t ? t.priceFrom : '起价';
    var pricePer = t ? t.pricePer : '/人';
    var btnDetail = t ? t.btnDetail : '了解详情';

    grid.innerHTML = _toursCache.map(function (item, idx) {
      var title = item['title_' + lang] || item.title_zh || '';
      var route = item['route_' + lang] || item.route_zh || '';
      var desc = item['description_' + lang] || item.description_zh || '';
      var duration = item['duration_' + lang] || item.duration_zh || '';
      var highlights = item['highlights_' + lang] || item.highlights_zh || [];
      var imgClass = '';
      var imgStyle = '';

      if (item.image) {
        var imageUrl = String(item.image).trim();

        // 若存的是 unsplash.com/photos/... 页面链接，提示应改为 images.unsplash.com 直链
        if (/^https?:\/\/unsplash\.com\/photos\//.test(imageUrl)) {
          console.warn('[travel] 图片字段请存 images.unsplash.com 直链，而非 Unsplash 页面链接：', imageUrl);
        }

        if (/^https?:\/\//.test(imageUrl)) {
          imgStyle = ' style="background-image:url(&quot;' + imageUrl + '&quot;)"';
        } else {
          imgClass = imageUrl;
        }
      } else {
        imgClass = 'tour-img-' + (idx + 1);
      }
      var badge = item.badge;
      var price = item.price ? '￥' + Number(item.price).toLocaleString() : '';
      var isFeatured = idx === 0;

      var badgeHtml = '';
      if (badge === 'popular') badgeHtml = '<span class="tour-badge">' + badgePopular + '</span>';
      if (badge === 'new') badgeHtml = '<span class="tour-badge tour-badge-new">' + badgeNew + '</span>';

      var highlightsHtml = (Array.isArray(highlights) ? highlights : []).map(function (h) {
        return '<li>' + h + '</li>';
      }).join('');

      return '<div class="tour-card' + (isFeatured ? ' featured' : '') + '">' +
        '<a href="tour.html?id=' + item.documentId + '" class="tour-img-wrap" aria-label="' + title + '">' +
          '<div class="tour-img' + (imgClass ? ' ' + imgClass : '') + '"' + imgStyle + '>' +
            badgeHtml +
            '<div class="tour-days">' + duration + '</div>' +
            '<div class="tour-img-overlay">' +
              '<h3 class="tour-img-title">' + title + '</h3>' +
              '<p class="tour-img-route">' + route + '</p>' +
            '</div>' +
          '</div>' +
        '</a>' +
        '<div class="tour-info">' +
          '<p class="tour-desc">' + desc + '</p>' +
          '<ul class="tour-highlights">' + highlightsHtml + '</ul>' +
          '<div class="tour-footer">' +
            '<div class="tour-price">' +
              '<span class="price-from">' + priceFrom + '</span>' +
              '<span class="price-num">' + price + '</span>' +
              '<span class="price-per">' + pricePer + '</span>' +
            '</div>' +
            '<a href="tour.html?id=' + item.documentId + '" class="btn btn-sm" data-tour-title="' + title + '" data-tour-route="' + route + '">' + btnDetail + '</a>' +
          '</div>' +
        '</div>' +
      '</div>';
    }).join('');

    // 重新绑定了解详情按鈕 —— 直接跳转详情页，无需额外逻辑
    grid.querySelectorAll('.btn-sm').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        // 允许默认的 href 跳转，不再拦截
      });
    });
  }

  /* ================================================
     Destinations 动态加载
     ================================================ */

  var _destsCache = null;

  function loadDestinations() {
    if (_destsCache) {
      renderDestinations(currentLang);
      return;
    }
    fetch(BASE_URL + '/api/destinations?sort=sort_order:asc&pagination[limit]=20')
      .then(function (res) { return res.json(); })
      .then(function (json) {
        _destsCache = json.data || [];
        renderDestinations(currentLang);
      })
      .catch(function () {
        var grid = document.getElementById('destGrid');
        if (grid) grid.innerHTML = getFallbackDestsHtml();
        bindDestCards();
        _fixDestGridLastCard();
      });
  }

  function renderDestinations(lang) {
    var grid = document.getElementById('destGrid');
    if (!grid || !_destsCache) return;

    if (_destsCache.length === 0) {
      grid.innerHTML = getFallbackDestsHtml();
      bindDestCards();
      _fixDestGridLastCard();
      return;
    }

    var t = (typeof TRANSLATIONS !== 'undefined') && TRANSLATIONS[lang];
    var exploreText = t ? t.destExplore : '探索 →';

    grid.innerHTML = _destsCache.map(function (item, idx) {
      var name = item['name_' + lang] || item.name_zh || '';
      var subtitle = item['subtitle_' + lang] || item.subtitle_zh || '';
      var destValue = item.dest_value || '';
      var imgStyle = '';

      if (item.image) {
        var imageUrl = String(item.image).trim();
        if (/^https?:\/\//.test(imageUrl)) {
          imgStyle = ' style="background-image:url(\'' + imageUrl + '\')"';
        }
      }

      // var sizeClass = idx === 0 ? ' dest-large' : '';
      var sizeClass = idx === 0 ? '' : '';
      var bgClass = imgStyle ? '' : (' dest-' + destValue);

      return '<div class="dest-card' + sizeClass + bgClass + '" data-dest-value="' + destValue + '"' + imgStyle + '>' +
        '<div class="dest-overlay">' +
          '<h3>' + name + '</h3>' +
          '<p>' + subtitle + '</p>' +
          '<span class="dest-explore">' + exploreText + '</span>' +
        '</div>' +
      '</div>';
    }).join('');

    bindDestCards();
    _fixDestGridLastCard();
  }

  function _fixDestGridLastCard() {
    var cards = Array.prototype.slice.call(document.querySelectorAll('#destGrid .dest-card:not(.dest-large)'));
    document.querySelectorAll('#destGrid .dest-card').forEach(function(c){ c.classList.remove('dest-last-odd'); });
    if (cards.length % 2 === 1) cards[cards.length - 1].classList.add('dest-last-odd');
  }

  function getFallbackDestsHtml() {
    return [
      { cls: 'dest-large dest-beijing', value: 'beijing', nameZh: '北京', subZh: '故宫 · 长城 · 胡同', nameEn: 'Beijing', subEn: 'Palace · Great Wall · Hutong', nameEs: 'Pekín', subEs: 'Palacio · Gran Muralla · Hutong' },
      { cls: 'dest-shanghai', value: 'shanghai', nameZh: '上海', subZh: '外滩 · 弄堂 · 摩登', nameEn: 'Shanghai', subEn: 'Bund · Alleys · Skyline', nameEs: 'Shanghái', subEs: 'Bund · Callejones · Modernidad' },
      { cls: 'dest-guilin', value: 'guilin', nameZh: '桂林', subZh: '漓江 · 阳朔 · 山水', nameEn: 'Guilin', subEn: 'Li River · Karst · Nature', nameEs: 'Guilin', subEs: 'Río Li · Karst · Naturaleza' },
      { cls: 'dest-chengdu', value: 'chengdu', nameZh: '成都', subZh: '熊猫 · 火锅 · 茶馆', nameEn: 'Chengdu', subEn: 'Pandas · Hotpot · Teahouse', nameEs: 'Chengdu', subEs: 'Pandas · Hotpot · Casa de Té' },
      { cls: 'dest-lhasa', value: 'lhasa', nameZh: '拉萨', subZh: '布达拉宫 · 圣湖 · 天空', nameEn: 'Lhasa', subEn: 'Potala · Holy Lake · Sky', nameEs: 'Lhasa', subEs: 'Potala · Lago Sagrado · Cielo' }
    ].map(function (d) {
      var t = (typeof TRANSLATIONS !== 'undefined') && TRANSLATIONS[currentLang];
      var exploreText = t ? t.destExplore : '探索 →';
      var name = currentLang === 'en' ? d.nameEn : currentLang === 'es' ? d.nameEs : d.nameZh;
      var sub = currentLang === 'en' ? d.subEn : currentLang === 'es' ? d.subEs : d.subZh;
      return '<div class="dest-card ' + d.cls + '" data-dest-value="' + d.value + '">' +
        '<div class="dest-overlay">' +
          '<h3>' + name + '</h3>' +
          '<p>' + sub + '</p>' +
          '<span class="dest-explore">' + exploreText + '</span>' +
        '</div>' +
      '</div>';
    }).join('');
  }

  function bindDestCards() {
    document.querySelectorAll('#destGrid .dest-card').forEach(function (card) {
      card.style.cursor = 'pointer';
      card.addEventListener('click', function () {
        var destValue = card.getAttribute('data-dest-value');
        if (destValue) {
          window.location.href = 'city.html?slug=' + encodeURIComponent(destValue);
        }
      });
    });
  }

  function _bindDestCta() {
    var btn = document.getElementById('destShowAll');
    if (btn) btn.addEventListener('click', function () { window.location.href = 'destination.html'; });
  }

  _bindDestCta();
  loadDestinations();

  /* ================================================
     Reviews 动态加载
     ================================================ */

  var _reviewsCache = null;

  function loadReviews() {
    if (_reviewsCache) {
      renderReviews(currentLang);
      return;
    }
    fetch(BASE_URL + '/api/reviews?sort=sort_order:asc&pagination[limit]=20')
      .then(function (res) { return res.json(); })
      .then(function (json) {
        _reviewsCache = json.data || [];
        renderReviews(currentLang);
      })
      .catch(function () {
        renderReviews(currentLang, true);
      });
  }

  function renderReviews(lang, useFallback) {
    var track = document.getElementById('reviewsTrack');
    if (!track) return;

    var data = (!useFallback && _reviewsCache && _reviewsCache.length) ? _reviewsCache : null;

    if (!data) {
      track.innerHTML = getFallbackReviewsHtml(lang);
    } else {
      track.innerHTML = data.map(function (item) {
        var text = item['text_' + lang] || item.text_zh || '';
        var tourLabel = item['tour_label_' + lang] || item.tour_label_zh || '';
        var stars = Math.min(5, Math.max(1, item.stars || 5));
        var starsHtml = '★'.repeat(stars) + '☆'.repeat(5 - stars);
        var avatarChar = item.avatar_char || (item.author_name ? item.author_name.charAt(0) : '旅');
        var countryCode = item.country_code ? item.country_code.toLowerCase() : '';
        var flagClass = countryCode ? ' has-flag' : '';
        var flagStyle = countryCode ? ' style="--flag-url: url(\'https://flagcdn.com/w640/' + countryCode + '.png\')"' : '';

        return '<div class="review-card' + flagClass + '"' + flagStyle + '>' +
          '<div class="review-stars">' + starsHtml + '</div>' +
          '<p class="review-text">"' + text + '"</p>' +
          '<div class="review-author">' +
            '<div class="review-avatar">' + avatarChar + '</div>' +
            '<div>' +
              '<strong>' + item.author_name + '</strong>' +
              '<span>' + tourLabel + '</span>' +
            '</div>' +
          '</div>' +
        '</div>';
      }).join('');
    }

    initReviewsSlider();
    _bindReviewModal();
  }

  function _bindReviewModal() {
    var overlay = document.getElementById('reviewModalOverlay');
    if (!overlay) return;
    document.getElementById('reviewsTrack').addEventListener('click', function (e) {
      var card = e.target.closest('.review-card');
      if (!card) return;
      document.getElementById('reviewModalStars').innerHTML = card.querySelector('.review-stars').innerHTML;
      document.getElementById('reviewModalText').textContent = card.querySelector('.review-text').textContent;
      var author = card.querySelector('.review-author');
      document.getElementById('reviewModalAvatar').textContent = author.querySelector('.review-avatar').textContent;
      document.getElementById('reviewModalName').textContent = author.querySelector('strong').textContent;
      document.getElementById('reviewModalTour').textContent = author.querySelector('span').textContent;
      overlay.classList.add('active');
    });
    overlay.addEventListener('click', function () { overlay.classList.remove('active'); });
  }

  function getFallbackReviewsHtml(lang) {
    var fallback = [
      { avatar: '张', nameZh: '张先生', nameEn: 'Mr. Zhang', nameEs: 'Sr. Zhang', country: 'cn',
        textZh: '旅程中的每一个细节都安排得井井有条。导游知识渊博，带我们去了普通游客找不到的隐秘小巷，品尝到了最正宗的北京炸酱面。这是我旅行生涯中最特别的一次经历！',
        textEn: 'Every detail of the trip was meticulously arranged. The guide was knowledgeable and took us to hidden alleys ordinary tourists never find. Truly the most special trip of my life!',
        textEs: 'Cada detalle del viaje estuvo perfectamente organizado. El guía nos llevó a callejones escondidos que los turistas normales no encuentran. ¡La experiencia más especial de mi vida!',
        tourZh: '北京-西安-上海 · 8天', tourEn: 'Beijing-Xi\'an-Shanghai · 8 days', tourEs: 'Pekín-Xi\'an-Shanghai · 8 días' },
      { avatar: '王', nameZh: '王女士', nameEn: 'Ms. Wang', nameEs: 'Sra. Wang', country: 'cn',
        textZh: '西藏之旅超出了我所有的期待。布达拉宫在夕阳下的金色让我至今难忘。全程高原反应的关照非常贴心，氧气、药品都提前准备好了。强烈推荐！',
        textEn: 'The Tibet journey exceeded all my expectations. The golden Potala Palace at sunset is unforgettable. The altitude care was very thoughtful. Highly recommended!',
        textEs: 'El viaje al Tíbet superó todas mis expectativas. El Palacio Potala dorado al atardecer es inolvidable. ¡Muy recomendado!',
        tourZh: '神秘西藏 · 13天', tourEn: 'Mystical Tibet · 13 days', tourEs: 'Tíbet Místico · 13 días' },
      { avatar: '李', nameZh: '李先生', nameEn: 'Mr. Li', nameEs: 'Sr. Li', country: 'de',
        textZh: '作为外国人来中国旅行本来有些担心语言障碍，但全程双语导游解决了所有问题！桂林的山水美得像一幅水墨画，在漓江上漂流的那个清晨令人终生难忘。',
        textEn: 'I was worried about language barriers as a foreigner, but our bilingual guide solved everything! Guilin\'s landscapes look just like a Chinese ink painting. Unforgettable.',
        textEs: 'Tenía miedo de la barrera del idioma, pero nuestro guía bilingüe resolvió todo. Los paisajes de Guilin parecen una pintura china. Inolvidable.',
        tourZh: '桂林漓江 · 11天', tourEn: 'Guilin Li River · 11 days', tourEs: 'Río Li de Guilin · 11 días' },
      { avatar: '陈', nameZh: '陈女士', nameEn: 'Ms. Chen', nameEs: 'Sra. Chen', country: 'us',
        textZh: '张家界让我感觉自己置身阿凡达的世界！玻璃桥走到一半腿都软了，但那种震撼无法用语言描述。完全物超所值！',
        textEn: 'Zhangjiajie made me feel like I was in the Avatar world! My legs went weak halfway across the glass bridge, but the view was indescribable. Absolutely worth every penny!',
        textEs: '¡Zhangjiajie me hizo sentir en el mundo de Avatar! Las piernas me temblaron en el puente de cristal, pero la vista fue indescriptible. ¡Totalmente vale la pena!',
        tourZh: '壮美山河 · 12天', tourEn: 'Grand Landscapes · 12 days', tourEs: 'Paisajes Magníficos · 12 días' },
      { avatar: '赵', nameZh: '赵先生一家', nameEn: 'Zhao Family', nameEs: 'Familia Zhao', country: 'jp',
        textZh: '14天的全景游真的很值！每个城市都有足够的时间深度游览。成都的大熊猫基地是孩子最喜欢的环节。太贴心了，下次还要带父母再来！',
        textEn: 'The 14-day panoramic tour was truly worth it! Each city had enough time for in-depth exploration. The Chengdu Panda Base was the kids\' favorite. We\'ll definitely be back!',
        textEs: '¡El tour panorámico de 14 días realmente valió la pena! La base de pandas de Chengdu fue la favorita de los niños. ¡Definitivamente volveremos!',
        tourZh: '中国全景 · 14天', tourEn: 'China Panorama · 14 days', tourEs: 'Panorama de China · 14 días' }
    ];

    return fallback.map(function (r) {
      var name = lang === 'en' ? r.nameEn : lang === 'es' ? r.nameEs : r.nameZh;
      var text = lang === 'en' ? r.textEn : lang === 'es' ? r.textEs : r.textZh;
      var tour = lang === 'en' ? r.tourEn : lang === 'es' ? r.tourEs : r.tourZh;
      var flagClass = r.country ? ' has-flag' : '';
      var flagStyle = r.country ? ' style="--flag-url: url(\'https://flagcdn.com/w640/' + r.country + '.png\')"' : '';
      return '<div class="review-card' + flagClass + '"' + flagStyle + '>' +
        '<div class="review-stars">★★★★★</div>' +
        '<p class="review-text">"' + text + '"</p>' +
        '<div class="review-author">' +
          '<div class="review-avatar">' + r.avatar + '</div>' +
          '<div><strong>' + name + '</strong><span>' + tour + '</span></div>' +
        '</div>' +
      '</div>';
    }).join('');
  }

  loadReviews();

  /* ================================================
     旅途瞬间 动态加载
     ================================================ */

  var _momentsCache = null;

  // 静态兜底数据（与 index.html 硬编码一致）
  var FALLBACK_MOMENTS = [
    { image: 'images/beijing.webp',     name_zh: '北京',      name_en: 'Beijing',     name_es: 'Pekín',       taken_at: null },
    { image: 'images/shanghai.webp',    name_zh: '上海',      name_en: 'Shanghai',    name_es: 'Shanghái',    taken_at: null },
    { image: 'images/guilin.webp',      name_zh: '桂林',      name_en: 'Guilin',      name_es: 'Guilin',      taken_at: null },
    { image: 'images/chengdu.webp',     name_zh: '成都',      name_en: 'Chengdu',     name_es: 'Chengdu',     taken_at: null },
    { image: 'images/zhangjiajie.webp', name_zh: '张家界',    name_en: 'Zhangjiajie', name_es: 'Zhangjiajie', taken_at: null },
    { image: 'images/tibet.webp',       name_zh: '西藏拉萨',  name_en: 'Lhasa',       name_es: 'Lhasa',       taken_at: null },
    { image: 'images/xian.webp',        name_zh: '西安',      name_en: "Xi'an",       name_es: "Xi'an",       taken_at: null },
    { image: 'images/silkroad.webp',    name_zh: '敦煌丝路',  name_en: 'Dunhuang',    name_es: 'Dunhuang',    taken_at: null },
  ];

  var PW_SIZE_CYCLE = ['pw-md','pw-lg','pw-sm','pw-md','pw-lg','pw-sm','pw-md','pw-lg','pw-sm','pw-md','pw-lg','pw-sm','pw-md','pw-lg','pw-sm','pw-md'];
  var PW_ROTATE    = [-11, 8, -5, 10, -7, 6, -12, 9, -4, 11, -8, 5, -10, 7, -6, 12];
  var PW_ZINDEX    = [5, 8, 3, 6, 9, 2, 7, 4, 6, 3, 8, 5, 2, 7, 4, 9];
  // 偶数idx→上排(y≈22~70px)，奇数idx→下排(y≈160~200px)，两排重叠约40~80px
  var PW_OFFSETS   = [-490, -421, -352, -283, -214, -145, -76, -7, 62, 131, 200, 269, 338, 407, 476, 545];
  var PW_TOP       = [35, 175, 60, 200, 28, 165, 70, 195, 22, 180, 55, 170, 40, 190, 65, 185];

  function renderMoments(lang) {
    var scatter = document.querySelector('.pw-scatter');
    if (!scatter) return;

    var data = (_momentsCache && _momentsCache.length) ? _momentsCache : FALLBACK_MOMENTS;

    scatter.innerHTML = data.slice(0, 16).map(function (item, idx) {
      var name = item['name_' + lang] || item.name_zh || '';
      var imgUrl = '';
      if (item.image && item.image.url) {
        imgUrl = /^https?:\/\//.test(item.image.url)
          ? item.image.url
          : '/api' + item.image.url;
      } else if (typeof item.image === 'string') {
        imgUrl = item.image;
      }
      // 相对路径或绝对 URL 均可
      var bgStyle = 'background-image:url(\'' + imgUrl + '\')';
      var sizeClass = PW_SIZE_CYCLE[idx] || 'pw-md';
      var rotate = PW_ROTATE[idx] || 0;
      var zidx   = PW_ZINDEX[idx] || 1;
      var left   = 'calc(50% + ' + (PW_OFFSETS[idx] || 0) + 'px)';
      var top    = (PW_TOP[idx] || 60) + 'px';

      var dateStr = '';
      if (item.taken_at) {
        var d = new Date(item.taken_at);
        dateStr = d.getFullYear() + '.' + String(d.getMonth() + 1).padStart(2, '0');
      }
      var captionText = name + (dateStr ? ' · ' + dateStr : '');

      return '<div class="pw-photo ' + sizeClass + '" style="' + bgStyle +
        '; left:' + left + '; top:' + top +
        '; transform:rotate(' + rotate + 'deg); z-index:' + zidx + '">' +
        '<span class="pw-caption">' + captionText + '</span>' +
        '</div>';
    }).join('');
  }

  function loadMoments() {
    fetch(BASE_URL + '/api/moments?sort=sort_order:asc&pagination[limit]=20&populate=image')
      .then(function (res) { return res.json(); })
      .then(function (json) {
        var data = json.data || [];
        _momentsCache = data.length ? data : null;
        renderMoments(currentLang);
      })
      .catch(function () {
        renderMoments(currentLang);
      });
  }

  loadMoments();

})();
