// @example wordmark and model are printed on the bottom inset line, like printing on a case
import { Card, Heading, Text } from 'dial-react';

export default function CardPrinted() {
  return (
    <div style={{ inlineSize: 300 }}>
      <Card as="section" aria-labelledby="card-printed-title" wordmark="dial" model="Clock 2">
        <Heading level={3} id="card-printed-title">Bedroom clock</Heading>
        <Text tone="secondary">Alarm at 06:45, weekdays.</Text>
      </Card>
    </div>
  );
}
