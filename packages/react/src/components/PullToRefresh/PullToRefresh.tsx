import { forwardRef, useCallback, useEffect, useId, useRef, useState, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../cx';
import { MECHANISM, useSpring } from '../../spring';
import { IconButton } from '../IconButton';
import { Progress } from '../Progress';
import styles from './PullToRefresh.module.css';

/** Where the pull is. `idle` at rest, `pulling` short of the detent, `armed` past it, `working` while the hub answers, `failed` when it did not. */
export type PullToRefreshState = 'idle' | 'pulling' | 'armed' | 'working' | 'failed';

/** The words PullToRefresh prints and speaks. */
export interface PullToRefreshMessages {
  /** Beside the ruler while the pull is short of the detent. Default "Pull to refresh". */
  pull: string;
  /** Beside the ruler once the pull is past the detent. Default "Release to refresh". */
  release: string;
  /** The status line while the hub answers; the band's Progress names the list and reads Working. Default "Asking the hub". */
  working: string;
  /** Printed before the time of the readings. Default "Updated". */
  updated: string;
  /** The status line when the refresh failed. Default "Not updated, the hub did not answer". */
  failed: string;
  /** The accessible name of the refresh key. Default "Refresh". */
  refresh: string;
}

export interface PullToRefreshProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** The name of the list, such as "Readings" or "Living room". Printed in the bar and used to name the list region. */
  label: ReactNode;
  /** Asks the hub for fresh readings. Return a promise and the list shows Working until it settles; a rejected promise shows the failed line. */
  onRefresh: () => Promise<unknown> | void;
  /** Controls the working state from outside, for a refresh that the app tracks itself. Leave it out to follow the promise from `onRefresh`. */
  refreshing?: boolean;
  /** When the readings were last taken. Printed as "Updated 10:42". A refresh that succeeds sets it to the time it ended; with `refreshing` the app passes the new time here. */
  updated?: Date;
  /** Turns the time into the printed text. Defaults to hours and minutes on a 24 hour clock, such as 10:42. */
  formatTime?: (time: Date) => string;
  /** The tallest the list may grow before it scrolls, in px or any CSS length. Leave it out to let the page scroll. */
  height?: number | string;
  /** The words printed and spoken, for other languages. */
  messages?: Partial<PullToRefreshMessages>;
  /** The pull and the refresh key do nothing. */
  disabled?: boolean;
  /** The list. */
  children: ReactNode;
}

const MESSAGES: PullToRefreshMessages = {
  pull: 'Pull to refresh',
  release: 'Release to refresh',
  working: 'Asking the hub',
  updated: 'Updated',
  failed: 'Not updated, the hub did not answer',
  refresh: 'Refresh',
};
const clock = (d: Date) => `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
/** Finger travel before a downward drag counts as a pull, so a tap or a small wobble still scrolls. */
const SLOP = 8;
/** The list moves half as far as the finger, and at most this many detents. */
const RESIST = 0.5;
const STRETCH = 1.4;
const TICKS = [0, 0.25, 0.5, 0.75];

const RefreshIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 12a8 8 0 1 1-2.34-5.66" />
    <path d="M20 4v4h-4" />
  </svg>
);

/** A list that asks the hub for fresh readings when it is pulled down past one detent, or when its refresh key is pressed. */
export const PullToRefresh = forwardRef<HTMLDivElement, PullToRefreshProps>(function PullToRefresh(
  { label, onRefresh, refreshing, updated, formatTime = clock, height, messages, disabled = false, className, style, children, ...rest },
  ref,
) {
  const words = { ...MESSAGES, ...messages };
  const labelId = `${useId()}-label`;
  const root = useRef<HTMLDivElement | null>(null);
  const scroller = useRef<HTMLDivElement | null>(null);
  const ruler = useRef<HTMLSpanElement | null>(null);
  const [phase, setPhase] = useState<PullToRefreshState>('idle');
  const [stamp, setStamp] = useState<Date | undefined>(updated);
  const detent = useRef(66);
  const phaseRef = useRef(phase);
  phaseRef.current = phase;

  useEffect(() => { if (updated) setStamp(updated); }, [updated]);

  const spring = useSpring((x) => {
    const el = root.current;
    if (!el) return;
    el.style.setProperty('--ptr-pull', `${Math.max(0, x)}px`);
    el.style.setProperty('--ptr-reach', String(Math.min(1, Math.max(0, x / detent.current))));
  }, MECHANISM, 0, 0.05);

  const measure = () => {
    const h = ruler.current?.getBoundingClientRect().height;
    if (h) detent.current = h;
  };

  const controlled = refreshing !== undefined;
  const busy = controlled ? refreshing : phase === 'working';

  const run = useCallback(() => {
    if (disabled || phaseRef.current === 'working' || (controlled && refreshing)) return;
    measure();
    spring.to(detent.current);
    setPhase('working');
    let result: Promise<unknown> | void;
    try { result = onRefresh(); } catch (e) { result = Promise.reject(e); }
    if (controlled) return;
    Promise.resolve(result).then(
      () => { setStamp(new Date()); setPhase('idle'); spring.to(0); },
      () => { setPhase('failed'); spring.to(0); },
    );
  }, [disabled, controlled, refreshing, onRefresh, spring]);

  // a controlled refresh opens and closes the band from outside
  useEffect(() => {
    if (!controlled) return;
    if (refreshing) { measure(); spring.to(detent.current); setPhase('working'); }
    else if (phaseRef.current === 'working') { setPhase('idle'); spring.to(0); }
  }, [controlled, refreshing, spring]);

  // the gesture: touch only, starting at the very top of the list, and only a downward drag;
  // every other touch scrolls natively and is never prevented
  useEffect(() => {
    const el = scroller.current;
    if (!el || disabled) return;
    let startY = -1;
    let pulling = false;
    const atTop = () => el.scrollTop <= 0 && (el.scrollHeight > el.clientHeight || (document.scrollingElement?.scrollTop ?? 0) <= 0);
    const start = (e: TouchEvent) => {
      pulling = false;
      startY = phaseRef.current === 'working' || e.touches.length !== 1 || !atTop() ? -1 : e.touches[0].clientY;
    };
    const move = (e: TouchEvent) => {
      if (startY < 0) return;
      const dy = e.touches[0].clientY - startY;
      if (!pulling) {
        if (dy < -SLOP || !atTop()) { startY = -1; return; }
        if (dy < SLOP) return;
        pulling = true;
        measure();
      }
      const pull = Math.min(detent.current * STRETCH, Math.max(0, (dy - SLOP) * RESIST));
      if (e.cancelable) e.preventDefault();
      spring.to(pull, true);
      const next = pull >= detent.current ? 'armed' : 'pulling';
      if (phaseRef.current !== next) setPhase(next);
    };
    const end = () => {
      if (!pulling) { startY = -1; return; }
      pulling = false;
      startY = -1;
      if (phaseRef.current === 'armed') run();
      else { setPhase((p) => (p === 'pulling' ? 'idle' : p)); spring.to(0); }
    };
    el.addEventListener('touchstart', start, { passive: true });
    el.addEventListener('touchmove', move, { passive: false });
    el.addEventListener('touchend', end);
    el.addEventListener('touchcancel', end);
    return () => {
      el.removeEventListener('touchstart', start);
      el.removeEventListener('touchmove', move);
      el.removeEventListener('touchend', end);
      el.removeEventListener('touchcancel', end);
    };
  }, [disabled, run, spring]);

  const setRoot = useCallback((node: HTMLDivElement | null) => {
    root.current = node;
    if (typeof ref === 'function') ref(node);
    else if (ref) ref.current = node;
  }, [ref]);

  const state: PullToRefreshState = busy ? 'working' : phase === 'working' ? 'idle' : phase;
  const status = state === 'working' ? words.working : state === 'failed' ? words.failed : stamp ? `${words.updated} ${formatTime(stamp)}` : '';
  const vars = (height === undefined ? {} : { '--ptr-height': typeof height === 'number' ? `${height}px` : height }) as CSSProperties;

  return (
    <div
      ref={setRoot}
      data-component="PullToRefresh"
      data-state={state}
      aria-busy={state === 'working' || undefined}
      className={cx(styles.root, className)}
      style={{ ...vars, ...style }}
      {...rest}
    >
      <div className={styles.bar}>
        <span id={labelId} className={styles.label}>{label}</span>
        <span role="status" aria-live="polite" className={styles.status}>{status}</span>
        <IconButton
          label={words.refresh}
          disabled={disabled}
          aria-disabled={state === 'working' || undefined}
          onClick={run}
        >
          <RefreshIcon />
        </IconButton>
      </div>
      <div ref={scroller} role="region" aria-labelledby={labelId} className={styles.scroller}>
        <div className={styles.gauge}>
          {state === 'working' ? (
            <div className={styles.work}><Progress size="sm" label={label} /></div>
          ) : (
            <>
              <span ref={ruler} className={styles.ruler} aria-hidden="true">
                {TICKS.map((t) => <span key={t} className={styles.tick} style={{ '--t': t } as CSSProperties} />)}
                <span className={cx(styles.tick, styles.detent)} style={{ '--t': 1 } as CSSProperties} />
                <span className={styles.index} />
              </span>
              <span className={styles.word} aria-hidden="true">{state === 'armed' ? words.release : words.pull}</span>
            </>
          )}
        </div>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
});
