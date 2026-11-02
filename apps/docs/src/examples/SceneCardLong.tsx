// @example A long name wraps on the card and stays whole in the slot; the steps under it are cut at the card's foot
import { Card, SceneCard, Slot, Stack } from 'dial-react';

export default function SceneCardLong() {
  return (
    <Stack direction="row" gap="lg" align="end" data-overflow-demo="">
      <SceneCard value="guests" name="Guests staying the weekend" steps={['Guest room heating 21°', 'Hall lamp on at dusk', 'Bathroom fan on a timer']} />
      <Card padding="unit" wordmark="dial" model="scene 1">
        <Slot label="Guest room" defaultScene={{ value: 'guests', name: 'Guests staying the weekend', steps: ['Guest room heating 21°'] }} />
      </Card>
    </Stack>
  );
}
