import { forwardRef, type SVGAttributes } from 'react';
import { cx } from '../../cx';
import { ICON_GLYPHS, ICON_GRID, type IconName } from './glyphs';
import styles from './Icon.module.css';

export type IconSize = 'sm' | 'md' | 'lg';

export interface IconProps extends Omit<SVGAttributes<SVGSVGElement>, 'children' | 'role' | 'fill'> {
  /** Which glyph to print, from dial's set (see `IconName`). Changing it morphs the dots from one glyph to the next. */
  name: IconName;
  /** `sm` is control.icon-sm (16px) and draws its dots larger so they keep their contrast; `md` (default) is control.icon-md (20px), the glyph on a key; `lg` is 24px. */
  size?: IconSize;
  /** A name for assistive tech. With a label the glyph is role img and named; without one it is hidden, because the key or the word beside it carries the meaning. */
  label?: string;
}

// One dot cell is 3 units: a dot of radius 1 (two thirds of the pitch, the Grille's 8 on 12) centred in it.
// At 16px the radius grows to 1.2 (four fifths of the pitch), measured in apps/lab/icon so every dot holds 3:1.
const PITCH = 3;
const RADIUS: Record<IconSize, number> = { sm: 1.2, md: 1, lg: 1 };
const cache = new Map<string, string>();

/** The glyph as one path of round dots (for drawings that need a single node, such as a CSS mask). */
export function iconPath(name: IconName, size: IconSize = 'md'): string {
  const key = `${name}:${size}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const r = RADIUS[size];
  let d = '';
  ICON_GLYPHS[name].forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      if (row[x] !== '#') continue;
      const cx0 = Math.round((x * PITCH + PITCH / 2 - r) * 100) / 100, cy = y * PITCH + PITCH / 2;
      d += `M${cx0} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`;
    }
  });
  cache.set(key, d);
  return d;
}

const CELLS = Array.from({ length: ICON_GRID * ICON_GRID }, (_, i) => ({ x: i % ICON_GRID, y: Math.floor(i / ICON_GRID) }));

/**
 * A glyph from dial's set, printed as round dots on the Grille's grid in currentColor. Every hole of the 7 × 7
 * field is drawn and only the glyph's own holes are lit, so a new `name` morphs: dots the two glyphs share stay,
 * the others sink back into their holes or rise out of them (D-008, R-008). Hidden from assistive tech unless
 * it has a label.
 */
export const Icon = forwardRef<SVGSVGElement, IconProps>(function Icon(
  { name, size = 'md', label, className, ...rest },
  ref,
) {
  const box = ICON_GRID * PITCH;
  const r = RADIUS[size];
  const glyph = ICON_GLYPHS[name];
  const a11y = label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true };
  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${box} ${box}`}
      focusable="false"
      data-component="Icon"
      data-name={name}
      data-size={size}
      className={cx(styles.root, styles[size], className)}
      {...a11y}
      {...rest}
    >
      {CELLS.map(({ x, y }) => (
        <circle key={`${x}-${y}`} className={styles.dot} cx={x * PITCH + PITCH / 2} cy={y * PITCH + PITCH / 2} r={r} data-on={glyph[y][x] === '#' ? '' : undefined} />
      ))}
    </svg>
  );
});
