import { forwardRef, type HTMLAttributes, type MouseEvent, type ReactNode } from 'react';
import { cx } from '../../cx';
import styles from './BottomNav.module.css';

export type BottomNavLayout = 'auto' | 'bar' | 'rail';

/** One main section of the app. */
export interface BottomNavItem {
  /** The value that names this section. Pass it as `current` when this section is shown. */
  value: string;
  /** The section word printed under the glyph, such as Rooms. It is the link's accessible name. */
  label: string;
  /** Where the link goes. */
  href: string;
  /** The glyph printed over the word, a 24 by 24 stroke drawing. It is printing only and hidden from assistive tech. */
  icon?: ReactNode;
}

export interface BottomNavProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /** The sections in order, three to five of them. */
  items: BottomNavItem[];
  /** The value of the section on screen now. Its link carries aria-current="page", medium weight and the ink mark. */
  current?: string;
  /** Called when a link is pressed, with its value and the click. Call `event.preventDefault()` to route in the app instead of loading the page. */
  onNavigate?: (value: string, event: MouseEvent<HTMLAnchorElement>) => void;
  /** `auto` (default) prints a strip along the bottom on a screen taller than it is wide and a rail at the inline start otherwise. `bar` and `rail` hold one form. */
  layout?: BottomNavLayout;
  /** Fixes the nav to the screen edge with its safe area, for the app shell. Leave it off to place it yourself. */
  fixed?: boolean;
  /** The accessible name of the navigation landmark. Defaults to "Main". */
  label?: string;
}

/**
 * The app's main sections printed along the bottom edge of the case, glyph over word. The section on
 * screen is set in medium weight with one ink index mark, like Tabs, and is a link with aria-current="page".
 * On a wide screen the strip becomes a printed rail at the inline start.
 */
export const BottomNav = forwardRef<HTMLElement, BottomNavProps>(function BottomNav(
  { items, current, onNavigate, layout = 'auto', fixed = false, label = 'Main', className, ...rest },
  ref,
) {
  return (
    <nav
      ref={ref}
      aria-label={label}
      data-component="BottomNav"
      data-layout={layout}
      className={cx(styles.root, layout === 'rail' && styles.rail, layout === 'auto' && styles.auto, fixed && styles.fixed, className)}
      {...rest}
    >
      <ul className={styles.list}>
        {items.map((it) => {
          const on = it.value === current;
          return (
            <li key={it.value}>
              <a
                href={it.href}
                aria-current={on ? 'page' : undefined}
                data-value={it.value}
                className={styles.link}
                onClick={onNavigate ? (e) => onNavigate(it.value, e) : undefined}
              >
                {it.icon ? <span className={styles.glyph} aria-hidden="true">{it.icon}</span> : null}
                <span className={styles.word}>
                  <span className={styles.text}>{it.label}</span>
                  <span className={styles.ghost} aria-hidden="true">{it.label}</span>
                </span>
                <span className={styles.mark} aria-hidden="true" />
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
});
