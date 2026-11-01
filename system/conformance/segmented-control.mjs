// Behaviour checks for SegmentedControl, run by tooling/kiln/conformance.mjs on the built book.
// A radiogroup of button keys with a roving tabindex; the latched key sits at height 0 with its lamp lit.
export default async function segmentedControl({ check, expect, page, go, main, tokens }) {
  const px = (s) => parseFloat(s);
  const ROUTE = '/components/segmented-control/code';
  const bank = () => main().locator('[data-component="SegmentedControl"] [role="radiogroup"]:not([aria-disabled])').first();
  const checkedIndex = (g) => g.locator('[role="radio"]').evaluateAll((els) => els.findIndex((e) => e.getAttribute('aria-checked') === 'true'));
  const focusedIndex = (g) => g.locator('[role="radio"]').evaluateAll((els) => els.indexOf(document.activeElement));
  const start = async () => {
    await go(ROUTE);
    const g = bank();
    await g.locator('[role="radio"]').first().click();
    return g;
  };

  await check('SegmentedControl', 'Tab reaches the latched key and the focus ring shows', async () => {
    const g = await start();
    const first = g.locator('[role="radio"]').first();
    await first.focus(); await page.keyboard.press('Shift+Tab'); await page.keyboard.press('Tab');
    const st = await first.evaluate((el) => ({ f: document.activeElement === el, w: getComputedStyle(el).outlineWidth, s: getComputedStyle(el).outlineStyle }));
    const stops = await g.locator('[role="radio"][tabindex="0"]').count();
    expect(st.f, 'the latched key did not take focus');
    expect(stops === 1, `${stops} keys in the tab order (want 1)`);
    expect(st.s !== 'none' && px(st.w) >= 2, `outline ${st.s} ${st.w}`);
    return `one tab stop, outline ${st.w}`;
  });

  await check('SegmentedControl', 'arrow keys move to the next key and latch it', async () => {
    const g = await start();
    await g.locator('[role="radio"]').first().focus();
    await page.keyboard.press('ArrowRight');
    const a = [await checkedIndex(g), await focusedIndex(g)];
    await page.keyboard.press('ArrowLeft');
    const b = [await checkedIndex(g), await focusedIndex(g)];
    expect(a[0] === 1 && a[1] === 1, `after ArrowRight checked ${a[0]}, focus ${a[1]}`);
    expect(b[0] === 0 && b[1] === 0, `after ArrowLeft checked ${b[0]}, focus ${b[1]}`);
    return 'ArrowRight → 1, ArrowLeft → 0';
  });

  await check('SegmentedControl', 'Home and End latch the first and last keys', async () => {
    const g = await start();
    const n = await g.locator('[role="radio"]').count();
    await g.locator('[role="radio"]').first().focus();
    await page.keyboard.press('End');
    const e = await checkedIndex(g);
    await page.keyboard.press('Home');
    const h = await checkedIndex(g);
    expect(e === n - 1 && h === 0, `End → ${e}, Home → ${h} (of ${n})`);
    return `End → ${e}, Home → ${h}`;
  });

  await check('SegmentedControl', 'the latched key is told by depth and a lit lamp, never orange', async () => {
    const g = await start();
    const st = await g.locator('[role="radio"]').evaluateAll((els) => els.map((el) => {
      const cs = getComputedStyle(el);
      const lamp = getComputedStyle(el.querySelector('span'));
      return { on: el.getAttribute('aria-checked') === 'true', shadow: cs.boxShadow, bg: cs.backgroundColor, lamp: lamp.backgroundColor };
    }));
    const on = st.find((s) => s.on); const off = st.find((s) => !s.on);
    const accent = await page.evaluate(() => { const d = document.createElement('div'); d.style.color = 'var(--ds-action-accent)'; document.body.append(d); const c = getComputedStyle(d).color; d.remove(); return c; });
    expect(st.filter((s) => s.on).length === 1, `${st.filter((s) => s.on).length} keys latched`);
    expect(on.shadow === 'none' && off.shadow !== 'none', `shadow latched ${on.shadow}, released ${off.shadow}`);
    expect(on.lamp !== off.lamp, `lamp latched ${on.lamp}, released ${off.lamp}`);
    expect(on.bg !== accent && on.lamp !== accent, `latched key uses the accent ${accent}`);
    return `latched flat, lamp ${on.lamp}`;
  });

  await check('SegmentedControl', 'every key is at least the touch target', async () => {
    await go(ROUTE);
    const min = px(tokens['layout.touch']?.value ?? '44px');
    const rs = await main().locator('[data-component="SegmentedControl"] [role="radio"]').evaluateAll((els) => els.map((e) => { const r = e.getBoundingClientRect(); return [r.width, r.height]; }));
    expect(rs.length > 0, 'no keys on the page');
    expect(rs.every(([w, h]) => w >= min - 0.5 && h >= min - 0.5), `smallest ${Math.min(...rs.map((r) => r[0]))}×${Math.min(...rs.map((r) => r[1]))} (min ${min})`);
    return `${Math.min(...rs.map((r) => r[1]))}px min height`;
  });

  const pressReleased = async () => {
    const g = await start();
    const key = g.locator('[role="radio"]').nth(1);
    const box = await key.boundingBox();
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2); await page.mouse.down();
    await page.waitForTimeout(150);
    const st = await key.evaluate((el) => ({ t: getComputedStyle(el).transform, s: getComputedStyle(el).boxShadow }));
    await page.mouse.up();
    return st;
  };
  await check('SegmentedControl', 'pressing a released key drops it by its travel and removes its shadow', async () => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    const st = await pressReleased();
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const dy = Number((st.t.match(/matrix\(([^)]+)\)/)?.[1] ?? '').split(',')[5]);
    expect(st.s === 'none' && dy > 0, `transform ${st.t}, shadow ${st.s}`);
    return `dy ${dy}px`;
  });
  await check('SegmentedControl', 'under reduce motion a press flattens the key without travel', async () => {
    const st = await pressReleased();
    expect(st.s === 'none' && st.t === 'none', `transform ${st.t}, shadow ${st.s}`);
    return 'flat, no travel';
  });
}
