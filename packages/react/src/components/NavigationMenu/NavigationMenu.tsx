import {
  cloneElement,
  createContext,
  forwardRef,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type AnchorHTMLAttributes,
  type FocusEvent,
  type HTMLAttributes,
  type MouseEvent,
  type KeyboardEvent,
  type LiHTMLAttributes,
  type ReactElement,
  type ReactNode,
} from 'react';
import { cx } from '../../cx';
import { messages } from '../../messages';
import { useIsoLayoutEffect } from '../../spring';
import { usePresence } from '../../presence';
import { Icon } from '../Icon';
import styles from './NavigationMenu.module.css';

interface NavState {
  /** The value of the item whose panel is open, or null. */
  open: string | null;
  setOpen: (value: string | null) => void;
}

const NavContext = createContext<NavState>({ open: null, setOpen: () => {} });
/** Set inside a panel, so a link knows it stands in a group and not in the top row. */
const PanelContext = createContext<{ close: () => void } | null>(null);

const TOP = 'data-nav-top';
const LINKS = '[data-nav-link]';

export interface NavigationMenuProps extends Omit<HTMLAttributes<HTMLElement>, 'children' | 'defaultValue'> {
  /** The items, in the order they are printed: `NavigationMenuItem` for a name that opens a panel, `NavigationMenuLink` for a name that goes to a page. */
  children: ReactNode;
  /** The name of the landmark that assistive tech lists, such as "Main". Defaults to the built-in word. */
  label?: string;
  /** The `value` of the item whose panel is open, or null for none. Pass it to control the menu; pair it with `onValueChange`. */
  value?: string | null;
  /** The `value` of the item that starts open when the menu is not controlled. Defaults to none. */
  defaultValue?: string | null;
  /** Called with the `value` of the item that opened, or null when a panel closed. */
  onValueChange?: (value: string | null) => void;
  /** Class name for the landmark. */
  className?: string;
}

export interface NavigationMenuItemProps extends Omit<LiHTMLAttributes<HTMLLIElement>, 'children' | 'title'> {
  /** The printed name of the key that opens the panel, such as "Rooms". */
  label: string;
  /** The panel's content: one or more `NavigationMenuGroup`, or bare `NavigationMenuLink`s. */
  children: ReactNode;
  /** The name that `value` and `onValueChange` use for this item. Defaults to a generated one. */
  value?: string;
  /** Class name for the item. */
  className?: string;
}

export interface NavigationMenuGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** The printed title of the column, such as "Upstairs". It also names the list of links for assistive tech. */
  title: string;
  /** The links of the group, as `NavigationMenuLink`. */
  children: ReactNode;
  /** Class name for the group. */
  className?: string;
}

export interface NavigationMenuLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children'> {
  /** The words of the link, or with `asChild` one element such as a router link. Name where it goes. */
  children: ReactNode;
  /** This link is the page the person is on. It is announced with aria-current="page" and marked with an ink bar. */
  current?: boolean;
  /** A short line printed under the words, in a panel only. */
  description?: string;
  /** Hand the link styles to your own child, such as a router link, instead of printing an anchor. */
  asChild?: boolean;
  /** Class name for the link. */
  className?: string;
}

const focusAll = (root: HTMLElement | null, selector: string): HTMLElement[] =>
  root ? Array.from(root.querySelectorAll<HTMLElement>(selector)) : [];

/** A site menu: names along a row, and a name that holds more links is a key that drops a plastic panel of grouped links (WAI-ARIA disclosure navigation). */
export const NavigationMenu = forwardRef<HTMLElement, NavigationMenuProps>(function NavigationMenu(
  { children, label = messages.mainNav, value, defaultValue = null, onValueChange, className, onKeyDown, ...rest },
  ref,
) {
  const controlled = value !== undefined;
  const [inner, setInner] = useState<string | null>(defaultValue);
  const open = controlled ? value : inner;
  const root = useRef<HTMLElement | null>(null);

  const setOpen = useCallback((next: string | null) => {
    if (!controlled) setInner(next);
    onValueChange?.(next);
  }, [controlled, onValueChange]);

  const setRoot = (el: HTMLElement | null) => {
    root.current = el;
    if (typeof ref === 'function') ref(el);
    else if (ref) ref.current = el;
  };

  // a press outside the menu closes the open panel
  useEffect(() => {
    if (open === null) return;
    const away = (e: PointerEvent) => { if (!root.current?.contains(e.target as Node)) setOpen(null); };
    document.addEventListener('pointerdown', away);
    return () => document.removeEventListener('pointerdown', away);
  }, [open, setOpen]);

  // the arrows, Home and End walk the top names; the panels are walked by their own item
  const onKey = (e: KeyboardEvent<HTMLElement>) => {
    onKeyDown?.(e);
    if (e.defaultPrevented) return;
    const here = e.target as HTMLElement;
    if (!here.hasAttribute(TOP)) return;
    const tops = focusAll(root.current, `[${TOP}]`);
    const at = tops.indexOf(here);
    const rtl = root.current ? getComputedStyle(root.current).direction === 'rtl' : false;
    const next = rtl ? 'ArrowLeft' : 'ArrowRight';
    const prev = rtl ? 'ArrowRight' : 'ArrowLeft';
    let to = -1;
    if (e.key === next) to = (at + 1) % tops.length;
    else if (e.key === prev) to = (at - 1 + tops.length) % tops.length;
    else if (e.key === 'Home') to = 0;
    else if (e.key === 'End') to = tops.length - 1;
    if (to < 0) return;
    e.preventDefault();
    tops[to]?.focus();
  };

  return (
    <NavContext.Provider value={{ open, setOpen }}>
      <nav ref={setRoot} data-component="NavigationMenu" aria-label={label} className={cx(styles.root, className)} onKeyDown={onKey} {...rest}>
        <ul className={styles.list}>{children}</ul>
      </nav>
    </NavContext.Provider>
  );
});

/** A name in the row that opens a panel of links. */
export const NavigationMenuItem = forwardRef<HTMLLIElement, NavigationMenuItemProps>(function NavigationMenuItem(
  { label, children, value, className, onKeyDown, onBlur, ...rest },
  ref,
) {
  const id = useId();
  const name = value ?? id;
  const panelId = `${id}-panel`;
  const { open: current, setOpen } = useContext(NavContext);
  const open = current === name;
  const key = useRef<HTMLButtonElement | null>(null);
  const panel = useRef<HTMLDivElement | null>(null);
  const item = useRef<HTMLLIElement | null>(null);
  const into = useRef(false);
  // the panel stays mounted while it leaves, so closing moves out instead of vanishing (D-008)
  const presence = usePresence<HTMLDivElement>(open);

  const setItem = (el: HTMLLIElement | null) => {
    item.current = el;
    if (typeof ref === 'function') ref(el);
    else if (ref) ref.current = el;
  };

  const close = useCallback((refocus: boolean) => {
    setOpen(null);
    if (refocus) key.current?.focus();
  }, [setOpen]);

  // keep the panel on the screen: shift it along the row when an edge would cut it
  useIsoLayoutEffect(() => {
    const p = panel.current;
    if (!open || !p) return;
    p.style.removeProperty('--nav-shift');
    const margin = parseFloat(getComputedStyle(p).getPropertyValue('--ds-gap-lg')) || 0;
    const vw = document.documentElement.clientWidth;
    const r = p.getBoundingClientRect();
    let shift = 0;
    if (r.right > vw - margin) shift = vw - margin - r.right;
    if (r.left + shift < margin) shift = margin - r.left;
    if (shift) p.style.setProperty('--nav-shift', `${Math.round(shift)}px`);
    if (into.current) {
      into.current = false;
      focusAll(p, LINKS)[0]?.focus({ preventScroll: true });
    }
  }, [open]);

  const onKey = (e: KeyboardEvent<HTMLLIElement>) => {
    onKeyDown?.(e);
    if (e.defaultPrevented || !open) {
      if (!e.defaultPrevented && e.key === 'ArrowDown' && e.target === key.current) {
        e.preventDefault();
        into.current = true;
        setOpen(name);
      }
      return;
    }
    const target = e.target as HTMLElement;
    if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); close(true); return; }
    if (target === key.current && e.key === 'ArrowDown') {
      e.preventDefault();
      focusAll(panel.current, LINKS)[0]?.focus();
      return;
    }
    if (panel.current?.contains(target)) {
      const links = focusAll(panel.current, LINKS);
      const at = links.indexOf(target);
      if (e.key === 'ArrowDown') { e.preventDefault(); links[(at + 1) % links.length]?.focus(); }
      else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (at <= 0) key.current?.focus(); else links[at - 1]?.focus();
      }
    }
  };

  // focus leaving for somewhere else closes the panel; a press with no focus target is handled by the root
  const onBlurItem = (e: FocusEvent<HTMLLIElement>) => {
    onBlur?.(e);
    const to = e.relatedTarget as Node | null;
    if (open && to && !item.current?.contains(to)) setOpen(null);
  };

  const menu = (
    <div
      ref={(el) => { panel.current = el; presence.ref(el); }}
      id={panelId}
      data-state={presence.state}
      // a leaving panel is only a picture of the links: no key reaches it and assistive tech no longer lists it
      inert={presence.state === 'closing' || undefined}
      aria-hidden={presence.state === 'closing' || undefined}
      className={styles.panel}
    >
      <PanelContext.Provider value={{ close: () => close(false) }}>
        <div className={styles.groups}>{children}</div>
      </PanelContext.Provider>
    </div>
  );

  return (
    <li ref={setItem} className={cx(styles.item, className)} onKeyDown={onKey} onBlur={onBlurItem} {...rest}>
      <button
        ref={key}
        type="button"
        {...{ [TOP]: '' }}
        className={styles.trigger}
        aria-expanded={open}
        aria-controls={presence.mounted ? panelId : undefined}
        onClick={() => setOpen(open ? null : name)}
      >
        <span className={styles.word}>
          {label}
          <Icon name={open ? 'chevron-up' : 'chevron-down'} size="sm" className={styles.chevron} />
        </span>
        <span className={styles.mark} aria-hidden="true" />
      </button>
      {presence.mounted ? menu : null}
    </li>
  );
});

/** One column of links in a panel, with a printed title. */
export const NavigationMenuGroup = forwardRef<HTMLDivElement, NavigationMenuGroupProps>(function NavigationMenuGroup(
  { title, children, className, ...rest },
  ref,
) {
  const id = useId();
  return (
    <div ref={ref} className={cx(styles.group, className)} {...rest}>
      <p id={id} className={styles.groupTitle}>{title}</p>
      <ul aria-labelledby={id} className={styles.links}>{children}</ul>
    </div>
  );
});

/** A link to a page: in the top row it is a name, in a group it is a row of the panel. */
export const NavigationMenuLink = forwardRef<HTMLAnchorElement, NavigationMenuLinkProps>(function NavigationMenuLink(
  { children, current = false, description, asChild, className, onClick, ...rest },
  ref,
) {
  const panel = useContext(PanelContext);
  const { setOpen } = useContext(NavContext);
  const inPanel = panel !== null;

  const common = {
    ref,
    'aria-current': current ? ('page' as const) : undefined,
    ...(inPanel ? { 'data-nav-link': '' } : { [TOP]: '' }),
    ...rest,
    onClick: (e: MouseEvent<HTMLAnchorElement>) => {
      onClick?.(e);
      if (inPanel) panel.close(); else setOpen(null);
    },
  };
  const cls = cx(inPanel ? styles.link : styles.trigger, className);
  const mark = <span className={styles.mark} aria-hidden="true" />;
  const text = (words: ReactNode) =>
    inPanel ? (
      <>
        {mark}
        <span className={styles.linkText}>
          <span>{words}</span>
          {description ? <span className={styles.description}>{description}</span> : null}
        </span>
      </>
    ) : (
      <>
        <span className={styles.word}>{words}</span>
        {mark}
      </>
    );

  let link: ReactNode;
  if (asChild && isValidElement(children)) {
    const child = children as ReactElement<{ className?: string; children?: ReactNode }>;
    link = cloneElement(child, { ...common, className: cx(cls, child.props.className) } as Record<string, unknown>, text(child.props.children));
  } else {
    link = <a {...common} className={cls}>{text(children)}</a>;
  }
  return <li className={inPanel ? undefined : styles.item}>{link}</li>;
});
