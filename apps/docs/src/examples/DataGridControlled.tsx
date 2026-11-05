// @example Sort and selection both controlled, with your own ordering and a Thai row that wraps
import { useState } from 'react';
import { DataGrid, type DataGridColumn, type DataGridSort } from 'dial-react';

type Job = { id: string; name: string; minutes: number };

const rows: Job[] = [
  { id: '1', name: 'Wash', minutes: 45 },
  { id: '2', name: 'Dry', minutes: 60 },
  { id: '3', name: 'ตั้งเวลาล้างจานตอนกลางคืนหลังอาหารเย็น', minutes: 30 },
];

const columns: DataGridColumn<Job>[] = [
  { key: 'name', header: 'Job', accessor: (r) => r.name, sortable: true },
  { key: 'minutes', header: 'Minutes', accessor: (r) => r.minutes, numeric: true, sortable: true },
];

export default function DataGridControlled() {
  const [sort, setSort] = useState<DataGridSort | null>({ key: 'minutes', direction: 'descending' });
  const [picked, setPicked] = useState<string[]>([]);
  const shown = [...rows].sort((a, b) => {
    if (!sort) return 0;
    const d = sort.direction === 'ascending' ? 1 : -1;
    return sort.key === 'minutes' ? (a.minutes - b.minutes) * d : a.name.localeCompare(b.name) * d;
  });
  return (
    <DataGrid
      caption="Machine jobs"
      columns={columns}
      rows={shown}
      manualSort
      sort={sort}
      onSortChange={setSort}
      selectionMode="multiple"
      selected={picked}
      onSelectedChange={setPicked}
    />
  );
}
