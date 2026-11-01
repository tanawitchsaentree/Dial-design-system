// Behaviour checks for IconButton, run by tooling/kiln/conformance.mjs on the built book.
export default async function iconButton({ check, expect, page, go, main, tokens }) {
  const px = (s) => parseFloat(s);
  const SEL = '[data-component="IconButton"]';
  await check('IconButton', 'Tab reaches the key and the focus ring shows', async () => {
    await go('/components/icon-button/code');
    const b = main().locator(`${SEL}:not([disabled])`).first();
    await b.focus(); await page.keyboard.press('Shift+Tab'); await page.keyboard.press('Tab');
    const st = await b.evaluate((el) => ({ focused: document.activeElement === el, w: getComputedStyle(el).outlineWidth, s: getComputedStyle(el).outlineStyle }));
    expect(st.focused, 'the key did not take focus');
    expect(st.s !== 'none' && px(st.w) >= 2, `outline ${st.s} ${st.w}`);
    return `outline ${st.w}`;
  });
  await check('IconButton', 'Space and Enter run the action', async () => {
    await go('/components/icon-button/code');
    const b = main().locator(`${SEL}:not([disabled])`).first();
    await b.evaluate((el) => { window.__presses = 0; el.addEventListener('click', () => { window.__presses++; }); });
    await b.focus(); await page.keyboard.press('Space'); await page.keyboard.press('Enter');
    const n = await page.evaluate(() => window.__presses);
    expect(n === 2, `${n} presses`);
    return `${n} presses`;
  });
  await check('IconButton', 'every key has a name in words and a hidden icon', async () => {
    await go('/components/icon-button/code');
    const r = await main().locator(SEL).evaluateAll((els) => els.map((e) => ({ name: (e.getAttribute('aria-label') ?? '').trim(), hidden: e.firstElementChild?.getAttribute('aria-hidden') === 'true' })));
    expect(r.length > 0, 'no keys on the page');
    expect(r.every((x) => x.name.length > 0 && x.hidden), JSON.stringify(r.filter((x) => !x.name || !x.hidden).slice(0, 3)));
    return `${r.length} keys named`;
  });
  await check('IconButton', 'every key is at least the touch target in both directions', async () => {
    await go('/components/icon-button/code');
    const min = px(tokens['layout.touch']?.value ?? '44px');
    const bs = await main().locator(SEL).evaluateAll((els) => els.map((e) => { const r = e.getBoundingClientRect(); return [r.width, r.height]; }));
    expect(bs.length > 0, 'no keys on the page');
    expect(bs.every(([w, h]) => w >= min - 0.5 && h >= min - 0.5), `sizes ${bs.map((b) => b.join('x')).join(', ')} (min ${min})`);
    return `${Math.min(...bs.flat())}px min`;
  });
  const pressed = async () => {
    await go('/components/icon-button/code');
    const b = main().locator(`${SEL}:not([disabled])`).first();
    const box = await b.boundingBox();
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2); await page.mouse.down();
    await page.waitForTimeout(150);
    const st = await b.evaluate((el) => ({ t: getComputedStyle(el).transform, s: getComputedStyle(el).boxShadow }));
    await page.mouse.up();
    return st;
  };
  await check('IconButton', 'pressing drops the key by its travel and removes its shadow', async () => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    const st = await pressed();
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const dy = Number((st.t.match(/matrix\(([^)]+)\)/)?.[1] ?? '').split(',')[5]);
    expect(st.s === 'none' && dy > 0, `transform ${st.t}, shadow ${st.s}`);
    return `dy ${dy}px`;
  });
  await check('IconButton', 'under reduce motion a press flattens the key without travel', async () => {
    const st = await pressed();
    expect(st.s === 'none' && st.t === 'none', `transform ${st.t}, shadow ${st.s}`);
    return 'flat, no travel';
  });
}
