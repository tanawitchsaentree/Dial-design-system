import { forwardRef, useId, useState, type ButtonHTMLAttributes, type MouseEvent, type ReactNode } from 'react';
import { cx } from '../../cx';
import styles from './Switch.module.css';

export interface SwitchProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'role' | 'type' | 'aria-checked' | 'defaultChecked' | 'onChange'> {
  /** What the switch turns on or off, printed beside it. It names the switch for assistive tech. Without it, pass `aria-label`. */
  label?: ReactNode;
  /** Word printed at the on end of the groove, such as "On" or "Cook". Printing only; the state is announced by the role. */
  onLabel?: ReactNode;
  /** Word printed at the off end of the groove, such as "Off" or "Warm". Printing only; the state is announced by the role. */
  offLabel?: ReactNode;
  /** Whether the switch is on (controlled). Pair it with `onCheckedChange`. */
  checked?: boolean;
  /** Whether the switch starts on when it is uncontrolled. Defaults to `false`. */
  defaultChecked?: boolean;
  /** Called with the new position each time the switch is thrown by pointer, Space or Enter. */
  onCheckedChange?: (checked: boolean) => void;
  /** Flattens the cap and stops the switch from being thrown. */
  disabled?: boolean;
}

/** A slide switch on the case: a cap thrown along a recessed groove, the positions printed either side and a lamp lit while on. */
export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(function Switch(
  { label, onLabel, offLabel, checked, defaultChecked = false, onCheckedChange, disabled = false, id, className, onClick, ...rest },
  ref,
) {
  const auto = useId();
  const buttonId = id ?? `${auto}-switch`;
  const labelId = `${auto}-label`;
  const [own, setOwn] = useState(defaultChecked);
  const isControlled = checked !== undefined;
  const on = isControlled ? checked : own;

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || disabled) return;
    const next = !on;
    if (!isControlled) setOwn(next);
    onCheckedChange?.(next);
  };

  return (
    <span className={cx(styles.field, className)}>
      {label != null && (
        <label id={labelId} htmlFor={buttonId} className={styles.label}>
          {label}
        </label>
      )}
      <button
        ref={ref}
        id={buttonId}
        type="button"
        role="switch"
        aria-checked={on}
        aria-labelledby={label != null ? labelId : undefined}
        data-component="Switch"
        data-state={on ? 'on' : 'off'}
        disabled={disabled}
        className={styles.root}
        onClick={handleClick}
        {...rest}
      >
        {offLabel != null && <span className={cx(styles.word, styles.off)} aria-hidden="true">{offLabel}</span>}
        <span className={styles.slot} aria-hidden="true">
          <span className={styles.cap} />
        </span>
        {onLabel != null && <span className={cx(styles.word, styles.on)} aria-hidden="true">{onLabel}</span>}
        <span className={styles.lamp} aria-hidden="true" />
      </button>
    </span>
  );
});
