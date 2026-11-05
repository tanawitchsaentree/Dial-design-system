import { forwardRef, type ButtonHTMLAttributes, type CSSProperties } from 'react';
import { cx } from '../../cx';
import { Icon, type IconName } from '../Icon';
import styles from './FAB.module.css';

export type FABPosition = 'container' | 'viewport';

export interface FABProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'aria-label' | 'className' | 'style'> {
  /** The accessible name, which is required. It says in words what the key does, for example "Add room". It is also the printed word when `extended` is set. */
  label: string;
  /** The glyph printed on the key, from dial's dot-matrix set. Default `plus`. */
  icon?: IconName;
  /** Print `label` beside the glyph and stretch the key into a capsule. Use it when there is room and the action is not obvious from the glyph. */
  extended?: boolean;
  /** `container` (default) fixes the key to the corner of the nearest positioned ancestor, so give that ancestor `position: relative`. `viewport` fixes it to the window. Both keep the device's safe area clear. */
  position?: FABPosition;
  /** Class name for the seat the key sits in, the part that is positioned. */
  className?: string;
  /** Inline style for the seat the key sits in. */
  style?: CSSProperties;
}

/**
 * The unit's one main action: the orange key in an opaque seat fixed to the inline-end, block-end corner.
 * Use it once per unit, and never next to another orange key. The ref goes to the button.
 */
export const FAB = forwardRef<HTMLButtonElement, FABProps>(function FAB(
  { label, icon = 'plus', extended = false, position = 'container', type = 'button', className, style, ...rest },
  ref,
) {
  return (
    <span
      data-component="FAB"
      data-extended={extended ? '' : undefined}
      data-position={position}
      className={cx(styles.root, extended && styles.extended, position === 'viewport' && styles.viewport, className)}
      style={style}
    >
      <button
        ref={ref}
        type={type}
        aria-label={extended ? undefined : label}
        className={styles.key}
        {...rest}
      >
        <span className={styles.icon} aria-hidden="true"><Icon name={icon} size="md" /></span>
        {extended && <span className={styles.label}>{label}</span>}
      </button>
    </span>
  );
});
