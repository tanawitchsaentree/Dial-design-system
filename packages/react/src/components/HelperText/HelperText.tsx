import { forwardRef, useId, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../cx';
import { messages } from '../../messages';
import { Icon } from '../Icon';
import styles from './HelperText.module.css';

export type HelperTextTone = 'neutral' | 'error';

export interface HelperTextProps extends Omit<HTMLAttributes<HTMLParagraphElement>, 'children'> {
  /** The words printed under the part. */
  children: ReactNode;
  /** `neutral` (default) is a hint in secondary ink. `error` adds a glyph and medium weight, so it is never told by colour alone. */
  tone?: HelperTextTone;
  /** The id the part points to with `aria-describedby`. When left out, one is generated; read it from the DOM or pass your own to link a part. */
  id?: string;
  /** The word read out for the error glyph. Pass your own for another language. Default "Error". */
  errorLabel?: string;
  /** Class name for the line. */
  className?: string;
  /** Inline style for the line. */
  style?: CSSProperties;
}

/** The line printed under a part: a hint, or an error with a glyph and words. Give it an `id` and point the part's `aria-describedby` at it. */
export const HelperText = forwardRef<HTMLParagraphElement, HelperTextProps>(function HelperText(
  { children, tone = 'neutral', id, errorLabel = messages.helperError, className, style, ...rest },
  ref,
) {
  const auto = useId();
  return (
    <p ref={ref} id={id ?? auto} data-component="HelperText" data-tone={tone} className={cx(styles.root, className)} style={style} {...rest}>
      {/* dial's one icon language, the dot matrix (R-005) */}
      {tone === 'error' && <Icon name="critical" size="sm" label={errorLabel} className={styles.glyph} />}
      <span className={styles.text}>{children}</span>
    </p>
  );
});
