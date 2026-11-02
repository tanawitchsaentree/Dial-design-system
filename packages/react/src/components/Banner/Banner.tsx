import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../cx';
import { Button } from '../Button';
import { IconButton } from '../IconButton';
import styles from './Banner.module.css';

export type BannerTone = 'neutral' | 'positive' | 'warning' | 'critical';

/** The one optional key on a banner, which helps end the condition. */
export interface BannerAction {
  /** The word on the key, such as "Check the hub" or "Clean filter". */
  label: string;
  /** Runs when the key is pressed. The banner stays until the condition ends or it is dismissed. */
  onAction: () => void;
}

export interface BannerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'role'> {
  /** `neutral` (default) a standing note, `positive` a good condition, `warning` something needs care soon, `critical` something does not work. No tone is orange. */
  tone?: BannerTone;
  /** The status word printed beside the glyph, such as "Offline". Defaults to Note, Done, Check or Failed by tone. */
  status?: string;
  /** What holds and what happens next, such as "The hub is offline. Controls will work again when it reconnects." */
  children: ReactNode;
  /** One optional plastic key that helps end the condition. */
  action?: BannerAction;
  /** Shows the round dismiss key and runs when it is pressed. Leave it out for a condition that must stay until it ends. */
  onDismiss?: () => void;
  /** The accessible name of the dismiss key. Defaults to "Dismiss". */
  dismissLabel?: string;
}

const WORD: Record<BannerTone, string> = { neutral: 'Note', positive: 'Done', warning: 'Check', critical: 'Failed' };

/** The same glyphs as Toast, one shape per tone, so the tone is told by shape and word, never by colour alone. */
const GLYPH: Record<BannerTone, ReactNode> = {
  neutral: <><circle cx="12" cy="12" r="8.5" /><path d="M12 11v5.5M12 7.5v.01" /></>,
  positive: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  warning: <><path d="M12 3.5L21.5 20h-19z" /><path d="M12 10v4.5M12 17.5v.01" /></>,
  critical: <><path d="M8 3.5h8l4.5 4.5v8L16 20.5H8L3.5 16V8z" /><path d="M12 8v5M12 16.5v.01" /></>,
};

/**
 * An inline message that stays on a screen for as long as a condition holds: a printed glyph and a
 * status word, the message, an optional key and an optional dismiss key. It is role="status", or
 * role="alert" when critical, so it is announced when it appears.
 */
export const Banner = forwardRef<HTMLDivElement, BannerProps>(function Banner(
  { tone = 'neutral', status, children, action, onDismiss, dismissLabel = 'Dismiss', className, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      role={tone === 'critical' ? 'alert' : 'status'}
      data-component="Banner"
      data-tone={tone}
      className={cx(styles.root, styles[tone], className)}
      {...rest}
    >
      <span className={styles.head}>
        <svg className={styles.glyph} viewBox="0 0 24 24" aria-hidden="true" focusable="false">{GLYPH[tone]}</svg>
        <span className={styles.status}>{status ?? WORD[tone]}</span>
      </span>
      <span className={styles.message}>{children}</span>
      {action || onDismiss ? (
        <span className={styles.keys}>
          {action ? <Button onClick={action.onAction}>{action.label}</Button> : null}
          {onDismiss ? (
            <IconButton label={dismissLabel} onClick={onDismiss}>
              <svg className={styles.mark} viewBox="0 0 24 24" focusable="false"><path d="M6 6l12 12M18 6L6 18" /></svg>
            </IconButton>
          ) : null}
        </span>
      ) : null}
    </div>
  );
});
