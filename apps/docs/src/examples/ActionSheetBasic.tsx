// @example Kitchen lamp's actions from its round key: a lid on a phone, a panel by the key on a wide screen
import { useState } from 'react';
import { ActionSheet, IconButton } from 'dial-react';

const g = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;
const ACTIONS = [
  { value: 'rename', label: 'Rename', icon: <svg {...g}><path d="M4 20h4L19 9l-4-4L4 16v4z" /></svg> },
  { value: 'move', label: 'Move to room', icon: <svg {...g}><path d="M5 12h14M13 6l6 6-6 6" /></svg> },
  { value: 'remove', label: 'Remove', destructive: true },
];

export default function ActionSheetBasic() {
  const [last, setLast] = useState('nothing yet');
  return (
    <div className="demo-box demo-card" style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
      <p className="flush">Kitchen lamp · last action: {last}</p>
      <ActionSheet
        title="Kitchen lamp"
        detail="lamp 02 · Kitchen"
        items={ACTIONS}
        onAction={setLast}
        trigger={
          <IconButton label="Actions for Kitchen lamp">
            <svg viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="19" cy="12" r="2" /></svg>
          </IconButton>
        }
      />
    </div>
  );
}
