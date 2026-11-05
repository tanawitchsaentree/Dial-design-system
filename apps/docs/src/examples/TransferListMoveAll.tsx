// @example Two more keys that move every row at once, for lists where most rows go one way
import { TransferList } from 'dial-react';

const DEVICES = [
  { value: 'lamp', label: 'Floor lamp' },
  { value: 'heater', label: 'Heater' },
  { value: 'washer', label: 'Washer' },
  { value: 'speaker', label: 'Speaker' },
  { value: 'blind', label: 'Blind' },
  { value: 'plug', label: 'Smart plug' },
  { value: 'fan', label: 'Fan' },
];

export default function TransferListMoveAll() {
  return <TransferList moveAll label="Devices that follow the scene" options={DEVICES} defaultValue={['lamp']} availableLabel="Devices" chosenLabel="In the scene" />;
}
