(() => {
  const css = document.createElement('link');
  css.rel = 'stylesheet';
  css.href = 'mali-radios.css?v=20260902';
  document.head.appendChild(css);

  const audio = document.createElement('audio');
  audio.id = 'maliRadioPlayer';
  audio.preload = 'none';
  audio.playsInline = true;
  audio.setAttribute('aria-hidden', 'true');
  audio.style.display = 'none';
  document.body.appendChild(audio);

  const safe = (value = '') => String(value).replace(/[&<>\"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[ch]));

  function build(stations, title, note) {
    const hero = document.querySelector('.hero');
    if (!hero || document.querySelector('.mali-radio-sidebar')) return;

    const aside = document.createElement('aside');
    aside.className = 'mali-radio-sidebar';
    aside.setAttribute('aria-label', title);
    aside.innerHTML = `
      <div class="mali-radio-panel">
        <div class="mali-radio-head">
          <div class="mali-radio-headline"><span class="mali-flag" aria-hidden="true"></span><h2>${safe(title)}</h2></div>
          <p>${safe(note)}</p>
        </div>
        <div class="mali-radio-list">
          ${stations.map((station, index) => `
            <article class="mali-radio-card" data-index="${index}">
              <div class="mali-radio-logo" aria-hidden="true">${safe((station.name || 'RADIO').replace(/[^A-Za-zÀ-ÿ0-9 ]/g,'').slice(0,3).toUpperCase())}</div>
              <div class="mali-radio-info"><strong>${safe(station.name)}</strong><span>${safe(station.frequency || 'Mali')}</span></div>
              <button class="mali-radio-action" type="button" data-radio-index="${index}" aria-label="Écouter ${safe(station.name)}">▶</button>
            </article>`).join('')}
        </div>
        <div class="mali-radio-status"><i></i><span>Choisissez une radio pour lancer l'écoute.</span></div>
        <div class="mali-radio-foot">Les flux sont des adresses publiques trouvées en ligne et peuvent être modifiés par les stations.</div>
      </div>`;

    hero.insertAdjacentElement('afterend', aside);

    const status = aside.querySelector('.mali-radio-status');
    const statusText = status.querySelector('span');
    const cards = [...aside.querySelectorAll('.mali-radio-card')];
    let current = -1;

    function resetCards() {
      cards.forEach(card => {
        card.classList.remove('is-playing');
        const button = card.querySelector('.mali-radio-action');
        button.textContent = '▶';
      });
    }

    function stop() {
      audio.pause();
      audio.removeAttribute('src');
      audio.load();
      current = -1;
      resetCards();
      status.classList.remove('live');
      statusText.textContent = 'Choisissez une radio pour lancer l’écoute.';
    }

    async function play(index) {
      const station = stations[index];
      if (!station?.stream) return;
      if (current === index && !audio.paused) { stop(); return; }
      audio.pause();
      resetCards();
      current = index;
      audio.src = station.stream;
      audio.load();
      statusText.textContent = `Connexion à ${station.name}…`;
      try {
        await audio.play();
        cards[index].classList.add('is-playing');
        cards[index].querySelector('.mali-radio-action').textContent = 'Ⅱ';
        status.classList.add('live');
        statusText.textContent = `${station.name} — EN DIRECT`;
      } catch (error) {
        status.classList.remove('live');
        statusText.textContent = `Le flux de ${station.name} est indisponible pour le moment.`;
        current = -1;
        resetCards();
      }
    }

    aside.querySelectorAll('[data-radio-index]').forEach(button => {
      button.addEventListener('click', () => play(Number(button.dataset.radioIndex)));
    });
    audio.addEventListener('error', () => {
      if (current < 0) return;
      const station = stations[current];
      status.classList.remove('live');
      statusText.textContent = `Le flux de ${station.name} est indisponible pour le moment.`;
      current = -1;
      resetCards();
    });
  }

  fetch(`data/mali-radios.json?ts=${Date.now()}`, {cache: 'no-store'})
    .then(response => { if (!response.ok) throw new Error('radios'); return response.json(); })
    .then(data => build(data.stations || [], data.title || "ÉCOUTER D'AUTRES RADIOS DU MALI", data.note || 'Radios maliennes disponibles en ligne.'))
    .catch(() => build([], "ÉCOUTER D'AUTRES RADIOS DU MALI", 'Les stations seront bientôt disponibles.'));
})();
