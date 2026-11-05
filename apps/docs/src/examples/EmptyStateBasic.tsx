// @example An empty room: the unlit display, the line, what to do and the room's one orange key
import { Button, Card, EmptyState, Heading } from 'dial-react';

export default function EmptyStateBasic() {
  return (
    <Card header={<Heading level={3}>Kitchen</Heading>} style={{ inlineSize: 'min(100%, var(--ds-layout-frame-phone))' }}>
      <EmptyState drawing="display" title="No devices in the kitchen yet" action={<Button kind="primary">Add a device</Button>}>
        Plug one in near the hub, then add it here.
      </EmptyState>
    </Card>
  );
}
