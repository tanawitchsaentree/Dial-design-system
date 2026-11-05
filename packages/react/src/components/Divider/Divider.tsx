import { forwardRef, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../cx';
import styles from './Divider.module.css';

export interface DividerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** `horizontal` parts what is above from what is below; `vertical` parts side-by-side regions. Default `horizontal`. */
  orientation?: 'horizontal' | 'vertical';
  /** A short lowercase word printed on the seam, a little in from its start. Horizontal only; ignored when vertical. */
  label?: ReactNode;
  /** True when the seam is only a visual gap and carries no meaning. It is then hidden from assistive tech (role="none"). Default false. */
  decorative?: boolean;
  /** Class name for the seam. */
  className?: string;
  /** Inline style for the seam. */
  style?: CSSProperties;
}

/** The seam between two regions of one unit: a shade edge over a lit edge, with an optional word printed on it. */
export const Divider = forwardRef<HTMLDivElement, DividerProps>(function Divider(
  { orientation = 'horizontal', label, decorative = false, className, style, ...rest },
  ref,
) {
  const vertical = orientation === 'vertical';
  const hasLabel = !vertical && label != null && label !== false && label !== '';
  const ariaLabel = hasLabel && typeof label === 'string' && !decorative ? label : undefined;
  return (
    <div
      ref={ref}
      data-component="Divider"
      data-orientation={orientation}
      data-labelled={hasLabel ? '' : undefined}
      role={decorative ? 'none' : 'separator'}
      aria-orientation={!decorative && vertical ? 'vertical' : undefined}
      aria-label={ariaLabel}
      className={cx(styles.root, className)}
      style={style}
      {...rest}
    >
      {hasLabel && <span className={styles.label} aria-hidden={ariaLabel ? true : undefined}>{label}</span>}
    </div>
  );
});
