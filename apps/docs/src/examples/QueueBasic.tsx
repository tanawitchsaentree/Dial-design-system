// @example The up-next list. Press a row to play it, Alt with an arrow moves it, Delete removes it, and the menu key says the same in words
import { useState } from 'react';
import { Queue } from 'dial-react';

const TRACKS = [
  { id: 't1', title: 'Kiln song', artist: 'Ulm Quartet', duration: 222 },
  { id: 't2', title: 'Weniger, aber besser', artist: 'Hochschule', duration: 250 },
  { id: 't3', title: 'Slow return', artist: 'The Faders', duration: 178 },
  { id: 't4', title: 'Detent', artist: 'Rotary Club', duration: 185 },
];

export default function QueueBasic() {
  const [playing, setPlaying] = useState('t2');
  return (
    <div style={{ inlineSize: 380, maxInlineSize: '100%' }}>
      <Queue defaultTracks={TRACKS} playing={playing} onPlay={setPlaying} />
    </div>
  );
}
