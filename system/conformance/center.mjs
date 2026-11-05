// Behaviour checks for Center (a layout primitive that centres its children), run by tooling/kiln/conformance.mjs.
export default async function center({ check, expect, go, main }) {
  await check('Center', 'on both axes the child sits in the middle of the parent box', async () => {
    await go('/components/center/code');
    const r = await main().locator('[data-component="Center"][data-axis="both"]').first().evaluate((el) => {
      const p = el.parentElement.getBoundingClientRect();
      const c = el.firstElementChild.getBoundingClientRect();
      return { dx: (c.left + c.right) / 2 - (p.left + p.right) / 2, dy: (c.top + c.bottom) / 2 - (p.top + p.bottom) / 2, ph: p.height, ch: c.height };
    });
    expect(r.ph > r.ch, `parent ${r.ph}px is not taller than the child ${r.ch}px`);
    expect(Math.abs(r.dx) <= 1, `off centre by ${r.dx}px along the line`);
    expect(Math.abs(r.dy) <= 1, `off centre by ${r.dy}px from top to bottom`);
    return `offset ${r.dx.toFixed(1)}, ${r.dy.toFixed(1)}`;
  });
  await check('Center', 'size caps the inline size at a container token and the box stays centred', async () => {
    await go('/components/center/code');
    const r = await main().locator('[data-component="Center"][data-axis="inline"]').first().evaluate((el) => {
      const probe = document.createElement('span'); probe.style.display = 'block'; probe.style.inlineSize = 'var(--ds-container-max-sm)'; document.body.append(probe);
      const cap = probe.getBoundingClientRect().width; probe.remove();
      const cs = getComputedStyle(el); const b = el.getBoundingClientRect(); const p = el.parentElement.getBoundingClientRect();
      const ps = getComputedStyle(el.parentElement);
      const inner = p.width - parseFloat(ps.paddingLeft) - parseFloat(ps.paddingRight);
      return { cap, w: b.width, max: parseFloat(cs.maxInlineSize), inner, off: (b.left + b.right) / 2 - (p.left + p.right) / 2 };
    });
    expect(Math.abs(r.max - r.cap) <= 0.5, `max-inline-size ${r.max}px, want the token ${r.cap}px`);
    expect(r.w <= r.cap + 0.5, `width ${r.w}px is over the cap ${r.cap}px`);
    expect(Math.abs(r.off) <= 1, `box off centre by ${r.off}px`);
    return `${r.w}px under a ${r.cap}px cap`;
  });
  await check('Center', 'it adds no role, no focus stop and no orange of its own', async () => {
    await go('/components/center/code');
    const r = await main().locator('[data-component="Center"]').evaluateAll((els) => {
      const probe = document.createElement('span'); probe.style.color = 'var(--ds-action-accent)'; document.body.append(probe);
      const accent = getComputedStyle(probe).color; probe.remove();
      return els.map((e) => { const cs = getComputedStyle(e); return { role: e.getAttribute('role'), tab: e.getAttribute('tabindex'), orange: [cs.backgroundColor, cs.color, cs.borderColor].includes(accent) }; });
    });
    expect(r.length >= 2, `${r.length} Center elements`);
    expect(r.every((x) => !x.role && x.tab === null), 'a Center carries a role or tabindex');
    expect(r.every((x) => !x.orange), 'a Center is orange');
    return `${r.length} Centers, no role, no tabindex, no orange`;
  });
}
