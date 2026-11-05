import {
  forwardRef,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
  type TdHTMLAttributes,
  type ThHTMLAttributes,
} from 'react';
import { cx } from '../../cx';
import { messages } from '../../messages';
import { Icon } from '../Icon';
import styles from './Table.module.css';

export type TableSort = 'ascending' | 'descending' | 'none';

export interface TableProps extends Omit<HTMLAttributes<HTMLTableElement>, 'children'> {
  /** The header, body and rows of the table. */
  children: ReactNode;
  /** A visible title printed above the header. It also names the scroll region when the columns overflow. */
  caption?: ReactNode;
  /** The name read out for the scroll region when there is no `caption`. Default "Table"; pass your own for another language. */
  label?: string;
  /** Class name for the table element. */
  className?: string;
  /** Inline style for the table element. */
  style?: CSSProperties;
}

export interface TableSectionProps extends HTMLAttributes<HTMLTableSectionElement> {
  /** Rows of this section. */
  children?: ReactNode;
  /** Class name for the section. */
  className?: string;
}

export interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  /** The cells of this row. */
  children?: ReactNode;
  /** Class name for the row. */
  className?: string;
}

export interface TableCellProps extends TdHTMLAttributes<HTMLTableCellElement> {
  /** The reading in this cell. */
  children?: ReactNode;
  /** Aligns the cell to the end edge in tabular figures. Use it on every cell of a column of numbers. Default false. */
  numeric?: boolean;
  /** Class name for the cell. */
  className?: string;
}

export interface TableHeaderCellProps extends Omit<ThHTMLAttributes<HTMLTableCellElement>, 'onClick'> {
  /** The column or row label. */
  children?: ReactNode;
  /** Which cells this header names. Default `col`; use `row` for a header at the start of a row. */
  scope?: 'col' | 'row' | 'colgroup' | 'rowgroup';
  /** Aligns the header to the end edge. Set it on the header of a numeric column. Default false. */
  numeric?: boolean;
  /** How the column is sorted now. It is announced with aria-sort and shown as a chevron. A header with `onSort` and no value counts as `none`. */
  sort?: TableSort;
  /** Makes the header sortable: its label becomes a key that calls this on press, Enter or Space. Update `sort` yourself and reorder your rows. */
  onSort?: () => void;
  /** Class name for the header cell. */
  className?: string;
}

/** Prints rows of readings in flat ink with a seam between rows. The columns scroll sideways, with a keyboard stop, when they are wider than the unit. */
export const Table = forwardRef<HTMLTableElement, TableProps>(function Table(
  { children, caption, label = messages.table.region, className, style, ...rest },
  ref,
) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [overflows, setOverflows] = useState(false);
  const captionId = useId();

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const measure = () => setOverflows(el.scrollWidth > el.clientWidth);
    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    if (el.firstElementChild) ro.observe(el.firstElementChild);
    return () => ro.disconnect();
  }, [children]);

  const regionProps = overflows
    ? {
        tabIndex: 0,
        role: 'region' as const,
        'aria-labelledby': caption != null ? captionId : undefined,
        'aria-label': caption != null ? undefined : label,
      }
    : {};

  return (
    <div ref={scrollRef} className={styles.scroll} data-scrollable={overflows ? '' : undefined} {...regionProps}>
      <table ref={ref} data-component="Table" className={cx(styles.root, className)} style={style} {...rest}>
        {caption != null && <caption id={captionId} className={styles.caption}>{caption}</caption>}
        {children}
      </table>
    </div>
  );
});

/** The header section: one or more rows of `TableHeaderCell`. */
export const TableHead = forwardRef<HTMLTableSectionElement, TableSectionProps>(function TableHead({ className, ...rest }, ref) {
  return <thead ref={ref} className={cx(styles.head, className)} {...rest} />;
});

/** The body section: the rows of readings. */
export const TableBody = forwardRef<HTMLTableSectionElement, TableSectionProps>(function TableBody({ className, ...rest }, ref) {
  return <tbody ref={ref} className={cx(styles.body, className)} {...rest} />;
});

/** One row. It has no hover or press state because nothing in it acts as a control. */
export const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(function TableRow({ className, ...rest }, ref) {
  return <tr ref={ref} className={cx(styles.row, className)} {...rest} />;
});

/** One reading. Set `numeric` on a column of numbers. */
export const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(function TableCell({ numeric = false, className, ...rest }, ref) {
  return <td ref={ref} data-numeric={numeric ? '' : undefined} className={cx(styles.cell, className)} {...rest} />;
});

/** A column or row label. With `onSort` it is a key that sorts, and `sort` says how the column is ordered now. */
export const TableHeaderCell = forwardRef<HTMLTableCellElement, TableHeaderCellProps>(function TableHeaderCell(
  { scope = 'col', numeric = false, sort, onSort, className, children, ...rest },
  ref,
) {
  const sortable = typeof onSort === 'function';
  const ariaSort = sort ?? (sortable ? 'none' : undefined);
  const mark = sort === 'ascending' ? 'chevron-up' : sort === 'descending' ? 'chevron-down' : null;
  return (
    <th
      ref={ref}
      scope={scope}
      aria-sort={ariaSort}
      data-numeric={numeric ? '' : undefined}
      className={cx(styles.headCell, className)}
      {...rest}
    >
      {sortable ? (
        <button type="button" className={styles.sortKey} onClick={onSort}>
          <span>{children}</span>
          <span className={styles.sortMark} aria-hidden="true">{mark && <Icon name={mark} size="sm" />}</span>
        </button>
      ) : (
        children
      )}
    </th>
  );
});
