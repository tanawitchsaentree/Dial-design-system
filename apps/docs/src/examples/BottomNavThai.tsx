// @example Thai section names keep their marks and their width when the current section changes
import { useState } from 'react';
import { BottomNav, Icon } from 'dial-react';

const SECTIONS = [
  { value: 'home', label: 'หน้าหลัก', href: '/home', icon: <Icon name="home" /> },
  { value: 'rooms', label: 'ห้อง', href: '/rooms', icon: <Icon name="room" /> },
  { value: 'media', label: 'สื่อ', href: '/media', icon: <Icon name="play" /> },
  { value: 'settings', label: 'การตั้งค่า', href: '/settings', icon: <Icon name="settings" /> },
];

export default function BottomNavThai() {
  const [current, setCurrent] = useState('settings');
  return (
    <div lang="th" style={{ inlineSize: 'min(100%, var(--ds-layout-frame-phone))' }}>
      <BottomNav layout="bar" label="ส่วนหลัก" items={SECTIONS} current={current} onNavigate={(value, e) => { e.preventDefault(); setCurrent(value); }} />
    </div>
  );
}
