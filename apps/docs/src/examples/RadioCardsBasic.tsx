// @example Three key plates with a name and a line each; the chosen one sits down with a bar of ink
import { RadioCard, RadioCards } from 'dial-react';

export default function RadioCardsBasic() {
  return (
    <RadioCards label="Heating mode" defaultValue="comfort">
      <RadioCard value="eco" title="Eco" description="Lowers the heat when nobody is home." />
      <RadioCard value="comfort" title="Comfort" description="Holds 21 degrees all day." />
      <RadioCard value="away" title="Away" description="Frost guard only." />
    </RadioCards>
  );
}
