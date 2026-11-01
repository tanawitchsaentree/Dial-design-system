import { forwardRef, useId, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../cx';
import styles from './Progress.module.css';

export type ProgressSize = 'sm' | 'md';

export interface ProgressProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'role'> {
  /** How far the task has run, from 0 to `max`. Values outside the range are clamped. Leave it out for the indeterminate form. */
  value?: number;
  /** The end of the task. Defaults to 100. */
  max?: number;
  /** What is running, such as "Washer" or "Firmware update". Printed above the groove and used as the accessible name. */
  label: ReactNode;
  /** The reading in words, printed at the end of the label line and announced, such as "38 min left". Defaults to the percent, or "Working" when indeterminate. */
  valueText?: string;
  /** `md` (default) is an 8px groove, the main reading of a unit; `sm` is a 4px groove for rows in a list. */
  size?: ProgressSize;
}

const TICKS = 12;

/** How far a device task has run: a recessed groove that fills with ink, its name and reading printed above.
 *  With no `value` it shows a still row of ink ticks, because nothing in dial moves while idle. */
export const Progress = forwardRef<HTMLDivElement, ProgressProps>(function Progress(
  { value, max = 100, label, valueText, size = 'md', className, ...rest },
  ref,
) {
  const labelId = `${useId()}-label`;
  const top = max > 0 ? max : 1;
  const known = value !== undefined && Number.isFinite(value);
  const v = known ? Math.min(top, Math.max(0, value)) : 0;
  const pct = Math.round((v / top) * 100);
  const reading = valueText ?? (known ? `${pct}%` : 'Working');
  return (
    <div
      ref={ref}
      role="progressbar"
      aria-labelledby={labelId}
      aria-valuemin={known ? 0 : undefined}
      aria-valuemax={known ? top : undefined}
      aria-valuenow={known ? v : undefined}
      aria-valuetext={reading}
      data-component="Progress"
      data-state={known ? 'determinate' : 'indeterminate'}
      className={cx(styles.root, className)}
      {...rest}
    >
      <span className={styles.head}>
        <span id={labelId} className={styles.label}>{label}</span>
        <span className={styles.value} aria-hidden="true">{reading}</span>
      </span>
      <span className={cx(styles.groove, styles[size])}>
        {known ? (
          <span className={styles.fill} style={{ '--progress-fill': `${(v / top) * 100}%` } as CSSProperties} />
        ) : (
          <span className={styles.ticks}>
            {Array.from({ length: TICKS }, (_, i) => <span key={i} className={styles.tick} />)}
          </span>
        )}
      </span>
    </div>
  );
});
