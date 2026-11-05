import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../cx';
import { messages } from '../../messages';
import { Display } from '../Display';
import { Grille } from '../Grille';
import styles from './EmptyState.module.css';

export type EmptyStateDrawing = 'none' | 'display' | 'grille';

export interface EmptyStateProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'children'> {
  /** The printed line that says what is missing, such as "No devices in the kitchen yet". It is required. */
  title: ReactNode;
  /** One sentence that says what to do to fill the room or list, such as "Plug one in near the hub, then add it here." */
  children?: ReactNode;
  /** The one key, usually a `Button`. Use `kind="primary"` only when filling this place is the screen's main action. */
  action?: ReactNode;
  /** A quiet drawing made of the system's own parts. `none` (default) prints words only, `display` an unlit LCD window reading two dashes, `grille` a field of unlit holes. The drawing is hidden from assistive tech; the line says the same thing in words. */
  drawing?: EmptyStateDrawing;
}

/**
 * What a room or a list shows before it holds anything: a printed line, one sentence of what to do,
 * one key and an optional quiet drawing of an unlit display or an empty grille. It paints no body;
 * it is printing on the surface it sits in.
 */
export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(function EmptyState(
  { title, children, action, drawing = 'none', className, ...rest },
  ref,
) {
  return (
    <div ref={ref} data-component="EmptyState" data-drawing={drawing} className={cx(styles.root, className)} {...rest}>
      {drawing !== 'none' ? (
        <div data-part="drawing" className={styles.drawing} aria-hidden="true">
          {drawing === 'display' ? <Display value="--" digits={2} size="sm" label={messages.noReading} /> : <Grille value={0} cols={12} rows={3} label={messages.empty} />}
        </div>
      ) : null}
      <p className={styles.line}>{title}</p>
      {children ? <p className={styles.say}>{children}</p> : null}
      {action ? <div data-part="action" className={styles.action}>{action}</div> : null}
    </div>
  );
});
