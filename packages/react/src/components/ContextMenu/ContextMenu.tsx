'use client';
import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
} from 'react';
import { createPortal } from 'react-dom';
import { cx } from '../../cx';
import { messages } from '../../messages';
import { useIsoLayoutEffect } from '../../spring';
import { usePresence } from '../../presence';
import type { MenuItem } from '../Menu';
// the panel and its rows are Menu's own, so a person learns one popup (lab pick B)
import menu from '../Menu/Menu.module.css';
import styles from './ContextMenu.module.css';

export interface ContextMenuProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  /** The actions, in the order they are printed, in the same shape as Menu's. Put destructive actions last. Every one of them must also be reachable some other way, such as a visible Menu key. */
  items: MenuItem[];
  /** Called with the action's value when it runs, after the panel has closed and focus has gone back. */
  onAction?: (value: string) => void;
  /** The accessible name of the panel, such as "Actions for Kitchen lamp". It defaults to the built-in word "Actions". */
  label?: string;
  /** The menu does not open and the browser's own menu is left alone. */
  disabled?: boolean;
  /** Called when the panel opens or closes. */
  onOpenChange?: (open: boolean) => void;
  /** How long a finger or pen must stay down before the panel opens, in milliseconds. Defaults to 500. */
  pressDelay?: number;
}

const TYPEAHEAD_MS = 500;
const PRESS_MS = 500;
const SLOP = 10; // a finger that moves further than this is scrolling, not pressing
const TWIN_MS = 800; // one gesture can raise both our timer and the browser's contextmenu event

const px = (v: string, fallback: number) => {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : fallback;
};

/** Opens Menu's panel of actions at the point the person pressed: right-click, a 500ms press with a finger, or the Context Menu key and Shift+F10 on the keyboard. Never the only way to an action, so repeat each one on a visible key. */
export const ContextMenu = forwardRef<HTMLDivElement, ContextMenuProps>(function ContextMenu(
  { items, onAction, label = messages.contextMenu.label, disabled = false, onOpenChange, pressDelay = PRESS_MS, className, children, ...rest },
  ref,
) {
  const id = useId();
  const menuId = `${id}-menu`;
  const [open, setOpen] = useState(false);
  const [by, setBy] = useState<'key' | 'pointer'>('pointer');
  const point = useRef({ x: 0, y: 0 });
  const root = useRef<HTMLDivElement | null>(null);
  const panel = useRef<HTMLDivElement | null>(null);
  const opener = useRef<HTMLElement | null>(null);
  const openedAt = useRef(0);
  const press = useRef<{ timer: ReturnType<typeof setTimeout>; x: number; y: number; id: number } | null>(null);
  const pressed = useRef(false);
  const typed = useRef('');
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  // the panel stays on the body while it leaves, so closing moves out instead of vanishing (D-008)
  const presence = usePresence<HTMLDivElement>(open);
  const column = items.some((i) => i.icon != null || i.destructive);

  const setRoot = (el: HTMLDivElement | null) => {
    root.current = el;
    if (typeof ref === 'function') ref(el);
    else if (ref) ref.current = el;
  };

  const rows = (): HTMLElement[] => (panel.current ? Array.from(panel.current.querySelectorAll<HTMLElement>('[role="menuitem"]')) : []);

  const show = (x: number, y: number, how: 'key' | 'pointer') => {
    if (disabled || !items.length) return;
    const a = document.activeElement as HTMLElement | null;
    opener.current = a && a !== document.body ? a : null;
    point.current = { x, y };
    openedAt.current = Date.now();
    setBy(how);
    setOpen(true);
  };
  const close = useCallback((refocus: boolean) => {
    setOpen(false);
    typed.current = '';
    const o = opener.current;
    if (refocus && o && o.isConnected) o.focus({ preventScroll: true });
  }, []);

  useEffect(() => { onOpenChange?.(open); }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  // put the panel's corner on the point (its far corner in right-to-left), flip above it when there is more
  // room there, and keep the whole panel on the screen
  const place = useCallback(() => {
    const p = panel.current;
    if (!p) return;
    const cs = getComputedStyle(p);
    const margin = px(cs.getPropertyValue('--ds-gap-lg'), 12);
    const vw = document.documentElement.clientWidth, vh = document.documentElement.clientHeight;
    p.style.maxBlockSize = '';
    const r = p.getBoundingClientRect();
    const { x: px0, y: py0 } = point.current;
    const below = vh - py0 - margin, above = py0 - margin;
    const down = r.height <= below || below >= above;
    const room = Math.max(down ? below : above, 0);
    const h = Math.min(r.height, room);
    if (r.height > room) p.style.maxBlockSize = `${room}px`;
    const rtl = (root.current ? getComputedStyle(root.current).direction : 'ltr') === 'rtl';
    const wide = r.width;
    const x = Math.max(margin, Math.min(rtl ? px0 - wide : px0, vw - margin - wide));
    const y = down ? py0 : py0 - h;
    p.style.inset = `${Math.round(y)}px auto auto ${Math.round(x)}px`;
    p.dataset.side = down ? 'bottom' : 'top';
  }, []);

  useIsoLayoutEffect(() => {
    if (!open) return;
    const r = root.current, p = panel.current;
    if (!r || !p) return;
    // the panel lives on the body, so it takes the theme and the direction of the place its object is in
    const theme = r.closest('[data-theme]')?.getAttribute('data-theme');
    if (theme) p.setAttribute('data-theme', theme);
    p.setAttribute('dir', getComputedStyle(r).direction);
    place();
    // keyboard: first action. pointer: the panel itself, so no row looks chosen and Enter does nothing until an arrow moves
    const list = rows().filter((n) => n.getAttribute('aria-disabled') !== 'true');
    (by === 'key' ? list[0] ?? rows()[0] : p).focus({ preventScroll: true });
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const away = (e: Event) => {
      if (!panel.current?.contains(e.target as Node)) close(false);
    };
    // a point on the screen does not follow a scrolling page, so scrolling elsewhere closes it, as the browser's own menu does
    const scrolled = (e: Event) => { if (!panel.current?.contains(e.target as Node)) close(false); };
    const resized = () => close(false);
    document.addEventListener('pointerdown', away);
    document.addEventListener('contextmenu', away, true);
    window.addEventListener('resize', resized);
    window.addEventListener('scroll', scrolled, true);
    return () => {
      document.removeEventListener('pointerdown', away);
      document.removeEventListener('contextmenu', away, true);
      window.removeEventListener('resize', resized);
      window.removeEventListener('scroll', scrolled, true);
    };
  }, [open, close]);

  useEffect(() => { if (disabled) setOpen(false); }, [disabled]);
  useEffect(() => () => { clearTimeout(timer.current); if (press.current) clearTimeout(press.current.timer); }, []);

  const run = (i: number) => {
    const item = items[i];
    if (!item || item.disabled) return;
    close(true);
    onAction?.(item.value);
  };

  // --- opening: right-click, long press, Context Menu key / Shift+F10
  const onContextMenu = (e: MouseEvent<HTMLDivElement>) => {
    rest.onContextMenu?.(e);
    if (disabled || e.defaultPrevented) return;
    e.preventDefault();
    // the long press and the key have opened it already; the contextmenu event that follows is the same gesture
    if (Date.now() - openedAt.current < TWIN_MS) return;
    show(e.clientX, e.clientY, 'pointer');
  };
  const cancelPress = () => {
    if (press.current) { clearTimeout(press.current.timer); press.current = null; }
  };
  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    rest.onPointerDown?.(e);
    if (disabled || e.pointerType === 'mouse' || !e.isPrimary) return;
    cancelPress();
    pressed.current = false;
    const { clientX: x, clientY: y, pointerId } = e;
    press.current = {
      x, y, id: pointerId,
      timer: setTimeout(() => {
        press.current = null;
        pressed.current = true;
        show(x, y, 'pointer');
      }, pressDelay),
    };
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    rest.onPointerMove?.(e);
    const s = press.current;
    if (s && e.pointerId === s.id && Math.hypot(e.clientX - s.x, e.clientY - s.y) > SLOP) cancelPress();
  };
  const onPointerEnd = (e: PointerEvent<HTMLDivElement>) => {
    (e.type === 'pointerup' ? rest.onPointerUp : rest.onPointerCancel)?.(e as never);
    cancelPress();
  };
  // the press that opened the panel must not also activate what is under the finger
  const onClickCapture = (e: MouseEvent<HTMLDivElement>) => {
    rest.onClickCapture?.(e);
    if (pressed.current) { pressed.current = false; e.preventDefault(); e.stopPropagation(); }
  };
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    rest.onKeyDown?.(e);
    if (disabled || e.defaultPrevented) return;
    if (e.key === 'ContextMenu' || (e.key === 'F10' && e.shiftKey)) {
      e.preventDefault();
      const at = (e.target as HTMLElement).getBoundingClientRect();
      show(at.left + at.width / 2, at.top + at.height / 2, 'key');
    }
  };

  // --- the panel (same keys as Menu)
  const onPanelKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const all = rows();
    const at = all.indexOf(document.activeElement as HTMLElement);
    const go = (i: number) => all[(i + all.length) % all.length]?.focus();
    const k = e.key;
    if (k === 'ArrowDown') { e.preventDefault(); go(at + 1); }
    else if (k === 'ArrowUp') { e.preventDefault(); go(at < 0 ? all.length - 1 : at - 1); }
    else if (k === 'Home' || k === 'PageUp') { e.preventDefault(); go(0); }
    else if (k === 'End' || k === 'PageDown') { e.preventDefault(); go(all.length - 1); }
    else if (k === 'Escape') { e.preventDefault(); close(true); }
    else if (k === 'Tab') { close(true); }
    else if (k === 'Enter' || k === ' ') { e.preventDefault(); if (at >= 0) run(at); }
    else if (k.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault();
      clearTimeout(timer.current);
      typed.current += k.toLocaleLowerCase();
      timer.current = setTimeout(() => { typed.current = ''; }, TYPEAHEAD_MS);
      const q = typed.current;
      const order = all.map((_, n) => (at + 1 + n) % all.length);
      const starts = (i: number, s: string) => items[i]?.label.toLocaleLowerCase().startsWith(s);
      let hit = order.find((i) => starts(i, q));
      if (hit === undefined && [...q].every((c) => c === q[0])) hit = order.find((i) => starts(i, q[0]));
      if (hit !== undefined) go(hit);
    }
  };

  const panelEl = (
    <div
      ref={(el) => { panel.current = el; presence.ref(el); }}
      id={menuId}
      data-component="ContextMenuPanel"
      data-state={presence.state}
      // a leaving panel is only a picture of the menu: no key reaches it and assistive tech no longer lists it
      inert={presence.state === 'closing' || undefined}
      aria-hidden={presence.state === 'closing' || undefined}
      role="menu"
      aria-label={label}
      tabIndex={-1}
      className={menu.panel}
      onKeyDown={onPanelKey}
      onContextMenu={(e) => e.preventDefault()}
    >
      {items.map((item, i) => (
        <div
          key={item.value}
          role="menuitem"
          tabIndex={-1}
          aria-disabled={item.disabled || undefined}
          data-destructive={item.destructive ? '' : undefined}
          className={cx(menu.item, item.destructive && menu.destructive)}
          onPointerMove={(e) => { if (document.activeElement !== e.currentTarget) e.currentTarget.focus({ preventScroll: true }); }}
          onClick={() => run(i)}
        >
          {column && (
            item.destructive ? (
              <svg className={menu.lamp} viewBox="0 0 16 16" aria-hidden="true" focusable="false"><rect x="3" y="3" width="10" height="10" /></svg>
            ) : (
              <span className={menu.icon} aria-hidden="true">{item.icon}</span>
            )
          )}
          <span className={menu.text}>{item.label}</span>
        </div>
      ))}
    </div>
  );

  return (
    <>
      <div
        {...rest}
        ref={setRoot}
        data-component="ContextMenu"
        data-open={open ? '' : undefined}
        className={cx(styles.root, className)}
        onContextMenu={onContextMenu}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerEnd}
        onPointerCancel={onPointerEnd}
        onClickCapture={onClickCapture}
        onKeyDown={onKeyDown}
      >
        {children}
      </div>
      {presence.mounted && typeof document !== 'undefined' ? createPortal(panelEl, document.body) : null}
    </>
  );
});
