import { forwardRef, useState, type HTMLAttributes, type MouseEvent, type ReactNode } from 'react';
import { cx } from '../../cx';
import { Icon } from '../Icon';
import styles from './Chip.module.css';

export type ChipSize = 'sm' | 'md';

interface ChipBase extends Omit<HTMLAttributes<HTMLSpanElement>, 'children' | 'onChange'> {
  /** The word on the key, such as "Eco" or "Night". Short, sentence case. */
  children: ReactNode;
  /** `md` (default) draws 44px tall; `sm` draws 36px and keeps a 44px hit area around it. */
  size?: ChipSize;
  /** Flattens the chip and stops it from being pressed or removed. */
  disabled?: boolean;
  /** A small stroke icon printed before the word. It is decorative, because the word names the chip. */
  icon?: ReactNode;
}

export interface ChipToggleProps extends ChipBase {
  /** Whether the key is latched down (controlled). Pair it with `onSelectedChange`. */
  selected?: boolean;
  /** Whether the key starts latched when it is uncontrolled. Defaults to `false`. */
  defaultSelected?: boolean;
  /** Called with the new position each time the key is pressed by pointer, Space or Enter. */
  onSelectedChange?: (selected: boolean) => void;
  /** Not available on a toggle chip. Pass `onRemove` alone for a removable chip. */
  onRemove?: never;
  /** Not available on a toggle chip. */
  removeLabel?: never;
}

export interface ChipRemovableProps extends ChipBase {
  /** Makes the chip removable, with a separate round remove key with a 44px target sits at its end. */
  onRemove: () => void;
  /** Accessible name of the remove key. Defaults to "Remove" and the word, when the word is a string. */
  removeLabel?: string;
  /** Not available on a removable chip. */
  selected?: never;
  /** Not available on a removable chip. */
  defaultSelected?: never;
  /** Not available on a removable chip. */
  onSelectedChange?: never;
}

export type ChipProps = ChipToggleProps | ChipRemovableProps;

/** A small capsule key for filters and quick presets. A toggle chip latches down and lights its lamp
 *  (aria-pressed); a removable chip carries its own round remove key. Never orange. */
export const Chip = forwardRef<HTMLSpanElement, ChipProps>(function Chip(props, ref) {
  const { children, size = 'md', disabled = false, icon, className, selected, defaultSelected = false, onSelectedChange, onRemove, removeLabel, ...rest } = props;
  const [own, setOwn] = useState(defaultSelected);
  const isControlled = selected !== undefined;
  const on = isControlled ? selected : own;
  const text = typeof children === 'string' ? children : undefined;
  const word = (
    <span className={styles.word} data-text={text}>
      {children}
    </span>
  );
  const glyph = icon != null ? <span className={styles.icon} aria-hidden="true">{icon}</span> : null;

  if (onRemove) {
    return (
      <span
        ref={ref}
        data-component="Chip"
        data-form="removable"
        data-disabled={disabled || undefined}
        className={cx(styles.root, styles.body, styles[size], className)}
        {...rest}
      >
        {glyph}
        {word}
        <button
          type="button"
          className={styles.remove}
          aria-label={removeLabel ?? (text ? `Remove ${text}` : 'Remove')}
          disabled={disabled}
          onClick={() => onRemove()}
        >
          {/* dial's one icon language, the dot matrix (R-005) */}
          <Icon name="close" size="sm" />
        </button>
      </span>
    );
  }

  const press = (e: MouseEvent<HTMLButtonElement>) => {
    if (e.defaultPrevented || disabled) return;
    const next = !on;
    if (!isControlled) setOwn(next);
    onSelectedChange?.(next);
  };
  return (
    <span ref={ref} data-component="Chip" data-form="toggle" data-disabled={disabled || undefined} className={cx(styles.root, className)} {...rest}>
      <button type="button" aria-pressed={on} disabled={disabled} onClick={press} className={cx(styles.key, styles[size])}>
        <span className={styles.lamp} aria-hidden="true" data-glow={on && !disabled ? 'mark' : undefined} />
        {glyph}
        {word}
      </button>
    </span>
  );
});
