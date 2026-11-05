// Behaviour checks for Tooltip (the printed name of a part), run by tooling/kiln/conformance.mjs on the built book.
export default async function tooltip({ check, expect, page, go, main }) {
  const key = () => main().locator('[data-component="IconButton"]:not(:disabled)').first();
  const tag = () => page.locator('[data-component="Tooltip"][role="tooltip"]');
  const reset = async () => { await page.keyboard.press('Escape'); await page.mouse.move(0, 0); await tag().first().waitFor({ state: 'detached', timeout: 2500 }).catch(() => {}); };

  await check('Tooltip', 'keyboard focus shows the tag at once and Escape closes it with focus left on the part', async () => {
    await go('/components/tooltip/code');
    const k = key();
    await k.focus(); await page.keyboard.press('Shift+Tab'); await page.keyboard.press('Tab');
    await tag().first().waitFor({ state: 'visible', timeout: 1500 });
    const shown = await tag().count();
    await page.keyboard.press('Escape');
    await tag().first().waitFor({ state: 'detached', timeout: 2500 });
    const stayed = await k.evaluate((el) => document.activeElement === el);
    expect(shown === 1, `${shown} tags after focus (need 1)`);
    expect(stayed, 'focus left the part when Escape closed the tag');
    return 'focus shows 1 tag, Escape removes it, focus stays';
  });
  await check('Tooltip', 'a pointer resting on the part shows the tag and the pointer can move onto the tag without losing it', async () => {
    await go('/components/tooltip/code');
    await reset();
    const k = key(); const kb = await k.boundingBox();
    await page.mouse.move(kb.x + kb.width / 2, kb.y + kb.height / 2);
    await tag().first().waitFor({ state: 'visible', timeout: 2500 });
    const tb = await tag().first().boundingBox();
    await page.mouse.move(tb.x + tb.width / 2, tb.y + tb.height / 2, { steps: 4 });
    await page.waitForTimeout(400);
    const kept = await tag().count();
    await page.mouse.move(0, 0);
    await tag().first().waitFor({ state: 'detached', timeout: 2500 });
    expect(kept === 1, `${kept} tags after moving onto the tag (need 1)`);
    return 'shown on rest, kept while the pointer is on the tag, gone after it leaves';
  });
  await check('Tooltip', 'the tag has role tooltip, stays inside the screen, keeps a real border and is never the accent orange', async () => {
    await go('/components/tooltip/code');
    await reset();
    const k = key(); await k.focus(); await page.keyboard.press('Shift+Tab'); await page.keyboard.press('Tab');
    await tag().first().waitFor({ state: 'visible', timeout: 1500 });
    const r = await tag().first().evaluate((el) => {
      const b = el.getBoundingClientRect(), cs = getComputedStyle(el);
      const probe = document.createElement('span'); probe.style.color = 'var(--ds-action-accent)'; document.body.append(probe);
      const accent = getComputedStyle(probe).color; probe.remove();
      return { role: el.getAttribute('role'), inside: b.left >= 0 && b.top >= 0 && b.right <= document.documentElement.clientWidth && b.bottom <= document.documentElement.clientHeight,
        border: parseFloat(cs.borderTopWidth), orange: [cs.backgroundColor, cs.color, cs.borderTopColor].includes(accent), fixed: cs.position };
    });
    await page.keyboard.press('Escape');
    expect(r.role === 'tooltip' && r.fixed === 'fixed', `role ${r.role}, position ${r.fixed}`);
    expect(r.inside, 'the tag runs off the screen');
    expect(r.border > 0, `border ${r.border}px`);
    expect(!r.orange, 'the tag takes the accent orange');
    return 'role tooltip, inside the screen, bordered, no orange';
  });
}
