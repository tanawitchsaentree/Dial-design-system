// Behaviour checks for Switch, run by tooling/kiln/conformance.mjs on the built book.
export default async function sw({ check, expect, page, go, main, tokens }) {
  const px = (s) => parseFloat(s);
  const first = () => main().locator('[data-component="Switch"]:not([disabled])').first();
  await check('Switch', 'it is a switch with a name and a state', async () => {
    await go('/components/switch/code');
    const st = await first().evaluate((el) => {
      const ids = (el.getAttribute('aria-labelledby') ?? '').split(/\s+/).filter(Boolean);
      const name = ids.map((id) => document.getElementById(id)?.textContent ?? '').join(' ').trim() || el.getAttribute('aria-label') || '';
      return { role: el.getAttribute('role'), checked: el.getAttribute('aria-checked'), name };
    });
    expect(st.role === 'switch', `role ${st.role}`);
    expect(st.checked === 'true' || st.checked === 'false', `aria-checked ${st.checked}`);
    expect(st.name.length > 0, 'the switch has no accessible name');
    return `"${st.name}", aria-checked ${st.checked}`;
  });
  await check('Switch', 'Tab reaches the switch and the focus ring shows', async () => {
    await go('/components/switch/code');
    const b = first();
    await b.focus(); await page.keyboard.press('Shift+Tab'); await page.keyboard.press('Tab');
    const st = await b.evaluate((el) => ({ focused: document.activeElement === el, w: getComputedStyle(el).outlineWidth, s: getComputedStyle(el).outlineStyle }));
    expect(st.focused, 'the switch did not take focus');
    expect(st.s !== 'none' && px(st.w) >= 2, `outline ${st.s} ${st.w}`);
    return `outline ${st.w}`;
  });
  await check('Switch', 'Space and Enter throw the switch', async () => {
    await go('/components/switch/code');
    const b = first();
    const read = () => b.getAttribute('aria-checked');
    const a = await read();
    await b.focus(); await page.keyboard.press('Space');
    const c = await read();
    await page.keyboard.press('Enter');
    const d = await read();
    expect(a !== c, `Space left aria-checked at ${c}`);
    expect(d === a, `Enter did not throw it back (${a} → ${c} → ${d})`);
    return `${a} → ${c} → ${d}`;
  });
  await check('Switch', 'every switch is at least the touch target tall', async () => {
    await go('/components/switch/code');
    const min = px(tokens['layout.touch']?.value ?? '44px');
    const hs = await main().locator('[data-component="Switch"]').evaluateAll((els) => els.map((e) => e.getBoundingClientRect().height));
    expect(hs.length > 0, 'no switches on the page');
    expect(hs.every((h) => h >= min - 0.5), `heights ${hs.join(', ')} (min ${min})`);
    return `${Math.min(...hs)}px min`;
  });
  await check('Switch', 'on is told by position and lamp, never by orange', async () => {
    await go('/components/switch/code');
    const accent = await page.evaluate(() => { const d = document.createElement('i'); d.style.color = 'var(--ds-action-accent)'; document.body.append(d); const c = getComputedStyle(d).color; d.remove(); return c; });
    const st = await main().locator('[data-component="Switch"][aria-checked="true"]').first().evaluate((el) => {
      const cs = (n) => n ? getComputedStyle(n) : null;
      const cap = el.querySelector('span > span'); const lamp = el.lastElementChild;
      return { colours: [el, cap, cap?.parentElement, lamp].map((n) => cs(n)?.backgroundColor), lamp: cs(lamp)?.backgroundColor, capX: cap.getBoundingClientRect().x - cap.parentElement.getBoundingClientRect().x };
    });
    expect(!st.colours.includes(accent), `a part of the on switch is orange (${st.colours.join(', ')})`);
    expect(st.capX > 0, `the cap did not move to the on end (offset ${st.capX}px)`);
    return `cap at ${Math.round(st.capX)}px, lamp ${st.lamp}`;
  });
  const throwCap = async () => {
    await go('/components/switch/code');
    const b = first();
    await b.click();
    return b.evaluate((el) => { const c = getComputedStyle(el.querySelector('span > span')); return { dur: c.transitionDuration, prop: c.transitionProperty }; });
  };
  await check('Switch', 'the cap travels along the groove on the spring', async () => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    const st = await throwCap();
    await page.emulateMedia({ reducedMotion: 'reduce' });
    expect(/inset-inline-start|left|right|all/.test(st.prop) && px(st.dur) > 0, `transition ${st.prop} ${st.dur}`);
    return `${st.prop} ${st.dur}`;
  });
  await check('Switch', 'under reduce motion the cap changes at once', async () => {
    const st = await throwCap();
    expect(px(st.dur) === 0 || st.prop === 'none', `transition ${st.prop} ${st.dur}`);
    return 'no travel';
  });
}
