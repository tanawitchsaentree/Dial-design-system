// Behaviour checks for VisuallyHidden (words for assistive tech, a skip key on focus), run by tooling/kiln/conformance.mjs.
export default async function visuallyHidden({ check, expect, go, main, page }) {
  await check('VisuallyHidden', 'hidden words are one pixel, out of the flow, and still in the text', async () => {
    await go('/components/visually-hidden/code');
    const r = await main().locator('[data-component="VisuallyHidden"]:not([data-focusable])').first().evaluate((el) => {
      const b = el.getBoundingClientRect(); const cs = getComputedStyle(el);
      return { w: b.width, h: b.height, pos: cs.position, text: el.textContent.trim().length, display: cs.display, clip: cs.clipPath };
    });
    expect(r.w <= 2 && r.h <= 2, `size ${r.w}×${r.h}`);
    expect(r.pos === 'absolute', `position ${r.pos}`);
    expect(r.display !== 'none' && r.text > 0, `display ${r.display}, ${r.text} characters`);
    expect(r.clip !== 'none', `clip-path ${r.clip}`);
    return 'one pixel, absolute, text kept';
  });
  await check('VisuallyHidden', 'a focusable one shows a raised key at least 44px tall on Tab focus and hides again on blur', async () => {
    await go('/components/visually-hidden/code');
    const host = main().locator('[data-component="VisuallyHidden"][data-focusable]').first();
    const link = host.locator('a').first();
    const before = await host.evaluate((el) => el.getBoundingClientRect().height);
    await link.focus();
    const on = await host.evaluate((el) => { const b = el.getBoundingClientRect(); const cs = getComputedStyle(el); return { w: b.width, h: b.height, pos: cs.position, shadow: cs.boxShadow, bg: cs.backgroundColor }; });
    expect(before <= 2, `hidden height ${before}`);
    expect(on.h >= 43.5 && on.w > 44, `key ${on.w}×${on.h}`);
    expect(on.pos === 'fixed', `position ${on.pos}`);
    expect(on.shadow !== 'none' && on.bg !== 'rgba(0, 0, 0, 0)', `shadow ${on.shadow}, background ${on.bg}`);
    await link.evaluate((el) => el.blur());
    const after = await host.evaluate((el) => el.getBoundingClientRect().height);
    expect(after <= 2, `height after blur ${after}`);
    return `hidden ${before}px, key ${on.w}×${on.h}, hidden again ${after}px`;
  });
  await check('VisuallyHidden', 'showing the skip key does not move the content next to it, and it appears at once', async () => {
    await go('/components/visually-hidden/code');
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    try {
      const host = main().locator('[data-component="VisuallyHidden"][data-focusable]').first();
      const sibling = main().locator('[data-component="Text"]').first();
      const y0 = await sibling.evaluate((el) => el.getBoundingClientRect().top);
      await host.locator('a').first().focus();
      const r = await host.evaluate((el) => { const cs = getComputedStyle(el); return { t: cs.transitionDuration, a: cs.animationName }; });
      const y1 = await sibling.evaluate((el) => el.getBoundingClientRect().top);
      expect(Math.abs(y1 - y0) < 0.5, `neighbour moved ${y0} to ${y1}`);
      expect(/^(0s)(, 0s)*$/.test(r.t) && r.a === 'none', `transition ${r.t}, animation ${r.a}`);
      await host.locator('a').first().evaluate((el) => el.blur());
      return 'neighbour stayed, no transition';
    } finally {
      await page.emulateMedia({ reducedMotion: 'reduce' });
    }
  });
  await check('VisuallyHidden', 'no part of it is the accent orange, hidden or revealed', async () => {
    await go('/components/visually-hidden/code');
    const bad = await main().locator('[data-component="VisuallyHidden"]').evaluateAll((els) => {
      const probe = document.createElement('span'); probe.style.color = 'var(--ds-action-accent)'; document.body.append(probe);
      const accent = getComputedStyle(probe).color; probe.remove();
      const out = []; for (const el of els) for (const n of [el, ...el.querySelectorAll('*')]) { const cs = getComputedStyle(n); if (accent && [cs.backgroundColor, cs.color, cs.borderColor].some((c) => c === accent)) out.push(n.tagName); }
      return out;
    });
    expect(bad.length === 0, `${bad.length} orange parts`);
    return 'no orange';
  });
}
