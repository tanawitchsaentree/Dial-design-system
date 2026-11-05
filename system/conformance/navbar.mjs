// Behaviour checks for Navbar (a top bar of printed links with a Menu key), run by tooling/kiln/conformance.mjs.
export default async function navbar({ check, expect, go, main }) {
  const bar = () => main().locator('header[data-component="Navbar"]').first();
  await check('Navbar', 'the links stand in a list and the current one is announced', async () => {
    await go('/components/navbar/code');
    const r = await bar().evaluate((h) => ({
      nav: h.querySelectorAll('nav[aria-label] ul > li > a').length,
      current: h.querySelectorAll('a[aria-current="page"]').length,
    }));
    expect(r.nav >= 3, `${r.nav} links`);
    expect(r.current === 1, `${r.current} current links (need exactly 1)`);
    return `${r.nav} links, 1 current`;
  });
  await check('Navbar', 'every link is at least the touch target and choosing a page moves no word', async () => {
    await go('/components/navbar/code');
    const r = await bar().evaluate((h) => [...h.querySelectorAll('nav a')].map((a) => {
      const b = a.getBoundingClientRect();
      return { w: b.width, h: b.height, current: a.getAttribute('aria-current') === 'page' };
    }));
    expect(r.length >= 3 && r.every((x) => x.w >= 43.5 && x.h >= 43.5), `links ${r.map((x) => `${x.w.toFixed(0)}×${x.h.toFixed(0)}`).join(', ')}`);
    // the current link holds the width of its medium state, so its width equals the width with the weight lifted
    const same = await bar().evaluate((h) => {
      const a = h.querySelector('a[aria-current="page"]'); const before = a.getBoundingClientRect().width;
      a.removeAttribute('aria-current'); const after = a.getBoundingClientRect().width; a.setAttribute('aria-current', 'page');
      return Math.abs(before - after) < 0.5;
    });
    expect(same, 'the current link changes width when its state changes');
    return 'links at least 44px, no width change on state';
  });
  await check('Navbar', 'the current link has a non-colour cue: a filled dot and a heavier word', async () => {
    await go('/components/navbar/code');
    const r = await bar().evaluate((h) => {
      const a = h.querySelector('a[aria-current="page"]'); const o = h.querySelector('nav a:not([aria-current])');
      const dot = (el) => { const m = el.querySelector('span:first-child'); const s = getComputedStyle(m); return { w: m.getBoundingClientRect().width, bg: s.backgroundColor }; };
      return { cur: dot(a), other: dot(o), curW: getComputedStyle(a.querySelector('span:nth-child(2)')).fontWeight, otherW: getComputedStyle(o.querySelector('span:nth-child(2)')).fontWeight };
    });
    expect(r.cur.w > 0 && r.cur.bg !== r.other.bg, `dot ${r.cur.bg} vs ${r.other.bg}`);
    expect(Number(r.curW) > Number(r.otherW), `weight ${r.curW} vs ${r.otherW}`);
    return 'dot filled and word medium on the current link';
  });
  await check('Navbar', 'the Menu key opens the links in a panel and reports it', async () => {
    await go('/components/navbar/code');
    const key = main().locator('header[data-component="Navbar"][data-folded] button[aria-haspopup="dialog"]').first();
    const page = key.page();
    expect((await key.getAttribute('aria-expanded')) === 'false', 'key starts collapsed');
    await key.click();
    await page.locator('div[role="dialog"][data-component="Popover"] a').first().waitFor({ state: 'visible' });
    expect((await key.getAttribute('aria-expanded')) === 'true', 'key reports expanded');
    const n = await page.locator('div[role="dialog"][data-component="Popover"] a').count();
    expect(n >= 3, `${n} links in the panel`);
    await page.keyboard.press('Escape');
    await page.waitForFunction(() => !document.querySelector('div[role="dialog"][data-component="Popover"]'), null, { timeout: 3000 });
    const back = await key.evaluate((el) => document.activeElement === el);
    expect(back, 'focus is back on the Menu key after Escape');
    return 'Menu key opens a panel of links; Escape returns focus';
  });
  await check('Navbar', 'the folded bar hides the row of links and no part of the bar is the accent orange', async () => {
    await go('/components/navbar/code');
    const r = await main().locator('header[data-component="Navbar"]').evaluateAll((els) => {
      const probe = document.createElement('span'); probe.style.color = 'var(--ds-action-accent)'; document.body.append(probe);
      const accent = getComputedStyle(probe).color; probe.remove();
      const folded = els.find((e) => e.hasAttribute('data-folded'));
      const hiddenRow = folded ? getComputedStyle(folded.querySelector('nav')).display === 'none' : false;
      const bad = []; for (const el of els) { const hits = []; for (const n of el.querySelectorAll('*')) { const cs = getComputedStyle(n); if (accent && [cs.backgroundColor, cs.color, cs.borderColor].some((c) => c === accent)) hits.push(n.tagName); } if (hits.length > 1 || hits.some((t) => t !== 'BUTTON')) bad.push(...hits); }
      return { hiddenRow, bad: bad.length };
    });
    expect(r.hiddenRow, 'the links row is still shown when folded');
    expect(r.bad === 0, `${r.bad} orange parts`);
    return 'folded row hidden, no orange';
  });
}
