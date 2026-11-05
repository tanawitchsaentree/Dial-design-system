// @example A controlled field that filters a list as you type and reads the count out through resultsCount
import { useState } from 'react';
import { SearchInput } from 'dial-react';

const ROOMS = ['Kitchen', 'Hall', 'Bedroom', 'Bathroom', 'Balcony', 'Garage'];

export default function SearchInputFilter() {
  const [query, setQuery] = useState('');
  const hits = ROOMS.filter((r) => r.toLowerCase().includes(query.trim().toLowerCase()));
  return (
    <div>
      <SearchInput label="Find a room" value={query} onChange={(e) => setQuery(e.target.value)} resultsCount={hits.length} />
      <ul>
        {hits.map((r) => <li key={r}>{r}</li>)}
      </ul>
    </div>
  );
}
