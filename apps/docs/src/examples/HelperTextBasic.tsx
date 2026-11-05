// @example A hint printed under a field, linked to it with aria-describedby
import { HelperText, Input, Stack } from 'dial-react';

export default function HelperTextBasic() {
  return (
    <Stack gap="sm">
      <Input label="Target temperature" defaultValue="21" unit="°C" aria-describedby="ht-basic" />
      <HelperText id="ht-basic">Between 5 and 30 degrees.</HelperText>
    </Stack>
  );
}
