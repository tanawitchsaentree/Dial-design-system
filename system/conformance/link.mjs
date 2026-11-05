// Behaviour checks for Link (ink words, one rule, external mark), run by tooling/kiln/conformance.mjs.
export default async function link({ check, expect, go, main, page }) {
  await check('Link', 'every link is a real anchor with an href, and the rule under it is drawn without colour', async () => {
    await go('/components/link/code');
    const r = await main().locator('a[data-component="Link"]').evaluateAll((els) => els.map((a) => {
      const cs = getComputedStyle(a);
      return { href: a.getAttribute('href'), rule: cs.textDecorationLine, thick: parseFloat(cs.textDecorationThickness) };
    }));
    expect(r.length >= 3, `${r.length} links on the subject`);
    expect(r.every((x) => x.href), 'a link has no href');
    expect(r.every((x) => x.rule.includes('underline') && x.thick > 0), `rules: ${r.map((x) => `${x.rule} ${x.thick}`).join(', ')}`);
    return `${r.length} anchors, each with an underline`;
  });
  await check('Link', 'hovering a link thickens its rule and nothing moves', async () => {
    await go('/components/link/code');
    const a = main().locator('a[data-component="Link"]').first();
    await a.scrollIntoViewIfNeeded();
    const before = await a.evaluate((el) => ({ t: parseFloat(getComputedStyle(el).textDecorationThickness), r: el.getBoundingClientRect().toJSON() }));
    await a.hover();
    await page.waitForTimeout(400);
    const after = await a.evaluate((el) => ({ t: parseFloat(getComputedStyle(el).textDecorationThickness), r: el.getBoundingClientRect().toJSON() }));
    expect(after.t > before.t, `rule ${before.t}px at rest, ${after.t}px on hover`);
    expect(Math.abs(after.r.x - before.r.x) < 0.5 && Math.abs(after.r.y - before.r.y) < 0.5 && Math.abs(after.r.height - before.r.height) < 0.5, 'the link moved or changed size on hover');
    return `rule ${before.t}px to ${after.t}px, box unchanged`;
  });
  await check('Link', 'a standalone link is at least the touch target', async () => {
    await go('/components/link/code');
    const r = await main().locator('a[data-component="Link"]').evaluateAll((els) => els.filter((a) => /flex/.test(getComputedStyle(a).display)).map((a) => ({ w: a.getBoundingClientRect().width, h: a.getBoundingClientRect().height })));
    expect(r.length > 0, 'the subject has no standalone link');
    expect(r.every((x) => x.h >= 43.5 && x.w >= 43.5), `standalone links ${r.map((x) => `${x.w}×${x.h}`).join(', ')}`);
    return `${r.length} standalone links at 44px or more`;
  });
  await check('Link', 'an external link opens a new tab safely and its mark is named', async () => {
    await go('/components/link/code');
    const r = await main().locator('a[data-component="Link"]').evaluateAll((els) => els.filter((a) => a.querySelector('svg')).map((a) => {
      const svg = a.querySelector('svg');
      return { target: a.getAttribute('target'), rel: a.getAttribute('rel') || '', role: svg.getAttribute('role'), name: svg.getAttribute('aria-label') };
    }));
    expect(r.length > 0, 'the subject has no external link');
    expect(r.every((x) => x.target === '_blank' && /noopener/.test(x.rel) && /noreferrer/.test(x.rel)), `targets: ${JSON.stringify(r)}`);
    expect(r.every((x) => x.role === 'img' && !!x.name), 'the mark has no name');
    return `${r.length} external links, mark named`;
  });
  await check('Link', 'keyboard focus draws a ring on the link', async () => {
    await go('/components/link/code');
    const a = main().locator('a[data-component="Link"]').first();
    await a.focus();
    await page.keyboard.press('Shift+Tab');
    await page.keyboard.press('Tab');
    const r = await a.evaluate((el) => ({ focused: document.activeElement === el, style: getComputedStyle(el).outlineStyle, w: parseFloat(getComputedStyle(el).outlineWidth) }));
    expect(r.focused && r.style !== 'none' && r.w > 0, `focused ${r.focused}, outline ${r.style} ${r.w}px`);
    return `outline ${r.w}px`;
  });
  await check('Link', 'no part of a link is the accent orange', async () => {
    await go('/components/link/code');
    const bad = await main().locator('a[data-component="Link"]').evaluateAll((els) => {
      const probe = document.createElement('span'); probe.style.color = 'var(--ds-action-accent)'; document.body.append(probe);
      const accent = getComputedStyle(probe).color; probe.remove();
      const out = []; for (const el of els) for (const n of [el, ...el.querySelectorAll('*')]) { const cs = getComputedStyle(n); if (accent && [cs.backgroundColor, cs.color, cs.borderColor, cs.textDecorationColor].some((c) => c === accent)) out.push(n.tagName); }
      return out;
    });
    expect(bad.length === 0, `${bad.length} orange parts`);
    return 'no orange';
  });
}
