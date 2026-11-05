// @example A raised box inside a sunken box: each keeps its own padding and corner
import { Box } from 'dial-react';

export default function BoxNested() {
  return (
    <Box padding="lg" surface="sunken" corner="panel">
      <Box padding="md" surface="raised" corner="inner">Night schedule</Box>
    </Box>
  );
}
