// @example A disabled row fades its name and small print while its switch is switched off
import { SettingsLayout, SettingsRow, SettingsSection, Switch } from 'dial-react';

export default function SettingsLayoutDisabled() {
  return (
    <SettingsLayout title="Heating" titleLevel={2}>
      <SettingsSection heading="Schedule">
        <SettingsRow label="Night mode" description="Starts at 23:00.">
          {({ labelId }) => <Switch aria-labelledby={labelId} defaultChecked />}
        </SettingsRow>
        <SettingsRow label="Away mode" description="Needs a second user at home." disabled>
          {({ labelId }) => <Switch aria-labelledby={labelId} disabled />}
        </SettingsRow>
      </SettingsSection>
    </SettingsLayout>
  );
}
