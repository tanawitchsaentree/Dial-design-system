// Behaviour checks for Spinner (a busy indicator made of holes), run by tooling/kiln/conformance.mjs.
export default async function spinner({ check, expect, go, main, page }) {
  await check('Spinner', 'it is a status region that holds its label as text and hides the holes', async () => {
    await go('/components/spinner/code');
    const r = await main().locator('[data-component="Spinner"]').first().evaluate((el) => ({
      role: el.getAttribute('role'), text: (el.textContent || '').trim(),
      holes: el.querySelectorAll('[aria-hidden="true"] > span').length,
      hidden: el.querySelector('[aria-hidden="true"]') !== null,
    }));
    expect(r.role === 'status', `role ${r.role}`);
    expect(r.text.length > 0, 'no label text inside the status region');
    expect(r.holes === 9 && r.hidden, `${r.holes} holes, hidden ${r.hidden}`);
    return `status "${r.text}" with ${r.holes} hidden holes`;
  });
  await check('Spinner', 'the lit trail steps through the ring while motion is allowed', async () => {
    await go('/components/spinner/code');
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    const r = await main().locator('[data-component="Spinner"]').first().evaluate((el) => {
      const holes = [...el.querySelectorAll('[aria-hidden="true"] > span')];
      const a = holes.slice(0, 8).map((h) => getComputedStyle(h).animationName);
      const d = holes.slice(0, 8).map((h) => getComputedStyle(h).animationDelay);
      return { moving: a.every((n) => n !== 'none'), delays: new Set(d).size, centre: getComputedStyle(holes[8]).animationName };
    });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    expect(r.moving, 'the edge holes are not animated');
    expect(r.delays === 8, `${r.delays} different delays (need 8, one per hole)`);
    expect(r.centre === 'none', `centre hole animates (${r.centre})`);
    return '8 edge holes step in turn; the centre never moves';
  });
  await check('Spinner', 'under reduced motion nothing moves and three holes stay lit', async () => {
    await go('/components/spinner/code');
    const page = main().page();
    await page.emulateMedia({ reducedMotion: 'reduce' });
    try {
      const r = await main().locator('[data-component="Spinner"]').first().evaluate((el) => {
        const holes = [...el.querySelectorAll('[aria-hidden="true"] > span')];
        const bg = holes.map((h) => getComputedStyle(h).backgroundColor);
        const lit = bg.filter((c) => c === bg[0]).length;
        return { still: holes.every((h) => getComputedStyle(h).animationName === 'none'), lit, distinct: new Set(bg).size };
      });
      expect(r.still, 'a hole still animates under reduced motion');
      expect(r.distinct === 2 && r.lit === 3, `${r.lit} lit holes, ${r.distinct} tones (need 3 lit, 2 tones)`);
      return '3 holes lit, no animation';
    } finally { await page.emulateMedia({ reducedMotion: 'no-preference' }); }
  });
  await check('Spinner', 'no part of the spinner is the accent orange', async () => {
    await go('/components/spinner/code');
    const bad = await main().locator('[data-component="Spinner"]').evaluateAll((els) => {
      const probe = document.createElement('span'); probe.style.color = 'var(--ds-action-accent)'; document.body.append(probe);
      const accent = getComputedStyle(probe).color; probe.remove();
      const out = []; for (const el of els) for (const n of el.querySelectorAll('*')) { const cs = getComputedStyle(n); if (accent && [cs.backgroundColor, cs.color, cs.borderColor].some((c) => c === accent)) out.push(n.tagName); }
      return out;
    });
    expect(bad.length === 0, `${bad.length} orange parts`);
    return 'no orange';
  });
}
