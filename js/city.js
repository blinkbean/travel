/* ================================================
   漫旅中国 ManTravel — City Tours Page JS
   ================================================ */
(function () {
  'use strict';

  var BASE_URL = location.hostname === 'localhost' ? 'http://localhost:1337' : '';
  var LANG_KEY = 'mantravel_lang';
  var currentLang = localStorage.getItem(LANG_KEY) || 'es';

  /* ---- 城市静态数据（fallback） ---- */
  var CITY_DATA = {
    beijing:     { zh: '北京', en: 'Beijing',   es: 'Pekín',    sub: { zh: '故宫 · 长城 · 胡同', en: 'Palace · Great Wall · Hutong', es: 'Palacio · Gran Muralla · Hutong' }, img: 'images/beijing.jpg' },
    shanghai:    { zh: '上海', en: 'Shanghai',  es: 'Shanghái', sub: { zh: '外滩 · 弄堂 · 摩登', en: 'Bund · Alleys · Skyline',       es: 'Bund · Callejones · Modernidad' }, img: 'images/shanghai.jpg' },
    guilin:      { zh: '桂林', en: 'Guilin',    es: 'Guilin',   sub: { zh: '漓江 · 阳朔 · 山水', en: 'Li River · Karst · Nature',     es: 'Río Li · Karst · Naturaleza' },    img: 'images/guilin.jpg' },
    chengdu:     { zh: '成都', en: 'Chengdu',   es: 'Chengdu',  sub: { zh: '熊猫 · 火锅 · 茶馆', en: 'Pandas · Hotpot · Teahouse',   es: 'Pandas · Hotpot · Casa de Té' },   img: 'images/chengdu.jpg' },
    zhangjiajie: { zh: '张家界', en: 'Zhangjiajie', es: 'Zhangjiajie', sub: { zh: '悬浮山 · 玻璃桥 · 云雾', en: 'Avatar Mountains · Glass Bridge', es: 'Montañas Avatar · Puente de Cristal' }, img: 'images/zhangjiajie.jpg' },
    lhasa:       { zh: '拉萨', en: 'Lhasa',     es: 'Lhasa',    sub: { zh: '布达拉宫 · 圣湖 · 天空', en: 'Potala · Holy Lake · Sky',   es: 'Potala · Lago Sagrado · Cielo' },  img: 'images/tibet.jpg' },
    xian:        { zh: '西安', en: "Xi'an",     es: "Xi'an",    sub: { zh: '兵马俑 · 古城墙 · 回民街', en: 'Terracotta · City Wall · Muslim Quarter', es: 'Terracota · Muralla · Barrio Musulmán' }, img: 'images/xian.jpg' }
  };

  /* ---- 线路静态数据（fallback，按城市分组） ---- */
  var TOURS_DATA = {
    beijing: [
      { id: 1, days: 8,  badge: '热门', title: { zh: '北京经典精华游', en: 'Beijing Classic', es: 'Pekín Clásico' }, route: { zh: '北京 → 西安 → 上海', en: 'Beijing → Xi\'an → Shanghai', es: 'Pekín → Xi\'an → Shanghái' }, desc: { zh: '紧凑而精华，三大城市三种气质，跨越三千年中华文明最耀眼的篇章', en: 'Three iconic cities, three distinct characters, spanning 3,000 years of Chinese civilization', es: 'Tres ciudades icónicas, tres caracteres distintos' }, highlights: ['故宫', '长城', '天坛', '颐和园'], price: 3980, tag: '经典' },
      { id: 2, days: 11, badge: '推荐', title: { zh: '中国经典黄金线路', en: 'China Golden Route', es: 'Ruta Dorada de China' }, route: { zh: '北京 → 西安 → 桂林 → 上海', en: 'Beijing → Xi\'an → Guilin → Shanghai', es: 'Pekín → Xi\'an → Guilin → Shanghái' }, desc: { zh: '感受千年帝都风华，品味古都历史，漫步甲天下山水，邂逅繁华都市', en: 'Experience imperial grandeur, ancient history, karst landscapes and modern metropolis', es: 'Grandeza imperial, historia antigua, paisajes kársticos y metrópolis moderna' }, highlights: ['故宫', '长城', '兵马俑', '漓江', '外滩'], price: 5980, tag: '经典' },
      { id: 3, days: 14, badge: '',     title: { zh: '中国全景深度游', en: 'China Panoramic Tour', es: 'Tour Panorámico de China' }, route: { zh: '北京 → 西安 → 成都 → 桂林 → 上海', en: 'Beijing → Xi\'an → Chengdu → Guilin → Shanghai', es: 'Pekín → Xi\'an → Chengdu → Guilin → Shanghái' }, desc: { zh: '五城联游，从北方古都到南方水乡，将中国最精华的面貌一网打尽', en: 'Five-city journey from northern capitals to southern waterways', es: 'Viaje de cinco ciudades desde capitales del norte hasta canales del sur' }, highlights: ['故宫', '长城', '大熊猫', '漓江', '外滩'], price: 7980, tag: '深度' }
    ],
    shanghai: [
      { id: 4, days: 8,  badge: '热门', title: { zh: '历史与现代对话', en: 'History Meets Modernity', es: 'Historia y Modernidad' }, route: { zh: '北京 → 西安 → 上海', en: 'Beijing → Xi\'an → Shanghai', es: 'Pekín → Xi\'an → Shanghái' }, desc: { zh: '紧凑而精华，三大城市三种气质，跨越三千年中华文明最耀眼的篇章', en: 'Three iconic cities spanning 3,000 years of Chinese civilization', es: 'Tres ciudades icónicas que abarcan 3.000 años de civilización china' }, highlights: ['外滩', '豫园', '新天地', '东方明珠'], price: 3980, tag: '经典' },
      { id: 5, days: 11, badge: '推荐', title: { zh: '中国经典黄金线路', en: 'China Golden Route', es: 'Ruta Dorada de China' }, route: { zh: '北京 → 西安 → 桂林 → 上海', en: 'Beijing → Xi\'an → Guilin → Shanghai', es: 'Pekín → Xi\'an → Guilin → Shanghái' }, desc: { zh: '感受千年帝都风华，品味古都历史，漫步甲天下山水，邂逅繁华都市', en: 'Imperial grandeur, ancient history, karst landscapes and modern metropolis', es: 'Grandeza imperial, historia antigua y metrópolis moderna' }, highlights: ['外滩夜游', '豫园', '故宫', '兵马俑'], price: 5980, tag: '经典' }
    ],
    guilin: [
      { id: 6, days: 11, badge: '热门', title: { zh: '中国经典黄金线路', en: 'China Golden Route', es: 'Ruta Dorada de China' }, route: { zh: '北京 → 西安 → 桂林 → 上海', en: 'Beijing → Xi\'an → Guilin → Shanghai', es: 'Pekín → Xi\'an → Guilin → Shanghái' }, desc: { zh: '感受千年帝都风华，品味古都历史，漫步甲天下山水，邂逅繁华都市', en: 'Imperial grandeur, ancient history, karst landscapes and modern metropolis', es: 'Grandeza imperial, historia antigua y metrópolis moderna' }, highlights: ['漓江', '阳朔', '竹筏漂流', '象鼻山'], price: 5980, tag: '经典' },
      { id: 7, days: 12, badge: '推荐', title: { zh: '壮美山河探险游', en: 'Scenic China Adventure', es: 'Aventura Paisajística de China' }, route: { zh: '北京 → 西安 → 张家界 → 桂林 → 上海', en: 'Beijing → Xi\'an → Zhangjiajie → Guilin → Shanghai', es: 'Pekín → Xi\'an → Zhangjiajie → Guilin → Shanghái' }, desc: { zh: '张家界悬浮山脉，漓江奇峰倒影，大自然鬼斧神工的惊世之作', en: 'Avatar mountains, Li River reflections — nature\'s most spectacular masterpieces', es: 'Montañas Avatar, reflejos del río Li — las obras maestras más espectaculares de la naturaleza' }, highlights: ['漓江', '阳朔', '张家界', '玻璃桥'], price: 6980, tag: '深度' }
    ],
    chengdu: [
      { id: 8, days: 13, badge: '热门', title: { zh: '神秘西藏深度游', en: 'Mysterious Tibet Tour', es: 'Tour Misterioso del Tíbet' }, route: { zh: '北京 → 西安 → 拉萨 → 成都 → 上海', en: 'Beijing → Xi\'an → Lhasa → Chengdu → Shanghai', es: 'Pekín → Xi\'an → Lhasa → Chengdu → Shanghái' }, desc: { zh: '触摸离天空最近的土地，感受独特的藏传佛教文化与壮丽高原风光', en: 'Touch the land closest to the sky, experience Tibetan Buddhist culture and majestic plateau scenery', es: 'Toca la tierra más cercana al cielo, experimenta la cultura budista tibetana' }, highlights: ['大熊猫基地', '宽窄巷子', '布达拉宫', '火锅'], price: 7980, tag: '深度' },
      { id: 9, days: 14, badge: '',     title: { zh: '中国全景深度游', en: 'China Panoramic Tour', es: 'Tour Panorámico de China' }, route: { zh: '北京 → 西安 → 成都 → 桂林 → 上海', en: 'Beijing → Xi\'an → Chengdu → Guilin → Shanghai', es: 'Pekín → Xi\'an → Chengdu → Guilin → Shanghái' }, desc: { zh: '五城联游，从北方古都到南方水乡，将中国最精华的面貌一网打尽', en: 'Five-city journey from northern capitals to southern waterways', es: 'Viaje de cinco ciudades' }, highlights: ['大熊猫', '宽窄巷子', '火锅体验', '漓江'], price: 7980, tag: '经典' }
    ],
    zhangjiajie: [
      { id: 10, days: 12, badge: '热门', title: { zh: '壮美山河探险游', en: 'Scenic China Adventure', es: 'Aventura Paisajística de China' }, route: { zh: '北京 → 西安 → 张家界 → 桂林 → 上海', en: 'Beijing → Xi\'an → Zhangjiajie → Guilin → Shanghai', es: 'Pekín → Xi\'an → Zhangjiajie → Guilin → Shanghái' }, desc: { zh: '张家界悬浮山脉，漓江奇峰倒影，大自然鬼斧神工的惊世之作', en: 'Avatar mountains, Li River reflections — nature\'s most spectacular masterpieces', es: 'Montañas Avatar y reflejos del río Li' }, highlights: ['阿凡达取景地', '玻璃桥', '天门山', '漓江'], price: 6980, tag: '深度' }
    ],
    lhasa: [
      { id: 11, days: 13, badge: '热门', title: { zh: '神秘西藏深度游', en: 'Mysterious Tibet Tour', es: 'Tour Misterioso del Tíbet' }, route: { zh: '北京 → 西安 → 拉萨 → 成都 → 上海', en: 'Beijing → Xi\'an → Lhasa → Chengdu → Shanghai', es: 'Pekín → Xi\'an → Lhasa → Chengdu → Shanghái' }, desc: { zh: '触摸离天空最近的土地，感受独特的藏传佛教文化与壮丽高原风光', en: 'Touch the land closest to the sky, experience Tibetan Buddhist culture and majestic plateau scenery', es: 'Toca la tierra más cercana al cielo' }, highlights: ['布达拉宫', '大昭寺', '纳木错圣湖', '成都大熊猫'], price: 7980, tag: '深度' }
    ],
    xian: [
      { id: 12, days: 8,  badge: '热门', title: { zh: '历史与现代对话', en: 'History Meets Modernity', es: 'Historia y Modernidad' }, route: { zh: '北京 → 西安 → 上海', en: 'Beijing → Xi\'an → Shanghai', es: 'Pekín → Xi\'an → Shanghái' }, desc: { zh: '紧凑而精华，三大城市三种气质，跨越三千年中华文明最耀眼的篇章', en: 'Three iconic cities spanning 3,000 years of Chinese civilization', es: 'Tres ciudades icónicas' }, highlights: ['兵马俑', '古城墙', '回民街', '华清池'], price: 3980, tag: '经典' },
      { id: 13, days: 14, badge: '',     title: { zh: '丝绸之路探秘', en: 'Silk Road Discovery', es: 'Descubrimiento de la Ruta de la Seda' }, route: { zh: '西安 → 兰州 → 张掖 → 敦煌 → 乌鲁木齐', en: 'Xi\'an → Lanzhou → Zhangye → Dunhuang → Urumqi', es: 'Xi\'an → Lanzhou → Zhangye → Dunhuang → Urumqi' }, desc: { zh: '沿古丝绸之路溯源而行，探寻莫高窟壁画、七彩丹霞与茫茫大漠的壮阔', en: 'Follow the ancient Silk Road to discover Mogao Caves, Rainbow Mountains and vast deserts', es: 'Sigue la antigua Ruta de la Seda para descubrir las Cuevas de Mogao' }, highlights: ['兵马俑', '莫高窟', '七彩丹霞', '月牙泉'], price: 8980, tag: '深度' }
    ]
  };

  /* ---- URL 参数 ---- */
  var slug = new URLSearchParams(location.search).get('slug') || 'beijing';

  /* ---- Navbar ---- */
  var navbar = document.getElementById('navbar');
  function updateNavbar() {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }
  window.addEventListener('scroll', updateNavbar, { passive: true });

  var navToggle = document.getElementById('navToggle');
  var navLinks  = document.getElementById('navLinks');
  navToggle.addEventListener('click', function () {
    navLinks.classList.toggle('open');
  });
  document.addEventListener('click', function (e) {
    if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) navLinks.classList.remove('open');
  });

  /* ---- i18n ---- */
  var LANG_LABELS = { zh: '中文', en: 'English', es: 'Español' };

  function applyTranslations(lang) {
    var t = (typeof TRANSLATIONS !== 'undefined') && TRANSLATIONS[lang];
    if (!t) return;
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      if (t[el.getAttribute('data-i18n')]) el.textContent = t[el.getAttribute('data-i18n')];
    });
    if (t.siteTitle) document.title = t.siteTitle;
    document.documentElement.lang = { zh: 'zh-CN', en: 'en', es: 'es' }[lang] || lang;
  }

  function setLang(lang) {
    currentLang = lang;
    localStorage.setItem(LANG_KEY, lang);
    document.getElementById('langLabel').textContent = LANG_LABELS[lang] || lang;
    document.querySelectorAll('.lang-option').forEach(function (o) {
      o.classList.toggle('active', o.getAttribute('data-lang') === lang);
    });
    applyTranslations(lang);
    renderPage();
  }

  var langBtn = document.getElementById('langDropdownBtn');
  langBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    document.getElementById('langSwitcher').classList.toggle('open');
  });
  document.addEventListener('click', function (e) {
    var sw = document.getElementById('langSwitcher');
    if (!sw.contains(e.target)) sw.classList.remove('open');
  });
  document.querySelectorAll('.lang-option').forEach(function (opt) {
    opt.addEventListener('click', function () { setLang(opt.getAttribute('data-lang')); });
  });

  /* ---- 渲染页面 ---- */
  var activeTag = 'all';

  function renderPage() {
    var city = CITY_DATA[slug] || CITY_DATA.beijing;
    var name = city[currentLang] || city.zh;
    var sub  = city.sub[currentLang] || city.sub.zh;

    // Hero
    document.getElementById('cityHero').style.backgroundImage = 'url(' + city.img + ')';
    document.getElementById('cityName').textContent = name;
    document.getElementById('citySub').textContent  = sub;
    var bc = document.getElementById('breadcrumbCity'); if (bc) bc.textContent = name;
    document.title = name + ' · 漫旅世界·中国';

    // Tours
    var tours = TOURS_DATA[slug] || [];
    renderFilters(tours);
    renderTours(tours);
  }

  function renderFilters(tours) {
    var tags = ['all'];
    tours.forEach(function (t) { if (t.tag && tags.indexOf(t.tag) === -1) tags.push(t.tag); });
    var labels = { all: { zh: '全部线路', en: 'All Tours', es: 'Todos' }, '经典': { zh: '经典线路', en: 'Classic', es: 'Clásico' }, '深度': { zh: '深度游', en: 'In-depth', es: 'Profundo' } };
    var container = document.getElementById('cityFilters');
    if (tags.length <= 2) { container.style.display = 'none'; return; }
    container.innerHTML = tags.map(function (tag) {
      var label = (labels[tag] && labels[tag][currentLang]) || tag;
      return '<button class="city-filter-btn' + (tag === activeTag ? ' active' : '') + '" data-tag="' + tag + '">' + label + '</button>';
    }).join('');
    container.querySelectorAll('.city-filter-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        activeTag = btn.getAttribute('data-tag');
        renderTours(TOURS_DATA[slug] || []);
        container.querySelectorAll('.city-filter-btn').forEach(function (b) {
          b.classList.toggle('active', b.getAttribute('data-tag') === activeTag);
        });
      });
    });
  }

  function renderTours(tours) {
    var filtered = activeTag === 'all' ? tours : tours.filter(function (t) { return t.tag === activeTag; });
    var grid  = document.getElementById('cityToursGrid');
    var empty = document.getElementById('cityEmpty');
    if (!filtered.length) {
      grid.innerHTML = '';
      empty.style.display = '';
      return;
    }
    empty.style.display = 'none';
    var priceLabel = { zh: '起价', en: 'From', es: 'Desde' }[currentLang] || '起价';
    var perLabel   = { zh: '/人', en: '/pax', es: '/pax' }[currentLang] || '/人';
    var detailLabel = { zh: '了解详情', en: 'View Details', es: 'Ver Detalles' }[currentLang] || '了解详情';
    grid.innerHTML = filtered.map(function (tour) {
      var title = tour.title[currentLang] || tour.title.zh;
      var route = tour.route[currentLang] || tour.route.zh;
      var desc  = tour.desc[currentLang]  || tour.desc.zh;
      var badge = tour.badge ? '<span class="city-tour-badge">' + tour.badge + '</span>' : '';
      var highlights = tour.highlights.map(function (h) { return '<span>' + h + '</span>'; }).join('');
      return '<div class="city-tour-card">' +
        '<div class="city-tour-img" style="background-image:url(' + (tour.image || (CITY_DATA[slug] ? CITY_DATA[slug].img : '')) + ')">' + badge + '</div>' +
        '<div class="city-tour-body">' +
          '<div class="city-tour-meta"><span>🗓 ' + tour.days + ({ zh: '天', en: ' days', es: ' días' }[currentLang] || '天') + '</span></div>' +
          '<div class="city-tour-title">' + title + '</div>' +
          // '<div class="city-tour-route">' + route + '</div>' +
          '<div class="city-tour-desc">' + desc + '</div>' +
          // '<div class="city-tour-highlights">' + highlights + '</div>' +
          '<div class="city-tour-footer">' +
            '<div class="city-tour-price"><span class="from">' + priceLabel + '</span> <span class="amount">¥' + tour.price.toLocaleString() + '</span><span class="per">' + perLabel + '</span></div>' +
            '<a href="tour.html?id=' + tour.id + '" class="btn btn-sm">' + detailLabel + '</a>' +
          '</div>' +
        '</div>' +
      '</div>';
    }).join('');
  }

  /* ---- 尝试从 API 加载线路 ---- */
  function loadFromAPI() {
    fetch(BASE_URL + '/api/tours?filters[destinations][dest_value][$eq]=' + encodeURIComponent(slug) + '&sort=sort_order:asc&pagination[limit]=20')
      .then(function (r) { return r.json(); })
      .then(function (json) {
        if (json.data && json.data.length) {
          TOURS_DATA[slug] = json.data.map(function (item) {
            return {
              id: item.documentId || item.id,
              days: item.days || 7,
              badge: item.badge || '',
              title: { zh: item.title_zh || '', en: item.title_en || '', es: item.title_es || '' },
              route: { zh: item.route_zh || '', en: item.route_en || '', es: item.route_es || '' },
              desc:  { zh: item.description_zh || '', en: item.description_en || '', es: item.description_es || '' },
              highlights: item.highlights_zh || item.highlights || [],
              price: item.price || 0,
              image: item.image || '',
              tag: item.tag || ''
            };
          });
          renderPage();
        }
      })
      .catch(function () { /* 使用静态数据 */ });
  }

  /* ---- 初始化 ---- */
  applyTranslations(currentLang);
  document.getElementById('langLabel').textContent = LANG_LABELS[currentLang];
  document.querySelectorAll('.lang-option').forEach(function (o) {
    o.classList.toggle('active', o.getAttribute('data-lang') === currentLang);
  });
  renderPage();
  loadFromAPI();

})();
