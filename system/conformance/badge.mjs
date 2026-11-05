// Behaviour checks for Badge, run by tooling/kiln/conformance.mjs on the built book. Badge is printing on
// the case: a lamp whose shape is set by the tone, and a word. Flat, never orange, never colour alone.
export default async function badge({ check, expect, go, main }) {
  const all = () => main().locator('[data-component="Badge"]');

  await check('Badge', 'every badge prints a word beside its glyph', async () => {
    await go('/components/badge/code');
    const r = await all().evaluateAll((els) => els.map((e) => ({ text: e.textContent.trim(), glyph: !!e.querySelector('svg[aria-hidden="true"]') })));
    expect(r.length > 0, 'no Badge on the page');
    const bad = r.filter((x) => !/[\p{L}]/u.test(x.text) || !x.glyph);
    expect(!bad.length, `${bad.length} badges without a word or a hidden glyph`);
    return `${r.length} badges`;
  });

  await check('Badge', 'each tone has its own glyph shape', async () => {
    await go('/components/badge/code');
    const r = await all().evaluateAll((els) => {
      const by = {};
      // the lit shape (R-008: every shape stands in the window and the tone's own is lit)
      for (const e of els) { const s = e.querySelector('svg > [data-on] > *') ?? e.querySelector('svg > *'); if (s) by[e.dataset.tone] = `${s.tagName}${s.getAttribute('d') ?? ''}${s.getAttribute('r') ?? ''}`; }
      return by;
    });
    const tones = Object.keys(r);
    expect(tones.length >= 5, `only tones ${tones.join(', ')} on the page`);
    expect(new Set(Object.values(r)).size === tones.length, `shapes ${JSON.stringify(r)}`);
    return `${tones.length} tones, ${new Set(Object.values(r)).size} shapes`;
  });

  await check('Badge', 'badges are flat printing and never orange', async () => {
    await go('/components/badge/code');
    const r = await all().evaluateAll((els) => {
      const probe = (c) => { const d = document.createElement('span'); d.style.color = `var(${c})`; document.body.append(d); const x = getComputedStyle(d).color; d.remove(); return x; };
      const accent = probe('--ds-action-accent');
      return els.map((e) => {
        const c = getComputedStyle(e); const g = getComputedStyle(e.querySelector('svg'));
        return { shadow: c.boxShadow, bg: c.backgroundColor, fill: g.fill, color: c.color, accent };
      });
    });
    const bad = r.filter((x) => x.shadow !== 'none' || x.bg !== 'rgba(0, 0, 0, 0)' || x.fill === x.accent || x.color === x.accent);
    expect(!bad.length, `bad: ${JSON.stringify(bad.slice(0, 2))}`);
    return `${r.length} flat, none orange`;
  });

  await check('Badge', 'Tab never lands on a badge', async () => {
    await go('/components/badge/code');
    const n = await all().evaluateAll((els) => els.filter((e) => e.tabIndex >= 0 || e.querySelector('[tabindex]')).length);
    expect(n === 0, `${n} focusable badges`);
    return 'not focusable';
  });
}
