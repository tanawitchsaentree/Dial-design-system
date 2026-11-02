import {
  forwardRef,
  useEffect,
  useId,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
} from 'react';
import { cx } from '../../cx';
import { hand, slotAt, slotOrder, slots, useHand, type SceneInfo } from './sceneStore';
import styles from './SceneCard.module.css';

/** The words the card prints and speaks. Pass your own for another language. */
export interface SceneCardWords {
  /** The small word printed at the card's foot. */
  kind: string;
  picked: (name: string) => string;
  putBack: (name: string) => string;
}

const WORDS: SceneCardWords = {
  kind: 'scene',
  picked: (n) => `${n} picked up. Choose a slot and press Enter, or Escape to put it back.`,
  putBack: (n) => `${n} put back.`,
};

export interface SceneCardProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'name' | 'value' | 'onClick'> {
  /** A stable id for the scene, such as "movie-night". A Slot reports it when the card goes in. */
  value: string;
  /** The scene's name, printed on the card's top edge so it stays readable in a slot. */
  name: string;
  /** What the scene does, one short line each, such as "Lamps 20%" and "Blinds down". Three lines read best. */
  steps?: string[];
  /** The card cannot be picked up, for a scene that cannot run now. It stays readable. */
  disabled?: boolean;
  /** Called when the card is picked up (true) or put back (false). */
  onHoldChange?: (held: boolean) => void;
  /** Your own words for the card's foot and its announcements. */
  words?: Partial<SceneCardWords>;
}

const Grip = () => (
  <svg className={styles.grip} viewBox="0 0 16 16" aria-hidden="true" focusable="false">
    <circle cx="5.5" cy="3" r="1.5" /><circle cx="10.5" cy="3" r="1.5" />
    <circle cx="5.5" cy="8" r="1.5" /><circle cx="10.5" cy="8" r="1.5" />
    <circle cx="5.5" cy="13" r="1.5" /><circle cx="10.5" cy="13" r="1.5" />
  </svg>
);

/** A scene printed on a small card of light stock. Pick it up with a press or Enter, then press a Slot to insert
 *  it; or drag it by its printed handle onto a Slot. Escape puts a held card back. */
export const SceneCard = forwardRef<HTMLButtonElement, SceneCardProps>(function SceneCard(
  { value, name, steps = [], disabled, onHoldChange, words, className, onKeyDown, ...rest },
  ref,
) {
  const w = { ...WORDS, ...words };
  const me = useId();
  const { owner } = useHand();
  const isHeld = owner === me;
  const btn = useRef<HTMLButtonElement | null>(null);
  const [said, setSaid] = useState('');
  const [dragging, setDragging] = useState(false);
  const skipClick = useRef(false);
  const scene: SceneInfo = { value, name, steps };

  const setRef = (el: HTMLButtonElement | null) => {
    btn.current = el;
    if (typeof ref === 'function') ref(el);
    else if (ref) ref.current = el;
  };

  // Escape anywhere puts the held card back in the hand's place, with focus on the card
  useEffect(() => {
    if (!isHeld) return;
    const esc = (e: globalThis.KeyboardEvent) => {
      if (e.key !== 'Escape' || hand.get().owner !== me) return;
      e.preventDefault();
      hand.hold(null);
      setSaid(w.putBack(name));
      onHoldChange?.(false);
      btn.current?.focus();
    };
    document.addEventListener('keydown', esc);
    return () => document.removeEventListener('keydown', esc);
  }, [isHeld, me, name]); // eslint-disable-line react-hooks/exhaustive-deps

  // a card that leaves the page leaves the hand too
  useEffect(() => () => { if (hand.get().owner === me) hand.hold(null); }, [me]);

  const press = (e: MouseEvent<HTMLButtonElement>) => {
    if (skipClick.current) { skipClick.current = false; return; }
    if (disabled) return;
    e.preventDefault();
    if (isHeld) {
      hand.hold(null);
      setSaid(w.putBack(name));
      onHoldChange?.(false);
    } else {
      hand.hold(scene, me);
      setSaid(w.picked(name));
      onHoldChange?.(true);
    }
  };

  const keys = (e: KeyboardEvent<HTMLButtonElement>) => {
    onKeyDown?.(e);
    if (e.defaultPrevented || !isHeld) return;
    const order = slotOrder();
    if (!order.length) return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); order[0][1].el?.focus(); }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); order[order.length - 1][1].el?.focus(); }
  };

  // the printed handle drags the card; the slot under the pointer takes it on release
  const grab = (e: PointerEvent<HTMLSpanElement>) => {
    if (disabled || e.button !== 0) return;
    const el = btn.current;
    if (!el) return;
    const sx = e.clientX, sy = e.clientY;
    let moving = false;
    const moveAt = (ev: globalThis.PointerEvent) => {
      const dx = ev.clientX - sx, dy = ev.clientY - sy;
      if (!moving && Math.hypot(dx, dy) < 4) return;
      if (!moving) { moving = true; setDragging(true); hand.hold(scene, me); }
      el.style.setProperty('--scene-dx', `${dx}px`);
      el.style.setProperty('--scene-dy', `${dy}px`);
      hand.over(slotAt(ev.clientX, ev.clientY));
    };
    const end = (ev: globalThis.PointerEvent) => {
      window.removeEventListener('pointermove', moveAt);
      window.removeEventListener('pointerup', end);
      window.removeEventListener('pointercancel', end);
      if (!moving) return;
      skipClick.current = true;
      // a click may not follow the release (the pointer left the card), so the flag clears itself
      setTimeout(() => { skipClick.current = false; }, 0);
      const id = ev.type === 'pointerup' ? slotAt(ev.clientX, ev.clientY) : null;
      el.style.removeProperty('--scene-dx');
      el.style.removeProperty('--scene-dy');
      setDragging(false);
      hand.over(null);
      const slot = id ? slots.get(id) : undefined;
      if (slot) slot.insert(scene);
      else hand.hold(null);
    };
    window.addEventListener('pointermove', moveAt);
    window.addEventListener('pointerup', end);
    window.addEventListener('pointercancel', end);
  };

  return (
    <div data-component="SceneCard" className={cx(styles.root, className)}>
      <button
        ref={setRef}
        type="button"
        className={styles.card}
        aria-pressed={isHeld}
        disabled={disabled}
        data-dragging={dragging ? 'true' : undefined}
        onClick={press}
        onKeyDown={keys}
        {...rest}
      >
        <span className={styles.handle} aria-hidden="true" onPointerDown={grab}><Grip /></span>
        <span className={styles.name}>{name}</span>
        {steps.length > 0 && (
          <span className={styles.steps}>
            {steps.map((s) => <span key={s} className={styles.step}>{s}</span>)}
          </span>
        )}
        <span className={styles.foot} aria-hidden="true">
          <span className={styles.kind}>{w.kind}</span>
          <svg className={styles.arrow} viewBox="0 0 10 10" focusable="false"><path d="M1 2h8L5 8z" /></svg>
        </span>
      </button>
      <span className={styles.announce} role="status" aria-live="polite">{said}</span>
    </div>
  );
});
