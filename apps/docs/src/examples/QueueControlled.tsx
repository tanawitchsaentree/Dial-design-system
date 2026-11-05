// @example Controlled. The app keeps the order, and the line under the queue prints it after every move
import { useState } from 'react';
import { Queue, Stack, Text } from 'dial-react';

const START = [
  { id: 'a', title: 'Morning news', artist: 'Radio dial', duration: 600 },
  { id: 'b', title: 'Kitchen hour', artist: 'Studio dial', duration: 1800 },
  { id: 'c', title: 'Weather', artist: 'Radio dial', duration: 240 },
];

export default function QueueControlled() {
  const [tracks, setTracks] = useState(START);
  return (
    <Stack gap="md" style={{ inlineSize: 'min(100%, var(--ds-layout-frame-phone))', maxInlineSize: '100%' }}>
      <Queue label="Programme" tracks={tracks} onTracksChange={setTracks} playing="a" />
      <Text tone="secondary">Order {tracks.map((t) => t.title).join(', ')}</Text>
    </Stack>
  );
}
