// @example busy marks the feed aria-busy and prints a loading mark in the footer in place of the key
import { Feed, FeedItem } from 'dial-react';

export default function FeedBusy() {
  return (
    <div style={{ inlineSize: 'var(--ds-layout-frame-md)', maxInlineSize: '100%' }}>
      <Feed label="House activity" busy hasMore>
        <FeedItem name="Mali Kaew" time="22:40">The washer is done.</FeedItem>
        <FeedItem name="Tan Saen" time="21:15">Heating is down to 18 for the night.</FeedItem>
      </Feed>
    </div>
  );
}
