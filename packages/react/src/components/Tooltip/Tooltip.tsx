import {
  cloneElement,
  forwardRef,
  isValidElement,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent,
  type HTMLAttributes,
  type MouseEvent,
  type PointerEvent,
  type ReactElement,
  type ReactNode,
  type Ref,
} from 'react';
import { createPortal } from 'react-dom';
import { cx } from '../../cx';
import { useIsoLayoutEffect } from '../../spring';
import { usePresence } from '../../presence';
import styles from './Tooltip.module.css';

export type TooltipSide = 'top' | 'bottom';

export interface TooltipProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'content'> {
  /** The printed name of the part: a few words, no sentence. A string that equals the part's own aria-label is not announced twice. */
  content: ReactNode;
  /** The part being named, one element that can take a ref and focus (a key, a link, a field). A disabled button gets no events, so wrap it in a span. */
  children: ReactElement;
  /** Which side of the part the tag stands on. It flips to the other side when there is no room. Default `top`. */
  side?: TooltipSide;
  /** Milliseconds the pointer rests on the part before the tag shows. Keyboard focus shows it at once. Default 400. */
  delay?: number;
  /** The tag never shows. */
  disabled?: boolean;
  /** Class name for the tag. */
  className?: string;
  /** Inline style for the tag. */
  style?: CSSProperties;
}

// how long the pointer may take to cross the gap onto the tag, how long a finger rests before it opens it,
// and how long a tag opened by touch stays after the finger lifts
const GRACE_MS = 120;
const HOLD_MS = 500;
const LINGER_MS = 2000;
const SHOW_MS = 400;

const px = (v: string, fallback: number) => {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : fallback;
};

function join(a: Ref<HTMLElement> | undefined, node: HTMLElement | null) {
  if (typeof a === 'function') a(node);
  else if (a) (a as { current: HTMLElement | null }).current = node;
}

/** The printed name of a part, in a small plastic tag. It shows on hover, on keyboard focus and when a finger rests on the part; Escape closes it, and the pointer may move onto the tag without losing it. The tag lives on the body, so no frame cuts it. */
export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(function Tooltip(
  { content, children, side = 'top', delay = SHOW_MS, disabled = false, className, style, ...rest },
  ref,
) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLElement | null>(null);
  const tip = useRef<HTMLDivElement | null>(null);
  const show = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const hide = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const hold = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const byTouch = useRef(false);
  // the tag stays on the body while it leaves, so closing moves out instead of vanishing (D-008)
  const presence = usePresence<HTMLDivElement>(open);
  const empty = content == null || content === false || content === '';

  const clear = () => { clearTimeout(show.current); clearTimeout(hide.current); };
  const openNow = () => { clear(); if (!disabled && !empty) setOpen(true); };
  const openSoon = () => {
    clear();
    if (disabled || empty) return;
    if (open) return;
    show.current = setTimeout(() => setOpen(true), delay);
  };
  const closeNow = useCallback(() => {
    clearTimeout(show.current); clearTimeout(hide.current); clearTimeout(hold.current);
    setOpen(false);
  }, []);
  const closeSoon = (ms = GRACE_MS) => {
    clearTimeout(show.current); clearTimeout(hide.current);
    hide.current = setTimeout(() => setOpen(false), ms);
  };

  // stand above the part, or below it when there is more room there, and keep the tag on the screen
  const place = useCallback(() => {
    const k = trigger.current, p = tip.current;
    if (!k || !p) return;
    const t = k.getBoundingClientRect();
    const cs = getComputedStyle(p);
    const margin = px(cs.getPropertyValue('--ds-gap-lg'), 12);
    const gap = px(cs.getPropertyValue('--ds-gap-sm'), 6);
    const vw = document.documentElement.clientWidth, vh = document.documentElement.clientHeight;
    const r = p.getBoundingClientRect();
    const above = t.top - gap - margin, below = vh - t.bottom - gap - margin;
    const up = side === 'top' ? (r.height <= above || above >= below) : !(r.height <= below || below >= above);
    // viewport coordinates: the tag is fixed to the screen, so x runs from the screen's left edge in any direction
    const x = Math.max(margin, Math.min(t.left + (t.width - r.width) / 2, vw - margin - r.width));
    const y = t.bottom + gap;
    const yUp = t.top - gap - r.height;
    p.style.inset = `${Math.round(up ? yUp : y)}px auto auto ${Math.round(x)}px`;
    p.dataset.side = up ? 'top' : 'bottom';
  }, [side]);

  useIsoLayoutEffect(() => {
    if (!presence.mounted) return;
    const k = trigger.current, p = tip.current;
    if (!k || !p) return;
    // the tag lives on the body, so it takes the theme and the direction of the place its part is in
    const theme = k.closest('[data-theme]')?.getAttribute('data-theme');
    if (theme) p.setAttribute('data-theme', theme);
    p.setAttribute('dir', getComputedStyle(k).direction);
    place();
  }, [presence.mounted, content]);

  useEffect(() => {
    if (!open) return;
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') closeNow(); };
    const away = (e: globalThis.PointerEvent) => {
      const n = e.target as Node;
      if (!tip.current?.contains(n) && !trigger.current?.contains(n)) closeNow();
    };
    const move = () => place();
    document.addEventListener('keydown', key);
    document.addEventListener('pointerdown', away);
    window.addEventListener('resize', move);
    window.addEventListener('scroll', move, true);
    return () => {
      document.removeEventListener('keydown', key);
      document.removeEventListener('pointerdown', away);
      window.removeEventListener('resize', move);
      window.removeEventListener('scroll', move, true);
    };
  }, [open, closeNow, place]);

  useEffect(() => { if (disabled) closeNow(); }, [disabled, closeNow]);
  useEffect(() => () => { clearTimeout(show.current); clearTimeout(hide.current); clearTimeout(hold.current); }, []);

  if (!isValidElement(children)) return <>{children}</>;
  const child = children as ReactElement<Record<string, unknown> & { ref?: Ref<HTMLElement> }>;
  const own = child.props;
  const call = <E,>(fn: unknown, e: E) => { if (typeof fn === 'function') (fn as (ev: E) => void)(e); };

  const ownLabel = typeof own['aria-label'] === 'string' ? (own['aria-label'] as string) : undefined;
  const duplicate = typeof content === 'string' && ownLabel === content;
  const describedBy = [own['aria-describedby'] as string | undefined, open && !duplicate ? id : undefined].filter(Boolean).join(' ') || undefined;

  const handlers = {
    'aria-describedby': describedBy,
    onPointerEnter: (e: PointerEvent<HTMLElement>) => { call(own.onPointerEnter, e); if (e.pointerType !== 'touch') openSoon(); },
    onPointerLeave: (e: PointerEvent<HTMLElement>) => { call(own.onPointerLeave, e); if (e.pointerType !== 'touch') closeSoon(); },
    onPointerDown: (e: PointerEvent<HTMLElement>) => {
      call(own.onPointerDown, e);
      if (e.pointerType === 'touch') {
        byTouch.current = false;
        clearTimeout(hold.current);
        hold.current = setTimeout(() => { byTouch.current = true; openNow(); }, HOLD_MS);
      } else closeNow();
    },
    onPointerUp: (e: PointerEvent<HTMLElement>) => {
      call(own.onPointerUp, e);
      if (e.pointerType !== 'touch') return;
      clearTimeout(hold.current);
      if (byTouch.current) closeSoon(LINGER_MS);
    },
    onPointerCancel: (e: PointerEvent<HTMLElement>) => {
      call(own.onPointerCancel, e);
      clearTimeout(hold.current);
      if (byTouch.current) closeSoon(LINGER_MS);
    },
    // a press that opened the tag by resting is not a press of the part
    onClickCapture: (e: MouseEvent<HTMLElement>) => {
      if (byTouch.current) { byTouch.current = false; e.preventDefault(); e.stopPropagation(); return; }
      call(own.onClickCapture, e);
    },
    onContextMenu: (e: MouseEvent<HTMLElement>) => { call(own.onContextMenu, e); if (byTouch.current) e.preventDefault(); },
    onFocus: (e: FocusEvent<HTMLElement>) => {
      call(own.onFocus, e);
      let visible = true;
      try { visible = e.currentTarget.matches(':focus-visible'); } catch { visible = true; }
      if (visible) openNow();
    },
    onBlur: (e: FocusEvent<HTMLElement>) => { call(own.onBlur, e); closeNow(); },
    ref: (node: HTMLElement | null) => { trigger.current = node; join(child.props.ref ?? (child as unknown as { ref?: Ref<HTMLElement> }).ref, node); },
  };

  const setTip = (el: HTMLDivElement | null) => {
    tip.current = el;
    presence.ref(el);
    if (typeof ref === 'function') ref(el);
    else if (ref) ref.current = el;
  };

  return (
    <>
      {cloneElement(child, handlers)}
      {presence.mounted && !empty && typeof document !== 'undefined' &&
        createPortal(
          <div
            ref={setTip}
            id={id}
            role="tooltip"
            data-component="Tooltip"
            data-state={presence.state}
            data-side={side}
            className={cx(styles.tip, className)}
            style={style}
            onPointerEnter={() => clearTimeout(hide.current)}
            onPointerLeave={(e) => { if (e.pointerType !== 'touch') closeSoon(); }}
            {...rest}
          >
            <span className={styles.text}>{content}</span>
          </div>,
          document.body,
        )}
    </>
  );
});
