// Behaviour checks for Onboarding (a ring and a plastic callout that walk a tour), run by tooling/kiln/conformance.mjs.
// The Usage subject is a three-step tour that starts open on the keys #tour-heat, #tour-lamp and #tour-fan.
export default async function onboarding({ page, check, expect, go, main }) {
  const dialog = () => page.locator('div[role="dialog"][data-component="CoachMark"]').first();
  const ring = () => page.locator('div[data-component="CoachMark"][data-part="ring"]').first();
  const load = async () => { await go('/components/onboarding/code'); await dialog().waitFor({ state: 'visible' }); await page.waitForTimeout(500); };
  const activeId = () => page.evaluate(() => document.activeElement?.id || document.activeElement?.tagName);

  await check('Onboarding', 'the tour opens as a named dialog with the count, focus on the panel and a ring round the part', async () => {
    await load();
    const r = await page.evaluate(() => {
      const d = document.querySelector('div[role="dialog"][data-component="CoachMark"]');
      const ring = document.querySelector('div[data-component="CoachMark"][data-part="ring"]');
      const t = document.getElementById('tour-heat');
      const rb = ring.getBoundingClientRect(), tb = t.getBoundingClientRect();
      const labelled = document.getElementById(d.getAttribute('aria-labelledby'))?.textContent;
      const described = (d.getAttribute('aria-describedby') || '').split(' ').map((i) => document.getElementById(i)?.textContent).join('|');
      return {
        labelled, described, focus: document.activeElement === d,
        encloses: rb.left <= tb.left && rb.top <= tb.top && rb.right >= tb.right && rb.bottom >= tb.bottom,
        ringEvents: getComputedStyle(ring).pointerEvents, ringBorder: parseFloat(getComputedStyle(ring).borderTopWidth),
        back: [...d.querySelectorAll('button')].find((b) => b.textContent === 'Back')?.disabled,
      };
    });
    expect(!!r.labelled, 'the dialog has no name');
    expect(/^1 of 3\|/.test(r.described), `description ${r.described}`);
    expect(r.focus, 'focus is not on the panel');
    expect(r.encloses, 'the ring does not enclose the part');
    expect(r.ringEvents === 'none' && r.ringBorder > 0, `ring pointer-events ${r.ringEvents}, border ${r.ringBorder}px`);
    expect(r.back === true, 'Back is not disabled on step 1');
    return `named "${r.labelled}", 1 of 3, ring ${r.ringBorder}px round the part`;
  });

  await check('Onboarding', 'Next walks the steps, the last step reads Done, and Done hands focus back to the part without scrolling', async () => {
    await load();
    const title = () => dialog().evaluate((d) => document.getElementById(d.getAttribute('aria-labelledby')).textContent);
    const y0 = await page.evaluate(() => scrollY);
    const t1 = await title();
    await dialog().getByRole('button', { name: 'Next' }).click();
    await page.waitForTimeout(200);
    const t2 = await title();
    expect(t1 !== t2, `title stayed "${t1}"`);
    const count2 = await dialog().evaluate((d) => document.getElementById(d.getAttribute('aria-describedby').split(' ')[0]).textContent);
    expect(count2 === '2 of 3', `count ${count2}`);
    expect(await dialog().evaluate((d) => document.activeElement === d), 'focus did not move to the panel on the new step');
    await dialog().getByRole('button', { name: 'Next' }).click();
    await page.waitForTimeout(200);
    const skipOnLast = await dialog().getByRole('button', { name: 'Skip' }).count();
    expect(skipOnLast === 0, 'Skip is drawn on the last step');
    await dialog().getByRole('button', { name: 'Done' }).click();
    await page.waitForFunction(() => !document.querySelector('div[role="dialog"][data-component="CoachMark"]'), null, { timeout: 3000 });
    expect(await activeId() === 'tour-fan', `focus is on ${await activeId()}, not the last part`);
    const y1 = await page.evaluate(() => scrollY);
    expect(y1 === y0, `the page scrolled from ${y0} to ${y1}`);
    return `${t1} then ${t2}; Done returned focus to #tour-fan; scrollY ${y1}`;
  });

  await check('Onboarding', 'Escape ends the tour and returns focus to the marked part', async () => {
    await load();
    await page.keyboard.press('Escape');
    await page.waitForFunction(() => !document.querySelector('div[role="dialog"][data-component="CoachMark"]'), null, { timeout: 3000 });
    expect(await activeId() === 'tour-heat', `focus is on ${await activeId()}`);
    expect((await ring().count()) === 0, 'the ring stayed on the page');
    return 'closed, focus back on #tour-heat, ring gone';
  });

  await check('Onboarding', 'Tab past either end of the panel hands focus to the part, and every key is at least the touch target', async () => {
    await load();
    const sizes = await dialog().evaluate((d) => [...d.querySelectorAll('button')].map((b) => { const r = b.getBoundingClientRect(); return [r.width, r.height]; }));
    expect(sizes.length >= 2 && sizes.every(([w, h]) => w >= 43.5 && h >= 43.5), `keys ${sizes.map((s) => s.join('×')).join(', ')}`);
    await dialog().getByRole('button', { name: 'Next' }).focus();
    await page.keyboard.press('Tab');
    expect(await activeId() === 'tour-heat', `Tab from the last key landed on ${await activeId()}`);
    await dialog().focus();
    await page.keyboard.press('Shift+Tab');
    expect(await activeId() === 'tour-heat', `Shift+Tab from the panel landed on ${await activeId()}`);
    return `${sizes.length} keys at least 44px; Tab and Shift+Tab leave to #tour-heat`;
  });

  await check('Onboarding', 'the panel stays on the screen, does not dim the page and nothing in it is the accent orange', async () => {
    await load();
    const r = await dialog().evaluate((p) => {
      const b = p.getBoundingClientRect();
      const probe = document.createElement('span'); probe.style.color = 'var(--ds-action-accent)'; document.body.append(probe);
      const accent = getComputedStyle(probe).color; probe.remove();
      const ring = document.querySelector('div[data-component="CoachMark"][data-part="ring"]');
      let orange = 0;
      for (const n of [p, ring, ...p.querySelectorAll('*')]) { const cs = getComputedStyle(n); if ([cs.backgroundColor, cs.color, cs.borderTopColor].includes(accent)) orange++; }
      // a point far from the part and the panel must still hit the page, not a backdrop
      const hit = document.elementFromPoint(document.documentElement.clientWidth - 4, document.documentElement.clientHeight - 4);
      return { inside: b.left >= 0 && b.top >= 0 && b.right <= innerWidth && b.bottom <= innerHeight, orange, backdrop: !!hit?.closest('[data-component="CoachMark"]') };
    });
    expect(r.inside, 'the panel runs off the screen');
    expect(r.orange === 0, `${r.orange} orange parts`);
    expect(!r.backdrop, 'something from the tour covers the page');
    return 'on screen, no backdrop, no orange';
  });

  await check('Onboarding', 'the panel rises in with a transition and sinks out before it leaves the page', async () => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    try {
      await load();
      const t = await dialog().evaluate((p) => getComputedStyle(p).transitionProperty);
      expect(/transform/.test(t) && /opacity/.test(t), `transition-property ${t}`);
      await page.evaluate(() => {
        const d = document.querySelector('div[role="dialog"][data-component="CoachMark"]');
        window.__seen = [];
        new MutationObserver(() => window.__seen.push(`${d.getAttribute('data-state')}${d.hasAttribute('inert') ? '+inert' : ''}`)).observe(d, { attributes: true });
      });
      await page.keyboard.press('Escape');
      await page.waitForFunction(() => !document.querySelector('div[role="dialog"][data-component="CoachMark"]'), null, { timeout: 3000 });
      const seen = await page.evaluate(() => window.__seen);
      expect(seen.includes('closing+inert'), `states seen while it left: ${seen.join(', ')}`);
    } finally {
      await page.emulateMedia({ reducedMotion: 'reduce' });
    }
    return 'transform and opacity transition, closing state then gone';
  });
}
