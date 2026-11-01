// Behaviour checks for Text, run by tooling/kiln/conformance.mjs on the built book. Text is printing
// on the case (P5): one grotesk, regular and medium only, text.primary or text.secondary ink, tabular
// figures where numbers change. Expected numbers come from the built tokens.
export default async function text({ check, expect, go, main, tokens }) {
  const v = (k) => tokens[k]?.value;
  const all = () => main().locator('[data-component="Text"]');

  await check('Text', 'every Text uses only the regular or medium weight', async () => {
    await go('/components/text/code');
    const allowed = new Set([v('type.weight-regular'), v('type.weight-medium')].map(String));
    const ws = await all().evaluateAll((els) => els.map((e) => getComputedStyle(e).fontWeight));
    expect(ws.length > 0, 'no Text on the page');
    const bad = ws.filter((w) => !allowed.has(w));
    expect(!bad.length, `weights ${[...new Set(bad)].join(', ')} (allowed ${[...allowed].join(', ')})`);
    return `${ws.length} lines, weights ${[...new Set(ws)].join('/')}`;
  });

  await check('Text', 'ink is text.primary or text.secondary, never tinted', async () => {
    await go('/components/text/code');
    const r = await all().evaluateAll((els) => {
      const probe = (c) => { const d = document.createElement('span'); d.style.color = `var(${c})`; document.body.append(d); const x = getComputedStyle(d).color; d.remove(); return x; };
      const inks = new Set([probe('--ds-text-primary'), probe('--ds-text-secondary')]);
      return { n: els.length, bad: els.map((e) => getComputedStyle(e).color).filter((c) => !inks.has(c)) };
    });
    expect(r.n > 0, 'no Text on the page');
    expect(!r.bad.length, `colours ${[...new Set(r.bad)].join(', ')}`);
    return `${r.n} lines on the two inks`;
  });

  await check('Text', 'each size prints at its type token and numeric turns on tabular figures', async () => {
    await go('/components/text/code');
    const want = { micro: v('type.micro'), caption: v('type.caption'), label: v('type.label'), body: v('type.body'), reading: v('type.reading') };
    const got = await all().evaluateAll((els) => els.map((e) => ({ size: e.dataset.size, px: getComputedStyle(e).fontSize, num: getComputedStyle(e).fontVariantNumeric, margin: getComputedStyle(e).marginBlockStart })));
    const bad = got.filter((g) => want[g.size] && g.px !== want[g.size]).map((g) => `${g.size} ${g.px} (want ${want[g.size]})`);
    expect(!bad.length, bad.slice(0, 4).join(', '));
    expect(got.some((g) => g.num.includes('tabular-nums')), 'no Text with tabular-nums on the page');
    expect(got.every((g) => g.margin === '0px'), 'a Text carries its own outer margin');
    return `${new Set(got.map((g) => g.size)).size} sizes, tabular figures present`;
  });
}
