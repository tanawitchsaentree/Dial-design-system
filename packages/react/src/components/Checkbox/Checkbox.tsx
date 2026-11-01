import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  type ChangeEventHandler,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';
import { cx } from '../../cx';
import styles from './Checkbox.module.css';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size' | 'children' | 'checked' | 'defaultChecked' | 'onChange' | 'disabled'> {
  /** The word printed beside the key. It is the accessible name, and clicking it presses the key. */
  label: ReactNode;
  /** Whether the option is on, when you control it. Pair it with `onChange`. */
  checked?: boolean;
  /** Whether the option starts on, when the checkbox keeps its own state. */
  defaultChecked?: boolean;
  /** Called when the key is pressed by pointer, Space or the label; read `event.target.checked`. */
  onChange?: ChangeEventHandler<HTMLInputElement>;
  /** The key loses its height and cannot be pressed. */
  disabled?: boolean;
  /** Some of the things this option covers are on and some are off. Shows a dash and is announced as mixed. */
  indeterminate?: boolean;
}

/** A small square key with its function printed beside it: press it and a tick in ink appears on its face. */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, indeterminate = false, disabled = false, className, ...rest },
  ref,
) {
  const inner = useRef<HTMLInputElement | null>(null);
  const setRef = useCallback(
    (el: HTMLInputElement | null) => {
      inner.current = el;
      if (typeof ref === 'function') ref(el);
      else if (ref) ref.current = el;
    },
    [ref],
  );
  useEffect(() => {
    if (inner.current) inner.current.indeterminate = indeterminate;
  }, [indeterminate]);

  return (
    <label data-component="Checkbox" data-hit="" data-disabled={disabled || undefined} className={cx(styles.root, className)}>
      <input ref={setRef} type="checkbox" className={styles.input} disabled={disabled} {...rest} />
      <span className={styles.key} aria-hidden="true">
        <svg className={styles.mark} viewBox="0 0 24 24" focusable="false">
          <path className={styles.tick} d="M5 12l5 5 9-10" />
          <path className={styles.dash} d="M6 12h12" />
        </svg>
      </span>
      <span className={styles.label}>{label}</span>
    </label>
  );
});
