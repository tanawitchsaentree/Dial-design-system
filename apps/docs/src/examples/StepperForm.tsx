// @example Two sections of a settings form: fields stand under each title, the orange key comes last
import { Button, Input, Select, Stack, Step, Stepper, Switch, Textarea } from 'dial-react';

export default function StepperForm() {
  return (
    <Stack gap="xl">
      <Stepper>
        <Step title="General" status="current">
          <Stack gap="lg">
            <Input label="Room name" defaultValue="Living room" />
            <Textarea label="Description" rows={3} hint="Up to 350 characters." />
          </Stack>
        </Step>
        <Step title="Configuration">
          <Stack gap="lg">
            <Select label="Visibility" options={[{ value: 'home', label: 'Everyone at home' }, { value: 'me', label: 'Only me' }]} defaultValue="home" />
            <Switch label="Add to the night schedule" />
          </Stack>
        </Step>
      </Stepper>
      <Button kind="primary">Create room</Button>
    </Stack>
  );
}
