// @example Plates in a unit under the display, before the one orange key
import { Button, RadioCard, RadioCards, Stack } from 'dial-react';

export default function RadioCardsInUnit() {
  return (
    <div className="demo-box demo-card">
      <Stack gap="md">
        <p className="flush">Washer · Cotton 40° · 1 h 52 min</p>
        <RadioCards label="Spin speed" defaultValue="1200">
          <RadioCard value="800" title="800 rpm" description="Gentle, for wool and silk." />
          <RadioCard value="1200" title="1200 rpm" description="For everyday cotton." />
          <RadioCard value="1400" title="1400 rpm" description="Driest, and the loudest." />
        </RadioCards>
        <Button kind="primary">Start wash</Button>
      </Stack>
    </div>
  );
}
