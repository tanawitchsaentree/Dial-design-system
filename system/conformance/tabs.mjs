// Behaviour checks for Tabs, run by tooling/kiln/conformance.mjs on the built book.
// WAI-ARIA tabs: one tab stop, arrows choose (automatic) or only move focus (manual), Home and End.
export default async function tabs({ check, expect, page, go, main, tokens }) {
  const px = (s) => parseFloat(s);
  const ROUTE = '/components/tabs/code';
  const auto = () => main().locator('[data-component="Tabs"][data-activation="automatic"]').first();
  const manual = () => main().locator('[data-component="Tabs"][data-activation="manual"]').first();
  const selected = (t) => t.locator(':scope > [role="tablist"] > [role="tab"]').evaluateAll((els) => els.findIndex((e) => e.getAttribute('aria-selected') === 'true'));
  const focused = (t) => t.locator(':scope > [role="tablist"] > [role="tab"]').evaluateAll((els) => els.indexOf(document.activeElement));
  const visiblePanel = (t) => t.locator(':scope > [role="tabpanel"]:not([hidden]), :scope > * > [role="tabpanel"]:not([hidden])').evaluateAll((els) => els.map((e) => e.getAttribute('aria-labelledby')));
  const start = async (pick) => {
    await go(ROUTE);
    const t = pick();
    await t.locator(':scope > [role="tablist"] > [role="tab"]').first().click();
    return t;
  };

  await check('Tabs', 'Tab reaches the chosen tab and the focus ring shows', async () => {
    const t = await start(auto);
    const first = t.locator(':scope > [role="tablist"] > [role="tab"]').first();
    await first.focus(); await page.keyboard.press('Shift+Tab'); await page.keyboard.press('Tab');
    const st = await first.evaluate((el) => ({ f: document.activeElement === el, w: getComputedStyle(el).outlineWidth, s: getComputedStyle(el).outlineStyle }));
    const stops = await t.locator(':scope > [role="tablist"] > [role="tab"][tabindex="0"]').count();
    expect(st.f, 'the chosen tab did not take focus');
    expect(stops === 1, `${stops} tabs in the tab order (want 1)`);
    expect(st.s !== 'none' && px(st.w) >= 2, `outline ${st.s} ${st.w}`);
    return `one tab stop, outline ${st.w}`;
  });

  await check('Tabs', 'arrow keys choose the next tab and show its panel', async () => {
    const t = await start(auto);
    await t.locator(':scope > [role="tablist"] > [role="tab"]').first().focus();
    await page.keyboard.press('ArrowRight');
    const s = await selected(t); const f = await focused(t);
    const id = await t.locator(':scope > [role="tablist"] > [role="tab"]').nth(1).getAttribute('id');
    const panels = await visiblePanel(t);
    expect(s === 1 && f === 1, `selected ${s}, focus ${f}`);
    expect(panels.length === 1 && panels[0] === id, `visible panels ${JSON.stringify(panels)} (want ${id})`);
    return 'ArrowRight → tab 1 and its panel';
  });

  await check('Tabs', 'Home and End choose the first and last tabs', async () => {
    const t = await start(auto);
    const n = await t.locator(':scope > [role="tablist"] > [role="tab"]').count();
    await t.locator(':scope > [role="tablist"] > [role="tab"]').first().focus();
    await page.keyboard.press('End');
    const e = await selected(t);
    await page.keyboard.press('Home');
    const h = await selected(t);
    expect(e === n - 1 && h === 0, `End → ${e}, Home → ${h} (of ${n})`);
    return `End → ${e}, Home → ${h}`;
  });

  await check('Tabs', 'with manual activation arrows move focus and Enter chooses', async () => {
    const t = await start(manual);
    await t.locator(':scope > [role="tablist"] > [role="tab"]').first().focus();
    await page.keyboard.press('ArrowRight');
    const a = [await selected(t), await focused(t)];
    await page.keyboard.press('Enter');
    const b = await selected(t);
    expect(a[0] === 0 && a[1] === 1, `after ArrowRight selected ${a[0]}, focus ${a[1]}`);
    expect(b === 1, `after Enter selected ${b}`);
    return 'focus moves, Enter chooses';
  });

  await check('Tabs', 'every tab is at least the touch target', async () => {
    await go(ROUTE);
    const min = px(tokens['layout.touch']?.value ?? '44px');
    const rs = await main().locator('[data-component="Tabs"] [role="tab"]').evaluateAll((els) => els.filter((e) => e.offsetParent).map((e) => { const r = e.getBoundingClientRect(); return [r.width, r.height]; }));
    expect(rs.length > 0, 'no tabs on the page');
    expect(rs.every(([w, h]) => w >= min - 0.5 && h >= min - 0.5), `smallest ${Math.min(...rs.map((r) => r[0]))}×${Math.min(...rs.map((r) => r[1]))} (min ${min})`);
    return `${Math.min(...rs.map((r) => r[1]))}px min height`;
  });

  await check('Tabs', 'the chosen tab has an ink index mark and weight, never orange or height', async () => {
    const t = await start(auto);
    const st = await t.locator(':scope > [role="tablist"] > [role="tab"]').evaluateAll((els) => els.map((el) => {
      const cs = getComputedStyle(el); const mark = getComputedStyle(el.lastElementChild); const word = getComputedStyle(el.querySelector('span span'));
      return { on: el.getAttribute('aria-selected') === 'true', shadow: cs.boxShadow, mark: mark.backgroundColor, weight: word.fontWeight, color: cs.color };
    }));
    const on = st.find((s) => s.on); const off = st.find((s) => !s.on);
    const accent = await page.evaluate(() => { const d = document.createElement('div'); d.style.color = 'var(--ds-action-accent)'; document.body.append(d); const c = getComputedStyle(d).color; d.remove(); return c; });
    expect(on.mark !== off.mark && off.mark === 'rgba(0, 0, 0, 0)', `mark chosen ${on.mark}, other ${off.mark}`);
    expect(Number(on.weight) > Number(off.weight), `weight chosen ${on.weight}, other ${off.weight}`);
    expect(on.mark !== accent && on.color !== accent, `chosen tab uses the accent ${accent}`);
    expect(st.every((s) => s.shadow === 'none'), 'a tab casts a shadow');
    return `mark ${on.mark}, weight ${on.weight}`;
  });

  await check('Tabs', 'the index mark inks in where it stands and never slides', async () => {
    // D-008 / R-004: every change moves, but the mark fades in place; nothing travels along the row
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    const t = await start(auto);
    const tr = await t.locator(':scope > [role="tablist"] > [role="tab"] > span:last-child').first().evaluate((el) => { const cs = getComputedStyle(el); return { prop: cs.transitionProperty, dur: cs.transitionDuration }; });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const moves = tr.prop.split(',').map((x) => x.trim()).filter((x) => /transform|translate|left|right|inset|margin|all/.test(x));
    expect(!moves.length && tr.dur.split(',').some((d) => parseFloat(d) > 0), `mark transition ${tr.prop} ${tr.dur}`);
    return `mark transition ${tr.prop} ${tr.dur}`;
  });
}
