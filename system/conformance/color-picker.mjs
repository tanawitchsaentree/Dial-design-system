// Behaviour checks for ColorPicker (round lens keys in a radio group), run by tooling/kiln/conformance.mjs.
export default async function colorPicker({ check, expect, page, go, main }) {
  const root = () => main().locator('[data-component="ColorPicker"]').first();
  await check('ColorPicker', 'the keys are a named radio group and one is chosen', async () => {
    await go('/components/color-picker/code');
    const r = await root().evaluate((el) => {
      const g = el.querySelector('[role="radiogroup"]');
      const radios = [...el.querySelectorAll('input[type="radio"]')];
      return { name: g?.getAttribute('aria-labelledby') ? (document.getElementById(g.getAttribute('aria-labelledby'))?.textContent ?? '').trim() : '', n: radios.length, named: radios.filter((i) => (i.getAttribute('aria-label') ?? '').trim().length > 0).length, checked: radios.filter((i) => i.checked).length };
    });
    expect(r.name.length > 0, 'the radio group has no name');
    expect(r.n >= 3 && r.named === r.n, `${r.named} of ${r.n} keys have a name`);
    expect(r.checked === 1, `${r.checked} keys chosen (need exactly 1)`);
    return `${r.n} named keys, 1 chosen`;
  });
  await check('ColorPicker', 'an arrow key moves the choice and the readout follows', async () => {
    await go('/components/color-picker/code');
    const chosen = root().locator('input[type="radio"]:checked');
    await chosen.focus();
    const before = await root().locator('p[role="status"]').textContent();
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(500);
    const r = await root().evaluate((el) => ({ focused: el.contains(document.activeElement) && document.activeElement.checked, status: el.querySelector('p[role="status"]').textContent }));
    expect(r.focused, 'the next key was not chosen by the arrow key');
    expect(r.status !== before, `readout stayed "${before}"`);
    return `readout "${before}" to "${r.status}"`;
  });
  await check('ColorPicker', 'every key is at least the touch target and only the chosen key shows a ring and a tick', async () => {
    await go('/components/color-picker/code');
    const r = await root().evaluate((el) => [...el.querySelectorAll('[role="radiogroup"] > label')].map((l) => {
      const b = l.getBoundingClientRect(); const lens = l.querySelector('span'); const tick = lens.firstElementChild;
      const cs = getComputedStyle(lens); const on = l.querySelector('input').checked;
      return { w: b.width, h: b.height, on, ring: parseFloat(cs.outlineWidth) > 0 && cs.outlineStyle !== 'none', tick: tick.getBoundingClientRect().width > 0 };
    }));
    expect(r.length >= 3 && r.every((x) => x.w >= 43.5 && x.h >= 43.5), `keys ${r.map((x) => `${x.w}x${x.h}`).join(', ')}`);
    expect(r.every((x) => x.on === x.ring && x.on === x.tick), `ring and tick must show on the chosen key only: ${JSON.stringify(r.map((x) => [x.on, x.ring, x.tick]))}`);
    return `${r.length} keys, ring and tick on the chosen one only`;
  });
  await check('ColorPicker', 'a valid hex entry sets a custom colour and clears the chosen key', async () => {
    await go('/components/color-picker/code');
    const well = root().locator('[data-component="Input"] input').first();
    await well.fill('abc');
    await page.waitForTimeout(500);
    const r = await root().evaluate((el) => ({ status: el.querySelector('p[role="status"]').textContent, checked: el.querySelectorAll('input[type="radio"]:checked').length }));
    expect(/#aabbcc/.test(r.status), `readout "${r.status}"`);
    expect(r.checked === 0, `${r.checked} keys still chosen`);
    return r.status;
  });
  await check('ColorPicker', 'no part of the picker except the data on the keys is the accent orange', async () => {
    await go('/components/color-picker/code');
    const bad = await main().locator('[data-component="ColorPicker"]').evaluateAll((els) => {
      const probe = document.createElement('span'); probe.style.color = 'var(--ds-action-accent)'; document.body.append(probe);
      const accent = getComputedStyle(probe).color; probe.remove();
      const out = [];
      for (const el of els) for (const n of el.querySelectorAll('*')) {
        const cs = getComputedStyle(n); const lens = n.matches('[role="radiogroup"] > label > span');
        if (accent && [lens ? null : cs.backgroundColor, cs.color, cs.borderColor].some((c) => c === accent)) out.push(n.tagName);
      }
      return out;
    });
    expect(bad.length === 0, `${bad.length} orange parts`);
    return 'no orange outside the key data';
  });
}
