// Behaviour checks for CommandPalette (modal sheet: query window over a printed legend), run by tooling/kiln/conformance.mjs.
// UNVERIFIED by jsdom: focus trap, inert page and real key handling are exercised here through Playwright only.
export default async function commandPalette({ check, expect, page, go, main }) {
  const opener = () => main().getByRole('button', { name: 'Find a command', exact: true }).first();
  const sheet = () => page.locator('dialog[data-component="CommandPalette"]:modal').first();
  const openByClick = async () => {
    await go('/components/command-palette/code');
    const b = opener();
    await b.focus();
    await page.keyboard.press('Enter');
    await sheet().waitFor({ state: 'visible' });
    return b;
  };
  const lit = () => sheet().evaluate((d) => {
    const f = d.querySelector('input');
    const id = f.getAttribute('aria-activedescendant');
    const o = id ? document.getElementById(id) : null;
    return { id, text: o?.querySelector('span:nth-child(2)')?.textContent ?? '', selected: o?.getAttribute('aria-selected'), disabled: o?.getAttribute('aria-disabled'), inList: !!o && d.querySelector('[role="listbox"]').contains(o) };
  });

  await check('CommandPalette', 'opens from the chord and returns focus on close', async () => {
    await go('/components/command-palette/code');
    const b = opener();
    await b.focus();
    await page.keyboard.press('Control+k');
    await sheet().waitFor({ state: 'visible' });
    const st = await sheet().evaluate((d) => ({ field: document.activeElement === d.querySelector('input'), modal: d.matches(':modal'), name: d.getAttribute('aria-label') ?? '' }));
    expect(st.modal, 'the palette is not modal (showModal was not used)');
    expect(st.field, 'focus did not go to the query field');
    expect(st.name.trim().length > 0, 'the palette has no accessible name');
    await page.keyboard.press('Control+k');
    await sheet().waitFor({ state: 'detached' });
    expect(await b.evaluate((el) => document.activeElement === el), 'focus did not return to the opener after the chord closed it');
    return `chord opened and closed it, name "${st.name}"`;
  });

  await check('CommandPalette', 'typing filters the commands and the first one that can run is lit', async () => {
    await openByClick();
    const before = await sheet().locator('[role="option"]').count();
    await page.keyboard.type('lamp');
    const after = await sheet().locator('[role="option"]').count();
    const l = await lit();
    expect(before >= 3, `${before} commands before typing (need 3)`);
    expect(after >= 1 && after < before, `${before} -> ${after} commands after typing "lamp"`);
    expect(l.inList && l.selected === 'true', 'aria-activedescendant does not point at a selected option in the list');
    expect(/lamps/i.test(l.text), `lit row is "${l.text}"`);
    await page.keyboard.type('zzzz');
    const none = await sheet().evaluate((d) => ({ n: d.querySelectorAll('[role="option"]').length, active: d.querySelector('input').hasAttribute('aria-activedescendant'), empty: d.querySelector('[role="listbox"]').getAttribute('data-empty'), said: d.querySelector('[role="status"]')?.textContent ?? '' }));
    expect(none.n === 0 && !none.active && none.empty === 'true', `no match: ${none.n} rows, activedescendant ${none.active}`);
    expect(none.said.trim().length > 0, 'the empty result is not announced');
    await page.keyboard.press('Escape');
    await sheet().waitFor({ state: 'detached' });
    return `${before} -> ${after} commands, empty state announced "${none.said}"`;
  });

  await check('CommandPalette', 'the arrows move the lit row and skip rows that cannot run', async () => {
    await openByClick();
    const seen = [];
    for (let i = 0; i < 6; i++) { seen.push(await lit()); await page.keyboard.press('ArrowDown'); }
    expect(seen.every((s) => s.disabled !== 'true' && s.id), `a disabled or missing row was lit: ${seen.map((s) => s.text).join(' | ')}`);
    expect(new Set(seen.map((s) => s.text)).size >= 3, `only ${new Set(seen.map((s) => s.text)).size} different rows were reached`);
    const focus = await sheet().evaluate((d) => document.activeElement === d.querySelector('input'));
    expect(focus, 'focus left the field while the arrows walked the list');
    await page.keyboard.press('Escape');
    await sheet().waitFor({ state: 'detached' });
    return `${new Set(seen.map((s) => s.text)).size} different rows, none disabled, focus stayed in the field`;
  });

  await check('CommandPalette', 'Enter runs the lit command and closes', async () => {
    const b = await openByClick();
    await page.keyboard.type('open set');
    expect((await lit()).text === 'Open settings', 'the lit row is not "Open settings"');
    await page.keyboard.press('Enter');
    await sheet().waitFor({ state: 'detached' });
    expect(await b.evaluate((el) => document.activeElement === el), 'focus did not return to the opener after Enter');
    // the text is cleared for the next time
    await page.keyboard.press('Enter');
    await sheet().waitFor({ state: 'visible' });
    const v = await sheet().evaluate((d) => d.querySelector('input').value);
    expect(v === '', `the field kept "${v}" after the palette closed`);
    await page.keyboard.press('Escape');
    await sheet().waitFor({ state: 'detached' });
    return 'ran, closed, focus on opener, text cleared';
  });

  await check('CommandPalette', 'Escape closes and focus returns', async () => {
    const b = await openByClick();
    const seen = [];
    for (const k of ['Tab', 'Tab', 'Shift+Tab']) { await page.keyboard.press(k); seen.push(await sheet().evaluate((d) => d.contains(document.activeElement))); }
    expect(seen.every(Boolean), `focus left the palette on Tab (${seen.join(', ')})`);
    await page.keyboard.press('Escape');
    await sheet().waitFor({ state: 'detached' });
    expect(await b.evaluate((el) => document.activeElement === el), 'after Escape focus did not return to the opener');
    const again = await openByClick();
    await page.mouse.click(4, 4);
    await sheet().waitFor({ state: 'detached' });
    expect(await again.evaluate((el) => document.activeElement === el), 'after the scrim click focus did not return to the opener');
    return 'Tab stayed inside; Escape and the scrim both closed it';
  });

  await check('CommandPalette', 'rows are at least the touch target, the sheet keeps its height while filtering and nothing is orange', async () => {
    await openByClick();
    const measure = () => sheet().evaluate((d) => {
      const probe = document.createElement('span'); probe.style.color = 'var(--ds-action-accent)'; document.body.append(probe);
      const accent = getComputedStyle(probe).color; probe.remove();
      const orange = [...d.querySelectorAll('*')].filter((n) => { const cs = getComputedStyle(n); return accent && [cs.backgroundColor, cs.color, cs.borderColor].some((c) => c === accent); }).length;
      return { h: d.getBoundingClientRect().height, rows: [...d.querySelectorAll('[role="option"]')].map((o) => o.getBoundingClientRect().height), orange };
    });
    const a = await measure();
    await page.keyboard.type('lamp');
    await page.waitForTimeout(500);
    const b = await measure();
    expect(a.rows.length > 0 && a.rows.every((h) => h >= 43.5), `row heights ${a.rows.join(', ')}`);
    expect(Math.abs(a.h - b.h) < 1, `sheet height changed from ${a.h} to ${b.h} while filtering`);
    expect(a.orange === 0 && b.orange === 0, `${a.orange + b.orange} orange parts`);
    await page.keyboard.press('Escape');
    await sheet().waitFor({ state: 'detached' });
    return `rows >= 44px, sheet ${Math.round(a.h)}px before and after, no orange`;
  });
}
