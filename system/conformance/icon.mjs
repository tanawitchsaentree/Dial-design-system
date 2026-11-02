// Behaviour checks for Icon, run by tooling/kiln/conformance.mjs on the built book. Icon is printing made of
// holes: a 7 by 7 field of round dots in currentColor, hidden unless it is labelled, never focusable.
export default async function icon({ check, expect, page, go, main }) {
  const all = () => main().locator('[data-component="Icon"]');

  await check('Icon', 'every glyph in the set renders with its own pattern of dots', async () => {
    await go('/components/icon/code');
    const r = await main().locator('.icon-grid [data-component="Icon"]').evaluateAll((els) => els.map((e) => {
      const p = e.querySelector('path'); const b = p ? p.getBBox() : { width: 0, height: 0 };
      return { name: e.dataset.name, d: p?.getAttribute('d') ?? '', w: b.width, h: b.height, box: e.getBoundingClientRect().width };
    }));
    expect(r.length >= 46, `only ${r.length} glyphs in the set`);
    const empty = r.filter((x) => !x.d || x.w <= 0 || x.h <= 0 || x.box <= 0);
    expect(!empty.length, `empty glyphs ${empty.map((x) => x.name).join(', ')}`);
    expect(new Set(r.map((x) => x.d)).size === r.length, 'two names draw the same pattern');
    expect(new Set(r.map((x) => x.name)).size === r.length, 'a name appears twice');
    return `${r.length} glyphs, ${new Set(r.map((x) => x.d)).size} patterns`;
  });

  await check('Icon', 'a glyph with no label is hidden from assistive tech and never focusable', async () => {
    await go('/components/icon/code');
    const r = await all().evaluateAll((els) => els.filter((e) => !e.hasAttribute('aria-label')).map((e) => ({ hidden: e.getAttribute('aria-hidden'), role: e.getAttribute('role'), focusable: e.getAttribute('focusable'), tab: e.tabIndex })));
    expect(r.length > 0, 'no decorative Icon on the page');
    const bad = r.filter((x) => x.hidden !== 'true' || x.role || x.focusable !== 'false' || x.tab >= 0);
    expect(!bad.length, `${bad.length} decorative glyphs exposed: ${JSON.stringify(bad[0])}`);
    return `${r.length} hidden`;
  });

  await check('Icon', 'a glyph with a label is an image named by that label', async () => {
    await go('/components/icon/code');
    for (const name of ['Strong signal', 'Battery half full']) {
      const n = await main().getByRole('img', { name, exact: true }).count();
      expect(n >= 1, `no image named ${name}`);
    }
    const r = await all().evaluateAll((els) => els.filter((e) => e.hasAttribute('aria-label')).map((e) => ({ role: e.getAttribute('role'), label: e.getAttribute('aria-label'), hidden: e.getAttribute('aria-hidden') })));
    const bad = r.filter((x) => x.role !== 'img' || !x.label.trim() || x.hidden === 'true');
    expect(!bad.length, `bad labelled glyphs ${JSON.stringify(bad[0])}`);
    return `${r.length} named`;
  });

  await check('Icon', 'glyphs print in the ink of their part and are never orange on the plastic', async () => {
    await go('/components/icon/code');
    const r = await all().evaluateAll((els) => {
      const probe = (c) => { const d = document.createElement('span'); d.style.color = `var(${c})`; document.body.append(d); const x = getComputedStyle(d).color; d.remove(); return x; };
      const accent = probe('--ds-action-accent');
      return els.map((e) => { const s = getComputedStyle(e); return { fill: s.fill, color: s.color, accent, shadow: s.filter }; });
    });
    const bad = r.filter((x) => x.fill !== x.color || x.fill === x.accent);
    expect(!bad.length, `bad ${JSON.stringify(bad[0])}`);
    return `${r.length} in currentColor`;
  });

  await check('Icon', 'sizes follow the control icon tokens and sm draws larger dots', async () => {
    await go('/components/icon/code');
    const r = await page.evaluate(() => {
      const probe = (v) => { const d = document.createElement('div'); d.style.inlineSize = v; document.body.append(d); const w = d.getBoundingClientRect().width; d.remove(); return w; };
      const want = { sm: probe('var(--ds-control-icon-sm)'), md: probe('var(--ds-control-icon-md)'), lg: probe('calc(var(--ds-control-icon-md) + var(--ds-space-1))') };
      const got = {}; const dots = {};
      for (const e of document.querySelectorAll('main [data-component="Icon"][data-name="settings"]')) {
        got[e.dataset.size] = e.getBoundingClientRect().width;
        dots[e.dataset.size] = e.querySelector('path').getAttribute('d').match(/a([\d.]+)/)?.[1];
      }
      return { want, got, dots };
    });
    for (const s of ['sm', 'md', 'lg']) expect(Math.abs((r.got[s] ?? 0) - r.want[s]) < 0.5, `${s} is ${r.got[s]}px, token says ${r.want[s]}px`);
    expect(Number(r.dots.sm) > Number(r.dots.md), `sm dot ${r.dots.sm} is not larger than md ${r.dots.md}`);
    return `sm ${r.got.sm} md ${r.got.md} lg ${r.got.lg}px, dot r ${r.dots.sm} / ${r.dots.md}`;
  });
}
