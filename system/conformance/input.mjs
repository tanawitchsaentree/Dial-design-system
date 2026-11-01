// Behaviour checks for Input (a recessed well), run by tooling/kiln/conformance.mjs on the built book.
export default async function input({ check, expect, page, go, main, tokens }) {
  const px = (s) => parseFloat(s);
  const first = () => main().locator('[data-component="Input"] input:not(:disabled):not([readonly])').first();
  await check('Input', 'Tab reaches the field and the focus ring shows on the well', async () => {
    await go('/components/input/code');
    const f = first();
    await f.focus(); await page.keyboard.press('Shift+Tab'); await page.keyboard.press('Tab');
    const st = await f.evaluate((el) => {
      const well = el.parentElement; const cs = getComputedStyle(well);
      return { focused: document.activeElement === el, w: cs.outlineWidth, s: cs.outlineStyle };
    });
    expect(st.focused, 'the field did not take focus');
    expect(st.s !== 'none' && px(st.w) >= 2, `well outline ${st.s} ${st.w}`);
    return `outline ${st.w}`;
  });
  await check('Input', 'the printed label names the field and is not a placeholder', async () => {
    await go('/components/input/code');
    const res = await main().locator('[data-component="Input"]').evaluateAll((els) => els.map((el) => {
      const f = el.querySelector('input'); const l = el.querySelector('label');
      return { ok: !!l && l.htmlFor === f.id && (l.textContent ?? '').trim().length > 0, text: l?.textContent ?? '' };
    }));
    const bad = res.filter((r) => !r.ok);
    expect(res.length > 0 && bad.length === 0, `${bad.length} of ${res.length} fields have no printed label`);
    return `${res.length} fields labelled`;
  });
  await check('Input', 'the well is at least the touch target tall and its line box fits Thai marks', async () => {
    await go('/components/input/code');
    const min = px(tokens['layout.touch']?.value ?? '44px');
    const rows = await main().locator('[data-component="Input"] input').evaluateAll((els) => els.map((el) => {
      const cs = getComputedStyle(el); return { h: el.parentElement.getBoundingClientRect().height, r: parseFloat(cs.lineHeight) / parseFloat(cs.fontSize) };
    }));
    expect(rows.length > 0 && rows.every((x) => x.h >= min - 0.5), `heights ${rows.map((x) => x.h).join(', ')} (min ${min})`);
    expect(rows.every((x) => x.r >= 1.35), `line boxes ${rows.map((x) => x.r.toFixed(2)).join(', ')}em (need 1.35)`);
    return `${Math.min(...rows.map((x) => x.h))}px tall, line box ${Math.min(...rows.map((x) => x.r)).toFixed(2)}em`;
  });
  await check('Input', 'typing Thai text keeps the field at its width', async () => {
    await go('/components/input/code');
    const f = first();
    const w = () => f.evaluate((el) => el.closest('[data-component="Input"]').getBoundingClientRect().width);
    const before = await w();
    await f.fill('เหี่ยะอะไรเนี่ย ปู่ฤๅษี เหี่ยะอะไรเนี่ย ปู่ฤๅษี เหี่ยะอะไรเนี่ย');
    const after = await w();
    expect(Math.abs(after - before) <= 1, `${before}px empty, ${after}px while typing`);
    return `${Math.round(before)}px both`;
  });
  await check('Input', 'an error sets aria-invalid and is described by words with a glyph', async () => {
    await go('/components/input/code');
    const res = await main().locator('[data-component="Input"][data-invalid="true"]').first().evaluate((el) => {
      const f = el.querySelector('input'); const ids = (f.getAttribute('aria-describedby') ?? '').split(/\s+/);
      const msg = [...el.querySelectorAll('p')].find((p) => ids.includes(p.id) && p.querySelector('svg'));
      return { invalid: f.getAttribute('aria-invalid'), words: msg?.textContent?.trim() ?? '', glyph: !!msg?.querySelector('svg') };
    });
    expect(res.invalid === 'true', `aria-invalid is ${res.invalid}`);
    expect(res.glyph && res.words.split(/\s+/).length >= 2, `message "${res.words}", glyph ${res.glyph}`);
    return `"${res.words}"`;
  });
}
