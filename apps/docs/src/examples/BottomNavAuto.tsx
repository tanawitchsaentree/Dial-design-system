// @example layout auto prints a strip on a screen taller than it is wide and a rail beside the page otherwise
import { useState } from 'react';
import { BottomNav, Heading, Icon } from 'dial-react';

const SECTIONS = [
  { value: 'home', label: 'Home', href: '/home', icon: <Icon name="home" /> },
  { value: 'rooms', label: 'Rooms', href: '/rooms', icon: <Icon name="room" /> },
  { value: 'media', label: 'Media', href: '/media', icon: <Icon name="play" /> },
  { value: 'settings', label: 'Settings', href: '/settings', icon: <Icon name="settings" /> },
];
const NAMES: Record<string, string> = { home: 'Home', rooms: 'Rooms', media: 'Media', settings: 'Settings' };

export default function BottomNavAuto() {
  const [current, setCurrent] = useState('home');
  return (
    <div className="bottom-nav-shell" style={{ display: 'flex', flexWrap: 'wrap-reverse', alignItems: 'stretch', minBlockSize: 'var(--ds-layout-frame-sm)', inlineSize: '100%' }}>
      <BottomNav items={SECTIONS} current={current} onNavigate={(value, e) => { e.preventDefault(); setCurrent(value); }} />
      <div className="demo-box" style={{ flex: '1 1 240px' }}>
        <Heading level={3}>{NAMES[current]}</Heading>
      </div>
    </div>
  );
}
