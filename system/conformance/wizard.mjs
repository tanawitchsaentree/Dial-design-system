// Behaviour checks for Wizard (the Stepper opening one step at a time), run by tooling/kiln/conformance.mjs.
// The Usage subject is a three-step Wizard whose first step holds #wiz-name and refuses to be left while it is empty.
export default async function wizard({ page, check, expect, go, main }) {
  const root = () => main().locator('[data-component="Wizard"]').first();
  const load = async () => { await go('/components/wizard/code'); await root().waitFor(); };

  await check('Wizard', 'only the open step shows its fields and the statuses follow it', async () => {
    await load();
    const r = await root().evaluate((w) => {
      const items = [...w.querySelectorAll(':scope > ol > li')];
      const panels = items.map((li) => li.querySelector('[class*="panel"]'));
      return {
        n: items.length,
        current: items.filter((li) => li.getAttribute('aria-current') === 'step').length,
        openAt: items.findIndex((li) => li.getAttribute('aria-current') === 'step'),
        visible: panels.map((p) => !!p && p.getBoundingClientRect().height > 0),
      };
    });
    expect(r.n >= 3, `${r.n} steps (need 3)`);
    expect(r.current === 1 && r.openAt === 0, `${r.current} current, at ${r.openAt}`);
    expect(r.visible.filter(Boolean).length === 1 && r.visible[0] === true, `visible panels ${r.visible.join(',')}`);
    return 'one open step of ' + r.n;
  });

  await check('Wizard', 'Next moves focus to the new step title', async () => {
    await load();
    await root().locator('#wiz-name').fill('Kitchen');
    const next = root().getByRole('button', { name: 'Next' });
    await next.focus();
    await page.keyboard.press('Enter');
    await page.waitForTimeout(150);
    const a = await root().evaluate((w) => {
      const el = document.activeElement;
      return { role: el?.getAttribute('role'), text: el?.textContent ?? '', inWizard: w.contains(el), current: w.querySelector('li[aria-current="step"] [role="heading"]') === el };
    });
    expect(a.inWizard && a.role === 'heading' && a.current, `focus on ${a.role} "${a.text}" (in wizard ${a.inWizard}, current ${a.current})`);
    expect(/Configuration/.test(a.text) && /Step 2 of 3/.test(a.text), `title read as "${a.text}"`);
    await root().getByRole('button', { name: 'Back' }).click();
    await page.waitForTimeout(150);
    const back = await root().evaluate((w) => ({ text: document.activeElement?.textContent ?? '', value: w.querySelector('#wiz-name')?.value }));
    expect(/General/.test(back.text), `Back focus on "${back.text}"`);
    expect(back.value === 'Kitchen', `typed value after Back is "${back.value}" (closed steps keep their fields)`);
    return 'focus follows the step; typed value kept';
  });

  await check('Wizard', 'a blocked step stays open and prints why, and Next stays live', async () => {
    await load();
    const next = root().getByRole('button', { name: 'Next' });
    await next.click();
    await page.waitForTimeout(150);
    const r = await root().evaluate((w) => {
      const s = w.querySelector('[role="status"]');
      const btn = [...w.querySelectorAll('button')].find((b) => /Next/.test(b.textContent));
      return { text: s?.textContent?.trim() ?? '', glyph: !!s?.querySelector('svg, [data-on], span'), blocked: s?.getAttribute('data-blocked'), open: w.querySelector('li[aria-current="step"] [role="heading"]')?.textContent ?? '', disabled: btn?.disabled || btn?.getAttribute('aria-disabled') === 'true' };
    });
    expect(r.text.length > 0 && r.blocked === 'true', `status "${r.text}", data-blocked ${r.blocked}`);
    expect(r.glyph, 'the blocked line carries a glyph besides the words');
    expect(/General/.test(r.open), `open step "${r.open}"`);
    expect(!r.disabled, 'Next is disabled while blocked (it must stay live)');
    await root().locator('#wiz-name').fill('Kitchen');
    await next.click();
    await page.waitForTimeout(150);
    const after = await root().evaluate((w) => ({ open: w.querySelector('li[aria-current="step"] [role="heading"]')?.textContent ?? '', status: w.querySelector('[role="status"]')?.textContent?.trim() ?? '' }));
    expect(/Configuration/.test(after.open) && after.status === '', `after filling: open "${after.open}", status "${after.status}"`);
    return 'blocked once, then advanced';
  });

  await check('Wizard', 'Back is disabled on the first step and Finish replaces Next on the last', async () => {
    await load();
    const first = await root().evaluate((w) => { const b = [...w.querySelectorAll('button')].find((x) => /Back/.test(x.textContent)); return { disabled: b.disabled, h: b.getBoundingClientRect().height }; });
    expect(first.disabled, 'Back is not disabled on the first step');
    await root().locator('#wiz-name').fill('Kitchen');
    await root().getByRole('button', { name: 'Next' }).click();
    await root().getByRole('button', { name: 'Next' }).click();
    await page.waitForTimeout(150);
    const last = await root().evaluate((w) => {
      const bs = [...w.querySelectorAll('[role="group"] button')];
      return { names: bs.map((b) => b.textContent.trim()), kinds: bs.map((b) => b.getAttribute('data-kind')), hs: bs.map((b) => b.getBoundingClientRect().height), backOff: bs[0].disabled };
    });
    expect(last.names[1] === 'Finish' && last.kinds[1] === 'primary', `last keys ${last.names.join('/')} kinds ${last.kinds.join('/')}`);
    expect(!last.backOff, 'Back is disabled on the last step');
    expect(last.hs.every((h) => h >= 43.5) && first.h >= 43.5, `key heights ${last.hs.join(',')} / ${first.h}`);
    return 'Back off at the start, Finish at the end, keys at least 44px';
  });

  await check('Wizard', 'no part is orange except Finish on the last step', async () => {
    await load();
    const count = () => root().evaluate((w) => {
      const probe = document.createElement('span'); probe.style.color = 'var(--ds-action-accent)'; document.body.append(probe);
      const accent = getComputedStyle(probe).color; probe.remove();
      return [w, ...w.querySelectorAll('*')].filter((n) => { const cs = getComputedStyle(n); return [cs.backgroundColor, cs.color, cs.borderColor].some((c) => c === accent); }).map((n) => n.tagName + ':' + n.textContent.trim().slice(0, 10));
    });
    const early = await count();
    expect(early.length === 0, `orange on step 1: ${early.join(', ')}`);
    await root().locator('#wiz-name').fill('Kitchen');
    await root().getByRole('button', { name: 'Next' }).click();
    await root().getByRole('button', { name: 'Next' }).click();
    await page.waitForTimeout(500);
    const late = await count();
    expect(late.length >= 1 && late.every((x) => x.startsWith('BUTTON') || x.startsWith('SPAN')), `orange parts on the last step: ${late.join(', ')}`);
    return 'orange only on Finish';
  });
}
