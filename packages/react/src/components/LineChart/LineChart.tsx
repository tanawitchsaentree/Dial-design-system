import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type PointerEvent,
} from 'react';
import { cx } from '../../cx';
import { messages } from '../../messages';
import { formatNumber, niceScale, runStats } from './chart-utils';
import styles from './LineChart.module.css';

export type LineChartSize = 'sm' | 'md' | 'lg';
export type MarkShape = 'circle' | 'square' | 'diamond';

export interface LineChartSeries {
  /** The name of the line, such as "Indoor". Printed in the legend and the readout and used as a table column heading. */
  label: string;
  /** One number per category, in the same order as `categories`. Missing points are not supported: pass every value. */
  values: number[];
}

export interface LineChartWords {
  /** The role description read for the chart. Default "Line chart". */
  roleDescription?: string;
  /** What the readout prints while the cursor is on no point, which is also how to use the keys. */
  hint?: string;
  /** Column heading of the first table column. Default "Point". */
  category?: string;
  /** The table caption, from the chart's name. */
  tableCaption?: (label: string) => string;
  /** The first sentence of the summary read for the chart, from the number of points and lines. */
  summary?: (points: number, series: number) => string;
  /** One sentence per line in the summary, from the name and four formatted values. */
  seriesSummary?: (name: string, first: string, last: string, low: string, high: string) => string;
}

export interface LineChartProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'role' | 'defaultValue' | 'onChange'> {
  /** What the chart shows, such as "Temperature this week". Printed above the window and used as the accessible name. */
  label: string;
  /** The x axis: one name per point, such as the days of the week. Points are evenly spaced; this is not a time scale. */
  categories: string[];
  /** One to three lines. More than three are ignored. Each is told apart by dash pattern and mark shape, never by colour alone. */
  series: LineChartSeries[];
  /** The unit printed after a value in the readout, summary and table, such as °C or kWh. Axis ticks stay bare numbers. */
  unit?: string;
  /** Your own way to write a value, for another language or number format. Receives the raw number. */
  format?: (value: number) => string;
  /** Start the value axis at zero. Default false: the axis fits the data. */
  zero?: boolean;
  /** The lowest value on the axis. Leave it out to let the scale pick a round number. */
  min?: number;
  /** The highest value on the axis. Leave it out to let the scale pick a round number. */
  max?: number;
  /** About how many ticks the value axis gets. Default 5, or 3 for `sm`. */
  ticks?: number;
  /** The point the cursor is on when controlled, as an index into `categories`, or null for none. Pair it with `onIndexChange`. */
  index?: number | null;
  /** The point the cursor starts on when uncontrolled. Default null: no cursor until the person points or presses a key. */
  defaultIndex?: number | null;
  /** Called when the cursor moves to another point, or lets go (null). */
  onIndexChange?: (index: number | null) => void;
  /** `sm` is a low window for a row of readings, `md` (default) leaves room for five ticks, `lg` is a tall window for the one trend a sheet is about. */
  size?: LineChartSize;
  /** Hide the printed name above the window. The name still labels the chart for assistive tech. Default false. */
  hideLabel?: boolean;
  /** Your own sentence for the text summary read with the chart. Defaults to one built from the numbers. */
  summary?: string;
  /** Your own words for another language. Defaults are English. */
  words?: LineChartWords;
}

const SHAPES: MarkShape[] = ['circle', 'square', 'diamond'];
const MAX_SERIES = 3;

interface Box {
  w: number;
  h: number;
  em: number;
}

/** One mark. Drawn hollow so the line shows through it; the shape is the cue. */
export function Mark({ shape, x, y, r, className }: {
  /** Which shape to draw: the shape is what tells one series from another. */
  shape: MarkShape;
  /** Centre of the mark across the drawing. */
  x: number;
  /** Centre of the mark down the drawing. */
  y: number;
  /** Half the width of the mark. */
  r: number;
  /** Class name for the drawn shape. */
  className?: string;
}) {
  if (shape === 'square') return <rect className={className} x={x - r} y={y - r} width={2 * r} height={2 * r} />;
  if (shape === 'diamond') {
    const d = r * 1.3;
    return <polygon className={className} points={`${x},${y - d} ${x + d},${y} ${x},${y + d} ${x - d},${y}`} />;
  }
  return <circle className={className} cx={x} cy={y} r={r} />;
}

/** A line chart drawn in ink in a recessed window: one to three lines told apart by pattern and mark, a keyboard cursor with a spoken readout, and a data table for assistive tech. */
export const LineChart = forwardRef<HTMLDivElement, LineChartProps>(function LineChart(
  {
    label,
    categories,
    series,
    unit,
    format,
    zero = false,
    min,
    max,
    ticks,
    index,
    defaultIndex = null,
    onIndexChange,
    size = 'md',
    hideLabel = false,
    summary,
    words,
    className,
    ...rest
  },
  ref,
) {
  const uid = useId();
  const labelId = `${uid}-label`;
  const descId = `${uid}-desc`;
  const readoutId = `${uid}-readout`;
  const w = { ...messages.lineChart, ...words };
  const lines = series.slice(0, MAX_SERIES);
  const n = categories.length;

  const plotRef = useRef<SVGSVGElement>(null);
  const [box, setBox] = useState<Box | null>(null);
  useEffect(() => {
    const el = plotRef.current;
    if (!el) return;
    const read = () => {
      const r = el.getBoundingClientRect();
      const em = parseFloat(getComputedStyle(el).fontSize) || 1;
      setBox((b) => (b && b.w === r.width && b.h === r.height && b.em === em ? b : { w: r.width, h: r.height, em }));
    };
    read();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const controlled = index !== undefined;
  const [inner, setInner] = useState<number | null>(defaultIndex);
  const raw = controlled ? index : inner;
  const active = raw === null || raw === undefined || n === 0 ? null : Math.min(Math.max(raw, 0), n - 1);
  const [announce, setAnnounce] = useState(false);
  const move = useCallback(
    (next: number | null) => {
      if (!controlled) setInner(next);
      onIndexChange?.(next);
    },
    [controlled, onIndexChange],
  );

  const text = (v: number) => (format ? format(v) : formatNumber(v)) + (unit ? ` ${unit}` : '');
  const bare = (v: number) => (format ? format(v) : formatNumber(v));

  // the value axis: round ticks that cover the data (and zero, if asked)
  const all = lines.flatMap((s) => s.values).filter((v) => Number.isFinite(v));
  let lo = all.length ? Math.min(...all) : 0;
  let hi = all.length ? Math.max(...all) : 1;
  if (zero) {
    lo = Math.min(lo, 0);
    hi = Math.max(hi, 0);
  }
  const scale = niceScale(min ?? lo, max ?? hi, ticks ?? (size === 'sm' ? 3 : 5));
  const domainLo = min ?? scale.min;
  const domainHi = max ?? scale.max;
  const tickValues = scale.ticks.filter((t) => t >= domainLo && t <= domainHi);

  // geometry in real pixels: the margins are multiples of the type size, so they follow the tokens
  const g = box && box.w > 0 && box.h > 0 ? box : null;
  const em = g ? g.em : 1;
  const widest = Math.max(1, ...tickValues.map((t) => bare(t).length));
  const mStart = g ? (widest * 0.62 + 1.4) * em : 0;
  const mEnd = em;
  const mTop = em;
  const mBottom = 2.2 * em;
  const pw = g ? Math.max(1, g.w - mStart - mEnd) : 1;
  const ph = g ? Math.max(1, g.h - mTop - mBottom) : 1;
  const xAt = (i: number) => mStart + (n > 1 ? (pw * i) / (n - 1) : pw / 2);
  const yAt = (v: number) => mTop + ph * (1 - (v - domainLo) / (domainHi - domainLo || 1));
  const labelStep = g ? Math.max(1, Math.ceil((n * (Math.max(...categories.map((c) => c.length), 1) * 0.62 + 1) * em) / pw)) : 1;

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (n === 0 || e.altKey || e.ctrlKey || e.metaKey) return;
    const at = active ?? -1;
    let next: number | null | undefined;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = Math.min(n - 1, at + 1);
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = Math.max(0, at < 0 ? n - 1 : at - 1);
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = n - 1;
    else if (e.key === 'Escape') next = null;
    if (next === undefined) return;
    e.preventDefault();
    setAnnounce(true);
    if (next !== active) move(next);
  };
  // a press focuses the window after it has already chosen a point: that focus must not jump to the last one
  const pressed = useRef(false);
  const onFocus = () => {
    if (pressed.current) {
      pressed.current = false;
      return;
    }
    setAnnounce(true);
    if (active === null && n > 0) move(n - 1);
  };
  const atPointer = (e: PointerEvent<HTMLDivElement>) => {
    if (e.type === 'pointerdown') pressed.current = true;
    if (!g || n === 0 || !plotRef.current) return;
    const r = plotRef.current.getBoundingClientRect();
    const f = (e.clientX - r.left - mStart) / pw;
    const i = Math.min(n - 1, Math.max(0, Math.round(f * (n - 1))));
    setAnnounce(false);
    if (i !== active) move(i);
  };
  const onLeave = (e: PointerEvent<HTMLDivElement>) => {
    if (document.activeElement !== e.currentTarget && active !== null) move(null);
  };

  const sentences =
    summary ??
    [
      w.summary(n, lines.length),
      ...lines.map((s) => {
        const st = runStats(s.values);
        return w.seriesSummary(s.label, text(st.first), text(st.last), text(st.low), text(st.high));
      }),
    ].join(' ');

  return (
    <div
      ref={ref}
      data-component="LineChart"
      className={cx(styles.root, styles[size], className)}
      {...rest}
    >
      <span id={labelId} className={styles.label} data-hidden={hideLabel ? '' : undefined}>{label}</span>
      <div
        className={styles.window}
        role="group"
        tabIndex={0}
        aria-roledescription={w.roleDescription}
        aria-labelledby={labelId}
        aria-describedby={`${descId} ${readoutId}`}
        onKeyDown={onKey}
        onFocus={onFocus}
        onBlur={() => {
          pressed.current = false;
        }}
        onPointerMove={atPointer}
        onPointerDown={atPointer}
        onPointerLeave={onLeave}
      >
        <svg ref={plotRef} className={styles.plot} aria-hidden="true" focusable="false" viewBox={g ? `0 0 ${g.w} ${g.h}` : undefined}>
          {g && (
            <>
              {tickValues.map((t) => (
                <g key={t}>
                  <line className={styles.grid} x1={mStart} x2={mStart + pw} y1={yAt(t)} y2={yAt(t)} />
                  <text className={styles.tick} x={mStart - 0.6 * em} y={yAt(t)} dy="0.32em" textAnchor="end">{bare(t)}</text>
                </g>
              ))}
              {categories.map((c, i) =>
                i % labelStep === 0 || i === active ? (
                  <text key={i} className={styles.tick} x={xAt(i)} y={mTop + ph + 1.5 * em} textAnchor="middle">{c}</text>
                ) : null,
              )}
              {active !== null && <line className={styles.cursor} x1={xAt(active)} x2={xAt(active)} y1={mTop} y2={mTop + ph} />}
              {lines.map((s, k) => (
                <g key={k} data-series={k + 1}>
                  <polyline className={styles.line} points={s.values.map((v, i) => `${xAt(i)},${yAt(v)}`).join(' ')} />
                  {s.values.map((v, i) => (
                    <Mark key={i} className={styles.marker} shape={SHAPES[k]} x={xAt(i)} y={yAt(v)} r={(i === active ? 0.5 : 0.32) * em} />
                  ))}
                </g>
              ))}
            </>
          )}
        </svg>
      </div>
      <p
        id={readoutId}
        className={styles.readout}
        role="status"
        aria-live={announce ? 'polite' : 'off'}
        aria-atomic="true"
        data-idle={active === null ? '' : undefined}
      >
        {active === null ? (
          w.hint
        ) : (
          <>
            <strong>{categories[active]}</strong>
            {lines.map((s) => (
              <span key={s.label}>
                {' · '}
                {s.label} {text(s.values[active])}
              </span>
            ))}
          </>
        )}
      </p>
      {lines.length > 1 && (
        <ul className={styles.legend}>
          {lines.map((s, k) => (
            <li key={k} className={styles.key} data-series={k + 1}>
              <svg className={styles.swatch} width="2.4em" height="1em" viewBox="0 0 24 10" aria-hidden="true" focusable="false">
                <line className={styles.line} x1="0" x2="24" y1="5" y2="5" />
                <Mark className={styles.marker} shape={SHAPES[k]} x={12} y={5} r={3} />
              </svg>
              <span className={styles.name}>{s.label}</span>
            </li>
          ))}
        </ul>
      )}
      <p id={descId} className={styles.table}>{sentences}</p>
      <div className={styles.table}>
        <table>
          <caption>{w.tableCaption(label)}</caption>
          <thead>
            <tr>
              <th scope="col">{w.category}</th>
              {lines.map((s) => (
                <th key={s.label} scope="col">{s.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {categories.map((c, i) => (
              <tr key={i}>
                <th scope="row">{c}</th>
                {lines.map((s) => (
                  <td key={s.label}>{text(s.values[i])}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});
