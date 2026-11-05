// Behaviour checks for Spacer (empty room of a token size, or flexible room), run by tooling/kiln/conformance.mjs.
export default async function spacer({ check, expect, go, main }) {
  await check('Spacer', 'every spacer is hidden from assistive tech, empty and out of the tab order', async () => {
    await go('/components/spacer/code');
    const r = await main().locator('[data-component="Spacer"]').evaluateAll((els) => ({
      n: els.length,
      shown: els.filter((e) => e.getAttribute('aria-hidden') !== 'true').length,
      filled: els.filter((e) => e.textContent.trim().length > 0 || e.children.length > 0).length,
      focusable: els.filter((e) => e.tabIndex >= 0).length,
    }));
    expect(r.n >= 3, `${r.n} spacers`);
    expect(r.shown === 0, `${r.shown} spacers not aria-hidden`);
    expect(r.filled === 0, `${r.filled} spacers have content`);
    expect(r.focusable === 0, `${r.focusable} spacers can take focus`);
    return `${r.n} spacers hidden and empty`;
  });
  await check('Spacer', 'a fixed spacer is exactly its token size on its own axis', async () => {
    await go('/components/spacer/code');
    const r = await main().locator('[data-component="Spacer"]:not([data-flexible])').evaluateAll((els) => {
      const probe = document.createElement('div'); probe.style.blockSize = 'var(--ds-stack-gap-lg)'; probe.style.inlineSize = 'var(--ds-stack-gap-xl)'; document.body.append(probe);
      const lg = probe.getBoundingClientRect().height, xl = probe.getBoundingClientRect().width; probe.remove();
      const block = els.find((e) => e.dataset.axis === 'block'), inline = els.find((e) => e.dataset.axis === 'inline');
      return { lg, xl, h: block ? block.getBoundingClientRect().height : -1, w: inline ? inline.getBoundingClientRect().width : -1 };
    });
    expect(r.lg > 0 && r.xl > r.lg, `token sizes ${r.lg} and ${r.xl}`);
    expect(Math.abs(r.h - r.lg) < 0.6, `block spacer is ${r.h}px, token is ${r.lg}px`);
    expect(Math.abs(r.w - r.xl) < 0.6, `inline spacer is ${r.w}px, token is ${r.xl}px`);
    return `block ${r.h}px, inline ${r.w}px`;
  });
  await check('Spacer', 'a flexible spacer in a row takes the room that is left and pushes the next part to the end', async () => {
    await go('/components/spacer/code');
    const r = await main().locator('[data-component="Spacer"][data-flexible]').evaluateAll((all) => all.map((s) => {
      const p = s.parentElement, prev = s.previousElementSibling, next = s.nextElementSibling;
      const pr = p.getBoundingClientRect(), sr = s.getBoundingClientRect(), a = prev.getBoundingClientRect(), b = next.getBoundingClientRect();
      const rtl = getComputedStyle(p).direction === 'rtl';
      return { gap: sr.width, edge: rtl ? Math.abs(b.left - pr.left) : Math.abs(pr.right - b.right), start: rtl ? Math.abs(pr.right - a.right) : Math.abs(a.left - pr.left) };
    })).then((list) => list.sort((x, y) => y.gap - x.gap)[0]);
    expect(r.gap > 16, `spacer is ${r.gap}px wide`);
    expect(r.edge < 1.5, `next part ends ${r.edge}px from the row end`);
    expect(r.start < 1.5, `previous part starts ${r.start}px from the row start`);
    return `spacer ${Math.round(r.gap)}px, next part at the end`;
  });
}
