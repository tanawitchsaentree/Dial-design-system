'use client';
import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type HTMLAttributes,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from 'react';
import { cx } from '../../cx';
import { messages } from '../../messages';
import { useIsoLayoutEffect } from '../../spring';
import { Button } from '../Button';
import { Drawer } from '../Drawer';
import { VisuallyHidden } from '../VisuallyHidden';
import styles from './AppShell.module.css';

export type AppShellBreakpoint = 'sm' | 'md' | 'lg' | 'xl';

/** What `AppShell` hands to a `header` function. */
export interface AppShellHeaderState {
  /** `true` while the shell is narrower than `breakpoint` and the side column lives in a Drawer. */
  compact: boolean;
  /** Whether the Drawer is open. Pass it to `Navbar` as `menuOpen`. */
  menuOpen: boolean;
  /** Opens the Drawer. Pass it to `Navbar` as `onMenuPress` while `compact`. */
  openMenu: () => void;
}

export interface AppShellProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'title'> {
  /** The page itself. It is rendered inside the `main` landmark, which is where the skip link and `focusKey` send focus. */
  children?: ReactNode;
  /** The top unit, usually a `Navbar` (which is the banner landmark itself). Pass a function to get `compact`, `menuOpen` and `openMenu`, so the Navbar's Menu key can open the Drawer. */
  header?: ReactNode | ((state: AppShellHeaderState) => ReactNode);
  /** The side column, usually a `Sidebar`. At and above `breakpoint` it stands at the inline start; below it, it moves into a Drawer. */
  sidebar?: ReactNode;
  /** The bottom unit. It is rendered in a `footer` landmark. Leave it out for none. */
  footer?: ReactNode;
  /** The width, as a breakpoint token, under which the side column folds into a Drawer. The shell measures its own width with a ResizeObserver, not the window's. Default `md` (768px). */
  breakpoint?: AppShellBreakpoint;
  /** Hold the header at the top edge while the page scrolls. Default `false`. */
  stickyHeader?: boolean;
  /** Any value that changes on navigation, such as the router's pathname. When it changes, focus moves to `main` and an open Drawer closes. It is ignored on first render. */
  focusKey?: unknown;
  /** Controlled: whether the Drawer is open. Pair it with `onMenuOpenChange`. */
  menuOpen?: boolean;
  /** Uncontrolled: whether the Drawer starts open. Default `false`. */
  defaultMenuOpen?: boolean;
  /** Called with the new state when the Drawer opens or asks to close. */
  onMenuOpenChange?: (open: boolean) => void;
  /** The text of the skip link, the first stop for the keyboard. Pass your own for another language. Defaults to "Skip to main content". */
  skipLabel?: string;
  /** The Drawer's title and the name of the built-in Menu key. Pass your own for another language. Defaults to "Menu". */
  menuLabel?: string;
  /** Class name for the shell. */
  className?: string;
}

/**
 * The frame of a screen. Header, side column, main and footer are separate units on the page ground. The side
 * column folds into a Drawer when the shell is narrower than `breakpoint`; a skip link and `focusKey` send focus
 * to `main`. It composes `Navbar`, `Sidebar` and `Drawer` and owns none of their looks.
 */
export const AppShell = forwardRef<HTMLDivElement, AppShellProps>(function AppShell(
  {
    children,
    header,
    sidebar,
    footer,
    breakpoint = 'md',
    stickyHeader = false,
    focusKey,
    menuOpen: menuOpenProp,
    defaultMenuOpen = false,
    onMenuOpenChange,
    skipLabel = messages.appShell.skip,
    menuLabel = messages.appShell.menu,
    className,
    ...rest
  },
  ref,
) {
  const root = useRef<HTMLDivElement | null>(null);
  const main = useRef<HTMLElement | null>(null);
  const mainId = useId();
  const [compact, setCompact] = useState(false);
  const [inner, setInner] = useState(defaultMenuOpen);
  const controlled = menuOpenProp !== undefined;
  const menuOpen = controlled ? menuOpenProp : inner;

  const setRoot = useCallback(
    (node: HTMLDivElement | null) => {
      root.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) ref.current = node;
    },
    [ref],
  );

  const setMenuOpen = useCallback(
    (next: boolean) => {
      if (!controlled) setInner(next);
      onMenuOpenChange?.(next);
    },
    [controlled, onMenuOpenChange],
  );

  // Measure the shell itself, so a shell in a narrow pane folds although the window is wide.
  useIsoLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const measure = () => {
      const limit = parseFloat(getComputedStyle(el).getPropertyValue(`--ds-breakpoint-${breakpoint}`));
      setCompact(Number.isFinite(limit) && el.getBoundingClientRect().width < limit);
    };
    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [breakpoint]);

  const hasSide = sidebar != null && sidebar !== false;
  const folded = hasSide && compact;

  // A drawer left open while the column is back inline would hold a second copy of the nav.
  useEffect(() => {
    if (!folded && menuOpen) setMenuOpen(false);
    // only when the column stops being folded
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [folded]);

  // A route change moves focus to main (not on first render) and closes the Drawer.
  const seen = useRef(focusKey);
  useEffect(() => {
    if (Object.is(seen.current, focusKey)) return;
    seen.current = focusKey;
    if (menuOpen) setMenuOpen(false);
    main.current?.focus();
    // menuOpen and setMenuOpen are read at the moment the key changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusKey]);

  const openMenu = useCallback(() => setMenuOpen(true), [setMenuOpen]);
  const top = typeof header === 'function' ? header({ compact: folded, menuOpen, openMenu }) : header;
  const ownKey = folded && typeof header !== 'function';

  const skip = (e: ReactMouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    main.current?.focus();
  };

  return (
    <div ref={setRoot} data-component="AppShell" className={cx(styles.root, className)} {...rest}>
      <VisuallyHidden focusable asChild>
        <a href={`#${mainId}`} onClick={skip}>{skipLabel}</a>
      </VisuallyHidden>
      {top != null && top !== false ? (
        <div data-part="header" data-sticky={stickyHeader ? '' : undefined} className={styles.header}>{top}</div>
      ) : null}
      {ownKey ? (
        <div data-part="trigger" className={styles.trigger}>
          <Button aria-haspopup="dialog" aria-expanded={menuOpen} onClick={() => setMenuOpen(true)}>{menuLabel}</Button>
        </div>
      ) : null}
      <div data-part="body" data-layout={hasSide && !compact ? 'split' : 'single'} className={styles.body}>
        {hasSide && !compact ? <div data-part="side" className={styles.side}>{sidebar}</div> : null}
        <main ref={main} id={mainId} tabIndex={-1} data-part="main" className={styles.main}>{children}</main>
      </div>
      {footer != null && footer !== false ? <footer data-part="footer" className={styles.footer}>{footer}</footer> : null}
      {folded ? (
        <Drawer side="start" title={menuLabel} open={menuOpen} onOpenChange={setMenuOpen}>
          {sidebar}
        </Drawer>
      ) : null}
    </div>
  );
});
