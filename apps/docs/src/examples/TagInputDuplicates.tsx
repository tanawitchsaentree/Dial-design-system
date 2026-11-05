// @example Duplicates are refused by default; allowDuplicates keeps repeats for a list where they mean something
import { Stack, TagInput } from 'dial-react';

export default function TagInputDuplicates() {
  return (
    <Stack gap="lg">
      <TagInput label="Rooms (no repeats)" defaultValue={['Kitchen']} placeholder="Try Kitchen again" />
      <TagInput label="Heating periods (repeats allowed)" allowDuplicates defaultValue={['06:30']} placeholder="Add a time" />
    </Stack>
  );
}
