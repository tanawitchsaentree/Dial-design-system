// Behaviour checks for Select (a select-only combobox, WAI-ARIA APG), run by tooling/kiln/conformance.mjs on the built book.
export default async function select({ check, expect, page, go, main, tokens }) {
  const px = (s) => parseFloat(s);
  const first = () => main().locator('[data-component="Select"] [role="combobox"]:not(:disabled)').first();
  const state = (c) => c.evaluate((el) => {
    const list = document.getElementById(el.getAttribute('aria-controls'));
    const opts = [...list.querySelectorAll('[role="option"]')];
    const act = el.getAttribute('aria-activedescendant');
    return {
      open: el.getAttribute('aria-expanded') === 'true', visible: !!list && !list.hidden && list.getBoundingClientRect().height > 0,
      active: opts.findIndex((o) => o.id === act), selected: opts.findIndex((o) => o.getAttribute('aria-selected') === 'true'),
      count: opts.length, labels: opts.map((o) => o.textContent.trim()), focused: document.activeElement === el, value: el.textContent.trim(),
    };
  });
  await check('Select', 'Tab reaches the combobox and the focus ring shows', async () => {
    await go('/components/select/code');
    const c = first();
    await c.focus(); await page.keyboard.press('Shift+Tab'); await page.keyboard.press('Tab');
    const st = await c.evaluate((el) => ({ focused: document.activeElement === el, w: getComputedStyle(el).outlineWidth, s: getComputedStyle(el).outlineStyle, role: el.getAttribute('role'), pop: el.getAttribute('aria-haspopup') }));
    expect(st.focused, 'the combobox did not take focus');
    expect(st.role === 'combobox' && st.pop === 'listbox', `role ${st.role}, aria-haspopup ${st.pop}`);
    expect(st.s !== 'none' && px(st.w) >= 2, `outline ${st.s} ${st.w}`);
    return `outline ${st.w}`;
  });
  await check('Select', 'Down opens the list on the chosen option and Escape closes it with focus kept', async () => {
    await go('/components/select/code');
    const c = first();
    await c.focus(); await page.keyboard.press('ArrowDown');
    const o = await state(c);
    expect(o.open && o.visible, `expanded ${o.open}, listbox visible ${o.visible}`);
    expect(o.active === Math.max(0, o.selected), `active ${o.active}, selected ${o.selected}`);
    await page.keyboard.press('Escape');
    const s = await state(c);
    expect(!s.open && !s.visible && s.focused, `after Escape: expanded ${s.open}, visible ${s.visible}, focused ${s.focused}`);
    return `opened on option ${o.active + 1} of ${o.count}`;
  });
  await check('Select', 'arrow keys, Home and End move the active option and Enter chooses it', async () => {
    await go('/components/select/code');
    const c = first();
    await c.focus(); await page.keyboard.press('Enter');
    await page.keyboard.press('Home'); const h = await state(c);
    await page.keyboard.press('ArrowDown'); const d = await state(c);
    await page.keyboard.press('End'); const e = await state(c);
    await page.keyboard.press('ArrowUp'); const u = await state(c);
    expect(h.active === 0 && d.active === 1 && e.active === e.count - 1 && u.active === e.count - 2, `Home ${h.active}, Down ${d.active}, End ${e.active}, Up ${u.active}`);
    await page.keyboard.press('Enter'); const after = await state(c);
    expect(!after.open && after.selected === e.count - 2 && after.value === after.labels[e.count - 2] && after.focused, `chose ${after.selected}, value "${after.value}", open ${after.open}`);
    return `chose "${after.value}"`;
  });
  await check('Select', 'type-ahead jumps to the option that starts with the typed letters', async () => {
    await go('/components/select/code');
    const c = first();
    const s0 = await state(c);
    const target = s0.labels.findIndex((l, i) => i !== s0.selected && /^[a-z]/i.test(l));
    await c.focus(); await page.keyboard.press('ArrowDown'); await page.keyboard.press('Home');
    await page.waitForTimeout(600);
    await page.keyboard.type(s0.labels[target].slice(0, 2));
    const s = await state(c);
    expect(s.active === target, `typed "${s0.labels[target].slice(0, 2)}", active ${s.active} ("${s.labels[s.active]}")`);
    await page.keyboard.press('Escape');
    return `"${s0.labels[target].slice(0, 2)}" → ${s.labels[s.active]}`;
  });
  await check('Select', 'a press outside closes the list without choosing', async () => {
    await go('/components/select/code');
    const c = first();
    const before = await state(c);
    await c.click(); const o = await state(c);
    expect(o.open && o.visible, `a click did not open the list (expanded ${o.open})`);
    await page.mouse.click(2, 2); const s = await state(c);
    expect(!s.open && s.selected === before.selected, `after a press outside: expanded ${s.open}, selected ${s.selected} (was ${before.selected})`);
    return 'closed';
  });
  await check('Select', 'the well and every option are at least the touch target tall, and the chosen option is marked by a glyph in ink', async () => {
    await go('/components/select/code');
    const min = px(tokens['layout.touch']?.value ?? '44px');
    const c = first();
    await c.focus(); await page.keyboard.press('ArrowDown');
    const r = await c.evaluate((el) => {
      const list = document.getElementById(el.getAttribute('aria-controls'));
      const opts = [...list.querySelectorAll('[role="option"]')];
      const sel = opts.find((o) => o.getAttribute('aria-selected') === 'true');
      const accent = getComputedStyle(document.documentElement).getPropertyValue('--ds-action-accent').trim();
      const probe = document.createElement('i'); probe.style.color = accent; document.body.append(probe); const orange = getComputedStyle(probe).color; probe.remove();
      const cs = sel ? getComputedStyle(sel) : null;
      return {
        well: el.getBoundingClientRect().height, rows: opts.map((o) => o.getBoundingClientRect().height),
        glyph: !!sel?.querySelector('svg path'), weight: cs ? Number(cs.fontWeight) : 0,
        orange: !!cs && [cs.color, cs.backgroundColor].includes(orange),
      };
    });
    await page.keyboard.press('Escape');
    expect(r.well >= min - 0.5 && r.rows.every((h) => h >= min - 0.5), `well ${r.well}px, rows ${r.rows.join(', ')} (min ${min})`);
    expect(r.glyph && r.weight >= 500 && !r.orange, `glyph ${r.glyph}, weight ${r.weight}, orange ${r.orange}`);
    return `well ${r.well}px, chosen weight ${r.weight}`;
  });
}
