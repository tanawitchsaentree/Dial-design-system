// @example The unit is offline, so its slot takes no card. The room's name and the lamp stay readable
import { Badge, Card, Slot, Stack } from 'dial-react';

export default function SlotOffline() {
  return (
    <Card padding="unit" wordmark="dial" model="scene 1" style={{ inlineSize: 'max-content', maxInlineSize: '100%' }}>
      <Stack gap="md">
        <Badge tone="critical">Hub not answering</Badge>
        <Slot label="Garage" disabled />
      </Stack>
    </Card>
  );
}
