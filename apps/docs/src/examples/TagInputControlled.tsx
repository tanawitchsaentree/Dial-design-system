// @example Controlled tags with your own error, and a count read from the same list
import { useState } from 'react';
import { TagInput } from 'dial-react';

export default function TagInputControlled() {
  const [tags, setTags] = useState<string[]>([]);
  return (
    <div>
      <TagInput label="Rooms" value={tags} onValueChange={setTags} error={tags.length === 0 ? 'Add at least one room' : undefined} placeholder="Add a room" />
      <p>{tags.length} saved</p>
    </div>
  );
}
