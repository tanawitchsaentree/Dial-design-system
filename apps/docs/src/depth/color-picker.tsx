// Usage tab for ColorPicker (component-depth.md U1–U14). ColorPicker chooses the colour of a lamp from named swatches.
import { Button, ColorPicker, Stack } from 'dial-react';
import type { Depth } from './types';

const Unit = ({ children }: { children: React.ReactNode }) => <div className="demo-box demo-card">{children}</div>;
const lamp = [
  { value: 'ffd9a0', name: 'Warm white' },
  { value: 'ffb347', name: 'Amber' },
  { value: 'f4f7ff', name: 'Daylight' },
  { value: 'ff8fa3', name: 'Rose' },
  { value: '8fd694', name: 'Green' },
  { value: '6fa8ff', name: 'Blue' },
];

export const COLOR_PICKER: Depth = {
  overview: (
    <>
      <p>ColorPicker sets the colour of a lamp or a light strip. Each colour is a round key whose face is the colour it gives. The chosen key sits down, wears an ink ring and shows a tick, and a line under the keys prints its name.</p>
      <p>The colours are data you pass in. The picker never invents a palette. Add a hue fader or a hex well when a lamp can show colours that no key holds.</p>
    </>
  ),
  whenToUse: ['To choose a lamp or light colour from a short list of named colours.', 'To let a person fine-tune a colour with a fader or a hex value when the list is not enough.'],
  whenNot: [
    { situation: 'Choosing one option that is a word, not a colour', to: '/components/radio-cards', label: 'RadioCards' },
    { situation: 'A single number such as a brightness level', to: '/components/slider', label: 'Slider' },
  ],
  variants: { na: 'ColorPicker has one look, a row of round keys. The hue fader and the hex well are options, covered under Modifiers.' },
  anatomy: {
    render: <ColorPicker label="Lamp colour" swatches={lamp} defaultValue="ffb347" hue hex />,
    parts: [
      { part: 'Legend', selector: '[data-component="ColorPicker"] > span:first-child', what: 'The printed name above the keys, which is also the name of the group.' },
      { part: 'Lens key', selector: '[data-component="ColorPicker"] [role="radiogroup"] > label', what: 'A 44px round key whose face is the colour. The chosen one sits down with a ring and a tick.' },
      { part: 'Readout', selector: '[data-component="ColorPicker"] > p', what: 'One line that names the colour set, or prints its hex when it is custom.' },
      { part: 'Extras', selector: '[data-component="ColorPicker"] > div:last-child', what: 'The optional hue fader and hex well, each with a printed label.' },
    ],
  },
  sizes: { na: 'ColorPicker has one size. Every key is a 44px target and the row wraps to the width of its column.' },
  emphasis: { na: 'The picker is never the loud part of a unit. Its parts are ink and plastic, and the only colour on it is the data on the keys.' },
  placement: {
    rows: [['In a device sheet', 'One picker per lamp, with the name of the lamp printed above it.'], ['Before the save key', 'The orange key that saves comes after the last field.']],
    examples: [{ title: 'In a lamp sheet', render: <Unit><Stack gap="lg"><ColorPicker label="Colour when it turns on" swatches={lamp} defaultValue="f4f7ff" /><Button kind="primary">Save</Button></Stack></Unit> }],
  },
  combinations: {
    good: [['ColorPicker + Slider', 'A brightness fader under the colour keys sets the whole light.'], ['ColorPicker + Button', 'The orange key saves the lamp after the colour is set.']],
    avoid: [{ title: 'a picker with sixteen near-identical keys', why: 'Keys that look alike cannot be told apart, and the names crowd the readout. Keep to eight or fewer, or add the hue fader.', render: <Unit><ColorPicker label="Lamp colour" swatches={lamp} defaultValue="ffb347" /></Unit> }],
  },
  content: {
    formula: <p>Name each colour as a person would say it, as in <em>Warm white</em> or <em>Amber</em>. The name is the key’s accessible name, so never use only a hex value.</p>,
    pair: {
      do: <ColorPicker label="Lamp colour" swatches={lamp.slice(0, 3)} defaultValue="ffd9a0" />, doNote: 'Each key has a plain name.',
      dont: <ColorPicker label="Lamp colour" swatches={[{ value: 'ffd9a0', name: 'ffd9a0' }, { value: 'ffb347', name: 'ffb347' }, { value: 'f4f7ff', name: 'f4f7ff' }]} defaultValue="ffd9a0" />, dontNote: 'A screen reader reads out digits.',
    },
    overflow: { text: 'A long colour name wraps in the readout. The keys do not change size.', render: <ColorPicker label="Lamp colour" swatches={[{ value: 'ffd9a0', name: 'Warm white with a touch of amber for the evening in the living room' }]} defaultValue="ffd9a0" /> },
    rtl: { text: 'In right-to-left languages the keys start on the right and the readout aligns to the right.', render: <div dir="rtl"><ColorPicker label="لون المصباح" swatches={[{ value: 'ffd9a0', name: 'أبيض دافئ' }, { value: 'ffb347', name: 'عنبر' }, { value: '6fa8ff', name: 'أزرق' }]} defaultValue="ffb347" /></div> },
    expansion: { text: 'German and Finnish names can run 30% longer. They wrap in the readout and the keys do not move.', render: <ColorPicker label="Lampenfarbe" swatches={[{ value: 'ffd9a0', name: 'Warmweiß' }, { value: 'f4f7ff', name: 'Tageslichtweiß' }]} defaultValue="f4f7ff" /> },
  },
  behaviours: {
    states: [
      ['Default', 'A round key with its colour and a hairline edge.', 'A radio named by the colour.'],
      ['Hover', 'The key’s edge darkens one step.', 'No change.'],
      ['Pressed', 'The key drops and its shadow collapses.', 'No change.'],
      ['Chosen', 'The key sits down, wears an ink ring and shows a tick.', 'Announced as checked, and the readout names the colour.'],
      ['Focus', 'A dark ring outside the choice ring.', 'The key’s name is read out.'],
      ['Disabled', 'The keys lose their height and fade to half.', 'Announced as unavailable.'],
    ],
    interactions: [
      ['Pointer', 'Click a key', 'Chooses the colour.', 'native'],
      ['Keyboard', 'Tab, arrow keys', 'Tab enters the group. The arrow keys move to the next key and choose it.', 'native radio group'],
      ['Keyboard', 'Fader keys', 'Arrows step one degree, Page keys ten, Home and End reach the ends.', 'Slider'],
      ['Keyboard', 'Hex well', 'A valid entry sets the colour as you type.', 'native'],
      ['Screen reader', 'Read', 'A named radio group, each key by colour name, and a polite readout.', 'radiogroup, status'],
    ],
    loading: <p>ColorPicker has no loading state. Show it once the colours are known.</p>,
    focus: <p>Focus lands on the chosen key when there is one, otherwise on the first key. Moving between keys with the arrow keys also chooses them.</p>,
  },
  deepDive: { na: 'ColorPicker has a single look, so there is no section per variant.' },
  modifiers: [
    {
      name: 'hue',
      rules: <p>Adds a fader from 0 to 360 degrees. Moving it sets a colour at fixed saturation and lightness, so it suits lamps with a colour wheel. The chosen key clears and the readout says Custom colour.</p>,
      pair: { do: <ColorPicker label="Lamp colour" swatches={lamp.slice(0, 3)} defaultValue="ffb347" hue />, doNote: 'The fader reaches colours the keys do not.', dont: <ColorPicker label="Lamp colour" swatches={lamp.slice(0, 3)} defaultValue="ffb347" />, dontNote: 'On a colour lamp, three keys is all the person can pick.' },
    },
    {
      name: 'hex',
      rules: <p>Adds a well that takes three or six hex digits, with or without the hash. A valid entry sets the colour as you type. A wrong one prints a message and is dropped when the person leaves the field.</p>,
      pair: { do: <ColorPicker label="Lamp colour" swatches={lamp.slice(0, 3)} defaultValue="ffd9a0" hex />, doNote: 'For people who bring a brand colour.', dont: <ColorPicker label="Lamp colour" swatches={lamp.slice(0, 3)} defaultValue="ffd9a0" hue hex />, dontNote: 'Both a fader and a well on a simple lamp is too much.' },
    },
  ],
  related: [['/components/radio-cards', 'RadioCards', 'Choosing one option that is a word.'], ['/components/slider', 'Slider', 'A single number such as brightness.'], ['/components/input', 'Input', 'The well used for the hex value.']],
  references: [
    { title: 'WAI-ARIA Authoring Practices · Radio group', url: 'https://www.w3.org/WAI/ARIA/apg/patterns/radio/', why: 'The keyboard map the keys follow.' },
    { title: 'WCAG 2.2 · 1.4.1 Use of Color', url: 'https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html', why: 'Why the chosen key has a ring and a tick and not only a colour.' },
    { title: 'WCAG 2.2 · 1.4.11 Non-text Contrast', url: 'https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html', why: 'Why a pale key keeps a hairline edge.' },
  ],
};
