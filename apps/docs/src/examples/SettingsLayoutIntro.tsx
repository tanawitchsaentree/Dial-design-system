// @example A page title one level up, with a line of small print under the title and under each section heading
import { Button, SettingsLayout, SettingsRow, SettingsSection, Stack, Switch } from 'dial-react';

export default function SettingsLayoutIntro() {
  return (
    <Stack gap="xl">
      <SettingsLayout title="Lamps" description="Changes apply to every lamp in the room." titleLevel={1}>
        <SettingsSection heading="Light" description="How the lamps start.">
          <SettingsRow label="Dim at night" description="Drops to 20% after 23:00.">
            {({ labelId }) => <Switch aria-labelledby={labelId} defaultChecked />}
          </SettingsRow>
          <SettingsRow label="Warm tone">
            {({ labelId }) => <Switch aria-labelledby={labelId} />}
          </SettingsRow>
        </SettingsSection>
      </SettingsLayout>
      <Button kind="primary">Save</Button>
    </Stack>
  );
}
