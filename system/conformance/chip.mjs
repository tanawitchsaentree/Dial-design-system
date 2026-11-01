// Behaviour checks for Chip, run by tooling/kiln/conformance.mjs on the built book. Chip is a small
// capsule key: a toggle chip latches down (aria-pressed), a removable chip has its own round remove key.
export default async function chip({ check, expect, page, go, main, tokens }) {
  const px = (s) => parseFloat(s);
  const KEY = '[data-component="Chip"][data-form="toggle"]:not([data-disabled]) > button';
  const first = () => main().locator(KEY).first();
  const dyOf = (t) => Number((String(t).match(/matrix\(([^)]+)\)/)?.[1] ?? '').split(',')[5] ?? 0) || 0;

  await check('Chip', 'it is a toggle button with a name and a pressed state', async () => {
    await go('/components/chip/code');
    const st = await first().evaluate((el) => ({ pressed: el.getAttribute('aria-pressed'), name: el.textContent.trim(), tag: el.tagName }));
    expect(st.tag === 'BUTTON', `element ${st.tag}`);
    expect(st.pressed === 'true' || st.pressed === 'false', `aria-pressed ${st.pressed}`);
    expect(st.name.length > 0, 'the chip has no name');
    return `"${st.name}", aria-pressed ${st.pressed}`;
  });

  await check('Chip', 'Tab reaches the chip and the focus ring shows', async () => {
    await go('/components/chip/code');
    const b = first();
    await b.focus(); await page.keyboard.press('Shift+Tab'); await page.keyboard.press('Tab');
    const st = await b.evaluate((el) => ({ focused: document.activeElement === el, w: getComputedStyle(el).outlineWidth, s: getComputedStyle(el).outlineStyle }));
    expect(st.focused, 'the chip did not take focus');
    expect(st.s !== 'none' && px(st.w) >= 2, `outline ${st.s} ${st.w}`);
    return `outline ${st.w}`;
  });

  await check('Chip', 'Space and Enter latch and release the chip', async () => {
    await go('/components/chip/code');
    const b = first();
    const read = () => b.getAttribute('aria-pressed');
    await b.focus();
    const a = await read();
    await page.keyboard.press('Space'); const s = await read();
    await page.keyboard.press('Enter'); const e = await read();
    expect(a !== s && s !== e && a === e, `aria-pressed ${a} → ${s} → ${e}`);
    return `${a} → ${s} → ${e}`;
  });

  // under reduce motion the token build sets the travel to 0, so the latch depth is read with motion on
  await check('Chip', 'a latched chip stays down by its travel with no shadow, its lamp lit', async () => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await go('/components/chip/code');
    await page.waitForTimeout(300);
    const r = await main().locator(`${KEY}[aria-pressed="true"]`).first().evaluate((el) => {
      const lamp = el.querySelector('span');
      const probe = (c) => { const d = document.createElement('span'); d.style.color = `var(${c})`; document.body.append(d); const x = getComputedStyle(d).color; d.remove(); return x; };
      return { t: getComputedStyle(el).transform, s: getComputedStyle(el).boxShadow, lamp: getComputedStyle(lamp).backgroundColor, ink: probe('--ds-text-primary') };
    });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    expect(r.s === 'none' && dyOf(r.t) > 0, `transform ${r.t}, shadow ${r.s}`);
    expect(r.lamp === r.ink, `lamp ${r.lamp}, ink ${r.ink}`);
    return `dy ${dyOf(r.t)}px, lamp ${r.lamp}`;
  });

  await check('Chip', 'no chip is orange, latched or not', async () => {
    await go('/components/chip/code');
    const r = await main().locator('[data-component="Chip"]').evaluateAll((els) => {
      const probe = (c) => { const d = document.createElement('span'); d.style.color = `var(${c})`; document.body.append(d); const x = getComputedStyle(d).color; d.remove(); return x; };
      const accent = probe('--ds-action-accent');
      const paints = els.flatMap((e) => [e, ...e.querySelectorAll('*')]).flatMap((n) => { const c = getComputedStyle(n); return [c.backgroundColor, c.borderTopColor, c.color]; });
      return { accent, hits: paints.filter((p) => p === accent).length, n: els.length };
    });
    expect(r.n > 0, 'no chips on the page');
    expect(r.hits === 0, `${r.hits} painted ${r.accent}`);
    return `${r.n} chips, no accent`;
  });

  await check('Chip', 'every chip and remove key answers across the touch target', async () => {
    await go('/components/chip/code');
    const min = px(tokens['layout.touch']?.value ?? '44px');
    const r = await main().locator('[data-component="Chip"] button:not([disabled])').evaluateAll((els, m) => els.map((b) => {
      b.scrollIntoView({ block: 'center' });
      const box = b.getBoundingClientRect(); const cx = box.left + box.width / 2, cy = box.top + box.height / 2;
      const hit = (x, y) => { const t = document.elementFromPoint(x, y); return !!t && (t === b || b.contains(t)); };
      const half = m / 2 - 1;
      return { h: hit(cx, cy - half) && hit(cx, cy + half), w: hit(cx - half, cy) && hit(cx + half, cy) || box.width >= m };
    }), min);
    expect(r.length > 0, 'no chip buttons on the page');
    const bad = r.filter((x) => !x.h || !x.w).length;
    expect(bad === 0, `${bad} of ${r.length} keys answer across less than ${min}px`);
    return `${r.length} keys, ${min}px`;
  });

  await check('Chip', 'the remove key takes the chip away', async () => {
    await go('/components/chip/code');
    const ex = main().locator('[data-component="Chip"][data-form="removable"]:not([data-disabled])').first().locator('xpath=..');
    const count = () => ex.locator('[data-component="Chip"]').count();
    const before = await count();
    const rm = ex.locator('[data-component="Chip"] button').first();
    const name = await rm.getAttribute('aria-label');
    await rm.focus(); await page.keyboard.press('Enter');
    const after = await count();
    expect(/^Remove\b/.test(name ?? ''), `remove key named ${name}`);
    expect(after === before - 1, `chips ${before} → ${after}`);
    return `"${name}", ${before} → ${after}`;
  });

  const pressed = async () => {
    await go('/components/chip/code');
    const b = main().locator(`${KEY}[aria-pressed="false"]`).first();
    await b.scrollIntoViewIfNeeded(); await page.waitForTimeout(100);
    const box = await b.boundingBox();
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2); await page.mouse.down();
    await page.waitForTimeout(150);
    const st = await b.evaluate((el) => ({ t: getComputedStyle(el).transform, s: getComputedStyle(el).boxShadow }));
    await page.mouse.up();
    return st;
  };
  await check('Chip', 'pressing drops the key by its travel and removes its shadow', async () => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    const st = await pressed();
    await page.emulateMedia({ reducedMotion: 'reduce' });
    expect(st.s === 'none' && dyOf(st.t) > 0, `transform ${st.t}, shadow ${st.s}`);
    return `dy ${dyOf(st.t)}px`;
  });
  await check('Chip', 'under reduce motion a press flattens the key without travel', async () => {
    const st = await pressed();
    expect(st.s === 'none' && st.t === 'none', `transform ${st.t}, shadow ${st.s}`);
    return 'flat, no travel';
  });
}
