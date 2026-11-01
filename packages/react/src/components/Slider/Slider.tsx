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
import styles from './Slider.module.css';

export interface SliderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue' | 'children'> {
  /** The printed name above the fader. It is required, because it is also the slider's accessible name. */
  label: ReactNode;
  /** The lowest value, at the start of the groove. Default 0. */
  min?: number;
  /** The highest value, at the end of the groove. Default 10. */
  max?: number;
  /** The distance between detents. When set, the cap settles into the nearest detent and the ruler prints one tick per detent (up to 20). Leave it out for a fader with no detents. */
  step?: number;
  /** The value when controlled. Pair it with `onValueChange`. */
  value?: number;
  /** The starting value when uncontrolled. Default `min`. */
  defaultValue?: number;
  /** Called with the new value whenever a key, a drag or a click moves the cap to another value. */
  onValueChange?: (value: number) => void;
  /** Print the ruler's numerals under the groove ("audio 1" scale). Default false. */
  scale?: boolean;
  /** Turns a value into the printed and announced text, for example `(v) => v + ' %'`. */
  formatValue?: (value: number) => string;
  /** The distance PageUp and PageDown move. It defaults to a tenth of the range, and at least two detents. */
  pageStep?: number;
  /** The fader cannot be moved; the cap loses its height. */
  disabled?: boolean;
  /** Spring mass of the cap. Default 1.4 (mechanism.mass). */
  mass?: number;
  /** Spring stiffness. Default 520 (mechanism.stiffness). */
  stiffness?: number;
  /** Spring damping. Default 46 (mechanism.damping). */
  damping?: number;
}

const plain = (v: number) => String(Number(v.toFixed(2)));

/** A fader: a plastic cap riding a recessed groove under a printed ruler, released into the nearest detent on the spring. */
export const Slider = forwardRef<HTMLDivElement, SliderProps>(function Slider(
  {
    label,
    min = 0,
    max = 10,
    step,
    value,
    defaultValue,
    onValueChange,
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
  const labelId = useId();
  const range = max - min || 1;
  const controlled = value !== undefined;
  const [inner, setInner] = useState(() => snapTo(defaultValue ?? min, min, max, step));
  const current = snapTo(controlled ? value : inner, min, max, step);
  const latest = useRef(current);
  latest.current = current;
  const frac = (v: number) => (v - min) / range;

  const faderRef = useRef<HTMLDivElement>(null);
  const capRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const mounted = useRef(false);
  const [x0] = useState(() => frac(current));
  const spring = useSpring((x) => capRef.current?.style.setProperty('--x', x.toFixed(4)), { mass, stiffness, damping }, x0);

  useIsoLayoutEffect(() => {
    if (dragging.current) return;
    spring.to(frac(current), !mounted.current);
    mounted.current = true;
  }, [current, min, max]);

  const commit = useCallback(
    (v: number) => {
      const next = snapTo(v, min, max, step);
      if (next === latest.current) return;
      latest.current = next;
      if (!controlled) setInner(next);
      onValueChange?.(next);
    },
    [min, max, step, controlled, onValueChange],
  );

  const count = step ? Math.round(range / step) : 0;
  const arrow = step ?? range / 100;
  const page = pageStep ?? (step ? step * Math.max(2, Math.round(count / 10)) : range / 10);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    const v = latest.current;
    const map: Record<string, number> = {
      ArrowRight: v + arrow, ArrowUp: v + arrow, ArrowLeft: v - arrow, ArrowDown: v - arrow,
      PageUp: v + page, PageDown: v - page, Home: min, End: max,
    };
    if (!(e.key in map)) return;
    e.preventDefault();
    // in right-to-left the groove runs from the right, so left and right swap meaning
    const rtl = faderRef.current && getComputedStyle(faderRef.current).direction === 'rtl';
    const key = rtl && e.key === 'ArrowRight' ? 'ArrowLeft' : rtl && e.key === 'ArrowLeft' ? 'ArrowRight' : e.key;
    commit(map[key]);
  };

  const fractionAt = (clientX: number) => {
    const el = faderRef.current;
    if (!el) return 0;
    const r = el.getBoundingClientRect();
    const cap = capRef.current?.offsetWidth ?? 0;
    let f = (clientX - r.left - cap / 2) / Math.max(1, r.width - cap);
    if (getComputedStyle(el).direction === 'rtl') f = 1 - f;
    return Math.min(1, Math.max(0, f));
  };

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (disabled || e.button !== 0) return;
    const el = e.currentTarget;
    el.setPointerCapture?.(e.pointerId);
    el.focus();
    dragging.current = true;
    // the cap follows the hand at once; the value tracks the nearest detent
    const follow = (clientX: number) => {
      const f = fractionAt(clientX);
      spring.to(f, true);
      commit(min + f * range);
    };
    follow(e.clientX);
    const move = (ev: globalThis.PointerEvent) => follow(ev.clientX);
    const end = () => {
      dragging.current = false;
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', end);
      el.removeEventListener('pointercancel', end);
      // released into the nearest detent, on the spring
      spring.to(frac(latest.current));
    };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', end);
    el.addEventListener('pointercancel', end);
  };

  const divisions = step && count <= 20 ? Math.max(1, count) : 10;
  const ticks = Array.from({ length: divisions + 1 }, (_, i) => i / divisions);
  const every = divisions > 10 ? 2 : 1;
  const text = formatValue(current);

  return (
    <div ref={ref} data-component="Slider" className={cx(styles.root, className)} {...rest}>
      <div className={styles.header}>
        <span id={labelId} className={styles.label}>{label}</span>
        <span className={styles.value} aria-hidden="true">{text}</span>
      </div>
      <div
        ref={faderRef}
        role="slider"
        tabIndex={disabled ? -1 : 0}
        aria-labelledby={labelId}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={current}
        aria-valuetext={text}
        aria-orientation="horizontal"
        aria-disabled={disabled || undefined}
        className={styles.fader}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
      >
        <div className={styles.rule} aria-hidden="true">
          {ticks.map((p, i) => (
            <span key={i} className={cx(styles.tick, (i === 0 || i === divisions || i * 2 === divisions) && styles.major)} style={{ '--p': p } as CSSProperties} />
          ))}
        </div>
        <div className={styles.groove} aria-hidden="true" />
        <div ref={capRef} className={styles.cap} aria-hidden="true" style={{ '--x': x0 } as CSSProperties} />
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
