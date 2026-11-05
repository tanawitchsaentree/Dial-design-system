// @example value and onValueChange set the current section yourself and read it back, for example into a title
import { useState } from 'react';
import { Anchor } from 'dial-react';

const SECTIONS = [
  { id: 'ctl-overview', label: 'Overview' },
  { id: 'ctl-wiring', label: 'Wiring' },
  { id: 'ctl-schedules', label: 'Schedules' },
];

export default function AnchorControlled() {
  const [page, setPage] = useState<HTMLDivElement | null>(null);
  const [current, setCurrent] = useState('ctl-overview');
  return (
    <div className="demo-box demo-card" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: 'var(--ds-gap-xl)' }}>
      <div style={{ inlineSize: 'var(--ds-size-frame-xs)' }}>
        <Anchor items={SECTIONS} root={page} value={current} onValueChange={setCurrent} />
        <p className="flush" aria-live="polite">Reading: {SECTIONS.find((s) => s.id === current)?.label}</p>
      </div>
      <div ref={setPage} tabIndex={0} aria-label="Page" style={{ flex: '1 1 var(--ds-size-frame-xs)', overflowY: 'auto', blockSize: 'var(--ds-size-frame-md)' }}>
        {SECTIONS.map((s) => (
          <section key={s.id} style={{ minBlockSize: 'var(--ds-size-frame-sm)' }}>
            <h3 id={s.id}>{s.label}</h3>
            <p>Text of the {s.label.toLowerCase()} section.</p>
          </section>
        ))}
      </div>
    </div>
  );
}
