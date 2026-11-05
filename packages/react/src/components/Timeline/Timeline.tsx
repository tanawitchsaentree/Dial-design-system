import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../cx';
import { messages } from '../../messages';
import styles from './Timeline.module.css';

export interface TimelineProps extends HTMLAttributes<HTMLOListElement> {
  /** The events, as `TimelineItem`s, in the order you want them read. Put the newest first. */
  children: ReactNode;
}

export interface TimelineItemProps extends Omit<HTMLAttributes<HTMLLIElement>, 'title'> {
  /** The time the event happened, printed in the left column, such as `22:40` or `Mon 18:30`. */
  time: ReactNode;
  /** A machine-readable date or time for the time element, such as `2026-11-04T22:40`. Optional. */
  dateTime?: string;
  /** The event's name, level with its node. */
  title: ReactNode;
  /** Optional text under the title. */
  children?: ReactNode;
  /** Lights this event: a filled node, a medium title and the word Latest. Use it on the newest event only. */
  latest?: boolean;
  /** The word read out for the lit node. Pass your own for another language. Defaults to "Latest". */
  latestLabel?: string;
}

/** A log of past events: the time in a column, a hairline rail, a node where each event meets the line. */
export const Timeline = forwardRef<HTMLOListElement, TimelineProps>(function Timeline({ children, className, ...rest }, ref) {
  return <ol ref={ref} data-component="Timeline" className={cx(styles.root, className)} {...rest}>{children}</ol>;
});

/** One event of a Timeline. */
export const TimelineItem = forwardRef<HTMLLIElement, TimelineItemProps>(function TimelineItem(
  { time, dateTime, title, children, latest = false, latestLabel = messages.timeline.latest, className, ...rest },
  ref,
) {
  return (
    <li ref={ref} data-latest={latest ? '' : undefined} className={cx(styles.item, className)} {...rest}>
      <time className={styles.time} dateTime={dateTime}>{time}</time>
      <span className={styles.rail}>
        <span className={styles.node} role={latest ? 'img' : undefined} aria-label={latest ? latestLabel : undefined} aria-hidden={latest ? undefined : true} />
      </span>
      <div className={styles.content}>
        <p className={styles.title}>{title}</p>
        {children != null && <div className={styles.detail}>{children}</div>}
      </div>
    </li>
  );
});
