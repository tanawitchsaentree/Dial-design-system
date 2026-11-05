// Behaviour checks for Drawer (a side panel on the native modal dialog), run by tooling/kiln/conformance.mjs.
export default async function drawer({ check, expect, page, go, main }) {
  const opener = () => main().getByRole('button', { name: 'Rooms', exact: true }).first();
  const openDrawer = async () => {
    await go('/components/drawer/code');
    const b = opener();
    await b.focus();
    await page.keyboard.press('Enter');
    const d = main().locator('dialog[data-component="Drawer"]:modal').first();
    await d.waitFor({ state: 'visible' });
    return { b, d };
  };
  await check('Drawer', 'Enter on the opener opens a modal drawer named by its title', async () => {
    const { b, d } = await openDrawer();
    const st = await d.evaluate((el) => ({ modal: el.matches(':modal'), name: document.getElementById(el.getAttribute('aria-labelledby') ?? '')?.textContent ?? '', rows: el.querySelectorAll('[data-part="content"] a').length, focus: document.activeElement === el }));
    expect(st.modal, 'the drawer is not modal (showModal was not used)');
    expect(st.name.trim().length > 0, 'the drawer has no accessible name');
    expect(st.rows >= 3, `${st.rows} rows in the list (need 3)`);
    expect(st.focus, 'focus did not go to the drawer itself');
    expect((await b.getAttribute('aria-expanded')) === 'true', 'the opener does not say aria-expanded="true"');
    return `"${st.name.trim()}", modal, ${st.rows} rows`;
  });
  await check('Drawer', 'Tab and Shift+Tab stay inside the drawer', async () => {
    const { d } = await openDrawer();
    const seen = [];
    for (const k of ['Tab', 'Tab', 'Tab', 'Tab', 'Tab', 'Tab', 'Tab', 'Shift+Tab', 'Shift+Tab', 'Shift+Tab']) {
      await page.keyboard.press(k);
      seen.push(await d.evaluate((el) => el.contains(document.activeElement) || document.activeElement === el));
    }
    expect(seen.every(Boolean), `focus left the drawer (${seen.join(', ')})`);
    return `${seen.length} moves inside`;
  });
  await check('Drawer', 'Escape and a click on the scrim close the drawer and focus returns to the opener', async () => {
    const first = await openDrawer();
    await page.keyboard.press('Escape');
    await first.d.waitFor({ state: 'detached' });
    expect(await first.b.evaluate((el) => document.activeElement === el), 'after Escape focus did not return to the opener');
    const second = await openDrawer();
    await page.mouse.click(4, 4);
    await second.d.waitFor({ state: 'detached' });
    expect(await second.b.evaluate((el) => document.activeElement === el), 'after the scrim click focus did not return to the opener');
    return 'Escape and scrim both closed it, focus on opener';
  });
  await check('Drawer', 'the drawer is inset from the window and the close key is at least the touch target', async () => {
    const { d } = await openDrawer();
    const r = await d.evaluate((el) => {
      const probe = document.createElement('div');
      probe.style.cssText = 'position:fixed;visibility:hidden;display:block;inline-size:var(--ds-gap-inset)';
      document.body.append(probe);
      const inset = probe.getBoundingClientRect().width;
      probe.remove();
      const b = el.getBoundingClientRect();
      const k = el.querySelector('[data-part="head"] button').getBoundingClientRect();
      return { inset, top: b.top, bottom: innerHeight - b.bottom, end: innerWidth - b.right, start: b.left, kw: k.width, kh: k.height };
    });
    expect(r.inset > 0, 'gap.inset did not resolve');
    expect(r.top >= r.inset - 0.5 && r.bottom >= r.inset - 0.5 && r.end >= r.inset - 0.5, `edges ${r.top}/${r.bottom}/${r.end} (inset ${r.inset})`);
    expect(r.start > r.end, `drawer is not at the inline end (start gap ${r.start}, end gap ${r.end})`);
    expect(r.kw >= 43.5 && r.kh >= 43.5, `close key ${r.kw}×${r.kh}`);
    return `inset ${r.inset}px on all sides, close key ${r.kw}×${r.kh}`;
  });
  await check('Drawer', 'the drawer slides in and out on the motion tokens and stays mounted while it leaves', async () => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    try {
      const { d } = await openDrawer();
      const t = await d.evaluate((el) => { const c = getComputedStyle(el); return { prop: c.transitionProperty, dur: c.transitionDuration }; });
      expect(/transform|all/.test(t.prop) && /opacity|all/.test(t.prop) && parseFloat(t.dur) > 0, `transition ${t.prop} ${t.dur}`);
      await d.evaluate((el) => {
        window.__drawerSeen = [];
        const note = () => window.__drawerSeen.push(el.isConnected ? el.getAttribute('data-state') : 'gone');
        new MutationObserver(note).observe(el, { attributes: true, attributeFilter: ['data-state'] });
        new MutationObserver(() => { if (!el.isConnected) window.__drawerSeen.push('gone'); }).observe(document.body, { childList: true, subtree: true });
      });
      await page.keyboard.press('Escape');
      await d.waitFor({ state: 'detached' });
      const seen = await page.evaluate(() => window.__drawerSeen);
      expect(seen.includes('closing'), `states seen on close: ${seen.join(', ')} (no closing state)`);
      return `${t.prop} over ${t.dur}; saw ${seen.join(' → ')}`;
    } finally {
      await page.emulateMedia({ reducedMotion: 'reduce' });
    }
  });
  await check('Drawer', 'no part of the drawer is the accent orange', async () => {
    const { d } = await openDrawer();
    const bad = await d.evaluate((el) => {
      const probe = document.createElement('span'); probe.style.color = 'var(--ds-action-accent)'; document.body.append(probe);
      const accent = getComputedStyle(probe).color; probe.remove();
      const out = [];
      for (const n of [el, ...el.querySelectorAll('*')]) {
        if (n.getAttribute('data-kind') === 'primary') continue;
        const cs = getComputedStyle(n);
        if (accent && [cs.backgroundColor, cs.color, cs.borderColor].some((c) => c === accent)) out.push(n.tagName);
      }
      return out;
    });
    expect(bad.length === 0, `${bad.length} orange parts`);
    return 'no orange';
  });
}
