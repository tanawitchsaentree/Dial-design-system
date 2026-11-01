// @example In a list of devices, one badge per row at the end of the line
import { Badge, Stack } from 'dial-react';

const ROWS: Array<[string, 'positive' | 'critical' | 'neutral', string]> = [
  ['Kitchen lamp', 'positive', 'Online'],
  ['Hall speaker', 'critical', 'Offline'],
  ['Bedroom heater', 'neutral', 'Standby'],
];

export default function BadgeInList() {
  return (
    <Stack gap="sm" style={{ maxInlineSize: 320 }}>
      {ROWS.map(([name, tone, word]) => (
        <Stack key={name} direction="row" align="center" style={{ justifyContent: 'space-between' }}>
          <span>{name}</span>
          <Badge tone={tone}>{word}</Badge>
        </Stack>
      ))}
    </Stack>
  );
}
