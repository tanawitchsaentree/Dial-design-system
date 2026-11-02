// @example A glyph that stands alone and carries meaning gets a label, so it is read as an image with a name
import { Icon, Stack } from 'dial-react';

export default function IconLabelled() {
  return (
    <Stack direction="row" gap="lg" align="center">
      <span>Hall speaker</span>
      <Icon name="signal" size="sm" label="Strong signal" />
      <Icon name="battery" size="sm" label="Battery half full" />
    </Stack>
  );
}
