// @example A long list with height scrolls inside its own frame; the pull starts only at the top
import { List, PullToRefresh } from 'dial-react';

const rooms = ['Hall', 'Kitchen', 'Living room', 'Bedroom', 'Bathroom', 'Study', 'Garage', 'Garden', 'Attic', 'Cellar'];
const ask = () => new Promise((done) => setTimeout(done, 1000));

export default function PullToRefreshHeight() {
  return (
    <div style={{ inlineSize: 'min(100%, var(--ds-layout-frame-phone))', maxInlineSize: '100%' }}>
      <PullToRefresh label="All rooms" height={260} onRefresh={ask} updated={new Date(2026, 10, 2, 10, 40)}>
        <List label="All rooms">
          {rooms.map((r, i) => <List.Item key={r} label={r} description={`${(18 + (i % 5) * 0.8).toFixed(1)} °C`} />)}
        </List>
      </PullToRefresh>
    </div>
  );
}
