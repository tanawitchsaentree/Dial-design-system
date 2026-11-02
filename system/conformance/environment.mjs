// Behaviour checks for Environment (one room's air on one unit), run by tooling/kiln/conformance.mjs on the built book.
export default async function environment({ check, expect, go, main }) {
  const ROUTE = '/components/environment/code';
  const all = () => main().locator('[data-component="Environment"]');
  const unit = (room) => all().filter({ hasText: room }).first();

  await check('Environment', 'each unit is a region named by its room, and its main reading is a polite status region', async () => {
    await go(ROUTE);
    const r = await all().evaluateAll((els) => els.map((e) => {
      const win = e.querySelector('[data-component="Display"]');
      return { tag: e.tagName, name: e.getAttribute('aria-label'), win: win?.getAttribute('role'), live: win?.getAttribute('aria-live'), winName: win?.getAttribute('aria-label') ?? '' };
    }));
    expect(r.length > 0, 'no Environment on the page');
    const bad = r.filter((x) => x.tag !== 'SECTION' || !x.name || x.win !== 'status' || x.live !== 'polite');
    expect(!bad.length, `bad: ${JSON.stringify(bad.slice(0, 2))}`);
    return `${r.length} units, windows polite`;
  });

  await check('Environment', 'every meter is labelled and reads its region in words', async () => {
    await go(ROUTE);
    const r = await all().evaluateAll((els) => els.flatMap((e) => [...e.querySelectorAll('[data-component="Meter"]')].map((m) => ({
      name: (document.getElementById(m.getAttribute('aria-labelledby') ?? '')?.textContent ?? '').trim(), text: m.getAttribute('aria-valuetext') ?? '',
    }))));
    expect(r.length > 0, 'no meters');
    const bad = r.filter((x) => !x.name || !/, \S/.test(x.text));
    expect(!bad.length, `unnamed or no region word: ${JSON.stringify(bad.slice(0, 2))}`);
    return `${r.length} meters named, each with a region word`;
  });

  await check('Environment', 'the room is printed bottom-left and the time bottom-right, under every part', async () => {
    await go(ROUTE);
    const r = await all().evaluateAll((els) => els.map((e) => {
      const labels = e.lastElementChild; const [room, time] = labels.children;
      const face = e.firstElementChild.getBoundingClientRect(); const a = room.getBoundingClientRect(); const b = time.getBoundingClientRect();
      const rtl = getComputedStyle(e).direction === 'rtl';
      return { room: room.textContent, time: time.textContent, below: a.top >= face.bottom - 1 && b.top >= face.bottom - 1, order: rtl ? a.left > b.left : a.left < b.left, name: e.getAttribute('aria-label') };
    }));
    const bad = r.filter((x) => !x.below || !x.order || x.room !== x.name || !/\d/.test(x.time));
    expect(!bad.length, `misplaced: ${JSON.stringify(bad.slice(0, 2))}`);
    return `${r.length} units with room and time on the foot line`;
  });

  await check('Environment', 'a late or silent sensor says so in words, with a glyph and the time of the last reading', async () => {
    await go(ROUTE);
    const read = (room) => unit(room).evaluate((e) => {
      const n = e.querySelector('p[role="status"]');
      return { state: e.dataset.state, live: n?.getAttribute('aria-live'), words: n?.textContent ?? '', glyph: !!n?.querySelector('svg'), tone: n?.querySelector('[data-component="Badge"]')?.dataset.tone, window: e.querySelector('[data-component="Display"]').textContent };
    });
    const late = await read('Bedroom');
    const off = await read('Garage');
    expect(late.state === 'stale' && late.live === 'polite' && late.glyph && late.tone === 'warning' && /10:17/.test(late.words), `late ${JSON.stringify(late)}`);
    expect(off.state === 'offline' && off.glyph && off.tone === 'critical' && /Not answering/.test(off.words) && /09:58/.test(off.words) && /Not answering/.test(off.window), `offline ${JSON.stringify(off)}`);
    return `"${late.words}", "${off.words}"`;
  });

  await check('Environment', 'the unit only reads, so nothing takes focus and nothing is the accent', async () => {
    await go(ROUTE);
    const r = await all().evaluateAll((els) => {
      const probe = document.createElement('span'); probe.style.color = 'var(--ds-action-accent)'; document.body.append(probe);
      const accent = getComputedStyle(probe).color; probe.remove();
      const parts = els.flatMap((e) => [e, ...e.querySelectorAll('*')]);
      return {
        focusable: els.reduce((n, e) => n + e.querySelectorAll('button, a[href], input, [tabindex]:not([tabindex="-1"])').length, 0),
        orange: parts.filter((n) => { const c = getComputedStyle(n); return [c.backgroundColor, c.color, c.fill].includes(accent); }).length,
      };
    });
    expect(r.focusable === 0 && r.orange === 0, `${r.focusable} focusable, ${r.orange} in the accent`);
    return 'no focus stops, no accent';
  });
}
