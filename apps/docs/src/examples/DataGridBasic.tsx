// @example A grid of readings with two sortable headers; one Tab stop, then the arrow keys walk the cells
import { DataGrid, type DataGridColumn } from 'dial-react';

type Room = { id: string; room: string; device: string; kwh: number };

const rows: Room[] = [
  { id: 'k', room: 'Kitchen', device: 'Oven', kwh: 12.4 },
  { id: 'l', room: 'Living room', device: 'Heater', kwh: 8.05 },
  { id: 'w', room: 'Laundry', device: 'Washer', kwh: 103.2 },
  { id: 'h', room: 'Hall', device: 'Lamp', kwh: 1.9 },
];

const columns: DataGridColumn<Room>[] = [
  { key: 'room', header: 'Room', accessor: (r) => r.room, sortable: true },
  { key: 'device', header: 'Device', accessor: (r) => r.device },
  { key: 'kwh', header: 'kWh', accessor: (r) => r.kwh, numeric: true, sortable: true },
];

export default function DataGridBasic() {
  return <DataGrid caption="Energy by room" columns={columns} rows={rows} defaultSort={{ key: 'room', direction: 'ascending' }} />;
}
