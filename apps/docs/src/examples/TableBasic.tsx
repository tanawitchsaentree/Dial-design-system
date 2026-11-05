// @example Rooms and their devices as flat printed rows with a caption and a seam between rows
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from 'dial-react';

export default function TableBasic() {
  return (
    <Table caption="Rooms and devices">
      <TableHead>
        <TableRow>
          <TableHeaderCell>Room</TableHeaderCell>
          <TableHeaderCell>Device</TableHeaderCell>
          <TableHeaderCell>State</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow><TableCell>Kitchen</TableCell><TableCell>Oven</TableCell><TableCell>Off</TableCell></TableRow>
        <TableRow><TableCell>Living room</TableCell><TableCell>Heater</TableCell><TableCell>On</TableCell></TableRow>
        <TableRow><TableCell>Laundry</TableCell><TableCell>Washer</TableCell><TableCell>Done</TableCell></TableRow>
      </TableBody>
    </Table>
  );
}
