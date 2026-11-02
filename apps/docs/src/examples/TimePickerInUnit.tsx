// @example A night schedule unit. The display says the state, the time is a setting below it, and Save is the one orange key
import { Button, Display, Stack, Switch, TimePicker } from 'dial-react';

export default function TimePickerInUnit() {
  return (
    <div className="demo-box demo-card">
      <Stack gap="md">
        <Display label="Night mode" value="22:30" detail="Starts at" digits={4} />
        <TimePicker label="Night mode starts" defaultValue="22:30" />
        <Switch label="Dim the hall lights" defaultChecked />
        <Stack direction="row" gap="sm">
          <Button kind="primary">Save</Button>
          <Button>Cancel</Button>
        </Stack>
      </Stack>
    </div>
  );
}
