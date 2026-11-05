// @example latest lights one event: a filled node, a medium title and the word Latest for assistive tech
import { Timeline, TimelineItem } from 'dial-react';

export default function TimelineLatest() {
  return (
    <Timeline>
      <TimelineItem time="07:15" title="Heating on" latest />
      <TimelineItem time="06:50" title="Alarm stopped" />
    </Timeline>
  );
}
