// Behaviour checks for BarChart (native SVG bars in a recessed window, arrow-key readout, hidden table), run by tooling/kiln/conformance.mjs.
// The first BarChart on the Usage tab is the vertical one with two series; the second is a horizontal one with a single series.
export default async function barChart({ check, expect, go, main }) {
  const chart = (n = 0) => main().locator('[data-component="BarChart"]').nth(n);
  const svg = (n = 0) => chart(n).locator('svg[role="application"]');
  const readout = (n = 0) => chart(n).locator('p[aria-live]');
  const activeState = (n = 0) => chart(n).evaluate((el) => {
    const bars = [...el.querySelectorAll('svg[role="application"] rect[data-active]')];
    const others = [...el.querySelectorAll('svg[role="application"] rect[fill^="url"]:not([data-active])')];
    return { count: bars.length, w: bars[0] ? parseFloat(getComputedStyle(bars[0]).strokeWidth) : 0, other: others[0] ? parseFloat(getComputedStyle(others[0]).strokeWidth) : 0 };
  });

  await check('BarChart', 'the chart is one tab stop and the first bar becomes active', async () => {
    await go('/components/bar-chart/code');
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
    expect(st.count === 1, `${st.count} active bars after focus (need 1)`);
    expect(/Mon/.test(now) && /Heating/.test(now) && now !== idle, `readout "${now}" (was "${idle}")`);
    return `one stop, "${now}"`;
  });

  await check('BarChart', 'the arrow keys move the active bar and the readout names it', async () => {
    await go('/components/bar-chart/code');
    await svg().waitFor();
    await svg().focus();
    const kb = main().page().keyboard;
    const start = await readout().innerText();
    await kb.press('ArrowRight');
    const right = await readout().innerText();
    await kb.press('ArrowDown');
    const down = await readout().innerText();
    await kb.press('ArrowLeft');
    const left = await readout().innerText();
    const st = await activeState();
    expect(/Tue/.test(right) && /Heating/.test(right), `ArrowRight read "${right}" (need Tue, Heating)`);
    expect(/Tue/.test(down) && /Hot water/.test(down), `ArrowDown read "${down}" (need Tue, Hot water)`);
    expect(/Mon/.test(left) && /Hot water/.test(left), `ArrowLeft read "${left}" (need Mon, Hot water)`);
    expect(st.count === 1, `${st.count} active bars (need 1)`);
    expect(st.w > st.other, `the active outline is ${st.w}px against ${st.other}px: no non-colour cue`);
    return `"${start}" then "${right}", "${down}", "${left}"; outline ${st.w}px against ${st.other}px`;
  });

  await check('BarChart', 'Home and End reach the first and the last category', async () => {
    await go('/components/bar-chart/code');
    await svg().waitFor();
    await svg().focus();
    const kb = main().page().keyboard;
    await kb.press('End');
    const end = await readout().innerText();
    await kb.press('Home');
    const home = await readout().innerText();
    expect(/Thu/.test(end), `End read "${end}" (need Thu)`);
    expect(/Mon/.test(home), `Home read "${home}" (need Mon)`);
    return `End "${end}", Home "${home}"`;
  });

  await check('BarChart', 'series differ by pattern, every category is a 44px target and the legend names the series', async () => {
    await go('/components/bar-chart/code');
    await svg().waitFor();
    const r = await chart().evaluate((el) => {
      const s = el.querySelector('svg[role="application"]');
      const fills = [...new Set([...s.querySelectorAll('rect[fill^="url"]')].filter((b) => !b.getAttribute('class')?.includes('hit')).map((b) => b.getAttribute('fill')))];
      const hits = [...s.querySelectorAll('rect')].filter((b) => getComputedStyle(b).fill === 'rgba(0, 0, 0, 0)' && getComputedStyle(b).stroke === 'none').map((b) => b.getBoundingClientRect());
      const items = [...el.querySelectorAll('ul > li')].map((li) => li.textContent.trim());
      return { fills: fills.length, hits: hits.map((b) => [b.width, b.height]), items };
    });
    expect(r.fills >= 2, `${r.fills} distinct fills (need 2 patterns for 2 series)`);
    expect(r.hits.length >= 3 && r.hits.every(([w, h]) => w >= 43.5 && h >= 43.5), `hit bands ${r.hits.map((x) => x.map(Math.round).join('×')).join(', ')}`);
    expect(r.items.join('|') === 'Heating|Hot water', `legend ${r.items.join('|')}`);
    return `${r.fills} patterns, ${r.hits.length} bands of at least 44px, legend ${r.items.join(', ')}`;
  });

  await check('BarChart', 'every value is printed on its bar and the hidden table holds the same numbers', async () => {
    await go('/components/bar-chart/code');
    await svg().waitFor();
    const r = await chart().evaluate((el) => {
      const printed = new Set([...el.querySelectorAll('svg[role="application"] text')].map((t) => t.textContent.trim()));
      const rows = [...el.querySelectorAll('table tbody tr')];
      const cells = rows.flatMap((tr) => [...tr.querySelectorAll('td')].map((td) => td.textContent.trim()));
      const heads = [...el.querySelectorAll('table thead th')].map((th) => th.textContent.trim());
      const t = el.querySelector('table');
      const box = t.parentElement.getBoundingClientRect();
      return { rows: rows.length, cells, heads, missing: cells.filter((c) => !printed.has(String(parseFloat(c)))), caption: t.querySelector('caption')?.textContent.trim(), tiny: box.width <= 2 && box.height <= 2 };
    });
    expect(r.rows === 4 && r.cells.length === 8, `${r.rows} rows, ${r.cells.length} cells (need 4 and 8)`);
    expect(r.heads.length === 3, `${r.heads.length} column heads (need 3)`);
    expect(r.missing.length === 0, `values not printed on the drawing: ${r.missing.join(', ')}`);
    expect(!!r.caption && r.tiny, `caption "${r.caption}", clipped ${r.tiny}`);
    return `${r.cells.length} values printed and in the table`;
  });

  await check('BarChart', 'a horizontal chart scales its bars to the value and mirrors the key map', async () => {
    await go('/components/bar-chart/code');
    await svg(1).waitFor();
    const r = await chart(1).evaluate((el) => {
      const bars = [...el.querySelectorAll('svg[role="application"] rect[fill^="url"]')].filter((b) => getComputedStyle(b).stroke !== 'none');
      return bars.slice(0, 3).map((b) => b.getBoundingClientRect().width);
    });
    expect(r.length === 3 && Math.abs(r[0] / r[1] - 9 / 6) < 0.05, `bar lengths ${r.map(Math.round).join(', ')} (need a 9 to 6 ratio)`);
    await svg(1).focus();
    const kb = main().page().keyboard;
    await kb.press('ArrowDown');
    const down = await readout(1).innerText();
    expect(/Bedroom/.test(down), `ArrowDown on a horizontal chart read "${down}" (need Bedroom)`);
    return `lengths ${r.map(Math.round).join(', ')}, ArrowDown read "${down}"`;
  });

  await check('BarChart', 'no part of the chart is the accent orange and nothing animates', async () => {
    await go('/components/bar-chart/code');
    await svg().waitFor();
    const bad = await main().locator('[data-component="BarChart"]').evaluateAll((els) => {
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
