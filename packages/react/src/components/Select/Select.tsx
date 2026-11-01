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
import styles from './Select.module.css';

export type SelectSize = 'md' | 'lg';

/** One choice in the list. `label` is printed in the list and on the closed field, and type-ahead matches it. */
export interface SelectOption {
  /** The value passed to `onValueChange` and submitted with a form. */
  value: string;
  /** The words printed for this option. */
  label: string;
}

export interface SelectProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue' | 'children'> {
  /** The printed name above the well. Required: it is also the field's accessible name. */
  label: ReactNode;
  /** The choices, in the order they are listed. */
  options: SelectOption[];
  /** The chosen value when controlled. Pair it with `onValueChange`. `null` means nothing is chosen yet. */
  value?: string | null;
  /** The starting value when uncontrolled. */
  defaultValue?: string;
  /** Called with the option's value when the person picks a different option. */
  onValueChange?: (value: string) => void;
  /** A prompt shown in the well before anything is chosen, such as "Choose a programme". It never replaces the label. */
  placeholder?: string;
  /** `md` (default) is a 44px well; `lg` is a 52px well with larger text, for the main choice of a phone sheet. */
  size?: SelectSize;
  /** The field cannot be opened; the well loses its shadow and fades to half. */
  disabled?: boolean;
  /** Submits the chosen value with a form under this name, through a hidden input. */
  name?: string;
}

const TYPEAHEAD_MS = 500;
const PAGE = 10;

/** A select-only combobox: a recessed well with a printed chevron that opens a plastic panel of options (WAI-ARIA APG pattern). */
export const Select = forwardRef<HTMLButtonElement, SelectProps>(function Select(
  { label, options, value, defaultValue, onValueChange, placeholder, size = 'md', disabled = false, name, className, ...rest },
  ref,
) {
  const id = useId();
  const labelId = `${id}-label`;
  const listId = `${id}-list`;
  const optId = (i: number) => `${id}-opt-${i}`;

  const controlled = value !== undefined;
  const [inner, setInner] = useState<string | null>(defaultValue ?? null);
  const current = controlled ? value : inner;
  const selected = options.findIndex((o) => o.value === current);

  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const typed = useRef('');
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const setTrigger = (el: HTMLButtonElement | null) => {
    triggerRef.current = el;
    if (typeof ref === 'function') ref(el);
    else if (ref) ref.current = el;
  };

  const last = options.length - 1;
  const clamp = (i: number) => Math.max(0, Math.min(last, i));
  const start = () => (selected >= 0 ? selected : 0);

  const show = useCallback((at: number) => {
    if (disabled || !options.length) return;
    setActive(at);
    setOpen(true);
  }, [disabled, options.length]);

  const close = useCallback((refocus = false) => {
    setOpen(false);
    typed.current = '';
    if (refocus) triggerRef.current?.focus();
  }, []);

  const choose = (i: number) => {
    const o = options[i];
    if (o) {
      if (!controlled) setInner(o.value);
      if (o.value !== current) onValueChange?.(o.value);
    }
    close(true);
  };

  // type-ahead: letters typed within half a second build a search; one letter repeated cycles its options
  const find = (ch: string, from: number) => {
    clearTimeout(timer.current);
    typed.current += ch.toLocaleLowerCase();
    timer.current = setTimeout(() => { typed.current = ''; }, TYPEAHEAD_MS);
    const q = typed.current;
    const order = [...options.keys()].map((k) => (from + 1 + k) % options.length);
    const starts = (i: number, s: string) => options[i].label.toLocaleLowerCase().startsWith(s);
    let hit = order.find((i) => starts(i, q));
    if (hit === undefined && [...q].every((c) => c === q[0])) hit = order.find((i) => starts(i, q[0]));
    return hit ?? -1;
  };

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled || !options.length) return;
    const k = e.key;
    const printable = k.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey;
    if (!open) {
      if (k === 'ArrowDown' || k === 'ArrowUp' || k === 'Enter' || k === ' ') { e.preventDefault(); show(start()); }
      else if (k === 'Home') { e.preventDefault(); show(0); }
      else if (k === 'End') { e.preventDefault(); show(last); }
      else if (printable) { const hit = find(k, selected); show(hit >= 0 ? hit : start()); }
      return;
    }
    if (k === 'ArrowUp' && e.altKey) { e.preventDefault(); choose(active); return; }
    const move: Record<string, number> = { ArrowDown: active + 1, ArrowUp: active - 1, Home: 0, End: last, PageDown: active + PAGE, PageUp: active - PAGE };
    if (k in move) { e.preventDefault(); setActive(clamp(move[k])); return; }
    if (k === 'Enter' || (k === ' ' && !typed.current)) { e.preventDefault(); choose(active); return; }
    if (k === 'Escape') { e.preventDefault(); close(true); return; }
    if (k === 'Tab') { choose(active); return; }
    if (printable) { e.preventDefault(); const hit = find(k, active); if (hit >= 0) setActive(hit); }
  };

  // Space on a native button clicks on key up; the keydown above already opened or chose
  const onKeyUp = (e: KeyboardEvent<HTMLButtonElement>) => { if (e.key === ' ') e.preventDefault(); };
  const onClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (e.detail === 0) return; // a click made by the keyboard is handled in onKeyDown
    if (open) close(); else show(start());
  };

  // a press anywhere outside the field closes the list without choosing
  useEffect(() => {
    if (!open) return;
    const away = (e: PointerEvent) => { if (!rootRef.current?.contains(e.target as Node)) close(); };
    document.addEventListener('pointerdown', away);
    return () => document.removeEventListener('pointerdown', away);
  }, [open, close]);

  // the active row stays in view while the arrows walk the list
  useEffect(() => {
    if (!open || active < 0) return;
    const row = document.getElementById(`${id}-opt-${active}`);
    row?.scrollIntoView?.({ block: 'nearest' });
  }, [open, active, id]);

  useEffect(() => { if (disabled) setOpen(false); }, [disabled]);
  useEffect(() => () => clearTimeout(timer.current), []);

  const chosen = selected >= 0 ? options[selected].label : null;

  return (
    <div ref={rootRef} data-component="Select" className={cx(styles.root, styles[size], className)} {...rest}>
      <span id={labelId} className={styles.label}>{label}</span>
      <button
        ref={setTrigger}
        type="button"
        role="combobox"
        aria-labelledby={labelId}
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
        <span className={cx(styles.value, chosen == null && styles.placeholder)}>{chosen ?? placeholder ?? ' '}</span>
        <svg className={styles.chevron} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
          <path d="M4 6l4 4 4-4" />
        </svg>
      </button>
      <div
        ref={listRef}
        id={listId}
        role="listbox"
        aria-labelledby={labelId}
        tabIndex={-1}
        hidden={!open}
        className={styles.panel}
        onMouseDown={(e) => e.preventDefault()}
      >
        {options.map((o, i) => (
          <div
            key={o.value}
            id={optId(i)}
            role="option"
            aria-selected={i === selected}
            data-active={open && i === active ? 'true' : undefined}
            className={styles.option}
            onPointerMove={() => { if (i !== active) setActive(i); }}
            onClick={() => choose(i)}
          >
            <svg className={styles.tick} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
              {i === selected && <path d="M3 8.5l3.2 3L13 4.5" />}
            </svg>
            <span className={styles.text}>{o.label}</span>
          </div>
        ))}
      </div>
      {name && <input type="hidden" name={name} value={current ?? ''} />}
    </div>
  );
});
