// @example In a phone frame the page sits above the strip on the case’s bottom edge and follows the link
import { useState } from 'react';
import { BottomNav, Heading, Icon, Stack } from 'dial-react';

const SECTIONS = [
  { value: 'home', label: 'Home', href: '/home', icon: <Icon name="home" /> },
  { value: 'rooms', label: 'Rooms', href: '/rooms', icon: <Icon name="room" /> },
  { value: 'media', label: 'Media', href: '/media', icon: <Icon name="play" /> },
  { value: 'settings', label: 'Settings', href: '/settings', icon: <Icon name="settings" /> },
];

export default function BottomNavInShell() {
  const [current, setCurrent] = useState('rooms');
  const name = SECTIONS.find((s) => s.value === current)?.label;
  return (
    <div style={{ inlineSize: 'min(100%, var(--ds-layout-frame-phone))', display: 'grid', gridTemplateRows: '1fr auto', minBlockSize: 'var(--ds-layout-frame-lg)' }}>
      <div className="demo-box">
        <Stack gap="lg">
          <Heading level={3}>{name}</Heading>
          <p className="flush">{current === 'rooms' ? 'Kitchen, Living room, Bedroom' : 'Nothing here yet.'}</p>
        </Stack>
      </div>
      <BottomNav layout="bar" items={SECTIONS} current={current} onNavigate={(value, e) => { e.preventDefault(); setCurrent(value); }} />
    </div>
  );
}
