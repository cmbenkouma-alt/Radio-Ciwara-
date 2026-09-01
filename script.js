const audio = document.getElementById('radioPlayer');
const buttons = document.querySelectorAll('[data-play]');
const status = document.getElementById('status');
const playIcon = document.getElementById('playIcon');
const playText = document.getElementById('playText');

function setPlaying(playing) {
  buttons.forEach((button) => {
    button.classList.toggle('playing', playing);
    if (button.id === 'barPlay') button.textContent = playing ? '❚❚' : '▶';
  });
  if (playIcon) playIcon.textContent = playing ? '❚❚' : '▶';
  if (playText) playText.textContent = playing ? 'ARRÊTER LE DIRECT' : 'ÉCOUTER EN DIRECT';
  if (status) status.textContent = playing ? '🔴 Radio Ciwara 105.5 FM est en direct' : 'Prêt à écouter la radio';
}

buttons.forEach((button) => {
  button.addEventListener('click', async () => {
    try {
      if (audio.paused) {
        await audio.play();
        setPlaying(true);
      } else {
        audio.pause();
        audio.currentTime = 0;
        setPlaying(false);
      }
    } catch (error) {
      console.error('Lecture du direct impossible:', error);
      setPlaying(false);
      if (status) status.textContent = 'Le direct est momentanément indisponible. Réessayez dans quelques instants.';
    }
  });
});

audio.addEventListener('playing', () => setPlaying(true));
audio.addEventListener('pause', () => setPlaying(false));
audio.addEventListener('ended', () => setPlaying(false));
audio.addEventListener('error', () => {
  setPlaying(false);
  if (status) status.textContent = 'Le direct est momentanément indisponible. Réessayez dans quelques instants.';
});

document.getElementById('year').textContent = new Date().getFullYear();

const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');
if (hamburger && nav) {
  hamburger.addEventListener('click', () => nav.classList.toggle('open'));
  nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => nav.classList.remove('open')));
}

// Tous les anciens liens « mobile » externes sont désormais centralisés
// vers la page officielle de téléchargement de l'application Radio Ciwara.
document.querySelectorAll('a[href*="ciwarafm.radio12345.com"]').forEach((link) => {
  link.href = '/download-app.html';
  link.target = '_self';
  link.removeAttribute('rel');
  if (link.textContent.includes('Écouter sur mobile')) link.textContent = '📱 Télécharger l’application';
  if (link.textContent.includes('LECTEUR MOBILE')) link.textContent = '📱 TÉLÉCHARGER L’APPLICATION';
  if (link.textContent.includes('Écouter en ligne')) link.textContent = '📱 Télécharger l’application →';
});

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
}

function safeUrl(value) {
  try {
    const url = new URL(value, window.location.href);
    return ['http:', 'https:'].includes(url.protocol) ? url.href : '#';
  } catch (_) {
    return '#';
  }
}

function formatNewsDate(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }).format(date);
}

async function loadNews() {
  const response = await fetch('data/news.json', { cache: 'no-store' });
  if (!response.ok) throw new Error(`news.json: ${response.status}`);
  const data = await response.json();
  const items = Array.isArray(data.items) ? data.items.slice(0, 7) : [];
  if (!items.length) return;

  const big = document.querySelector('.big-news');
  const column = document.querySelector('.news-column');
  if (!big || !column) return;

  const lead = items[0];
  big.innerHTML = `
    <div class="news-thumb">📰<br><b>${escapeHtml(lead.source)}</b></div>
    <div class="news-body">
      <span>À LA UNE • ${escapeHtml(lead.source)}</span>
      <h3>${escapeHtml(lead.title)}</h3>
      <p>${escapeHtml(lead.description || 'Actualité du Mali à retrouver sur la source originale.')}</p>
      <a href="${escapeHtml(safeUrl(lead.link))}" target="_blank" rel="noopener noreferrer">Lire l'article →</a>
    </div>`;

  column.innerHTML = items.slice(1, 7).map((item, index) => `
    <article>
      <time>${String(index + 1).padStart(2, '0')}</time>
      <div>
        <span>${escapeHtml(item.source)}${item.date ? ` • ${escapeHtml(formatNewsDate(item.date))}` : ''}</span>
        <h3><a href="${escapeHtml(safeUrl(item.link))}" target="_blank" rel="noopener noreferrer">${escapeHtml(item.title)}</a></h3>
        <p>${escapeHtml(item.description || '')}</p>
      </div>
    </article>`).join('');
}

async function loadSchedule() {
  const response = await fetch('data/schedule.json', { cache: 'no-store' });
  if (!response.ok) throw new Error(`schedule.json: ${response.status}`);
  const data = await response.json();
  const container = document.querySelector('.schedule');
  if (!container || !Array.isArray(data.days)) return;

  const allItems = data.days.flatMap((day) => day.items.map((item) => ({ ...item, day: day.day })));
  container.innerHTML = allItems.slice(0, 4).map((item) => `
    <article class="show-card">
      <div class="show-image">🎙</div>
      <div class="show-content">
        <small>${escapeHtml(item.day)} • ${escapeHtml(item.time)}</small>
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.description)}</p>
        <strong>${data.status === 'provisional' ? 'GRILLE PROVISOIRE' : 'PROGRAMME'}</strong>
      </div>
    </article>`).join('');
}

loadNews().catch((error) => console.warn('Actualités RSS indisponibles:', error));
loadSchedule().catch((error) => console.warn('Grille indisponible:', error));
