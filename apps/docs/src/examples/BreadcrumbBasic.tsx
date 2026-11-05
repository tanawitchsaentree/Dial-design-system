// @example A path of four levels: dotted leaders between the names and an ink index mark under the page you are on
import { Breadcrumb, Crumb } from 'dial-react';

export default function BreadcrumbBasic() {
  return (
    <Breadcrumb>
      <Crumb href="#home">Home</Crumb>
      <Crumb href="#living-room">Living room</Crumb>
      <Crumb href="#lamps">Lamps</Crumb>
      <Crumb>Kitchen lamp</Crumb>
    </Breadcrumb>
  );
}
