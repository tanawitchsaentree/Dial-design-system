// @example A word key with a printed chevron, for a menu that needs its name on the screen
import { Menu } from 'dial-react';

const SORT = [
  { value: 'room', label: 'By room' },
  { value: 'name', label: 'By name' },
  { value: 'recent', label: 'Recently used first' },
];

export default function MenuWord() {
  return <Menu trigger="word" label="Sort" items={SORT} />;
}
