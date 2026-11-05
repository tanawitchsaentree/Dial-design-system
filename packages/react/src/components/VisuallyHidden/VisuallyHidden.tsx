import { cloneElement, forwardRef, isValidElement, type HTMLAttributes, type ReactElement, type ReactNode } from 'react';
import { cx } from '../../cx';
import styles from './VisuallyHidden.module.css';

export interface VisuallyHiddenProps extends HTMLAttributes<HTMLSpanElement> {
  /** The words (or one focusable element such as a skip link) to hide from sight and keep for assistive tech. */
  children?: ReactNode;
  /** Show the content as a raised key at the start corner while it holds keyboard focus. Use it for a skip link. The content must contain something focusable, or with `asChild` be focusable itself. Default false. */
  focusable?: boolean;
  /** Hand the hiding styles to your own child, such as an anchor or a router link, instead of printing a span. */
  asChild?: boolean;
  /** Class name for the wrapper. */
  className?: string;
}

/** Words for assistive tech only: clipped to one pixel and out of the flow, still read aloud. */
export const VisuallyHidden = forwardRef<HTMLSpanElement, VisuallyHiddenProps>(function VisuallyHidden(
  { children, focusable = false, asChild = false, className, ...rest },
  ref,
) {
  const props = {
    ref,
    'data-component': 'VisuallyHidden',
    'data-focusable': focusable ? '' : undefined,
    ...rest,
  };
  if (asChild && isValidElement(children)) {
    const child = children as ReactElement<{ className?: string }>;
    return cloneElement(child, { ...props, className: cx(styles.root, className, child.props.className) } as Record<string, unknown>);
  }
  return (
    <span {...props} className={cx(styles.root, className)}>
      {children}
    </span>
  );
});
