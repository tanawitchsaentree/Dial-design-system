// Presence: keeps a part mounted while it leaves, so a panel that closes moves out instead of vanishing in one
// frame (D-008, R-004). The part enters through CSS (@starting-style on its open state) and leaves through its
// data-state="closing" rule; this hook unmounts it once every transition and animation on it has finished.
import { useCallback, useEffect, useRef, useState } from 'react';

export type PresenceState = 'open' | 'closing' | 'closed';

export function usePresence<T extends HTMLElement>(open: boolean) {
  const [state, setState] = useState<PresenceState>(open ? 'open' : 'closed');
  const node = useRef<T | null>(null);
  useEffect(() => {
    if (open) { setState('open'); return; }
    setState((s) => (s === 'closed' ? s : 'closing'));
  }, [open]);
  useEffect(() => {
    if (state !== 'closing') return;
    const el = node.current;
    let done = false;
    const finish = () => { if (!done) { done = true; setState((s) => (s === 'closing' ? 'closed' : s)); } };
    if (!el || typeof el.getAnimations !== 'function') { finish(); return; }
    // the closing rule starts its transitions on the next frame; wait for them, never longer than a second
    const raf = requestAnimationFrame(() => {
      const running = el.getAnimations({ subtree: true });
      if (!running.length) finish();
      else Promise.allSettled(running.map((a) => a.finished)).then(finish);
    });
    const cap = window.setTimeout(finish, 1000);
    return () => { cancelAnimationFrame(raf); window.clearTimeout(cap); };
  }, [state]);
  const ref = useCallback((el: T | null) => { node.current = el; }, []);
  // open is mounted in the same render it turns on, so a part that moves focus into it on open finds it there
  const now: PresenceState = open ? 'open' : state === 'closed' ? 'closed' : 'closing';
  return { mounted: now !== 'closed', state: now, ref };
}
