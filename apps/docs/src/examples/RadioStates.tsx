// @example Chosen, waiting, one option disabled, and a whole group disabled
import { Radio, RadioGroup, Stack } from 'dial-react';

export default function RadioStates() {
  return (
    <Stack gap="lg">
      <RadioGroup label="One option disabled" defaultValue="cotton">
        <Radio value="cotton" label="Cotton" />
        <Radio value="wool" label="Wool" />
        <Radio value="silk" label="Silk" disabled />
      </RadioGroup>
      <RadioGroup label="Whole group disabled" defaultValue="a" disabled>
        <Radio value="a" label="Cold" />
        <Radio value="b" label="Warm" />
      </RadioGroup>
    </Stack>
  );
}
