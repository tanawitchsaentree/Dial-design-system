// @example fill is inline (along the reading direction) or up (rows from the bottom)
import { Grille, Stack } from 'dial-react';

export default function GrilleFill() {
  return (
    <Stack direction="row" gap="lg" align="end">
      <Grille label="Battery" value={7} cols={10} rows={3} fill="inline" />
      <Grille label="Water tank" value={7} cols={6} rows={8} fill="up" />
    </Stack>
  );
}
