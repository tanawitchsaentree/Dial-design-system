// Behaviour checks for Button, run by tooling/kiln/conformance.mjs on the built book.
export default async function button({ check, expect, page, go, main, tokens }) {
  const px = (s) => parseFloat(s);
  await check('Button', 'Tab reaches the key and the focus ring shows', async () => {
    await go('/components/button/code');
    const b = main().locator('[data-component="Button"]:not([disabled])').first();
    await b.focus(); await page.keyboard.press('Shift+Tab'); await page.keyboard.press('Tab');
    const st = await b.evaluate((el) => ({ focused: document.activeElement === el, w: getComputedStyle(el).outlineWidth, s: getComputedStyle(el).outlineStyle }));
    expect(st.focused, 'the key did not take focus');
    expect(st.s !== 'none' && px(st.w) >= 2, `outline ${st.s} ${st.w}`);
    return `outline ${st.w}`;
  });
  await check('Button', 'Space and Enter run the action', async () => {
    await go('/components/button/code');
    const b = main().locator('[data-component="Button"]:not([disabled])').first();
    await b.evaluate((el) => { window.__presses = 0; el.addEventListener('click', () => { window.__presses++; }); });
    await b.focus(); await page.keyboard.press('Space'); await page.keyboard.press('Enter');
    const n = await page.evaluate(() => window.__presses);
    expect(n === 2, `${n} presses`);
    return `${n} presses`;
  });
  await check('Button', 'every key is at least the touch target tall', async () => {
    await go('/components/button/code');
    const min = px(tokens['layout.touch']?.value ?? '44px');
    const hs = await main().locator('[data-component="Button"]').evaluateAll((els) => els.map((e) => e.getBoundingClientRect().height));
    expect(hs.length > 0, 'no keys on the page');
    expect(hs.every((h) => h >= min - 0.5), `heights ${hs.join(', ')} (min ${min})`);
    return `${Math.min(...hs)}px min`;
  });
  const pressed = async () => {
    await go('/components/button/code');
    const b = main().locator('[data-component="Button"]:not([disabled])').first();
    const box = await b.boundingBox();
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2); await page.mouse.down();
    await page.waitForTimeout(150);
    const st = await b.evaluate((el) => ({ t: getComputedStyle(el).transform, s: getComputedStyle(el).boxShadow }));
    await page.mouse.up();
    return st;
  };
  await check('Button', 'pressing drops the key by its travel and removes its shadow', async () => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    const st = await pressed();
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const dy = Number((st.t.match(/matrix\(([^)]+)\)/)?.[1] ?? '').split(',')[5]);
    expect(st.s === 'none' && dy > 0, `transform ${st.t}, shadow ${st.s}`);
    return `dy ${dy}px`;
  });
  await check('Button', 'under reduce motion a press flattens the key without travel', async () => {
    const st = await pressed();
    expect(st.s === 'none' && st.t === 'none', `transform ${st.t}, shadow ${st.s}`);
    return 'flat, no travel';
  });
  // glass (P9, D-007): only a toggle key latched with aria-pressed turns to glass; a press toggles it back
  await check('Button', 'a toggle key with aria-pressed latches as frosted glass and releases on the next press', async () => {
    await go('/components/button/code');
    // a handle, so the same key is read again after it releases
    const b = await main().locator('[data-component="Button"][aria-pressed="true"]').first().elementHandle();
    const read = () => b.evaluate((el) => { const c = getComputedStyle(el); return { p: el.getAttribute('aria-pressed'), f: c.backdropFilter || c.webkitBackdropFilter || 'none' }; });
    const on = await read();
    const rest = await main().locator('[data-component="Button"]:not([aria-pressed])').first().evaluate((el) => getComputedStyle(el).backdropFilter || 'none');
    await b.focus(); await page.keyboard.press('Space'); const off = await read();
    expect(/blur\(/.test(on.f) && off.p === 'false' && off.f === 'none' && rest === 'none', `latched ${on.f}, released ${off.p} ${off.f}, plain key ${rest}`);
    return `latched ${on.f}`;
  });
}
