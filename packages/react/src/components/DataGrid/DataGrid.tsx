import {
  forwardRef,
  useCallback,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
  type Ref,
} from 'react';
import { cx } from '../../cx';
import { messages } from '../../messages';
import { Checkbox } from '../Checkbox';
import { Icon } from '../Icon';
import { TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from '../Table';
import tableStyles from '../Table/Table.module.css';
import { VisuallyHidden } from '../VisuallyHidden';
import styles from './DataGrid.module.css';

export type DataGridSelection = 'none' | 'single' | 'multiple';

export interface DataGridSort {
  /** The `key` of the sorted column. */
  key: string;
  /** Which way the column is ordered. */
  direction: 'ascending' | 'descending';
}

export interface DataGridColumn<Row> {
  /** A name for the column that is unique in the grid. Sorting and keys refer to it. */
  key: string;
  /** The column label printed in the header. */
  header: ReactNode;
  /** Reads this column's value from a row. It feeds the default cell text and the default sort. */
  accessor?: (row: Row) => unknown;
  /** Prints the cell. Without it the cell prints the value from `accessor`. */
  render?: (row: Row, index: number) => ReactNode;
  /** Aligns the column to the end edge in tabular figures. Set it on a column of numbers. Default false. */
  numeric?: boolean;
  /** Lets a press, Enter or Space on the header order the rows by this column. Default false. */
  sortable?: boolean;
  /** Orders two rows when sorting by this column. Without it the grid compares the values from `accessor`. */
  compare?: (a: Row, b: Row) => number;
}

export interface DataGridProps<Row> extends Omit<HTMLAttributes<HTMLTableElement>, 'children' | 'onChange' | 'role'> {
  /** The columns, in order. Each has a `key`, a `header` and an `accessor` or `render`. */
  columns: DataGridColumn<Row>[];
  /** The rows to print. */
  rows: Row[];
  /** Gives a row a stable key for selection. Without it the grid uses `row.id` and then the row's position. */
  getRowKey?: (row: Row, index: number) => string;
  /** A visible title printed above the header. It names the grid for assistive tech. */
  caption?: ReactNode;
  /** The name read out when there is no `caption`. Default "Data grid"; pass your own for another language. */
  label?: string;
  /** How many rows tall the window is before the body scrolls under the header. Default 8. */
  visibleRows?: number;
  /** Whether rows can be marked: `none`, `single` (one at a time) or `multiple` (with a select-all key). Default `none`. */
  selectionMode?: DataGridSelection;
  /** The keys of the marked rows when you control them. Pair it with `onSelectedChange`. */
  selected?: string[];
  /** The keys of the rows marked at the start, when the grid keeps its own state. */
  defaultSelected?: string[];
  /** Called with the keys of all marked rows when a row is marked or cleared. */
  onSelectedChange?: (keys: string[]) => void;
  /** The sorted column when you control it. `null` means rows keep your order. Pair it with `onSortChange`. */
  sort?: DataGridSort | null;
  /** The sorted column at the start, when the grid keeps its own state. */
  defaultSort?: DataGridSort | null;
  /** Called with the new sort when a header is pressed; `null` when the third press clears it. */
  onSortChange?: (sort: DataGridSort | null) => void;
  /** Leaves ordering to you. The grid still shows the chevron and calls `onSortChange`, but prints `rows` as given. Default false. */
  manualSort?: boolean;
  /** Printed across the grid when `rows` is empty. Default "No rows". */
  empty?: ReactNode;
  /** The name of the select-all key. Default "Select all rows". */
  selectAllLabel?: string;
  /** The name of one row's select key. Default "Select row 3" by position. */
  selectRowLabel?: (row: Row, index: number) => string;
  /** Class name for the table element. */
  className?: string;
  /** Inline style for the table element. */
  style?: CSSProperties;
}

const defaultKey = (row: unknown, index: number): string => {
  const id = (row as { id?: unknown } | null)?.id;
  return id != null ? String(id) : String(index);
};

const compareValues = (a: unknown, b: unknown): number => {
  if (a == null && b == null) return 0;
  if (a == null) return 1;
  if (b == null) return -1;
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  return String(a).localeCompare(String(b), undefined, { numeric: true });
};

function DataGridInner<Row>(
  {
    columns,
    rows,
    getRowKey = defaultKey,
    caption,
    label = messages.dataGrid.label,
    visibleRows = 8,
    selectionMode = 'none',
    selected,
    defaultSelected,
    onSelectedChange,
    sort,
    defaultSort = null,
    onSortChange,
    manualSort = false,
    empty = messages.dataGrid.empty,
    selectAllLabel = messages.dataGrid.selectAll,
    selectRowLabel = (_row: Row, index: number) => messages.dataGrid.selectRow(index + 1),
    className,
    style,
    onKeyDown,
    onFocus,
    onClick,
    ...rest
  }: DataGridProps<Row>,
  ref: Ref<HTMLTableElement>,
) {
  const captionId = useId();
  const tableRef = useRef<HTMLTableElement | null>(null);
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const setRef = useCallback(
    (el: HTMLTableElement | null) => {
      tableRef.current = el;
      if (typeof ref === 'function') ref(el);
      else if (ref) (ref as { current: HTMLTableElement | null }).current = el;
    },
    [ref],
  );

  const selectable = selectionMode !== 'none';
  const multiple = selectionMode === 'multiple';
  const offset = selectable ? 1 : 0;
  const colCount = columns.length + offset;

  // sort: controlled when `sort` is given, otherwise the grid keeps it
  const [innerSort, setInnerSort] = useState<DataGridSort | null>(defaultSort);
  const currentSort = sort !== undefined ? sort : innerSort;
  const changeSort = (next: DataGridSort | null) => {
    if (sort === undefined) setInnerSort(next);
    onSortChange?.(next);
  };
  const pressHeader = (col: DataGridColumn<Row>) => {
    if (!col.sortable) return;
    if (!currentSort || currentSort.key !== col.key) changeSort({ key: col.key, direction: 'ascending' });
    else if (currentSort.direction === 'ascending') changeSort({ key: col.key, direction: 'descending' });
    else changeSort(null);
  };

  const ordered = useMemo(() => {
    const list = rows.map((row, index) => ({ row, index }));
    const col = currentSort ? columns.find((c) => c.key === currentSort.key) : undefined;
    if (!col || manualSort) return list;
    const dir = currentSort!.direction === 'ascending' ? 1 : -1;
    const cmp = col.compare ?? ((a: Row, b: Row) => compareValues(col.accessor?.(a), col.accessor?.(b)));
    return list.sort((x, y) => dir * cmp(x.row, y.row) || x.index - y.index);
  }, [rows, columns, currentSort, manualSort]);

  // selection: controlled when `selected` is given
  const [innerSelected, setInnerSelected] = useState<string[]>(defaultSelected ?? []);
  const chosen = selected ?? innerSelected;
  const chosenSet = useMemo(() => new Set(chosen), [chosen]);
  const changeSelected = (next: string[]) => {
    if (selected === undefined) setInnerSelected(next);
    onSelectedChange?.(next);
  };
  const keys = ordered.map(({ row, index }) => getRowKey(row, index));
  const setRow = (key: string, on: boolean) => {
    if (!multiple) return changeSelected(on ? [key] : []);
    changeSelected(on ? [...chosen.filter((k) => k !== key), key] : chosen.filter((k) => k !== key));
  };
  const toggleRow = (key: string) => setRow(key, !chosenSet.has(key));
  const allOn = keys.length > 0 && keys.every((k) => chosenSet.has(k));
  const someOn = keys.some((k) => chosenSet.has(k));
  const toggleAll = (on: boolean) => changeSelected(on ? [...new Set([...chosen, ...keys])] : chosen.filter((k) => !keys.includes(k)));

  // focus: one cell is the Tab stop; row 0 is the header row
  const [active, setActive] = useState({ r: 0, c: 0 });
  const rowCount = 1 + ordered.length;
  const at = { r: Math.min(active.r, rowCount - 1), c: Math.min(active.c, Math.max(colCount - 1, 0)) };
  const tabStop = (r: number, c: number) => (r === at.r && c === at.c ? 0 : -1);

  const focusCell = (r: number, c: number) => {
    const rr = Math.max(0, Math.min(rowCount - 1, r));
    const cc = Math.max(0, Math.min(colCount - 1, c));
    setActive({ r: rr, c: cc });
    tableRef.current?.querySelector<HTMLElement>(`[data-r="${rr}"][data-c="${cc}"]`)?.focus();
  };

  const onFocusCell = (e: FocusEvent<HTMLTableElement>) => {
    onFocus?.(e);
    const cell = (e.target as HTMLElement).closest<HTMLElement>('[data-r]');
    if (cell && tableRef.current?.contains(cell)) setActive({ r: Number(cell.dataset.r), c: Number(cell.dataset.c) });
  };

  const onKeys = (e: KeyboardEvent<HTMLTableElement>) => {
    onKeyDown?.(e);
    if (e.defaultPrevented) return;
    const target = e.target as HTMLElement;
    const cell = target.closest<HTMLElement>('[data-r]');
    if (!cell || !tableRef.current?.contains(cell)) return;
    const r = Number(cell.dataset.r);
    const c = Number(cell.dataset.c);
    const onCell = target === cell;
    const rtl = tableRef.current ? getComputedStyle(tableRef.current).direction === 'rtl' : false;
    const rowH = cell.offsetHeight || 1;
    const page = Math.max(1, Math.floor((scrollerRef.current?.clientHeight ?? rowH) / rowH) - 1);
    const to: Record<string, [number, number]> = {
      ArrowDown: [r + 1, c],
      ArrowUp: [r - 1, c],
      ArrowRight: [r, rtl ? c - 1 : c + 1],
      ArrowLeft: [r, rtl ? c + 1 : c - 1],
      PageDown: [r + page, c],
      PageUp: [r - page, c],
      Home: e.ctrlKey ? [0, 0] : [r, 0],
      End: e.ctrlKey ? [rowCount - 1, colCount - 1] : [r, colCount - 1],
    };
    const move = to[e.key];
    if (move) {
      e.preventDefault();
      focusCell(move[0], move[1]);
      return;
    }
    if (!onCell || (e.key !== 'Enter' && e.key !== ' ')) return;
    if (r === 0) {
      const col = columns[c - offset];
      if (col?.sortable) {
        e.preventDefault();
        pressHeader(col);
      } else if (multiple && c === 0) {
        e.preventDefault();
        toggleAll(!allOn);
      }
    } else if (selectable) {
      e.preventDefault();
      toggleRow(keys[r - 1]);
    }
  };

  // a press on a sortable header sorts; the header cell is the target, so the grid has no extra Tab stops
  const onPress = (e: MouseEvent<HTMLTableElement>) => {
    onClick?.(e);
    const cell = (e.target as HTMLElement).closest<HTMLElement>('th[data-r="0"]');
    if (!cell || !tableRef.current?.contains(cell)) return;
    const col = columns[Number(cell.dataset.c) - offset];
    if (col) pressHeader(col);
  };

  const nameId =caption != null ? captionId : undefined;

  return (
    <div>
      <div
        ref={scrollerRef}
        className={styles.scroller}
        style={{ '--dg-rows': visibleRows } as CSSProperties}
      >
        <table
          ref={setRef}
          data-component="DataGrid"
          role="grid"
          aria-labelledby={nameId}
          aria-label={nameId ? undefined : label}
          aria-multiselectable={multiple || undefined}
          aria-rowcount={rowCount}
          aria-colcount={colCount}
          className={cx(tableStyles.root, className)}
          style={style}
          onKeyDown={onKeys}
          onFocus={onFocusCell}
          onClick={onPress}
          {...rest}
        >
          {caption != null && <caption id={captionId} className={tableStyles.caption}>{caption}</caption>}
          <TableHead>
            <TableRow role="row" aria-rowindex={1}>
              {selectable && (
                <TableHeaderCell role="columnheader" className={cx(styles.headCell, styles.selectCell)} data-r={0} data-c={0} tabIndex={tabStop(0, 0)}>
                  {multiple ? (
                    <Checkbox
                      label={<VisuallyHidden>{selectAllLabel}</VisuallyHidden>}
                      tabIndex={-1}
                      checked={allOn}
                      indeterminate={someOn && !allOn}
                      onChange={(e) => toggleAll(e.target.checked)}
                    />
                  ) : (
                    <VisuallyHidden>{messages.dataGrid.selectColumn}</VisuallyHidden>
                  )}
                </TableHeaderCell>
              )}
              {columns.map((col, i) => {
                const state = currentSort?.key === col.key ? currentSort.direction : 'none';
                const mark = state === 'ascending' ? 'chevron-up' : state === 'descending' ? 'chevron-down' : null;
                return (
                  <TableHeaderCell
                    key={col.key}
                    role="columnheader"
                    numeric={col.numeric}
                    sort={col.sortable ? state : undefined}
                    className={styles.headCell}
                    data-r={0}
                    data-c={i + offset}
                    tabIndex={tabStop(0, i + offset)}
                  >
                    {col.sortable ? (
                      <span className={tableStyles.sortKey}>
                        <span>{col.header}</span>
                        <span className={tableStyles.sortMark} aria-hidden="true">{mark && <Icon name={mark} size="sm" />}</span>
                      </span>
                    ) : (
                      col.header
                    )}
                  </TableHeaderCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {ordered.length === 0 && (
              <TableRow role="row">
                <TableCell role="gridcell" colSpan={Math.max(colCount, 1)} className={styles.empty}>{empty}</TableCell>
              </TableRow>
            )}
            {ordered.map(({ row, index }, ri) => {
              const key = keys[ri];
              const isOn = chosenSet.has(key);
              return (
                <TableRow key={key} role="row" aria-rowindex={ri + 2} aria-selected={selectable ? isOn : undefined}>
                  {selectable && (
                    <TableCell role="gridcell" className={cx(styles.cell, styles.selectCell)} data-r={ri + 1} data-c={0} tabIndex={tabStop(ri + 1, 0)}>
                      <Checkbox
                        label={<VisuallyHidden>{selectRowLabel(row, index)}</VisuallyHidden>}
                        tabIndex={-1}
                        checked={isOn}
                        onChange={(e) => setRow(key, e.target.checked)}
                      />
                    </TableCell>
                  )}
                  {columns.map((col, i) => (
                    <TableCell
                      key={col.key}
                      role="gridcell"
                      numeric={col.numeric}
                      className={styles.cell}
                      data-r={ri + 1}
                      data-c={i + offset}
                      tabIndex={tabStop(ri + 1, i + offset)}
                    >
                      {col.render ? col.render(row, index) : (col.accessor?.(row) as ReactNode)}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </table>
      </div>
      {multiple && (
        <VisuallyHidden role="status" aria-live="polite">{messages.dataGrid.selected(chosen.length)}</VisuallyHidden>
      )}
    </div>
  );
}

/** A Table you walk by cell: one Tab stop, arrow keys between cells, a header that stays in view, sorting by column and optional row selection with checkboxes. All rows are rendered, so keep it to a few hundred rows. */
export const DataGrid = forwardRef(DataGridInner) as <Row>(
  props: DataGridProps<Row> & {
    /** Receives the grid's table element. */
    ref?: Ref<HTMLTableElement>;
  },
) => ReactElement | null;
