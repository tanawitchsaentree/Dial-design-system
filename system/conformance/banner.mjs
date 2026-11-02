// Behaviour checks for Banner, run by tooling/kiln/conformance.mjs on the built book.
export default async function banner({ check, expect, page, go, main, tokens }) {
  const px = (s) => parseFloat(s);
  await check('Banner', 'each banner is a live region, a status or an alert when critical', async () => {
    await go('/components/banner/code');
    const st = await main().locator('[data-component="Banner"]').evaluateAll((els) => els.map((e) => ({ tone: e.dataset.tone, role: e.getAttribute('role') })));
    expect(st.length > 0, 'no banners on the page');
    const bad = st.filter((t) => t.role !== (t.tone === 'critical' ? 'alert' : 'status'));
    expect(!bad.length, `wrong roles: ${bad.map((t) => `${t.tone}=${t.role}`).join(', ')}`);
    return `${st.length} banners, roles ok`;
  });
  await check('Banner', 'status is a glyph and a word, with no stripe, no tint and no orange', async () => {
    await go('/components/banner/code');
    const ref = await page.evaluate(() => { const d = document.createElement('i'); d.style.color = 'var(--ds-action-accent)'; d.style.backgroundColor = 'var(--ds-surface-solid)'; document.body.append(d); const c = getComputedStyle(d); const o = { accent: c.color, solid: c.backgroundColor }; d.remove(); return o; });
    const st = await main().locator('[data-component="Banner"]').evaluateAll((els) => els.map((e) => {
      const g = e.querySelector('svg'); const word = e.firstElementChild?.textContent?.trim() ?? ''; const c = getComputedStyle(e);
      return { glyph: !!g, word, colour: g ? getComputedStyle(g).color : '', bg: c.backgroundColor, bs: parseFloat(c.borderInlineStartWidth), be: parseFloat(c.borderInlineEndWidth) };
    }));
    expect(st.every((t) => t.glyph && t.word.length > 0), 'a banner lacks its glyph or its status word');
    expect(st.every((t) => t.colour !== ref.accent && t.bg !== ref.accent), 'a banner uses the accent orange');
    expect(st.every((t) => t.bg === ref.solid), `a banner is tinted: ${[...new Set(st.map((t) => t.bg))].join(', ')}`);
    expect(st.every((t) => t.bs === t.be), 'a banner has a start-edge stripe');
    return [...new Set(st.map((t) => t.word))].join(', ');
  });
  await check('Banner', 'Tab reaches the dismiss key, it is at least the touch target and shows the focus ring', async () => {
    await go('/components/banner/code');
    const min = px(tokens['layout.touch']?.value ?? '44px');
    const k = main().locator('[data-component="Banner"] [data-component="IconButton"]').first();
    await k.focus(); await page.keyboard.press('Shift+Tab'); await page.keyboard.press('Tab');
    const st = await k.evaluate((el) => { const r = el.getBoundingClientRect(); const c = getComputedStyle(el); return { focused: document.activeElement === el, w: r.width, h: r.height, ow: c.outlineWidth, os: c.outlineStyle, name: el.getAttribute('aria-label') }; });
    expect(st.focused, 'the dismiss key did not take focus');
    expect(st.w >= min - 0.5 && st.h >= min - 0.5, `dismiss key ${st.w}×${st.h}`);
    expect(st.os !== 'none' && px(st.ow) >= 2, `outline ${st.os} ${st.ow}`);
    expect(!!st.name, 'the dismiss key has no name');
    return `${st.w}×${st.h}, "${st.name}"`;
  });
  await check('Banner', 'Enter on the dismiss key calls onDismiss', async () => {
    await go('/components/banner/code');
    const k = main().getByRole('button', { name: 'Dismiss', exact: true }).first();
    const host = main().locator('[data-component="Banner"]', { hasText: 'Every lamp runs the new firmware.' }).first();
    const before = await host.count();
    await k.focus(); await page.keyboard.press('Enter');
    await page.waitForTimeout(100);
    const back = main().getByRole('button', { name: 'Show the note again', exact: true });
    expect(before > 0 && (await back.count()) > 0, 'the banner did not go after Enter on its dismiss key');
    return 'dismissed';
  });
  await check('Banner', 'on a narrow strip the keys wrap under the message and keep their size', async () => {
    const vp = page.viewportSize();
    await page.setViewportSize({ width: 375, height: 760 });
    try {
      await go('/components/banner/code');
      const st = await main().locator('[data-component="Banner"]').filter({ has: page.locator('button') }).first().evaluate((el) => {
        const m = el.children[1].getBoundingClientRect(); const k = el.lastElementChild.getBoundingClientRect(); const r = el.getBoundingClientRect();
        return { keysBelow: k.top >= m.bottom - 1, inside: k.right <= r.right + 0.5, h: k.height };
      });
      expect(st.inside, 'the keys run past the strip');
      expect(st.h >= 43.5, `keys ${st.h}px tall`);
      return st.keysBelow ? 'keys under the message' : 'keys fit beside the message';
    } finally {
      if (vp) await page.setViewportSize(vp);
    }
  });
}
