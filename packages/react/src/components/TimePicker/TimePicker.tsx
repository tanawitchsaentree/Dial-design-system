import {
  forwardRef,
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type CSSProperties,
  type FocusEvent,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { cx } from '../../cx';
import { IconButton } from '../IconButton';
import styles from './TimePicker.module.css';

export type TimePickerKind = 'segment' | 'text';
export type TimePickerHourCycle = '24' | '12';

export interface TimePickerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue' | 'children'> {
  /** The printed name above the well. It is required, because it also names the group of fields. */
  label: ReactNode;
  /** `segment` (default) draws hour and minute as 7-segment figures, like a clock radio. `text` sets them in the grotesk, for dense forms. */
  kind?: TimePickerKind;
  /** `24` (default) runs the hour through 00 to 23. With `12` the hour stops at 12 and AM and PM are printed in the well. */
  hourCycle?: TimePickerHourCycle;
  /** The time when controlled, as `HH:MM` on the 24 hour clock, or an empty string when it is not set. Pair it with `onValueChange`. */
  value?: string;
  /** The starting time when uncontrolled, as `HH:MM` on the 24 hour clock. Leave it out to start with no time set. */
  defaultValue?: string;
  /** Called with the new time as `HH:MM` whenever a field steps, or with an empty string while hour or minute is not set. */
  onValueChange?: (value: string) => void;
  /** How far the arrow keys and set keys move the minute. Default 1. */
  minuteStep?: number;
  /** Shows the round set keys under hour and minute. Default true for `segment` and false for `text`. */
  keys?: boolean;
  /** A short line printed under the well, for example the time zone or what the time starts. */
  hint?: ReactNode;
  /** The problem with the current time. When set, the fields are marked invalid and the message is printed with a glyph. */
  error?: ReactNode;
  /** The fields cannot be changed and the set keys are not shown. */
  disabled?: boolean;
  /** The time can be read and focused but not changed, and the set keys are not shown. */
  readOnly?: boolean;
  /** The time must be set before the form is sent. */
  required?: boolean;
  /** The name of a hidden form field that carries the time as `HH:MM`. */
  name?: string;
  /** The accessible name of the hour field. Default "Hour". */
  hourLabel?: string;
  /** The accessible name of the minute field. Default "Minute". */
  minuteLabel?: string;
  /** The accessible name of the AM and PM field. Default "AM or PM". */
  periodLabel?: string;
  /** The printed words for the two halves of the day. Default `['AM', 'PM']`. */
  periodWords?: [string, string];
  /** The names of the four set keys, in the order hour down, hour up, minute down, minute up. */
  keyLabels?: [string, string, string, string];
}

type Draft = { h: number | null; m: number | null; pm: boolean };
type Field = 'h' | 'm' | 'p';

const two = (n: number) => String(n).padStart(2, '0');
const parse = (v: string | undefined): Draft => {
  const m = /^(\d{1,2}):(\d{2})$/.exec((v ?? '').trim());
  if (!m) return { h: null, m: null, pm: false };
  const h = Math.min(23, Number(m[1])), mi = Math.min(59, Number(m[2]));
  return { h, m: mi, pm: h >= 12 };
};
const format = (d: Draft) => (d.h === null || d.m === null ? '' : `${two(d.h)}:${two(d.m)}`);
const wrap = (v: number, lo: number, hi: number) => { const span = hi - lo + 1; return ((((v - lo) % span) + span) % span) + lo; };

// Display's segment geometry (viewBox units, height 40, pitch 32), drawn here in ink on the well.
const SEGS: Record<string, string> = { '0': 'abcdef', '1': 'bc', '2': 'abged', '3': 'abgcd', '4': 'fgbc', '5': 'afgcd', '6': 'afgedc', '7': 'abc', '8': 'abcdefg', '9': 'abcdfg', '-': 'g' };
const H = 40, W = 20, T = 4.4, PITCH = 32, M = H / 2, S = T / 2;
const hBar = (x: number, y: number) => `${x + S},${y} ${x + T},${y - S} ${x + W - T},${y - S} ${x + W - S},${y} ${x + W - T},${y + S} ${x + T},${y + S}`;
const vBar = (x: number, y0: number, y1: number) => `${x},${y0 + S} ${x + S},${y0 + T} ${x + S},${y1 - T} ${x},${y1 - S} ${x - S},${y1 - T} ${x - S},${y0 + T}`;
const cellPoints = (x: number): Array<[string, string]> => [
  ['a', hBar(x, S)], ['b', vBar(x + W - S, S, M)], ['c', vBar(x + W - S, M, H - S)], ['d', hBar(x, H - S)],
  ['e', vBar(x + S, M, H - S)], ['f', vBar(x + S, S, M)], ['g', hBar(x, M)],
];
function Figures({ text }: { text: string }) {
  return (
    <svg className={styles.seg} viewBox={`0 0 ${text.length * PITCH - 8} ${H}`} aria-hidden="true" focusable="false">
      {[...text].map((ch, i) => (
        <g key={i}>{cellPoints(2 + i * PITCH).map(([k, pts]) => <polygon key={k} className={(SEGS[ch] ?? '').includes(k) ? styles.on : styles.off} points={pts} />)}</g>
      ))}
    </svg>
  );
}

const icon = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', 'aria-hidden': true, focusable: false } as const;
const minus = <svg {...icon}><path d="M6 12h12" /></svg>;
const plus = <svg {...icon}><path d="M6 12h12M12 6v12" /></svg>;

/** A time of day set in a recessed well: hour and minute are spinbuttons that step with the arrow keys, PageUp and
 *  PageDown, Home and End, typed digits and the round set keys under them. The value is always `HH:MM` on the 24 hour clock. */
export const TimePicker = forwardRef<HTMLDivElement, TimePickerProps>(function TimePicker(
  {
    label, kind = 'segment', hourCycle = '24', value, defaultValue, onValueChange, minuteStep = 1, keys, hint, error,
    disabled = false, readOnly = false, required = false, name, hourLabel = 'Hour', minuteLabel = 'Minute', periodLabel = 'AM or PM',
    periodWords = ['AM', 'PM'], keyLabels = ['Earlier hour', 'Later hour', 'Earlier minute', 'Later minute'],
    className, style, ...rest
  },
  ref,
) {
  const auto = useId();
  const labelId = `${auto}-label`, hintId = `${auto}-hint`, errorId = `${auto}-error`;
  const twelve = hourCycle === '12';
  const invalid = error != null && error !== false && error !== '';
  const showKeys = (keys ?? kind === 'segment') && !disabled && !readOnly;
  const described = [hint != null ? hintId : null, invalid ? errorId : null].filter(Boolean).join(' ') || undefined;

  const [draft, setDraft] = useState<Draft>(() => parse(value ?? defaultValue));
  const latest = useRef(draft);
  latest.current = draft;
  // a controlled value that differs from the draft replaces it; a half-set draft is kept while value stays ''
  useEffect(() => {
    if (value !== undefined && value !== format(latest.current)) setDraft(parse(value));
  }, [value]);

  const refs = { h: useRef<HTMLInputElement>(null), m: useRef<HTMLInputElement>(null), p: useRef<HTMLInputElement>(null) };
  const order: Field[] = twelve ? ['h', 'm', 'p'] : ['h', 'm'];
  const typed = useRef<{ field: Field | null; digits: string }>({ field: null, digits: '' });

  const commit = (next: Draft) => {
    const before = format(latest.current);
    latest.current = next;
    setDraft(next);
    const after = format(next);
    if (after !== before) onValueChange?.(after);
  };
  const setHour = (h: number) => commit({ ...latest.current, h, pm: h >= 12 });
  const setMinute = (m: number) => commit({ ...latest.current, m });
  const setPeriod = (pm: boolean) => {
    const d = latest.current;
    commit({ ...d, pm, h: d.h === null ? null : (d.h % 12) + (pm ? 12 : 0) });
  };
  const hour12 = (h: number) => ((h + 11) % 12) + 1;
  const from12 = (h12: number, pm: boolean) => (h12 % 12) + (pm ? 12 : 0);

  const stepHour = (by: number) => {
    const d = latest.current;
    if (twelve) {
      const cur = d.h === null ? (by > 0 ? 12 : 1) : hour12(d.h);
      setHour(from12(wrap(cur + by, 1, 12), d.h === null ? d.pm : d.h >= 12));
    } else setHour(d.h === null ? (by > 0 ? 0 : 23) : wrap(d.h + by, 0, 23));
  };
  const stepMinute = (by: number) => {
    const d = latest.current;
    if (d.m === null) return setMinute(by > 0 ? 0 : 60 - minuteStep);
    const snapped = by > 0 ? Math.floor(d.m / minuteStep) * minuteStep + minuteStep : Math.ceil(d.m / minuteStep) * minuteStep - minuteStep;
    setMinute(Math.abs(by) === minuteStep ? wrap(snapped, 0, 59) : wrap(d.m + by, 0, 59));
  };

  const move = (from: Field, dir: 1 | -1) => {
    const i = order.indexOf(from) + dir;
    if (i >= 0 && i < order.length) refs[order[i]].current?.focus();
  };

  const typeDigit = (field: Field, digit: number) => {
    const t = typed.current;
    if (t.field !== field) { t.field = field; t.digits = ''; }
    const seq = `${t.digits}${digit}`;
    const d = latest.current;
    if (field === 'h') {
      const top = twelve ? 12 : 23, firstMax = twelve ? 1 : 2;
      const n = Number(seq);
      if (seq.length === 1) {
        if (twelve && digit === 0) { t.digits = seq; return; }
        setHour(twelve ? from12(digit, d.pm) : digit);
        if (digit > firstMax) { t.digits = ''; move('h', 1); } else t.digits = seq;
      } else {
        const v = n >= (twelve ? 1 : 0) && n <= top ? n : digit;
        setHour(twelve ? from12(v, d.pm) : v);
        t.digits = '';
        move('h', 1);
      }
    } else if (field === 'm') {
      if (seq.length === 1) {
        setMinute(digit);
        if (digit > 5) { t.digits = ''; move('m', 1); } else t.digits = seq;
      } else {
        setMinute(Number(seq));
        t.digits = '';
        move('m', 1);
      }
    }
  };

  const onKeyDown = (field: Field) => (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Tab' || e.metaKey || e.ctrlKey || e.altKey) return;
    const rtl = getComputedStyle(e.currentTarget).direction === 'rtl';
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
      move(field, ((e.key === 'ArrowRight') !== rtl ? 1 : -1));
      return;
    }
    if (disabled || readOnly) return;
    const k = e.key;
    let handled = true;
    if (field === 'p') {
      const [am, pm] = periodWords.map((w) => w[0]?.toLowerCase());
      if (k === 'ArrowUp' || k === 'ArrowDown' || k === 'PageUp' || k === 'PageDown') setPeriod(!latest.current.pm);
      else if (k === 'Home') setPeriod(false);
      else if (k === 'End') setPeriod(true);
      else if (k.toLowerCase() === am || k.toLowerCase() === 'a') setPeriod(false);
      else if (k.toLowerCase() === pm || k.toLowerCase() === 'p') setPeriod(true);
      else handled = /^.$/.test(k) || k === 'Backspace' || k === 'Delete';
    } else {
      const step = field === 'h' ? stepHour : stepMinute;
      const one = field === 'h' ? 1 : minuteStep;
      const page = field === 'h' ? 3 : 10;
      if (k === 'ArrowUp') step(one);
      else if (k === 'ArrowDown') step(-one);
      else if (k === 'PageUp') step(page);
      else if (k === 'PageDown') step(-page);
      else if (k === 'Home') field === 'h' ? setHour(twelve ? from12(1, latest.current.pm) : 0) : setMinute(0);
      else if (k === 'End') field === 'h' ? setHour(twelve ? from12(12, latest.current.pm) : 23) : setMinute(59);
      else if (/^[0-9]$/.test(k)) typeDigit(field, Number(k));
      else if (k === 'Backspace' || k === 'Delete') typed.current = { field: null, digits: '' };
      else handled = /^.$/.test(k);
    }
    if (handled) e.preventDefault();
  };

  // phones and pasted text arrive here instead of keydown: only digits (or a or p on the period) count; anything else is dropped
  const onChange = (field: Field) => (e: ChangeEvent<HTMLInputElement>) => {
    if (disabled || readOnly) return;
    const raw = e.currentTarget.value;
    if (field === 'p') {
      const c = raw.trim().slice(-1).toLowerCase();
      if (c === 'a') setPeriod(false);
      else if (c === 'p') setPeriod(true);
      return;
    }
    const digits = raw.replace(/\D/g, '');
    if (digits) typeDigit(field, Number(digits[digits.length - 1]));
  };
  const onBlur = (e: FocusEvent<HTMLInputElement>) => {
    if (!e.currentTarget.closest('[data-component="TimePicker"]')?.contains(e.relatedTarget as Node | null)) typed.current = { field: null, digits: '' };
  };

  const hShown = draft.h === null ? null : twelve ? hour12(draft.h) : draft.h;
  const hText = hShown === null ? '--' : two(hShown);
  const mText = draft.m === null ? '--' : two(draft.m);
  const pm = draft.h === null ? draft.pm : draft.h >= 12;
  const periodWord = periodWords[pm ? 1 : 0];
  const fieldProps = (field: Field) => ({
    ref: refs[field],
    className: styles.field,
    type: 'text' as const,
    inputMode: field === 'p' ? ('text' as const) : ('numeric' as const),
    role: 'spinbutton',
    autoComplete: 'off',
    spellCheck: false,
    disabled,
    readOnly,
    'aria-invalid': invalid || undefined,
    'aria-required': required || undefined,
    'aria-describedby': described,
    onKeyDown: onKeyDown(field),
    onChange: onChange(field),
    onBlur,
  });

  return (
    <div
      ref={ref}
      data-component="TimePicker"
      data-kind={kind}
      data-invalid={invalid || undefined}
      data-disabled={disabled || undefined}
      data-readonly={readOnly || undefined}
      className={cx(styles.root, styles[kind], className)}
      style={style}
      {...rest}
    >
      <span id={labelId} className={styles.label}>{label}</span>
      <div role="group" aria-labelledby={labelId} className={styles.set} style={{ '--tp-cols': twelve ? 4 : 3 } as CSSProperties}>
        <span className={styles.well}>
        <span className={cx(styles.cell, styles.hour)}>
          <input
            {...fieldProps('h')}
            aria-label={hourLabel}
            aria-valuemin={twelve ? 1 : 0}
            aria-valuemax={twelve ? 12 : 23}
            aria-valuenow={hShown ?? undefined}
            aria-valuetext={hShown === null ? 'Not set' : twelve ? `${hShown} ${periodWord}` : two(hShown)}
            value={hText}
          />
          {kind === 'segment' && <Figures text={hText} />}
        </span>
        <span className={styles.colon} aria-hidden="true">
          {kind === 'segment' ? <><span className={styles.dot} /><span className={styles.dot} /></> : ':'}
        </span>
        <span className={cx(styles.cell, styles.minute)}>
          <input
            {...fieldProps('m')}
            aria-label={minuteLabel}
            aria-valuemin={0}
            aria-valuemax={59}
            aria-valuenow={draft.m ?? undefined}
            aria-valuetext={draft.m === null ? 'Not set' : two(draft.m)}
            value={mText}
          />
          {kind === 'segment' && <Figures text={mText} />}
        </span>
        {twelve && (
          <span className={cx(styles.cell, styles.period)}>
            <input
              {...fieldProps('p')}
              aria-label={periodLabel}
              aria-valuemin={0}
              aria-valuemax={1}
              aria-valuenow={pm ? 1 : 0}
              aria-valuetext={periodWord}
              value={periodWord}
            />
            <span className={styles.words} aria-hidden="true">
              <span className={cx(styles.word, !pm && styles.lit)}>{periodWords[0]}</span>
              <span className={cx(styles.word, pm && styles.lit)}>{periodWords[1]}</span>
            </span>
          </span>
        )}
        </span>
        {showKeys && (
          <span className={styles.keys}>
            <span className={styles.keysHour}>
              <IconButton label={keyLabels[0]} tabIndex={-1} onClick={() => stepHour(-1)}>{minus}</IconButton>
              <IconButton label={keyLabels[1]} tabIndex={-1} onClick={() => stepHour(1)}>{plus}</IconButton>
            </span>
            <span className={styles.keysMinute}>
              <IconButton label={keyLabels[2]} tabIndex={-1} onClick={() => stepMinute(-minuteStep)}>{minus}</IconButton>
              <IconButton label={keyLabels[3]} tabIndex={-1} onClick={() => stepMinute(minuteStep)}>{plus}</IconButton>
            </span>
          </span>
        )}
      </div>
      {hint != null && <p id={hintId} className={styles.hint}>{hint}</p>}
      {invalid && (
        <p id={errorId} className={styles.error}>
          <svg className={styles.glyph} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true" focusable="false">
            <circle cx="8" cy="8" r="6.5" />
            <path d="M8 4.5v4M8 11.25v.01" />
          </svg>
          <span>{error}</span>
        </p>
      )}
      {name && <input type="hidden" name={name} value={format(draft)} />}
    </div>
  );
});
