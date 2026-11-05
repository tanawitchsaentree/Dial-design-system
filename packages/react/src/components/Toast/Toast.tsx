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
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { cx } from '../../cx';
import { messages } from '../../messages';
import { Button } from '../Button';
import { Icon, type IconName } from '../Icon';
import { IconButton } from '../IconButton';
import styles from './Toast.module.css';

export type ToastTone = 'neutral' | 'positive' | 'warning' | 'critical';

/** An optional key on the toast that undoes or retries what just happened. */
export interface ToastAction {
  /** The word on the key, such as "Undo" or "Try again". */
  label: string;
  /** Runs when the key is pressed. The toast closes afterwards. */
  onAction: () => void;
}

export interface ToastProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'role'> {
  /** `neutral` (default) a plain note, `positive` the action worked, `warning` it worked with a catch, `critical` it failed. No tone is orange. */
  tone?: ToastTone;
  /** The status word printed beside the glyph. Defaults to Note, Done, Check or Failed by tone. */
  status?: string;
  /** The message, short and in the past tense, such as "Lamp turned off". */
  children: ReactNode;
  /** One optional plastic key, such as Undo or Try again. */
  action?: ToastAction;
  /** Shows the round close key and runs when it is pressed. */
  onClose?: () => void;
  /** The accessible name of the close key. Defaults to "Close". */
  closeLabel?: string;
}

const WORD: Record<ToastTone, string> = { neutral: 'Note', positive: 'Done', warning: 'Check', critical: 'Failed' };

/** One glyph per tone, so the tone is told by shape and word, never by colour alone. */
// printed in dial's one icon language, the dot matrix (R-005)
const GLYPH: Record<ToastTone, IconName> = { neutral: 'info', positive: 'positive', warning: 'warning', critical: 'critical' };

/**
 * A short message after an action: a printed glyph and a status word, the message, an optional
 * key and a close key. It is a live region: role="status" (polite), or role="alert" when critical.
 */
export const Toast = forwardRef<HTMLDivElement, ToastProps>(function Toast(
  { tone = 'neutral', status, children, action, onClose, closeLabel = messages.close, className, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      role={tone === 'critical' ? 'alert' : 'status'}
      aria-atomic="true"
      data-component="Toast"
      data-tone={tone}
      className={cx(styles.root, styles[tone], className)}
      {...rest}
    >
      <span className={styles.head}>
        <Icon name={GLYPH[tone]} className={styles.glyph} />
        <span className={styles.status}>{status ?? WORD[tone]}</span>
      </span>
      <span className={styles.message}>{children}</span>
      {action || onClose ? (
        <span className={styles.keys}>
          {action ? <Button onClick={() => { action.onAction(); onClose?.(); }}>{action.label}</Button> : null}
          {onClose ? (
            <IconButton label={closeLabel} onClick={onClose}>
              <Icon name="close" />
            </IconButton>
          ) : null}
        </span>
      ) : null}
    </div>
  );
});

/* ------------------------------------------------------------------ provider */

/** What `useToast().show` takes: the message plus the same options as `<Toast>`. */
export interface ToastOptions {
  /** The message, short and in the past tense. */
  message: ReactNode;
  /** The tone; `neutral` by default. */
  tone?: ToastTone;
  /** The status word; defaults by tone. */
  status?: string;
  /** One optional key, such as Undo. */
  action?: ToastAction;
  /** How long it stays, in ms. Never less than 5000; 10000 by default when there is an action key, 6000 otherwise. `Infinity` keeps it until closed. */
  duration?: number;
}

export interface ToastApi {
  /** Shows a toast and returns its id. */
  show: (options: ToastOptions) => string;
  /** Closes a toast by id. */
  dismiss: (id: string) => void;
}

export interface ToastProviderProps {
  children?: ReactNode;
  /** Default time on screen in ms for toasts without an action. Never less than 5000. */
  duration?: number;
  /** How many toasts show at once; older ones close first. */
  max?: number;
  /** Accessible name of the region. Defaults to "Notifications". */
  label?: string;
}

const MIN_MS = 5000;
const ToastContext = createContext<ToastApi | null>(null);

/** Shows toasts posted with `useToast()`. Put it once near the root of the app. */
export function ToastProvider({ children, duration = 6000, max = 3, label = messages.notifications }: ToastProviderProps) {
  const [items, setItems] = useState<Array<ToastOptions & { id: string; leaving: boolean }>>([]);
  const [paused, setPaused] = useState(false);
  const [mounted, setMounted] = useState(false);
  const seq = useRef(0);
  useEffect(() => setMounted(true), []);

  const dismiss = useCallback((id: string) => setItems((xs) => xs.map((x) => (x.id === id ? { ...x, leaving: true } : x))), []);
  const remove = useCallback((id: string) => setItems((xs) => xs.filter((x) => x.id !== id)), []);
  const show = useCallback(
    (o: ToastOptions) => {
      const id = `toast-${++seq.current}`;
      setItems((xs) => {
        const live = xs.filter((x) => !x.leaving);
        const over = live.length + 1 - max;
        const drop = new Set(over > 0 ? live.slice(0, over).map((x) => x.id) : []);
        return [...xs.map((x) => (drop.has(x.id) ? { ...x, leaving: true } : x)), { ...o, id, leaving: false }];
      });
      return id;
    },
    [max],
  );
  const api = useMemo(() => ({ show, dismiss }), [show, dismiss]);

  const region = (
    <div
      role="region"
      aria-label={label}
      data-toast-region=""
      className={styles.region}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setPaused(false); }}
    >
      {items.map((t) => (
        <ToastItem
          key={t.id}
          item={t}
          paused={paused}
          ms={Math.max(MIN_MS, t.duration ?? (t.action ? 10000 : duration))}
          onDismiss={dismiss}
          onRemove={remove}
        />
      ))}
    </div>
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      {mounted ? createPortal(region, document.body) : null}
    </ToastContext.Provider>
  );
}

function ToastItem({ item, paused, ms, onDismiss, onRemove }: {
  item: ToastOptions & { id: string; leaving: boolean };
  paused: boolean;
  ms: number;
  onDismiss: (id: string) => void;
  onRemove: (id: string) => void;
}) {
  const el = useRef<HTMLDivElement>(null);
  const left = useRef(ms);
  // enter: one frame closed, then open, so the rise runs (instant under reduced motion)
  useEffect(() => {
    const raf = requestAnimationFrame(() => { if (el.current) el.current.dataset.state = 'open'; });
    return () => cancelAnimationFrame(raf);
  }, []);
  // auto-dismiss, paused while the pointer or focus is in the region
  useEffect(() => {
    if (item.leaving || paused || !Number.isFinite(left.current)) return undefined;
    const start = Date.now();
    const t = setTimeout(() => onDismiss(item.id), left.current);
    return () => { clearTimeout(t); left.current -= Date.now() - start; };
  }, [item.leaving, item.id, paused, onDismiss]);
  // exit: closed state, then remove after the exit motion
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
    <div ref={el} data-state="closed">
      <Toast tone={item.tone} status={item.status} action={item.action} onClose={() => onDismiss(item.id)}>
        {item.message}
      </Toast>
    </div>
  );
}

/** Posts toasts from anywhere under a `ToastProvider`: `const toast = useToast(); toast.show({ message: 'Lamp turned off', tone: 'positive' })`. */
export function useToast(): ToastApi {
  const api = useContext(ToastContext);
  if (!api) throw new Error('useToast() needs a <ToastProvider> above it.');
  return api;
}
