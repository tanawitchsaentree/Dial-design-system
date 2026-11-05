// @example Inside a form: name puts the chosen day into the submitted data as yyyy-mm-dd
import { Button, DatePicker, Input, Stack } from 'dial-react';

export default function DatePickerInForm() {
  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <Stack gap="lg">
        <Input label="Room" defaultValue="Kitchen" />
        <DatePicker label="Service date" name="service" min="2026-11-04" today="2026-11-04" />
        <Button kind="primary" type="submit">Book</Button>
      </Stack>
    </form>
  );
}
