// @example The app tracks the refresh itself with refreshing and sets the time with updated
import { useState } from 'react';
import { List, PullToRefresh } from 'dial-react';

export default function PullToRefreshControlled() {
  const [busy, setBusy] = useState(false);
  const [at, setAt] = useState(new Date(2026, 10, 2, 10, 30));
  const ask = () => {
    setBusy(true);
    setTimeout(() => { setAt(new Date()); setBusy(false); }, 1500);
  };
  return (
    <div style={{ inlineSize: 360, maxInlineSize: '100%' }}>
      <PullToRefresh label="Energy" onRefresh={ask} refreshing={busy} updated={at}>
        <List label="Energy">
          <List.Item label="House" description="1.8 kW now" />
          <List.Item label="Solar" description="2.4 kW now" />
          <List.Item label="Battery" description="68 % · charging" />
        </List>
      </PullToRefresh>
    </div>
  );
}
