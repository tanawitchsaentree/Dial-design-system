import {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  useRef,
  useState,
  type AnchorHTMLAttributes,
  type HTMLAttributes,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
} from 'react';
import { cx } from '../../cx';
import { messages } from '../../messages';
import { useIsoLayoutEffect } from '../../spring';
import { Button } from '../Button';
import { Popover } from '../Popover';
import styles from './Navbar.module.css';

export type NavbarCollapse = 'auto' | 'always' | 'never';

export interface NavbarProps extends Omit<HTMLAttributes<HTMLElement>, 'children' | 'title'> {
  /** The links of the bar, as `NavbarLink`s, in the order they are read. Mark the page you are on with `current` on one of them. */
  children?: ReactNode;
  /** The model name at the inline start: a word or a link around a word, such as `<a href="/">dial</a>`. Print it in lowercase. A link here is 44px tall. */
  brand?: ReactNode;
  /** The keys at the inline end, such as a sign-in Button. Put the one primary Button of the screen here, and no other orange on the bar. */
  actions?: ReactNode;
  /** Hold the bar at the top edge while the page scrolls under it. It keeps the same elevation and stays matte. Default `false`. */
  sticky?: boolean;
  /** `auto` (default) folds the links behind a Menu key when they do not fit the width; `always` folds at any width; `never` keeps them in the row and lets the bar overflow. */
  collapse?: NavbarCollapse;
  /** The name of the navigation landmark that assistive tech lists. Pass your own for another language. Defaults to "Main". */
  label?: string;
  /** The printed word on the Menu key and the name of its panel. Pass your own for another language. Defaults to "Menu". */
  menuLabel?: string;
  /** Called when the Menu key is pressed. Give it to open your own Drawer instead of the built-in panel; the links are then yours to render in it. */
  onMenuPress?: () => void;
  /** With `onMenuPress`, whether your Drawer is open, so the Menu key announces it. Ignored without `onMenuPress`. */
  menuOpen?: boolean;
  /** Class name for the bar. */
  className?: string;
}

export interface NavbarLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** The words of the link, a noun such as "Rooms". With `asChild`, one element such as a router link. */
  children: ReactNode;
  /** Where the link goes. */
  href?: string;
  /** The page you are on. Fills the ink dot, turns the word medium and announces aria-current="page". Mark one link only. */
  current?: boolean;
  /** Hand the link styles to your own child, such as a router link, instead of printing an anchor. */
  asChild?: boolean;
}

/** One place in a Navbar: a printed word with a reserved ink dot before it, filled when it is the page you are on. */
export const NavbarLink = forwardRef<HTMLAnchorElement, NavbarLinkProps>(function NavbarLink(
  { children, current, asChild, className, ...rest },
  ref,
) {
  const mark = <span key="mark" className={styles.mark} aria-hidden="true" />;
  const parts = (words: ReactNode) => [
    mark,
    <span key="text" className={styles.text}>{words}</span>,
    <span key="ghost" className={styles.ghost} aria-hidden="true">{words}</span>,
  ];
  const props = { ref, 'aria-current': current ? ('page' as const) : undefined, ...rest };
  if (asChild && isValidElement(children)) {
    const child = children as ReactElement<{ className?: string; children?: ReactNode }>;
    return cloneElement(
      child,
      { ...props, className: cx(styles.link, child.props.className, className) } as Record<string, unknown>,
      ...parts(child.props.children),
    );
  }
  return <a {...props} className={cx(styles.link, className)}>{parts(children)}</a>;
});

/** A top bar printed on the case: a model name, a legend of places with an ink dot before the current one, and keys at the end. Folds the legend behind a Menu key when it does not fit. */
export const Navbar = forwardRef<HTMLElement, NavbarProps>(function Navbar(
  {
    children,
    brand,
    actions,
    sticky = false,
    collapse = 'auto',
    label = messages.mainNav,
    menuLabel = messages.navbar.menu,
    onMenuPress,
    menuOpen,
    className,
    ...rest
  },
  ref,
) {
  const links = Children.toArray(children).filter(isValidElement);
  const canFold = collapse !== 'never' && links.length > 0;
  const root = useRef<HTMLElement | null>(null);
  const [tight, setTight] = useState(false);
  const [panel, setPanel] = useState(false);
  const folded = canFold && (collapse === 'always' || tight);

  const setRoot = (el: HTMLElement | null) => {
    root.current = el;
    if (typeof ref === 'function') ref(el);
    else if (ref) ref.current = el;
  };

  // Measure with the legend in the row: if the bar's content is wider than the bar, the legend does not fit.
  useIsoLayoutEffect(() => {
    const el = root.current;
    if (!el || !canFold || collapse === 'always') { setTight(false); return; }
    const measure = () => {
      const had = el.hasAttribute('data-folded');
      if (had) el.removeAttribute('data-folded');
      const over = el.scrollWidth > el.clientWidth;
      if (had) el.setAttribute('data-folded', '');
      setTight(over);
    };
    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  });

  // A chosen link in the panel leaves the panel; the page it opens takes over.
  const choose = (e: MouseEvent<HTMLElement>) => {
    if ((e.target as HTMLElement).closest('a')) setPanel(false);
  };

  const menu = !folded ? null : onMenuPress ? (
    <Button aria-haspopup="dialog" aria-expanded={menuOpen ?? false} onClick={onMenuPress}>{menuLabel}</Button>
  ) : (
    <Popover label={menuLabel} trigger="word" align="end" open={panel} onOpenChange={setPanel}>
      <nav aria-label={label} onClick={choose}>
        <ul className={styles.menuList}>
          {links.map((link, i) => <li key={(link as ReactElement).key ?? i}>{link}</li>)}
        </ul>
      </nav>
    </Popover>
  );

  return (
    <header
      ref={setRoot}
      data-component="Navbar"
      data-sticky={sticky ? '' : undefined}
      data-folded={folded ? '' : undefined}
      className={cx(styles.root, className)}
      {...rest}
    >
      {brand != null && <div className={styles.brand}>{brand}</div>}
      {links.length > 0 && (
        <nav aria-label={label} className={styles.links}>
          <ul className={styles.list}>
            {links.map((link, i) => <li key={(link as ReactElement).key ?? i}>{link}</li>)}
          </ul>
        </nav>
      )}
      {(actions != null || menu) && <div className={styles.actions}>{actions}{menu}</div>}
    </header>
  );
});
