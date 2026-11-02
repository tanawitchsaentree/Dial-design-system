import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../cx';
import styles from './Tray.module.css';

export interface TrayProps extends Omit<HTMLAttributes<HTMLDivElement>, 'role'> {
  /** The accessible name of the group of keys, such as "Playback" or "Modes". It is required, because a group with no name is just noise to a screen reader. */
  label: string;
  /** The small keys and lamps, such as IconButtons, Buttons and Badges. Each keeps its own size; the tray wraps to another row instead of shrinking them. */
  children: ReactNode;
}

/** A recess in the unit that gathers its small secondary keys, so the one big orange part stands alone. */
export const Tray = forwardRef<HTMLDivElement, TrayProps>(function Tray({ label, className, children, ...rest }, ref) {
  return (
    <div ref={ref} role="group" aria-label={label} data-component="Tray" className={cx(styles.root, className)} {...rest}>
      {children}
    </div>
  );
});
