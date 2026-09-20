(() => {
  const supported = ['ko', 'en', 'ja', 'zh', 'es', 'fr'];
  const page = document.body.dataset.page || '';
  const search = new URLSearchParams(window.location.search);
  const requested = search.get('lang');
  const segments = window.location.pathname.split('/').filter(Boolean);
  const pathLanguage = supported.includes(segments[0]) ? segments[0] : null;
  const lang = pathLanguage || (supported.includes(requested) ? requested : 'ko');
  const profileSlug = page === 'profile' ? window.location.pathname.split('/').pop().replace('.html', '') : '';
  const languageNames = { ko: '🇰🇷 KR', en: '🇬🇧 EN', ja: '🇯🇵 日本語', zh: '🇨🇳 中文', es: '🇪🇸 ES', fr: '🇫🇷 FR' };
  const languageOptions = { ko: '🇰🇷 한국어', en: '🇬🇧 English', ja: '🇯🇵 日本語', zh: '🇨🇳 中文', es: '🇪🇸 Español', fr: '🇫🇷 Français' };
  const htmlLang = { ko: 'ko', en: 'en', ja: 'ja', zh: 'zh-CN', es: 'es', fr: 'fr' };
  const ogLocale = { ko: 'ko_KR', en: 'en_US', ja: 'ja_JP', zh: 'zh_CN', es: 'es_ES', fr: 'fr_FR' };
  const siteOrigin = 'https://www.nwiseip.com';

  function routeForLanguage(targetLang, targetPage = page, slug = profileSlug) {
    const prefix = targetLang === 'ko' ? '' : `/${targetLang}`;
    if (targetPage === 'location') return `${prefix}/location.html`;
    if (targetPage === 'profile') return `${prefix}/people/${slug}.html`;
    return `${prefix}/`;
  }

  if (supported.includes(requested) && !search.has('prerender')) {
    const target = `${routeForLanguage(requested)}${window.location.hash}`;
    if (`${window.location.pathname}${window.location.hash}` !== target) {
      window.location.replace(target);
      return;
    }
  }
  const uiLabels = {
    ko: { contact: '상담 문의', top: '맨 위로', skip: '본문으로 바로가기', nav: '주요 메뉴', language: '언어 선택', trust: '주요 대외 활동', visual: '기술을 이해하는 지식재산 실무', stats: '익명 집계된 업무 현황', tabs: '업무 경험 보기' },
    en: { contact: 'Contact us', top: 'Back to top', skip: 'Skip to content', nav: 'Primary navigation', language: 'Select language', trust: 'International affiliations', visual: 'Technology-led IP practice', stats: 'Anonymized matter overview', tabs: 'Explore our experience' },
    ja: { contact: 'お問い合わせ', top: 'ページ上部へ', skip: '本文へ移動', nav: 'メインナビゲーション', language: '言語を選択', trust: '主な国際活動', visual: '技術を理解する知的財産実務', stats: '匿名集計した取扱実績', tabs: '実務経験を見る' },
    zh: { contact: '联系我们', top: '返回顶部', skip: '跳至正文', nav: '主导航', language: '选择语言', trust: '主要国际活动', visual: '以技术理解为基础的知识产权实务', stats: '匿名汇总的业务概览', tabs: '查看业务经验' },
    es: { contact: 'Contactar', top: 'Volver arriba', skip: 'Ir al contenido', nav: 'Navegación principal', language: 'Seleccionar idioma', trust: 'Actividad internacional', visual: 'Práctica de PI basada en la tecnología', stats: 'Resumen anonimizado de asuntos', tabs: 'Explorar nuestra experiencia' },
    fr: { contact: 'Nous contacter', top: 'Retour en haut', skip: 'Aller au contenu', nav: 'Navigation principale', language: 'Choisir la langue', trust: 'Réseaux internationaux', visual: 'Une pratique de la PI fondée sur la technologie', stats: 'Aperçu anonymisé des dossiers', tabs: 'Découvrir notre expérience' }
  };
  const scriptUrl = document.currentScript?.src || window.location.href;
  const contentBase = new URL('./content/', scriptUrl);

  document.documentElement.lang = htmlLang[lang];
  window.NWISE_UI_LABELS = uiLabels[lang];

  const set = (selector, value) => {
    const element = document.querySelector(selector);
    if (element && value !== undefined) element.innerHTML = value;
  };

  const setText = (selector, value) => {
    const element = document.querySelector(selector);
    if (element && value !== undefined) element.textContent = value;
  };

  function applyCommon(common, contact, media) {
    setText('.skip-link', uiLabels[lang].skip);
    document.querySelector('#site-nav')?.setAttribute('aria-label', uiLabels[lang].nav);
    document.querySelector('.language-menu summary')?.setAttribute('aria-label', uiLabels[lang].language);
    document.querySelector('.trust-strip')?.setAttribute('aria-label', uiLabels[lang].trust);
    document.querySelector('.visual-story')?.setAttribute('aria-label', uiLabels[lang].visual);
    document.querySelector('.experience-stats')?.setAttribute('aria-label', uiLabels[lang].stats);
    document.querySelector('.experience-tabs')?.setAttribute('aria-label', uiLabels[lang].tabs);
    setText('[data-current-language]', languageNames[lang]);
    document.querySelectorAll('.language-menu > div > a').forEach((link, index) => {
      const option = supported[index];
      if (!option) return;
      link.textContent = languageOptions[option];
      link.setAttribute('href', `${routeForLanguage(option)}${page === 'home' ? window.location.hash : ''}`);
      if (option === lang) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    document.querySelectorAll('.site-nav > a').forEach((link, index) => {
      if (common.nav[index]) link.textContent = common.nav[index];
    });
    setText('.header-cta', common.contact);
    set('.footer-brand p', common.org);
    setText('.footer-legal', common.legal);

    document.querySelectorAll('.footer-links a').forEach((link) => {
      const href = link.getAttribute('href') || '';
      const map = { '#about': 0, '#services': 1, '#ip-value': 2, '#people': 3, '#insights': 4, 'location.html': 5, '#contact': 6 };
      Object.entries(map).some(([fragment, index]) => {
        if (!href.includes(fragment)) return false;
        link.textContent = common.nav[index];
        return true;
      });
    });

    const footerContact = document.querySelector('.footer-grid > .footer-links:last-child a[href*="location.html"]');
    if (footerContact) footerContact.innerHTML = common.address;
    setText('.footer-bottom a', `${common.top} ↑`);

    document.querySelectorAll('a[href^="mailto:"]').forEach((link) => {
      link.setAttribute('href', `mailto:${contact.email}`);
      if (link.textContent.trim().includes('@')) link.textContent = contact.email;
    });
    document.querySelectorAll('a[href^="tel:"]').forEach((link) => {
      const isFax = link.textContent.toUpperCase().includes('FAX');
      link.setAttribute('href', `tel:${isFax ? contact.faxLink : contact.telephoneLink}`);
      link.textContent = isFax ? `FAX ${contact.fax}` : contact.telephone;
    });

    document.querySelectorAll('.brand img').forEach((image) => image.setAttribute('src', media.logoDark));
    document.querySelectorAll('.footer-brand img, .panel-brand img').forEach((image) => image.setAttribute('src', media.logoLight));
    document.querySelector('.visual-story img')?.setAttribute('src', media.engineering);
    document.querySelectorAll('[data-experience-media] img').forEach((image, index) => {
      const sources = [media.experienceSemiconductor, media.experienceMobility, media.experienceBiotech];
      if (sources[index]) image.setAttribute('src', sources[index]);
    });
    document.querySelector('.location-photo img')?.setAttribute('src', media.architecture);

    document.querySelectorAll('.person-card').forEach((card) => {
      const slug = card.getAttribute('href')?.split('/').pop()?.replace('.html', '');
      const photo = slug ? media.professionals[slug] : null;
      if (photo) card.querySelector('img')?.setAttribute('src', photo);
    });
  }

  function applyHome(t) {
    document.title = t.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', t.description);
    set('#hero-title', t.heroTitle);
    setText('.hero-lede', t.heroLede);
    setText('.panel-brand p', t.panel);
    document.querySelectorAll('.route-panel > a strong').forEach((element, index) => {
      if (t.routes[index]) element.textContent = t.routes[index];
    });
    setText('.hero-actions .button-primary', `${t.contactButton} →`);
    setText('.hero-actions .button-secondary', t.heroValueButton);
    setText('.entry-section .section-heading > div p', t.startQuestion);
    set('.entry-section .section-heading h2', t.startTitle);
    setText('.entry-section .section-heading > p', t.startBody);

    document.querySelectorAll('.entry-card').forEach((card, index) => {
      const entry = t.entries[index];
      if (!entry) return;
      card.querySelector('h3').textContent = entry.title;
      card.querySelector('p').textContent = entry.body;
      card.querySelector('.text-link').innerHTML = `${entry.cta} <b>→</b>`;
    });

    document.querySelectorAll('.trust-grid > div').forEach((element, index) => {
      const item = t.trust[index];
      if (!item) return;
      element.querySelector('strong').textContent = item.name;
      element.querySelector('span').textContent = item.label;
      element.querySelector('p').textContent = item.detail;
    });

    set('#about-title', t.aboutTitle);
    setText('.about-copy .lead', t.aboutLead);
    setText('.about-copy > p:nth-child(2)', t.aboutBody);
    set('.about-copy blockquote', `${t.quote}<cite>${t.quoteBy}</cite>`);
    document.querySelectorAll('.glance-card dd').forEach((element, index) => {
      if (t.how[index]) element.textContent = t.how[index];
    });
    set('.visual-story figcaption strong', t.visual);

    setText('.experience-kicker', t.experienceEyebrow);
    set('#experience-title', t.experienceTitle);
    setText('.experience-intro', t.experienceBody);
    document.querySelectorAll('.experience-stat').forEach((stat, index) => {
      const item = t.experienceStats?.[index];
      if (!item) return;
      stat.querySelector('strong').textContent = item.value;
      stat.querySelector('span').textContent = item.label;
    });
    document.querySelectorAll('[data-experience-tab]').forEach((button, index) => {
      const tab = t.experienceTabs?.[index];
      if (tab) button.textContent = tab.label;
    });
    document.querySelectorAll('[data-experience-panel]').forEach((panel, index) => {
      const tab = t.experienceTabs?.[index];
      if (!tab) return;
      panel.querySelector('h3').textContent = tab.title;
      panel.querySelector('p').textContent = tab.body;
      panel.querySelector('.experience-items').innerHTML = tab.items.map((item) => `<div class="experience-item"><strong>${item.title}</strong><span>${item.detail}</span></div>`).join('');
    });
    document.querySelectorAll('[data-experience-media]').forEach((figure, index) => {
      const item = t.experienceMedia?.[index];
      if (!item) return;
      figure.querySelector('img').setAttribute('alt', item.alt);
      figure.querySelector('figcaption span').textContent = item.caption;
      const credit = figure.querySelector('figcaption a');
      credit.textContent = item.credit;
      credit.setAttribute('href', item.creditUrl);
    });
    setText('.experience-note', t.experienceNote);

    setText('.brand-rights-eyebrow', t.brandDesign.eyebrow);
    set('#brand-rights-title', t.brandDesign.title);
    setText('.brand-rights-heading > p', t.brandDesign.body);
    const brandRightItems = [t.brandDesign.trademark, t.brandDesign.design, t.brandDesign.copyright];
    document.querySelectorAll('.brand-rights-card').forEach((card, index) => {
      const item = brandRightItems[index];
      if (!item) return;
      card.querySelector('h3').textContent = item.title;
      card.querySelector('strong').textContent = item.lead;
      card.querySelector('p').textContent = item.body;
      card.querySelector('ul').innerHTML = item.points.map((point) => `<li>${point}</li>`).join('');
      const cta = card.querySelector('.brand-rights-cta');
      cta.innerHTML = `${item.cta} <span>→</span>`;
      cta.href = `mailto:nwiseip@nwiseip.com?subject=${encodeURIComponent(item.subject)}`;
    });

    set('#services-title', t.servicesTitle);
    setText('.services .section-heading > p', t.servicesBody);
    set('.service-group:not(.expanded) > h3', t.group1);
    set('.service-group.expanded > h3', t.group2);
    set('.service-group.portfolio-care > h3', t.group3);
    document.querySelectorAll('.service-card').forEach((card, index) => {
      const service = t.services[index];
      if (!service) return;
      card.querySelector('h4').textContent = service.title;
      card.querySelector('p').textContent = service.body;
    });

    set('#ip-title', t.valueTitle);
    setText('.value-stat small', t.valueStat);
    setText('.value-source', t.valueSource);
    setText('.value-copy > p', t.valueBody);
    set('.value-copy .button', `${t.valueButton} <span>→</span>`);
    const evidenceLabels = { ko: '권리를 가치로 만드는 경로', en: 'Routes from rights to value', ja: '権利を価値に変える道筋', zh: '从权利到价值的路径', es: 'Vías de los derechos al valor', fr: 'Des droits à la valeur' };
    setText('.value-evidence .card-kicker', evidenceLabels[lang]);
    document.querySelectorAll('.value-evidence li').forEach((item, index) => {
      if (t.valuePaths[index]) item.innerHTML = `<span>0${index + 1}</span>${t.valuePaths[index]}`;
    });

    set('#people-title', t.peopleTitle);
    setText('.people .section-heading > div p', t.peopleLabel);
    setText('.people .section-heading > p', t.peopleBody);
    document.querySelectorAll('.person-card').forEach((card, index) => {
      const person = t.people[index];
      if (!person) return;
      card.querySelector('h3').textContent = person.name;
      card.querySelector('strong').textContent = person.role;
      card.querySelector('.person-info > p:not(.person-en)').innerHTML = person.education;
      card.querySelector('.person-info > small').textContent = person.practice;
      card.querySelector('.chips').innerHTML = person.tags.map((tag) => `<span>${tag}</span>`).join('');
    });

    set('#insights-title', t.insightsTitle);
    set('.insights .all-link', `${t.viewAll} <b>→</b>`);
    document.querySelectorAll('.insight-grid article').forEach((article, index) => {
      const insight = t.insights[index];
      if (!insight) return;
      article.querySelector(':scope > span').textContent = insight.kicker;
      article.querySelector('h3').textContent = insight.title;
      article.querySelector('p').textContent = insight.body;
      const time = article.querySelector('time');
      time.dateTime = insight.datetime;
      time.textContent = insight.date;
      article.querySelector('div b').textContent = insight.author;
    });
    setText('.content-note', t.note);
    set('#contact-title', t.contactTitle);
    setText('.contact-panel > div:first-child > p', t.contactBody);
    set('.contact-actions .button', `${t.contactButton} <span>→</span>`);
  }

  function applyLocation(t, contact) {
    document.title = t.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', t.description);
    set('.location-photo > p strong', t.photoTitle);
    set('#location-title', t.heading);
    setText('.location-info .section-heading > p', t.lead);
    setText('.office-card h2', t.office);
    set('.office-card dd', t.address);
    const details = document.querySelectorAll('.office-card dd');
    if (details[1]) details[1].innerHTML = `<a href="tel:${contact.telephoneLink}">${contact.telephone}</a>`;
    if (details[2]) details[2].textContent = contact.fax;
    if (details[3]) details[3].innerHTML = `<a href="mailto:${contact.email}">${contact.email}</a>`;
    const buttons = document.querySelectorAll('.map-actions .button');
    if (buttons[0]) { buttons[0].href = contact.naverMap; buttons[0].innerHTML = `${t.naver} <span>↗</span>`; }
    if (buttons[1]) { buttons[1].href = contact.googleMap; buttons[1].innerHTML = `${t.google} <span>↗</span>`; }
    setText('.visit-note p', t.before);
    set('.visit-note > a', `${t.reserve} <b>→</b>`);
  }

  function applyProfile(data, media) {
    const slug = window.location.pathname.split('/').pop().replace('.html', '');
    const profile = data.profiles.find((item) => item.slug === slug);
    const common = data.profileCommon;
    if (!profile) return;
    document.title = `${profile.name} | Near & Wise IP Law Office`;
    document.querySelector('meta[name="description"]')?.setAttribute('content', profile.intro);
    setText('.profile-back', common.back);
    setText('.profile-heading h1', profile.name);
    setText('.profile-role', profile.role);
    setText('.profile-intro', profile.intro);
    const values = [profile.keyPractice, profile.technicalFields, profile.education, profile.approach];
    document.querySelectorAll('.profile-facts > div').forEach((row, index) => {
      row.querySelector('dt').textContent = common.labels[index];
      row.querySelector('dd').textContent = values[index];
    });
    setText('.profile-note', common.note);
    set('.profile-contact h2', common.contact);
    set('.profile-contact .button', `${common.button} <span aria-hidden="true">↗</span>`);
    const photo = document.querySelector('.profile-portrait img');
    if (photo && media.professionals[slug]) photo.src = media.professionals[slug];
  }

  function localizeInternalLinks() {
    document.querySelectorAll('a[href]').forEach((link) => {
      if (link.closest('.language-menu')) return;
      const href = link.getAttribute('href');
      if (!href || href.startsWith('?') || /^(mailto:|tel:|https?:)/.test(href)) return;
      if (href.startsWith('#')) {
        if (page === 'home') link.setAttribute('href', `${routeForLanguage(lang, 'home')}${href}`);
        return;
      }
      const url = new URL(href, window.location.href);
      if (url.origin !== window.location.origin) return;
      const parts = url.pathname.split('/').filter(Boolean);
      if (supported.includes(parts[0])) parts.shift();
      const normalized = `/${parts.join('/')}`;
      let localized = null;
      if (normalized === '/' || normalized === '/index.html') localized = routeForLanguage(lang, 'home');
      else if (normalized === '/location.html') localized = routeForLanguage(lang, 'location');
      else if (normalized.startsWith('/people/') && normalized.endsWith('.html')) localized = routeForLanguage(lang, 'profile', normalized.split('/').pop().replace('.html', ''));
      if (localized) link.setAttribute('href', `${localized}${url.hash}`);
    });
  }

  function setMeta(selector, attributes) {
    let element = document.head.querySelector(selector);
    if (!element) {
      element = document.createElement(attributes.tag || 'meta');
      document.head.appendChild(element);
    }
    Object.entries(attributes).forEach(([key, value]) => {
      if (key !== 'tag') element.setAttribute(key, value);
    });
    return element;
  }

  function applySeo(data, contact, media) {
    const canonicalPath = routeForLanguage(lang);
    const canonicalUrl = `${siteOrigin}${canonicalPath}`;
    const description = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
    setMeta('link[rel="canonical"]', { tag: 'link', rel: 'canonical', href: canonicalUrl });
    document.head.querySelectorAll('link[rel="alternate"][hreflang]').forEach((element) => element.remove());
    [...supported, 'x-default'].forEach((code) => {
      const targetLang = code === 'x-default' ? 'ko' : code;
      const alternate = document.createElement('link');
      alternate.rel = 'alternate';
      alternate.hreflang = code === 'zh' ? 'zh-CN' : code;
      alternate.href = `${siteOrigin}${routeForLanguage(targetLang)}`;
      alternate.dataset.generatedHreflang = 'true';
      document.head.appendChild(alternate);
    });
    setMeta('meta[name="robots"]', { name: 'robots', content: 'index, follow, max-image-preview:large' });
    setMeta('meta[property="og:type"]', { property: 'og:type', content: page === 'profile' ? 'profile' : 'website' });
    setMeta('meta[property="og:title"]', { property: 'og:title', content: document.title });
    setMeta('meta[property="og:description"]', { property: 'og:description', content: description });
    setMeta('meta[property="og:url"]', { property: 'og:url', content: canonicalUrl });
    setMeta('meta[property="og:locale"]', { property: 'og:locale', content: ogLocale[lang] });
    setMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary' });
    setMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: document.title });
    setMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: description });

    const organization = {
      '@type': ['LegalService', 'ProfessionalService'],
      '@id': `${siteOrigin}/#organization`,
      name: 'Near & Wise IP Law Office',
      alternateName: ['NwiseIP', '엔와이즈특허법률사무소'],
      url: `${siteOrigin}/`,
      logo: `${siteOrigin}${media.logoDark}`,
      email: contact.email,
      telephone: contact.telephone,
      faxNumber: contact.fax,
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Suite 303, 3F, 20 Yeongdong-daero 85-gil',
        addressLocality: 'Gangnam-gu, Seoul',
        postalCode: '06181',
        addressCountry: 'KR'
      },
      areaServed: 'Worldwide',
      knowsLanguage: ['ko', 'en', 'ja', 'zh-CN', 'es', 'fr'],
      serviceType: ['Patents', 'Trademarks', 'Designs', 'Copyright', 'IP valuation']
    };
    let schema = { '@context': 'https://schema.org', ...organization };
    if (page === 'profile') {
      const profile = data.profiles.find((item) => item.slug === profileSlug);
      if (profile) {
        schema = {
          '@context': 'https://schema.org', '@type': 'Person', name: profile.name,
          jobTitle: profile.role, description: profile.intro, url: canonicalUrl,
          image: `${siteOrigin}${media.professionals[profileSlug]}`,
          worksFor: { '@id': `${siteOrigin}/#organization` }
        };
      }
    }
    let script = document.head.querySelector('script[type="application/ld+json"][data-seo-schema]');
    if (!script) {
      script = document.createElement('script');
      script.type = 'application/ld+json';
      script.dataset.seoSchema = 'true';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(schema);
  }

  async function loadContent() {
    try {
      const [languageResponse, contactResponse, mediaResponse] = await Promise.all([
        fetch(new URL(`${lang}.json`, contentBase), { cache: 'no-store' }),
        fetch(new URL('contact.json', contentBase), { cache: 'no-store' }),
        fetch(new URL('media.json', contentBase), { cache: 'no-store' })
      ]);
      if (!languageResponse.ok || !contactResponse.ok || !mediaResponse.ok) throw new Error('Content files could not be loaded.');
      const [data, contact, media] = await Promise.all([
        languageResponse.json(),
        contactResponse.json(),
        mediaResponse.json()
      ]);

      applyCommon(data.common, contact, media);
      if (page === 'home') applyHome(data.home);
      if (page === 'location') applyLocation(data.location, contact);
      if (page === 'profile') applyProfile(data, media);
      localizeInternalLinks();
      applySeo(data, contact, media);
      setText('.floating-contact span', data.common.contact);
      document.querySelector('.floating-top')?.setAttribute('aria-label', data.common.top);
      window.NWISE_CONTENT_READY = true;
      window.dispatchEvent(new CustomEvent('nwise:content-ready', { detail: { lang, page } }));
    } catch (error) {
      console.error('NwiseIP content load failed:', error);
      localizeInternalLinks();
    }
  }

  loadContent();
})();
