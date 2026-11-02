// Behaviour checks for Legend, run by tooling/kiln/conformance.mjs on the built book.
// P7: every choice printed, the one in use lit; the knob walks it, a press on a word picks it, one tab stop.
export default async function legend({ check, expect, page, go, main, tokens }) {
  const px = (s) => parseFloat(s);
  const ROUTE = '/components/legend/code';
  const knobbed = () => main().locator('[data-component="Legend"][data-control="rotary"]:not([data-disabled])').first();
  const arc = () => main().locator('[data-component="Legend"][data-layout="arc"]:not([data-disabled])').first();
  const alone = () => main().locator('[data-component="Legend"][data-control="none"]:not([data-disabled])').first();
  const lit = (l) => l.locator('[data-word]').evaluateAll((els) => els.findIndex((e) => e.dataset.state === 'on'));
  const slider = (l) => l.locator('[role="slider"]');

  await check('Legend', 'one tab stop for the whole legend', async () => {
    await go(ROUTE);
    const counts = await main().locator('[data-component="Legend"]').evaluateAll((ls) => ls.map((l) => [...l.querySelectorAll('button, [tabindex]')].filter((e) => e.tabIndex >= 0 && !e.disabled && !e.closest('[hidden]')).length));
    const withStops = counts.filter((n) => n > 0);
    expect(withStops.length > 0, 'no legend on the page takes focus');
    expect(withStops.every((n) => n === 1), `tab stops per legend ${JSON.stringify(counts)} (want 1 each)`);
    const l = knobbed();
    await slider(l).focus();
    const st = await slider(l).evaluate((el) => ({ w: getComputedStyle(el).outlineWidth, s: getComputedStyle(el).outlineStyle, d: el.getAttribute('aria-describedby') && document.getElementById(el.getAttribute('aria-describedby'))?.textContent }));
    expect(st.s !== 'none' && px(st.w) >= 2, `knob outline ${st.s} ${st.w}`);
    expect(st.d && / or /.test(st.d), `the knob's description does not list the choices (${st.d})`);
    return `${withStops.length} legends, one stop each; the knob's description lists ${st.d}`;
  });

  await check('Legend', 'arrow keys walk the lit word and Home and End reach the ends', async () => {
    await go(ROUTE);
    const out = [];
    for (const pick of [knobbed, alone]) {
      const l = pick();
      const n = await l.locator('[data-word]').count();
      const target = (await l.getAttribute('data-control')) === 'rotary' ? slider(l) : l.locator('[role="radio"][tabindex="0"]');
      await target.focus();
      await page.keyboard.press('Home'); const h = await lit(l);
      await page.keyboard.press('ArrowRight'); const a = await lit(l);
      await page.keyboard.press('ArrowDown'); const b = await lit(l);
      await page.keyboard.press('End'); const e = await lit(l);
      // the knob keeps Rotary's map (Down turns it back); a radio group follows the reading order (Down is the next word)
      const down = (await l.getAttribute('data-control')) === 'rotary' ? 0 : 2;
      expect(h === 0 && a === 1 && b === down && e === n - 1, `${await l.getAttribute('data-control')}: Home ${h}, ArrowRight ${a}, ArrowDown ${b} (want ${down}), End ${e} (of ${n})`);
      if ((await l.getAttribute('data-control')) === 'rotary') {
        const vt = await slider(l).getAttribute('aria-valuetext');
        const word = await l.locator('[data-word][data-state="on"] > span').first().textContent();
        expect(vt === word, `aria-valuetext "${vt}" is not the lit word "${word}"`);
      } else {
        const checked = await l.locator('[role="radio"][aria-checked="true"]').evaluate((el) => document.activeElement === el);
        expect(checked, 'focus did not follow the checked radio');
      }
      out.push(`${await l.getAttribute('data-control')} ok`);
    }
    return out.join(', ');
  });

  await check('Legend', 'turning the knob moves the lit word', async () => {
    await go(ROUTE);
    const l = knobbed();
    await slider(l).focus(); await page.keyboard.press('Home');
    const k = await slider(l).boundingBox();
    await page.mouse.move(k.x + k.width / 2, k.y + k.height / 2);
    await page.mouse.down();
    await page.mouse.move(k.x + k.width / 2, k.y + k.height / 2 - 90, { steps: 8 });
    await page.mouse.up();
    const i = await lit(l); const now = Number(await slider(l).getAttribute('aria-valuenow'));
    expect(i > 0 && i === now, `after a drag up the lit word is ${i}, the knob at ${now}`);
    return `drag up → word ${i}`;
  });

  await check('Legend', 'clicking a word picks it', async () => {
    await go(ROUTE);
    const out = [];
    for (const pick of [knobbed, arc, alone]) {
      const l = pick();
      const n = await l.locator('[data-word]').count();
      const want = (await lit(l)) === n - 1 ? 0 : n - 1;
      await l.locator('[data-word]').nth(want).click();
      const i = await lit(l);
      const mode = await l.getAttribute('data-control');
      expect(i === want, `${mode}: pressed word ${want}, lit ${i}`);
      if (mode === 'rotary') {
        const st = await slider(l).evaluate((el) => ({ now: Number(el.getAttribute('aria-valuenow')), f: document.activeElement === el }));
        expect(st.now === want && st.f, `${mode}: knob at ${st.now}, focused ${st.f}`);
      }
      out.push(`${await l.getAttribute('data-layout')} ${want}`);
    }
    return out.join(', ');
  });

  await check('Legend', 'every word shows in full', async () => {
    await go(ROUTE);
    const res = await main().locator('[data-component="Legend"]').evaluateAll((ls) => ls.flatMap((l) => {
      const words = [...l.querySelectorAll('[data-word]')];
      const rects = words.map((w) => w.querySelector('span').getBoundingClientRect());
      const bad = [];
      words.forEach((w, i) => {
        const t = w.querySelector('span');
        if (t.scrollWidth > Math.ceil(t.getBoundingClientRect().width) + 1 || getComputedStyle(w).whiteSpace !== 'nowrap') bad.push(`cut ${t.textContent}`);
        // nothing between the word and the page clips it
        for (let a = w.parentElement; a && a !== document.body; a = a.parentElement) {
          const cs = getComputedStyle(a); if (cs.overflow === 'visible' && cs.overflowX === 'visible') continue;
          const ar = a.getBoundingClientRect(); const r = rects[i];
          if (r.left < ar.left - 0.5 || r.right > ar.right + 0.5 || r.top < ar.top - 0.5 || r.bottom > ar.bottom + 0.5) { bad.push(`clipped ${t.textContent}`); break; }
        }
        for (let j = i + 1; j < rects.length; j++) {
          const a = rects[i], b = rects[j];
          if (a.left < b.right - 0.5 && b.left < a.right - 0.5 && a.top < b.bottom - 0.5 && b.top < a.bottom - 0.5) bad.push(`overlap ${t.textContent}/${words[j].querySelector('span').textContent}`);
        }
        const k = l.querySelector('[role="slider"]')?.getBoundingClientRect();
        if (k) { const r = rects[i]; if (r.left < k.right && k.left < r.right && r.top < k.bottom && k.top < r.bottom) bad.push(`on the knob ${t.textContent}`); }
      });
      return bad;
    }));
    expect(res.length === 0, res.slice(0, 5).join(' | '));
    return 'no word cut, clipped, overlapped or under the knob';
  });

  await check('Legend', 'every word is at least the touch target', async () => {
    await go(ROUTE);
    const min = px(tokens['layout.touch']?.value ?? '44px');
    const rs = await main().locator('[data-component="Legend"] [data-word]').evaluateAll((els) => els.filter((e) => e.offsetParent).map((e) => { const r = e.getBoundingClientRect(); return [r.width, r.height]; }));
    expect(rs.length > 0, 'no words on the page');
    expect(rs.every(([w, h]) => w >= min - 0.5 && h >= min - 0.5), `smallest ${Math.min(...rs.map((r) => r[0]))}×${Math.min(...rs.map((r) => r[1]))} (min ${min})`);
    return `${rs.length} words, ${Math.min(...rs.map((r) => r[1]))}px min height`;
  });

  await check('Legend', 'the lit word is full ink, medium and marked, the rest one step lighter at 4.5:1, never orange', async () => {
    await go(ROUTE);
    const l = knobbed();
    const st = await l.evaluate((root) => {
      const lum = (c) => { const m = c.match(/[\d.]+/g).map(Number); const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(m[0]) + 0.7152 * f(m[1]) + 0.0722 * f(m[2]); };
      const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
      const ground = (el) => { for (let a = el; a; a = a.parentElement) { const bg = getComputedStyle(a).backgroundColor; if (bg && !/rgba\(.*,\s*0\)$/.test(bg) && bg !== 'transparent') return bg; } return 'rgb(255, 255, 255)'; };
      const words = [...root.querySelectorAll('[data-word]')];
      const on = words.find((w) => w.dataset.state === 'on'); const off = words.find((w) => w.dataset.state !== 'on');
      const d = document.createElement('div'); d.style.color = 'var(--ds-action-accent)'; document.body.append(d); const accent = getComputedStyle(d).color; d.remove();
      const mark = root.querySelector('[data-word] ~ span:last-child'); const mr = mark.getBoundingClientRect(); const wr = on.getBoundingClientRect();
      const g = ground(on);
      return { onC: getComputedStyle(on).color, offC: getComputedStyle(off).color, onW: getComputedStyle(on.firstElementChild).fontWeight, offW: getComputedStyle(off.firstElementChild).fontWeight,
        rOn: ratio(getComputedStyle(on).color, g), rOff: ratio(getComputedStyle(off).color, g), accent, markBg: getComputedStyle(mark).backgroundColor, markShadow: getComputedStyle(mark).boxShadow,
        near: Math.max(0, mr.top - wr.bottom, wr.top - mr.bottom, mr.left - wr.right, wr.left - mr.right), marks: root.querySelectorAll('[data-word] ~ span:last-child').length };
    });
    expect(st.onC !== st.offC && st.rOn > st.rOff, `lit ${st.onC} ${st.rOn.toFixed(2)}:1, waiting ${st.offC} ${st.rOff.toFixed(2)}:1`);
    expect(st.rOff >= 4.5, `waiting words at ${st.rOff.toFixed(2)}:1 (want 4.5)`);
    expect(Number(st.onW) > Number(st.offW), `weight lit ${st.onW}, waiting ${st.offW}`);
    expect(st.onC !== st.accent && st.markBg !== st.accent, `the legend uses the accent ${st.accent}`);
    expect(st.marks === 1 && st.near <= 12, `${st.marks} marks, ${st.near}px from the lit word`);
    expect(st.markShadow === 'none', 'the mark casts a shadow');
    return `lit ${st.rOn.toFixed(1)}:1 ${st.onW}, waiting ${st.rOff.toFixed(1)}:1 ${st.offW}`;
  });

  await check('Legend', 'the index mark slides on the spring and jumps under reduce motion', async () => {
    const pos = (l) => l.locator('[data-word] ~ span:last-child').evaluate((m) => { const r = m.getBoundingClientRect(); return r.top + r.left; });
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await go(ROUTE);
    let l = knobbed();
    await slider(l).focus(); await page.keyboard.press('Home'); await page.waitForTimeout(500);
    const a0 = await pos(l);
    await page.keyboard.press('End'); await page.waitForTimeout(40);
    const a1 = await pos(l); await page.waitForTimeout(700); const a2 = await pos(l);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await go(ROUTE);
    l = knobbed();
    await slider(l).focus(); await page.keyboard.press('Home'); await page.waitForTimeout(100);
    const b0 = await pos(l);
    await page.keyboard.press('End'); await page.waitForTimeout(40);
    const b1 = await pos(l);
    const mid = Math.abs(a1 - a0) > 0.5 && Math.abs(a2 - a1) > 0.5;
    expect(mid, `with motion the mark was at ${a0.toFixed(1)}, ${a1.toFixed(1)} after 40ms, ${a2.toFixed(1)} at rest`);
    expect(Math.abs(b1 - a2) < 1 && Math.abs(b1 - b0) > 0.5, `under reduce motion ${b0.toFixed(1)} → ${b1.toFixed(1)} after 40ms (rest ${a2.toFixed(1)})`);
    return `travels ${a0.toFixed(0)} → ${a1.toFixed(0)} → ${a2.toFixed(0)}; jumps under reduce`;
  });
}
