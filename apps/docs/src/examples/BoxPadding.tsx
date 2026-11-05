// @example The five insets from xs to xl, each on a sunken ground so the edge shows
import { Box, Stack } from 'dial-react';

export default function BoxPadding() {
  return (
    <Stack direction="row" gap="md" align="start">
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((p) => (
        <Box key={p} padding={p} surface="sunken" corner="media"><span className="demo-chip">{p}</span></Box>
      ))}
    </Stack>
  );
}
