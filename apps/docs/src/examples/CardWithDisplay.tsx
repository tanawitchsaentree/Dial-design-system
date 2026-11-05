// @example A Display inside a card nests its corner, so its radius is the card's radius minus the inset
import { Button, Card, Display } from 'dial-react';

export default function CardWithDisplay() {
  return (
    <div style={{ inlineSize: 'min(100%, var(--ds-layout-frame-sm))' }}>
      <Card padding="unit" footer={<Button kind="primary">Pause</Button>} wordmark="dial" model="wash 1">
        <Display label="Washer" value="38" unit="min" detail="Rinse" digits={3} />
      </Card>
    </div>
  );
}
