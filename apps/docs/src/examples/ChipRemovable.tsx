// @example Removable chips, each with its own round remove key and a 44px target
import { useState } from 'react';
import { Chip, Stack } from 'dial-react';

export default function ChipRemovable() {
  const [rooms, setRooms] = useState(['Kitchen', 'Hall', 'Bedroom']);
  return (
    <Stack gap="sm">
      <Stack direction="row" gap="md" style={{ flexWrap: 'wrap' }}>
        {rooms.map((r) => (
          <Chip key={r} onRemove={() => setRooms((xs) => xs.filter((x) => x !== r))}>{r}</Chip>
        ))}
      </Stack>
      <p className="flush" aria-live="polite">{rooms.length ? `Showing ${rooms.join(', ')}.` : 'No rooms chosen.'}</p>
    </Stack>
  );
}
