import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type PointerEvent,
  type ReactElement,
  type RefAttributes,
} from 'react';
import { cx } from '../../cx';
import { messages } from '../../messages';
import { Icon } from '../Icon';
import { Menu } from '../Menu';
import { formatTime } from '../Scrubber/Scrubber';
import styles from './Queue.module.css';

/** One track in the queue. A MediaPlayer's tracks can be passed as they are. */
export interface QueueTrack {
  /** A stable id; the playing track is named by it. */
  id: string;
  /** The title, printed in primary ink. */
  title: string;
  /** Who plays it, printed under the title. */
  artist?: string;
  /** The length in seconds, printed at the row's end. */
  duration?: number;
}

/** The words the queue prints and speaks. Pass your own for another language. */
export interface QueueWords {
  playing: string;
  moveUp: string;
  moveDown: string;
  remove: string;
  more: (title: string) => string;
  moved: (title: string, position: number, total: number) => string;
  removed: (title: string) => string;
}

const WORDS: QueueWords = {
  playing: 'Playing',
  moveUp: messages.queue.moveUp,
  moveDown: messages.queue.moveDown,
  remove: messages.queue.remove,
  more: (t) => `More for ${t}`,
  moved: (t, p, n) => `${t} moved to ${p} of ${n}`,
  removed: (t) => `${t} removed from the queue`,
};

export interface QueueProps<T extends QueueTrack = QueueTrack> extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue' | 'onPlay'> {
  /** The name of the list for assistive tech. Default "Up next". */
  label?: string;
  /** The tracks in order when controlled. Pair it with `onTracksChange`. */
  tracks?: T[];
  /** The tracks at the start when uncontrolled. */
  defaultTracks?: T[];
  /** Called with the tracks in their new order after a move or a removal. */
  onTracksChange?: (tracks: T[]) => void;
  /** The id of the track that is playing. Its row gets the ink index mark and the word Playing. */
  playing?: string | null;
  /** Called with a track's id when its row is pressed, to play it. */
  onPlay?: (id: string) => void;
  /** Lets the person remove tracks from the menu or with Delete. Default true. */
  removable?: boolean;
  /** Your own words for the menu and the announcements. */
  words?: Partial<QueueWords>;
}

const Grip = () => (
  <svg className={styles.grip} viewBox="0 0 16 16" aria-hidden="true" focusable="false">
    <circle cx="5.5" cy="3" r="1.5" /><circle cx="10.5" cy="3" r="1.5" />
    <circle cx="5.5" cy="8" r="1.5" /><circle cx="10.5" cy="8" r="1.5" />
    <circle cx="5.5" cy="13" r="1.5" /><circle cx="10.5" cy="13" r="1.5" />
  </svg>
);

type Drop = { at: number; side: 'before' | 'after' };

/** The up-next list of a player on one plastic body: numbered rows that play when pressed, the playing row marked
 *  in ink with the word Playing, moved with Alt and the arrows, a row menu or the printed handle, and removed with
 *  Delete or the menu. */
const QueueInner = forwardRef<HTMLDivElement, QueueProps>(function Queue(
  { label = messages.queue.label, tracks, defaultTracks, onTracksChange, playing = null, onPlay, removable = true, words, className, ...rest },
  ref,
) {
  const w = { ...WORDS, ...words };
  const controlled = tracks !== undefined;
  const [inner, setInner] = useState<QueueTrack[]>(defaultTracks ?? []);
  const list = controlled ? tracks : inner;
  const [said, setSaid] = useState('');
  const [dragId, setDragId] = useState<string | null>(null);
  const [drop, setDrop] = useState<Drop | null>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const focusNext = useRef<{ id: string | null; part: 'row' | 'menu' } | null>(null);

  const commit = (next: QueueTrack[]) => {
    if (!controlled) setInner(next);
    onTracksChange?.(next);
  };

  const move = (from: number, to: number, part: 'row' | 'menu' = 'row') => {
    if (to < 0 || to >= list.length || from === to) return;
    const next = list.slice();
    const [t] = next.splice(from, 1);
    next.splice(to, 0, t);
    focusNext.current = { id: t.id, part };
    commit(next);
    setSaid(w.moved(t.title, to + 1, next.length));
  };

  const remove = (i: number) => {
    const t = list[i];
    if (!removable || !t) return;
    const next = list.filter((_, k) => k !== i);
    focusNext.current = { id: (next[i] ?? next[i - 1])?.id ?? null, part: 'row' };
    commit(next);
    setSaid(w.removed(t.title));
  };

  // a moved row is a moved DOM node, which loses focus; focus goes back to the part that moved it
  useEffect(() => {
    const f = focusNext.current;
    if (!f) return;
    focusNext.current = null;
    const root = listRef.current;
    if (!root) return;
    const li = f.id == null ? null : root.querySelector<HTMLElement>(`:scope > li[data-id="${CSS.escape(f.id)}"]`);
    if (!li) { (root.parentElement as HTMLElement | null)?.focus(); return; }
    const target = f.part === 'menu' ? li.querySelector<HTMLElement>('button[aria-haspopup]') : li.querySelector<HTMLElement>(`.${styles.row}`);
    target?.focus();
  });

  const rows = () => (listRef.current ? Array.from(listRef.current.querySelectorAll<HTMLButtonElement>(`:scope > li > .${styles.row}`)) : []);

  const keys = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    if (e.altKey && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
      e.preventDefault();
      move(i, e.key === 'ArrowUp' ? i - 1 : i + 1);
      return;
    }
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    const all = rows();
    const go: Record<string, number> = { ArrowUp: i - 1, ArrowDown: i + 1, Home: 0, End: all.length - 1 };
    if (e.key in go) {
      e.preventDefault();
      all[Math.max(0, Math.min(all.length - 1, go[e.key]))]?.focus();
      return;
    }
    if ((e.key === 'Delete' || e.key === 'Backspace') && removable) {
      e.preventDefault();
      remove(i);
    }
  };

  // the printed handle drags a row; an ink line shows where it lands. Keys and the menu do the same move.
  const grab = (e: PointerEvent<HTMLSpanElement>, from: number) => {
    if (e.button !== 0) return;
    e.preventDefault();
    const id = list[from].id;
    setDragId(id);
    let target: number | null = null;
    const where = (y: number) => {
      const items = listRef.current ? Array.from(listRef.current.querySelectorAll<HTMLElement>(':scope > li')) : [];
      let k = items.findIndex((el) => { const r = el.getBoundingClientRect(); return y < r.top + r.height / 2; });
      if (k < 0) k = items.length;
      // dropping on its own place, just above or just below itself, moves nothing
      if (k === from || k === from + 1) { target = null; setDrop(null); return; }
      target = k;
      setDrop(k < items.length ? { at: k, side: 'before' } : { at: items.length - 1, side: 'after' });
    };
    const moveAt = (ev: globalThis.PointerEvent) => where(ev.clientY);
    const end = (ev: globalThis.PointerEvent) => {
      window.removeEventListener('pointermove', moveAt);
      window.removeEventListener('pointerup', end);
      window.removeEventListener('pointercancel', end);
      setDragId(null);
      setDrop(null);
      if (ev.type === 'pointerup' && target != null) move(from, target > from ? target - 1 : target);
    };
    window.addEventListener('pointermove', moveAt);
    window.addEventListener('pointerup', end);
    window.addEventListener('pointercancel', end);
  };

  return (
    <div ref={ref} data-component="Queue" tabIndex={-1} className={cx(styles.root, className)} {...rest}>
      <ol ref={listRef} className={styles.list} aria-label={label}>
        {list.map((t, i) => {
          const now = t.id === playing;
          const items = [
            { value: 'up', label: w.moveUp, disabled: i === 0 },
            { value: 'down', label: w.moveDown, disabled: i === list.length - 1 },
            ...(removable ? [{ value: 'remove', label: w.remove, destructive: true }] : []),
          ];
          return (
            <li
              key={t.id}
              data-id={t.id}
              className={styles.item}
              data-dragging={dragId === t.id ? 'true' : undefined}
              data-drop={drop?.at === i ? drop.side : undefined}
            >
              <span className={styles.mark} aria-hidden="true" />
              <span className={styles.handle} aria-hidden="true" onPointerDown={(e) => grab(e, i)}>
                <Grip />
              </span>
              <button
                type="button"
                className={styles.row}
                aria-current={now ? 'true' : undefined}
                onClick={() => onPlay?.(t.id)}
                onKeyDown={(e) => keys(e, i)}
              >
                <span className={styles.index} aria-hidden="true">{i + 1}</span>
                <span className={styles.text}>
                  <span className={styles.title}>{t.title}</span>
                  <span className={styles.meta}>
                    {/* every row carries the playing word, folded shut; the track that plays opens it and the one
                        that stops folds it away, so the mark moves between rows instead of jumping (D-008) */}
                    <span className={styles.nowWrap} data-on={now ? 'true' : undefined} aria-hidden={now ? undefined : true}>
                      <span className={styles.now}>
                        <Icon name="play" size="sm" className={styles.glyph} />
                        {w.playing}{t.artist ? ' · ' : ''}
                      </span>
                    </span>
                    {t.artist}
                  </span>
                </span>
                {t.duration != null && t.duration > 0 && <span className={styles.time}>{formatTime(t.duration)}</span>}
              </button>
              <Menu
                className={styles.menu}
                label={w.more(t.title)}
                items={items}
                onAction={(v) => (v === 'up' ? move(i, i - 1, 'menu') : v === 'down' ? move(i, i + 1, 'menu') : remove(i))}
              />
            </li>
          );
        })}
      </ol>
      <span className={styles.announce} role="status" aria-live="polite">{said}</span>
    </div>
  );
});

/** The up-next list of a player. Pass the same tracks as the MediaPlayer beside it. */
export const Queue = QueueInner as <T extends QueueTrack = QueueTrack>(props: QueueProps<T> & RefAttributes<HTMLDivElement>) => ReactElement | null;
