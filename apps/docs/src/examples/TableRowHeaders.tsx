// @example Each row named by a row header, so a screen reader reads the room before every reading
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from 'dial-react';

export default function TableRowHeaders() {
  return (
    <Table caption="Set points">
      <TableHead>
        <TableRow>
          <TableHeaderCell>Room</TableHeaderCell>
          <TableHeaderCell numeric>Day °C</TableHeaderCell>
          <TableHeaderCell numeric>Night °C</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow><TableHeaderCell scope="row">Bedroom</TableHeaderCell><TableCell numeric>19</TableCell><TableCell numeric>17.5</TableCell></TableRow>
        <TableRow><TableHeaderCell scope="row">Living room</TableHeaderCell><TableCell numeric>21</TableCell><TableCell numeric>18</TableCell></TableRow>
        <TableRow><TableHeaderCell scope="row">ห้องครัว</TableHeaderCell><TableCell numeric>20</TableCell><TableCell numeric>16</TableCell></TableRow>
      </TableBody>
    </Table>
  );
}
