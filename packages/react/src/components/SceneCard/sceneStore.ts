// The hand: which scene card is held right now, which slot a dragged card is over, and the slots on the
// page. One card is held at a time, as one hand holds one card, so the store is shared by every SceneCard
// and Slot on the page without a provider.
import { useSyncExternalStore } from 'react';

/** A scene as a card carries it: its id, its printed name and the short lines of what it does. */
export interface SceneInfo {
  /** A stable id for the scene, such as "movie-night". */
  value: string;
  /** The scene's name, printed on the card's top edge, such as "Movie night". */
  name: string;
  /** What the scene does, one short line each, such as "Lamps 20%". */
  steps?: string[];
}

export interface SlotEntry {
  el: HTMLElement | null;
  label: string;
  disabled: boolean;
  insert: (scene: SceneInfo) => void;
}

export interface HandState {
  held: SceneInfo | null;
  /** Which card on the page is in the hand; two cards may print the same scene. */
  owner: string | null;
  over: string | null;
}

let state: HandState = { held: null, owner: null, over: null };
const subs = new Set<() => void>();
const emit = () => subs.forEach((f) => f());

export const slots = new Map<string, SlotEntry>();

export const hand = {
  get: () => state,
  hold(held: SceneInfo | null, owner: string | null = null) {
    state = { ...state, held, owner: held ? owner : null };
    emit();
  },
  over(id: string | null) {
    if (state.over === id) return;
    state = { ...state, over: id };
    emit();
  },
  subscribe(f: () => void) {
    subs.add(f);
    return () => { subs.delete(f); };
  },
};

const SERVER: HandState = { held: null, owner: null, over: null };
export const useHand = () => useSyncExternalStore(hand.subscribe, hand.get, () => SERVER);

/** The slots in reading order, the ones that can take a card. */
export const slotOrder = (): [string, SlotEntry][] =>
  [...slots].filter(([, s]) => s.el && !s.disabled).sort(([, a], [, b]) => (a.el!.compareDocumentPosition(b.el!) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));

/** The slot under a point on the screen, if any. */
export const slotAt = (x: number, y: number): string | null => {
  const el = document.elementFromPoint(x, y)?.closest<HTMLElement>('[data-component="Slot"]');
  if (!el) return null;
  for (const [id, s] of slots) if (s.el && el.contains(s.el) && !s.disabled) return id;
  return null;
};
