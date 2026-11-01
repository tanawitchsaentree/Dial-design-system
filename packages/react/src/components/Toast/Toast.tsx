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
import { IconButton } from '../IconButton';
import styles from './Toast.module.css';

export type ToastTone = 'neutral' | 'positive' | 'warning' | 'critical';

/** An optional key on the toast that undoes or retries what just happened. */
export interface ToastAction {
  /** The word on the key: "Undo", "Try again". */
  label: string;
  /** Runs when the key is pressed. The toast closes afterwards. */
  onAction: () => void;
}

export interface ToastProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'role'> {
  /** `neutral` (default) a plain note, `positive` the action worked, `warning` it worked with a catch, `critical` it failed. No tone is orange. */
  tone?: ToastTone;
  /** The status word printed beside the glyph. Defaults to Note, Done, Check or Failed by tone. */
  status?: string;
  /** The message, short and in the past tense: "Lamp turned off". */
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
const GLYPH: Record<ToastTone, ReactNode> = {
  neutral: <><circle cx="12" cy="12" r="8.5" /><path d="M12 11v5.5M12 7.5v.01" /></>,
  positive: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  warning: <><path d="M12 3.5L21.5 20h-19z" /><path d="M12 10v4.5M12 17.5v.01" /></>,
  critical: <><path d="M8 3.5h8l4.5 4.5v8L16 20.5H8L3.5 16V8z" /><path d="M12 8v5M12 16.5v.01" /></>,
};

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
        <svg className={styles.glyph} viewBox="0 0 24 24" aria-hidden="true" focusable="false">{GLYPH[tone]}</svg>
        <span className={styles.status}>{status ?? WORD[tone]}</span>
      </span>
      <span className={styles.message}>{children}</span>
      {action || onClose ? (
        <span className={styles.keys}>
          {action ? <Button onClick={() => { action.onAction(); onClose?.(); }}>{action.label}</Button> : null}
          {onClose ? (
            <IconButton label={closeLabel} onClick={onClose}>
              <svg className={styles.mark} viewBox="0 0 24 24" focusable="false"><path d="M6 6l12 12M18 6L6 18" /></svg>
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
