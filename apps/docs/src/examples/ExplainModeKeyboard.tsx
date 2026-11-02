// @example The question mark key opens the mode while focus is in the unit, and the same key or Escape closes it
import { Card, Display, Explain, ExplainMode, Rotary, Stack } from 'dial-react';

export default function ExplainModeKeyboard() {
  return (
    <ExplainMode toggleLabel="How this works (?)">
      <Card padding="unit" wordmark="dial" model="speaker 1">
        <Explain name="Window" does="Shows the track that is playing.">
          <Display kind="oled" label="Speaker" value="So What" detail="Playing · Kind of Blue" />
        </Explain>
        <Stack direction="row" gap="xl">
          <Explain name="Volume" does="Sets how loud the speaker plays. Arrows step it.">
            <Rotary kind="key" label="Volume" min={0} max={10} defaultValue={5} />
          </Explain>
        </Stack>
      </Card>
    </ExplainMode>
  );
}
