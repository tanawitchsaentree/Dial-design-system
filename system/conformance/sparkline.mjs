// Behaviour checks for Sparkline (a word-sized trend with a dot on the last reading), run by tooling/kiln/conformance.mjs.
// UNVERIFIED here: what a screen reader speaks for the label (needs a real reader).
export default async function sparkline({ page, check, expect, go, main }) {
  const all = () => main().locator('[data-component="Sparkline"]:not([data-empty])');

  await check('Sparkline', 'it is one image named by the label and a sentence of the readings, and takes no focus', async () => {
    await go('/components/sparkline/code');
    const r = await all().first().evaluate((el) => ({ role: el.getAttribute('role'), name: el.getAttribute('aria-label') || '', focusable: el.querySelectorAll('a[href],button,input,select,textarea,[tabindex]').length, tab: el.getAttribute('tabindex') }));
    expect(r.role === 'img', `role ${r.role}`);
    expect(/readings/.test(r.name) && /from .* to /.test(r.name) && /low .*high /.test(r.name), `name "${r.name}"`);
    expect(/rising|falling|steady/.test(r.name), `name "${r.name}" has no direction`);
    expect(r.focusable === 0 && r.tab === null, `${r.focusable} focusable parts`);
    return `img named "${r.name.slice(0, 90)}"`;
  });

  await check('Sparkline', 'the last reading is marked by a solid dot that sits at the line end, high for a rise and low for a fall', async () => {
    await go('/components/sparkline/code');
    const rows = await all().evaluateAll((els) => els.map((el) => {
      const box = el.firstElementChild.getBoundingClientRect();
      const dotEl = el.firstElementChild.querySelector(':scope > span');
      const d = dotEl.getBoundingClientRect();
      const cs = getComputedStyle(dotEl);
      return { name: el.getAttribute('aria-label'), dx: d.left + d.width / 2 - box.right, dy: (d.top + d.height / 2 - box.top) / box.height, w: d.width, bg: cs.backgroundColor, radius: cs.borderTopLeftRadius, boxH: box.height };
    }));
    expect(rows.length >= 2, `${rows.length} sparklines`);
    for (const r of rows) {
      expect(Math.abs(r.dx) <= 1.5, `dot is ${r.dx}px from the line end`);
      expect(r.w >= 6 && r.bg !== 'rgba(0, 0, 0, 0)', `dot ${r.w}px with fill ${r.bg}`);
    }
    const up = rows.find((r) => /rising/.test(r.name)); const down = rows.find((r) => /falling/.test(r.name));
    expect(up && down, 'the subject needs a rising and a falling line');
    expect(up.dy < 0.3 && down.dy > 0.7, `dot at ${up.dy.toFixed(2)} for a rise and ${down.dy.toFixed(2)} for a fall of the block height`);
    return `dots ${rows.map((r) => r.w + 'px').join(', ')} at the end; rise at ${up.dy.toFixed(2)}, fall at ${down.dy.toFixed(2)}`;
  });

  await check('Sparkline', 'no readings keeps the block, prints a rule and says No readings', async () => {
    await go('/components/sparkline/code');
    const r = await main().locator('[data-component="Sparkline"][data-empty]').first().evaluate((el) => {
      const box = el.firstElementChild;
      const full = document.querySelector('[data-component="Sparkline"]:not([data-empty])').firstElementChild.getBoundingClientRect();
      const after = getComputedStyle(box, '::after');
      return { name: el.getAttribute('aria-label'), h: box.getBoundingClientRect().height, fullH: full.height, rule: parseFloat(after.borderBlockStartWidth), svg: box.querySelectorAll('svg').length };
    });
    expect(/No readings/.test(r.name), `name "${r.name}"`);
    expect(Math.abs(r.h - r.fullH) <= 1, `empty block ${r.h}px, full block ${r.fullH}px`);
    expect(r.rule > 0 && r.svg === 0, `rule ${r.rule}px, ${r.svg} drawings`);
    return `empty keeps ${Math.round(r.h)}px and prints a ${r.rule}px rule`;
  });

  await check('Sparkline', 'the printed value uses tabular numerals; no part is orange and nothing animates', async () => {
    await go('/components/sparkline/code');
    const r = await main().locator('[data-component="Sparkline"]').evaluateAll((els) => {
      const probe = document.createElement('span'); probe.style.color = 'var(--ds-action-accent)'; document.body.append(probe);
      const accent = getComputedStyle(probe).color; probe.remove();
      let orange = 0; let moving = 0; let tab = '';
      for (const el of els) for (const n of [el, ...el.querySelectorAll('*')]) {
        const cs = getComputedStyle(n);
        if ([cs.color, cs.stroke, cs.fill, cs.backgroundColor, cs.borderColor].includes(accent)) orange++;
        if (cs.animationName !== 'none' || parseFloat(cs.transitionDuration) > 0) moving++;
      }
      const v = els.map((e) => e.lastElementChild).find((n) => n && !n.querySelector('svg') && n.textContent.trim());
      if (v) tab = getComputedStyle(v).fontVariantNumeric;
      return { orange, moving, tab };
    });
    expect(r.orange === 0, `${r.orange} orange parts`);
    expect(r.moving === 0, `${r.moving} parts animate or transition`);
    expect(/tabular-nums/.test(r.tab), `value numerals "${r.tab}"`);
    return 'tabular value, no orange, no motion';
  });
}
