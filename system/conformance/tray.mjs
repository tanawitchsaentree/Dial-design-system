// Behaviour checks for Tray (the recess that gathers a unit's small keys), run by tooling/kiln/conformance.mjs on the built book.
export default async function tray({ check, expect, go, main, tokens }) {
  const px = (s) => parseFloat(s);
  const ROUTE = '/components/tray/code';

  await check('Tray', 'tray keys keep 44px, also when the tray wraps on a narrow unit', async () => {
    await go(ROUTE);
    const min = px(tokens['layout.touch']?.value ?? '44px');
    const s = await main().locator('[data-component="Tray"]').evaluateAll((els) => els.flatMap((el) => [...el.querySelectorAll(':scope > button')].map((b) => { const r = b.getBoundingClientRect(); return Math.min(r.width, r.height); })));
    expect(s.length > 3 && s.every((x) => x >= min - 0.5), `sizes ${s.join(', ')}`);
    return `${s.length} keys, ${Math.min(...s)}px and up`;
  });

  await check('Tray', 'the tray is a named group drawn as a recess with an even inset', async () => {
    await go(ROUTE);
    const r = await main().locator('[data-component="Tray"]').first().evaluate((el) => {
      const cs = getComputedStyle(el);
      const b = el.getBoundingClientRect(); const k = el.firstElementChild.getBoundingClientRect();
      return { role: el.getAttribute('role'), name: el.getAttribute('aria-label'), inset: /inset/.test(cs.boxShadow), l: k.left - b.left, t: k.top - b.top, pad: [cs.paddingTop, cs.paddingRight, cs.paddingBottom, cs.paddingLeft] };
    });
    expect(r.role === 'group' && !!r.name, `role ${r.role}, name ${r.name}`);
    expect(r.inset, 'the tray has no inset shadow, so it is not a recess');
    expect(new Set(r.pad).size === 1, `padding ${r.pad.join(' ')}`);
    return `${r.name}, inset ${r.pad[0]}`;
  });

  await check('Tray', 'inside a Card the tray nests its corner like the display window', async () => {
    await go(ROUTE);
    const r = await main().locator('[data-component="Card"] [data-component="Tray"]').first().evaluate((el) => {
      const card = el.closest('[data-component="Card"]');
      const cs = getComputedStyle(card);
      const R = parseFloat(cs.borderTopLeftRadius), inset = parseFloat(cs.paddingTop);
      const mark = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--ds-corner-mark')) || 4;
      return { got: parseFloat(getComputedStyle(el).borderTopLeftRadius), want: Math.max(mark, R - inset) };
    });
    expect(Math.abs(r.got - r.want) < 1, `corner ${r.got}px, nested ${r.want}px`);
    return `${r.got}px`;
  });

  await check('Tray', 'the orange key stands outside the tray', async () => {
    await go(ROUTE);
    const r = await main().locator('[data-example-live]:has([data-component="Card"] [data-component="Tray"])').first().evaluate((stage) => {
      const probe = document.createElement('span'); probe.style.color = 'var(--ds-action-accent)'; document.body.append(probe);
      const accent = getComputedStyle(probe).color; probe.remove();
      const orange = [...stage.querySelectorAll('button')].filter((b) => getComputedStyle(b).backgroundColor === accent);
      return { n: orange.length, inside: orange.filter((b) => b.closest('[data-component="Tray"]')).length };
    });
    expect(r.n === 1 && r.inside === 0, `${r.n} orange keys, ${r.inside} in the tray`);
    return 'one orange key, outside';
  });
}
