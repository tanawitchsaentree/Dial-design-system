// @example hasMore shows the load more key; pressing it, or Page Down on the last post, asks for the next page
import { useState } from 'react';
import { Feed, FeedItem } from 'dial-react';

const page = (from: number) => Array.from({ length: 3 }, (_, i) => ({ id: from + i, name: `Room ${from + i}`, text: `Reading ${from + i} came in on time.` }));

export default function FeedLoadMore() {
  const [posts, setPosts] = useState(page(1));
  const [busy, setBusy] = useState(false);
  const load = () => {
    setBusy(true);
    window.setTimeout(() => { setPosts((p) => [...p, ...page(p.length + 1)]); setBusy(false); }, 600);
  };
  return (
    <div style={{ inlineSize: 'var(--ds-layout-frame-md)', maxInlineSize: '100%' }}>
      <Feed label="Readings" busy={busy} hasMore={posts.length < 9} onLoadMore={load}>
        {posts.map((p) => <FeedItem key={p.id} name={p.name} time={`${p.id}:00`}>{p.text}</FeedItem>)}
      </Feed>
    </div>
  );
}
