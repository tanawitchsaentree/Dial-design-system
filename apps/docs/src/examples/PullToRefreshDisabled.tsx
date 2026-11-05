// @example disabled while the hub is being set up, so the pull and the key do nothing
import { List, PullToRefresh } from 'dial-react';

export default function PullToRefreshDisabled() {
  return (
    <div style={{ inlineSize: 'min(100%, var(--ds-layout-frame-phone))', maxInlineSize: '100%' }}>
      <PullToRefresh label="New hub" disabled onRefresh={() => undefined} messages={{ refresh: 'Refresh, not available yet' }}>
        <List label="New hub"><List.Item label="Pairing" description="Two devices found" /></List>
      </PullToRefresh>
    </div>
  );
}
