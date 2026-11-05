import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { cx } from '../../cx';
import { messages } from '../../messages';
import { useIsoLayoutEffect } from '../../spring';
import { usePresence } from '../../presence';
import { Icon } from '../Icon';
import { Button } from '../Button';
import { IconButton } from '../IconButton';
import styles from './Popover.module.css';

export type PopoverTrigger = 'icon' | 'word';

export interface PopoverProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children' | 'title'> {
  /** The name of the key and of the panel, such as "About the water filter". It is the accessible name of the round key and the printed word of a word key. */
  label: string;
  /** A heading printed at the top of the panel, on the inset line. Leave it out when the content names itself. */
  title?: string;
  /** The content of the panel: a few lines of text, a field, a key. Keep it short; a long task belongs in a Dialog. */
  children: ReactNode;
  /** `icon` (default) is a round 44px key with an info glyph; `word` is a capsule key with the label and a printed chevron. */
  trigger?: PopoverTrigger;
  /** The glyph on the round key, in place of the info mark. */
  icon?: ReactNode;
  /** Which edge of the key the panel lines up with. It defaults to `start` for the word key and `end` for the round key. */
  align?: 'start' | 'end';
  /** Controlled: whether the panel is open. Pair it with `onOpenChange`. */
  open?: boolean;
  /** Uncontrolled: whether the panel starts open. */
  defaultOpen?: boolean;
  /** Called with the next state when the key, Escape, the close key or a press outside asks to open or close the panel. */
  onOpenChange?: (open: boolean) => void;
  /** The accessible name of the close key. It defaults to the built-in word "Close". */
  closeLabel?: string;
  /** The key cannot be pressed and the panel cannot open. */
  disabled?: boolean;
}

const TABBABLE = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

const px = (v: string, fallback: number) => {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : fallback;
};

/** A key that opens a small plastic panel of printed content (WAI-ARIA non-modal dialog). Focus moves in on open; Escape, the close key or a press outside closes it and returns focus to the key. The panel lives on the body, flips above the key and shifts along it to stay on the screen. */
export const Popover = forwardRef<HTMLButtonElement, PopoverProps>(function Popover(
  { label, title, children, trigger = 'icon', icon, align, open: openProp, defaultOpen = false, onOpenChange, closeLabel, disabled = false, className, ...rest },
  ref,
) {
  const id = useId();
  const panelId = `${id}-panel`;
  const titleId = `${id}-title`;
  const controlled = openProp !== undefined;
  const [inner, setInner] = useState(defaultOpen);
  const open = !disabled && (controlled ? openProp : inner);
  const key = useRef<HTMLButtonElement | null>(null);
  const panel = useRef<HTMLDivElement | null>(null);
  const body = useRef<HTMLDivElement | null>(null);
  // the panel stays on the body while it leaves, so closing moves out instead of vanishing (D-008)
  const presence = usePresence<HTMLDivElement>(open);
  const edge = align ?? (trigger === 'icon' ? 'end' : 'start');

  const setKey = (el: HTMLButtonElement | null) => {
    key.current = el;
    if (typeof ref === 'function') ref(el);
    else if (ref) ref.current = el;
  };

  const change = useCallback((next: boolean) => {
    if (!controlled) setInner(next);
    onOpenChange?.(next);
  }, [controlled, onOpenChange]);
  const close = useCallback((refocus: boolean) => {
    change(false);
    if (refocus) key.current?.focus();
  }, [change]);

  // place the panel under the key, or above it when there is more room there, and keep it on the screen
  const place = useCallback(() => {
    const k = key.current, p = panel.current;
    if (!k || !p) return;
    const t = k.getBoundingClientRect();
    const cs = getComputedStyle(p);
    const margin = px(cs.getPropertyValue('--ds-gap-lg'), 12);
    const gap = px(cs.getPropertyValue('--ds-gap-sm'), 6);
    const vw = document.documentElement.clientWidth, vh = document.documentElement.clientHeight;
    p.style.maxBlockSize = '';
    const r = p.getBoundingClientRect();
    const below = vh - t.bottom - gap - margin, above = t.top - gap - margin;
    const down = r.height <= below || below >= above;
    const room = Math.max(down ? below : above, 0);
    const h = Math.min(r.height, room);
    if (r.height > room) p.style.maxBlockSize = `${room}px`;
    const rtl = getComputedStyle(k).direction === 'rtl';
    const toEnd = (edge === 'end') !== rtl;
    // viewport coordinates: the panel is fixed to the screen, so x runs from the screen's left edge in any direction
    const wide = r.width;
    const x = Math.max(margin, Math.min(toEnd ? t.right - wide : t.left, vw - margin - wide));
    const y = down ? t.bottom + gap : t.top - gap - h;
    p.style.inset = `${Math.round(y)}px auto auto ${Math.round(x)}px`;
    p.dataset.side = down ? 'bottom' : 'top';
  }, [edge]);

  useIsoLayoutEffect(() => {
    if (!open) return;
    const k = key.current, p = panel.current;
    if (!k || !p) return;
    // the panel lives on the body, so it takes the theme and the direction of the place its key is in
    const theme = k.closest('[data-theme]')?.getAttribute('data-theme');
    if (theme) p.setAttribute('data-theme', theme);
    p.setAttribute('dir', getComputedStyle(k).direction);
    place();
    // focus goes to the first thing the content can do, or to the panel itself when it only reads
    const first = body.current?.querySelector<HTMLElement>(TABBABLE);
    (first ?? p).focus({ preventScroll: true });
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const away = (e: PointerEvent) => {
      const n = e.target as Node;
      if (!panel.current?.contains(n) && !key.current?.contains(n)) close(false);
    };
    const move = () => place();
    document.addEventListener('pointerdown', away);
    window.addEventListener('resize', move);
    window.addEventListener('scroll', move, true);
    return () => {
      document.removeEventListener('pointerdown', away);
      window.removeEventListener('resize', move);
      window.removeEventListener('scroll', move, true);
    };
  }, [open, close, place]);

  const onPanelKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); close(true); return; }
    if (e.key !== 'Tab' || !panel.current) return;
    // the panel sits at the end of the page, so Tab past either end of it hands focus back to the key
    const list = Array.from(panel.current.querySelectorAll<HTMLElement>(TABBABLE));
    const at = list.indexOf(document.activeElement as HTMLElement);
    const last = at === list.length - 1 || list.length === 0;
    const firstOne = at <= 0;
    if (e.shiftKey ? firstOne : last) { e.preventDefault(); close(true); }
  };

  // Enter and Space click a native button, so one handler serves the pointer and the keyboard
  const onClick = () => { if (!disabled) change(!open); };

  const keyProps = {
    ref: setKey,
    'aria-haspopup': 'dialog' as const,
    'aria-expanded': open,
    'aria-controls': open ? panelId : undefined,
    disabled,
    onClick,
  };

  const popover = (
    <div
      ref={(el) => { panel.current = el; presence.ref(el); }}
      id={panelId}
      data-state={presence.state}
      // a leaving panel is only a picture of the content: no key reaches it and assistive tech no longer lists it
      inert={presence.state === 'closing' || undefined}
      aria-hidden={presence.state === 'closing' || undefined}
      role="dialog"
      aria-label={title ? undefined : label}
      aria-labelledby={title ? titleId : undefined}
      tabIndex={-1}
      data-component="Popover"
      className={styles.panel}
      onKeyDown={onPanelKey}
    >
      <div className={styles.header}>
        {title ? <p id={titleId} className={styles.title}>{title}</p> : <span />}
        <IconButton label={closeLabel ?? messages.close} className={styles.close} onClick={() => close(true)}>
          <Icon name="close" />
        </IconButton>
      </div>
      <div ref={body} className={styles.body}>{children}</div>
    </div>
  );

  return (
    <span data-component="Popover" className={cx(styles.root, className)} {...rest}>
      {trigger === 'word' ? (
        <Button {...keyProps}>
          {label}
          <Icon name="chevron-down" size="sm" />
        </Button>
      ) : (
        <IconButton {...keyProps} label={label}>{icon ?? <Icon name="info" />}</IconButton>
      )}
      {presence.mounted && typeof document !== 'undefined' ? createPortal(popover, document.body) : null}
    </span>
  );
});
