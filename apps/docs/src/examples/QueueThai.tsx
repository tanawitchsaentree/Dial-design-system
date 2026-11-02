// @example Thai titles and words. Tone marks stay whole, a long title wraps, and the menu and announcements speak Thai
import { useState } from 'react';
import { Queue } from 'dial-react';

const TRACKS = [
  { id: 'th1', title: 'เพลงกล่อมเตา', artist: 'วงอูล์ม', duration: 222 },
  { id: 'th2', title: 'น้อยแต่ดีกว่า ฉบับบันทึกเสียงสดจากห้องเรียนออกแบบ', artist: 'ฮอคชูเลอ', duration: 250 },
  { id: 'th3', title: 'กลับช้าๆ', artist: 'เดอะเฟดเดอร์ส', duration: 178 },
];

export default function QueueThai() {
  const [playing, setPlaying] = useState('th1');
  return (
    <div style={{ inlineSize: 360, maxInlineSize: '100%' }}>
      <Queue
        label="คิวถัดไป"
        defaultTracks={TRACKS}
        playing={playing}
        onPlay={setPlaying}
        words={{
          playing: 'กำลังเล่น',
          moveUp: 'เลื่อนขึ้น',
          moveDown: 'เลื่อนลง',
          remove: 'เอาออกจากคิว',
          more: (t) => `ตัวเลือกของ ${t}`,
          moved: (t, p, n) => `${t} ย้ายไปลำดับ ${p} จาก ${n}`,
          removed: (t) => `เอา ${t} ออกจากคิวแล้ว`,
        }}
      />
    </div>
  );
}
