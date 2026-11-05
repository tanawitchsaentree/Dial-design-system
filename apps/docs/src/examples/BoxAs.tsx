// @example Rendering as a list and its items so the page keeps its semantics
import { Box } from 'dial-react';

export default function BoxAs() {
  return (
    <Box as="ul" padding="md" surface="raised" corner="inner" aria-label="Rooms">
      <Box as="li" padding="sm">Living room</Box>
      <Box as="li" padding="sm">Kitchen</Box>
      <Box as="li" padding="sm">Bedroom</Box>
    </Box>
  );
}
