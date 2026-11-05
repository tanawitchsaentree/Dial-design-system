// Behaviour checks for Table (flat rows with a seam, sortable headers, a scroll region), run by tooling/kiln/conformance.mjs.
export default async function table({ check, expect, go, main, page }) {
  await check('Table', 'every column has a header with scope and a sorted column is announced with a chevron', async () => {
    await go('/components/table/code');
    const r = await main().locator('table[data-component="Table"]').first().evaluate((t) => {
      const ths = [...t.querySelectorAll('thead th')];
      const sorted = ths.filter((h) => ['ascending', 'descending'].includes(h.getAttribute('aria-sort')));
      return {
        heads: ths.length, scoped: ths.filter((h) => h.getAttribute('scope') === 'col').length,
        sorted: sorted.length, marks: sorted.filter((h) => h.querySelector('svg')).length,
        caption: !!t.querySelector('caption')?.textContent.trim(), rows: t.querySelectorAll('tbody tr').length,
      };
    });
    expect(r.heads >= 3 && r.scoped === r.heads, `${r.scoped} of ${r.heads} headers have scope="col"`);
    expect(r.caption, 'the table has no caption');
    expect(r.rows >= 3, `${r.rows} body rows (need 3)`);
    expect(r.sorted === 1 && r.marks === 1, `${r.sorted} sorted columns, ${r.marks} with a chevron (need 1 and 1)`);
    return `${r.heads} headers with scope, 1 sorted column with a chevron`;
  });
  await check('Table', 'a sort key is at least the touch target and presses with the keyboard', async () => {
    await go('/components/table/code');
    const t = main().locator('table[data-component="Table"]').first();
    const keys = t.locator('thead th button');
    expect((await keys.count()) >= 2, 'fewer than two sort keys');
    const box = await keys.first().boundingBox();
    expect(box && box.height >= 43.5, `sort key is ${box && box.height}px tall`);
    await keys.first().focus();
    const ring = await keys.first().evaluate((b) => getComputedStyle(b).outlineStyle);
    expect(ring !== 'none', 'no focus ring on the sort key');
    await keys.first().evaluate((b) => { window.__tableClicks = 0; b.addEventListener('click', () => { window.__tableClicks++; }); });
    await page.keyboard.press('Enter');
    await page.keyboard.press('Space');
    const clicks = await page.evaluate(() => window.__tableClicks);
    expect(clicks === 2, `Enter and Space gave ${clicks} presses (need 2)`);
    return `sort key ${Math.round(box.height)}px tall with a focus ring, Enter and Space press it`;
  });
  await check('Table', 'numbers align to the end edge in tabular figures and the first column starts on the inset line', async () => {
    await go('/components/table/code');
    const r = await main().locator('table[data-component="Table"]').first().evaluate((t) => {
      const nums = [...t.querySelectorAll('tbody td[data-numeric]')].map((c) => ({ a: getComputedStyle(c).textAlign, f: getComputedStyle(c).fontVariantNumeric, r: Math.round(c.getBoundingClientRect().right) }));
      const first = t.querySelector('tbody td');
      return { nums, pad: getComputedStyle(first).paddingInlineStart };
    });
    expect(r.nums.length >= 3, `${r.nums.length} numeric cells`);
    expect(r.nums.every((n) => /end|right/.test(n.a) && /tabular/.test(n.f)), `alignment ${r.nums.map((n) => n.a + '/' + n.f).join(', ')}`);
    expect(new Set(r.nums.map((n) => n.r)).size === 1, `numeric cells end at ${r.nums.map((n) => n.r).join(', ')}`);
    expect(parseFloat(r.pad) === 0, `first cell inline padding ${r.pad}`);
    return `${r.nums.length} numeric cells end-aligned in tabular figures`;
  });
  await check('Table', 'columns wider than the unit make the scroll region a named Tab stop, and not otherwise', async () => {
    await go('/components/table/code');
    const wrap = main().locator('table[data-component="Table"]').first().locator('xpath=..');
    const wide = await wrap.evaluate((w) => ({ tab: w.getAttribute('tabindex'), role: w.getAttribute('role') }));
    expect(wide.tab === null, `a table that fits has tabindex ${wide.tab}`);
    await wrap.evaluate((w) => { w.style.inlineSize = 'var(--ds-control-menu-min)'; w.querySelector('table').style.minInlineSize = 'calc(var(--ds-control-menu-min) * 2)'; });
    await page.waitForTimeout(400);
    const narrow = await wrap.evaluate((w) => ({ tab: w.getAttribute('tabindex'), role: w.getAttribute('role'), name: w.getAttribute('aria-labelledby') || w.getAttribute('aria-label') }));
    expect(narrow.tab === '0' && narrow.role === 'region', `overflowing region has tabindex ${narrow.tab} and role ${narrow.role}`);
    expect(!!narrow.name, 'the scroll region has no name');
    return 'fits: no stop; overflowing: tabindex 0, role region, named';
  });
  await check('Table', 'no part of the table is the accent orange', async () => {
    await go('/components/table/code');
    const bad = await main().locator('table[data-component="Table"]').evaluateAll((els) => {
      const probe = document.createElement('span'); probe.style.color = 'var(--ds-action-accent)'; document.body.append(probe);
      const accent = getComputedStyle(probe).color; probe.remove();
      const out = []; for (const el of els) for (const n of el.querySelectorAll('*')) { const cs = getComputedStyle(n); if (accent && [cs.backgroundColor, cs.color, cs.borderColor].some((c) => c === accent)) out.push(n.tagName); }
      return out;
    });
    expect(bad.length === 0, `${bad.length} orange parts`);
    return 'no orange';
  });
}
