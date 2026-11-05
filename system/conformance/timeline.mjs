// Behaviour checks for Timeline (time column, hairline rail, ring nodes), run by tooling/kiln/conformance.mjs.
export default async function timeline({ check, expect, go, main }) {
  await check('Timeline', 'the events are a list in order with a time element each and exactly one lit node named', async () => {
    await go('/components/timeline/code');
    const r = await main().locator('ol[data-component="Timeline"]').first().evaluate((ol) => {
      const items = [...ol.querySelectorAll(':scope > li')];
      return {
        items: items.length,
        times: items.filter((li) => li.querySelector(':scope > time')).length,
        lit: ol.querySelectorAll('li[data-latest]').length,
        named: [...ol.querySelectorAll('li[data-latest] [role="img"]')].map((n) => n.getAttribute('aria-label')),
      };
    });
    expect(r.items >= 2, `${r.items} events`);
    expect(r.times === r.items, `${r.times} time elements for ${r.items} events`);
    expect(r.lit === 1 && r.named.length === 1 && !!r.named[0], `${r.lit} lit events, names ${JSON.stringify(r.named)}`);
    return `${r.items} events, 1 lit and named ${r.named[0]}`;
  });
  await check('Timeline', 'the lit node is filled and the others are rings, so the lit event shows without colour', async () => {
    await go('/components/timeline/code');
    const r = await main().locator('ol[data-component="Timeline"]').first().evaluate((ol) => {
      const bg = (li) => getComputedStyle(li.querySelector('span span')).backgroundColor;
      const w = (li) => getComputedStyle(li.querySelector('p')).fontWeight;
      const lit = ol.querySelector('li[data-latest]'); const plain = [...ol.querySelectorAll(':scope > li:not([data-latest])')][0];
      return { litBg: bg(lit), plainBg: bg(plain), litW: Number(w(lit)), plainW: Number(w(plain)) };
    });
    expect(r.litBg !== r.plainBg, `lit node ${r.litBg} equals plain node ${r.plainBg}`);
    expect(r.litW > r.plainW, `lit title weight ${r.litW} not above ${r.plainW}`);
    return `node fill differs, weight ${r.litW} over ${r.plainW}`;
  });
  await check('Timeline', 'times, nodes and titles line up in one column each across the events', async () => {
    await go('/components/timeline/code');
    const r = await main().locator('ol[data-component="Timeline"]').first().evaluate((ol) => {
      const lis = [...ol.querySelectorAll(':scope > li')];
      const edge = (sel, side) => lis.map((li) => Math.round(li.querySelector(sel).getBoundingClientRect()[side]));
      return { timeEnd: edge('time', 'right'), nodeStart: edge('span span', 'left'), titleStart: edge('p', 'left'), tabular: getComputedStyle(lis[0].querySelector('time')).fontVariantNumeric };
    });
    const same = (a) => a.every((x) => x === a[0]);
    expect(same(r.timeEnd) && same(r.nodeStart) && same(r.titleStart), `edges ${JSON.stringify(r)}`);
    expect(/tabular-nums/.test(r.tabular), `time numerals ${r.tabular}`);
    return 'one column each, tabular figures';
  });
  await check('Timeline', 'no part of the timeline is the accent orange', async () => {
    await go('/components/timeline/code');
    const bad = await main().locator('ol[data-component="Timeline"]').evaluateAll((els) => {
      const probe = document.createElement('span'); probe.style.color = 'var(--ds-action-accent)'; document.body.append(probe);
      const accent = getComputedStyle(probe).color; probe.remove();
      const out = []; for (const el of els) for (const n of el.querySelectorAll('*')) { const cs = getComputedStyle(n); if (accent && [cs.backgroundColor, cs.color, cs.borderColor].some((c) => c === accent)) out.push(n.tagName); }
      return out;
    });
    expect(bad.length === 0, `${bad.length} orange parts`);
    return 'no orange';
  });
}
