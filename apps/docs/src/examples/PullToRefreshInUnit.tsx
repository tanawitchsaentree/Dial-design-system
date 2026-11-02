// @example In a plastic unit on a phone, the bar printed on the inset line above the rows
import { Card, List, PullToRefresh } from 'dial-react';

const ask = () => new Promise((done) => setTimeout(done, 1500));

export default function PullToRefreshInUnit() {
  return (
    <Card style={{ inlineSize: 360, maxInlineSize: '100%' }}>
      <PullToRefresh label="Living room" onRefresh={ask} updated={new Date(2026, 10, 2, 10, 38)}>
        <List label="Devices in the living room">
          <List.Item label="Floor lamp" description="On · 60%" />
          <List.Item label="Speaker" description="Paused" />
          <List.Item label="Air purifier" description="Auto · fan 2" />
          <List.Item label="Window sensor" description="Closed" />
        </List>
      </PullToRefresh>
    </Card>
  );
}
