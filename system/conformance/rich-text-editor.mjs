// Behaviour checks for RichTextEditor (formatting keys over a recessed well), run by tooling/kiln/conformance.mjs.
// The subject on the code tab is a RichTextEditor with name="note", so the hidden input holds the sanitised HTML.
export default async function richTextEditor({ check, expect, page, go, main }) {
  const root = () => main().locator('[data-component="RichTextEditor"]').first();
  const area = () => root().locator('[role="textbox"]');
  const keys = () => root().locator('[role="toolbar"] button');
  const html = () => root().evaluate((el) => el.querySelector('input[type="hidden"]')?.value ?? null);
  // put the selection on a piece of text inside the writing area, and focus it
  const selectText = (text) => area().evaluate((el, t) => {
    el.focus();
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
      const i = n.data.indexOf(t);
      if (i < 0) continue;
      const r = document.createRange(); r.setStart(n, i); r.setEnd(n, i + t.length);
      const s = getSelection(); s.removeAllRanges(); s.addRange(r);
      return true;
    }
    return false;
  }, text);

  await check('RichTextEditor', 'the toolbar is one tab stop and the arrow keys, Home and End move along its keys', async () => {
    await go('/components/rich-text-editor/code');
    const stops = await keys().evaluateAll((bs) => bs.map((b) => b.tabIndex));
    expect(stops.length === 6, `${stops.length} keys (need 6)`);
    expect(stops.filter((t) => t === 0).length === 1 && stops.every((t) => t === 0 || t === -1), `tabindex ${stops.join(',')}`);
    const role = await root().locator('[role="toolbar"]').count();
    expect(role === 1, 'no role=toolbar');
    await keys().first().focus();
    await page.keyboard.press('ArrowRight');
    const second = await page.evaluate(() => document.activeElement?.dataset.key);
    await page.keyboard.press('End');
    const end = await page.evaluate(() => document.activeElement?.dataset.key);
    await page.keyboard.press('ArrowRight');
    const wrapped = await page.evaluate(() => document.activeElement?.dataset.key);
    await page.keyboard.press('Home');
    const home = await page.evaluate(() => document.activeElement?.dataset.key);
    expect(second === 'italic' && end === 'heading' && wrapped === 'bold' && home === 'bold', `arrow ${second}, End ${end}, wrap ${wrapped}, Home ${home}`);
    const after = await keys().evaluateAll((bs) => bs.map((b) => b.tabIndex));
    expect(after[0] === 0 && after.slice(1).every((t) => t === -1), `after moving, tabindex ${after.join(',')}`);
    return `one stop, arrows ${second}, End ${end}, wrap ${wrapped}, Home ${home}`;
  });

  await check('RichTextEditor', 'every key is at least 44px and a key that is on is pressed and has moved', async () => {
    await go('/components/rich-text-editor/code');
    const small = await keys().evaluateAll((bs) => bs.map((b) => { const r = b.getBoundingClientRect(); return Math.min(r.width, r.height); }).filter((s) => s < 43.5));
    expect(small.length === 0, `${small.length} keys under 44px`);
    await selectText('hall');
    await page.waitForTimeout(150);
    const state = await root().locator('[data-key="bold"]').getAttribute('aria-pressed');
    expect(state === 'true', `bold aria-pressed ${state} on bold text`);
    // the press travel is 0 under Reduce motion by design, so measure it with motion on
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.waitForTimeout(500);
    const dy = await root().locator('[data-key="bold"]').evaluate((b) => new DOMMatrix(getComputedStyle(b).transform).m42);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    expect(dy > 0, `a latched key travels ${dy}px (need more than 0)`);
    return 'all keys at least 44px, bold latched and moved';
  });

  await check('RichTextEditor', 'Ctrl+B and the bold key wrap and unwrap the selection in strong', async () => {
    await go('/components/rich-text-editor/code');
    await selectText('Check');
    await page.keyboard.press('Control+b');
    await page.waitForTimeout(150);
    const on = await html();
    expect(/<strong>Check<\/strong>/.test(on ?? ''), `after Ctrl+B: ${on}`);
    await page.keyboard.press('Control+b');
    await page.waitForTimeout(150);
    const off = await html();
    expect(!/<strong>Check/.test(off ?? ''), `after the second Ctrl+B: ${off}`);
    await selectText('Bleed');
    await root().locator('[data-key="italic"]').click();
    await page.waitForTimeout(150);
    const key = await html();
    expect(/<em>Bleed<\/em>/.test(key ?? ''), `after the italic key: ${key}`);
    return 'strong on and off with Ctrl+B, em with the key';
  });

  await check('RichTextEditor', 'the heading and list keys change the block and press again to undo it', async () => {
    await go('/components/rich-text-editor/code');
    await selectText('Keep the');
    await root().locator('[data-key="heading"]').click();
    await page.waitForTimeout(150);
    const h = await html();
    expect(/<h2>Keep the /.test(h ?? ''), `after the heading key: ${h}`);
    await root().locator('[data-key="heading"]').click();
    await page.waitForTimeout(150);
    expect(/<p>Keep the /.test((await html()) ?? ''), 'a second press did not restore the paragraph');
    await selectText('Check the valves');
    await root().locator('[data-key="ul"]').click();
    await page.waitForTimeout(150);
    const p = await html();
    expect(!/<ul>/.test(p ?? '') && /<p>Check the valves/.test(p ?? ''), `after the bullet key on a bulleted list: ${p}`);
    await root().locator('[data-key="ol"]').click();
    await page.waitForTimeout(150);
    const o = await html();
    expect(/<ol><li>Check the valves/.test(o ?? ''), `after the numbered key: ${o}`);
    return 'h2 on and off, bulleted list off, numbered list on';
  });

  await check('RichTextEditor', 'Ctrl+K opens the address field, a bad address is refused and Escape returns to the text', async () => {
    await go('/components/rich-text-editor/code');
    await selectText('valves');
    await page.keyboard.press('Control+k');
    await page.waitForTimeout(150);
    const onInput = await page.evaluate(() => document.activeElement?.tagName === 'INPUT' && !document.activeElement.closest('[role="textbox"]'));
    expect(onInput, 'Ctrl+K did not move focus to the address field');
    await page.keyboard.type('javascript:alert(1)');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(150);
    const refused = await root().locator('[role="group"] p', { hasText: /address/i }).count();
    expect(refused > 0 && !/javascript/.test((await html()) ?? ''), 'a javascript: address was not refused');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(150);
    const back = await page.evaluate(() => document.activeElement?.getAttribute('role'));
    expect(back === 'textbox', `after Escape focus is on ${back}`);
    await selectText('valves');
    await page.keyboard.press('Control+k');
    await page.waitForTimeout(150);
    await page.keyboard.type('example.com/manual');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(150);
    const linked = await html();
    expect(/<a href="https:\/\/example\.com\/manual" rel="noopener noreferrer">valves<\/a>/.test(linked ?? ''), `after a good address: ${linked}`);
    return 'bad address refused, Escape back to the text, https link applied';
  });

  await check('RichTextEditor', 'pasted HTML keeps only the whitelist', async () => {
    await go('/components/rich-text-editor/code');
    await selectText('Friday');
    await area().evaluate((el) => {
      const dt = new DataTransfer();
      dt.setData('text/html', '<div onclick="x()"><script>window.__owned = 1</script><b style="color:red">Monday</b> <span class="x">and <i>more</i></span><img src="x" onerror="window.__owned = 1"></div>');
      el.dispatchEvent(new ClipboardEvent('paste', { clipboardData: dt, bubbles: true, cancelable: true }));
    });
    await page.waitForTimeout(150);
    const out = (await html()) ?? '';
    expect(/<strong>Monday<\/strong>/.test(out) && /<em>more<\/em>/.test(out), `bold and italic were lost: ${out}`);
    expect(!/script|onclick|onerror|<img|style=|class=|<span|<div/.test(out), `a forbidden tag or attribute survived: ${out}`);
    const owned = await page.evaluate(() => window.__owned ?? 0);
    expect(owned === 0, 'pasted script ran');
    return 'strong and em kept; script, img, span, style and handlers dropped';
  });

  await check('RichTextEditor', 'no part of the editor is the accent orange', async () => {
    await go('/components/rich-text-editor/code');
    const bad = await main().locator('[data-component="RichTextEditor"]').evaluateAll((els) => {
      const probe = document.createElement('span'); probe.style.color = 'var(--ds-action-accent)'; document.body.append(probe);
      const accent = getComputedStyle(probe).color; probe.remove();
      const out = []; for (const el of els) for (const n of el.querySelectorAll('*')) { const cs = getComputedStyle(n); if (accent && [cs.backgroundColor, cs.color, cs.borderColor].some((c) => c === accent)) out.push(n.tagName); }
      return out;
    });
    expect(bad.length === 0, `${bad.length} orange parts`);
    return 'no orange';
  });
}
