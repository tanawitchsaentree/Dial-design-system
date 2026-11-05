// @example Two sortable headers: press one to order the rows, and the chevron shows the direction
import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow, type TableSort } from 'dial-react';

const rows = [
  { room: 'Kitchen', kwh: 12.4 },
  { room: 'Living room', kwh: 8.05 },
  { room: 'Laundry', kwh: 103.2 },
];

export default function TableSortable() {
  const [key, setKey] = useState<'room' | 'kwh'>('room');
  const [dir, setDir] = useState<'ascending' | 'descending'>('ascending');
  const press = (k: 'room' | 'kwh') => {
    if (k === key) setDir(dir === 'ascending' ? 'descending' : 'ascending');
    else { setKey(k); setDir('ascending'); }
  };
  const sorted = [...rows].sort((a, b) => (key === 'room' ? a.room.localeCompare(b.room) : a.kwh - b.kwh) * (dir === 'ascending' ? 1 : -1));
  const sortOf = (k: 'room' | 'kwh'): TableSort => (k === key ? dir : 'none');
  return (
    <Table caption="Energy by room">
      <TableHead>
        <TableRow>
          <TableHeaderCell sort={sortOf('room')} onSort={() => press('room')}>Room</TableHeaderCell>
          <TableHeaderCell numeric sort={sortOf('kwh')} onSort={() => press('kwh')}>kWh</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {sorted.map((r) => (
          <TableRow key={r.room}><TableCell>{r.room}</TableCell><TableCell numeric>{r.kwh}</TableCell></TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
