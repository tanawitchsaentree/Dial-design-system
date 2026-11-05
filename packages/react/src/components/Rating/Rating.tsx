import {
  forwardRef,
  useCallback,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { cx } from '../../cx';
import { messages } from '../../messages';
import styles from './Rating.module.css';

export interface RatingProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue' | 'children'> {
  /** The rating's name. In pick mode it is printed above the marks and names the group; in display mode it only names the image for assistive tech. */
  label: ReactNode;
  /** The value, when you control it. Pick mode holds whole numbers (0 is none chosen); display mode also holds halves such as 3.5. Pair it with `onValueChange`. */
  value?: number;
  /** The value at the start, when the rating keeps its own state. */
  defaultValue?: number;
  /** Called with the new whole number when a mark is chosen by pointer or key. */
  onValueChange?: (value: number) => void;
  /** How many marks stand in the row. Default 5. */
  max?: number;
  /** Display mode: the marks only show the value (halves allowed), take no focus and cannot be pressed. */
  readOnly?: boolean;
  /** Every mark loses its press and cannot be chosen. */
  disabled?: boolean;
  /** The form field name shared by the marks. A unique one is made when you leave it out. */
  name?: string;
  /** Print the value ("3 of 5" as a number over the maximum) after the marks. Default true. */
  showValue?: boolean;
  /** The word read for one mark. Pass your own to translate it. */
  markLabel?: (n: number, max: number) => string;
  /** The words read for the value in display mode. Pass your own to translate it. */
  valueLabel?: (value: number, max: number) => string;
  /** Class name for the root. */
  className?: string;
  /** Inline style for the root. */
  style?: CSSProperties;
}

const P = 3;
const R = 1;
const RING = ['.###.', '#...#', '#...#', '#...#', '.###.'];
const CELLS = Array.from({ length: 25 }, (_, i) => ({ x: i % 5, y: Math.floor(i / 5) }));

type Fill = 'full' | 'half' | 'empty';

/** One 5 by 5 lattice. The ring is always printed; the core is lit by the fill. */
function Glyph({ fill }: { fill: Fill }) {
  return (
    <svg viewBox={`0 0 ${5 * P} ${5 * P}`} focusable="false" aria-hidden="true" className={styles.glyph}>
      {CELLS.map(({ x, y }) => {
        const ring = RING[y][x] === '#';
        const core = x >= 1 && x <= 3 && y >= 1 && y <= 3;
        if (!ring && !core) return null;
        const on = ring || fill === 'full' || (fill === 'half' && x <= 2);
        return <circle key={`${x}-${y}`} className={styles.dot} cx={x * P + P / 2} cy={y * P + P / 2} r={R} data-on={on ? '' : undefined} />;
      })}
    </svg>
  );
}

const fillOf = (i: number, v: number): Fill => (v >= i ? 'full' : v >= i - 0.5 ? 'half' : 'empty');

/**
 * A row of dot-lattice marks that picks or shows a value from 1 to `max`. A lit mark is a solid disc of dots and
 * an empty one a hollow ring, so the number is told by shape and not by colour. Pick mode is a radio group
 * (arrows walk, Home and End reach the ends); `readOnly` is a display that also holds halves.
 */
export const Rating = forwardRef<HTMLDivElement, RatingProps>(function Rating(
  {
    label, value, defaultValue = 0, onValueChange, max = 5, readOnly = false, disabled = false, name, showValue = true,
    markLabel = messages.rating.mark, valueLabel = messages.rating.value, className, style, ...rest
  },
  ref,
) {
  const auto = useId();
  const legendId = `${auto}-legend`;
  const group = useRef<HTMLDivElement | null>(null);
  const [own, setOwn] = useState(defaultValue);
  const raw = value !== undefined ? value : own;
  const clamp = (n: number) => Math.min(max, Math.max(0, n));
  const shown = readOnly ? Math.round(clamp(raw) * 2) / 2 : Math.round(clamp(raw));
  const marks = Array.from({ length: max }, (_, i) => i + 1);
  const readout = <span className={styles.value} aria-hidden="true">{shown}<span> / {max}</span></span>;

  const setRef = useCallback((node: HTMLDivElement | null) => {
    group.current = node;
    if (typeof ref === 'function') ref(node);
    else if (ref) ref.current = node;
  }, [ref]);

  const pick = (n: number) => {
    if (value === undefined) setOwn(n);
    if (n !== shown) onValueChange?.(n);
  };

  if (readOnly) {
    return (
      <div
        ref={setRef}
        role="img"
        aria-label={`${typeof label === 'string' ? label : ''}${typeof label === 'string' ? ': ' : ''}${valueLabel(shown, max)}`}
        data-component="Rating"
        data-readonly=""
        className={cx(styles.root, className)}
        style={style}
        {...rest}
      >
        <div className={styles.row}>
          {marks.map((n) => (
            <span key={n} className={styles.mark} data-fill={fillOf(n, shown)}><Glyph fill={fillOf(n, shown)} /></span>
          ))}
          {showValue && readout}
        </div>
        {name && <input type="hidden" name={name} value={shown} />}
      </div>
    );
  }

  const field = name ?? `${auto}-rating`;
  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Home' && event.key !== 'End') return;
    event.preventDefault();
    const n = event.key === 'Home' ? 1 : max;
    pick(n);
    group.current?.querySelectorAll<HTMLInputElement>('input')[n - 1]?.focus();
  };

  return (
    <div
      ref={setRef}
      role="radiogroup"
      aria-labelledby={legendId}
      aria-disabled={disabled || undefined}
      data-component="Rating"
      data-disabled={disabled || undefined}
      className={cx(styles.root, className)}
      style={style}
      {...rest}
    >
      <span id={legendId} className={styles.legend}>{label}</span>
      <div className={styles.row}>
        {marks.map((n) => (
          <label key={n} className={styles.mark} data-hit="" data-fill={fillOf(n, shown)} data-disabled={disabled || undefined}>
            <input
              type="radio"
              className={styles.input}
              name={field}
              value={n}
              checked={shown === n}
              disabled={disabled}
              aria-label={markLabel(n, max)}
              onChange={() => pick(n)}
              onKeyDown={onKeyDown}
            />
            <Glyph fill={fillOf(n, shown)} />
          </label>
        ))}
        {showValue && readout}
      </div>
    </div>
  );
});
