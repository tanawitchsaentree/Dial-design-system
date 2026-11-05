// Behaviour checks for AppShell (page frame with landmarks, skip link, Drawer fold), run by tooling/kiln/conformance.mjs.
// The Usage subject holds two shells: a wide one (header, sidebar, footer) and a narrow one whose header is a function.
export default async function appShell({ check, expect, go, main, page }) {
  const wide = () => main().locator('[data-component="AppShell"]').nth(0);
  const narrow = () => main().locator('[data-component="AppShell"]').nth(1);

  await check('AppShell', 'the wide shell has header, navigation, main and footer landmarks with the side column before main', async () => {
    await go('/components/app-shell/code');
    const r = await wide().evaluate((el) => {
      const side = el.querySelector('[data-part="side"]'); const m = el.querySelector('main');
      const sr = side?.getBoundingClientRect(); const mr = m?.getBoundingClientRect();
      return {
        banner: el.querySelectorAll('header').length, nav: el.querySelectorAll('nav').length, mains: el.querySelectorAll('main').length, footer: el.querySelectorAll(':scope > footer').length,
        side: !!side, apart: !!(sr && mr && sr.right <= mr.left + 0.5), sameTop: !!(sr && mr && Math.abs(sr.top - mr.top) < 1),
      };
    });
    expect(r.banner >= 1 && r.nav >= 2 && r.mains === 1 && r.footer === 1, `landmarks ${JSON.stringify(r)}`);
    expect(r.side && r.apart && r.sameTop, `side column ${JSON.stringify(r)}`);
    return 'header, 2 navs, main, footer; side column left of main on the same row';
  });

  await check('AppShell', 'the skip link is the first stop, shows while focused and sends focus to main', async () => {
    await go('/components/app-shell/code');
    const link = wide().locator('a').first();
    const hidden = await link.evaluate((a) => { const r = a.getBoundingClientRect(); return { w: r.width, t: a.textContent }; });
    expect(hidden.w <= 2, `unfocused link is ${hidden.w}px wide`);
    expect(/skip to main/i.test(hidden.t || ''), `link text "${hidden.t}"`);
    await link.focus();
    const shown = await link.evaluate((a) => a.getBoundingClientRect().width);
    expect(shown > 40, `focused link is ${shown}px wide`);
    await page.keyboard.press('Enter');
    const on = await wide().evaluate((el) => document.activeElement === el.querySelector('main'));
    expect(on, 'focus is on main after Enter');
    return `link ${Math.round(hidden.w)}px unfocused, ${Math.round(shown)}px focused, Enter focuses main`;
  });

  await check('AppShell', 'in a narrow shell the side column leaves the page and the Menu key opens it in a Drawer that Escape closes', async () => {
    await go('/components/app-shell/code');
    const gone = await narrow().evaluate((el) => ({ side: !!el.querySelector('[data-part="side"]'), key: !!el.querySelector('button[aria-haspopup="dialog"]') }));
    expect(!gone.side && gone.key, `folded shell ${JSON.stringify(gone)}`);
    const key = narrow().locator('button[aria-haspopup="dialog"]').first();
    await key.click();
    const dlg = narrow().locator('dialog[data-component="Drawer"]');
    await dlg.waitFor({ state: 'visible' });
    const inside = await dlg.evaluate((d) => ({ nav: !!d.querySelector('nav'), modal: d.matches(':modal') }));
    expect(inside.nav && inside.modal, `drawer ${JSON.stringify(inside)}`);
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);
    expect(await narrow().locator('dialog[data-component="Drawer"]').count() === 0, 'drawer is gone after Escape');
    const back = await key.evaluate((k) => document.activeElement === k);
    expect(back, 'focus returned to the Menu key');
    return 'column in a modal Drawer, Escape closes it, focus back on Menu';
  });

  await check('AppShell', 'the shell measures its own width: narrowing the wide shell folds the column and widening it brings it back', async () => {
    await go('/components/app-shell/code');
    const box = await wide().evaluateHandle((el) => el.parentElement);
    const before = await wide().evaluate((el) => !!el.querySelector('[data-part="side"]'));
    await box.evaluate((b) => { b.dataset.was = b.style.inlineSize; b.style.inlineSize = 'var(--ds-layout-frame-lg)'; });
    await page.waitForTimeout(300);
    const folded = await wide().evaluate((el) => !el.querySelector('[data-part="side"]'));
    await box.evaluate((b) => { b.style.inlineSize = b.dataset.was; });
    await page.waitForTimeout(300);
    const after = await wide().evaluate((el) => !!el.querySelector('[data-part="side"]'));
    expect(before && folded && after, `split ${before}, folded ${folded}, split again ${after}`);
    return 'split, folded at 420px, split again';
  });

  await check('AppShell', 'no part of the shell is the accent orange', async () => {
    await go('/components/app-shell/code');
    const bad = await main().locator('[data-component="AppShell"]').evaluateAll((els) => {
      const probe = document.createElement('span'); probe.style.color = 'var(--ds-action-accent)'; document.body.append(probe);
      const accent = getComputedStyle(probe).color; probe.remove();
      const out = []; for (const el of els) for (const n of el.querySelectorAll('[data-part], [data-part] > *')) { if (n.closest('button, a')) continue; const cs = getComputedStyle(n); if (accent && [cs.backgroundColor, cs.color, cs.borderColor].some((c) => c === accent)) out.push(n.tagName); }
      return out;
    });
    expect(bad.length === 0, `${bad.length} orange parts`);
    return 'no orange';
  });
}
