import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent,
  type InputHTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
} from 'react';
import { cx } from '../../cx';
import { messages } from '../../messages';
import { Icon } from '../Icon';
import { IconButton } from '../IconButton';
import styles from './NumberInput.module.css';

export type NumberInputSize = 'md' | 'lg';

export interface NumberInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type' | 'value' | 'defaultValue' | 'onChange' | 'min' | 'max' | 'step'> {
  /** The printed name above the row. It is required, because it is also the field's accessible name, which `placeholder` cannot be. */
  label: ReactNode;
  /** The value when controlled. `null` is an empty field. Pair it with `onValueChange`. */
  value?: number | null;
  /** The starting value when uncontrolled. Leave it out for an empty field. */
  defaultValue?: number | null;
  /** Called with the new number, or `null` when the field is emptied, when a key or an arrow steps it and when typed text is committed on blur or Enter. It is not called on every keystroke. */
  onValueChange?: (value: number | null) => void;
  /** The lowest value. Stepping stops here and typed text below it is raised to it on blur. */
  min?: number;
  /** The highest value. Stepping stops here and typed text above it is lowered to it on blur. */
  max?: number;
  /** The distance one key press or ArrowUp / ArrowDown moves. Default 1. It also sets how many decimals the value keeps, so 0.5 keeps one. */
  step?: number;
  /** The distance PageUp and PageDown move. Default ten steps. */
  pageStep?: number;
  /** Fixed number of decimals printed, for example 2 prints `3.00`. By default the value prints as it is, rounded to the decimals of `step`. */
  precision?: number;
  /** A short line printed under the row that says what to enter, for example the range. */
  hint?: ReactNode;
  /** The problem with the current value. When set, the field is marked invalid and the message is printed under the row with a glyph. */
  error?: ReactNode;
  /** `md` (default) is a 44px window between 44px keys; `lg` is 52px with larger figures, for the main number of a phone sheet. */
  size?: NumberInputSize;
  /** A unit printed inside the window after the value, for example `°C` or `min`. It is read out with the field. */
  unit?: ReactNode;
  /** The name of the minus key. Pass your own for another language. */
  decreaseLabel?: string;
  /** The name of the plus key. Pass your own for another language. */
  increaseLabel?: string;
  /** Class name for the outer wrapper (label, row and message). */
  className?: string;
  /** Inline style for the outer wrapper. */
  style?: CSSProperties;
}

const HOLD_DELAY = 400;
const HOLD_EVERY = 80;
const DECIMALS = 10;

const decimalsOf = (n: number) => {
  const s = String(n);
  if (/e-/.test(s)) return Number(s.split('e-')[1]) + (s.split('e-')[0].split('.')[1]?.length ?? 0);
  return s.split('.')[1]?.length ?? 0;
};
const roundTo = (n: number, d: number) => Number(n.toFixed(Math.min(d, DECIMALS)));

type Parsed = { kind: 'empty' } | { kind: 'bad' } | { kind: 'ok'; n: number };
/** Reads typed text: digits with one `.` or `,` as the decimal mark, an optional sign, spaces ignored. */
function parse(text: string): Parsed {
  const t = text.replace(/[\s  ]/g, '').replace(/−/g, '-');
  if (t === '') return { kind: 'empty' };
  const norm = t.includes('.') ? t : t.replace(',', '.');
  if (!/^[+-]?(\d+\.?\d*|\.\d+)$/.test(norm)) return { kind: 'bad' };
  return { kind: 'ok', n: Number(norm) };
}

/** A number field: a recessed window with the figure in tabular numerals, a minus key and a plus key either side. */
export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(function NumberInput(
  {
    label, value: valueProp, defaultValue, onValueChange, min, max, step = 1, pageStep, precision, hint, error, size = 'md', unit,
    decreaseLabel = messages.numberInput.decrease, increaseLabel = messages.numberInput.increase,
    id, className, style, disabled, readOnly, onBlur, onFocus, onKeyDown, inputMode = 'decimal', 'aria-describedby': describedBy, ...rest
  },
  ref,
) {
  const auto = useId();
  const fieldId = id ?? `${auto}-field`;
  const unitId = `${auto}-unit`;
  const hintId = `${auto}-hint`;
  const errorId = `${auto}-error`;
  const invalid = error != null && error !== false && error !== '';

  const controlled = valueProp !== undefined;
  const [inner, setInner] = useState<number | null>(defaultValue ?? null);
  const value = controlled ? valueProp : inner;
  const [draft, setDraft] = useState<string | null>(null);

  const places = precision ?? Math.max(decimalsOf(step), min !== undefined ? decimalsOf(min) : 0);
  const show = (n: number) => (precision !== undefined ? n.toFixed(precision) : String(roundTo(n, places)));
  const clamp = useCallback((n: number) => Math.min(max ?? Infinity, Math.max(min ?? -Infinity, n)), [min, max]);

  // the latest value and settings, so a held key never steps from a stale render
  const live = useRef({ value, draft, step, pageStep, places, clamp, onValueChange, controlled });
  live.current = { value, draft, step, pageStep, places, clamp, onValueChange, controlled };

  const setValue = useCallback((next: number | null) => {
    const l = live.current;
    if (next === l.value) return;
    if (!l.controlled) setInner(next);
    l.value = next;
    l.onValueChange?.(next);
  }, []);

  /** Reads the draft text (if the person was typing) and returns the number to step from. */
  const settle = useCallback((): number | null => {
    const l = live.current;
    if (l.draft === null) return l.value;
    const p = parse(l.draft);
    l.draft = null;
    setDraft(null);
    if (p.kind === 'empty') { setValue(null); return null; }
    if (p.kind === 'bad') return l.value;
    const n = roundTo(l.clamp(p.n), DECIMALS);
    setValue(n);
    return n;
  }, [setValue]);

  const stepBy = useCallback((dir: 1 | -1, amount?: number) => {
    const l = live.current;
    const base = settle();
    const by = amount ?? l.step;
    let next: number;
    if (base === null) next = dir === 1 ? (min ?? by) : (max ?? -by);
    else next = roundTo(base + dir * by, l.places);
    setValue(roundTo(l.clamp(next), l.places));
  }, [settle, setValue, min, max]);

  const timers = useRef<{ wait?: ReturnType<typeof setTimeout>; every?: ReturnType<typeof setInterval> }>({});
  const stopHold = useCallback(() => {
    clearTimeout(timers.current.wait);
    clearInterval(timers.current.every);
    timers.current = {};
    window.removeEventListener('pointerup', stopHold);
    window.removeEventListener('pointercancel', stopHold);
  }, []);
  useEffect(() => stopHold, [stopHold]);

  const startHold = (dir: 1 | -1) => (e: PointerEvent<HTMLButtonElement>) => {
    if (e.button !== 0 || disabled || readOnly) return;
    stepBy(dir);
    window.addEventListener('pointerup', stopHold);
    window.addEventListener('pointercancel', stopHold);
    timers.current.wait = setTimeout(() => { timers.current.every = setInterval(() => stepBy(dir), HOLD_EVERY); }, HOLD_DELAY);
  };
  // a click with no pointer (Enter or Space on the key, a screen reader's press) steps once; a real click was handled on pointer down
  const pressKey = (dir: 1 | -1) => (e: MouseEvent<HTMLButtonElement>) => { if (e.detail === 0) stepBy(dir); };
  const holdFocus = (e: MouseEvent<HTMLButtonElement>) => e.preventDefault();

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(e);
    if (e.defaultPrevented || e.nativeEvent.isComposing || disabled || readOnly) return;
    const page = pageStep ?? step * 10;
    switch (e.key) {
      case 'ArrowUp': e.preventDefault(); stepBy(1); break;
      case 'ArrowDown': e.preventDefault(); stepBy(-1); break;
      case 'PageUp': e.preventDefault(); stepBy(1, page); break;
      case 'PageDown': e.preventDefault(); stepBy(-1, page); break;
      case 'Home': if (min !== undefined) { e.preventDefault(); settle(); setValue(min); } break;
      case 'End': if (max !== undefined) { e.preventDefault(); settle(); setValue(max); } break;
      case 'Enter': settle(); break;
      default:
    }
  };
  const handleBlur = (e: FocusEvent<HTMLInputElement>) => { settle(); onBlur?.(e); };

  const text = draft ?? (value === null ? '' : show(value));
  const atMin = value !== null && min !== undefined && value <= min;
  const atMax = value !== null && max !== undefined && value >= max;
  const described = [unit != null ? unitId : null, hint != null ? hintId : null, invalid ? errorId : null, describedBy].filter(Boolean).join(' ') || undefined;

  return (
    <div
      data-component="NumberInput"
      data-invalid={invalid || undefined}
      data-disabled={disabled || undefined}
      data-readonly={readOnly || undefined}
      className={cx(styles.root, styles[size], className)}
      style={style}
    >
      <label className={styles.label} htmlFor={fieldId}>{label}</label>
      <div className={styles.row}>
        <IconButton
          label={decreaseLabel}
          size={size}
          tabIndex={-1}
          className={styles.key}
          disabled={disabled || readOnly || atMin}
          onMouseDown={holdFocus}
          onPointerDown={startHold(-1)}
          onClick={pressKey(-1)}
        >
          <Icon name="minus" size="md" />
        </IconButton>
        <div className={styles.well}>
          <input
            ref={ref}
            id={fieldId}
            type="text"
            role="spinbutton"
            inputMode={inputMode}
            autoComplete="off"
            spellCheck={false}
            className={styles.field}
            value={text}
            disabled={disabled}
            readOnly={readOnly}
            aria-valuenow={value ?? undefined}
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuetext={value === null ? messages.empty : show(value)}
            aria-invalid={invalid || undefined}
            aria-describedby={described}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            onFocus={onFocus}
            {...rest}
          />
          {unit != null && <span id={unitId} className={styles.unit}>{unit}</span>}
        </div>
        <IconButton
          label={increaseLabel}
          size={size}
          tabIndex={-1}
          className={styles.key}
          disabled={disabled || readOnly || atMax}
          onMouseDown={holdFocus}
          onPointerDown={startHold(1)}
          onClick={pressKey(1)}
        >
          <Icon name="plus" size="md" />
        </IconButton>
      </div>
      {hint != null && <p id={hintId} className={styles.hint}>{hint}</p>}
      {invalid && (
        <p id={errorId} className={styles.error}>
          {/* dial's one icon language, the dot matrix (R-005) */}
          <Icon name="critical" size="sm" className={styles.glyph} />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
});
