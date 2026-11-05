import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useId,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { cx } from '../../cx';
import { usePresence } from '../../presence';
import { Icon } from '../Icon';
import styles from './Accordion.module.css';

export type AccordionHeadingLevel = 2 | 3 | 4 | 5 | 6;

export interface AccordionProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  /** The `AccordionItem`s, in order. */
  children: ReactNode;
  /** The values of the open items when you control it. Pair it with `onValueChange`. */
  value?: string[];
  /** The values of the items open at the start when the accordion keeps its own state. Default none. */
  defaultValue?: string[];
  /** Called with the values of all open items after one opens or closes. */
  onValueChange?: (value: string[]) => void;
  /** Let several items stay open at once. By default opening one closes the others. */
  multiple?: boolean;
  /** The heading level of every item's title, so the sections fit the page's outline. Default 3. */
  headingLevel?: AccordionHeadingLevel;
}

export interface AccordionItemProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** The item's identity, used in `value` and `defaultValue`. Must be unique inside one Accordion. */
  value: string;
  /** The title printed on the header. Name the section with a noun. */
  title: ReactNode;
  /** The content that opens under the title. It is not mounted while the item is closed. */
  children?: ReactNode;
  /** The header cannot be pressed and leaves the tab order. */
  disabled?: boolean;
}

interface Ctx {
  open: string[];
  toggle: (value: string) => void;
  level: AccordionHeadingLevel;
}
const AccordionContext = createContext<Ctx | null>(null);

/** Sections printed as a legend: the open ones are lit with an ink index bar, a minus and medium weight. Up and Down move between headers, Home and End reach the first and last, Space and Enter open or close. */
export const Accordion = forwardRef<HTMLDivElement, AccordionProps>(function Accordion(
  { children, value, defaultValue, onValueChange, multiple = false, headingLevel = 3, className, onKeyDown, ...rest },
  ref,
) {
  const [own, setOwn] = useState<string[]>(defaultValue ?? []);
  const controlled = value !== undefined;
  const open = controlled ? value : own;
  const latest = useRef({ open, controlled, multiple, onValueChange });
  latest.current = { open, controlled, multiple, onValueChange };
  const root = useRef<HTMLDivElement | null>(null);

  const toggle = useCallback((v: string) => {
    const s = latest.current;
    const isOpen = s.open.includes(v);
    const next = isOpen ? s.open.filter((x) => x !== v) : s.multiple ? [...s.open, v] : [v];
    if (!s.controlled) setOwn(next);
    s.onValueChange?.(next);
  }, []);

  const ctx = useMemo<Ctx>(() => ({ open, toggle, level: headingLevel }), [open, toggle, headingLevel]);

  const keys = (e: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(e);
    if (e.defaultPrevented) return;
    const el = root.current;
    const from = e.target as HTMLElement;
    if (!el || !from.hasAttribute?.('data-accordion-trigger')) return;
    // only this accordion's own headers: a nested accordion handles its own keys
    const heads = Array.from(el.querySelectorAll<HTMLButtonElement>('button[data-accordion-trigger]')).filter(
      (b) => !b.disabled && b.closest('[data-component="Accordion"]') === el,
    );
    const at = heads.indexOf(from as HTMLButtonElement);
    if (at < 0) return;
    let to = -1;
    if (e.key === 'ArrowDown') to = at === heads.length - 1 ? 0 : at + 1;
    else if (e.key === 'ArrowUp') to = at === 0 ? heads.length - 1 : at - 1;
    else if (e.key === 'Home') to = 0;
    else if (e.key === 'End') to = heads.length - 1;
    if (to < 0) return;
    e.preventDefault();
    heads[to]?.focus();
  };

  return (
    <AccordionContext.Provider value={ctx}>
      <div
        ref={(el) => {
          root.current = el;
          if (typeof ref === 'function') ref(el);
          else if (ref) ref.current = el;
        }}
        data-component="Accordion"
        className={cx(styles.root, className)}
        onKeyDown={keys}
        {...rest}
      >
        {children}
      </div>
    </AccordionContext.Provider>
  );
});

/** One section of an Accordion: a header that opens a panel under it. */
export const AccordionItem = forwardRef<HTMLDivElement, AccordionItemProps>(function AccordionItem(
  { value, title, children, disabled = false, className, ...rest },
  ref,
) {
  const ctx = useContext(AccordionContext);
  if (!ctx) throw new Error('AccordionItem must stand inside an Accordion.');
  const id = useId();
  const open = ctx.open.includes(value);
  const presence = usePresence<HTMLDivElement>(open);
  // a section that was open at the first render appears at once; every later opening grows from a closed row
  const first = useRef(open);
  if (!open) first.current = false;
  const Heading = `h${ctx.level}` as 'h3';
  const triggerId = `${id}-trigger`;
  const panelId = `${id}-panel`;

  return (
    <div ref={ref} data-state={open ? 'open' : 'closed'} data-value={value} className={cx(styles.item, className)} {...rest}>
      <Heading className={styles.heading}>
        <button
          type="button"
          id={triggerId}
          data-accordion-trigger=""
          aria-expanded={open}
          aria-controls={presence.mounted ? panelId : undefined}
          disabled={disabled}
          className={styles.trigger}
          onClick={() => ctx.toggle(value)}
        >
          <span className={styles.mark} aria-hidden="true" />
          <span className={styles.label}>{title}</span>
          <span className={styles.glyph} aria-hidden="true">
            <Icon name={open ? 'minus' : 'plus'} />
          </span>
        </button>
      </Heading>
      {presence.mounted && (
        <div
          ref={presence.ref}
          id={panelId}
          role="region"
          aria-labelledby={triggerId}
          data-state={presence.state}
          data-fresh={!first.current ? 'true' : undefined}
          className={styles.panel}
        >
          <div className={styles.panelInner}>
            <div className={styles.body}>{children}</div>
          </div>
        </div>
      )}
    </div>
  );
});
