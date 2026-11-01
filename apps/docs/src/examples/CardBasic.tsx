// @example A card with a title, a line of state and two keys, printed with its wordmark and model
import { Button, Card, Heading, Text } from 'dial-react';

export default function CardBasic() {
  return (
    <div style={{ inlineSize: 320 }}>
      <Card
        header={<Heading level={3}>Washer</Heading>}
        footer={<><Button kind="primary">Start wash</Button><Button>Schedule</Button></>}
        wordmark="dial"
        model="wash 1"
      >
        <Text tone="secondary">Cotton 40 °C, ready at 18:20. Door locked.</Text>
      </Card>
    </div>
  );
}
