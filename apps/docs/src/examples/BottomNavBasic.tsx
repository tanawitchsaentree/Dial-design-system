// @example The phone app's four sections along the bottom edge, Rooms current, routing in the app
import { useState } from 'react';
import { BottomNav, Icon } from 'dial-react';

const SECTIONS = [
  { value: 'home', label: 'Home', href: '/home', icon: <Icon name="home" /> },
  { value: 'rooms', label: 'Rooms', href: '/rooms', icon: <Icon name="room" /> },
  { value: 'media', label: 'Media', href: '/media', icon: <Icon name="play" /> },
  { value: 'settings', label: 'Settings', href: '/settings', icon: <Icon name="settings" /> },
];

export default function BottomNavBasic() {
  const [current, setCurrent] = useState('rooms');
  return (
    <div style={{ inlineSize: 'min(100%, var(--ds-layout-frame-phone))' }}>
      <BottomNav
        layout="bar"
        items={SECTIONS}
        current={current}
        onNavigate={(value, e) => { e.preventDefault(); setCurrent(value); }}
      />
    </div>
  );
}
