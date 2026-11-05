// Behaviour checks for Progress, run by tooling/kiln/conformance.mjs on the built book. Progress is a
// recessed groove that fills with a resin rod (P4, R-005); its indeterminate form is a still row of ticks (P6).
export default async function progress({ check, expect, page, go, main }) {
  const all = () => main().locator('[data-component="Progress"]');
  const DET = '[data-component="Progress"][data-state="determinate"]';
  const ms = (s) => Math.max(...String(s).split(',').map((x) => (x.trim().endsWith('ms') ? parseFloat(x) : parseFloat(x) * 1000)));

  await check('Progress', 'every progress bar is named and says its reading as text', async () => {
    await go('/components/progress/code');
    const r = await all().evaluateAll((els) => els.map((e) => ({
      role: e.getAttribute('role'), name: (document.getElementById(e.getAttribute('aria-labelledby') ?? '')?.textContent ?? '').trim(),
      state: e.dataset.state, now: e.getAttribute('aria-valuenow'), min: e.getAttribute('aria-valuemin'), max: e.getAttribute('aria-valuemax'), text: e.getAttribute('aria-valuetext'),
    })));
    expect(r.length > 0, 'no Progress on the page');
    const bad = r.filter((x) => x.role !== 'progressbar' || !x.name || !x.text || (x.state === 'determinate' ? x.now === null || x.min === null || x.max === null : x.now !== null));
    expect(!bad.length, `bad: ${JSON.stringify(bad.slice(0, 2))}`);
    return `${r.length} progress bars, ${r.filter((x) => x.state === 'indeterminate').length} indeterminate`;
  });

  await check('Progress', 'the indeterminate form stays still', async () => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await go('/components/progress/code');
    const r = await all().evaluateAll((els) => {
      const ind = els.filter((e) => e.dataset.state === 'indeterminate');
      const running = document.getAnimations().filter((a) => ind.some((e) => e.contains(a.effect?.target ?? null))).length;
      const named = ind.flatMap((e) => [...e.querySelectorAll('*')]).filter((n) => getComputedStyle(n).animationName !== 'none').length;
      return { n: ind.length, running, named };
    });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    expect(r.n > 0, 'no indeterminate Progress on the page');
    expect(r.running === 0 && r.named === 0, `${r.running} running animations, ${r.named} animated parts`);
    return `${r.n} indeterminate, nothing moves`;
  });

  await check('Progress', 'the fill is never the accent', async () => {
    await go('/components/progress/code');
    const r = await main().locator(DET).first().evaluate((e) => {
      const probe = (c) => { const d = document.createElement('span'); d.style.color = `var(${c})`; document.body.append(d); const x = getComputedStyle(d).color; d.remove(); return x; };
      const fill = e.children[1]?.firstElementChild;
      return { fill: fill ? getComputedStyle(fill).backgroundColor : null, accent: probe('--ds-action-accent') };
    });
    expect(r.fill && r.fill !== r.accent, `fill ${r.fill}, accent ${r.accent}`);
    return `fill ${r.fill}`;
  });

  await check('Progress', 'the fill grows within motion.fill, and at once under reduce motion', async () => {
    const dur = async () => {
      await go('/components/progress/code');
      return main().locator(DET).first().evaluate((e) => getComputedStyle(e.children[1].firstElementChild).transitionDuration);
    };
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    const on = await dur();
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const off = await dur();
    expect(ms(on) > 0 && ms(on) <= 120, `fill ${on}`);
    expect(ms(off) === 0, `reduce motion ${off}`);
    return `fill ${on}, reduce ${off}`;
  });

  await check('Progress', 'Tab never lands on a progress bar', async () => {
    await go('/components/progress/code');
    const n = await all().evaluateAll((els) => els.filter((e) => e.tabIndex >= 0).length);
    expect(n === 0, `${n} focusable progress bars`);
    return 'not focusable';
  });

  // R-005 (2026-11-02): "สีมันดู digital เกินไป … สีมันแข็ง" — a level is a resin rod in the groove, not screen ink
  await check('Progress', 'the fill is the resin tone lit on its upper edge, never the screen ink, and 3:1 off its groove', async () => {
    for (const theme of ['light', 'dark']) {
      await go(`/components/progress/code?theme=${theme}`);
      const r = await main().locator(DET).first().evaluate((e) => {
        const fill = e.querySelector('[class*="fill"]'); const groove = fill?.parentElement;
        const probe = (v) => { const d = document.createElement('i'); d.style.color = `var(${v})`; e.appendChild(d); const c = getComputedStyle(d).color; d.remove(); return c; };
        const lum = (c) => { const [r, g, b] = c.match(/[\d.]+/g).slice(0, 3).map(Number).map((x) => { x /= 255; return x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4; }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
        const f = getComputedStyle(fill).backgroundColor, g = getComputedStyle(groove).backgroundColor;
        const [a, b] = [lum(f), lum(g)].sort((x, y) => y - x);
        return { fill: f, ring: probe('--ds-line-ring'), ink: probe('--ds-grille-hole-on'), lit: getComputedStyle(fill).boxShadow.includes('inset'), ratio: (a + 0.05) / (b + 0.05) };
      });
      expect(r.fill === r.ring && r.fill !== r.ink, `${theme}: fill ${r.fill} (ring ${r.ring}, ink ${r.ink})`);
      expect(r.lit, `${theme}: no lit upper edge on the fill`);
      expect(r.ratio >= 3, `${theme}: fill ${r.ratio.toFixed(2)}:1 off the groove`);
    }
    return 'resin fill, lit, ≥3:1 in both themes';
  });
}
