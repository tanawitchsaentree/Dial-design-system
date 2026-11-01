// @example A row that wraps
import { Stack } from 'dial-react';

export default function StackRow() {
  return (
    <Stack direction="row" gap="sm">
      {['Layout', 'Spacing', 'Tokens', 'Themes', 'Motion', 'Typography', 'Accessibility', 'Icons'].map((t) => <span key={t} className="demo-chip">{t}</span>)}
    </Stack>
  );
}
