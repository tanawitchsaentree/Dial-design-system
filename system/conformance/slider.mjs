// Behaviour checks for Slider (a fader), run by tooling/kiln/conformance.mjs on the built book.
export default async function slider({ check, expect, page, go, main, tokens }) {
  const px = (s) => parseFloat(s);
  const first = () => main().locator('[data-component="Slider"] [role="slider"]:not([aria-disabled="true"])').first();
  const now = (s) => s.getAttribute('aria-valuenow').then(Number);
  await check('Slider', 'Tab reaches the fader and the focus ring shows', async () => {
    await go('/components/slider/code');
    const s = first();
    await s.focus(); await page.keyboard.press('Shift+Tab'); await page.keyboard.press('Tab');
    const st = await s.evaluate((el) => ({ focused: document.activeElement === el, w: getComputedStyle(el).outlineWidth, s: getComputedStyle(el).outlineStyle }));
    expect(st.focused, 'the fader did not take focus');
    expect(st.s !== 'none' && px(st.w) >= 2, `outline ${st.s} ${st.w}`);
    return `outline ${st.w}`;
  });
  await check('Slider', 'arrow keys move one step and Home and End reach the ends', async () => {
    await go('/components/slider/code');
    const s = first();
    const [min, max] = [Number(await s.getAttribute('aria-valuemin')), Number(await s.getAttribute('aria-valuemax'))];
    await s.focus(); await page.keyboard.press('Home');
    expect((await now(s)) === min, `Home gave ${await now(s)}, not ${min}`);
    await page.keyboard.press('ArrowRight'); const one = await now(s);
    await page.keyboard.press('ArrowLeft'); const back = await now(s);
    await page.keyboard.press('End'); const end = await now(s);
    expect(one > min && back === min, `ArrowRight ${one}, ArrowLeft ${back}`);
    expect(end === max, `End gave ${end}, not ${max}`);
    expect(!!(await s.getAttribute('aria-valuetext')), 'no aria-valuetext');
    return `${min} → ${one} → ${back} → ${end}`;
  });
  await check('Slider', 'Page Up and Page Down move more than one step', async () => {
    await go('/components/slider/code');
    const s = first();
    await s.focus(); await page.keyboard.press('Home');
    await page.keyboard.press('ArrowRight'); const one = await now(s);
    await page.keyboard.press('Home'); await page.keyboard.press('PageUp'); const pg = await now(s);
    await page.keyboard.press('PageDown'); const down = await now(s);
    const min = Number(await s.getAttribute('aria-valuemin'));
    expect(pg - min > one - min && down === min, `step ${one - min}, page ${pg - min}, back ${down}`);
    return `page ${pg - min} vs step ${one - min}`;
  });
  await check('Slider', 'the fader is at least the touch target tall and keeps its size from Home to End', async () => {
    await go('/components/slider/code');
    const min = px(tokens['layout.touch']?.value ?? '44px');
    const hs = await main().locator('[data-component="Slider"] [role="slider"]').evaluateAll((els) => els.map((e) => e.getBoundingClientRect().height));
    expect(hs.length > 0 && hs.every((h) => h >= min - 0.5), `heights ${hs.join(', ')} (min ${min})`);
    const s = first();
    const box = () => s.evaluate((e) => { const r = e.closest('[data-component]').getBoundingClientRect(); return [r.width, r.height]; });
    await s.focus(); await page.keyboard.press('Home'); const lo = await box();
    await page.keyboard.press('End'); const hi = await box();
    expect(lo[0] >= 200 && Math.abs(lo[0] - hi[0]) <= 1 && Math.abs(lo[1] - hi[1]) <= 1, `Home ${lo.join('x')}, End ${hi.join('x')}`);
    return `${Math.min(...hs)}px tall, ${Math.round(lo[0])}px long`;
  });
  const capAt = (s) => s.evaluate((e) => e.querySelector(':scope > div:last-child').getBoundingClientRect().left);
  await check('Slider', 'a key press travels the cap on the spring and settles on the step', async () => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    try {
      await go('/components/slider/code');
      const s = first();
      await s.focus(); await page.keyboard.press('Home'); await page.waitForTimeout(600);
      const x0 = await capAt(s);
      await page.keyboard.press('End');
      await page.waitForTimeout(40); const mid = await capAt(s);
      await page.waitForTimeout(700); const x1 = await capAt(s);
      expect(x1 > x0 && mid > x0 && mid < x1 - 1, `cap at ${x0}, then ${mid}, then ${x1}`);
      return `travelled ${Math.round(x1 - x0)}px, mid-way ${Math.round(mid - x0)}px`;
    } finally { await page.emulateMedia({ reducedMotion: 'reduce' }); }
  });
  await check('Slider', 'under reduce motion the cap lands on the step at once', async () => {
    await go('/components/slider/code');
    const s = first();
    await s.focus(); await page.keyboard.press('Home'); const x0 = await capAt(s);
    await page.keyboard.press('End'); const x1 = await capAt(s);
    await page.waitForTimeout(300); const x2 = await capAt(s);
    expect(x1 > x0 && Math.abs(x2 - x1) < 0.5, `cap at ${x0}, then ${x1}, then ${x2}`);
    return 'no travel';
  });
  // glass (P9, D-007): the cap is frosted in the value's tint and the groove behind it is lit up to the cap
  const glass = (s) => s.evaluate((e) => {
    const cap = e.querySelector(':scope > div:last-child'), groove = e.querySelector('[class*="groove"]'), fill = groove?.firstElementChild;
    const c = getComputedStyle(cap), g = groove.getBoundingClientRect(), k = cap.getBoundingClientRect(), f = fill.getBoundingClientRect();
    return { tint: e.closest('[data-component]').dataset.tint, filter: c.backdropFilter || c.webkitBackdropFilter || 'none', bg: c.backgroundColor, fillEnd: f.right - g.left, capMid: k.left + k.width / 2 - g.left, fillBg: getComputedStyle(fill).backgroundColor };
  });
  await check('Slider', 'the cap is frosted glass in its tint and the groove light ends at the cap', async () => {
    await go('/components/slider/code');
    const s = main().locator('[data-component="Slider"][data-tint="warm"] [role="slider"]').first();
    const cool = await glass(main().locator('[data-component="Slider"][data-tint="cool"] [role="slider"]').first());
    await s.focus(); await page.keyboard.press('Home'); await page.keyboard.press('ArrowRight'); await page.keyboard.press('ArrowRight');
    const a = await glass(s);
    expect(/blur\(/.test(a.filter) && /saturate\(/.test(a.filter) && /brightness\(/.test(a.filter), `cap filter ${a.filter}`);
    expect(Math.abs(a.fillEnd - a.capMid) <= 2, `groove light ends at ${a.fillEnd}px, cap centre at ${a.capMid}px`);
    expect(a.fillBg !== cool.fillBg && a.bg !== cool.bg, `warm and cool share a tint (${a.fillBg})`);
    await page.keyboard.press('End'); const b = await glass(s);
    expect(Math.abs(b.fillEnd - b.capMid) <= 2, `at End the light ends at ${b.fillEnd}px, cap centre at ${b.capMid}px`);
    return `warm ${a.bg}, light follows the cap to ${Math.round(b.fillEnd)}px`;
  });
  await check('Slider', 'with reduced transparency the cap turns matte', async () => {
    await go('/components/slider/code');
    const cdp = await page.context().newCDPSession(page);
    try {
      await cdp.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-transparency', value: 'reduce' }] });
      const a = await glass(main().locator('[data-component="Slider"][data-tint="warm"] [role="slider"]').first());
      const alpha = Number((a.bg.match(/rgba?\(([^)]+)\)/)?.[1].split(/[ ,/]+/).filter(Boolean)[3]) ?? 1);
      expect(a.filter === 'none' && alpha === 1, `filter ${a.filter}, background ${a.bg}`);
      return `matte ${a.bg}`;
    } finally { await cdp.send('Emulation.setEmulatedMedia', { features: [] }); await cdp.detach(); }
  });
}
