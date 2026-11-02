// @example A long queue on a narrow column. Titles wrap onto two lines, and numbers and lengths stay in their columns
import { Queue } from 'dial-react';

const TRACKS = Array.from({ length: 9 }, (_, i) => ({
  id: `long-${i + 1}`,
  title: i === 2 ? 'The long interview with the designer of the radio, part two' : `Side ${i < 5 ? 'A' : 'B'}, track ${i + 1}`,
  artist: i % 2 ? 'Studio dial' : 'Ulm Quartet',
  duration: 150 + i * 37,
}));

export default function QueueLong() {
  return (
    <div data-overflow-demo="" style={{ inlineSize: 300, maxInlineSize: '100%' }}>
      <Queue defaultTracks={TRACKS} playing="long-3" />
    </div>
  );
}
