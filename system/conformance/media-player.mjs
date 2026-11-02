// Behaviour checks for MediaPlayer (the reference MP3 player as one unit), run by tooling/kiln/conformance.mjs on the built book.
// The book's tracks are tones rendered in the browser, so these checks play real audio with no file and no network.
export default async function mediaPlayer({ check, expect, page, go, main, tokens }) {
  const px = (s) => parseFloat(s);
  const ROUTE = '/components/media-player/code';
  // the first player whose tracks have rendered: its play key is enabled
  const ready = async () => {
    await go(ROUTE);
    const p = main().locator('[data-component="MediaPlayer"]:not([aria-busy="true"]):has([data-kind="primary"]:not(:disabled))').first();
    await p.waitFor({ timeout: 8000 });
    return p;
  };
  const sound = (p) => p.evaluate((el) => { const a = el.querySelector('audio'); return { paused: a.paused, t: a.currentTime, src: a.currentSrc.split(':')[0] }; });
  const play = (p) => p.locator('[data-kind="primary"]');
  const said = (p) => p.locator('[role="status"][data-glow]').textContent();

  await check('MediaPlayer', 'pressing play really starts the audio element and pressing it again pauses it', async () => {
    const p = await ready();
    const before = await sound(p);
    expect(before.paused, 'the audio was playing before any press');
    await play(p).click();
    await page.waitForTimeout(700);
    const on = await sound(p);
    const pressed = await play(p).getAttribute('aria-pressed');
    const word = await said(p);
    expect(!on.paused && on.t > 0.2, `after the press paused ${on.paused}, at ${on.t.toFixed(2)}s`);
    expect(pressed === 'true' && /Playing/.test(word ?? ''), `aria-pressed ${pressed}, window "${word}"`);
    await play(p).click();
    await page.waitForTimeout(300);
    const off = await sound(p);
    const word2 = await said(p);
    expect(off.paused && /Paused/.test(word2 ?? ''), `after the second press paused ${off.paused}, window "${word2}"`);
    return `played ${on.t.toFixed(2)}s from a ${on.src} URL, then paused`;
  });

  await check('MediaPlayer', 'Space toggles play while focus is in the player outside a key', async () => {
    const p = await ready();
    await p.locator('[role="slider"]').first().focus();
    await page.keyboard.press('Space');
    await page.waitForTimeout(500);
    const on = await sound(p);
    await page.keyboard.press('Space');
    const off = await sound(p);
    expect(!on.paused && off.paused, `Space gave paused ${on.paused}, then ${off.paused}`);
    return 'Space on the scrubber played, then paused';
  });

  await check('MediaPlayer', 'arrow keys on the scrubber seek the audio five seconds', async () => {
    const p = await ready();
    const s = p.locator('[data-component="Scrubber"] [role="slider"]');
    await s.focus(); await page.keyboard.press('Home'); await page.keyboard.press('ArrowRight');
    const t = (await sound(p)).t;
    expect(Math.abs(t - 5) < 0.5, `ArrowRight seeked to ${t.toFixed(2)}s`);
    await page.keyboard.press('Home');
    const t0 = (await sound(p)).t;
    expect(t0 < 0.5, `Home seeked to ${t0.toFixed(2)}s`);
    return `0 → ${t.toFixed(1)}s → ${t0.toFixed(1)}s`;
  });

  await check('MediaPlayer', 'every key has a name and play says pressed only while it plays', async () => {
    const p = await ready();
    const keys = await p.locator('[role="group"] button').evaluateAll((els) => els.map((e) => ({ name: e.getAttribute('aria-label') ?? '', pressed: e.getAttribute('aria-pressed') })));
    expect(keys.length === 3 && keys.every((k) => k.name.trim().length > 2), `keys ${JSON.stringify(keys)}`);
    expect(keys[1].pressed === 'false' && keys[0].pressed == null && keys[2].pressed == null, `pressed ${keys.map((k) => k.pressed).join(', ')}`);
    const group = await p.locator('[role="group"]').getAttribute('aria-label');
    expect(!!group, 'the transport group has no name');
    return keys.map((k) => k.name).join(', ');
  });

  await check('MediaPlayer', 'next plays the following track and the window follows', async () => {
    const p = await ready();
    const t1 = await said(p);
    await play(p).click();
    await p.locator('[role="group"] button').nth(2).click();
    await page.waitForTimeout(600);
    const t2 = await said(p);
    const s = await sound(p);
    await play(p).click();
    expect(t1 !== t2 && /Track 2 of/.test(t2 ?? '') && !s.paused, `window "${t1}" → "${t2}", paused ${s.paused}`);
    return t2;
  });

  await check('MediaPlayer', 'play is the one orange part of the unit and every key is at least the touch target', async () => {
    const p = await ready();
    const min = px(tokens['layout.touch']?.value ?? '44px');
    const r = await p.evaluate((root) => {
      const probe = document.createElement('span'); probe.style.color = 'var(--ds-action-accent)'; document.body.append(probe);
      const accent = getComputedStyle(probe).color; probe.remove();
      const orange = [...root.querySelectorAll('*')].filter((n) => getComputedStyle(n).backgroundColor === accent).length;
      const sizes = [...root.querySelectorAll('button')].map((b) => { const q = b.getBoundingClientRect(); return Math.min(q.width, q.height); });
      return { orange, sizes };
    });
    expect(r.orange === 1, `${r.orange} parts in the accent`);
    expect(r.sizes.every((s) => s >= min - 0.5), `key sizes ${r.sizes.join(', ')}`);
    return `1 orange part, keys ${Math.min(...r.sizes)}px and up`;
  });

  await check('MediaPlayer', 'loading, offline and a broken file are each told by a glyph and a word in the window', async () => {
    await go(ROUTE);
    const demo = main().locator('[data-example-live]:has([data-component="MediaPlayer"] ~ [data-component="MediaPlayer"])').first();
    await page.waitForTimeout(800);
    const r = await demo.locator('[data-component="MediaPlayer"]').evaluateAll((els) => els.map((el) => {
      const w = el.querySelector('[role="status"][data-glow]');
      return { busy: el.getAttribute('aria-busy'), text: w.textContent, glyph: !!w.querySelector('svg path, svg rect, svg circle'), play: el.querySelector('[data-kind="primary"]').disabled };
    }));
    const [loading, offline, broken] = r;
    expect(r.length >= 3, `${r.length} players in the states example`);
    expect(loading.busy === 'true' && /Loading/.test(loading.text) && loading.glyph, `loading ${JSON.stringify(loading)}`);
    expect(/Offline/.test(offline.text) && offline.glyph && offline.play, `offline ${JSON.stringify(offline)}`);
    expect(/Can.t play this file/.test(broken.text) && broken.glyph && broken.play, `error ${JSON.stringify(broken)}`);
    return 'Loading, Offline, Can’t play this file';
  });
}
