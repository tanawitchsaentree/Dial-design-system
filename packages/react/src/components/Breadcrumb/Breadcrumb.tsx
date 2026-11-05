import {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  useEffect,
  useRef,
  useState,
  type AnchorHTMLAttributes,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
  type Ref,
} from 'react';
import { cx } from '../../cx';
import { messages } from '../../messages';
import { useIsoLayoutEffect } from '../../spring';
import { Icon } from '../Icon';
import styles from './Breadcrumb.module.css';

export type BreadcrumbFold = 'auto' | 'always' | 'never';

export interface BreadcrumbProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /** The levels of the path from the top down, as `Crumb`s. The last one is the page you are on. */
  children: ReactNode;
  /** The name of the landmark that assistive tech lists. Pass your own for another language. Defaults to "Breadcrumb". */
  label?: string;
  /** `auto` (default) folds the middle levels into one key when the path does not fit its width; `always` folds whenever there are three or more levels; `never` lets the row wrap instead. */
  fold?: BreadcrumbFold;
  /** The name of the folded key. Pass your own for another language. Defaults to "Show full path". */
  moreLabel?: string;
  /** Class name for the landmark. */
  className?: string;
}

export interface CrumbProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** The words of this level, a noun such as "Lamps". */
  children: ReactNode;
  /** Where the level goes. Not needed on the last level, which is the page you are on. */
  href?: string;
  /** Marks the page you are on. `Breadcrumb` sets it on the last level for you; it prints plain text with an ink index mark and is announced with aria-current="page". */
  current?: boolean;
  /** Hand the link styles to your own child, such as a router link, instead of printing an anchor. */
  asChild?: boolean;
}

/** One level of a Breadcrumb: a link, or the page you are on when it is last. */
export const Crumb = forwardRef<HTMLAnchorElement, CrumbProps>(function Crumb(
  { children, current, asChild, className, ...rest },
  ref,
) {
  if (current) {
    const { href: _href, ...text } = rest;
    return (
      <span ref={ref as unknown as Ref<HTMLSpanElement>} aria-current="page" className={cx(styles.current, className)} {...(text as HTMLAttributes<HTMLSpanElement>)}>
        {children}
        <span className={styles.mark} aria-hidden="true" />
      </span>
    );
  }
  if (asChild && isValidElement(children)) {
    const child = children as ReactElement<{ className?: string }>;
    return cloneElement(child, { ...rest, ref, className: cx(styles.link, child.props.className, className) } as Record<string, unknown>);
  }
  return <a ref={ref} className={cx(styles.link, className)} {...rest}>{children}</a>;
});

/** The path to this page: names in a row joined by dotted leaders, the last one marked. Folds the middle on a narrow unit. */
export const Breadcrumb = forwardRef<HTMLElement, BreadcrumbProps>(function Breadcrumb(
  { children, label = messages.breadcrumb.label, fold = 'auto', moreLabel = messages.breadcrumb.more, className, ...rest },
  ref,
) {
  const crumbs = Children.toArray(children).filter(isValidElement) as ReactElement<CrumbProps>[];
  const n = crumbs.length;
  const canFold = fold !== 'never' && n >= 3;
  const listRef = useRef<HTMLOListElement>(null);
  const [tight, setTight] = useState(false);
  const [open, setOpen] = useState(false);
  const folded = canFold && !open && (fold === 'always' || tight);

  // Measure with the path unfolded and no wrap: if it overflows its box, it is too wide for the unit.
  useIsoLayoutEffect(() => {
    const el = listRef.current;
    if (!el || !canFold || fold === 'always') { setTight(false); return; }
    const measure = () => {
      if (open) return;
      const had = el.hasAttribute('data-collapsed');
      if (had) el.removeAttribute('data-collapsed');
      const over = el.scrollWidth > el.clientWidth;
      if (had) el.setAttribute('data-collapsed', '');
      setTight(over);
    };
    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  });

  // The folded key leaves when pressed, so focus moves to the first name it printed back.
  const wasOpen = useRef(false);
  useEffect(() => {
    if (open && !wasOpen.current) listRef.current?.querySelector<HTMLElement>('li:nth-child(2) a, li:nth-child(2) [href]')?.focus();
    wasOpen.current = open;
  }, [open]);

  return (
    <nav ref={ref} data-component="Breadcrumb" aria-label={label} className={cx(styles.root, className)} {...rest}>
      <ol ref={listRef} className={styles.list} data-collapsed={folded ? '' : undefined} data-open={open || fold === 'never' ? '' : undefined}>
        {crumbs.map((crumb, i) => {
          const last = i === n - 1;
          const middle = i > 0 && !last;
          return [
            i === 1 && folded ? (
              <li key="more" className={styles.item} data-more="">
                <span className={styles.leader} aria-hidden="true" />
                <button type="button" className={styles.more} aria-label={moreLabel} aria-expanded="false" onClick={() => setOpen(true)}>
                  <Icon name="more" size="sm" />
                </button>
              </li>
            ) : null,
            <li key={crumb.key ?? i} className={styles.item} data-hidden={middle && folded ? '' : undefined}>
              {i > 0 && <span className={styles.leader} aria-hidden="true" />}
              {last ? cloneElement(crumb, { current: true }) : crumb}
            </li>,
          ];
        })}
      </ol>
    </nav>
  );
});
