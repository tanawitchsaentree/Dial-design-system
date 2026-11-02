// Behaviour checks for BottomNav, run by tooling/kiln/conformance.mjs on the built book.
export default async function bottomNav({ check, expect, page, go, main, tokens }) {
  const px = (s) => parseFloat(s);
  const first = () => main().locator('[data-example-live] [data-component="BottomNav"][data-layout="bar"]:not([data-bare] *)').first();
  await check('BottomNav', 'it is a named nav landmark and only the current link carries aria-current page', async () => {
    await go('/components/bottom-nav/code');
    const st = await first().evaluate((el) => ({ tag: el.tagName, name: el.getAttribute('aria-label'), cur: [...el.querySelectorAll('a')].map((a) => a.getAttribute('aria-current')) }));
    expect(st.tag === 'NAV' && !!st.name, `${st.tag} named "${st.name}"`);
    expect(st.cur.filter((c) => c === 'page').length === 1, `aria-current values ${st.cur.join(',')}`);
    expect(st.cur.every((c) => c === null || c === 'page'), 'aria-current is not "page"');
    return `nav "${st.name}", one current link`;
  });
  await check('BottomNav', 'every link is at least the touch target', async () => {
    await go('/components/bottom-nav/code');
    const min = px(tokens['layout.touch']?.value ?? '44px');
    const sizes = await main().locator('[data-component="BottomNav"] a').evaluateAll((els) => els.filter((e) => e.offsetParent).map((e) => { const r = e.getBoundingClientRect(); return [Math.round(r.width), Math.round(r.height)]; }));
    const small = sizes.filter(([w, h]) => w < min - 0.5 || h < min - 0.5);
    expect(sizes.length > 0, 'no links');
    expect(!small.length, `small links ${small.map((s) => s.join('×')).join(', ')}`);
    return `${sizes.length} links, smallest ${Math.min(...sizes.map((s) => s[0]))}×${Math.min(...sizes.map((s) => s[1]))}`;
  });
  await check('BottomNav', 'the current section is told by medium weight and an ink mark, never orange', async () => {
    await go('/components/bottom-nav/code');
    const accent = await page.evaluate(() => { const d = document.createElement('i'); d.style.color = 'var(--ds-action-accent)'; document.body.append(d); const c = getComputedStyle(d).color; d.remove(); return c; });
    const st = await first().evaluate((el) => {
      const on = el.querySelector('a[aria-current="page"]'), off = el.querySelector('a:not([aria-current])');
      const w = (a) => getComputedStyle(a.querySelector(':scope > span:nth-child(2) > span')).fontWeight;
      const mark = (a) => getComputedStyle(a.querySelector(':scope > span:last-child')).backgroundColor;
      return { wOn: w(on), wOff: w(off), mOn: mark(on), mOff: mark(off), colours: [...el.querySelectorAll('*')].map((n) => [getComputedStyle(n).color, getComputedStyle(n).backgroundColor]).flat() };
    });
    expect(Number(st.wOn) > Number(st.wOff), `weights ${st.wOn} vs ${st.wOff}`);
    expect(st.mOn !== st.mOff && !/rgba\(0, 0, 0, 0\)|transparent/.test(st.mOn), `mark ${st.mOn} vs ${st.mOff}`);
    expect(!st.colours.includes(accent), 'the accent orange appears in the nav');
    return `weight ${st.wOn}/${st.wOff}, mark ${st.mOn}`;
  });
  await check('BottomNav', 'Tab reaches each link and shows the focus ring', async () => {
    await go('/components/bottom-nav/code');
    const links = first().locator('a');
    await links.first().focus(); await page.keyboard.press('Shift+Tab'); await page.keyboard.press('Tab');
    const seen = [];
    for (let i = 0; i < 4; i++) {
      seen.push(await page.evaluate(() => { const a = document.activeElement; const c = getComputedStyle(a); return { in: !!a.closest('[data-component="BottomNav"]'), ring: c.outlineStyle !== 'none' && px(c.outlineWidth) > 0 }; function px(s) { return parseFloat(s); } }));
      await page.keyboard.press('Tab');
    }
    expect(seen.every((s) => s.in && s.ring), `focus ${JSON.stringify(seen)}`);
    return `${seen.length} links with a ring`;
  });
  await check('BottomNav', 'pressing a link marks it as the current page and moves no neighbour', async () => {
    await go('/components/bottom-nav/code');
    const nav = first();
    const before = await nav.locator('a').evaluateAll((els) => els.map((e) => Math.round(e.getBoundingClientRect().x)));
    const url = page.url();
    await nav.locator('a').nth(2).click();
    const st = await nav.evaluate((el) => ({ cur: [...el.querySelectorAll('a')].findIndex((a) => a.getAttribute('aria-current') === 'page'), xs: [...el.querySelectorAll('a')].map((e) => Math.round(e.getBoundingClientRect().x)) }));
    expect(st.cur === 2, `current is link ${st.cur}`);
    expect(JSON.stringify(st.xs) === JSON.stringify(before), `links moved ${before} → ${st.xs}`);
    expect(page.url() === url, `the address changed to ${page.url()}`);
    return 'mark moved, links still';
  });
  await check('BottomNav', 'layout auto prints a strip on a tall screen and a rail at the inline start on a wide one', async () => {
    const vp = page.viewportSize();
    try {
      await page.setViewportSize({ width: 375, height: 760 });
      await go('/components/bottom-nav/code');
      const auto = () => main().locator('[data-component="BottomNav"][data-layout="auto"]').first();
      const tall = await auto().evaluate((el) => { const a = [...el.querySelectorAll('a')].map((x) => x.getBoundingClientRect()); return { row: a.every((r) => Math.abs(r.top - a[0].top) < 1) }; });
      await page.setViewportSize({ width: 1280, height: 800 });
      await go('/components/bottom-nav/code');
      const wide = await auto().evaluate((el) => { const a = [...el.querySelectorAll('a')].map((x) => x.getBoundingClientRect()); return { col: a.every((r) => Math.abs(r.left - a[0].left) < 1) && a[1].top > a[0].top }; });
      expect(tall.row, 'the links are not one row on a tall screen');
      expect(wide.col, 'the links are not one column on a wide screen');
      return 'strip at 375×760, rail at 1280×800';
    } finally {
      if (vp) await page.setViewportSize(vp);
    }
  });
}
