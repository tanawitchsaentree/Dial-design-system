// Behaviour checks for Box (a block with token padding, ground and corner), run by tooling/kiln/conformance.mjs.
export default async function box({ check, expect, go, main }) {
  await check('Box', 'the as prop renders the chosen element and the box takes no focus', async () => {
    await go('/components/box/code');
    const r = await main().locator('[data-component="Box"]').first().evaluate((el) => ({ tag: el.tagName, tabindex: el.getAttribute('tabindex'), role: el.getAttribute('role') }));
    expect(r.tag === 'SECTION', `rendered ${r.tag}`);
    expect(r.tabindex === null && r.role === null, `tabindex ${r.tabindex}, role ${r.role}`);
    return 'section, no tabindex, no role';
  });
  await check('Box', 'padding on the first box is the lg inset on every side and the box is not wider than its parent', async () => {
    await go('/components/box/code');
    const r = await main().locator('[data-component="Box"]').first().evaluate((el) => {
      const probe = document.createElement('span'); probe.style.display = 'block'; probe.style.width = 'var(--ds-gap-inset)'; document.body.append(probe);
      const want = probe.getBoundingClientRect().width; probe.remove();
      const cs = getComputedStyle(el);
      return { want, sides: [cs.paddingTop, cs.paddingRight, cs.paddingBottom, cs.paddingLeft].map(parseFloat), w: el.getBoundingClientRect().width, pw: el.parentElement.getBoundingClientRect().width };
    });
    expect(r.want > 0 && r.sides.every((s) => Math.abs(s - r.want) < 0.5), `padding ${r.sides.join('/')} against ${r.want}`);
    expect(r.w <= r.pw + 0.5, `box ${r.w} in parent ${r.pw}`);
    return `padding ${r.want}px on all sides`;
  });
  await check('Box', 'the raised ground and the panel corner come from tokens', async () => {
    await go('/components/box/code');
    const r = await main().locator('[data-component="Box"]').first().evaluate((el) => {
      const probe = document.createElement('div'); probe.style.backgroundColor = 'var(--ds-surface-raised)'; probe.style.borderRadius = 'var(--ds-corner-panel)'; document.body.append(probe);
      const p = getComputedStyle(probe); const want = { bg: p.backgroundColor, radius: p.borderTopLeftRadius }; probe.remove();
      const cs = getComputedStyle(el);
      return { want, bg: cs.backgroundColor, radius: cs.borderTopLeftRadius };
    });
    expect(r.bg === r.want.bg, `background ${r.bg} against ${r.want.bg}`);
    expect(r.radius === r.want.radius && parseFloat(r.radius) > 0, `radius ${r.radius} against ${r.want.radius}`);
    return `ground ${r.bg}, corner ${r.radius}`;
  });
  await check('Box', 'no part of a box is the accent orange', async () => {
    await go('/components/box/code');
    const bad = await main().locator('[data-component="Box"]').evaluateAll((els) => {
      const probe = document.createElement('span'); probe.style.color = 'var(--ds-action-accent)'; document.body.append(probe);
      const accent = getComputedStyle(probe).color; probe.remove();
      const out = []; for (const el of els) for (const n of [el, ...el.querySelectorAll('*')]) { const cs = getComputedStyle(n); if (accent && [cs.backgroundColor, cs.color, cs.borderColor].some((c) => c === accent)) out.push(n.tagName); }
      return out;
    });
    expect(bad.length === 0, `${bad.length} orange parts`);
    return 'no orange';
  });
}
