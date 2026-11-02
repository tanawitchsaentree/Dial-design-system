// @example Words only, with no key, for a list that fills by itself
import { Card, EmptyState, Heading } from 'dial-react';

export default function EmptyStateWordsOnly() {
  return (
    <Card header={<Heading level={3}>Alerts</Heading>} style={{ inlineSize: 'min(100%, 380px)' }}>
      <EmptyState title="Nothing needs you">Alerts from the hub show here when they happen.</EmptyState>
    </Card>
  );
}
