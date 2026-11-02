// @example A name alone, or a name with what the scene does. Up to three short steps read best
import { SceneCard, Stack } from 'dial-react';

export default function SceneCardShort() {
  return (
    <Stack direction="row" gap="md">
      <SceneCard value="off" name="All off" />
      <SceneCard value="dinner" name="Dinner" steps={['Dining lamp 60%']} />
      <SceneCard value="cinema" name="Cinema" steps={['Lamps 10%', 'Blinds down', 'Projector on']} />
    </Stack>
  );
}
