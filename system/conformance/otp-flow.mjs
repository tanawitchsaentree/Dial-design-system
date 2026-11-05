// Behaviour checks for OTPFlow (the whole code step), run by tooling/kiln/conformance.mjs.
// The first OTPFlow on the code tab is the Usage subject: destination "+66 81 234 5678", resendIn 3, name "code",
// and an onVerify that writes the code to document.documentElement.dataset.otp.
const SEL = '[data-component="OTPFlow"]';
export default async function otpFlow({ check, expect, go, main }) {
  const root = () => main().locator(SEL).first();
  const key = () => root().locator('button').first();
  const reading = () => root().locator(':scope > div:nth-child(2) > span');
  const cells = () => root().locator('[data-component="PinInput"] [role="group"] > input');
  const wait = (ms) => root().page().waitForTimeout(ms);

  await check('OTPFlow', 'the window prints the destination and a countdown, and the key waits for it to end', async () => {
    await go('/components/otp-flow/code');
    const win = await root().locator(':scope > div:nth-child(2)').innerText();
    expect(/\+66 81 234 5678/.test(win), `window reads: ${win.replace(/\n/g, ' | ')}`);
    const first = (await reading().innerText()).trim();
    expect(/^\d:\d\d$/.test(first), `countdown reads "${first}"`);
    expect(await key().isDisabled(), 'the key is enabled while the countdown runs');
    await wait(4500);
    const last = (await reading().innerText()).trim();
    expect(last === '0:00', `countdown ended at "${last}", need 0:00`);
    expect(!(await key().isDisabled()), 'the key is still disabled after the countdown');
    return `window held the number, count ${first} to ${last}, key enabled`;
  });

  await check('OTPFlow', 'a full code calls onVerify once with every digit', async () => {
    await go('/components/otp-flow/code');
    await root().page().evaluate(() => { delete document.documentElement.dataset.otp; });
    const c = cells();
    expect((await c.count()) === 6, `${await c.count()} cells, need 6`);
    await c.nth(0).focus();
    const page = root().page();
    for (const d of '48152') await page.keyboard.press(d);
    const early = await page.evaluate(() => document.documentElement.dataset.otp ?? '');
    expect(early === '', `onVerify ran early with "${early}"`);
    await page.keyboard.press('9');
    const got = await page.evaluate(() => document.documentElement.dataset.otp ?? '');
    expect(got === '481529', `onVerify got "${got}", need 481529`);
    const hidden = await root().locator('input[type="hidden"][name="code"]').inputValue();
    expect(hidden === '481529', `hidden field holds "${hidden}"`);
    return 'six digits sent as 481529';
  });

  await check('OTPFlow', 'the send-again key waits for the countdown, then clears the digits and returns focus to the first one', async () => {
    await go('/components/otp-flow/code');
    const page = root().page();
    const c = cells();
    await c.nth(0).focus();
    for (const d of '123') await page.keyboard.press(d);
    await wait(4500);
    expect(!(await key().isDisabled()), 'the key is disabled after the countdown');
    await key().focus();
    await page.keyboard.press('Enter');
    await wait(300);
    const vals = await c.evaluateAll((els) => els.map((e) => e.value));
    expect(vals.every((v) => v === ''), `digits left: ${vals.join('|')}`);
    const idx = await c.evaluateAll((els) => els.indexOf(document.activeElement));
    expect(idx === 0, `focus is on cell ${idx}, need 0`);
    const again = (await reading().innerText()).trim();
    expect(again !== '0:00', `countdown did not start again: "${again}"`);
    expect(await key().isDisabled(), 'the key is enabled right after a send');
    const note = await root().locator(':scope > [role="status"]').innerText();
    expect(/\+66 81 234 5678/.test(note), `status line says "${note}"`);
    return `cleared, focus on cell 1, count restarted at ${again}`;
  });

  await check('OTPFlow', 'a polite status line is present and silent until something happens', async () => {
    await go('/components/otp-flow/code');
    const s = root().locator(':scope > [role="status"]');
    expect((await s.count()) === 1, `${await s.count()} status lines`);
    expect((await s.getAttribute('aria-live')) === 'polite', 'status line is not polite');
    const t = (await s.innerText()).trim();
    expect(t === '', `status line already says "${t}"`);
    await wait(4500);
    const after = (await s.innerText()).trim();
    expect(after.length > 0, 'the end of the countdown was not announced');
    return `silent at mount, then "${after}"`;
  });

  await check('OTPFlow', 'the send-again key is at least the touch target and no part is the accent orange', async () => {
    await go('/components/otp-flow/code');
    const box = await key().boundingBox();
    expect(box && box.height >= 43.5 && box.width >= 43.5, `key is ${box && box.width}×${box && box.height}`);
    const bad = await main().locator(SEL).evaluateAll((els) => {
      const probe = document.createElement('span'); probe.style.color = 'var(--ds-action-accent)'; document.body.append(probe);
      const accent = getComputedStyle(probe).color; probe.remove();
      const out = [];
      for (const el of els.slice(0, 1)) for (const n of el.querySelectorAll('*')) { const cs = getComputedStyle(n); if (accent && [cs.backgroundColor, cs.color, cs.borderColor].some((c) => c === accent)) out.push(n.tagName); }
      return out;
    });
    expect(bad.length === 0, `${bad.length} orange parts`);
    return `key ${box.width}×${box.height}, no orange`;
  });
}
