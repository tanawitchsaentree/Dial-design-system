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
import styles from './Tabs.module.css';

export type TabsActivation = 'automatic' | 'manual';

export interface TabsItem {
  /** The value this section stands for. Unique within the tabs. */
  value: string;
  /** The section name printed in the row, such as Kitchen. It is the tab's accessible name. */
  label: ReactNode;
  /** What the section shows when its name is chosen. */
  content: ReactNode;
}

export interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue' | 'children'> {
  /** What the sections are, such as Rooms. It is required, because it is the accessible name of the row of names. */
  label: string;
  /** The sections in order. Each has a value, a printed name and its content. */
  items: TabsItem[];
  /** The value of the chosen section, when you control it. Pair it with `onValueChange`. */
  value?: string;
  /** The section chosen at first, when the tabs keep their own state. It defaults to the first item. */
  defaultValue?: string;
  /** Called with the new value when another section is chosen. */
  onValueChange?: (value: string) => void;
  /** With `automatic` (default) the arrow keys choose the section they reach, because every panel is already on the page. With `manual` the arrows only move focus and Enter or Space chooses, for panels that are slow to show. */
  activation?: TabsActivation;
}

/** Section names printed in a row, like the scale on an appliance case: the chosen one is set in medium weight with one ink index mark under it. */
export const Tabs = forwardRef<HTMLDivElement, TabsProps>(function Tabs(
  { label, items, value, defaultValue, onValueChange, activation = 'automatic', className, ...rest },
  ref,
) {
  const auto = useId();
  const [own, setOwn] = useState<string | undefined>(defaultValue ?? items[0]?.value);
  const isControlled = value !== undefined;
  const current = isControlled ? value : own;
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);
  const found = items.findIndex((it) => it.value === current);
  const chosen = found >= 0 ? found : 0;

  const choose = (i: number) => {
    const next = items[i]?.value;
    if (next === undefined || next === current) return;
    if (!isControlled) setOwn(next);
    onValueChange?.(next);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!items.length) return;
    const from = tabs.current.findIndex((t) => t === e.target);
    const at = from >= 0 ? from : chosen;
    const last = items.length - 1;
    const rtl = getComputedStyle(e.currentTarget).direction === 'rtl';
    let to: number | null = null;
    if (e.key === (rtl ? 'ArrowLeft' : 'ArrowRight')) to = at === last ? 0 : at + 1;
    else if (e.key === (rtl ? 'ArrowRight' : 'ArrowLeft')) to = at === 0 ? last : at - 1;
    else if (e.key === 'Home') to = 0;
    else if (e.key === 'End') to = last;
    if (to === null) return;
    e.preventDefault();
    tabs.current[to]?.focus();
    if (activation === 'automatic') choose(to);
  };

  return (
    <div ref={ref} data-component="Tabs" data-activation={activation} className={cx(styles.root, className)} {...rest}>
      <div role="tablist" aria-label={label} aria-orientation="horizontal" className={styles.list} onKeyDown={onKeyDown}>
        {items.map((it, i) => {
          const on = i === chosen;
          return (
            <button
              key={it.value}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`${auto}-tab-${i}`}
              aria-selected={on}
              aria-controls={`${auto}-panel-${i}`}
              tabIndex={on ? 0 : -1}
              data-value={it.value}
              className={styles.tab}
              onClick={() => choose(i)}
            >
              <span className={styles.word}>
                <span className={styles.text}>{it.label}</span>
                <span className={styles.ghost} aria-hidden="true">
                  {it.label}
                </span>
              </span>
              <span className={styles.mark} aria-hidden="true" />
            </button>
          );
        })}
      </div>
      {/* the panels share one cell, so the leaving section fades out where the new one fades in (D-008) */}
      <div className={styles.panels}>
        {items.map((it, i) => (
          <div
            key={it.value}
            role="tabpanel"
            id={`${auto}-panel-${i}`}
            aria-labelledby={`${auto}-tab-${i}`}
            tabIndex={0}
            hidden={i !== chosen}
            className={styles.panel}
          >
            {it.content}
          </div>
        ))}
      </div>
    </div>
  );
});
