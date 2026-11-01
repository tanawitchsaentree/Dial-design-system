import { forwardRef, type CSSProperties, type HTMLAttributes } from 'react';
import { cx } from '../../cx';
import styles from './Grille.module.css';

export type GrilleShape = 'rect' | 'circle';
export type GrilleFill = 'inline' | 'up';

export interface GrilleProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'role'> {
  /** The reading, from 0 to `max`. Values outside the range are clamped. */
  value: number;
  /** The top of the range. Defaults to 10. */
  max?: number;
  /** Holes per row. Defaults to 12. */
  cols?: number;
  /** Rows of holes. Defaults to 4. */
  rows?: number;
  /** `rect` (default) is a rectangular field; `circle` leaves out the holes outside the inscribed circle, like a speaker grille. */
  shape?: GrilleShape;
  /** What the holes measure, such as "Volume" or "Fan speed". Required: a grille with no reading is not allowed. */
  label: string;
  /** Fill order. `inline` (default) lights holes column by column in reading order (left to right, mirrored in RTL); `up` lights rows from the bottom. */
  fill?: GrilleFill;
  /** The reading as words for assistive tech. Defaults to "`value` of `max`". */
  valueText?: string;
}

/** A perforated field whose recessed holes are the meter: lit holes in ink show a level, never orange. */
export const Grille = forwardRef<HTMLDivElement, GrilleProps>(function Grille(
  { value, max = 10, cols = 12, rows = 4, shape = 'rect', label, fill = 'inline', valueText, className, style, ...rest },
  ref,
) {
  const top = max > 0 ? max : 1;
  const v = Math.min(top, Math.max(0, value));
  const holes: Array<{ c: number; r: number; inField: boolean }> = [];
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const dx = (c + 0.5) / cols - 0.5, dy = (r + 0.5) / rows - 0.5;
    holes.push({ c, r, inField: shape === 'rect' || dx * dx + dy * dy <= 0.25 });
  }
  // Order the holes in the field: along the line (bottom hole of each column first), or bottom row up.
  const order = holes.filter((h) => h.inField).sort((a, b) => (fill === 'inline' ? a.c - b.c || b.r - a.r : b.r - a.r || a.c - b.c));
  const lit = new Set(order.slice(0, Math.round((v / top) * order.length)));
  return (
    <div
      ref={ref}
      role="meter"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={top}
      aria-valuenow={v}
      aria-valuetext={valueText ?? `${v} of ${top}`}
      data-component="Grille"
      data-shape={shape}
      data-fill={fill}
      className={cx(styles.root, className)}
      style={{ ...style, '--grille-cols': cols } as CSSProperties}
      {...rest}
    >
      {holes.map((h, i) => (
        <span key={i} aria-hidden="true" data-lit={lit.has(h) || undefined} className={cx(styles.hole, !h.inField && styles.void, lit.has(h) && styles.on)} />
      ))}
    </div>
  );
});
