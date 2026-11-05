// @example A new notification added at the top is announced once by a hidden polite region and counted in the header
import { useState } from 'react';
import { Button, NotificationCenter, NotificationItem, Stack } from 'dial-react';

export default function NotificationCenterArrivals() {
  const [count, setCount] = useState(1);
  const list = Array.from({ length: count }, (_, i) => count - i);
  return (
    <Stack gap="lg">
      <Button onClick={() => setCount((c) => c + 1)}>Add a notification</Button>
      <div style={{ inlineSize: 'var(--ds-layout-frame-phone)', maxInlineSize: '100%' }}>
        <NotificationCenter>
          {list.map((n) => (
            <NotificationItem key={n} id={`cycle-${n}`} day="Today" title={`Cycle ${n} finished`} time="22:40" unread>Washer</NotificationItem>
          ))}
        </NotificationCenter>
      </div>
    </Stack>
  );
}
