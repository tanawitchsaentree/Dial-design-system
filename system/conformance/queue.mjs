// Behaviour checks for Queue (the up-next list of a player), run by tooling/kiln/conformance.mjs on the built book.
export default async function queue({ check, expect, page, go, main, tokens }) {
  const px = (s) => parseFloat(s);
  const ROUTE = '/components/queue/code';
  const q = () => main().locator('[data-component="Queue"]').first();
  const order = (root) => root.evaluate((el) => [...el.querySelectorAll(':scope > ol > li')].map((li) => li.dataset.id));
  const focusedId = () => page.evaluate(() => document.activeElement?.closest('li')?.dataset.id ?? null);

  await check('Queue', 'Alt with an arrow moves a row of the queue and focus stays on it', async () => {
    await go(ROUTE);
    const root = q();
    const o0 = await order(root);
    await root.locator('li > button').first().focus();
    await page.keyboard.press('Alt+ArrowDown');
    const o1 = await order(root);
    const f1 = await focusedId();
    await page.keyboard.press('Alt+ArrowDown');
    const o2 = await order(root);
    await page.keyboard.press('Alt+ArrowUp');
    const o3 = await order(root);
    expect(o1[1] === o0[0] && o1[0] === o0[1] && f1 === o0[0], `after Alt+Down ${o1.join(',')}, focus on ${f1}`);
    expect(o2[2] === o0[0] && o3[1] === o0[0], `then ${o2.join(',')} and ${o3.join(',')}`);
    return `${o0.join(',')} → ${o1.join(',')} → ${o2.join(',')} → ${o3.join(',')}`;
  });

  await check('Queue', 'a move is announced with the new place', async () => {
    await go(ROUTE);
    const root = q();
    await root.locator('li > button').first().focus();
    await page.keyboard.press('Alt+ArrowDown');
    const said = await root.locator('[role="status"]').textContent();
    expect(/moved to 2 of \d+/.test(said ?? ''), `status "${said}"`);
    return said;
  });

  await check('Queue', 'arrow keys move focus between rows and Home and End reach the ends', async () => {
    await go(ROUTE);
    const root = q();
    const o = await order(root);
    await root.locator('li > button').first().focus();
    await page.keyboard.press('ArrowDown'); const a = await focusedId();
    await page.keyboard.press('End'); const b = await focusedId();
    await page.keyboard.press('Home'); const c = await focusedId();
    expect(a === o[1] && b === o[o.length - 1] && c === o[0], `focus ${a}, ${b}, ${c}`);
    expect((await order(root)).join() === o.join(), 'plain arrows changed the order');
    return `${a} → ${b} → ${c}`;
  });

  await check('Queue', 'the row menu moves a track down and removes a track, with focus back on its key', async () => {
    await go(ROUTE);
    const root = q();
    const o0 = await order(root);
    const key = (i) => root.locator('li').nth(i).locator('[aria-haspopup="menu"]');
    await key(0).click();
    await page.getByRole('menuitem', { name: 'Move down' }).click();
    const o1 = await order(root);
    const f1 = await page.evaluate(() => ({ id: document.activeElement?.closest('li')?.dataset.id, menu: document.activeElement?.getAttribute('aria-haspopup') }));
    expect(o1[1] === o0[0] && f1.id === o0[0] && f1.menu === 'menu', `after Move down ${o1.join(',')}, focus ${JSON.stringify(f1)}`);
    await key(0).click();
    await page.getByRole('menuitem', { name: 'Remove from queue' }).click();
    const o2 = await order(root);
    expect(o2.length === o0.length - 1 && !o2.includes(o1[0]), `after Remove ${o2.join(',')}`);
    return `${o0.join(',')} → ${o1.join(',')} → ${o2.join(',')}`;
  });

  await check('Queue', 'Delete removes the focused track and focus goes to the next row', async () => {
    await go(ROUTE);
    const root = q();
    const o0 = await order(root);
    await root.locator('li > button').nth(1).focus();
    await page.keyboard.press('Delete');
    const o1 = await order(root);
    const f = await focusedId();
    const said = await root.locator('[role="status"]').textContent();
    expect(o1.length === o0.length - 1 && !o1.includes(o0[1]) && f === o0[2], `order ${o1.join(',')}, focus ${f}`);
    expect(/removed/.test(said ?? ''), `status "${said}"`);
    return `${o0[1]} removed, focus on ${f}`;
  });

  await check('Queue', 'dragging the printed handle moves a row, as an alternative to the keys', async () => {
    await go(ROUTE);
    const root = q();
    const o0 = await order(root);
    const h = await root.locator('li').first().locator(':scope > span:nth-child(2)').boundingBox();
    const last = await root.locator('li').nth(2).boundingBox();
    await page.mouse.move(h.x + h.width / 2, h.y + h.height / 2);
    await page.mouse.down();
    await page.mouse.move(h.x + h.width / 2, last.y + last.height * 0.8, { steps: 6 });
    const line = await root.locator('li[data-drop]').count();
    await page.mouse.up();
    const o1 = await order(root);
    expect(line === 1, `${line} drop lines while dragging`);
    expect(o1[2] === o0[0] && o1[0] === o0[1], `after the drag ${o1.join(',')}`);
    return `${o0.join(',')} → ${o1.join(',')}`;
  });

  await check('Queue', 'the playing row is marked by an ink index mark and the word Playing, never the accent', async () => {
    await go(ROUTE);
    const r = await q().evaluate((el) => {
      const probe = document.createElement('span'); probe.style.color = 'var(--ds-action-accent)'; document.body.append(probe);
      const accent = getComputedStyle(probe).color; probe.remove();
      const row = el.querySelector('li > button[aria-current="true"]');
      const mark = row?.closest('li').querySelector(':scope > span:first-child');
      const other = el.querySelector('li > button:not([aria-current])')?.closest('li').querySelector(':scope > span:first-child');
      const orange = [...el.querySelectorAll('*')].filter((n) => getComputedStyle(n).backgroundColor === accent || getComputedStyle(n).color === accent).length;
      return { word: row?.textContent ?? '', mark: mark ? getComputedStyle(mark).backgroundColor : '', other: other ? getComputedStyle(other).backgroundColor : '', count: el.querySelectorAll('[aria-current="true"]').length, orange };
    });
    expect(r.count === 1 && /Playing/.test(r.word), `${r.count} current rows, "${r.word}"`);
    expect(r.mark !== r.other && r.mark !== 'rgba(0, 0, 0, 0)', `mark ${r.mark}, other rows ${r.other}`);
    expect(r.orange === 0, `${r.orange} parts in the accent`);
    return `mark ${r.mark}`;
  });

  await check('Queue', 'rows and menu keys are at least the touch target', async () => {
    await go(ROUTE);
    const min = px(tokens['layout.touch']?.value ?? '44px');
    const s = await q().evaluate((el) => [...el.querySelectorAll('li > button, [aria-haspopup="menu"]')].map((b) => { const r = b.getBoundingClientRect(); return Math.min(r.width, r.height); }));
    expect(s.length > 0 && s.every((x) => x >= min - 0.5), `sizes ${s.join(', ')}`);
    return `${Math.min(...s)}px and up`;
  });
}
