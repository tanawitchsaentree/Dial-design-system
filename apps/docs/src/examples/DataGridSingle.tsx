// @example One row at a time: marking a row clears the one marked before
import { DataGrid, type DataGridColumn } from 'dial-react';

type Scene = { id: string; scene: string; lamps: number };

const rows: Scene[] = [
  { id: 'morning', scene: 'Morning', lamps: 3 },
  { id: 'evening', scene: 'Evening', lamps: 5 },
  { id: 'night', scene: 'Night', lamps: 1 },
];

const columns: DataGridColumn<Scene>[] = [
  { key: 'scene', header: 'Scene', accessor: (r) => r.scene },
  { key: 'lamps', header: 'Lamps on', accessor: (r) => r.lamps, numeric: true },
];

export default function DataGridSingle() {
  return <DataGrid caption="Light scenes" columns={columns} rows={rows} selectionMode="single" defaultSelected={['evening']} />;
}
