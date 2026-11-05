// Behaviour checks for Radio (round keys, one chosen), run by tooling/kiln/conformance.mjs.
// Needs a Radio chapter whose first group has at least three options.
export default async function radio({ check, expect, page, go, main }) {
  await check('Radio', 'the group is a named radio group and exactly one option is chosen', async () => {
    await go('/components/radio/code');
    const r = await main().locator('fieldset[data-component="RadioGroup"]').first().evaluate((g) => ({
      legend: g.querySelector(':scope > legend')?.textContent?.trim() ?? '',
      radios: g.querySelectorAll('input[type="radio"]').length,
      checked: g.querySelectorAll('input[type="radio"]:checked').length,
      names: new Set([...g.querySelectorAll('input[type="radio"]')].map((i) => i.name)).size,
    }));
    expect(r.legend.length > 0, 'the group has no printed name');
    expect(r.radios >= 2 && r.names === 1, `${r.radios} options under ${r.names} names (need one shared name)`);
    expect(r.checked === 1, `${r.checked} chosen (need exactly 1)`);
    return `${r.radios} options, 1 chosen`;
  });
  await check('Radio', 'an arrow key moves the choice to the next option and keeps one chosen', async () => {
    await go('/components/radio/code');
    const group = main().locator('fieldset[data-component="RadioGroup"]').first();
    await group.locator('input[type="radio"]:checked').focus();
    const before = await group.locator('input[type="radio"]:checked').getAttribute('value');
    await page.keyboard.press('ArrowDown');
    const after = await group.evaluate((g) => ({ v: g.querySelector('input:checked')?.value, n: g.querySelectorAll('input:checked').length }));
    expect(after.n === 1, `${after.n} chosen after ArrowDown`);
    expect(after.v !== before, `the choice stayed on ${before}`);
    return `${before} → ${after.v}`;
  });
  await check('Radio', 'pressing the printed word chooses the option and the row is at least the touch target', async () => {
    await go('/components/radio/code');
    const group = main().locator('fieldset[data-component="RadioGroup"]').first();
    const target = group.locator('label[data-component="Radio"]:has(input:not(:checked):not(:disabled))').first();
    const h = (await target.boundingBox()).height;
    expect(h >= 43.5, `row ${h}px tall`);
    const value = await target.locator('input').getAttribute('value');
    await target.locator('span').last().click();
    const now = await group.locator('input:checked').getAttribute('value');
    expect(now === value, `chose ${now}, pressed ${value}`);
    return `row ${Math.round(h)}px, word chose ${value}`;
  });
  await check('Radio', 'the chosen state is told by a dot and a weight, and nothing is the accent orange', async () => {
    await go('/components/radio/code');
    const r = await main().locator('fieldset[data-component="RadioGroup"]').first().evaluate((g) => {
      const probe = document.createElement('span'); probe.style.color = 'var(--ds-action-accent)'; document.body.append(probe);
      const accent = getComputedStyle(probe).color; probe.remove();
      const items = [...g.querySelectorAll('label')].map((l) => {
        const on = l.querySelector('input').checked;
        const dot = getComputedStyle(l.querySelector('input + span > span'));
        return { on, op: Number(dot.opacity), w: Number(getComputedStyle(l.querySelector('input ~ span:last-child')).fontWeight) };
      });
      const orange = [...g.querySelectorAll('*')].filter((n) => { const cs = getComputedStyle(n); return accent && [cs.backgroundColor, cs.color, cs.borderColor].includes(accent); }).length;
      return { items, orange };
    });
    const on = r.items.find((i) => i.on); const off = r.items.find((i) => !i.on);
    expect(on.op > 0.9 && off.op < 0.1, `dot opacity chosen ${on.op}, waiting ${off.op}`);
    expect(on.w > off.w, `weight chosen ${on.w}, waiting ${off.w}`);
    expect(r.orange === 0, `${r.orange} orange parts`);
    return 'dot and weight differ, no orange';
  });
}
