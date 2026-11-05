import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
} from 'react';
import { cx } from '../../cx';
import { messages } from '../../messages';
import { usePresence } from '../../presence';
import { Chip } from '../Chip';
import { Icon } from '../Icon';
import type { ListboxOption } from '../Listbox';
import { VisuallyHidden } from '../VisuallyHidden';
import styles from './MultiSelect.module.css';

export type MultiSelectSize = 'md' | 'lg';
/** `count` prints a number such as "3 chosen" in the well; `chips` stands each chosen value in the well as a removable Chip. */
export type MultiSelectDisplay = 'count' | 'chips';
export type MultiSelectOption = ListboxOption;

export interface MultiSelectProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue' | 'children'> {
  /** The printed name above the well. It is required, because it is also the field's accessible name. */
  label: ReactNode;
  /** The choices, in the order they are listed. A row with `disabled` stays visible and the arrow keys skip it. */
  options: MultiSelectOption[];
  /** The chosen values when controlled. Pair it with `onValueChange`. */
  value?: string[];
  /** The starting values when uncontrolled. */
  defaultValue?: string[];
  /** Called with all chosen values, in list order, each time a row is toggled or a chip is removed. */
  onValueChange?: (value: string[]) => void;
  /** A prompt shown in the well before anything is chosen, such as "Choose rooms". It never replaces the label. */
  placeholder?: string;
  /** `count` (default) keeps the well one row tall; `chips` shows each chosen value as a removable Chip and the well grows by rows. */
  display?: MultiSelectDisplay;
  /** `md` (default) is a 44px well; `lg` is a 52px well with larger text, for the main choice of a phone sheet. */
  size?: MultiSelectSize;
  /** The field cannot be opened or changed; the well loses its shadow and fades to half. */
  disabled?: boolean;
  /** Submits every chosen value with a form under this name, through one hidden input each. */
  name?: string;
  /** Words for the count in the well. The default prints "3 chosen"; pass your own for another language. */
  countText?: (count: number) => string;
  /** Accessible name of a chip's remove key, from the chip's label. The default is "Remove Kitchen". */
  removeText?: (label: string) => string;
}

const TYPEAHEAD_MS = 500;
const PAGE = 10;

/** A select-only combobox that opens a multiselectable listbox (WAI-ARIA APG). The panel stays open while rows are toggled with Space or Enter;
 *  the well says the value as a count or as removable Chips. */
export const MultiSelect = forwardRef<HTMLButtonElement, MultiSelectProps>(function MultiSelect(
  { label, options, value, defaultValue, onValueChange, placeholder, display = 'count', size = 'md', disabled = false, name, countText = messages.multiSelect.count, removeText = messages.multiSelect.remove, className, ...rest },
  ref,
) {
  const id = useId();
  const labelId = `${id}-label`;
  const valueId = `${id}-value`;
  const listId = `${id}-list`;
  const optId = (i: number) => `${id}-opt-${i}`;

  const controlled = value !== undefined;
  const [inner, setInner] = useState<string[]>(defaultValue ?? []);
  const chosen = controlled ? value : inner;
  const isOn = (v: string) => chosen.includes(v);

  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  // the panel stays mounted while it leaves, so closing moves out instead of vanishing (D-008)
  const presence = usePresence<HTMLDivElement>(open);
  const typed = useRef('');
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const setTrigger = (el: HTMLButtonElement | null) => {
    triggerRef.current = el;
    if (typeof ref === 'function') ref(el);
    else if (ref) ref.current = el;
  };

  const n = options.length;
  const usable = (i: number) => i >= 0 && i < n && !options[i].disabled;
  // walk `count` usable rows from `from`, skipping rows that cannot be chosen; stays put at either end
  const walk = (from: number, dir: 1 | -1, count = 1) => {
    let at = from;
    for (let left = count; left > 0; left--) {
      let j = at + dir;
      while (j >= 0 && j < n && options[j].disabled) j += dir;
      if (j < 0 || j >= n) break;
      at = j;
    }
    return at;
  };
  const first = () => { const i = walk(-1, 1); return usable(i) ? i : -1; };
  const lastUsable = () => { const i = walk(n, -1); return usable(i) ? i : -1; };
  const start = () => { const c = options.findIndex((o, i) => usable(i) && isOn(o.value)); return c >= 0 ? c : first(); };

  const show = useCallback((at: number) => {
    if (disabled || !n) return;
    setActive(at);
    setOpen(true);
  }, [disabled, n]);

  const close = useCallback((refocus = false) => {
    setOpen(false);
    typed.current = '';
    if (refocus) triggerRef.current?.focus();
  }, []);

  const commit = (next: string[]) => {
    if (!controlled) setInner(next);
    onValueChange?.(next);
  };
  const inListOrder = (set: Set<string>) => options.map((o) => o.value).filter((v) => set.has(v));
  const toggle = (i: number) => {
    if (disabled || !usable(i)) return;
    const set = new Set(chosen);
    const v = options[i].value;
    if (set.has(v)) set.delete(v); else set.add(v);
    commit(inListOrder(set));
  };
  const toggleAll = () => {
    const all = options.filter((o, i) => usable(i)).map((o) => o.value);
    const allOn = all.every(isOn);
    const set = new Set(chosen);
    for (const v of all) { if (allOn) set.delete(v); else set.add(v); }
    commit(inListOrder(set));
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

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled || !n) return;
    const k = e.key;
    const printable = k.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey;
    if (!open) {
      if (k === 'ArrowDown' || k === 'ArrowUp' || k === 'Enter' || k === ' ') { e.preventDefault(); show(start()); }
      else if (k === 'Home') { e.preventDefault(); show(first()); }
      else if (k === 'End') { e.preventDefault(); show(lastUsable()); }
      else if (printable) { const hit = find(k, start()); show(hit >= 0 ? hit : start()); }
      return;
    }
    const at = active >= 0 ? active : first();
    const go = (to: number) => { e.preventDefault(); if (to >= 0) setActive(to); };
    if (k === 'ArrowDown' || k === 'ArrowUp') {
      const to = walk(at, k === 'ArrowDown' ? 1 : -1);
      go(to);
      // Shift with an arrow moves and toggles the row it reaches
      if (e.shiftKey && to !== at) toggle(to);
      return;
    }
    if (k === 'Home') return go(first());
    if (k === 'End') return go(lastUsable());
    if (k === 'PageDown') return go(walk(at, 1, PAGE));
    if (k === 'PageUp') return go(walk(at, -1, PAGE));
    // Space and Enter toggle the reached row and leave the panel open
    if (k === 'Enter' || (k === ' ' && !typed.current)) { e.preventDefault(); toggle(at); return; }
    if ((e.ctrlKey || e.metaKey) && k.toLowerCase() === 'a') { e.preventDefault(); toggleAll(); return; }
    if (k === 'Escape') { e.preventDefault(); close(true); return; }
    if (k === 'Tab') { close(); return; }
    if (printable) go(find(k, at));
  };

  // Space on a native button clicks on key up; the keydown above already opened or toggled
  const onKeyUp = (e: KeyboardEvent<HTMLButtonElement>) => { if (e.key === ' ') e.preventDefault(); };
  const onClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (e.detail === 0) return; // a click made by the keyboard is handled in onKeyDown
    if (open) close(); else show(start());
  };

  // a press anywhere outside the field closes the list
  useEffect(() => {
    if (!open) return;
    const away = (e: PointerEvent) => { if (!rootRef.current?.contains(e.target as Node)) close(); };
    document.addEventListener('pointerdown', away);
    return () => document.removeEventListener('pointerdown', away);
  }, [open, close]);

  // the reached row stays in view while the arrows walk the list
  useEffect(() => {
    if (!open || active < 0) return;
    document.getElementById(`${id}-opt-${active}`)?.scrollIntoView?.({ block: 'nearest' });
  }, [open, active, id]);

  useEffect(() => { if (disabled) setOpen(false); }, [disabled]);
  useEffect(() => () => clearTimeout(timer.current), []);

  const picked = options.filter((o) => isOn(o.value));
  const count = picked.length;
  const asChips = display === 'chips';
  const summary = countText(count);

  return (
    <div ref={rootRef} data-component="MultiSelect" className={cx(styles.root, styles[size], className)} {...rest}>
      <span id={labelId} className={styles.label}>{label}</span>
      <div className={styles.well}>
        {asChips && count > 0 && (
          <div className={styles.chips}>
            {picked.map((o) => (
              <Chip
                key={o.value}
                size="sm"
                disabled={disabled}
                removeLabel={removeText(o.label)}
                onRemove={() => {
                  commit(inListOrder(new Set(chosen.filter((v) => v !== o.value))));
                  triggerRef.current?.focus();
                }}
              >
                {o.label}
              </Chip>
            ))}
          </div>
        )}
        <button
          ref={setTrigger}
          type="button"
          role="combobox"
          aria-labelledby={`${labelId} ${valueId}`}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listId}
          aria-activedescendant={open && active >= 0 ? optId(active) : undefined}
          disabled={disabled}
          className={styles.trigger}
          onKeyDown={onKeyDown}
          onKeyUp={onKeyUp}
          onClick={onClick}
          onBlur={(e) => { if (open && !rootRef.current?.contains(e.relatedTarget as Node)) close(); }}
        >
          <span id={valueId} className={cx(styles.value, count === 0 && styles.placeholder)}>
            {count === 0 ? (placeholder ?? ' ') : asChips ? <VisuallyHidden>{summary}</VisuallyHidden> : summary}
          </span>
          {/* dial's one icon language, the dot matrix (R-005) */}
          <Icon name="chevron-down" size="sm" className={styles.chevron} />
        </button>
      </div>
      <div
        ref={presence.ref}
        id={listId}
        role="listbox"
        aria-multiselectable="true"
        aria-labelledby={labelId}
        tabIndex={-1}
        hidden={!presence.mounted}
        data-state={presence.state}
        // a leaving panel is only a picture of the list: no key reaches it and assistive tech no longer lists it
        inert={presence.state === 'closing' || undefined}
        aria-hidden={presence.state === 'closing' || undefined}
        className={styles.panel}
        onMouseDown={(e) => e.preventDefault()}
      >
        {options.map((o, i) => (
          <div
            key={o.value}
            id={optId(i)}
            role="option"
            aria-selected={isOn(o.value)}
            aria-disabled={o.disabled || undefined}
            // the reached row keeps its well while the panel leaves, so the panel goes as one piece (D-008)
            data-active={presence.mounted && i === active ? 'true' : undefined}
            className={styles.option}
            onPointerMove={() => { if (usable(i) && i !== active) setActive(i); }}
            onClick={() => { setActive(i); toggle(i); }}
          >
            <Icon name="check" size="sm" className={styles.tick} data-on={isOn(o.value) ? 'true' : undefined} />
            <span className={styles.text}>{o.label}</span>
          </div>
        ))}
      </div>
      {name && chosen.map((v) => <input key={v} type="hidden" name={name} value={v} />)}
    </div>
  );
});
