// @example Thai titles and words. The window wraps a long title and the keys keep their names in the reader's language
import { MediaPlayer, type MediaTrack } from 'dial-react';
import { useDemoTracks } from '../system/tones';

const TITLES = ['เพลงกล่อมเตาเผาในยามเช้าวันอาทิตย์', 'น้อยแต่ดีกว่า'];

export default function MediaPlayerThai() {
  const made = useDemoTracks(2);
  const tracks: MediaTrack[] = (made ?? []).map((t, i) => ({ ...t, title: TITLES[i], artist: 'วงอูล์ม', source: 'คลังเพลง' }));
  return (
    <MediaPlayer
      tracks={tracks}
      loading={!made}
      label="เครื่องเล่นเพลง"
      words={{ loading: 'กำลังโหลด', paused: 'หยุดชั่วคราว', playing: 'กำลังเล่น', ended: 'จบแล้ว', error: 'เล่นไฟล์นี้ไม่ได้', offline: 'ออฟไลน์', play: 'เล่น', previous: 'เพลงก่อนหน้า', next: 'เพลงถัดไป', volume: 'ระดับเสียง', level: 'ระดับสัญญาณ', transport: 'ปุ่มควบคุม' }}
    />
  );
}
