// Behaviour checks for Snackbar, run by tooling/kiln/conformance.mjs on the built book.
export default async function snackbar({ check, expect, page, go, main, tokens }) {
  const px = (s) => parseFloat(s);
  const live = () => page.locator('[data-snackbar-region] > [data-state="open"] [data-component="Snackbar"]');
  const post = async (name = 'Remove Kitchen lamp') => {
    await go('/components/snackbar/code');
    await main().getByRole('button', { name, exact: true }).first().click();
    await live().first().waitFor({ state: 'visible' });
  };
  await check('Snackbar', 'each snackbar is a status region with a glyph and a word, never orange', async () => {
    await go('/components/snackbar/code');
    const accent = await page.evaluate(() => { const d = document.createElement('i'); d.style.color = 'var(--ds-action-accent)'; document.body.append(d); const c = getComputedStyle(d).color; d.remove(); return c; });
    const st = await main().locator('[data-component="Snackbar"]').evaluateAll((els) => els.map((e) => ({ role: e.getAttribute('role'), glyph: !!e.querySelector('svg'), word: e.firstElementChild?.textContent?.trim() ?? '', colours: [e, ...e.querySelectorAll('*')].flatMap((n) => [getComputedStyle(n).color, getComputedStyle(n).backgroundColor]) })));
    expect(st.length > 0, 'no snackbars on the page');
    expect(st.every((s) => s.role === 'status'), `roles ${st.map((s) => s.role).join(',')}`);
    expect(st.every((s) => s.glyph && s.word.length > 0), 'a snackbar lacks its glyph or its word');
    expect(st.every((s) => !s.colours.includes(accent)), 'a snackbar uses the accent orange');
    return `${st.length} snackbars with the words ${[...new Set(st.map((s) => s.word))].join(', ')}`;
  });
  await check('Snackbar', 'the Undo key is at least the touch target and runs its action', async () => {
    await go('/components/snackbar/code');
    const min = px(tokens['layout.touch']?.value ?? '44px');
    await main().getByRole('button', { name: 'Remove Desk lamp', exact: true }).first().click();
    const s = live().first();
    await s.waitFor({ state: 'visible' });
    const k = s.getByRole('button', { name: 'Undo' });
    const r = await k.boundingBox();
    expect(r && r.width >= min - 0.5 && r.height >= min - 0.5, `Undo ${r?.width}×${r?.height}`);
    await k.click();
    await page.waitForTimeout(400);
    const back = await main().getByText(/Desk lamp, Hall light|lamps: Kitchen lamp, Desk lamp/).count();
    expect(back > 0, 'Undo did not put the lamp back');
    expect(await live().count() === 0, 'the snackbar stayed after Undo');
    return `Undo ${Math.round(r.width)}×${Math.round(r.height)}, lamp back`;
  });
  await check('Snackbar', 'useSnackbar shows one at a time and a new one replaces the old', async () => {
    await go('/components/snackbar/code');
    await main().getByRole('button', { name: 'Remove Desk lamp', exact: true }).last().click();
    await main().getByRole('button', { name: 'Move Hall light', exact: true }).first().click();
    await page.waitForTimeout(400);
    const words = await live().allTextContents();
    expect(words.length === 1 && /Hall light moved/.test(words[0]), `on screen: ${words.join(' | ')}`);
    return words[0];
  });
  await check('Snackbar', 'it stays at least 5 s and the timer pauses while the pointer is on it', async () => {
    await post();
    await page.waitForTimeout(4600);
    expect(await live().count() === 1, 'gone before 5 s');
    await live().first().hover();
    await page.waitForTimeout(5000);
    expect(await live().count() === 1, 'left while hovered');
    await page.mouse.move(1, 1);
    return 'stays 5 s, paused on hover';
  });
  await check('Snackbar', 'Escape closes the snackbar while focus is inside', async () => {
    await post();
    await live().first().getByRole('button', { name: 'Undo' }).focus();
    await page.keyboard.press('Escape');
    await page.waitForTimeout(400);
    expect(await live().count() === 0, 'still on screen after Escape');
    return 'closed by Escape';
  });
  await check('Snackbar', 'the region is centred at the bottom of the screen', async () => {
    await post();
    const st = await live().first().evaluate((el) => { const s = el.getBoundingClientRect(); return { mid: Math.round(s.left + s.width / 2), vw: document.documentElement.clientWidth, gap: Math.round(window.innerHeight - s.bottom) }; });
    expect(Math.abs(st.mid - st.vw / 2) <= 2, `centre ${st.mid} on ${st.vw}`);
    expect(st.gap >= 8 && st.gap <= 120, `${st.gap}px above the bottom`);
    return `centred, ${st.gap}px above the bottom`;
  });
}
