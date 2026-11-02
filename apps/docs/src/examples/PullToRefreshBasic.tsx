// @example Readings from the hub: pull the list down past the detent, or press the refresh key
import { List, PullToRefresh } from 'dial-react';

const ask = () => new Promise((done) => setTimeout(done, 1200));

export default function PullToRefreshBasic() {
  return (
    <div style={{ inlineSize: 360, maxInlineSize: '100%' }}>
      <PullToRefresh label="Readings" onRefresh={ask} updated={new Date(2026, 10, 2, 10, 41)}>
        <List label="Readings">
          <List.Item label="Kitchen" description="21.5 °C · 44 %" />
          <List.Item label="Bedroom" description="19.0 °C · 51 %" />
          <List.Item label="Garden sensor" description="Battery 12 %" />
        </List>
      </PullToRefresh>
    </div>
  );
}
