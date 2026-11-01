// @example digits keeps the window one width: short readings get unlit cells on the left
import { Display, Stack } from 'dial-react';

export default function DisplayDigits() {
  return (
    <Stack gap="md">
      <Display label="Washer" value="8" unit="min" detail="Spin" digits={3} />
      <Display label="Washer" value="38" unit="min" detail="Rinse" digits={3} />
      <Display label="Washer" value="End" detail="Done" digits={3} />
    </Stack>
  );
}
