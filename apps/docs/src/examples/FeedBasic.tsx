// @example Three posts with an avatar window, a name and a time; the list ends with a printed end line
import { Feed, FeedItem } from 'dial-react';

export default function FeedBasic() {
  return (
    <div style={{ inlineSize: 'var(--ds-layout-frame-md)', maxInlineSize: '100%' }}>
      <Feed label="House activity">
        <FeedItem name="Mali Kaew" time="22:40" dateTime="2026-11-04T22:40">The washer is done. I moved the load to the dryer.</FeedItem>
        <FeedItem name="Tan Saen" time="21:15" dateTime="2026-11-04T21:15">Heating is down to 18 for the night.</FeedItem>
        <FeedItem name="Pim Nok" time="19:02" dateTime="2026-11-04T19:02">Hall lamp set to warm, 40 percent.</FeedItem>
      </Feed>
    </div>
  );
}
