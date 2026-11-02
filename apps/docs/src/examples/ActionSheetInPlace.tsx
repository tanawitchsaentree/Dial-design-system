// @example modal false shows the docked lid in place, for a preview of its rows and its Cancel key
import { ActionSheet } from 'dial-react';

const g = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;
const ACTIONS = [
  { value: 'rename', label: 'Rename', icon: <svg {...g}><path d="M4 20h4L19 9l-4-4L4 16v4z" /></svg> },
  { value: 'move', label: 'Move to room', icon: <svg {...g}><path d="M5 12h14M13 6l6 6-6 6" /></svg> },
  { value: 'remove', label: 'Remove', destructive: true },
];

export default function ActionSheetInPlace() {
  return (
    <div style={{ inlineSize: 'min(100%, 375px)' }}>
      <ActionSheet modal={false} open title="Kitchen lamp" detail="lamp 02 · Kitchen" items={ACTIONS} />
    </div>
  );
}
