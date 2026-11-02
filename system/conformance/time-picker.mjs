// Behaviour checks for TimePicker, run by tooling/kiln/conformance.mjs on the built book. Each field is a spinbutton
// (P3: every mechanism has its keyboard map), the set keys are 44px round keys, and nothing is orange (P1).
export default async function timePicker({ check, expect, page, go, main, tokens }) {
  const px = (s) => parseFloat(s);
  const ROUTE = '/components/time-picker/code';
  const live = (sel = '') => main().locator(`[data-component="TimePicker"]:not([data-disabled]):not([data-readonly])${sel}`);
  const hour = () => live().first().getByRole('spinbutton').first();
  const now = (loc) => loc.evaluate((e) => [e.getAttribute('aria-valuenow'), e.getAttribute('aria-valuetext')]);

  await check('TimePicker', 'every field is a named spinbutton in a group named by the printed label', async () => {
    await go(ROUTE);
    const r = await main().locator('[data-component="TimePicker"]').evaluateAll((els) => els.map((el) => {
      const g = el.querySelector('[role="group"]'); const name = (document.getElementById(g?.getAttribute('aria-labelledby') ?? '')?.textContent ?? '').trim();
      const f = [...el.querySelectorAll('[role="spinbutton"]')];
      return { name, fields: f.length, ok: f.every((x) => x.getAttribute('aria-label') && x.getAttribute('aria-valuemin') !== null && x.getAttribute('aria-valuemax') !== null && x.getAttribute('aria-valuetext')) };
    }));
    const bad = r.filter((x) => !x.name || x.fields < 2 || !x.ok);
    expect(r.length > 0 && !bad.length, `${bad.length} of ${r.length} pickers: ${JSON.stringify(bad.slice(0, 2))}`);
    return `${r.length} pickers, ${r.reduce((a, x) => a + x.fields, 0)} spinbuttons`;
  });

  await check('TimePicker', 'arrows step and wrap, PageUp jumps, Home and End reach the ends', async () => {
    await go(ROUTE);
    const h = hour();
    await h.focus();
    await page.keyboard.press('End'); const end = await now(h);
    await page.keyboard.press('ArrowUp'); const wrapped = await now(h);
    await page.keyboard.press('PageUp'); const paged = await now(h);
    await page.keyboard.press('Home'); const home = await now(h);
    await page.keyboard.press('ArrowDown'); const down = await now(h);
    expect(end[0] === '23' && wrapped[0] === '0' && paged[0] === '3' && home[0] === '0' && down[0] === '23', `End ${end[0]}, Up ${wrapped[0]}, PageUp ${paged[0]}, Home ${home[0]}, Down ${down[0]}`);
    return `23 → 0 → 3 → 0 → 23`;
  });

  await check('TimePicker', 'typing two digits sets the hour and moves on to the minute', async () => {
    await go(ROUTE);
    const pk = live().first();
    const [h, m] = [pk.getByRole('spinbutton').nth(0), pk.getByRole('spinbutton').nth(1)];
    await h.focus();
    await page.keyboard.type('07');
    const hv = await now(h);
    const onMinute = await m.evaluate((e) => document.activeElement === e);
    await page.keyboard.type('45');
    const mv = await now(m);
    expect(hv[0] === '7' && onMinute && mv[0] === '45', `hour ${hv[0]}, focus on minute ${onMinute}, minute ${mv[0]}`);
    return `07:45 typed, ${hv[1]} then ${mv[1]}`;
  });

  await check('TimePicker', 'the AM and PM field toggles with arrows and takes A and P', async () => {
    await go(ROUTE);
    const p = main().locator('[data-component="TimePicker"]:not([data-disabled]):not([data-readonly])').filter({ has: page.getByRole('spinbutton', { name: 'AM or PM' }) }).first().getByRole('spinbutton', { name: 'AM or PM' });
    await p.focus();
    const a = (await now(p))[1];
    await page.keyboard.press('ArrowUp'); const b = (await now(p))[1];
    await page.keyboard.press('a'); const c = (await now(p))[1];
    await page.keyboard.press('p'); const d = (await now(p))[1];
    expect(a !== b && c === 'AM' && d === 'PM', `${a} → ${b}, a → ${c}, p → ${d}`);
    return `${a} → ${b}, a ${c}, p ${d}`;
  });

  await check('TimePicker', 'the set keys are 44px, step their field and stay out of the tab order', async () => {
    await go(ROUTE);
    const pk = live('[data-kind="segment"]').first();
    const keys = pk.locator('button');
    const n = await keys.count();
    const sizes = await keys.evaluateAll((els) => els.map((e) => { const b = e.getBoundingClientRect(); return [b.width, b.height, e.tabIndex]; }));
    const h = pk.getByRole('spinbutton').first();
    const before = Number((await now(h))[0]);
    await pk.getByRole('button', { name: 'Later hour' }).click();
    const after = Number((await now(h))[0]);
    const min = px(tokens['layout.touch']?.value ?? '44px');
    expect(n === 4 && sizes.every(([w, hh, t]) => w >= min - 0.5 && hh >= min - 0.5 && t < 0), `keys ${JSON.stringify(sizes)}`);
    expect(after === (before + 1) % 24, `hour ${before} → ${after}`);
    return `${n} keys ${sizes[0][0]}px, hour ${before} → ${after}`;
  });

  await check('TimePicker', 'the focused field shows the focus ring around its own cell', async () => {
    await go(ROUTE);
    const h = hour();
    await h.focus(); await page.keyboard.press('Shift+Tab'); await page.keyboard.press('Tab');
    const st = await h.evaluate((el) => { const cs = getComputedStyle(el.parentElement); return { focused: document.activeElement === el, w: cs.outlineWidth, s: cs.outlineStyle }; });
    expect(st.focused && st.s !== 'none' && px(st.w) >= 2, `focused ${st.focused}, outline ${st.s} ${st.w}`);
    return `outline ${st.w}`;
  });

  await check('TimePicker', 'typing Thai keeps the picker at its width, and every line box fits Thai marks', async () => {
    await go(ROUTE);
    const pk = live().first();
    const w = () => pk.evaluate((el) => el.getBoundingClientRect().width);
    const before = await w();
    const f = pk.getByRole('spinbutton').first();
    const v0 = (await now(f))[0];
    await f.fill('เหี่ยะอะไรเนี่ย ปู่ฤๅษี');
    const after = await w();
    const v1 = (await now(f))[0];
    const r = await main().locator('[data-component="TimePicker"]').evaluateAll((els) => els.flatMap((el) => [...el.querySelectorAll('input:not([type="hidden"]), span')].filter((n) => n.childElementCount === 0 && n.textContent.trim() || n.tagName === 'INPUT').map((n) => { const cs = getComputedStyle(n); return parseFloat(cs.lineHeight) / parseFloat(cs.fontSize); })));
    expect(Math.abs(after - before) <= 1 && v0 === v1, `${before}px → ${after}px, value ${v0} → ${v1}`);
    expect(r.every((x) => x >= 1.35), `line boxes down to ${Math.min(...r).toFixed(2)}em`);
    return `${Math.round(before)}px both, line box ≥ ${Math.min(...r).toFixed(2)}em`;
  });

  await check('TimePicker', 'no part of the picker is the accent orange', async () => {
    await go(ROUTE);
    const r = await main().locator('[data-component="TimePicker"]').evaluateAll((els) => {
      const d = document.createElement('span'); d.style.color = 'var(--ds-action-accent)'; document.body.append(d); const accent = getComputedStyle(d).color; d.remove();
      const hits = els.flatMap((e) => [e, ...e.querySelectorAll('*')]).filter((n) => { const cs = getComputedStyle(n); return [cs.backgroundColor, cs.fill, cs.color, cs.borderTopColor].includes(accent); }).length;
      return { n: els.length, hits };
    });
    expect(r.hits === 0, `${r.hits} orange parts`);
    return `${r.n} pickers, no orange`;
  });

  await check('TimePicker', 'an error sets aria-invalid on the fields and is described by words with a glyph', async () => {
    await go(ROUTE);
    const r = await main().locator('[data-component="TimePicker"][data-invalid="true"]').first().evaluate((el) => {
      const f = el.querySelector('[role="spinbutton"]'); const ids = (f.getAttribute('aria-describedby') ?? '').split(/\s+/);
      const msg = [...el.querySelectorAll('p')].find((p) => ids.includes(p.id) && p.querySelector('svg'));
      return { invalid: f.getAttribute('aria-invalid'), words: msg?.textContent?.trim() ?? '' };
    });
    expect(r.invalid === 'true' && r.words.split(/\s+/).length >= 2, `aria-invalid ${r.invalid}, message "${r.words}"`);
    return `"${r.words}"`;
  });
}
