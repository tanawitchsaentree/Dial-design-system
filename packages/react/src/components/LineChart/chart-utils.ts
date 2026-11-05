// Helpers shared by LineChart and Sparkline: a nice-number scale, plain number words and the trend of a run of values.

/** Round a range to a "nice" number (1, 2, 5 times a power of ten), the classic Heckbert method. */
function niceNum(range: number, round: boolean): number {
  const exp = Math.floor(Math.log10(range));
  const f = range / 10 ** exp;
  let nf: number;
  if (round) nf = f < 1.5 ? 1 : f < 3 ? 2 : f < 7 ? 5 : 10;
  else nf = f <= 1 ? 1 : f <= 2 ? 2 : f <= 5 ? 5 : 10;
  return nf * 10 ** exp;
}

export interface NiceScale {
  /** The tick values, low to high. */
  ticks: number[];
  /** The first and last tick: the ends of the value axis. */
  min: number;
  max: number;
}

/** Ticks at round numbers that cover `lo` to `hi`, about `count` of them. */
export function niceScale(lo: number, hi: number, count = 5): NiceScale {
  if (!Number.isFinite(lo) || !Number.isFinite(hi)) return { ticks: [0, 1], min: 0, max: 1 };
  if (lo > hi) [lo, hi] = [hi, lo];
  if (lo === hi) {
    const pad = Math.abs(lo) || 1;
    lo -= pad / 2;
    hi += pad / 2;
  }
  const want = Math.max(2, count);
  const step = niceNum(niceNum(hi - lo, false) / (want - 1), true);
  const min = Math.floor(lo / step) * step;
  const max = Math.ceil(hi / step) * step;
  const digits = Math.max(0, -Math.floor(Math.log10(step)) + 1);
  const ticks: number[] = [];
  for (let v = min; v <= max + step / 2; v += step) ticks.push(Number(v.toFixed(digits)));
  return { ticks, min: ticks[0], max: ticks[ticks.length - 1] };
}

/** A number as plain words: at most two decimals, no trailing zeros. */
export function formatNumber(n: number): string {
  return String(Number(n.toFixed(2)));
}

export interface RunStats {
  first: number;
  last: number;
  low: number;
  high: number;
  trend: 'up' | 'down' | 'flat';
}

/** First, last, lowest and highest of a run of values, and which way it went. */
export function runStats(values: number[]): RunStats {
  const first = values[0];
  const last = values[values.length - 1];
  return {
    first,
    last,
    low: Math.min(...values),
    high: Math.max(...values),
    trend: last > first ? 'up' : last < first ? 'down' : 'flat',
  };
}
