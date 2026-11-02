// Behaviour checks for Skeleton, run by tooling/kiln/conformance.mjs on the built book. Skeleton is the unit with its
// power off (P6: nothing moves while idle): it is hidden from assistive tech and the region around it says busy.
export default async function skeleton({ check, expect, page, go, main }) {
  const all = () => main().locator('[data-component="Skeleton"]');

  await check('Skeleton', 'every skeleton is hidden from assistive tech inside a region that says aria-busy', async () => {
    await go('/components/skeleton/code');
    const r = await all().evaluateAll((els) => els.map((e) => ({ hidden: e.getAttribute('aria-hidden') === 'true', busy: !!e.parentElement?.closest('[aria-busy]') })));
    expect(r.length > 0, 'no Skeleton on the page');
    const bad = r.filter((x) => !x.hidden || !x.busy);
    expect(!bad.length, `${bad.length} of ${r.length} not hidden or outside a busy region`);
    return `${r.length} skeletons, all hidden in busy regions`;
  });

  await check('Skeleton', 'nothing moves, with motion allowed', async () => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await go('/components/skeleton/code');
    const r = await all().evaluateAll((els) => {
      const parts = els.flatMap((e) => [e, ...e.querySelectorAll('*')]);
      const running = document.getAnimations().filter((a) => els.some((e) => e.contains(a.effect?.target ?? null))).length;
      const named = parts.filter((n) => { const cs = getComputedStyle(n); const b = getComputedStyle(n, '::before'); return cs.animationName !== 'none' || b.animationName !== 'none'; }).length;
      const moving = parts.filter((n) => { const d = getComputedStyle(n).transitionDuration; return d.split(',').some((x) => parseFloat(x) > 0); }).length;
      return { n: els.length, running, named, moving };
    });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    expect(r.running === 0 && r.named === 0 && r.moving === 0, `${r.running} running, ${r.named} animated, ${r.moving} with transitions`);
    return `${r.n} skeletons, still`;
  });

  await check('Skeleton', 'the ghost window holds the exact box of the Display that replaces it', async () => {
    await go('/components/skeleton/code');
    const region = main().locator('[data-example-live] [aria-busy][aria-live="polite"]').first();
    const box = () => region.evaluate((e) => { const b = e.firstElementChild.getBoundingClientRect(); return [Math.round(b.width * 10) / 10, Math.round(b.height * 10) / 10]; });
    const before = await box();
    const button = region.locator('xpath=..').getByRole('button').first();
    await button.click();
    const after = await box();
    expect(Math.abs(before[0] - after[0]) <= 0.5 && Math.abs(before[1] - after[1]) <= 0.5, `skeleton ${before.join('×')}, display ${after.join('×')}`);
    return `${before.join('×')}px both`;
  });

  await check('Skeleton', 'Tab never lands on a skeleton', async () => {
    await go('/components/skeleton/code');
    const n = await all().evaluateAll((els) => els.filter((e) => e.tabIndex >= 0 || e.querySelector('[tabindex], a, button, input')).length);
    expect(n === 0, `${n} focusable skeletons`);
    return 'not focusable';
  });

  await check('Skeleton', 'no part is the accent orange', async () => {
    await go('/components/skeleton/code');
    const r = await all().evaluateAll((els) => {
      const d = document.createElement('span'); d.style.color = 'var(--ds-action-accent)'; document.body.append(d); const accent = getComputedStyle(d).color; d.remove();
      const hits = els.flatMap((e) => [e, ...e.querySelectorAll('*')]).filter((n) => { const cs = getComputedStyle(n); const b = getComputedStyle(n, '::before'); return [cs.backgroundColor, cs.fill, b.backgroundColor].includes(accent); }).length;
      return { accent, hits };
    });
    expect(r.hits === 0, `${r.hits} parts in ${r.accent}`);
    return 'no orange';
  });
}
