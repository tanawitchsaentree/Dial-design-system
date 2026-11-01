// Behaviour checks for Toast, run by tooling/kiln/conformance.mjs on the built book.
export default async function toast({ check, expect, page, go, main, tokens }) {
  const px = (s) => parseFloat(s);
  await check('Toast', 'each toast is a live region: status, or alert when critical', async () => {
    await go('/components/toast/code');
    const st = await main().locator('[data-component="Toast"]').evaluateAll((els) => els.map((e) => ({ tone: e.dataset.tone, role: e.getAttribute('role') })));
    expect(st.length > 0, 'no toasts on the page');
    const bad = st.filter((t) => t.role !== (t.tone === 'critical' ? 'alert' : 'status'));
    expect(!bad.length, `wrong roles: ${bad.map((t) => `${t.tone}=${t.role}`).join(', ')}`);
    return `${st.length} toasts, roles ok`;
  });
  await check('Toast', 'status is a glyph and a word, never orange', async () => {
    await go('/components/toast/code');
    const accent = await page.evaluate(() => { const d = document.createElement('i'); d.style.color = 'var(--ds-action-accent)'; document.body.append(d); const c = getComputedStyle(d).color; d.remove(); return c; });
    const st = await main().locator('[data-component="Toast"]').evaluateAll((els) => els.map((e) => {
      const g = e.querySelector('svg'); const word = e.firstElementChild?.textContent?.trim() ?? '';
      return { glyph: !!g, word, colour: g ? getComputedStyle(g).color : '', bg: getComputedStyle(e).backgroundColor };
    }));
    expect(st.every((t) => t.glyph && t.word.length > 0), 'a toast lacks its glyph or its status word');
    expect(st.every((t) => t.colour !== accent && t.bg !== accent), 'a toast uses the accent orange');
    return st.map((t) => t.word).filter((w, i, a) => a.indexOf(w) === i).join(', ');
  });
  await check('Toast', 'Tab reaches the close key, it is at least the touch target and shows the focus ring', async () => {
    await go('/components/toast/code');
    const min = px(tokens['layout.touch']?.value ?? '44px');
    const k = main().locator('[data-component="Toast"] [data-component="IconButton"]').first();
    await k.focus(); await page.keyboard.press('Shift+Tab'); await page.keyboard.press('Tab');
    const st = await k.evaluate((el) => { const r = el.getBoundingClientRect(); const c = getComputedStyle(el); return { focused: document.activeElement === el, w: r.width, h: r.height, ow: c.outlineWidth, os: c.outlineStyle, name: el.getAttribute('aria-label') }; });
    expect(st.focused, 'the close key did not take focus');
    expect(st.w >= min - 0.5 && st.h >= min - 0.5, `close key ${st.w}×${st.h}`);
    expect(st.os !== 'none' && px(st.ow) >= 2, `outline ${st.os} ${st.ow}`);
    expect(!!st.name, 'the close key has no name');
    return `${st.w}×${st.h}, "${st.name}"`;
  });
  await check('Toast', 'useToast posts a toast that stays at least 5 s and closes on its close key', async () => {
    await go('/components/toast/code');
    await main().getByRole('button', { name: 'Turn lamp off', exact: true }).first().click();
    const t = page.locator('[data-toast-region] [data-component="Toast"]').first();
    await t.waitFor({ state: 'visible' });
    await page.mouse.move(0, 0);
    await page.waitForTimeout(4600);
    expect(await t.isVisible(), 'the toast left before 5 s');
    await t.locator('[data-component="IconButton"]').click();
    await t.waitFor({ state: 'detached' });
    return 'stayed 4.6 s, closed on the key';
  });
  const arrive = async () => {
    await go('/components/toast/code');
    await main().getByRole('button', { name: 'Turn lamp off', exact: true }).first().click();
    const item = page.locator('[data-toast-region] > *').first();
    await item.waitFor({ state: 'visible' });
    return item.evaluate((el) => { const c = getComputedStyle(el); return { dur: c.transitionDuration, prop: c.transitionProperty }; });
  };
  await check('Toast', 'a toast rises on motion.enter', async () => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    const st = await arrive();
    await page.emulateMedia({ reducedMotion: 'reduce' });
    expect(/opacity|all/.test(st.prop) && px(st.dur) > 0, `transition ${st.prop} ${st.dur}`);
    return `${st.prop} ${st.dur}`;
  });
  await check('Toast', 'under reduce motion a toast appears at once', async () => {
    const st = await arrive();
    expect(px(st.dur) === 0 || st.prop === 'none', `transition ${st.prop} ${st.dur}`);
    return 'no motion';
  });
}
