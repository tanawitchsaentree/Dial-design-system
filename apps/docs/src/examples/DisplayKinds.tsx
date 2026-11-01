// @example The two families, LCD segments on grey-green and OLED text on near-black
import { Display, Stack } from 'dial-react';

export default function DisplayKinds() {
  return (
    <Stack gap="md">
      <Display kind="lcd" label="Tuner" value="98.5" unit="MHz" detail="FM" digits={4} />
      <Display kind="oled" label="Player" value="2:41" unit="left" detail="Track 4 · Kind of Blue" />
    </Stack>
  );
}
