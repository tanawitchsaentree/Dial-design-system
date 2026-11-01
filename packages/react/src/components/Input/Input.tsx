import { forwardRef, useId, type CSSProperties, type InputHTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../cx';
import styles from './Input.module.css';

export type InputSize = 'md' | 'lg';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** The printed name above the well. It is required, because it is also the field's accessible name, which `placeholder` cannot be. */
  label: ReactNode;
  /** A short line printed under the well that says what to enter, for example the format. */
  hint?: ReactNode;
  /** The problem with the current value. When set, the field is marked invalid and the message is printed under the well with a glyph. */
  error?: ReactNode;
  /** `md` (default) is a 44px well; `lg` is a 52px well with larger text, for the main field of a phone sheet. */
  size?: InputSize;
  /** A unit printed inside the well after the value, for example `°C` or `min`. It is read out with the field. */
  unit?: ReactNode;
  /** Class name for the outer wrapper (label, well and message). */
  className?: string;
  /** Inline style for the outer wrapper. */
  style?: CSSProperties;
}

/** A text field: a recessed well the full width of its column, with its label printed above on the inset line. */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, hint, error, size = 'md', unit, id, className, style, disabled, type = 'text', 'aria-describedby': describedBy, ...rest },
  ref,
) {
  const auto = useId();
  const fieldId = id ?? `${auto}-field`;
  const unitId = `${auto}-unit`;
  const hintId = `${auto}-hint`;
  const errorId = `${auto}-error`;
  const invalid = error != null && error !== false && error !== '';
  const described = [unit != null ? unitId : null, hint != null ? hintId : null, invalid ? errorId : null, describedBy].filter(Boolean).join(' ') || undefined;

  return (
    <div
      data-component="Input"
      data-invalid={invalid || undefined}
      data-disabled={disabled || undefined}
      className={cx(styles.root, styles[size], className)}
      style={style}
    >
      <label className={styles.label} htmlFor={fieldId}>{label}</label>
      <div className={styles.well}>
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
        {unit != null && <span id={unitId} className={styles.unit}>{unit}</span>}
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
    </div>
  );
});
