(() => {
  'use strict';

  const onReady = (fn) => document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', fn, { once: true })
    : fn();

  const esc = (value) => String(value ?? '').replace(/[&<>\"']/g, (c) => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'
  }[c]));

  const clean = (value, max = 180) => String(value ?? '').replace(/\s+/g, ' ').trim().slice(0, max);

  function getHeroColumns() {
    const grid = document.querySelector('.hero-grid, .hero-layout, .hero-shell');
    if (!grid) return null;
    const cols = [...grid.querySelectorAll('.hero-video-col, .hero-news-col')];
    if (cols.length < 2) return null;

    // Safety rule: identify the column containing Caster.fm first, then only rebuild its sibling.
    const caster = document.getElementById('74o6tf') || grid.querySelector('.cstrEmbed');
    const casterCol = caster?.closest('.hero-video-col, .hero-news-col');
    const sliderCol = cols.find((col) => col !== casterCol) || cols[0];
    return { grid, cols, casterCol, sliderCol };
  }

  async function getEmissionItems() {
    const candidates = [];
    const add = (a, fallbackTitle = '') => {
      if (!a) return;
      const img = a.querySelector('img');
      const src = img?.currentSrc || img?.src || img?.getAttribute('src');
      const href = a.href || a.getAttribute('href');
      if (!src || !href || /^javascript:/i.test(href)) return;
      const text = clean(a.innerText || img?.alt || img?.title || fallbackTitle, 120);
      const hay = `${a.className} ${href} ${text} ${img?.alt || ''}`.toLowerCase();
      const score = (/(emission|émission|programme|animateur|podcast)/i.test(hay) ? 4 : 0)
        + (a.closest('article,.card,.emission-card,.emission-item,.program-card') ? 2 : 0);
      candidates.push({ src, href, title: text || 'Émission Radio Ciwara', score });
    };

    try {
      const response = await fetch('emissions.html', { cache: 'no-store' });
      if (response.ok) {
        const html = await response.text();
        const doc = new DOMParser().parseFromString(html, 'text/html');
        doc.querySelectorAll('article a, .emission-card a, .emission-item a, .program-card a, .card a, a').forEach((a) => add(a));
      }
    } catch (_) {}

    // Fallback to emission/program cards already present on the homepage.
    if (candidates.length < 3) {
      document.querySelectorAll('.emission-card a, .emission-item a, .program-card a, article a, .card a').forEach((a) => add(a));
    }

    const seen = new Set();
    return candidates
      .sort((a, b) => b.score - a.score)
      .filter((item) => {
        const key = `${item.href}|${item.src}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .slice(0, 10);
  }

  function makeEmissionStage(items) {
    const stage = document.createElement('section');
    stage.className = 'ciwara-future-emissions';
    stage.setAttribute('aria-label', 'Émissions Radio Ciwara');

    const slides = items.length ? items : [{
      src: 'assets/ciwara-logo.jpg', href: 'emissions.html', title: 'Découvrez les émissions de Radio Ciwara'
    }];

    stage.innerHTML = `
      <div class="future-kicker">
        <strong>CIWARA • ÉMISSIONS</strong>
        <span class="future-live-dot">PROGRAMME EN CONTINU</span>
      </div>
      <div class="future-emission-slider">
        ${slides.map((item, i) => `
          <article class="future-emission-slide${i === 0 ? ' is-active' : ''}" data-index="${i}">
            <div class="future-emission-copy">
              <span class="eyebrow">Émission Radio Ciwara</span>
              <h2>${esc(item.title)}</h2>
              <p>Retrouvez vos rendez-vous, vos animateurs et toute l'énergie de Radio Ciwara 105.5 FM.</p>
            </div>
            <a class="future-emission-art" href="${esc(item.href)}" aria-label="Ouvrir ${esc(item.title)}">
              <img src="${esc(item.src)}" alt="${esc(item.title)}" loading="eager">
            </a>
          </article>
        `).join('')}
      </div>
      <div class="future-emission-dots" aria-label="Navigation des émissions">
        ${slides.map((_, i) => `<button type="button" data-slide="${i}" aria-label="Émission ${i + 1}" class="${i === 0 ? 'is-active' : ''}"></button>`).join('')}
      </div>`;

    const slideEls = [...stage.querySelectorAll('.future-emission-slide')];
    const dots = [...stage.querySelectorAll('.future-emission-dots button')];
    let index = 0;
    let timer = null;

    const go = (next) => {
      index = (next + slideEls.length) % slideEls.length;
      slideEls.forEach((el, i) => el.classList.toggle('is-active', i === index));
      dots.forEach((el, i) => el.classList.toggle('is-active', i === index));
    };
    const start = () => { clearInterval(timer); timer = setInterval(() => go(index + 1), 5200); };
    dots.forEach((dot, i) => dot.addEventListener('click', () => { go(i); start(); }));
    stage.addEventListener('mouseenter', () => clearInterval(timer));
    stage.addEventListener('mouseleave', start);
    start();
    return stage;
  }

  async function buildEmissionHero() {
    const parts = getHeroColumns();
    if (!parts) return;

    parts.grid.classList.add('ciwara-future-hero');
    const sliderCol = parts.sliderCol;

    // Never touch the Caster column or its descendants.
    if (parts.casterCol === sliderCol) return;
    sliderCol.innerHTML = '';
    sliderCol.appendChild(makeEmissionStage(await getEmissionItems()));
  }

  function normalizeNews(payload) {
    const list = Array.isArray(payload) ? payload : (payload?.news || payload?.articles || payload?.items || payload?.data || []);
    if (!Array.isArray(list)) return [];
    return list.map((n) => ({
      title: clean(n.title || n.name || n.headline, 120),
      description: clean(n.description || n.summary || n.excerpt, 180),
      image: n.image || n.imageUrl || n.thumbnail || n.urlToImage || n.enclosure?.url || '',
      url: n.url || n.link || n.href || '#',
      source: clean(n.source?.name || n.source || n.category || 'Ciwara Infos', 50)
    })).filter((n) => n.title);
  }

  function renderNewsStage(items) {
    const existing = document.querySelector('.ciwara-news-stage');
    if (existing) return;
    const hero = document.querySelector('.hero-grid, .hero-layout, .hero-shell');
    if (!hero) return;

    const stage = document.createElement('section');
    stage.className = 'ciwara-news-stage';
    stage.setAttribute('aria-label', 'Actualités Ciwara Infos et flux RSS');
    stage.innerHTML = `
      <div class="ciwara-news-stage-head">
        <div>
          <span class="ciwara-rss-pill">● CIWARA INFOS • FLUX RSS</span>
          <h2>L'actualité <span>en mouvement</span></h2>
          <p>Les dernières informations du Mali et les flux éditoriaux de Ciwara Infos.</p>
        </div>
      </div>
      <div class="ciwara-news-track">
        ${items.slice(0, 12).map((n) => `
          <article class="ciwara-news-card">
            <a href="${esc(n.url)}" target="_blank" rel="noopener noreferrer">
              ${n.image ? `<img src="${esc(n.image)}" alt="" loading="lazy">` : '<div style="height:190px;background:linear-gradient(135deg,#1769ff,#ff3f91)"></div>'}
              <div class="ciwara-news-card-body">
                <small>${esc(n.source)}</small>
                <h3>${esc(n.title)}</h3>
                ${n.description ? `<p>${esc(n.description)}</p>` : ''}
              </div>
            </a>
          </article>
        `).join('')}
      </div>`;

    hero.insertAdjacentElement('afterend', stage);
  }

  async function buildNewsStage() {
    try {
      const response = await fetch('data/news.json', { cache: 'no-store' });
      if (response.ok) {
        const items = normalizeNews(await response.json());
        if (items.length) return renderNewsStage(items);
      }
    } catch (_) {}

    // Graceful fallback: reuse visible news cards without modifying their DOM.
    const items = [...document.querySelectorAll('.news-card, .article-card, .news-grid article, .news-list article')]
      .map((card) => {
        const a = card.querySelector('a');
        const img = card.querySelector('img');
        return a ? { title: clean(card.innerText, 120), image: img?.src || '', url: a.href, source: 'Ciwara Infos' } : null;
      }).filter(Boolean);
    if (items.length) renderNewsStage(items);
  }

  onReady(async () => {
    // Give the existing refonte scripts a moment to finish their non-Caster rendering.
    await new Promise((resolve) => setTimeout(resolve, 180));
    await buildEmissionHero();
    await buildNewsStage();
  });
})();
