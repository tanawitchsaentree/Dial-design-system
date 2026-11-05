// Behaviour checks for Divider (cut seam, optional printed word), run by tooling/kiln/conformance.mjs.
export default async function divider({ check, expect, go, main }) {
  await check('Divider', 'the seam is a separator, vertical ones say so, and a label names it', async () => {
    await go('/components/divider/code');
    const r = await main().locator('[data-component="Divider"]').evaluateAll((els) => ({
      n: els.length,
      bad: els.filter((e) => e.getAttribute('role') !== 'separator' && e.getAttribute('role') !== 'none').length,
      vertical: els.filter((e) => e.dataset.orientation === 'vertical').every((e) => e.getAttribute('aria-orientation') === 'vertical'),
      labelled: els.filter((e) => e.hasAttribute('data-labelled') && e.getAttribute('role') === 'separator').every((e) => (e.getAttribute('aria-label') || '').length > 0),
    }));
    expect(r.n >= 1 && r.bad === 0, `${r.n} dividers, ${r.bad} with the wrong role`);
    expect(r.vertical, 'a vertical divider has no aria-orientation="vertical"');
    expect(r.labelled, 'a labelled divider has no name');
    return `${r.n} dividers announced`;
  });
  await check('Divider', 'the seam is drawn with two real edges, a shade edge and a lit edge, and takes no focus', async () => {
    await go('/components/divider/code');
    const r = await main().locator('[data-component="Divider"][data-orientation="horizontal"]:not([data-labelled])').first().evaluate((e) => {
      const cs = getComputedStyle(e);
      return { top: parseFloat(cs.borderBlockStartWidth), bottom: parseFloat(cs.borderBlockEndWidth), same: cs.borderBlockStartColor === cs.borderBlockEndColor, tab: e.tabIndex, h: e.getBoundingClientRect().height };
    });
    expect(r.top > 0 && r.bottom > 0, `edges ${r.top}px and ${r.bottom}px`);
    expect(!r.same, 'both edges are the same colour, so it is a drawn rule and not a cut seam');
    expect(r.tab < 0, `tabIndex ${r.tab}`);
    expect(r.h >= 1.5 && r.h <= 4, `seam height ${r.h}px`);
    return `seam ${r.h}px, two edges`;
  });
  await check('Divider', 'a labelled seam draws the line on both sides of the word and a vertical seam stretches', async () => {
    await go('/components/divider/code');
    const r = await main().locator('[data-component="Divider"]').evaluateAll((els) => {
      const lab = els.find((e) => e.hasAttribute('data-labelled'));
      const ver = els.find((e) => e.dataset.orientation === 'vertical');
      const word = lab ? lab.querySelector('span') : null;
      return {
        before: lab ? getComputedStyle(lab, '::before').borderBlockStartWidth : '', after: lab ? getComputedStyle(lab, '::after').borderBlockStartWidth : '',
        wordText: word ? word.textContent.trim().length : 0, vh: ver ? ver.getBoundingClientRect().height : 0, vw: ver ? ver.getBoundingClientRect().width : 99,
      };
    });
    expect(parseFloat(r.before) > 0 && parseFloat(r.after) > 0, `lines ${r.before} / ${r.after}`);
    expect(r.wordText > 0, 'no printed word');
    expect(r.vh > 8 && r.vw <= 4, `vertical seam ${r.vw}×${r.vh}`);
    return 'line either side of the word; vertical stretches';
  });
  await check('Divider', 'no part of the divider is the accent orange', async () => {
    await go('/components/divider/code');
    const bad = await main().locator('[data-component="Divider"]').evaluateAll((els) => {
      const probe = document.createElement('span'); probe.style.color = 'var(--ds-action-accent)'; document.body.append(probe);
      const accent = getComputedStyle(probe).color; probe.remove();
      const out = [];
      for (const el of els) for (const n of [el, ...el.querySelectorAll('*')]) { const cs = getComputedStyle(n); if (accent && [cs.backgroundColor, cs.color, cs.borderBlockStartColor, cs.borderInlineStartColor].some((c) => c === accent)) out.push(n.tagName); }
      return out;
    });
    expect(bad.length === 0, `${bad.length} orange parts`);
    return 'no orange';
  });
}
