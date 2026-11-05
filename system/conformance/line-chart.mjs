// Behaviour checks for LineChart (a trend drawn in a recessed window), run by tooling/kiln/conformance.mjs.
// UNVERIFIED here: what a screen reader speaks for the readout and the table (needs a real reader).
export default async function lineChart({ page, check, expect, go, main }) {
  const chart = () => main().locator('[data-component="LineChart"]').first();

  await check('LineChart', 'the arrow keys, Home, End and Escape move a cursor and the readout names the point', async () => {
    await go('/components/line-chart/code');
    const win = chart().locator('[role="group"][tabindex="0"]');
    await win.focus();
    await page.waitForTimeout(150);
    const readout = chart().locator('[role="status"]');
    const cursorX = () => chart().locator('svg line').evaluateAll((ls) => { const c = ls.find((l) => l.getAttribute('x1') === l.getAttribute('x2') && getComputedStyle(l).strokeDasharray === 'none' && l.getAttribute('y1') !== l.getAttribute('y2')); return c ? parseFloat(c.getAttribute('x1')) : null; });
    const read = async () => ((await readout.textContent()) || '').trim();
    const onFocus = await read();
    await page.keyboard.press('Home');
    await page.waitForTimeout(150);
    const first = await read(); const xFirst = await cursorX();
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(150);
    const second = await read(); const xSecond = await cursorX();
    await page.keyboard.press('End');
    await page.waitForTimeout(150);
    const last = await read(); const xLast = await cursorX();
    await page.keyboard.press('Escape');
    await page.waitForTimeout(150);
    const idle = await chart().locator('[role="status"][data-idle]').count();
    expect(onFocus.length > 0 && onFocus !== first, `focus put the cursor on "${onFocus}" and Home on "${first}"`);
    expect(first !== second && second !== last && first !== last, `readouts ${first} | ${second} | ${last}`);
    expect(xFirst !== null && xFirst < xSecond && xSecond < xLast, `cursor x ${xFirst} < ${xSecond} < ${xLast}`);
    expect(idle === 1, 'Escape did not let go of the cursor');
    expect(/\d/.test(first), `readout "${first}" holds no value`);
    return `Home "${first.slice(0, 40)}", Right "${second.slice(0, 40)}", End "${last.slice(0, 40)}", Escape idle`;
  });

  await check('LineChart', 'series are told apart without hue: stroke pattern, mark shape and a legend', async () => {
    await go('/components/line-chart/code');
    const r = await chart().evaluate((el) => {
      const lines = [...el.querySelectorAll('[data-series] > polyline')].map((p) => getComputedStyle(p));
      const shapes = new Set([...el.querySelectorAll('[data-series] > circle, [data-series] > rect, [data-series] > polygon')].map((m) => m.tagName));
      const dashes = new Set(lines.map((s) => s.strokeDasharray));
      const legend = [...el.querySelectorAll('ul > li')].map((li) => ({ name: li.textContent.trim(), mark: li.querySelectorAll('svg circle, svg rect, svg polygon').length, dash: getComputedStyle(li.querySelector('svg line')).strokeDasharray }));
      const probe = document.createElement('span'); probe.style.color = 'var(--ds-action-accent)'; document.body.append(probe);
      const accent = getComputedStyle(probe).color; probe.remove();
      const orange = [...el.querySelectorAll('*')].filter((n) => { const cs = getComputedStyle(n); return [cs.color, cs.stroke, cs.fill, cs.backgroundColor, cs.borderColor].includes(accent); }).length;
      return { lines: lines.length, dashes: dashes.size, shapes: [...shapes], legend, orange };
    });
    expect(r.lines >= 2, `${r.lines} lines`);
    expect(r.dashes === r.lines, `${r.dashes} stroke patterns for ${r.lines} lines`);
    expect(r.shapes.length === r.lines, `${r.shapes.length} mark shapes (${r.shapes.join(',')}) for ${r.lines} lines`);
    expect(r.legend.length === r.lines && r.legend.every((l) => l.name && l.mark === 1), `legend ${JSON.stringify(r.legend)}`);
    expect(new Set(r.legend.map((l) => l.dash)).size === r.lines, 'legend samples repeat the same pattern');
    expect(r.orange === 0, `${r.orange} orange parts`);
    return `${r.lines} lines, ${r.dashes} stroke patterns, marks ${r.shapes.join('/')}, legend repeats both, no orange`;
  });

  await check('LineChart', 'the same numbers are in a real table, and the drawing is hidden from assistive tech', async () => {
    await go('/components/line-chart/code');
    const r = await chart().evaluate((el) => {
      const t = el.querySelector('table');
      const heads = [...t.querySelectorAll('thead th')].map((h) => h.textContent.trim());
      const rows = [...t.querySelectorAll('tbody tr')].map((tr) => [...tr.children].map((c) => c.textContent.trim()));
      const svg = el.querySelector('svg');
      const box = t.parentElement.getBoundingClientRect();
      return { caption: t.querySelector('caption')?.textContent.trim(), heads, rows, hidden: svg.getAttribute('aria-hidden'), box: box.width * box.height, ticks: [...el.querySelectorAll('svg text')].length };
    });
    expect(r.caption && r.caption.length > 0, 'the table has no caption');
    expect(r.heads.length >= 2 && r.rows.length >= 3, `${r.heads.length} columns, ${r.rows.length} rows`);
    expect(r.rows.every((row) => row.length === r.heads.length && /\d/.test(row[1])), 'a row is missing a value');
    expect(r.hidden === 'true', 'the drawing is not aria-hidden');
    expect(r.box <= 4, `the table takes ${r.box}px² on screen`);
    return `"${r.caption}": ${r.heads.length} columns x ${r.rows.length} rows, drawing aria-hidden, table clipped`;
  });

  await check('LineChart', 'the value axis ticks are round numbers an equal step apart, in tabular numerals', async () => {
    await go('/components/line-chart/code');
    const r = await chart().evaluate((el) => {
      const ticks = [...el.querySelectorAll('svg text')].filter((t) => t.getAttribute('text-anchor') === 'end').map((t) => ({ v: parseFloat(t.textContent), y: parseFloat(t.getAttribute('y')), tab: getComputedStyle(t).fontVariantNumeric }));
      return ticks;
    });
    const values = r.map((t) => t.v);
    expect(values.length >= 3, `${values.length} ticks`);
    const steps = values.slice(1).map((v, i) => Math.round((v - values[i]) * 1000) / 1000);
    expect(new Set(steps).size === 1 && steps[0] !== 0, `steps ${steps.join(',')}`);
    const mantissa = Math.abs(steps[0]) / 10 ** Math.floor(Math.log10(Math.abs(steps[0])));
    expect([1, 2, 5].some((m) => Math.abs(mantissa - m) < 1e-6), `step ${steps[0]} is not 1, 2 or 5 times a power of ten`);
    expect(r.every((t) => /tabular-nums/.test(t.tab)), 'a tick is not tabular');
    const ys = r.map((t) => t.y);
    expect(ys.every((y, i) => i === 0 || y < ys[i - 1]), 'ticks do not rise up the axis');
    return `ticks ${values.join(', ')} step ${steps[0]}`;
  });

  await check('LineChart', 'the window is recessed with a real edge, takes a focus ring and is at least 44px high', async () => {
    await go('/components/line-chart/code');
    const win = chart().locator('[role="group"][tabindex="0"]');
    await win.focus();
    await page.keyboard.press('ArrowLeft');
    await page.waitForTimeout(150);
    const r = await win.evaluate((el) => {
      const s = getComputedStyle(el);
      return { shadow: s.boxShadow, border: parseFloat(s.borderBlockStartWidth), h: el.getBoundingClientRect().height, outline: parseFloat(s.outlineWidth), roledesc: el.getAttribute('aria-roledescription'), name: !!(el.getAttribute('aria-labelledby') && document.getElementById(el.getAttribute('aria-labelledby'))?.textContent.trim()) };
    });
    expect(/inset/.test(r.shadow), `window shadow ${r.shadow}`);
    expect(r.border > 0, `border ${r.border}px`);
    expect(r.h >= 44, `window ${r.h}px high`);
    expect(r.outline > 0, `focus outline ${r.outline}px`);
    expect(r.roledesc && r.name, 'the window has no role description or name');
    return `recessed window ${Math.round(r.h)}px high, ${r.outline}px focus ring, named`;
  });
}
