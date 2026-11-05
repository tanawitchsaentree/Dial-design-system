// Behaviour checks for DataGrid (a Table you walk by cell), run by tooling/kiln/conformance.mjs.
const GRID = 'table[data-component="DataGrid"]';

export default async function dataGrid({ check, expect, go, main, page }) {
  const open = async () => {
    await go('/components/data-grid/code');
    return main().locator(GRID).first();
  };
  const at = () => page.evaluate(() => { const a = document.activeElement; return a ? `${a.dataset.r}:${a.dataset.c}` : 'none'; });
  const press = async (key) => { await page.keyboard.press(key); };

  await check('DataGrid', 'the grid has a single Tab stop', async () => {
    const grid = await open();
    const r = await grid.evaluate((t) => ({ stops: t.querySelectorAll('[tabindex="0"]').length, boxes: [...t.querySelectorAll('input[type="checkbox"]')].map((i) => i.tabIndex) }));
    expect(r.stops === 1, `${r.stops} cells with tabindex 0 (need exactly 1)`);
    expect(r.boxes.length > 0 && r.boxes.every((n) => n === -1), `checkbox tab indexes ${r.boxes.join(',')}`);
    return `1 Tab stop, ${r.boxes.length} checkboxes out of the Tab order`;
  });

  await check('DataGrid', 'arrows, Home, End and Page keys move the focused cell', async () => {
    const grid = await open();
    await grid.locator('td[data-r="1"][data-c="1"]').focus();
    await press('ArrowRight');
    expect((await at()) === '1:2', `ArrowRight went to ${await at()}`);
    await press('ArrowDown');
    expect((await at()) === '2:2', `ArrowDown went to ${await at()}`);
    await press('ArrowLeft');
    await press('Home');
    expect((await at()) === '2:0', `Home went to ${await at()}`);
    await press('End');
    const last = await grid.evaluate((t) => String(Math.max(...[...t.querySelectorAll('[data-c]')].map((c) => Number(c.dataset.c)))));
    expect((await at()) === `2:${last}`, `End went to ${await at()} (last column ${last})`);
    await press('PageDown');
    const rows = await grid.evaluate((t) => String(Math.max(...[...t.querySelectorAll('[data-r]')].map((c) => Number(c.dataset.r)))));
    const afterPage = Number((await at()).split(':')[0]);
    expect(afterPage > 2 && afterPage <= Number(rows), `PageDown went to row ${afterPage}`);
    await page.keyboard.press('Control+Home');
    expect((await at()) === '0:0', `Ctrl+Home went to ${await at()}`);
    await press('ArrowUp');
    expect((await at()) === '0:0', `ArrowUp off the header moved to ${await at()}`);
    return 'moved across, down, to row ends, by page and to the corner';
  });

  await check('DataGrid', 'Enter sorts a header and Space marks a row', async () => {
    const grid = await open();
    const head = grid.locator('th[data-r="0"][data-c="1"]');
    const firstText = () => grid.locator('tbody tr').first().locator('td').nth(1).innerText();
    await head.focus();
    await press('Enter');
    expect((await head.getAttribute('aria-sort')) === 'ascending', `after one Enter: ${await head.getAttribute('aria-sort')}`);
    const asc = await firstText();
    await press('Enter');
    expect((await head.getAttribute('aria-sort')) === 'descending', `after two Enters: ${await head.getAttribute('aria-sort')}`);
    const desc = await firstText();
    expect(asc !== desc && asc.localeCompare(desc) < 0, `first row ascending "${asc}", descending "${desc}"`);
    await press('Enter');
    expect((await head.getAttribute('aria-sort')) === 'none', `after three Enters: ${await head.getAttribute('aria-sort')}`);
    const cell = grid.locator('td[data-r="1"][data-c="0"]');
    await cell.focus();
    await press('Space');
    const row = grid.locator('tbody tr').first();
    expect((await row.getAttribute('aria-selected')) === 'true', 'Space on the select cell did not mark the row');
    expect(await row.locator('input[type="checkbox"]').isChecked(), 'the checkbox is not ticked');
    await grid.locator('th[data-r="0"][data-c="0"]').focus();
    await press('Space');
    const all = await grid.evaluate((t) => [...t.querySelectorAll('tbody tr')].every((r) => r.getAttribute('aria-selected') === 'true'));
    expect(all, 'Space on the header select cell did not mark every row');
    return 'sorted ascending, descending, none; marked one row and then all rows';
  });

  await check('DataGrid', 'the header stays in view and every cell is at least the touch target', async () => {
    const grid = await open();
    const r = await grid.evaluate(async (t) => {
      const box = t.parentElement;
      box.scrollTop = box.scrollHeight;
      await new Promise((res) => requestAnimationFrame(res));
      const head = t.querySelector('th[data-r="0"]').getBoundingClientRect();
      const top = box.getBoundingClientRect();
      const cells = [...t.querySelectorAll('td[data-r]')].map((c) => c.getBoundingClientRect().height);
      return { scrolls: box.scrollHeight > box.clientHeight, gap: Math.abs(head.top - top.top), min: Math.min(...cells) };
    });
    expect(r.scrolls, 'the window does not scroll');
    expect(r.gap <= 1.5, `header is ${r.gap}px from the top of the window after scrolling`);
    expect(r.min >= 43.5, `shortest cell is ${r.min}px`);
    return `header held at the top, shortest cell ${Math.round(r.min)}px`;
  });

  await check('DataGrid', 'no part of the grid is the accent orange', async () => {
    await open();
    const bad = await main().locator(GRID).evaluateAll((els) => {
      const probe = document.createElement('span'); probe.style.color = 'var(--ds-action-accent)'; document.body.append(probe);
      const accent = getComputedStyle(probe).color; probe.remove();
      const out = []; for (const el of els) for (const n of el.querySelectorAll('*')) { const cs = getComputedStyle(n); if (accent && [cs.backgroundColor, cs.color, cs.borderColor].some((c) => c === accent)) out.push(n.tagName); }
      return out;
    });
    expect(bad.length === 0, `${bad.length} orange parts`);
    return 'no orange';
  });
}
