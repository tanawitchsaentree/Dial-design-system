// Behaviour checks for Card, run by tooling/kiln/conformance.mjs on the built book. Card is the body of a
// unit (FORM.md surface class): plastic fill, a corner of 0.16 × the short side capped at corner.panel,
// never shorter than two corners and an inset (G-CH1), never focusable, nesting the windows set inside it.
export default async function card({ check, expect, page, go, main }) {
  const px = (s) => parseFloat(s) || 0;
  const all = () => main().locator('[data-component="Card"]');

  await check('Card', 'the body paints the plastic and its corner is 0.16 of the short side, capped at corner.panel', async () => {
    await go('/components/card/code');
    await page.waitForTimeout(100);
    const r = await all().evaluateAll((els) => {
      const probe = document.createElement('div'); probe.style.borderRadius = 'var(--ds-corner-panel)'; document.body.append(probe);
      const cap = parseFloat(getComputedStyle(probe).borderTopLeftRadius); probe.remove();
      return els.map((e) => { const b = e.getBoundingClientRect(); const cs = getComputedStyle(e);
        return { r: parseFloat(cs.borderTopLeftRadius), want: Math.min(0.16 * Math.min(b.width, b.height), cap), bg: cs.backgroundColor, shadow: cs.boxShadow }; });
    });
    expect(r.length > 0, 'no Card on the page');
    const bad = r.filter((x) => Math.abs(x.r - x.want) > 1.5 || /rgba\(0, 0, 0, 0\)|transparent/.test(x.bg) || x.shadow === 'none');
    expect(!bad.length, `bad bodies: ${JSON.stringify(bad.slice(0, 2))}`);
    return `${r.length} bodies`;
  });

  await check('Card', 'a card is never shorter than its two corners and an inset', async () => {
    await go('/components/card/code');
    const r = await all().evaluateAll((els) => els.map((e) => { const cs = getComputedStyle(e); return { h: e.getBoundingClientRect().height, r: parseFloat(cs.borderTopLeftRadius), p: parseFloat(cs.paddingTop) }; }));
    const bad = r.filter((x) => x.h < 2 * x.r + x.p - 1);
    expect(!bad.length, `pill-shaped cards: ${JSON.stringify(bad.slice(0, 2))}`);
    return `${r.length} cards hold`;
  });

  await check('Card', 'Tab never stops on the body, only on the keys inside it', async () => {
    await go('/components/card/code');
    const n = await all().evaluateAll((els) => els.filter((e) => e.tabIndex >= 0).length);
    expect(n === 0, `${n} card bodies are focusable`);
    const key = main().locator('[data-component="Card"] [data-component="Button"]').first();
    await key.focus();
    const inside = await key.evaluate((el) => document.activeElement === el && !!el.closest('[data-component="Card"]'));
    expect(inside, 'the key inside the card did not take focus');
    return 'bodies skipped, keys reached';
  });

  await check('Card', 'a Display inside nests its corner, so its radius is the outer radius minus the inset', async () => {
    await go('/components/card/code');
    const r = await main().locator('[data-component="Card"] [data-component="Display"]').evaluateAll((els) => els.map((d) => {
      const c = d.closest('[data-component="Card"]'); const cs = getComputedStyle(c);
      return { got: parseFloat(getComputedStyle(d).borderTopLeftRadius), want: Math.max(4, parseFloat(cs.borderTopLeftRadius) - parseFloat(cs.paddingTop)) };
    }));
    expect(r.length > 0, 'no Display inside a Card on the page');
    const bad = r.filter((x) => Math.abs(x.got - x.want) > 1);
    expect(!bad.length, JSON.stringify(bad[0]));
    return `${r.length} nested windows`;
  });

  await check('Card', 'in forced colours the body keeps a border', async () => {
    await page.emulateMedia({ forcedColors: 'active' });
    await go('/components/card/code');
    const w = await all().first().evaluate((e) => getComputedStyle(e).borderTopWidth);
    await page.emulateMedia({ forcedColors: 'none' });
    expect(px(w) >= 1, `border ${w}`);
    return `border ${w}`;
  });

  // R-006 (2026-11-03): "เปลี่ยนทั้งระบบ" — every word and glyph printed on a unit is pad ink seated in it; a window
  // (LCD, OLED) shows light and carries no seat
  await check('Card', 'everything printed on a unit is seated in the plastic, and nothing in a window is', async () => {
    const out = [];
    for (const theme of ['light', 'dark']) {
      await go(`/?theme=${theme}`);
      const r = await main().evaluate(() => {
        const units = [...document.querySelectorAll('[data-component="Card"]')];
        const win = (e) => !!e.closest('[class*="module__lcd"], [class*="module__oled"], [class*="module__window"]');
        let seated = 0, windowed = 0; const bare = [], lit = [];
        for (const u of units) for (const e of u.querySelectorAll('*')) {
          if (!e.getClientRects().length || ![...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) continue;
          const ts = getComputedStyle(e).textShadow;
          if (win(e)) { windowed++; if (ts !== 'none') lit.push(e.textContent.trim().slice(0, 12)); }
          else if (ts === 'none') bare.push(e.textContent.trim().slice(0, 12)); else seated++;
        }
        return { units: units.length, seated, windowed, bare: [...new Set(bare)], lit: [...new Set(lit)] };
      });
      if (!r.units || !r.seated) out.push(`${theme}: nothing seated on ${r.units} units`);
      if (r.bare.length) out.push(`${theme}: unseated ${JSON.stringify(r.bare.slice(0, 4))}`);
      if (r.lit.length) out.push(`${theme}: seated inside a window ${JSON.stringify(r.lit.slice(0, 4))}`);
    }
    expect(!out.length, out.join(' | '));
    return 'every unit word seated in both themes, windows clean';
  });
}
