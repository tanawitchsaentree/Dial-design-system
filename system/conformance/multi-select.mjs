// Behaviour checks for MultiSelect (select-only combobox with a multiselectable listbox), run by tooling/kiln/conformance.mjs.
export default async function multiSelect({ check, expect, page, go, main }) {
  const first = () => main().locator('[data-component="MultiSelect"] [role="combobox"]:not(:disabled)').first();
  const state = (c) => c.evaluate((el) => {
    const list = document.getElementById(el.getAttribute('aria-controls'));
    const opts = [...list.querySelectorAll('[role="option"]')];
    const act = el.getAttribute('aria-activedescendant');
    return {
      open: el.getAttribute('aria-expanded') === 'true', visible: !list.hidden && list.getBoundingClientRect().height > 0,
      multi: list.getAttribute('aria-multiselectable'), active: opts.findIndex((o) => o.id === act),
      on: opts.map((o) => o.getAttribute('aria-selected') === 'true'), off: opts.map((o) => o.getAttribute('aria-disabled') === 'true'),
      tick: opts.map((o) => getComputedStyle(o.querySelector('svg')).opacity), value: el.textContent.trim(), focused: document.activeElement === el,
    };
  });

  await check('MultiSelect', 'Down opens a multiselectable list on the first chosen row and Escape closes it with focus kept', async () => {
    await go('/components/multi-select/code');
    const c = first();
    await c.focus(); await page.keyboard.press('ArrowDown');
    const o = await state(c);
    expect(o.open && o.visible && o.multi === 'true', `expanded ${o.open}, visible ${o.visible}, aria-multiselectable ${o.multi}`);
    expect(o.active === o.on.indexOf(true), `active ${o.active}, first chosen ${o.on.indexOf(true)}`);
    await page.keyboard.press('Escape');
    await page.waitForTimeout(400);
    const s = await state(c);
    expect(!s.open && !s.visible && s.focused, `after Escape: expanded ${s.open}, visible ${s.visible}, focused ${s.focused}`);
    return `opened on row ${o.active + 1} of ${o.on.length}`;
  });

  await check('MultiSelect', 'Space toggles the reached row, the list stays open, and the tick shows the change without colour', async () => {
    await go('/components/multi-select/code');
    const c = first();
    await c.focus(); await page.keyboard.press('Enter'); await page.keyboard.press('Home');
    const a = await state(c);
    await page.keyboard.press(' ');
    await page.waitForTimeout(500);
    const b = await state(c);
    expect(b.open && b.visible, `closed after Space (expanded ${b.open})`);
    expect(b.on[a.active] === !a.on[a.active], `row ${a.active} aria-selected ${a.on[a.active]} -> ${b.on[a.active]}`);
    expect(parseFloat(b.tick[a.active]) !== parseFloat(a.tick[a.active]), `tick opacity ${a.tick[a.active]} -> ${b.tick[a.active]} (no cue besides colour)`);
    await page.keyboard.press(' ');
    const d = await state(c);
    expect(d.on[a.active] === a.on[a.active], 'a second Space did not toggle the row back');
    expect(b.value !== a.value || b.on.filter(Boolean).length !== a.on.filter(Boolean).length, 'the well did not change with the choice');
    return `row ${a.active + 1} toggled twice, list open`;
  });

  await check('MultiSelect', 'arrow keys and Ctrl+A walk and toggle the rows, skipping rows that cannot be chosen', async () => {
    await go('/components/multi-select/code');
    const c = first();
    await c.focus(); await page.keyboard.press('Enter'); await page.keyboard.press('Home');
    const h = await state(c);
    await page.keyboard.press('ArrowDown'); const d = await state(c);
    expect(d.active === h.active + 1 && !d.off[d.active], `Home ${h.active}, Down ${d.active}`);
    await page.keyboard.press('End'); const e = await state(c);
    expect(!e.off[e.active], `End landed on a disabled row (${e.active})`);
    await page.keyboard.press('Control+a'); const all = await state(c);
    const usable = all.on.filter((_, i) => !all.off[i]);
    const allOn = usable.every(Boolean), allOff = usable.every((x) => !x);
    expect(allOn || allOff, `Ctrl+A left a mix: ${all.on.join(',')}`);
    expect(all.open, 'Ctrl+A closed the list');
    return `Home ${h.active}, Down ${d.active}, End ${e.active}; Ctrl+A toggled ${usable.length} rows`;
  });

  await check('MultiSelect', 'the well and every row are at least the touch target tall', async () => {
    await go('/components/multi-select/code');
    const c = first();
    await c.focus(); await page.keyboard.press('Enter');
    const r = await c.evaluate((el) => {
      const well = el.parentElement.getBoundingClientRect().height;
      const rows = [...document.getElementById(el.getAttribute('aria-controls')).querySelectorAll('[role="option"]')].map((o) => o.getBoundingClientRect().height);
      return { well, rows };
    });
    expect(r.well >= 43.5 && r.rows.length >= 3 && r.rows.every((h) => h >= 43.5), `well ${r.well}, rows ${r.rows.join(', ')}`);
    return `well ${r.well}px, ${r.rows.length} rows ≥ 44px`;
  });

  await check('MultiSelect', 'no part of the multi-select is the accent orange', async () => {
    await go('/components/multi-select/code');
    const c = first();
    await c.focus(); await page.keyboard.press('Enter');
    const bad = await main().locator('[data-component="MultiSelect"]').evaluateAll((els) => {
      const probe = document.createElement('span'); probe.style.color = 'var(--ds-action-accent)'; document.body.append(probe);
      const accent = getComputedStyle(probe).color; probe.remove();
      const out = []; for (const el of els) for (const n of el.querySelectorAll('*')) { const cs = getComputedStyle(n); if (accent && [cs.backgroundColor, cs.color, cs.borderColor].some((x) => x === accent)) out.push(n.tagName); }
      return out;
    });
    expect(bad.length === 0, `${bad.length} orange parts`);
    return 'no orange';
  });
}
