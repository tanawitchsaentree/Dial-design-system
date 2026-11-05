// @example A hidden heading names a region that has no printed title, and aria-labelledby points at it
import { Stack, Switch, VisuallyHidden } from 'dial-react';

export default function VisuallyHiddenLabel() {
  return (
    <section aria-labelledby="night-heading">
      <VisuallyHidden>
        <h3 id="night-heading">Night settings</h3>
      </VisuallyHidden>
      <Stack gap="md">
        <Switch label="Lower the heater after 23:00" />
        <Switch label="Dim the hall lamp" />
      </Stack>
    </section>
  );
}
