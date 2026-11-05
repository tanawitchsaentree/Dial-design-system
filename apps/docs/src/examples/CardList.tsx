// @example A list of small cards that keeps its count for screen readers
import { Card, Stack, Text } from 'dial-react';

export default function CardList() {
  return (
    <Stack role="list" aria-label="Rooms" gap="md" style={{ inlineSize: 'min(100%, var(--ds-layout-frame-md))' }}>
      <Card role="listitem" padding="sm"><Text>Living room · 21 °C</Text></Card>
      <Card role="listitem" padding="sm"><Text>Kitchen · 20 °C</Text></Card>
      <Card role="listitem" padding="sm"><Text>Hallway · 18 °C</Text></Card>
    </Stack>
  );
}
