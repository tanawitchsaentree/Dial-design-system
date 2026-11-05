import { forwardRef, useCallback, useId, useRef, useState, type CSSProperties, type InputHTMLAttributes, type KeyboardEvent, type ReactNode } from 'react';
import { cx } from '../../cx';
import { messages } from '../../messages';
import { usePresence } from '../../presence';
import { Icon } from '../Icon';
import { VisuallyHidden } from '../VisuallyHidden';
import styles from './SearchInput.module.css';

export type SearchInputSize = 'md' | 'lg';

export interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  /** The printed name above the well. It is required, because it is also the field's accessible name, which `placeholder` cannot be. */
  label: ReactNode;
  /** A short line printed under the well that says what can be searched, for example "Rooms and devices". */
  hint?: ReactNode;
  /** The problem with the current query. When set, the field is marked invalid and the message is printed under the well with a glyph. */
  error?: ReactNode;
  /** `md` (default) is a 44px well; `lg` is a 52px well with larger text, for the main field of a phone sheet. */
  size?: SearchInputSize;
  /** Called when the person presses Enter in the field, with the current text. It is not called while an input method (Thai, Japanese, Chinese) is still composing. */
  onSearch?: (value: string, event: KeyboardEvent<HTMLInputElement>) => void;
  /** Called after the text is cleared by the Clear key or by Escape. The field's `onChange` also fires, with an empty value. */
  onClear?: () => void;
  /** The word printed on the Clear key. Pass your own for another language. Defaults to "Clear". */
  clearLabel?: string;
  /** Wraps the field in a `search` landmark named by the label, so assistive tech can jump to it. Use it once per page, on the field that searches the page or the site. Default false. */
  landmark?: boolean;
  /** The number of matches for the current query. When it changes, the new number is read out politely, for example "12 results", without moving focus. Leave it unset for no announcement. */
  resultsCount?: number;
  /** Builds the announced words from the count, for another language. Defaults to "No results", "1 result" and "n results". */
  resultsText?: (count: number) => string;
  /** Class name for the outer wrapper (label, well and messages). */
  className?: string;
  /** Inline style for the outer wrapper. */
  style?: CSSProperties;
}

/** A search field: the Input well with a printed search mark, a Clear key that shows with text, Enter to search and Escape to clear. */
export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(function SearchInput(
  {
    label, hint, error, size = 'md', onSearch, onClear, clearLabel = messages.searchInput.clear, landmark = false,
    resultsCount, resultsText = messages.searchInput.results, id, className, style, disabled, readOnly,
    value, defaultValue, onChange, onKeyDown, 'aria-describedby': describedBy, ...rest
  },
  ref,
) {
  const auto = useId();
  const fieldId = id ?? `${auto}-field`;
  const labelId = `${auto}-label`;
  const hintId = `${auto}-hint`;
  const errorId = `${auto}-error`;
  const invalid = error != null && error !== false && error !== '';
  const described = [hint != null ? hintId : null, invalid ? errorId : null, describedBy].filter(Boolean).join(' ') || undefined;

  const node = useRef<HTMLInputElement | null>(null);
  const setRef = useCallback((el: HTMLInputElement | null) => {
    node.current = el;
    if (typeof ref === 'function') ref(el);
    else if (ref) ref.current = el;
  }, [ref]);
  // the Clear key needs to know whether there is text, in controlled and uncontrolled use alike
  const [typed, setTyped] = useState(String(defaultValue ?? ''));
  const text = value !== undefined ? String(value) : typed;
  const canClear = text !== '' && !disabled && !readOnly;
  const key = usePresence<HTMLButtonElement>(canClear);

  // set the value the way a keystroke would, so a controlled parent hears onChange with ''
  const clear = () => {
    const el = node.current;
    if (!el) return;
    const set = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set;
    set?.call(el, '');
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.focus();
    onClear?.();
  };

  return (
    <div
      data-component="SearchInput"
      data-invalid={invalid || undefined}
      data-disabled={disabled || undefined}
      role={landmark ? 'search' : undefined}
      aria-labelledby={landmark ? labelId : undefined}
      className={cx(styles.root, styles[size], className)}
      style={style}
    >
      <label id={labelId} className={styles.label} htmlFor={fieldId}>{label}</label>
      <div className={styles.well}>
        {/* dial's one icon language, the dot matrix (R-005); the label already names the field */}
        <Icon name="search" size="md" className={styles.mark} />
        <input
          ref={setRef}
          id={fieldId}
          type="search"
          enterKeyHint="search"
          className={styles.field}
          disabled={disabled}
          readOnly={readOnly}
          value={value}
          defaultValue={defaultValue}
          aria-invalid={invalid || undefined}
          aria-describedby={described}
          onChange={(e) => { setTyped(e.target.value); onChange?.(e); }}
          onKeyDown={(e) => {
            onKeyDown?.(e);
            if (e.defaultPrevented || e.nativeEvent.isComposing) return;
            if (e.key === 'Enter') onSearch?.(e.currentTarget.value, e);
            // Escape clears first; with nothing to clear it passes on, so a Dialog around the field still closes
            else if (e.key === 'Escape' && e.currentTarget.value !== '' && !readOnly) { e.preventDefault(); e.stopPropagation(); clear(); }
          }}
          {...rest}
        />
        {key.mounted && (
          <button
            ref={key.ref}
            type="button"
            className={styles.clear}
            data-state={key.state}
            aria-controls={fieldId}
            tabIndex={key.state === 'closing' ? -1 : undefined}
            onClick={clear}
          >
            {clearLabel}
          </button>
        )}
      </div>
      {hint != null && <p id={hintId} className={styles.hint}>{hint}</p>}
      {invalid && (
        <p id={errorId} className={styles.error}>
          <Icon name="critical" size="sm" className={styles.glyph} />
          <span>{error}</span>
        </p>
      )}
      <VisuallyHidden role="status" aria-live="polite">{resultsCount != null ? resultsText(resultsCount) : ''}</VisuallyHidden>
    </div>
  );
});
