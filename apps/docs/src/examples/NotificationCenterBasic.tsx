// @example Notifications grouped by day: a filled lamp and a medium title for unread, a ring for read, two keys on each line
import { NotificationCenter, NotificationItem } from 'dial-react';

export default function NotificationCenterBasic() {
  return (
    <div style={{ inlineSize: 'var(--ds-layout-frame-phone)', maxInlineSize: '100%' }}>
      <NotificationCenter>
        <NotificationItem id="washer" day="Today" title="Washer finished" time="22:40" dateTime="2026-11-04T22:40" unread>Laundry room</NotificationItem>
        <NotificationItem id="night" day="Today" title="Night mode started" time="22:30" dateTime="2026-11-04T22:30" unread>Heating set to 18</NotificationItem>
        <NotificationItem id="door" day="Yesterday" title="Front door locked" time="23:10" dateTime="2026-11-03T23:10">Hall</NotificationItem>
        <NotificationItem id="filter" day="Yesterday" title="Filter due" time="18:05" dateTime="2026-11-03T18:05" unread>Hall</NotificationItem>
      </NotificationCenter>
    </div>
  );
}
