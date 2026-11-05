// Usage tab for Radio (component-depth.md U1–U14). Radio is a column of round keys of which one is chosen.
import { Button, Radio, RadioGroup, Stack } from 'dial-react';
import type { Depth } from './types';

const Unit = ({ children }: { children: React.ReactNode }) => <div className="demo-box demo-card">{children}</div>;
const modes = (extra?: { disabled?: boolean }) => (
  <RadioGroup label="Heating mode" defaultValue="eco" disabled={extra?.disabled}>
    <Radio value="comfort" label="Comfort" />
    <Radio value="eco" label="Eco" />
    <Radio value="away" label="Away" />
  </RadioGroup>
);

export const RADIO: Depth = {
  overview: (
    <>
      <p>Radio picks one option out of a few, all in plain sight. Each option is a round key of matte plastic with its name printed beside it. The chosen key carries a dot of ink and its name turns medium. The others wait without one.</p>
      <p>Choosing another option moves the dot, and the old one is released. A group always has a printed name above it, because the options mean nothing without a subject.</p>
    </>
  ),
  whenToUse: ['To pick one of two to five options that all fit on screen.', 'To make a setting where the person should compare the choices before picking.'],
  whenNot: [
    { situation: 'Turning one option on or off', to: '/components/checkbox', label: 'Checkbox' },
    { situation: 'Picking from a long list', to: '/components/select', label: 'Select' },
    { situation: 'Switching between views of the same content', to: '/components/tabs', label: 'Tabs' },
  ],
  variants: { na: 'Radio has one look, a round key with a dot. A choice told by words alone is the Legend component.' },
  anatomy: {
    render: modes(),
    parts: [
      { part: 'Group name', selector: '[data-component="RadioGroup"] > legend', what: 'The printed name of the choice, in secondary ink above the options.' },
      { part: 'Key', selector: '[data-component="Radio"] > span:nth-of-type(1)', what: 'A 24px round key with the part shadow and a ring edge. It carries the dot when chosen.' },
      { part: 'Word', selector: '[data-component="Radio"] > span:nth-of-type(2)', what: 'The option’s name. It is part of the label, so pressing it chooses the option.' },
    ],
  },
  sizes: { na: 'Radio has one size. The key is 24px and the row is 44px tall, the same as Checkbox.' },
  emphasis: { na: 'The chosen option is told by a dot and a medium word. Nothing in a Radio is orange.' },
  placement: {
    rows: [['In a unit, under the display', 'Options stand in one column, and the orange key comes after the group.'], ['Two to five options', 'More than five and a Select takes less room.']],
    examples: [{ title: 'In a washer unit', render: <Unit><Stack gap="md"><RadioGroup label="Spin speed" defaultValue="1200"><Radio value="800" label="800 rpm" /><Radio value="1200" label="1200 rpm" /></RadioGroup><Button kind="primary">Start wash</Button></Stack></Unit> }],
  },
  combinations: {
    good: [['Radio + Button', 'The orange key that starts or saves comes after the group.'], ['Radio + Display', 'The display says the result of the choice; the group does not repeat it.']],
    avoid: [{ title: 'a Radio group of one option', why: 'There is nothing to choose between. Use a Checkbox or print the fact.', render: <Unit><RadioGroup label="Mode" defaultValue="a"><Radio value="a" label="Comfort" /></RadioGroup></Unit> }],
  },
  content: {
    formula: <p>Name the group with a noun, as in <em>Heating mode</em>. Name each option with a short noun or value, as in <em>Eco</em> or <em>1200 rpm</em>. Do not repeat the group name in each option.</p>,
    pair: {
      do: <RadioGroup label="Heating mode" defaultValue="eco"><Radio value="comfort" label="Comfort" /><Radio value="eco" label="Eco" /></RadioGroup>, doNote: 'The group names the subject, the options stay short.',
      dont: <RadioGroup label="Choose" defaultValue="eco"><Radio value="comfort" label="Heating mode comfort" /><Radio value="eco" label="Heating mode eco" /></RadioGroup>, dontNote: 'The subject is repeated in every option.',
    },
    overflow: { text: 'A long name wraps beside its key. The key stays 24px and the row grows.', render: <RadioGroup label="Schedule" defaultValue="a"><Radio value="a" label="Follow the weekday schedule for all the upstairs rooms until Friday evening" /><Radio value="b" label="Hold the current temperature" /></RadioGroup> },
    rtl: { text: 'In right-to-left languages the key sits on the right and the word follows it.', render: <div dir="rtl"><RadioGroup label="وضع التدفئة" defaultValue="a"><Radio value="a" label="مريح" /><Radio value="b" label="اقتصادي" /></RadioGroup></div> },
    expansion: { text: 'German and Finnish names can run 30% longer. They wrap and the keys do not move.', render: <RadioGroup label="Heizmodus" defaultValue="a"><Radio value="a" label="Komfortbetrieb" /><Radio value="b" label="Sparbetrieb" /></RadioGroup> },
  },
  behaviours: {
    states: [
      ['Waiting', 'An empty round key with its ring edge.', 'Announced as a radio button, not checked.'],
      ['Chosen', 'A dot of ink on the key and a medium word.', 'Announced as checked.'],
      ['Hover', 'The ring edge darkens one step. The key does not rise.', 'No change.'],
      ['Pressed', 'The key drops by its travel and its shadow collapses.', 'No change.'],
      ['Focus', 'A ring around the key.', 'The name and the group name are read.'],
      ['Disabled', 'The key loses its height and fades.', 'Announced as unavailable.'],
    ],
    interactions: [
      ['Keyboard', 'Tab', 'Moves focus into the group, to the chosen option or to the first one if none is chosen. A second Tab leaves the group.', 'native input'],
      ['Keyboard', 'Arrow keys', 'Move to the next or previous option and choose it. They wrap at the ends.', 'native input'],
      ['Keyboard', 'Space', 'Chooses the focused option if it is not chosen yet.', 'native input'],
      ['Pointer', 'Press the key or the word', 'The key drops and returns, and the option is chosen.', 'native label'],
      ['Screen reader', 'Read', 'Announced as a radio group with its name, then each option with its position and state.', 'fieldset, legend'],
    ],
    loading: <p>Radio has no loading state. If a device must confirm the change, show that on the unit’s display.</p>,
    focus: <p>Radio is never focused on page load. In a sheet, focus goes to the first field, which may be a group.</p>,
  },
  deepDive: { na: 'Radio has a single variant, so there is no section per variant.' },
  modifiers: [
    {
      name: 'disabled',
      rules: <p>Put <code>disabled</code> on one <code>Radio</code> to remove an option that does not apply now, or on the <code>RadioGroup</code> to remove all of them. A disabled option keeps its place and its word, so the person sees it exists.</p>,
      pair: { do: modes({ disabled: true }), doNote: 'The group is disabled as a whole.', dont: <RadioGroup label="Heating mode" defaultValue="eco"><Radio value="eco" label="Eco" /></RadioGroup>, dontNote: 'An option removed from the list instead of disabled: the person cannot learn it exists.' },
    },
  ],
  related: [['/components/checkbox', 'Checkbox', 'Turning one option on or off.'], ['/components/select', 'Select', 'Picking from a long list.'], ['/components/legend', 'Legend', 'A choice told by printed words.']],
  references: [
    { title: 'WAI-ARIA Authoring Practices · Radio Group', url: 'https://www.w3.org/WAI/ARIA/apg/patterns/radio/', why: 'The keyboard map and the roles.' },
    { title: 'WCAG 2.2 · 1.4.1 Use of Color', url: 'https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html', why: 'Why chosen is a dot and a weight and not only a colour.' },
    { title: 'MDN · The Radio input type', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/radio', why: 'How the native group moves focus.' },
  ],
};
