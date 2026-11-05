// @example A controlled group that prints the chosen value under it
import { useState } from 'react';
import { RadioCard, RadioCards } from 'dial-react';

export default function RadioCardsControlled() {
  const [value, setValue] = useState('standard');
  return (
    <div>
      <RadioCards label="Wash programme" value={value} onValueChange={setValue}>
        <RadioCard value="quick" title="Quick" description="Cotton at 30°, 28 minutes." />
        <RadioCard value="standard" title="Standard" description="Cotton at 40°, 1 h 52 min." />
        <RadioCard value="intense" title="Intense" description="Cotton at 60°, 2 h 40 min." />
      </RadioCards>
      <p className="flush">Chosen: {value}</p>
    </div>
  );
}
