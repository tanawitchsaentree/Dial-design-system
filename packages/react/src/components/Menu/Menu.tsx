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
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { cx } from '../../cx';
import { useIsoLayoutEffect } from '../../spring';
import { usePresence } from '../../presence';
import { Icon } from '../Icon';
import { Button } from '../Button';
import { IconButton } from '../IconButton';
import styles from './Menu.module.css';

export type MenuTrigger = 'icon' | 'word';

/** One action in the menu. */
export interface MenuItem {
  /** The value passed to `onAction` when this action runs. */
  value: string;
  /** The words printed for the action, a verb first: "Rename", "Move to room". Type-ahead matches them. */
  label: string;
  /** A glyph printed before the words. It is printing only and hidden from assistive tech. */
  icon?: ReactNode;
  /** The action removes or ends something for good. It is printed last after a gap, with the critical lamp before its words. */
  destructive?: boolean;
  /** The action cannot run now. It stays in its place, fades to half and does nothing when pressed. */
  disabled?: boolean;
}

export interface MenuProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children' | 'onSelect'> {
  /** The name of the key, such as "More for Kitchen lamp". It is the accessible name of the round key, and the printed word of a word key. */
  label: string;
  /** The actions, in the order they are printed. Put destructive actions last. */
  items: MenuItem[];
  /** Called with the action's value when it runs, after the menu has closed and focus is back on the key. */
  onAction?: (value: string) => void;
  /** `icon` (default) is a round 44px key with three dots; `word` is a capsule key with the label and a printed chevron. */
  trigger?: MenuTrigger;
  /** The glyph on the round key, in place of the three dots. */
  icon?: ReactNode;
  /** Which edge of the key the panel lines up with. It defaults to `end` for the round key and `start` for the word key. */
  align?: 'start' | 'end';
  /** The key cannot be pressed and the menu cannot open. */
  disabled?: boolean;
}

const TYPEAHEAD_MS = 500;

// dial's one icon language, the dot matrix (R-005)
const dots = <Icon name="more" />;

const px = (v: string, fallback: number) => {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : fallback;
};

/** A key that opens a plastic panel of actions (WAI-ARIA menu button). The panel is never cut: it lives on the body, flips above the key and shifts along it to stay on the screen. */
export const Menu = forwardRef<HTMLButtonElement, MenuProps>(function Menu(
  { label, items, onAction, trigger = 'icon', icon, align, disabled = false, className, ...rest },
  ref,
) {
  const id = useId();
  const menuId = `${id}-menu`;
  const [open, setOpen] = useState(false);
  const [start, setStart] = useState<'first' | 'last'>('first');
  const key = useRef<HTMLButtonElement | null>(null);
  const panel = useRef<HTMLDivElement | null>(null);
  // the panel stays on the body while it leaves, so closing moves out instead of vanishing (D-008)
  const presence = usePresence<HTMLDivElement>(open);
  const typed = useRef('');
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const edge = align ?? (trigger === 'icon' ? 'end' : 'start');
  const column = items.some((i) => i.icon != null || i.destructive);

  const setKey = (el: HTMLButtonElement | null) => {
    key.current = el;
    if (typeof ref === 'function') ref(el);
    else if (ref) ref.current = el;
  };

  const rows = (): HTMLElement[] => (panel.current ? Array.from(panel.current.querySelectorAll<HTMLElement>('[role="menuitem"]')) : []);

  const show = (at: 'first' | 'last') => {
    if (disabled || !items.length) return;
    setStart(at);
    setOpen(true);
  };
  const close = useCallback((refocus: boolean) => {
    setOpen(false);
    typed.current = '';
    if (refocus) key.current?.focus();
  }, []);

  // place the panel under the key, or above it when there is more room there, and keep it on the screen
  const place = useCallback(() => {
    const k = key.current, p = panel.current;
    if (!k || !p) return;
    const t = k.getBoundingClientRect();
    const cs = getComputedStyle(p);
    const margin = px(cs.getPropertyValue('--ds-gap-lg'), 12);
    const gap = px(cs.getPropertyValue('--ds-gap-sm'), 6);
    const vw = document.documentElement.clientWidth, vh = document.documentElement.clientHeight;
    p.style.setProperty('--menu-key', `${t.width}px`);
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
    const list = rows().filter((r) => r.getAttribute('aria-disabled') !== 'true');
    const target = (start === 'last' ? list[list.length - 1] : list[0]) ?? rows()[0];
    target?.focus({ preventScroll: true });
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

  useEffect(() => { if (disabled) setOpen(false); }, [disabled]);
  useEffect(() => () => clearTimeout(timer.current), []);

  const run = (i: number) => {
    const item = items[i];
    if (!item || item.disabled) return;
    close(true);
    onAction?.(item.value);
  };

  const onKeyKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') { e.preventDefault(); if (open) close(true); else show('first'); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); show('last'); }
  };
  // Space on a native button clicks on key up; the keydown above already opened the menu
  const onKeyUp = (e: KeyboardEvent<HTMLButtonElement>) => { if (e.key === ' ') e.preventDefault(); };
  const onClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (e.detail === 0) return;
    if (open) close(false); else show('first');
  };

  const onPanelKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const all = rows();
    const at = all.indexOf(document.activeElement as HTMLElement);
    const go = (i: number) => all[(i + all.length) % all.length]?.focus();
    const k = e.key;
    if (k === 'ArrowDown') { e.preventDefault(); go(at + 1); }
    else if (k === 'ArrowUp') { e.preventDefault(); go(at - 1); }
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

  const keyProps = {
    ref: setKey,
    'aria-haspopup': 'menu' as const,
    'aria-expanded': open,
    'aria-controls': open ? menuId : undefined,
    disabled,
    onKeyDown: onKeyKey,
    onKeyUp,
    onClick,
  };

  const menu = (
    <div
      ref={(el) => { panel.current = el; presence.ref(el); }}
      id={menuId}
      data-state={presence.state}
      // a leaving panel is only a picture of the menu: no key reaches it and assistive tech no longer lists it
      inert={presence.state === 'closing' || undefined}
      aria-hidden={presence.state === 'closing' || undefined}
      role="menu"
      aria-label={label}
      data-component="Menu"
      className={styles.panel}
      onKeyDown={onPanelKey}
    >
      {items.map((item, i) => (
        <div
          key={item.value}
          role="menuitem"
          tabIndex={-1}
          aria-disabled={item.disabled || undefined}
          data-destructive={item.destructive ? '' : undefined}
          className={cx(styles.item, item.destructive && styles.destructive)}
          onPointerMove={(e) => { if (document.activeElement !== e.currentTarget) e.currentTarget.focus({ preventScroll: true }); }}
          onClick={() => run(i)}
        >
          {column && (
            item.destructive ? (
              <svg className={styles.lamp} viewBox="0 0 16 16" aria-hidden="true" focusable="false"><rect x="3" y="3" width="10" height="10" /></svg>
            ) : (
              <span className={styles.icon} aria-hidden="true">{item.icon}</span>
            )
          )}
          <span className={styles.text}>{item.label}</span>
        </div>
      ))}
    </div>
  );

  return (
    <span data-component="Menu" className={cx(styles.root, className)} {...rest}>
      {trigger === 'word' ? (
        <Button {...keyProps}>
          {label}
          <Icon name="chevron-down" size="sm" className={styles.chevron} />
        </Button>
      ) : (
        <IconButton {...keyProps} label={label}>{icon ?? dots}</IconButton>
      )}
      {presence.mounted && typeof document !== 'undefined' ? createPortal(menu, document.body) : null}
    </span>
  );
});
