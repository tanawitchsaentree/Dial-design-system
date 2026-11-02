import { forwardRef, useId, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../cx';
import styles from './Meter.module.css';

/** The three regions a meter's range can split into: under `low`, between, and over `high`. */
export type MeterRegion = 'low' | 'mid' | 'high';

export interface MeterProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'role'> {
  /** What is read, such as "Battery" or "Air quality". Printed above the scale and used as the accessible name. */
  label: ReactNode;
  /** The reading. Values outside the range are clamped. */
  value: number;
  /** The lowest value, at the start of the scale. Default 0. */
  min?: number;
  /** The highest value, at the end of the scale. Default 100. */
  max?: number;
  /** Where the low region ends. Readings under it are in the low region. */
  low?: number;
  /** Where the high region starts. Readings over it are in the high region. */
  high?: number;
  /** A value in the preferred region. That region's name carries a printed bracket, and the glyph says whether the reading is in it. */
  optimum?: number;
  /** The names of the three regions, printed under the scale and after the reading. Defaults to Low, Normal and High. */
  regionLabels?: Partial<Record<MeterRegion, string>>;
  /** Turns a value into the printed and announced text, for example `(v) => v + ' %'`. */
  formatValue?: (value: number) => string;
  /** The reading in words, when `formatValue` is not enough, such as "Hard, 14 °dH". It replaces the printed value. */
  valueText?: string;
}

const plain = (v: number) => String(Number(v.toFixed(1)));
const NAMES: Record<MeterRegion, string> = { low: 'Low', mid: 'Normal', high: 'High' };
const ORDER: MeterRegion[] = ['low', 'mid', 'high'];
// each region has its own shape, so the region is told without colour (WCAG 1.4.1)
const GLYPH: Record<MeterRegion, ReactNode> = {
  low: <path d="M5 9.4.6 1h8.8z" />,
  mid: <circle cx="5" cy="5" r="4.5" />,
  high: <path d="M5 .6 9.4 9H.6z" />,
};
const DIVISIONS = 20;

/** A static reading of a level in a known range: a printed scale in a narrow recess with one ink needle,
 *  and, when the range has regions, the region named by a glyph and a word. */
export const Meter = forwardRef<HTMLDivElement, MeterProps>(function Meter(
  { label, value, min = 0, max = 100, low, high, optimum, regionLabels, formatValue = plain, valueText, className, ...rest },
  ref,
) {
  const labelId = `${useId()}-label`;
  const top = max > min ? max : min + 1;
  const range = top - min;
  const v = Math.min(top, Math.max(min, Number.isFinite(value) ? value : min));
  const lo = low === undefined ? min : Math.min(top, Math.max(min, low));
  const hi = high === undefined ? top : Math.min(top, Math.max(lo, high));
  const regions = low !== undefined || high !== undefined;
  const regionOf = (x: number): MeterRegion => (x < lo ? 'low' : x > hi ? 'high' : 'mid');
  const at = regionOf(v);
  const best = optimum === undefined ? undefined : regionOf(Math.min(top, Math.max(min, optimum)));
  const distance = best === undefined ? -1 : Math.abs(ORDER.indexOf(at) - ORDER.indexOf(best));
  const names = { ...NAMES, ...regionLabels };
  const frac = (x: number) => (x - min) / range;
  const reading = valueText ?? formatValue(v);
  const spans = (
    [['low', min, lo], ['mid', lo, hi], ['high', hi, top]] as Array<[MeterRegion, number, number]>
  ).filter(([, s, e]) => e > s);

  return (
    <div
      ref={ref}
      role="meter"
      aria-labelledby={labelId}
      aria-valuemin={min}
      aria-valuemax={top}
      aria-valuenow={v}
      aria-valuetext={regions ? `${reading}, ${names[at]}` : reading}
      data-component="Meter"
      data-region={regions ? at : undefined}
      className={cx(styles.root, className)}
      {...rest}
    >
      <span className={styles.header}>
        <span id={labelId} className={styles.label}>{label}</span>
        <span className={styles.reading} aria-hidden="true">
          <span className={styles.value}>{reading}</span>
          {regions && (
            <>
              <svg
                className={cx(styles.glyph, distance === 0 && styles.good, distance === 2 && styles.poor)}
                viewBox="0 0 10 10"
                focusable="false"
              >
                {GLYPH[at]}
              </svg>
              <span className={styles.word}>{names[at]}</span>
            </>
          )}
        </span>
      </span>
      <span className={styles.window} aria-hidden="true">
        {Array.from({ length: DIVISIONS + 1 }, (_, i) => (
          <span key={i} className={cx(styles.tick, i % (DIVISIONS / 2) === 0 && styles.major)} style={{ '--p': i / DIVISIONS } as CSSProperties} />
        ))}
        {regions && [lo, hi].filter((b) => b > min && b < top).map((b) => (
          <span key={b} className={styles.bound} style={{ '--p': frac(b) } as CSSProperties} />
        ))}
        <span className={styles.needle} style={{ '--p': frac(v) } as CSSProperties} />
      </span>
      {regions ? (
        <span className={styles.regions} aria-hidden="true">
          {spans.map(([r, s, e]) => (
            <span
              key={r}
              className={cx(styles.region, r === at && styles.current, r === best && styles.preferred)}
              style={{ '--s': frac(s), '--w': frac(e) - frac(s) } as CSSProperties}
            >
              {names[r]}
            </span>
          ))}
        </span>
      ) : (
        <span className={styles.ends} aria-hidden="true">
          <span className={styles.end}>{formatValue(min)}</span>
          <span className={styles.end}>{formatValue(top)}</span>
        </span>
      )}
    </div>
  );
});
