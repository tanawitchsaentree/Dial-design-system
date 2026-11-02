// @example No results for a filter, so say what was looked for and offer to clear it
import { Button, EmptyState } from 'dial-react';

export default function EmptyStateSearch() {
  return (
    <EmptyState title="No lamps in Garage" action={<Button>Show all rooms</Button>}>
      The filter shows lamps in one room. Clear it to see every lamp.
    </EmptyState>
  );
}
