import {
  forwardRef,
  useCallback,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from 'react';
import { cx } from '../../cx';
import { MECHANISM, snapTo, useIsoLayoutEffect, useSpring } from '../../spring';
import styles from './RangeSlider.module.css';

/** A low and a high value, low first. */
export type RangeValue = [number, number];

export interface RangeSliderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue' | 'children'> {
  /** The printed name above the fader. It is required, because it names both caps. */
  label: ReactNode;
  /** The lowest value, at the start of the groove. Default 0. */
  min?: number;
  /** The highest value, at the end of the groove. Default 10. */
  max?: number;
  /** The distance between detents. Each cap settles into the nearest detent and the ruler prints one tick per detent (up to 20). */
  step?: number;
  /** The smallest distance the two caps keep between them. Default 0, so both caps may stand on the same value. */
  minGap?: number;
  /** The low and high values when controlled. Pair it with `onValueChange`. */
  value?: RangeValue;
  /** The starting values when uncontrolled. Defaults to the two ends. */
  defaultValue?: RangeValue;
  /** Called with both values whenever a key, a drag or a press moves one cap to another value. */
  onValueChange?: (value: RangeValue) => void;
  /** The announced name of the low cap, after the label. Default "Low". */
  lowLabel?: string;
  /** The announced name of the high cap, after the label. Default "High". */
  highLabel?: string;
  /** Print the ruler's numerals under the groove. Default false. */
  scale?: boolean;
  /** Turns a value into the printed and announced text, for example `(v) => v + ' °C'`. */
  formatValue?: (value: number) => string;
  /** The distance PageUp and PageDown move. It defaults to a tenth of the range, and at least two detents. */
  pageStep?: number;
  /** The fader cannot be moved; both caps lose their height. */
  disabled?: boolean;
  /** Spring mass of each cap. Default 1.4 (mechanism.mass). */
  mass?: number;
  /** Spring stiffness. Default 520 (mechanism.stiffness). */
  stiffness?: number;
  /** Spring damping. Default 46 (mechanism.damping). */
  damping?: number;
}

const plain = (v: number) => String(Number(v.toFixed(2)));

/** Two plastic caps in one ruler groove, setting a low and a high end. The caps stop at each other and never cross. */
export const RangeSlider = forwardRef<HTMLDivElement, RangeSliderProps>(function RangeSlider(
  {
    label,
    min = 0,
    max = 10,
    step,
    minGap = 0,
    value,
    defaultValue,
    onValueChange,
    lowLabel = 'Low',
    highLabel = 'High',
    scale = false,
    formatValue = plain,
    pageStep,
    disabled = false,
    mass = MECHANISM.mass,
    stiffness = MECHANISM.stiffness,
    damping = MECHANISM.damping,
    className,
    ...rest
  },
  ref,
) {
  const id = useId();
  const labelId = `${id}-label`;
  const range = max - min || 1;
  const gap = Math.max(0, Math.min(minGap, range));
  const controlled = value !== undefined;
  const order = (v: RangeValue): RangeValue => {
    const lo = snapTo(Math.min(v[0], v[1]), min, max, step);
    const hi = snapTo(Math.max(v[0], v[1]), min, max, step);
    return [Math.min(lo, max - gap), Math.max(hi, Math.min(max, lo + gap))];
  };
  const [inner, setInner] = useState<RangeValue>(() => order(defaultValue ?? [min, max]));
  const current = order(controlled ? value : inner);
  const latest = useRef(current);
  latest.current = current;
  const frac = (v: number) => (v - min) / range;

  const faderRef = useRef<HTMLDivElement>(null);
  const thumbs = [useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null)];
  const dragging = useRef<0 | 1 | null>(null);
  const mounted = useRef(false);
  const [x0] = useState(() => [frac(current[0]), frac(current[1])]);
  const springOf = (k: 0 | 1) => (x: number) => thumbs[k].current?.style.setProperty('--x', x.toFixed(4));
  const low = useSpring(springOf(0), { mass, stiffness, damping }, x0[0]);
  const high = useSpring(springOf(1), { mass, stiffness, damping }, x0[1]);
  const springs = [low, high];

  useIsoLayoutEffect(() => {
    ([0, 1] as const).forEach((k) => { if (dragging.current !== k) springs[k].to(frac(current[k]), !mounted.current); });
    mounted.current = true;
  }, [current[0], current[1], min, max]);

  const commit = useCallback(
    (k: 0 | 1, v: number) => {
      const [lo, hi] = latest.current;
      // each cap stops at the other one, so they never cross
      const bound = k === 0 ? [min, hi - gap] : [lo + gap, max];
      const next = Math.min(bound[1], Math.max(bound[0], snapTo(v, min, max, step)));
      if (next === latest.current[k]) return;
      const pair: RangeValue = k === 0 ? [next, hi] : [lo, next];
      latest.current = pair;
      if (!controlled) setInner(pair);
      onValueChange?.(pair);
    },
    [min, max, step, gap, controlled, onValueChange],
  );

  const count = step ? Math.round(range / step) : 0;
  const arrow = step ?? range / 100;
  const page = pageStep ?? (step ? step * Math.max(2, Math.round(count / 10)) : range / 10);

  const keyFor = (k: 0 | 1) => (e: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    const v = latest.current[k];
    const map: Record<string, number> = {
      ArrowRight: v + arrow, ArrowUp: v + arrow, ArrowLeft: v - arrow, ArrowDown: v - arrow,
      PageUp: v + page, PageDown: v - page, Home: min, End: max,
    };
    if (!(e.key in map)) return;
    e.preventDefault();
    // in right-to-left the groove runs from the right, so left and right swap meaning
    const rtl = faderRef.current && getComputedStyle(faderRef.current).direction === 'rtl';
    const key = rtl && e.key === 'ArrowRight' ? 'ArrowLeft' : rtl && e.key === 'ArrowLeft' ? 'ArrowRight' : e.key;
    commit(k, map[key]);
  };

  const fractionAt = (clientX: number) => {
    const el = faderRef.current;
    if (!el) return 0;
    const r = el.getBoundingClientRect();
    const capEl = thumbs[0].current?.lastElementChild;
    const cap = capEl instanceof HTMLElement ? capEl.offsetWidth : 0;
    let f = (clientX - r.left - cap / 2) / Math.max(1, r.width - cap);
    if (getComputedStyle(el).direction === 'rtl') f = 1 - f;
    return Math.min(1, Math.max(0, f));
  };

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (disabled || e.button !== 0) return;
    const el = e.currentTarget;
    const f0 = fractionAt(e.clientX);
    const v0 = min + f0 * range;
    const [lo, hi] = latest.current;
    // the nearer cap comes; when both stand on one value, the side of the press decides
    const k: 0 | 1 = lo === hi ? (v0 > hi ? 1 : 0) : Math.abs(v0 - lo) <= Math.abs(v0 - hi) ? 0 : 1;
    el.setPointerCapture?.(e.pointerId);
    e.preventDefault();
    thumbs[k].current?.focus();
    dragging.current = k;
    // the cap follows the hand at once, stopped by the other cap; the value tracks the nearest detent
    const follow = (clientX: number) => {
      const f = fractionAt(clientX);
      const other = frac(latest.current[k === 0 ? 1 : 0]);
      const g = gap / range;
      springs[k].to(k === 0 ? Math.min(f, other - g) : Math.max(f, other + g), true);
      commit(k, min + f * range);
    };
    follow(e.clientX);
    const move = (ev: globalThis.PointerEvent) => follow(ev.clientX);
    const end = () => {
      dragging.current = null;
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', end);
      el.removeEventListener('pointercancel', end);
      // released into the nearest detent, on the spring
      springs[k].to(frac(latest.current[k]));
    };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', end);
    el.addEventListener('pointercancel', end);
  };

  const divisions = step && count <= 20 ? Math.max(1, count) : 10;
  const ticks = Array.from({ length: divisions + 1 }, (_, i) => i / divisions);
  const every = divisions > 10 ? 2 : 1;
  const [fLo, fHi] = [frac(current[0]), frac(current[1])];
  const texts = [formatValue(current[0]), formatValue(current[1])];
  const names = [lowLabel, highLabel];

  return (
    <div ref={ref} role="group" aria-labelledby={labelId} data-component="RangeSlider" className={cx(styles.root, className)} {...rest}>
      <div className={styles.header}>
        <span id={labelId} className={styles.label}>{label}</span>
        <span className={styles.value} aria-hidden="true">{texts[0]}–{texts[1]}</span>
      </div>
      <div ref={faderRef} aria-disabled={disabled || undefined} className={styles.fader} onPointerDown={onPointerDown}>
        <div className={styles.rule} aria-hidden="true">
          {ticks.map((p, i) => (
            <span
              key={i}
              className={cx(styles.tick, (i === 0 || i === divisions || i * 2 === divisions) && styles.major, p >= fLo - 1e-6 && p <= fHi + 1e-6 && styles.inside)}
              style={{ '--p': p } as CSSProperties}
            />
          ))}
        </div>
        <div className={styles.groove} aria-hidden="true" />
        {([0, 1] as const).map((k) => (
          <div
            key={k}
            ref={thumbs[k]}
            role="slider"
            tabIndex={disabled ? -1 : 0}
            aria-labelledby={`${labelId} ${id}-name-${k}`}
            aria-valuemin={k === 0 ? min : current[0] + gap}
            aria-valuemax={k === 0 ? current[1] - gap : max}
            aria-valuenow={current[k]}
            aria-valuetext={texts[k]}
            aria-orientation="horizontal"
            aria-disabled={disabled || undefined}
            data-thumb={k === 0 ? 'low' : 'high'}
            className={styles.thumb}
            style={{ '--x': x0[k] } as CSSProperties}
            onKeyDown={keyFor(k)}
          >
            <span id={`${id}-name-${k}`} hidden>{names[k]}</span>
            <div className={styles.cap} aria-hidden="true" />
          </div>
        ))}
      </div>
      {scale && (
        <div className={styles.scale} aria-hidden="true">
          {ticks.map((p, i) =>
            i % every === 0 || i === divisions ? (
              <span key={i} className={styles.numeral} style={{ '--p': p } as CSSProperties}>
                {plain(min + p * range)}
              </span>
            ) : null,
          )}
        </div>
      )}
    </div>
  );
});
