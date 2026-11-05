// Behaviour checks for Form (native form, error summary window, sending key), run by tooling/kiln/conformance.mjs.
// The first Form on the code tab has an empty required "Room name" (name=room), an "Email" holding "abc" (name=mail)
// and a submit key whose onSubmit takes 1.5 seconds.
const FORM = 'form[data-component="Form"]';
export default async function form({ check, expect, go, main, page }) {
  const first = () => main().locator(FORM).first();
  const send = () => first().locator('button[type="submit"]').first();

  await check('Form', 'a failed send puts focus on the summary and its links reach each field', async () => {
    await go('/components/form/code');
    const noValidate = await first().evaluate((f) => f.noValidate);
    expect(noValidate, 'the form lets the browser show its own bubbles');
    expect((await first().locator('[data-component="FormSummary"]').count()) === 0, 'a summary shows before any send');
    await send().click();
    const r = await first().evaluate((f) => {
      const s = f.querySelector('[data-component="FormSummary"]');
      const title = s && document.getElementById(s.getAttribute('aria-labelledby') || '');
      return { has: !!s, focused: !!s && document.activeElement === s, links: s ? s.querySelectorAll('a').length : 0, title: title ? title.textContent : '', role: s && s.getAttribute('role') };
    });
    expect(r.has, 'no summary after a failed send');
    expect(r.focused, 'focus did not move to the summary');
    expect(r.links === 2, `${r.links} links, need 2 (room and email)`);
    expect(/^\s*2\b/.test(r.title), `heading "${r.title}" does not start with the count`);
    expect(r.role === 'group', `summary role ${r.role}`);
    const names = [];
    for (let i = 0; i < 2; i += 1) {
      await first().locator('[data-component="FormSummary"] a').nth(i).click();
      names.push(await page.evaluate(() => document.activeElement && document.activeElement.name));
    }
    expect(names[0] === 'room' && names[1] === 'mail', `links focused ${names.join(', ')}`);
    return 'summary focused, heading counts 2, links focus room and mail';
  });

  await check('Form', 'after the first send a field is checked again on change and its row leaves the summary', async () => {
    await go('/components/form/code');
    await send().click();
    const rows = () => first().locator('[data-component="FormSummary"] li').count();
    expect((await rows()) === 2, `${await rows()} rows at first`);
    const invalid = await first().locator('input[name="room"]').getAttribute('aria-invalid');
    expect(invalid === 'true', `room aria-invalid ${invalid}`);
    await first().locator('input[name="room"]').fill('Kitchen');
    expect((await rows()) === 1, `${await rows()} rows after fixing room, need 1`);
    expect((await first().locator('input[name="room"]').getAttribute('aria-invalid')) === null, 'room is still aria-invalid');
    await first().locator('input[name="mail"]').fill('a@b.co');
    expect((await first().locator('[data-component="FormSummary"]').count()) === 0, 'the summary stays after every field is right');
    return 'rows 2, then 1, then the summary is gone';
  });

  await check('Form', 'while a send runs the key is aria-disabled, says Sending and a second press is ignored', async () => {
    await go('/components/form/code');
    await first().locator('input[name="room"]').fill('Kitchen');
    await first().locator('input[name="mail"]').fill('a@b.co');
    const before = await send().textContent();
    await send().click();
    const r = await first().evaluate((f) => {
      const b = f.querySelector('button[type="submit"]');
      return { busy: f.getAttribute('aria-busy'), disabled: b.getAttribute('aria-disabled'), attr: b.hasAttribute('disabled'), text: b.textContent, status: (f.querySelector('[role="status"]') || {}).textContent };
    });
    expect(r.busy === 'true', `aria-busy ${r.busy}`);
    expect(r.disabled === 'true' && !r.attr, `aria-disabled ${r.disabled}, disabled attr ${r.attr}`);
    expect(/Sending/.test(r.text || '') && r.text !== before, `key says "${r.text}"`);
    expect(/Sending/.test(r.status || ''), `status says "${r.status}"`);
    await send().click();
    await page.waitForTimeout(2000);
    const after = await first().evaluate((f) => ({ busy: f.getAttribute('aria-busy'), disabled: f.querySelector('button[type="submit"]').getAttribute('aria-disabled') }));
    expect(after.busy === null && after.disabled === null, `still sending: ${JSON.stringify(after)}`);
    return 'Sending announced, then released after the promise';
  });

  await check('Form', 'the summary window and its links are ink, a touch-sized row, and never the accent orange', async () => {
    await go('/components/form/code');
    await send().click();
    const r = await first().locator('[data-component="FormSummary"]').evaluate((s) => {
      const probe = document.createElement('span'); probe.style.color = 'var(--ds-action-accent)'; document.body.append(probe);
      const accent = getComputedStyle(probe).color; probe.remove();
      const orange = [...s.querySelectorAll('*'), s].filter((n) => { const cs = getComputedStyle(n); return [cs.backgroundColor, cs.color, cs.borderColor].some((c) => c === accent); }).length;
      const heights = [...s.querySelectorAll('a')].map((a) => a.getBoundingClientRect().height);
      return { orange, heights };
    });
    expect(r.orange === 0, `${r.orange} orange parts in the summary`);
    expect(r.heights.length > 0 && r.heights.every((h) => h >= 43.5), `link rows ${r.heights.join(', ')}`);
    return `no orange; link rows ${r.heights.map((h) => Math.round(h)).join(', ')}px`;
  });
}
