// @example An async source: while the request runs the panel shows the grille Spinner and the word Searching
import { useEffect, useState } from 'react';
import { Autocomplete } from 'dial-react';

const DEVICES = ['Hallway lamp', 'Heater', 'Heat pump', 'Humidifier', 'Washer', 'Dryer', 'Dishwasher', 'Kettle'];
type Option = { value: string; label: string };

export default function AutocompleteAsync() {
  const [text, setText] = useState('He');
  const [found, setFound] = useState<Option[]>([]);
  const [busy, setBusy] = useState(false);

  // a stand-in for a request to the hub: it answers after a short wait
  useEffect(() => {
    setBusy(true);
    const t = window.setTimeout(() => {
      const q = text.trim().toLocaleLowerCase();
      setFound(q ? DEVICES.filter((d) => d.toLocaleLowerCase().includes(q)).map((d) => ({ value: d, label: d })) : []);
      setBusy(false);
    }, 600);
    return () => window.clearTimeout(t);
  }, [text]);

  return <Autocomplete label="Device" options={found} filter={false} loading={busy} value={text} onValueChange={setText} />;
}
