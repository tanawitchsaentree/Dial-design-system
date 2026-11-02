// @example A plastic key when the screen already has its orange key elsewhere
import { Button, Card, EmptyState, Heading, Stack } from 'dial-react';

export default function EmptyStatePlainKey() {
  return (
    <Stack gap="lg" style={{ inlineSize: 'min(100%, 380px)' }}>
      <Button kind="primary">Add a room</Button>
      <Card header={<Heading level={3}>Garden</Heading>}>
        <EmptyState drawing="display" title="No devices in the garden yet" action={<Button>Add a device</Button>}>
          Outdoor plugs and lamps show here once they are added.
        </EmptyState>
      </Card>
    </Stack>
  );
}
