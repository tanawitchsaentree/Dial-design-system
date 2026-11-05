import { forwardRef, type HTMLAttributes } from 'react';
import { cx } from '../../cx';
import styles from './DescriptionList.module.css';

export type DescriptionListOrientation = 'stacked' | 'inline';

export interface DescriptionListProps extends HTMLAttributes<HTMLDListElement> {
  /** `stacked` (default) prints each term over its values and fits a narrow unit. `inline` puts the terms in one column with the values beside them. */
  orientation?: DescriptionListOrientation;
}

/** A list of terms and their values, such as a model, a power draw and a service date: terms on the inset line in label type, values in body type, a seam cut between pairs. Not a control. */
export const DescriptionList = forwardRef<HTMLDListElement, DescriptionListProps>(function DescriptionList(
  { orientation = 'stacked', className, ...rest },
  ref,
) {
  return (
    <dl
      ref={ref}
      data-component="DescriptionList"
      data-orientation={orientation}
      className={cx(styles.root, styles[orientation], className)}
      {...rest}
    />
  );
});

export type DescriptionTermProps = HTMLAttributes<HTMLElement>;

/** The name of one fact, such as "Power draw". Put it before its value or values. */
export const DescriptionTerm = forwardRef<HTMLElement, DescriptionTermProps>(function DescriptionTerm(
  { className, ...rest },
  ref,
) {
  return <dt ref={ref} className={cx(styles.term, className)} {...rest} />;
});

export interface DescriptionDetailProps extends HTMLAttributes<HTMLElement> {
  /** Marks a figure. In the inline layout a numeric value lines up on the end edge, so values of different length share their last digit. Default off. */
  numeric?: boolean;
}

/** The value of the term before it. A term may have more than one value, and a value may follow more than one term. */
export const DescriptionDetail = forwardRef<HTMLElement, DescriptionDetailProps>(function DescriptionDetail(
  { numeric = false, className, ...rest },
  ref,
) {
  return <dd ref={ref} data-numeric={numeric ? '' : undefined} className={cx(styles.detail, className)} {...rest} />;
});
