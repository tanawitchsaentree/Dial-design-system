// @example A group of round keys with its name printed above; one is chosen and shows a dot of ink
import { Radio, RadioGroup } from 'dial-react';

export default function RadioBasic() {
  return (
    <RadioGroup label="Heating mode" defaultValue="comfort">
      <Radio value="comfort" label="Comfort" />
      <Radio value="eco" label="Eco" />
      <Radio value="away" label="Away" />
    </RadioGroup>
  );
}
