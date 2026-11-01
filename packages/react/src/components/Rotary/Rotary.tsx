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
import styles from './Rotary.module.css';

export type RotaryKind = 'primary' | 'key';
export type RotarySize = 'sm' | 'md' | 'lg';

/** Knob diameters in px: sm is the 44px touch minimum, lg is corner.knob-ratio (0.36) of a 300px unit. */
const DIAMETER: Record<RotarySize, number> = { sm: 44, md: 72, lg: 108 };
/** The smallest knob dial draws (control.knob-min). */
const MIN_DIAMETER = 44;

export interface RotaryProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue' | 'children'> {
  /** The printed name under the knob. It is required, because it is also the knob's accessible name. */
  label: ReactNode;
  /** `primary` (default) is the unit's one orange knob; use it once per unit. `key` is a body-coloured knob for secondary dials. */
  kind?: RotaryKind;
  /** `sm` is 44px, `md` (default) 72px, `lg` 108px across. Ignored when `diameter` or `unitSide` is set. */
  size?: RotarySize;
  /** The knob's diameter in px, at least 44. Overrides `size` and `unitSide`. */
  diameter?: number;
  /** The short side of the unit the knob sits on, in px. The diameter becomes `knobRatio` × this, which is 0.36 in anchor A. */
  unitSide?: number;
  /** The share of the unit's short side the knob takes when `unitSide` is set. Default 0.36 (corner.knob-ratio). */
  knobRatio?: number;
  /** The lowest value, at the start of the sweep. Default 0. */
  min?: number;
  /** The highest value, at the end of the sweep. Default 10. */
  max?: number;
  /** The distance between detents. Default 1, so 0 to 10 gives the 11 detents of mechanism.detents. */
  step?: number;
  /** The value when controlled. Pair it with `onValueChange`. */
  value?: number;
  /** The starting value when uncontrolled. Default `min`. */
  defaultValue?: number;
  /** Called with the new value whenever a key or a drag turns the knob to another detent. */
  onValueChange?: (value: number) => void;
  /** Turns a value into the printed and announced text, for example `(v) => v + ' °C'`. */
  formatValue?: (value: number) => string;
  /** The distance PageUp and PageDown turn. It defaults to a tenth of the range, and at least two detents. */
  pageStep?: number;
  /** The angle from the first detent to the last, in degrees. Default 270 (mechanism.sweep). */
  sweep?: number;
  /** How far, in px, a vertical drag goes to turn through the whole sweep. Default 180. */
  dragDistance?: number;
  /** The knob cannot be turned; it loses its height. */
  disabled?: boolean;
  /** Spring mass of the knob. Default 1.4 (mechanism.mass). */
  mass?: number;
  /** Spring stiffness. Default 520 (mechanism.stiffness). */
  stiffness?: number;
  /** Spring damping. Default 46 (mechanism.damping). */
  damping?: number;
}

const plain = (v: number) => String(Number(v.toFixed(2)));

/** The knob: a disc with one index mark over a ring of detent ticks, turned by drag or keys and settled on the spring. */
export const Rotary = forwardRef<HTMLDivElement, RotaryProps>(function Rotary(
  {
    label,
    kind = 'primary',
    size = 'md',
    diameter,
    unitSide,
    knobRatio = 0.36,
    min = 0,
    max = 10,
    step = 1,
    value,
    defaultValue,
    onValueChange,
    formatValue = plain,
    pageStep,
    sweep = 270,
    dragDistance = 180,
    disabled = false,
    mass = MECHANISM.mass,
    stiffness = MECHANISM.stiffness,
    damping = MECHANISM.damping,
    className,
    style,
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
  const angle = (v: number) => -sweep / 2 + ((v - min) / range) * sweep;

  const faceRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const mounted = useRef(false);
  const [deg0] = useState(() => angle(current));
  const spring = useSpring((d) => faceRef.current?.style.setProperty('--deg', d.toFixed(2)), { mass, stiffness, damping }, deg0, 0.01);

  useIsoLayoutEffect(() => {
    if (dragging.current) return;
    spring.to(angle(current), !mounted.current);
    mounted.current = true;
  }, [current, min, max, sweep]);

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

  const count = Math.max(1, Math.round(range / step));
  const page = pageStep ?? step * Math.max(2, Math.round(count / 10));

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    const v = latest.current;
    const map: Record<string, number> = {
      ArrowRight: v + step, ArrowUp: v + step, ArrowLeft: v - step, ArrowDown: v - step,
      PageUp: v + page, PageDown: v - page, Home: min, End: max,
    };
    if (!(e.key in map)) return;
    e.preventDefault();
    commit(map[e.key]);
  };

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (disabled || e.button !== 0) return;
    const el = e.currentTarget;
    el.setPointerCapture?.(e.pointerId);
    el.focus();
    dragging.current = true;
    const y0 = e.clientY;
    const d0 = spring.value;
    // up turns clockwise; the face follows the hand at once and the value tracks the nearest detent
    const move = (ev: globalThis.PointerEvent) => {
      const d = Math.min(sweep / 2, Math.max(-sweep / 2, d0 + ((y0 - ev.clientY) / dragDistance) * sweep));
      spring.to(d, true);
      commit(min + ((d + sweep / 2) / sweep) * range);
    };
    const end = () => {
      dragging.current = false;
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', end);
      el.removeEventListener('pointercancel', end);
      // released into the nearest detent, on the spring
      spring.to(angle(latest.current));
    };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', end);
    el.addEventListener('pointercancel', end);
  };

  // a press on the tick ring turns the knob straight to that detent: the no-drag way to set it
  const onRingDown = (e: PointerEvent<HTMLDivElement>) => {
    const knob = knobRef.current;
    if (disabled || e.button !== 0 || !knob || knob.contains(e.target as Node)) return;
    const r = knob.getBoundingClientRect();
    const a = (Math.atan2(e.clientX - (r.left + r.width / 2), r.top + r.height / 2 - e.clientY) * 180) / Math.PI;
    if (Math.abs(a) > sweep / 2 + sweep / count / 2) return;
    e.preventDefault();
    knob.focus();
    commit(min + ((Math.max(-sweep / 2, Math.min(sweep / 2, a)) + sweep / 2) / sweep) * range);
  };

  const d = Math.max(MIN_DIAMETER, Math.round(diameter ?? (unitSide ? unitSide * knobRatio : DIAMETER[size])));
  const marks = count <= 40 ? count : 10;
  const ticks = Array.from({ length: marks + 1 }, (_, i) => -sweep / 2 + (i / marks) * sweep);
  const text = formatValue(current);

  return (
    <div
      ref={ref}
      data-component="Rotary"
      data-mechanism="rotary"
      data-kind={kind}
      data-size={diameter || unitSide ? undefined : size}
      className={cx(styles.root, className)}
      style={{ ...style, '--d': `${d}px` } as CSSProperties}
      {...rest}
    >
      <div className={styles.dial} onPointerDown={onRingDown}>
        {ticks.map((a, i) => (
          <span key={i} className={styles.tick} aria-hidden="true" style={{ '--a': a } as CSSProperties} />
        ))}
        <div
          ref={knobRef}
          role="slider"
          tabIndex={disabled ? -1 : 0}
          aria-labelledby={labelId}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={current}
          aria-valuetext={text}
          aria-disabled={disabled || undefined}
          className={cx(styles.knob, styles[kind])}
          onKeyDown={onKeyDown}
          onPointerDown={onPointerDown}
        >
          <div ref={faceRef} className={styles.face} aria-hidden="true" style={{ '--deg': deg0 } as CSSProperties}>
            <span className={styles.index} />
          </div>
        </div>
      </div>
      <span className={styles.value} aria-hidden="true">{text}</span>
      <span id={labelId} className={styles.label}>{label}</span>
    </div>
  );
});
