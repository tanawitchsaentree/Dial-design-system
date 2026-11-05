// Behaviour checks for Fieldset (printed box round related controls), run by tooling/kiln/conformance.mjs.
export default async function fieldset({ check, expect, go, main }) {
  await check('Fieldset', 'the box is a named group with its legend as the first child and a described hint', async () => {
    await go('/components/fieldset/code');
    const r = await main().locator('fieldset[data-component="Fieldset"][aria-describedby]').first().evaluate((fs) => {
      const lg = fs.querySelector(':scope > legend');
      const ids = (fs.getAttribute('aria-describedby') || '').split(' ').filter(Boolean);
      return { first: fs.firstElementChild === lg, legend: (lg?.textContent || '').trim(), described: ids.map((i) => document.getElementById(i)?.textContent || '').join('').trim(), controls: fs.querySelectorAll('input,button,select,textarea').length };
    });
    expect(r.first && r.legend.length > 0, `legend ${JSON.stringify(r.legend)} first=${r.first}`);
    expect(r.described.length > 0, 'hint is not tied to the group by aria-describedby');
    expect(r.controls >= 2, `${r.controls} controls inside`);
    return `group "${r.legend}" described, ${r.controls} controls`;
  });
  await check('Fieldset', 'a disabled box switches off every control inside it', async () => {
    await go('/components/fieldset/code');
    const r = await main().locator('fieldset[data-component="Fieldset"][disabled]').first().evaluate((fs) => {
      const all = [...fs.querySelectorAll('input,button,select,textarea')];
      return { n: all.length, off: all.filter((c) => c.matches(':disabled')).length };
    });
    expect(r.n >= 1 && r.off === r.n, `${r.off} of ${r.n} controls disabled`);
    return `${r.off} of ${r.n} controls disabled by the box`;
  });
  await check('Fieldset', 'the box is a real hairline border with no fill or shadow, and no part is orange', async () => {
    await go('/components/fieldset/code');
    const r = await main().locator('fieldset[data-component="Fieldset"]').first().evaluate((fs) => {
      const cs = getComputedStyle(fs);
      const probe = document.createElement('span'); probe.style.color = 'var(--ds-action-accent)'; document.body.append(probe);
      const accent = getComputedStyle(probe).color; probe.remove();
      const bad = [fs, ...fs.querySelectorAll(':scope > legend, :scope > p')].filter((n) => { const c = getComputedStyle(n); return accent && [c.backgroundColor, c.color, c.borderColor].includes(accent); }).length;
      return { w: parseFloat(cs.borderTopWidth), style: cs.borderTopStyle, shadow: cs.boxShadow, bg: cs.backgroundColor, bad };
    });
    expect(r.w > 0 && r.style === 'solid', `border ${r.w}px ${r.style}`);
    expect(r.shadow === 'none', `box-shadow ${r.shadow}`);
    expect(r.bg === 'rgba(0, 0, 0, 0)', `background ${r.bg}`);
    expect(r.bad === 0, `${r.bad} orange parts`);
    return `${r.w}px solid line, flat, no orange`;
  });
}
