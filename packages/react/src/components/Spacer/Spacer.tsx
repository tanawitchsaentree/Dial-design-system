import { forwardRef, type HTMLAttributes } from 'react';
import { cx } from '../../cx';
import styles from './Spacer.module.css';

export type SpacerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface SpacerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Room to leave. xs is 4px, sm 8, md 16 (the default), lg 24 and xl 32, the same steps as Stack gaps. */
  size?: SpacerSize;
  /** `block` (default) leaves room in the column; `inline` leaves room in a row. */
  axis?: 'block' | 'inline';
  /** Take all the room that is left, with `size` as the least it keeps. Use it in a row or column to push siblings apart. */
  flexible?: boolean;
}

/** Empty room of a token size, or room that grows to push siblings apart. Hidden from assistive tech. */
export const Spacer = forwardRef<HTMLDivElement, SpacerProps>(function Spacer({ size = 'md', axis = 'block', flexible = false, className, ...rest }, ref) {
  return (
    <div
      ref={ref}
      aria-hidden="true"
      data-component="Spacer"
      data-axis={axis}
      data-flexible={flexible ? '' : undefined}
      className={cx(styles.root, styles[axis], styles[`s-${size}`], flexible && styles.flexible, className)}
      {...rest}
    />
  );
});
