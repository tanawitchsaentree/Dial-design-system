// @example A longer time such as a weekday stays in the same column, and dateTime gives the time element a machine value
import { Timeline, TimelineItem } from 'dial-react';

export default function TimelineDays() {
  return (
    <Timeline>
      <TimelineItem time="Today 08:10" dateTime="2026-11-04T08:10" title="Door unlocked" latest />
      <TimelineItem time="Mon 23:02" dateTime="2026-11-02T23:02" title="Door locked" />
      <TimelineItem time="Mon 18:44" dateTime="2026-11-02T18:44" title="Front door opened">Opened by the spare key.</TimelineItem>
    </Timeline>
  );
}
