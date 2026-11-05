// @example offset is the height of a fixed header, so a heading counts as reached once it clears the bar
import { useState } from 'react';
import { Anchor } from 'dial-react';

const SECTIONS = [
  { id: 'off-overview', label: 'Overview' },
  { id: 'off-wiring', label: 'Wiring' },
  { id: 'off-schedules', label: 'Schedules' },
];
const BAR = 44;

export default function AnchorOffset() {
  const [page, setPage] = useState<HTMLDivElement | null>(null);
  return (
    <div className="demo-box demo-card" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: 'var(--ds-gap-xl)' }}>
      <div style={{ inlineSize: 'var(--ds-size-frame-xs)' }}>
        <Anchor items={SECTIONS} root={page} offset={BAR} />
      </div>
      <div ref={setPage} tabIndex={0} aria-label="Page" style={{ flex: '1 1 var(--ds-size-frame-xs)', overflowY: 'auto', blockSize: 'var(--ds-size-frame-md)' }}>
        <p className="flush" style={{ position: 'sticky', insetBlockStart: 'var(--ds-gap-none)', blockSize: 'var(--ds-control-md)', display: 'flex', alignItems: 'center', background: 'var(--ds-surface-solid)' }}>Kitchen hub</p>
        {SECTIONS.map((s) => (
          <section key={s.id} style={{ minBlockSize: 'var(--ds-size-frame-sm)', scrollMarginBlockStart: 'var(--ds-control-md)' }}>
            <h3 id={s.id}>{s.label}</h3>
            <p>Text of the {s.label.toLowerCase()} section.</p>
          </section>
        ))}
      </div>
    </div>
  );
}
