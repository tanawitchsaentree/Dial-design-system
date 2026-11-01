import { forwardRef, type HTMLAttributes } from 'react';
import { cx } from '../../cx';
import styles from './Heading.module.css';

export type HeadingLevel = 1 | 2 | 3 | 4;

export interface HeadingProps extends Omit<HTMLAttributes<HTMLHeadingElement>, 'color'> {
  /** Renders `h1` to `h4` and sets the size. 1 is display (37px, the page title), 2 headline (26px, a section), 3 title (22px, a unit, the default), 4 emphasis (18px, a group inside a unit). */
  level?: HeadingLevel;
}

/** The largest printing on a unit or a page: medium weight, primary ink, sentence case. */
export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(function Heading(
  { level = 3, className, ...rest },
  ref,
) {
  const Tag = `h${level}` as const;
  return <Tag ref={ref} data-component="Heading" data-level={level} className={cx(styles.root, styles[`l${level}`], className)} {...rest} />;
});
