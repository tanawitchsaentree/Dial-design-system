import { forwardRef, useId, useState, type CSSProperties, type ReactNode, type TextareaHTMLAttributes } from 'react';
import { cx } from '../../cx';
import { messages } from '../../messages';
import { Icon } from '../Icon';
import styles from './Textarea.module.css';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** The printed name above the well. It is required, because it is also the field's accessible name, which `placeholder` cannot be. */
  label: ReactNode;
  /** A short line printed under the well that says what to write. */
  hint?: ReactNode;
  /** The problem with the current value. When set, the field is marked invalid and the message is printed under the well with a glyph. */
  error?: ReactNode;
  /** Words after the count, for example `characters`. Pass your own for another language. Printed only when `maxLength` is set. */
  countLabel?: string;
  /** Class name for the outer wrapper. */
  className?: string;
  /** Inline style for the outer wrapper. */
  style?: CSSProperties;
}

/** A multi-line text field: the Input well made taller, label printed above, vertical resize only. */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, hint, error, id, className, style, disabled, rows = 4, countLabel = messages.characters, maxLength, value, defaultValue, onChange, 'aria-describedby': describedBy, ...rest },
  ref,
) {
  const auto = useId();
  const [typed, setTyped] = useState(String(defaultValue ?? '').length);
  const length = value !== undefined ? String(value).length : typed;
  const countId = `${auto}-count`;
  const fieldId = id ?? `${auto}-field`;
  const hintId = `${auto}-hint`;
  const errorId = `${auto}-error`;
  const invalid = error != null && error !== false && error !== '';
  const described = [hint != null ? hintId : null, maxLength != null ? countId : null, invalid ? errorId : null, describedBy].filter(Boolean).join(' ') || undefined;

  return (
    <div data-component="Textarea" data-invalid={invalid || undefined} data-disabled={disabled || undefined} className={cx(styles.root, className)} style={style}>
      <label className={styles.label} htmlFor={fieldId}>{label}</label>
      <div className={styles.well}>
        <textarea ref={ref} id={fieldId} rows={rows} className={styles.field} disabled={disabled} aria-invalid={invalid || undefined} aria-describedby={described} maxLength={maxLength} value={value} defaultValue={defaultValue} onChange={(e) => { setTyped(e.target.value.length); onChange?.(e); }} {...rest} />
      </div>
      {maxLength != null && <p id={countId} className={styles.count}>{length} / {maxLength} {countLabel}</p>}
      {hint != null && <p id={hintId} className={styles.hint}>{hint}</p>}
      {invalid && (
        <p id={errorId} className={styles.error}>
          <Icon name="critical" size="sm" className={styles.glyph} />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
});
