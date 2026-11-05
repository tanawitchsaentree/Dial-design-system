import { forwardRef, type HTMLAttributes } from 'react';
import { cx } from '../../cx';
import { messages } from '../../messages';
import { formatNumber, runStats } from '../LineChart/chart-utils';
import styles from './Sparkline.module.css';

export type SparklineSize = 'sm' | 'md' | 'lg';

export interface SparklineWords {
  /** The words for the direction of the run, as in "falling". Defaults are rising, falling and steady. */
  up?: string;
  down?: string;
  flat?: string;
  /** What the label says when there are no values. Default "No readings". */
  empty?: string;
  /** The sentence read after the label, from the number of readings, the direction and four formatted values. */
  summary?: (count: number, trend: string, first: string, last: string, low: string, high: string) => string;
}

export interface SparklineProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children' | 'role'> {
  /** What the trend shows, such as "Energy, last 7 days". It is the start of the accessible name, so name the reading and the period. */
  label: string;
  /** The readings, oldest first. Evenly spaced; an empty list prints a flat rule and says "No readings". */
  values: number[];
  /** The unit read after a value in the summary and printed after the last value, such as kWh. */
  unit?: string;
  /** Your own way to write a value, for another language or number format. Receives the raw number. */
  format?: (value: number) => string;
  /** The lowest value of the scale. Pass the same `min` and `max` to a column of Sparklines to draw them on one scale. Default: the lowest reading. */
  min?: number;
  /** The highest value of the scale. Default: the highest reading. */
  max?: number;
  /** Print the last value after the line, in tabular numerals. The label already carries it for assistive tech. Default false. */
  showValue?: boolean;
  /** `sm` is word height, `md` (default) suits a table cell or list row, `lg` is wide enough to read shape beside a Stat. */
  size?: SparklineSize;
  /** Your own sentence read after the label. Defaults to one built from the readings. */
  summary?: string;
  /** Your own words for another language. Defaults are English. */
  words?: SparklineWords;
}

/** A trend small enough for a line of text: one ink line with no axes and a solid dot on the last reading. */
export const Sparkline = forwardRef<HTMLSpanElement, SparklineProps>(function Sparkline(
  { label, values, unit, format, min, max, showValue = false, size = 'md', summary, words, className, ...rest },
  ref,
) {
  const w = { ...messages.sparkline, ...words };
  const run = values.filter((v) => Number.isFinite(v));
  const empty = run.length === 0;
  const text = (v: number) => (format ? format(v) : formatNumber(v)) + (unit ? ` ${unit}` : '');

  const stats = empty ? null : runStats(run);
  const lo = min ?? (stats ? stats.low : 0);
  const hi = max ?? (stats ? stats.high : 1);
  const x = (i: number) => (run.length > 1 ? (100 * i) / (run.length - 1) : 100);
  const y = (v: number) => (hi === lo ? 50 : 90 - (80 * (Math.min(hi, Math.max(lo, v)) - lo)) / (hi - lo));

  const said = empty
    ? w.empty
    : (summary ?? w.summary(run.length, w[stats!.trend], text(stats!.first), text(stats!.last), text(stats!.low), text(stats!.high)));
  const lastX = x(run.length - 1);
  const lastY = stats ? y(stats.last) : 50;

  return (
    <span
      ref={ref}
      {...rest}
      role="img"
      aria-label={`${label}: ${said}`}
      data-component="Sparkline"
      data-empty={empty ? '' : undefined}
      className={cx(styles.root, styles[size], className)}
    >
      <span className={styles.box} data-empty={empty ? '' : undefined}>
        {!empty && (
          <>
            <svg className={styles.line} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">
              <polyline points={run.map((v, i) => `${x(i)},${y(v)}`).join(' ')} />
            </svg>
            <span className={styles.dot} style={{ insetInlineStart: `${lastX}%`, insetBlockStart: `${lastY}%` }} />
          </>
        )}
      </span>
      {showValue && stats && <span className={styles.value}>{text(stats.last)}</span>}
    </span>
  );
});
