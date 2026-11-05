import { forwardRef, useId, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../cx';
import { messages } from '../../messages';
import { Icon, type IconName } from '../Icon';
import styles from './Stat.module.css';

export type StatSize = 'sm' | 'md' | 'lg';
export type StatTrend = 'up' | 'down' | 'flat';

export interface StatProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'role'> {
  /** What the figure is, such as "Energy today". Printed above the window and used as the accessible name. */
  label: ReactNode;
  /** The figure. Leave it out, or pass null or an empty string, when there is no reading: the window then prints a dash and says "No reading". */
  value?: string | number | null;
  /** The unit printed beside the figure, such as kWh, °C or %. */
  unit?: string;
  /** The size of the change, as text, such as "0.8 kWh" or "4%". Leave it out for a Stat with no change line. */
  change?: string;
  /** The direction of the change, told by a glyph and a word and never by colour. Default `flat`. */
  trend?: StatTrend;
  /** What the change is measured against, such as "since yesterday". Printed after the amount. */
  compare?: string;
  /** `sm` sets the figure at emphasis size, `md` (default) at title size, `lg` at display size. */
  size?: StatSize;
  /** Makes the Stat a polite live region that reads the whole reading when it changes. Default off: a plain labelled group. */
  live?: boolean;
  /** Your own words for the three directions and for an empty reading, for another language. Defaults to Up, Down, No change and No reading. */
  words?: Partial<Record<StatTrend | 'noReading', string>>;
}

const GLYPH: Record<StatTrend, IconName> = { up: 'chevron-up', down: 'chevron-down', flat: 'minus' };
const DASH = '–';

/** One named figure read as a window: the name on the inset line, the number and unit alone in a recess, an optional change printed under it. */
export const Stat = forwardRef<HTMLDivElement, StatProps>(function Stat(
  { label, value, unit, change, trend = 'flat', compare, size = 'md', live = false, words, className, ...rest },
  ref,
) {
  const labelId = `${useId()}-label`;
  const text = value === null || value === undefined ? '' : String(value).trim();
  const empty = text === '';
  const w = { ...messages.stat, noReading: messages.noReading, ...words };
  return (
    <div
      ref={ref}
      role={live ? 'status' : 'group'}
      aria-live={live ? 'polite' : undefined}
      aria-atomic={live ? true : undefined}
      aria-labelledby={labelId}
      data-component="Stat"
      data-trend={change ? trend : undefined}
      data-empty={empty ? '' : undefined}
      className={cx(styles.root, styles[size], className)}
      {...rest}
    >
      <span id={labelId} className={styles.label}>{label}</span>
      <span className={styles.window}>
        {empty ? (
          <>
            <span className={styles.figure} aria-hidden="true">{DASH}</span>
            <span className={styles.reading}>{w.noReading}</span>
          </>
        ) : (
          <span className={styles.figure}>
            {text}
            {unit && (
              <>
                {' '}
                <span className={styles.unit}>{unit}</span>
              </>
            )}
          </span>
        )}
      </span>
      {change && (
        <span className={styles.change}>
          <Icon name={GLYPH[trend]} size="sm" />
          <span className={styles.word}>{w[trend]}</span>
          {' '}
          <span className={styles.amount}>{change}</span>
          {compare && (
            <>
              {' '}
              <span className={styles.compare}>{compare}</span>
            </>
          )}
        </span>
      )}
    </div>
  );
});
