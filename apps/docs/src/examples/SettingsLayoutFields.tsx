// @example A text field in a row, named by the row and tied to its small print
import { Input, SettingsLayout, SettingsRow, SettingsSection, VisuallyHidden } from 'dial-react';

export default function SettingsLayoutFields() {
  return (
    <SettingsLayout title="Room" titleLevel={2}>
      <SettingsSection heading="Name">
        <SettingsRow label="Room name" description="Shown on the home screen.">
          {({ labelId, descriptionId }) => (
            <div style={{ inlineSize: 'var(--ds-layout-frame-xs)', maxInlineSize: '100%' }}>
              <Input label={<VisuallyHidden>Room name</VisuallyHidden>} defaultValue="Living room" aria-labelledby={labelId} aria-describedby={descriptionId} />
            </div>
          )}
        </SettingsRow>
      </SettingsSection>
    </SettingsLayout>
  );
}
