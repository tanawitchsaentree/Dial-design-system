// Behaviour checks for Listbox (an always-open list, WAI-ARIA APG listbox), run by tooling/kiln/conformance.mjs on the built book.
// UNVERIFIED here: screen reader announcements and forced-colours rendering (need a real reader and a forced-colours run).
export default async function listbox({ check, expect, page, go, main }) {
  const px = (s) => parseFloat(s);
  const lists = () => main().locator('[data-component="Listbox"] [role="listbox"]');
  const single = () => lists().first();
  const multi = () => main().locator('[data-component="Listbox"] [role="listbox"][aria-multiselectable="true"]').first();
  const state = (c) => c.evaluate((el) => {
    const opts = [...el.querySelectorAll('[role="option"]')];
    const act = el.getAttribute('aria-activedescendant');
    return {
      count: opts.length, active: opts.findIndex((o) => o.id === act),
      on: opts.map((o, i) => (o.getAttribute('aria-selected') === 'true' ? i : -1)).filter((i) => i >= 0),
      labels: opts.map((o) => o.textContent.trim()), focused: document.activeElement === el,
    };
  });

  await check('Listbox', 'the list is named by its label, holds at least three options and marks the chosen one with aria-selected and a visible tick', async () => {
    await go('/components/listbox/code');
    const r = await single().evaluate((el) => {
      const name = document.getElementById(el.getAttribute('aria-labelledby'))?.textContent.trim();
      const opts = [...el.querySelectorAll('[role="option"]')];
      return {
        name, role: el.getAttribute('role'), multi: el.getAttribute('aria-multiselectable'), n: opts.length,
        tick: opts.map((o) => ({ sel: o.getAttribute('aria-selected'), op: getComputedStyle(o.querySelector('svg')).opacity })),
      };
    });
    expect(!!r.name, 'aria-labelledby does not resolve to a label');
    expect(r.n >= 3, `${r.n} options`);
    expect(r.multi === null, `single list has aria-multiselectable="${r.multi}"`);
    const chosen = r.tick.filter((t) => t.sel === 'true');
    expect(chosen.length === 1 && px(chosen[0].op) === 1, `${chosen.length} chosen rows, tick opacity ${chosen[0]?.op}`);
    expect(r.tick.filter((t) => t.sel !== 'true').every((t) => px(t.op) === 0), 'a row that is not chosen shows a tick');
    return `"${r.name}", ${r.n} options, 1 chosen with a tick`;
  });

  await check('Listbox', 'one tab stop lands on the chosen row, arrows skip the disabled row, Home and End jump, Enter chooses and the focus ring shows', async () => {
    await go('/components/listbox/code');
    const c = single();
    await c.focus();
    const a = await state(c);
    expect(a.focused && a.active === a.on[0], `focus landed on ${a.active}, chosen ${a.on}`);
    const ring = await c.evaluate((el) => ({ w: getComputedStyle(el).outlineWidth, s: getComputedStyle(el).outlineStyle }));
    expect(ring.s !== 'none' && px(ring.w) >= 2, `outline ${ring.s} ${ring.w}`);
    await page.keyboard.press('End'); const e = await state(c);
    await page.keyboard.press('Home'); const h = await state(c);
    expect(h.active === 0 && e.active === e.count - 2, `Home ${h.active}, End ${e.active} of ${e.count} (the last row is disabled)`);
    await page.keyboard.press('ArrowDown'); await page.keyboard.press('ArrowDown');
    const d = await state(c);
    await page.keyboard.press('ArrowDown'); const stay = await state(c);
    expect(d.active === 2 && stay.active === 2, `Down twice ${d.active}, once more over the disabled row ${stay.active}`);
    await page.keyboard.press('ArrowUp'); await page.keyboard.press('Enter');
    const after = await state(c);
    expect(after.on.length === 1 && after.on[0] === 1, `chosen after Enter: ${after.on}`);
    return `Home ${h.active}, End ${e.active}, chose row ${after.on[0] + 1}`;
  });

  await check('Listbox', 'typing a letter jumps to the next row that starts with it', async () => {
    await go('/components/listbox/code');
    const c = single();
    await c.focus(); await page.keyboard.press('Home');
    await page.keyboard.press('a');
    const s = await state(c);
    expect(s.labels[s.active]?.toLowerCase().startsWith('a'), `active row "${s.labels[s.active]}"`);
    return `a jumped to "${s.labels[s.active]}"`;
  });

  await check('Listbox', 'in multiple Space toggles the reached row, Shift with an arrow toggles the row it reaches, Control A chooses all', async () => {
    await go('/components/listbox/code');
    const c = multi();
    const attr = await c.getAttribute('aria-multiselectable');
    expect(attr === 'true', `aria-multiselectable="${attr}"`);
    await c.focus();
    const s0 = await state(c);
    await page.keyboard.press('ArrowDown'); await page.keyboard.press('Space');
    const s1 = await state(c);
    await page.keyboard.press('Space');
    const s2 = await state(c);
    expect(s1.on.length === s0.on.length + 1 && s2.on.length === s0.on.length, `chosen ${s0.on.length} -> ${s1.on.length} -> ${s2.on.length}`);
    await page.keyboard.press('Shift+ArrowDown');
    const s3 = await state(c);
    expect(s3.on.length === s0.on.length + 1, `after Shift+ArrowDown chosen ${s3.on.length}`);
    await page.keyboard.press('Control+a');
    const s4 = await state(c);
    expect(s4.on.length === s4.count, `Control+A chose ${s4.on.length} of ${s4.count}`);
    return `toggle, Shift+Down and Control+A on ${s4.count} rows`;
  });

  await check('Listbox', 'every row is at least 44px tall and no part of the listbox is the accent orange', async () => {
    await go('/components/listbox/code');
    const r = await main().locator('[data-component="Listbox"]').evaluateAll((roots) => {
      const probe = document.createElement('span'); probe.style.color = 'var(--ds-action-accent)'; document.body.append(probe);
      const accent = getComputedStyle(probe).color; probe.remove();
      const heights = []; const orange = [];
      for (const root of roots) {
        for (const o of root.querySelectorAll('[role="option"]')) heights.push(o.getBoundingClientRect().height);
        for (const n of root.querySelectorAll('*')) { const cs = getComputedStyle(n); if (accent && [cs.backgroundColor, cs.color, cs.borderColor].some((c) => c === accent)) orange.push(n.tagName); }
      }
      return { heights, orange };
    });
    expect(r.heights.length >= 6 && r.heights.every((h) => h >= 43.5), `row heights ${r.heights.map((h) => Math.round(h)).join(', ')}`);
    expect(r.orange.length === 0, `${r.orange.length} orange parts`);
    return `${r.heights.length} rows at 44px or more, no orange`;
  });
}
