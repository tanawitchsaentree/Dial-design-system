// Behaviour checks for Heading, run by tooling/kiln/conformance.mjs on the built book. Heading is the
// largest printing (P5): a real h1–h4 for its level, medium weight, text.primary ink, its size token.
export default async function heading({ check, expect, go, main, tokens }) {
  const v = (k) => tokens[k]?.value;
  const all = () => main().locator('[data-component="Heading"]');

  await check('Heading', 'level renders the matching h1–h4 element', async () => {
    await go('/components/heading/code');
    const got = await all().evaluateAll((els) => els.map((e) => [e.tagName.toLowerCase(), e.dataset.level]));
    expect(got.length > 0, 'no Heading on the page');
    const bad = got.filter(([tag, l]) => tag !== `h${l}`);
    expect(!bad.length, bad.slice(0, 4).map(([t, l]) => `${t} for level ${l}`).join(', '));
    return `${new Set(got.map(([t]) => t)).size} levels`;
  });

  await check('Heading', 'each level prints at its size token in medium weight and primary ink', async () => {
    await go('/components/heading/code');
    const want = { 1: v('type.display'), 2: v('type.headline'), 3: v('type.title'), 4: v('type.emphasis') };
    const r = await all().evaluateAll((els) => {
      const d = document.createElement('span'); d.style.color = 'var(--ds-text-primary)'; document.body.append(d);
      const ink = getComputedStyle(d).color; d.remove();
      return els.map((e) => ({ l: e.dataset.level, px: getComputedStyle(e).fontSize, w: getComputedStyle(e).fontWeight, ok: getComputedStyle(e).color === ink, m: getComputedStyle(e).marginBlockStart }));
    });
    const bad = r.filter((x) => x.px !== want[x.l] || x.w !== String(v('type.weight-medium')) || !x.ok || x.m !== '0px').map((x) => `level ${x.l}: ${x.px} ${x.w}${x.ok ? '' : ' tinted'}${x.m !== '0px' ? ` margin ${x.m}` : ''}`);
    expect(r.length > 0, 'no Heading on the page');
    expect(!bad.length, bad.slice(0, 4).join(' | '));
    return `${r.length} headings`;
  });
}
