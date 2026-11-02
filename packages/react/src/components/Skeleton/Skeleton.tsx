import { forwardRef, type CSSProperties, type HTMLAttributes } from 'react';
import { cx } from '../../cx';
import styles from './Skeleton.module.css';

export type SkeletonKind = 'text' | 'display' | 'grille' | 'disc' | 'block';
export type SkeletonSize = 'sm' | 'md' | 'lg';

export interface SkeletonProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** What is still loading. `text` (default) is lines of text, `display` a Display reading, `grille` a Grille meter, `disc` a key or knob, `block` a chart or picture area. */
  kind?: SkeletonKind;
  /** Matches the size of the part that will replace it. For `text` it is caption, body (default) or title type. For `display` it is 24, 40 or 56px digits. For `disc` it is a 44, 72 or 108px part. */
  size?: SkeletonSize;
  /** The number of text lines, on `text` only. Default 1. */
  lines?: number;
  /** The width of the last text line as a share of the others, from 0 to 1. Default 1 for one line and 0.6 for more. */
  lastLine?: number;
  /** The inline size of a `text` placeholder, or the diameter of a `disc` or the block size of a `block`, in px or any CSS length. */
  extent?: number | string;
  /** The number of digit cells, on `display` only. Use the `digits` of the Display it stands for. Default 4. */
  digits?: number;
  /** The unit the Display will print, on `display` only. It is kept hidden, so the window reserves its width. */
  unit?: string;
  /** Reserves the Display's detail line, on `display` only. */
  detail?: boolean;
  /** The grille's columns, on `grille` only. Use the `cols` of the Grille it stands for. Default 6. */
  cols?: number;
  /** The grille's rows, on `grille` only. Default 3. */
  rows?: number;
}

// Display's segment geometry (viewBox units, cell height 40, pitch 32), so the ghost window is the lit window's width.
const H = 40, W = 20, T = 4.4, PITCH = 32, M = H / 2, S = T / 2;
const hBar = (x: number, y: number) => `${x + S},${y} ${x + T},${y - S} ${x + W - T},${y - S} ${x + W - S},${y} ${x + W - T},${y + S} ${x + T},${y + S}`;
const vBar = (x: number, y0: number, y1: number) => `${x},${y0 + S} ${x + S},${y0 + T} ${x + S},${y1 - T} ${x},${y1 - S} ${x - S},${y1 - T} ${x - S},${y0 + T}`;
const cell = (x: number) => [hBar(x, S), vBar(x + W - S, S, M), vBar(x + W - S, M, H - S), hBar(x, H - S), vBar(x + S, M, H - S), vBar(x + S, S, M), hBar(x, M)];

const DISC: Record<SkeletonSize, number> = { sm: 44, md: 72, lg: 108 };
const BLOCK: Record<SkeletonSize, number> = { sm: 48, md: 96, lg: 160 };
const len = (v: number | string | undefined) => (typeof v === 'number' ? `${v}px` : v);

/** The shape of a part that is still loading, drawn as that part with the power off. It never moves and is
 *  hidden from assistive tech: put `aria-busy="true"` on the region it stands in, and give that region its name. */
export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(function Skeleton(
  { kind = 'text', size = 'md', lines = 1, lastLine, extent, digits = 4, unit, detail = false, cols = 6, rows = 3, className, style, ...rest },
  ref,
) {
  const common = { ref, 'aria-hidden': true as const, 'data-component': 'Skeleton', 'data-kind': kind, ...rest };
  if (kind === 'text') {
    const n = Math.max(1, Math.round(lines));
    const last = Math.min(1, Math.max(0.1, lastLine ?? (n > 1 ? 0.6 : 1)));
    const vars = { '--skeleton-last': `${last * 100}%`, ...(extent !== undefined ? { '--skeleton-size': len(extent) } : {}), ...style } as CSSProperties;
    return (
      <div {...common} className={cx(styles.root, styles.text, styles[size], className)} style={vars}>
        {Array.from({ length: n }, (_, i) => <span key={i} className={styles.line} />)}
      </div>
    );
  }
  if (kind === 'display') {
    const n = Math.max(1, Math.round(digits));
    return (
      <div {...common} className={cx(styles.display, styles[size], className)} style={style}>
        <span className={styles.face}>
          {detail && <span className={styles.detail}>&nbsp;</span>}
          <span className={styles.value}>
            <svg className={styles.cells} viewBox={`0 0 ${n * PITCH} ${H}`} focusable="false">
              {Array.from({ length: n }, (_, i) => {
                const x = 2 + i * PITCH;
                return (
                  <g key={i}>
                    {cell(x).map((pts, k) => <polygon key={k} className={styles.ghost} points={pts} />)}
                    <rect className={styles.ghost} x={x + W + 2} y={H - T} width={T} height={T} />
                  </g>
                );
              })}
            </svg>
            {unit && <span className={styles.unit}>{unit}</span>}
          </span>
        </span>
      </div>
    );
  }
  if (kind === 'grille') {
    const c = Math.max(1, Math.round(cols));
    const count = c * Math.max(1, Math.round(rows));
    return (
      <div {...common} className={cx(styles.root, styles.grille, className)} style={{ '--skeleton-cols': c, ...style } as CSSProperties}>
        {Array.from({ length: count }, (_, i) => <span key={i} className={styles.hole} />)}
      </div>
    );
  }
  const box = len(extent ?? (kind === 'disc' ? DISC[size] : BLOCK[size]));
  return <div {...common} className={cx(kind === 'disc' ? styles.disc : styles.block, styles[size], className)} style={{ '--skeleton-size': box, ...style } as CSSProperties} />;
});
