import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { cx } from '../../cx';
import { Button } from '../Button';
import styles from './Snackbar.module.css';

export type SnackbarTone = 'neutral' | 'positive' | 'warning' | 'critical';

/** The one key on a snackbar, the action that undoes what just happened. */
export interface SnackbarAction {
  /** The word on the key, such as "Undo". */
  label: string;
  /** Runs when the key is pressed. The snackbar closes afterwards. */
  onAction: () => void;
}

export interface SnackbarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'role'> {
  /** `positive` (default) the action worked, `neutral` a plain note, `warning` it worked with a catch, `critical` it failed. No tone is orange. */
  tone?: SnackbarTone;
  /** The status word printed beside the glyph. Defaults to Done, Note, Check or Failed by tone. */
  status?: string;
  /** The message, short and in the past tense, such as "Lamp removed". */
  children: ReactNode;
  /** At most one plastic key, the action that undoes, such as Undo. */
  action?: SnackbarAction;
  /** Runs after the action key is pressed, so the owner can close the snackbar. */
  onDismiss?: () => void;
}

const WORD: Record<SnackbarTone, string> = { neutral: 'Note', positive: 'Done', warning: 'Check', critical: 'Failed' };

/** One glyph per tone (Toast's set), so the tone is told by shape and word, never by colour alone. */
const GLYPH: Record<SnackbarTone, ReactNode> = {
  neutral: <><circle cx="12" cy="12" r="8.5" /><path d="M12 11v5.5M12 7.5v.01" /></>,
  positive: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  warning: <><path d="M12 3.5L21.5 20h-19z" /><path d="M12 10v4.5M12 17.5v.01" /></>,
  critical: <><path d="M8 3.5h8l4.5 4.5v8L16 20.5H8L3.5 16V8z" /><path d="M12 8v5M12 16.5v.01" /></>,
};

/**
 * A brief message at the bottom of a phone screen with one key that undoes, such as "Lamp removed · Undo".
 * Family of Toast: one at a time, centred above the bottom nav, no close key. It is a polite live region
 * (role="status") in every tone.
 */
export const Snackbar = forwardRef<HTMLDivElement, SnackbarProps>(function Snackbar(
  { tone = 'positive', status, children, action, onDismiss, className, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      role="status"
      aria-atomic="true"
      data-component="Snackbar"
      data-tone={tone}
      className={cx(styles.root, styles[tone], className)}
      {...rest}
    >
      <span className={styles.head}>
        <svg className={styles.glyph} viewBox="0 0 24 24" aria-hidden="true" focusable="false">{GLYPH[tone]}</svg>
        <span className={styles.status}>{status ?? WORD[tone]}</span>
      </span>
      <span className={styles.message}>{children}</span>
      {action ? (
        <span className={styles.key}>
          <Button onClick={() => { action.onAction(); onDismiss?.(); }}>{action.label}</Button>
        </span>
      ) : null}
    </div>
  );
});

/* ------------------------------------------------------------------ provider */

/** What `useSnackbar().show` takes. */
export interface SnackbarOptions {
  /** The message, short and in the past tense. */
  message: ReactNode;
  /** The tone; `positive` by default. */
  tone?: SnackbarTone;
  /** The status word; defaults by tone. */
  status?: string;
  /** The one key, such as Undo. */
  action?: SnackbarAction;
  /** How long it stays, in ms. Never less than 5000; 8000 by default. `Infinity` keeps it until the next one or Escape. */
  duration?: number;
}

export interface SnackbarApi {
  /** Shows a snackbar, replacing the one on screen, and returns its id. */
  show: (options: SnackbarOptions) => string;
  /** Closes the snackbar with this id, or the one on screen when no id is given. */
  dismiss: (id?: string) => void;
}

export interface SnackbarProviderProps {
  children?: ReactNode;
  /** Default time on screen in ms. Never less than 5000. */
  duration?: number;
  /** `true` (default) lifts the snackbar above a BottomNav strip on a tall screen. Set `false` for an app with no bottom nav. */
  aboveNav?: boolean;
}

const MIN_MS = 5000;
const SnackbarContext = createContext<SnackbarApi | null>(null);
type Item = SnackbarOptions & { id: string; leaving: boolean };

/** Shows the snackbar posted with `useSnackbar()`, one at a time. Put it once near the root of the app. */
export function SnackbarProvider({ children, duration = 8000, aboveNav = true }: SnackbarProviderProps) {
  const [items, setItems] = useState<Item[]>([]);
  const [paused, setPaused] = useState(false);
  const [mounted, setMounted] = useState(false);
  const seq = useRef(0);
  useEffect(() => setMounted(true), []);

  const dismiss = useCallback((id?: string) => setItems((xs) => xs.map((x) => (id === undefined || x.id === id ? { ...x, leaving: true } : x))), []);
  const remove = useCallback((id: string) => setItems((xs) => xs.filter((x) => x.id !== id)), []);
  const show = useCallback((o: SnackbarOptions) => {
    const id = `snackbar-${++seq.current}`;
    setItems((xs) => [...xs.map((x) => ({ ...x, leaving: true })), { ...o, id, leaving: false }]);
    return id;
  }, []);
  const api = useMemo(() => ({ show, dismiss }), [show, dismiss]);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') { e.preventDefault(); dismiss(); }
  };

  const region = (
    <div
      data-snackbar-region=""
      className={cx(styles.region, aboveNav && styles.aboveNav)}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setPaused(false); }}
      onKeyDown={onKeyDown}
    >
      {items.map((t) => (
        <SnackbarItem key={t.id} item={t} paused={paused} ms={Math.max(MIN_MS, t.duration ?? duration)} onDismiss={dismiss} onRemove={remove} />
      ))}
    </div>
  );

  return (
    <SnackbarContext.Provider value={api}>
      {children}
      {mounted ? createPortal(region, document.body) : null}
    </SnackbarContext.Provider>
  );
}

function SnackbarItem({ item, paused, ms, onDismiss, onRemove }: {
  item: Item;
  paused: boolean;
  ms: number;
  onDismiss: (id?: string) => void;
  onRemove: (id: string) => void;
}) {
  const el = useRef<HTMLDivElement>(null);
  const left = useRef(ms);
  useEffect(() => {
    const raf = requestAnimationFrame(() => { if (el.current) el.current.dataset.state = 'open'; });
    return () => cancelAnimationFrame(raf);
  }, []);
  // leaves on its own, paused while the pointer or focus is on it
  useEffect(() => {
    if (item.leaving || paused || !Number.isFinite(left.current)) return undefined;
    const start = Date.now();
    const t = setTimeout(() => onDismiss(item.id), left.current);
    return () => { clearTimeout(t); left.current -= Date.now() - start; };
  }, [item.leaving, item.id, paused, onDismiss]);
  useEffect(() => {
    if (!item.leaving || !el.current) return undefined;
    const node = el.current;
    node.dataset.state = 'closed';
    const cs = getComputedStyle(node);
    const wait = Math.max(0, ...cs.transitionDuration.split(',').map((s) => parseFloat(s) * (s.trim().endsWith('ms') ? 1 : 1000) || 0));
    const t = setTimeout(() => onRemove(item.id), wait);
    return () => clearTimeout(t);
  }, [item.leaving, item.id, onRemove]);

  return (
    <div ref={el} data-state="closed" aria-hidden={item.leaving || undefined}>
      <Snackbar tone={item.tone} status={item.status} action={item.action} onDismiss={() => onDismiss(item.id)}>
        {item.message}
      </Snackbar>
    </div>
  );
}

/** Posts a snackbar from anywhere under a `SnackbarProvider`: `snackbar.show({ message: 'Lamp removed', action: { label: 'Undo', onAction: restore } })`. */
export function useSnackbar(): SnackbarApi {
  const api = useContext(SnackbarContext);
  if (!api) throw new Error('useSnackbar() needs a <SnackbarProvider> above it.');
  return api;
}
