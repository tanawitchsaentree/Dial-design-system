// Behaviour checks for Combobox (a text field with a filtered list, WAI-ARIA APG combobox), run by tooling/kiln/conformance.mjs on the built book.
// UNVERIFIED here: screen reader announcements, forced-colours rendering, and the list near the bottom of the screen (need a real reader, a forced-colours run and a short viewport).
export default async function combobox({ check, expect, page, go, main }) {
  const px = (s) => parseFloat(s);
  const root = () => main().locator('[data-component="Combobox"]').first();
  const field = () => root().locator('input[role="combobox"]');
  const state = () => field().evaluate((el) => {
    const list = document.getElementById(el.getAttribute('aria-controls'));
    const rows = list ? [...list.querySelectorAll('[role="option"]')] : [];
    const act = el.getAttribute('aria-activedescendant');
    return {
      expanded: el.getAttribute('aria-expanded'), value: el.value, focused: document.activeElement === el,
      labels: rows.map((r) => r.textContent.trim()), active: rows.findIndex((r) => r.id === act),
      chosen: rows.filter((r) => r.getAttribute('aria-selected') === 'true').map((r) => r.textContent.trim()),
    };
  });

  await check('Combobox', 'the field is a combobox named by its label, with a closed list, and the toggle is a 44px key outside the tab order', async () => {
    await go('/components/combobox/code');
    const r = await root().evaluate((el) => {
      const f = el.querySelector('input[role="combobox"]');
      const t = el.querySelector('button');
      const label = el.querySelector(`label[for="${f.id}"]`);
      return {
        auto: f.getAttribute('aria-autocomplete'), exp: f.getAttribute('aria-expanded'), ctl: !!document.getElementById(f.getAttribute('aria-controls')),
        name: label?.textContent.trim(), tab: t.tabIndex, w: t.getBoundingClientRect().width, h: t.getBoundingClientRect().height,
        listRole: document.getElementById(f.getAttribute('aria-controls'))?.getAttribute('role'),
      };
    });
    expect(!!r.name, 'no label resolves for the field');
    expect(r.auto === 'list' && r.exp === 'false' && r.ctl && r.listRole === 'listbox', `autocomplete ${r.auto}, expanded ${r.exp}, controls found ${r.ctl}, list role ${r.listRole}`);
    expect(r.tab === -1, `toggle tabIndex ${r.tab}`);
    expect(r.w >= 43.5 && r.h >= 43.5, `toggle ${r.w}×${r.h}`);
    return `"${r.name}", toggle ${Math.round(r.w)}×${Math.round(r.h)}`;
  });

  await check('Combobox', 'typing narrows the list to rows that contain the text and reaches the first match', async () => {
    await go('/components/combobox/code');
    await field().click();
    let s = await state();
    expect(s.expanded === 'true' && s.labels.length >= 3, `after click: expanded ${s.expanded}, ${s.labels.length} rows`);
    const all = s.labels.length;
    await field().fill('ki');
    s = await state();
    expect(s.expanded === 'true', 'the list closed while typing');
    expect(s.labels.length > 0 && s.labels.length < all, `${s.labels.length} of ${all} rows after typing`);
    expect(s.labels.every((l) => l.toLowerCase().includes('ki')), `rows ${s.labels.join(', ')}`);
    expect(s.active === 0, `reached row ${s.active}, wanted the first match`);
    await field().fill('zzzz');
    s = await state();
    expect(s.labels.length === 0, `${s.labels.length} rows for text that matches nothing`);
    const empty = await root().getByText(/no match/i).first().textContent();
    expect(/no match/i.test(empty ?? ''), `empty line "${empty}"`);
    return `${all} rows narrowed to a match, and "No match" for zzzz`;
  });

  await check('Combobox', 'the arrows reach rows and Enter chooses, keeping focus in the field', async () => {
    await go('/components/combobox/code');
    await field().focus();
    await page.keyboard.press('ArrowDown');
    let s = await state();
    expect(s.expanded === 'true' && s.focused, `ArrowDown: expanded ${s.expanded}, focus in field ${s.focused}`);
    const from = s.active;
    await page.keyboard.press('ArrowDown');
    s = await state();
    expect(s.active === from + 1, `reached row ${from} then ${s.active}`);
    const pick = s.labels[s.active];
    await page.keyboard.press('Enter');
    s = await state();
    expect(s.expanded === 'false' && s.focused, `after Enter: expanded ${s.expanded}, focus in field ${s.focused}`);
    expect(s.value === pick, `field holds "${s.value}", wanted "${pick}"`);
    await page.keyboard.press('ArrowDown');
    s = await state();
    expect(s.chosen.length === 1 && s.chosen[0] === pick, `chosen rows ${s.chosen.join(', ')}`);
    await page.waitForTimeout(500);
    const tick = await root().evaluate((el) => {
      const rows = [...el.querySelectorAll('[role="option"]')];
      return rows.map((r) => ({ sel: r.getAttribute('aria-selected'), op: getComputedStyle(r.querySelector('svg')).opacity }));
    });
    expect(tick.filter((t) => t.sel === 'true').every((t) => px(t.op) === 1) && tick.filter((t) => t.sel !== 'true').every((t) => px(t.op) === 0), 'the tick does not follow the chosen row');
    await page.keyboard.press('Escape');
    return `chose "${pick}" with the keyboard; the tick marks it`;
  });

  await check('Combobox', 'Escape and leaving drop text that is not an option', async () => {
    await go('/components/combobox/code');
    await field().focus();
    const start = (await state()).value;
    await field().fill('zz');
    await page.keyboard.press('Escape');
    let s = await state();
    expect(s.expanded === 'false' && s.value === start && s.focused, `after Escape: expanded ${s.expanded}, value "${s.value}", wanted "${start}", focus ${s.focused}`);
    await field().fill('zz');
    await page.keyboard.press('Tab');
    s = await state();
    expect(s.expanded === 'false' && s.value === start, `after Tab: expanded ${s.expanded}, value "${s.value}", wanted "${start}"`);
    return `free text "zz" was dropped and "${start}" came back, twice`;
  });

  await check('Combobox', 'no part of the combobox is the accent orange', async () => {
    await go('/components/combobox/code');
    await field().click();
    const bad = await main().locator('[data-component="Combobox"]').evaluateAll((els) => {
      const probe = document.createElement('span'); probe.style.color = 'var(--ds-action-accent)'; document.body.append(probe);
      const accent = getComputedStyle(probe).color; probe.remove();
      const out = []; for (const el of els) for (const n of el.querySelectorAll('*')) { const cs = getComputedStyle(n); if (accent && [cs.backgroundColor, cs.color, cs.borderColor].some((c) => c === accent)) out.push(n.tagName); }
      return out;
    });
    await page.keyboard.press('Escape');
    expect(bad.length === 0, `${bad.length} orange parts`);
    return 'no orange, list open';
  });
}
