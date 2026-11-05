// Behaviour checks for HelperText (the line printed under a part), run by tooling/kiln/conformance.mjs.
export default async function helperText({ check, expect, go, main }) {
  await check('HelperText', 'the id is on the line and a part points at it with aria-describedby', async () => {
    await go('/components/helper-text/code');
    const r = await main().locator('p[data-component="HelperText"][data-tone="error"]').first().evaluate((p) => {
      const linked = [...document.querySelectorAll('[aria-describedby]')].filter((n) => n.getAttribute('aria-describedby').split(/\s+/).includes(p.id));
      return { id: p.id, linked: linked.length };
    });
    expect(r.id.length > 0, 'the line has no id');
    expect(r.linked >= 1, `${r.linked} parts point at #${r.id}`);
    return `#${r.id} described by ${r.linked} part`;
  });
  await check('HelperText', 'an error carries a named glyph and heavier weight, a neutral hint carries neither', async () => {
    await go('/components/helper-text/code');
    const r = await main().locator('p[data-component="HelperText"]').evaluateAll((ps) => ps.map((p) => ({
      tone: p.dataset.tone, glyph: p.querySelectorAll('svg').length, name: p.querySelector('svg')?.getAttribute('aria-label') ?? '', weight: Number(getComputedStyle(p).fontWeight),
    })));
    const err = r.find((x) => x.tone === 'error'), hint = r.find((x) => x.tone === 'neutral');
    expect(err && hint, 'need one error and one neutral line on the page');
    expect(err.glyph === 1 && err.name.length > 0, `error glyph ${err.glyph}, name "${err.name}"`);
    expect(hint.glyph === 0, `neutral prints ${hint.glyph} glyphs`);
    expect(err.weight > hint.weight, `weights ${err.weight} vs ${hint.weight}`);
    return `error "${err.name}" glyph at weight ${err.weight}; hint ${hint.weight}`;
  });
  await check('HelperText', 'no line is the accent orange and the caption size and line box hold', async () => {
    await go('/components/helper-text/code');
    const r = await main().locator('p[data-component="HelperText"]').evaluateAll((els) => {
      const probe = document.createElement('span'); probe.style.color = 'var(--ds-action-accent)'; document.body.append(probe);
      const accent = getComputedStyle(probe).color; probe.remove();
      return els.map((el) => { const cs = getComputedStyle(el); return { orange: cs.color === accent, size: parseFloat(cs.fontSize), line: parseFloat(cs.lineHeight) }; });
    });
    expect(r.length >= 2, `${r.length} lines`);
    expect(r.every((x) => !x.orange), 'a line is orange');
    expect(r.every((x) => x.line / x.size >= 1.4), `line boxes ${r.map((x) => (x.line / x.size).toFixed(2)).join(', ')}`);
    return `${r.length} lines, none orange, leading >= 1.4`;
  });
}
