// Behaviour checks for KanbanBoard (columns of cards moved by keys, a menu or a pointer drag), run by tooling/kiln/conformance.mjs on the built book.
// UNVERIFIED here: screen reader announcements of the polite status, touch dragging on a real phone, auto-scroll while dragging
// near the edge of a wide board (not built), and forced-colours rendering (need a real reader, a device and a forced-colours run).
export default async function kanbanBoard({ check, expect, page, go, main }) {
  const root = () => main().locator('[data-component="KanbanBoard"]').first();
  const layout = () => root().evaluate((r) => [...r.querySelectorAll('[data-kb-column]')].map((c) => `${c.dataset.kbColumn}:${[...c.querySelectorAll('[data-card-id]')].map((x) => x.dataset.cardId).join(',')}`));
  const status = () => root().locator('[role="status"]').first().textContent();
  const card = (id) => root().locator(`[data-card-id="${id}"]`);
  const firstCardId = () => root().locator('[data-card-id]').first().getAttribute('data-card-id');

  await check('KanbanBoard', 'the board is a group of named columns, and every card has a name, a hint and a Move key', async () => {
    await go('/components/kanban-board/code');
    const r = await root().evaluate((el) => {
      const cols = [...el.querySelectorAll('[data-kb-column]')];
      const cards = [...el.querySelectorAll('[data-card-id]')];
      return {
        role: el.getAttribute('role'), name: el.getAttribute('aria-label'), cols: cols.length,
        named: cols.every((c) => !!document.getElementById(c.getAttribute('aria-labelledby'))?.textContent.trim()),
        cards: cards.length,
        cardNamed: cards.every((c) => !!document.getElementById(c.getAttribute('aria-labelledby'))?.textContent.trim() && !!document.getElementById(c.getAttribute('aria-describedby'))?.textContent.trim()),
        keys: cards.every((c) => !!c.querySelector('button[aria-label]')),
        lists: [...el.querySelectorAll('ul')].every((u) => u.getAttribute('role') === 'list' && u.querySelectorAll(':scope > li').length > 0),
      };
    });
    expect(r.role === 'group' && !!r.name, `role ${r.role}, name ${r.name}`);
    expect(r.cols >= 3 && r.named, `${r.cols} columns, all named ${r.named}`);
    expect(r.cards >= 3 && r.cardNamed && r.keys && r.lists, `${r.cards} cards, named and hinted ${r.cardNamed}, Move keys ${r.keys}, lists ${r.lists}`);
    return `${r.cols} named columns, ${r.cards} cards each with a name, a hint and a Move key`;
  });

  await check('KanbanBoard', 'Alt with the arrow keys moves a focused card, announces it politely and keeps the focus on it', async () => {
    await go('/components/kanban-board/code');
    const id = await firstCardId();
    const before = await layout();
    await card(id).focus();
    await page.keyboard.press('Alt+ArrowRight');
    const after = await layout();
    const says = await status();
    const focused = await page.evaluate(() => document.activeElement?.getAttribute('data-card-id'));
    expect(JSON.stringify(before) !== JSON.stringify(after), `layout did not change: ${after}`);
    expect(!after[0].split(':')[1].split(',').includes(id) && after[1].split(':')[1].split(',').includes(id), `card ${id} not in column 2: ${after}`);
    expect(/moved to/.test(says ?? '') && /position \d+ of \d+/.test(says ?? ''), `status "${says}"`);
    expect(focused === id, `focus is on ${focused}, expected ${id}`);
    await page.keyboard.press('Alt+ArrowLeft');
    const back = await layout();
    expect(back[0].split(':')[1].split(',').includes(id), `Alt+Left did not bring ${id} back: ${back}`);
    return `Alt+Right then Alt+Left moved ${id} across and back, announced, focus kept`;
  });

  await check('KanbanBoard', 'Alt with up or down changes position, the plain arrows walk the cards, and the end of the column is announced', async () => {
    await go('/components/kanban-board/code');
    const first = root().locator('[data-kb-column]').first();
    const ids = await first.locator('[data-card-id]').evaluateAll((e) => e.map((x) => x.dataset.cardId));
    expect(ids.length >= 2, `first column holds ${ids.length} cards`);
    await card(ids[0]).focus();
    await page.keyboard.press('Alt+ArrowUp');
    const top = await status();
    expect(/further|cannot/i.test(top ?? ''), `status at the top edge "${top}"`);
    await page.keyboard.press('ArrowDown');
    const onSecond = await page.evaluate(() => document.activeElement?.getAttribute('data-card-id'));
    expect(onSecond === ids[1], `ArrowDown focused ${onSecond}, expected ${ids[1]}`);
    await page.keyboard.press('Alt+ArrowUp');
    const order = await first.locator('[data-card-id]').evaluateAll((e) => e.map((x) => x.dataset.cardId));
    expect(order[0] === ids[1] && order[1] === ids[0], `order after Alt+Up ${order}, was ${ids}`);
    return 'plain Down walks to the next card; Alt+Up swapped the two; the edge is announced';
  });

  await check('KanbanBoard', 'the Move key opens a choice of the other columns and moves the card to the end of the one chosen', async () => {
    await go('/components/kanban-board/code');
    const id = await firstCardId();
    const key = card(id).locator('button[aria-label]').first();
    const name = await key.getAttribute('aria-label');
    await key.click();
    await page.waitForTimeout(500);
    const items = await page.getByRole('menuitem').allTextContents();
    const cols = await root().locator('[data-kb-column]').count();
    expect(items.length === cols - 1 && items.every((t) => /\S/.test(t)), `menu rows ${JSON.stringify(items)} for ${cols} columns, key "${name}"`);
    await page.getByRole('menuitem').first().click();
    await page.waitForTimeout(500);
    const after = await layout();
    expect(!after[0].split(':')[1].split(',').includes(id) && after[1].split(':')[1].split(',').pop() === id, `card ${id} not at the end of column 2: ${after}`);
    const focused = await page.evaluate(() => document.activeElement?.getAttribute('data-card-id'));
    expect(focused === id, `focus is on ${focused}, expected ${id}`);
    return `"${name}" listed ${items.length} columns and moved the card to the end of the first`;
  });

  await check('KanbanBoard', 'dragging the grip carries a card to another column with a drop line, and Escape lets go', async () => {
    await go('/components/kanban-board/code');
    await root().scrollIntoViewIfNeeded();
    const id = await firstCardId();
    const before = await layout();
    const grip = card(id).locator('span[aria-hidden="true"]').first();
    const g = await grip.boundingBox();
    const target = await root().locator('[data-kb-column]').nth(1).locator('[data-card-id]').first().boundingBox();
    expect(!!g && !!target, 'grip or target card has no box');
    await page.mouse.move(g.x + g.width / 2, g.y + g.height / 2);
    await page.mouse.down();
    await page.mouse.move(g.x + g.width / 2 + 40, g.y + g.height / 2 + 10, { steps: 4 });
    await page.mouse.move(target.x + 20, target.y + 2, { steps: 8 });
    const mid = await root().evaluate((r) => ({ dragging: r.querySelectorAll('[data-dragging="true"]').length, drops: [...r.querySelectorAll('[data-drop]')].map((x) => x.dataset.drop) }));
    const shifted = await card(id).evaluate((el) => getComputedStyle(el).transform);
    expect(mid.dragging === 1 && mid.drops.length === 1, `while carried: ${JSON.stringify(mid)}`);
    expect(shifted !== 'none', `carried card has no transform (${shifted})`);
    await page.keyboard.press('Escape');
    await page.mouse.up();
    const cancelled = await layout();
    expect(JSON.stringify(cancelled) === JSON.stringify(before), `Escape changed the layout: ${cancelled}`);
    // second pass: drop for real
    const g2 = await grip.boundingBox();
    await page.mouse.move(g2.x + g2.width / 2, g2.y + g2.height / 2);
    await page.mouse.down();
    await page.mouse.move(g2.x + g2.width / 2 + 40, g2.y + g2.height / 2 + 10, { steps: 4 });
    const t2 = await root().locator('[data-kb-column]').nth(1).locator('[data-card-id]').first().boundingBox();
    await page.mouse.move(t2.x + 20, t2.y + 2, { steps: 8 });
    await page.mouse.up();
    const dropped = await layout();
    expect(dropped[1].split(':')[1].split(',')[0] === id, `card ${id} is not first in column 2 after the drop: ${dropped}`);
    expect(/moved to/.test((await status()) ?? ''), 'no status after the drop');
    return 'carried card transformed, one drop line shown, Escape kept the layout, a drop moved it and announced';
  });

  await check('KanbanBoard', 'a column past its limit shows a warning mark, the figures and a spoken count', async () => {
    await go('/components/kanban-board/code');
    const r = await root().evaluate((el) => {
      const over = [...el.querySelectorAll('[data-over-limit="true"]')];
      return over.map((w) => ({ text: w.textContent, shown: w.querySelector('[aria-hidden="true"]:not(:last-child)')?.textContent ?? '', mark: !!w.querySelector('svg, [data-on], [aria-hidden="true"] *'), weight: getComputedStyle(w).fontWeight }));
    });
    expect(r.length >= 1, 'no column is past its limit in the first board');
    expect(r.every((x) => /\d+\/\d+/.test(x.text) && /over the limit/.test(x.text) && x.mark), `windows ${JSON.stringify(r)}`);
    expect(r.every((x) => Number(x.weight) >= 500), `weights ${r.map((x) => x.weight)}`);
    return `${r.length} window(s) with figures, a mark, the words "over the limit" and medium weight`;
  });

  await check('KanbanBoard', 'the grip and the Move key are at least the touch target, the columns keep their width, and nothing is orange', async () => {
    await go('/components/kanban-board/code');
    const r = await root().evaluate((el) => {
      const probe = document.createElement('span'); probe.style.color = 'var(--ds-action-accent)'; document.body.append(probe);
      const accent = getComputedStyle(probe).color; probe.remove();
      const card = el.querySelector('[data-card-id]');
      const key = card.querySelector('button').getBoundingClientRect();
      const grip = card.querySelector('span[aria-hidden="true"]').getBoundingClientRect();
      const orange = [];
      for (const n of el.querySelectorAll('*')) { const cs = getComputedStyle(n); if (accent && [cs.backgroundColor, cs.color, cs.borderColor].some((c) => c === accent)) orange.push(n.tagName); }
      return { key: [key.width, key.height], grip: [grip.width, grip.height], orange: orange.length, widths: [...el.querySelectorAll('[data-kb-column]')].map((c) => Math.round(c.getBoundingClientRect().width)) };
    });
    expect(r.key.every((v) => v >= 43.5) && r.grip.every((v) => v >= 43.5), `key ${r.key}, grip ${r.grip}`);
    expect(r.orange === 0, `${r.orange} orange parts`);
    expect(new Set(r.widths).size === 1, `column widths ${r.widths}`);
    await card(await firstCardId()).focus();
    await page.keyboard.press('Alt+ArrowRight');
    const after = await root().evaluate((el) => [...el.querySelectorAll('[data-kb-column]')].map((c) => Math.round(c.getBoundingClientRect().width)));
    expect(JSON.stringify(after) === JSON.stringify(r.widths), `widths changed after a move: ${r.widths} to ${after}`);
    return `key ${r.key.join('x')}, grip ${r.grip.join('x')}, widths ${after.join('/')} unchanged by a move, no orange`;
  });
}
