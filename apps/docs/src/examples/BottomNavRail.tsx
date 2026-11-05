// @example layout rail prints the sections down the inline start of a wide screen, the mark beside the row
import { useState } from 'react';
import { BottomNav, Icon } from 'dial-react';

const SECTIONS = [
  { value: 'home', label: 'Home', href: '/home', icon: <Icon name="home" /> },
  { value: 'rooms', label: 'Rooms', href: '/rooms', icon: <Icon name="room" /> },
  { value: 'media', label: 'Media', href: '/media', icon: <Icon name="play" /> },
  { value: 'settings', label: 'Settings', href: '/settings', icon: <Icon name="settings" /> },
];

export default function BottomNavRail() {
  const [current, setCurrent] = useState('media');
  return (
    <div style={{ blockSize: 'var(--ds-layout-frame-sm)', display: 'flex' }}>
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
