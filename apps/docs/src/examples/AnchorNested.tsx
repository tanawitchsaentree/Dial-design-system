// @example Sub-headings print one module in, and the list follows them in order
import { useState } from 'react';
import { Anchor } from 'dial-react';

const ITEMS = [
  { id: 'nest-overview', label: 'Overview' },
  {
    id: 'nest-wiring',
    label: 'Wiring',
    items: [
      { id: 'nest-hub', label: 'Hub' },
      { id: 'nest-sensors', label: 'Sensors' },
    ],
  },
  { id: 'nest-schedules', label: 'Schedules' },
];

const FLAT = ['nest-overview', 'nest-wiring', 'nest-hub', 'nest-sensors', 'nest-schedules'];
const NAMES: Record<string, string> = { 'nest-overview': 'Overview', 'nest-wiring': 'Wiring', 'nest-hub': 'Hub', 'nest-sensors': 'Sensors', 'nest-schedules': 'Schedules' };

export default function AnchorNested() {
  const [page, setPage] = useState<HTMLDivElement | null>(null);
  return (
    <div className="demo-box demo-card" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: 'var(--ds-gap-xl)' }}>
      <div style={{ inlineSize: 'var(--ds-size-frame-xs)' }}>
        <Anchor items={ITEMS} root={page} />
      </div>
      <div ref={setPage} tabIndex={0} aria-label="Page" style={{ flex: '1 1 var(--ds-size-frame-xs)', overflowY: 'auto', blockSize: 'var(--ds-size-frame-md)' }}>
        {FLAT.map((id) => (
          <section key={id} style={{ minBlockSize: 'var(--ds-size-frame-sm)' }}>
            <h3 id={id}>{NAMES[id]}</h3>
            <p>Text of the {NAMES[id].toLowerCase()} section.</p>
          </section>
        ))}
      </div>
    </div>
  );
}
