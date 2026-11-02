// @example A play queue as one listbox with printed track numbers and the chosen track marked in ink and weight
import { useState } from 'react';
import { List, Text, Stack } from 'dial-react';

const TRACKS = [
  { value: 't1', title: 'Kiln song', by: 'Ulm Quartet · 3:42' },
  { value: 't2', title: 'Weniger, aber besser', by: 'Hochschule · 4:10' },
  { value: 't3', title: 'Slow return', by: 'The Faders · 2:58' },
  { value: 't4', title: 'Detent', by: 'Rotary Club · 3:05' },
];

export default function ListQueue() {
  const [playing, setPlaying] = useState('t2');
  const now = TRACKS.find((t) => t.value === playing);
  return (
    <Stack gap="md" style={{ inlineSize: 380, maxInlineSize: '100%' }}>
      <List label="Queue" selectable value={playing} onValueChange={setPlaying}>
        {TRACKS.map((t, i) => <List.Item key={t.value} value={t.value} index={i + 1} label={t.title} description={t.by} />)}
      </List>
      <Text tone="secondary" aria-live="polite">Playing {now?.title}</Text>
    </Stack>
  );
}
