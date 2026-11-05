import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../cx';
import styles from './Badge.module.css';

export type BadgeTone = 'neutral' | 'positive' | 'warning' | 'critical' | 'info';

export interface BadgeProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** The status word, such as "Online", "Filter due" or "offline". It is required, because status is a glyph and a word, never colour alone. */
  children: ReactNode;
  /** Which status lamp is printed. `neutral` (default) is a hollow ring, `positive` a dot, `warning` a triangle, `critical` a square, `info` a diamond. */
  tone?: BadgeTone;
  /** A number printed before the word in tabular figures, for the count form such as "3 offline". */
  count?: number;
}

// Each tone has its own shape, so the tones differ without colour (WCAG 1.4.1).
const GLYPH: Record<BadgeTone, ReactNode> = {
  neutral: <circle cx="5" cy="5" r="3.75" />,
  positive: <circle cx="5" cy="5" r="4.5" />,
  warning: <path d="M5 .9 9.4 9.1H.6z" />,
  critical: <rect x="1" y="1" width="8" height="8" />,
  info: <path d="M5 .2 9.8 5 5 9.8.2 5z" />,
};

/** Printing on the case: a small status lamp with its own shape per tone and a word, flat on the plastic. */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { tone = 'neutral', count, className, children, ...rest },
  ref,
) {
  return (
    <span ref={ref} data-component="Badge" data-tone={tone} className={cx(styles.root, styles[tone], className)} {...rest}>
      {/* every lamp shape stands in the one window and the tone's own is lit, so a change of tone fades from one
          shape to the next instead of swapping it in a frame (D-008, R-008) */}
      <svg className={styles.glyph} viewBox="0 0 10 10" aria-hidden="true" focusable="false">
        {(Object.keys(GLYPH) as BadgeTone[]).map((t) => (
          <g key={t} className={styles.shape} data-on={t === tone ? '' : undefined}>{GLYPH[t]}</g>
        ))}
      </svg>
      {count !== undefined && <span className={styles.count}>{count}</span>}
      <span className={styles.word}>{children}</span>
    </span>
  );
});
