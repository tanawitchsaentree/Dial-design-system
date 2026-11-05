// @example A limit of three tags; the fourth is refused with a printed line
import { TagInput } from 'dial-react';

export default function TagInputMax() {
  return <TagInput label="Rooms on the night schedule" max={3} defaultValue={['Bedroom', 'Landing', 'Hall']} hint="Three rooms at most." placeholder="Add a room" />;
}
