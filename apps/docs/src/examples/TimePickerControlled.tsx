// @example A controlled pair. The schedule keeps the time as HH:MM on the 24 hour clock and says the length of the night
import { useState } from 'react';
import { Stack, Text, TimePicker } from 'dial-react';

const minutes = (v: string) => { const [h, m] = v.split(':').map(Number); return h * 60 + m; };

export default function TimePickerControlled() {
  const [from, setFrom] = useState('22:30');
  const [to, setTo] = useState('06:30');
  const span = from && to ? (minutes(to) - minutes(from) + 1440) % 1440 : null;
  return (
    <Stack gap="md" align="start">
      <Stack direction="row" gap="lg">
        <TimePicker label="Starts" value={from} onValueChange={setFrom} />
        <TimePicker label="Ends" value={to} onValueChange={setTo} />
      </Stack>
      <Text size="caption">{span === null ? 'Set both times.' : `Night mode runs for ${Math.floor(span / 60)} h ${span % 60} min.`}</Text>
    </Stack>
  );
}
