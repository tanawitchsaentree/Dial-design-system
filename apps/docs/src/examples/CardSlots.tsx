// @example header and footer are optional rows; the body alone is a card too
import { Button, Card, Heading, Stack, Text } from 'dial-react';

export default function CardSlots() {
  return (
    <Stack direction="row" gap="lg" align="start" style={{ flexWrap: 'wrap' }}>
      <div style={{ inlineSize: 'min(100%, var(--ds-layout-frame-sm))' }}>
        <Card header={<><Heading level={4}>Kitchen</Heading><Text as="span" size="caption" tone="secondary">3 lamps</Text></>}>
          <Text tone="secondary">Two lamps on, one off.</Text>
        </Card>
      </div>
      <div style={{ inlineSize: 'min(100%, var(--ds-layout-frame-sm))' }}>
        <Card footer={<Button>Open</Button>}>
          <Text tone="secondary">The dishwasher finished at 14:05.</Text>
        </Card>
      </div>
      <div style={{ inlineSize: 'min(100%, var(--ds-layout-frame-sm))' }}>
        <Card><Text tone="secondary">No devices in the garage yet.</Text></Card>
      </div>
    </Stack>
  );
}
