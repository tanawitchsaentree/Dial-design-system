// @example Kitchen lamp's actions from its round key: a lid on a phone, a panel by the key on a wide screen
import { useState } from 'react';
import { ActionSheet, Icon, IconButton } from 'dial-react';

const ACTIONS = [
  { value: 'rename', label: 'Rename', icon: <Icon name="edit" /> },
  { value: 'move', label: 'Move to room', icon: <Icon name="room" /> },
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
            <Icon name="more" />
          </IconButton>
        }
      />
    </div>
  );
}
