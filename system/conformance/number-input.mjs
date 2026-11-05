// Behaviour checks for NumberInput (recessed window between a minus key and a plus key), run by tooling/kiln/conformance.mjs.
// The first NumberInput on the code tab is min 5, max 30, step 0.5, default 21.5, so the page step is 5.
const SEL = '[data-component="NumberInput"]';
export default async function numberInput({ check, expect, go, main }) {
  const first = () => main().locator(SEL).first();
  const val = (box) => box.locator('input').getAttribute('aria-valuenow');

  await check('NumberInput', 'ArrowUp raises the value by one step and the window announces it', async () => {
    await go('/components/number-input/code');
    const box = first();
    const input = box.locator('input');
    expect((await input.getAttribute('role')) === 'spinbutton', 'the window is not a spin button');
    await input.focus();
    const before = Number(await val(box));
    await input.page().keyboard.press('ArrowUp');
    const up = Number(await val(box));
    expect(up === before + 0.5, `ArrowUp moved ${before} to ${up}, need +0.5`);
    await input.page().keyboard.press('ArrowDown');
    await input.page().keyboard.press('ArrowDown');
    const down = Number(await val(box));
    expect(down === before - 0.5, `ArrowDown twice gave ${down}, need ${before - 0.5}`);
    const shown = await input.inputValue();
    expect(Number(shown) === down, `the window shows "${shown}", the value is ${down}`);
    return `${before} up ${up}, down ${down}`;
  });

  await check('NumberInput', 'PageUp moves the value by the page step', async () => {
    await go('/components/number-input/code');
    const box = first();
    const input = box.locator('input');
    await input.focus();
    const before = Number(await val(box));
    await input.page().keyboard.press('PageUp');
    const up = Number(await val(box));
    expect(up === before + 5, `PageUp moved ${before} to ${up}, need +5 (ten steps)`);
    await input.page().keyboard.press('PageDown');
    const back = Number(await val(box));
    expect(back === before, `PageDown gave ${back}, need ${before}`);
    return `${before} to ${up} and back`;
  });

  await check('NumberInput', 'End jumps to the maximum and Home to the minimum', async () => {
    await go('/components/number-input/code');
    const box = first();
    const input = box.locator('input');
    await input.focus();
    await input.page().keyboard.press('End');
    const max = Number(await val(box));
    expect(max === Number(await input.getAttribute('aria-valuemax')), `End gave ${max}`);
    await input.page().keyboard.press('Home');
    const min = Number(await val(box));
    expect(min === Number(await input.getAttribute('aria-valuemin')), `Home gave ${min}`);
    return `End ${max}, Home ${min}`;
  });

  await check('NumberInput', 'typed text above the maximum is clamped on blur', async () => {
    await go('/components/number-input/code');
    const box = first();
    const input = box.locator('input');
    const max = Number(await input.getAttribute('aria-valuemax'));
    await input.focus();
    await input.fill('999');
    await input.blur();
    expect(Number(await val(box)) === max, `999 gave ${await val(box)}, need ${max}`);
    expect(Number(await input.inputValue()) === max, `the window shows "${await input.inputValue()}"`);
    const kept = await val(box);
    await input.focus();
    await input.fill('abc');
    await input.blur();
    expect((await val(box)) === kept, `text that is not a number changed the value to ${await val(box)}`);
    expect((await input.inputValue()) === kept, `the window shows "${await input.inputValue()}", need ${kept}`);
    return `999 to ${max}, "abc" kept ${kept}`;
  });

  await check('NumberInput', 'both keys are 44px targets, steppable by pointer, and flat at the limit', async () => {
    await go('/components/number-input/code');
    const box = first();
    const keys = box.locator('button');
    expect((await keys.count()) === 2, `${await keys.count()} keys (need 2)`);
    const sizes = await keys.evaluateAll((els) => els.map((e) => [e.getBoundingClientRect().width, e.getBoundingClientRect().height, e.tabIndex]));
    expect(sizes.every(([w, h]) => w >= 43.5 && h >= 43.5), `keys ${sizes.map((s) => `${s[0]}×${s[1]}`).join(', ')}`);
    expect(sizes.every((s) => s[2] === -1), 'a key is a tab stop; the arrows do the same job');
    const plus = keys.nth(1);
    const before = Number(await val(box));
    await plus.click();
    const after = Number(await val(box));
    expect(after === before + 0.5, `the plus key moved ${before} to ${after}, need +0.5`);
    await box.locator('input').focus();
    await box.page().keyboard.press('End');
    await box.page().waitForTimeout(500);
    expect(await plus.isDisabled(), 'the plus key is still pressable at the maximum');
    const flat = await plus.evaluate((e) => getComputedStyle(e).boxShadow);
    expect(flat === 'none', `the plus key at the maximum still has height: ${flat}`);
    return `2 keys of ${sizes[0][0]}×${sizes[0][1]}, step ${before} to ${after}, flat at max`;
  });

  await check('NumberInput', 'no part of the number input is the accent orange', async () => {
    await go('/components/number-input/code');
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
