// Behaviour checks for Meter (a static reading on a printed scale), run by tooling/kiln/conformance.mjs on the built book.
export default async function meter({ check, expect, page, go, main }) {
  const ROUTE = '/components/meter/code';
  const all = () => main().locator('[data-component="Meter"]');

  await check('Meter', 'every meter is named and says its reading as text', async () => {
    await go(ROUTE);
    const r = await all().evaluateAll((els) => els.map((e) => ({
      role: e.getAttribute('role'), name: (document.getElementById(e.getAttribute('aria-labelledby') ?? '')?.textContent ?? '').trim(),
      now: e.getAttribute('aria-valuenow'), min: e.getAttribute('aria-valuemin'), max: e.getAttribute('aria-valuemax'), text: e.getAttribute('aria-valuetext'),
      tab: e.tabIndex, focusables: e.querySelectorAll('[tabindex], button, a, input').length,
    })));
    expect(r.length > 0, 'no Meter on the page');
    const bad = r.filter((x) => x.role !== 'meter' || !x.name || !x.text || x.now === null || x.min === null || x.max === null);
    expect(!bad.length, `bad: ${JSON.stringify(bad.slice(0, 2))}`);
    expect(r.every((x) => x.tab < 0 && x.focusables === 0), 'a meter is in the tab order');
    return `${r.length} meters, none focusable`;
  });

  await check('Meter', 'a region is told by its own glyph and a word, not by colour alone', async () => {
    await go(ROUTE);
    const r = await all().evaluateAll((els) => els.filter((e) => e.dataset.region).map((e) => ({
      region: e.dataset.region, word: e.firstElementChild.lastElementChild.lastElementChild?.textContent?.trim(),
      shape: e.querySelector('svg')?.innerHTML ?? '', text: e.getAttribute('aria-valuetext'),
    })));
    expect(r.length > 0, 'no meter with regions');
    const shapes = new Map();
    for (const x of r) { if (!shapes.has(x.region)) shapes.set(x.region, x.shape); }
    expect(new Set(shapes.values()).size === shapes.size, `regions share a glyph: ${[...shapes.keys()].join(', ')}`);
    const bad = r.filter((x) => !x.word || !(x.text ?? '').includes(x.word));
    expect(!bad.length, `no word or not announced: ${JSON.stringify(bad.slice(0, 2))}`);
    return `${shapes.size} region shapes over ${r.length} meters`;
  });

  await check('Meter', 'the needle stands at the reading', async () => {
    await go(ROUTE);
    const r = await all().evaluateAll((els) => els.map((e) => {
      const win = e.children[1]; const needle = win.lastElementChild;
      const pad = parseFloat(getComputedStyle(needle).inlineSize) || 0;
      const w = win.getBoundingClientRect(); const n = needle.getBoundingClientRect();
      const min = +e.getAttribute('aria-valuemin'), max = +e.getAttribute('aria-valuemax'), v = +e.getAttribute('aria-valuenow');
      const rtl = getComputedStyle(e).direction === 'rtl';
      const f = rtl ? (w.right - n.right) / w.width : (n.left - w.left) / w.width;
      return { want: (v - min) / (max - min), got: f, pad };
    }));
    const off = r.filter((x) => Math.abs(x.want - x.got) > 0.06);
    expect(!off.length, `needles off: ${off.map((x) => `${x.want.toFixed(2)} at ${x.got.toFixed(2)}`).join(', ')}`);
    return `${r.length} needles within 6% of the range`;
  });

  await check('Meter', 'nothing on a meter moves or is the accent', async () => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    try {
      await go(ROUTE);
      const r = await all().evaluateAll((els) => {
        const probe = document.createElement('span'); probe.style.color = 'var(--ds-action-accent)'; document.body.append(probe);
        const accent = getComputedStyle(probe).color; probe.remove();
        const parts = els.flatMap((e) => [e, ...e.querySelectorAll('*')]);
        const moving = parts.filter((n) => { const c = getComputedStyle(n); return c.animationName !== 'none' || (c.transitionDuration.split(',').some((d) => parseFloat(d) > 0) && c.transitionProperty !== 'all'); }).length;
        const orange = parts.filter((n) => { const c = getComputedStyle(n); return [c.backgroundColor, c.color, c.fill, c.borderInlineStartColor].includes(accent); }).length;
        return { moving, orange };
      });
      expect(r.moving === 0 && r.orange === 0, `${r.moving} animated parts, ${r.orange} in the accent`);
      return 'still, no accent';
    } finally { await page.emulateMedia({ reducedMotion: 'reduce' }); }
  });
}
