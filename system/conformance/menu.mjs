// Behaviour checks for Menu (a WAI-ARIA menu button), run by tooling/kiln/conformance.mjs on the built book.
export default async function menu({ check, expect, page, go, main, tokens }) {
  const px = (s) => parseFloat(s);
  const min = () => px(tokens['layout.touch']?.value ?? '44px');
  const key = (n = 0) => main().locator('[data-component="Menu"] [aria-haspopup="menu"]:not(:disabled)').nth(n);
  const state = (k) => k.evaluate((el) => {
    const m = document.getElementById(el.getAttribute('aria-controls') ?? '');
    const items = m ? [...m.querySelectorAll('[role="menuitem"]')] : [];
    return {
      open: el.getAttribute('aria-expanded') === 'true', visible: !!m && m.getBoundingClientRect().height > 0,
      active: items.indexOf(document.activeElement), count: items.length,
      labels: items.map((i) => i.textContent.trim()), onKey: document.activeElement === el,
    };
  });

  await check('Menu', 'the key is a menu button at least the touch target, and Tab shows its focus ring', async () => {
    await go('/components/menu/code');
    const k = key();
    await k.focus(); await page.keyboard.press('Shift+Tab'); await page.keyboard.press('Tab');
    const st = await k.evaluate((el) => {
      const r = el.getBoundingClientRect(), cs = getComputedStyle(el);
      return { focused: document.activeElement === el, pop: el.getAttribute('aria-haspopup'), name: el.getAttribute('aria-label') ?? el.textContent.trim(), w: r.width, h: r.height, ow: cs.outlineWidth, os: cs.outlineStyle };
    });
    expect(st.focused && st.pop === 'menu' && st.name, `focused ${st.focused}, aria-haspopup ${st.pop}, name "${st.name}"`);
    expect(st.w >= min() - 0.5 && st.h >= min() - 0.5, `key ${st.w}×${st.h}px (min ${min()})`);
    expect(st.os !== 'none' && px(st.ow) >= 2, `outline ${st.os} ${st.ow}`);
    return `"${st.name}", ${Math.round(st.w)}px`;
  });

  await check('Menu', 'Enter opens the menu with focus on the first action, and Escape closes it with focus back on the key', async () => {
    await go('/components/menu/code');
    const k = key();
    await k.focus(); await page.keyboard.press('Enter');
    const o = await state(k);
    expect(o.open && o.visible && o.active === 0, `expanded ${o.open}, visible ${o.visible}, focus on action ${o.active}`);
    await page.keyboard.press('Escape');
    const s = await state(k);
    expect(!s.open && !s.visible && s.onKey, `after Escape: expanded ${s.open}, visible ${s.visible}, focus on key ${s.onKey}`);
    return `${o.count} actions`;
  });

  await check('Menu', 'Up opens on the last action, and the arrows, Home and End move and wrap', async () => {
    await go('/components/menu/code');
    const k = key();
    await k.focus(); await page.keyboard.press('ArrowUp');
    const up = await state(k);
    await page.keyboard.press('ArrowDown'); const wrap = await state(k);
    await page.keyboard.press('End'); const e = await state(k);
    await page.keyboard.press('Home'); const h = await state(k);
    await page.keyboard.press('ArrowDown'); const d = await state(k);
    await page.keyboard.press('Escape');
    expect(up.active === up.count - 1 && wrap.active === 0 && e.active === e.count - 1 && h.active === 0 && d.active === 1, `Up ${up.active}, wrap ${wrap.active}, End ${e.active}, Home ${h.active}, Down ${d.active}`);
    return `${up.count} actions`;
  });

  await check('Menu', 'type-ahead moves to the action that starts with the typed letter', async () => {
    await go('/components/menu/code');
    const k = key();
    await k.focus(); await page.keyboard.press('Enter');
    const s0 = await state(k);
    const target = s0.labels.findIndex((l, i) => i > 0 && /^[a-z]/i.test(l) && s0.labels.findIndex((m) => m[0].toLowerCase() === l[0].toLowerCase()) === i);
    await page.keyboard.type(s0.labels[target][0].toLowerCase());
    const s = await state(k);
    await page.keyboard.press('Escape');
    expect(s.active === target, `typed "${s0.labels[target][0]}", focus on ${s.active} ("${s.labels[s.active]}")`);
    return `"${s0.labels[target][0]}" → ${s.labels[s.active]}`;
  });

  await check('Menu', 'Enter runs the action, closes the menu and returns focus to the key', async () => {
    await go('/components/menu/code');
    const demo = main().locator('[data-example-live]:has([aria-live]):has([data-component="Menu"])').first();
    const k = demo.locator('[aria-haspopup="menu"]').first();
    const live = demo.locator('[aria-live]').first();
    await k.focus(); await page.keyboard.press('ArrowDown'); await page.keyboard.press('ArrowDown');
    const o = await state(k);
    await page.keyboard.press('Enter');
    const s = await state(k);
    const said = await live.textContent().catch(() => '');
    expect(!s.open && s.onKey, `after Enter: expanded ${s.open}, focus on key ${s.onKey}`);
    expect(/move/i.test(said ?? ''), `the example did not hear the action (said "${said}")`);
    return `ran "${o.labels[o.active]}"`;
  });

  await check('Menu', 'a press outside closes the menu', async () => {
    await go('/components/menu/code');
    const k = key();
    await k.click(); const o = await state(k);
    expect(o.open && o.visible, `a click did not open the menu (expanded ${o.open})`);
    await page.mouse.click(2, 2); const s = await state(k);
    expect(!s.open && !s.visible, `after a press outside: expanded ${s.open}`);
    return 'closed';
  });

  await check('Menu', 'the destructive action is marked by a glyph and a word, never orange or colour alone', async () => {
    await go('/components/menu/code');
    const k = key();
    await k.focus(); await page.keyboard.press('Enter');
    const r = await k.evaluate((el) => {
      const m = document.getElementById(el.getAttribute('aria-controls'));
      const d = m.querySelector('[role="menuitem"][data-destructive]');
      const plain = m.querySelector('[role="menuitem"]:not([data-destructive])');
      const accent = getComputedStyle(document.documentElement).getPropertyValue('--ds-action-accent').trim();
      const probe = document.createElement('i'); probe.style.color = accent; document.body.append(probe); const orange = getComputedStyle(probe).color; probe.remove();
      const cs = getComputedStyle(d), glyph = d.querySelector('svg');
      return { word: d.textContent.trim(), glyph: !!glyph?.querySelector('rect, path'), fill: glyph ? getComputedStyle(glyph).fill : '', ink: cs.color === getComputedStyle(plain).color, orange: [cs.color, cs.backgroundColor, glyph ? getComputedStyle(glyph).fill : ''].includes(orange), last: d === m.querySelector('[role="menuitem"]:last-of-type') };
    });
    await page.keyboard.press('Escape');
    expect(r.word && r.glyph && r.ink, `word "${r.word}", glyph ${r.glyph}, same ink as the others ${r.ink}`);
    expect(!r.orange && r.last, `orange ${r.orange}, last ${r.last}`);
    return `"${r.word}" with a lamp in ${r.fill}`;
  });

  await check('Menu', 'every action row is at least the touch target tall and the panel at least as wide as its key', async () => {
    await go('/components/menu/code');
    const bad = [];
    const n = Math.min(await main().locator('[data-component="Menu"] [aria-haspopup="menu"]:not(:disabled)').count(), 6);
    for (let i = 0; i < n; i++) {
      const k = key(i);
      await k.scrollIntoViewIfNeeded(); await k.click();
      const r = await k.evaluate((el) => {
        const m = document.getElementById(el.getAttribute('aria-controls'));
        return { key: el.getBoundingClientRect().width, panel: m.getBoundingClientRect().width, rows: [...m.querySelectorAll('[role="menuitem"]')].map((x) => x.getBoundingClientRect().height) };
      });
      await page.keyboard.press('Escape');
      if (r.panel < r.key - 0.5 || r.rows.some((h) => h < min() - 0.5)) bad.push(`#${i}: panel ${r.panel}px for a ${r.key}px key, rows ${r.rows.join(', ')}`);
    }
    expect(!bad.length, bad.slice(0, 3).join(' | '));
    return `${n} menus`;
  });

  // R-002 (user, 2026-11-02) carried over from Select: no action word is ever cut at the panel's edge
  await check('Menu', 'every action word shows in full inside the open panel, on every menu on the page', async () => {
    const bad = []; let seen = 0;
    for (const route of ['/components/menu/code', '/components/menu/usage', '/components/list/code']) {
      await go(route);
      const keys = main().locator('[data-component="Menu"] [aria-haspopup="menu"]:not(:disabled)');
      const n = Math.min(await keys.count(), 8);
      for (let i = 0; i < n; i++) {
        const k = keys.nth(i);
        await k.scrollIntoViewIfNeeded(); await k.click();
        const r = await page.evaluate(() => {
          const m = document.querySelector('[role="menu"]');
          if (!m) return null;
          const p = m.getBoundingClientRect();
          return [...m.querySelectorAll('[role="menuitem"]')].map((o) => {
            const t = o.lastElementChild ?? o; const tr = t.getBoundingClientRect();
            return t.scrollWidth > t.clientWidth + 1 || tr.right > p.right - 1 || tr.left < p.left + 1 ? o.textContent.trim() : null;
          }).filter(Boolean);
        });
        await page.keyboard.press('Escape');
        seen++;
        if (r === null) bad.push(`${route} #${i}: no open menu`);
        else if (r.length) bad.push(`${route} #${i}: cut ${r.join(', ')}`);
      }
    }
    expect(seen > 0 && !bad.length, bad.slice(0, 4).join(' | ') || 'no menu opened');
    return `${seen} menus, no action word is cut`;
  });

  await check('Menu', 'the open panel is whole inside a frame that clips and on the screen, and flips above the key near the bottom', async () => {
    await go('/components/menu/code');
    const frame = main().locator('[data-example-live] div[style*="overflow"] [aria-haspopup="menu"]').first();
    await frame.scrollIntoViewIfNeeded(); await frame.click();
    const inFrame = await page.evaluate(() => {
      const m = document.querySelector('[role="menu"]'); const r = m.getBoundingClientRect();
      const vw = document.documentElement.clientWidth, vh = document.documentElement.clientHeight;
      return { inside: r.left >= 0 && r.top >= 0 && r.right <= vw && r.bottom <= vh, onBody: m.parentElement === document.body };
    });
    await page.keyboard.press('Escape');
    // put a key near the bottom of the screen: the panel goes above it
    const k = key();
    const view = page.viewportSize();
    await k.scrollIntoViewIfNeeded();
    const bottom = await k.evaluate((el) => el.getBoundingClientRect().bottom);
    const shrink = view && bottom + 12 < view.height;
    if (shrink) await page.setViewportSize({ width: view.width, height: Math.ceil(bottom + 12) });
    else await k.evaluate((el) => window.scrollBy(0, el.getBoundingClientRect().bottom - document.documentElement.clientHeight + 12));
    await k.click();
    const flip = await k.evaluate((el) => {
      const m = document.getElementById(el.getAttribute('aria-controls')); const r = m.getBoundingClientRect(), t = el.getBoundingClientRect();
      return { above: r.bottom <= t.top + 1, bottom: r.bottom, vh: document.documentElement.clientHeight };
    });
    await page.keyboard.press('Escape');
    if (shrink) await page.setViewportSize(view);
    expect(inFrame.inside && inFrame.onBody, `in a clipping frame: inside the screen ${inFrame.inside}, on the body ${inFrame.onBody}`);
    expect(flip.above && flip.bottom <= flip.vh, `near the bottom: above the key ${flip.above}, bottom ${flip.bottom} of ${flip.vh}`);
    return 'whole and flipped';
  });
}
