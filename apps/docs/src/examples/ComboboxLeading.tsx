// @example Rows with an avatar before the name, so the people on a household are told apart at a glance
import { Avatar, Combobox } from 'dial-react';

const PEOPLE = [
  { value: 'maya', label: 'Maya Chen', leading: <Avatar name="Maya Chen" size="sm" /> },
  { value: 'noah', label: 'Noah Okafor', leading: <Avatar name="Noah Okafor" size="sm" /> },
  { value: 'mina', label: 'Mina Park', leading: <Avatar name="Mina Park" size="sm" /> },
  { value: 'arun', label: 'Arun Patel', leading: <Avatar name="Arun Patel" size="sm" /> },
  { value: 'somchai', label: 'สมชาย ใจดี', leading: <Avatar name="สมชาย ใจดี" size="sm" /> },
];

export default function ComboboxLeading() {
  return <Combobox label="Share the schedule with" placeholder="Type a name" options={PEOPLE} defaultValue="mina" />;
}
