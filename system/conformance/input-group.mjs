// Behaviour checks for InputGroup (an Input with add-ons ruled off inside one well), run by tooling/kiln/conformance.mjs.
const GROUP = '[data-component="InputGroup"]';
export default async function inputGroup({ check, expect, go, main }) {
  await check('InputGroup', 'the add-ons and the text field share one well and the rules are real borders', async () => {
    await go('/components/input-group/code');
    const r = await main().locator(GROUP).first().evaluate((g) => {
      const wells = [...g.children].filter((c) => c.querySelector(':scope > input'));
      const well = wells[0];
      const addons = well ? [...well.querySelectorAll(':scope > span')] : [];
      return {
        wells: wells.length, addons: addons.length,
        rules: addons.map((a) => { const cs = getComputedStyle(a); return Math.max(parseFloat(cs.borderInlineStartWidth), parseFloat(cs.borderInlineEndWidth)); }),
        borders: well ? parseFloat(getComputedStyle(well).borderTopWidth) : 0,
      };
    });
    expect(r.wells === 1, `${r.wells} wells (need one)`);
    expect(r.addons >= 2, `${r.addons} add-ons in the well`);
    expect(r.rules.every((w) => w > 0), `rule widths ${r.rules.join(', ')}px`);
    return `one well, ${r.addons} add-ons ruled off by ${r.rules.join('/')}px`;
  });
  await check('InputGroup', 'one focus ring surrounds the whole well when the text or a key inside it holds focus', async () => {
    await go('/components/input-group/code');
    const g = main().locator(GROUP).first();
    const ring = () => g.evaluate((el) => {
      const w = [...el.children].find((c) => c.querySelector(':scope > input'));
      const cs = getComputedStyle(w);
      return { style: cs.outlineStyle, width: parseFloat(cs.outlineWidth) };
    });
    await g.locator('input').focus();
    const onText = await ring();
    await g.locator('button').first().focus();
    const onKey = await ring();
    await g.locator('button').first().evaluate((b) => b.blur());
    const off = await ring();
    expect(onText.style !== 'none' && onText.width > 0, `ring on text ${onText.style} ${onText.width}px`);
    expect(onKey.style !== 'none' && onKey.width > 0, `ring on key ${onKey.style} ${onKey.width}px`);
    expect(off.style === 'none' || off.width === 0, `ring left after blur: ${off.style} ${off.width}px`);
    return `ring ${onText.width}px on the text and on the key, gone after blur`;
  });
  await check('InputGroup', 'the well and a key inside it are at least the touch target tall, and a plain word is read with the field', async () => {
    await go('/components/input-group/code');
    const r = await main().locator(GROUP).first().evaluate((g) => {
      const input = g.querySelector('input');
      const well = input.parentElement.getBoundingClientRect();
      const btn = g.querySelector('button').getBoundingClientRect();
      const ids = (input.getAttribute('aria-describedby') || '').split(' ').filter(Boolean);
      return { well: well.height, bw: btn.width, bh: btn.height, said: ids.map((i) => document.getElementById(i)?.textContent || '').join(' ') };
    });
    expect(r.well >= 43.5, `well ${r.well}px tall`);
    expect(r.bw >= 43.5 && r.bh >= 43.5, `key ${r.bw}×${r.bh}`);
    expect(/\S/.test(r.said), 'a plain word add-on is not in aria-describedby');
    return `well ${r.well}px, key ${r.bw}×${r.bh}, described by "${r.said}"`;
  });
  await check('InputGroup', 'no part of the group is the accent orange', async () => {
    await go('/components/input-group/code');
    const bad = await main().locator(GROUP).evaluateAll((els) => {
      const probe = document.createElement('span'); probe.style.color = 'var(--ds-action-accent)'; document.body.append(probe);
      const accent = getComputedStyle(probe).color; probe.remove();
      const out = []; for (const el of els) for (const n of el.querySelectorAll('*')) { const cs = getComputedStyle(n); if (accent && [cs.backgroundColor, cs.color, cs.borderColor].some((c) => c === accent)) out.push(n.tagName); }
      return out;
    });
    expect(bad.length === 0, `${bad.length} orange parts`);
    return 'no orange';
  });
}
