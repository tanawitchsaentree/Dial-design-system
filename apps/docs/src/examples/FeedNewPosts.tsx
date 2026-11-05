// @example newCount above 0 hangs a notice from the top edge without moving a post; pressing it calls onShowNew
import { useState } from 'react';
import { Feed, FeedItem } from 'dial-react';

export default function FeedNewPosts() {
  const [posts, setPosts] = useState(['Heating is down to 18.', 'Hall lamp set to warm.']);
  const [fresh, setFresh] = useState(['Washer finished.', 'Front door locked.']);
  return (
    <div style={{ inlineSize: 'var(--ds-layout-frame-md)', maxInlineSize: '100%' }}>
      <Feed
        label="House activity"
        newCount={fresh.length}
        onShowNew={() => { setPosts((p) => [...fresh, ...p]); setFresh([]); }}
      >
        {posts.map((t) => <FeedItem key={t} name="Tan Saen" time="today">{t}</FeedItem>)}
      </Feed>
    </div>
  );
}
