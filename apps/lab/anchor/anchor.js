// dial anchor round — builds the device card variants. Lab scaffolding (estimated from chat,
// re-measure from system/refs/ref-01.png). Mechanisms follow kiln docs/style-recipes/tactile.md:
// rotary (11 detents over 270°), key, fader (11 detents). Springs from matte ABS: m 1.4, k 520,
// c 46 → ζ ≈ 0.85, settle ≈ 245ms. Press is instant (fast in), return on the spring (slow out).
// Reduce motion: no throw, values change at once.
(() => {
  const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const MAT = { m: 1.4, k: 520, c: 46 };

  function spring(apply, x0 = 0) {
    let x = x0, v = 0, target = x0, raf = 0, last = 0;
    const tick = (t) => {
      const dt = Math.min(0.032, (t - (last || t)) / 1000 || 1 / 120); last = t;
      for (let i = 0, n = Math.ceil(dt * 120); i < n; i++) { const a = (-MAT.k * (x - target) - MAT.c * v) / MAT.m; v += a / 120; x += v / 120; }
      apply(x);
      if (Math.abs(x - target) < 1e-3 && Math.abs(v) < 1e-3) { x = target; apply(x); raf = 0; last = 0; return; }
      raf = requestAnimationFrame(tick);
    };
    return {
      to(t, { snap = false } = {}) { target = t; if (snap || REDUCED) { x = t; v = 0; apply(x); return; } if (!raf) raf = requestAnimationFrame(tick); },
      get value() { return x; },
    };
  }

  // 7-segment digits drawn as SVG polygons: segments a b c d e f g
  const SEGS = { '0': 'abcdef', '1': 'bc', '2': 'abged', '3': 'abgcd', '4': 'fgbc', '5': 'afgcd', '6': 'afgedc', '7': 'abc', '8': 'abcdefg', '9': 'abcdfg', '-': 'g', ' ': '' };
  function segDigit(ch, x, w, h, t) {
    const on = SEGS[ch] ?? '';
    const m = h / 2, s = t / 2;
    const H = (y) => `${x + s},${y} ${x + t},${y - s} ${x + w - t},${y - s} ${x + w - s},${y} ${x + w - t},${y + s} ${x + t},${y + s}`;
    const V = (xx, y0, y1) => `${xx},${y0 + s} ${xx + s},${y0 + t} ${xx + s},${y1 - t} ${xx},${y1 - s} ${xx - s},${y1 - t} ${xx - s},${y0 + t}`;
    const P = { a: H(s), g: H(m), d: H(h - s), f: V(x + s, s, m), b: V(x + w - s, s, m), e: V(x + s, m, h - s), c: V(x + w - s, m, h - s) };
    return Object.entries(P).map(([k, pts]) => `<polygon class="${on.includes(k) ? 'on' : 'off'}" points="${pts}"/>`).join('');
  }
  function segText(str, h = 40) {
    const w = h * 0.5, t = h * 0.11, gap = h * 0.3; let x = 2, out = '';
    for (const ch of str) {
      if (ch === '.') { out += `<rect class="on" x="${x - gap / 2 - t / 2}" y="${h - t}" width="${t}" height="${t}"/>`; continue; }
      out += segDigit(ch, x, w, h, t); x += w + gap;
    }
    return `<svg class="seg" aria-hidden="true" width="${x}" height="${h}" viewBox="0 0 ${x} ${h}">${out}</svg>`;
  }

  const BANDS = {
    FM: { unit: 'MHz', fmt: (s) => (88 + s * 2).toFixed(1).padStart(5, ' ') },
    AM: { unit: 'kHz', fmt: (s) => String(530 + s * 100).padStart(4, ' ') },
  };

  function build(card) {
    const kind = card.dataset.display; // lcd | oled
    const model = card.dataset.model;
    let band = 'FM', step = 3, vol = 4;

    card.innerHTML = `
      <div class="display ${kind}" role="status" aria-live="polite"></div>
      <div class="grille" aria-hidden="true"></div>
      <div class="knob-wrap"><div class="dial"><div class="knob" tabindex="0" role="slider" aria-label="Tuning"
        aria-valuemin="0" aria-valuemax="10"></div></div></div>
      <div class="keys" role="group" aria-label="Band"></div>
      <div class="fader-wrap"><div class="fader" tabindex="0" role="slider" aria-label="Volume" aria-valuemin="0" aria-valuemax="10">
        <div class="rule"></div><div class="groove"></div><div class="cap"></div></div>
        <div class="scale" aria-hidden="true"><span>0</span><span>2</span><span>4</span><span>6</span><span>8</span><span>10</span></div></div>
      <div class="model-under">${model}</div>
      <div class="labels"><span class="wordmark">dial</span><span class="model">${model}</span></div>`;

    const disp = card.querySelector('.display');
    const grille = card.querySelector('.grille');
    const cols = +getComputedStyle(grille).getPropertyValue('--cols') || 12;
    const rows = +card.dataset.rows || 4;
    for (let i = 0; i < cols * rows; i++) grille.append(document.createElement('i'));
    const holes = [...grille.children];

    const render = () => {
      const val = BANDS[band].fmt(step), unit = BANDS[band].unit;
      if (kind === 'lcd') {
        disp.innerHTML = `${segText(val, +card.dataset.seg || 40)}<span class="unit-label">${unit}</span><span class="sr-only">${val.trim()} ${unit}, volume ${vol}</span>`;
      } else {
        disp.innerHTML = `<span class="oled-big">${val.trim()} ${unit}</span><span class="oled-small">${band} · volume ${vol}</span><span class="oled-bar" aria-hidden="true"><i style="width:${vol * 10}%"></i></span>`;
      }
      // grille = level meter: lit columns in reading order, left to right (P4)
      const litCols = Math.round((vol / 10) * cols);
      holes.forEach((h, i) => h.classList.toggle('on', (i % cols) < litCols));
    };

    // keys: FM / AM, a two-key radio group (secondary, body-coloured)
    const keys = card.querySelector('.keys');
    for (const b of ['FM', 'AM']) {
      const cell = document.createElement('div'); cell.className = 'key-cell';
      const lab = document.createElement('span'); lab.textContent = b; lab.id = `${card.id}-${b}`;
      const k = document.createElement('button'); k.className = 'key'; k.type = 'button';
      k.setAttribute('aria-labelledby', lab.id); k.setAttribute('aria-pressed', String(b === band)); k.innerHTML = '<span class="lamp"></span>';
      const ks = spring((t) => k.style.setProperty('--t', t.toFixed(3)));
      const down = () => ks.to(1, { snap: true }), up = () => ks.to(0);
      k.addEventListener('pointerdown', down); k.addEventListener('pointerup', up); k.addEventListener('pointerleave', up);
      k.addEventListener('keydown', (e) => { if (e.key === ' ' || e.key === 'Enter') down(); });
      k.addEventListener('keyup', (e) => { if (e.key === ' ' || e.key === 'Enter') up(); });
      k.addEventListener('click', () => { band = b; keys.querySelectorAll('.key').forEach((o) => o.setAttribute('aria-pressed', String(o === k))); render(); });
      cell.append(lab, k); keys.append(cell);
    }

    // rotary: 11 detents over 270°
    const dial = card.querySelector('.dial'); const knob = card.querySelector('.knob');
    const R = dial.getBoundingClientRect().width / 2 - 4;
    for (let i = 0; i <= 10; i++) { const t = document.createElement('i'); t.className = 'tick'; t.style.transform = `rotate(${-135 + i * 27 + 180}deg) translateY(${R - 5}px)`; dial.prepend(t); }
    const ksp = spring((d) => knob.style.setProperty('--deg', d.toFixed(2)), -135 + step * 27);
    const setStep = (s, o) => { step = Math.max(0, Math.min(10, s)); knob.setAttribute('aria-valuenow', String(step));
      knob.setAttribute('aria-valuetext', `${BANDS[band].fmt(step).trim()} ${BANDS[band].unit}`); ksp.to(-135 + step * 27, o); render(); };
    setStep(step, { snap: true });
    knob.addEventListener('keydown', (e) => { const m = { ArrowUp: 1, ArrowRight: 1, ArrowDown: -1, ArrowLeft: -1 }[e.key];
      if (m) { e.preventDefault(); setStep(step + m); } if (e.key === 'Home') { e.preventDefault(); setStep(0); } if (e.key === 'End') { e.preventDefault(); setStep(10); } });
    knob.addEventListener('pointerdown', (e) => {
      knob.setPointerCapture(e.pointerId); const y0 = e.clientY, d0 = ksp.value;
      const move = (ev) => ksp.to(Math.max(-135, Math.min(135, d0 + (y0 - ev.clientY) * 1.6)), { snap: true });
      const end = () => { knob.removeEventListener('pointermove', move); setStep(Math.round((ksp.value + 135) / 27)); };
      knob.addEventListener('pointermove', move); knob.addEventListener('pointerup', end, { once: true });
    });

    // fader: 11 detents on the ruler
    const f = card.querySelector('.fader'), cap = f.querySelector('.cap');
    const fsp = spring((x) => cap.style.setProperty('--x', x.toFixed(4)), vol / 10);
    const setVol = (v, o) => { vol = Math.max(0, Math.min(10, v)); f.setAttribute('aria-valuenow', String(vol)); fsp.to(vol / 10, o); render(); };
    setVol(vol, { snap: true });
    f.addEventListener('keydown', (e) => { const m = { ArrowUp: 1, ArrowRight: 1, ArrowDown: -1, ArrowLeft: -1 }[e.key];
      if (m) { e.preventDefault(); setVol(vol + m); } if (e.key === 'Home') { e.preventDefault(); setVol(0); } if (e.key === 'End') { e.preventDefault(); setVol(10); } });
    f.addEventListener('pointerdown', (e) => {
      f.setPointerCapture(e.pointerId); const r = f.getBoundingClientRect();
      const at = (ev) => Math.max(0, Math.min(1, (ev.clientX - r.left - 12) / (r.width - 24)));
      const move = (ev) => fsp.to(at(ev), { snap: true }); move(e);
      const end = (ev) => { f.removeEventListener('pointermove', move); setVol(Math.round(at(ev) * 10)); };
      f.addEventListener('pointermove', move); f.addEventListener('pointerup', end, { once: true });
    });
  }

  document.querySelectorAll('[data-anchor]').forEach(build);

  // theme switch for the lab page (not part of the card); never written to the URL or storage
  const set = (t) => { document.documentElement.dataset.theme = t;
    document.querySelectorAll('[data-set-theme]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.setTheme === t))); };
  document.querySelectorAll('[data-set-theme]').forEach((b) => b.addEventListener('click', () => set(b.dataset.setTheme)));
  const q = new URLSearchParams(location.search).get('theme');
  set(q === 'dark' ? 'dark' : 'light');
})();
