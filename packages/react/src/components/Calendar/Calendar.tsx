import { forwardRef, useEffect, useId, useMemo, useRef, useState, type HTMLAttributes, type KeyboardEvent } from 'react';
import { cx } from '../../cx';
import { messages } from '../../messages';
import { Icon } from '../Icon';
import {
  addDays,
  addMonths,
  addMonthsToMonth,
  clampISODate,
  compareISODate,
  monthGrid,
  monthOf,
  parseISODate,
  parseISOMonth,
  todayISO,
  weekdayOf,
  type ISODate,
  type ISOMonth,
} from './date';
import styles from './Calendar.module.css';

/** A span of days to mark: its two ends, "yyyy-mm-dd", either may be null while the range is still being chosen. */
export interface CalendarRange {
  /** The first day of the span. */
  start: ISODate | null;
  /** The last day of the span. If it comes before `start`, the two are swapped for display. */
  end: ISODate | null;
  /** True while the end is only a preview, such as the day under the pointer. The days between are then ruled with a dotted line. */
  preview?: boolean;
}

/** The words read out after a day's name when it is part of a range. */
export interface CalendarRangeLabels {
  /** Added to the first day of the range. Default "start of range". */
  start?: string;
  /** Added to the last day of the range. Default "end of range". */
  end?: string;
  /** Added to the days between. Default "in range". */
  inside?: string;
}

export interface CalendarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  /** The chosen day as "yyyy-mm-dd", or null for none. Pass it with `onValueChange` to control the Calendar yourself. */
  value?: ISODate | null;
  /** The day to start on when you do not control it. */
  defaultValue?: ISODate | null;
  /** Called with the day, "yyyy-mm-dd", when one is chosen by a press, Enter or Space. */
  onValueChange?: (value: ISODate) => void;
  /** The month on show as "yyyy-mm". Pass it with `onMonthChange` to control the month yourself. */
  month?: ISOMonth;
  /** The month to open on when you do not control it. Defaults to the chosen day's month, else this month. */
  defaultMonth?: ISOMonth;
  /** Called with "yyyy-mm" when the month on show changes, by a month key, the Page keys or an arrow that crosses the edge. */
  onMonthChange?: (month: ISOMonth) => void;
  /** The earliest day that can be chosen, "yyyy-mm-dd". Earlier days are shown as unavailable. */
  min?: ISODate;
  /** The latest day that can be chosen, "yyyy-mm-dd". Later days are shown as unavailable. */
  max?: ISODate;
  /** Return true for a day that cannot be chosen, such as a weekend or a day already booked. */
  isDateDisabled?: (date: ISODate) => boolean;
  /** The first column of the week: 0 is Sunday, 1 is Monday, up to 6 for Saturday. Default 1. */
  weekStart?: number;
  /** A BCP 47 tag such as "th" or "de". It sets the month, weekday and number words through Intl. Default "en". */
  locale?: string;
  /** The day to treat as today, "yyyy-mm-dd". Defaults to the visitor's own date once the page has loaded. */
  today?: ISODate;
  /** No day can be chosen and no key works. */
  disabled?: boolean;
  /** Days can be focused and read but not chosen. */
  readOnly?: boolean;
  /** The name read out for a day, such as "Wednesday, 4 November 2026". Pass your own for another wording. Defaults to a full Intl date. */
  dayLabel?: (date: ISODate) => string;
  /** The name of the previous month key. Pass your own for another language. Defaults to "Previous month". */
  previousLabel?: string;
  /** The name of the next month key. Pass your own for another language. Defaults to "Next month". */
  nextLabel?: string;
  /**
   * Marks a span of days. The two end days are cut into windows like a chosen day and the days between are ruled above and below
   * (dotted while `preview` is set), so the span shows by shape. When it is set, `value` is no longer drawn. Choosing a day still
   * calls `onValueChange`; what a press means for the span is yours to decide.
   */
  range?: CalendarRange;
  /** Called with the day under the pointer or the focus, and with null when it leaves the grid. Use it to preview the end of a range. */
  onDayHover?: (date: ISODate | null) => void;
  /** The words added to a day's name inside `range`. Pass your own for another language. */
  rangeLabels?: CalendarRangeLabels;
  /** Class name for the Calendar. */
  className?: string;
}

const safeLocale = (locale: string) => {
  try {
    return Intl.DateTimeFormat.supportedLocalesOf(locale).length ? locale : 'en';
  } catch {
    return 'en';
  }
};

/** A month grid for choosing one day: printed numbers in fixed columns, an index bar under today, the chosen day cut into a window. */
export const Calendar = forwardRef<HTMLDivElement, CalendarProps>(function Calendar(
  {
    value, defaultValue = null, onValueChange, month, defaultMonth, onMonthChange, min, max, isDateDisabled,
    weekStart = 1, locale = 'en', today, disabled = false, readOnly = false, dayLabel,
    previousLabel = messages.calendar.previousMonth, nextLabel = messages.calendar.nextMonth,
    range, onDayHover, rangeLabels, className, ...rest
  },
  ref,
) {
  const headingId = useId();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const pendingFocus = useRef(false);

  const [ownValue, setOwnValue] = useState<ISODate | null>(defaultValue);
  const selected = parseISODate(value !== undefined ? value : ownValue) ? (value !== undefined ? value : ownValue) : null;

  const [clock, setClock] = useState<ISODate | null>(null);
  useEffect(() => setClock(todayISO()), []);
  const todayIso = parseISODate(today) ? today! : clock;

  // a marked range, ordered; with one end only, that day stands alone as the start
  const rangeA = range && parseISODate(range.start) ? range.start : null;
  const rangeB = range && parseISODate(range.end) ? range.end : null;
  const swapped = rangeA != null && rangeB != null && compareISODate(rangeB, rangeA) < 0;
  const rangeStart = range ? (swapped ? rangeB : (rangeA ?? rangeB)) : null;
  const rangeEnd = range ? (swapped ? rangeA : rangeA ? rangeB : null) : null;
  const rangeWords = {
    start: rangeLabels?.start ?? messages.rangePicker.rangeStart,
    end: rangeLabels?.end ?? messages.rangePicker.rangeEnd,
    inside: rangeLabels?.inside ?? messages.rangePicker.inRange,
  };
  const rangeKind = (iso: ISODate): 'single' | 'start' | 'end' | 'inside' | null => {
    if (!range || !rangeStart) return null;
    if (iso === rangeStart) return rangeEnd == null || rangeEnd === iso ? 'single' : 'start';
    if (rangeEnd == null) return null;
    if (iso === rangeEnd) return 'end';
    return compareISODate(iso, rangeStart) > 0 && compareISODate(iso, rangeEnd) < 0 ? 'inside' : null;
  };

  const lo = parseISODate(min) ? min : undefined;
  const hi = parseISODate(max) ? max : undefined;
  const start = ((Math.floor(weekStart) % 7) + 7) % 7;

  const [ownMonth, setOwnMonth] = useState<ISOMonth>(() => {
    if (parseISOMonth(defaultMonth)) return defaultMonth!;
    const anchor = parseISODate(selected ? selected : null) ? selected! : clampISODate(todayISO(), lo, hi);
    return monthOf(anchor);
  });
  const view = parseISOMonth(month) ? month! : ownMonth;
  const [focusDate, setFocusDate] = useState<ISODate | null>(null);

  const loc = useMemo(() => safeLocale(locale), [locale]);
  const fmt = useMemo(
    () => ({
      title: new Intl.DateTimeFormat(loc, { month: 'long', year: 'numeric', timeZone: 'UTC' }),
      short: new Intl.DateTimeFormat(loc, { weekday: 'short', timeZone: 'UTC' }),
      long: new Intl.DateTimeFormat(loc, { weekday: 'long', timeZone: 'UTC' }),
      full: new Intl.DateTimeFormat(loc, { dateStyle: 'full', timeZone: 'UTC' }),
      num: new Intl.NumberFormat(loc),
    }),
    [loc],
  );
  const at = (iso: ISODate) => {
    const p = parseISODate(iso)!;
    const dt = new Date(0);
    dt.setUTCFullYear(p.year, p.month - 1, p.day);
    return dt;
  };

  const grid = useMemo(() => monthGrid(view, start), [view, start]);
  const inView = (iso: ISODate | null) => iso != null && monthOf(iso) === view;
  const tabIso: ISODate =
    (inView(focusDate) && focusDate) || (inView(rangeStart) && rangeStart) || (inView(selected) && selected) || (inView(todayIso) && todayIso) || `${view}-01`;

  const isOff = (iso: ISODate) =>
    disabled || (lo != null && compareISODate(iso, lo) < 0) || (hi != null && compareISODate(iso, hi) > 0) || !!isDateDisabled?.(iso);

  const showMonth = (next: ISOMonth) => {
    if (next === view) return;
    if (month === undefined) setOwnMonth(next);
    onMonthChange?.(next);
  };

  useEffect(() => {
    if (!pendingFocus.current) return;
    pendingFocus.current = false;
    rootRef.current?.querySelector<HTMLElement>(`[data-date="${tabIso}"]`)?.focus();
  });

  const moveTo = (iso: ISODate) => {
    const to = clampISODate(iso, lo, hi);
    pendingFocus.current = true;
    setTimeout(() => { pendingFocus.current = false; }, 0);
    setFocusDate(to);
    showMonth(monthOf(to));
  };

  const choose = (iso: ISODate) => {
    setFocusDate(iso);
    if (disabled || readOnly || isOff(iso)) return;
    if (value === undefined) setOwnValue(iso);
    onValueChange?.(iso);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTableElement>) => {
    const iso = (e.target as HTMLElement).closest<HTMLElement>('[data-date]')?.dataset.date;
    if (!iso || e.altKey || e.ctrlKey || e.metaKey) return;
    const rtl = getComputedStyle(e.currentTarget).direction === 'rtl';
    const weekDay = (weekdayOf(iso) - start + 7) % 7;
    const next: Record<string, ISODate> = {
      ArrowLeft: addDays(iso, rtl ? 1 : -1),
      ArrowRight: addDays(iso, rtl ? -1 : 1),
      ArrowUp: addDays(iso, -7),
      ArrowDown: addDays(iso, 7),
      Home: addDays(iso, -weekDay),
      End: addDays(iso, 6 - weekDay),
      PageUp: addMonths(iso, e.shiftKey ? -12 : -1),
      PageDown: addMonths(iso, e.shiftKey ? 12 : 1),
    };
    const to = next[e.key];
    if (!to) return;
    e.preventDefault();
    moveTo(to);
  };

  const prevOff = disabled || (lo != null && compareISODate(addDays(`${view}-01`, -1), lo) < 0);
  const nextOff = disabled || (hi != null && compareISODate(addMonths(`${view}-01`, 1), hi) > 0);
  const turn = (by: number, off: boolean) => { if (!off) showMonth(addMonthsToMonth(view, by)); };

  const parts = parseISOMonth(view)!;
  const sunday = '2023-01-01';

  return (
    <div
      ref={(node) => {
        rootRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      }}
      data-component="Calendar"
      data-readonly={readOnly ? '' : undefined}
      className={cx(styles.root, className)}
      {...rest}
    >
      <div className={styles.header}>
        <button type="button" className={styles.key} aria-label={previousLabel} aria-disabled={prevOff || undefined} onClick={() => turn(-1, prevOff)}>
          <Icon name="chevron-left" size="sm" />
        </button>
        <div id={headingId} className={styles.heading} aria-live="polite" aria-atomic="true">{fmt.title.format(at(`${view}-01`))}</div>
        <button type="button" className={styles.key} aria-label={nextLabel} aria-disabled={nextOff || undefined} onClick={() => turn(1, nextOff)}>
          <Icon name="chevron-right" size="sm" />
        </button>
      </div>
      <table role="grid" className={styles.grid} aria-labelledby={headingId} aria-readonly={readOnly || undefined} aria-disabled={disabled || undefined} onKeyDown={onKeyDown}
        onPointerLeave={onDayHover ? () => onDayHover(null) : undefined}
        onBlur={onDayHover ? (e) => { if (!e.currentTarget.contains(e.relatedTarget as Node | null)) onDayHover(null); } : undefined}>
        <thead>
          <tr>
            {Array.from({ length: 7 }, (_, i) => {
              const day = at(addDays(sunday, (start + i) % 7));
              return (
                <th key={i} scope="col" className={styles.weekday} aria-label={fmt.long.format(day)}>{fmt.short.format(day)}</th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {grid.map((week, w) => (
            <tr key={w} className={styles.week} aria-hidden={week.every((d) => d === null) ? true : undefined}>
              {week.map((iso, c) => {
                if (iso === null) return <td key={c} role="gridcell" className={styles.cell} aria-hidden="true" />;
                const off = isOff(iso);
                const kind = rangeKind(iso);
                const isSelected = range ? kind != null : iso === selected;
                const isToday = iso === todayIso;
                const name = dayLabel ? dayLabel(iso) : fmt.full.format(at(iso));
                const rangeWord = kind === 'inside' ? rangeWords.inside : kind === 'end' ? rangeWords.end : kind ? rangeWords.start : null;
                return (
                  <td key={c} role="gridcell" className={styles.cell} aria-selected={isSelected ? true : undefined}>
                    <button
                      type="button"
                      className={styles.day}
                      tabIndex={iso === tabIso ? 0 : -1}
                      data-date={iso}
                      data-selected={isSelected ? '' : undefined}
                      data-range={kind ?? undefined}
                      data-preview={kind === 'inside' && range?.preview ? '' : undefined}
                      data-today={isToday ? '' : undefined}
                      aria-disabled={off || undefined}
                      aria-current={isToday ? 'date' : undefined}
                      aria-label={rangeWord ? `${name}, ${rangeWord}` : name}
                      onClick={() => choose(iso)}
                      onPointerEnter={onDayHover ? () => onDayHover(off ? null : iso) : undefined}
                      onFocus={onDayHover ? () => onDayHover(off ? null : iso) : undefined}
                    >
                      {fmt.num.format(parseISODate(iso)!.day)}
                      {isToday && <span className={styles.mark} aria-hidden="true" />}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});
