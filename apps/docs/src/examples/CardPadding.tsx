// @example padding sets the inset: sm, md (the default), lg, or unit, which follows the short side
import { Card, Stack, Text } from 'dial-react';

export default function CardPadding() {
  return (
    <Stack gap="lg" style={{ inlineSize: 320 }}>
      <Card padding="sm"><Text>sm · 16px inset</Text></Card>
      <Card padding="md"><Text>md · 24px inset</Text></Card>
      <Card padding="lg"><Text>lg · 32px inset</Text></Card>
      <Card padding="unit"><Text>unit · 0.077 of the short side</Text></Card>
    </Stack>
  );
}
