// Behaviour checks for Dialog, run by tooling/kiln/conformance.mjs on the built book.
export default async function dialog({ check, expect, page, go, main, tokens }) {
  const px = (s) => parseFloat(s);
  const opener = () => main().getByRole('button', { name: 'Turn off all lamps', exact: true }).first();
  const openSheet = async () => {
    await go('/components/dialog/code');
    const b = opener();
    await b.focus(); await page.keyboard.press('Enter');
    const d = main().locator('dialog[data-component="Dialog"]:modal').first();
    await d.waitFor({ state: 'visible' });
    return { b, d };
  };
  await check('Dialog', 'Enter on the opener shows a modal sheet named by its question', async () => {
    const { d } = await openSheet();
    const st = await d.evaluate((el) => ({ modal: el.matches(':modal'), name: document.getElementById(el.getAttribute('aria-labelledby') ?? '')?.textContent ?? '', desc: !!document.getElementById(el.getAttribute('aria-describedby') ?? '') }));
    expect(st.modal, 'the dialog is not modal (showModal was not used)');
    expect(st.name.trim().length > 0, 'the dialog has no accessible name');
    expect(st.desc, 'aria-describedby does not point at the description');
    return `"${st.name}", modal`;
  });
  await check('Dialog', 'focus goes to the plastic key, never the orange one', async () => {
    const { d } = await openSheet();
    const st = await d.evaluate((el) => { const a = document.activeElement; return { inside: el.contains(a), kind: a?.getAttribute('data-kind'), text: a?.textContent?.trim() }; });
    expect(st.inside, 'focus did not move into the sheet');
    expect(st.kind === 'key', `focus is on ${st.kind} "${st.text}"`);
    return `focus on "${st.text}"`;
  });
  await check('Dialog', 'Tab and Shift+Tab stay inside the sheet', async () => {
    const { d } = await openSheet();
    const seen = [];
    for (const k of ['Tab', 'Tab', 'Tab', 'Shift+Tab', 'Shift+Tab', 'Shift+Tab']) {
      await page.keyboard.press(k);
      seen.push(await d.evaluate((el) => el.contains(document.activeElement) || document.activeElement === el));
    }
    expect(seen.every(Boolean), `focus left the sheet (${seen.join(', ')})`);
    return `${seen.length} moves inside`;
  });
  await check('Dialog', 'Escape closes the sheet and focus returns to the opener', async () => {
    const { b, d } = await openSheet();
    await page.keyboard.press('Escape');
    await d.waitFor({ state: 'hidden' });
    const back = await b.evaluate((el) => document.activeElement === el);
    expect(back, 'focus did not return to the opener');
    return 'closed, focus on opener';
  });
  await check('Dialog', 'a key in the sheet closes it', async () => {
    const { d } = await openSheet();
    await page.keyboard.press('Enter');
    await d.waitFor({ state: 'hidden' });
    return 'Cancel closed the sheet';
  });
  await check('Dialog', 'every key in the sheet is at least the touch target tall, with one orange key at most', async () => {
    const { d } = await openSheet();
    const min = px(tokens['layout.touch']?.value ?? '44px');
    const st = await d.evaluate((el) => ({ hs: [...el.querySelectorAll('button')].map((b) => b.getBoundingClientRect().height), orange: el.querySelectorAll('[data-kind="primary"]').length }));
    expect(st.hs.length > 0, 'no keys in the sheet');
    expect(st.hs.every((h) => h >= min - 0.5), `heights ${st.hs.join(', ')} (min ${min})`);
    expect(st.orange <= 1, `${st.orange} orange keys`);
    return `${Math.min(...st.hs)}px min, ${st.orange} orange`;
  });
  const motion = async () => {
    const { d } = await openSheet();
    return d.evaluate((el) => { const c = getComputedStyle(el); return { dur: c.transitionDuration, prop: c.transitionProperty }; });
  };
  await check('Dialog', 'the sheet arrives on motion.enter', async () => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    const st = await motion();
    await page.emulateMedia({ reducedMotion: 'reduce' });
    expect(/opacity|all/.test(st.prop) && px(st.dur) > 0, `transition ${st.prop} ${st.dur}`);
    return `${st.prop} ${st.dur}`;
  });
  await check('Dialog', 'under reduce motion the sheet appears at once', async () => {
    const st = await motion();
    expect(px(st.dur) === 0 || st.prop === 'none', `transition ${st.prop} ${st.dur}`);
    return 'no motion';
  });
}
