import {
  cloneElement,
  forwardRef,
  isValidElement,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type HTMLAttributes,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type ReactElement,
  type SyntheticEvent,
} from 'react';
import { cx } from '../../cx';
import { messages } from '../../messages';
import { usePresence } from '../../presence';
import { Icon } from '../Icon';
import { KbdCombo } from '../Kbd';
import { VisuallyHidden } from '../VisuallyHidden';
import styles from './CommandPalette.module.css';

/** One command in the palette. */
export interface CommandPaletteCommand {
  /** A unique, stable id. It is passed back to `onRun` and kept while the list is filtered. */
  id: string;
  /** The words printed for the command, such as "Turn off all lamps". Filtering matches any part of it. */
  label: string;
  /** The section the command is printed under, such as "Rooms". Sections are listed in the order they first appear. Commands with no section are listed first, with no heading. */
  section?: string;
  /** The shortcut printed as Kbd caps at the end of the row, in the order the keys are pressed, such as `['Ctrl', 'L']`. It is a hint only; the palette does not listen for it. */
  shortcut?: string[];
  /** Extra words the filter matches but the row does not print, such as "light" for "Turn off all lamps". */
  keywords?: string[];
  /** The row stays listed but cannot run; the arrow keys skip it. */
  disabled?: boolean;
  /** Called when the command runs, by Enter or a click, before `onRun` and before the palette closes. */
  onRun?: (command: CommandPaletteCommand) => void;
}

export interface CommandPaletteProps extends Omit<HTMLAttributes<HTMLDialogElement>, 'title' | 'children' | 'open' | 'onSelect'> {
  /** The commands to list. Pass all of them; the palette filters as the person types. */
  commands: CommandPaletteCommand[];
  /** Whether the palette is open. Pass it with `onOpenChange` to control it; leave it out to let `hotkey` and `trigger` open it. */
  open?: boolean;
  /** The open state on first render when the palette is not controlled. */
  defaultOpen?: boolean;
  /** Called with `false` on Escape, a click on the scrim or a run that closes the palette, and with `true` when `hotkey` or `trigger` opens it. */
  onOpenChange?: (open: boolean) => void;
  /** Called with the command that ran, after its own `onRun`. */
  onRun?: (command: CommandPaletteCommand) => void;
  /** The chord that opens and closes the palette from anywhere on the page, such as `mod+k` (default; `mod` is Cmd on a Mac and Ctrl elsewhere) or `ctrl+shift+p`. Pass `false` for none. */
  hotkey?: string | false;
  /** The text in the field when controlled. Pair it with `onQueryChange`. */
  query?: string;
  /** The starting text when uncontrolled. The text is cleared each time the palette closes. */
  defaultQuery?: string;
  /** Called with the new text each time the person types. */
  onQueryChange?: (query: string) => void;
  /** Decides whether a command shows for the current text. The default matches every word of the text against the label, the section and the keywords, ignoring case. */
  filter?: (command: CommandPaletteCommand, query: string) => boolean;
  /** The name of the palette, read when it opens and used as the field's name. Defaults to "Command palette". */
  label?: string;
  /** The hint inside the empty field. Defaults to "Type a command". */
  placeholder?: string;
  /** The name of the list of commands. Defaults to "Commands". */
  listLabel?: string;
  /** The line printed and announced when no command matches. Defaults to "No matching command". */
  emptyText?: string;
  /** Builds the announced words from the number of matches, for another language. Defaults to "No matching command", "1 command" and "n commands". */
  resultsText?: (count: number) => string;
  /** Close the palette after a command runs. Default `true`. */
  closeOnRun?: boolean;
  /** An element, usually a `Button`, that opens the palette when pressed. Focus returns to it on close. */
  trigger?: ReactElement<{ onClick?: (e: ReactMouseEvent<HTMLElement>) => void }>;
  /** `true` (default) opens with `showModal()`, with a scrim, a focus trap and an inert page. `false` shows the palette in place, with no scrim and no focus move, for previews. */
  modal?: boolean;
}

const PAGE = 5;

/** Matches every word of the text against the label, the section and the keywords. Works for languages with no spaces because each typed word is a plain substring match. */
const defaultFilter = (c: CommandPaletteCommand, q: string) => {
  const words = q.toLocaleLowerCase().split(/\s+/).filter(Boolean);
  if (!words.length) return true;
  const hay = [c.label, c.section ?? '', ...(c.keywords ?? [])].join(' ').toLocaleLowerCase();
  return words.every((w) => hay.includes(w));
};

/** True when a key event is the chord, for example `mod+k`. */
const matches = (e: KeyboardEvent, chord: string) => {
  const parts = chord.toLowerCase().split('+').map((s) => s.trim()).filter(Boolean);
  const key = parts[parts.length - 1];
  const mods = parts.slice(0, -1);
  const mod = mods.includes('mod');
  const ctrlOrMeta = e.ctrlKey || e.metaKey;
  if (mod ? !ctrlOrMeta : (mods.includes('ctrl') !== e.ctrlKey || mods.includes('meta') !== e.metaKey)) return false;
  if (mods.includes('shift') !== e.shiftKey || mods.includes('alt') !== e.altKey) return false;
  return e.key.toLowerCase() === key;
};

/**
 * A sheet for finding and running a command, on the native modal `<dialog>`: focus is trapped in the query
 * field, Escape closes it, the page behind is inert and focus returns to where it was. Opened by `hotkey`
 * (Ctrl or Cmd plus K by default), by `trigger`, or controlled with `open`. Typing filters the commands, the
 * arrow keys walk them while focus stays in the field, and Enter runs the lit one. It stays mounted while it
 * leaves, through `usePresence`.
 */
export const CommandPalette = forwardRef<HTMLDialogElement, CommandPaletteProps>(function CommandPalette(
  {
    commands, open: openProp, defaultOpen = false, onOpenChange, onRun, hotkey = 'mod+k',
    query: queryProp, defaultQuery = '', onQueryChange, filter = defaultFilter,
    label = messages.commandPalette.label, placeholder = messages.commandPalette.placeholder,
    listLabel = messages.commandPalette.listLabel, emptyText = messages.commandPalette.empty,
    resultsText = messages.commandPalette.results, closeOnRun = true, trigger, modal = true, className, ...rest
  },
  ref,
) {
  const [inner, setInner] = useState(defaultOpen);
  const controlled = openProp !== undefined;
  const open = controlled ? openProp : inner;
  const presence = usePresence<HTMLDialogElement>(open);
  const el = useRef<HTMLDialogElement | null>(null);
  const field = useRef<HTMLInputElement | null>(null);
  const opener = useRef<HTMLElement | null>(null);
  const wasMounted = useRef(false);
  const id = useId();
  const listId = `${id}-list`;
  const optId = (i: number) => `${id}-opt-${i}`;

  const [innerQuery, setInnerQuery] = useState(defaultQuery);
  const queryControlled = queryProp !== undefined;
  const query = queryControlled ? queryProp : innerQuery;
  const [activeId, setActiveId] = useState<string | null>(null);

  const setRef = useCallback(
    (node: HTMLDialogElement | null) => {
      el.current = node;
      presence.ref(node);
      if (typeof ref === 'function') ref(node);
      else if (ref) ref.current = node;
    },
    // presence.ref is stable
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ref],
  );

  const setOpen = useCallback(
    (next: boolean) => {
      if (!controlled) setInner(next);
      onOpenChange?.(next);
    },
    [controlled, onOpenChange],
  );

  // sections in the order they first appear; commands with no section come first with no heading
  const groups = useMemo(() => {
    const shown = commands.filter((c) => filter(c, query));
    const order: string[] = [];
    for (const c of shown) { const s = c.section ?? ''; if (!order.includes(s)) order.push(s); }
    order.sort((a, b) => (a === '' ? -1 : b === '' ? 1 : 0));
    return order.map((section) => ({ section, items: shown.filter((c) => (c.section ?? '') === section) }));
  }, [commands, filter, query]);
  const flat = useMemo(() => groups.flatMap((g) => g.items), [groups]);
  const activeCmd = flat.find((c) => c.id === activeId && !c.disabled) ?? flat.find((c) => !c.disabled);
  const activeIndex = activeCmd ? flat.indexOf(activeCmd) : -1;

  const run = (c: CommandPaletteCommand) => {
    if (c.disabled) return;
    c.onRun?.(c);
    onRun?.(c);
    if (closeOnRun) setOpen(false);
  };

  // the chord opens and closes the palette from anywhere on the page
  useEffect(() => {
    if (!hotkey) return undefined;
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.isComposing || !matches(e, hotkey)) return;
      e.preventDefault();
      setOpen(!open);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [hotkey, open, setOpen]);

  // mounted in the render that opens it; show it, then it enters through @starting-style
  useEffect(() => {
    const d = el.current;
    if (!d || !presence.mounted || d.open) return;
    opener.current = (document.activeElement as HTMLElement | null) ?? null;
    if (modal) {
      d.showModal();
      field.current?.focus();
    } else {
      // the attribute, not show(): show() would run the dialog focusing steps and steal focus
      d.setAttribute('open', '');
    }
  }, [presence.mounted, modal]);

  // once it has finished leaving: the text is cleared and focus goes back to where it was
  useEffect(() => {
    if (wasMounted.current && !presence.mounted) {
      if (!queryControlled) setInnerQuery('');
      setActiveId(null);
      const back = opener.current;
      opener.current = null;
      if (modal && back && back.isConnected) back.focus();
    }
    wasMounted.current = presence.mounted;
  }, [presence.mounted, modal, queryControlled]);

  // the lit row stays in view while the arrows walk the list
  useEffect(() => {
    if (activeIndex < 0) return;
    document.getElementById(optId(activeIndex))?.scrollIntoView?.({ block: 'nearest' });
    // optId is derived from id
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, id]);

  const onCancel = (e: SyntheticEvent<HTMLDialogElement>) => {
    e.preventDefault();
    setOpen(false);
  };
  // the browser can close the dialog itself; keep state in step
  const onClose = () => {
    if (open) setOpen(false);
  };
  // a click that lands on the dialog element outside its box is a click on the scrim
  const onClick = (e: ReactMouseEvent<HTMLDialogElement>) => {
    const d = el.current;
    if (!modal || !d || e.target !== d) return;
    const r = d.getBoundingClientRect();
    if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) setOpen(false);
  };

  const walk = (from: number, dir: 1 | -1, count = 1) => {
    const usable = flat.map((c, i) => (c.disabled ? -1 : i)).filter((i) => i >= 0);
    if (!usable.length) return -1;
    const at = usable.indexOf(from);
    // the arrows wrap, so a palette with few commands never traps the hand at an end
    if (count === 1) return usable[(at + dir + usable.length) % usable.length];
    return usable[Math.min(usable.length - 1, Math.max(0, at + dir * count))];
  };
  const onFieldKeyDown = (e: ReactKeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing) return;
    const k = e.key;
    const go = (to: number) => { e.preventDefault(); if (to >= 0) setActiveId(flat[to].id); };
    if (k === 'ArrowDown') return go(walk(activeIndex < 0 ? -1 : activeIndex, 1));
    if (k === 'ArrowUp') return go(walk(activeIndex < 0 ? 0 : activeIndex, -1));
    if (k === 'PageDown') return go(walk(activeIndex < 0 ? -1 : activeIndex, 1, PAGE));
    if (k === 'PageUp') return go(walk(activeIndex < 0 ? 0 : activeIndex, -1, PAGE));
    if (k === 'Enter' && activeCmd) { e.preventDefault(); run(activeCmd); }
  };
  // Only the field can take focus, so Tab stays on it; the page behind is inert while modal
  const onKeyDown = (e: ReactKeyboardEvent<HTMLDialogElement>) => {
    if (e.key !== 'Tab' || !modal) return;
    e.preventDefault();
    field.current?.focus();
  };
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!queryControlled) setInnerQuery(e.target.value);
    setActiveId(null);
    onQueryChange?.(e.target.value);
  };

  const opening =
    trigger && isValidElement(trigger)
      ? cloneElement(trigger as ReactElement<Record<string, unknown>>, {
          'aria-haspopup': 'dialog',
          'aria-expanded': open,
          onClick: (e: ReactMouseEvent<HTMLElement>) => {
            trigger.props.onClick?.(e);
            if (!e.defaultPrevented) setOpen(true);
          },
        })
      : null;

  const empty = flat.length === 0;
  let row = -1;
  return (
    <>
      {opening}
      {presence.mounted ? (
        <dialog
          ref={setRef}
          role="dialog"
          data-component="CommandPalette"
          data-state={presence.state}
          aria-label={label}
          tabIndex={-1}
          data-modal={modal ? undefined : 'false'}
          className={cx(styles.root, !modal && styles.inline, className)}
          onCancel={onCancel}
          onClose={onClose}
          onKeyDown={onKeyDown}
          onClick={onClick}
          {...rest}
        >
          <div className={styles.well}>
            {/* dial's one icon language, the dot matrix; the label already names the field */}
            <Icon name="search" size="md" className={styles.mark} />
            <input
              ref={field}
              type="text"
              role="combobox"
              aria-label={label}
              aria-expanded="true"
              aria-controls={listId}
              aria-autocomplete="list"
              aria-activedescendant={activeIndex >= 0 ? optId(activeIndex) : undefined}
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
              enterKeyHint="go"
              placeholder={placeholder}
              className={styles.field}
              value={query}
              onChange={onChange}
              onKeyDown={onFieldKeyDown}
            />
          </div>
          <div
            id={listId}
            role="listbox"
            aria-label={listLabel}
            data-empty={empty || undefined}
            className={styles.list}
            // keep focus in the field while a row is pressed
            onMouseDown={(e) => e.preventDefault()}
          >
            {empty && <div className={styles.empty}>{emptyText}</div>}
            {groups.map((g, gi) => {
              const headId = `${id}-head-${gi}`;
              const rows = g.items.map((c) => {
                row += 1;
                const i = row;
                const on = i === activeIndex;
                return (
                  <div
                    key={c.id}
                    id={optId(i)}
                    role="option"
                    aria-selected={on}
                    aria-disabled={c.disabled || undefined}
                    aria-keyshortcuts={c.shortcut?.join('+')}
                    data-active={on || undefined}
                    className={styles.option}
                    onPointerMove={() => { if (!c.disabled && !on) setActiveId(c.id); }}
                    onClick={() => run(c)}
                  >
                    <span className={styles.index} aria-hidden="true" />
                    <span className={styles.text}>{c.label}</span>
                    {c.shortcut?.length ? <KbdCombo keys={c.shortcut} className={styles.keys} /> : null}
                  </div>
                );
              });
              return g.section ? (
                <div key={g.section} role="group" aria-labelledby={headId} className={styles.group}>
                  <div id={headId} role="presentation" className={styles.heading}>{g.section}</div>
                  {rows}
                </div>
              ) : (
                <div key="" role="presentation" className={styles.group}>{rows}</div>
              );
            })}
          </div>
          <VisuallyHidden role="status" aria-live="polite">{resultsText(flat.length)}</VisuallyHidden>
        </dialog>
      ) : null}
    </>
  );
});
