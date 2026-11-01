// @example icon prints a small stroke symbol before the word; the word still names the chip
import { Chip, Stack } from 'dial-react';

const Moon = () => (
  <svg viewBox="0 0 16 16"><path d="M12.5 10.5A5.5 5.5 0 0 1 5.5 3.5a5.5 5.5 0 1 0 7 7z" /></svg>
);
const Leaf = () => (
  <svg viewBox="0 0 16 16"><path d="M3 13c0-6 4-10 10-10 0 6-4 10-10 10zM3 13l5-5" /></svg>
);

export default function ChipWithIcon() {
  return (
    <Stack direction="row" gap="sm">
      <Chip icon={<Leaf />} defaultSelected>Eco</Chip>
      <Chip icon={<Moon />}>Night</Chip>
    </Stack>
  );
}
