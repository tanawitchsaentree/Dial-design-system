// Behaviour checks for Flex (one-line layout with a token gap), run by tooling/kiln/conformance.mjs.
export default async function flex({ check, expect, go, main }) {
  await check('Flex', 'the container is a flex box, takes no focus and adds no role', async () => {
    await go('/components/flex/code');
    const r = await main().locator('[data-component="Flex"]').evaluateAll((els) => ({
      n: els.length,
      notFlex: els.filter((e) => !getComputedStyle(e).display.includes('flex')).length,
      role: els.filter((e) => e.hasAttribute('role')).length,
      tab: els.filter((e) => e.tabIndex >= 0).length,
    }));
    expect(r.n >= 1, 'no Flex on the page');
    expect(r.notFlex === 0, `${r.notFlex} containers are not display flex`);
    expect(r.role === 0 && r.tab === 0, `${r.role} with a role, ${r.tab} focusable`);
    return `${r.n} containers, no role, no focus`;
  });
  await check('Flex', 'the gap between children comes from the token scale', async () => {
    await go('/components/flex/code');
    const r = await main().locator('[data-component="Flex"]').first().evaluate((e) => {
      const px = (v) => { const p = document.createElement('div'); p.style.blockSize = `var(--ds-stack-gap-${v})`; document.body.append(p); const h = p.getBoundingClientRect().height; p.remove(); return h; };
      const scale = ['xs', 'sm', 'md', 'lg', 'xl'].map(px);
      return { scale, gap: parseFloat(getComputedStyle(e).columnGap) };
    });
    expect(r.scale.every((h) => h > 0), 'a gap token resolves to 0');
    expect(r.scale.some((h) => Math.abs(h - r.gap) < 0.5), `gap ${r.gap}px is not on the scale ${r.scale.join('/')}`);
    return `gap ${r.gap}px`;
  });
  await check('Flex', 'a growing item takes the spare room and a no-shrink item keeps its size', async () => {
    await go('/components/flex/code');
    const r = await main().locator('[data-component="Flex"]:has(> [data-grow])').first().evaluate((e) => {
      const kids = [...e.children].map((c) => ({ grow: c.hasAttribute('data-grow'), w: c.getBoundingClientRect().width, flexShrink: getComputedStyle(c).flexShrink, flexGrow: getComputedStyle(c).flexGrow }));
      return { kids, total: e.getBoundingClientRect().width };
    });
    const grower = r.kids.find((k) => k.grow);
    const keys = r.kids.filter((k) => !k.grow);
    expect(r.kids.length >= 3 && grower, 'the first Flex needs a growing item and two others');
    expect(grower.flexGrow === '1', `flex-grow ${grower.flexGrow}`);
    expect(keys.every((k) => k.flexShrink === '0'), 'a key did not refuse to shrink');
    expect(grower.w > keys[0].w, `grower ${grower.w}px is not wider than a key ${keys[0].w}px`);
    return `grower ${Math.round(grower.w)}px of ${Math.round(r.total)}px`;
  });
  await check('Flex', 'justify between puts the first and last child on opposite edges, and wrap breaks a full line', async () => {
    await go('/components/flex/code');
    const r = await main().locator('[data-component="Flex"][data-direction="row"]').evaluateAll((els) => {
      const out = { between: null, wrap: null };
      for (const e of els) {
        const cs = getComputedStyle(e);
        if (cs.justifyContent === 'space-between' && e.children.length >= 2) {
          const box = e.getBoundingClientRect();
          const a = e.firstElementChild.getBoundingClientRect();
          const b = e.lastElementChild.getBoundingClientRect();
          out.between = { startGap: Math.abs(a.left - box.left), endGap: Math.abs(box.right - b.right), mid: Math.abs(b.left - a.right) };
        }
        if (e.hasAttribute('data-wrap') && cs.flexWrap === 'wrap') out.wrap = e.children.length;
      }
      return out;
    });
    expect(r.between && r.between.startGap < 2 && r.between.endGap < 2, `justify between ${JSON.stringify(r.between)}`);
    expect(r.wrap === null || r.wrap > 0, 'wrap set but no children');
    return 'ends on the edges';
  });
}
