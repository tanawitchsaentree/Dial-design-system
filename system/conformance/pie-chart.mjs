// Behaviour checks for PieChart (native SVG ring in a recessed window, arrow-key readout, legend, hidden table), run by tooling/kiln/conformance.mjs.
// The first PieChart on the Usage tab is a donut of four rooms; the second is a whole pie of three parts.
export default async function pieChart({ check, expect, go, main }) {
  const chart = (n = 0) => main().locator('[data-component="PieChart"]').nth(n);
  const svg = (n = 0) => chart(n).locator('svg[role="application"]');
  const readout = (n = 0) => chart(n).locator('p[aria-live]');
  const activeState = (n = 0) => chart(n).evaluate((el) => {
    const on = [...el.querySelectorAll('svg[role="application"] path[data-active]')];
    const off = [...el.querySelectorAll('svg[role="application"] path[fill^="url"]:not([data-active])')];
    return { count: on.length, w: on[0] ? parseFloat(getComputedStyle(on[0]).strokeWidth) : 0, other: off[0] ? parseFloat(getComputedStyle(off[0]).strokeWidth) : 0, rows: el.querySelectorAll('ul > li[data-active]').length };
  });

  await check('PieChart', 'the chart is one tab stop and the first slice becomes active', async () => {
    await go('/components/pie-chart/code');
    await svg().waitFor();
    const idle = await readout().innerText();
    await svg().focus();
    await main().page().waitForTimeout(100);
    const r = await chart().evaluate((el) => {
      const s = el.querySelector('svg[role="application"]');
      return {
        tab: s.tabIndex, named: !!document.getElementById(s.getAttribute('aria-labelledby') || '')?.textContent.trim(),
        desc: s.getAttribute('aria-roledescription') || '', inner: s.querySelectorAll('[tabindex]').length,
        live: el.querySelector('p[aria-live]').getAttribute('aria-live'),
      };
    });
    const now = await readout().innerText();
    const st = await activeState();
    expect(r.tab === 0 && r.inner === 0, `tabindex ${r.tab}, ${r.inner} inner tab stops`);
    expect(r.named && r.desc.length > 0, `named ${r.named}, role description "${r.desc}"`);
    expect(r.live === 'polite', `readout is aria-live "${r.live}"`);
    expect(st.count === 1 && st.rows === 1, `${st.count} active slices, ${st.rows} active legend rows (need 1 and 1)`);
    expect(/Living room/.test(now) && now !== idle, `readout "${now}" (was "${idle}")`);
    return `one stop, "${now}"`;
  });

  await check('PieChart', 'the arrow keys move the active slice and the readout names it', async () => {
    await go('/components/pie-chart/code');
    await svg().waitFor();
    await svg().focus();
    const kb = main().page().keyboard;
    const start = await readout().innerText();
    await kb.press('ArrowRight');
    const next = await readout().innerText();
    await kb.press('ArrowDown');
    const next2 = await readout().innerText();
    await kb.press('ArrowLeft');
    const back = await readout().innerText();
    const st = await activeState();
    expect(/Bedrooms/.test(next), `ArrowRight read "${next}" (need Bedrooms)`);
    expect(/Kitchen/.test(next2), `ArrowDown read "${next2}" (need Kitchen)`);
    expect(/Bedrooms/.test(back), `ArrowLeft read "${back}" (need Bedrooms)`);
    expect(st.count === 1, `${st.count} active slices (need 1)`);
    expect(st.w > st.other, `the active outline is ${st.w}px against ${st.other}px: no non-colour cue`);
    return `"${start}" then "${next}", "${next2}", "${back}"; outline ${st.w}px against ${st.other}px`;
  });

  await check('PieChart', 'Home and End reach the first and the last slice', async () => {
    await go('/components/pie-chart/code');
    await svg().waitFor();
    await svg().focus();
    const kb = main().page().keyboard;
    await kb.press('End');
    const end = await readout().innerText();
    await kb.press('Home');
    const home = await readout().innerText();
    expect(/Bathroom/.test(end), `End read "${end}" (need Bathroom)`);
    expect(/Living room/.test(home), `Home read "${home}" (need Living room)`);
    return `End "${end}", Home "${home}"`;
  });

  await check('PieChart', 'parts differ by pattern and every legend row is a 44px target that picks its slice', async () => {
    await go('/components/pie-chart/code');
    await svg().waitFor();
    const r = await chart().evaluate((el) => {
      const fills = [...new Set([...el.querySelectorAll('svg[role="application"] path[fill^="url"]')].map((p) => p.getAttribute('fill')))];
      const rows = [...el.querySelectorAll('ul > li')].map((li) => li.getBoundingClientRect().height);
      const swatches = [...new Set([...el.querySelectorAll('ul > li svg rect')].map((r2) => r2.getAttribute('fill')))];
      return { fills: fills.length, rows, swatches: swatches.length };
    });
    expect(r.fills === 4 && r.swatches === 4, `${r.fills} slice fills, ${r.swatches} swatch fills (need 4 and 4)`);
    expect(r.rows.length === 4 && r.rows.every((h) => h >= 43.5), `legend rows ${r.rows.map(Math.round).join(', ')}`);
    const row = chart().locator('ul > li').nth(2);
    await row.dispatchEvent('pointerdown');
    const said = await readout().innerText();
    expect(/Kitchen/.test(said), `pressing the third legend row read "${said}" (need Kitchen)`);
    return `${r.fills} patterns, rows ${r.rows.map(Math.round).join(', ')}px, legend press read "${said}"`;
  });

  await check('PieChart', 'the shares add up and the hidden table holds every value', async () => {
    await go('/components/pie-chart/code');
    await svg().waitFor();
    const r = await chart().evaluate((el) => {
      const rows = [...el.querySelectorAll('table tbody tr')].map((tr) => [...tr.children].map((c) => c.textContent.trim()));
      const t = el.querySelector('table');
      const box = t.parentElement.getBoundingClientRect();
      const sum = rows.reduce((a, row2) => a + parseFloat(row2[2]), 0);
      return { rows, sum, heads: [...el.querySelectorAll('table thead th')].length, caption: t.querySelector('caption')?.textContent.trim(), tiny: box.width <= 2 && box.height <= 2 };
    });
    expect(r.rows.length === 4 && r.heads === 3, `${r.rows.length} rows, ${r.heads} heads (need 4 and 3)`);
    expect(Math.abs(r.sum - 100) < 0.5, `shares add up to ${r.sum}`);
    expect(!!r.caption && r.tiny, `caption "${r.caption}", clipped ${r.tiny}`);
    return `shares add up to ${r.sum.toFixed(1)}, table clipped`;
  });

  await check('PieChart', 'a donut prints the total in its hole and a pie does not', async () => {
    await go('/components/pie-chart/code');
    await svg(1).waitFor();
    const r = await main().locator('[data-component="PieChart"]').evaluateAll((els) => els.map((el) => ({
      variant: el.getAttribute('data-variant'),
      centre: [...el.querySelectorAll('svg[role="application"] text')].some((t) => /^(920|Total)/.test(t.textContent.trim())),
    })));
    expect(r[0].variant === 'donut' && r[0].centre, `first chart ${JSON.stringify(r[0])}`);
    expect(r[1].variant === 'pie' && !r[1].centre, `second chart ${JSON.stringify(r[1])}`);
    return 'donut has a total, pie has none';
  });

  await check('PieChart', 'no part of the chart is the accent orange and nothing animates', async () => {
    await go('/components/pie-chart/code');
    await svg().waitFor();
    const bad = await main().locator('[data-component="PieChart"]').evaluateAll((els) => {
      const probe = document.createElement('span'); probe.style.color = 'var(--ds-action-accent)'; document.body.append(probe);
      const accent = getComputedStyle(probe).color; probe.remove();
      const out = [];
      for (const el of els) for (const n of el.querySelectorAll('*')) {
        const cs = getComputedStyle(n);
        if (accent && [cs.backgroundColor, cs.color, cs.borderColor, cs.fill, cs.stroke].some((c) => c === accent)) out.push(`${n.tagName} orange`);
        if (parseFloat(cs.transitionDuration) > 0 || (cs.animationName !== 'none' && parseFloat(cs.animationDuration) > 0)) out.push(`${n.tagName} animates`);
      }
      return out;
    });
    expect(bad.length === 0, `${bad.length} problems: ${bad.slice(0, 3).join(', ')}`);
    return 'no orange, no transitions';
  });
}
