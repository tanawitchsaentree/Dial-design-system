// Behaviour checks for Rating (dot-lattice marks, radiogroup in pick mode), run by tooling/kiln/conformance.mjs.
export default async function rating({ check, expect, go, main }) {
  await check('Rating', 'the marks are a labelled radio group with one chosen', async () => {
    await go('/components/rating/code');
    const r = await main().locator('[data-component="Rating"][role="radiogroup"]').first().evaluate((g) => ({
      radios: g.querySelectorAll('input[type="radio"]').length,
      checked: g.querySelectorAll('input[type="radio"]:checked').length,
      named: !!document.getElementById(g.getAttribute('aria-labelledby') || '')?.textContent,
    }));
    expect(r.radios >= 3, `${r.radios} marks`);
    expect(r.checked === 1, `${r.checked} chosen (need exactly 1)`);
    expect(r.named, 'the group has no printed name');
    return `${r.radios} marks, 1 chosen, named`;
  });
  await check('Rating', 'arrow keys walk the marks and Home and End reach the ends', async () => {
    await go('/components/rating/code');
    const g = main().locator('[data-component="Rating"][role="radiogroup"]').first();
    const radios = g.locator('input[type="radio"]');
    const n = await radios.count();
    await g.locator('input[type="radio"]:checked').focus();
    const before = await radios.evaluateAll((els) => els.findIndex((e) => e.checked));
    await g.page().keyboard.press('ArrowRight');
    const after = await radios.evaluateAll((els) => els.findIndex((e) => e.checked));
    expect(after === before + 1, `ArrowRight moved the choice ${before} to ${after}`);
    await g.page().keyboard.press('End');
    const last = await radios.evaluateAll((els) => els.findIndex((e) => e.checked));
    expect(last === n - 1, `End chose ${last}, need ${n - 1}`);
    await g.page().keyboard.press('Home');
    const first = await radios.evaluateAll((els) => els.findIndex((e) => e.checked));
    expect(first === 0, `Home chose ${first}, need 0`);
    return `moved ${before} to ${after}, End ${last}, Home ${first}`;
  });
  await check('Rating', 'every mark is a 44px target and lit differs from empty by shape', async () => {
    await go('/components/rating/code');
    const r = await main().locator('[data-component="Rating"][role="radiogroup"]').first().evaluate((g) => {
      const marks = [...g.querySelectorAll('label[data-fill]')];
      const lit = (m) => m.querySelectorAll('circle[data-on]').length;
      const full = marks.find((m) => m.dataset.fill === 'full');
      const empty = marks.find((m) => m.dataset.fill === 'empty');
      return { sizes: marks.map((m) => [m.getBoundingClientRect().width, m.getBoundingClientRect().height]), full: full ? lit(full) : 0, empty: empty ? lit(empty) : 0 };
    });
    expect(r.sizes.length > 0 && r.sizes.every(([w, h]) => w >= 43.5 && h >= 43.5), `marks ${r.sizes.map((s) => s.join('×')).join(', ')}`);
    expect(r.full > r.empty && r.empty > 0, `lit dots: full ${r.full}, empty ${r.empty} (the shapes must differ)`);
    return `targets ok, ${r.full} dots lit against ${r.empty}`;
  });
  await check('Rating', 'display mode is one named image that holds a half and takes no focus', async () => {
    await go('/components/rating/code');
    const r = await main().locator('[data-component="Rating"][data-readonly]').first().evaluate((el) => ({
      role: el.getAttribute('role'), name: el.getAttribute('aria-label') || '',
      half: el.querySelectorAll('[data-fill="half"]').length, inputs: el.querySelectorAll('input:not([type="hidden"])').length,
    }));
    expect(r.role === 'img' && /\d/.test(r.name), `role ${r.role}, name "${r.name}"`);
    expect(r.half === 1, `${r.half} half marks (need 1)`);
    expect(r.inputs === 0, `${r.inputs} focusable inputs in display mode`);
    return `"${r.name}", 1 half mark`;
  });
  await check('Rating', 'no part of the rating is the accent orange', async () => {
    await go('/components/rating/code');
    const bad = await main().locator('[data-component="Rating"]').evaluateAll((els) => {
      const probe = document.createElement('span'); probe.style.color = 'var(--ds-action-accent)'; document.body.append(probe);
      const accent = getComputedStyle(probe).color; probe.remove();
      const out = []; for (const el of els) for (const n of el.querySelectorAll('*')) { const cs = getComputedStyle(n); if (accent && [cs.backgroundColor, cs.color, cs.borderColor].some((c) => c === accent)) out.push(n.tagName); }
      return out;
    });
    expect(bad.length === 0, `${bad.length} orange parts`);
    return 'no orange';
  });
}
