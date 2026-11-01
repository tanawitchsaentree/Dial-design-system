// The Appearance menu and its state (pattern from Pane's topbar). One control in the top bar says what the
// examples currently show and opens the axes in system/appearance.ts. The address carries a value only when
// someone chose something other than the default; unknown and retired values fall back and are dropped on
// load (G-ST1). Nothing is written to storage here.
import { useEffect, useLayoutEffect, useState } from 'react';
import { APPEARANCE, RETIRED_PARAMS, type AppearanceAxis } from '../system/appearance';
import { SegmentedControl } from 'dial-react';

export type Appearance = Record<string, string>;

const known = (a: AppearanceAxis, v: string | null) => (v != null && a.options.some(([id]) => id === v) ? v : a.fallback);

function readAppearance(): Appearance {
  const q = new URLSearchParams(location.search);
  return Object.fromEntries(APPEARANCE.map((a) => [a.id, known(a, q.get(a.param))]));
}

/** The address after a change: defaults removed, choices kept, every other param left alone. */
export function addressFor(look: Appearance, href = location.href): string {
  const u = new URL(href);
  for (const p of RETIRED_PARAMS) u.searchParams.delete(p);
  for (const a of APPEARANCE) {
    const v = look[a.id];
    if (!v || v === a.fallback) u.searchParams.delete(a.param); else u.searchParams.set(a.param, v);
  }
  return `${u.pathname}${u.search}${u.hash}`;
}

export function useAppearance(): [Appearance, (id: string, value: string) => void] {
  const [look, setLook] = useState<Appearance>(readAppearance);
  useLayoutEffect(() => {
    for (const a of APPEARANCE) if (a.root) document.documentElement.dataset[a.id] = look[a.id];
  }, [look]);
  useEffect(() => {
    const next = addressFor(look);
    if (next !== `${location.pathname}${location.search}${location.hash}`) history.replaceState(null, '', next);
  }, [look]);
  return [look, (id, value) => setLook((l) => ({ ...l, [id]: value }))];
}

/** The top-bar control. The summary names every current choice, so the reader sees what the book shows.
 *  The choices open as a strip under the top bar (AppearancePanel), in the page flow: the page moves down
 *  to make room, so the open menu never sits over the text of the page or the On this page list. */
export function AppearanceMenu({ look, open, onToggle }: { look: Appearance; open: boolean; onToggle: (open: boolean) => void }) {
  const summary = APPEARANCE.map((a) => a.options.find(([id]) => id === look[a.id])?.[1] ?? look[a.id]).join(', ');
  const controls = Object.fromEntries(APPEARANCE.map((a) => [`data-${a.id}-control`, '']));
  return (
    <details className="tb-appearance" open={open} onToggle={(e) => onToggle(e.currentTarget.open)} {...controls}>
      <summary aria-label={`Appearance of the examples: ${summary}`} aria-controls="appearance-panel">Appearance <span className="muted">{summary}</span></summary>
    </details>
  );
}

/** The open Appearance menu: a full-width strip in the page grid, right under the top bar. */
export function AppearancePanel({ look, onChange }: { look: Appearance; onChange: (id: string, value: string) => void }) {
  const controls = Object.fromEntries(APPEARANCE.map((a) => [`data-${a.id}-control`, '']));
  return (
    <section id="appearance-panel" className="tb-appearance-body" aria-label="Appearance of the examples" {...controls}>
      <p className="muted">How the examples in this book look. In a product each of these is one prop, set in code.</p>
      <div className="tb-appearance-choices">
        {/* a bank of keys, not a Select: a few choices read at a glance, and no closed listbox sits in the
            page ahead of the chapter's own controls (G-F1 picks the first option on the page) */}
        {APPEARANCE.map((a) => (
          <SegmentedControl key={a.id} label={a.label} value={look[a.id]} options={a.options.map(([value, label]) => ({ value, label }))} onValueChange={(v) => onChange(a.id, v)} />
        ))}
      </div>
    </section>
  );
}
