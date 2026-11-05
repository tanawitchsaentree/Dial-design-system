import {
  Children,
  createContext,
  createElement,
  forwardRef,
  isValidElement,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type ElementType,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
  type Ref,
} from 'react';
import { cx } from '../../cx';
import { messages } from '../../messages';
import { usePresence } from '../../presence';
import { Badge } from '../Badge';
import { Button } from '../Button';
import { EmptyState } from '../EmptyState';
import { Icon } from '../Icon';
import { IconButton } from '../IconButton';
import { List, ListItem } from '../List';
import { VisuallyHidden } from '../VisuallyHidden';
import styles from './NotificationCenter.module.css';

/** Every word the center speaks on its own. Pass any of them in `words` to translate or reword. */
export interface NotificationWords {
  /** The center's heading, such as "Notifications". */
  title: string;
  /** The label of the key that marks every line read. */
  markAll: string;
  /** The name of a line's mark-as-read key, given the line's title. It should include the title so every key has its own name. */
  markRead: (title: string) => string;
  /** The name of a line's dismiss key, given the line's title. */
  dismiss: (title: string) => string;
  /** The word printed after the unread count in the header, such as "unread". */
  unread: string;
  /** The word read out before an unread line, such as "Unread:". */
  unreadPrefix: string;
  /** The line shown when there is nothing left. */
  empty: string;
  /** The sentence under the empty line. */
  emptyText: string;
  /** What the live region says when one new notification arrives, given its title. */
  arrived: (title: string) => string;
  /** What the live region says when several arrive at once, given how many. */
  arrivedMany: (count: number) => string;
}

export interface NotificationCenterProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /** The notifications, as `NotificationItem`s, newest first. Lines with the same `day` that follow each other are put under one day heading. Pass them directly; a wrapper component hides its `day` from the center. */
  children?: ReactNode;
  /** Words to replace the built-in ones, for another language or tone. Any key you leave out keeps its English default. */
  words?: Partial<NotificationWords>;
  /** The level of the center's heading, 2 to 4. The day headings sit one level below. Default 2. */
  headingLevel?: 2 | 3 | 4;
  /** Called with a line's id and the new read state when a person presses its mark-as-read key (and once per unread line for Mark all read). Passing it makes read state yours: the center then only reports, and you change each item's `unread`. Leave it out and the center keeps read state itself. */
  onReadChange?: (id: string, read: boolean) => void;
  /** Called with a line's id once its leaving fade has finished. Passing it makes removal yours: remove the item from the children. Leave it out and the center removes the line itself. */
  onDismiss?: (id: string) => void;
  /** Class name for the center's body. */
  className?: string;
}

export interface NotificationItemProps extends Omit<HTMLAttributes<HTMLLIElement>, 'title' | 'id' | 'children'> {
  /** A stable id for the notification. It is required, because read, dismiss and the live region all follow it. */
  id: string;
  /** What happened, as plain text, such as "Washer finished". It names the line's keys, so it is a string. */
  title: string;
  /** The day group the line belongs to, such as "Today". The center prints it as a heading above the run of lines that share it. */
  day?: string;
  /** The time the notification arrived, printed after the description in tabular figures, such as "22:40". */
  time?: ReactNode;
  /** A machine-readable date or time for the time element, such as "2026-11-04T22:40". */
  dateTime?: string;
  /** Whether the line is still unread. Unread shows a filled lamp, a medium title and primary ink; read shows a ring and secondary ink. Default false. */
  unread?: boolean;
  /** One line of detail under the title, such as "Laundry room". */
  children?: ReactNode;
  /** Class name for the line. */
  className?: string;
}

interface CenterContextValue {
  words: NotificationWords;
  unreadOf: (id: string, unread: boolean) => boolean;
  setRead: (id: string, read: boolean) => void;
  dismissed: (id: string) => void;
}
const CenterContext = createContext<CenterContextValue>({
  words: messages.notificationCenter,
  unreadOf: (_id, unread) => unread,
  setRead: () => {},
  dismissed: () => {},
});

const ANNOUNCE_FOR = 5000;

type ItemElement = ReactElement<NotificationItemProps>;

/**
 * A log of what the home has said, printed in days. A lamp is lit while a line waits to be read and a ring once it
 * is read, and a medium title says the same in weight. Each line has a mark-as-read key and a dismiss key; the header
 * has Mark all read; a hidden polite region announces new lines. Open it in a Popover or Drawer yourself.
 */
export const NotificationCenter = forwardRef<HTMLElement, NotificationCenterProps>(function NotificationCenter(
  { children, words: custom, headingLevel = 2, onReadChange, onDismiss, className, ...rest },
  ref,
) {
  const words: NotificationWords = { ...messages.notificationCenter, ...custom };
  const titleId = useId();
  const readOwned = onReadChange !== undefined;
  const [overrides, setOverrides] = useState<Record<string, boolean>>({});
  const [removed, setRemoved] = useState<string[]>([]);
  const [announcement, setAnnouncement] = useState('');
  const seen = useRef<string[] | null>(null);
  const timer = useRef<number | undefined>(undefined);

  const every = Children.toArray(children).filter(isValidElement) as ItemElement[];
  const items = every.filter((el) => !removed.includes(el.props.id));
  const unreadOf = (id: string, unread: boolean) => (readOwned ? unread : overrides[id] ?? unread);
  const unreadItems = items.filter((el) => unreadOf(el.props.id, el.props.unread ?? false));

  const setRead = (id: string, read: boolean) => {
    if (onReadChange) onReadChange(id, read);
    else setOverrides((o) => ({ ...o, [id]: !read }));
  };
  const markAll = () => {
    if (!unreadItems.length) return;
    if (onReadChange) unreadItems.forEach((el) => onReadChange(el.props.id, true));
    else setOverrides((o) => ({ ...o, ...Object.fromEntries(unreadItems.map((el) => [el.props.id, false])) }));
  };
  const dismissed = (id: string) => {
    if (onDismiss) onDismiss(id);
    else setRemoved((r) => [...r, id]);
  };

  // a line that was not there before is announced once, politely; the first render announces nothing
  const key = every.map((el) => el.props.id).join('\u0000');
  useEffect(() => {
    const ids = every.map((el) => el.props.id);
    const before = seen.current;
    seen.current = ids;
    if (!before) return;
    const fresh = every.filter((el) => !before.includes(el.props.id) && unreadOf(el.props.id, el.props.unread ?? false));
    if (!fresh.length) return;
    setAnnouncement(fresh.length === 1 ? words.arrived(fresh[0].props.title) : words.arrivedMany(fresh.length));
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setAnnouncement(''), ANNOUNCE_FOR);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const groups: { day?: string; items: ItemElement[] }[] = [];
  for (const el of items) {
    const last = groups[groups.length - 1];
    if (last && last.day === el.props.day) last.items.push(el);
    else groups.push({ day: el.props.day, items: [el] });
  }
  const Title = `h${headingLevel}` as ElementType;
  const Day = `h${headingLevel + 1}` as ElementType;

  return (
    <CenterContext.Provider value={{ words, unreadOf, setRead, dismissed }}>
      <section
        ref={ref}
        data-component="NotificationCenter"
        data-surface=""
        aria-labelledby={titleId}
        className={cx(styles.root, className)}
        {...rest}
      >
        <div className={styles.header}>
          {createElement(Title, { id: titleId, tabIndex: -1, 'data-part': 'title', className: styles.title }, words.title)}
          {unreadItems.length > 0 && <Badge className={styles.count} count={unreadItems.length}>{words.unread}</Badge>}
          <Button
            className={styles.markAll}
            data-part="mark-all"
            aria-disabled={unreadItems.length === 0 ? true : undefined}
            onClick={markAll}
          >
            {words.markAll}
          </Button>
        </div>
        <VisuallyHidden role="status" aria-live="polite" aria-atomic="true">{announcement}</VisuallyHidden>
        {groups.map((g, i) => (
          <div key={`${g.day ?? ''}-${i}`} className={styles.group} data-part="group">
            {g.day != null && createElement(Day, { className: styles.day, id: `${titleId}-day-${i}` }, g.day)}
            <List className={styles.list} label={g.day ?? words.title}>{g.items}</List>
          </div>
        ))}
        {items.length === 0 && <EmptyState className={styles.empty} title={words.empty}>{words.emptyText}</EmptyState>}
      </section>
    </CenterContext.Provider>
  );
});

/** One notification: a lamp, the title and detail, a mark-as-read key and a dismiss key. Write it inside `NotificationCenter`. */
export const NotificationItem = forwardRef<HTMLLIElement, NotificationItemProps>(function NotificationItem(
  { id, title, day: _day, time, dateTime, unread = false, children, className, ...rest },
  ref,
) {
  const ctx = useContext(CenterContext);
  const isUnread = ctx.unreadOf(id, unread);
  const [gone, setGone] = useState(false);
  const presence = usePresence<HTMLLIElement>(!gone);
  const node = useRef<HTMLLIElement | null>(null);

  const setRef = (el: HTMLLIElement | null) => {
    node.current = el;
    presence.ref(el);
    if (typeof ref === 'function') ref(el);
    else if (ref) (ref as { current: HTMLLIElement | null }).current = el;
  };

  // the line is removed only after its fade has finished
  useEffect(() => {
    if (gone && !presence.mounted) ctx.dismissed(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gone, presence.mounted]);

  // focus goes to the next line's dismiss key (else the previous one's, else the heading), so a run can be cleared by keyboard
  const dismiss = () => {
    const li = node.current;
    const center = li?.closest<HTMLElement>('[data-component="NotificationCenter"]');
    if (li && center) {
      const lines = Array.from(center.querySelectorAll<HTMLElement>('li[data-component="NotificationItem"]:not([data-state="closing"])'));
      const at = lines.indexOf(li);
      const next = lines[at + 1] ?? lines[at - 1];
      const target = next?.querySelector<HTMLElement>('[data-part="dismiss"]') ?? center.querySelector<HTMLElement>('[data-part="title"]');
      target?.focus();
    }
    setGone(true);
  };

  if (!presence.mounted) return null;
  return (
    <ListItem
      ref={setRef as Ref<HTMLLIElement>}
      data-component="NotificationItem"
      data-notification-id={id}
      data-unread={isUnread ? '' : undefined}
      data-state={presence.state}
      className={cx(styles.item, className)}
      leading={<span className={styles.lamp} />}
      label={
        <>
          {isUnread && <VisuallyHidden>{ctx.words.unreadPrefix} </VisuallyHidden>}
          <span className={styles.heading}>{title}</span>
        </>
      }
      description={
        children != null || time != null ? (
          <>
            {children}
            {children != null && time != null ? ' · ' : null}
            {time != null && <time className={styles.time} dateTime={dateTime}>{time}</time>}
          </>
        ) : undefined
      }
      trailing={
        <span className={styles.keys}>
          <IconButton label={ctx.words.markRead(title)} aria-pressed={!isUnread} data-part="mark-read" onClick={() => ctx.setRead(id, isUnread)}>
            <Icon name="check" />
          </IconButton>
          <IconButton label={ctx.words.dismiss(title)} data-part="dismiss" onClick={dismiss}>
            <Icon name="close" />
          </IconButton>
        </span>
      }
      {...rest}
    />
  );
});
