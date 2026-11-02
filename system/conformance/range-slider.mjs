// Behaviour checks for RangeSlider (two caps in one fader groove), run by tooling/kiln/conformance.mjs on the built book.
export default async function rangeSlider({ check, expect, page, go, main, tokens }) {
  const px = (s) => parseFloat(s);
  const ROUTE = '/components/range-slider/code';
  const live = () => main().locator('[data-component="RangeSlider"]:not(:has([aria-disabled="true"]))').first();
  const thumbs = () => live().locator('[role="slider"]');
  const num = (l, a) => l.getAttribute(a).then(Number);

  await check('RangeSlider', 'Tab reaches each cap and the focus ring shows on it', async () => {
    await go(ROUTE);
    const [lo, hi] = [thumbs().nth(0), thumbs().nth(1)];
    await lo.focus(); await page.keyboard.press('Tab');
    const st = await hi.evaluate((el) => {
      const cap = el.querySelector('div'); const cs = getComputedStyle(cap);
      return { focused: document.activeElement === el, w: cs.outlineWidth, s: cs.outlineStyle };
    });
    expect(st.focused, 'Tab from the low cap did not reach the high cap');
    expect(st.s !== 'none' && px(st.w) >= 2, `outline ${st.s} ${st.w}`);
    return `low → high, outline ${st.w}`;
  });

  await check('RangeSlider', 'arrow keys move one cap one step and the caps never cross', async () => {
    await go(ROUTE);
    const [lo, hi] = [thumbs().nth(0), thumbs().nth(1)];
    const lo0 = await num(lo, 'aria-valuenow'); const hi0 = await num(hi, 'aria-valuenow');
    await lo.focus(); await page.keyboard.press('ArrowRight');
    const lo1 = await num(lo, 'aria-valuenow');
    expect(lo1 > lo0 && (await num(hi, 'aria-valuenow')) === hi0, `low ${lo0} → ${lo1}, high moved`);
    for (let i = 0; i < 40; i++) await page.keyboard.press('ArrowRight');
    const loMax = await num(lo, 'aria-valuenow'); const hiNow = await num(hi, 'aria-valuenow');
    expect(loMax <= hiNow, `low ${loMax} passed high ${hiNow}`);
    expect((await num(lo, 'aria-valuemax')) === hiNow, `low's aria-valuemax ${await lo.getAttribute('aria-valuemax')} is not the high value ${hiNow}`);
    expect(!!(await lo.getAttribute('aria-valuetext')), 'no aria-valuetext');
    return `low ${lo0} → ${lo1} → stopped at ${loMax} (high ${hiNow})`;
  });

  await check('RangeSlider', 'Page Up and Page Down move more than one step', async () => {
    await go(ROUTE);
    const hi = thumbs().nth(1);
    await hi.focus(); await page.keyboard.press('End');
    const end = await num(hi, 'aria-valuenow');
    await page.keyboard.press('ArrowLeft'); const one = end - (await num(hi, 'aria-valuenow'));
    await page.keyboard.press('End'); await page.keyboard.press('PageDown'); const pg = end - (await num(hi, 'aria-valuenow'));
    expect(pg > one, `step ${one}, page ${pg}`);
    return `page ${pg} vs step ${one}`;
  });

  await check('RangeSlider', 'Home and End stop each cap at the other one', async () => {
    await go(ROUTE);
    const [lo, hi] = [thumbs().nth(0), thumbs().nth(1)];
    const min = await num(lo, 'aria-valuemin'); const max = await num(hi, 'aria-valuemax');
    await lo.focus(); await page.keyboard.press('Home');
    expect((await num(lo, 'aria-valuenow')) === min, 'Home did not take the low cap to the start');
    await page.keyboard.press('End');
    const loEnd = await num(lo, 'aria-valuenow'); const hiv = await num(hi, 'aria-valuenow');
    expect(loEnd <= hiv, `End took the low cap to ${loEnd}, past the high cap at ${hiv}`);
    await hi.focus(); await page.keyboard.press('Home');
    const hiHome = await num(hi, 'aria-valuenow');
    expect(hiHome >= loEnd, `Home took the high cap to ${hiHome}, under the low cap at ${loEnd}`);
    await page.keyboard.press('End');
    expect((await num(hi, 'aria-valuenow')) === max, 'End did not take the high cap to the end');
    return `low ${min}..${loEnd}, high ${hiHome}..${max}`;
  });

  await check('RangeSlider', 'each cap is named, at least the touch target, and the range keeps its size', async () => {
    await go(ROUTE);
    const min = px(tokens['layout.touch']?.value ?? '44px');
    const r = await main().locator('[data-component="RangeSlider"] [role="slider"]').evaluateAll((els) => els.map((e) => {
      const b = e.getBoundingClientRect();
      const name = (e.getAttribute('aria-labelledby') ?? '').split(/\s+/).map((id) => document.getElementById(id)?.textContent?.trim() ?? '').join(' ').trim();
      return { w: b.width, h: b.height, name };
    }));
    expect(r.length >= 2, 'no caps');
    const small = r.filter((x) => x.w < min - 0.5 || x.h < min - 0.5);
    expect(!small.length, `small: ${small.map((x) => `${x.w}x${x.h}`).join(', ')}`);
    const unnamed = r.filter((x) => x.name.split(' ').length < 2);
    expect(!unnamed.length, `caps need the label and their own name: ${unnamed.map((x) => x.name).join(' | ')}`);
    const lo = thumbs().nth(0);
    const box = () => live().evaluate((e) => { const b = e.getBoundingClientRect(); return [b.width, b.height]; });
    await lo.focus(); await page.keyboard.press('Home'); const a = await box();
    await page.keyboard.press('End'); const b = await box();
    expect(a[0] >= 200 && Math.abs(a[0] - b[0]) <= 1 && Math.abs(a[1] - b[1]) <= 1, `Home ${a.join('x')}, End ${b.join('x')}`);
    return `${r.length} caps ≥ ${min}px, named "${r[0].name}"`;
  });

  await check('RangeSlider', 'no part of the range is the accent', async () => {
    await go(ROUTE);
    const r = await live().evaluate((root) => {
      const probe = document.createElement('span'); probe.style.color = 'var(--ds-action-accent)'; document.body.append(probe);
      const accent = getComputedStyle(probe).color; probe.remove();
      const hits = [...root.querySelectorAll('*')].filter((n) => { const c = getComputedStyle(n); return [c.backgroundColor, c.borderInlineStartColor, c.color].includes(accent); });
      return { accent, hits: hits.length };
    });
    expect(r.hits === 0, `${r.hits} parts in ${r.accent}`);
    return 'no accent';
  });

  const capAt = (t) => t.evaluate((e) => e.querySelector('div').getBoundingClientRect().left);
  await check('RangeSlider', 'a key press travels the cap on the spring and settles on the step', async () => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    try {
      await go(ROUTE);
      const hi = thumbs().nth(1);
      await hi.focus(); await page.keyboard.press('Home'); await page.waitForTimeout(600);
      const x0 = await capAt(hi);
      await page.keyboard.press('End');
      await page.waitForTimeout(40); const mid = await capAt(hi);
      await page.waitForTimeout(700); const x1 = await capAt(hi);
      expect(x1 > x0 && mid > x0 && mid < x1 - 1, `cap at ${x0}, then ${mid}, then ${x1}`);
      return `travelled ${Math.round(x1 - x0)}px, mid-way ${Math.round(mid - x0)}px`;
    } finally { await page.emulateMedia({ reducedMotion: 'reduce' }); }
  });

  await check('RangeSlider', 'under reduce motion the cap lands on the step at once', async () => {
    await go(ROUTE);
    const hi = thumbs().nth(1);
    await hi.focus(); await page.keyboard.press('Home'); const x0 = await capAt(hi);
    await page.keyboard.press('End'); const x1 = await capAt(hi);
    await page.waitForTimeout(300); const x2 = await capAt(hi);
    expect(x1 > x0 && Math.abs(x2 - x1) < 0.5, `cap at ${x0}, then ${x1}, then ${x2}`);
    return 'no travel';
  });
  // glass (P9, D-007): both caps are frosted, and the groove is lit from one cap's centre to the other's
  await check('RangeSlider', 'both caps are frosted glass and the band light runs from cap to cap', async () => {
    await go(ROUTE);
    const r = main().locator('[data-component="RangeSlider"][data-tint="warm"]').first();
    await r.locator('[data-thumb="high"]').focus(); await page.keyboard.press('ArrowLeft');
    const st = await r.evaluate((e) => {
      const g = e.querySelector('[class*="groove"]'), f = g.firstElementChild.getBoundingClientRect(), gb = g.getBoundingClientRect();
      const mid = (k) => { const c = e.querySelector(`[data-thumb="${k}"] > div`).getBoundingClientRect(); return c.left + c.width / 2 - gb.left; };
      const filt = [...e.querySelectorAll('[data-thumb] > div')].map((c) => getComputedStyle(c).backdropFilter || getComputedStyle(c).webkitBackdropFilter || 'none');
      return { from: f.left - gb.left, to: f.right - gb.left, lo: mid('low'), hi: mid('high'), filt };
    });
    expect(st.filt.every((x) => /blur\(/.test(x)), `cap filters ${st.filt.join(' | ')}`);
    expect(Math.abs(st.from - st.lo) <= 2 && Math.abs(st.to - st.hi) <= 2, `light ${st.from}–${st.to}px, caps at ${st.lo} and ${st.hi}px`);
    return `light ${Math.round(st.from)}–${Math.round(st.to)}px`;
  });
}
