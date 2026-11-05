// @example The middle levels folded into one key; pressing it prints the whole path back in the row
import { Breadcrumb, Crumb } from 'dial-react';

export default function BreadcrumbFolded() {
  return (
    <Breadcrumb fold="always">
      <Crumb href="#home">Home</Crumb>
      <Crumb href="#living-room">Living room</Crumb>
      <Crumb href="#lamps">Lamps</Crumb>
      <Crumb>Kitchen lamp</Crumb>
    </Breadcrumb>
  );
}
