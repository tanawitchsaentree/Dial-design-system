// Behaviour checks for Rotary (the knob), run by tooling/kiln/conformance.mjs on the built book.
export default async function rotary({ check, expect, page, go, main, tokens }) {
  const px = (s) => parseFloat(s);
  const first = () => main().locator('[data-component="Rotary"] [role="slider"]:not([aria-disabled="true"])').first();
  const now = (k) => k.getAttribute('aria-valuenow').then(Number);
  const deg = (k) => k.evaluate((e) => parseFloat(e.firstElementChild.style.getPropertyValue('--deg')));
  await check('Rotary', 'Tab reaches the knob and the focus ring shows', async () => {
    await go('/components/rotary/code');
    const k = first();
    await k.focus(); await page.keyboard.press('Shift+Tab'); await page.keyboard.press('Tab');
    const st = await k.evaluate((el) => ({ focused: document.activeElement === el, w: getComputedStyle(el).outlineWidth, s: getComputedStyle(el).outlineStyle }));
    expect(st.focused, 'the knob did not take focus');
    expect(st.s !== 'none' && px(st.w) >= 2, `outline ${st.s} ${st.w}`);
    return `outline ${st.w}`;
  });
  await check('Rotary', 'arrow keys turn one step and Home and End reach the ends', async () => {
    await go('/components/rotary/code');
    const k = first();
    const [min, max] = [Number(await k.getAttribute('aria-valuemin')), Number(await k.getAttribute('aria-valuemax'))];
    await k.focus(); await page.keyboard.press('Home'); const lo = await now(k);
    await page.keyboard.press('ArrowUp'); const one = await now(k);
    await page.keyboard.press('ArrowDown'); const back = await now(k);
    await page.keyboard.press('End'); const end = await now(k);
    expect(lo === min && one > min && back === min && end === max, `Home ${lo}, Up ${one}, Down ${back}, End ${end}`);
    expect(!!(await k.getAttribute('aria-valuetext')), 'no aria-valuetext');
    return `${lo} → ${one} → ${back} → ${end}`;
  });
  await check('Rotary', 'Page Up and Page Down turn more than one step', async () => {
    await go('/components/rotary/code');
    const k = first();
    await k.focus(); await page.keyboard.press('Home'); const min = await now(k);
    await page.keyboard.press('ArrowUp'); const one = await now(k);
    await page.keyboard.press('Home'); await page.keyboard.press('PageUp'); const pg = await now(k);
    await page.keyboard.press('PageDown'); const down = await now(k);
    expect(pg - min > one - min && down === min, `step ${one - min}, page ${pg - min}, back ${down}`);
    return `page ${pg - min} vs step ${one - min}`;
  });
  await check('Rotary', 'every knob is at least the touch target across', async () => {
    await go('/components/rotary/code');
    const min = px(tokens['layout.touch']?.value ?? '44px');
    const ss = await main().locator('[data-component="Rotary"] [role="slider"]').evaluateAll((els) => els.map((e) => Math.min(e.getBoundingClientRect().width, e.getBoundingClientRect().height)));
    expect(ss.length > 0 && ss.every((s) => s >= min - 0.5), `sizes ${ss.join(', ')} (min ${min})`);
    return `${Math.min(...ss)}px min`;
  });
  await check('Rotary', 'the index sweeps 270 degrees from Home to End', async () => {
    await go('/components/rotary/code');
    const k = first();
    await k.focus(); await page.keyboard.press('Home'); const a = await deg(k);
    await page.keyboard.press('End'); const b = await deg(k);
    expect(Math.abs(b - a - 270) < 0.5, `Home ${a}°, End ${b}°`);
    return `${a}° → ${b}°`;
  });
  await check('Rotary', 'dragging up turns the knob and release settles on a detent', async () => {
    await go('/components/rotary/code');
    const k = first();
    await k.focus(); await page.keyboard.press('Home'); const v0 = await now(k);
    const box = await k.boundingBox();
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2); await page.mouse.down();
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2 - 60, { steps: 6 }); await page.mouse.up();
    const v1 = await now(k); const a = await deg(k);
    const [min, max] = [Number(await k.getAttribute('aria-valuemin')), Number(await k.getAttribute('aria-valuemax'))];
    const expected = -135 + ((v1 - min) / (max - min || 1)) * 270;
    expect(v1 > v0 && Math.abs(a - expected) < 0.5, `value ${v0} → ${v1}, angle ${a} (detent ${expected})`);
    return `${v0} → ${v1}`;
  });
  await check('Rotary', 'a key press turns the knob on the spring', async () => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    try {
      await go('/components/rotary/code');
      const k = first();
      await k.focus(); await page.keyboard.press('Home'); await page.waitForTimeout(600);
      const a0 = await deg(k);
      await page.keyboard.press('End');
      await page.waitForTimeout(40); const mid = await deg(k);
      await page.waitForTimeout(700); const a1 = await deg(k);
      expect(mid > a0 && mid < a1 - 1 && Math.abs(a1 - a0 - 270) < 1, `${a0}°, then ${mid}°, then ${a1}°`);
      return `mid-way ${Math.round(mid - a0)}° of ${Math.round(a1 - a0)}°`;
    } finally { await page.emulateMedia({ reducedMotion: 'reduce' }); }
  });
}
