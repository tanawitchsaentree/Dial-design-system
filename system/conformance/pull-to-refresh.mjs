// Behaviour checks for PullToRefresh, run by tooling/kiln/conformance.mjs on the built book. The pull is
// driven with synthetic TouchEvents on the list's scroller, so the same checks run on any machine.
export default async function pullToRefresh({ check, expect, page, go, main, tokens }) {
  const ROUTE = '/components/pull-to-refresh/code';
  const first = () => main().locator('[data-component="PullToRefresh"]').first();
  // drags the scroller from y0 by each step in dy, then lifts; returns what the page saw
  const framed = () => main().locator('[data-component="PullToRefresh"]').filter({ hasText: 'All rooms' }).first();
  const drag = (steps) => framed().evaluate(async (root, steps) => {
    const sc = root.querySelector('[role="region"]');
    const r = sc.getBoundingClientRect();
    const x = r.left + 40, y0 = r.top + 20;
    const t = (y) => new Touch({ identifier: 7, target: sc, clientX: x, clientY: y });
    const fire = (type, y) => {
      const touches = type === 'touchend' ? [] : [t(y)];
      const e = new TouchEvent(type, { touches, targetTouches: touches, changedTouches: [t(y)], bubbles: true, cancelable: true });
      sc.dispatchEvent(e);
      return e.defaultPrevented;
    };
    fire('touchstart', y0);
    const prevented = [];
    let peak = 'idle';
    for (const dy of steps) {
      prevented.push(fire('touchmove', y0 + dy));
      await new Promise((f) => requestAnimationFrame(() => f()));
      if (root.dataset.state === 'armed') peak = 'armed';
    }
    fire('touchend', y0 + steps[steps.length - 1]);
    await new Promise((f) => requestAnimationFrame(() => f()));
    return { prevented, peak, state: root.dataset.state, pull: parseFloat(root.style.getPropertyValue('--ptr-pull')) || 0 };
  }, steps);

  await check('PullToRefresh', 'the refresh key is a named 44px key that Enter presses, and the new time is spoken politely', async () => {
    await go(ROUTE);
    const min = parseFloat(tokens['layout.touch']?.value ?? '44px');
    const key = first().locator('[data-component="IconButton"]');
    const box = await key.evaluate((el) => { const r = el.getBoundingClientRect(); return { w: r.width, h: r.height, name: el.getAttribute('aria-label') }; });
    expect(box.w >= min - 0.5 && box.h >= min - 0.5, `key ${box.w}×${box.h}`);
    expect(!!box.name, 'the refresh key has no name');
    const live = await first().locator('[role="status"]').evaluate((el) => ({ live: el.getAttribute('aria-live'), text: el.textContent }));
    expect(live.live === 'polite', `status line aria-live ${live.live}`);
    await key.focus();
    await page.keyboard.press('Enter');
    const busy = await first().evaluate((el) => ({ state: el.dataset.state, busy: el.getAttribute('aria-busy'), text: el.querySelector('[role="status"]').textContent, bar: !!el.querySelector('[role="progressbar"]') }));
    expect(busy.state === 'working' && busy.busy === 'true' && busy.bar, `after Enter ${JSON.stringify(busy)}`);
    await first().locator('[role="status"]', { hasText: /Updated \d\d:\d\d/ }).waitFor({ timeout: 5000 });
    const after = await first().evaluate((el) => ({ state: el.dataset.state, text: el.querySelector('[role="status"]').textContent }));
    expect(after.state === 'idle', `state ${after.state} after the refresh`);
    expect(after.text !== live.text, `the time did not change (${after.text})`);
    return `${box.w}px "${box.name}", "${busy.text}" then "${after.text}"`;
  });

  await check('PullToRefresh', 'a pull past the detent asks the hub, a short pull goes back, and a drag up is never prevented', async () => {
    await go(ROUTE);
    const short = await drag([10, 20, 30, 40]);
    expect(short.state === 'idle' && short.peak === 'idle', `short pull ${JSON.stringify(short)}`);
    const up = await drag([-10, -30, -60]);
    expect(up.prevented.every((p) => !p), `an upward drag was prevented ${up.prevented.join(',')}`);
    const long = await drag([10, 40, 80, 120, 160, 200]);
    expect(long.peak === 'armed', 'the pull never reached the detent');
    expect(long.state === 'working', `released past the detent, state ${long.state}`);
    expect(long.prevented.some(Boolean), 'the pull did not hold the page still while pulling');
    return `short ${short.state}, up never prevented, long ${long.peak} then ${long.state}`;
  });

  await check('PullToRefresh', 'under reduce motion the released list lands at the detent at once, with no throw', async () => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await go(ROUTE);
    const r = await drag([10, 60, 120, 180, 220]);
    const detent = await framed().evaluate((el) => el.querySelector('[role="region"] > div:first-child').getBoundingClientRect().height);
    expect(r.state === 'working', `state ${r.state}`);
    expect(Math.abs(r.pull - detent) < 1, `pull ${r.pull} against detent ${detent} one frame after release`);
    return `pull ${r.pull}px = detent ${detent.toFixed(1)}px`;
  });

  await check('PullToRefresh', 'while it works nothing loops and nothing is the accent', async () => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    try {
      await go(ROUTE);
      await first().locator('[data-component="IconButton"]').click();
      const r = await first().evaluate((root) => {
        const probe = document.createElement('span'); probe.style.color = 'var(--ds-action-accent)'; document.body.append(probe);
        const accent = getComputedStyle(probe).color; probe.remove();
        const parts = [root, ...root.querySelectorAll('*')];
        return {
          looping: parts.filter((n) => { const c = getComputedStyle(n); return c.animationName !== 'none' && c.animationIterationCount === 'infinite'; }).length,
          orange: parts.filter((n) => { const c = getComputedStyle(n); return [c.backgroundColor, c.color].includes(accent); }).length,
          state: root.dataset.state,
        };
      });
      expect(r.state === 'working', `state ${r.state}`);
      expect(r.looping === 0 && r.orange === 0, `${r.looping} looping parts, ${r.orange} in the accent`);
      return 'still, no accent';
    } finally { await page.emulateMedia({ reducedMotion: 'reduce' }); }
  });

  await check('PullToRefresh', 'a failed refresh says so in words and keeps the old rows', async () => {
    await go(ROUTE);
    const failed = main().locator('[data-component="PullToRefresh"]').filter({ hasText: 'Soil sensor' }).first();
    const rows = await failed.locator('[role="region"]').innerText();
    await failed.locator('[data-component="IconButton"]').click();
    await failed.locator('[role="status"]', { hasText: 'did not answer' }).waitFor({ timeout: 5000 });
    const after = await failed.evaluate((el) => ({ state: el.dataset.state, rows: el.querySelector('[role="region"]').innerText }));
    expect(after.state === 'failed', `state ${after.state}`);
    expect(after.rows === rows, 'the rows changed');
    return 'failed line shown, rows kept';
  });
}
