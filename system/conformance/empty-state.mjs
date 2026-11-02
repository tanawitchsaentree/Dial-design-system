// Behaviour checks for EmptyState, run by tooling/kiln/conformance.mjs on the built book.
export default async function emptyState({ check, expect, page, go, main, tokens }) {
  const px = (s) => parseFloat(s);
  await check('EmptyState', 'Tab reaches the key and it is at least the touch target', async () => {
    await go('/components/empty-state/code');
    const min = px(tokens['layout.touch']?.value ?? '44px');
    const k = main().locator('[data-component="EmptyState"] [data-part="action"] button').first();
    await k.focus(); await page.keyboard.press('Shift+Tab'); await page.keyboard.press('Tab');
    const st = await k.evaluate((el) => { const r = el.getBoundingClientRect(); return { focused: document.activeElement === el, h: r.height, name: el.textContent.trim() }; });
    expect(st.focused, 'the key did not take focus');
    expect(st.h >= min - 0.5, `key ${st.h}px tall`);
    return `"${st.name}", ${st.h}px`;
  });
  await check('EmptyState', 'the drawing is hidden from assistive tech and the line is plain text', async () => {
    await go('/components/empty-state/code');
    const st = await main().locator('[data-component="EmptyState"]').evaluateAll((els) => els.map((e) => ({ drawing: e.dataset.drawing, hidden: e.querySelector('[data-part="drawing"]')?.getAttribute('aria-hidden') ?? null, line: e.querySelector('p')?.textContent?.trim() ?? '', img: e.querySelectorAll('img').length })));
    expect(st.length > 0, 'no empty states on the page');
    expect(st.every((s) => s.drawing === 'none' || s.hidden === 'true'), 'a drawing is exposed to assistive tech');
    expect(st.every((s) => s.line.length > 0), 'an empty state has no line');
    expect(st.every((s) => s.img === 0), 'an empty state holds an image');
    return `${st.length} empty states, drawings ${[...new Set(st.map((s) => s.drawing))].join(', ')}`;
  });
  await check('EmptyState', 'the parts are start-aligned on one edge and at most one orange key shows', async () => {
    await go('/components/empty-state/code');
    const st = await main().locator('[data-component="EmptyState"]').evaluateAll((els) => els.map((e) => {
      const xs = [...e.children].map((c) => Math.round((c.firstElementChild && c.dataset.part ? c.firstElementChild : c).getBoundingClientRect().left));
      return { spread: Math.max(...xs) - Math.min(...xs), orange: e.querySelectorAll('[data-kind="primary"]').length };
    }));
    expect(st.every((s) => s.spread <= 1), `start edges differ by ${Math.max(...st.map((s) => s.spread))}px`);
    expect(st.every((s) => s.orange <= 1), 'an empty state has more than one orange key');
    return `${st.length} aligned`;
  });
}
