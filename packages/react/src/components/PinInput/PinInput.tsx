'use client';
import {
  forwardRef,
  useId,
  useRef,
  useState,
  type ClipboardEvent,
  type CSSProperties,
  type ChangeEvent,
  type FocusEvent,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { cx } from '../../cx';
import { messages } from '../../messages';
import { Icon } from '../Icon';
import styles from './PinInput.module.css';

export type PinInputSize = 'md' | 'lg';

export interface PinInputProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue' | 'children' | 'autoFocus'> {
  /** The printed name above the row. It is required, because it also names the group of cells for assistive tech. */
  label: ReactNode;
  /** The code so far, digits only, when you control it. Pair it with `onValueChange`. */
  value?: string;
  /** The code at the start, when the field keeps its own state. */
  defaultValue?: string;
  /** Called with the new code (digits only, no gaps) each time a digit is typed, pasted, autofilled or removed. */
  onValueChange?: (value: string) => void;
  /** Called once with the full code when the last cell is filled. */
  onComplete?: (value: string) => void;
  /** How many cells stand in the row. Default 6. */
  length?: number;
  /** Show each digit as a dot, for a PIN that someone may be watching. The value is still the digits. */
  mask?: boolean;
  /** A short line printed under the row that says where the code came from or what it is for. */
  hint?: ReactNode;
  /** The problem with the current code. When set, every cell is marked invalid and the message is printed under the row with a glyph. */
  error?: ReactNode;
  /** `md` (default) is a 44px cell; `lg` is a 52px cell with larger figures, for the main code of a phone sheet. */
  size?: PinInputSize;
  /** The form field name. A hidden input carries the whole code under this name when the form is sent. */
  name?: string;
  /** Every cell loses focus and cannot be changed. */
  disabled?: boolean;
  /** The code can be read, selected and copied, but not changed. */
  readOnly?: boolean;
  /** Marks the cells as required in a form. */
  required?: boolean;
  /** Put the focus in the first cell when the field mounts. */
  autoFocus?: boolean;
  /** The name read for one cell. Default "Digit 1 of 6". Pass your own to translate it. */
  cellLabel?: (n: number, total: number) => string;
  /** Class name for the outer wrapper (label, row and message). */
  className?: string;
  /** Inline style for the outer wrapper. */
  style?: CSSProperties;
}

const digits = (s: string) => s.replace(/\D/g, '');

/** A short code field: one recessed window per digit, with auto-advance, Backspace to go back and paste that fills every cell. */
export const PinInput = forwardRef<HTMLDivElement, PinInputProps>(function PinInput(
  {
    label,
    value,
    defaultValue,
    onValueChange,
    onComplete,
    length: lengthProp = 6,
    mask,
    hint,
    error,
    size = 'md',
    name,
    disabled,
    readOnly,
    required,
    autoFocus,
    cellLabel = messages.pinInput.cell,
    id,
    className,
    style,
    'aria-describedby': describedBy,
    ...rest
  },
  ref,
) {
  const length = Math.max(1, Math.floor(lengthProp));
  const auto = useId();
  const rootId = id ?? auto;
  const labelId = `${rootId}-label`;
  const hintId = `${rootId}-hint`;
  const errorId = `${rootId}-error`;
  const invalid = error != null && error !== false && error !== '';
  const described = [hint != null ? hintId : null, invalid ? errorId : null, describedBy].filter(Boolean).join(' ') || undefined;

  const controlled = value !== undefined;
  const [inner, setInner] = useState(() => digits(defaultValue ?? '').slice(0, length));
  const current = (controlled ? digits(value) : inner).slice(0, length);
  // Held in a ref so a key pressed twice before React renders still sees the latest code.
  const codeRef = useRef(current);
  codeRef.current = current;
  const cells = useRef<Array<HTMLInputElement | null>>([]);

  const focusCell = (i: number) => {
    const el = cells.current[Math.min(Math.max(i, 0), length - 1)];
    el?.focus();
  };
  const commit = (next: string) => {
    const prev = codeRef.current;
    const code = next.slice(0, length);
    codeRef.current = code;
    if (code === prev) return;
    if (!controlled) setInner(code);
    onValueChange?.(code);
    if (code.length === length) onComplete?.(code);
  };
  /** Put `typed` into the code from cell `at`, then move to the cell after the last digit placed. */
  const put = (at: number, typed: string) => {
    const code = codeRef.current;
    const start = Math.min(at, code.length);
    const next = (code.slice(0, start) + typed + (typed.length === 1 ? code.slice(start + 1) : '')).slice(0, length);
    commit(next);
    focusCell(start + typed.length);
  };
  const remove = (at: number) => {
    const code = codeRef.current;
    commit(code.slice(0, at) + code.slice(at + 1));
  };

  const onChange = (i: number, e: ChangeEvent<HTMLInputElement>) => {
    if (readOnly || disabled) return;
    const raw = e.target.value;
    const chars = digits(raw);
    const old = codeRef.current[i] ?? '';
    if (raw === '') {
      // a soft keyboard that sends no key event: the cell was emptied
      if (old) remove(i);
      return;
    }
    if (!chars) return;
    // the cell still held its digit, so the typed digit is the one added to it
    // (exactly one digit more than it held); anything longer is a whole code from autofill
    const typed = old && chars.length === 2 ? (chars.startsWith(old) ? chars.slice(1) : chars.slice(0, 1)) : chars;
    put(i, typed);
  };

  const onKeyDown = (i: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const rtl = getComputedStyle(e.currentTarget).direction === 'rtl';
    const last = Math.min(codeRef.current.length, length - 1);
    switch (e.key) {
      case 'Backspace':
        e.preventDefault();
        if (readOnly) return;
        if (i < codeRef.current.length) remove(i);
        else if (i > 0) { remove(i - 1); focusCell(i - 1); }
        break;
      case 'Delete':
        e.preventDefault();
        if (!readOnly && i < codeRef.current.length) remove(i);
        break;
      case 'ArrowLeft':
        e.preventDefault();
        focusCell(rtl ? Math.min(i + 1, last) : i - 1);
        break;
      case 'ArrowRight':
        e.preventDefault();
        focusCell(rtl ? i - 1 : Math.min(i + 1, last));
        break;
      case 'Home':
        e.preventDefault();
        focusCell(0);
        break;
      case 'End':
        e.preventDefault();
        focusCell(last);
        break;
      default:
        // a printable key that is not a digit never reaches the cell
        if (e.key.length === 1 && !/\d/.test(e.key)) e.preventDefault();
    }
  };

  const onPaste = (i: number, e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (readOnly || disabled) return;
    const chars = digits(e.clipboardData.getData('text'));
    if (chars) put(i, chars);
  };

  const onFocus = (i: number, e: FocusEvent<HTMLInputElement>) => {
    // a cell past the first empty one is unreachable: the code grows from the left
    if (i > codeRef.current.length) { focusCell(codeRef.current.length); return; }
    e.currentTarget.select();
  };

  const filled = (i: number) => i < current.length;

  return (
    <div
      ref={ref}
      id={rootId}
      data-component="PinInput"
      data-invalid={invalid || undefined}
      data-disabled={disabled || undefined}
      data-readonly={readOnly || undefined}
      className={cx(styles.root, styles[size], className)}
      style={style}
    >
      <span
        id={labelId}
        className={styles.label}
        onClick={() => { if (!disabled) focusCell(Math.min(codeRef.current.length, length - 1)); }}
      >
        {label}
      </span>
      <div role="group" aria-labelledby={labelId} aria-describedby={described} className={styles.group} {...rest}>
        {Array.from({ length }, (_, i) => (
          <input
            key={i}
            ref={(el) => { cells.current[i] = el; }}
            className={styles.cell}
            type={mask ? 'password' : 'text'}
            inputMode="numeric"
            autoComplete="one-time-code"
            autoCorrect="off"
            spellCheck={false}
            pattern="[0-9]*"
            value={current[i] ?? ''}
            disabled={disabled}
            readOnly={readOnly}
            required={required}
            autoFocus={autoFocus && i === 0}
            data-filled={filled(i) || undefined}
            aria-label={cellLabel(i + 1, length)}
            aria-invalid={invalid || undefined}
            onChange={(e) => onChange(i, e)}
            onKeyDown={(e) => onKeyDown(i, e)}
            onPaste={(e) => onPaste(i, e)}
            onFocus={(e) => onFocus(i, e)}
          />
        ))}
      </div>
      {name != null && <input type="hidden" name={name} value={current} disabled={disabled} />}
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
