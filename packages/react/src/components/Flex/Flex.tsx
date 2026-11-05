import { cloneElement, forwardRef, isValidElement, type HTMLAttributes, type ReactElement } from 'react';
import { cx } from '../../cx';
import styles from './Flex.module.css';

export type FlexGap = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface FlexProps extends HTMLAttributes<HTMLDivElement> {
  /** `row` (default) lays children along the inline axis; `column` stacks them. Reversed directions are not offered, because they split the reading order from the visual order. */
  direction?: 'row' | 'column';
  /** Let children break onto a new line when the line is full. Off by default. */
  wrap?: boolean;
  /** Space between children. xs is 4px, sm 8, md 16 (the default), lg 24 and xl 32. */
  gap?: FlexGap;
  /** Cross-axis alignment. `baseline` sets the first line of text of each child on one line. */
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  /** Main-axis distribution of the children. */
  justify?: 'start' | 'center' | 'end' | 'between';
  /** Make the container `inline-flex`, so it sits in a line of text. */
  inline?: boolean;
  /** Render the one child element as the container instead of a div, for example a `ul` or a `nav`. Its own props and children are kept. */
  asChild?: boolean;
}

/** One-line layout with a token gap, alignment and distribution. Use FlexItem for a child that grows or refuses to shrink. */
export const Flex = forwardRef<HTMLDivElement, FlexProps>(function Flex(
  { direction = 'row', wrap, gap = 'md', align = 'stretch', justify = 'start', inline, asChild, className, children, ...rest },
  ref,
) {
  const cls = cx(inline ? styles.inline : styles.root, styles[direction], wrap && styles.wrap, styles[`g-${gap}`], styles[`a-${align}`], styles[`j-${justify}`], className);
  const props = { ref, 'data-component': 'Flex', 'data-direction': direction, 'data-wrap': wrap ? '' : undefined, ...rest };
  if (asChild && isValidElement(children)) {
    const child = children as ReactElement<{ className?: string }>;
    return cloneElement(child, { ...props, className: cx(cls, child.props.className) } as Record<string, unknown>);
  }
  return <div {...props} className={cls}>{children}</div>;
});

export interface FlexItemProps extends HTMLAttributes<HTMLDivElement> {
  /** Take the spare room on the main axis. */
  grow?: boolean;
  /** Set to `false` to keep the item at full size when the line is tight. Defaults to `true`, which is the browser behaviour. */
  shrink?: boolean;
  /** Cross-axis alignment for this item only. It overrides the container's `align`. */
  align?: 'start' | 'center' | 'end';
}

/** A child of a Flex with its own grow, shrink and alignment. A child that needs none of these can be any element. */
export const FlexItem = forwardRef<HTMLDivElement, FlexItemProps>(function FlexItem({ grow, shrink = true, align, className, ...rest }, ref) {
  return (
    <div
      ref={ref}
      data-component="FlexItem"
      data-grow={grow ? '' : undefined}
      className={cx(styles.item, grow && styles.grow, !shrink && styles['no-shrink'], align && styles[`s-${align}`], className)}
      {...rest}
    />
  );
});
