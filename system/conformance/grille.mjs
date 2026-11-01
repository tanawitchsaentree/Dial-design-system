// Behaviour checks for Grille, run by tooling/kiln/conformance.mjs on the built book. Grille is a
// field of recessed holes that is the meter (P4): it names its value, lights holes in ink, never orange.
export default async function grille({ check, expect, page, go, main }) {
  const all = () => main().locator('[data-component="Grille"]');
  const ms = (s) => Math.max(...String(s).split(',').map((x) => (x.trim().endsWith('ms') ? parseFloat(x) : parseFloat(x) * 1000)));

  await check('Grille', 'every grille is a named meter with its value as text', async () => {
    await go('/components/grille/code');
    const r = await all().evaluateAll((els) => els.map((e) => ({
      role: e.getAttribute('role'), name: e.getAttribute('aria-label'), now: e.getAttribute('aria-valuenow'),
      min: e.getAttribute('aria-valuemin'), max: e.getAttribute('aria-valuemax'), text: e.getAttribute('aria-valuetext'),
    })));
    expect(r.length > 0, 'no Grille on the page');
    const bad = r.filter((x) => x.role !== 'meter' || !x.name || x.now === null || x.min === null || x.max === null || !x.text);
    expect(!bad.length, `bad grilles: ${JSON.stringify(bad.slice(0, 2))}`);
    return `${r.length} meters`;
  });

  await check('Grille', 'lit holes are ink, never the accent, and the pitch sits on the 4px step', async () => {
    await go('/components/grille/code');
    const r = await all().first().evaluate((g) => {
      const probe = (c) => { const d = document.createElement('span'); d.style.color = `var(${c})`; document.body.append(d); const x = getComputedStyle(d).color; d.remove(); return x; };
      const holes = [...g.children];
      const lit = holes.find((h) => h.hasAttribute('data-lit'));
      const a = holes[0].getBoundingClientRect(), b = holes[1].getBoundingClientRect();
      return { lit: lit ? getComputedStyle(lit).backgroundColor : null, ink: probe('--ds-grille-hole-on'), accent: probe('--ds-action-accent'), pitch: Math.round(Math.abs(b.left - a.left) * 100) / 100 };
    });
    expect(r.lit && r.lit === r.ink && r.lit !== r.accent, `lit ${r.lit}, ink ${r.ink}, accent ${r.accent}`);
    expect(r.pitch > 0 && r.pitch % 4 === 0, `pitch ${r.pitch}px`);
    return `pitch ${r.pitch}px, lit ${r.lit}`;
  });

  await check('Grille', 'Tab never lands on a grille', async () => {
    await go('/components/grille/code');
    const n = await all().evaluateAll((els) => els.filter((e) => e.tabIndex >= 0).length);
    expect(n === 0, `${n} focusable grilles`);
    return 'not focusable';
  });

  await check('Grille', 'holes fill within motion.fill, and at once under reduce motion', async () => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await go('/components/grille/code');
    const on = await all().first().locator('span').first().evaluate((h) => getComputedStyle(h).transitionDuration);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await go('/components/grille/code');
    const off = await all().first().locator('span').first().evaluate((h) => getComputedStyle(h).transitionDuration);
    expect(ms(on) > 0 && ms(on) <= 120, `fill ${on}`);
    expect(ms(off) === 0, `reduce motion ${off}`);
    return `fill ${on}, reduce ${off}`;
  });
}
