// @example A raised box with a token inset and a panel corner holding a heading and a line of text
import { Box } from 'dial-react';

export default function BoxBasic() {
  return (
    <Box padding="lg" surface="raised" corner="panel">
      <h3 className="flush">Living room</h3>
      <p className="flush muted">Two lamps on, heating at 21 degrees.</p>
    </Box>
  );
}
