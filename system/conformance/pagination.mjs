// Behaviour checks for Pagination (printed numbers, two round keys, gaps), run by tooling/kiln/conformance.mjs.
export default async function pagination({ check, expect, go, main }) {
  await check('Pagination', 'the current page is announced and the row keeps its places', async () => {
    await go('/components/pagination/code');
    const nav = main().locator('nav[data-component="Pagination"]').first();
    const read = () => nav.evaluate((n) => ({
      places: n.querySelectorAll('li').length,
      current: [...n.querySelectorAll('[aria-current="page"]')].map((e) => e.textContent.trim()),
      landmark: n.getAttribute('aria-label'),
    }));
    const before = await read();
    expect(!!before.landmark, 'the landmark has no name');
    expect(before.current.length === 1, `${before.current.length} current pages (need exactly 1)`);
    await nav.getByRole('button', { name: /next/i }).click();
    const after = await read();
    expect(after.current.length === 1 && after.current[0] !== before.current[0], `current stayed ${before.current[0]} after next`);
    expect(after.places === before.places, `places went from ${before.places} to ${after.places}`);
    return `page ${before.current[0]} to ${after.current[0]}, ${after.places} places both times`;
  });
  await check('Pagination', 'pressing next to the end flattens the key and moves focus to the current page', async () => {
    await go('/components/pagination/code');
    const nav = main().locator('nav[data-component="Pagination"]').first();
    for (let i = 0; i < 20; i++) {
      const off = await nav.getByRole('button', { name: /next/i }).getAttribute('aria-disabled');
      if (off === 'true') break;
      await nav.getByRole('button', { name: /next/i }).click();
    }
    const r = await nav.evaluate((n) => {
      const items = n.querySelectorAll('li');
      const next = items[items.length - 1].firstElementChild;
      const active = document.activeElement;
      return { disabled: next.getAttribute('aria-disabled'), focusOnCurrent: active?.getAttribute('aria-current') === 'page', shadow: getComputedStyle(next).boxShadow };
    });
    expect(r.disabled === 'true', 'the next key is not marked aria-disabled at the last page');
    expect(r.shadow === 'none', `the flat key still has a shadow (${r.shadow})`);
    expect(r.focusOnCurrent, 'focus is not on the current page after the key went flat');
    return 'next flat, focus on the current page';
  });
  await check('Pagination', 'every number and key is at least the touch target', async () => {
    await go('/components/pagination/code');
    const r = await main().locator('nav[data-component="Pagination"]').first().evaluate((n) =>
      [...n.querySelectorAll('li:not([aria-hidden]) > *')].map((e) => ({ w: e.getBoundingClientRect().width, h: e.getBoundingClientRect().height })));
    expect(r.length > 2 && r.every((x) => x.w >= 43.5 && x.h >= 43.5), `targets ${r.map((x) => `${Math.round(x.w)}×${Math.round(x.h)}`).join(', ')}`);
    return `${r.length} targets at 44px or more`;
  });
  await check('Pagination', 'no part of the pagination is the accent orange', async () => {
    await go('/components/pagination/code');
    const bad = await main().locator('nav[data-component="Pagination"]').evaluateAll((els) => {
      const probe = document.createElement('span'); probe.style.color = 'var(--ds-action-accent)'; document.body.append(probe);
      const accent = getComputedStyle(probe).color; probe.remove();
      const out = []; for (const el of els) for (const n of el.querySelectorAll('*')) { const cs = getComputedStyle(n); if (accent && [cs.backgroundColor, cs.color, cs.borderColor].some((c) => c === accent)) out.push(n.tagName); }
      return out;
    });
    expect(bad.length === 0, `${bad.length} orange parts`);
    return 'no orange';
  });
}
