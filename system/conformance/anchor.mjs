// Behaviour checks for Anchor (heading links with an ink index mark), run by tooling/kiln/conformance.mjs.
export default async function anchor({ page, check, expect, go, main }) {
  const nav = () => main().locator('nav[data-component="Anchor"]').first();

  await check('Anchor', 'the landmark is named, lists three or more links and exactly one is current', async () => {
    await go('/components/anchor/code');
    const r = await nav().evaluate((n) => ({
      name: n.getAttribute('aria-label') || '', links: n.querySelectorAll('a[href^="#"]').length,
      current: n.querySelectorAll('a[aria-current="location"]').length, nested: n.querySelectorAll('ul ul a').length,
    }));
    expect(r.name.length > 0, 'the nav has no name');
    expect(r.links >= 3, `${r.links} links`);
    expect(r.current === 1, `${r.current} current links (need exactly 1)`);
    expect(r.nested >= 1, 'no nested links');
    return `${r.links} links, 1 current, ${r.nested} nested`;
  });

  await check('Anchor', 'every row is at least the touch target, a sub-list steps in and no part is orange', async () => {
    await go('/components/anchor/code');
    const r = await nav().evaluate((n) => {
      const probe = document.createElement('span'); probe.style.color = 'var(--ds-action-accent)'; document.body.append(probe);
      const accent = getComputedStyle(probe).color; probe.remove();
      const links = [...n.querySelectorAll('a')];
      const h = links.map((a) => a.getBoundingClientRect().height);
      const top = n.querySelector(':scope > ul > li > a').getBoundingClientRect().left;
      const sub = n.querySelector('ul ul a').getBoundingClientRect().left;
      const orange = [...n.querySelectorAll('*')].filter((e) => { const cs = getComputedStyle(e); return [cs.backgroundColor, cs.color, cs.borderBlockEndColor].some((c) => c === accent); }).length;
      return { min: Math.min(...h), step: Math.abs(sub - top), orange };
    });
    expect(r.min >= 43.5, `shortest row ${r.min}px`);
    expect(r.step > 0, `sub-list steps in by ${r.step}px`);
    expect(r.orange === 0, `${r.orange} orange parts`);
    return `rows >= ${Math.round(r.min)}px, indent ${Math.round(r.step)}px, no orange`;
  });

  await check('Anchor', 'scrolling the page moves the current mark to the heading that passed, and a press marks its link', async () => {
    await go('/components/anchor/code');
    await nav().scrollIntoViewIfNeeded();
    const first = await nav().evaluate((n) => n.querySelector('a[aria-current="location"]').getAttribute('href'));
    // the mark of the current link must be a visible shape, not only ink
    const bar = await nav().evaluate((n) => { const m = n.querySelector('a[aria-current="location"] > span:first-child'); const cs = getComputedStyle(m); return { w: m.getBoundingClientRect().width, b: parseFloat(cs.borderBlockEndWidth), c: cs.borderBlockEndColor }; });
    expect(bar.w > 0 && bar.b > 0 && bar.c !== 'rgba(0, 0, 0, 0)', `mark ${bar.w}px wide, ${bar.b}px thick, ${bar.c}`);
    await page.locator('#anchor-usage-page').evaluate((box) => { const h = box.querySelector('#au-sensors'); box.scrollTop += h.getBoundingClientRect().top - box.getBoundingClientRect().top - 4; });
    await page.waitForTimeout(600);
    const after = await nav().evaluate((n) => n.querySelector('a[aria-current="location"]')?.getAttribute('href'));
    expect(after === '#au-sensors', `after scrolling to Sensors the current link is ${after} (was ${first})`);
    await nav().locator('a[href="#au-overview"]').click();
    await page.waitForTimeout(600);
    const pressed = await nav().evaluate((n) => n.querySelector('a[aria-current="location"]')?.getAttribute('href'));
    expect(pressed === '#au-overview', `after pressing Overview the current link is ${pressed}`);
    return `${first} -> #au-sensors on scroll -> #au-overview on press`;
  });
}
