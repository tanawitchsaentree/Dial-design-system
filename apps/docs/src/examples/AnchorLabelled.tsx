// @example label names the landmark in your own language; Thai headings keep their marks inside the row
import { useState } from 'react';
import { Anchor } from 'dial-react';

const SECTIONS = [
  { id: 'th-overview', label: 'ภาพรวม' },
  { id: 'th-wiring', label: 'การเชื่อมต่ออุปกรณ์' },
  { id: 'th-schedules', label: 'ตารางเวลา' },
];

export default function AnchorLabelled() {
  const [page, setPage] = useState<HTMLDivElement | null>(null);
  return (
    <div className="demo-box demo-card" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: 'var(--ds-gap-xl)' }}>
      <div style={{ inlineSize: 'var(--ds-size-frame-xs)' }}>
        <Anchor items={SECTIONS} root={page} label="ในหน้านี้" />
      </div>
      <div ref={setPage} tabIndex={0} aria-label="หน้า" style={{ flex: '1 1 var(--ds-size-frame-xs)', overflowY: 'auto', blockSize: 'var(--ds-size-frame-md)' }}>
        {SECTIONS.map((s) => (
          <section key={s.id} style={{ minBlockSize: 'var(--ds-size-frame-sm)' }}>
            <h3 id={s.id}>{s.label}</h3>
            <p>เนื้อหาของส่วน{s.label}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
