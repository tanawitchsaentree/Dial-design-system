import { forwardRef, type LabelHTMLAttributes } from 'react';
import { cx } from '../../cx';
import styles from './Text.module.css';

export type TextElement = 'p' | 'span' | 'div' | 'label';
export type TextSize = 'micro' | 'caption' | 'label' | 'body' | 'reading';
export type TextTone = 'primary' | 'secondary';
export type TextWeight = 'regular' | 'medium';

export interface TextProps extends Omit<LabelHTMLAttributes<HTMLElement>, 'color'> {
  /** The element to render. Use `p` (default) for a paragraph, `span` inline, `div` for a block, `label` to name a field (pass `htmlFor`). */
  as?: TextElement;
  /** `micro` (11px, model names and scale numerals), `caption` (13px), `label` (14px), `body` (15px, the default) or `reading` (16px, prose capped at the measure). */
  size?: TextSize;
  /** `primary` (default) is the darkest ink on plastic; `secondary` is one step lighter for notes and units. Both hold 4.5:1. */
  tone?: TextTone;
  /** `regular` (default) or `medium`. There is no bold and no italic. */
  weight?: TextWeight;
  /** Tabular figures, so a number that changes keeps its width. */
  numeric?: boolean;
}

/** Printing on the case: one grotesk, two weights, grey ink flat on the plastic. */
export const Text = forwardRef<HTMLElement, TextProps>(function Text(
  { as: Tag = 'p', size = 'body', tone = 'primary', weight = 'regular', numeric = false, className, ...rest },
  ref,
) {
  return (
    <Tag
      ref={ref as never}
      data-component="Text"
      data-size={size}
      className={cx(styles.root, styles[size], styles[tone], styles[weight], numeric && styles.numeric, className)}
      {...rest}
    />
  );
});
