// Behaviour checks for Slot (the slit a room unit has for scene cards), run by tooling/kiln/conformance.mjs on the built book.
export default async function slot({ check, expect, page, go, main, tokens }) {
  const px = (s) => parseFloat(s);
  const ROUTE = '/components/slot/code';
  const slots = () => main().locator('[data-component="Slot"]');
  const mouth = (i = 0) => slots().nth(i).locator(':scope > button');

  await check('Slot', 'Enter on a card, an arrow to the slot and Enter again insert it, and the lamp says Running', async () => {
    await go(ROUTE);
    const card = main().locator('[data-component="SceneCard"] > button').first();
    await card.focus();
    await page.keyboard.press('Enter');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    const lamp = await slots().first().locator('[data-component="Badge"]').textContent();
    const said = await slots().first().locator('[role="status"]').textContent();
    const tone = await slots().first().locator('[data-component="Badge"]').getAttribute('data-tone');
    expect(/Running/.test(lamp ?? '') && tone === 'positive', `lamp "${lamp}" ${tone}`);
    expect(/inserted into Living room/.test(said ?? ''), `status "${said}"`);
    return said;
  });

  await check('Slot', 'with a card held every slot shows it is ready, and arrows walk between slots', async () => {
    await go(ROUTE);
    await main().locator('[data-component="SceneCard"] > button').first().focus();
    await page.keyboard.press('Enter');
    const ready = await main().locator('[data-component="Slot"] > button[data-ready="true"]').count();
    const enabled = await main().locator('[data-component="Slot"] > button:not([disabled])').count();
    await page.keyboard.press('ArrowRight');
    const a = await page.evaluate(() => document.activeElement?.getAttribute('aria-label'));
    await page.keyboard.press('ArrowRight');
    const b = await page.evaluate(() => document.activeElement?.getAttribute('aria-label'));
    await page.keyboard.press('Escape');
    expect(ready === enabled && ready > 1, `${ready} ready of ${enabled}`);
    expect(a && b && a !== b, `focus ${a} then ${b}`);
    return `${ready} ready`;
  });

  await check('Slot', 'a press with no card held takes the inserted card out and says so', async () => {
    await go(ROUTE);
    const i = await slots().evaluateAll((els) => els.findIndex((el) => /inserted/.test(el.querySelector('button')?.getAttribute('aria-label') ?? '')));
    expect(i >= 0, 'no slot with a card in it on the page');
    const root = slots().nth(i);
    const before = await root.locator(':scope > button').getAttribute('aria-label');
    await root.locator(':scope > button').click();
    const after = await root.locator(':scope > button').getAttribute('aria-label');
    const said = await root.locator('[role="status"]').textContent();
    expect(/empty/.test(after ?? '') && /taken out/.test(said ?? ''), `${before} → ${after}, "${said}"`);
    return said;
  });

  await check('Slot', 'the bay keeps its height when a card goes in, so the unit does not reflow', async () => {
    await go(ROUTE);
    const h0 = await slots().first().evaluate((el) => el.getBoundingClientRect().height);
    await main().locator('[data-component="SceneCard"] > button').first().click();
    await mouth(0).click();
    const h1 = await slots().first().evaluate((el) => el.getBoundingClientRect().height);
    expect(Math.abs(h1 - h0) < 0.5, `${h0}px empty, ${h1}px with a card`);
    return `${h0}px`;
  });

  await check('Slot', 'a disabled slot takes no card', async () => {
    await go(ROUTE);
    const off = main().locator('[data-component="Slot"] > button[disabled]').first();
    expect((await off.count()) === 1, 'no disabled slot on the page');
    const label = await off.getAttribute('aria-label');
    expect(/empty/.test(label ?? ''), `label ${label}`);
    return label;
  });

  await check('Slot', 'the slot is one target at least the touch size, and nothing in it is the accent', async () => {
    await go(ROUTE);
    const min = px(tokens['layout.touch']?.value ?? '44px');
    const r = await slots().first().evaluate((el) => {
      const probe = document.createElement('span'); probe.style.color = 'var(--ds-action-accent)'; document.body.append(probe);
      const accent = getComputedStyle(probe).color; probe.remove();
      const b = el.querySelector('button').getBoundingClientRect();
      const orange = [...el.querySelectorAll('*')].filter((n) => getComputedStyle(n).backgroundColor === accent || getComputedStyle(n).color === accent).length;
      return { w: b.width, h: b.height, orange };
    });
    expect(Math.min(r.w, r.h) >= min - 0.5, `${r.w}×${r.h}`);
    expect(r.orange === 0, `${r.orange} parts in the accent`);
    return `${Math.round(r.w)}×${Math.round(r.h)}`;
  });
}
