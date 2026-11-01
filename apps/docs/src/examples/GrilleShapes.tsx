// @example shape is rect (the default) or circle, a round field like a speaker grille
import { Grille, Stack } from 'dial-react';

export default function GrilleShapes() {
  return (
    <Stack direction="row" gap="lg" align="center">
      <Grille label="Volume" value={4} cols={12} rows={4} />
      <Grille label="Fan speed" value={4} cols={11} rows={11} shape="circle" fill="up" />
    </Stack>
  );
}
