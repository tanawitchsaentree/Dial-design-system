import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { cx } from '../../cx';
import { messages } from '../../messages';
import { Icon } from '../Icon';
import styles from './Listbox.module.css';

export type ListboxSize = 'md' | 'lg';

/** One choice in the list. The same shape serves Select, Combobox and MultiSelect. */
export interface ListboxOption {
  /** The value passed to `onValueChange` and submitted with a form. Must be unique in the list. */
  value: string;
  /** The words printed for this option. Type-ahead matches the start of it. */
  label: string;
  /** A small mark before the words, such as an `<Icon>` or an `<Avatar>`. It is decoration; the label names the row. */
  leading?: ReactNode;
  /** The row stays visible but cannot be chosen, and the arrow keys skip it. */
  disabled?: boolean;
}

interface ListboxBase extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue' | 'children'> {
  /** The printed name above the window. It is required, because it is also the list's accessible name. */
  label: ReactNode;
  /** The choices, in the order they are listed. */
  options: ListboxOption[];
  /** `md` (default) has 44px rows; `lg` has 52px rows with larger text, for the main choice of a phone sheet. */
  size?: ListboxSize;
  /** The list takes no choice; the window loses its shadow and fades to half. */
  disabled?: boolean;
  /** Submits the chosen value or values with a form under this name, through hidden inputs. */
  name?: string;
  /** The line printed when `options` is empty. The default is "Nothing to choose from". */
  emptyText?: string;
}

export interface ListboxSingleProps extends ListboxBase {
  /** One choice at a time (default). Choosing a row replaces the previous one. */
  multiple?: false;
  /** The chosen value when controlled. Pair it with `onValueChange`. `null` means nothing is chosen. */
  value?: string | null;
  /** The starting value when uncontrolled. */
  defaultValue?: string;
  /** Called with the option's value when the person picks a different option. */
  onValueChange?: (value: string) => void;
}

export interface ListboxMultipleProps extends ListboxBase {
  /** Any number of rows can be chosen. Space toggles the reached row. */
  multiple: true;
  /** The chosen values when controlled. Pair it with `onValueChange`. */
  value?: string[];
  /** The starting values when uncontrolled. */
  defaultValue?: string[];
  /** Called with all chosen values, in list order, after a row is toggled. */
  onValueChange?: (value: string[]) => void;
}

export type ListboxProps = ListboxSingleProps | ListboxMultipleProps;

const TYPEAHEAD_MS = 500;
const PAGE = 10;

const asList = (v: string | string[] | null | undefined): string[] => (v == null ? [] : Array.isArray(v) ? v : [v]);

/** An always-visible list of options in one recessed window (WAI-ARIA APG listbox). One tab stop; arrows, Home, End, Page keys and type-ahead walk the rows. */
export const Listbox = forwardRef<HTMLDivElement, ListboxProps>(function Listbox(props, ref) {
  const { label, options, size = 'md', disabled = false, name, emptyText = messages.listbox.empty, className, multiple, value, defaultValue, onValueChange, ...rest } = props;
  const id = useId();
  const labelId = `${id}-label`;
  const optId = (i: number) => `${id}-opt-${i}`;

  const controlled = value !== undefined;
  const [inner, setInner] = useState<string[]>(asList(defaultValue));
  const chosen = controlled ? asList(value) : inner;
  const isOn = (v: string) => chosen.includes(v);

  const [active, setActive] = useState(-1);
  const listRef = useRef<HTMLDivElement | null>(null);
  const typed = useRef('');
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const setList = (el: HTMLDivElement | null) => {
    listRef.current = el;
    if (typeof ref === 'function') ref(el);
    else if (ref) ref.current = el;
  };

  const n = options.length;
  const usable = (i: number) => i >= 0 && i < n && !options[i].disabled;
  // walk `count` usable rows from `from`, skipping rows that cannot be chosen; stays put at either end
  const walk = useCallback((from: number, dir: 1 | -1, count = 1) => {
    let at = from;
    for (let left = count; left > 0; left--) {
      let j = at + dir;
      while (j >= 0 && j < n && options[j].disabled) j += dir;
      if (j < 0 || j >= n) break;
      at = j;
    }
    return at;
  }, [options, n]);
  const first = () => { const i = walk(-1, 1); return usable(i) ? i : -1; };
  const lastUsable = () => { const i = walk(n, -1); return usable(i) ? i : -1; };
  const firstChosen = () => options.findIndex((o, i) => usable(i) && isOn(o.value));

  const commit = (next: string[]) => {
    if (!controlled) setInner(next);
    if (multiple) (onValueChange as ((v: string[]) => void) | undefined)?.(next);
    else if (next[0] !== chosen[0]) (onValueChange as ((v: string) => void) | undefined)?.(next[0]);
  };

  const pick = (i: number) => {
    if (disabled || !usable(i)) return;
    const v = options[i].value;
    if (multiple) {
      const set = new Set(chosen);
      if (set.has(v)) set.delete(v); else set.add(v);
      commit(options.map((o) => o.value).filter((x) => set.has(x)));
    } else {
      commit([v]);
    }
  };

  // type-ahead: letters typed within half a second build a search; one letter repeated cycles its options
  const find = (ch: string, from: number) => {
    clearTimeout(timer.current);
    typed.current += ch.toLocaleLowerCase();
    timer.current = setTimeout(() => { typed.current = ''; }, TYPEAHEAD_MS);
    const q = typed.current;
    const order = [...options.keys()].map((k) => (from + 1 + k + n) % n).filter(usable);
    const starts = (i: number, s: string) => options[i].label.toLocaleLowerCase().startsWith(s);
    let hit = order.find((i) => starts(i, q));
    if (hit === undefined && [...q].every((c) => c === q[0])) hit = order.find((i) => starts(i, q[0]));
    return hit ?? -1;
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (disabled || !n) return;
    const k = e.key;
    const printable = k.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey;
    const at = active >= 0 ? active : first();
    const go = (to: number) => { e.preventDefault(); if (to >= 0) setActive(to); };
    if (k === 'ArrowDown' || k === 'ArrowUp') {
      const to = walk(at, k === 'ArrowDown' ? 1 : -1);
      go(to);
      // Shift with an arrow moves and toggles the row it reaches (multiple only)
      if (e.shiftKey && multiple && to !== at) pick(to);
      return;
    }
    if (k === 'Home') return go(first());
    if (k === 'End') return go(lastUsable());
    if (k === 'PageDown') return go(walk(at, 1, PAGE));
    if (k === 'PageUp') return go(walk(at, -1, PAGE));
    if (k === 'Enter' || (k === ' ' && !typed.current)) { e.preventDefault(); pick(at); return; }
    if ((e.ctrlKey || e.metaKey) && k.toLowerCase() === 'a' && multiple) {
      e.preventDefault();
      const all = options.filter((o, i) => usable(i)).map((o) => o.value);
      const allOn = all.every(isOn);
      commit(options.map((o) => o.value).filter((v) => (allOn ? !all.includes(v) && isOn(v) : all.includes(v) || isOn(v))));
      return;
    }
    if (printable) { e.preventDefault(); go(find(k, at)); }
  };

  // the reached row stays in view while the arrows walk the list
  useEffect(() => {
    if (active < 0) return;
    document.getElementById(`${id}-opt-${active}`)?.scrollIntoView?.({ block: 'nearest' });
  }, [active, id]);

  useEffect(() => { if (disabled) setActive(-1); }, [disabled]);
  useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <div data-component="Listbox" className={cx(styles.root, styles[size], className)} {...rest}>
      <span id={labelId} className={styles.label}>{label}</span>
      <div
        ref={setList}
        role="listbox"
        aria-labelledby={labelId}
        aria-multiselectable={multiple ? true : undefined}
        aria-disabled={disabled || undefined}
        aria-activedescendant={active >= 0 && active < n ? optId(active) : undefined}
        tabIndex={disabled ? -1 : 0}
        className={styles.list}
        onKeyDown={onKeyDown}
        onFocus={() => { if (active < 0) setActive(firstChosen() >= 0 ? firstChosen() : first()); }}
        onBlur={() => setActive(-1)}
        onPointerLeave={() => { if (document.activeElement !== listRef.current) setActive(-1); }}
      >
        {n === 0 && <div className={styles.empty}>{emptyText}</div>}
        {options.map((o, i) => (
          <div
            key={o.value}
            id={optId(i)}
            role="option"
            aria-selected={isOn(o.value)}
            aria-disabled={o.disabled || undefined}
            data-active={i === active ? 'true' : undefined}
            className={styles.option}
            onPointerMove={() => { if (!disabled && usable(i) && i !== active) setActive(i); }}
            onMouseDown={(e) => { e.preventDefault(); listRef.current?.focus(); }}
            onClick={() => { setActive(i); pick(i); }}
          >
            {/* dial's one icon language, the dot matrix (R-005) */}
            <Icon name="check" size="sm" className={styles.tick} data-on={isOn(o.value) ? 'true' : undefined} />
            {o.leading != null && <span className={styles.leading} aria-hidden="true">{o.leading}</span>}
            <span className={styles.text}>{o.label}</span>
          </div>
        ))}
      </div>
      {name && !multiple && <input type="hidden" name={name} value={chosen[0] ?? ''} />}
      {name && multiple && chosen.map((v) => <input key={v} type="hidden" name={name} value={v} />)}
    </div>
  );
});
