import {
  forwardRef,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { cx } from '../../cx';
import { messages } from '../../messages';
import { Icon, type IconName } from '../Icon';
import { IconButton } from '../IconButton';
import { Listbox, type ListboxOption, type ListboxSize } from '../Listbox';
import { VisuallyHidden } from '../VisuallyHidden';
import styles from './TransferList.module.css';

export type TransferListSize = ListboxSize;

/** One row that can stand in either list. The same shape as a Listbox option. */
export type TransferListOption = ListboxOption;

export interface TransferListProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue' | 'children'> {
  /** The name of the whole control for assistive tech, such as "Rooms on the night schedule". It is read as the group's name and is not printed. */
  label: string;
  /** Every row there is. A row stands in the chosen list when its value is in `value`, and in the available list otherwise. */
  options: TransferListOption[];
  /** The values in the chosen list when controlled, in any order; the list shows them in the order of `options`. Pair it with `onValueChange`. */
  value?: string[];
  /** The values in the chosen list at the start when uncontrolled. */
  defaultValue?: string[];
  /** Called with all chosen values, in the order of `options`, after rows are moved. */
  onValueChange?: (value: string[]) => void;
  /** Adds the keys that move every row at once (the "all" keys). Rows that are disabled stay where they are. Default `false`. */
  moveAll?: boolean;
  /** `md` (default) has 44px rows; `lg` has 52px rows with larger text, for a phone sheet. */
  size?: TransferListSize;
  /** Both lists and all keys take no input, and the windows fade to half. */
  disabled?: boolean;
  /** Submits the chosen values with a form under this name, through hidden inputs. */
  name?: string;
  /** The printed name of the available list. The default is "Available". */
  availableLabel?: string;
  /** The printed name of the chosen list. The default is "Chosen". */
  chosenLabel?: string;
  /** The name of the key that moves the marked rows into the chosen list. Pass your own for another language. */
  addLabel?: string;
  /** The name of the key that moves the marked rows back. */
  removeLabel?: string;
  /** The name of the key that moves every available row into the chosen list. Only shown with `moveAll`. */
  addAllLabel?: string;
  /** The name of the key that moves every chosen row back. Only shown with `moveAll`. */
  removeAllLabel?: string;
  /** The line printed in the available list when it has no rows. */
  emptyAvailableText?: string;
  /** The line printed in the chosen list when it has no rows. */
  emptyChosenText?: string;
  /** Builds the count printed under a window, from the rows it holds and how many are marked. */
  countText?: (rows: number, marked: number) => string;
  /** Builds the polite status read out after a move, from the rows moved, the name of the list they went to and the new totals. */
  movedText?: (moved: number, to: string, available: number, chosen: number) => string;
}

type Side = 'a' | 'c';

const ICON_PAIR: ReadonlyArray<0 | 1> = [0, 1];

/** Two lists, available and chosen, with keys that carry the marked rows across. Mark with Space, press a key or use Alt with the arrow toward the other list; no dragging is needed. */
export const TransferList = forwardRef<HTMLDivElement, TransferListProps>(function TransferList(
  {
    label,
    options,
    value,
    defaultValue,
    onValueChange,
    moveAll = false,
    size = 'md',
    disabled = false,
    name,
    availableLabel = messages.transferList.available,
    chosenLabel = messages.transferList.chosen,
    addLabel = messages.transferList.add,
    removeLabel = messages.transferList.remove,
    addAllLabel = messages.transferList.addAll,
    removeAllLabel = messages.transferList.removeAll,
    emptyAvailableText = messages.transferList.emptyAvailable,
    emptyChosenText = messages.transferList.emptyChosen,
    countText = messages.transferList.count,
    movedText = messages.transferList.moved,
    className,
    ...rest
  },
  ref,
) {
  const controlled = value !== undefined;
  const [inner, setInner] = useState<string[]>(defaultValue ?? []);
  const chosenValues = controlled ? value : inner;
  const chosenSet = new Set(chosenValues);
  const available = options.filter((o) => !chosenSet.has(o.value));
  const chosen = options.filter((o) => chosenSet.has(o.value));

  const [marks, setMarks] = useState<Record<Side, string[]>>({ a: [], c: [] });
  const [status, setStatus] = useState('');
  const [stacked, setStacked] = useState(false);
  const [rtl, setRtl] = useState(false);

  const rootRef = useRef<HTMLDivElement | null>(null);
  const keysRef = useRef<HTMLDivElement | null>(null);
  const listRefs = useRef<Record<Side, HTMLDivElement | null>>({ a: null, c: null });

  const setRoot = (el: HTMLDivElement | null) => {
    rootRef.current = el;
    if (typeof ref === 'function') ref(el);
    else if (ref) ref.current = el;
  };

  // The lists stack when the root cannot hold two windows of the minimum width and the key column.
  const measure = useCallback(() => {
    const root = rootRef.current;
    if (!root) return;
    const cs = getComputedStyle(root);
    setRtl(cs.direction === 'rtl');
    const min = parseFloat(cs.getPropertyValue('--tl-min'));
    const gap = parseFloat(cs.columnGap) || 0;
    const key = keysRef.current?.querySelector('button')?.getBoundingClientRect().width ?? 0;
    if (!Number.isFinite(min) || !key) return;
    setStacked(root.clientWidth < min * 2 + key + gap * 2);
  }, []);

  useLayoutEffect(() => {
    measure();
    const root = rootRef.current;
    if (!root || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(measure);
    ro.observe(root);
    return () => ro.disconnect();
  }, [measure]);

  const present = (side: Side) => {
    const rows = side === 'a' ? available : chosen;
    return marks[side].filter((v) => rows.some((o) => o.value === v && !o.disabled));
  };

  const move = (from: Side, all: boolean) => {
    if (disabled) return;
    const source = from === 'a' ? available : chosen;
    const ids = all ? source.filter((o) => !o.disabled).map((o) => o.value) : present(from);
    if (!ids.length) return;
    const moving = new Set(ids);
    const nextChosen = options
      .filter((o) => (from === 'a' ? chosenSet.has(o.value) || moving.has(o.value) : chosenSet.has(o.value) && !moving.has(o.value)))
      .map((o) => o.value);
    if (!controlled) setInner(nextChosen);
    onValueChange?.(nextChosen);
    setMarks((m) => ({ ...m, [from]: m[from].filter((v) => !moving.has(v)) }));
    const availableAfter = options.length - nextChosen.length;
    setStatus(movedText(ids.length, from === 'a' ? chosenLabel : availableLabel, availableAfter, nextChosen.length));
    // the key that was pressed fades out when no marked rows are left, so focus goes back to a list that still has rows
    const sourceLeft = source.length - ids.length;
    const target: Side = sourceLeft > 0 ? from : from === 'a' ? 'c' : 'a';
    listRefs.current[target]?.focus();
  };

  // Alt with the arrow that points toward the other list moves the marked rows without leaving the list
  const onKeyDown = (side: Side) => (e: KeyboardEvent<HTMLDivElement>) => {
    if (!e.altKey || e.ctrlKey || e.metaKey) return;
    const toward = (side === 'a') !== rtl ? 'ArrowRight' : 'ArrowLeft';
    if (e.key !== toward) return;
    e.preventDefault();
    move(side, false);
  };

  const arrow = (side: Side): IconName =>
    stacked ? (side === 'a' ? 'chevron-down' : 'chevron-up') : (side === 'a') !== rtl ? 'chevron-right' : 'chevron-left';

  const key = (side: Side, all: boolean, text: string, rows: TransferListOption[]) => {
    const empty = all ? rows.every((o) => o.disabled) : present(side).length === 0;
    return (
      <IconButton
        size={size}
        label={text}
        disabled={disabled || empty}
        className={styles.key}
        onClick={() => move(side, all)}
        data-all={all ? 'true' : undefined}
      >
        {all ? (
          <span className={styles.pair}>
            {ICON_PAIR.map((i) => <Icon key={i} name={arrow(side)} size="sm" />)}
          </span>
        ) : (
          <Icon name={arrow(side)} size="sm" />
        )}
      </IconButton>
    );
  };

  const column = (side: Side, title: string, rows: TransferListOption[], emptyText: string): ReactNode => (
    <div className={styles.column} onKeyDown={onKeyDown(side)}>
      <Listbox
        ref={(el) => { listRefs.current[side] = el; }}
        multiple
        size={size}
        label={title}
        options={rows}
        value={present(side)}
        onValueChange={(v) => setMarks((m) => ({ ...m, [side]: v }))}
        disabled={disabled}
        emptyText={emptyText}
      />
      <p className={styles.caption}>{countText(rows.length, present(side).length)}</p>
    </div>
  );

  return (
    <div
      ref={setRoot}
      role="group"
      aria-label={label}
      data-component="TransferList"
      data-stacked={stacked ? 'true' : undefined}
      className={cx(styles.root, styles[size], className)}
      {...rest}
    >
      {column('a', availableLabel, available, emptyAvailableText)}
      <div ref={keysRef} className={styles.keys}>
        {key('a', false, addLabel, available)}
        {moveAll && key('a', true, addAllLabel, available)}
        {key('c', false, removeLabel, chosen)}
        {moveAll && key('c', true, removeAllLabel, chosen)}
      </div>
      {column('c', chosenLabel, chosen, emptyChosenText)}
      <VisuallyHidden role="status" aria-live="polite">{status}</VisuallyHidden>
      {name && chosen.map((o) => <input key={o.value} type="hidden" name={name} value={o.value} />)}
    </div>
  );
});
