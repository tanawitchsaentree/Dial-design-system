// Behaviour checks for RangePicker (start and end wells, a calendar key, a Calendar in a Popover), run by tooling/kiln/conformance.mjs.
// The Usage subject is: label "Stay", defaultValue 2026-11-09 to 2026-11-17, today 2026-11-04, no min or max.
export default async function rangePicker({ check, expect, go, main }) {
  const group = () => main().locator('div[data-component="RangePicker"]').first();
  const wells = () => group().locator('input:not([type="hidden"])');
  const key = () => group().locator('button[aria-haspopup="dialog"]');
  const panel = (page) => page.locator('div[role="dialog"][data-component="Popover"]');
  const open = async (page) => {
    await key().click();
    await panel(page).first().waitFor({ state: 'visible' });
    await page.waitForTimeout(500);
  };

  await check('RangePicker', 'a named group holds a start well, an end well and a calendar key, each at least the touch target', async () => {
    await go('/components/range-picker/code');
    const r = await group().evaluate((g) => {
      const name = document.getElementById(g.getAttribute('aria-labelledby') || '')?.textContent || '';
      const inputs = [...g.querySelectorAll('input:not([type="hidden"])')];
      const names = inputs.map((i) => i.labels?.[0]?.textContent ?? '');
      const k = g.querySelector('button[aria-haspopup="dialog"]');
      const boxes = [...inputs.map((i) => i.closest('div').getBoundingClientRect()), k.getBoundingClientRect()];
      return { role: g.getAttribute('role'), name, names, values: inputs.map((i) => i.value), boxes: boxes.map((b) => [b.width, b.height]), keyName: k.getAttribute('aria-label') };
    });
    expect(r.role === 'group' && r.name.length > 0, `group role ${r.role}, name "${r.name}"`);
    expect(r.names.length === 2 && r.names.every((n) => n.length > 0), `well names ${JSON.stringify(r.names)}`);
    expect(r.values[0] === '2026-11-09' && r.values[1] === '2026-11-17', `values ${r.values.join(' / ')}`);
    expect(r.boxes.every(([w, h]) => w >= 43.5 && h >= 43.5), `boxes ${r.boxes.map((b) => b.join('×')).join(', ')}`);
    expect(!!r.keyName, 'the calendar key has no name');
    return `"${r.name}": ${r.names.join(' and ')}, ${r.values.join(' to ')}, key "${r.keyName}"`;
  });

  await check('RangePicker', 'a typed date is accepted on blur, a bad one is reported, and a start after the end swaps the pair', async () => {
    await go('/components/range-picker/code');
    const page = main().page();
    const [s, e] = [wells().nth(0), wells().nth(1)];
    await e.fill('2026-11-25');
    await e.blur();
    await page.waitForTimeout(120);
    expect((await e.inputValue()) === '2026-11-25', `end well holds ${await e.inputValue()}`);
    await s.fill('2026-13-45');
    await s.blur();
    await page.waitForTimeout(120);
    const bad = await s.getAttribute('aria-invalid');
    const said = await group().locator('p').allTextContents();
    expect(bad === 'true', `aria-invalid is ${bad}`);
    expect(said.some((t) => /Start/.test(t)), `no message names the start well (${said.join(' | ')})`);
    await s.fill('2026-11-28');
    await s.blur();
    await page.waitForTimeout(120);
    const pair = [await s.inputValue(), await e.inputValue()];
    expect(pair[0] === '2026-11-25' && pair[1] === '2026-11-28', `after swap ${pair.join(' / ')}`);
    return `accepted 2026-11-25, rejected 2026-13-45 with a message, swapped to ${pair.join(' to ')}`;
  });

  await check('RangePicker', 'the key opens the Calendar with focus on a day, and the range is told by shape: windows at the ends, a ruled strip between', async () => {
    await go('/components/range-picker/code');
    const page = main().page();
    await open(page);
    const r = await page.evaluate(() => {
      const cal = document.querySelector('div[role="dialog"][data-component="Popover"] [data-component="Calendar"]');
      const day = (iso) => cal.querySelector(`button[data-date="${iso}"]`);
      const edge = (el) => { const cs = getComputedStyle(el); return { w: parseFloat(cs.borderBlockStartWidth), style: cs.borderBlockStartStyle, color: cs.borderBlockStartColor }; };
      return {
        focused: document.activeElement?.getAttribute('data-date') ?? null,
        marks: ['2026-11-09', '2026-11-12', '2026-11-17', '2026-11-20'].map((d) => day(d)?.getAttribute('data-range') ?? null),
        selected: cal.querySelectorAll('td[aria-selected="true"]').length,
        inside: edge(day('2026-11-12')),
        outside: edge(day('2026-11-20')),
        endWindow: getComputedStyle(day('2026-11-09')).boxShadow,
        label: day('2026-11-12').getAttribute('aria-label'),
      };
    });
    expect(!!r.focused, 'no day has focus after the panel opens');
    expect(r.marks.join(',') === 'start,inside,end,', `marks ${r.marks.join(',')}`);
    expect(r.selected === 9, `${r.selected} cells are aria-selected (need 9)`);
    expect(r.inside.w > 0 && r.inside.style === 'solid' && r.inside.color !== r.outside.color, `ruled edge ${JSON.stringify(r.inside)} vs plain ${JSON.stringify(r.outside)}`);
    expect(r.endWindow && r.endWindow !== 'none', 'the end day has no recess');
    expect(/in range/.test(r.label), `day name is "${r.label}"`);
    return `focus on ${r.focused}, 9 selected, inside edge ${r.inside.w}px ${r.inside.style}, end day recessed`;
  });

  await check('RangePicker', 'the first press sets the start, a hover previews the end with a dotted strip, and the second press sets the end and closes', async () => {
    await go('/components/range-picker/code');
    const page = main().page();
    await open(page);
    const cal = page.locator('div[role="dialog"][data-component="Popover"] [data-component="Calendar"]');
    await cal.locator('button[data-date="2026-11-20"]').click();
    await page.waitForTimeout(150);
    expect((await wells().nth(0).inputValue()) === '2026-11-20' && (await wells().nth(1).inputValue()) === '', 'the first press did not set the start and clear the end');
    expect(await panel(page).first().isVisible(), 'the panel closed after the first press');
    await cal.locator('button[data-date="2026-11-24"]').hover();
    await page.waitForTimeout(150);
    const preview = await cal.locator('button[data-date="2026-11-22"]').evaluate((b) => ({ range: b.getAttribute('data-range'), style: getComputedStyle(b).borderBlockStartStyle }));
    expect(preview.range === 'inside' && preview.style === 'dotted', `preview ${JSON.stringify(preview)}`);
    await cal.locator('button[data-date="2026-11-24"]').click();
    await page.waitForTimeout(600);
    const vals = [await wells().nth(0).inputValue(), await wells().nth(1).inputValue()];
    expect(vals[0] === '2026-11-20' && vals[1] === '2026-11-24', `wells ${vals.join(' / ')}`);
    expect((await panel(page).count()) === 0, 'the panel is still open after the second press');
    const back = await key().evaluate((k) => document.activeElement === k);
    expect(back, 'focus did not return to the calendar key');
    return `start 2026-11-20, dotted preview, end 2026-11-24, panel closed, focus on the key`;
  });

  await check('RangePicker', 'the keyboard picks a range with arrows and Enter, and Escape closes and returns focus to the key', async () => {
    await go('/components/range-picker/code');
    const page = main().page();
    await key().focus();
    await page.keyboard.press('Enter');
    await panel(page).first().waitFor({ state: 'visible' });
    await page.waitForTimeout(500);
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(150);
    const start = await wells().nth(0).inputValue();
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(600);
    const vals = [await wells().nth(0).inputValue(), await wells().nth(1).inputValue()];
    expect(start !== '2026-11-09' && vals[0] === start && vals[1] > vals[0], `start ${start}, then ${vals.join(' / ')}`);
    await key().focus();
    await page.keyboard.press('Enter');
    await panel(page).first().waitFor({ state: 'visible' });
    await page.keyboard.press('Escape');
    await page.waitForFunction(() => !document.querySelector('div[role="dialog"][data-component="Popover"]'), null, { timeout: 3000 });
    const back = await key().evaluate((k) => document.activeElement === k);
    expect(back, 'focus is not on the key after Escape');
    return `Enter picked ${vals.join(' to ')}; Escape closed and focus is on the key`;
  });

  await check('RangePicker', 'no part of the RangePicker or its Calendar is the accent orange', async () => {
    await go('/components/range-picker/code');
    const page = main().page();
    await open(page);
    const bad = await page.evaluate(() => {
      const probe = document.createElement('span'); probe.style.color = 'var(--ds-action-accent)'; document.body.append(probe);
      const accent = getComputedStyle(probe).color; probe.remove();
      const roots = [document.querySelector('div[data-component="RangePicker"]'), document.querySelector('div[role="dialog"][data-component="Popover"]')];
      let n = 0;
      for (const r of roots) for (const el of [r, ...r.querySelectorAll('*')]) { const cs = getComputedStyle(el); if (accent && [cs.backgroundColor, cs.color, cs.borderColor].includes(accent)) n++; }
      return n;
    });
    expect(bad === 0, `${bad} orange parts`);
    return 'no orange';
  });
}
