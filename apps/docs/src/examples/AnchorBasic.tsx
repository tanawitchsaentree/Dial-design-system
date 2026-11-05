// @example A list of heading links beside the page; the section in view carries an ink index mark
import { useState } from 'react';
import { Anchor } from 'dial-react';

const SECTIONS = [
  { id: 'basic-overview', label: 'Overview' },
  { id: 'basic-wiring', label: 'Wiring' },
  { id: 'basic-schedules', label: 'Schedules' },
  { id: 'basic-reset', label: 'Reset' },
];

export default function AnchorBasic() {
  const [page, setPage] = useState<HTMLDivElement | null>(null);
  return (
    <div className="demo-box demo-card" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: 'var(--ds-gap-xl)' }}>
      <div style={{ inlineSize: 'var(--ds-size-frame-xs)' }}>
        <Anchor items={SECTIONS} root={page} />
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
