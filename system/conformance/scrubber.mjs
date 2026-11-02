// Behaviour checks for Scrubber (the seekable position of a track), run by tooling/kiln/conformance.mjs on the built book.
export default async function scrubber({ check, expect, page, go, main, tokens }) {
  const px = (s) => parseFloat(s);
  const ROUTE = '/components/scrubber/code';
  const first = () => main().locator('[data-component="Scrubber"] [role="slider"]:not([aria-disabled="true"])').first();
  const now = (s) => s.getAttribute('aria-valuenow').then(Number);

  await check('Scrubber', 'Tab reaches the scrubber and the focus ring shows', async () => {
    await go(ROUTE);
    const s = first();
    await s.focus(); await page.keyboard.press('Shift+Tab'); await page.keyboard.press('Tab');
    const st = await s.evaluate((el) => ({ focused: document.activeElement === el, w: getComputedStyle(el).outlineWidth, s: getComputedStyle(el).outlineStyle }));
    expect(st.focused, 'the scrubber did not take focus');
    expect(st.s !== 'none' && px(st.w) >= 2, `outline ${st.s} ${st.w}`);
    return `outline ${st.w}`;
  });

  await check('Scrubber', 'arrow keys move five seconds and Home and End reach the ends', async () => {
    await go(ROUTE);
    const s = first();
    const max = Number(await s.getAttribute('aria-valuemax'));
    await s.focus(); await page.keyboard.press('Home');
    expect((await now(s)) === 0, `Home gave ${await now(s)}`);
    await page.keyboard.press('ArrowRight'); const one = await now(s);
    await page.keyboard.press('ArrowLeft'); const back = await now(s);
    await page.keyboard.press('End'); const end = await now(s);
    expect(one === 5 && back === 0, `ArrowRight ${one}, ArrowLeft ${back}`);
    expect(end === max, `End gave ${end}, not ${max}`);
    return `0 → ${one} → ${back} → ${end}`;
  });

  await check('Scrubber', 'Page Up and Page Down move thirty seconds', async () => {
    await go(ROUTE);
    const s = first();
    await s.focus(); await page.keyboard.press('Home'); await page.keyboard.press('PageUp'); const up = await now(s);
    await page.keyboard.press('PageDown'); const down = await now(s);
    expect(up === 30 && down === 0, `PageUp ${up}, PageDown ${down}`);
    return `0 → ${up} → ${down}`;
  });

  await check('Scrubber', 'the value text says the position of the length in minutes and seconds', async () => {
    await go(ROUTE);
    const s = first();
    await s.focus(); await page.keyboard.press('Home'); await page.keyboard.press('PageUp'); await page.keyboard.press('PageUp'); await page.keyboard.press('ArrowRight');
    const t = await s.getAttribute('aria-valuetext');
    expect(/^1:05 of \d+:\d\d/.test(t ?? ''), `aria-valuetext "${t}"`);
    const printed = await s.evaluate((e) => e.parentElement.lastElementChild.textContent);
    expect(printed.startsWith('1:05') && printed.includes('−'), `printed times "${printed}"`);
    return t;
  });

  await check('Scrubber', 'the scrubber is at least the touch target tall and keeps its size from Home to End', async () => {
    await go(ROUTE);
    const min = px(tokens['layout.touch']?.value ?? '44px');
    const hs = await main().locator('[data-component="Scrubber"] [role="slider"]').evaluateAll((els) => els.map((e) => e.getBoundingClientRect().height));
    expect(hs.length > 0 && hs.every((h) => h >= min - 0.5), `heights ${hs.join(', ')} (min ${min})`);
    const s = first();
    const box = () => s.evaluate((e) => { const r = e.closest('[data-component]').getBoundingClientRect(); return [r.width, r.height]; });
    await s.focus(); await page.keyboard.press('Home'); const lo = await box();
    await page.keyboard.press('End'); const hi = await box();
    expect(lo[0] >= 200 && Math.abs(lo[0] - hi[0]) <= 1 && Math.abs(lo[1] - hi[1]) <= 1, `Home ${lo.join('x')}, End ${hi.join('x')}`);
    return `${Math.min(...hs)}px tall, ${Math.round(lo[0])}px long`;
  });

  await check('Scrubber', 'no part of the scrubber is the accent', async () => {
    await go(ROUTE);
    const r = await main().locator('[data-component="Scrubber"]').first().evaluate((root) => {
      const probe = document.createElement('span'); probe.style.color = 'var(--ds-action-accent)'; document.body.append(probe);
      const accent = getComputedStyle(probe).color; probe.remove();
      return [...root.querySelectorAll('*')].filter((n) => { const c = getComputedStyle(n); return [c.backgroundColor, c.borderInlineStartColor].includes(accent); }).length;
    });
    expect(r === 0, `${r} parts in the accent`);
    return 'no accent';
  });

  const capAt = (s) => s.evaluate((e) => e.querySelector(':scope > div:last-child').getBoundingClientRect().left);
  await check('Scrubber', 'a seek by key travels the cap on the spring', async () => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    try {
      await go(ROUTE);
      const s = first();
      await s.focus(); await page.keyboard.press('Home'); await page.waitForTimeout(600);
      const x0 = await capAt(s);
      await page.keyboard.press('End');
      await page.waitForTimeout(40); const mid = await capAt(s);
      await page.waitForTimeout(700); const x1 = await capAt(s);
      expect(x1 > x0 && mid > x0 && mid < x1 - 1, `cap at ${x0}, then ${mid}, then ${x1}`);
      return `travelled ${Math.round(x1 - x0)}px, mid-way ${Math.round(mid - x0)}px`;
    } finally { await page.emulateMedia({ reducedMotion: 'reduce' }); }
  });

  await check('Scrubber', 'under reduce motion a seek lands at once', async () => {
    await go(ROUTE);
    const s = first();
    await s.focus(); await page.keyboard.press('Home'); const x0 = await capAt(s);
    await page.keyboard.press('End'); const x1 = await capAt(s);
    await page.waitForTimeout(300); const x2 = await capAt(s);
    expect(x1 > x0 && Math.abs(x2 - x1) < 0.5, `cap at ${x0}, then ${x1}, then ${x2}`);
    return 'no travel';
  });
  // glass (P9, D-007): the cap is frosted and the played stretch is lit up to its centre
  await check('Scrubber', 'the cap is frosted glass and the played light ends at the cap', async () => {
    await go(ROUTE);
    const s = main().locator('[data-component="Scrubber"][data-tint="warm"] [role="slider"]').first();
    await s.focus(); await page.keyboard.press('ArrowRight');
    const st = await s.evaluate((e) => {
      const g = e.querySelector('[class*="groove"]'), gb = g.getBoundingClientRect(), f = g.firstElementChild.getBoundingClientRect();
      const cap = e.querySelector(':scope > div:last-child'), c = cap.getBoundingClientRect(), cs = getComputedStyle(cap);
      return { end: f.right - gb.left, mid: c.left + c.width / 2 - gb.left, f: cs.backdropFilter || cs.webkitBackdropFilter || 'none' };
    });
    expect(/blur\(/.test(st.f), `cap filter ${st.f}`);
    expect(Math.abs(st.end - st.mid) <= 2, `played light ends at ${st.end}px, cap centre at ${st.mid}px`);
    return `light to ${Math.round(st.end)}px`;
  });
}
