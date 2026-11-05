import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ChangeEvent,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { cx } from '../../cx';
import { messages } from '../../messages';
import { usePresence } from '../../presence';
import { Input, type InputProps } from '../Input';
import type { ListboxOption } from '../Listbox';
import { Spinner } from '../Spinner';
import { VisuallyHidden } from '../VisuallyHidden';
import styles from './Autocomplete.module.css';

export type AutocompleteSize = 'md' | 'lg';

/** One suggestion. It is the same shape as a Listbox option. `value` is passed to `onChoose` and `label` is what lands in the field. */
export type AutocompleteOption = Pick<ListboxOption, 'value' | 'label' | 'disabled'>;

export interface AutocompleteProps
  extends Omit<InputProps, 'value' | 'defaultValue' | 'onChange' | 'type' | 'role' | 'size' | 'children'> {
  /** The suggestions on offer. For an async source, pass what the source returned and set `filter` to `false`. */
  options: AutocompleteOption[];
  /** The text in the field when controlled. Pair it with `onValueChange`. It is the person's own text, not an option's value. */
  value?: string;
  /** The starting text when uncontrolled. */
  defaultValue?: string;
  /** Called with the new text each time the person types, and with the option's label when a suggestion is chosen. */
  onValueChange?: (text: string) => void;
  /** Called when a suggestion is chosen with the Enter key or a press, not when text is typed. Use it when the choice matters more than the words. */
  onChoose?: (option: AutocompleteOption) => void;
  /** How suggestions are narrowed as the person types. The default keeps options whose label contains the text, ignoring case. Pass your own function, or `false` when the source already filtered. */
  filter?: false | ((option: AutocompleteOption, text: string) => boolean);
  /** The source is working. The panel shows a Spinner row; any suggestions already there stay. Turn it on while an async request runs. */
  loading?: boolean;
  /** The line printed when nothing matches. The default says the typed text stays valid. Pass your own for another language. */
  emptyText?: string;
  /** The word printed beside the Spinner while `loading`. The default is "Searching". */
  busyText?: string;
  /** The accessible name of the suggestion list. The default is "Suggestions". */
  listLabel?: string;
  /** `md` (default) is a 44px well and 44px rows; `lg` is 52px with larger text, for the main field of a phone sheet. */
  size?: AutocompleteSize;
  /** The most suggestions shown at once. The rest are reached by typing more. Default 8. */
  limit?: number;
  /** Class name for the outer wrapper. */
  className?: string;
  /** Inline style for the outer wrapper. */
  style?: CSSProperties;
}

const useLayout = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

const contains = (o: AutocompleteOption, text: string) => o.label.toLocaleLowerCase().includes(text.toLocaleLowerCase());

/** The label split around the first place the typed text appears, so the matched part can be printed in medium weight. */
function splitMatch(label: string, text: string): ReactNode {
  const q = text.trim();
  if (!q) return label;
  const low = label.toLocaleLowerCase();
  const at = low.length === label.length ? low.indexOf(q.toLocaleLowerCase()) : -1;
  if (at < 0) return label;
  return (
    <>
      {label.slice(0, at)}
      <span className={styles.match}>{label.slice(at, at + q.length)}</span>
      {label.slice(at + q.length)}
    </>
  );
}

/** A text field that suggests completions (WAI-ARIA APG combobox, list autocomplete). Focus never leaves the field; the typed words stay valid whether or not a suggestion is chosen. */
export const Autocomplete = forwardRef<HTMLInputElement, AutocompleteProps>(function Autocomplete(
  {
    options,
    value,
    defaultValue,
    onValueChange,
    onChoose,
    filter,
    loading = false,
    emptyText = messages.autocomplete.empty,
    busyText = messages.autocomplete.busy,
    listLabel = messages.autocomplete.list,
    size = 'md',
    limit = 8,
    disabled,
    className,
    style,
    id,
    onKeyDown,
    onBlur,
    ...rest
  },
  ref,
) {
  const auto = useId();
  const fieldId = id ?? `${auto}-field`;
  const listId = `${auto}-list`;
  const optId = (i: number) => `${auto}-opt-${i}`;

  const controlled = value !== undefined;
  const [inner, setInner] = useState(defaultValue ?? '');
  const text = controlled ? value : inner;

  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [top, setTop] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const setInput = (el: HTMLInputElement | null) => {
    inputRef.current = el;
    if (typeof ref === 'function') ref(el);
    else if (ref) ref.current = el;
  };

  const shown = (filter === false ? options : options.filter((o) => (filter ?? contains)(o, text))).slice(0, Math.max(0, limit));
  const n = shown.length;
  const usable = (i: number) => i >= 0 && i < n && !shown[i].disabled;
  const step = (from: number, dir: 1 | -1) => {
    for (let j = from + dir; j >= 0 && j < n; j += dir) if (usable(j)) return j;
    return from;
  };

  // the panel stays for the busy row and the empty line too, as long as the person has typed something
  const wanted = open && !disabled && (n > 0 || loading || text.trim() !== '');
  const presence = usePresence<HTMLDivElement>(wanted);
  const expanded = wanted && n > 0;

  const setText = (next: string) => {
    if (!controlled) setInner(next);
    onValueChange?.(next);
  };

  const close = useCallback(() => { setOpen(false); setActive(-1); }, []);

  const choose = (i: number) => {
    if (!usable(i)) return;
    const o = shown[i];
    setText(o.label);
    onChoose?.(o);
    close();
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
    setActive(-1);
    setOpen(true);
  };

  const keys = (e: KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(e);
    if (e.defaultPrevented || disabled || e.nativeEvent.isComposing) return;
    const k = e.key;
    if (k === 'ArrowDown' || k === 'ArrowUp') {
      e.preventDefault();
      if (!wanted) { setOpen(true); if (!e.altKey && n) setActive(k === 'ArrowDown' ? step(-1, 1) : step(n, -1)); return; }
      if (e.altKey && k === 'ArrowDown') return;
      // from the field the first press reaches the first or last row; Up from the first row returns to the field
      if (k === 'ArrowDown') setActive(active < 0 ? step(-1, 1) : step(active, 1));
      else setActive(active < 0 ? step(n, -1) : step(active, -1) === active ? -1 : step(active, -1));
      return;
    }
    if (k === 'Enter') {
      if (expanded && active >= 0) { e.preventDefault(); choose(active); }
      else if (wanted) close(); // free text: the typed words are kept and a form may submit
      return;
    }
    if (k === 'Escape' && wanted) { e.preventDefault(); e.stopPropagation(); close(); }
  };

  // the reached row stays in view while the arrows walk the list
  useEffect(() => {
    if (active < 0) return;
    document.getElementById(`${auto}-opt-${active}`)?.scrollIntoView?.({ block: 'nearest' });
  }, [active, auto]);

  // the panel opens flush under the well, which sits under the label and above any hint
  useLayout(() => {
    if (!presence.mounted) return;
    const well = inputRef.current?.parentElement;
    if (well) setTop(well.offsetTop + well.offsetHeight);
  }, [presence.mounted, size]);

  // a press anywhere outside the field closes the panel
  useEffect(() => {
    if (!open) return;
    const away = (e: PointerEvent) => { if (!rootRef.current?.contains(e.target as Node)) close(); };
    document.addEventListener('pointerdown', away);
    return () => document.removeEventListener('pointerdown', away);
  }, [open, close]);

  useEffect(() => { if (disabled) close(); }, [disabled, close]);
  // a source that returns fewer rows must not leave the arrows on a row that is gone
  useEffect(() => { if (active >= n) setActive(-1); }, [active, n]);

  const announce = !wanted ? '' : loading ? busyText : n === 0 ? emptyText : messages.autocomplete.count(n);

  return (
    <div ref={rootRef} data-component="Autocomplete" data-busy={loading || undefined} className={cx(styles.root, styles[size], className)} style={style}>
      <Input
        ref={setInput}
        id={fieldId}
        size={size}
        disabled={disabled}
        role="combobox"
        autoComplete="off"
        aria-autocomplete="list"
        aria-expanded={expanded}
        aria-controls={listId}
        aria-activedescendant={expanded && active >= 0 ? optId(active) : undefined}
        aria-busy={loading || undefined}
        value={text}
        onChange={onChange}
        onKeyDown={keys}
        onBlur={(e) => { onBlur?.(e); if (!rootRef.current?.contains(e.relatedTarget as Node)) close(); }}
        {...rest}
      />
      <div
        ref={presence.ref}
        hidden={!presence.mounted}
        data-state={presence.state}
        // a leaving panel is only a picture: no key reaches it and assistive tech no longer lists it
        inert={presence.state === 'closing' || undefined}
        aria-hidden={presence.state === 'closing' || undefined}
        className={styles.panel}
        style={{ insetBlockStart: top }}
        onMouseDown={(e) => e.preventDefault()}
      >
        <div id={listId} role="listbox" aria-label={listLabel} hidden={n === 0} className={styles.list}>
          {shown.map((o, i) => (
            <div
              key={o.value}
              id={optId(i)}
              role="option"
              aria-selected={i === active}
              aria-disabled={o.disabled || undefined}
              className={styles.option}
              onPointerMove={() => { if (usable(i) && i !== active) setActive(i); }}
              onClick={() => choose(i)}
            >
              <span className={styles.text}>{splitMatch(o.label, text)}</span>
            </div>
          ))}
        </div>
        {loading && (
          <div className={styles.busy} aria-hidden="true">
            {/* the grille walks while the source works; the status line below says it aloud */}
            <Spinner label={busyText} showLabel />
          </div>
        )}
        {!loading && n === 0 && <div className={styles.empty} aria-hidden="true">{emptyText}</div>}
      </div>
      <VisuallyHidden role="status" aria-live="polite">{announce}</VisuallyHidden>
    </div>
  );
});
