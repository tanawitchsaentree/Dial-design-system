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
import { MECHANISM, useIsoLayoutEffect, useSpring } from '../../spring';
import styles from './Scrubber.module.css';

/** A chapter start, in seconds from the beginning, with an optional title that is announced with the position. */
export interface ScrubberChapter {
  /** Where the chapter starts, in seconds. */
  time: number;
  /** The chapter's title, such as "Chorus". It is added to the announced position while the cap is inside the chapter. */
  label?: string;
}

export interface ScrubberProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue' | 'children'> {
  /** What is playing, such as the track's title. It is printed above the groove and is the scrubber's accessible name. */
  label: ReactNode;
  /** The length of the track, in seconds. */
  duration: number;
  /** The position when controlled, in seconds. Pair it with `onValueChange`. */
  value?: number;
  /** The starting position when uncontrolled, in seconds. Default 0. */
  defaultValue?: number;
  /** Called with the new position, in whole seconds, while a key, a drag or a press moves the cap. */
  onValueChange?: (seconds: number) => void;
  /** Called once with the final position when a drag ends or a key is pressed, the moment to seek a player that cannot seek while dragging. */
  onValueCommit?: (seconds: number) => void;
  /** How far the track has loaded, in seconds. The groove floor up to there is drawn one ink step darker. */
  buffered?: number;
  /** Chapter starts, printed as ink marks above the groove. */
  chapters?: ScrubberChapter[];
  /** How far the arrow keys move, in seconds. Default 5. */
  step?: number;
  /** How far PageUp and PageDown move, in seconds. Default 30. */
  pageStep?: number;
  /** The range the track belongs to, which tints the glass cap and the played stretch of the groove behind it. Default neutral. */
  tint?: 'warm' | 'cool' | 'neutral';
  /** Nothing is loaded yet; the cap loses its height and cannot be moved. */
  disabled?: boolean;
  /** Spring mass of the cap. Default 1.4 (mechanism.mass). */
  mass?: number;
  /** Spring stiffness. Default 520 (mechanism.stiffness). */
  stiffness?: number;
  /** Spring damping. Default 46 (mechanism.damping). */
  damping?: number;
}

/** Seconds as m:ss, or h:mm:ss when the track runs an hour or more. */
export function formatTime(seconds: number, long = false): string {
  const s = Math.max(0, Math.floor(seconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const ss = String(s % 60).padStart(2, '0');
  return long || h > 0 ? `${h}:${String(m).padStart(2, '0')}:${ss}` : `${m}:${ss}`;
}

/** The seekable position of a track or a video: a plastic cap in the fader groove, chapter marks above, the
 *  buffered stretch one ink step darker, and the elapsed and remaining time printed under its ends. */
export const Scrubber = forwardRef<HTMLDivElement, ScrubberProps>(function Scrubber(
  {
    label,
    duration,
    value,
    defaultValue,
    onValueChange,
    onValueCommit,
    buffered,
    chapters,
    step = 5,
    pageStep = 30,
    tint = 'neutral',
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
  const total = duration > 0 ? duration : 0;
  const clamp = (v: number) => Math.min(total, Math.max(0, Math.round(v)));
  const controlled = value !== undefined;
  const [inner, setInner] = useState(() => clamp(defaultValue ?? 0));
  const current = clamp(controlled ? value : inner);
  const latest = useRef(current);
  latest.current = current;
  const frac = (v: number) => (total ? v / total : 0);

  const faderRef = useRef<HTMLDivElement>(null);
  const capRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const seeking = useRef(false);
  const mounted = useRef(false);
  const [x0] = useState(() => frac(current));
  // --x lives on the fader so the cap and the played light in the groove behind it move as one
  const spring = useSpring((x) => faderRef.current?.style.setProperty('--x', x.toFixed(4)), { mass, stiffness, damping }, x0);

  // playback steps the cap with the time; only a seek by key travels on the spring
  useIsoLayoutEffect(() => {
    if (dragging.current) return;
    spring.to(frac(current), !mounted.current || !seeking.current);
    seeking.current = false;
    mounted.current = true;
  }, [current, total]);

  const commit = useCallback(
    (v: number) => {
      const next = clamp(v);
      if (next === latest.current) return;
      latest.current = next;
      if (!controlled) setInner(next);
      onValueChange?.(next);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [total, controlled, onValueChange],
  );

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    const v = latest.current;
    const map: Record<string, number> = {
      ArrowRight: v + step, ArrowUp: v + step, ArrowLeft: v - step, ArrowDown: v - step,
      PageUp: v + pageStep, PageDown: v - pageStep, Home: 0, End: total,
    };
    if (!(e.key in map)) return;
    e.preventDefault();
    const rtl = faderRef.current && getComputedStyle(faderRef.current).direction === 'rtl';
    const key = rtl && e.key === 'ArrowRight' ? 'ArrowLeft' : rtl && e.key === 'ArrowLeft' ? 'ArrowRight' : e.key;
    const before = latest.current;
    seeking.current = true;
    commit(map[key]);
    if (latest.current === before) seeking.current = false;
    onValueCommit?.(latest.current);
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
    if (disabled || e.button !== 0 || !total) return;
    const el = e.currentTarget;
    el.setPointerCapture?.(e.pointerId);
    el.focus();
    dragging.current = true;
    const follow = (clientX: number) => {
      const f = fractionAt(clientX);
      spring.to(f, true);
      commit(f * total);
    };
    follow(e.clientX);
    const move = (ev: globalThis.PointerEvent) => follow(ev.clientX);
    const end = () => {
      dragging.current = false;
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', end);
      el.removeEventListener('pointercancel', end);
      spring.to(frac(latest.current), true);
      onValueCommit?.(latest.current);
    };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', end);
    el.addEventListener('pointercancel', end);
  };

  const long = total >= 3600;
  const marks = (chapters ?? []).filter((c) => c.time > 0 && c.time < total).sort((a, b) => a.time - b.time);
  const inChapter = [...(chapters ?? [])].sort((a, b) => b.time - a.time).find((c) => c.time <= current);
  const text = `${formatTime(current, long)} of ${formatTime(total, long)}${inChapter?.label ? `, ${inChapter.label}` : ''}`;
  const loaded = buffered === undefined ? 0 : Math.min(1, Math.max(0, frac(buffered)));

  return (
    <div ref={ref} data-component="Scrubber" data-tint={tint} className={cx(styles.root, className)} {...rest}>
      <div className={styles.header}>
        <span id={labelId} className={styles.label}>{label}</span>
      </div>
      <div
        ref={faderRef}
        role="slider"
        tabIndex={disabled ? -1 : 0}
        aria-labelledby={labelId}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={current}
        aria-valuetext={text}
        aria-orientation="horizontal"
        aria-disabled={disabled || undefined}
        className={styles.fader}
        style={{ '--x': x0 } as CSSProperties}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
      >
        <div className={styles.chapters} aria-hidden="true">
          {marks.map((c) => (
            <span key={c.time} className={styles.chapter} style={{ '--p': frac(c.time) } as CSSProperties} />
          ))}
        </div>
        <div className={styles.groove} aria-hidden="true">
          <span className={styles.fill} />
          <span className={styles.buffer} style={{ '--buffered': loaded } as CSSProperties} />
        </div>
        <div ref={capRef} className={styles.cap} aria-hidden="true" />
      </div>
      <div className={styles.times} aria-hidden="true">
        <span className={styles.time}>{formatTime(current, long)}</span>
        <span className={styles.time}>−{formatTime(total - current, long)}</span>
      </div>
    </div>
  );
});
