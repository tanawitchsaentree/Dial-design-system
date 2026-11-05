import { forwardRef, useId, type CSSProperties, type FieldsetHTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../cx';
import styles from './Fieldset.module.css';

export interface FieldsetProps extends Omit<FieldsetHTMLAttributes<HTMLFieldSetElement>, 'children'> {
  /** The group's printed name, set into the top line of the box. It is also the group's accessible name, so it is required. */
  legend: ReactNode;
  /** The controls that belong together. */
  children: ReactNode;
  /** A line of small print at the foot of the box. It is read out as the group's description. */
  hint?: ReactNode;
  /** Every control inside is switched off by the browser and the box fades. */
  disabled?: boolean;
  /** Class name for the fieldset. */
  className?: string;
  /** Inline style for the fieldset. */
  style?: CSSProperties;
}

/** A printed box around related controls, named on its top line, that disables them all at once. */
export const Fieldset = forwardRef<HTMLFieldSetElement, FieldsetProps>(function Fieldset(
  { legend, children, hint, disabled = false, className, style, 'aria-describedby': describedBy, ...rest },
  ref,
) {
  const auto = useId();
  const hintId = `${auto}-hint`;
  const described = [hint != null ? hintId : null, describedBy].filter(Boolean).join(' ') || undefined;

  return (
    <fieldset
      ref={ref}
      data-component="Fieldset"
      disabled={disabled}
      aria-describedby={described}
      className={cx(styles.group, className)}
      style={style}
      {...rest}
    >
      <legend className={styles.legend}>{legend}</legend>
      {children}
      {hint != null && (
        <p id={hintId} className={styles.hint}>
          {hint}
        </p>
      )}
    </fieldset>
  );
});
