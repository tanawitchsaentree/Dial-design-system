import { forwardRef, useEffect, useRef, useState, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../cx';
import { messages } from '../../messages';
import { Icon } from '../Icon';
import styles from './Pagination.module.css';

export interface PaginationProps extends Omit<HTMLAttributes<HTMLElement>, 'onChange' | 'children'> {
  /** How many pages there are. Values below 1 count as 1. */
  count: number;
  /** The current page, 1-based. Pass it with `onPageChange` to control the Pagination yourself. */
  page?: number;
  /** The page to start on when you do not control it. Default 1. */
  defaultPage?: number;
  /** Called with the new page when a number or a key is pressed. */
  onPageChange?: (page: number) => void;
  /** How many numbers stand each side of the current page. Default 1. */
  siblings?: number;
  /** How many numbers stand at each end of the whole range. Default 1. */
  boundary?: number;
  /** Print the pages as real links: return the address of a page. Without it the pages are buttons that call `onPageChange`. */
  getHref?: (page: number) => string;
  /** The name of the landmark that assistive tech lists. Pass your own for another language. Defaults to "Pagination". */
  label?: string;
  /** The name of the previous key. Pass your own for another language. Defaults to "Previous page". */
  previousLabel?: string;
  /** The name of the next key. Pass your own for another language. Defaults to "Next page". */
  nextLabel?: string;
  /** Builds the name read out for a page number, such as "Page 4". Pass your own for another language or word order. */
  pageLabel?: (page: number) => string;
  /** Class name for the landmark. */
  className?: string;
}

type Slot = number | 'gap-start' | 'gap-end';

/** The places in the row: the same count whenever the range is long, so nothing moves between pages. */
export function pageSlots(count: number, page: number, siblings: number, boundary: number): Slot[] {
  const range = (a: number, b: number) => Array.from({ length: Math.max(0, b - a + 1) }, (_, i) => a + i);
  if (count <= boundary * 2 + siblings * 2 + 3) return range(1, count);
  const startPages = range(1, boundary);
  const endPages = range(count - boundary + 1, count);
  const from = Math.max(Math.min(page - siblings, count - boundary - siblings * 2 - 1), boundary + 2);
  const to = Math.min(Math.max(page + siblings, boundary + siblings * 2 + 2), count - boundary - 1);
  return [
    ...startPages,
    from > boundary + 2 ? 'gap-start' : boundary + 1 < count - boundary ? boundary + 1 : null,
    ...range(from, to),
    to < count - boundary - 1 ? 'gap-end' : count - boundary > boundary ? count - boundary : null,
    ...endPages,
  ].filter((s): s is Slot => s !== null);
}

/** Turns the pages of a long list: a previous and a next key, the numbers between them, the current one marked, a gap where pages fold. */
export const Pagination = forwardRef<HTMLElement, PaginationProps>(function Pagination(
  {
    count, page, defaultPage = 1, onPageChange, siblings = 1, boundary = 1, getHref,
    label = messages.pagination.label, previousLabel = messages.pagination.previous, nextLabel = messages.pagination.next,
    pageLabel = (n: number) => `${messages.pagination.page} ${n}`, className, ...rest
  },
  ref,
) {
  const total = Math.max(1, Math.floor(count));
  const [own, setOwn] = useState(defaultPage);
  const current = Math.min(total, Math.max(1, Math.floor(page ?? own)));
  const listRef = useRef<HTMLUListElement>(null);
  const refocus = useRef(false);

  const go = (next: number) => {
    const to = Math.min(total, Math.max(1, next));
    if (to === current) return;
    // A key that goes flat at the end of the range cannot keep focus, so focus moves to the current number.
    refocus.current = to === 1 || to === total;
    if (page === undefined) setOwn(to);
    onPageChange?.(to);
  };
  useEffect(() => {
    if (!refocus.current) return;
    refocus.current = false;
    listRef.current?.querySelector<HTMLElement>('[aria-current="page"]')?.focus();
  }, [current]);

  const control = (n: number, name: string, className: string, content: ReactNode, off = false, isCurrent = false) => {
    const common = {
      className,
      'aria-label': name,
      'aria-current': isCurrent ? ('page' as const) : undefined,
      'aria-disabled': off ? true : undefined,
      'data-current': isCurrent ? '' : undefined,
    };
    if (getHref) {
      return (
        <a {...common} href={off ? undefined : getHref(n)} onClick={off ? undefined : () => go(n)}>
          {content}
        </a>
      );
    }
    return (
      <button type="button" {...common} onClick={off ? undefined : () => go(n)}>
        {content}
      </button>
    );
  };

  const atStart = current <= 1;
  const atEnd = current >= total;
  return (
    <nav ref={ref} data-component="Pagination" aria-label={label} className={cx(styles.root, className)} {...rest}>
      <ul ref={listRef} className={styles.list}>
        <li className={styles.item}>{control(current - 1, previousLabel, styles.key, <Icon name="chevron-left" size="sm" />, atStart)}</li>
        {pageSlots(total, current, Math.max(0, siblings), Math.max(1, boundary)).map((slot) =>
          typeof slot === 'number' ? (
            <li key={slot} className={styles.item}>
              {control(slot, pageLabel(slot), styles.page, <>{slot}<span className={styles.mark} aria-hidden="true" /></>, false, slot === current)}
            </li>
          ) : (
            <li key={slot} className={styles.item} aria-hidden="true">
              <span className={styles.gap}><Icon name="more" size="sm" /></span>
            </li>
          ),
        )}
        <li className={styles.item}>{control(current + 1, nextLabel, styles.key, <Icon name="chevron-right" size="sm" />, atEnd)}</li>
      </ul>
    </nav>
  );
});
