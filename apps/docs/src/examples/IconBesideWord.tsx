// @example Beside a word, the small glyph sits on the text line and the word says what it means
import { Icon, Stack } from 'dial-react';

export default function IconBesideWord() {
  return (
    <Stack gap="sm">
      <Stack direction="row" gap="sm" align="center"><Icon name="lock" size="sm" /><span>Front door locked</span></Stack>
      <Stack direction="row" gap="sm" align="center"><Icon name="clock" size="sm" /><span>Heating on at 06:30</span></Stack>
      <Stack direction="row" gap="sm" align="center"><Icon name="warning" size="sm" /><span>Filter due in 3 days</span></Stack>
    </Stack>
  );
}
