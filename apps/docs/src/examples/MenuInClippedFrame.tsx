// @example Inside a frame that clips its content, near the end of the row, the panel still shows whole
import { Menu } from 'dial-react';

const ACTIONS = [
  { value: 'rename', label: 'Rename' },
  { value: 'move', label: 'Move to another room' },
  { value: 'share', label: 'Share with the household' },
  { value: 'remove', label: 'Remove', destructive: true },
];

export default function MenuInClippedFrame() {
  return (
    <div className="demo-box demo-card" style={{ overflow: 'hidden', blockSize: 96, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <p className="flush">Hall speaker</p>
      <Menu label="More for Hall speaker" items={ACTIONS} />
    </div>
  );
}
