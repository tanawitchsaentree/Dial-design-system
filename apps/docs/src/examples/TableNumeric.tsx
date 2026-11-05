// @example A column of energy readings aligned to the end edge in tabular figures so the digits line up
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from 'dial-react';

export default function TableNumeric() {
  return (
    <Table caption="Energy this week">
      <TableHead>
        <TableRow>
          <TableHeaderCell>Device</TableHeaderCell>
          <TableHeaderCell numeric>kWh</TableHeaderCell>
          <TableHeaderCell numeric>Cost</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow><TableCell>Oven</TableCell><TableCell numeric>12.4</TableCell><TableCell numeric>3.72</TableCell></TableRow>
        <TableRow><TableCell>Heater</TableCell><TableCell numeric>8.05</TableCell><TableCell numeric>2.42</TableCell></TableRow>
        <TableRow><TableCell>Washer</TableCell><TableCell numeric>103.2</TableCell><TableCell numeric>30.96</TableCell></TableRow>
      </TableBody>
    </Table>
  );
}
