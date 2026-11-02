// @example A scene that cannot run now lies flat and cannot be picked up, and says why next to it
import { Badge, SceneCard, Stack } from 'dial-react';

export default function SceneCardDisabled() {
  return (
    <Stack direction="row" gap="md" align="end">
      <SceneCard value="movie" name="Movie night" steps={['Lamps 20%', 'TV on']} />
      <Stack gap="sm">
        <SceneCard value="garden" name="Garden party" steps={['Path lights on', 'Sprinklers off']} disabled />
        <Badge tone="warning">Garden hub offline</Badge>
      </Stack>
    </Stack>
  );
}
