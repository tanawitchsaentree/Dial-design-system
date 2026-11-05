import { forwardRef, type HTMLAttributes } from 'react';
import { cx } from '../../cx';
import styles from './AspectRatio.module.css';

export type AspectRatioValue = '1/1' | '4/3' | '16/9' | '3/2';

const RATIO_CLASS: Record<AspectRatioValue, string> = { '1/1': 'r-1-1', '4/3': 'r-4-3', '16/9': 'r-16-9', '3/2': 'r-3-2' };

export interface AspectRatioProps extends HTMLAttributes<HTMLDivElement> {
  /** The proportion, width over height. One of 1/1, 4/3, 16/9 (the default) or 3/2. */
  ratio?: AspectRatioValue;
  /** Rounds the frame with the media corner, the same radius the windows use. Off by default. */
  rounded?: boolean;
}

/** Keeps its child at a fixed proportion. The child fills the frame, so the space is held before the content loads. */
export const AspectRatio = forwardRef<HTMLDivElement, AspectRatioProps>(function AspectRatio({ ratio = '16/9', rounded = false, className, ...rest }, ref) {
  return <div ref={ref} data-component="AspectRatio" data-ratio={ratio} className={cx(styles.root, styles.fill, styles[RATIO_CLASS[ratio]], rounded && styles.corner, className)} {...rest} />;
});
