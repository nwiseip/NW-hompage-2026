const menuButton = document.querySelector('[data-menu]');
const nav = document.querySelector('[data-nav]');
const header = document.querySelector('[data-header]');
const root = document.documentElement;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const uiLabels = window.NWISE_UI_LABELS || { contact: '상담 문의', top: 'TOP' };

root.classList.add('js');

function setMenu(open) {
  menuButton?.setAttribute('aria-expanded', String(open));
  nav?.classList.toggle('open', open);
  document.body.classList.toggle('menu-open', open);
}

menuButton?.addEventListener('click', () => {
  setMenu(menuButton.getAttribute('aria-expanded') !== 'true');
});

nav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => setMenu(false));
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 1100) setMenu(false);
});

const scrollProgress = document.createElement('div');
scrollProgress.className = 'scroll-progress';
scrollProgress.setAttribute('aria-hidden', 'true');
document.body.prepend(scrollProgress);

const floatingActions = document.createElement('aside');
floatingActions.className = 'floating-actions';
floatingActions.setAttribute('aria-label', '빠른 메뉴');
floatingActions.innerHTML = `
  <a class="floating-contact" href="mailto:nwiseip@nwiseip.com"><span>${uiLabels.contact}</span><b aria-hidden="true">↗</b></a>
  <a class="floating-top" href="#main" aria-label="${uiLabels.top}"><span>TOP</span><b aria-hidden="true">↑</b></a>
`;
document.body.append(floatingActions);

const parallaxMedia = [...document.querySelectorAll('[data-parallax-media]')];

let scrollTicking = false;
function updateScrollState() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
  scrollProgress.style.transform = `scaleX(${Math.min(1, Math.max(0, progress))})`;
  header?.classList.toggle('is-scrolled', window.scrollY > 24);
  floatingActions.classList.toggle('is-visible', window.scrollY > window.innerHeight * 0.55);

  const hero = document.querySelector('.hero');
  if (hero && !reduceMotion && window.innerWidth > 760) {
    const shift = Math.min(38, window.scrollY * 0.055);
    hero.style.setProperty('--hero-shift', `${shift}px`);
  }

  if (!reduceMotion) {
    parallaxMedia.forEach((media) => {
      const frame = media.parentElement?.getBoundingClientRect();
      if (!frame || frame.bottom < 0 || frame.top > window.innerHeight) return;
      const center = frame.top + frame.height / 2;
      const distance = (center - window.innerHeight / 2) / window.innerHeight;
      media.style.setProperty('--media-shift', `${Math.max(-78, Math.min(12, -36 - distance * 38))}px`);
    });
  }

  scrollTicking = false;
}

function requestScrollUpdate() {
  if (scrollTicking) return;
  scrollTicking = true;
  requestAnimationFrame(updateScrollState);
}

window.addEventListener('scroll', requestScrollUpdate, { passive: true });
window.addEventListener('resize', requestScrollUpdate);
updateScrollState();

const experienceTabs = [...document.querySelectorAll('[data-experience-tab]')];
const experiencePanels = [...document.querySelectorAll('[data-experience-panel]')];
const experienceMedia = [...document.querySelectorAll('[data-experience-media]')];

function activateExperience(index, moveFocus = false) {
  experienceTabs.forEach((tab, tabIndex) => {
    const active = tabIndex === index;
    tab.setAttribute('aria-selected', String(active));
    tab.setAttribute('tabindex', active ? '0' : '-1');
    if (active && moveFocus) tab.focus();
  });
  experiencePanels.forEach((panel, panelIndex) => {
    panel.hidden = panelIndex !== index;
  });
  experienceMedia.forEach((figure, mediaIndex) => {
    const active = mediaIndex === index;
    figure.classList.toggle('is-active', active);
    figure.setAttribute('aria-hidden', String(!active));
  });
}

experienceTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => activateExperience(index));
  tab.addEventListener('keydown', (event) => {
    let nextIndex = index;
    if (event.key === 'ArrowRight') nextIndex = (index + 1) % experienceTabs.length;
    else if (event.key === 'ArrowLeft') nextIndex = (index - 1 + experienceTabs.length) % experienceTabs.length;
    else if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = experienceTabs.length - 1;
    else return;
    event.preventDefault();
    activateExperience(nextIndex, true);
  });
});

if (experienceTabs.length) activateExperience(0);

const revealSelectors = [
  '.section-head',
  '.section-heading',
  '.entry-card',
  'blockquote',
  '.principles article',
  '.service-row',
  '.service-card',
  '.value-statement',
  '.value-panel',
  '.value-products article',
  '.person',
  '.person-card',
  '.insight-list article',
  '.insight-grid article',
  '.trust-grid > div',
  '.glance-card',
  '.visual-story figcaption',
  '.experience-heading',
  '.experience-stat',
  '.experience-shell',
  '.office-card',
  '.visit-note',
  '.contact > div',
  '.profile-portrait',
  '.profile-heading',
  '.profile-facts > div'
];

const revealItems = [...document.querySelectorAll(revealSelectors.join(','))];
revealItems.forEach((item, index) => {
  item.classList.add('reveal-item');
  item.style.setProperty('--reveal-delay', `${Math.min(index % 5, 4) * 65}ms`);
});

if (reduceMotion || !('IntersectionObserver' in window)) {
  revealItems.forEach((item) => item.classList.add('is-visible'));
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });

  revealItems.forEach((item) => revealObserver.observe(item));
}

const valueNumber = document.querySelector('.value-number');
if (valueNumber) {
  const numberNode = [...valueNumber.childNodes].find((node) => node.nodeType === Node.TEXT_NODE);
  const target = Number.parseInt(numberNode?.nodeValue || '92', 10);

  function drawNumber(value) {
    if (numberNode) numberNode.nodeValue = String(value);
  }

  if (reduceMotion || !('IntersectionObserver' in window)) {
    drawNumber(target);
  } else {
    drawNumber(0);
    const countObserver = new IntersectionObserver((entries, observer) => {
      if (!entries[0]?.isIntersecting) return;
      const start = performance.now();
      const duration = 1150;

      function step(now) {
        const elapsed = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - elapsed, 3);
        drawNumber(Math.round(target * eased));
        if (elapsed < 1) requestAnimationFrame(step);
      }

      requestAnimationFrame(step);
      observer.disconnect();
    }, { threshold: 0.5 });

    countObserver.observe(valueNumber);
  }
}

const interactivePanel = document.querySelector('.diagnostic, .route-panel');
if (interactivePanel && !reduceMotion) {
  const cells = [...interactivePanel.querySelectorAll('.cell')];
  cells.forEach((cell, index) => cell.style.setProperty('--cell-delay', `${260 + index * 42}ms`));

  interactivePanel.addEventListener('pointermove', (event) => {
    if (window.innerWidth <= 760) return;
    const rect = interactivePanel.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    interactivePanel.style.setProperty('--diag-x', `${x * 7}px`);
    interactivePanel.style.setProperty('--diag-y', `${y * 7}px`);
  });

  interactivePanel.addEventListener('pointerleave', () => {
    interactivePanel.style.setProperty('--diag-x', '0px');
    interactivePanel.style.setProperty('--diag-y', '0px');
  });
}
