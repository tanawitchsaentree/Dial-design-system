// @example drawing grille prints a field of unlit holes, here with a plastic key
import { Button, Card, EmptyState, Heading } from 'dial-react';

export default function EmptyStateGrille() {
  return (
    <Card header={<Heading level={3}>Schedules</Heading>} style={{ inlineSize: 'min(100%, 380px)' }}>
      <EmptyState drawing="grille" title="No schedules yet" action={<Button>New schedule</Button>}>
        A schedule turns devices on and off at set times.
      </EmptyState>
    </Card>
  );
}
