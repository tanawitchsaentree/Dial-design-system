// Behaviour checks for RadioCards (key plates, one chosen), run by tooling/kiln/conformance.mjs.
// Needs a RadioCards chapter whose first group has at least three plates.
export default async function radioCards({ check, expect, page, go, main }) {
  const GROUP = 'fieldset[data-component="RadioCards"]';
  await check('RadioCards', 'the group is a named radio group, exactly one plate is chosen and each plate is named by its title', async () => {
    await go('/components/radio-cards/code');
    const r = await main().locator(GROUP).first().evaluate((g) => {
      const radios = [...g.querySelectorAll('input[type="radio"]')];
      return {
        legend: g.querySelector(':scope > legend')?.textContent?.trim() ?? '',
        radios: radios.length,
        checked: g.querySelectorAll('input[type="radio"]:checked').length,
        names: new Set(radios.map((i) => i.name)).size,
        named: radios.every((i) => { const t = document.getElementById(i.getAttribute('aria-labelledby') ?? ''); return !!t && t.textContent.trim().length > 0; }),
      };
    });
    expect(r.legend.length > 0, 'the group has no printed name');
    expect(r.radios >= 3 && r.names === 1, `${r.radios} plates under ${r.names} names (need three or more on one name)`);
    expect(r.checked === 1, `${r.checked} chosen (need exactly 1)`);
    expect(r.named, 'a plate is not named by its title');
    return `${r.radios} plates, 1 chosen`;
  });
  await check('RadioCards', 'an arrow key moves the choice to the next plate and keeps one chosen', async () => {
    await go('/components/radio-cards/code');
    const group = main().locator(GROUP).first();
    await group.locator('input[type="radio"]:checked').focus();
    const before = await group.locator('input[type="radio"]:checked').getAttribute('value');
    await page.keyboard.press('ArrowDown');
    const after = await group.evaluate((g) => ({ v: g.querySelector('input:checked')?.value, n: g.querySelectorAll('input:checked').length, marked: g.querySelectorAll('label[data-checked]').length }));
    expect(after.n === 1, `${after.n} chosen after ArrowDown`);
    expect(after.v !== before, `the choice stayed on ${before}`);
    expect(after.marked === 1, `${after.marked} plates marked chosen`);
    return `${before} → ${after.v}`;
  });
  await check('RadioCards', 'pressing a plate chooses it and the plate is at least the touch target', async () => {
    await go('/components/radio-cards/code');
    const group = main().locator(GROUP).first();
    const target = group.locator('label[data-component="RadioCard"]:has(input:not(:checked):not(:disabled))').first();
    const box = await target.boundingBox();
    expect(box.height >= 43.5, `plate ${box.height}px tall`);
    const value = await target.locator('input').getAttribute('value');
    await target.click();
    const now = await group.locator('input:checked').getAttribute('value');
    expect(now === value, `chose ${now}, pressed ${value}`);
    return `plate ${Math.round(box.height)}px, press chose ${value}`;
  });
  await check('RadioCards', 'the chosen plate is told by a bar, a weight and a lowered face, and nothing is the accent orange', async () => {
    await go('/components/radio-cards/code');
    // the bar fades over motion.release; conformance runs with reduced motion, which makes it instant
    const r = await main().locator(GROUP).first().evaluate((g) => {
      const probe = document.createElement('span'); probe.style.color = 'var(--ds-action-accent)'; document.body.append(probe);
      const accent = getComputedStyle(probe).color; probe.remove();
      const items = [...g.querySelectorAll('label[data-component="RadioCard"]')].map((l) => {
        const bar = l.querySelector(':scope > span[aria-hidden="true"]');
        const cs = getComputedStyle(l);
        return {
          on: l.querySelector('input').checked,
          op: Number(getComputedStyle(bar).opacity),
          barW: bar.getBoundingClientRect().width,
          w: Number(getComputedStyle(l.querySelector('[id$="-title"]')).fontWeight),
          shadow: cs.boxShadow,
          lowered: cs.transform !== 'none',
        };
      });
      const orange = [...g.querySelectorAll('*')].filter((n) => { const s = getComputedStyle(n); return accent && [s.backgroundColor, s.color, s.borderColor].includes(accent); }).length;
      return { items, orange };
    });
    const on = r.items.find((i) => i.on); const off = r.items.find((i) => !i.on);
    expect(on.op > 0.9 && off.op < 0.1, `bar opacity chosen ${on.op}, waiting ${off.op}`);
    expect(on.barW > 0, `bar is ${on.barW}px wide`);
    expect(on.w > off.w, `weight chosen ${on.w}, waiting ${off.w}`);
    expect(on.shadow === 'none' && off.shadow !== 'none', `shadow chosen "${on.shadow.slice(0, 20)}", waiting "${off.shadow.slice(0, 20)}"`);
    expect(on.lowered && !off.lowered, `lowered chosen ${on.lowered}, waiting ${off.lowered}`);
    expect(r.orange === 0, `${r.orange} orange parts`);
    return 'bar, weight and lowered face differ, no orange';
  });
}
