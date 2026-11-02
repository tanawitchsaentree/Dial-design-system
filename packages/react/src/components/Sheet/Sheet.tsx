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
  type PointerEvent as ReactPointerEvent,
  type ReactElement,
  type ReactNode,
  type SyntheticEvent,
} from 'react';
import { cx } from '../../cx';
import { messages } from '../../messages';
import { Heading } from '../Heading';
import { IconButton } from '../IconButton';
import styles from './Sheet.module.css';

export type SheetPlacement = 'auto' | 'bottom' | 'end';

export interface SheetProps extends Omit<HTMLAttributes<HTMLDialogElement>, 'title' | 'children' | 'open'> {
  /** Whether the sheet is open. Pass it with `onOpenChange` to control the sheet; leave it out to let `trigger` open it. */
  open?: boolean;
  /** The open state on first render when the sheet is not controlled. */
  defaultOpen?: boolean;
  /** Called with `false` when the sheet asks to close (the close key, Escape, a scrim click or a drag down) and with `true` when `trigger` is pressed. */
  onOpenChange?: (open: boolean) => void;
  /** The device the sheet controls, such as "Living room lamp". It is required, because it names the sheet. */
  title: ReactNode;
  /** The model name printed lowercase beside the title, such as "lamp 02". It is never the only name of the sheet. */
  model?: ReactNode;
  /** The device's controls, a Display first and then faders, switches and rows. They act at once, so the sheet needs no Save key. */
  children?: ReactNode;
  /** Optional keys at the bottom, such as "Remove device". At most one `Button kind="primary"`. */
  actions?: ReactNode;
  /** An element, usually a `Button`, that opens the sheet when pressed. Focus returns to it on close. */
  trigger?: ReactElement<{ onClick?: (e: ReactMouseEvent<HTMLElement>) => void }>;
  /** `auto` (default) docks to the bottom edge on a screen taller than it is wide and stands at the lower inline end otherwise. `bottom` always docks; `end` always stands at the end. */
  placement?: SheetPlacement;
  /** `true` (default) opens with `showModal()`, with a scrim, a focus trap and an inert page. `false` shows the sheet in place, for previews. */
  modal?: boolean;
  /** The accessible name of the round close key in the header. Defaults to "Close". */
  closeLabel?: string;
}

/** Longest transition on the element, in ms, so the sheet leaves after its exit motion (0 under reduced motion). */
const exitMs = (el: HTMLElement) => {
  const cs = getComputedStyle(el);
  const list = (v: string) => v.split(',').map((s) => parseFloat(s) * (s.trim().endsWith('ms') ? 1 : 1000) || 0);
  const d = list(cs.transitionDuration);
  const delay = list(cs.transitionDelay);
  return Math.max(0, ...d.map((x, i) => x + (delay[i] ?? 0)));
};

const KEYS = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * A panel that holds every control of one device, on the native modal `<dialog>`. Family of Dialog:
 * Dialog asks one question, Sheet holds controls that act at once, so it closes from its header key,
 * Escape, a click on the scrim or, when docked to the bottom, a drag down on its printed bar.
 */
export const Sheet = forwardRef<HTMLDialogElement, SheetProps>(function Sheet(
  { open: openProp, defaultOpen = false, onOpenChange, title, model, children, actions, trigger, placement = 'auto', modal = true, closeLabel = messages.close, className, ...rest },
  ref,
) {
  const el = useRef<HTMLDialogElement>(null);
  useImperativeHandle(ref, () => el.current as HTMLDialogElement);
  const [inner, setInner] = useState(defaultOpen);
  const controlled = openProp !== undefined;
  const open = controlled ? openProp : inner;
  const opener = useRef<HTMLElement | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const drag = useRef<{ y: number; id: number } | null>(null);
  const id = useId();
  const titleId = `${id}-title`;
  const sheetId = `${id}-sheet`;

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
        else d.setAttribute('open', '');
      }
      // focus the sheet itself, so its name is read first and an arrow key never moves a fader by accident
      if (modal) d.focus();
      const raf = requestAnimationFrame(() => { d.dataset.state = 'open'; });
      return () => cancelAnimationFrame(raf);
    }
    if (d.open) {
      d.dataset.state = 'closed';
      const finish = () => {
        if (d.open) d.close();
        d.style.removeProperty('--sheet-drag');
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

  // Drag down on the printed bar. The close key and Escape are the keyboard's way out.
  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = el.current;
    if (!d || e.button !== 0) return;
    drag.current = { y: e.clientY, id: e.pointerId };
    e.currentTarget.setPointerCapture(e.pointerId);
    d.dataset.dragging = 'true';
  };
  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = el.current;
    if (!d || !drag.current || drag.current.id !== e.pointerId) return;
    d.style.setProperty('--sheet-drag', `${Math.max(0, e.clientY - drag.current.y)}px`);
  };
  const onPointerEnd = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = el.current;
    if (!d || !drag.current || drag.current.id !== e.pointerId) return;
    const dy = Math.max(0, e.clientY - drag.current.y);
    drag.current = null;
    delete d.dataset.dragging;
    if (dy > d.getBoundingClientRect().height / 4) setOpen(false);
    else d.style.removeProperty('--sheet-drag');
  };

  const opening =
    trigger && isValidElement(trigger)
      ? cloneElement(trigger as ReactElement<Record<string, unknown>>, {
          'aria-haspopup': 'dialog',
          'aria-expanded': open,
          'aria-controls': sheetId,
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
        id={sheetId}
        role="dialog"
        data-component="Sheet"
        data-state="closed"
        data-placement={placement}
        aria-labelledby={titleId}
        tabIndex={-1}
        data-modal={modal ? undefined : 'false'}
        className={cx(styles.root, placement === 'bottom' && styles.bottom, placement === 'auto' && styles.auto, !modal && styles.inline, className)}
        onCancel={onCancel}
        onClose={onClose}
        onKeyDown={onKeyDown}
        onClick={onClick}
        {...rest}
      >
        <div data-part="handle" className={styles.handle} aria-hidden="true" onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerEnd} onPointerCancel={onPointerEnd} />
        <div data-part="head" className={styles.head}>
          <Heading level={3} id={titleId} className={styles.title}>{title}</Heading>
          {model ? <span className={styles.model}>{model}</span> : null}
          <IconButton label={closeLabel} onClick={() => setOpen(false)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" focusable="false"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </IconButton>
        </div>
        {children ? <div data-part="content" className={styles.content}>{children}</div> : null}
        {actions ? <div data-part="actions" className={styles.actions}>{actions}</div> : null}
      </dialog>
    </>
  );
});
