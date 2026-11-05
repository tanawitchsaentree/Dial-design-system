// @example Twenty-four rows in a window of five: the header stays in view while the body scrolls under it
import { DataGrid, type DataGridColumn } from 'dial-react';

type Reading = { id: string; hour: string; temp: number };

const rows: Reading[] = Array.from({ length: 24 }, (_, i) => ({
  id: `h${i}`,
  hour: `${String(i).padStart(2, '0')}:00`,
  temp: 17 + ((i * 7) % 6),
}));

const columns: DataGridColumn<Reading>[] = [
  { key: 'hour', header: 'Hour', accessor: (r) => r.hour, sortable: true },
  { key: 'temp', header: 'Room °C', accessor: (r) => r.temp, numeric: true, sortable: true },
];

export default function DataGridScroll() {
  return <DataGrid caption="Hall temperature, today" columns={columns} rows={rows} visibleRows={5} />;
}
