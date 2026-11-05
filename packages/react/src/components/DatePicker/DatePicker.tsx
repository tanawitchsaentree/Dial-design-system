import {
  forwardRef,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent,
  type InputHTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { cx } from '../../cx';
import { messages } from '../../messages';
import { Icon } from '../Icon';
import { Popover } from '../Popover';
import { Calendar, compareISODate, parseISODate, todayISO, type ISODate } from '../Calendar';
import { dateShape, readDate } from './parse';
import styles from './DatePicker.module.css';

export interface DatePickerProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type' | 'value' | 'defaultValue' | 'min' | 'max' | 'onChange' | 'readOnly'> {
  /** The printed name above the window. It is required, because it is also the field's accessible name. */
  label: ReactNode;
  /** The chosen day as "yyyy-mm-dd", or null for none. Pass it with `onValueChange` to control the picker yourself. */
  value?: ISODate | null;
  /** The day to start on when you do not control it. */
  defaultValue?: ISODate | null;
  /** Called with the day, "yyyy-mm-dd", or null when the field is cleared. It fires when a typed date is committed (Enter or leaving the field) and when a day is chosen on the Calendar. */
  onValueChange?: (value: ISODate | null) => void;
  /** The earliest day that can be chosen, "yyyy-mm-dd". A typed date before it is refused. */
  min?: ISODate;
  /** The latest day that can be chosen, "yyyy-mm-dd". A typed date after it is refused. */
  max?: ISODate;
  /** Return true for a day that cannot be chosen, such as a weekend or a day already booked. */
  isDateDisabled?: (date: ISODate) => boolean;
  /** The first column of the Calendar week: 0 is Sunday, 1 is Monday, up to 6. Default 1. */
  weekStart?: number;
  /** A BCP 47 tag such as "th" or "de". It sets the order a typed date is read in and the words on the Calendar. Default "en". */
  locale?: string;
  /** The day to treat as today on the Calendar, "yyyy-mm-dd". Defaults to the visitor's own date. */
  today?: ISODate;
  /** A short line under the row. It defaults to the accepted formats. Pass `false` to print none. */
  hint?: ReactNode;
  /** The problem with the current value. When set, the field is marked invalid and the message is printed under the row with a glyph. A date the picker itself refuses prints its own message when you leave this out. */
  error?: ReactNode;
  /** The name of the calendar key and of its panel. Pass your own for another language. Defaults to "Choose date". */
  chooseLabel?: string;
  /** The words used to print the format: the day, month and year parts. Pass your own for another language. Defaults to dd, mm and yyyy. */
  formatWords?: { day: string; month: string; year: string };
  /** The message for text that is not a real date. It receives the format in the locale's order and in ISO. */
  invalidMessage?: (pattern: string, iso: string) => string;
  /** The message for a real date that is before `min`, after `max` or blocked by `isDateDisabled`. */
  unavailableMessage?: string;
  /** The text can be read and copied but not changed, and the calendar key is off. */
  readOnly?: boolean;
  /** When set, a hidden field with this name carries the chosen day as "yyyy-mm-dd" in a form. */
  name?: string;
  /** Class name for the outer wrapper (label, row and message). */
  className?: string;
  /** Inline style for the outer wrapper. */
  style?: CSSProperties;
}

type Problem = 'invalid' | 'unavailable' | null;

/** A date field: a recessed window that takes a typed date, with a round key beside it that opens the Calendar on a small plastic panel. */
export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(function DatePicker(
  {
    label, value, defaultValue = null, onValueChange, min, max, isDateDisabled, weekStart = 1, locale = 'en', today,
    hint, error, chooseLabel = messages.datePicker.choose, formatWords, invalidMessage, unavailableMessage = messages.datePicker.unavailable,
    readOnly = false, disabled = false, name, id, className, style, onBlur, onKeyDown, 'aria-describedby': describedBy, ...rest
  },
  ref,
) {
  const auto = useId();
  const fieldId = id ?? `${auto}-field`;
  const hintId = `${auto}-hint`;
  const errorId = `${auto}-error`;
  const words = formatWords ?? { day: messages.datePicker.day, month: messages.datePicker.month, year: messages.datePicker.year };
  const shape = useMemo(() => dateShape(locale), [locale]);
  const pattern = shape.pattern(words);
  const isoPattern = `${words.year}-${words.month}-${words.day}`;

  const [own, setOwn] = useState<ISODate | null>(defaultValue);
  const raw = value !== undefined ? value : own;
  const committed = parseISODate(raw) ? raw : null;
  // text the person is typing; null while the field simply shows the committed day
  const [draft, setDraft] = useState<string | null>(null);
  const [problem, setProblem] = useState<Problem>(null);
  const [open, setOpen] = useState(false);
  const text = draft ?? (committed ? shape.show(committed) : '');

  const keyRef = useRef<HTMLButtonElement | null>(null);
  const sheetRef = useRef<HTMLDivElement | null>(null);

  const refused = (iso: ISODate) =>
    (min != null && parseISODate(min) != null && compareISODate(iso, min) < 0) ||
    (max != null && parseISODate(max) != null && compareISODate(iso, max) > 0) ||
    !!isDateDisabled?.(iso);

  const setValue = (next: ISODate | null) => {
    if (value === undefined) setOwn(next);
    if (next !== committed) onValueChange?.(next);
  };

  const commit = (): boolean => {
    if (draft === null) return true;
    const read = readDate(draft, shape.order);
    if (read.kind === 'empty') { setValue(null); setDraft(null); setProblem(null); return true; }
    if (read.kind === 'invalid') { setProblem('invalid'); return false; }
    if (refused(read.iso)) { setProblem('unavailable'); return false; }
    setValue(read.iso);
    setDraft(null);
    setProblem(null);
    return true;
  };

  const choose = (iso: ISODate) => {
    setValue(iso);
    setDraft(null);
    setProblem(null);
    setOpen(false);
    keyRef.current?.focus();
  };

  // the panel opens with focus on the day the keyboard will walk from
  useEffect(() => {
    if (!open) return;
    sheetRef.current?.querySelector<HTMLElement>('[data-date][tabindex="0"]')?.focus();
  }, [open]);

  // the panel lives on the body inside Popover's own width limit; the month is wider than that limit, so it takes the screen width instead
  const setSheet = (el: HTMLDivElement | null) => {
    sheetRef.current = el;
    const panel = el?.closest<HTMLElement>('[role="dialog"]');
    if (panel) panel.style.maxInlineSize = 'calc(100vw - var(--ds-gap-lg) * 2)';
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    commit();
    onBlur?.(e);
  };
  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(e);
    if (e.defaultPrevented) return;
    if (e.key === 'Enter') {
      if (draft !== null) e.preventDefault();
      commit();
    } else if (e.key === 'ArrowDown' && e.altKey && !disabled && !readOnly) {
      e.preventDefault();
      setOpen(true);
    }
  };

  const given = error != null && error !== false && error !== '';
  const own_message = problem === 'invalid'
    ? (invalidMessage ?? messages.datePicker.invalid)(pattern, isoPattern)
    : problem === 'unavailable' ? unavailableMessage : null;
  const message: ReactNode = given ? error : own_message;
  const invalid = !!message;
  const showHint = hint !== false && hint !== null;
  const hintNode: ReactNode = hint === undefined ? messages.datePicker.format(pattern, isoPattern) : hint;
  const described = [showHint ? hintId : null, invalid ? errorId : null, describedBy].filter(Boolean).join(' ') || undefined;

  return (
    <div
      data-component="DatePicker"
      data-invalid={invalid || undefined}
      data-disabled={disabled || undefined}
      data-readonly={readOnly || undefined}
      className={cx(styles.root, className)}
      style={style}
    >
      <label className={styles.label} htmlFor={fieldId}>{label}</label>
      <div className={styles.row}>
        <div className={styles.well}>
          <input
            ref={ref}
            id={fieldId}
            type="text"
            inputMode="numeric"
            autoComplete="off"
            className={styles.field}
            value={text}
            placeholder={pattern}
            disabled={disabled}
            readOnly={readOnly}
            aria-invalid={invalid || undefined}
            aria-describedby={described}
            onChange={(e) => { setDraft(e.target.value); setProblem(null); }}
            onBlur={handleBlur}
            onKeyDown={handleKey}
            {...rest}
          />
        </div>
        <Popover
          ref={keyRef}
          label={chooseLabel}
          icon={<Icon name="schedule" />}
          className={styles.key}
          open={open}
          onOpenChange={setOpen}
          disabled={disabled || readOnly}
        >
          <div ref={setSheet} className={styles.sheet}>
            <Calendar
              value={committed}
              onValueChange={choose}
              min={min}
              max={max}
              isDateDisabled={isDateDisabled}
              weekStart={weekStart}
              locale={locale}
              today={today ?? todayISO()}
            />
          </div>
        </Popover>
      </div>
      {name != null && <input type="hidden" name={name} value={committed ?? ''} disabled={disabled} />}
      {showHint && <p id={hintId} className={styles.hint}>{hintNode}</p>}
      {invalid && (
        <p id={errorId} className={styles.error}>
          <Icon name="critical" size="sm" className={styles.glyph} />
          <span>{message}</span>
        </p>
      )}
    </div>
  );
});
