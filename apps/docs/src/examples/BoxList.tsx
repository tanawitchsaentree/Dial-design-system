// @example as="ul" renders a list with no browser bullets, the padding still from the token
import { Box } from 'dial-react';

export default function BoxList() {
  return (
    <Box as="ul" padding="md" surface="sunken" corner="media">
      <li>Living room</li>
      <li>Hallway</li>
    </Box>
  );
}
