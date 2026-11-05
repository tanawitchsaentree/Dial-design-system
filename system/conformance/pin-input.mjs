// Behaviour checks for PinInput (one recessed window per digit), run by tooling/kiln/conformance.mjs.
// The first PinInput on the code tab is a six-digit field, empty, labelled "Verification code".
const SEL = '[data-component="PinInput"]';
export default async function pinInput({ check, expect, go, main }) {
  const cells = () => main().locator(SEL).first().locator('[role="group"] > input');
  const values = async () => cells().evaluateAll((els) => els.map((e) => e.value));
  const activeIndex = async () => cells().evaluateAll((els) => els.indexOf(document.activeElement));

  await check('PinInput', 'a digit fills its cell and focus moves to the next one; a letter is ignored', async () => {
    await go('/components/pin-input/code');
    const c = cells();
    expect((await c.count()) === 6, `${await c.count()} cells, need 6`);
    await c.nth(0).focus();
    const page = c.nth(0).page();
    await page.keyboard.press('a');
    expect((await values()).join('') === '', `a letter was accepted: ${(await values()).join('|')}`);
    await page.keyboard.press('4');
    await page.keyboard.press('8');
    const v = await values();
    expect(v[0] === '4' && v[1] === '8', `cells hold ${v.join('|')}, need 4|8`);
    expect((await activeIndex()) === 2, `focus is on cell ${await activeIndex()}, need 2`);
    return 'typed 4, 8, focus on cell 3';
  });

  await check('PinInput', 'Backspace in an empty cell goes back and clears the cell before it', async () => {
    await go('/components/pin-input/code');
    const c = cells();
    await c.nth(0).focus();
    const page = c.nth(0).page();
    await page.keyboard.press('1');
    await page.keyboard.press('2');
    await page.keyboard.press('Backspace');
    let v = await values();
    expect(v[1] === '' && v[0] === '1', `after one Backspace cells hold ${v.join('|')}, need 1 and an empty second cell`);
    expect((await activeIndex()) === 1, `focus is on cell ${await activeIndex()}, need 1`);
    await page.keyboard.press('Backspace');
    v = await values();
    expect(v[0] === '' && (await activeIndex()) === 0, `after two Backspaces cells hold ${v.join('|')}, focus ${await activeIndex()}`);
    return 'Backspace walks back and clears';
  });

  await check('PinInput', 'ArrowLeft, Home and End walk the cells that hold a digit and the first empty one', async () => {
    await go('/components/pin-input/code');
    const c = cells();
    await c.nth(0).focus();
    const page = c.nth(0).page();
    for (const k of ['1', '2', '3']) await page.keyboard.press(k);
    expect((await activeIndex()) === 3, `after three digits focus is on ${await activeIndex()}, need 3`);
    await page.keyboard.press('ArrowRight');
    expect((await activeIndex()) === 3, `ArrowRight past the first empty cell moved focus to ${await activeIndex()}`);
    await page.keyboard.press('ArrowLeft');
    expect((await activeIndex()) === 2, `ArrowLeft gave ${await activeIndex()}, need 2`);
    await page.keyboard.press('Home');
    expect((await activeIndex()) === 0, `Home gave ${await activeIndex()}, need 0`);
    await page.keyboard.press('End');
    expect((await activeIndex()) === 3, `End gave ${await activeIndex()}, need 3 (the first empty cell)`);
    return 'arrows, Home and End stay within the typed code';
  });

  await check('PinInput', 'a paste fills every cell and a whole code from autofill spreads over the cells', async () => {
    await go('/components/pin-input/code');
    const c = cells();
    await c.nth(0).focus();
    await c.nth(0).evaluate((el) => {
      const dt = new DataTransfer();
      dt.setData('text/plain', '12-34 56');
      el.dispatchEvent(new ClipboardEvent('paste', { clipboardData: dt, bubbles: true, cancelable: true }));
    });
    let v = await values();
    expect(v.join('') === '123456', `after paste cells hold ${v.join('|')}, need 1|2|3|4|5|6`);
    expect((await activeIndex()) === 5, `focus is on cell ${await activeIndex()}, need the last (5)`);
    await go('/components/pin-input/code');
    await cells().nth(0).focus();
    await cells().nth(0).page().keyboard.insertText('987654');
    v = await values();
    expect(v.join('') === '987654', `after autofill cells hold ${v.join('|')}`);
    return 'paste and autofill fill 6 cells';
  });

  await check('PinInput', 'each cell is a 44px numeric one-time-code input named "Digit n of N" inside a labelled group', async () => {
    await go('/components/pin-input/code');
    const r = await main().locator(SEL).first().evaluate((root) => {
      const group = root.querySelector('[role="group"]');
      const labelEl = group && document.getElementById(group.getAttribute('aria-labelledby') || '');
      return {
        label: labelEl ? labelEl.textContent : null,
        cells: [...root.querySelectorAll('[role="group"] > input')].map((e) => {
          const b = e.getBoundingClientRect();
          return { w: b.width, h: b.height, name: e.getAttribute('aria-label'), mode: e.inputMode, ac: e.autocomplete };
        }),
      };
    });
    expect(r.label && r.label.length > 0, 'the group has no label');
    expect(r.cells.length === 6 && r.cells.every((x) => x.w >= 43.5 && x.h >= 43.5), `cells ${r.cells.map((x) => `${x.w}×${x.h}`).join(', ')}`);
    expect(r.cells.every((x, i) => x.name === `Digit ${i + 1} of 6`), `names ${r.cells.map((x) => x.name).join(' | ')}`);
    expect(r.cells.every((x) => x.mode === 'numeric' && x.ac === 'one-time-code'), 'cells are not numeric one-time-code inputs');
    return `6 cells, ${r.cells[0].w}×${r.cells[0].h}, group "${r.label}"`;
  });

  await check('PinInput', 'no part of the pin input is the accent orange', async () => {
    await go('/components/pin-input/code');
    const bad = await main().locator(SEL).evaluateAll((els) => {
      const probe = document.createElement('span'); probe.style.color = 'var(--ds-action-accent)'; document.body.append(probe);
      const accent = getComputedStyle(probe).color; probe.remove();
      const out = []; for (const el of els) for (const n of el.querySelectorAll('*')) { const cs = getComputedStyle(n); if (accent && [cs.backgroundColor, cs.color, cs.borderColor].some((c) => c === accent)) out.push(n.tagName); }
      return out;
    });
    expect(bad.length === 0, `${bad.length} orange parts`);
    return 'no orange';
  });
}
