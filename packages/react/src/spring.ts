// The material's spring for dial's mechanisms (FORM.md, D-003): a damped mass driven by
// requestAnimationFrame. Used by the fader (Slider) and the rotary (Rotary). The defaults match the
// tokens mechanism.mass / mechanism.stiffness / mechanism.damping (1.4 / 520 / 46, ζ ≈ 0.85,
// settle ≈ 245ms). Under prefers-reduced-motion every move lands at once.
import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';

export interface SpringConfig {
  /** Mass of the moving part; mechanism.mass. */
  mass: number;
  /** Spring stiffness; mechanism.stiffness. */
  stiffness: number;
  /** Damping; mechanism.damping. */
  damping: number;
}

/** mechanism.* token values, for components that take the spring as props. */
export const MECHANISM: SpringConfig = { mass: 1.4, stiffness: 520, damping: 46 };

/** useLayoutEffect in the browser, useEffect on the server (no warning during SSR). */
export const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export interface Spring {
  /** Move toward `target`. `snap` (or reduced motion) lands at once, with no travel. */
  to: (target: number, snap?: boolean) => void;
  /** The current position. */
  readonly value: number;
}

/**
 * A spring that writes its position through `apply` on every frame, outside React rendering.
 * `epsilon` is the distance and speed under which the part counts as settled.
 */
export function useSpring(apply: (x: number) => void, config: SpringConfig, initial: number, epsilon = 1e-4): Spring {
  const st = useRef({ x: initial, v: 0, target: initial, raf: 0, last: 0 });
  const applyRef = useRef(apply);
  const cfgRef = useRef(config);
  applyRef.current = apply;
  cfgRef.current = config;
  useEffect(() => () => { if (st.current.raf) cancelAnimationFrame(st.current.raf); }, []);
  return useMemo<Spring>(() => {
    const s = st.current;
    const frame = (t: number) => {
      const { mass, stiffness, damping } = cfgRef.current;
      const dt = Math.min(0.032, s.last ? (t - s.last) / 1000 : 1 / 120);
      s.last = t;
      const n = Math.max(1, Math.ceil(dt * 240));
      const h = dt / n;
      for (let i = 0; i < n; i++) {
        const a = (-stiffness * (s.x - s.target) - damping * s.v) / mass;
        s.v += a * h;
        s.x += s.v * h;
      }
      if (Math.abs(s.x - s.target) < epsilon && Math.abs(s.v) < epsilon * 10) {
        s.x = s.target; s.v = 0; s.raf = 0; s.last = 0;
        applyRef.current(s.x);
        return;
      }
      applyRef.current(s.x);
      s.raf = requestAnimationFrame(frame);
    };
    return {
      to(target: number, snap = false) {
        s.target = target;
        if (snap || prefersReducedMotion() || typeof requestAnimationFrame === 'undefined') {
          if (s.raf) cancelAnimationFrame(s.raf);
          s.raf = 0; s.last = 0; s.x = target; s.v = 0;
          applyRef.current(target);
          return;
        }
        if (!s.raf) s.raf = requestAnimationFrame(frame);
      },
      get value() { return s.x; },
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

/** Clamp `v` to [min, max] and round it to the nearest step from `min` (no float dust). */
export function snapTo(v: number, min: number, max: number, step?: number): number {
  const c = Math.min(max, Math.max(min, v));
  if (!step || step <= 0) return c;
  const s = Math.round((c - min) / step) * step + min;
  const decimals = (String(step).split('.')[1] ?? '').length;
  return Math.min(max, Number(s.toFixed(decimals + 2)));
}
