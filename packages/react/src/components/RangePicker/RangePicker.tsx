import {
  forwardRef,
  useEffect,
  useId,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { cx } from '../../cx';
import { messages } from '../../messages';
import { Calendar, type CalendarRangeLabels } from '../Calendar';
import {
  clampISODate,
  compareISODate,
  monthOf,
  parseISODate,
  todayISO,
  type ISODate,
} from '../Calendar/date';
import { Icon } from '../Icon';
import { Input } from '../Input';
import { Popover } from '../Popover';
import styles from './RangePicker.module.css';

/** A span of days: both ends as "yyyy-mm-dd", or null while an end is not set. */
export interface DateRange {
  /** The first day. */
  start: ISODate | null;
  /** The last day. */
  end: ISODate | null;
}

export interface RangePickerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue' | 'children'> {
  /** The printed name above the row, such as "Stay". It is required, because it also names the group of fields. */
  label: ReactNode;
  /** The range when controlled. Pass it with `onValueChange`. An end that is not a real "yyyy-mm-dd" day counts as not set. */
  value?: DateRange;
  /** The range to start with when you do not control it. */
  defaultValue?: DateRange;
  /** Called with the new range when a day is chosen in the Calendar or a typed date is accepted. The first day chosen calls it with `end: null`. The ends are always in order. */
  onValueChange?: (value: DateRange) => void;
  /** The earliest day that can be chosen or typed, "yyyy-mm-dd". */
  min?: ISODate;
  /** The latest day that can be chosen or typed, "yyyy-mm-dd". */
  max?: ISODate;
  /** Return true for a day that cannot be chosen or typed, such as a day already booked. A range may still run across such a day. */
  isDateDisabled?: (date: ISODate) => boolean;
  /** The first column of the Calendar's week: 0 is Sunday, 1 is Monday, up to 6. Default 1. */
  weekStart?: number;
  /** A BCP 47 tag such as "th" or "de" for the Calendar's month and weekday words. The typed dates stay "yyyy-mm-dd". Default "en". */
  locale?: string;
  /** The day to treat as today, "yyyy-mm-dd". Defaults to the visitor's own date. */
  today?: ISODate;
  /** A short line printed under the row, for example the longest stay. */
  hint?: ReactNode;
  /** The problem with the pair of dates. When set, it is printed under the row with a glyph and read out with the group. */
  error?: ReactNode;
  /** Neither well nor the calendar key can be used. */
  disabled?: boolean;
  /** The dates can be read but not changed, and the calendar key does not open. */
  readOnly?: boolean;
  /** Both dates must be set before the form is sent. */
  required?: boolean;
  /** The name of a hidden form field that carries the start as "yyyy-mm-dd". */
  startName?: string;
  /** The name of a hidden form field that carries the end as "yyyy-mm-dd". */
  endName?: string;
  /** The printed name above the start well. Default "Start". */
  startLabel?: string;
  /** The printed name above the end well. Default "End". */
  endLabel?: string;
  /** The accessible name of the calendar key. Default "Choose dates". */
  openLabel?: string;
  /** The accessible name of the close key on the calendar panel. Defaults to the built-in word "Close". */
  closeLabel?: string;
  /** The hint shown in an empty well. Default "yyyy-mm-dd". */
  placeholder?: string;
  /** Printed when a typed date is not a real "yyyy-mm-dd" day. Default "Enter a date as yyyy-mm-dd." */
  invalidMessage?: string;
  /** Printed when a typed date is outside `min` and `max` or blocked by `isDateDisabled`. Default "That date is not available." */
  unavailableMessage?: string;
  /** Said under the Calendar while the first day is still to choose. Default "Choose the first day." */
  pickStartMessage?: string;
  /** Said under the Calendar once the first day is chosen. Default "Now choose the last day." */
  pickEndMessage?: string;
  /** The name of the Calendar's previous month key. Defaults to the Calendar's own word. */
  previousLabel?: string;
  /** The name of the Calendar's next month key. Defaults to the Calendar's own word. */
  nextLabel?: string;
  /** The words added to a day's name inside the range, for another language. */
  rangeLabels?: CalendarRangeLabels;
  /** The name read out for a day in the Calendar. Defaults to a full Intl date. */
  dayLabel?: (date: ISODate) => string;
  /** Class name for the group. */
  className?: string;
}

const EMPTY: DateRange = { start: null, end: null };
const real = (iso: ISODate | null | undefined): ISODate | null => (parseISODate(iso) ? iso! : null);

/** The panel puts focus on the Calendar's one tab-stop day as soon as it opens. */
function Panel({ children }: { children: ReactNode }) {
  const node = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    node.current?.querySelector<HTMLElement>('[data-date][tabindex="0"]')?.focus({ preventScroll: true });
  }, []);
  return <div ref={node} className={styles.panel}>{children}</div>;
}

/** Two recessed wells for a start and an end day, joined by an ink bar, and a round key that opens the Calendar. In the Calendar the two end days sit in windows and the days between are ruled in a strip, so the span is told by shape. Dates are typed as "yyyy-mm-dd". */
export const RangePicker = forwardRef<HTMLDivElement, RangePickerProps>(function RangePicker(
  {
    label, value, defaultValue, onValueChange, min, max, isDateDisabled, weekStart = 1, locale = 'en', today,
    hint, error, disabled = false, readOnly = false, required = false, startName, endName,
    startLabel = messages.rangePicker.start, endLabel = messages.rangePicker.end, openLabel = messages.rangePicker.openCalendar,
    closeLabel, placeholder = messages.rangePicker.format,
    invalidMessage = messages.rangePicker.invalidDate, unavailableMessage = messages.rangePicker.unavailableDate,
    pickStartMessage = messages.rangePicker.pickStart, pickEndMessage = messages.rangePicker.pickEnd,
    previousLabel, nextLabel, rangeLabels, dayLabel, className, ...rest
  },
  ref,
) {
  const id = useId();
  const labelId = `${id}-label`;
  const noteId = `${id}-note`;
  const problemId = `${id}-problem`;
  const keyRef = useRef<HTMLButtonElement | null>(null);

  const [own, setOwn] = useState<DateRange>(defaultValue ?? EMPTY);
  const source = value ?? own;
  const start = real(source.start);
  const end = real(source.end);

  const lo = real(min) ?? undefined;
  const hi = real(max) ?? undefined;
  const off = (iso: ISODate) => (lo != null && compareISODate(iso, lo) < 0) || (hi != null && compareISODate(iso, hi) > 0) || !!isDateDisabled?.(iso);

  const change = (next: DateRange) => {
    if (value === undefined) setOwn(next);
    onValueChange?.(next);
  };

  // what is printed in the wells; it follows the value, and holds what is being typed until it is accepted
  const [text, setText] = useState({ start: start ?? '', end: end ?? '' });
  const [problem, setProblem] = useState<{ start: string | null; end: string | null }>({ start: null, end: null });
  useEffect(() => {
    setText({ start: start ?? '', end: end ?? '' });
    setProblem({ start: null, end: null });
  }, [start, end]);

  const commit = (which: 'start' | 'end') => {
    const raw = text[which].trim();
    if (raw === ((which === 'start' ? start : end) ?? '')) return;
    const set = (p: string | null) => setProblem((q) => ({ ...q, [which]: p }));
    if (raw === '') { set(null); change({ start, end, [which]: null }); return; }
    if (!parseISODate(raw)) { set(invalidMessage); return; }
    if (off(raw)) { set(unavailableMessage); return; }
    set(null);
    setText((t) => ({ ...t, [which]: raw }));
    let next: DateRange = { start, end, [which]: raw };
    if (next.start && next.end && compareISODate(next.start, next.end) > 0) next = { start: next.end, end: next.start };
    change(next);
  };
  const onWellKey = (which: 'start' | 'end') => (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') commit(which);
  };

  // the calendar: the first press sets the start, the second sets the end, and the panel then closes
  const [open, setOpen] = useState(false);
  const [anchor, setAnchor] = useState<ISODate | null>(null);
  const [hover, setHover] = useState<ISODate | null>(null);
  const reset = () => { setAnchor(null); setHover(null); };
  const onOpenChange = (next: boolean) => { setOpen(next); reset(); };
  const pick = (iso: ISODate) => {
    if (anchor == null) {
      setAnchor(iso);
      change({ start: iso, end: null });
      return;
    }
    const [a, b] = compareISODate(iso, anchor) < 0 ? [iso, anchor] : [anchor, iso];
    change({ start: a, end: b });
    reset();
    setOpen(false);
    keyRef.current?.focus();
  };

  const todayIso = real(today) ?? todayISO();
  const shown = anchor != null
    ? { start: anchor, end: hover ?? anchor, preview: true }
    : { start, end };
  const openOn = monthOf(start ?? end ?? clampISODate(todayIso, lo, hi));

  const problems: ReactNode[] = [];
  if (error != null && error !== false && error !== '') problems.push(error);
  if (problem.start) problems.push(`${startLabel}: ${problem.start}`);
  if (problem.end) problems.push(`${endLabel}: ${problem.end}`);
  const inactive = disabled || readOnly;
  const described = [hint != null ? noteId : null, problems.length ? problemId : null].filter(Boolean).join(' ') || undefined;

  return (
    <div
      ref={ref}
      role="group"
      aria-labelledby={labelId}
      aria-describedby={described}
      data-component="RangePicker"
      data-disabled={disabled || undefined}
      className={cx(styles.root, className)}
      {...rest}
    >
      <span id={labelId} className={styles.label}>{label}</span>
      <div className={styles.row}>
        <Input
          label={startLabel}
          value={text.start}
          placeholder={placeholder}
          inputMode="numeric"
          autoComplete="off"
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          aria-invalid={problem.start ? true : undefined}
          aria-describedby={problem.start ? problemId : undefined}
          onChange={(e) => setText((t) => ({ ...t, start: e.target.value }))}
          onBlur={() => commit('start')}
          onKeyDown={onWellKey('start')}
        />
        <span className={styles.join} aria-hidden="true" />
        <Input
          label={endLabel}
          value={text.end}
          placeholder={placeholder}
          inputMode="numeric"
          autoComplete="off"
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          aria-invalid={problem.end ? true : undefined}
          aria-describedby={problem.end ? problemId : undefined}
          onChange={(e) => setText((t) => ({ ...t, end: e.target.value }))}
          onBlur={() => commit('end')}
          onKeyDown={onWellKey('end')}
        />
        <Popover
          ref={keyRef}
          label={openLabel}
          icon={<Icon name="schedule" />}
          closeLabel={closeLabel}
          open={open}
          onOpenChange={onOpenChange}
          disabled={inactive}
          align="end"
        >
          <Panel>
            <Calendar
              value={null}
              onValueChange={pick}
              range={shown}
              onDayHover={anchor != null ? setHover : undefined}
              rangeLabels={rangeLabels}
              defaultMonth={openOn}
              min={lo}
              max={hi}
              isDateDisabled={isDateDisabled}
              weekStart={weekStart}
              locale={locale}
              today={todayIso}
              dayLabel={dayLabel}
              previousLabel={previousLabel}
              nextLabel={nextLabel}
            />
            <p className={styles.status} aria-live="polite">{anchor != null ? pickEndMessage : pickStartMessage}</p>
          </Panel>
        </Popover>
      </div>
      {hint != null && <p id={noteId} className={styles.hint}>{hint}</p>}
      {problems.length > 0 && (
        <div id={problemId}>
          {problems.map((p, i) => (
            <p key={i} className={styles.error}>
              <Icon name="critical" size="sm" className={styles.glyph} />
              <span>{p}</span>
            </p>
          ))}
        </div>
      )}
      {startName && <input type="hidden" name={startName} value={start ?? ''} />}
      {endName && <input type="hidden" name={endName} value={end ?? ''} />}
    </div>
  );
});
