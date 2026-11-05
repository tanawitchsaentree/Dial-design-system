import {
  cloneElement,
  createContext,
  forwardRef,
  isValidElement,
  useCallback,
  useContext,
  useId,
  useState,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from 'react';
import { cx } from '../../cx';
import { messages } from '../../messages';
import { Icon, type IconName } from '../Icon';
import styles from './Sidebar.module.css';

interface SidebarContextValue {
  collapsed: boolean;
  setCollapsed: (next: boolean) => void;
  id: string;
}
const SidebarContext = createContext<SidebarContextValue>({ collapsed: false, setCollapsed: () => {}, id: '' });

export interface SidebarProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /** The groups of pages, as `SidebarGroup`s, and optionally a `SidebarToggle` last. */
  children: ReactNode;
  /** The name of the landmark that assistive tech lists. Pass your own for another language. Defaults to "Main". */
  label?: string;
  /** Controlled: `true` shows icons only. Pair it with `onCollapsedChange`. */
  collapsed?: boolean;
  /** Uncontrolled: whether the column starts as icons only. Default `false`. */
  defaultCollapsed?: boolean;
  /** Called with the new state when the `SidebarToggle` is pressed. */
  onCollapsedChange?: (collapsed: boolean) => void;
  /** Class name for the landmark. */
  className?: string;
}

export interface SidebarGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** The group's printed name, a short lowercase noun such as "Rooms". It names the list for assistive tech even when the column is collapsed. */
  title: ReactNode;
  /** The pages of the group, as `SidebarItem`s. */
  children: ReactNode;
  /** Class name for the group. */
  className?: string;
}

export interface SidebarItemProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** The page's name, a noun such as "Kitchen". Collapsed, it is kept for assistive tech and shown as a tooltip but not drawn. With `asChild`, pass one element such as a router link. */
  children: ReactNode;
  /** Where the page goes. */
  href?: string;
  /** A glyph from dial's dot-matrix set, printed at the start of the row. Needed for the column to be useful when collapsed. */
  icon?: IconName;
  /** The page you are on. Sets aria-current="page", turns the name to medium weight and prints the index mark. Mark one item per page. */
  current?: boolean;
  /** Hand the link styles to your own child, such as a router link, instead of printing an anchor. */
  asChild?: boolean;
  /** Class name for the link. */
  className?: string;
}

export interface SidebarToggleProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** The word printed beside the chevron while the column is open. Pass your own for another language. Defaults to "Collapse". */
  collapseLabel?: string;
  /** The key's name while the column is collapsed, for assistive tech. Pass your own for another language. Defaults to "Expand". */
  expandLabel?: string;
  /** Class name for the key. */
  className?: string;
}

/** A side column of pages in groups. A nav landmark that can shrink to icons only; the page you are on carries an ink index mark. */
export const Sidebar = forwardRef<HTMLElement, SidebarProps>(function Sidebar(
  { children, label = messages.mainNav, collapsed: collapsedProp, defaultCollapsed = false, onCollapsedChange, className, ...rest },
  ref,
) {
  const [inner, setInner] = useState(defaultCollapsed);
  const controlled = collapsedProp !== undefined;
  const collapsed = controlled ? collapsedProp : inner;
  const id = useId();
  const setCollapsed = useCallback(
    (next: boolean) => {
      if (!controlled) setInner(next);
      onCollapsedChange?.(next);
    },
    [controlled, onCollapsedChange],
  );
  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed, id }}>
      <nav
        ref={ref}
        id={id}
        data-component="Sidebar"
        data-collapsed={collapsed ? '' : undefined}
        aria-label={label}
        className={cx(styles.root, className)}
        {...rest}
      >
        {children}
      </nav>
    </SidebarContext.Provider>
  );
});

/** A named list of pages inside a Sidebar. */
export const SidebarGroup = forwardRef<HTMLDivElement, SidebarGroupProps>(function SidebarGroup(
  { title, children, className, ...rest },
  ref,
) {
  const headingId = useId();
  return (
    <div ref={ref} className={cx(styles.group, className)} {...rest}>
      <p id={headingId} className={styles.heading}>{title}</p>
      <ul aria-labelledby={headingId} className={styles.list}>{children}</ul>
    </div>
  );
});

/** One page in a SidebarGroup: an icon and a name in a link. */
export const SidebarItem = forwardRef<HTMLAnchorElement, SidebarItemProps>(function SidebarItem(
  { children, icon, current, asChild, className, title, ...rest },
  ref,
) {
  const { collapsed } = useContext(SidebarContext);
  const aria = current ? ({ 'aria-current': 'page' } as const) : {};
  const glyph = icon ? <span className={styles.icon} aria-hidden="true"><Icon name={icon} size="md" /></span> : null;
  const mark = <span className={styles.mark} aria-hidden="true" />;
  const word = (inner: ReactNode) => <span className={styles.label}>{inner}</span>;
  const hint = title ?? (collapsed && typeof children === 'string' ? children : undefined);
  let link: ReactNode;
  if (asChild && isValidElement(children)) {
    const child = children as ReactElement<{ className?: string; children?: ReactNode }>;
    link = cloneElement(
      child,
      {
        ...rest,
        ...aria,
        ref,
        title: hint,
        className: cx(styles.link, child.props.className, className),
        children: (
          <>
            {mark}
            {glyph}
            {word(child.props.children)}
          </>
        ),
      } as Record<string, unknown>,
    );
  } else {
    link = (
      <a ref={ref} title={hint} className={cx(styles.link, className)} {...aria} {...rest}>
        {mark}
        {glyph}
        {word(children)}
      </a>
    );
  }
  return <li className={styles.item}>{link}</li>;
});

/** The key at the foot of a Sidebar that collapses it to icons and expands it again. */
export const SidebarToggle = forwardRef<HTMLButtonElement, SidebarToggleProps>(function SidebarToggle(
  { collapseLabel = messages.sidebar.collapse, expandLabel = messages.sidebar.expand, onClick, className, ...rest },
  ref,
) {
  const { collapsed, setCollapsed, id } = useContext(SidebarContext);
  return (
    <button
      ref={ref}
      type="button"
      aria-expanded={!collapsed}
      aria-controls={id || undefined}
      aria-label={collapsed ? expandLabel : collapseLabel}
      className={cx(styles.toggle, className)}
      onClick={(e) => {
        onClick?.(e);
        if (!e.defaultPrevented) setCollapsed(!collapsed);
      }}
      {...rest}
    >
      <span className={styles.icon} aria-hidden="true"><Icon name={collapsed ? 'chevron-right' : 'chevron-left'} size="md" /></span>
      <span className={styles.toggleLabel}>{collapseLabel}</span>
    </button>
  );
});
