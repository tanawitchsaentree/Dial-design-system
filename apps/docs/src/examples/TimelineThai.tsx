// @example Thai titles and a long detail wrap inside their column and the times stay in line
import { Timeline, TimelineItem } from 'dial-react';

export default function TimelineThai() {
  return (
    <Timeline>
      <TimelineItem time="22:40" title="เปิดโหมดกลางคืน" latest latestLabel="ล่าสุด">ตั้งเครื่องทำความร้อนไว้ที่ 18 องศา</TimelineItem>
      <TimelineItem time="21:05" title="เครื่องซักผ้าทำงานเสร็จแล้วและหยุดพักน้ำสุดท้าย" />
    </Timeline>
  );
}
