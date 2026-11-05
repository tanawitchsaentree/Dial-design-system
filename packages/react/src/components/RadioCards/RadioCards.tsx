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
import styles from './RadioCards.module.css';

interface GroupContext {
  name: string;
  value: string | undefined;
  disabled: boolean;
  select: (value: string, event: ChangeEvent<HTMLInputElement>) => void;
}

const RadioCardsContext = createContext<GroupContext | null>(null);

export interface RadioCardsProps extends Omit<FieldsetHTMLAttributes<HTMLFieldSetElement>, 'onChange' | 'defaultValue' | 'value' | 'children'> {
  /** The group's printed name above the plates. It is also the group's accessible name, so it is required. */
  label: ReactNode;
  /** The `RadioCard` plates. */
  children: ReactNode;
  /** The chosen plate's `value`, when you control it. Pair it with `onValueChange`. Use an empty string for none chosen. */
  value?: string;
  /** The plate chosen at the start, when the group keeps its own state. */
  defaultValue?: string;
  /** Called with the new `value` when a different plate is chosen by pointer or arrow key. */
  onValueChange?: (value: string) => void;
  /** The form field name shared by the plates. A unique one is made when you leave it out. */
  name?: string;
  /** Every plate loses its height and cannot be chosen. */
  disabled?: boolean;
  /** Class name for the fieldset. */
  className?: string;
  /** Inline style for the fieldset. */
  style?: CSSProperties;
}

export interface RadioCardProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size' | 'children' | 'value' | 'disabled' | 'title'> {
  /** What this plate sets the group to. Must be unique inside the group. */
  value: string;
  /** The option's name. It is the accessible name of the radio. */
  title: ReactNode;
  /** A line that explains the option. It is read out as the radio's description. */
  description?: ReactNode;
  /** A node before the words, such as an `Icon`. It is decoration: put nothing in it that the title does not say. */
  leading?: ReactNode;
  /** This plate loses its height and cannot be chosen. */
  disabled?: boolean;
}

/** A column of key plates of which one is chosen: a bar of ink at its start, a medium title and a lowered plate say which. */
export const RadioCards = forwardRef<HTMLFieldSetElement, RadioCardsProps>(function RadioCards(
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
    <RadioCardsContext.Provider value={ctx}>
      <fieldset ref={ref} data-component="RadioCards" disabled={disabled} className={cx(styles.group, className)} style={style} {...rest}>
        <legend className={styles.legend}>{label}</legend>
        {children}
      </fieldset>
    </RadioCardsContext.Provider>
  );
});

/** One plate of a `RadioCards` group: a title, a line of text and an optional leading node on a key that sits down when chosen. */
export const RadioCard = forwardRef<HTMLInputElement, RadioCardProps>(function RadioCard(
  { value, title, description, leading, disabled = false, className, onChange, ...rest },
  ref,
) {
  const group = useContext(RadioCardsContext);
  const id = useId();
  const off = disabled || (group?.disabled ?? false);
  const checked = group ? group.value === value : undefined;
  const grouped = group ? { name: group.name, checked } : {};

  return (
    <label
      data-component="RadioCard"
      data-hit=""
      data-checked={checked || undefined}
      data-disabled={off || undefined}
      className={cx(styles.card, className)}
    >
      <input
        ref={ref}
        type="radio"
        className={styles.input}
        value={value}
        disabled={off}
        aria-labelledby={`${id}-title`}
        aria-describedby={description ? `${id}-text` : undefined}
        {...grouped}
        onChange={(event) => {
          group?.select(value, event);
          onChange?.(event);
        }}
        {...rest}
      />
      <span className={styles.bar} aria-hidden="true" />
      {leading ? <span className={styles.leading} aria-hidden="true">{leading}</span> : null}
      <span className={styles.body}>
        <span id={`${id}-title`} className={styles.title}>{title}</span>
        {description ? <span id={`${id}-text`} className={styles.description}>{description}</span> : null}
      </span>
    </label>
  );
});
