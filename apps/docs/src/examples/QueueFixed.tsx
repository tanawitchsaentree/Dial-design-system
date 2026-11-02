// @example With removable={false} a programme can be reordered but not cut, and the menu holds only the two moves
import { Queue } from 'dial-react';

const TRACKS = [
  { id: 'w1', title: 'Pre-wash', artist: 'Cotton 40°', duration: 900 },
  { id: 'w2', title: 'Main wash', artist: 'Cotton 40°', duration: 2700 },
  { id: 'w3', title: 'Spin', artist: 'Cotton 40°', duration: 600 },
];

export default function QueueFixed() {
  return (
    <div style={{ inlineSize: 380, maxInlineSize: '100%' }}>
      <Queue label="Wash steps" defaultTracks={TRACKS} removable={false} />
    </div>
  );
}
