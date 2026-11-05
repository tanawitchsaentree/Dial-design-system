import {
  cloneElement,
  forwardRef,
  isValidElement,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type HTMLAttributes,
  type MouseEvent as ReactMouseEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactElement,
  type ReactNode,
  type SyntheticEvent,
} from 'react';
import { cx } from '../../cx';
import { messages } from '../../messages';
import { usePresence } from '../../presence';
import { Icon } from '../Icon';
import { Heading } from '../Heading';
import { IconButton } from '../IconButton';
import styles from './Drawer.module.css';

export type DrawerSide = 'end' | 'start';

export interface DrawerProps extends Omit<HTMLAttributes<HTMLDialogElement>, 'title' | 'children' | 'open'> {
  /** Whether the drawer is open. Pass it with `onOpenChange` to control the drawer; leave it out to let `trigger` open it. */
  open?: boolean;
  /** The open state on first render when the drawer is not controlled. */
  defaultOpen?: boolean;
  /** Called with `false` when the drawer asks to close (the close key, Escape or a scrim click) and with `true` when `trigger` is pressed. */
  onOpenChange?: (open: boolean) => void;
  /** What the drawer lists, such as "Rooms". It is required, because it names the drawer. */
  title: ReactNode;
  /** The list or filters to pick from. It takes the height between the header and the keys and scrolls inside itself. */
  children?: ReactNode;
  /** Optional keys at the bottom, such as "Add room". At most one `Button kind="primary"`. */
  actions?: ReactNode;
  /** An element, usually a `Button`, that opens the drawer when pressed. Focus returns to it on close. */
  trigger?: ReactElement<{ onClick?: (e: ReactMouseEvent<HTMLElement>) => void }>;
  /** `end` (default) slides in from the inline end, the right in left-to-right text. `start` slides in from the inline start. */
  side?: DrawerSide;
  /** `true` (default) opens with `showModal()`, with a scrim, a focus trap and an inert page. `false` shows the drawer in place, for previews. */
  modal?: boolean;
  /** The accessible name of the round close key in the header. Defaults to "Close". */
  closeLabel?: string;
}

const KEYS = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * A side panel that lists what a device keeps, on the native modal `<dialog>`: focus is trapped, Escape and a
 * click on the scrim close it and the page behind is inert. It slides in from the inline end (or start) and
 * stays mounted while it slides back out, through `usePresence`. Focus returns to the opener on close.
 */
export const Drawer = forwardRef<HTMLDialogElement, DrawerProps>(function Drawer(
  { open: openProp, defaultOpen = false, onOpenChange, title, children, actions, trigger, side = 'end', modal = true, closeLabel = messages.close, className, ...rest },
  ref,
) {
  const [inner, setInner] = useState(defaultOpen);
  const controlled = openProp !== undefined;
  const open = controlled ? openProp : inner;
  const presence = usePresence<HTMLDialogElement>(open);
  const el = useRef<HTMLDialogElement | null>(null);
  const opener = useRef<HTMLElement | null>(null);
  const wasMounted = useRef(false);
  const id = useId();
  const titleId = `${id}-title`;
  const drawerId = `${id}-drawer`;

  const setRef = useCallback(
    (node: HTMLDialogElement | null) => {
      el.current = node;
      presence.ref(node);
      if (typeof ref === 'function') ref(node);
      else if (ref) ref.current = node;
    },
    // presence.ref is stable
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ref],
  );

  const setOpen = useCallback(
    (next: boolean) => {
      if (!controlled) setInner(next);
      onOpenChange?.(next);
    },
    [controlled, onOpenChange],
  );

  // The dialog is mounted in the render that opens it; show it, then it enters through @starting-style.
  useEffect(() => {
    const d = el.current;
    if (!d || !presence.mounted || d.open) return;
    opener.current = (document.activeElement as HTMLElement | null) ?? null;
    if (modal) {
      d.showModal();
      // focus the drawer itself, so its name is read first and an arrow key never lands on a row by accident
      d.focus();
    } else {
      // the attribute, not show(): show() would run the dialog focusing steps and steal focus
      d.setAttribute('open', '');
    }
  }, [presence.mounted, modal]);

  // Once it has finished leaving, focus goes back to the key that opened it.
  useEffect(() => {
    if (wasMounted.current && !presence.mounted) {
      const back = opener.current;
      opener.current = null;
      if (modal && back && back.isConnected) back.focus();
    }
    wasMounted.current = presence.mounted;
  }, [presence.mounted, modal]);

  const onCancel = (e: SyntheticEvent<HTMLDialogElement>) => {
    e.preventDefault();
    setOpen(false);
  };
  // The browser can close the dialog itself (a second Escape is not cancelable); keep state in step.
  const onClose = () => {
    if (open) setOpen(false);
  };
  // Tab past the last key would leave for the browser's own controls; wrap at both ends while modal.
  const onKeyDown = (e: ReactKeyboardEvent<HTMLDialogElement>) => {
    if (e.key !== 'Tab' || !modal) return;
    const d = el.current;
    if (!d) return;
    const keys = Array.from(d.querySelectorAll<HTMLElement>(KEYS)).filter((k) => k.offsetParent !== null || k === document.activeElement);
    if (!keys.length) return;
    const first = keys[0], last = keys[keys.length - 1];
    const at = document.activeElement;
    if (e.shiftKey && (at === first || at === d)) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && at === last) { e.preventDefault(); first.focus(); }
  };
  // A click that lands on the dialog element outside its box is a click on the scrim.
  const onClick = (e: ReactMouseEvent<HTMLDialogElement>) => {
    const d = el.current;
    if (!modal || !d || e.target !== d) return;
    const r = d.getBoundingClientRect();
    if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) setOpen(false);
  };

  const opening =
    trigger && isValidElement(trigger)
      ? cloneElement(trigger as ReactElement<Record<string, unknown>>, {
          'aria-haspopup': 'dialog',
          'aria-expanded': open,
          'aria-controls': presence.mounted ? drawerId : undefined,
          onClick: (e: ReactMouseEvent<HTMLElement>) => {
            trigger.props.onClick?.(e);
            if (!e.defaultPrevented) setOpen(true);
          },
        })
      : null;

  return (
    <>
      {opening}
      {presence.mounted ? (
        <dialog
          ref={setRef}
          id={drawerId}
          role="dialog"
          data-component="Drawer"
          data-state={presence.state}
          data-side={side}
          aria-labelledby={titleId}
          tabIndex={-1}
          data-modal={modal ? undefined : 'false'}
          className={cx(styles.root, side === 'start' && styles.start, !modal && styles.inline, className)}
          onCancel={onCancel}
          onClose={onClose}
          onKeyDown={onKeyDown}
          onClick={onClick}
          {...rest}
        >
          <div data-part="head" className={styles.head}>
            <Heading level={3} id={titleId} className={styles.title}>{title}</Heading>
            <IconButton label={closeLabel} className={styles.close} onClick={() => setOpen(false)}>
              <Icon name="close" />
            </IconButton>
          </div>
          {children ? <div data-part="content" className={styles.content}>{children}</div> : null}
          {actions ? <div data-part="actions" className={styles.actions}>{actions}</div> : null}
        </dialog>
      ) : null}
    </>
  );
});
