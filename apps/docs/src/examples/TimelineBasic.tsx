// @example Three past events, newest first: the time in a column, a hairline rail and a node for each
import { Timeline, TimelineItem } from 'dial-react';

export default function TimelineBasic() {
  return (
    <Timeline>
      <TimelineItem time="22:40" title="Night mode started" latest>Heater set to 18.</TimelineItem>
      <TimelineItem time="21:05" title="Washer finished" />
      <TimelineItem time="18:30" title="Kitchen lamp dimmed">From 80 to 30 by the evening schedule.</TimelineItem>
    </Timeline>
  );
}
