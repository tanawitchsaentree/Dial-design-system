// Behaviour checks for Stat (one named figure in a recessed window), run by tooling/kiln/conformance.mjs.
export default async function stat({ check, expect, go, main }) {
  await check('Stat', 'the figure is a labelled group and takes no focus', async () => {
    await go('/components/stat/code');
    const r = await main().locator('[data-component="Stat"]').first().evaluate((el) => {
      const named = el.getAttribute('aria-labelledby') && document.getElementById(el.getAttribute('aria-labelledby'));
      return { role: el.getAttribute('role'), name: named ? named.textContent : '', focusable: el.querySelectorAll('a[href],button,input,select,textarea,[tabindex]').length, text: el.textContent };
    });
    expect(r.role === 'group' || r.role === 'status', `role ${r.role}`);
    expect(r.name.trim().length > 0, 'the group has no name');
    expect(r.focusable === 0, `${r.focusable} focusable parts`);
    expect(/\d/.test(r.text), `no figure in "${r.text}"`);
    return `${r.role} named "${r.name.trim()}", no focusable part`;
  });
  await check('Stat', 'a change is told by a glyph and a word and never by colour', async () => {
    await go('/components/stat/code');
    const r = await main().locator('[data-component="Stat"][data-trend]').first().evaluate((el) => {
      const change = el.lastElementChild;
      const word = change.querySelector('span');
      const cs = (n) => getComputedStyle(n);
      const glyph = change.querySelector('svg');
      const gb = glyph ? glyph.getBoundingClientRect() : { width: 0, height: 0 };
      const inks = new Set([cs(el).color, cs(change).color, cs(word).color]);
      return { trend: el.getAttribute('data-trend'), word: word.textContent.trim(), glyph: gb.width * gb.height, dots: glyph ? glyph.querySelectorAll('circle[data-on]').length : 0, inks: inks.size };
    });
    expect(r.word.length > 0, 'the change has no word');
    expect(r.glyph > 0 && r.dots > 0, `glyph ${r.glyph}px² with ${r.dots} lit dots`);
    return `${r.trend}: "${r.word}" with a ${r.dots}-dot glyph`;
  });
  await check('Stat', 'the figure sits in a recessed window with a real edge and tabular numerals', async () => {
    await go('/components/stat/code');
    const r = await main().locator('[data-component="Stat"]').first().evaluate((el) => {
      const w = el.children[1]; const f = w.firstElementChild;
      const s = getComputedStyle(w);
      return { shadow: s.boxShadow, border: parseFloat(s.borderBlockStartWidth), tab: getComputedStyle(f).fontVariantNumeric, h: w.getBoundingClientRect().height };
    });
    expect(r.shadow !== 'none' && /inset/.test(r.shadow), `window shadow ${r.shadow}`);
    expect(r.border > 0, `border ${r.border}px`);
    expect(/tabular-nums/.test(r.tab), `numerals ${r.tab}`);
    return `recessed window ${Math.round(r.h)}px high, tabular numerals`;
  });
  await check('Stat', 'no part of the stat is the accent orange', async () => {
    await go('/components/stat/code');
    const bad = await main().locator('[data-component="Stat"]').evaluateAll((els) => {
      const probe = document.createElement('span'); probe.style.color = 'var(--ds-action-accent)'; document.body.append(probe);
      const accent = getComputedStyle(probe).color; probe.remove();
      const out = []; for (const el of els) for (const n of [el, ...el.querySelectorAll('*')]) { const cs = getComputedStyle(n); if (accent && [cs.backgroundColor, cs.color, cs.borderColor].some((c) => c === accent)) out.push(n.tagName); }
      return out;
    });
    expect(bad.length === 0, `${bad.length} orange parts`);
    return 'no orange';
  });
}
