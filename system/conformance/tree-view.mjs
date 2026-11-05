// Behaviour checks for TreeView (nested items drawn as a schematic), run by tooling/kiln/conformance.mjs.
// The tree under test is the first one on the code tab that holds a disabled item (the Usage subject).
const TREE = 'ul[data-component="TreeView"]:has([aria-disabled="true"])';
export default async function treeView({ check, expect, go, main, page }) {
  const active = () => page.evaluate(() => document.activeElement?.getAttribute('data-value') ?? null);
  const focusItem = (value) => main().locator(`${TREE} >> li[data-value="${value}"]`).first().evaluate((el) => el.focus());

  await check('TreeView', 'the tree has the roles, levels, positions and open state a screen reader reads', async () => {
    await go('/components/tree-view/code');
    const r = await main().locator(TREE).first().evaluate((ul) => {
      const items = [...ul.querySelectorAll('[role="treeitem"]')];
      const kitchen = ul.querySelector('li[data-value="kitchen"]');
      const rooms = ul.querySelector('li[data-value="rooms"]');
      return {
        role: ul.getAttribute('role'), named: !!(ul.getAttribute('aria-label') || ul.getAttribute('aria-labelledby')), count: items.length,
        missing: items.filter((i) => !i.getAttribute('aria-level') || !i.getAttribute('aria-setsize') || !i.getAttribute('aria-posinset')).length,
        kitchen: kitchen && [kitchen.getAttribute('aria-level'), kitchen.getAttribute('aria-posinset'), kitchen.getAttribute('aria-setsize'), kitchen.getAttribute('aria-expanded')],
        rooms: rooms && [rooms.getAttribute('aria-level'), rooms.getAttribute('aria-expanded')],
        groups: ul.querySelectorAll('[role="group"]').length,
      };
    });
    expect(r.role === 'tree' && r.named, `role ${r.role}, named ${r.named}`);
    expect(r.count >= 4 && r.missing === 0, `${r.count} items, ${r.missing} without level, size or position`);
    expect(r.rooms?.[0] === '1' && r.rooms?.[1] === 'true', `Rooms level/expanded ${r.rooms}`);
    expect(r.kitchen?.[0] === '2' && r.kitchen?.[1] === '1' && Number(r.kitchen?.[2]) >= 3 && r.kitchen?.[3] === null, `Kitchen ${r.kitchen}`);
    expect(r.groups >= 1, 'children are in a group');
    return `${r.count} items, levels and positions set`;
  });

  await check('TreeView', 'exactly one item is in the tab order and Tab leaves the tree', async () => {
    await go('/components/tree-view/code');
    const n = await main().locator(TREE).first().evaluate((ul) => [...ul.querySelectorAll('[role="treeitem"]')].filter((i) => i.tabIndex === 0).length);
    expect(n === 1, `${n} items with tabindex 0 (need exactly 1)`);
    return 'one tab stop';
  });

  await check('TreeView', 'Up, Down, Right, Left, Home and End walk the visible items and skip a disabled one', async () => {
    await go('/components/tree-view/code');
    await focusItem('kitchen');
    await page.keyboard.press('ArrowDown');
    expect((await active()) === 'hall', `Down from Kitchen went to ${await active()}`);
    await page.keyboard.press('ArrowDown');
    expect((await active()) === 'garden', `Down from Hall went to ${await active()} (the disabled Away must be skipped)`);
    await page.keyboard.press('ArrowRight');
    const open = await main().locator(`${TREE} >> li[data-value="garden"]`).first().getAttribute('aria-expanded');
    expect(open === 'true', `Right on a closed branch left aria-expanded ${open}`);
    await page.keyboard.press('ArrowRight');
    expect((await active()) === 'shed', `Right on an open branch went to ${await active()}`);
    await page.keyboard.press('ArrowLeft');
    expect((await active()) === 'garden', `Left on a leaf went to ${await active()}`);
    await page.keyboard.press('ArrowLeft');
    const shut = await main().locator(`${TREE} >> li[data-value="garden"]`).first().getAttribute('aria-expanded');
    expect(shut === 'false', `Left on an open branch left aria-expanded ${shut}`);
    await page.keyboard.press('Home');
    expect((await active()) === 'rooms', `Home went to ${await active()}`);
    await page.keyboard.press('End');
    const last = await active();
    expect(last === 'devices', `End went to ${last} (Devices is the last visible item)`);
    await page.keyboard.press('ArrowUp');
    expect((await active()) === 'garden', `Up from Devices went to ${await active()}`);
    return 'arrows, Home and End move; disabled skipped';
  });

  await check('TreeView', 'Enter and Space choose the focused item and typing a letter jumps to a matching label', async () => {
    await go('/components/tree-view/code');
    await focusItem('rooms');
    await page.keyboard.press('h');
    expect((await active()) === 'hall', `typing h went to ${await active()}`);
    await page.keyboard.press('Enter');
    const a = await main().locator(`${TREE} >> li[data-value="hall"]`).first().getAttribute('aria-selected');
    expect(a === 'true', `Enter left aria-selected ${a}`);
    await page.keyboard.press('ArrowUp');
    await page.keyboard.press(' ');
    const [k, h] = await Promise.all(['kitchen', 'hall'].map((v) => main().locator(`${TREE} >> li[data-value="${v}"]`).first().getAttribute('aria-selected')));
    expect(k === 'true' && h === 'false', `after Space on Kitchen: Kitchen ${k}, Hall ${h} (one item chosen at a time)`);
    return 'Enter and Space choose; one at a time; type-ahead';
  });

  await check('TreeView', 'every row and chevron cell meets the touch target', async () => {
    await go('/components/tree-view/code');
    const r = await main().locator(TREE).first().evaluate((ul) => [...ul.querySelectorAll('[role="treeitem"]')].map((li) => { const row = li.firstElementChild; const t = row.firstElementChild.getBoundingClientRect(); return { h: row.getBoundingClientRect().height, tw: t.width, th: t.height }; }));
    expect(r.length > 0 && r.every((x) => x.h >= 43.5 && x.tw >= 43.5 && x.th >= 43.5), `rows ${r.map((x) => `${x.h}/${x.tw}×${x.th}`).join(', ')}`);
    return `${r.length} rows at least 44px`;
  });

  await check('TreeView', 'the chosen item is told by a box and weight, not by colour alone', async () => {
    await go('/components/tree-view/code');
    await focusItem('kitchen');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);
    const r = await main().locator(TREE).first().evaluate((ul) => {
      const read = (v) => { const l = ul.querySelector(`li[data-value="${v}"]`).firstElementChild.children[1]; const cs = getComputedStyle(l); const p = getComputedStyle(l.querySelector('[data-tree-text]')); return { border: cs.borderTopColor, width: cs.borderTopWidth, weight: Number(p.fontWeight) }; };
      return { on: read('kitchen'), off: read('hall') };
    });
    expect(r.on.border !== r.off.border && parseFloat(r.on.width) > 0, `box ${r.on.border} vs ${r.off.border}`);
    expect(r.on.weight > r.off.weight, `weight ${r.on.weight} vs ${r.off.weight}`);
    return 'box and weight differ';
  });

  await check('TreeView', 'a branch grows when it opens and leaves the page after it closes', async () => {
    await go('/components/tree-view/code');
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    try {
      const garden = main().locator(`${TREE} >> li[data-value="garden"]`).first();
      await garden.scrollIntoViewIfNeeded();
      const box = await garden.locator(':scope > div').first().boundingBox();
      await page.mouse.click(box.x, box.y + box.height / 2);
      await page.waitForTimeout(30);
      const early = await garden.locator(':scope > div + div').first().evaluate((p) => p.getBoundingClientRect().height);
      await page.waitForTimeout(600);
      const full = await garden.locator(':scope > div + div').first().evaluate((p) => p.getBoundingClientRect().height);
      expect(full > 0 && early < full, `panel height ${early} at 30ms, ${full} when settled`);
      await page.mouse.click(box.x, box.y + box.height / 2);
      await page.waitForTimeout(1200);
      const gone = await garden.locator(':scope > div + div').count();
      expect(gone === 0, `${gone} panels left after closing`);
    } finally {
      await page.emulateMedia({ reducedMotion: 'reduce' });
    }
    return 'grows on open, unmounts after close';
  });

  await check('TreeView', 'no part of the tree is the accent orange', async () => {
    await go('/components/tree-view/code');
    const bad = await main().locator('ul[data-component="TreeView"]').evaluateAll((els) => {
      const probe = document.createElement('span'); probe.style.color = 'var(--ds-action-accent)'; document.body.append(probe);
      const accent = getComputedStyle(probe).color; probe.remove();
      const out = []; for (const el of els) for (const n of el.querySelectorAll('*')) { const cs = getComputedStyle(n); if (accent && [cs.backgroundColor, cs.color, cs.borderColor].some((c) => c === accent)) out.push(n.tagName); }
      return out;
    });
    expect(bad.length === 0, `${bad.length} orange parts`);
    return 'no orange';
  });
}
