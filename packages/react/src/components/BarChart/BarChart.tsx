import { forwardRef, useState, type CSSProperties, type HTMLAttributes, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react';
import { cx } from '../../cx';
import { messages } from '../../messages';
import styles from './BarChart.module.css';
import { PatternDefs, clamp, fit, niceScale, patternRef, plain, textWidth, useChartSpace, useSvgId } from './chartKit';

/** One series of bars: a name, and one value for each category in the same order. */
export interface BarSeries {
  /** The series name, printed in the legend and read out with each of its bars. */
  name: string;
  /** One value for each category, in the order of `categories`. Negative or missing values draw as zero. */
  values: number[];
}

/** The words the chart speaks on its own. Pass a few to translate or reword them. */
export interface BarChartWords {
  /** The kind of object the chart is, read by assistive tech. Default "Bar chart". */
  roleDescription?: string;
  /** The line shown under the chart before a bar is active. Default "Use the arrow keys to move between bars." */
  hint?: string;
  /** The heading of the first column in the hidden table. Default "Category". */
  category?: string;
  /** Builds the readout for the active bar from its category, its series name and its formatted value. */
  readout?: (category: string, series: string, value: string) => string;
}

export interface BarChartProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'role' | 'onChange'> {
  /** What the chart shows, such as "Energy by day". Printed above the window and used as its accessible name. */
  label: ReactNode;
  /** The category names, one for each group of bars. */
  categories: string[];
  /** The series. Each series gets its own pattern and one bar in every category. */
  series: BarSeries[];
  /** Whether the bars rise from the bottom or run from the start edge. Default "vertical". */
  orientation?: 'vertical' | 'horizontal';
  /** The value the scale must reach. Rounded up to a round number. Default: the largest value. */
  max?: number;
  /** Block size of the drawing in pixels. Default: the layout frame size for a vertical chart, and enough rows for a horizontal one. */
  height?: number;
  /** Print each bar's value on it. Values that do not fit the bar's width are left to the readout. Default true. */
  showValues?: boolean;
  /** Turns a value into the text said in the readout and listed in the table, for example `(v) => v + ' kWh'`. */
  formatValue?: (value: number) => string;
  /** Turns a value into the short text printed on its bar. Defaults to the plain number, so the unit goes in the title and the bars stay narrow. */
  formatMark?: (value: number) => string;
  /** Turns a scale value into the text printed on the value axis. Defaults to the plain number. */
  formatTick?: (value: number) => string;
  /** The words the chart speaks. Each one has an English default. */
  words?: BarChartWords;
  /** Called with the category and series index when a bar becomes active, from the keys or a pointer. */
  onActiveChange?: (category: number, series: number) => void;
}

/** A grouped bar chart in native SVG: a ruled scale in a recessed window, a patterned bar for each series,
 *  every value printed on its bar, arrow-key navigation with a live readout, and a hidden table of the data. */
export const BarChart = forwardRef<HTMLDivElement, BarChartProps>(function BarChart(
  {
    label, categories, series, orientation = 'vertical', max, height, showValues = true,
    formatValue = plain, formatMark = plain, formatTick = plain, words, onActiveChange, className, style, ...rest
  },
  ref,
) {
  const w = { ...messages.barChart, ...words };
  const uid = useSvgId();
  const titleId = `${uid}-title`;
  const readoutId = `${uid}-readout`;
  const { frame, space } = useChartSpace();
  const [active, setActive] = useState<[number, number] | null>(null);
  const horizontal = orientation === 'horizontal';
  const n = categories.length;
  const count = series.length;
  const valueAt = (c: number, s: number) => {
    const v = series[s]?.values[c];
    return typeof v === 'number' && Number.isFinite(v) ? Math.max(0, v) : 0;
  };
  const top = max ?? Math.max(0, ...series.flatMap((s, si) => categories.map((_, c) => valueAt(c, si))));
  const scale = niceScale(top);
  const now = active && active[0] < n && active[1] < count ? active : null;

  const pick = (c: number, s: number) => {
    const next: [number, number] = [clamp(c, 0, Math.max(0, n - 1)), clamp(s, 0, Math.max(0, count - 1))];
    if (active && active[0] === next[0] && active[1] === next[1]) return;
    setActive(next);
    onActiveChange?.(next[0], next[1]);
  };

  // ---- geometry, in pixels, from token lengths measured at run time ----
  let blockSize = 0;
  const marks: Array<{ c: number; s: number; x: number; y: number; inline: number; block: number; vx: number; vy: number; anchor: 'start' | 'middle'; show: boolean }> = [];
  const ticks: Array<{ text: string; x: number; y: number; anchor: 'start' | 'end' | 'middle'; line: [number, number, number, number]; base: boolean }> = [];
  const cats: Array<{ text: string; x: number; y: number; anchor: 'start' | 'end' | 'middle' }> = [];
  const bands: Array<{ c: number; x: number; y: number; inline: number; block: number }> = [];
  if (space && n > 0 && count > 0) {
    const { px } = space;
    const W = space.inline;
    const cap = px['type-caption'];
    const xs = px['gap-xs'];
    const md = px['gap-md'];
    const lg = px['gap-lg'];
    const line = cap * 1.5;
    const tickText = scale.ticks.map(formatTick);
    const valueText = (c: number, s: number) => formatMark(valueAt(c, s));
    const widest = Math.max(...tickText.map((t) => textWidth(t, cap)));
    const edge = (x: number, size: number) => (space.rtl ? W - x - size : x);
    const at = (x: number) => (space.rtl ? W - x : x);
    if (!horizontal) {
      blockSize = height ?? px['layout-frame-sm'];
      const left = widest + 2 * md;
      const right = W - md;
      const winTop = xs;
      const plotTop = winTop + (showValues ? line + xs : lg);
      const winBottom = blockSize - line - md;
      const base = winBottom - md;
      const y = (v: number) => base - (v / scale.top) * (base - plotTop);
      const band = (right - left) / n;
      const barSize = Math.max(xs, (band - 2 * lg - (count - 1) * xs) / count);
      const group = count * barSize + (count - 1) * xs;
      scale.ticks.forEach((t, i) => {
        ticks.push({ text: tickText[i], x: at(left - md), y: y(t), anchor: space.rtl ? 'start' : 'end', line: [at(left), y(t), at(right), y(t)], base: t === 0 });
      });
      categories.forEach((name, c) => {
        const x0 = left + c * band;
        bands.push({ c, x: edge(x0, band), y: winTop, inline: band, block: winBottom - winTop });
        cats.push({ text: fit(name, band - xs, cap), x: at(x0 + band / 2), y: winBottom + md + cap, anchor: 'middle' });
        series.forEach((_, s) => {
          const bx = x0 + (band - group) / 2 + s * (barSize + xs);
          const by = y(valueAt(c, s));
          const label = valueText(c, s);
          marks.push({ c, s, x: edge(bx, barSize), y: by, inline: barSize, block: base - by, vx: at(bx + barSize / 2), vy: by - xs, anchor: 'middle', show: showValues && textWidth(label, cap) <= barSize + lg });
        });
      });
    } else {
      const names = categories.map((name) => name);
      const catRoom = Math.min(Math.max(...names.map((t) => textWidth(t, cap))) + 2 * md, W * 0.4);
      const valueRoom = showValues ? Math.max(...categories.flatMap((_, c) => series.map((__, s) => textWidth(valueText(c, s), cap)))) + md : lg;
      const bar = px['gap-2xl'];
      const winTop = xs;
      const tickRoom = line + lg;
      const groupH = height ? (height - winTop - tickRoom) / n : count * bar + (count - 1) * xs + 2 * md;
      blockSize = height ?? winTop + n * groupH + tickRoom;
      const barSize = Math.min(bar, (groupH - 2 * md - (count - 1) * xs) / count);
      const group = count * barSize + (count - 1) * xs;
      const left = catRoom;
      const base = left + md;
      const right = W - valueRoom;
      const x = (v: number) => base + (v / scale.top) * (right - base);
      const winBottom = winTop + n * groupH;
      scale.ticks.forEach((t, i) => {
        ticks.push({ text: tickText[i], x: at(x(t)), y: winBottom + md + cap, anchor: 'middle', line: [at(x(t)), winTop, at(x(t)), winBottom], base: t === 0 });
      });
      categories.forEach((name, c) => {
        const y0 = winTop + c * groupH;
        bands.push({ c, x: edge(left, W - left), y: y0, inline: W - left, block: groupH });
        cats.push({ text: fit(name, catRoom - md, cap), x: at(left - md), y: y0 + groupH / 2, anchor: space.rtl ? 'start' : 'end' });
        series.forEach((_, s) => {
          const by = y0 + (groupH - group) / 2 + s * (barSize + xs);
          const len = x(valueAt(c, s)) - base;
          marks.push({ c, s, x: edge(base, len), y: by, inline: len, block: barSize, vx: at(base + len + xs), vy: by + barSize / 2, anchor: 'middle', show: showValues });
        });
      });
    }
  }

  const move = (e: KeyboardEvent<SVGSVGElement>) => {
    const rtl = space?.rtl ?? false;
    const step = rtl ? -1 : 1;
    let [c, s] = now ?? [0, 0];
    switch (e.key) {
      case 'ArrowRight': if (horizontal) s += step; else c += step; break;
      case 'ArrowLeft': if (horizontal) s -= step; else c -= step; break;
      case 'ArrowDown': if (horizontal) c += 1; else s += 1; break;
      case 'ArrowUp': if (horizontal) c -= 1; else s -= 1; break;
      case 'Home': c = 0; break;
      case 'End': c = n - 1; break;
      default: return;
    }
    e.preventDefault();
    pick(c, s);
  };
  const point = (e: PointerEvent<SVGRectElement>, c: number) => {
    const box = e.currentTarget.getBoundingClientRect();
    const along = horizontal ? e.clientY - box.y : space?.rtl ? box.x + box.width - e.clientX : e.clientX - box.x;
    const whole = [box.width, box.height][horizontal ? 1 : 0];
    pick(c, clamp(Math.floor((along / whole) * count), 0, count - 1));
  };

  const readout = now ? w.readout(categories[now[0]], series[now[1]].name, formatValue(valueAt(now[0], now[1]))) : w.hint;
  const sizing = space && blockSize ? ({ '--h': `calc(${blockSize}px + 2 * var(--ds-width-hairline))` } as CSSProperties) : undefined;

  return (
    <div
      ref={ref}
      data-component="BarChart"
      data-orientation={orientation}
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
            onFocus={() => { if (!now) pick(0, 0); }}
          >
            <PatternDefs id={uid} tile={space.px['gap-lg']} dot={space.px['gap-xs'] / 2} classes={{ bg: styles.tileBg, ink: styles.tileInk, dot: styles.tileDot, solid: styles.tileSolid }} />
            <g aria-hidden="true">
              {ticks.map((t) => (
                <g key={t.text + t.line.join()}>
                  <line className={t.base ? styles.base : styles.grid} x1={t.line[0]} y1={t.line[1]} x2={t.line[2]} y2={t.line[3]} />
                  <text className={styles.tick} x={t.x} y={t.y} textAnchor={t.anchor}>{t.text}</text>
                </g>
              ))}
              {cats.map((t, i) => (
                <text key={i} className={styles.cat} x={t.x} y={t.y} textAnchor={t.anchor} dominantBaseline={horizontal ? 'central' : undefined}>{t.text}</text>
              ))}
              {marks.map((m) => {
                const on = !!now && now[0] === m.c && now[1] === m.s;
                return (
                  <g key={`${m.c}-${m.s}`}>
                    <rect
                      className={styles.bar}
                      data-active={on ? '' : undefined}
                      x={m.x}
                      y={m.y}
                      width={m.inline}
                      height={m.block}
                      fill={patternRef(uid, m.s)}
                    />
                    {on && <rect className={styles.focusMark} x={m.x - space.px['gap-xs']} y={m.y - space.px['gap-xs']} width={m.inline + 2 * space.px['gap-xs']} height={m.block + 2 * space.px['gap-xs']} />}
                    {m.show && (
                      <text className={styles.value} x={m.vx} y={m.vy} textAnchor={horizontal ? (space.rtl ? 'end' : 'start') : m.anchor} dominantBaseline={horizontal ? 'central' : undefined}>
                        {formatMark(valueAt(m.c, m.s))}
                      </text>
                    )}
                  </g>
                );
              })}
              {bands.map((b) => (
                <rect key={b.c} className={styles.hit} x={b.x} y={b.y} width={b.inline} height={b.block} onPointerDown={(e) => point(e, b.c)} onPointerMove={(e) => point(e, b.c)} />
              ))}
            </g>
          </svg>
        )}
      </div>
      {count > 1 && (
        <ul className={styles.legend}>
          {series.map((s, i) => (
            <li key={s.name} className={styles.key}>
              <svg className={styles.swatch} aria-hidden="true" focusable="false">
                <rect width="100%" height="100%" fill={patternRef(uid, i)} />
              </svg>
              <span className={styles.name}>{s.name}</span>
            </li>
          ))}
        </ul>
      )}
      <p id={readoutId} className={styles.readout} aria-live="polite" data-idle={now ? undefined : ''}>{readout}</p>
      <div className={styles.table}>
      <table>
        <caption>{label}</caption>
        <thead>
          <tr>
            <th scope="col">{w.category}</th>
            {series.map((s) => <th key={s.name} scope="col">{s.name}</th>)}
          </tr>
        </thead>
        <tbody>
          {categories.map((name, c) => (
            <tr key={name}>
              <th scope="row">{name}</th>
              {series.map((s, si) => <td key={s.name}>{formatValue(valueAt(c, si))}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
});
