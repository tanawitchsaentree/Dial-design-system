// @example Three sections share the strip in equal parts, each still a full-height target
import { useState } from 'react';
import { BottomNav } from 'dial-react';

const g = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;
const SECTIONS = [
  { value: 'home', label: 'Home', href: '/home', icon: <svg {...g}><path d="M4 11l8-7 8 7v9H4z" /><path d="M10 20v-5h4v5" /></svg> },
  { value: 'energy', label: 'Energy', href: '/energy', icon: <svg {...g}><path d="M13 3L5 13h6l-1 8 8-10h-6z" /></svg> },
  { value: 'settings', label: 'Settings', href: '/settings', icon: <svg {...g}><path d="M4 7h10M18 7h2M4 17h2M10 17h10" /><circle cx="16" cy="7" r="2" /><circle cx="8" cy="17" r="2" /></svg> },
];

export default function BottomNavThree() {
  const [current, setCurrent] = useState('energy');
  return (
    <div style={{ inlineSize: 'min(100%, 375px)' }}>
      <BottomNav layout="bar" items={SECTIONS} current={current} onNavigate={(value, e) => { e.preventDefault(); setCurrent(value); }} />
    </div>
  );
}
