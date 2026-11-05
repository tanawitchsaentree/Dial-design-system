// @example Rows with a small dot-matrix icon before the words, so rooms and devices are told apart at a glance
import { Icon, Listbox } from 'dial-react';

const DEVICES = [
  { value: 'lamp', label: 'Floor lamp', leading: <Icon name="lamp" size="sm" /> },
  { value: 'heat', label: 'Radiator', leading: <Icon name="heat" size="sm" /> },
  { value: 'fan', label: 'Extractor fan', leading: <Icon name="fan" size="sm" /> },
  { value: 'speaker', label: 'Speaker', leading: <Icon name="speaker" size="sm" /> },
];

export default function ListboxLeading() {
  return <Listbox multiple label="Switch off at midnight" options={DEVICES} defaultValue={['lamp', 'speaker']} />;
}
