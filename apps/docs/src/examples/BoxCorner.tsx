// @example The four corners from mark to panel on the same raised block
import { Box, Stack } from 'dial-react';

export default function BoxCorner() {
  return (
    <Stack direction="row" gap="md" align="start">
      {(['mark', 'media', 'inner', 'panel'] as const).map((c) => (
        <Box key={c} padding="lg" surface="sunken" corner={c}><p className="flush">{c}</p></Box>
      ))}
    </Stack>
  );
}
