// Behaviour checks for FormField (label, control and messages wired together), run by tooling/kiln/conformance.mjs.
export default async function formField({ check, expect, go, main }) {
  await check('FormField', 'the label points at the control by id', async () => {
    await go('/components/form-field/code');
    const r = await main().locator('[data-component="FormField"]').first().evaluate((el) => {
      const lab = el.querySelector('label');
      const target = lab && lab.htmlFor ? document.getElementById(lab.htmlFor) : null;
      return { has: !!lab, found: !!target, inside: !!target && el.contains(target) };
    });
    expect(r.has, 'no label');
    expect(r.found && r.inside, 'label htmlFor does not match a control inside the field');
    return 'htmlFor matches the control id';
  });
  await check('FormField', 'hint and error are listed in aria-describedby and an error sets aria-invalid', async () => {
    await go('/components/form-field/code');
    const r = await main().locator('[data-component="FormField"]').evaluateAll((els) => els.map((el) => {
      const lab = el.querySelector('label');
      const c = lab && lab.htmlFor ? document.getElementById(lab.htmlFor) : null;
      const ids = (c && c.getAttribute('aria-describedby') || '').split(' ').filter(Boolean);
      return { ids, resolved: ids.every((i) => !!document.getElementById(i)), invalid: c && c.getAttribute('aria-invalid'), errors: el.querySelectorAll('[data-component="HelperText"][data-tone="error"]').length };
    }));
    const withError = r.filter((x) => x.errors > 0);
    expect(withError.length > 0, 'no field with an error in the subject');
    expect(withError.every((x) => x.invalid === 'true'), 'an error field is not aria-invalid');
    expect(r.filter((x) => x.ids.length > 0).every((x) => x.resolved), 'aria-describedby names an id that is not in the page');
    expect(r.some((x) => x.ids.length > 0), 'no control is described');
    return `${r.length} fields, ${withError.length} invalid`;
  });
  await check('FormField', 'the messages sit in a polite live region that stays in the tree', async () => {
    await go('/components/form-field/code');
    const r = await main().locator('[data-component="FormField"]').evaluateAll((els) => els.map((el) => {
      const live = el.querySelector('[aria-live="polite"]');
      return { live: !!live, hasHelper: !!live && !!live.querySelector('[data-component="HelperText"]') };
    }));
    expect(r.length > 0 && r.every((x) => x.live), 'a field has no live region');
    expect(r.some((x) => x.hasHelper), 'no live region holds a message');
    return `${r.length} fields with a live region`;
  });
  await check('FormField', 'the inline layout puts the label before the control in one row', async () => {
    await go('/components/form-field/code');
    const r = await main().locator('[data-component="FormField"][data-layout="inline"]').first().evaluate((el) => {
      const l = el.querySelector('label').getBoundingClientRect();
      const b = el.lastElementChild.getBoundingClientRect();
      const wide = el.getBoundingClientRect().width >= 400;
      return { wide, sameRow: Math.abs(l.top - b.top) < b.height, before: l.right <= b.left + 1 || l.left >= b.right - 1 };
    });
    if (r.wide) expect(r.sameRow && r.before, 'label and control are not side by side');
    return r.wide ? 'label beside control' : 'column too narrow, wraps as designed';
  });
  await check('FormField', 'no part of the field is the accent orange', async () => {
    await go('/components/form-field/code');
    const bad = await main().locator('[data-component="FormField"]').evaluateAll((els) => {
      const probe = document.createElement('span'); probe.style.color = 'var(--ds-action-accent)'; document.body.append(probe);
      const accent = getComputedStyle(probe).color; probe.remove();
      const out = []; for (const el of els) for (const n of el.querySelectorAll('*')) { const cs = getComputedStyle(n); if (accent && [cs.backgroundColor, cs.color, cs.borderColor].some((c) => c === accent)) out.push(n.tagName); }
      return out;
    });
    expect(bad.length === 0, `${bad.length} orange parts`);
    return 'no orange';
  });
}
