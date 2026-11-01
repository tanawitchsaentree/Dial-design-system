// Behaviour checks for Checkbox, run by tooling/kiln/conformance.mjs on the built book.
// The native input is visually hidden; the visible key is the span after it.
export default async function checkbox({ check, expect, page, go, main, tokens }) {
  const px = (s) => parseFloat(s);
  const ROW = '[data-component="Checkbox"]:not([data-disabled])';
  const keyOf = (input) => input.locator('xpath=following-sibling::span[1]');
  await check('Checkbox', 'Tab reaches the checkbox and the focus ring shows', async () => {
    await go('/components/checkbox/code');
    const input = main().locator(`${ROW} input[type="checkbox"]`).first();
    await input.focus(); await page.keyboard.press('Shift+Tab'); await page.keyboard.press('Tab');
    const focused = await input.evaluate((el) => document.activeElement === el);
    const st = await keyOf(input).evaluate((el) => ({ w: getComputedStyle(el).outlineWidth, s: getComputedStyle(el).outlineStyle }));
    expect(focused, 'the checkbox did not take focus');
    expect(st.s !== 'none' && px(st.w) >= 2, `key outline ${st.s} ${st.w}`);
    return `outline ${st.w}`;
  });
  await check('Checkbox', 'Space toggles the option', async () => {
    await go('/components/checkbox/code');
    const input = main().locator(`${ROW} input[type="checkbox"]`).first();
    await input.focus();
    const a = await input.evaluate((el) => el.checked);
    await page.keyboard.press('Space');
    const b = await input.evaluate((el) => el.checked);
    await page.keyboard.press('Space');
    const c = await input.evaluate((el) => el.checked);
    expect(a !== b && a === c, `checked ${a} → ${b} → ${c}`);
    return `${a} → ${b} → ${c}`;
  });
  await check('Checkbox', 'on and off differ in shape, not only colour', async () => {
    await go('/components/checkbox/code');
    const row = main().locator(ROW).first();
    const input = row.locator('input[type="checkbox"]');
    const vis = () => row.evaluate((el) => [...el.querySelectorAll('svg path')].map((p) => getComputedStyle(p).display !== 'none'));
    const was = await input.evaluate((el) => el.checked);
    const before = await vis();
    await row.click();
    const after = await vis();
    if ((await input.evaluate((el) => el.checked)) !== was) await row.click();
    expect(JSON.stringify(before) !== JSON.stringify(after), `marks ${JSON.stringify(before)} → ${JSON.stringify(after)}`);
    return `marks ${JSON.stringify(before)} → ${JSON.stringify(after)}`;
  });
  await check('Checkbox', 'every row is at least the touch target tall', async () => {
    await go('/components/checkbox/code');
    const min = px(tokens['layout.touch']?.value ?? '44px');
    const hs = await main().locator('[data-component="Checkbox"]').evaluateAll((els) => els.map((e) => e.getBoundingClientRect().height));
    expect(hs.length > 0, 'no checkboxes on the page');
    expect(hs.every((h) => h >= min - 0.5), `heights ${hs.join(', ')} (min ${min})`);
    return `${Math.min(...hs)}px min`;
  });
  const pressed = async () => {
    await go('/components/checkbox/code');
    const row = main().locator(ROW).first();
    const key = keyOf(row.locator('input[type="checkbox"]'));
    const box = await key.boundingBox();
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2); await page.mouse.down();
    await page.waitForTimeout(150);
    const st = await key.evaluate((el) => ({ t: getComputedStyle(el).transform, s: getComputedStyle(el).boxShadow }));
    await page.mouse.up();
    return st;
  };
  await check('Checkbox', 'pressing drops the key by its travel and removes its shadow', async () => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    const st = await pressed();
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const dy = Number((st.t.match(/matrix\(([^)]+)\)/)?.[1] ?? '').split(',')[5]);
    expect(st.s === 'none' && dy > 0, `transform ${st.t}, shadow ${st.s}`);
    return `dy ${dy}px`;
  });
  await check('Checkbox', 'under reduce motion a press flattens the key without travel', async () => {
    const st = await pressed();
    expect(st.s === 'none' && st.t === 'none', `transform ${st.t}, shadow ${st.s}`);
    return 'flat, no travel';
  });
}
