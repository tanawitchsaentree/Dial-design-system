// @example Actions with a printed glyph before each word; the words line up in one column
import { Menu } from 'dial-react';

const g = { viewBox: '0 0 16 16', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;
const ACTIONS = [
  { value: 'rename', label: 'Rename', icon: <svg {...g}><path d="M3 13l1-3 7-7 2 2-7 7z" /></svg> },
  { value: 'move', label: 'Move to room', icon: <svg {...g}><path d="M2 7l6-5 6 5v7H2z" /></svg> },
  { value: 'schedule', label: 'Add a schedule', icon: <svg {...g}><circle cx="8" cy="8" r="6" /><path d="M8 5v3l2 1" /></svg> },
  { value: 'remove', label: 'Remove from home', destructive: true },
];

export default function MenuIcons() {
  return <Menu label="More for Bedroom heater" items={ACTIONS} />;
}
