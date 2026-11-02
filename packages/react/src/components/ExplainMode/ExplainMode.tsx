import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { cx } from '../../cx';
import { Button } from '../Button';
import styles from './ExplainMode.module.css';

export interface ExplainModeProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** The unit or screen whose parts are explained. Mark each part with `Explain` or a `data-explain="Name|What it does"` attribute. */
  children: ReactNode;
  /** Whether the printing is up, when the owner holds the state. */
  open?: boolean;
  /** Whether the printing is up at first, when ExplainMode holds the state. Defaults to false. */
  defaultOpen?: boolean;
  /** Runs with the new state when the key, the shortcut or Escape turns the mode on or off. */
  onOpenChange?: (open: boolean) => void;
  /** Prints the plastic key that turns the mode on and off at the end of the unit. Defaults to true. */
  toggle?: boolean;
  /** The word on the key. Defaults to "How this works". */
  toggleLabel?: string;
  /** The key that turns the mode on and off while focus is inside, outside a text field. Defaults to "?". */
  shortcut?: string;
  /** What a screen reader hears when the mode turns on. */
  openText?: string;
  /** What a screen reader hears when the mode turns off. */
  closeText?: string;
}

export interface ExplainProps extends HTMLAttributes<HTMLDivElement> {
  /** The part's name, as the manual prints it under the knob, such as "Volume". */
  name: string;
  /** One line of what the part does, such as "Sets how loud the speaker plays". Never its current value. */
  does: string;
  /** The part itself, one control or one window. */
  children: ReactNode;
}

type Rect = { l: number; t: number; r: number; b: number };
type Side = 'below' | 'above' | 'end' | 'start';
/** A note is printed beside its part, or, where no free space is left, numbered beside the part and printed in the key under the unit. */
type Note =
  | { name: string; does: string; x: number; tx: number; y: number; side: Side; lead: string; key?: undefined }
  | { name: string; does: string; x?: undefined; key: number; mx: number; my: number }
  | { name: string; does: string; x?: undefined; key?: undefined };

/** Components that are a body around other parts; their own box is not something a note must clear. */
const BODIES = new Set(['Card', 'DeviceCard', 'Stack', 'Grid', 'GridItem', 'Container', 'ExplainMode', 'Wiring', 'Tray']);

const FOCUSABLE = 'button:not([tabindex="-1"]), [href]:not([tabindex="-1"]), input:not([tabindex="-1"]), select, textarea, [tabindex]:not([tabindex="-1"])';
const overlaps = (a: Rect, b: Rect) => a.r > b.l && a.l < b.r && a.b > b.t && a.t < b.b;
const editable = (t: EventTarget | null) => t instanceof HTMLElement && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));
const parse = (v: string | null) => { const s = v ?? ''; const i = s.indexOf('|'); return i < 0 ? { name: s.trim(), does: '' } : { name: s.slice(0, i).trim(), does: s.slice(i + 1).trim() }; };

/** One explained part: wraps a control or a window and carries its name and its one line. */
export const Explain = forwardRef<HTMLDivElement, ExplainProps>(function Explain({ name, does, children, className, ...rest }, ref) {
  return <div ref={ref} data-explain={`${name}|${does}`} className={cx(styles.part, className)} {...rest}>{children}</div>;
});

/**
 * A how this works mode on the real screen, after the SK 4 manual: one key prints every marked part's name
 * and one line of what it does in the free space next to it, joined by a hairline leader. The printing never
 * takes a pointer, so the controls keep working. Escape or the same key closes it, and while it is up every
 * part's control is described by its printed words.
 */
export const ExplainMode = forwardRef<HTMLDivElement, ExplainModeProps>(function ExplainMode(
  {
    children, open: openProp, defaultOpen = false, onOpenChange, toggle = true, toggleLabel = 'How this works', shortcut = '?',
    openText = 'How this works is on. Each part is named beside it. Escape closes it.', closeText = 'How this works is off.',
    className, onKeyDown, ...rest
  },
  ref,
) {
  const base = useId().replace(/:/g, '');
  const [own, setOwn] = useState(defaultOpen);
  const open = openProp ?? own;
  const host = useRef<HTMLDivElement | null>(null);
  const field = useRef<HTMLDivElement | null>(null);
  const noteEls = useRef<Array<HTMLDivElement | null>>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [said, setSaid] = useState('');
  const touched = useRef(false);

  const set = useCallback((next: boolean) => {
    touched.current = true;
    if (openProp === undefined) setOwn(next);
    onOpenChange?.(next);
  }, [openProp, onOpenChange]);

  useEffect(() => { if (touched.current) setSaid(open ? openText : closeText); }, [open, openText, closeText]);

  const parts = (): HTMLElement[] => (field.current ? Array.from(field.current.querySelectorAll<HTMLElement>('[data-explain]')) : []);

  const measure = useCallback(() => {
    const h = host.current; if (!h || !open) { setNotes((p) => (p.length ? [] : p)); return; }
    const o = h.getBoundingClientRect();
    const rtl = getComputedStyle(h).direction === 'rtl';
    const span = o.right - o.left, deep = o.bottom - o.top;
    const g = (parseFloat(getComputedStyle(h).getPropertyValue('--ds-gap-md')) || 8) * 2;
    const els = parts();
    // a wrapper may be wider than the part it holds, so a single child is measured itself
    const rel = (el: Element): Rect => { const r = el.getBoundingClientRect(); return { l: r.left - o.left, t: r.top - o.top, r: r.right - o.left, b: r.bottom - o.top }; };
    const rects: Rect[] = els.map((el) => rel(el.children.length === 1 ? el.children[0] : el));
    // everything printed or pressable on the unit is kept clear: words, drawings, controls and windows
    const ink: Rect[] = Array.from(field.current?.querySelectorAll('*') ?? []).filter((el) => {
      if (el.parentElement?.closest('svg')) return false;
      const dc = el.getAttribute('data-component');
      if (dc) return !BODIES.has(dc);
      if (el.tagName === 'svg' || /^(INPUT|BUTTON|SELECT|TEXTAREA)$/.test(el.tagName) || el.getAttribute('role') === 'slider') return true;
      return Array.from(el.childNodes).some((c) => c.nodeType === 3 && (c.textContent ?? '').trim() !== '');
    }).map(rel).filter((k) => k.r > k.l && k.b > k.t);
    const bar = h.querySelector(`.${styles.bar}`);
    if (bar) ink.push(rel(bar));
    const placed: Rect[] = [];
    let keyed = 0;
    const out: Note[] = els.map((el, i) => {
      const { name, does } = parse(el.getAttribute('data-explain'));
      const n = noteEls.current[i];
      if (!n) return { name, does };
      const w = n.offsetWidth, ht = n.offsetHeight, P = rects[i];
      const cx0 = (P.l + P.r) / 2, cy0 = (P.t + P.b) / 2;
      const clampX = (x: number) => Math.max(0, Math.min(x, span - w));
      const tries: Array<{ side: Side; x: number; y: number }> = [
        { side: 'below', x: clampX(cx0 - w / 2), y: P.b + g },
        { side: 'below', x: clampX(P.l), y: P.b + g },
        { side: 'below', x: clampX(P.r - w), y: P.b + g },
        { side: 'above', x: clampX(cx0 - w / 2), y: P.t - g - ht },
        { side: 'above', x: clampX(P.l), y: P.t - g - ht },
        { side: 'end', x: P.r + g, y: cy0 - ht / 2 },
        { side: 'end', x: P.r + g, y: P.t },
        { side: 'start', x: P.l - g - w, y: cy0 - ht / 2 },
        { side: 'start', x: P.l - g - w, y: P.t },
      ];
      const free = (k: Rect) => [...ink, ...rects, ...placed].every((z) => !overlaps(k, z));
      const fits = (k: Rect) => k.l >= 0 && k.t >= 0 && k.r <= span && k.b <= deep && free(k);
      const pick = tries.find((c) => (c.side === 'below' || c.side === 'above' ? c.x <= cx0 && cx0 <= c.x + w : true) && fits({ l: c.x, t: c.y, r: c.x + w, b: c.y + ht }));
      if (!pick) {
        // no free space beside the part: a numeral beside it, and the note in the key under the unit
        keyed += 1;
        const d = g;
        const spots: Array<[number, number]> = [[P.r + g / 4, P.t], [P.l - g / 4 - d, P.t], [P.r + g / 4, P.b - d], [P.l - g / 4 - d, P.b - d]];
        const [mx, my] = spots.find(([x, y]) => free({ l: x, t: y, r: x + d, b: y + d })) ?? spots[0];
        placed.push({ l: mx, t: my, r: mx + d, b: my + d });
        return { name, does, key: keyed, mx: Math.round(rtl ? mx + d - span : mx), my: Math.round(my) };
      }
      placed.push({ l: pick.x, t: pick.y, r: pick.x + w, b: pick.y + ht });
      const gap = g / 4;
      const lead =
        pick.side === 'below' ? `M${cx0} ${P.b} V${pick.y - gap}`
        : pick.side === 'above' ? `M${cx0} ${P.t} V${pick.y + ht + gap}`
        : pick.side === 'end' ? `M${P.r} ${cy0} H${pick.x - gap}`
        : `M${P.l} ${cy0} H${pick.x + w + gap}`;
      // the note is anchored at the inline start, so in right to left it moves from the right edge
      const side: Side = rtl && pick.side === 'end' ? 'start' : rtl && pick.side === 'start' ? 'end' : pick.side;
      return { name, does, x: Math.round(pick.x), tx: Math.round(rtl ? pick.x + w - span : pick.x), y: Math.round(pick.y), side, lead };
    });
    setNotes((p) => (JSON.stringify(p) === JSON.stringify(out) ? p : out));
  }, [open]);

  // first pass renders the notes unplaced so they can be measured, the second places them
  useLayoutEffect(() => {
    if (!open) { setNotes([]); return; }
    setNotes(parts().map((el) => ({ ...parse(el.getAttribute('data-explain')) })));
  }, [open]);
  useLayoutEffect(() => { if (open && notes.length && notes.some((n) => n.x === undefined && n.key === undefined)) measure(); });
  // the key opens its height over motion.enter, so nothing under the unit jumps in one frame; it keeps its last
  // words while it closes
  const keyInner = useRef<HTMLOListElement | null>(null);
  const lastKey = useRef<Note[]>([]);
  const keyedNow = notes.some((n) => n.key !== undefined);
  if (open && keyedNow) lastKey.current = notes;
  const keyNotes = open ? notes : lastKey.current;
  const [keyH, setKeyH] = useState(0);
  useLayoutEffect(() => { setKeyH(open && keyedNow ? keyInner.current?.scrollHeight ?? 0 : 0); });
  useEffect(() => {
    const h = host.current; if (!open || !h || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => measure());
    ro.observe(h); parts().forEach((p) => ro.observe(p));
    return () => ro.disconnect();
  }, [open, measure]);

  // while the printing is up, each part's control is described by its printed name and line
  useEffect(() => {
    if (!open) return;
    const els = parts();
    const done: Array<[HTMLElement, string | null]> = [];
    els.forEach((el, i) => {
      const c = el.matches(FOCUSABLE) ? el : el.querySelector<HTMLElement>(FOCUSABLE);
      if (!c) return;
      const prev = c.getAttribute('aria-describedby');
      done.push([c, prev]);
      c.setAttribute('aria-describedby', [prev, `${base}-note-${i}`].filter(Boolean).join(' '));
    });
    return () => done.forEach(([c, prev]) => (prev ? c.setAttribute('aria-describedby', prev) : c.removeAttribute('aria-describedby')));
  }, [open, base, notes.length]);

  // Escape closes it from anywhere on the page, unless something inside already used the key
  useEffect(() => {
    if (!open) return;
    const esc = (e: globalThis.KeyboardEvent) => { if (e.key === 'Escape' && !e.defaultPrevented) set(false); };
    document.addEventListener('keydown', esc);
    return () => document.removeEventListener('keydown', esc);
  }, [open, set]);

  const keys = (e: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(e);
    if (e.defaultPrevented || editable(e.target) || e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key === shortcut) { e.preventDefault(); set(!open); }
  };

  const setRef = (el: HTMLDivElement | null) => { host.current = el; if (typeof ref === 'function') ref(el); else if (ref) ref.current = el; };
  return (
    <div ref={setRef} data-component="ExplainMode" data-state={open ? 'open' : 'closed'} className={cx(styles.root, className)} onKeyDown={keys} {...rest}>
      <div ref={field}>{children}</div>
      {/* the layer stays mounted, empty while closed, so nothing beside the key comes and goes */}
      <div className={styles.layer} aria-hidden="true" data-explain-layer={open ? '' : undefined}>
          <svg className={styles.leads} focusable="false">
            {notes.map((n, i) => (n.x !== undefined ? <path key={i} className={styles.lead} d={n.lead} /> : null))}
          </svg>
          {notes.map((n, i) => (
            <div
              key={i}
              id={n.key === undefined ? `${base}-note-${i}` : undefined}
              ref={(el) => { noteEls.current[i] = el; }}
              className={styles.note}
              data-side={n.x !== undefined ? n.side : undefined}
              data-keyed={n.key !== undefined ? '' : undefined}
              style={{ transform: n.x !== undefined ? `translate(${n.tx}px, ${n.y}px)` : undefined, visibility: n.x !== undefined ? undefined : 'hidden' }}
            >
              <span className={styles.name}>{n.name}</span>
              {n.does ? <span className={styles.does}>{n.does}</span> : null}
            </div>
          ))}
          {notes.map((n, i) => (n.key !== undefined ? <span key={`m${i}`} className={styles.mark} style={{ transform: `translate(${n.mx}px, ${n.my}px)` }}>{n.key}</span> : null))}
      </div>
      {toggle ? (
        <div className={styles.bar}>
          <Button aria-pressed={open} aria-keyshortcuts={shortcut === '?' ? 'Shift+?' : shortcut} onClick={() => set(!open)}>{toggleLabel}</Button>
        </div>
      ) : null}
      <div className={styles.keyWrap} style={{ ['--explain-key' as string]: `${keyH}px` }}>
        <ol ref={keyInner} className={styles.key} aria-hidden="true" data-explain-key="">
          {keyNotes.map((n, i) => (n.key !== undefined ? (
            <li key={i} id={`${base}-note-${i}`} className={styles.keyItem}>
              <span className={styles.keyNumber}>{n.key}</span>
              <span className={styles.name}>{n.name}</span>
              {n.does ? <span className={styles.does}>{n.does}</span> : null}
            </li>
          ) : null))}
        </ol>
      </div>
      <span className={styles.status} role="status">{said}</span>
    </div>
  );
});
