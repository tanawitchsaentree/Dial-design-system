import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cx } from '../../cx';
import styles from './Button.module.css';

export type ButtonKind = 'key' | 'primary';
export type ButtonSize = 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** `key` (default) is a body-coloured key. `primary` is the unit's one orange key; use it once per unit. */
  kind?: ButtonKind;
  /** `md` (default) is 44px tall; `lg` is 52px, for the main action of a sheet on a phone. */
  size?: ButtonSize;
  /** Stretch to the full width of the container. */
  full?: boolean;
}

/** A key on the case: drops by its height when pressed and comes back on the spring. */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { kind = 'key', size = 'md', full = false, type = 'button', className, children, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      data-component="Button"
      data-kind={kind}
      className={cx(styles.root, styles[kind], styles[size], full && styles.full, className)}
      {...rest}
    >
      <span className={styles.label}>{children}</span>
    </button>
  );
});
