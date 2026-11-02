// @example Glyphs printed as round dots on the Grille's grid, in the ink of the text around them
import { Icon, Stack } from 'dial-react';

export default function IconBasic() {
  return (
    <Stack direction="row" gap="lg" align="center">
      <Icon name="play" />
      <Icon name="lamp" />
      <Icon name="heat" />
      <Icon name="wifi" />
      <Icon name="lock" />
    </Stack>
  );
}
