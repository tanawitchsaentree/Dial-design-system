import {
  Children,
  createContext,
  forwardRef,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type FocusEvent,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
} from 'react';
import { cx } from '../../cx';
import { usePresence } from '../../presence';
import { Icon } from '../Icon';
import styles from './TreeView.module.css';

export interface TreeViewProps extends Omit<HTMLAttributes<HTMLUListElement>, 'onChange' | 'defaultValue'> {
  /** The top-level `TreeItem`s, in order. Name the tree with `aria-label` or `aria-labelledby`. */
  children: ReactNode;
  /** The value of the chosen item when you control it, or `null` for none. Pair it with `onValueChange`. */
  value?: string | null;
  /** The value of the item chosen at the start when the tree keeps its own state. Default none. */
  defaultValue?: string | null;
  /** Called with the value of an item when it is chosen by click, Enter or Space. */
  onValueChange?: (value: string) => void;
  /** The values of the open branches when you control it. Pair it with `onExpandedChange`. */
  expanded?: string[];
  /** The values of the branches open at the start when the tree keeps its own state. Default none. */
  defaultExpanded?: string[];
  /** Called with the values of all open branches after one opens or closes. */
  onExpandedChange?: (expanded: string[]) => void;
}

export interface TreeItemProps extends Omit<HTMLAttributes<HTMLLIElement>, 'title'> {
  /** The item's identity, used in `value`, `expanded` and the key map. Must be unique inside one TreeView. */
  value: string;
  /** The item's printed name. Type-ahead matches the start of this text. */
  label: ReactNode;
  /** An optional node before the name, such as a dot-matrix `<Icon>`. It is decoration and is hidden from assistive tech. */
  leading?: ReactNode;
  /** The item cannot be chosen or opened, and the arrow keys skip it. */
  disabled?: boolean;
  /** Nested `TreeItem`s. An item that has any is a branch and can open; it is not mounted while closed. */
  children?: ReactNode;
}

interface Ctx {
  selected: string | null;
  expanded: string[];
  active: string | null;
  rtl: boolean;
  select: (value: string) => void;
  setOpen: (value: string, open: boolean) => void;
}
const TreeContext = createContext<Ctx | null>(null);
const LevelContext = createContext(0);
const PosContext = createContext<{ pos: number; size: number }>({ pos: 1, size: 1 });

const ITEM = '[role="treeitem"]';

// An item is visible when every branch above it is open (a closing panel is still in the DOM, so read aria-expanded).
function isVisible(el: HTMLElement) {
  let up = el.parentElement?.closest<HTMLElement>(ITEM) ?? null;
  while (up) {
    if (up.getAttribute('aria-expanded') !== 'true') return false;
    up = up.parentElement?.closest<HTMLElement>(ITEM) ?? null;
  }
  return true;
}

function Items({ children }: { children: ReactNode }) {
  const list = Children.toArray(children).filter(isValidElement);
  return (
    <>
      {list.map((child, i) => (
        <PosContext.Provider key={child.key ?? i} value={{ pos: i + 1, size: list.length }}>
          {child}
        </PosContext.Provider>
      ))}
    </>
  );
}

/** Nested items drawn as a schematic. Up and Down walk the visible items, Right opens a branch or enters it, Left closes it or goes to the parent, Home and End reach the ends, Enter and Space choose, and typing jumps to the next label. */
export const TreeView = forwardRef<HTMLUListElement, TreeViewProps>(function TreeView(
  { children, value, defaultValue = null, onValueChange, expanded, defaultExpanded, onExpandedChange, className, onKeyDown, onFocus, ...rest },
  ref,
) {
  const [ownSel, setOwnSel] = useState<string | null>(defaultValue);
  const [ownOpen, setOwnOpen] = useState<string[]>(defaultExpanded ?? []);
  const [active, setActive] = useState<string | null>(null);
  const [rtl, setRtl] = useState(false);
  const selected = value !== undefined ? value : ownSel;
  const open = expanded !== undefined ? expanded : ownOpen;
  const latest = useRef({ open, controlled: expanded !== undefined, selControlled: value !== undefined, onValueChange, onExpandedChange });
  latest.current = { open, controlled: expanded !== undefined, selControlled: value !== undefined, onValueChange, onExpandedChange };
  const root = useRef<HTMLUListElement | null>(null);
  const typed = useRef({ text: '', timer: 0 });

  const select = useCallback((v: string) => {
    const s = latest.current;
    if (!s.selControlled) setOwnSel(v);
    s.onValueChange?.(v);
  }, []);
  const setOpen = useCallback((v: string, on: boolean) => {
    const s = latest.current;
    if (s.open.includes(v) === on) return;
    const next = on ? [...s.open, v] : s.open.filter((x) => x !== v);
    latest.current.open = next;
    if (!s.controlled) setOwnOpen(next);
    s.onExpandedChange?.(next);
  }, []);

  const visible = useCallback(() => {
    const el = root.current;
    if (!el) return [];
    return Array.from(el.querySelectorAll<HTMLElement>(ITEM)).filter((n) => n.getAttribute('aria-disabled') !== 'true' && isVisible(n));
  }, []);

  // the one item in the tab order: the last focused, else the chosen one, else the first visible
  useEffect(() => {
    const el = root.current;
    if (el) setRtl(getComputedStyle(el).direction === 'rtl');
    const items = visible();
    if (!items.length) return;
    if (active != null && items.some((n) => n.dataset.value === active)) return;
    const pick = items.find((n) => n.getAttribute('aria-selected') === 'true') ?? items[0];
    setActive(pick?.dataset.value ?? null);
  });
  useEffect(() => () => window.clearTimeout(typed.current.timer), []);

  const keys = (e: KeyboardEvent<HTMLUListElement>) => {
    onKeyDown?.(e);
    if (e.defaultPrevented) return;
    const from = e.target as HTMLElement;
    if (from.getAttribute?.('role') !== 'treeitem' || from.closest('[role="tree"]') !== root.current) return;
    const items = visible();
    const at = items.indexOf(from);
    if (at < 0) return;
    const v = from.dataset.value ?? '';
    const expandedNow = from.getAttribute('aria-expanded');
    const forward = rtl ? 'ArrowLeft' : 'ArrowRight';
    const back = rtl ? 'ArrowRight' : 'ArrowLeft';
    let to: HTMLElement | undefined;
    let handled = true;
    if (e.key === 'ArrowDown') to = items[at + 1];
    else if (e.key === 'ArrowUp') to = items[at - 1];
    else if (e.key === 'Home') to = items[0];
    else if (e.key === 'End') to = items[items.length - 1];
    else if (e.key === forward) {
      if (expandedNow === 'false') setOpen(v, true);
      else if (expandedNow === 'true') {
        const first = items[at + 1];
        if (first && from.contains(first)) to = first;
      }
    } else if (e.key === back) {
      if (expandedNow === 'true') setOpen(v, false);
      else {
        const parent = from.parentElement?.closest<HTMLElement>(ITEM);
        if (parent) to = parent;
      }
    } else if (e.key === 'Enter' || e.key === ' ') select(v);
    else if (e.key === '*') {
      for (const sib of Array.from(from.parentElement?.children ?? [])) {
        if (sib.getAttribute('aria-expanded') === 'false' && sib.getAttribute('aria-disabled') !== 'true') setOpen((sib as HTMLElement).dataset.value ?? '', true);
      }
    } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      const t = typed.current;
      window.clearTimeout(t.timer);
      t.text += e.key.toLocaleLowerCase();
      t.timer = window.setTimeout(() => { t.text = ''; }, 500);
      const same = [...t.text].every((c) => c === t.text[0]);
      const needle = same ? t.text[0] : t.text;
      const start = same ? at + 1 : at;
      const order = [...items.slice(start), ...items.slice(0, start)];
      to = order.find((n) => (n.querySelector('[data-tree-text]')?.textContent ?? '').trim().toLocaleLowerCase().startsWith(needle ?? ''));
    } else handled = false;
    if (!handled) return;
    e.preventDefault();
    to?.focus();
  };

  const focused = (e: FocusEvent<HTMLUListElement>) => {
    onFocus?.(e);
    const t = e.target as HTMLElement;
    if (t.getAttribute?.('role') === 'treeitem' && t.dataset.value) setActive(t.dataset.value);
  };

  const ctx = useMemo<Ctx>(() => ({ selected, expanded: open, active, rtl, select, setOpen }), [selected, open, active, rtl, select, setOpen]);

  return (
    <TreeContext.Provider value={ctx}>
      <ul
        {...rest}
        ref={(el) => {
          root.current = el;
          if (typeof ref === 'function') ref(el);
          else if (ref) ref.current = el;
        }}
        role="tree"
        data-component="TreeView"
        className={cx(styles.root, className)}
        onKeyDown={keys}
        onFocus={focused}
      >
        <Items>{children}</Items>
      </ul>
    </TreeContext.Provider>
  );
});

/** One item of a TreeView. Give it `TreeItem` children to make it a branch. */
export const TreeItem = forwardRef<HTMLLIElement, TreeItemProps>(function TreeItem(
  { value, label, leading, disabled = false, children, className, ...rest },
  ref,
) {
  const ctx = useContext(TreeContext);
  if (!ctx) throw new Error('TreeItem must stand inside a TreeView.');
  const level = useContext(LevelContext) + 1;
  const { pos, size } = useContext(PosContext);
  const textId = useId();
  const branch = Children.toArray(children).some(isValidElement);
  const open = branch && !disabled && ctx.expanded.includes(value);
  const selected = ctx.selected === value;
  const presence = usePresence<HTMLDivElement>(open);
  // a branch that was open at the first render appears at once; every later opening grows from a closed row
  const first = useRef(open);
  if (!open) first.current = false;

  const onRowClick = (e: MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    if (branch && (e.target as HTMLElement).closest('[data-tree-toggle]')) ctx.setOpen(value, !open);
    else ctx.select(value);
  };

  return (
    <li
      {...rest}
      ref={ref}
      role="treeitem"
      aria-labelledby={textId}
      aria-level={level}
      aria-setsize={size}
      aria-posinset={pos}
      aria-expanded={branch ? open : undefined}
      aria-selected={selected}
      aria-disabled={disabled || undefined}
      tabIndex={ctx.active === value && !disabled ? 0 : -1}
      data-value={value}
      data-leaf={branch ? 'false' : 'true'}
      className={cx(styles.item, className)}
    >
      <div className={styles.row} onClick={onRowClick}>
        <span className={styles.toggle} data-tree-toggle="" aria-hidden="true">
          {branch ? <Icon name={open ? 'chevron-down' : ctx.rtl ? 'chevron-left' : 'chevron-right'} size="sm" /> : <span className={styles.node} />}
        </span>
        <span className={styles.label}>
          {leading != null && <span className={styles.leading} aria-hidden="true">{leading}</span>}
          <span id={textId} data-tree-text="" className={styles.text}>{label}</span>
        </span>
      </div>
      {branch && presence.mounted && (
        <div
          ref={presence.ref}
          data-state={presence.state}
          data-fresh={!first.current ? 'true' : undefined}
          className={styles.panel}
        >
          <div className={styles.panelInner}>
            <LevelContext.Provider value={level}>
              <ul role="group" className={styles.group}>
                <Items>{children}</Items>
              </ul>
            </LevelContext.Provider>
          </div>
        </div>
      )}
    </li>
  );
});
