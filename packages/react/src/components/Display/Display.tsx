import { forwardRef, type HTMLAttributes } from 'react';
import { cx } from '../../cx';
import styles from './Display.module.css';

export type DisplayKind = 'lcd' | 'oled';
export type DisplaySize = 'sm' | 'md' | 'lg';

export interface DisplayProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'role'> {
  /** `lcd` (default) draws the value as dark 7-segment digits on grey-green; `oled` sets it in white grotesk on near-black. */
  kind?: DisplayKind;
  /** The reading, as text. On `lcd` the digits 0 to 9, a minus, a space, a decimal point and a few letters (A b C d E F H L n o P r t U) are drawn as segments. */
  value: string;
  /** The unit printed beside the value, such as °C, min or MHz. */
  unit?: string;
  /** One short line of detail with the value, such as "Heating to 22.0" or "Rinse". */
  detail?: string;
  /** The accessible name of the window, such as "Thermostat". The window is announced politely when its reading changes. */
  label: string;
  /** `sm` 24px digits, `md` (default) 40px digits, `lg` 56px digits; on `oled` the value line steps with it. */
  size?: DisplaySize;
  /** The number of digit cells, on `lcd` only. Shorter values are padded on the left with unlit cells, so the window never changes width. */
  digits?: number;
}

// Segment letters a–g, clockwise from the top bar, g in the middle.
const SEGS: Record<string, string> = {
  '0': 'abcdef', '1': 'bc', '2': 'abged', '3': 'abgcd', '4': 'fgbc', '5': 'afgcd', '6': 'afgedc', '7': 'abc', '8': 'abcdefg', '9': 'abcdfg',
  '-': 'g', '_': 'd', ' ': '', A: 'abcefg', b: 'cdefg', C: 'adef', c: 'deg', d: 'bcdeg', E: 'adefg', F: 'aefg', H: 'bcefg', h: 'cefg',
  L: 'def', n: 'ceg', o: 'cdeg', P: 'abefg', r: 'eg', t: 'defg', U: 'bcdef', u: 'cde',
};
const segsFor = (ch: string) => SEGS[ch] ?? SEGS[ch.toUpperCase()] ?? SEGS[ch.toLowerCase()] ?? '';

// Geometry in viewBox units (height 40): cell 20 wide, stroke 4.4, pitch 32, decimal point in the gap.
const H = 40, W = 20, T = 4.4, PITCH = 32, M = H / 2, S = T / 2;
const hBar = (x: number, y: number) => `${x + S},${y} ${x + T},${y - S} ${x + W - T},${y - S} ${x + W - S},${y} ${x + W - T},${y + S} ${x + T},${y + S}`;
const vBar = (x: number, y0: number, y1: number) => `${x},${y0 + S} ${x + S},${y0 + T} ${x + S},${y1 - T} ${x},${y1 - S} ${x - S},${y1 - T} ${x - S},${y0 + T}`;
const cellPoints = (x: number): Array<[string, string]> => [
  ['a', hBar(x, S)], ['b', vBar(x + W - S, S, M)], ['c', vBar(x + W - S, M, H - S)], ['d', hBar(x, H - S)],
  ['e', vBar(x + S, M, H - S)], ['f', vBar(x + S, S, M)], ['g', hBar(x, M)],
];

/** Splits a reading into tabular cells; a decimal point lights the point of the cell before it. */
function toCells(value: string, digits?: number) {
  const cells: Array<{ ch: string; dp: boolean }> = [];
  for (const ch of value) {
    if ((ch === '.' || ch === ',') && cells.length) cells[cells.length - 1].dp = true;
    else cells.push({ ch, dp: false });
  }
  while (digits && cells.length < digits) cells.unshift({ ch: ' ', dp: false });
  return cells;
}

function Segments({ value, digits }: { value: string; digits?: number }) {
  const cells = toCells(value, digits);
  return (
    <svg className={styles.seg} viewBox={`0 0 ${cells.length * PITCH} ${H}`} aria-hidden="true" focusable="false">
      {cells.map((c, i) => {
        const x = 2 + i * PITCH, on = segsFor(c.ch);
        return (
          <g key={i}>
            {cellPoints(x).map(([k, pts]) => <polygon key={k} className={on.includes(k) ? styles.on : styles.off} points={pts} />)}
            <rect className={c.dp ? styles.on : styles.off} x={x + W + 2} y={H - T} width={T} height={T} />
          </g>
        );
      })}
    </svg>
  );
}

/** The window that says what the device is doing now: recessed into the body, announced politely, never a control. */
export const Display = forwardRef<HTMLDivElement, DisplayProps>(function Display(
  { kind = 'lcd', value, unit, detail, label, size = 'md', digits, className, ...rest },
  ref,
) {
  const reading = `${value.trim()}${unit ? ` ${unit}` : ''}${detail ? `. ${detail}` : ''}`;
  return (
    <div
      ref={ref}
      role="status"
      aria-live="polite"
      aria-atomic="true"
      aria-label={label}
      data-component="Display"
      data-kind={kind}
      data-glow={kind === 'oled' ? 'soft' : undefined}
      className={cx(styles.root, styles[kind], styles[size], className)}
      {...rest}
    >
      <span className={styles.reading}>{reading}</span>
      <span className={styles.face} aria-hidden="true">
        {kind === 'lcd' ? (
          <>
            {detail && <span className={styles.detail}>{detail}</span>}
            <span className={styles.line}>
              <Segments value={value} digits={digits} />
              {unit && <span className={styles.unit}>{unit}</span>}
            </span>
          </>
        ) : (
          <>
            <span className={styles.line}>
              {value}
              {unit && <span className={styles.unit}>{unit}</span>}
            </span>
            {detail && <span className={styles.detail}>{detail}</span>}
          </>
        )}
      </span>
    </div>
  );
});
