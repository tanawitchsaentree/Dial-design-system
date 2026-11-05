// Behaviour checks for Calendar (month grid, roving tabindex), run by tooling/kiln/conformance.mjs.
// The Usage subject is: defaultMonth 2026-11, today 2026-11-04, weekStart 1, min 2026-11-03, defaultValue 2026-11-12.
export default async function calendar({ check, expect, go, main }) {
  const first = () => main().locator('[data-component="Calendar"]').first();
  const focusedDate = (g) => g.page().evaluate(() => document.activeElement?.getAttribute('data-date') ?? null);

  await check('Calendar', 'a labelled grid of six weeks with one day in the tab order, today announced and the chosen day selected', async () => {
    await go('/components/calendar/code');
    const r = await first().evaluate((root) => {
      const grid = root.querySelector('[role="grid"]');
      const name = document.getElementById(grid.getAttribute('aria-labelledby') || '')?.textContent || '';
      return {
        name,
        heads: grid.querySelectorAll('thead th').length,
        weeks: grid.querySelectorAll('tbody tr').length,
        tab: [...grid.querySelectorAll('button[data-date]')].filter((b) => b.tabIndex === 0).length,
        today: grid.querySelector('button[aria-current="date"]')?.getAttribute('data-date'),
        chosen: grid.querySelector('td[aria-selected="true"] > button')?.getAttribute('data-date'),
      };
    });
    expect(r.name.length > 3, `grid has no name (got "${r.name}")`);
    expect(r.heads === 7 && r.weeks === 6, `${r.heads} weekday heads, ${r.weeks} weeks`);
    expect(r.tab === 1, `${r.tab} days in the tab order (need exactly 1)`);
    expect(r.today === '2026-11-04', `today is ${r.today}`);
    expect(r.chosen === '2026-11-12', `chosen is ${r.chosen}`);
    return `"${r.name}", 6 weeks, 1 tab stop, today ${r.today}, chosen ${r.chosen}`;
  });

  await check('Calendar', 'arrows, Home, End and Page keys move the focus over days and months', async () => {
    await go('/components/calendar/code');
    const g = first();
    const page = g.page();
    await g.locator('button[data-date="2026-11-12"]').focus();
    const steps = [];
    for (const [key, want] of [['ArrowRight', '2026-11-13'], ['ArrowLeft', '2026-11-12'], ['ArrowDown', '2026-11-19'], ['ArrowUp', '2026-11-12'], ['Home', '2026-11-09'], ['End', '2026-11-15']]) {
      await page.keyboard.press(key);
      await page.waitForTimeout(60);
      const got = await focusedDate(g);
      steps.push(`${key} ${got}`);
      expect(got === want, `${key} went to ${got}, need ${want}`);
    }
    const title = () => g.locator(':scope > div:first-child > div').first().textContent();
    const before = await title();
    await page.keyboard.press('PageDown');
    await page.waitForTimeout(60);
    const got = await focusedDate(g);
    const after = await title();
    expect(got === '2026-12-15', `PageDown went to ${got}, need 2026-12-15`);
    expect(after !== before, `month name did not change (${before})`);
    return `${steps.join(', ')}, PageDown ${got} (${before} to ${after})`;
  });

  await check('Calendar', 'Enter chooses the focused day and an unavailable day cannot be chosen', async () => {
    await go('/components/calendar/code');
    const g = first();
    const page = g.page();
    const chosen = () => g.evaluate((root) => root.querySelector('td[aria-selected="true"] > button')?.getAttribute('data-date'));
    await g.locator('button[data-date="2026-11-02"]').click({ force: true });
    await page.waitForTimeout(60);
    expect((await chosen()) === '2026-11-12', `an unavailable day was chosen (${await chosen()})`);
    const off = await g.locator('button[data-date="2026-11-02"]').getAttribute('aria-disabled');
    expect(off === 'true', 'the day before min is not marked aria-disabled');
    await g.locator('button[data-date="2026-11-12"]').focus();
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(60);
    const now = await chosen();
    expect(now === '2026-11-13', `Enter chose ${now}, need 2026-11-13`);
    return `unavailable stayed unchosen, Enter chose ${now}`;
  });

  await check('Calendar', 'every day is a 44px target and today and the chosen day differ by shape and weight, not colour', async () => {
    await go('/components/calendar/code');
    const r = await first().evaluate((root) => {
      const days = [...root.querySelectorAll('button[data-date]')];
      const box = days.map((d) => d.getBoundingClientRect());
      const plain = days.find((d) => !d.hasAttribute('data-selected') && !d.hasAttribute('data-today') && d.getAttribute('aria-disabled') !== 'true');
      const sel = root.querySelector('button[data-selected]');
      const today = root.querySelector('button[data-today]');
      const mark = today?.querySelector('span')?.getBoundingClientRect();
      const probe = document.createElement('span'); probe.style.color = 'var(--ds-action-accent)'; document.body.append(probe);
      const accent = getComputedStyle(probe).color; probe.remove();
      const orange = [...root.querySelectorAll('*')].filter((n) => { const cs = getComputedStyle(n); return accent && [cs.backgroundColor, cs.color, cs.borderColor].some((c) => c === accent); }).length;
      return {
        small: box.filter((b) => b.width < 43.5 || b.height < 43.5).length,
        count: days.length,
        weightSel: Number(getComputedStyle(sel).fontWeight), weightPlain: Number(getComputedStyle(plain).fontWeight),
        shadowSel: getComputedStyle(sel).boxShadow, shadowPlain: getComputedStyle(plain).boxShadow,
        markW: mark ? mark.width : 0, markH: mark ? mark.height : 0,
        plainHasMark: !!plain.querySelector('span'), orange,
      };
    });
    expect(r.count >= 28 && r.small === 0, `${r.small} of ${r.count} days are under 44px`);
    expect(r.weightSel > r.weightPlain, `chosen weight ${r.weightSel} is not above ${r.weightPlain}`);
    expect(r.shadowSel !== 'none' && r.shadowPlain === 'none', 'the chosen day has no recess of its own');
    expect(r.markW > 0 && r.markH > 0 && !r.plainHasMark, `today bar ${r.markW}x${r.markH}, plain day has a bar: ${r.plainHasMark}`);
    expect(r.orange === 0, `${r.orange} orange parts`);
    return `${r.count} days at 44px, chosen weight ${r.weightSel} vs ${r.weightPlain} with a recess, today bar ${Math.round(r.markW)}px wide, no orange`;
  });
}
