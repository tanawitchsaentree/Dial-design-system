// @example The field wrapped in a search landmark so screen reader users can jump to it, with an error
import { SearchInput } from 'dial-react';

export default function SearchInputLandmark() {
  return <SearchInput landmark label="Search the home" hint="Rooms, devices and schedules" defaultValue="x" error="Type at least two characters." />;
}
