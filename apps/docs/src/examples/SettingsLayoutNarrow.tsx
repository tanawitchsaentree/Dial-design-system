// @example The same rows in a narrow unit: the select drops under its name and keeps its full size
import { Select, SettingsLayout, SettingsRow, SettingsSection, Switch, VisuallyHidden } from 'dial-react';

const PROGRAMMES = [
  { value: 'cotton', label: 'Cotton 40' },
  { value: 'eco', label: 'Eco 60' },
];

export default function SettingsLayoutNarrow() {
  return (
    <div style={{ inlineSize: 'var(--ds-layout-frame-xs)', maxInlineSize: '100%' }}>
      <SettingsLayout title="Washer" titleLevel={2}>
        <SettingsSection heading="Cycle">
          <SettingsRow label="Programme" description="Used when you press start.">
            <Select label={<VisuallyHidden>Programme</VisuallyHidden>} options={PROGRAMMES} defaultValue="cotton" />
          </SettingsRow>
          <SettingsRow label="Quiet hours">
            {({ labelId }) => <Switch aria-labelledby={labelId} defaultChecked />}
          </SettingsRow>
        </SettingsSection>
      </SettingsLayout>
    </div>
  );
}
