// @example The empty state gives way to the list as soon as the first device is added
import { useState } from 'react';
import { Badge, Button, Card, EmptyState, Heading, Stack, Text } from 'dial-react';

export default function EmptyStateFilled() {
  const [devices, setDevices] = useState<string[]>([]);
  const add = () => setDevices((d) => [...d, `Lamp ${d.length + 1}`]);
  return (
    <Card header={<Heading level={3}>Kitchen</Heading>} style={{ inlineSize: 'min(100%, var(--ds-layout-frame-phone))' }}>
      {devices.length ? (
        <Stack gap="md">
          {devices.map((d) => <Stack key={d} direction="row" gap="md" align="center"><Text>{d}</Text><Badge tone="positive">Online</Badge></Stack>)}
          <Button onClick={add}>Add another</Button>
        </Stack>
      ) : (
        <EmptyState drawing="display" title="No devices in the kitchen yet" action={<Button kind="primary" onClick={add}>Add a device</Button>}>
          Plug one in near the hub, then add it here.
        </EmptyState>
      )}
    </Card>
  );
}
