// Behaviour checks for Display, run by tooling/kiln/conformance.mjs on the built book. Display is the
// window that says the state (P2): a polite live region, never a control, segments fade ≤ motion.segment.
export default async function display({ check, expect, page, go, main }) {
  const all = () => main().locator('[data-component="Display"]');
  const ms = (s) => Math.max(...String(s).split(',').map((x) => (x.trim().endsWith('ms') ? parseFloat(x) : parseFloat(x) * 1000)));

  await check('Display', 'every window is a polite status region with a name and the reading as text', async () => {
    await go('/components/display/code');
    const r = await all().evaluateAll((els) => els.map((e) => ({
      role: e.getAttribute('role'), live: e.getAttribute('aria-live'), name: e.getAttribute('aria-label') ?? '',
      text: [...e.querySelectorAll(':scope > span:not([aria-hidden])')].map((s) => s.textContent).join('').trim(),
    })));
    expect(r.length > 0, 'no Display on the page');
    const bad = r.filter((x) => x.role !== 'status' || x.live !== 'polite' || !x.name || !x.text);
    expect(!bad.length, `bad windows: ${JSON.stringify(bad.slice(0, 2))}`);
    return `${r.length} windows`;
  });

  await check('Display', 'Tab never lands in a window: it is never a control', async () => {
    await go('/components/display/code');
    const n = await all().evaluateAll((els) => els.filter((e) => e.tabIndex >= 0 || e.querySelector('a,button,input,select,textarea,[tabindex]')).length);
    expect(n === 0, `${n} windows hold a focusable element`);
    return 'no focusable windows';
  });

  await check('Display', 'LCD segments carry no glow and the drawn face is hidden from assistive tech', async () => {
    await go('/components/display/code');
    const r = await main().locator('[data-component="Display"][data-kind="lcd"] svg').evaluateAll((svgs) => svgs.map((s) => {
      const p = s.querySelector('polygon'); const cs = getComputedStyle(p);
      return { filter: cs.filter, hidden: !!s.closest('[aria-hidden="true"]') };
    }));
    expect(r.length > 0, 'no LCD segments on the page');
    const bad = r.filter((x) => x.filter !== 'none' || !x.hidden);
    expect(!bad.length, JSON.stringify(bad[0]));
    return `${r.length} segment faces`;
  });

  await check('Display', 'a segment fades within motion.segment, and not at all under reduce motion', async () => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await go('/components/display/code');
    const on = await main().locator('[data-component="Display"] svg polygon').first().evaluate((p) => getComputedStyle(p).transitionDuration);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await go('/components/display/code');
    const off = await main().locator('[data-component="Display"] svg polygon').first().evaluate((p) => getComputedStyle(p).transitionDuration);
    expect(ms(on) > 0 && ms(on) <= 80, `fade ${on}`);
    expect(ms(off) === 0, `reduce motion ${off}`);
    return `fade ${on}, reduce ${off}`;
  });
}
