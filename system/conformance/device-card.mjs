// Behaviour checks for DeviceCard, run by tooling/kiln/conformance.mjs on the built book. DeviceCard is one
// appliance laid out from anchor A (D-001): one orange part, the knob first in Tab order after the display,
// the knob at corner.knob-ratio of the short side, and 44px targets on a 375px phone.
export default async function deviceCard({ check, expect, page, go, main }) {
  const route = '/components/device-card/code';
  const cards = () => main().locator('[data-component="DeviceCard"]');
  const targets = () => cards().evaluateAll((els) => els.flatMap((c) => [...c.querySelectorAll('button, [role="slider"]')]
    .filter((e) => e.getBoundingClientRect().width > 0)
    .map((e) => { const b = e.getBoundingClientRect(); return Math.min(b.width, b.height); })));

  await check('DeviceCard', 'every part keeps a 44px target, also on a 375px phone', async () => {
    await go(route);
    const wide = await targets();
    await page.setViewportSize({ width: 375, height: 812 });
    await go(route);
    const phone = await targets();
    await page.setViewportSize({ width: 1440, height: 900 });
    expect(wide.length > 0 && phone.length > 0, 'no parts on the page');
    const min = Math.min(...wide, ...phone);
    expect(min >= 43.5, `smallest target ${min}px`);
    return `${phone.length} parts on a phone, smallest ${min}px`;
  });

  await check('DeviceCard', 'one orange part per device', async () => {
    await go(route);
    const r = await cards().evaluateAll((els) => {
      const probe = document.createElement('div'); probe.style.background = 'var(--ds-action-accent)'; document.body.append(probe);
      const accent = getComputedStyle(probe).backgroundColor; probe.remove();
      // an orange part is an element painted in the accent whose parent is not (its own children do not count twice)
      const orange = (e) => !!e && getComputedStyle(e).backgroundColor === accent;
      return els.map((c) => [...c.querySelectorAll('*')].filter((e) => orange(e) && !orange(e.parentElement)).length);
    });
    expect(r.length > 0, 'no DeviceCard on the page');
    const bad = r.filter((n) => n > 1);
    expect(!bad.length, `devices with more than one orange part: ${bad.join(', ')}`);
    return `${r.length} devices, ${r.filter((n) => n === 1).length} with one orange part`;
  });

  await check('DeviceCard', 'Tab reaches the knob first, after the display', async () => {
    await go(route);
    const card = cards().filter({ has: page.locator('[data-component="Rotary"]') }).first();
    const first = await card.evaluate((c) => {
      const f = [...c.querySelectorAll('button, [tabindex], input, a[href], select, textarea')].filter((e) => e.tabIndex >= 0 && !e.hasAttribute('disabled'));
      return { knob: !!f[0]?.closest('[data-component="Rotary"]'), role: f[0]?.getAttribute('role'), displayFocusable: !!c.querySelector('[data-component="Display"] [tabindex]') };
    });
    expect(first.knob && first.role === 'slider' && !first.displayFocusable, JSON.stringify(first));
    await card.locator('[role="slider"]').first().focus();
    const ok = await page.evaluate(() => document.activeElement?.getAttribute('role') === 'slider');
    expect(ok, 'the knob did not take focus');
    return 'knob first';
  });

  await check('DeviceCard', 'the knob is 0.36 of the short side', async () => {
    await go(route);
    const r = await cards().evaluateAll((els) => els.filter((c) => c.querySelector('[data-component="Rotary"] [role="slider"]')).map((c) => {
      const b = c.getBoundingClientRect(); const k = c.querySelector('[data-component="Rotary"] [role="slider"]').getBoundingClientRect();
      return +(k.width / Math.min(b.width, b.height)).toFixed(3);
    }));
    expect(r.length > 0, 'no knob on the page');
    const bad = r.filter((x) => Math.abs(x - 0.36) > 0.02);
    expect(!bad.length, `ratios ${r.join(', ')}`);
    return `ratios ${[...new Set(r)].join(', ')}`;
  });

  await check('DeviceCard', 'the body is a named region with the display as its polite status', async () => {
    await go(route);
    const r = await cards().evaluateAll((els) => els.map((c) => ({ tag: c.tagName.toLowerCase(), name: c.getAttribute('aria-label') ?? '', live: c.querySelector('[data-component="Display"]')?.getAttribute('aria-live') })));
    const bad = r.filter((x) => x.tag !== 'section' || !x.name || x.live !== 'polite');
    expect(r.length > 0 && !bad.length, JSON.stringify(bad[0] ?? r));
    return `${r.length} named devices`;
  });

  await check('DeviceCard', 'a narrow body stacks its parts in one column', async () => {
    await go(route);
    const fits = await cards().evaluateAll((els) => els.map((c) => ({ w: c.getBoundingClientRect().width, fit: c.getAttribute('data-fit'), layout: c.getAttribute('data-layout') })));
    const narrow = fits.filter((f) => f.layout === 'a' && f.w < 300);
    expect(narrow.length > 0, 'no narrow device on the page');
    expect(narrow.every((f) => f.fit === 'narrow'), JSON.stringify(narrow));
    return `${narrow.length} narrow devices stacked`;
  });
}
