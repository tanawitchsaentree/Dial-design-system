import { forwardRef, useState, type CSSProperties, type HTMLAttributes, type KeyboardEvent, type ReactNode } from 'react';
import { cx } from '../../cx';
import { messages } from '../../messages';
import { PatternDefs, clamp, fit, patternRef, plain, textWidth, useChartSpace, useSvgId } from '../BarChart/chartKit';
import styles from './PieChart.module.css';

/** One part of the whole. */
export interface PieSlice {
  /** The part name, printed beside its slice, in the legend and read out. */
  name: string;
  /** The part's size. Negative or missing values count as zero, and a zero part gets no slice. */
  value: number;
}

/** The words the chart speaks on its own. Pass a few to translate or reword them. */
export interface PieChartWords {
  /** The kind of object the chart is, read by assistive tech. Default "Pie chart". */
  roleDescription?: string;
  /** The line shown under the chart before a slice is active. Default "Use the arrow keys to move between parts." */
  hint?: string;
  /** The heading of the first column in the hidden table. Default "Part". */
  part?: string;
  /** The heading of the value column in the hidden table. Default "Value". */
  value?: string;
  /** The heading of the share column in the hidden table. Default "Share". */
  share?: string;
  /** The caption under the total in the middle of a donut. Default "Total". */
  total?: string;
  /** Builds the readout for the active slice from its name, its formatted value and its formatted share. */
  readout?: (name: string, value: string, share: string) => string;
}

export interface PieChartProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'role' | 'onChange'> {
  /** What the chart shows, such as "Heating by room". Printed above the window and used as its accessible name. */
  label: ReactNode;
  /** The parts of the whole, in the order they run clockwise from the top. Keep it to six or fewer: more repeat the patterns. */
  slices: PieSlice[];
  /** A ring with a total in the hole, or a whole disc. Default "donut". */
  variant?: 'donut' | 'pie';
  /** Block size of the drawing in pixels. Default: the layout frame size. */
  height?: number;
  /** Turns a value into the text printed in the legend and said in the readout, for example `(v) => v + ' kWh'`. */
  formatValue?: (value: number) => string;
  /** Turns a share, a number from 0 to 1, into the text printed beside a slice. Default a percentage with up to one decimal. */
  formatShare?: (share: number) => string;
  /** The figure in the hole of a donut. Default: the formatted total. */
  centerValue?: string;
  /** The caption under the figure in the hole. Default is the word for "Total". */
  centerLabel?: string;
  /** The words the chart speaks. Each one has an English default. */
  words?: PieChartWords;
  /** Called with the slice index when a slice becomes active, from the keys or a pointer. */
  onActiveChange?: (index: number) => void;
}

const percent = (share: number) => `${Number((share * 100).toFixed(1))}%`;
const FULL = Math.PI * 2;
const HOLE = 0.6;

const polar = (cx: number, cy: number, r: number, a: number): [number, number] => [cx + r * Math.sin(a), cy - r * Math.cos(a)];

/** A ring segment (or a wedge when the inner radius is zero) from angle a0 to a1, clockwise from the top. */
function segment(cx: number, cy: number, r0: number, r1: number, a0: number, a1: number): string {
  const end = Math.min(a1, a0 + FULL - 0.0001);
  const big = end - a0 > Math.PI ? 1 : 0;
  const [x0, y0] = polar(cx, cy, r1, a0);
  const [x1, y1] = polar(cx, cy, r1, end);
  if (r0 <= 0) return `M${cx} ${cy}L${x0} ${y0}A${r1} ${r1} 0 ${big} 1 ${x1} ${y1}Z`;
  const [x2, y2] = polar(cx, cy, r0, end);
  const [x3, y3] = polar(cx, cy, r0, a0);
  return `M${x0} ${y0}A${r1} ${r1} 0 ${big} 1 ${x1} ${y1}L${x2} ${y2}A${r0} ${r0} 0 ${big} 0 ${x3} ${y3}Z`;
}

/** Pushes label heights apart so none are closer than `gap`, keeping them inside [lo, hi]. */
function spread(ys: number[], gap: number, lo: number, hi: number): number[] {
  const order = ys.map((y, i) => i).sort((a, b) => ys[a] - ys[b]);
  const out = [...ys];
  let prev = lo - gap;
  for (const i of order) { out[i] = Math.max(out[i], prev + gap); prev = out[i]; }
  let next = hi + gap;
  for (const i of [...order].reverse()) { out[i] = Math.min(out[i], next - gap); next = out[i]; }
  return out;
}

/** A pie or donut chart in native SVG: slices told apart by ink pattern, a printed name and share on a leader line,
 *  a legend of names, arrow-key navigation with a live readout, and a hidden table of the data. */
export const PieChart = forwardRef<HTMLDivElement, PieChartProps>(function PieChart(
  {
    label, slices, variant = 'donut', height, formatValue = plain, formatShare = percent, centerValue, centerLabel,
    words, onActiveChange, className, style, ...rest
  },
  ref,
) {
  const w = { ...messages.pieChart, ...words };
  const uid = useSvgId();
  const titleId = `${uid}-title`;
  const readoutId = `${uid}-readout`;
  const { frame, space } = useChartSpace();
  const [active, setActive] = useState<number | null>(null);
  const size = (i: number) => (Number.isFinite(slices[i]?.value) ? Math.max(0, slices[i].value) : 0);
  const total = slices.reduce((sum, _, i) => sum + size(i), 0);
  const shown = slices.map((_, i) => i).filter((i) => size(i) > 0);
  const shareOf = (i: number) => (total > 0 ? size(i) / total : 0);
  const now = active !== null && active < slices.length && size(active) > 0 ? active : null;

  const pick = (i: number) => {
    if (i === active || i < 0 || i >= slices.length) return;
    setActive(i);
    onActiveChange?.(i);
  };

  // ---- geometry, in pixels, from token lengths measured at run time ----
  const blockSize = space ? height ?? space.px['layout-frame-xs'] : 0;
  const arcs: Array<{ i: number; path: string; ring: string; text: string; lead: string; tx: number; ty: number; anchor: 'start' | 'end' }> = [];
  let hub: { x: number; y: number; r: number } | null = null;
  if (space && total > 0) {
    const { px } = space;
    const W = space.inline;
    const cap = px['type-caption'];
    const xs = px['gap-xs'];
    const md = px['gap-md'];
    const lg = px['gap-lg'];
    const cx = W / 2;
    const cy = blockSize / 2;
    // names and shares beside the ring; when that squeezes the ring too small, shares only (the legend keeps the names)
    const named = slices.map((s, i) => `${s.name} ${formatShare(shareOf(i))}`);
    const shares = slices.map((_, i) => formatShare(shareOf(i)));
    const roomFor = (t: string[]) => Math.min(Math.max(...shown.map((i) => textWidth(t[i], cap))), W * 0.3) + lg + 2 * md;
    const tall = blockSize / 2 - cap - lg;
    const compact = Math.min(tall, W / 2 - roomFor(named)) < tall * 0.7;
    const texts = compact ? shares : named;
    const room = roomFor(texts);
    const R = Math.max(px['gap-3xl'], Math.min(tall, W / 2 - room));
    const r0 = variant === 'donut' ? R * HOLE : 0;
    hub = { x: cx, y: cy, r: r0 };
    const reach = W / 2 - R - lg - 2 * md;
    let a = 0;
    const spans = shown.map((i) => {
      const a0 = a;
      a += shareOf(i) * FULL;
      return { i, a0, a1: a, mid: (a0 + a) / 2 };
    });
    const place = (side: 1 | -1) => {
      const group = spans.filter((s) => (Math.sin(s.mid) >= 0 ? 1 : -1) === side);
      const ys = spread(group.map((s) => cy - Math.cos(s.mid) * (R + lg)), cap * 1.6, cap, blockSize - cap);
      group.forEach((s, k) => {
        const [x0, y0] = polar(cx, cy, R + xs, s.mid);
        const ex = cx + side * (R + lg);
        arcs.push({
          i: s.i,
          path: segment(cx, cy, r0, R, s.a0, s.a1),
          ring: segment(cx, cy, Math.max(0, r0 - xs), R + xs, s.a0, s.a1),
          text: fit(texts[s.i], reach, cap),
          lead: `M${x0} ${y0}L${ex} ${ys[k]}L${ex + side * md} ${ys[k]}`,
          tx: ex + side * (md + xs),
          ty: ys[k],
          anchor: side === 1 ? 'start' : 'end',
        });
      });
    };
    place(1);
    place(-1);
    arcs.sort((p, q) => p.i - q.i);
  }

  const move = (e: KeyboardEvent<SVGSVGElement>) => {
    if (shown.length === 0) return;
    const at = now === null ? -1 : shown.indexOf(now);
    let to = at;
    switch (e.key) {
      case 'ArrowRight': case 'ArrowDown': to = Math.min(shown.length - 1, at + 1); break;
      case 'ArrowLeft': case 'ArrowUp': to = Math.max(0, at - 1); break;
      case 'Home': to = 0; break;
      case 'End': to = shown.length - 1; break;
      default: return;
    }
    e.preventDefault();
    pick(shown[clamp(to, 0, shown.length - 1)]);
  };

  const readout = now !== null ? w.readout(slices[now].name, formatValue(size(now)), formatShare(shareOf(now))) : w.hint;
  const sizing = space && blockSize ? ({ '--h': `calc(${blockSize}px + 2 * var(--ds-width-hairline))` } as CSSProperties) : undefined;
  const heart = centerValue ?? formatValue(total);

  return (
    <div
      ref={ref}
      data-component="PieChart"
      data-variant={variant}
      className={cx(styles.root, className)}
      style={style}
      {...rest}
    >
      <div className={styles.header}>
        <span id={titleId} className={styles.title}>{label}</span>
      </div>
      <div ref={frame} className={styles.window} style={sizing}>
        {space && blockSize > 0 && (
          <svg
            className={styles.svg}
            viewBox={`0 0 ${space.inline} ${blockSize}`}
            role="application"
            aria-roledescription={w.roleDescription}
            aria-labelledby={titleId}
            aria-describedby={readoutId}
            tabIndex={0}
            focusable="true"
            onKeyDown={move}
            onFocus={() => { if (now === null && shown.length) pick(shown[0]); }}
          >
            <PatternDefs id={uid} tile={space.px['gap-lg']} dot={space.px['gap-xs'] / 2} classes={{ bg: styles.tileBg, ink: styles.tileInk, dot: styles.tileDot, solid: styles.tileSolid }} />
            <g aria-hidden="true">
              {arcs.map((s) => (
                <g key={s.i}>
                  <path
                    className={styles.slice}
                    data-active={now === s.i ? '' : undefined}
                    d={s.path}
                    fill={patternRef(uid, s.i)}
                    onPointerDown={() => pick(s.i)}
                    onPointerMove={() => pick(s.i)}
                  />
                  {now === s.i && <path className={styles.focusMark} d={s.ring} />}
                  <path className={styles.lead} d={s.lead} />
                  <text className={styles.label} x={s.tx} y={s.ty} textAnchor={s.anchor}>{s.text}</text>
                </g>
              ))}
              {hub && variant === 'donut' && hub.r > 0 && (
                <>
                  <text className={styles.center} x={hub.x} y={hub.y - space.px['gap-xs']} textAnchor="middle">{fit(heart, 2 * hub.r - space.px['gap-md'], space.px['type-label'])}</text>
                  <text className={styles.centerCaption} x={hub.x} y={hub.y + space.px['type-label'] / 2 + space.px['gap-xs']} textAnchor="middle">{fit(centerLabel ?? w.total, 2 * hub.r - space.px['gap-md'], space.px['type-micro'])}</text>
                </>
              )}
            </g>
          </svg>
        )}
      </div>
      <ul className={styles.legend}>
        {slices.map((s, i) => (
          <li key={s.name} className={styles.item} data-active={now === i ? '' : undefined} onPointerDown={() => size(i) > 0 && pick(i)}>
            <svg className={styles.swatch} aria-hidden="true" focusable="false">
              <rect width="100%" height="100%" fill={patternRef(uid, i)} />
            </svg>
            <span className={styles.name}>{s.name}</span>
            <span className={styles.figure}>{formatValue(size(i))}, {formatShare(shareOf(i))}</span>
          </li>
        ))}
      </ul>
      <p id={readoutId} className={styles.readout} aria-live="polite" data-idle={now !== null ? undefined : ''}>{readout}</p>
      <div className={styles.table}>
      <table>
        <caption>{label}</caption>
        <thead>
          <tr>
            <th scope="col">{w.part}</th>
            <th scope="col">{w.value}</th>
            <th scope="col">{w.share}</th>
          </tr>
        </thead>
        <tbody>
          {slices.map((s, i) => (
            <tr key={s.name}>
              <th scope="row">{s.name}</th>
              <td>{formatValue(size(i))}</td>
              <td>{formatShare(shareOf(i))}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
});
