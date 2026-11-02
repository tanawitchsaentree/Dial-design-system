// @example layout rail prints the sections down the inline start of a wide screen, the mark beside the row
import { useState } from 'react';
import { BottomNav } from 'dial-react';

const g = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;
const SECTIONS = [
  { value: 'home', label: 'Home', href: '/home', icon: <svg {...g}><path d="M4 11l8-7 8 7v9H4z" /><path d="M10 20v-5h4v5" /></svg> },
  { value: 'rooms', label: 'Rooms', href: '/rooms', icon: <svg {...g}><rect x="4" y="4" width="7" height="7" /><rect x="13" y="4" width="7" height="7" /><rect x="4" y="13" width="7" height="7" /><rect x="13" y="13" width="7" height="7" /></svg> },
  { value: 'media', label: 'Media', href: '/media', icon: <svg {...g}><circle cx="12" cy="12" r="8.5" /><path d="M10 8.5l5.5 3.5-5.5 3.5z" /></svg> },
  { value: 'settings', label: 'Settings', href: '/settings', icon: <svg {...g}><path d="M4 7h10M18 7h2M4 17h2M10 17h10" /><circle cx="16" cy="7" r="2" /><circle cx="8" cy="17" r="2" /></svg> },
];

export default function BottomNavRail() {
  const [current, setCurrent] = useState('media');
  return (
    <div style={{ blockSize: 300, display: 'flex' }}>
      <BottomNav
        layout="rail"
        label="Main sections"
        items={SECTIONS}
        current={current}
        onNavigate={(value, e) => { e.preventDefault(); setCurrent(value); }}
      />
    </div>
  );
}
