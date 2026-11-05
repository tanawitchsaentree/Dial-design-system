import {
  forwardRef,
  useEffect,
  useId,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
} from 'react';
import { cx } from '../../cx';
import { usePresence } from '../../presence';
import { Badge } from '../Badge';
import { Icon } from '../Icon';
import { hand, slotOrder, slots, useHand, type SceneInfo } from '../SceneCard/sceneStore';
import styles from './Slot.module.css';

/** The words the slot prints and speaks. Pass your own for another language. */
export interface SlotWords {
  /** The legend printed in an empty bay. */
  legend: string;
  /** The lamp's word while a scene is in. */
  running: string;
  /** The lamp's word while the slot is empty. */
  empty: string;
  /** The slot's accessible name. `printed` is what the face prints besides the scene name (the first step, or the legend when empty); keep it in the name so a voice user can say what they see (WCAG 2.5.3). */
  name: (label: string, scene: string | null, printed?: string) => string;
  inserted: (scene: string, label: string) => string;
  removed: (scene: string, label: string) => string;
  pickFirst: (label: string) => string;
}

const WORDS: SlotWords = {
  legend: 'scene card',
  running: 'Running',
  empty: 'Empty',
  name: (l, s, p) => (s ? `${l} slot, ${s}${p ? `, ${p}` : ''}, inserted` : `${l} slot, empty${p ? `, ${p}` : ''}`),
  inserted: (s, l) => `${s} inserted into ${l}`,
  removed: (s, l) => `${s} taken out of ${l}`,
  pickFirst: (l) => `Pick up a scene card first, then press the ${l} slot.`,
};

export interface SlotProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  /** The room or device the slot belongs to, such as "Living room". Printed under the slit and used in every announcement. */
  label: string;
  /** The scene in the slot when controlled, or null when it is empty. Pair it with `onSceneChange`. */
  scene?: SceneInfo | null;
  /** The scene in the slot at the start when uncontrolled. It does not run again on load. */
  defaultScene?: SceneInfo | null;
  /** Called with the new scene after a card goes in, or null after it is taken out. */
  onSceneChange?: (scene: SceneInfo | null) => void;
  /** Called when a card is inserted, to run its scene. */
  onInsert?: (scene: SceneInfo) => void;
  /** Called when the inserted card is taken out. */
  onRemove?: (scene: SceneInfo) => void;
  /** The slot takes no card, for a unit that is offline. */
  disabled?: boolean;
  /** Your own words for the legend, the lamp and the announcements. */
  words?: Partial<SlotWords>;
}

/** The slot a room or a device unit has for scene cards. A held SceneCard goes in with a press or Enter, or by
 *  dragging it here; the card then stands half out with its name readable and the lamp says Running. A press
 *  with no card held takes the inserted card out. */
export const Slot = forwardRef<HTMLDivElement, SlotProps>(function Slot(
  { label, scene, defaultScene = null, onSceneChange, onInsert, onRemove, disabled = false, words, className, ...rest },
  ref,
) {
  const w = { ...WORDS, ...words };
  const id = useId();
  const controlled = scene !== undefined;
  const [inner, setInner] = useState<SceneInfo | null>(defaultScene);
  const current = controlled ? scene : inner;
  // a card taken out stays printed while it lifts away (D-008); the last scene is what it shows meanwhile
  const presence = usePresence<HTMLSpanElement>(!!current);
  const lastScene = useRef(current);
  if (current) lastScene.current = current;
  const shown = current ?? (presence.mounted ? lastScene.current : null);
  const [fresh, setFresh] = useState<string | null>(null);
  const [said, setSaid] = useState('');
  const mouth = useRef<HTMLButtonElement>(null);
  const { held, over } = useHand();

  const latest = useRef({ label, disabled, controlled, onSceneChange, onInsert, w });
  latest.current = { label, disabled, controlled, onSceneChange, onInsert, w };

  const commit = (next: SceneInfo | null) => {
    if (!latest.current.controlled) setInner(next);
    latest.current.onSceneChange?.(next);
  };

  // the slot is known to every card on the page, so a drag or a key can find it
  useEffect(() => {
    slots.set(id, {
      el: mouth.current,
      label,
      disabled,
      insert: (s) => {
        const L = latest.current;
        if (L.disabled) return;
        commit(s);
        setFresh(s.value);
        hand.hold(null);
        L.onInsert?.(s);
        setSaid(L.w.inserted(s.name, L.label));
        mouth.current?.focus();
      },
    });
    return () => { slots.delete(id); };
  }, [id, label, disabled]); // eslint-disable-line react-hooks/exhaustive-deps

  const press = () => {
    if (disabled) return;
    const h = hand.get().held;
    if (h) { slots.get(id)?.insert(h); return; }
    if (current) {
      commit(null);
      setFresh(null);
      onRemove?.(current);
      setSaid(w.removed(current.name, label));
      return;
    }
    setSaid(w.pickFirst(label));
  };

  const keys = (e: KeyboardEvent<HTMLButtonElement>) => {
    const order = slotOrder();
    const i = order.findIndex(([k]) => k === id);
    const go: Record<string, number> = { ArrowRight: i + 1, ArrowDown: i + 1, ArrowLeft: i - 1, ArrowUp: i - 1, Home: 0, End: order.length - 1 };
    if (!(e.key in go) || i < 0) return;
    e.preventDefault();
    order[Math.max(0, Math.min(order.length - 1, go[e.key]))]?.[1].el?.focus();
  };

  const first = current?.steps?.[0];

  return (
    <div ref={ref} data-component="Slot" className={cx(styles.root, className)} {...rest}>
      <button
        ref={mouth}
        type="button"
        className={styles.mouth}
        aria-label={w.name(label, current?.name ?? null, current ? first : w.legend)}
        disabled={disabled}
        data-ready={held && !disabled ? 'true' : undefined}
        data-over={over === id ? 'true' : undefined}
        onClick={press}
        onKeyDown={keys}
      >
        <span className={styles.bay} aria-hidden="true">
          {!current && (
            <span className={styles.legend}>
              {w.legend}
              {/* dial's one icon language, the dot matrix (R-005) */}
              <Icon name="chevron-down" size="sm" />
            </span>
          )}
          {shown && (
            <span key={shown.value} ref={presence.ref} data-state={current ? 'open' : 'closing'} className={styles.face} data-fresh={fresh === shown.value ? 'true' : undefined}>
              <span className={styles.name}>{shown.name}</span>
              {/* a space between the two printed lines, so the face reads as words, not "Movie nightLamps 20%";
                  the grid face does not render it (WCAG 2.5.3, the name holds what the face prints) */}
              {shown.steps?.[0] && <>{' '}<span className={styles.step}>{shown.steps[0]}</span></>}
            </span>
          )}
        </span>
        <span className={styles.slit} aria-hidden="true" />
      </button>
      <span className={styles.foot}>
        <span className={styles.label}>{label}</span>
        <Badge tone={current ? 'positive' : 'neutral'}>{current ? w.running : w.empty}</Badge>
      </span>
      <span className={styles.announce} role="status" aria-live="polite">{said}</span>
    </div>
  );
});
