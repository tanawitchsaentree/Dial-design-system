import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
  type RefObject,
} from 'react';
import { createPortal } from 'react-dom';
import { cx } from '../../cx';
import { messages } from '../../messages';
import { useIsoLayoutEffect } from '../../spring';
import { usePresence } from '../../presence';
import { Button } from '../Button';
import styles from './Onboarding.module.css';

/** The part a callout points at: the `id` of an element, the element itself, a ref to it, or a function that finds it. */
export type CoachTarget = string | HTMLElement | RefObject<HTMLElement | null> | (() => HTMLElement | null);

/** Why a tour ended: `finish` is the last key, `skip` is the Skip key, `escape` is the Escape key. */
export type OnboardingReason = 'finish' | 'skip' | 'escape';

export interface CoachMarkProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'children'> {
  /** The part to point at. An `id` string (a leading # is allowed), the element, a ref or a function that returns it. */
  target: CoachTarget;
  /** The callout's heading. It names the dialog for assistive tech. */
  title: string;
  /** The text under the title: one or two short sentences about the part. */
  children?: ReactNode;
  /** Which step this is, counted from 1. With `total` it prints "n of N". */
  step?: number;
  /** How many steps the tour has. */
  total?: number;
  /** Whether the callout shows. It defaults to true, so a bare CoachMark is open. */
  open?: boolean;
  /** Which side of the part the panel stands on. `auto` (default) takes below and flips above when there is more room there. */
  placement?: 'auto' | 'top' | 'bottom';
  /** The last step: Next reads "Done" and Skip is left out. */
  last?: boolean;
  /** Called by the Back key. Leave it out and the Back key is not drawn. On step 1 the key is drawn but disabled. */
  onBack?: () => void;
  /** Called by the Next key (or Done on the last step). */
  onNext?: () => void;
  /** Called by the Skip key. Leave it out and Skip is not drawn. */
  onSkip?: () => void;
  /** Called by the Escape key. It defaults to `onSkip`. */
  onEscape?: () => void;
  /** Called when the target cannot be found, so the owner can move on to the next step. */
  onMissing?: () => void;
  /** The accessible name and printed word of the Back key. It defaults to the built-in word "Back". */
  backLabel?: string;
  /** The printed word of the Next key. It defaults to the built-in word "Next". */
  nextLabel?: string;
  /** The printed word of the Next key on the last step. It defaults to the built-in word "Done". */
  doneLabel?: string;
  /** The printed word of the Skip key. It defaults to the built-in word "Skip". */
  skipLabel?: string;
  /** The count in your own words, such as "2 de 5". It defaults to the built-in "2 of 5". */
  countLabel?: string;
}

const TABBABLE = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

const px = (v: string, fallback: number) => {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : fallback;
};

/** Finds the element a target names, or null when it is not on the page. */
export function resolveTarget(t: CoachTarget | undefined): HTMLElement | null {
  if (!t || typeof document === 'undefined') return null;
  if (typeof t === 'string') return document.getElementById(t.startsWith('#') ? t.slice(1) : t);
  if (typeof t === 'function') return t();
  if (typeof HTMLElement !== 'undefined' && t instanceof HTMLElement) return t;
  return (t as RefObject<HTMLElement | null>).current ?? null;
}

/** Puts focus on a target without scrolling. A target that is not a key or a field is given a temporary tabindex so it can take focus. */
function focusTarget(el: HTMLElement) {
  if (el.tabIndex < 0 && !el.hasAttribute('tabindex')) {
    el.setAttribute('tabindex', '-1');
    el.addEventListener('blur', () => el.removeAttribute('tabindex'), { once: true });
  }
  el.focus({ preventScroll: true });
}

/** One step of a tour: a full-ink ring round an existing part and a small plastic panel beside it with the step count, a title, a line of text and the Skip, Back and Next keys. It does not dim or scroll the page. Use `Onboarding` to run a sequence. */
export const CoachMark = forwardRef<HTMLDivElement, CoachMarkProps>(function CoachMark(
  { target, title, children, step, total, open = true, placement = 'auto', last = false, onBack, onNext, onSkip, onEscape, onMissing, backLabel, nextLabel, doneLabel, skipLabel, countLabel, className, ...rest },
  ref,
) {
  const id = useId();
  const titleId = `${id}-title`;
  const countId = `${id}-count`;
  const bodyId = `${id}-body`;
  const [el, setEl] = useState<HTMLElement | null>(null);
  const panel = useRef<HTMLDivElement | null>(null);
  const ring = useRef<HTMLDivElement | null>(null);
  const missing = useRef(onMissing);
  missing.current = onMissing;
  const escape = useRef(onEscape ?? onSkip);
  escape.current = onEscape ?? onSkip;
  // the panel and the ring stay on the body while they leave, so ending moves out instead of vanishing (D-008)
  const presence = usePresence<HTMLDivElement>(open && el !== null);

  const setPanel = (node: HTMLDivElement | null) => {
    panel.current = node;
    presence.ref(node);
    if (typeof ref === 'function') ref(node);
    else if (ref) ref.current = node;
  };

  // find the part each time the tour opens or points somewhere else
  useIsoLayoutEffect(() => {
    if (!open) return;
    const found = resolveTarget(target);
    setEl(found);
    if (!found) missing.current?.();
  }, [open, target, step]);

  const place = useCallback(() => {
    const p = panel.current, r = ring.current;
    let t = el;
    if (t && !t.isConnected) t = resolveTarget(target);
    if (!t || !p) return;
    const box = t.getBoundingClientRect();
    const cs = getComputedStyle(p);
    const margin = px(cs.getPropertyValue('--ds-gap-lg'), 12);
    const gap = px(cs.getPropertyValue('--ds-gap-sm'), 6);
    const lift = px(cs.getPropertyValue('--ds-gap-xs'), 4);
    const vw = document.documentElement.clientWidth, vh = document.documentElement.clientHeight;
    // the ring stands one gap outside the part; the panel stands one gap outside the ring
    if (r) {
      r.style.inset = `${Math.round(box.top - lift)}px auto auto ${Math.round(box.left - lift)}px`;
      r.style.inlineSize = `${Math.round(box.width + lift * 2)}px`;
      r.style.blockSize = `${Math.round(box.height + lift * 2)}px`;
    }
    p.style.maxBlockSize = '';
    const size = p.getBoundingClientRect();
    const below = vh - box.bottom - lift - gap - margin, above = box.top - lift - gap - margin;
    const down = placement === 'bottom' ? true : placement === 'top' ? false : size.height <= below || below >= above;
    const room = Math.max(down ? below : above, 0);
    const h = room > 0 ? Math.min(size.height, room) : size.height;
    if (size.height > room && room > 0) p.style.maxBlockSize = `${room}px`;
    const rtl = getComputedStyle(t).direction === 'rtl';
    const wide = size.width;
    // viewport coordinates: the panel is fixed to the screen, so x runs from the screen's left edge in any direction
    const x = Math.max(margin, Math.min(rtl ? box.right - wide : box.left, vw - margin - wide));
    const raw = down ? box.bottom + lift + gap : box.top - lift - gap - h;
    // a part scrolled out of view leaves the panel at the nearest screen edge instead of off the page
    const y = Math.max(margin, Math.min(raw, vh - margin - h));
    p.style.inset = `${Math.round(y)}px auto auto ${Math.round(x)}px`;
    p.dataset.side = down ? 'bottom' : 'top';
  }, [el, target, placement]);

  useIsoLayoutEffect(() => {
    const p = panel.current;
    if (!open || !el || !p) return;
    // the panel lives on the body, so it takes the theme and the direction of the place its part is in
    const theme = el.closest('[data-theme]')?.getAttribute('data-theme');
    const dir = getComputedStyle(el).direction;
    for (const n of [p, ring.current]) {
      if (!n) continue;
      if (theme) n.setAttribute('data-theme', theme);
      n.setAttribute('dir', dir);
    }
    place();
    // focus goes to the panel each time a step opens, so the title and the count are read out
    p.focus({ preventScroll: true });
  }, [open, el, step, title]);

  useEffect(() => {
    if (!open || !el) return;
    const move = () => place();
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape' || e.defaultPrevented) return;
      e.preventDefault();
      escape.current?.();
    };
    window.addEventListener('resize', move);
    window.addEventListener('scroll', move, true);
    document.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('resize', move);
      window.removeEventListener('scroll', move, true);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, el, place]);

  const onPanelKey = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'Tab' || !panel.current || !el) return;
    // the panel sits at the end of the page, so Tab past either end of it hands focus to the part it points at
    const list = Array.from(panel.current.querySelectorAll<HTMLElement>(TABBABLE));
    const at = list.indexOf(document.activeElement as HTMLElement);
    const lastOne = at === list.length - 1 || list.length === 0;
    const firstOne = at <= 0;
    if (e.shiftKey ? firstOne : lastOne) { e.preventDefault(); focusTarget(el); }
  };

  const count = countLabel ?? (step !== undefined && total !== undefined ? messages.onboarding.stepOf(step, total) : undefined);
  const first = step !== undefined && step <= 1;

  if (!presence.mounted || !el || typeof document === 'undefined') return null;

  return createPortal(
    <>
      <div ref={ring} aria-hidden="true" data-component="CoachMark" data-part="ring" data-state={presence.state} className={styles.ring} />
      <div
        ref={setPanel}
        role="dialog"
        aria-labelledby={titleId}
        aria-describedby={cx(count ? countId : false, children ? bodyId : false) || undefined}
        tabIndex={-1}
        data-component="CoachMark"
        data-state={presence.state}
        // a leaving panel is only a picture of the content: no key reaches it and assistive tech no longer lists it
        inert={presence.state === 'closing' || undefined}
        className={cx(styles.panel, className)}
        onKeyDown={onPanelKey}
        {...rest}
      >
        {count ? <p id={countId} className={styles.count}>{count}</p> : null}
        <p id={titleId} className={styles.title}>{title}</p>
        {children ? <div id={bodyId} className={styles.body}>{children}</div> : null}
        <div className={styles.keys}>
          {onSkip && !last ? <Button className={styles.skip} onClick={onSkip}>{skipLabel ?? messages.onboarding.skip}</Button> : null}
          {onBack ? <Button onClick={onBack} disabled={first}>{backLabel ?? messages.onboarding.back}</Button> : null}
          <Button onClick={onNext}>{last ? (doneLabel ?? messages.onboarding.done) : (nextLabel ?? messages.onboarding.next)}</Button>
        </div>
      </div>
    </>,
    document.body,
  );
});

export interface OnboardingStep {
  /** The part this step points at. */
  target: CoachTarget;
  /** The step's heading. */
  title: string;
  /** The text under the heading. */
  text?: ReactNode;
}

/** What `onDone` is told when a tour ends. */
export interface OnboardingDone {
  /** How it ended. */
  reason: OnboardingReason;
  /** The zero-based step it ended on. */
  step: number;
}

export interface OnboardingProps extends Omit<CoachMarkProps, 'target' | 'title' | 'children' | 'step' | 'total' | 'last' | 'onBack' | 'onNext' | 'onSkip' | 'onEscape' | 'onMissing' | 'countLabel' | 'open'> {
  /** The steps in order. Each points at a part by id, element or ref. A step whose part is not on the page is passed over. */
  steps: OnboardingStep[];
  /** Controlled: whether the tour is running. Pair it with `onOpenChange`. */
  open?: boolean;
  /** Uncontrolled: whether the tour starts running. It defaults to false, so a page starts it from a key or a first visit. */
  defaultOpen?: boolean;
  /** Called with the next state when the tour starts or ends. */
  onOpenChange?: (open: boolean) => void;
  /** Controlled: the zero-based index of the step on show. Pair it with `onStepChange`. */
  stepIndex?: number;
  /** Uncontrolled: the zero-based step the tour starts on. */
  defaultStepIndex?: number;
  /** Called with the new zero-based index when Back or Next moves the tour. */
  onStepChange?: (index: number) => void;
  /** Called once when the tour ends by the last key, Skip or Escape. Save the answer here (a cookie, local storage, a profile flag) so the tour is not offered again. */
  onDone?: (done: OnboardingDone) => void;
  /** Builds the count in your own words from the position and the length, such as "2 de 5". It defaults to the built-in "2 of 5". */
  formatCount?: (n: number, total: number) => string;
}

/** Runs a tour: it shows a CoachMark per step, keeps the order, moves focus to each panel, hands focus back to the part it was on when the tour ends, and ends on Escape. It renders nothing in the page itself and never scrolls it. */
export const Onboarding = forwardRef<HTMLDivElement, OnboardingProps>(function Onboarding(
  { steps, open: openProp, defaultOpen = false, onOpenChange, stepIndex, defaultStepIndex = 0, onStepChange, onDone, formatCount, ...rest },
  ref,
) {
  const openControlled = openProp !== undefined;
  const stepControlled = stepIndex !== undefined;
  const [innerOpen, setInnerOpen] = useState(defaultOpen);
  const [innerStep, setInnerStep] = useState(defaultStepIndex);
  const open = openControlled ? openProp : innerOpen;
  const total = steps.length;
  const index = Math.min(Math.max(stepControlled ? stepIndex : innerStep, 0), Math.max(total - 1, 0));
  const current = steps[index];
  const heading = useRef(1);

  const setOpen = (next: boolean) => {
    if (!openControlled) setInnerOpen(next);
    onOpenChange?.(next);
  };
  const setStep = (next: number) => {
    if (!stepControlled) setInnerStep(next);
    onStepChange?.(next);
  };
  const end = (reason: OnboardingReason, refocus: boolean) => {
    const el = refocus && current ? resolveTarget(current.target) : null;
    setOpen(false);
    if (index !== 0) setStep(0);
    onDone?.({ reason, step: index });
    if (el) focusTarget(el);
  };
  const go = (to: number) => {
    heading.current = to >= index ? 1 : -1;
    if (to >= total) end('finish', true);
    else if (to >= 0) setStep(to);
  };

  // a closed tour keeps rendering its callout so the callout can sink out; it unmounts itself when it has left
  if (!current || total === 0) return null;

  return (
    <CoachMark
      ref={ref}
      {...rest}
      open={open}
      target={current.target}
      title={current.title}
      step={index + 1}
      total={total}
      last={index === total - 1}
      countLabel={formatCount?.(index + 1, total)}
      onBack={() => go(index - 1)}
      onNext={() => go(index + 1)}
      onSkip={() => end('skip', true)}
      onEscape={() => end('escape', true)}
      onMissing={() => {
        // a part that is not on the page is passed over in the direction the person was going
        const to = index + heading.current;
        if (to >= total) end('finish', false);
        else if (to >= 0) setStep(to);
        else end('skip', false);
      }}
    >
      {current.text}
    </CoachMark>
  );
});
