import { forwardRef, useId, type CSSProperties, type InputHTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../cx';
import { Icon } from '../Icon';
import styles from './InputGroup.module.css';

export type InputGroupSize = 'md' | 'lg';

export interface InputGroupProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** The printed name above the well. It is required, because it is also the field's accessible name, which `placeholder` cannot be. */
  label: ReactNode;
  /** What is fixed before the value: a word such as `https://` or `THB`, or an `IconButton`. A plain word is read out with the field; a key keeps its own name. */
  start?: ReactNode;
  /** What is fixed after the value: a word such as `.local` or `/ month`, or an `IconButton` such as Copy. A plain word is read out with the field; a key keeps its own name. */
  end?: ReactNode;
  /** A short line printed under the well that says what to enter, for example the format. */
  hint?: ReactNode;
  /** The problem with the current value. When set, the group is marked invalid and the message is printed under the well with a glyph. */
  error?: ReactNode;
  /** `md` (default) is a 44px well; `lg` is a 52px well with larger text, for the main field of a phone sheet. Use an `IconButton` of the same size as a key. */
  size?: InputGroupSize;
  /** Class name for the outer wrapper (label, well and message). */
  className?: string;
  /** Inline style for the outer wrapper. */
  style?: CSSProperties;
}

const isWord = (node: ReactNode) => typeof node === 'string' || typeof node === 'number';
const has = (node: ReactNode) => node != null && node !== false && node !== '';

/** A text field with a fixed word or key at either end, ruled off inside one recessed well that takes one focus ring. */
export const InputGroup = forwardRef<HTMLInputElement, InputGroupProps>(function InputGroup(
  { label, start, end, hint, error, size = 'md', id, className, style, disabled, type = 'text', 'aria-describedby': describedBy, ...rest },
  ref,
) {
  const auto = useId();
  const fieldId = id ?? `${auto}-field`;
  const startId = `${auto}-start`;
  const endId = `${auto}-end`;
  const hintId = `${auto}-hint`;
  const errorId = `${auto}-error`;
  const invalid = has(error);
  const described =
    [isWord(start) ? startId : null, isWord(end) ? endId : null, hint != null ? hintId : null, invalid ? errorId : null, describedBy]
      .filter(Boolean)
      .join(' ') || undefined;

  return (
    <div
      data-component="InputGroup"
      data-invalid={invalid || undefined}
      data-disabled={disabled || undefined}
      className={cx(styles.root, styles[size], className)}
      style={style}
    >
      <label className={styles.label} htmlFor={fieldId}>{label}</label>
      <div className={styles.well}>
        {has(start) && <span id={startId} className={styles.addon}>{start}</span>}
        <input
          ref={ref}
          id={fieldId}
          type={type}
          className={styles.field}
          disabled={disabled}
          aria-invalid={invalid || undefined}
          aria-describedby={described}
          {...rest}
        />
        {has(end) && <span id={endId} className={styles.addon}>{end}</span>}
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
