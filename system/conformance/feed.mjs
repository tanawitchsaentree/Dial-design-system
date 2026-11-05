// Behaviour checks for Feed (rows on the body, WAI-ARIA feed pattern), run by tooling/kiln/conformance.mjs.
// UNVERIFIED here: onNearEnd firing from the IntersectionObserver while scrolling (needs a scrolled page and a callback to count).
export default async function feed({ check, expect, go, main, page }) {
  const root = () => main().locator('[data-component="Feed"]').first();

  await check('Feed', 'every post is a labelled article with its position', async () => {
    await go('/components/feed/code');
    const r = await root().locator('[role="feed"]').evaluate((f) => {
      const arts = [...f.children].filter((c) => c.tagName === 'ARTICLE');
      return {
        label: f.getAttribute('aria-label'), busy: f.getAttribute('aria-busy'), n: arts.length,
        pos: arts.map((a) => a.getAttribute('aria-posinset')), size: arts.map((a) => a.getAttribute('aria-setsize')),
        names: arts.map((a) => (a.getAttribute('aria-labelledby') || '').split(' ').map((id) => document.getElementById(id)?.textContent ?? '').join(' ').trim()),
      };
    });
    expect(r.label && r.label.length > 0, 'the feed has no label');
    expect(r.busy === 'false', `aria-busy is ${r.busy}`);
    expect(r.n >= 3, `${r.n} articles`);
    expect(r.pos.every((p, i) => p === String(i + 1)), `aria-posinset ${r.pos.join(',')}`);
    expect(r.size.every((s) => s === '-1'), `aria-setsize ${r.size.join(',')} (hasMore with no total must be -1)`);
    expect(r.names.every((t) => t.length > 0), `names ${r.names.join(' | ')}`);
    return `${r.n} articles, positions 1..${r.n}, setsize -1, all named`;
  });

  await check('Feed', 'Page Down and Page Up move between posts', async () => {
    await go('/components/feed/code');
    const arts = root().locator('[role="feed"] > article');
    await arts.nth(0).focus();
    await page.keyboard.press('PageDown');
    const second = await arts.nth(1).evaluate((a) => a === document.activeElement);
    expect(second, 'Page Down did not move focus to the second post');
    await page.keyboard.press('PageDown');
    const third = await arts.nth(2).evaluate((a) => a === document.activeElement);
    expect(third, 'Page Down did not move focus to the third post');
    await page.keyboard.press('PageUp');
    const back = await arts.nth(1).evaluate((a) => a === document.activeElement);
    expect(back, 'Page Up did not move focus back to the second post');
    return 'down, down, up land on posts 2, 3, 2';
  });

  await check('Feed', 'the load more key and the notice key are at least the touch target, and the notice does not take height', async () => {
    await go('/components/feed/code');
    const r = await root().evaluate((el) => {
      const slot = el.querySelector('[role="status"]');
      const slotBtn = slot?.querySelector('button')?.getBoundingClientRect();
      const keys = [...el.querySelectorAll(':scope > div:last-child button')].map((b) => ({ h: b.getBoundingClientRect().height, t: b.textContent }));
      return { slotH: slot?.getBoundingClientRect().height ?? -1, slotBtnH: slotBtn?.height ?? 0, keys };
    });
    expect(r.slotH === 0, `the notice line is ${r.slotH}px tall (must be 0 so it pushes nothing)`);
    expect(r.slotBtnH >= 43.5, `notice key ${r.slotBtnH}px`);
    expect(r.keys.length === 1 && r.keys[0].h >= 43.5, `footer keys ${JSON.stringify(r.keys)}`);
    return `notice line 0px, notice key ${Math.round(r.slotBtnH)}px, load more key ${Math.round(r.keys[0].h)}px`;
  });

  await check('Feed', 'no part of the feed is the accent orange', async () => {
    await go('/components/feed/code');
    const bad = await main().locator('[data-component="Feed"]').evaluateAll((els) => {
      const probe = document.createElement('span'); probe.style.color = 'var(--ds-action-accent)'; document.body.append(probe);
      const accent = getComputedStyle(probe).color; probe.remove();
      const out = []; for (const el of els) for (const n of el.querySelectorAll('*')) { const cs = getComputedStyle(n); if (accent && [cs.backgroundColor, cs.color, cs.borderColor].some((c) => c === accent)) out.push(n.tagName); }
      return out;
    });
    expect(bad.length === 0, `${bad.length} orange parts`);
    return 'no orange';
  });
}
