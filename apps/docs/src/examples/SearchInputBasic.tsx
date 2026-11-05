// @example A search well with a printed search mark; a Clear key appears with text, Enter searches and Escape clears
import { useState } from 'react';
import { SearchInput } from 'dial-react';

export default function SearchInputBasic() {
  const [last, setLast] = useState('');
  return (
    <div>
      <SearchInput label="Search rooms" hint="Enter searches. Escape clears." defaultValue="Kitchen" onSearch={setLast} />
      <p>{last ? `Searched for ${last}` : 'Nothing searched yet'}</p>
    </div>
  );
}
