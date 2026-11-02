// @example Controlled. The scene in the slot is kept by the screen and printed under it
import { useState } from 'react';
import { Card, SceneCard, Slot, Stack, Text, type SceneInfo } from 'dial-react';

export default function SlotControlled() {
  const [scene, setScene] = useState<SceneInfo | null>(null);
  return (
    <Stack gap="lg">
      <Stack direction="row" gap="md">
        <SceneCard value="dinner" name="Dinner" steps={['Dining lamp 60%']} />
        <SceneCard value="tidy" name="Tidy up" steps={['All lamps 100%', 'Vacuum on']} />
      </Stack>
      <Card padding="unit" wordmark="dial" model="scene 1" style={{ inlineSize: 'max-content', maxInlineSize: '100%' }}>
        <Slot label="Dining room" scene={scene} onSceneChange={setScene} />
      </Card>
      <Text tone="secondary">Running: {scene ? scene.name : 'none'}</Text>
    </Stack>
  );
}
