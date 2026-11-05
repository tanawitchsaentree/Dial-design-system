// @example Three sections share the strip in equal parts, each still a full-height target
import { useState } from 'react';
import { BottomNav, Icon } from 'dial-react';

const SECTIONS = [
  { value: 'home', label: 'Home', href: '/home', icon: <Icon name="home" /> },
  { value: 'energy', label: 'Energy', href: '/energy', icon: <Icon name="plug" /> },
  { value: 'settings', label: 'Settings', href: '/settings', icon: <Icon name="settings" /> },
];

export default function BottomNavThree() {
  const [current, setCurrent] = useState('energy');
  return (
    <div style={{ inlineSize: 'min(100%, var(--ds-layout-frame-phone))' }}>
      <BottomNav layout="bar" items={SECTIONS} current={current} onNavigate={(value, e) => { e.preventDefault(); setCurrent(value); }} />
    </div>
  );
}
