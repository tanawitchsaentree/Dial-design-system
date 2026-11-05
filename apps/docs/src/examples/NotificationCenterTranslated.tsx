// @example Your own words through the words prop, and headingLevel 3 for a center that sits under an h2 in a drawer
import { NotificationCenter, NotificationItem } from 'dial-react';

export default function NotificationCenterTranslated() {
  return (
    <div style={{ inlineSize: 'var(--ds-layout-frame-phone)', maxInlineSize: '100%' }}>
      <NotificationCenter
        headingLevel={3}
        words={{
          title: 'Mitteilungen',
          markAll: 'Alle gelesen',
          markRead: (t) => `Als gelesen markieren: ${t}`,
          dismiss: (t) => `Entfernen: ${t}`,
          unread: 'ungelesen',
          unreadPrefix: 'Ungelesen:',
          empty: 'Keine Mitteilungen',
          emptyText: 'Neue Meldungen aus dem Haus erscheinen hier.',
        }}
      >
        <NotificationItem id="waesche" day="Heute" title="Waschmaschine fertig" time="22:40" unread>Waschküche</NotificationItem>
        <NotificationItem id="tuer" day="Gestern" title="Haustür verriegelt" time="23:10">Flur</NotificationItem>
      </NotificationCenter>
    </div>
  );
}
