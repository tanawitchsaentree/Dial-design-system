// @example Six columns in a narrow unit: the table scrolls sideways and the region takes a Tab stop
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from 'dial-react';

const cols = ['Room', 'Device', 'Mon', 'Tue', 'Wed', 'Thu'];

export default function TableNarrow() {
  return (
    <div style={{ inlineSize: 'var(--ds-control-menu-min)' }}>
      <Table caption="Hours on, by day">
        <TableHead>
          <TableRow>
            {cols.map((c, i) => <TableHeaderCell key={c} numeric={i > 1}>{c}</TableHeaderCell>)}
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow><TableCell>Kitchen</TableCell><TableCell>Oven</TableCell><TableCell numeric>1.5</TableCell><TableCell numeric>0.5</TableCell><TableCell numeric>2</TableCell><TableCell numeric>0</TableCell></TableRow>
          <TableRow><TableCell>Living room</TableCell><TableCell>Heater</TableCell><TableCell numeric>6</TableCell><TableCell numeric>7.5</TableCell><TableCell numeric>5</TableCell><TableCell numeric>8</TableCell></TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
