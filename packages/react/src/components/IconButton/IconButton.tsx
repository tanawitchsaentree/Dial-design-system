import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../cx';
import styles from './IconButton.module.css';

export type IconButtonKind = 'key' | 'primary';
export type IconButtonSize = 'md' | 'lg';

export interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'aria-label'> {
  /** The accessible name, which is required. It says in words what the key does, for example "Next track". The icon is never the name. */
  label: string;
  /** `key` (default) is a body-coloured key. `primary` is the unit's one orange key; use it once per unit. */
  kind?: IconButtonKind;
  /** `md` (default) is a 44px disc; `lg` is 52px, for the main key of a sheet on a phone. */
  size?: IconButtonSize;
  /** The symbol printed on the key, one icon drawn in `currentColor`. It is hidden from assistive tech. */
  children: ReactNode;
}

/** A round key with a printed symbol: drops by its height when pressed and comes back on the spring. */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { label, kind = 'key', size = 'md', type = 'button', className, children, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      aria-label={label}
      data-component="IconButton"
      data-kind={kind}
      className={cx(styles.root, styles[kind], styles[size], className)}
      {...rest}
    >
      <span className={styles.icon} aria-hidden="true">{children}</span>
    </button>
  );
});
