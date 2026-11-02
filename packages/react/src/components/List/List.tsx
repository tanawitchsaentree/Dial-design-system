import {
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type FocusEvent,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { cx } from '../../cx';
import styles from './List.module.css';

interface ListContextValue {
  selectable: boolean;
  current: string | null;
  active: string | null;
  choose: (value: string) => void;
  point: (id: string) => void;
}
const ListContext = createContext<ListContextValue>({ selectable: false, current: null, active: null, choose: () => {}, point: () => {} });

export interface ListProps extends Omit<HTMLAttributes<HTMLUListElement>, 'onChange' | 'defaultValue'> {
  /** The name of the list for assistive tech, such as "Devices in the kitchen" or "Queue". Use it when no heading names the list. */
  label?: string;
  /** Makes the list one listbox where a row can be chosen, as in a play queue. Rows then need a `value`, and the arrow keys move between them. */
  selectable?: boolean;
  /** The chosen row's value when controlled. Pair it with `onValueChange`. `null` means no row is chosen. */
  value?: string | null;
  /** The chosen row's value at the start, when uncontrolled. */
  defaultValue?: string;
  /** Called with the row's value when the person chooses a different row. */
  onValueChange?: (value: string) => void;
}

export interface ListItemProps extends Omit<HTMLAttributes<HTMLLIElement>, 'title' | 'onClick'> {
  /** The name of the device or track, printed in primary ink. It wraps onto more lines instead of being cut. */
  label: ReactNode;
  /** The state in words under the name, such as "On · 40%" or "Ulm Quartet · 3:42". */
  description?: ReactNode;
  /** A glyph at the start of the row, such as a lamp or a speaker. It is printing only and hidden from assistive tech. */
  leading?: ReactNode;
  /** A printed number at the start of the row, such as a track number. It takes the place of `leading`. */
  index?: ReactNode;
  /** One part at the end of the row, such as a Switch, an IconButton, a Menu or a Badge. In a row with `href` or `onPress` it must be printing only, such as a Badge. */
  trailing?: ReactNode;
  /** Makes the whole row a link to this address, with a printed chevron at its end. */
  href?: string;
  /** Makes the whole row a button that does this when pressed, such as playing the track. */
  onPress?: () => void;
  /** Shows the printed chevron. It defaults to on for a row with `href` and off for every other row. */
  chevron?: boolean;
  /** The row's value in a selectable list. It is required there and ignored elsewhere. */
  value?: string;
  /** The row cannot be pressed or chosen; it fades to half. */
  disabled?: boolean;
}

const FOCUSABLE = 'a[href], button, input, select, textarea, [tabindex]';

/** Rows of devices or tracks printed on one plastic body, kept apart by an even gap. */
const ListRoot = forwardRef<HTMLUListElement, ListProps>(function List(
  { label, selectable = false, value, defaultValue, onValueChange, className, children, onKeyDown, onFocus, ...rest },
  ref,
) {
  const controlled = value !== undefined;
  const [inner, setInner] = useState<string | null>(defaultValue ?? null);
  const current = controlled ? value : inner;
  const [active, setActive] = useState<string | null>(null);
  const node = useRef<HTMLUListElement | null>(null);

  const setRef = (el: HTMLUListElement | null) => {
    node.current = el;
    if (typeof ref === 'function') ref(el);
    else if (ref) ref.current = el;
  };

  const options = (): HTMLElement[] => (node.current ? Array.from(node.current.querySelectorAll<HTMLElement>(':scope > [role="option"]')) : []);
  const enabled = () => options().filter((o) => o.getAttribute('aria-disabled') !== 'true');

  const choose = (v: string) => {
    if (!controlled) setInner(v);
    if (v !== current) onValueChange?.(v);
  };

  const keys = (e: KeyboardEvent<HTMLUListElement>) => {
    onKeyDown?.(e);
    if (!selectable || e.defaultPrevented || e.target !== node.current) return;
    const all = enabled();
    if (!all.length) return;
    const at = all.findIndex((o) => o.id === active);
    const move: Record<string, number> = { ArrowDown: at + 1, ArrowUp: at - 1, Home: 0, End: all.length - 1 };
    if (e.key in move) {
      e.preventDefault();
      const next = all[Math.max(0, Math.min(all.length - 1, move[e.key]))];
      setActive(next.id);
      next.scrollIntoView?.({ block: 'nearest' });
      return;
    }
    if ((e.key === 'Enter' || e.key === ' ') && at >= 0) {
      e.preventDefault();
      const v = all[at].dataset.value;
      if (v != null) choose(v);
    }
  };

  // focus lands on the chosen row, or the first one, so the arrows always start from a visible place
  const focus = (e: FocusEvent<HTMLUListElement>) => {
    onFocus?.(e);
    if (!selectable || e.target !== node.current) return;
    const all = enabled();
    if (active && all.some((o) => o.id === active)) return;
    const start = all.find((o) => o.dataset.value === current) ?? all[0];
    if (start) setActive(start.id);
  };

  const ctx: ListContextValue = { selectable, current, active, choose, point: setActive };
  return (
    <ListContext.Provider value={ctx}>
      <ul
        ref={setRef}
        data-component="List"
        data-surface=""
        role={selectable ? 'listbox' : undefined}
        aria-label={label}
        aria-activedescendant={selectable && active ? active : undefined}
        tabIndex={selectable ? 0 : undefined}
        className={cx(styles.root, selectable && styles.selectable, className)}
        onKeyDown={keys}
        onFocus={focus}
        {...rest}
      >
        {children}
      </ul>
    </ListContext.Provider>
  );
});

/** One row: a glyph or a printed index, the name, the state in words, and at most one part at the end. */
const ListItem = forwardRef<HTMLLIElement, ListItemProps>(function ListItem(
  { label, description, leading, index, trailing, href, onPress, chevron, value, disabled = false, className, id, ...rest },
  ref,
) {
  const ctx = useContext(ListContext);
  const auto = useId();
  const rowId = id ?? `${auto}-row`;
  const trail = useRef<HTMLSpanElement>(null);
  const action = !ctx.selectable && (href != null || onPress != null);
  const showChevron = chevron ?? (href != null && !ctx.selectable);

  // one primary action per row: a row that is itself a link or a button cannot hold another control
  useEffect(() => {
    if (action && trail.current?.querySelector(FOCUSABLE)) {
      console.error('List.Item: a row with href or onPress is already the action; its trailing part must be printing only (a Badge or words), never a second control.');
    }
  }, [action]);

  const content = (
    <>
      {ctx.selectable && <span className={styles.mark} aria-hidden="true" />}
      {index != null ? (
        <span className={cx(styles.lead, styles.index)} aria-hidden="true">{index}</span>
      ) : leading != null ? (
        <span className={styles.lead} aria-hidden="true">{leading}</span>
      ) : null}
      <span className={styles.text}>
        <span className={styles.primary}>{label}</span>
        {description != null && <span className={styles.secondary}>{description}</span>}
      </span>
      {(trailing != null || showChevron) && (
        <span ref={trail} className={styles.trail}>
          {trailing}
          {showChevron && (
            <svg className={styles.chevron} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
              <path d="M6 4l4 4-4 4" />
            </svg>
          )}
        </span>
      )}
    </>
  );

  if (ctx.selectable) {
    const chosen = value != null && value === ctx.current;
    return (
      <li
        ref={ref}
        id={rowId}
        role="option"
        aria-selected={chosen}
        aria-disabled={disabled || undefined}
        data-value={value}
        data-active={ctx.active === rowId ? 'true' : undefined}
        className={cx(styles.item, className)}
        onClick={() => { if (!disabled && value != null) { ctx.point(rowId); ctx.choose(value); } }}
        {...rest}
      >
        <div className={styles.row}>{content}</div>
      </li>
    );
  }

  return (
    <li ref={ref} id={id} className={cx(styles.item, className)} {...rest}>
      {href != null ? (
        <a
          className={cx(styles.row, styles.action)}
          href={disabled ? undefined : href}
          aria-disabled={disabled || undefined}
          role={disabled ? 'link' : undefined}
        >
          {content}
        </a>
      ) : onPress != null ? (
        <button type="button" className={cx(styles.row, styles.action)} disabled={disabled} onClick={onPress}>
          {content}
        </button>
      ) : (
        <div className={styles.row}>{content}</div>
      )}
    </li>
  );
});

/** Rows of devices or tracks on one plastic body. Write rows as `List.Item`. */
export const List = Object.assign(ListRoot, { Item: ListItem });
export { ListItem };
