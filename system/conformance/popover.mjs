// Behaviour checks for Popover (a key that opens a plastic panel), run by tooling/kiln/conformance.mjs.
export default async function popover({ check, expect, go, main }) {
  const key = () => main().locator('span[data-component="Popover"] > button').first();
  const panel = (page) => page.locator('div[role="dialog"][data-component="Popover"]');
  await check('Popover', 'the key opens a dialog panel and reports it', async () => {
    await go('/components/popover/code');
    const k = key();
    expect((await k.getAttribute('aria-expanded')) === 'false', 'key starts collapsed');
    await k.click();
    const page = k.page();
    await panel(page).first().waitFor({ state: 'visible' });
    expect((await k.getAttribute('aria-expanded')) === 'true', 'key reports expanded');
    const named = await panel(page).first().evaluate((p) => !!(p.getAttribute('aria-label') || p.getAttribute('aria-labelledby')));
    expect(named, 'panel has a name');
    return 'opens as a named dialog, aria-expanded flips';
  });
  await check('Popover', 'focus moves into the panel on open and Escape returns it to the key', async () => {
    await go('/components/popover/code');
    const k = key(); const page = k.page();
    await k.focus(); await page.keyboard.press('Enter');
    await panel(page).first().waitFor({ state: 'visible' });
    const inside = await page.evaluate(() => !!document.activeElement?.closest('div[role="dialog"][data-component="Popover"]'));
    expect(inside, 'focus is inside the panel after open');
    await page.keyboard.press('Escape');
    await page.waitForFunction(() => !document.querySelector('div[role="dialog"][data-component="Popover"]'), null, { timeout: 3000 });
    const back = await k.evaluate((el) => document.activeElement === el);
    expect(back, 'focus is back on the key after Escape');
    return 'focus in on open, back on the key after Escape';
  });
  await check('Popover', 'a press outside closes the panel and the close key is at least the touch target', async () => {
    await go('/components/popover/code');
    const k = key(); const page = k.page();
    await k.click();
    await panel(page).first().waitFor({ state: 'visible' });
    const box = await panel(page).first().locator('button').first().boundingBox();
    expect(box && box.width >= 43.5 && box.height >= 43.5, `close key ${box ? `${box.width}×${box.height}` : 'missing'}`);
    await page.mouse.click(2, 2);
    await page.waitForFunction(() => !document.querySelector('div[role="dialog"][data-component="Popover"]'), null, { timeout: 3000 });
    return 'outside press closes; close key at least 44px';
  });
  await check('Popover', 'the panel stays on the screen and nothing in it is the accent orange', async () => {
    await go('/components/popover/code');
    const k = key(); const page = k.page();
    await k.click();
    await panel(page).first().waitFor({ state: 'visible' });
    const r = await panel(page).first().evaluate((p) => {
      const b = p.getBoundingClientRect();
      const probe = document.createElement('span'); probe.style.color = 'var(--ds-action-accent)'; document.body.append(probe);
      const accent = getComputedStyle(probe).color; probe.remove();
      let orange = 0; for (const n of [p, ...p.querySelectorAll('*')]) { const cs = getComputedStyle(n); if ([cs.backgroundColor, cs.color, cs.borderColor].includes(accent)) orange++; }
      return { inside: b.left >= 0 && b.top >= 0 && b.right <= innerWidth && b.bottom <= innerHeight, orange };
    });
    expect(r.inside, 'panel inside the viewport');
    expect(r.orange === 0, `${r.orange} orange parts`);
    return 'on screen, no orange';
  });
}
