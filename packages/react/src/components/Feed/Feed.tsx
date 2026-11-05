import {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  useEffect,
  useId,
  useRef,
  type CSSProperties,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
} from 'react';
import { cx } from '../../cx';
import { messages } from '../../messages';
import { usePresence } from '../../presence';
import { Avatar } from '../Avatar';
import { Button } from '../Button';
import { Divider } from '../Divider';
import { Spinner } from '../Spinner';
import { Text } from '../Text';
import styles from './Feed.module.css';

export interface FeedProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'role' | 'aria-busy'> {
  /** The posts, as `FeedItem` elements written directly as children (not wrapped in a fragment or another component), so each can be given its position. */
  children?: ReactNode;
  /** The name of the feed for assistive tech, such as "Activity". Required unless `aria-labelledby` names it. */
  label?: string;
  /** True while more posts are being fetched. The feed is marked `aria-busy`, the load more key is replaced by a loading mark, and `onNearEnd` does not fire. Default false. */
  busy?: boolean;
  /** True when there are more posts to fetch. It shows the load more key and lets `onNearEnd` fire. Default false. */
  hasMore?: boolean;
  /** The size of the whole set, for `aria-setsize`. Leave it out when you do not know it: the feed then reports -1 while `hasMore` is true, and the count of posts once it is false. */
  total?: number;
  /** How many posts have arrived above the ones in view. Above 0 a notice appears at the top edge; 0 removes it. */
  newCount?: number;
  /** Called when the person presses the new-posts notice. Put the new posts in front of the list here. */
  onShowNew?: () => void;
  /** Called when the end of the list scrolls into view (an IntersectionObserver on a line after the last post), while `hasMore` is true and `busy` is false. */
  onNearEnd?: () => void;
  /** Called when the person presses the load more key or presses Page Down on the last post. Falls back to `onNearEnd` when omitted. */
  onLoadMore?: () => void;
  /** How early `onNearEnd` fires, as a CSS margin around the viewport (the `rootMargin` of the observer). Default 0 0 25% 0, which is a quarter of the viewport before the end. */
  nearEndMargin?: string;
  /** The words on the load more key. Pass your own for another language. */
  loadMoreLabel?: string;
  /** The words read out and printed while more posts load. */
  loadingLabel?: string;
  /** The words printed after the last post once `hasMore` is false. Pass an empty string to print nothing. */
  endLabel?: string;
  /** Builds the words on the notice from the count, such as "3 new posts". */
  newLabel?: (count: number) => string;
  /** Class name for the outer block. The `ref` and the other props go to the list element that carries role="feed". */
  className?: string;
  /** Inline style for the outer block. */
  style?: CSSProperties;
}

export interface FeedItemProps extends Omit<HTMLAttributes<HTMLElement>, 'children' | 'role'> {
  /** The author's name, printed in medium weight. It names the article for assistive tech together with `time`. */
  name: ReactNode;
  /** When the post was made, printed beside the name, such as "22:40" or "2 hours ago". */
  time?: ReactNode;
  /** A machine-readable date for the `time` element, such as "2026-11-04T22:40". */
  dateTime?: string;
  /** The author's picture. If it is missing or fails, the window prints the initials of `name`. */
  avatarSrc?: string;
  /** Initials to print in the avatar window instead of the ones taken from `name`. Needed when `name` is not a string. */
  initials?: string;
  /** The post's text. It describes the article for assistive tech. */
  children?: ReactNode;
  /** The position of the post, from 1. `Feed` sets it from the order of its children; pass it only to override. */
  posinset?: number;
  /** The size of the set. `Feed` sets it from its `total`; pass it only to override. */
  setsize?: number;
}

const EDITABLE = 'input, textarea, select, [contenteditable=""], [contenteditable="true"]';

/** A scrolling run of posts that loads more as the reader reaches the end, built to the WAI-ARIA feed pattern. */
export const Feed = forwardRef<HTMLDivElement, FeedProps>(function Feed(
  {
    children,
    label,
    busy = false,
    hasMore = false,
    total,
    newCount = 0,
    onShowNew,
    onNearEnd,
    onLoadMore,
    nearEndMargin = '0px 0px 25% 0px',
    loadMoreLabel = messages.feed.loadMore,
    loadingLabel = messages.feed.loading,
    endLabel = messages.feed.end,
    newLabel = messages.feed.newPosts,
    className,
    style,
    onKeyDown,
    ...rest
  },
  ref,
) {
  const items = Children.toArray(children).filter(isValidElement) as ReactElement<FeedItemProps>[];
  const count = items.length;
  const setsize = total ?? (hasMore ? -1 : count);
  const sentinel = useRef<HTMLDivElement | null>(null);
  const nearEnd = useRef(onNearEnd);
  nearEnd.current = onNearEnd;
  const lastNew = useRef(newCount);
  if (newCount > 0) lastNew.current = newCount;
  const notice = usePresence<HTMLDivElement>(newCount > 0);

  // Watch the line after the last post. The observer is made again whenever the list grows, so a list that
  // still ends inside the view after loading asks for the next page too.
  useEffect(() => {
    const node = sentinel.current;
    if (!node || !hasMore || busy || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      (entries) => { if (entries.some((e) => e.isIntersecting)) nearEnd.current?.(); },
      { rootMargin: nearEndMargin },
    );
    io.observe(node);
    return () => io.disconnect();
  }, [hasMore, busy, count, nearEndMargin]);

  const loadMore = () => (onLoadMore ?? onNearEnd)?.();

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(e);
    if (e.defaultPrevented || (e.key !== 'PageDown' && e.key !== 'PageUp') || e.altKey || e.ctrlKey || e.metaKey) return;
    const target = e.target as HTMLElement;
    if (target.closest(EDITABLE)) return;
    const article = target.closest('article');
    if (!article || article.parentElement !== e.currentTarget) return;
    const articles = Array.from(e.currentTarget.children).filter((c): c is HTMLElement => c instanceof HTMLElement && c.tagName === 'ARTICLE');
    const at = articles.indexOf(article);
    const next = articles[e.key === 'PageDown' ? at + 1 : at - 1];
    e.preventDefault();
    if (next) next.focus();
    else if (e.key === 'PageDown' && hasMore && !busy) loadMore();
  };

  return (
    <div data-component="Feed" className={cx(styles.root, className)} style={style}>
      <div className={styles.slot} role="status">
        {notice.mounted && (
          <div ref={notice.ref} className={styles.notice} data-state={notice.state}>
            <Button kind="key" onClick={onShowNew}>{newLabel(lastNew.current)}</Button>
          </div>
        )}
      </div>
      <div
        ref={ref}
        role="feed"
        aria-label={label}
        aria-busy={busy}
        className={styles.feed}
        onKeyDown={handleKeyDown}
        {...rest}
      >
        {items.map((item, i) => cloneElement(item, { posinset: item.props.posinset ?? i + 1, setsize: item.props.setsize ?? setsize }))}
      </div>
      <div ref={sentinel} className={styles.sentinel} aria-hidden="true" />
      <div className={styles.foot}>
        {busy ? (
          <Spinner showLabel label={loadingLabel} />
        ) : hasMore ? (
          <Button kind="key" onClick={loadMore}>{loadMoreLabel}</Button>
        ) : count > 0 && endLabel ? (
          <Text as="span" size="caption" tone="secondary">{endLabel}</Text>
        ) : null}
      </div>
    </div>
  );
});

/** One post of a Feed: an avatar window, the author's name and time, and the text under them. It is an article. */
export const FeedItem = forwardRef<HTMLElement, FeedItemProps>(function FeedItem(
  { name, time, dateTime, avatarSrc, initials, children, posinset, setsize, className, ...rest },
  ref,
) {
  const uid = useId();
  const nameId = `${uid}-name`;
  const timeId = `${uid}-time`;
  const bodyId = `${uid}-body`;
  return (
    <article
      ref={ref}
      data-component="FeedItem"
      tabIndex={0}
      aria-posinset={posinset}
      aria-setsize={setsize}
      aria-labelledby={time != null ? `${nameId} ${timeId}` : nameId}
      aria-describedby={children != null ? bodyId : undefined}
      className={cx(styles.item, className)}
      {...rest}
    >
      <Avatar name={typeof name === 'string' ? name : undefined} initials={initials} src={avatarSrc} />
      <div className={styles.head}>
        <Text as="span" size="label" weight="medium" className={styles.name} id={nameId}>{name}</Text>
        {time != null && (
          <Text as="span" size="caption" tone="secondary" className={styles.time} id={timeId}>
            <time dateTime={dateTime}>{time}</time>
          </Text>
        )}
      </div>
      {children != null && <Text as="div" size="body" className={styles.body} id={bodyId}>{children}</Text>}
      <Divider decorative className={styles.seam} />
    </article>
  );
});
