import {
  forwardRef,
  useCallback,
  useId,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
  type FocusEvent,
} from 'react';
import { cx } from '../../cx';
import { ListItem } from '../List';
import styles from './VirtualList.module.css';

/** What one row prints. It is the same set of parts as a `List.Item`, without a state in words under the name, because every row has one fixed height. */
export interface VirtualListItem {
  /** The name of the device or track, printed in primary ink on one line. A name longer than the row is cut, so keep it short. */
  label: ReactNode;
  /** A glyph at the start of the row. It is printing only and hidden from assistive tech. */
  leading?: ReactNode;
  /** A printed number at the start of the row, such as a track number. It takes the place of `leading`. */
  index?: ReactNode;
  /** One part at the end of the row. It must be printing only, such as a Badge or words, because the row is an option and cannot hold a control. */
  trailing?: ReactNode;
  /** The row cannot be chosen; it fades to half and the keys step over it. */
  disabled?: boolean;
}

export type VirtualListAlign = 'start' | 'center' | 'end' | 'nearest';

/** What a `ref` on a VirtualList gives you. */
export interface VirtualListHandle {
  /** Scrolls so that the row at `index` is in view. `align` is where the row lands in the window; the default `nearest` moves the least. */
  scrollToIndex: (index: number, options?: { align?: VirtualListAlign }) => void;
  /** The scrolling window, for measuring or for a scroll listener. It is `null` before the first render. */
  element: HTMLDivElement | null;
}

export interface VirtualListProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue' | 'children'> {
  /** How many rows there are in all. Only the ones in view (and a few beyond) are put in the page. */
  count: number;
  /** Gives the row at `index`. Call it for any index from 0 to `count - 1`; keep it cheap and keep the result the same for the same index. */
  getItem: (index: number) => VirtualListItem;
  /** The name of the list for assistive tech, such as "All devices" or "Library". Required unless a heading names the list with `aria-labelledby`. */
  label?: string;
  /** How many rows tall the window is. The body takes this height, or less when there are fewer rows. Default 6. */
  visibleRows?: number;
  /** How many rows beyond the window are kept in the page on each side, so fast scrolling does not show blanks. Default 4. */
  overscan?: number;
  /** The chosen row's index when controlled. Pair it with `onValueChange`. `null` means no row is chosen. */
  value?: number | null;
  /** The chosen row's index at the start, when uncontrolled. */
  defaultValue?: number;
  /** Called with the row's index when the person chooses a different row with Enter, Space or a press. */
  onValueChange?: (index: number) => void;
}

const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));

/** A long run of List rows in one short plastic body; only the rows in view exist in the page. */
export const VirtualList = forwardRef<VirtualListHandle, VirtualListProps>(function VirtualList(
  { count, getItem, label, visibleRows = 6, overscan = 4, value, defaultValue, onValueChange, className, style, onKeyDown, onFocus, onClick, ...rest },
  ref,
) {
  const uid = useId();
  const scroller = useRef<HTMLDivElement | null>(null);
  const probe = useRef<HTMLSpanElement | null>(null);
  const [step, setStep] = useState(0);
  const [viewport, setViewport] = useState(0);
  const [top, setTop] = useState(0);
  const [active, setActive] = useState<number | null>(null);
  const controlled = value !== undefined;
  const [inner, setInner] = useState<number | null>(defaultValue ?? null);
  const chosen = controlled ? value : inner;

  // The row step (row height plus gap) comes from the tokens through a hidden probe, so it follows the theme and the text size.
  useLayoutEffect(() => {
    const read = () => {
      setStep(probe.current?.offsetHeight ?? 0);
      setViewport(scroller.current?.clientHeight ?? 0);
    };
    read();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(read);
    if (probe.current) ro.observe(probe.current);
    if (scroller.current) ro.observe(scroller.current);
    return () => ro.disconnect();
  }, [count, visibleRows]);

  const shown = Math.max(0, Math.min(visibleRows, count));
  const pageSize = step > 0 && viewport > 0 ? Math.floor(viewport / step) : shown;

  const reveal = useCallback(
    (index: number, align: VirtualListAlign = 'nearest') => {
      const el = scroller.current;
      if (!el || step <= 0 || count <= 0) return;
      const i = clamp(Math.round(index), 0, count - 1);
      // a row and the gap under it count as one step, so a row that lands at the end keeps its gap in view
      const row = step;
      const rowTop = i * step;
      const rowEnd = rowTop + row;
      const view = el.clientHeight;
      let next = el.scrollTop;
      if (align === 'start') next = rowTop;
      else if (align === 'end') next = rowEnd - view;
      else if (align === 'center') next = rowTop - (view - row) / 2;
      else if (rowTop < next) next = rowTop;
      else if (rowEnd > next + view) next = rowEnd - view;
      next = clamp(next, 0, Math.max(0, count * step - view));
      el.scrollTop = next;
      setTop(next);
    },
    [count, step],
  );

  useImperativeHandle(
    ref,
    () => ({
      scrollToIndex: (index, options) => reveal(index, options?.align),
      get element() { return scroller.current; },
    }),
    [reveal],
  );

  const choose = (i: number) => {
    if (!controlled) setInner(i);
    if (i !== chosen) onValueChange?.(i);
  };

  // the nearest row that can be chosen, looking the way the key went and then back
  const enabledNear = (from: number, dir: 1 | -1): number | null => {
    for (let i = from; i >= 0 && i < count; i += dir) if (!getItem(i).disabled) return i;
    for (let i = from - dir; i >= 0 && i < count; i -= dir) if (!getItem(i).disabled) return i;
    return null;
  };

  const keys = (e: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(e);
    if (e.defaultPrevented || e.target !== scroller.current || count <= 0) return;
    const at = active ?? clamp(chosen ?? Math.floor(top / Math.max(step, 1)), 0, count - 1);
    const page = Math.max(1, pageSize - 1);
    const moves: Record<string, [number, 1 | -1]> = {
      ArrowDown: [at + 1, 1],
      ArrowUp: [at - 1, -1],
      PageDown: [at + page, 1],
      PageUp: [at - page, -1],
      Home: [0, 1],
      End: [count - 1, -1],
    };
    const move = moves[e.key];
    if (move) {
      e.preventDefault();
      const next = enabledNear(clamp(move[0], 0, count - 1), move[1]);
      if (next != null) {
        setActive(next);
        reveal(next);
      }
      return;
    }
    if ((e.key === 'Enter' || e.key === ' ') && active != null && !getItem(active).disabled) {
      e.preventDefault();
      choose(active);
    }
  };

  // focus lands on the chosen row, or the first row in view, so the arrows always start from a place that can be seen
  const focus = (e: FocusEvent<HTMLDivElement>) => {
    onFocus?.(e);
    if (e.target !== scroller.current || active != null || count <= 0) return;
    const start = clamp(chosen ?? Math.ceil(top / Math.max(step, 1)), 0, count - 1);
    setActive(enabledNear(start, 1));
  };

  const press = (e: MouseEvent<HTMLDivElement>) => {
    onClick?.(e);
    const row = (e.target as HTMLElement).closest<HTMLElement>('[data-index]');
    if (!row || !scroller.current?.contains(row)) return;
    const i = Number(row.dataset.index);
    if (Number.isNaN(i) || getItem(i).disabled) return;
    setActive(i);
    choose(i);
  };

  let first = 0;
  let last = Math.min(count, shown + overscan * 2) - 1;
  if (step > 0) {
    first = clamp(Math.floor(top / step) - overscan, 0, Math.max(0, count - 1));
    last = clamp(Math.ceil((top + (viewport || shown * step)) / step) + overscan, 0, count - 1);
  }
  const rows: ReactNode[] = [];
  for (let i = first; i <= last && i < count; i += 1) {
    const item = getItem(i);
    rows.push(
      <ListItem
        key={i}
        id={`${uid}-r${i}`}
        label={item.label}
        leading={item.leading}
        index={item.index}
        trailing={item.trailing}
        className={styles.row}
        style={{ '--vl-index': i } as CSSProperties}
        role="option"
        aria-selected={chosen === i}
        aria-disabled={item.disabled || undefined}
        aria-setsize={count}
        aria-posinset={i + 1}
        data-index={i}
        data-active={active === i ? 'true' : undefined}
      />,
    );
  }
  const activeShown = active != null && active >= first && active <= last;

  return (
    <div
      data-component="VirtualList"
      data-surface=""
      className={cx(styles.root, className)}
      style={{ ...style, '--vl-count': count, '--vl-visible': shown } as CSSProperties}
      {...rest}
    >
      <div
        ref={scroller}
        role="listbox"
        aria-label={label}
        aria-activedescendant={activeShown ? `${uid}-r${active}` : undefined}
        tabIndex={0}
        className={styles.scroller}
        onScroll={(e) => setTop(e.currentTarget.scrollTop)}
        onKeyDown={keys}
        onFocus={focus}
        onClick={press}
      >
        <ul className={styles.sizer} role="presentation">
          {rows}
        </ul>
      </div>
      <span ref={probe} className={styles.probe} aria-hidden="true" />
    </div>
  );
});
