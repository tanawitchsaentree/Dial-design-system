// Behaviour checks for Accordion (sections printed as a legend), run by tooling/kiln/conformance.mjs.
// WAI-ARIA accordion: headers are buttons in headings, Up/Down/Home/End move focus, Enter and Space toggle.
export default async function accordion({ check, expect, eventually, page, go, main }) {
  const ROOT = '[data-component="Accordion"]';
  const heads = (a) => a.locator(':scope button[data-accordion-trigger]');
  const start = async () => {
    await go('/components/accordion/code');
    return main().locator(ROOT).first();
  };
  const expanded = (a) => heads(a).evaluateAll((els) => els.map((e) => e.getAttribute('aria-expanded')));
  const focusedAt = (a) => heads(a).evaluateAll((els) => els.indexOf(document.activeElement));

  await check('Accordion', 'Up, Down, Home and End move focus between headers and never open one', async () => {
    const a = await start();
    const n = await heads(a).count();
    const before = await expanded(a);
    await heads(a).first().focus();
    await page.keyboard.press('ArrowDown');
    const down = await focusedAt(a);
    await page.keyboard.press('End');
    const end = await focusedAt(a);
    await page.keyboard.press('ArrowDown');
    const wrap = await focusedAt(a);
    await page.keyboard.press('ArrowUp');
    const up = await focusedAt(a);
    await page.keyboard.press('Home');
    const home = await focusedAt(a);
    const after = await expanded(a);
    expect(n >= 3, `${n} headers`);
    expect(down === 1 && end === n - 1 && wrap === 0 && up === n - 1 && home === 0, `down ${down}, end ${end}, wrap ${wrap}, up ${up}, home ${home} (of ${n})`);
    expect(JSON.stringify(before) === JSON.stringify(after), `moving focus changed ${before} to ${after}`);
    return `Down ${down}, End ${end}, wraps, Home ${home}; nothing opened`;
  });

  await check('Accordion', 'Enter and Space open a section, and in single mode the open one closes', async () => {
    const a = await start();
    const second = heads(a).nth(1);
    await second.focus();
    await page.keyboard.press('Enter');
    await eventually(async () => (await expanded(a))[1], 'true', 'Enter did not open the second section');
    await eventually(async () => (await expanded(a))[0], 'false', 'the first section did not close');
    const panelId = await second.getAttribute('aria-controls');
    expect(!!panelId, 'an open header has no aria-controls');
    await page.keyboard.press('Space');
    await eventually(async () => (await expanded(a))[1], 'false', 'Space did not close the second section');
    await eventually(async () => await main().locator(`[id="${panelId}"]`).count(), 0, 'the closed panel stayed mounted', 2000);
    return 'Enter opened it and closed the first; Space closed it and its panel left';
  });

  await check('Accordion', 'every header is at least 44px tall and shows a 2px ring on focus', async () => {
    const a = await start();
    const first = heads(a).first();
    await first.focus();
    await page.keyboard.press('Shift+Tab');
    await page.keyboard.press('Tab');
    const r = await first.evaluate((el) => ({ h: el.getBoundingClientRect().height, f: document.activeElement === el, s: getComputedStyle(el).outlineStyle, w: parseFloat(getComputedStyle(el).outlineWidth) }));
    expect(r.f, 'Tab did not land on the first header');
    expect(r.h >= 43.5, `header ${r.h}px tall`);
    expect(r.s !== 'none' && r.w >= 2, `outline ${r.s} ${r.w}px`);
    return `header ${r.h}px, outline ${r.w}px`;
  });

  await check('Accordion', 'the open header is told apart without colour: a bar, a medium weight and aria-expanded', async () => {
    const a = await start();
    const r = await heads(a).evaluateAll((els) => els.map((e) => {
      const mark = e.querySelector('span');
      return { open: e.getAttribute('aria-expanded') === 'true', w: Number(getComputedStyle(e).fontWeight), bar: getComputedStyle(mark).backgroundColor !== 'rgba(0, 0, 0, 0)', barW: mark.getBoundingClientRect().width };
    }));
    const open = r.filter((x) => x.open); const shut = r.filter((x) => !x.open);
    expect(open.length > 0 && shut.length > 0, `${open.length} open, ${shut.length} closed`);
    expect(open.every((x) => x.bar && x.barW > 0 && x.w >= 500), `open headers ${JSON.stringify(open)}`);
    expect(shut.every((x) => !x.bar && x.w < 500), `closed headers ${JSON.stringify(shut)}`);
    return 'bar and weight differ between open and closed';
  });
}
