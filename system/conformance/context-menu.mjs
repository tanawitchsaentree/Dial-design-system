// Behaviour checks for ContextMenu (Menu's panel opened at a point), run by tooling/kiln/conformance.mjs on the built book.
export default async function contextMenu({ check, expect, page, go, main, tokens }) {
  const px = (s) => parseFloat(s);
  const min = () => px(tokens?.['layout.touch']?.value ?? '44px');
  const area = () => main().locator('[data-component="ContextMenu"]').first();
  const panel = () => page.locator('[data-component="ContextMenuPanel"]:not([inert])');
  const gone = () => page.waitForFunction(() => !document.querySelector('[data-component="ContextMenuPanel"]'), null, { timeout: 3000 });
  const info = () => page.evaluate(() => {
    const m = document.querySelector('[data-component="ContextMenuPanel"]:not([inert])');
    if (!m) return null;
    const items = [...m.querySelectorAll('[role="menuitem"]')];
    const r = m.getBoundingClientRect();
    return {
      role: m.getAttribute('role'), name: m.getAttribute('aria-label'), count: items.length, x: r.left, y: r.top, w: r.width, h: r.height,
      onPanel: document.activeElement === m, active: items.indexOf(document.activeElement),
      minRow: Math.min(...items.map((i) => i.getBoundingClientRect().height)),
    };
  });
  const reset = async () => { await page.keyboard.press('Escape'); await page.mouse.click(1, 1).catch(() => {}); };

  await check('ContextMenu', 'a right-click opens a menu with its corner at the pointer, no row chosen, and the object sinks', async () => {
    await go('/components/context-menu/code');
    const box = await area().boundingBox();
    const at = { x: Math.round(box.width * 0.25), y: Math.round(box.height * 0.3) };
    await area().click({ button: 'right', position: at });
    await panel().first().waitFor();
    const o = await info();
    const dx = Math.abs(o.x - (box.x + at.x)), dy = Math.abs(o.y - (box.y + at.y));
    expect(o.role === 'menu' && o.name && o.count >= 3, `role ${o.role}, name "${o.name}", ${o.count} items`);
    expect(dx <= 2 && dy <= 2, `panel corner ${dx}px / ${dy}px from the pointer`);
    expect(o.onPanel && o.active === -1, `focus on panel ${o.onPanel}, row ${o.active}`);
    const open = await area().evaluate((el) => ({ open: el.hasAttribute('data-open'), shadow: getComputedStyle(el).boxShadow }));
    expect(open.open && open.shadow !== 'none', `data-open ${open.open}, box-shadow ${open.shadow}`);
    await page.keyboard.press('Escape');
    await gone();
    return `corner ${dx}/${dy}px from the point, ${o.count} items`;
  });

  await check('ContextMenu', 'the Context Menu key and Shift+F10 open it on the first action, rows are at least the touch target, and Escape returns focus', async () => {
    await go('/components/context-menu/code');
    for (const combo of ['ContextMenu', 'Shift+F10']) {
      await area().focus();
      await page.keyboard.press(combo);
      await panel().first().waitFor();
      const o = await info();
      expect(o.active === 0, `${combo}: focus on action ${o.active}`);
      expect(o.minRow >= min() - 0.5, `${combo}: shortest row ${o.minRow}px (min ${min()})`);
      await page.keyboard.press('Escape');
      await gone();
      const back = await area().evaluate((el) => document.activeElement === el);
      expect(back, `${combo}: focus back on the object ${back}`);
    }
    return 'both keys open on the first action; Escape returns focus';
  });

  await check('ContextMenu', 'arrows and Home/End move between actions, Enter closes it, and focus goes back to the object', async () => {
    await go('/components/context-menu/code');
    await area().focus();
    await page.keyboard.press('ContextMenu');
    await panel().first().waitFor();
    await page.keyboard.press('ArrowDown');
    const a = await info();
    await page.keyboard.press('End');
    const b = await info();
    await page.keyboard.press('Home');
    const c = await info();
    expect(a.active === 1 && b.active === b.count - 1 && c.active === 0, `arrow ${a.active}, End ${b.active}/${b.count}, Home ${c.active}`);
    await page.keyboard.press('Enter');
    await gone();
    const back = await area().evaluate((el) => document.activeElement === el);
    expect(back, `focus back on the object ${back}`);
    return `${b.count} actions walked`;
  });

  await check('ContextMenu', 'a press and hold with a finger opens it, and a finger that moves away does not', async () => {
    await go('/components/context-menu/code');
    const send = (type, x, y) => area().evaluate((el, a) => el.dispatchEvent(new PointerEvent(a.type, { pointerType: 'touch', isPrimary: true, pointerId: 7, bubbles: true, cancelable: true, clientX: a.x, clientY: a.y })), { type, x, y });
    const box = await area().boundingBox();
    const x = box.x + 30, y = box.y + 20;
    await send('pointerdown', x, y);
    await send('pointermove', x + 60, y + 60);
    await page.waitForTimeout(700);
    const moved = await info();
    expect(moved === null, 'a finger that moved 60px still opened the menu');
    await send('pointerup', x + 60, y + 60);
    await send('pointerdown', x, y);
    await page.waitForTimeout(700);
    const held = await info();
    expect(held && held.count >= 3, 'a held finger did not open the menu');
    const dx = Math.abs(held.x - x), dy = Math.abs(held.y - y);
    expect(dx <= 2 && dy <= 2, `panel corner ${dx}px / ${dy}px from the finger`);
    await send('pointerup', x, y);
    await reset();
    await gone();
    return `opened under the finger after 500ms; moving cancels`;
  });

  await check('ContextMenu', 'the panel stays whole on the screen when the pointer is near the edge, and nothing is orange', async () => {
    await go('/components/context-menu/code');
    const vp0 = page.viewportSize();
    await area().scrollIntoViewIfNeeded();
    // scroll so the object's lower edge sits 12px above the bottom of the window: the pointer is near the edge
    await page.evaluate(() => { const r = document.querySelector('main [data-component="ContextMenu"]').getBoundingClientRect(); window.scrollBy(0, r.bottom - window.innerHeight + 12); });
    const vb = await area().boundingBox();
    const cx = Math.round(vb.x + vb.width / 2), cy = Math.round(vb.y + vb.height - 6);
    const vp = page.viewportSize();
    await page.mouse.click(cx, cy, { button: 'right' });
    await panel().first().waitFor();
    const o = await info();
    expect(o.x >= 0 && o.y >= 0 && o.x + o.w <= vp.width + 0.5 && o.y + o.h <= vp.height + 0.5, `panel ${Math.round(o.x)},${Math.round(o.y)} ${Math.round(o.w)}×${Math.round(o.h)} in ${vp.width}×${vp.height}`);
    const bad = await page.evaluate(() => {
      const probe = document.createElement('span'); probe.style.color = 'var(--ds-action-accent)'; document.body.append(probe);
      const accent = getComputedStyle(probe).color; probe.remove();
      const out = [];
      for (const root of document.querySelectorAll('[data-component="ContextMenuPanel"]')) for (const n of [root, ...root.querySelectorAll('*')]) { const cs = getComputedStyle(n); if (accent && [cs.backgroundColor, cs.color, cs.borderColor].some((c) => c === accent)) out.push(n.tagName); }
      return out;
    });
    expect(bad.length === 0, `${bad.length} orange parts`);
    await page.keyboard.press('Escape');
    await gone();
    await page.setViewportSize(vp0);
    return 'on the screen, no orange';
  });
}
