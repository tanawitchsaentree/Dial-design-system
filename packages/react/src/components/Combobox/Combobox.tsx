import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type CSSProperties,
  type InputHTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { cx } from '../../cx';
import { messages } from '../../messages';
import { usePresence } from '../../presence';
import { Icon } from '../Icon';
import type { ListboxOption } from '../Listbox';
import { VisuallyHidden } from '../VisuallyHidden';
import styles from './Combobox.module.css';

export type ComboboxSize = 'md' | 'lg';

/** One choice in the list. It is the same shape as a `Listbox` option, so a `leading` mark such as an `<Avatar>` or an `<Icon>` works here too. */
export type ComboboxOption = ListboxOption;

export interface ComboboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'value' | 'defaultValue' | 'onChange' | 'type' | 'role' | 'children'> {
  /** The printed name above the well. It is required, because it is also the field's accessible name, which `placeholder` cannot be. */
  label: ReactNode;
  /** The choices, in the order they are listed. Typing narrows them; a person can only end up with one of these. */
  options: ComboboxOption[];
  /** The chosen value when controlled. Pair it with `onValueChange`. `null` means nothing is chosen. */
  value?: string | null;
  /** The starting value when uncontrolled. */
  defaultValue?: string;
  /** Called with the option's value when a different option is chosen, and with `null` when the person clears the text and leaves the field. */
  onValueChange?: (value: string | null) => void;
  /** Called with the text in the well each time it changes by typing. Use it to load options from a server. */
  onInputChange?: (text: string) => void;
  /** Decides whether an option stays in the list for the typed text. The default keeps options whose label contains the text, ignoring case. */
  filter?: (option: ComboboxOption, text: string) => boolean;
  /** A short line printed under the well that says what to enter. */
  hint?: ReactNode;
  /** The problem with the current value. When set, the field is marked invalid and the message is printed under the well with a glyph. */
  error?: ReactNode;
  /** `md` (default) is a 44px well and 44px rows; `lg` is a 52px well with larger text, for the main field of a phone sheet. */
  size?: ComboboxSize;
  /** The line printed in the list when no option matches. The default is "No match". */
  emptyText?: string;
  /** The accessible name of the key at the end of the well that opens the list. The default is "Show options". */
  toggleLabel?: string;
  /** The field cannot be used; the well loses its shadow and fades to half. */
  disabled?: boolean;
  /** Submits the chosen value with a form under this name, through a hidden input. The typed text is never submitted. */
  name?: string;
  /** Class name for the outer wrapper (label, well and messages). */
  className?: string;
  /** Inline style for the outer wrapper. */
  style?: CSSProperties;
}

const PAGE = 10;

const byLabel = (o: ComboboxOption, text: string) => o.label.toLocaleLowerCase().includes(text.trim().toLocaleLowerCase());

/** Splits a label around the first match of the typed text, so the matched letters can be set in medium weight. */
const split = (label: string, text: string): [string, string, string] => {
  const q = text.trim().toLocaleLowerCase();
  const lower = label.toLocaleLowerCase();
  const at = q && lower.length === label.length ? lower.indexOf(q) : -1;
  return at < 0 ? [label, '', ''] : [label.slice(0, at), label.slice(at, at + q.length), label.slice(at + q.length)];
};

/** A text field with a list of options that opens under it and narrows as you type (WAI-ARIA APG combobox, list autocomplete). Focus stays in the field and aria-activedescendant names the reached row. Only a listed option can be chosen; text that matches nothing is dropped when the person leaves. */
export const Combobox = forwardRef<HTMLInputElement, ComboboxProps>(function Combobox(
  {
    label, options, value, defaultValue, onValueChange, onInputChange, filter = byLabel, hint, error, size = 'md',
    emptyText = messages.combobox.empty, toggleLabel = messages.combobox.toggle, disabled = false, name,
    id, className, style, placeholder, 'aria-describedby': describedBy, onFocus, onBlur, onKeyDown, onClick, ...rest
  },
  ref,
) {
  const auto = useId();
  const fieldId = id ?? `${auto}-field`;
  const listId = `${auto}-list`;
  const hintId = `${auto}-hint`;
  const errorId = `${auto}-error`;
  const optId = (i: number) => `${auto}-opt-${i}`;

  const controlled = value !== undefined;
  const [inner, setInner] = useState<string | null>(defaultValue ?? null);
  const current = controlled ? value : inner;
  const chosen = options.find((o) => o.value === current) ?? null;

  const [text, setText] = useState(chosen?.label ?? '');
  // `dirty` is true once the person has typed since the list last closed; until then every option is listed
  const [dirty, setDirty] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const presence = usePresence<HTMLDivElement>(open && !disabled);

  const setInput = (el: HTMLInputElement | null) => {
    inputRef.current = el;
    if (typeof ref === 'function') ref(el);
    else if (ref) ref.current = el;
  };

  const shown = dirty && text.trim() ? options.filter((o) => filter(o, text)) : options;
  const n = shown.length;
  const usable = (list: ComboboxOption[], i: number) => i >= 0 && i < list.length && !list[i].disabled;
  const firstOf = (list: ComboboxOption[]) => list.findIndex((o) => !o.disabled);
  // walk `count` usable rows from `from`, skipping rows that cannot be chosen; stays put at either end
  const walk = (from: number, dir: 1 | -1, count = 1) => {
    let at = from;
    for (let left = count; left > 0; left--) {
      let j = at + dir;
      while (j >= 0 && j < n && shown[j].disabled) j += dir;
      if (j < 0 || j >= n) break;
      at = j;
    }
    return at;
  };

  // the words in the well follow the chosen option when the value is changed from outside
  const chosenLabel = chosen?.label ?? '';
  useEffect(() => { setText(chosenLabel); setDirty(false); }, [chosenLabel]);

  const commit = (next: string | null) => {
    if (!controlled) setInner(next);
    if (next !== current) onValueChange?.(next);
  };

  const show = (at: number) => {
    if (disabled) return;
    setActive(at);
    setOpen(true);
  };
  const startAt = () => {
    const i = options.findIndex((o) => o.value === current && !o.disabled);
    return i >= 0 ? i : firstOf(options);
  };

  // leaving the field drops text that is not an option: the words go back to the chosen one, or the choice clears
  const settle = () => {
    setOpen(false);
    setActive(-1);
    setDirty(false);
    if (text.trim() === '' && current != null) { commit(null); setText(''); }
    else setText(chosenLabel);
  };

  const choose = (i: number) => {
    const o = shown[i];
    if (!o || o.disabled) return;
    commit(o.value);
    setText(o.label);
    setDirty(false);
    setOpen(false);
    setActive(-1);
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value;
    setText(next);
    setDirty(true);
    onInputChange?.(next);
    setOpen(!disabled);
    // the first option that can be chosen is reached, so Enter picks the best match
    const list = next.trim() ? options.filter((o) => filter(o, next)) : options;
    setActive(firstOf(list));
  };

  const keys = (e: KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(e);
    if (e.defaultPrevented || disabled) return;
    const k = e.key;
    if (!open) {
      if (k === 'ArrowDown' || k === 'ArrowUp') { e.preventDefault(); setDirty(false); show(startAt()); }
      return;
    }
    const move = (to: number) => { e.preventDefault(); if (to >= 0) setActive(to); };
    const at = active >= 0 ? active : firstOf(shown);
    if (k === 'ArrowDown') return move(e.altKey ? at : walk(active < 0 ? -1 : active, 1));
    if (k === 'ArrowUp') return move(walk(active < 0 ? n : active, -1));
    if (k === 'PageDown') return move(walk(at, 1, PAGE));
    if (k === 'PageUp') return move(walk(at, -1, PAGE));
    if (k === 'Enter') { e.preventDefault(); if (usable(shown, active)) choose(active); return; }
    if (k === 'Escape') { e.preventDefault(); e.stopPropagation(); setOpen(false); setActive(-1); setDirty(false); setText(chosenLabel); }
  };

  const toggle = () => {
    if (disabled) return;
    inputRef.current?.focus();
    if (open) { setOpen(false); setActive(-1); return; }
    setDirty(false);
    show(startAt());
  };

  // the reached row stays in view while the arrows walk the list
  useEffect(() => {
    if (!open || active < 0) return;
    document.getElementById(`${auto}-opt-${active}`)?.scrollIntoView?.({ block: 'nearest' });
  }, [open, active, auto]);

  useEffect(() => { if (disabled) { setOpen(false); setActive(-1); } }, [disabled]);

  const invalid = error != null && error !== false && error !== '';
  const described = [hint != null ? hintId : null, invalid ? errorId : null, describedBy].filter(Boolean).join(' ') || undefined;
  const live = open && dirty ? (n ? messages.combobox.results(n) : emptyText) : '';

  return (
    <div
      data-component="Combobox"
      data-invalid={invalid || undefined}
      data-disabled={disabled || undefined}
      className={cx(styles.root, styles[size], className)}
      style={style}
    >
      <label id={`${auto}-label`} className={styles.label} htmlFor={fieldId}>{label}</label>
      <div className={styles.anchor}>
      <div className={styles.well}>
        {chosen?.leading != null && !dirty && <span className={styles.mark} aria-hidden="true">{chosen.leading}</span>}
        <input
          {...rest}
          ref={setInput}
          id={fieldId}
          type="text"
          role="combobox"
          autoComplete="off"
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls={listId}
          aria-activedescendant={open && active >= 0 && active < n ? optId(active) : undefined}
          aria-invalid={invalid || undefined}
          aria-describedby={described}
          className={styles.field}
          disabled={disabled}
          placeholder={placeholder}
          value={text}
          onChange={onChange}
          onKeyDown={keys}
          onClick={(e) => { onClick?.(e); if (!open && !disabled) { setDirty(false); show(startAt()); } }}
          onFocus={onFocus}
          onBlur={(e) => { onBlur?.(e); settle(); }}
        />
        <button
          type="button"
          tabIndex={-1}
          aria-label={toggleLabel}
          aria-expanded={open}
          aria-controls={listId}
          disabled={disabled}
          className={styles.toggle}
          // a press on the key must not take focus from the field, or the list would close as the field blurs
          onMouseDown={(e) => e.preventDefault()}
          onClick={toggle}
        >
          {/* dial's one icon language, the dot matrix (R-005) */}
          <Icon name="chevron-down" size="sm" className={styles.chevron} />
        </button>
      </div>
      <div
        ref={presence.ref}
        hidden={!presence.mounted}
        data-state={presence.state}
        // a leaving list is only a picture: no key reaches it and assistive tech no longer lists it
        inert={presence.state === 'closing' || undefined}
        aria-hidden={presence.state === 'closing' || undefined}
        className={styles.panel}
        onMouseDown={(e) => e.preventDefault()}
      >
        <div id={listId} role="listbox" aria-labelledby={`${auto}-label`} hidden={n === 0}>
          {shown.map((o, i) => {
            const [pre, hit, post] = dirty ? split(o.label, text) : [o.label, '', ''];
            return (
              <div
                key={o.value}
                id={optId(i)}
                role="option"
                aria-selected={o.value === current}
                aria-disabled={o.disabled || undefined}
                // the reached row keeps its well while the list leaves, so the list goes as one piece (D-008)
                data-active={presence.mounted && i === active ? 'true' : undefined}
                className={styles.option}
                onPointerMove={() => { if (!o.disabled && i !== active) setActive(i); }}
                onClick={() => choose(i)}
              >
                <Icon name="check" size="sm" className={styles.tick} data-on={o.value === current ? 'true' : undefined} />
                {o.leading != null && <span className={styles.leading} aria-hidden="true">{o.leading}</span>}
                <span className={styles.text}>{pre}{hit && <span className={styles.match}>{hit}</span>}{post}</span>
              </div>
            );
          })}
        </div>
        {n === 0 && <div className={styles.empty}>{emptyText}</div>}
      </div>
      </div>
      <VisuallyHidden role="status" aria-live="polite">{live}</VisuallyHidden>
      {hint != null && <p id={hintId} className={styles.hint}>{hint}</p>}
      {invalid && (
        <p id={errorId} className={styles.error}>
          <Icon name="critical" size="sm" className={styles.glyph} />
          <span>{error}</span>
        </p>
      )}
      {name && <input type="hidden" name={name} value={current ?? ''} />}
    </div>
  );
});
