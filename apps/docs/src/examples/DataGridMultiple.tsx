// @example Several rows can be marked with checkboxes; the header key marks them all
import { useState } from 'react';
import { DataGrid, type DataGridColumn } from 'dial-react';

type Device = { id: string; name: string; room: string; watts: number };

const rows: Device[] = [
  { id: 'a', name: 'Oven', room: 'Kitchen', watts: 2400 },
  { id: 'b', name: 'Heater', room: 'Living room', watts: 1500 },
  { id: 'c', name: 'Washer', room: 'Laundry', watts: 500 },
  { id: 'd', name: 'Lamp', room: 'Hall', watts: 9 },
];

const columns: DataGridColumn<Device>[] = [
  { key: 'name', header: 'Device', accessor: (r) => r.name, sortable: true },
  { key: 'room', header: 'Room', accessor: (r) => r.room },
  { key: 'watts', header: 'Watts', accessor: (r) => r.watts, numeric: true, sortable: true },
];

export default function DataGridMultiple() {
  const [picked, setPicked] = useState<string[]>(['b']);
  return (
    <DataGrid
      caption="Devices"
      columns={columns}
      rows={rows}
      selectionMode="multiple"
      selected={picked}
      onSelectedChange={setPicked}
      selectRowLabel={(r) => `Select ${r.name}`}
    />
  );
}
