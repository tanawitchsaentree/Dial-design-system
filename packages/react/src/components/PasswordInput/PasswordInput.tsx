'use client';
import { forwardRef, useCallback, useId, useState, type CSSProperties, type InputHTMLAttributes, type MouseEvent, type ReactNode } from 'react';
import { cx } from '../../cx';
import { messages } from '../../messages';
import { HelperText } from '../HelperText';
import { Icon } from '../Icon';
import { IconButton } from '../IconButton';
import styles from './PasswordInput.module.css';

export type PasswordInputSize = 'md' | 'lg';
export type PasswordStrength = 'weak' | 'fair' | 'strong';

export interface PasswordInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type' | 'autoComplete'> {
  /** The printed name above the well. It is required, because it is also the field's accessible name, which `placeholder` cannot be. */
  label: ReactNode;
  /** A short line printed under the row that says what to enter, for example the rules for a new password. */
  hint?: ReactNode;
  /** The problem with the current value. When set, the field is marked invalid and the message is printed under the row with a glyph. */
  error?: ReactNode;
  /** `md` (default) is a 44px well beside a 44px key; `lg` is 52px with larger text, for the main field of a phone sheet. */
  size?: PasswordInputSize;
  /** Whether the characters are shown, when controlled. Pair it with `onShownChange`. */
  shown?: boolean;
  /** Whether the characters start shown, when uncontrolled. Default false. */
  defaultShown?: boolean;
  /** Called with the new state when the key is pressed. */
  onShownChange?: (shown: boolean) => void;
  /**
   * Tells the browser what the field is for. Use `new-password` on a sign-up or change form so a password manager offers a new one,
   * and `current-password` (default) on a sign-in form so it fills the saved one.
   */
  autoComplete?: 'current-password' | 'new-password' | 'off';
  /**
   * A strength reading you computed, printed under the row as a word in a polite live region.
   * Leave it out for no line. Pass `null` to keep the empty line in the page, so the first reading is announced.
   * The component does not judge the password; it only prints your verdict.
   */
  strength?: PasswordStrength | null;
  /** Replaces the whole strength line, for another language, for example `ความแข็งแรง: ปานกลาง`. By default it reads "Strength: weak". */
  strengthText?: ReactNode;
  /** The name of the key. It stays the same in both states; `aria-pressed` carries the state. Pass your own for another language. Default "Show password". */
  toggleLabel?: string;
  /** The word printed in the well while the characters are shown. Default "Shown". */
  shownWord?: string;
  /** The word printed in the well while the characters are hidden. Default "Hidden". */
  hiddenWord?: string;
  /** Class name for the outer wrapper (label, row and messages). */
  className?: string;
  /** Inline style for the outer wrapper. */
  style?: CSSProperties;
}

/** A password field: a recessed well for a secret, with a round key beside it that latches down to show the characters and a printed word for the state. */
export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(function PasswordInput(
  {
    label, hint, error, size = 'md', shown: shownProp, defaultShown = false, onShownChange, autoComplete = 'current-password',
    strength, strengthText, toggleLabel = messages.passwordInput.toggle, shownWord = messages.passwordInput.shown, hiddenWord = messages.passwordInput.hidden,
    id, className, style, disabled, readOnly, 'aria-describedby': describedBy, ...rest
  },
  ref,
) {
  const auto = useId();
  const fieldId = id ?? `${auto}-field`;
  const hintId = `${auto}-hint`;
  const errorId = `${auto}-error`;
  const strengthId = `${auto}-strength`;
  const invalid = error != null && error !== false && error !== '';

  const controlled = shownProp !== undefined;
  const [inner, setInner] = useState(defaultShown);
  const shown = controlled ? shownProp : inner;
  const toggle = useCallback(() => {
    if (!controlled) setInner(!shown);
    onShownChange?.(!shown);
  }, [controlled, shown, onShownChange]);
  // keep the caret in the field when the key is pressed with a pointer; a keyboard press never fires mousedown
  const holdFocus = (e: MouseEvent<HTMLButtonElement>) => e.preventDefault();

  const hasStrength = strength !== undefined;
  const strengthLine = strength == null ? null : strengthText ?? messages.passwordInput.strength(messages.passwordInput[strength]);
  const described = [hint != null ? hintId : null, invalid ? errorId : null, hasStrength ? strengthId : null, describedBy].filter(Boolean).join(' ') || undefined;

  return (
    <div
      data-component="PasswordInput"
      data-shown={shown || undefined}
      data-invalid={invalid || undefined}
      data-disabled={disabled || undefined}
      data-readonly={readOnly || undefined}
      className={cx(styles.root, styles[size], className)}
      style={style}
    >
      <label className={styles.label} htmlFor={fieldId}>{label}</label>
      <div className={styles.row}>
        <div className={styles.well}>
          <input
            ref={ref}
            id={fieldId}
            type={shown ? 'text' : 'password'}
            autoComplete={autoComplete}
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            className={styles.field}
            disabled={disabled}
            readOnly={readOnly}
            aria-invalid={invalid || undefined}
            aria-describedby={described}
            {...rest}
          />
          {/* the state in words; aria-pressed on the key carries it for assistive tech, so this is not read twice */}
          <span className={styles.word} aria-hidden="true">{shown ? shownWord : hiddenWord}</span>
        </div>
        <IconButton
          label={toggleLabel}
          size={size}
          className={styles.key}
          disabled={disabled}
          aria-pressed={shown}
          aria-controls={fieldId}
          onMouseDown={holdFocus}
          onClick={toggle}
        >
          {/* dial's one icon language, the dot matrix (R-005): the lock opens while the characters are shown */}
          <Icon name={shown ? 'unlock' : 'lock'} size="md" />
        </IconButton>
      </div>
      {hint != null && <HelperText id={hintId}>{hint}</HelperText>}
      {invalid && <HelperText id={errorId} tone="error">{error}</HelperText>}
      {hasStrength && (
        <div id={strengthId} className={styles.strength} aria-live="polite">
          {strengthLine != null && <HelperText>{strengthLine}</HelperText>}
        </div>
      )}
    </div>
  );
});
