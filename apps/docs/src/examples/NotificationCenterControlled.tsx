// @example Read state and removal kept in your own state: onReadChange and onDismiss only report what the person pressed
import { useState } from 'react';
import { NotificationCenter, NotificationItem, Text } from 'dial-react';

const START = [
  { id: 'washer', day: 'Today', title: 'Washer finished', time: '22:40', detail: 'Laundry room', unread: true },
  { id: 'night', day: 'Today', title: 'Night mode started', time: '22:30', detail: 'Heating set to 18', unread: true },
  { id: 'door', day: 'Yesterday', title: 'Front door locked', time: '23:10', detail: 'Hall', unread: false },
];

export default function NotificationCenterControlled() {
  const [items, setItems] = useState(START);
  const unread = items.filter((n) => n.unread).length;
  return (
    <div style={{ inlineSize: 'var(--ds-layout-frame-phone)', maxInlineSize: '100%' }}>
      <NotificationCenter
        onReadChange={(id, read) => setItems((all) => all.map((n) => (n.id === id ? { ...n, unread: !read } : n)))}
        onDismiss={(id) => setItems((all) => all.filter((n) => n.id !== id))}
      >
        {items.map((n) => (
          <NotificationItem key={n.id} id={n.id} day={n.day} title={n.title} time={n.time} unread={n.unread}>{n.detail}</NotificationItem>
        ))}
      </NotificationCenter>
      <Text>{`${items.length} kept, ${unread} unread`}</Text>
    </div>
  );
}
