// @example A shortcuts list: the action on the start side and its keys on the end side
import { Kbd, KbdCombo, Stack } from 'dial-react';

const row = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--ds-gap-xl)' } as const;

export default function KbdShortcuts() {
  return (
    <Stack gap="md">
      <div style={row}>
        <span>Search the home</span>
        <KbdCombo keys={['Ctrl', 'K']} />
      </div>
      <div style={row}>
        <span>Next track</span>
        <KbdCombo keys={['Shift', 'N']} />
      </div>
      <div style={row}>
        <span>Mute the speaker</span>
        <Kbd>M</Kbd>
      </div>
    </Stack>
  );
}
