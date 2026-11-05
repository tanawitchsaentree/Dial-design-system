// Behaviour checks for Stepper (numbered windows with a dotted rail), run by tooling/kiln/conformance.mjs.
export default async function stepper({ check, expect, go, main }) {
  await check('Stepper', 'the steps are a list in order and the current one is announced', async () => {
    await go('/components/stepper/code');
    const r = await main().locator('ol[data-component="Stepper"]').first().evaluate((ol) => ({
      items: ol.querySelectorAll(':scope > li').length, current: ol.querySelectorAll('[aria-current="step"]').length,
    }));
    expect(r.items >= 2, `${r.items} steps`);
    expect(r.current === 1, `${r.current} current steps (need exactly 1)`);
    return `${r.items} steps, 1 current`;
  });
  await check('Stepper', 'every number window is at least the touch target and the digit is counted by position', async () => {
    await go('/components/stepper/code');
    const r = await main().locator('ol[data-component="Stepper"]').first().evaluate((ol) => [...ol.querySelectorAll(':scope > li:not([data-status="done"]) > span:first-child')].map((m) => ({ w: m.getBoundingClientRect().width, h: m.getBoundingClientRect().height, t: getComputedStyle(m, '::before').content })));
    expect(r.length > 0 && r.every((x) => x.w >= 43.5 && x.h >= 43.5), `windows ${r.map((x) => `${x.w}×${x.h}`).join(', ')}`);
    expect(r.every((x) => /counter\(step\)/.test(x.t)), `content ${r.map((x) => x.t).join(', ')}`);
    return `${r.length} windows numbered by counter(step)`;
  });
  await check('Stepper', 'no part of the stepper is the accent orange', async () => {
    await go('/components/stepper/code');
    const bad = await main().locator('ol[data-component="Stepper"]').evaluateAll((els) => {
      const probe = document.createElement('span'); probe.style.color = 'var(--ds-action-accent)'; document.body.append(probe);
      const accent = getComputedStyle(probe).color; probe.remove();
      const out = []; for (const el of els) for (const n of el.querySelectorAll('*')) { const cs = getComputedStyle(n); if (accent && [cs.backgroundColor, cs.color, cs.borderColor].some((c) => c === accent)) out.push(n.tagName); }
      return out;
    });
    expect(bad.length === 0, `${bad.length} orange parts`);
    return 'no orange';
  });
}
