import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { cx } from '../../cx';
import styles from './Wiring.module.css';

/** One printed relation between two nodes. */
export interface WiringLink {
  /** The id of the node the relation starts from, such as the thermostat. */
  from: string;
  /** The id of the node the relation acts on, such as the heater. */
  to: string;
  /** The relation said as one sentence, such as "Night mode lowers the heater to 18". It is the line's text for assistive technology and the description both ends get. */
  text: string;
  /** One short lowercase word or two printed beside the line, such as "after 23:00". */
  label?: string;
  /** True when the relation acts right now. Its line, dots and word print at full ink; a waiting one is secondary ink. */
  active?: boolean;
}

export interface WiringProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Names the list of relations for assistive technology, such as "Heating relations". */
  label: string;
  /** The relations to print. Each joins two `Wiring.Node` ids. */
  links: WiringLink[];
  /** The parts, each wrapped in `Wiring.Node` (and related ones in `Wiring.Group`). */
  children: ReactNode;
  /** The word added to an active relation's sentence. Defaults to "on now". */
  activeWord?: string;
  /** The word added to a waiting relation's sentence. Defaults to "waiting". */
  waitingWord?: string;
}

export interface WiringNodeProps extends HTMLAttributes<HTMLDivElement> {
  /** The id links use in `from` and `to`. Unique inside one Wiring. */
  id: string;
  /** The part, such as a Rotary, a DeviceCard or a TimePicker. */
  children: ReactNode;
}

export interface WiringGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** The group's lowercase name printed over its box, such as "heating". */
  label: string;
  /** The related nodes inside the box. */
  children: ReactNode;
}

type Box = { l: number; t: number; r: number; b: number };
type Pt = [number, number];
type Drawn = { key: string; d: string; ends: Pt[]; active: boolean; label?: string; tag?: { x: number; y: number }; m?: number };

interface Ctx { register: (id: string, el: HTMLElement | null) => void; describe: (id: string) => string; base: string }
const WiringContext = createContext<Ctx | null>(null);

const FOCUSABLE = 'button:not([tabindex="-1"]), [href]:not([tabindex="-1"]), input:not([tabindex="-1"]), select, textarea, [tabindex]:not([tabindex="-1"])';

/** Does an upright or level segment from p to q pass through the box? */
const hits = (p: Pt, q: Pt, k: Box) => {
  const x0 = Math.min(p[0], q[0]), x1 = Math.max(p[0], q[0]), y0 = Math.min(p[1], q[1]), y1 = Math.max(p[1], q[1]);
  return x1 > k.l && x0 < k.r && y1 > k.t && y0 < k.b;
};
const overlaps = (a: Box, b: Box) => a.r > b.l && a.l < b.r && a.b > b.t && a.t < b.b;

/**
 * Routes one relation: a straight run when the two parts share a row or a column, otherwise one L with a
 * single bend, every coordinate on the module grid, trying the rows nearest the middle first. A route that
 * crosses another part or a placed word is dropped; when every one bend route is blocked the line goes over
 * the parts between, or under them, with two bends.
 */
function route(a: Box, b: Box, others: Box[], m: number): Pt[] {
  const clear = (pts: Pt[]) => pts.every((p, i) => i === 0 || others.every((o) => !hits(pts[i - 1], p, o)));
  // the module rows inside a span, nearest its middle first, kept a module in from its ends
  const rows = (lo: number, hi: number) => {
    const out: number[] = [];
    for (let v = Math.ceil((lo + m) / m) * m; v <= hi - m; v += m) out.push(v);
    if (!out.length) out.push(Math.round((lo + hi) / 2));
    const mid = (lo + hi) / 2;
    return out.sort((p, q) => Math.abs(p - mid) - Math.abs(q - mid));
  };
  const tries: Pt[][] = [];
  const ox0 = Math.max(a.l, b.l), ox1 = Math.min(a.r, b.r);
  const oy0 = Math.max(a.t, b.t), oy1 = Math.min(a.b, b.b);
  // a straight run when the parts share a column or a row
  if (ox1 - ox0 >= m && (a.b <= b.t || b.b <= a.t)) for (const x of rows(ox0 - m, ox1 + m)) tries.push(a.b <= b.t ? [[x, a.b], [x, b.t]] : [[x, a.t], [x, b.b]]);
  if (oy1 - oy0 >= m && (a.r <= b.l || b.r <= a.l)) for (const y of rows(oy0 - m, oy1 + m)) tries.push(a.r <= b.l ? [[a.r, y], [b.l, y]] : [[a.l, y], [b.r, y]]);
  // one bend: level out of a's side then upright into b's top or bottom, or upright out of a then level into b
  for (const y of rows(a.t, a.b)) for (const x of rows(b.l, b.r)) {
    const sx = x > a.r ? a.r : x < a.l ? a.l : NaN, ey = y < b.t ? b.t : y > b.b ? b.b : NaN;
    if (!Number.isNaN(sx) && !Number.isNaN(ey)) tries.push([[sx, y], [x, y], [x, ey]]);
  }
  for (const x of rows(a.l, a.r)) for (const y of rows(b.t, b.b)) {
    const sy = y > a.b ? a.b : y < a.t ? a.t : NaN, ex = x < b.l ? b.l : x > b.r ? b.r : NaN;
    if (!Number.isNaN(sy) && !Number.isNaN(ex)) tries.push([[x, sy], [x, y], [ex, y]]);
  }
  const pick = tries.find(clear);
  if (pick) return pick;
  // every one bend route is blocked: over the top of everything between, then under, with two bends
  const ax = rows(a.l, a.r)[0], bx = rows(b.l, b.r)[0];
  const span = [a, b, ...others.filter((o) => o.r > Math.min(ax, bx) && o.l < Math.max(ax, bx))];
  const top = Math.floor(Math.min(...span.map((o) => o.t)) / m) * m - m * 2;
  const foot = Math.ceil(Math.max(...span.map((o) => o.b)) / m) * m + m * 2;
  // or, for parts stacked in a column, down a lane beside them at the start or the end
  const ay = rows(a.t, a.b)[0], by = rows(b.t, b.b)[0];
  const column = [a, b, ...others.filter((o) => o.b > Math.min(ay, by) && o.t < Math.max(ay, by))];
  const start = Math.floor(Math.min(...column.map((o) => o.l)) / m) * m - m * 2;
  const end = Math.ceil(Math.max(...column.map((o) => o.r)) / m) * m + m * 2;
  const lanes: Pt[][] = [
    [[ax, a.t], [ax, top], [bx, top], [bx, b.t]],
    [[ax, a.b], [ax, foot], [bx, foot], [bx, b.b]],
    [[a.l, ay], [start, ay], [start, by], [b.l, by]],
    [[a.r, ay], [end, ay], [end, by], [b.r, by]],
  ];
  return lanes.find(clear) ?? lanes[2];
}

const WiringRoot = forwardRef<HTMLDivElement, WiringProps>(function Wiring(
  { label, links, children, activeWord = 'on now', waitingWord = 'waiting', className, ...rest },
  ref,
) {
  const base = useId().replace(/:/g, '');
  const host = useRef<HTMLDivElement | null>(null);
  const nodes = useRef(new Map<string, HTMLElement>());
  const tagEls = useRef(new Map<string, HTMLSpanElement>());
  const [drawn, setDrawn] = useState<Drawn[]>([]);
  const [version, setVersion] = useState(0);
  const register = useCallback((id: string, el: HTMLElement | null) => {
    if (el) nodes.current.set(id, el); else nodes.current.delete(id);
    setVersion((v) => v + 1);
  }, []);
  const linkKey = (l: WiringLink, i: number) => `${base}-rel-${i}`;
  // the ids of the sentences that name a node, so each of its controls is described by them
  const describe = useCallback((id: string) => links.map((l, i) => (l.from === id || l.to === id ? linkKey(l, i) : '')).filter(Boolean).join(' '), [links, base]);
  const ctx = useMemo(() => ({ register, describe, base }), [register, describe, base]);

  const measure = useCallback(() => {
    const h = host.current; if (!h) return;
    const o = h.getBoundingClientRect();
    const rtl = getComputedStyle(h).direction === 'rtl';
    const span = o.right - o.left;
    const m =parseFloat(getComputedStyle(h).getPropertyValue('--ds-gap-md')) || 8;
    const box = (el: Element): Box => { const r = el.getBoundingClientRect(); return { l: r.left - o.left, t: r.top - o.top, r: r.right - o.left, b: r.bottom - o.top }; };
    const boxes = new Map([...nodes.current].map(([id, el]) => [id, box(el)]));
    const frames = Array.from(h.querySelectorAll('[data-wiring-group] > div')).map(box);
    // the group names are printing too, so no line or word may cross them
    const placed: Box[] = Array.from(h.querySelectorAll('[data-wiring-group] > span')).map(box);
    const runs: Array<[Pt, Pt]> = [];
    const out: Drawn[] = [];
    links.forEach((l, i) => {
      const a = boxes.get(l.from), b = boxes.get(l.to);
      if (!a || !b) return;
      const others = [...boxes].filter(([id]) => id !== l.from && id !== l.to).map(([, k]) => k);
      const pts = route(a, b, [...others, ...placed], m);
      const key = linkKey(l, i);
      let tag: Drawn['tag'];
      const t = tagEls.current.get(key);
      if (l.label && t) {
        const w = t.offsetWidth, ht = t.offsetHeight;
        // longest run first; along it the middle, then a little either side, never over a part or a word
        const segs = pts.slice(1).map((p, j) => [pts[j], p] as [Pt, Pt]).sort((s, u) => Math.hypot(u[1][0] - u[0][0], u[1][1] - u[0][1]) - Math.hypot(s[1][0] - s[0][0], s[1][1] - s[0][1]));
        // a word may sit inside a group frame or outside it, never across its printed edge, and never on another line
        const free = (k: Box) => k.l >= 0 && k.r <= span && [...boxes.values(), ...placed].every((z) => !overlaps(k, z))
          && frames.every((f) => !overlaps(k, f) || (k.l >= f.l && k.r <= f.r && k.t >= f.t && k.b <= f.b))
          && runs.every(([p, q]) => !hits(p, q, k));
        search: for (const [p, q] of segs) {
          const level = p[1] === q[1];
          for (const f of [0.5, 0.35, 0.65, 0.2, 0.8, 0.1, 0.9]) {
            const cx0 = p[0] + (q[0] - p[0]) * f, cy0 = p[1] + (q[1] - p[1]) * f;
            // above a level run, else under it; beside an upright run, after it, else before it
            const spots: Array<[number, number]> = level
              ? [[cx0 - w / 2, cy0 - ht - m / 4], [cx0 - w / 2, cy0 + m / 4]]
              : [[cx0 + m / 2, cy0 - ht / 2], [cx0 - m / 2 - w, cy0 - ht / 2]];
            for (const [x, y] of spots) {
              const k = { l: x, t: y, r: x + w, b: y + ht };
              if (free(k)) { tag = { x: rtl ? x + w - span : x, y }; placed.push(k); break search; }
            }
          }
        }
        if (!tag) { const [p, q] = segs[0]; const x = Math.max(0, Math.min((p[0] + q[0]) / 2 - w / 2, span - w)), y = (p[1] + q[1]) / 2 - ht - m / 4; tag = { x: rtl ? x + w - span : x, y }; placed.push({ l: x, t: y, r: x + w, b: y + ht }); }
      }
      pts.slice(1).forEach((p, j) => runs.push([pts[j], p]));
      out.push({ key, d: pts.map((p, j) => `${j ? 'L' : 'M'}${p[0]} ${p[1]}`).join(' '), ends: [pts[0], pts[pts.length - 1]], active: !!l.active, label: l.label, tag, m });
    });
    setDrawn((prev) => (JSON.stringify(prev) === JSON.stringify(out) ? prev : out));
  }, [links, base]);

  useLayoutEffect(() => { measure(); }, [measure, version]);
  useEffect(() => {
    const h = host.current; if (!h || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => measure());
    ro.observe(h); nodes.current.forEach((el) => ro.observe(el));
    document.fonts?.ready.then(() => measure()).catch(() => {});
    return () => ro.disconnect();
  }, [measure, version]);

  const setRef = (el: HTMLDivElement | null) => { host.current = el; if (typeof ref === 'function') ref(el); else if (ref) ref.current = el; };
  return (
    <WiringContext.Provider value={ctx}>
      <div ref={setRef} data-component="Wiring" className={cx(styles.root, className)} {...rest}>
        <svg className={styles.wires} aria-hidden="true" focusable="false">
          {drawn.map((w) => (
            <g key={w.key}>
              <path className={styles.line} data-state={w.active ? 'on' : 'off'} d={w.d} />
              {w.ends.map((p, j) => <circle key={j} className={styles.dot} data-state={w.active ? 'on' : 'off'} cx={p[0]} cy={p[1]} r={(w.m ?? 8) * 0.375} />)}
            </g>
          ))}
        </svg>
        <div className={styles.field}>{children}</div>
        {links.map((l, i) => {
          const key = linkKey(l, i);
          if (!l.label) return null;
          const at = drawn.find((w) => w.key === key)?.tag;
          return (
            <span
              key={key}
              ref={(el) => { if (el) tagEls.current.set(key, el); else tagEls.current.delete(key); }}
              className={styles.tag}
              data-state={l.active ? 'on' : 'off'}
              aria-hidden="true"
              style={{ transform: at ? `translate(${at.x}px, ${at.y}px)` : undefined, visibility: at ? undefined : 'hidden' }}
            >
              {l.label}
            </span>
          );
        })}
        <ul className={styles.relations} aria-label={label}>
          {links.map((l, i) => <li key={linkKey(l, i)} id={linkKey(l, i)}>{`${l.text}, ${l.active ? activeWord : waitingWord}.`}</li>)}
        </ul>
      </div>
    </WiringContext.Provider>
  );
});

/**
 * One part a relation can join. Wraps any control or unit; every focusable control inside it is described
 * by the sentences of the relations that touch it, so focusing one end names the other.
 */
export const WiringNode = forwardRef<HTMLDivElement, WiringNodeProps>(function WiringNode({ id, children, className, ...rest }, ref) {
  const ctx = useContext(WiringContext);
  const el = useRef<HTMLDivElement | null>(null);
  useLayoutEffect(() => { ctx?.register(id, el.current); return () => ctx?.register(id, null); }, [ctx?.register, id]);
  const ids = ctx?.describe(id) ?? '';
  useEffect(() => {
    const host = el.current; if (!host || !ids) return;
    const mine = ids.split(' ');
    const apply = () => host.querySelectorAll<HTMLElement>(FOCUSABLE).forEach((c) => {
      const own = (c.getAttribute('aria-describedby') ?? '').split(/\s+/).filter((x) => x && !x.includes('-rel-'));
      c.setAttribute('aria-describedby', [...own, ...mine].join(' '));
    });
    apply();
    const mo = new MutationObserver(() => apply());
    mo.observe(host, { childList: true, subtree: true });
    return () => {
      mo.disconnect();
      host.querySelectorAll<HTMLElement>(FOCUSABLE).forEach((c) => {
        const own = (c.getAttribute('aria-describedby') ?? '').split(/\s+/).filter((x) => x && !mine.includes(x));
        if (own.length) c.setAttribute('aria-describedby', own.join(' ')); else c.removeAttribute('aria-describedby');
      });
    };
  }, [ids]);
  const setRef = (n: HTMLDivElement | null) => { el.current = n; if (typeof ref === 'function') ref(n); else if (ref) ref.current = n; };
  return <div ref={setRef} data-wiring-node={id} className={cx(styles.node, className)} {...rest}>{children}</div>;
});

/** A printed box around related nodes, with its lowercase name over it. */
export const WiringGroup = forwardRef<HTMLDivElement, WiringGroupProps>(function WiringGroup({ label, children, className, ...rest }, ref) {
  const id = `${useId().replace(/:/g, '')}-group`;
  // the frame nests the roundest part inside it: its corner is that part's corner plus the frame's inset
  const frame = useRef<HTMLDivElement | null>(null);
  const [inner, setInner] = useState(0);
  useLayoutEffect(() => {
    const f = frame.current; if (!f) return;
    const fit = () => setInner(Math.max(0, ...Array.from(f.querySelectorAll(':scope > [data-wiring-node] > *')).map((el) => parseFloat(getComputedStyle(el).borderStartStartRadius) || 0)));
    fit();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(fit); ro.observe(f);
    return () => ro.disconnect();
  }, []);
  return (
    <div ref={ref} role="group" aria-labelledby={id} data-wiring-group="" className={cx(styles.group, className)} {...rest}>
      <span id={id} className={styles.groupLabel}>{label}</span>
      <div ref={frame} className={styles.box} style={inner ? { ['--wiring-inner' as string]: `${inner}px` } : undefined}>{children}</div>
    </div>
  );
});

/**
 * Relations printed between parts that affect each other, like a schematic face: hairlines of ink on the
 * module grid with one bend at most, a small dot where a line meets a part, one lowercase word per line and
 * a printed box around a group. Active relations print at full ink. Every relation is also a sentence for
 * assistive technology, and focusing one end describes the relation, naming the other.
 */
export const Wiring = Object.assign(WiringRoot, { Node: WiringNode, Group: WiringGroup });
