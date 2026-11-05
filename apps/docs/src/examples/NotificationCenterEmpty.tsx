// @example With no notifications the center shows an EmptyState line and keeps its header and a dimmed Mark all read key
import { NotificationCenter } from 'dial-react';

export default function NotificationCenterEmpty() {
  return (
    <div style={{ inlineSize: 'var(--ds-layout-frame-phone)', maxInlineSize: '100%' }}>
      <NotificationCenter />
    </div>
  );
}
