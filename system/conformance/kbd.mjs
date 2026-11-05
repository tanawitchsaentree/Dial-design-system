// Behaviour checks for Kbd (flat keycap with a hard lower edge), run by tooling/kiln/conformance.mjs.
export default async function kbd({ check, expect, go, main }) {
  await check('Kbd', 'a chord groups two caps and the plus is hidden from assistive tech but read as a word', async () => {
    await go('/components/kbd/code');
    const r = await main().locator('kbd[data-component="KbdCombo"]').first().evaluate((el) => {
      const caps = el.querySelectorAll(':scope > kbd');
      const join = el.querySelector('span[aria-hidden="true"]');
      const words = [...el.querySelectorAll(':scope > span:not([aria-hidden])')].map((s) => s.textContent);
      return { caps: caps.length, join: join ? join.textContent : '', words };
    });
    expect(r.caps >= 2, `${r.caps} caps in the chord`);
    expect(r.join === '+', `printed join "${r.join}"`);
    expect(r.words.length === r.caps - 1 && r.words.every((w) => w.length > 0), `spoken joins ${JSON.stringify(r.words)}`);
    return `${r.caps} caps, joined by a hidden plus read as "${r.words[0]}"`;
  });
  await check('Kbd', 'every cap is at least 24px square and its lower edge is thicker than its top edge', async () => {
    await go('/components/kbd/code');
    const r = await main().locator('kbd[data-component="Kbd"]').evaluateAll((els) => els.map((el) => {
      const cs = getComputedStyle(el); const b = el.getBoundingClientRect();
      return { w: b.width, h: b.height, top: parseFloat(cs.borderBlockStartWidth), bottom: parseFloat(cs.borderBlockEndWidth) };
    }));
    expect(r.length >= 2, `${r.length} caps on the page`);
    expect(r.every((x) => x.w >= 23.5 && x.h >= 23.5), `caps ${r.map((x) => `${x.w}×${x.h}`).join(', ')}`);
    expect(r.every((x) => x.top > 0 && x.bottom > x.top), `edges ${r.map((x) => `${x.top}/${x.bottom}`).join(', ')}`);
    return `${r.length} caps, lower edge thicker than the top edge`;
  });
  await check('Kbd', 'a cap with a label hides the printed symbol and speaks the label; no cap takes focus or the accent', async () => {
    await go('/components/kbd/code');
    const r = await main().locator('kbd[data-component="Kbd"]').evaluateAll((els) => {
      const probe = document.createElement('span'); probe.style.color = 'var(--ds-action-accent)'; document.body.append(probe);
      const accent = getComputedStyle(probe).color; probe.remove();
      const labelled = els.filter((el) => el.querySelector(':scope > span[aria-hidden="true"]'));
      return {
        labelled: labelled.length,
        spoken: labelled.map((el) => el.querySelector(':scope > span:not([aria-hidden])')?.textContent ?? ''),
        focusable: els.filter((el) => el.tabIndex >= 0 || el.querySelector('a,button,input,[tabindex]')).length,
        orange: els.filter((el) => { const cs = getComputedStyle(el); return accent && [cs.backgroundColor, cs.color, cs.borderColor].includes(accent); }).length,
        cursor: [...new Set(els.map((el) => getComputedStyle(el).cursor))],
      };
    });
    expect(r.labelled >= 1 && r.spoken.every((s) => s.length > 0), `${r.labelled} labelled caps, spoken ${JSON.stringify(r.spoken)}`);
    expect(r.focusable === 0, `${r.focusable} focusable caps`);
    expect(r.orange === 0, `${r.orange} orange caps`);
    expect(r.cursor.length === 1 && r.cursor[0] === 'default', `cursor ${r.cursor.join(', ')}`);
    return `${r.labelled} labelled cap(s), none focusable, none orange`;
  });
}
