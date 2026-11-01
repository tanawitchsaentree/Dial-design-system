// @example count prints a number before the word in tabular figures
import { Badge, Stack } from 'dial-react';

export default function BadgeCount() {
  return (
    <Stack direction="row" gap="lg" style={{ flexWrap: 'wrap' }}>
      <Badge tone="critical" count={3}>offline</Badge>
      <Badge tone="positive" count={12}>online</Badge>
      <Badge tone="info" count={2}>updates</Badge>
    </Stack>
  );
}
