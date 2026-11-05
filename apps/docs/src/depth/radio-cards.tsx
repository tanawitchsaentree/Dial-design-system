// Usage tab for RadioCards (component-depth.md U1–U14). RadioCards is a column of key plates of which one is chosen.
import { Button, Icon, RadioCard, RadioCards, Stack } from 'dial-react';
import type { Depth } from './types';

const Unit = ({ children }: { children: React.ReactNode }) => <div className="demo-box demo-card">{children}</div>;
const modes = (extra?: { disabled?: boolean }) => (
  <RadioCards label="Heating mode" defaultValue="comfort" disabled={extra?.disabled}>
    <RadioCard value="eco" title="Eco" description="Lowers the heat when nobody is home." />
    <RadioCard value="comfort" title="Comfort" description="Holds 21 degrees all day." />
    <RadioCard value="away" title="Away" description="Frost guard only." />
  </RadioCards>
);

export const RADIO_CARDS: Depth = {
  overview: (
    <>
      <p>RadioCards picks one option out of a few, and each option needs a sentence to explain it. Every option is a wide key plate with its name and a line of text printed on its face. The chosen plate sits down in the body, shows a bar of ink at its start and prints its name in the medium weight.</p>
      <p>Choosing another plate lifts the old one and lowers the new one. A group always has a printed name above it. The choice is told by shape and weight, never by colour.</p>
    </>
  ),
  whenToUse: ['To pick one of two to five options that each need a line of explanation.', 'To compare modes or plans where the name alone does not say what changes.'],
  whenNot: [
    { situation: 'Options that a word each can explain', to: '/components/radio', label: 'Radio' },
    { situation: 'A choice told by words alone, with no part to press', to: '/components/legend', label: 'Legend' },
    { situation: 'Picking from a long list', to: '/components/select', label: 'Select' },
  ],
  variants: { na: 'RadioCards has one look, a column of key plates. A group of round keys with one word each is the Radio component.' },
  anatomy: {
    render: (
      <RadioCards label="Room source" defaultValue="heat">
        <RadioCard value="heat" leading={<Icon name="heat" />} title="Heat" description="Radiators and floor loops." />
        <RadioCard value="cool" leading={<Icon name="cool" />} title="Cool" description="Fan coil units only." />
      </RadioCards>
    ),
    parts: [
      { part: 'Group name', selector: '[data-component="RadioCards"] > legend', what: 'The printed name of the choice, above the plates. It is also the accessible name of the group.' },
      { part: 'Plate', selector: '[data-component="RadioCard"]', what: 'One key plate, at least 44px tall and the full width of its column. It is one native label.' },
      { part: 'Index bar', selector: '[data-component="RadioCard"] > span:nth-of-type(1)', what: 'A bar of ink at the start of the chosen plate.' },
      { part: 'Leading node', selector: '[data-component="RadioCard"] > span:nth-of-type(2)', what: 'An optional icon before the words.' },
      { part: 'Title and text', selector: '[data-component="RadioCard"] > span:last-child', what: 'The option name in the body size, and under it a line of secondary ink.' },
    ],
  },
  sizes: { na: 'RadioCards has one size. A plate is at least 44px tall and grows with its text.' },
  emphasis: { na: 'The chosen plate is told by a bar, a weight and a lowered face. Nothing in RadioCards is orange.' },
  placement: {
    rows: [['In a unit, under the display', 'The plates fill the unit’s column, and the orange key comes after them.'], ['A settings sheet', 'One group per setting, each with its own printed name.']],
    examples: [{ title: 'In a washer unit', render: <Unit><Stack gap="lg"><p className="flush">Washer · Cotton 40° · 1 h 52 min</p><RadioCards label="Spin speed" defaultValue="1200"><RadioCard value="800" title="800 rpm" description="Gentle, for wool and silk." /><RadioCard value="1200" title="1200 rpm" description="For everyday cotton." /></RadioCards><Button kind="primary">Start wash</Button></Stack></Unit> }],
  },
  combinations: {
    good: [['RadioCards + Button', 'The orange key that applies the choice comes after the last plate.'], ['RadioCards + Icon', 'A dot-matrix icon in the leading slot helps people scan a longer list.']],
    avoid: [{ title: 'RadioCards with no text', why: 'Plates that carry only a name waste their width. Use Radio.', render: <Unit><RadioCards label="Spin speed" defaultValue="a"><RadioCard value="a" title="800 rpm" /><RadioCard value="b" title="1200 rpm" /></RadioCards></Unit> }],
  },
  content: {
    formula: <p>Write the title as a noun, as in <em>Eco</em> or <em>Comfort</em>. Write the text as one short sentence that says what changes when the plate is chosen.</p>,
    pair: {
      do: <RadioCards label="Heating mode" defaultValue="eco"><RadioCard value="eco" title="Eco" description="Lowers the heat when nobody is home." /></RadioCards>, doNote: 'A noun, then what it does.',
      dont: <RadioCards label="Heating mode" defaultValue="eco"><RadioCard value="eco" title="Select the Eco mode" description="Eco" /></RadioCards>, dontNote: 'The title is an instruction and the text repeats it.',
    },
    overflow: { text: 'A long text wraps inside the plate. The bar keeps its place and the plate grows in height.', render: <RadioCards label="Heating mode" defaultValue="eco"><RadioCard value="eco" title="Eco" description="Lowers the heat in every room when nobody has been home for more than two hours, and raises it again before the first person returns." /><RadioCard value="away" title="Away" description="Frost guard only." /></RadioCards> },
    rtl: { text: 'In right-to-left languages the bar and the words start on the right.', render: <div dir="rtl"><RadioCards label="وضع التدفئة" defaultValue="eco"><RadioCard value="eco" title="اقتصادي" description="يخفض الحرارة عندما لا يوجد أحد." /><RadioCard value="away" title="غياب" description="حماية من الصقيع فقط." /></RadioCards></div> },
    expansion: { text: 'German and Finnish text can run 30% longer. It wraps and the plates keep their column.', render: <RadioCards label="Heizmodus" defaultValue="eco"><RadioCard value="eco" title="Sparbetrieb" description="Senkt die Temperatur, wenn niemand zu Hause ist." /><RadioCard value="away" title="Abwesenheit" description="Nur Frostschutz." /></RadioCards> },
  },
  behaviours: {
    states: [
      ['Waiting', 'A raised plate with a ring edge.', 'Announced as a radio, not checked.'],
      ['Hover', 'The ring edge darkens one step. The plate does not lift.', 'Not announced.'],
      ['Pressed', 'The plate drops and its shadow collapses under it.', 'Not announced.'],
      ['Chosen', 'The plate sits down, the bar shows and the title turns medium.', 'Announced as checked.'],
      ['Focus', 'A dark ring round the whole plate.', 'The focused radio is announced with its title and text.'],
      ['Disabled', 'No height, half strength, not-allowed cursor.', 'Announced as dimmed.'],
    ],
    interactions: [
      ['Pointer', 'Press', 'Anywhere on a plate chooses it.', 'label'],
      ['Keyboard', 'Tab', 'Moves focus into the group, to the chosen plate or to the first one if none is chosen. A second Tab leaves the group.', 'native input'],
      ['Keyboard', 'Arrow keys', 'Move to the next or previous plate and choose it. They wrap at the ends.', 'native input'],
      ['Keyboard', 'Space', 'Chooses the focused plate if it is not chosen yet.', 'native input'],
      ['Screen reader', 'Read', 'Announced as a radio group with its name. Each plate is read with its title and then its text.', 'fieldset, aria-labelledby, aria-describedby'],
    ],
    loading: <p>RadioCards has no loading state. Show the group when its options are known.</p>,
    focus: <p>Nothing takes focus on its own. A person who tabs in lands on the chosen plate, or on the first one if none is chosen.</p>,
  },
  deepDive: { na: 'RadioCards has a single variant, so there is no section per variant.' },
  modifiers: [
    {
      name: 'leading',
      rules: <p>Put a dot-matrix icon before the words when it helps people find a plate. The node is decoration and is hidden from assistive tech, so the title must say everything the icon does.</p>,
      pair: {
        do: <RadioCards label="Room source" defaultValue="heat"><RadioCard value="heat" leading={<Icon name="heat" />} title="Heat" description="Radiators." /><RadioCard value="cool" leading={<Icon name="cool" />} title="Cool" description="Fan coils." /></RadioCards>, doNote: 'Every plate has an icon and a title that says the same.',
        dont: <RadioCards label="Room source" defaultValue="heat"><RadioCard value="heat" leading={<Icon name="heat" />} title="Heat" description="Radiators." /><RadioCard value="cool" title="Cool" description="Fan coils." /></RadioCards>, dontNote: 'One plate has an icon and one has not, so the titles do not line up.',
      },
    },
    {
      name: 'disabled',
      rules: <p>Disable one plate when its option is not available now, or the whole group while a setting is locked. A disabled plate loses its height and cannot be chosen.</p>,
      pair: { do: modes({ disabled: true }), doNote: 'The whole group locked, and the chosen plate still readable.', dont: <RadioCards label="Heating mode" defaultValue="eco"><RadioCard value="eco" title="Eco" description="Lowers the heat." /></RadioCards>, dontNote: 'A group of one plate offers no choice at all.' },
    },
  ],
  related: [['/components/radio', 'Radio', 'Round keys with one word each.'], ['/components/legend', 'Legend', 'A choice told by printed words alone.'], ['/components/select', 'Select', 'Picking from a long list.']],
  references: [
    { title: 'WAI-ARIA Authoring Practices · Radio Group', url: 'https://www.w3.org/WAI/ARIA/apg/patterns/radio/', why: 'The keyboard map and the roles that native radios give.' },
    { title: 'WCAG 2.2 · 1.4.1 Use of Color', url: 'https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html', why: 'Why the chosen plate is told by shape and weight, not colour.' },
    { title: 'Radix Themes · Radio Cards', url: 'https://www.radix-ui.com/themes/docs/components/radio-cards', why: 'The common card-radio pattern this component answers.' },
  ],
};
