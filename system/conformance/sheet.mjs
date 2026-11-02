// Behaviour checks for Sheet, run by tooling/kiln/conformance.mjs on the built book.
export default async function sheet({ check, expect, page, go, main, tokens }) {
  const px = (s) => parseFloat(s);
  const opener = () => main().getByRole('button', { name: 'Living room lamp', exact: true }).first();
  const openSheet = async () => {
    await go('/components/sheet/code');
    const b = opener();
    await b.focus(); await page.keyboard.press('Enter');
    const d = main().locator('dialog[data-component="Sheet"]:modal').first();
    await d.waitFor({ state: 'visible' });
    return { b, d };
  };
  await check('Sheet', 'Enter on the opener shows a modal sheet named by the device', async () => {
    const { d } = await openSheet();
    const st = await d.evaluate((el) => ({ modal: el.matches(':modal'), name: document.getElementById(el.getAttribute('aria-labelledby') ?? '')?.textContent ?? '', inside: el.contains(document.activeElement) || document.activeElement === el }));
    expect(st.modal, 'the sheet is not modal (showModal was not used)');
    expect(st.name.trim() === 'Living room lamp', `named "${st.name}"`);
    expect(st.inside, 'focus did not move into the sheet');
    return `"${st.name}", modal, focus inside`;
  });
  await check('Sheet', 'Tab and Shift+Tab stay inside the sheet', async () => {
    const { d } = await openSheet();
    const seen = [];
    for (const k of ['Tab', 'Tab', 'Tab', 'Tab', 'Tab', 'Tab', 'Shift+Tab', 'Shift+Tab', 'Shift+Tab', 'Shift+Tab', 'Shift+Tab', 'Shift+Tab', 'Shift+Tab']) {
      await page.keyboard.press(k);
      seen.push(await d.evaluate((el) => el.contains(document.activeElement) || document.activeElement === el));
    }
    expect(seen.every(Boolean), `focus left the sheet (${seen.join(', ')})`);
    return `${seen.length} moves inside`;
  });
  await check('Sheet', 'Escape closes the sheet and focus returns to the opener', async () => {
    const { b, d } = await openSheet();
    await page.keyboard.press('Escape');
    await d.waitFor({ state: 'hidden' });
    const back = await b.evaluate((el) => document.activeElement === el);
    expect(back, 'focus did not return to the opener');
    return 'closed, focus on opener';
  });
  await check('Sheet', 'the close key is a 44px round key that closes the sheet', async () => {
    const { d } = await openSheet();
    const min = px(tokens['layout.touch']?.value ?? '44px');
    const k = d.locator('[data-part="head"] button').first();
    const st = await k.evaluate((el) => { const r = el.getBoundingClientRect(); return { w: r.width, h: r.height, name: el.getAttribute('aria-label') }; });
    expect(st.w >= min - 0.5 && st.h >= min - 0.5, `close key ${st.w}×${st.h}`);
    expect(!!st.name, 'the close key has no name');
    await k.click();
    await d.waitFor({ state: 'hidden' });
    return `${st.w}×${st.h}, "${st.name}"`;
  });
  await check('Sheet', 'a click on the scrim closes the sheet', async () => {
    const { d } = await openSheet();
    const r = await d.boundingBox();
    await page.mouse.click(Math.max(4, (r?.x ?? 40) - 20), 20);
    await d.waitFor({ state: 'hidden' });
    return 'closed from the scrim';
  });
  await check('Sheet', 'on a tall screen it docks to the bottom edge, shows the bar and closes on a drag down', async () => {
    const vp = page.viewportSize();
    await page.setViewportSize({ width: 375, height: 760 });
    try {
      const { d } = await openSheet();
      await page.waitForTimeout(50);
      const st = await d.evaluate((el) => { const r = el.getBoundingClientRect(); const h = el.querySelector('[data-part="handle"]'); const hr = h?.getBoundingClientRect(); return { bottom: Math.round(window.innerHeight - r.bottom), w: Math.round(r.width), vw: document.documentElement.clientWidth, bar: hr ? hr.height : 0, hx: hr ? hr.x + hr.width / 2 : 0, hy: hr ? hr.y + hr.height / 2 : 0, rad: getComputedStyle(el).borderEndStartRadius }; });
      expect(Math.abs(st.bottom) <= 1, `${st.bottom}px above the bottom edge`);
      expect(st.w >= st.vw - 1, `${st.w}px wide on a ${st.vw}px screen`);
      expect(st.bar >= 30, `the bar strip is ${st.bar}px tall`);
      expect(px(st.rad) === 0, `bottom corner radius ${st.rad}`);
      await page.mouse.move(st.hx, st.hy); await page.mouse.down();
      for (let i = 1; i <= 10; i++) await page.mouse.move(st.hx, st.hy + i * 40);
      await page.mouse.up();
      await d.waitFor({ state: 'hidden' });
      return `docked, ${st.w}px wide, bar ${st.bar}px, closed by drag`;
    } finally {
      if (vp) await page.setViewportSize(vp);
    }
  });
  await check('Sheet', 'on a wide screen it stands inset from the lower end and the screen edges', async () => {
    const { d } = await openSheet();
    await page.waitForTimeout(50);
    const st = await d.evaluate((el) => { const r = el.getBoundingClientRect(); return { end: Math.round(document.documentElement.clientWidth - r.right), bottom: Math.round(window.innerHeight - r.bottom), top: Math.round(r.top) }; });
    expect(st.end >= 16 && st.bottom >= 16 && st.top >= 16, `end ${st.end}, bottom ${st.bottom}, top ${st.top}`);
    await page.keyboard.press('Escape');
    return `end ${st.end}px, bottom ${st.bottom}px`;
  });
  const motion = async () => {
    const { d } = await openSheet();
    const st = await d.evaluate((el) => { const c = getComputedStyle(el); return { dur: c.transitionDuration, prop: c.transitionProperty }; });
    await page.keyboard.press('Escape');
    return st;
  };
  await check('Sheet', 'the sheet slides in on motion.release and leaves faster', async () => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    const st = await motion();
    await page.emulateMedia({ reducedMotion: 'reduce' });
    expect(/transform|all/.test(st.prop) && px(st.dur) > 0, `transition ${st.prop} ${st.dur}`);
    return `${st.prop} ${st.dur}`;
  });
  await check('Sheet', 'under reduce motion the sheet appears at once', async () => {
    const st = await motion();
    expect(px(st.dur) === 0 || st.prop === 'none', `transition ${st.prop} ${st.dur}`);
    return 'no motion';
  });
}
