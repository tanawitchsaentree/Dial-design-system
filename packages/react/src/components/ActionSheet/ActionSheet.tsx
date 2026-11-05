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
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type ReactElement,
  type ReactNode,
  type SyntheticEvent,
} from 'react';
import { cx } from '../../cx';
import { messages } from '../../messages';
import { useIsoLayoutEffect } from '../../spring';
import { Button } from '../Button';
import styles from './ActionSheet.module.css';

export type ActionSheetPlacement = 'auto' | 'bottom' | 'anchored';

/** One action in the sheet. */
export interface ActionSheetItem {
  /** The value passed to `onAction` when this action runs. */
  value: string;
  /** The words printed for the action, a verb first, such as "Move to room". */
  label: string;
  /** A glyph printed before the words. It is printing only and hidden from assistive tech. */
  icon?: ReactNode;
  /** The action removes something for good. It is printed last after a gap, with the critical lamp before its words. */
  destructive?: boolean;
  /** The action cannot run now. It keeps its place, fades to half and does nothing when pressed. */
  disabled?: boolean;
}

export interface ActionSheetProps extends Omit<HTMLAttributes<HTMLDialogElement>, 'title' | 'children' | 'open'> {
  /** Whether the sheet is open. Pass it with `onOpenChange` to control it; leave it out to let `trigger` open it. */
  open?: boolean;
  /** The open state on first render when the sheet is not controlled. */
  defaultOpen?: boolean;
  /** Called with `false` when the sheet asks to close (Cancel, Escape, a click outside or an action) and with `true` when `trigger` is pressed. */
  onOpenChange?: (open: boolean) => void;
  /** The object the actions are for, such as "Kitchen lamp". It is required, because it names the sheet. */
  title: ReactNode;
  /** One quiet line under the name, such as "lamp 02 · Kitchen". */
  detail?: ReactNode;
  /** The actions, three to six, in the order they are printed. Put destructive actions last. */
  items: ActionSheetItem[];
  /** Called with the action's value once the sheet has closed and focus is back on the opener. */
  onAction?: (value: string) => void;
  /** An element, usually a `Menu`-like round key or a `Button`, that opens the sheet. The anchored panel stands by it and focus returns to it. */
  trigger?: ReactElement<{ onClick?: (e: ReactMouseEvent<HTMLElement>) => void }>;
  /** `auto` (default) docks to the bottom edge on a screen taller than it is wide and stands by the trigger otherwise. `bottom` always docks; `anchored` always stands by the trigger. */
  placement?: ActionSheetPlacement;
  /** `true` (default) opens with `showModal()`. `false` shows the docked lid in place, for previews. */
  modal?: boolean;
  /** The word on the Cancel key. Defaults to "Cancel". */
  cancelLabel?: string;
}

const exitMs = (el: HTMLElement) => {
  const cs = getComputedStyle(el);
  const list = (v: string) => v.split(',').map((s) => parseFloat(s) * (s.trim().endsWith('ms') ? 1 : 1000) || 0);
  const d = list(cs.transitionDuration);
  const delay = list(cs.transitionDelay);
  return Math.max(0, ...d.map((x, i) => x + (delay[i] ?? 0)));
};
const px = (v: string, fallback: number) => {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : fallback;
};
const tall = () => typeof window !== 'undefined' && window.matchMedia?.('(orientation: portrait)').matches;

/**
 * A few actions for one object, on the native modal `<dialog>`. On a phone it rises from the bottom edge
 * with Menu's printed rows and a separate Cancel key; on a wide screen it stands by its trigger like Menu's
 * panel, flipped or shifted so the screen edge never cuts it. Escape, Cancel and a click outside close it,
 * and focus returns to the opener.
 */
export const ActionSheet = forwardRef<HTMLDialogElement, ActionSheetProps>(function ActionSheet(
  { open: openProp, defaultOpen = false, onOpenChange, title, detail, items, onAction, trigger, placement = 'auto', modal = true, cancelLabel = messages.cancel, className, ...rest },
  ref,
) {
  const el = useRef<HTMLDialogElement>(null);
  useImperativeHandle(ref, () => el.current as HTMLDialogElement);
  const [inner, setInner] = useState(defaultOpen);
  const controlled = openProp !== undefined;
  const open = controlled ? openProp : inner;
  const opener = useRef<HTMLElement | null>(null);
  const pending = useRef<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [side, setSide] = useState<'bottom' | 'anchored'>(placement === 'anchored' ? 'anchored' : 'bottom');
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

  const rows = () => (el.current ? Array.from(el.current.querySelectorAll<HTMLElement>('[data-part="item"], [data-part="cancel"] button')).filter((r) => r.offsetParent !== null) : []);

  // stand by the opener: under it, or above it when there is more room there, shifted to stay on the screen
  const place = useCallback(() => {
    const d = el.current, a = opener.current;
    if (!d || !a || side !== 'anchored' || !modal) return;
    const t = a.getBoundingClientRect();
    const cs = getComputedStyle(d);
    const margin = px(cs.getPropertyValue('--ds-gap-lg'), 12);
    const gap = px(cs.getPropertyValue('--ds-gap-sm'), 6);
    const vw = document.documentElement.clientWidth, vh = document.documentElement.clientHeight;
    d.style.maxBlockSize = '';
    d.style.inset = `0px auto auto 0px`;
    const r = d.getBoundingClientRect();
    const below = vh - t.bottom - gap - margin, above = t.top - gap - margin;
    const down = r.height <= below || below >= above;
    const room = Math.max(down ? below : above, 0);
    const h = Math.min(r.height, room);
    if (r.height > room) d.style.maxBlockSize = `${room}px`;
    const rtl = getComputedStyle(a).direction === 'rtl';
    // viewport x runs from the screen's left edge in any direction; line the panel up with the key's end
    const keyEnd = rtl ? t.x : t.x + t.width - r.width;
    const x = Math.max(margin, Math.min(keyEnd, vw - margin - r.width));
    const y = down ? t.bottom + gap : t.top - gap - h;
    d.style.inset = `${Math.round(y)}px auto auto ${Math.round(x)}px`;
    d.dataset.side = down ? 'bottom' : 'top';
  }, [side, modal]);

  useIsoLayoutEffect(() => {
    const d = el.current;
    if (!d) return undefined;
    clearTimeout(timer.current);
    if (open) {
      if (!d.open) {
        opener.current = (trigger ? document.getElementById(`${sheetId}-opener`) : null) ?? (document.activeElement as HTMLElement | null);
        const next = placement === 'auto' ? (tall() || !opener.current ? 'bottom' : 'anchored') : placement === 'anchored' && opener.current ? 'anchored' : 'bottom';
        if (next !== side) { setSide(next); return undefined; }
        if (modal) d.showModal();
        else d.setAttribute('open', '');
      }
      place();
      if (modal) {
        const first = rows().find((r) => r.getAttribute('aria-disabled') !== 'true');
        (first ?? d).focus({ preventScroll: true });
      }
      const raf = requestAnimationFrame(() => { d.dataset.state = 'open'; });
      return () => cancelAnimationFrame(raf);
    }
    if (d.open) {
      d.dataset.state = 'closed';
      const finish = () => {
        if (d.open) d.close();
        d.style.removeProperty('inset');
        d.style.removeProperty('max-block-size');
        const back = opener.current;
        opener.current = null;
        if (modal && back && back.isConnected) back.focus();
        const v = pending.current;
        pending.current = null;
        if (v !== null) onAction?.(v);
      };
      const ms = exitMs(d);
      if (ms > 0) timer.current = setTimeout(finish, ms);
      else finish();
    }
    return undefined;
  }, [open, modal, side]);

  useEffect(() => {
    if (!open || side !== 'anchored') return undefined;
    const move = () => place();
    window.addEventListener('resize', move);
    window.addEventListener('scroll', move, true);
    return () => { window.removeEventListener('resize', move); window.removeEventListener('scroll', move, true); };
  }, [open, side, place]);
  useEffect(() => () => clearTimeout(timer.current), []);

  const run = (item: ActionSheetItem) => {
    if (item.disabled) return;
    pending.current = item.value;
    setOpen(false);
  };

  const onCancel = (e: SyntheticEvent<HTMLDialogElement>) => { e.preventDefault(); setOpen(false); };
  const onClose = () => { if (open) setOpen(false); };
  const onKeyDown = (e: ReactKeyboardEvent<HTMLDialogElement>) => {
    const all = rows();
    if (!all.length) return;
    const at = all.indexOf(document.activeElement as HTMLElement);
    const go = (i: number) => all[(i + all.length) % all.length]?.focus();
    if (e.key === 'ArrowDown') { e.preventDefault(); go(at + 1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); go(at < 0 ? all.length - 1 : at - 1); }
    else if (e.key === 'Home') { e.preventDefault(); go(0); }
    else if (e.key === 'End') { e.preventDefault(); go(all.length - 1); }
    else if (e.key === 'Tab' && modal) {
      const first = all[0], last = all[all.length - 1];
      const now = document.activeElement;
      if (e.shiftKey && (now === first || now === el.current)) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && now === last) { e.preventDefault(); first.focus(); }
    }
  };
  // a click on the dialog element outside its box is a click on the scrim (or, anchored, anywhere away from the panel)
  const onClick = (e: ReactMouseEvent<HTMLDialogElement>) => {
    const d = el.current;
    if (!modal || !d || e.target !== d) return;
    const r = d.getBoundingClientRect();
    if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) setOpen(false);
  };

  const opening =
    trigger && isValidElement(trigger)
      ? cloneElement(trigger as ReactElement<Record<string, unknown>>, {
          id: `${sheetId}-opener`,
          'aria-haspopup': 'dialog',
          'aria-expanded': open,
          'aria-controls': sheetId,
          onClick: (e: ReactMouseEvent<HTMLElement>) => {
            trigger.props.onClick?.(e);
            if (!e.defaultPrevented) setOpen(true);
          },
        })
      : null;

  const column = items.some((i) => i.icon != null || i.destructive);

  return (
    <>
      {opening}
      <dialog
        ref={el}
        id={sheetId}
        role="dialog"
        data-component="ActionSheet"
        data-state="closed"
        data-placement={side}
        aria-labelledby={titleId}
        tabIndex={-1}
        data-modal={modal ? undefined : 'false'}
        className={cx(styles.root, side === 'anchored' && modal ? styles.anchored : styles.bottom, !modal && styles.inline, className)}
        onCancel={onCancel}
        onClose={onClose}
        onKeyDown={onKeyDown}
        onClick={onClick}
        {...rest}
      >
        <div data-part="head" className={styles.head}>
          <h3 id={titleId} className={styles.title}>{title}</h3>
          {detail ? <p className={styles.detail}>{detail}</p> : null}
        </div>
        <div data-part="rows" className={styles.rows}>
          {items.map((item) => (
            <button
              key={item.value}
              type="button"
              data-part="item"
              data-value={item.value}
              aria-disabled={item.disabled || undefined}
              data-destructive={item.destructive ? '' : undefined}
              className={cx(styles.item, item.destructive && styles.destructive)}
              onPointerMove={(e) => { if (document.activeElement !== e.currentTarget) e.currentTarget.focus({ preventScroll: true }); }}
              onClick={() => run(item)}
            >
              {column &&
                (item.destructive ? (
                  <svg className={styles.lamp} viewBox="0 0 16 16" aria-hidden="true" focusable="false"><rect x="3" y="3" width="10" height="10" /></svg>
                ) : (
                  <span className={styles.icon} aria-hidden="true">{item.icon}</span>
                ))}
              <span className={styles.text}>{item.label}</span>
            </button>
          ))}
        </div>
        <div data-part="cancel" className={styles.cancel}>
          <Button onClick={() => setOpen(false)}>{cancelLabel}</Button>
        </div>
      </dialog>
    </>
  );
});
