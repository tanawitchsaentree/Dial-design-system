// Behaviour checks for ActionSheet, run by tooling/kiln/conformance.mjs on the built book.
export default async function actionSheet({ check, expect, page, go, main, tokens }) {
  const px = (s) => parseFloat(s);
  const openSheet = async () => {
    await go('/components/action-sheet/code');
    const b = main().getByRole('button', { name: 'Actions for Kitchen lamp', exact: true }).first();
    await b.focus(); await page.keyboard.press('Enter');
    const d = page.locator('dialog[data-component="ActionSheet"]:modal').first();
    await d.waitFor({ state: 'visible' });
    await page.waitForTimeout(50);
    return { b, d };
  };
  const narrow = async (fn) => {
    const vp = page.viewportSize();
    await page.setViewportSize({ width: 375, height: 760 });
    try { return await fn(); } finally { if (vp) await page.setViewportSize(vp); }
  };
  await check('ActionSheet', 'Enter on the opener shows a modal sheet named by the object with focus on the first action', async () => {
    const { d } = await openSheet();
    const st = await d.evaluate((el) => ({ modal: el.matches(':modal'), name: document.getElementById(el.getAttribute('aria-labelledby') ?? '')?.textContent ?? '', focus: document.activeElement?.textContent ?? '' }));
    expect(st.modal, 'the sheet is not modal');
    expect(st.name.trim() === 'Kitchen lamp', `named "${st.name}"`);
    expect(st.focus.trim() === 'Rename', `focus on "${st.focus}"`);
    await page.keyboard.press('Escape');
    return `"${st.name}", focus on Rename`;
  });
  await check('ActionSheet', 'arrow keys move between the actions and Cancel and Tab stays inside', async () => {
    await narrow(async () => {
      const { d } = await openSheet();
      const words = [];
      for (const k of ['ArrowDown', 'ArrowDown', 'ArrowDown', 'ArrowDown']) { await page.keyboard.press(k); words.push(await page.evaluate(() => document.activeElement?.textContent?.trim())); }
      expect(words.join(',') === 'Move to room,Remove,Cancel,Rename', `arrows reached ${words.join(',')}`);
      const inside = [];
      for (const k of ['Tab', 'Tab', 'Tab', 'Tab', 'Tab', 'Shift+Tab', 'Shift+Tab', 'Shift+Tab', 'Shift+Tab', 'Shift+Tab']) { await page.keyboard.press(k); inside.push(await d.evaluate((el) => el.contains(document.activeElement))); }
      expect(inside.every(Boolean), `focus left the sheet (${inside.join(',')})`);
      await page.keyboard.press('Escape');
    });
    return 'arrows wrap through Cancel, Tab stays inside';
  });
  await check('ActionSheet', 'Escape closes the sheet and focus returns to the opener', async () => {
    const { b, d } = await openSheet();
    await page.keyboard.press('Escape');
    await d.waitFor({ state: 'hidden' });
    expect(await b.evaluate((el) => document.activeElement === el), 'focus did not return to the opener');
    return 'closed, focus on opener';
  });
  await check('ActionSheet', 'an action runs once the sheet has closed and focus is back on the opener', async () => {
    const { b, d } = await openSheet();
    await page.keyboard.press('ArrowDown'); await page.keyboard.press('Enter');
    await d.waitFor({ state: 'hidden' });
    await page.waitForTimeout(50);
    const text = await main().getByText(/last action: move/).count();
    expect(text > 0, 'onAction did not run with "move"');
    expect(await b.evaluate((el) => document.activeElement === el), 'focus did not return to the opener');
    return 'move ran after close';
  });
  await check('ActionSheet', 'on a tall screen it docks to the bottom edge with a full-width Cancel key at least the touch target', async () => {
    const st = await narrow(async () => {
      const { d } = await openSheet();
      const r = await d.evaluate((el) => { const b = el.getBoundingClientRect(); const c = el.querySelector('[data-part="cancel"] button'); const cr = c?.getBoundingClientRect(); return { bottom: Math.round(window.innerHeight - b.bottom), w: Math.round(b.width), vw: document.documentElement.clientWidth, cw: Math.round(cr?.width ?? 0), ch: Math.round(cr?.height ?? 0), rows: [...el.querySelectorAll('[data-part="item"]')].map((x) => Math.round(x.getBoundingClientRect().height)) }; });
      await page.keyboard.press('Escape');
      return r;
    });
    const min = px(tokens['layout.touch']?.value ?? '44px');
    expect(Math.abs(st.bottom) <= 1, `${st.bottom}px above the bottom edge`);
    expect(st.w >= st.vw - 1, `${st.w}px wide on ${st.vw}px`);
    expect(st.ch >= min && st.cw >= st.w * 0.8, `Cancel ${st.cw}×${st.ch}`);
    expect(st.rows.every((h) => h >= min - 0.5), `rows ${st.rows.join(',')}`);
    return `docked, Cancel ${st.cw}×${st.ch}, rows ${st.rows.join('/')}`;
  });
  await check('ActionSheet', 'on a wide screen it stands by its trigger whole on the screen with no Cancel key', async () => {
    const { b, d } = await openSheet();
    const k = await b.boundingBox();
    const st = await d.evaluate((el) => { const r = el.getBoundingClientRect(); return { l: r.left, r: r.right, t: r.top, btm: r.bottom, vw: document.documentElement.clientWidth, vh: window.innerHeight, cancel: el.querySelector('[data-part="cancel"]')?.offsetParent !== null }; });
    expect(st.l >= 0 && st.r <= st.vw && st.t >= 0 && st.btm <= st.vh, `cut by the screen ${JSON.stringify(st)}`);
    const near = k && (Math.abs(st.t - (k.y + k.height)) < 24 || Math.abs(st.btm - k.y) < 24);
    expect(near, `not by its key (key ${k?.y}, panel ${st.t}–${st.btm})`);
    expect(!st.cancel, 'Cancel shows by the key');
    await page.keyboard.press('Escape');
    return `panel at ${Math.round(st.l)},${Math.round(st.t)} by the key`;
  });
  await check('ActionSheet', 'the destructive action is last with its lamp and word, and nothing is orange', async () => {
    const { d } = await openSheet();
    const accent = await page.evaluate(() => { const x = document.createElement('i'); x.style.color = 'var(--ds-action-accent)'; document.body.append(x); const c = getComputedStyle(x).color; x.remove(); return c; });
    const st = await d.evaluate((el) => { const rows = [...el.querySelectorAll('[data-part="item"]')]; const last = rows[rows.length - 1]; return { last: last?.textContent?.trim(), destr: last?.hasAttribute('data-destructive'), lamp: !!last?.querySelector('svg'), colours: [...el.querySelectorAll('*')].flatMap((n) => [getComputedStyle(n).color, getComputedStyle(n).backgroundColor, getComputedStyle(n).fill]) }; });
    expect(st.destr && st.last === 'Remove' && st.lamp, `last row "${st.last}" destructive ${st.destr} lamp ${st.lamp}`);
    expect(!st.colours.includes(accent), 'the accent orange appears in the sheet');
    await page.keyboard.press('Escape');
    return 'Remove last, lamp + word, no orange';
  });
  const motion = async () => narrow(async () => {
    const { d } = await openSheet();
    const st = await d.evaluate((el) => { const c = getComputedStyle(el); return { dur: c.transitionDuration, prop: c.transitionProperty }; });
    await page.keyboard.press('Escape');
    return st;
  });
  await check('ActionSheet', 'the sheet slides up on motion.release and leaves faster', async () => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    const st = await motion();
    await page.emulateMedia({ reducedMotion: 'reduce' });
    expect(/transform|all/.test(st.prop) && px(st.dur) > 0, `transition ${st.prop} ${st.dur}`);
    return `${st.prop} ${st.dur}`;
  });
  await check('ActionSheet', 'under reduce motion the sheet appears at once', async () => {
    const st = await motion();
    expect(px(st.dur) === 0 || st.prop === 'none', `transition ${st.prop} ${st.dur}`);
    return 'no motion';
  });
}
