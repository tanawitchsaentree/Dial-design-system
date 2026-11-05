// Behaviour checks for VirtualList (a windowed listbox of List rows), run by tooling/kiln/conformance.mjs.
export default async function virtualList({ page, check, expect, go, main }) {
  const list = () => main().locator('[data-component="VirtualList"]').first();
  const box = () => list().locator('[role="listbox"]').first();
  const active = () => box().evaluate((el) => {
    const id = el.getAttribute('aria-activedescendant');
    const row = id ? document.getElementById(id) : null;
    return row ? { pos: Number(row.getAttribute('aria-posinset')), disabled: row.getAttribute('aria-disabled') === 'true' } : null;
  });

  await check('VirtualList', 'only the rows in view are in the page, and each reports its place in the whole', async () => {
    await go('/components/virtual-list/code');
    const r = await box().evaluate((el) => {
      const rows = [...el.querySelectorAll('[role="option"]')];
      return {
        label: el.getAttribute('aria-label'), n: rows.length,
        size: rows.every((o) => o.getAttribute('aria-setsize') === rows[0].getAttribute('aria-setsize')) ? Number(rows[0].getAttribute('aria-setsize')) : -1,
        pos: rows.map((o) => Number(o.getAttribute('aria-posinset'))),
      };
    });
    expect(!!r.label, 'the listbox has no accessible name');
    expect(r.size >= 1000, `aria-setsize is ${r.size}`);
    expect(r.n >= 3 && r.n < 60, `${r.n} rows in the page for ${r.size}`);
    expect(r.pos.every((p, i) => i === 0 || p === r.pos[i - 1] + 1), `positions ${r.pos.slice(0, 6).join(',')} are not in order`);
    return `${r.n} of ${r.size} rows in the page`;
  });

  await check('VirtualList', 'every row is the same fixed height, at least the touch target, and the scroll length is the whole list', async () => {
    await go('/components/virtual-list/code');
    const r = await box().evaluate((el) => {
      const rows = [...el.querySelectorAll('[role="option"]')];
      const hs = rows.map((o) => o.getBoundingClientRect().height);
      const tops = rows.map((o) => o.getBoundingClientRect().top);
      return { hs, step: tops.length > 1 ? tops[1] - tops[0] : 0, total: el.scrollHeight, size: Number(rows[0].getAttribute('aria-setsize')) };
    });
    expect(r.hs.length > 0 && r.hs.every((h) => h >= 43.5 && Math.abs(h - r.hs[0]) < 0.6), `row heights ${r.hs.slice(0, 4).join(', ')}`);
    expect(r.step > r.hs[0] && Math.abs(r.total - r.size * r.step) < r.step * 2, `scroll length ${r.total} for ${r.size} rows of step ${r.step}`);
    return `rows ${r.hs[0]}px, scroll length ${Math.round(r.total)}px`;
  });

  await check('VirtualList', 'the arrow keys, Page and Home and End move the active row through a long list', async () => {
    await go('/components/virtual-list/code');
    await box().focus();
    await page.waitForTimeout(150);
    const start = await active();
    expect(start !== null, 'focus gave no active row');
    await page.keyboard.press('ArrowDown');
    await page.waitForTimeout(100);
    const down = await active();
    expect(down && down.pos === start.pos + 1, `ArrowDown went from ${start.pos} to ${down && down.pos}`);
    await page.keyboard.press('ArrowDown');
    await page.waitForTimeout(100);
    const skip = await active();
    expect(skip && !skip.disabled && skip.pos > down.pos + 1, `ArrowDown did not step over the disabled row (${down.pos} to ${skip && skip.pos})`);
    await page.keyboard.press('PageDown');
    await page.waitForTimeout(100);
    const pg = await active();
    expect(pg && pg.pos >= skip.pos + 3, `PageDown moved ${skip.pos} to ${pg && pg.pos}`);
    await page.keyboard.press('End');
    await page.waitForTimeout(150);
    const end = await active();
    const size = await box().evaluate((el) => Number(el.querySelector('[role="option"]').getAttribute('aria-setsize')));
    expect(end && end.pos === size, `End landed on ${end && end.pos} of ${size}`);
    const seen = await box().evaluate((el) => {
      const id = el.getAttribute('aria-activedescendant');
      const row = document.getElementById(id);
      const a = row.getBoundingClientRect(); const b = el.getBoundingClientRect();
      return a.top >= b.top - 1 && a.bottom <= b.bottom + 1;
    });
    expect(seen, 'the last row is active but outside the window');
    await page.keyboard.press('Home');
    await page.waitForTimeout(150);
    const home = await active();
    expect(home && home.pos === 1, `Home landed on ${home && home.pos}`);
    return 'ArrowDown, skip disabled, PageDown, End and Home';
  });

  await check('VirtualList', 'Enter chooses the active row and reports its index', async () => {
    await go('/components/virtual-list/code');
    await box().focus();
    await page.waitForTimeout(150);
    await page.keyboard.press('End');
    await page.waitForTimeout(150);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(150);
    const r = await box().evaluate((el) => {
      const sel = [...el.querySelectorAll('[role="option"][aria-selected="true"]')];
      return { n: sel.length, pos: sel.length ? Number(sel[0].getAttribute('aria-posinset')) : 0, size: Number(el.querySelector('[role="option"]').getAttribute('aria-setsize')) };
    });
    expect(r.n === 1 && r.pos === r.size, `${r.n} chosen rows, at ${r.pos} of ${r.size}`);
    return `chose row ${r.pos}`;
  });

  await check('VirtualList', 'no part of the list is the accent orange', async () => {
    await go('/components/virtual-list/code');
    const bad = await list().evaluate((el) => {
      const probe = document.createElement('span'); probe.style.color = 'var(--ds-action-accent)'; document.body.append(probe);
      const accent = getComputedStyle(probe).color; probe.remove();
      const out = []; for (const n of [el, ...el.querySelectorAll('*')]) { const cs = getComputedStyle(n); if (accent && [cs.backgroundColor, cs.color, cs.borderColor].some((c) => c === accent)) out.push(n.tagName); }
      return out;
    });
    expect(bad.length === 0, `${bad.length} orange parts`);
    return 'no orange';
  });
}
