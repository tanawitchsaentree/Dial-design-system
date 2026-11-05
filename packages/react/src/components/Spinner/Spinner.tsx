import { forwardRef, type CSSProperties, type HTMLAttributes } from 'react';
import { cx } from '../../cx';
import { messages } from '../../messages';
import styles from './Spinner.module.css';

export type SpinnerSize = 'sm' | 'md';

export interface SpinnerProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children' | 'role'> {
  /** What is busy, in words for assistive tech, such as "Saving" or "Asking the hub". Defaults to "Loading". Pass your own for another language. */
  label?: string;
  /** Prints the label beside the holes. Off by default, when the label is read out but not drawn. Turn it on when reduced motion matters or the wait is long. */
  showLabel?: boolean;
  /** `sm` (default) uses 8px holes like a Grille in a list row; `md` uses 12px holes for a Spinner that stands alone. */
  size?: SpinnerSize;
}

// The eight holes on the edge of the 3 by 3 field, clockwise from the top start. The centre hole never lights.
const RING: ReadonlyArray<readonly [number, number]> = [[1, 1], [2, 1], [3, 1], [3, 2], [3, 3], [2, 3], [1, 3], [1, 2]];
const STILL = 3;

/** A busy indicator drawn as a small grille: a short lit trail walks the edge of nine recessed holes while the
 *  work runs. Under reduced motion the trail stops and three holes stay lit. Mount it only while busy. */
export const Spinner = forwardRef<HTMLSpanElement, SpinnerProps>(function Spinner(
  { label = messages.busy, showLabel = false, size = 'sm', className, style, ...rest },
  ref,
) {
  return (
    <span
      ref={ref}
      role="status"
      data-component="Spinner"
      data-size={size}
      className={cx(styles.root, styles[size], className)}
      style={{ ...style, '--spinner-n': RING.length } as CSSProperties}
      {...rest}
    >
      <span className={styles.field} aria-hidden="true">
        {RING.map(([c, r], i) => (
          <span
            key={i}
            className={cx(styles.hole, i < STILL && styles.still)}
            style={{ gridColumn: c, gridRow: r, '--spinner-i': i } as CSSProperties}
          />
        ))}
        <span className={styles.hole} />
      </span>
      <span className={cx(styles.text, showLabel && styles.shown)}>{label}</span>
    </span>
  );
});
