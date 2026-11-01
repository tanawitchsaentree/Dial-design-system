import {
  forwardRef,
  useId,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { cx } from '../../cx';
import styles from './SegmentedControl.module.css';

export type SegmentedControlSize = 'md' | 'lg';

export interface SegmentedControlOption {
  /** The value this key stands for. Unique within the bank. */
  value: string;
  /** The word printed on the key. It is the key's accessible name. */
  label: ReactNode;
  /** An optional symbol printed before the word, drawn in ink. It is hidden from assistive tech. */
  icon?: ReactNode;
}

export interface SegmentedControlProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue' | 'children'> {
  /** The name printed above the bank, such as Band or Mode. It is required, because it is also the group's accessible name. */
  label: ReactNode;
  /** The keys, in order. Two to five keys fit a unit; more belong in a Select. */
  options: SegmentedControlOption[];
  /** The value of the latched key, when you control it. Pair it with `onValueChange`. */
  value?: string;
  /** The value of the key latched at first, when the bank keeps its own state. With neither, no key is latched until one is pressed. */
  defaultValue?: string;
  /** Called with the new value when a key latches, by pointer, arrow keys, Home, End or Space. */
  onValueChange?: (value: string) => void;
  /** `md` (default) keys are 44px tall; `lg` keys are 52px, for a phone sheet. */
  size?: SegmentedControlSize;
  /** Every key loses its height and none can be pressed. */
  disabled?: boolean;
}

/** A bank of interlocking latching keys, like a radio's band selector: pressing one latches it down and lights its lamp, and releases the others. */
export const SegmentedControl = forwardRef<HTMLDivElement, SegmentedControlProps>(function SegmentedControl(
  { label, options, value, defaultValue, onValueChange, size = 'md', disabled = false, className, ...rest },
  ref,
) {
  const auto = useId();
  const labelId = `${auto}-label`;
  const [own, setOwn] = useState<string | undefined>(defaultValue);
  const isControlled = value !== undefined;
  const current = isControlled ? value : own;
  const keys = useRef<Array<HTMLButtonElement | null>>([]);

  const latched = options.findIndex((o) => o.value === current);
  const stop = latched >= 0 ? latched : 0;

  const latch = (i: number) => {
    const next = options[i]?.value;
    if (next === undefined || disabled) return;
    if (next !== current) {
      if (!isControlled) setOwn(next);
      onValueChange?.(next);
    }
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (disabled || !options.length) return;
    const from = keys.current.findIndex((k) => k === e.target);
    const at = from >= 0 ? from : stop;
    const last = options.length - 1;
    const rtl = getComputedStyle(e.currentTarget).direction === 'rtl';
    let to: number | null = null;
    if (e.key === 'ArrowDown' || e.key === (rtl ? 'ArrowLeft' : 'ArrowRight')) to = at === last ? 0 : at + 1;
    else if (e.key === 'ArrowUp' || e.key === (rtl ? 'ArrowRight' : 'ArrowLeft')) to = at === 0 ? last : at - 1;
    else if (e.key === 'Home') to = 0;
    else if (e.key === 'End') to = last;
    if (to === null) return;
    e.preventDefault();
    latch(to);
    keys.current[to]?.focus();
  };

  return (
    <div
      ref={ref}
      data-component="SegmentedControl"
      data-size={size}
      className={cx(styles.root, styles[size], className)}
      {...rest}
    >
      <span id={labelId} className={styles.label}>
        {label}
      </span>
      <div
        role="radiogroup"
        aria-labelledby={labelId}
        aria-disabled={disabled || undefined}
        className={styles.bank}
        onKeyDown={onKeyDown}
      >
        {options.map((o, i) => {
          const on = i === latched;
          return (
            <button
              key={o.value}
              ref={(el) => {
                keys.current[i] = el;
              }}
              type="button"
              role="radio"
              aria-checked={on}
              tabIndex={i === stop ? 0 : -1}
              disabled={disabled}
              data-value={o.value}
              className={styles.key}
              onClick={() => latch(i)}
            >
              <span className={styles.lamp} aria-hidden="true" data-glow={on && !disabled ? 'mark' : undefined} />
              <span className={styles.face}>
                {o.icon != null && (
                  <span className={styles.icon} aria-hidden="true">
                    {o.icon}
                  </span>
                )}
                <span className={styles.word}>{o.label}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
});
