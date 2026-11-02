// @example A lit lamp is a glass bead in its status hue with a full edge; the word stays ink on plastic
import { Badge, Stack } from 'dial-react';

export default function BadgeLamps() {
  return (
    <Stack direction="row" gap="lg" style={{ flexWrap: 'wrap' }}>
      <Badge tone="positive">Online</Badge>
      <Badge tone="warning">Filter due</Badge>
      <Badge tone="critical">Leak</Badge>
      <Badge tone="info">Update ready</Badge>
      <Badge>Idle</Badge>
    </Stack>
  );
}
