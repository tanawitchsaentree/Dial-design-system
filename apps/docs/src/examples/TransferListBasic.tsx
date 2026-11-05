// @example Rooms in two windows: mark rows with Space, then press a key to carry them across
import { TransferList } from 'dial-react';

const ROOMS = [
  { value: 'kitchen', label: 'Kitchen' },
  { value: 'bedroom', label: 'Bedroom' },
  { value: 'hallway', label: 'Hallway' },
  { value: 'bathroom', label: 'Bathroom' },
  { value: 'study', label: 'Study' },
];

export default function TransferListBasic() {
  return <TransferList label="Rooms on the night schedule" options={ROOMS} defaultValue={['kitchen', 'bedroom']} />;
}
