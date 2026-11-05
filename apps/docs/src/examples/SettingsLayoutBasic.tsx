// @example A settings page with two sections: a switch and a select on the end side of their names
import { Select, SettingsLayout, SettingsRow, SettingsSection, Switch, VisuallyHidden } from 'dial-react';

const VISIBILITY = [
  { value: 'private', label: 'Private' },
  { value: 'public', label: 'Public' },
];

export default function SettingsLayoutBasic() {
  return (
    <SettingsLayout title="Repository" titleLevel={2}>
      <SettingsSection heading="General">
        <SettingsRow label="Visibility" description="Who can see this repository.">
          <Select label={<VisuallyHidden>Visibility</VisuallyHidden>} options={VISIBILITY} defaultValue="private" />
        </SettingsRow>
        <SettingsRow label="Template" description="Others can start a new repository from this one.">
          {({ labelId, descriptionId }) => <Switch aria-labelledby={labelId} aria-describedby={descriptionId} />}
        </SettingsRow>
      </SettingsSection>
      <SettingsSection heading="Features">
        <SettingsRow label="Issues" description="Track work next to the code.">
          {({ labelId }) => <Switch aria-labelledby={labelId} defaultChecked />}
        </SettingsRow>
        <SettingsRow label="Wiki" description="Keep notes with the code.">
          {({ labelId }) => <Switch aria-labelledby={labelId} />}
        </SettingsRow>
      </SettingsSection>
    </SettingsLayout>
  );
}
