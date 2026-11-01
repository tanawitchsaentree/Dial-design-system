// @example Each tone has its own glyph, so the tones differ without colour
import { Badge, Stack } from 'dial-react';

export default function BadgeTones() {
  return (
    <Stack gap="xs">
      <Badge tone="neutral">Standby</Badge>
      <Badge tone="positive">Online</Badge>
      <Badge tone="warning">Filter due</Badge>
      <Badge tone="critical">Door open</Badge>
      <Badge tone="info">Update ready</Badge>
    </Stack>
  );
}
