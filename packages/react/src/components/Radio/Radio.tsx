import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useId,
  useMemo,
  useState,
  type ChangeEvent,
  type CSSProperties,
  type FieldsetHTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';
import { cx } from '../../cx';
import styles from './Radio.module.css';

interface GroupContext {
  name: string;
  value: string | undefined;
  disabled: boolean;
  select: (value: string, event: ChangeEvent<HTMLInputElement>) => void;
}

const RadioContext = createContext<GroupContext | null>(null);

export interface RadioGroupProps extends Omit<FieldsetHTMLAttributes<HTMLFieldSetElement>, 'onChange' | 'defaultValue' | 'value' | 'children'> {
  /** The group's printed name above the options. It is also the group's accessible name, so it is required. */
  label: ReactNode;
  /** The `Radio` options. */
  children: ReactNode;
  /** The chosen option's `value`, when you control it. Pair it with `onValueChange`. Use an empty string for none chosen. */
  value?: string;
  /** The option chosen at the start, when the group keeps its own state. */
  defaultValue?: string;
  /** Called with the new `value` when a different option is chosen by pointer, label or arrow key. */
  onValueChange?: (value: string) => void;
  /** The form field name shared by the options. A unique one is made when you leave it out. */
  name?: string;
  /** Every option loses its height and cannot be chosen. */
  disabled?: boolean;
  /** Class name for the fieldset. */
  className?: string;
  /** Inline style for the fieldset. */
  style?: CSSProperties;
}

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size' | 'children' | 'value' | 'disabled'> {
  /** What this option sets the group to. Must be unique inside the group. */
  value: string;
  /** The word printed beside the key. It is the accessible name, and pressing it chooses the option. */
  label: ReactNode;
  /** This option loses its height and cannot be chosen. */
  disabled?: boolean;
}

/** A column of round keys of which one is chosen: a dot of ink on its face and a medium word say which. */
export const RadioGroup = forwardRef<HTMLFieldSetElement, RadioGroupProps>(function RadioGroup(
  { label, children, value, defaultValue, onValueChange, name, disabled = false, className, style, ...rest },
  ref,
) {
  const auto = useId();
  const [own, setOwn] = useState<string | undefined>(defaultValue);
  const current = value !== undefined ? value : own;
  const select = useCallback(
    (next: string) => {
      if (value === undefined) setOwn(next);
      if (next !== current) onValueChange?.(next);
    },
    [value, current, onValueChange],
  );
  const ctx = useMemo<GroupContext>(
    () => ({ name: name ?? `${auto}-group`, value: current, disabled, select }),
    [name, auto, current, disabled, select],
  );

  return (
    <RadioContext.Provider value={ctx}>
      <fieldset ref={ref} data-component="RadioGroup" disabled={disabled} className={cx(styles.group, className)} style={style} {...rest}>
        <legend className={styles.legend}>{label}</legend>
        {children}
      </fieldset>
    </RadioContext.Provider>
  );
});

/** One option of a `RadioGroup`: a round key with its word printed beside it. */
export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  { value, label, disabled = false, className, onChange, ...rest },
  ref,
) {
  const group = useContext(RadioContext);
  const off = disabled || (group?.disabled ?? false);
  const grouped = group
    ? { name: group.name, checked: group.value === value }
    : {};

  return (
    <label data-component="Radio" data-hit="" data-disabled={off || undefined} className={cx(styles.item, className)}>
      <input
        ref={ref}
        type="radio"
        className={styles.input}
        value={value}
        disabled={off}
        {...grouped}
        onChange={(event) => {
          group?.select(value, event);
          onChange?.(event);
        }}
        {...rest}
      />
      <span className={styles.key} aria-hidden="true">
        <span className={styles.dot} />
      </span>
      <span className={styles.text}>{label}</span>
    </label>
  );
});
