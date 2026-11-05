// @example A choice of one in a unit, under the display, before the one orange key
import { Button, Radio, RadioGroup, Stack } from 'dial-react';

export default function RadioInUnit() {
  return (
    <div className="demo-box demo-card">
      <Stack gap="md">
        <p className="flush">Washer · Cotton 40° · 1 h 52 min</p>
        <RadioGroup label="Spin speed" defaultValue="1200">
          <Radio value="800" label="800 rpm" />
          <Radio value="1200" label="1200 rpm" />
          <Radio value="1400" label="1400 rpm" />
        </RadioGroup>
        <Button kind="primary">Start wash</Button>
      </Stack>
    </div>
  );
}
