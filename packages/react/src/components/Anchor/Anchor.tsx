import { forwardRef, useCallback, useEffect, useRef, useState, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../cx';
import { messages } from '../../messages';
import styles from './Anchor.module.css';

export interface AnchorItem {
  /** The id of the heading this item goes to, without the `#`. */
  id: string;
  /** The words of the item, usually the heading's own text. */
  label: ReactNode;
  /** Sub-headings of this one. They print one level in and are followed in order. */
  items?: AnchorItem[];
}

export interface AnchorProps extends Omit<HTMLAttributes<HTMLElement>, 'children' | 'defaultValue'> {
  /** The headings of the page, in the order they stand on it. Put sub-headings in an item's `items`. */
  items: AnchorItem[];
  /** The name of the landmark that assistive tech lists. Pass your own for another language. Defaults to "On this page". */
  label?: string;
  /** The id of the current section, when you set it yourself. Pair it with `onValueChange`. */
  value?: string;
  /** The id of the section marked at first, when the list follows the page by itself. */
  defaultValue?: string;
  /** Called with the id of the new current section, from scrolling or from a press. */
  onValueChange?: (id: string) => void;
  /** Height in CSS pixels of anything fixed to the top of the scrolling area, such as a header. A heading counts as reached once it is below it. Default 0. */
  offset?: number;
  /** The scrolling element that holds the headings: the element itself, or a CSS selector such as `#page`. Leave it out when the page itself scrolls. */
  root?: HTMLElement | string | null;
  /** Class name for the landmark. */
  className?: string;
}

/** Where a heading counts as reached, as a share of the scrolling area's height below the offset. */
const REACH = 0.3;

const flatten = (items: AnchorItem[]): string[] => items.flatMap((i) => [i.id, ...flatten(i.items ?? [])]);

function Level({ items, current, onPick }: { items: AnchorItem[]; current: string | undefined; onPick: (id: string) => void }) {
  return (
    <ul className={styles.list}>
      {items.map((it) => (
        <li key={it.id} className={styles.item}>
          <a href={`#${it.id}`} className={styles.link} aria-current={current === it.id ? 'location' : undefined} onClick={() => onPick(it.id)}>
            <span className={styles.mark} aria-hidden="true" />
            <span className={styles.label}>{it.label}</span>
          </a>
          {it.items && it.items.length > 0 && <Level items={it.items} current={current} onPick={onPick} />}
        </li>
      ))}
    </ul>
  );
}

/** The "on this page" list: heading links in one column, the section in view marked with an ink index mark and aria-current="location". */
export const Anchor = forwardRef<HTMLElement, AnchorProps>(function Anchor(
  { items, label = messages.anchor.label, value, defaultValue, onValueChange, offset = 0, root, className, ...rest },
  ref,
) {
  const controlled = value !== undefined;
  const ids = flatten(items);
  const key = ids.join('\n');
  const [inner, setInner] = useState<string | undefined>(defaultValue ?? ids[0]);
  const current = controlled ? value : inner;
  const live = useRef({ controlled, current, onValueChange });
  live.current = { controlled, current, onValueChange };

  const pick = useCallback((id: string) => {
    const l = live.current;
    if (id === l.current) return;
    if (!l.controlled) setInner(id);
    l.onValueChange?.(id);
  }, []);

  // Follow the page. The observer only says "a heading crossed the reading band"; the answer is then read from
  // the headings' real positions, so it is the same on a scroll up, a scroll down and a jump.
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined' || typeof document === 'undefined') return;
    const names = key.split('\n').filter(Boolean);
    const scroller = typeof root === 'string' ? document.querySelector<HTMLElement>(root) : root ?? null;
    if (root && !scroller) return;
    const area = () => {
      const edge = scroller ? scroller.getBoundingClientRect().top : 0;
      return { top: edge, span: scroller ? scroller.clientHeight : window.innerHeight };
    };
    const read = () => {
      const { top, span } = area();
      const line = top + offset + span * REACH;
      let found: string | undefined;
      let last: string | undefined;
      for (const id of names) {
        const el = document.getElementById(id);
        if (!el) continue;
        last = id;
        if (el.getBoundingClientRect().top <= line) found = id;
        else break;
      }
      const se = scroller ?? document.scrollingElement;
      if (se && se.scrollTop > 0 && se.scrollTop + se.clientHeight >= se.scrollHeight - 1 && last) found = last;
      if (found) pick(found);
    };
    let io: IntersectionObserver | undefined;
    const build = () => {
      io?.disconnect();
      const { span } = area();
      const below = Math.max(0, Math.round(span - offset - span * REACH));
      io = new IntersectionObserver(read, { root: scroller, rootMargin: `${-offset}px 0px ${-below}px 0px`, threshold: [0, 1] });
      for (const id of names) {
        const el = document.getElementById(id);
        if (el) io.observe(el);
      }
    };
    build();
    read();
    window.addEventListener('resize', build);
    return () => { window.removeEventListener('resize', build); io?.disconnect(); };
  }, [key, offset, root, pick]);

  return (
    <nav ref={ref} data-component="Anchor" aria-label={label} className={cx(styles.root, className)} {...rest}>
      <Level items={items} current={current} onPick={pick} />
    </nav>
  );
});
