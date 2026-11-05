// @example The three grounds side by side, with ink that holds contrast on each
import { Box, Stack } from 'dial-react';

export default function BoxSurface() {
  return (
    <Stack direction="row" gap="md" align="stretch">
      {(['page', 'raised', 'sunken'] as const).map((s) => (
        <Box key={s} padding="md" surface={s} corner="inner"><p className="flush">{s}</p></Box>
      ))}
    </Stack>
  );
}
