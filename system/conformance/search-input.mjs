// Behaviour checks for SearchInput (the Input well with a search mark and a Clear key), run by tooling/kiln/conformance.mjs.
export default async function searchInput({ check, expect, page, go, main }) {
  const root = () => main().locator('[data-component="SearchInput"]').first();
  const field = () => root().locator('input[type="search"]');
  const key = () => root().locator('button');
  await check('SearchInput', 'the Clear key shows with text, clears it on press and puts focus back in the field', async () => {
    await go('/components/search-input/code');
    const start = await field().inputValue();
    expect(start.length > 0, `the first SearchInput starts empty ("${start}")`);
    expect((await key().count()) === 1, `${await key().count()} Clear keys with text (need 1)`);
    await key().click();
    await page.waitForTimeout(500);
    const after = await field().inputValue();
    const keys = await key().count();
    const focused = await field().evaluate((el) => document.activeElement === el);
    expect(after === '' && keys === 0 && focused, `after Clear: text "${after}", ${keys} keys, field focused ${focused}`);
    return 'text cleared, key gone, focus in the field';
  });
  await check('SearchInput', 'Enter calls onSearch with the text and Escape clears it', async () => {
    await go('/components/search-input/code');
    await field().click();
    await page.keyboard.press('Enter');
    const searched = await field().getAttribute('data-searched');
    const text = await field().inputValue();
    expect(searched === text && text.length > 0, `Enter gave "${searched}" for text "${text}"`);
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);
    const cleared = await field().inputValue();
    expect(cleared === '', `Escape left "${cleared}"`);
    return 'Enter searched, Escape cleared';
  });
  await check('SearchInput', 'the Clear key is at least the touch target tall and is told by a word, not only a mark', async () => {
    await go('/components/search-input/code');
    const r = await key().evaluate((b) => { const box = b.getBoundingClientRect(); return { h: box.height, w: box.width, text: (b.textContent ?? '').trim() }; });
    expect(r.h >= 43.5 && r.w >= 43.5, `Clear key ${r.w}×${r.h}`);
    expect(r.text.length > 0, 'Clear key has no printed word');
    return `${r.w}×${r.h} "${r.text}"`;
  });
  await check('SearchInput', 'the results count is announced through a polite status and the field is a search field', async () => {
    await go('/components/search-input/code');
    const r = await root().evaluate((el) => {
      const s = el.querySelector('[role="status"]');
      return { live: s?.getAttribute('aria-live'), text: (s?.textContent ?? '').trim(), type: el.querySelector('input')?.getAttribute('type') };
    });
    expect(r.live === 'polite' && /\d/.test(r.text) && r.type === 'search', `status ${r.live} "${r.text}", input type ${r.type}`);
    return `"${r.text}" announced politely`;
  });
  await check('SearchInput', 'no part of the search field is the accent orange', async () => {
    await go('/components/search-input/code');
    const bad = await main().locator('[data-component="SearchInput"]').evaluateAll((els) => {
      const probe = document.createElement('span'); probe.style.color = 'var(--ds-action-accent)'; document.body.append(probe);
      const accent = getComputedStyle(probe).color; probe.remove();
      const out = []; for (const el of els) for (const n of el.querySelectorAll('*')) { const cs = getComputedStyle(n); if (accent && [cs.backgroundColor, cs.color, cs.borderColor].some((c) => c === accent)) out.push(n.tagName); }
      return out;
    });
    expect(bad.length === 0, `${bad.length} orange parts`);
    return 'no orange';
  });
}
