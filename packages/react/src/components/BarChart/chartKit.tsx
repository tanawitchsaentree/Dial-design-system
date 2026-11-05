// Shared building blocks for BarChart and PieChart (kept here so neither chart reaches into a shared folder).
// Native SVG only: no chart library. Everything the drawing needs in pixels is read from tokens at run time.
import { useEffect, useId, useLayoutEffect, useRef, useState, type ReactNode, type RefObject } from 'react';

const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/** Token names (without the `--ds-` prefix) the charts read as pixel lengths. */
export const CHART_TOKENS = [
  'gap-xs', 'gap-sm', 'gap-md', 'gap-lg', 'gap-xl', 'gap-2xl', 'gap-3xl',
  'type-caption', 'type-micro', 'type-label', 'layout-frame-xs', 'layout-frame-sm', 'control-md',
] as const;
export type ChartToken = (typeof CHART_TOKENS)[number];

export interface ChartSpace {
  /** Inline size of the drawing frame in pixels. */
  inline: number;
  /** Token lengths in pixels. */
  px: Record<ChartToken, number>;
  /** True when the chart sits in a right-to-left context. */
  rtl: boolean;
}

/** Measures the frame and the token lengths. Returns null until the first measure, so server output draws nothing. */
export function useChartSpace(): { frame: RefObject<HTMLDivElement | null>; space: ChartSpace | null } {
  const frame = useRef<HTMLDivElement>(null);
  const [space, setSpace] = useState<ChartSpace | null>(null);
  useIsoLayoutEffect(() => {
    const el = frame.current;
    if (!el) return undefined;
    const measure = () => {
      const probe = document.createElement('span');
      probe.style.position = 'absolute';
      probe.style.visibility = 'hidden';
      probe.style.display = 'block';
      el.appendChild(probe);
      const px = {} as Record<ChartToken, number>;
      for (const t of CHART_TOKENS) {
        probe.style.inlineSize = `var(--ds-${t})`;
        px[t] = probe.getBoundingClientRect().width;
      }
      probe.remove();
      const next: ChartSpace = { inline: el.clientWidth, px, rtl: getComputedStyle(el).direction === 'rtl' };
      setSpace((prev) => (prev && prev.inline === next.inline && prev.rtl === next.rtl && CHART_TOKENS.every((t) => prev.px[t] === next.px[t]) ? prev : next));
    };
    measure();
    if (typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return { frame, space };
}

/** A fresh id that is safe inside `url(#…)`. */
export function useSvgId(): string {
  return useId().replace(/[^a-zA-Z0-9_-]/g, '');
}

/** Number of distinct patterns before they repeat. */
export const PATTERN_COUNT = 6;
export const patternRef = (id: string, index: number) => `url(#${id}-${index % PATTERN_COUNT})`;

/** The class names a chart's own CSS module gives to the pattern tiles. */
export interface TileClasses { bg: string; ink: string; dot: string; solid: string }

/** Six tiles that differ by texture and not by hue: solid, hatch, dots, lines, cross-hatch and hollow. */
export function PatternDefs({ id, tile, dot, classes }: { id: string; tile: number; dot: number; classes: TileClasses }): ReactNode {
  const ground = <rect width={tile} height={tile} className={classes.bg} />;
  const Tile = ({ n, turn, children }: { n: number; turn?: string; children: ReactNode }) => (
    <pattern id={`${id}-${n}`} width={tile} height={tile} patternUnits="userSpaceOnUse" patternTransform={turn}>{children}</pattern>
  );
  return (
    <defs>
      <Tile n={0}><rect width={tile} height={tile} className={classes.solid} /></Tile>
      <Tile n={1} turn="rotate(45)">{ground}<line x1={0} y1={0} x2={0} y2={tile} className={classes.ink} /></Tile>
      <Tile n={2}>{ground}<circle cx={tile / 2} cy={tile / 2} r={dot} className={classes.dot} /></Tile>
      <Tile n={3}>{ground}<line x1={0} y1={tile / 2} x2={tile} y2={tile / 2} className={classes.ink} /></Tile>
      <Tile n={4} turn="rotate(45)">{ground}<line x1={0} y1={0} x2={0} y2={tile} className={classes.ink} /><line x1={0} y1={0} x2={tile} y2={0} className={classes.ink} /></Tile>
      <Tile n={5}>{ground}</Tile>
    </defs>
  );
}

/** The plain number printed on a mark, rounded to two decimals. */
export const plain = (v: number) => String(Number(v.toFixed(2)));

/** A round scale: the top value, and the ticks from zero to it, with at most `count` steps. */
export function niceScale(max: number, count = 4): { top: number; ticks: number[] } {
  const safe = Number.isFinite(max) && max > 0 ? max : 1;
  const raw = safe / count;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const norm = raw / mag;
  const mult = norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 2.5 ? 2.5 : norm <= 5 ? 5 : 10;
  const step = mult * mag;
  const steps = Math.ceil(safe / step - 1e-9);
  return { top: steps * step, ticks: Array.from({ length: steps + 1 }, (_, i) => Number((i * step).toFixed(10))) };
}

/** A guess of a printed string's width, from its length and the font size. Used only to reserve room. */
export const GLYPH_EM = 0.6;
export const textWidth = (text: string, size: number) => text.length * size * GLYPH_EM;

/** Cuts a string with an ellipsis so it fits in `room` pixels at `size`. */
export function fit(text: string, room: number, size: number): string {
  const max = Math.max(1, Math.floor(room / (size * GLYPH_EM)));
  return text.length <= max ? text : `${text.slice(0, Math.max(1, max - 1))}…`;
}

export const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
