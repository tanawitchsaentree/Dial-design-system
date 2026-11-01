import {
  cloneElement,
  forwardRef,
  isValidElement,
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
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
import { Heading } from '../Heading';
import { Text } from '../Text';
import styles from './Dialog.module.css';

export interface DialogProps extends Omit<HTMLAttributes<HTMLDialogElement>, 'title' | 'children' | 'open'> {
  /** Whether the sheet is open. Pass it with `onOpenChange` to control the dialog; leave it out to let `trigger` open it. */
  open?: boolean;
  /** The open state on first render when the dialog is not controlled. */
  defaultOpen?: boolean;
  /** Called with `false` when the sheet asks to close: Escape, or any key in `actions`. Called with `true` when `trigger` is pressed. */
  onOpenChange?: (open: boolean) => void;
  /** The one question the sheet asks, required: "Turn off all lamps?". It names the dialog. */
  title: ReactNode;
  /** One or two sentences under the question that say what will happen. It describes the dialog. */
  description?: ReactNode;
  /** Fields or extra content between the description and the keys. The first field takes focus on open. */
  children?: ReactNode;
  /** The keys at the bottom: plastic `Button`s and at most one `Button kind="primary"`, the main one last. Any key here closes the sheet after its own onClick, unless that onClick calls `event.preventDefault()`. */
  actions?: ReactNode;
  /** An element, usually a `Button`, that opens the sheet when pressed. Focus returns to it on close. */
  trigger?: ReactElement<{ onClick?: (e: ReactMouseEvent<HTMLElement>) => void }>;
  /** `true` (default) opens with `showModal()`: scrim, focus trap, inert page. `false` shows the sheet in place, with no scrim and no focus move, for previews. */
  modal?: boolean;
}

const FIELD = 'input:not([type="hidden"]):not([disabled]), select:not([disabled]), textarea:not([disabled]), [contenteditable="true"], :is([role="slider"], [role="spinbutton"], [role="textbox"], [role="combobox"])[tabindex]:not([aria-disabled="true"])';

/** Longest transition on the element, in ms, so the sheet leaves after its exit motion (0 under reduced motion). */
const exitMs = (el: HTMLElement) => {
  const cs = getComputedStyle(el);
  const list = (v: string) => v.split(',').map((s) => parseFloat(s) * (s.trim().endsWith('ms') ? 1 : 1000) || 0);
  const d = list(cs.transitionDuration);
  const delay = list(cs.transitionDelay);
  return Math.max(0, ...d.map((x, i) => x + (delay[i] ?? 0)));
};

/**
 * A sheet that asks one question about a device, on the native modal `<dialog>`: focus is trapped,
 * Escape closes it and the page behind is inert. Focus goes to the first field, or to the first
 * plastic key when there is nothing to fill in, and returns to the opener on close.
 */
export const Dialog = forwardRef<HTMLDialogElement, DialogProps>(function Dialog(
  { open: openProp, defaultOpen = false, onOpenChange, title, description, children, actions, trigger, modal = true, className, ...rest },
  ref,
) {
  const el = useRef<HTMLDialogElement>(null);
  useImperativeHandle(ref, () => el.current as HTMLDialogElement);
  const [inner, setInner] = useState(defaultOpen);
  const controlled = openProp !== undefined;
  const open = controlled ? openProp : inner;
  const opener = useRef<HTMLElement | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const id = useId();
  const titleId = `${id}-title`;
  const descId = `${id}-desc`;

  const setOpen = useCallback(
    (next: boolean) => {
      if (!controlled) setInner(next);
      onOpenChange?.(next);
    },
    [controlled, onOpenChange],
  );

  useEffect(() => {
    const d = el.current;
    if (!d) return;
    clearTimeout(timer.current);
    if (open) {
      if (!d.open) {
        opener.current = (document.activeElement as HTMLElement | null) ?? null;
        if (modal) d.showModal();
        // the attribute, not show(): show() would run the dialog focusing steps and steal focus
        else d.setAttribute('open', '');
      }
      if (modal) {
        const target =
          d.querySelector<HTMLElement>(`[data-part="content"] :is(${FIELD})`) ??
          d.querySelector<HTMLElement>('[data-part="actions"] button:not([disabled]):not([data-kind="primary"])') ??
          d.querySelector<HTMLElement>('[data-part="actions"] button:not([disabled])') ??
          d;
        target.focus();
      }
      const raf = requestAnimationFrame(() => { d.dataset.state = 'open'; });
      return () => cancelAnimationFrame(raf);
    }
    if (d.open) {
      d.dataset.state = 'closed';
      const finish = () => {
        if (d.open) d.close();
        const back = opener.current;
        opener.current = null;
        if (modal && back && back.isConnected) back.focus();
      };
      const ms = exitMs(d);
      if (ms > 0) timer.current = setTimeout(finish, ms);
      else finish();
    }
    return undefined;
  }, [open, modal]);

  useEffect(() => () => clearTimeout(timer.current), []);

  const onCancel = (e: SyntheticEvent<HTMLDialogElement>) => {
    e.preventDefault();
    setOpen(false);
  };
  // The browser can close the dialog itself (a second Escape is not cancelable); keep state in step.
  const onClose = () => {
    if (open) setOpen(false);
  };
  // showModal() makes the page inert, but Tab past the last key still leaves for the browser's own
  // controls. Wrap at both ends so the keyboard stays in the sheet while it is modal.
  const onKeyDown = (e: ReactKeyboardEvent<HTMLDialogElement>) => {
    if (e.key !== 'Tab' || !modal) return;
    const d = el.current;
    if (!d) return;
    const keys = Array.from(d.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'))
      .filter((k) => k.offsetParent !== null || k === document.activeElement);
    if (!keys.length) return;
    const first = keys[0], last = keys[keys.length - 1];
    const at = document.activeElement;
    if (e.shiftKey && (at === first || at === d)) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && at === last) { e.preventDefault(); first.focus(); }
  };
  const onActions = (e: ReactMouseEvent<HTMLDivElement>) => {
    const key = (e.target as HTMLElement).closest('button');
    if (!key || key.disabled || e.defaultPrevented) return;
    setOpen(false);
  };

  const opening =
    trigger && isValidElement(trigger)
      ? cloneElement(trigger, {
          onClick: (e: ReactMouseEvent<HTMLElement>) => {
            trigger.props.onClick?.(e);
            if (!e.defaultPrevented) setOpen(true);
          },
        })
      : null;

  return (
    <>
      {opening}
      <dialog
        ref={el}
        data-component="Dialog"
        data-state="closed"
        aria-labelledby={titleId}
        aria-describedby={description ? descId : undefined}
        tabIndex={-1}
        data-modal={modal ? undefined : 'false'}
        className={cx(styles.root, !modal && styles.inline, className)}
        onCancel={onCancel}
        onClose={onClose}
        onKeyDown={onKeyDown}
        {...rest}
      >
        <Heading level={3} id={titleId} className={styles.title}>{title}</Heading>
        {description ? <Text id={descId} tone="secondary" className={styles.description}>{description}</Text> : null}
        {children ? <div data-part="content" className={styles.content}>{children}</div> : null}
        {actions ? <div data-part="actions" className={styles.actions} onClick={onActions}>{actions}</div> : null}
      </dialog>
    </>
  );
});
