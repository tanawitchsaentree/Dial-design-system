// @example A history inside a unit, under its title
import { Card, Heading, Timeline, TimelineItem } from 'dial-react';

export default function TimelineInUnit() {
  return (
    <div style={{ inlineSize: 'min(100%, var(--ds-layout-frame-md))' }}>
      <Card header={<Heading level={3}>Washer</Heading>} wordmark="dial" model="wash 2">
        <Timeline>
          <TimelineItem time="21:05" title="Cycle finished" latest>Cotton 40, 1 h 52 min.</TimelineItem>
          <TimelineItem time="19:13" title="Cycle started" />
        </Timeline>
      </Card>
    </div>
  );
}
