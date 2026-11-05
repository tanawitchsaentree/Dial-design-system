import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../cx';
import { messages } from '../../messages';
import { Button } from '../Button';
import { Icon, type IconName } from '../Icon';
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
// printed in dial's one icon language, the dot matrix (R-005)
const GLYPH: Record<BannerTone, IconName> = { neutral: 'info', positive: 'positive', warning: 'warning', critical: 'critical' };

/**
 * An inline message that stays on a screen for as long as a condition holds: a printed glyph and a
 * status word, the message, an optional key and an optional dismiss key. It is role="status", or
 * role="alert" when critical, so it is announced when it appears.
 */
export const Banner = forwardRef<HTMLDivElement, BannerProps>(function Banner(
  { tone = 'neutral', status, children, action, onDismiss, dismissLabel = messages.dismiss, className, ...rest },
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
        <Icon name={GLYPH[tone]} className={styles.glyph} />
        <span className={styles.status}>{status ?? WORD[tone]}</span>
      </span>
      <span className={styles.message}>{children}</span>
      {action || onDismiss ? (
        <span className={styles.keys}>
          {action ? <Button onClick={action.onAction}>{action.label}</Button> : null}
          {onDismiss ? (
            <IconButton label={dismissLabel} onClick={onDismiss}>
              <Icon name="close" />
            </IconButton>
          ) : null}
        </span>
      ) : null}
    </div>
  );
});
