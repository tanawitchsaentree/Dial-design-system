// Behaviour checks for FAB (the orange key in an opaque corner seat), run by tooling/kiln/conformance.mjs.
// UNVERIFIED here (needs a real device or emulator): env(safe-area-inset-*) values, forced-colors rendering.
export default async function fab({ check, expect, go, main, page }) {
  await check('FAB', 'the key is a named button fixed to the corner of its container', async () => {
    await go('/components/fab/code');
    const r = await main().locator('[data-component="FAB"]').first().evaluate((seat) => {
      const btn = seat.querySelector('button');
      const box = seat.offsetParent.getBoundingClientRect();
      const s = seat.getBoundingClientRect();
      return {
        tag: btn?.tagName, name: btn?.getAttribute('aria-label'), pos: getComputedStyle(seat).position,
        endGap: box.right - s.right, bottomGap: box.bottom - s.bottom, startGap: s.left - box.left, topGap: s.top - box.top,
      };
    });
    expect(r.tag === 'BUTTON' && !!r.name, `button ${r.tag} name ${r.name}`);
    expect(r.pos === 'absolute' || r.pos === 'fixed', `position ${r.pos}`);
    expect(r.endGap >= 0 && r.bottomGap >= 0 && r.endGap < r.startGap && r.bottomGap < r.topGap, `gaps end ${r.endGap} bottom ${r.bottomGap} start ${r.startGap} top ${r.topGap}`);
    return `corner gaps ${Math.round(r.endGap)}/${Math.round(r.bottomGap)}px`;
  });
  await check('FAB', 'the key is at least the touch target, round when plain and wider with a word', async () => {
    await go('/components/fab/code');
    const r = await main().locator('[data-component="FAB"]').evaluateAll((seats) => seats.map((s) => {
      const b = s.querySelector('button').getBoundingClientRect();
      return { w: b.width, h: b.height, ext: s.hasAttribute('data-extended'), radius: getComputedStyle(s.querySelector('button')).borderTopLeftRadius };
    }));
    expect(r.length >= 2, `${r.length} FABs in the subject`);
    expect(r.every((x) => x.w >= 43.5 && x.h >= 43.5), `keys ${r.map((x) => `${x.w}x${x.h}`).join(', ')}`);
    const plain = r.find((x) => !x.ext); const ext = r.find((x) => x.ext);
    expect(Math.abs(plain.w - plain.h) < 1, `plain key ${plain.w}x${plain.h} is not square`);
    expect(ext.w > ext.h, `extended key ${ext.w}x${ext.h} is not wider than tall`);
    return `plain ${plain.w}x${plain.h}, extended ${ext.w}x${ext.h}`;
  });
  await check('FAB', 'the seat is opaque and the key is the one orange part', async () => {
    await go('/components/fab/code');
    const r = await main().locator('[data-component="FAB"]').first().evaluate((seat) => {
      const probe = document.createElement('span'); probe.style.color = 'var(--ds-action-accent)'; document.body.append(probe);
      const accent = getComputedStyle(probe).color; probe.remove();
      const bg = getComputedStyle(seat).backgroundColor;
      const key = getComputedStyle(seat.querySelector('button'));
      const orange = [seat, ...seat.querySelectorAll('*')].filter((n) => { const cs = getComputedStyle(n); return [cs.backgroundColor, cs.color, cs.borderColor].some((c) => c === accent); });
      return { bg, keyBg: key.backgroundColor, accent, orange: orange.map((n) => n.tagName) };
    });
    expect(r.bg !== 'rgba(0, 0, 0, 0)' && r.bg !== 'transparent' && r.bg !== r.accent, `seat background ${r.bg}`);
    expect(r.keyBg === r.accent, `key ${r.keyBg} is not the accent ${r.accent}`);
    expect(r.orange.length === 1 && r.orange[0] === 'BUTTON', `orange parts ${r.orange.join(',')}`);
    return 'opaque seat, one orange key';
  });
  await check('FAB', 'the key presses with Enter and Space, and a hover does not move it', async () => {
    await go('/components/fab/code');
    const btn = main().locator('[data-component="FAB"] button').first();
    await btn.evaluate((b) => { window.__fab = 0; b.addEventListener('click', () => { window.__fab += 1; }); });
    await btn.focus();
    await page.keyboard.press('Enter');
    await page.keyboard.press('Space');
    const n = await page.evaluate(() => window.__fab);
    expect(n === 2, `${n} clicks from Enter and Space (need 2)`);
    const before = await btn.boundingBox();
    await btn.hover();
    const after = await btn.boundingBox();
    expect(Math.abs(before.x - after.x) < 0.5 && Math.abs(before.y - after.y) < 0.5 && Math.abs(before.width - after.width) < 0.5, `hover moved the key ${JSON.stringify(before)} -> ${JSON.stringify(after)}`);
    return '2 presses by keyboard, no hover lift';
  });
}
