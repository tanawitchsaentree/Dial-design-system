// Behaviour checks for Breadcrumb (dotted leaders, folded middle), run by tooling/kiln/conformance.mjs.
export default async function breadcrumb({ check, expect, go, main, page }) {
  await check('Breadcrumb', 'the path is a named nav with an ordered list and exactly one current page that is not a link', async () => {
    await go('/components/breadcrumb/code');
    const r = await main().locator('nav[data-component="Breadcrumb"]').first().evaluate((nav) => {
      const cur = [...nav.querySelectorAll('[aria-current="page"]')];
      return { name: nav.getAttribute('aria-label'), items: nav.querySelectorAll('ol > li').length, cur: cur.length, curIsLink: cur.some((c) => c.tagName === 'A'), curLast: cur[0] === nav.querySelector('ol > li:last-child > *:last-child') };
    });
    expect(!!r.name, 'the nav has no name');
    expect(r.items >= 2, `${r.items} levels`);
    expect(r.cur === 1 && !r.curIsLink, `${r.cur} current pages, link: ${r.curIsLink}`);
    expect(r.curLast, 'the current page is not the last level');
    return `${r.items} levels, 1 current page, not a link`;
  });
  await check('Breadcrumb', 'every link is at least the touch target tall', async () => {
    await go('/components/breadcrumb/code');
    const r = await main().locator('nav[data-component="Breadcrumb"]').first().evaluate((nav) => [...nav.querySelectorAll('a')].filter((a) => a.getBoundingClientRect().width > 0).map((a) => ({ w: a.getBoundingClientRect().width, h: a.getBoundingClientRect().height })));
    expect(r.length > 0 && r.every((x) => x.h >= 43.5 && x.w >= 43.5), `links ${r.map((x) => `${x.w}×${x.h}`).join(', ')}`);
    return `${r.length} links at 44px or more`;
  });
  await check('Breadcrumb', 'a folded path keeps the first and last level, and the key prints the rest back and moves focus into them', async () => {
    await go('/components/breadcrumb/code');
    const nav = main().locator('nav[data-component="Breadcrumb"]').first();
    expect((await nav.locator('ol[data-collapsed]').count()) === 1, 'the subject path is not folded');
    const before = await nav.evaluate((n) => ({ shown: [...n.querySelectorAll('ol > li')].filter((li) => li.getBoundingClientRect().width > 0).length, total: n.querySelectorAll('ol > li').length }));
    const key = nav.locator('button[aria-expanded]');
    expect((await key.count()) === 1, 'a folded path needs exactly one key');
    expect(before.shown < before.total, `${before.shown} of ${before.total} levels shown while folded`);
    await key.focus();
    await page.keyboard.press('Enter');
    const after = await nav.evaluate((n) => ({ keys: n.querySelectorAll('button').length, active: document.activeElement?.tagName, inNav: n.contains(document.activeElement), shown: [...n.querySelectorAll('ol > li')].filter((li) => li.getBoundingClientRect().width > 0).length }));
    expect(after.keys === 0, 'the folded key is still there after it was pressed');
    expect(after.inNav && after.active === 'A', `focus on ${after.active}, inside the path: ${after.inNav}`);
    expect(after.shown > before.shown, `${after.shown} levels shown after, ${before.shown} before`);
    return `${before.shown} levels shown folded, ${after.shown} after the key, focus on a link`;
  });
  await check('Breadcrumb', 'no part of the path is the accent orange', async () => {
    await go('/components/breadcrumb/code');
    const bad = await main().locator('nav[data-component="Breadcrumb"]').evaluateAll((els) => {
      const probe = document.createElement('span'); probe.style.color = 'var(--ds-action-accent)'; document.body.append(probe);
      const accent = getComputedStyle(probe).color; probe.remove();
      const out = []; for (const el of els) for (const n of el.querySelectorAll('*')) { const cs = getComputedStyle(n); if (accent && [cs.backgroundColor, cs.color, cs.borderColor].some((c) => c === accent)) out.push(n.tagName); }
      return out;
    });
    expect(bad.length === 0, `${bad.length} orange parts`);
    return 'no orange';
  });
}
