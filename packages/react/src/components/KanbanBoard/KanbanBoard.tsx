import {
  createElement,
  forwardRef,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react';
import { cx } from '../../cx';
import { messages } from '../../messages';
import { useIsoLayoutEffect } from '../../spring';
import { Card } from '../Card';
import { Icon } from '../Icon';
import { Menu } from '../Menu';
import { VisuallyHidden } from '../VisuallyHidden';
import styles from './KanbanBoard.module.css';

/** One column of the board: a named list of cards. */
export interface KanbanColumn {
  /** A value that is unique among the columns. It is the key of the column in `value`. */
  id: string;
  /** The printed name of the column, a noun for the stage such as "In progress". */
  title: string;
  /** The most cards the column should hold (a work-in-progress limit). The count window shows `3/4`; a column past it shows a warning mark and the figures in medium weight. The limit warns and never blocks a move. */
  limit?: number;
}

/** One card of the board. */
export interface KanbanCard {
  /** A value that is unique among the cards. */
  id: string;
  /** The printed name of the card, a short phrase. It is also the name used in the Move key and in the status read out after a move. */
  title: string;
  /** A line under the title, such as who owns it or when it is due. */
  detail?: ReactNode;
  /** The card stays where it is: no grip, no Move key and no Alt-arrow moves. Default `false`. */
  disabled?: boolean;
}

/** Which cards stand in which column, as card ids in the order printed. The key is a column id. */
export type KanbanValue = Record<string, string[]>;

/** What a move reports to `onMove`. */
export interface KanbanMove {
  /** The id of the card that moved. */
  cardId: string;
  /** The column it left. */
  from: string;
  /** The column it entered. It equals `from` when the card only changed position. */
  to: string;
  /** The zero-based position of the card in the column it entered. */
  index: number;
}

export interface KanbanBoardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue' | 'children'> {
  /** The name of the whole board for assistive tech, such as "Chores for the week". It is read as the group's name and is not printed. */
  label: string;
  /** The columns, in the order printed. Cards that are in no column of `value` go to the first one. */
  columns: KanbanColumn[];
  /** Every card there is. A card belongs to the column that lists its id in `value`. */
  cards: KanbanCard[];
  /** The cards in each column when controlled. Pair it with `onValueChange`. A card moved by the person is reported there and the board does not change until you pass the new value back. */
  value?: KanbanValue;
  /** The cards in each column at the start when uncontrolled. */
  defaultValue?: KanbanValue;
  /** Called with the whole new arrangement after any move, by key, menu or drag. */
  onValueChange?: (value: KanbanValue) => void;
  /** Called with the card, the two columns and the new position after any move. */
  onMove?: (move: KanbanMove) => void;
  /** Lets a card be carried with a pointer by its grip. Keys and the Move key always work. Default `true`. */
  drag?: boolean;
  /** `3` (default), `2` or `4`: the heading level of the column titles, so the board sits in the outline of the page. */
  headingLevel?: 2 | 3 | 4;
  /** No card can be moved: the grips and Move keys take no input and the cards fade to half. */
  disabled?: boolean;
  /** The line printed in a column with no cards. */
  emptyText?: string;
  /** Builds the name of a card's Move key from its title. */
  moveLabel?: (title: string) => string;
  /** Builds the words of a Move menu row from the title of its column. */
  moveToLabel?: (column: string) => string;
  /** Builds the read-out of a count window from the cards it holds and the limit, if any. */
  countText?: (cards: number, limit?: number) => string;
  /** Builds the polite status read out after a move, from the card title, the column title, the position (from 1) and the cards in that column. */
  movedText?: (title: string, column: string, position: number, total: number) => string;
  /** The status read out when an Alt-arrow move has nowhere to go. */
  edgeText?: string;
  /** The status read out when Escape lets go of a card being carried. */
  cancelledText?: string;
  /** The hint read with a focused card, naming the keys. */
  hintText?: string;
}

interface Drag {
  id: string;
  from: string;
  x: number;
  y: number;
  dx: number;
  dy: number;
  active: boolean;
  over: { column: string; index: number } | null;
}

const THRESHOLD = 4;

/** Put every card in exactly one column, keep the order given, and send strays to the first column. */
function arrange(columns: KanbanColumn[], cards: KanbanCard[], source?: KanbanValue): KanbanValue {
  const known = new Set(cards.map((c) => c.id));
  const seen = new Set<string>();
  const out: KanbanValue = {};
  for (const col of columns) {
    out[col.id] = [];
    for (const id of source?.[col.id] ?? []) {
      if (known.has(id) && !seen.has(id)) { seen.add(id); out[col.id].push(id); }
    }
  }
  const first = columns[0];
  if (first) for (const c of cards) if (!seen.has(c.id)) out[first.id].push(c.id);
  return out;
}

/** Columns of cards moved between columns. A card moves by its Move key, by Alt with the arrow keys, or by dragging its grip; dragging is never the only way, and a polite status reads out every move. */
export const KanbanBoard = forwardRef<HTMLDivElement, KanbanBoardProps>(function KanbanBoard(
  {
    label,
    columns,
    cards,
    value,
    defaultValue,
    onValueChange,
    onMove,
    drag: canDrag = true,
    headingLevel = 3,
    disabled = false,
    emptyText = messages.kanbanBoard.empty,
    moveLabel = messages.kanbanBoard.moveLabel,
    moveToLabel = messages.kanbanBoard.moveTo,
    countText = messages.kanbanBoard.count,
    movedText = messages.kanbanBoard.moved,
    edgeText = messages.kanbanBoard.edge,
    cancelledText = messages.kanbanBoard.cancelled,
    hintText = messages.kanbanBoard.hint,
    className,
    ...rest
  },
  ref,
) {
  const uid = useId();
  const controlled = value !== undefined;
  const [inner, setInner] = useState<KanbanValue | undefined>(defaultValue);
  const map = arrange(columns, cards, controlled ? value : inner);
  const byId = new Map(cards.map((c) => [c.id, c]));
  const [status, setStatus] = useState('');
  const [drag, setDrag] = useState<Drag | null>(null);
  const dragRef = useRef<Drag | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const pending = useRef<{ id: string; column: string } | null>(null);

  const setRoot = (el: HTMLDivElement | null) => {
    rootRef.current = el;
    if (typeof ref === 'function') ref(el);
    else if (ref) ref.current = el;
  };
  const setCarry = (d: Drag | null) => { dragRef.current = d; setDrag(d); };

  const columnOf = (id: string) => columns.find((c) => map[c.id].includes(id));
  const cardEl = (id: string) => Array.from(rootRef.current?.querySelectorAll<HTMLElement>('[data-card-id]') ?? []).find((el) => el.dataset.cardId === id);

  // after a move the card has a new place in the tree and is a new element, so focus follows it there
  useIsoLayoutEffect(() => {
    const p = pending.current;
    if (!p) return;
    const el = cardEl(p.id);
    if (el && el.closest<HTMLElement>('[data-kb-column]')?.dataset.kbColumn === p.column) {
      pending.current = null;
      el.focus();
    }
  });

  const moveCard = (id: string, to: string, index: number) => {
    const from = columnOf(id);
    const card = byId.get(id);
    const target = columns.find((c) => c.id === to);
    if (!from || !card || !target || disabled || card.disabled) return;
    const next: KanbanValue = {};
    for (const c of columns) next[c.id] = map[c.id].filter((x) => x !== id);
    const at = Math.max(0, Math.min(index, next[to].length));
    next[to].splice(at, 0, id);
    if (!controlled) setInner(next);
    onValueChange?.(next);
    onMove?.({ cardId: id, from: from.id, to, index: at });
    setStatus(movedText(card.title, target.title, at + 1, next[to].length));
    pending.current = { id, column: to };
  };

  // Alt with the arrows: left and right change column, up and down change position
  const onCardKeyDown = (id: string, e: KeyboardEvent<HTMLElement>) => {
    if (e.target !== e.currentTarget || e.ctrlKey || e.metaKey) return;
    const vertical = e.key === 'ArrowUp' || e.key === 'ArrowDown';
    const horizontal = e.key === 'ArrowLeft' || e.key === 'ArrowRight';
    if (!vertical && !horizontal) return;
    const here = columnOf(id);
    if (!here) return;
    const at = map[here.id].indexOf(id);
    if (!e.altKey) {
      if (!vertical) return;
      e.preventDefault();
      const sibling = map[here.id][at + (e.key === 'ArrowUp' ? -1 : 1)];
      if (sibling) cardEl(sibling)?.focus();
      return;
    }
    e.preventDefault();
    const card = byId.get(id);
    if (disabled || card?.disabled) return;
    if (vertical) {
      const to = at + (e.key === 'ArrowUp' ? -1 : 1);
      if (to < 0 || to >= map[here.id].length) { setStatus(edgeText); return; }
      moveCard(id, here.id, to);
      return;
    }
    const rtl = rootRef.current ? getComputedStyle(rootRef.current).direction === 'rtl' : false;
    const step = (e.key === 'ArrowRight') !== rtl ? 1 : -1;
    const dest = columns[columns.indexOf(here) + step];
    if (!dest) { setStatus(edgeText); return; }
    moveCard(id, dest.id, Math.min(at, map[dest.id].length));
  };

  // where a carried card would land: the column nearest the pointer across, the slot among its cards down
  const locate = (x: number, y: number, id: string) => {
    const cols = Array.from(rootRef.current?.querySelectorAll<HTMLElement>('[data-kb-column]') ?? []);
    let best: HTMLElement | null = null;
    let gap = Infinity;
    for (const col of cols) {
      const r = col.getBoundingClientRect();
      const far = r.x + r.width;
      const d = x < r.x ? r.x - x : x > far ? x - far : 0;
      if (d < gap) { gap = d; best = col; }
    }
    if (!best) return null;
    const items = Array.from(best.querySelectorAll<HTMLElement>('[data-card-id]')).filter((el) => el.dataset.cardId !== id);
    const index = items.filter((el) => { const r = el.getBoundingClientRect(); return y > r.top + r.height / 2; }).length;
    return { column: best.dataset.kbColumn as string, index };
  };

  const onGripDown = (e: ReactPointerEvent<HTMLElement>, id: string, from: string) => {
    if (disabled || (e.pointerType === 'mouse' && e.button !== 0)) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setCarry({ id, from, x: e.clientX, y: e.clientY, dx: 0, dy: 0, active: false, over: null });
  };
  const onGripMove = (e: ReactPointerEvent<HTMLElement>) => {
    const d = dragRef.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    const active = d.active || Math.hypot(dx, dy) > THRESHOLD;
    setCarry({ ...d, dx, dy, active, over: active ? locate(e.clientX, e.clientY, d.id) : null });
  };
  const onGripUp = () => {
    const d = dragRef.current;
    setCarry(null);
    if (d?.active && d.over) moveCard(d.id, d.over.column, d.over.index);
  };

  // Escape lets go of a carried card where it started
  useEffect(() => {
    if (!drag) return;
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (dragRef.current?.active) setStatus(cancelledText);
      setCarry(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drag === null, cancelledText]);

  const hintId = `${uid}-hint`;
  const dragging = drag?.active ? drag : null;

  const renderCard = (id: string, col: KanbanColumn, others: string[]) => {
    const card = byId.get(id) as KanbanCard;
    const locked = disabled || !!card.disabled;
    const mine = dragging?.id === id;
    const mark = dragging?.over?.column === col.id && !mine
      ? (() => {
          const at = dragging.over.index;
          if (at < others.length) return others[at] === id ? 'before' : undefined;
          return others[others.length - 1] === id ? 'after' : undefined;
        })()
      : undefined;
    const titleId = `${uid}-t-${id}`;
    const style = mine ? ({ '--kb-dx': `${dragging.dx}px`, '--kb-dy': `${dragging.dy}px` } as CSSProperties) : undefined;
    const targets = columns.filter((c) => c.id !== col.id);
    return (
      <Card
        key={id}
        as="li"
        padding="sm"
        tabIndex={0}
        data-card-id={id}
        data-disabled={locked ? 'true' : undefined}
        data-dragging={mine ? 'true' : undefined}
        data-drop={mark}
        aria-labelledby={titleId}
        aria-describedby={hintId}
        className={styles.card}
        style={style}
        onKeyDown={(e) => onCardKeyDown(id, e)}
        header={
          <div className={styles.cardHead}>
            <span id={titleId} className={styles.cardTitle}>{card.title}</span>
            <span className={styles.tools}>
              {canDrag && !locked && (
                <span
                  className={styles.grip}
                  aria-hidden="true"
                  onPointerDown={(e) => onGripDown(e, id, col.id)}
                  onPointerMove={onGripMove}
                  onPointerUp={onGripUp}
                  onPointerCancel={() => setCarry(null)}
                >
                  <Icon name="drag" size="sm" />
                </span>
              )}
              {targets.length > 0 && (
                <Menu
                  label={moveLabel(card.title)}
                  disabled={locked}
                  items={targets.map((t) => ({ value: t.id, label: moveToLabel(t.title) }))}
                  onAction={(to) => moveCard(id, to, Infinity)}
                />
              )}
            </span>
          </div>
        }
      >
        {card.detail != null && <div className={styles.detail}>{card.detail}</div>}
      </Card>
    );
  };

  return (
    <div
      ref={setRoot}
      role="group"
      aria-label={label}
      data-component="KanbanBoard"
      data-disabled={disabled ? 'true' : undefined}
      className={cx(styles.root, className)}
      {...rest}
    >
      {columns.map((col) => {
        const ids = map[col.id];
        const over = col.limit != null && ids.length > col.limit;
        const headId = `${uid}-h-${col.id}`;
        const others = ids.filter((x) => x !== dragging?.id);
        const target = dragging?.over?.column === col.id && others.length === 0;
        return (
          <section key={col.id} className={styles.column} data-kb-column={col.id} aria-labelledby={headId}>
            <div className={styles.head}>
              {createElement(`h${headingLevel}`, { id: headId, className: styles.title }, col.title)}
              <span className={styles.count} data-over-limit={over ? 'true' : undefined}>
                {over && <span className={styles.flag} aria-hidden="true"><Icon name="warning" size="sm" /></span>}
                <span aria-hidden="true">{col.limit != null ? `${ids.length}/${col.limit}` : ids.length}</span>
                <VisuallyHidden>{countText(ids.length, col.limit)}</VisuallyHidden>
              </span>
            </div>
            <div className={styles.body} data-over={target ? 'true' : undefined}>
              {ids.length > 0 ? (
                <ul role="list" className={styles.list}>
                  {ids.map((id) => renderCard(id, col, others))}
                </ul>
              ) : (
                <p className={styles.empty}>{emptyText}</p>
              )}
            </div>
          </section>
        );
      })}
      <VisuallyHidden id={hintId}>{hintText}</VisuallyHidden>
      <VisuallyHidden role="status" aria-live="polite">{status}</VisuallyHidden>
    </div>
  );
});
