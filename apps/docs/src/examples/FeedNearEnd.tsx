// @example onNearEnd fires when the end of the list scrolls into view, here inside a short scrolling box
import { useState } from 'react';
import { Feed, FeedItem } from 'dial-react';

export default function FeedNearEnd() {
  const [count, setCount] = useState(6);
  const [busy, setBusy] = useState(false);
  const more = () => {
    setBusy(true);
    window.setTimeout(() => { setCount((n) => n + 4); setBusy(false); }, 500);
  };
  return (
    <div style={{ inlineSize: 'var(--ds-layout-frame-md)', maxInlineSize: '100%', blockSize: 'var(--ds-layout-frame-xs)', overflowY: 'auto' }}>
      <Feed label="Log" busy={busy} hasMore={count < 18} onNearEnd={more}>
        {Array.from({ length: count }, (_, i) => <FeedItem key={i} name={`Sensor ${i + 1}`} time="now">Reading {i + 1} stored.</FeedItem>)}
      </Feed>
    </div>
  );
}
