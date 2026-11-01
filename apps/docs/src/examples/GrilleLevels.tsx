// @example Empty, partly lit and full: the number of lit holes is the reading
import { Grille, Stack } from 'dial-react';

export default function GrilleLevels() {
  return (
    <Stack gap="md">
      <Grille label="Signal" value={0} max={5} cols={10} rows={2} valueText="No signal" />
      <Grille label="Signal" value={3} max={5} cols={10} rows={2} valueText="Signal 3 of 5" />
      <Grille label="Signal" value={5} max={5} cols={10} rows={2} valueText="Full signal" />
    </Stack>
  );
}
