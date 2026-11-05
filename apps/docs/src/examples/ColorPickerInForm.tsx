// @example name adds a hidden input, so a form submits the chosen colour next to the other fields
import { Button, ColorPicker, Input, Stack } from 'dial-react';

const lamp = [
  { value: 'ffd9a0', name: 'Warm white' },
  { value: 'ffb347', name: 'Amber' },
  { value: 'f4f7ff', name: 'Daylight' },
  { value: '8fd694', name: 'Green' },
];

export default function ColorPickerInForm() {
  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <Stack gap="lg">
        <Input label="Lamp name" defaultValue="Reading lamp" />
        <ColorPicker label="Colour when it turns on" swatches={lamp} name="colour" defaultValue="ffd9a0" />
        <Button type="submit" kind="primary">Save lamp</Button>
      </Stack>
    </form>
  );
}
