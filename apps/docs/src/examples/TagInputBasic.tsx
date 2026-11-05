// @example A well that turns typed words into removable chips on Enter or comma
import { TagInput } from 'dial-react';

export default function TagInputBasic() {
  return <TagInput label="Rooms" hint="Press Enter or a comma to add. Backspace removes the last." defaultValue={['Kitchen', 'Hall']} placeholder="Add a room" />;
}
