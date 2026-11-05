import { Children, cloneElement, forwardRef, isValidElement, useId, type CSSProperties, type HTMLAttributes, type ReactElement, type ReactNode } from 'react';
import { cx } from '../../cx';
import { HelperText } from '../HelperText';
import { Label, type LabelMark } from '../Label';
import styles from './FormField.module.css';

export type FormFieldLayout = 'stacked' | 'inline';

/** What FormField hands to a render-prop child. Spread the first four onto the control. */
export interface FormFieldControlProps {
  /** The id the Label points at. Put it on the control. */
  id: string;
  /** The ids of the hint and the error, space separated, or `undefined` when there are none. */
  'aria-describedby': string | undefined;
  /** `true` while an error is set, otherwise `undefined`. */
  'aria-invalid': true | undefined;
  /** `true` when the field is required, otherwise `undefined`. */
  required: true | undefined;
}

export interface FormFieldProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** The printed name. It becomes the control's accessible name through the Label, so write it as a noun, for example `Room name`. */
  label: ReactNode;
  /** The control. Pass one element and FormField adds `id`, `aria-describedby`, `aria-invalid` and `required` to it (an `id` or `aria-describedby` you set yourself is kept and merged). Pass a function to receive those props and place them yourself. */
  children: ReactElement | ((control: FormFieldControlProps) => ReactNode);
  /** A line under the control that says what to enter, for example the format. */
  hint?: ReactNode;
  /** The problem with the current value. When set, the control is marked invalid and the message prints under it with a glyph and words. */
  error?: ReactNode;
  /** Mark the field as one that must be filled in. Prints the mark and sets `required` on the control. */
  required?: boolean;
  /** Mark the field as one that can be left empty. Ignored when `required` is set. */
  optional?: boolean;
  /** How the Label's mark prints. `word` (default) or `glyph`. See Label. */
  mark?: LabelMark;
  /** `stacked` (default) prints the Label above the control. `inline` prints it in a column at the start, with the control beside it, and wraps under it when the column is narrow. */
  layout?: FormFieldLayout;
  /** The id for the control. Generated when left out; an `id` already on the child wins. */
  controlId?: string;
  /** Class name for the outer wrapper. */
  className?: string;
  /** Inline style for the outer wrapper. */
  style?: CSSProperties;
}

/** A Label, a control and its hint or error in one block, with `htmlFor`, `aria-describedby` and `aria-invalid` wired for you. */
export const FormField = forwardRef<HTMLDivElement, FormFieldProps>(function FormField(
  { label, children, hint, error, required = false, optional = false, mark, layout = 'stacked', controlId, className, style, ...rest },
  ref,
) {
  const auto = useId();
  const only = typeof children === 'function' ? null : Children.only(children);
  const own = isValidElement<Record<string, unknown>>(only) ? only.props : null;
  const id = (typeof own?.id === 'string' ? own.id : undefined) ?? controlId ?? `${auto}-control`;
  const hintId = `${auto}-hint`;
  const errorId = `${auto}-error`;
  const hasHint = hint != null && hint !== false && hint !== '';
  const invalid = error != null && error !== false && error !== '';
  const ownDescribed = typeof own?.['aria-describedby'] === 'string' ? (own['aria-describedby'] as string) : undefined;
  const described = [invalid ? errorId : null, hasHint ? hintId : null, ownDescribed].filter(Boolean).join(' ') || undefined;

  const control: FormFieldControlProps = {
    id,
    'aria-describedby': described,
    'aria-invalid': invalid ? true : undefined,
    required: required ? true : undefined,
  };

  let slot: ReactNode;
  if (typeof children === 'function') slot = children(control);
  else if (isValidElement(only)) slot = cloneElement(only as ReactElement<Record<string, unknown>>, { ...control, 'aria-invalid': control['aria-invalid'] ?? own?.['aria-invalid'], required: control.required ?? own?.required });
  else slot = only;

  return (
    <div ref={ref} data-component="FormField" data-layout={layout} data-invalid={invalid || undefined} className={cx(styles.root, className)} style={style} {...rest}>
      <div className={styles.labelCol}>
        <Label htmlFor={id} required={required} optional={optional} mark={mark}>{label}</Label>
      </div>
      <div className={styles.body}>
        {slot}
        {/* the live region stays in the tree so a new error is announced and the layout holds still */}
        <div className={styles.messages} aria-live="polite">
          {invalid && <HelperText id={errorId} tone="error">{error}</HelperText>}
          {hasHint && <HelperText id={hintId}>{hint}</HelperText>}
        </div>
      </div>
    </div>
  );
});
