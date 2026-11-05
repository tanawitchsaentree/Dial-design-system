// @example When the hub does not answer, the status line says so and keeps the old readings
import { List, PullToRefresh } from 'dial-react';

const ask = () => new Promise((_, fail) => setTimeout(() => fail(new Error('timeout')), 1200));

export default function PullToRefreshFailed() {
  return (
    <div style={{ inlineSize: 'min(100%, var(--ds-layout-frame-phone))', maxInlineSize: '100%' }}>
      <PullToRefresh label="Garden" onRefresh={ask} updated={new Date(2026, 10, 2, 9, 58)}>
        <List label="Garden">
          <List.Item label="Soil sensor" description="Moist · 34 %" />
          <List.Item label="Sprinkler" description="Off" />
        </List>
      </PullToRefresh>
    </div>
  );
}
