import { forwardRef, type HTMLAttributes } from 'react';
import { cx } from '../../cx';
import styles from './Center.module.css';

export type CenterAxis = 'both' | 'inline' | 'block';
export type CenterSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export interface CenterProps extends HTMLAttributes<HTMLDivElement> {
  /** Which axis to centre on. `both` (the default) uses the full height of the parent, `inline` centres along the line, `block` centres from top to bottom. */
  axis?: CenterAxis;
  /** Caps the inline size at a container token: sm is 640px, md 768, lg 1024, xl 1200, 2xl 1440. Leave it unset for no cap. */
  size?: CenterSize;
}

/** Centres its children on one or both axes, with an optional maximum inline size from a token. */
export const Center = forwardRef<HTMLDivElement, CenterProps>(function Center({ axis = 'both', size, className, ...rest }, ref) {
  return <div ref={ref} data-component="Center" data-axis={axis} className={cx(styles.root, styles[`a-${axis}`], size && styles[`s-${size}`], className)} {...rest} />;
});
