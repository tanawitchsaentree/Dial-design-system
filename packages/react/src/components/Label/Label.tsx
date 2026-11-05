import { forwardRef, useId, type CSSProperties, type LabelHTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../cx';
import { messages } from '../../messages';
import { VisuallyHidden } from '../VisuallyHidden';
import styles from './Label.module.css';

export type LabelMark = 'word' | 'glyph';

export interface LabelProps extends Omit<LabelHTMLAttributes<HTMLLabelElement>, 'children'> {
  /** The printed name of the part. It is the part's accessible name, so write it as a noun, for example `Room name`. */
  children: ReactNode;
  /** The `id` of the part this label names. Pressing the words moves focus to it. */
  htmlFor?: string;
  /** Mark the part as one that must be filled in. This only prints the mark; set `required` on the control itself so the browser and screen readers enforce it. Wins over `optional`. */
  required?: boolean;
  /** Mark the part as one that can be left empty. Use it in forms where most parts are required. */
  optional?: boolean;
  /** How the mark prints. `word` (default) prints the word at the far end of the line; `glyph` prints a star straight after the name and keeps the word for screen readers. */
  mark?: LabelMark;
  /** The word printed for a required part. Defaults to `required`; pass your own for another language. */
  requiredText?: ReactNode;
  /** The word printed for an optional part. Defaults to `optional`; pass your own for another language. */
  optionalText?: ReactNode;
  /** One line of help printed under the name, for example the format. */
  help?: ReactNode;
  /** The `id` for the help line, so the part can list it in `aria-describedby`. Generated when you leave it out and a help line is set; pass it yourself to read it. */
  helpId?: string;
  /** Class name for the outer wrapper (label and help). */
  className?: string;
  /** Inline style for the outer wrapper. */
  style?: CSSProperties;
}

/** The printed name above a part: the name in medium ink, an optional required or optional mark in words, and one line of help. */
export const Label = forwardRef<HTMLLabelElement, LabelProps>(function Label(
  { children, htmlFor, required = false, optional = false, mark = 'word', requiredText = messages.label.required, optionalText = messages.label.optional, help, helpId, className, style, ...rest },
  ref,
) {
  const auto = useId();
  const helpIdValue = helpId ?? `${auto}-help`;
  const kind = required ? 'required' : optional ? 'optional' : undefined;
  const word = required ? requiredText : optionalText;
  // a star only makes sense for required; an optional part always prints its word
  const glyph = kind === 'required' && mark === 'glyph';

  return (
    <div data-component="Label" data-mark={glyph ? 'glyph' : undefined} className={cx(styles.root, className)} style={style}>
      <label ref={ref} htmlFor={htmlFor} className={styles.label} {...rest}>
        <span className={styles.name}>{children}</span>
        {kind != null && !glyph && <span className={styles.mark} data-kind={kind}>{word}</span>}
        {glyph && (
          <>
            <span className={styles.mark} data-kind={kind} aria-hidden="true">*</span>
            <VisuallyHidden>{word}</VisuallyHidden>
          </>
        )}
      </label>
      {help != null && <p id={helpIdValue} className={styles.help}>{help}</p>}
    </div>
  );
});
