// Behaviour checks for DescriptionList (terms and values printed on the inset line), run by tooling/kiln/conformance.mjs.
const LIST = '[data-component="DescriptionList"]';
export default async function descriptionList({ check, expect, go, main }) {
  await check('DescriptionList', 'it is a native description list that takes no focus and every term has a value', async () => {
    await go('/components/description-list/code');
    const r = await main().locator(LIST).first().evaluate((el) => {
      const kids = [...el.children];
      let orphan = 0;
      kids.forEach((k, i) => { if (k.tagName === 'DT' && !(kids[i + 1] && kids[i + 1].tagName === 'DD')) orphan += 1; });
      return { tag: el.tagName, dt: kids.filter((k) => k.tagName === 'DT').length, dd: kids.filter((k) => k.tagName === 'DD').length, orphan, focusable: el.querySelectorAll('a[href],button,input,select,textarea,[tabindex]').length };
    });
    expect(r.tag === 'DL', `root is ${r.tag}`);
    expect(r.dt >= 3 && r.dd >= r.dt, `${r.dt} terms, ${r.dd} values`);
    expect(r.orphan === 0, `${r.orphan} terms with no value`);
    expect(r.focusable === 0, `${r.focusable} focusable parts`);
    return `${r.dt} terms, ${r.dd} values, no focusable part`;
  });
  await check('DescriptionList', 'a term is smaller and quieter than its value, and values use tabular numerals', async () => {
    await go('/components/description-list/code');
    const r = await main().locator(LIST).first().evaluate((el) => {
      const dt = getComputedStyle(el.querySelector('dt')); const dd = getComputedStyle(el.querySelector('dd'));
      return { ts: parseFloat(dt.fontSize), ds: parseFloat(dd.fontSize), tc: dt.color, dc: dd.color, tab: dd.fontVariantNumeric };
    });
    expect(r.ts < r.ds, `term ${r.ts}px, value ${r.ds}px`);
    expect(r.tc !== r.dc, `term and value share the colour ${r.tc}`);
    expect(/tabular-nums/.test(r.tab), `numerals ${r.tab}`);
    return `term ${r.ts}px secondary ink, value ${r.ds}px primary ink, tabular numerals`;
  });
  await check('DescriptionList', 'a seam is cut between pairs and not above the first term', async () => {
    await go('/components/description-list/code');
    const r = await main().locator(LIST).first().evaluate((el) => {
      const dts = [...el.querySelectorAll(':scope > dt')];
      const seam = (n) => { const s = getComputedStyle(n, '::before'); return { content: s.content, top: parseFloat(s.borderBlockStartWidth), bottom: parseFloat(s.borderBlockEndWidth), topC: s.borderBlockStartColor, botC: s.borderBlockEndColor }; };
      return { first: seam(dts[0]), next: seam(dts[1]), third: seam(dts[2]) };
    });
    expect(r.first.content === 'none' || r.first.content === 'normal', `the first term has a seam (${r.first.content})`);
    for (const [name, s] of [['second', r.next], ['third', r.third]]) {
      expect(s.top > 0 && s.bottom > 0, `${name} seam ${s.top}px / ${s.bottom}px`);
      expect(s.topC !== s.botC, `${name} seam has one colour on both edges`);
    }
    return 'two-line seam above the second and third terms, none above the first';
  });
  await check('DescriptionList', 'terms start on the inset line, and in the inline layout values share one start edge and figures one end edge', async () => {
    await go('/components/description-list/code');
    const r = await main().locator(LIST).evaluateAll((els) => {
      const out = [];
      for (const el of els) {
        const box = el.getBoundingClientRect();
        const dts = [...el.querySelectorAll(':scope > dt')].map((n) => n.getBoundingClientRect());
        const dds = [...el.querySelectorAll(':scope > dd')];
        const first = (dt) => { let n = dt.nextElementSibling; return n && n.tagName === 'DD' ? n : null; };
        const starts = [...el.querySelectorAll(':scope > dt')].map((t) => first(t)).filter(Boolean).map((d) => d.getBoundingClientRect().left);
        const ends = dds.filter((d) => d.hasAttribute('data-numeric')).map((d) => d.getBoundingClientRect().right);
        out.push({ orientation: el.getAttribute('data-orientation'), termsOnLine: getComputedStyle(el).direction === 'rtl' ? true : dts.every((b) => Math.abs(b.left - box.left) < 1), startSpread: Math.max(...starts) - Math.min(...starts), endSpread: ends.length ? Math.max(...ends) - Math.min(...ends) : 0, starts: starts.length });
      }
      return out;
    });
    const inline = r.find((x) => x.orientation === 'inline');
    expect(r.length >= 2 && inline, 'the page needs a stacked and an inline list');
    expect(r.every((x) => x.termsOnLine), 'a term is off the inset line');
    expect(inline.starts >= 3 && inline.startSpread < 1, `values start ${inline.startSpread}px apart`);
    expect(inline.endSpread < 1, `figures end ${inline.endSpread}px apart`);
    return `${r.length} lists, terms on the inset line, inline values start together and figures end together`;
  });
  await check('DescriptionList', 'no part of the list is the accent orange', async () => {
    await go('/components/description-list/code');
    const bad = await main().locator(LIST).evaluateAll((els) => {
      const probe = document.createElement('span'); probe.style.color = 'var(--ds-action-accent)'; document.body.append(probe);
      const accent = getComputedStyle(probe).color; probe.remove();
      const out = []; for (const el of els) for (const n of [el, ...el.querySelectorAll('*')]) { const cs = getComputedStyle(n); if (accent && [cs.backgroundColor, cs.color, cs.borderColor].some((c) => c === accent)) out.push(n.tagName); }
      return out;
    });
    expect(bad.length === 0, `${bad.length} orange parts`);
    return 'no orange';
  });
}
