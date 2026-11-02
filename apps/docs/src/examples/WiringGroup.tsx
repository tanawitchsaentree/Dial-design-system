// @example A printed box groups the three tone knobs of a speaker, and one line joins the group to the level
import { Card, Grille, Rotary, Wiring } from 'dial-react';

export default function WiringGroup() {
  return (
    <Wiring label="Speaker relations" links={[{ from: 'bass', to: 'level', label: 'boosts', text: 'Bass boosts the low holes of the level meter', active: true }]}>
      <Wiring.Group label="tone">
        <Wiring.Node id="bass"><Rotary kind="key" label="Bass" min={-6} max={6} defaultValue={2} formatValue={(v) => `${v} dB`} /></Wiring.Node>
        <Wiring.Node id="mid"><Rotary kind="key" label="Middle" min={-6} max={6} defaultValue={0} formatValue={(v) => `${v} dB`} /></Wiring.Node>
        <Wiring.Node id="treble"><Rotary kind="key" label="Treble" min={-6} max={6} defaultValue={-1} formatValue={(v) => `${v} dB`} /></Wiring.Node>
      </Wiring.Group>
      <Wiring.Node id="level">
        <Card padding="unit" wordmark="dial" model="speaker 1"><Grille label="Level" value={5} cols={10} rows={3} /></Card>
      </Wiring.Node>
    </Wiring>
  );
}
