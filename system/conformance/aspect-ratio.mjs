// Behaviour checks for AspectRatio (a frame that keeps its child at a ratio), run by tooling/kiln/conformance.mjs.
export default async function aspectRatio({ check, expect, go, main }) {
  const frames = () => main().locator('[data-component="AspectRatio"]');
  await check('AspectRatio', 'each frame measures the ratio it was given', async () => {
    await go('/components/aspect-ratio/code');
    const r = await frames().evaluateAll((els) => els.map((el) => { const b = el.getBoundingClientRect(); return { ratio: el.getAttribute('data-ratio'), w: b.width, h: b.height }; }));
    expect(r.length >= 2, `${r.length} frames`);
    for (const x of r) {
      const [a, b] = x.ratio.split('/').map(Number);
      expect(x.w > 0 && Math.abs(x.w / x.h - a / b) < 0.02, `${x.ratio} measured ${x.w}×${x.h}`);
    }
    return r.map((x) => `${x.ratio} → ${x.w.toFixed(0)}×${x.h.toFixed(0)}`).join(', ');
  });
  await check('AspectRatio', 'the child fills the whole frame', async () => {
    await go('/components/aspect-ratio/code');
    const r = await frames().evaluateAll((els) => els.map((el) => { const f = el.getBoundingClientRect(); const c = el.firstElementChild.getBoundingClientRect(); return { dw: Math.abs(f.width - c.width), dh: Math.abs(f.height - c.height), has: !!el.firstElementChild }; }));
    expect(r.length >= 2 && r.every((x) => x.has && x.dw < 1 && x.dh < 1), `gaps ${r.map((x) => `${x.dw.toFixed(1)}/${x.dh.toFixed(1)}`).join(', ')}`);
    return 'child equals frame in every instance';
  });
  await check('AspectRatio', 'only the rounded frame takes the media corner, and the plain one stays square', async () => {
    await go('/components/aspect-ratio/code');
    const r = await frames().evaluateAll((els) => els.map((el) => parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0));
    expect(r.length >= 2 && r.some((x) => x === 0) && r.some((x) => x > 0), `radii ${r.join(', ')}`);
    return `radii ${r.join(', ')}`;
  });
  await check('AspectRatio', 'no part of the frame is the accent orange', async () => {
    await go('/components/aspect-ratio/code');
    const bad = await frames().evaluateAll((els) => {
      const probe = document.createElement('span'); probe.style.color = 'var(--ds-action-accent)'; document.body.append(probe);
      const accent = getComputedStyle(probe).color; probe.remove();
      const out = []; for (const el of els) for (const n of [el, ...el.querySelectorAll('*')]) { const cs = getComputedStyle(n); if (accent && [cs.backgroundColor, cs.color, cs.borderColor].some((c) => c === accent)) out.push(n.tagName); }
      return out;
    });
    expect(bad.length === 0, `${bad.length} orange parts`);
    return 'no orange';
  });
}
