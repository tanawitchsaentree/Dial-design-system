// Behaviour checks for NavigationMenu (WAI-ARIA disclosure navigation), run by tooling/kiln/conformance.mjs.
export default async function navigationMenu({ check, expect, page, go, main, tokens }) {
  const px = (s) => parseFloat(s);
  const min = () => px(tokens['layout.touch']?.value ?? '44px');
  const nav = () => main().locator('nav[data-component="NavigationMenu"]').first();
  const keys = () => nav().locator('button[aria-expanded]');
  const panelOf = (k) => k.evaluate((el) => {
    const p = document.getElementById(el.getAttribute('aria-controls') ?? '');
    const links = p ? [...p.querySelectorAll('a')] : [];
    return { shown: !!p && p.getBoundingClientRect().height > 0, links: links.length, active: links.indexOf(document.activeElement), onKey: document.activeElement === el, expanded: el.getAttribute('aria-expanded') === 'true' };
  });

  await check('NavigationMenu', 'each name that holds links is a button that discloses a panel, and every name is at least the touch target', async () => {
    await go('/components/navigation-menu/code');
    const n = await keys().count();
    expect(n >= 2, `${n} disclosure keys (need 2 or more)`);
    const closed = await panelOf(keys().first());
    expect(!closed.expanded && !closed.shown, `closed state: expanded ${closed.expanded}, panel shown ${closed.shown}`);
    await keys().first().click();
    const open = await panelOf(keys().first());
    expect(open.expanded && open.shown && open.links >= 3, `after click: expanded ${open.expanded}, panel shown ${open.shown}, ${open.links} links`);
    const sizes = await nav().evaluate((el) => [...el.querySelectorAll('[data-nav-top], [data-nav-link]')].map((a) => { const r = a.getBoundingClientRect(); return { w: r.width, h: r.height }; }));
    expect(sizes.length >= 5 && sizes.every((s) => s.h >= min() - 0.5), `heights ${sizes.map((s) => Math.round(s.h)).join(', ')} (min ${min()})`);
    return `${n} keys, ${open.links} links in the first panel`;
  });

  await check('NavigationMenu', 'Down opens a panel on its first link and Escape closes it with focus back on the name', async () => {
    await go('/components/navigation-menu/code');
    const k = keys().first();
    await k.focus(); await page.keyboard.press('ArrowDown');
    const o = await panelOf(k);
    expect(o.expanded && o.shown && o.active === 0, `after Down: expanded ${o.expanded}, shown ${o.shown}, focus on link ${o.active}`);
    await page.keyboard.press('ArrowDown');
    const moved = await panelOf(k);
    expect(moved.active === 1, `second Down: focus on link ${moved.active}`);
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);
    const s = await panelOf(k);
    expect(!s.expanded && !s.shown && s.onKey, `after Escape: expanded ${s.expanded}, shown ${s.shown}, focus on name ${s.onKey}`);
    return 'Down opens, Escape closes and returns focus';
  });

  await check('NavigationMenu', 'Left, Right, Home and End walk the top names and only one panel is open at a time', async () => {
    await go('/components/navigation-menu/code');
    const tops = nav().locator('[data-nav-top]');
    const total = await tops.count();
    expect(total >= 4, `${total} top names (need 4 or more)`);
    const at = () => tops.evaluateAll((els) => els.indexOf(document.activeElement));
    await tops.first().focus();
    await page.keyboard.press('ArrowRight'); const a = await at();
    await page.keyboard.press('End'); const b = await at();
    await page.keyboard.press('ArrowRight'); const c = await at();
    await page.keyboard.press('ArrowLeft'); const d = await at();
    await page.keyboard.press('Home'); const e = await at();
    expect(a === 1 && b === total - 1 && c === 0 && d === total - 1 && e === 0, `focus went ${[a, b, c, d, e].join(', ')} (want 1, ${total - 1}, 0, ${total - 1}, 0)`);
    await keys().nth(0).click();
    await keys().nth(1).click();
    await page.waitForTimeout(500);
    const open = await keys().evaluateAll((els) => els.filter((el) => el.getAttribute('aria-expanded') === 'true').length);
    expect(open === 1, `${open} panels open after opening two names`);
    return `${total} names walked, one panel open`;
  });

  await check('NavigationMenu', 'the current page is told by aria-current and an ink bar, and no part of the menu is the accent orange', async () => {
    await go('/components/navigation-menu/code');
    await keys().first().click();
    const r = await nav().evaluate((el) => {
      const probe = document.createElement('span'); probe.style.color = 'var(--ds-action-accent)'; document.body.append(probe);
      const accent = getComputedStyle(probe).color; probe.remove();
      const cur = el.querySelectorAll('[aria-current="page"]');
      const bar = cur[0]?.querySelector('span:last-child');
      const b = bar ? getComputedStyle(bar) : null;
      const bad = [];
      for (const n of [el, ...el.querySelectorAll('*')]) { const cs = getComputedStyle(n); if (accent && [cs.backgroundColor, cs.color, cs.borderColor].some((c) => c === accent)) bad.push(n.tagName); }
      return { current: cur.length, barH: bar ? bar.getBoundingClientRect().height : 0, barBg: b?.backgroundColor, bad: bad.length };
    });
    expect(r.current >= 1, `${r.current} elements with aria-current`);
    expect(r.barH > 0 && r.barBg && r.barBg !== 'rgba(0, 0, 0, 0)', `bar ${r.barH}px, background ${r.barBg}`);
    expect(r.bad === 0, `${r.bad} orange parts`);
    return `${r.current} current, bar ${Math.round(r.barH)}px, no orange`;
  });
}
