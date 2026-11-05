// Behaviour checks for Carousel (recessed window on a scroll-snap track, two keys, a row of holes), run by tooling/kiln/conformance.mjs.
// Conformance runs with reducedMotion: 'reduce', so the track jumps; the motion check turns it back on for a moment.
export default async function carousel({ check, expect, go, main, page }) {
  const root = () => main().locator('section[data-component="Carousel"]').first();
  const read = () => root().evaluate((s) => {
    const box = s.querySelector('[role="group"][tabindex]');
    const slides = [...box.children];
    const on = [...s.querySelectorAll('[data-on]')].filter((n) => !n.closest('button'));
    const keys = [...s.querySelectorAll('button')];
    const status = s.querySelector('[role="status"]');
    const at = slides.findIndex((c) => Math.abs(c.getBoundingClientRect().x - box.getBoundingClientRect().x) < 2);
    return {
      roledesc: s.getAttribute('aria-roledescription'), name: s.getAttribute('aria-label'),
      slides: slides.map((c) => ({ role: c.getAttribute('role'), rd: c.getAttribute('aria-roledescription'), label: c.getAttribute('aria-label') })),
      lit: on.length, litAt: on.length ? [...on[0].parentElement.children].indexOf(on[0]) : -1,
      at, scroll: box.scrollLeft, status: status ? status.textContent.trim() : '',
      prevOff: keys[0].disabled, nextOff: keys[1].disabled,
    };
  });

  await check('Carousel', 'the region is a named carousel and every slide is a group named n of N', async () => {
    await go('/components/carousel/code');
    const r = await read();
    expect(r.roledesc === 'carousel', `aria-roledescription is "${r.roledesc}"`);
    expect(!!r.name, 'the carousel has no name');
    expect(r.slides.length >= 3, `${r.slides.length} slides (need at least 3)`);
    const bad = r.slides.filter((s, i) => s.role !== 'group' || s.rd !== 'slide' || !new RegExp(`\\b${i + 1}\\b.*\\b${r.slides.length}\\b`).test(s.label ?? ''));
    expect(bad.length === 0, `${bad.length} slides are not groups named n of N: ${bad.map((s) => s.label).join(', ')}`);
    expect(r.lit === 1 && r.litAt === 0, `${r.lit} lit holes, at ${r.litAt}`);
    return `${r.slides.length} slides, "${r.slides[0].label}" first`;
  });

  await check('Carousel', 'the next key moves the track to the next slide, lights the hole and says the position', async () => {
    await go('/components/carousel/code');
    const before = await read();
    expect(before.prevOff && !before.nextOff, `at the first slide previous is ${before.prevOff ? 'flat' : 'live'} and next is ${before.nextOff ? 'flat' : 'live'}`);
    await root().getByRole('button', { name: /next/i }).click();
    await page.waitForTimeout(500);
    const after = await read();
    expect(after.at === 1, `the slide at the window edge is ${after.at} (need 1)`);
    expect(after.scroll !== before.scroll, 'the track did not move');
    expect(after.litAt === 1 && after.lit === 1, `lit hole at ${after.litAt}`);
    expect(/2/.test(after.status), `status "${after.status}"`);
    expect(!after.prevOff, 'previous is still flat on the second slide');
    return `slide 1 to 2, status "${after.status}"`;
  });

  await check('Carousel', 'the arrow keys step the slide and the end keys go flat', async () => {
    await go('/components/carousel/code');
    const box = root().locator('[role="group"][tabindex="0"]');
    await box.focus();
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(500);
    const one = await read();
    expect(one.at === 1 && one.litAt === 1, `after ArrowRight: slide ${one.at}, lit ${one.litAt}`);
    await page.keyboard.press('End');
    await page.waitForTimeout(500);
    const end = await read();
    expect(end.at === end.slides.length - 1 && end.litAt === end.slides.length - 1, `after End: slide ${end.at}, lit ${end.litAt}`);
    expect(end.nextOff && !end.prevOff, `at the last slide next is ${end.nextOff ? 'flat' : 'live'}`);
    await page.keyboard.press('Home');
    await page.waitForTimeout(500);
    const home = await read();
    expect(home.at === 0 && home.prevOff, `after Home: slide ${home.at}, previous ${home.prevOff ? 'flat' : 'live'}`);
    return `ArrowRight to 2, End to ${end.slides.length}, Home to 1`;
  });

  await check('Carousel', 'a key that goes flat hands focus to the other key', async () => {
    await go('/components/carousel/code');
    const prev = root().getByRole('button', { name: /previous/i });
    const next = root().getByRole('button', { name: /next/i });
    const total = (await read()).slides.length;
    await next.focus();
    for (let i = 0; i < total - 1; i++) { await page.keyboard.press('Enter'); await page.waitForTimeout(150); }
    await page.waitForTimeout(400);
    const r = await root().evaluate((s) => ({ active: document.activeElement?.getAttribute('aria-label') ?? document.activeElement?.tagName }));
    expect(/previous/i.test(r.active ?? ''), `focus is on "${r.active}" after the next key went flat`);
    expect(await next.isDisabled() && await prev.isEnabled(), 'next should be flat and previous live');
    return `focus on "${r.active}"`;
  });

  await check('Carousel', 'the keys are at least the touch target and nothing is orange', async () => {
    await go('/components/carousel/code');
    const r = await root().evaluate((s) => {
      const probe = document.createElement('span'); probe.style.color = 'var(--ds-action-accent)'; document.body.append(probe);
      const accent = getComputedStyle(probe).color; probe.remove();
      const keys = [...s.querySelectorAll('button')].map((b) => ({ w: b.getBoundingClientRect().width, h: b.getBoundingClientRect().height }));
      const bad = [...s.querySelectorAll('*')].filter((n) => { const cs = getComputedStyle(n); return accent && [cs.backgroundColor, cs.color, cs.borderColor].some((c) => c === accent); }).length;
      return { keys, bad };
    });
    expect(r.keys.length === 2 && r.keys.every((k) => k.w >= 43.5 && k.h >= 43.5), `keys ${r.keys.map((k) => `${k.w}×${k.h}`).join(', ')}`);
    expect(r.bad === 0, `${r.bad} orange parts`);
    return `keys ${r.keys.map((k) => `${k.w}×${k.h}`).join(', ')}, no orange`;
  });

  await check('Carousel', 'with motion allowed the track glides; under reduce motion it lands at once', async () => {
    await go('/components/carousel/code');
    const probe = async () => {
      await root().getByRole('button', { name: /next/i }).click();
      await page.waitForTimeout(30);
      const early = await root().evaluate((s) => { const box = s.querySelector('[role="group"][tabindex]'); const c = box.children[1]; return Math.abs(c.getBoundingClientRect().x - box.getBoundingClientRect().x); });
      await page.waitForTimeout(600);
      return early;
    };
    const reduced = await probe();
    expect(reduced < 2, `under reduce motion the slide was ${reduced}px from the edge after 30ms`);
    await go('/components/carousel/code');
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    let gliding;
    try { gliding = await probe(); } finally { await page.emulateMedia({ reducedMotion: 'reduce' }); }
    expect(gliding > 2, `with motion allowed the slide was already ${gliding}px from the edge after 30ms`);
    return `reduce: ${reduced}px at 30ms, motion: ${Math.round(gliding)}px at 30ms`;
  });
}
