// Usage tab for TagInput (component-depth.md U1–U14). TagInput keeps typed words as removable chips in an Input well.
import { Stack, TagInput } from 'dial-react';
import type { Depth } from './types';

const Unit = ({ children }: { children: React.ReactNode }) => <div className="demo-box demo-card">{children}</div>;
const rooms = (extra: Partial<React.ComponentProps<typeof TagInput>> = {}) => (
  <TagInput label="Rooms" defaultValue={['Kitchen', 'Hall']} placeholder="Add a room" {...extra} />
);

export const TAG_INPUT: Depth = {
  overview: (
    <>
      <p>TagInput takes a short list of words, such as the rooms a schedule applies to. It is the Input well, but each word you finish becomes a Chip standing in the well, and the caret follows the last one.</p>
      <p>Enter or a comma finishes a word. Backspace on an empty field takes the last chip back. A duplicate or a word past the limit is refused with a printed line and the same line is read out.</p>
    </>
  ),
  whenToUse: ['To collect a free list of short words, such as rooms, names or labels.', 'To let a person see and remove each word without leaving the field.'],
  whenNot: [
    { situation: 'Choosing from a fixed set of options', to: '/components/multi-select', label: 'MultiSelect' },
    { situation: 'Entering one value, such as a name', to: '/components/input', label: 'Input' },
    { situation: 'Filtering a list with latching keys', to: '/components/chip', label: 'Chip' },
  ],
  variants: { na: 'TagInput has one look, a recessed well holding chips. Limits and duplicates are options, covered under Modifiers.' },
  anatomy: {
    render: rooms({ hint: 'Enter or a comma adds a tag.' }),
    parts: [
      { part: 'Label', selector: '[data-component="TagInput"] > label', what: 'The printed name, which also names the text field and the list.' },
      { part: 'Well', selector: '[data-component="TagInput"] > div:nth-of-type(1)', what: 'The recess that wraps onto more rows as chips are added.' },
      { part: 'Chip', selector: '[data-component="TagInput"] [data-component="Chip"]', what: 'One tag, 44px tall, with a named remove key.' },
      { part: 'Text field', selector: '[data-component="TagInput"] input[type="text"]', what: 'Takes the rest of the row after the last chip.' },
      { part: 'Hint', selector: '[data-component="TagInput"] > p', what: 'Says which keys add and remove a tag.' },
    ],
  },
  sizes: { na: 'TagInput has one size. Chips and the text field are 44px tall.' },
  emphasis: { na: 'TagInput is an input, so it carries no emphasis. Nothing in it is orange.' },
  placement: {
    rows: [['In a form column', 'The well takes the full width of its column, like Input.'], ['In a settings sheet', 'Stands under a Stepper title with its hint below.']],
    examples: [{ title: 'In a card', render: <Unit>{rooms({ hint: 'Rooms this schedule applies to.' })}</Unit> }],
  },
  combinations: {
    good: [['TagInput + hint', 'Say which keys add and remove, once, under the well.'], ['TagInput + max', 'Print the limit in the hint so the refusal is no surprise.']],
    avoid: [{ title: 'a TagInput for a fixed set', why: 'When the options are known, a person should pick them. Use MultiSelect.', render: <Unit>{rooms({ label: 'Pick from Kitchen, Hall, Bedroom' })}</Unit> }],
  },
  content: {
    formula: <p>Print the label as a plural noun, as in <em>Rooms</em>. Keep each tag to one or two words.</p>,
    pair: {
      do: rooms({ label: 'Rooms', defaultValue: ['Kitchen'] }), doNote: 'A plural noun and short tags.',
      dont: rooms({ label: 'Type the rooms you want and press Enter', defaultValue: ['Kitchen'] }), dontNote: 'An instruction in place of a name; put keys in the hint.',
    },
    overflow: { text: 'A long tag wraps its text inside its chip; the well adds a row and its width does not change.', render: rooms({ defaultValue: ['Upstairs landing and the cupboard under the stairs', 'Hall'] }) },
    rtl: { text: 'In right-to-left languages the chips start on the right and the caret follows on the left.', render: <div dir="rtl"><TagInput label="الغرف" defaultValue={['المطبخ', 'الصالة']} placeholder="أضف غرفة" /></div> },
    expansion: { text: 'German and Finnish words can run 30% longer. The chips wrap onto the next row.', render: <TagInput label="Räume" defaultValue={['Wohnzimmer', 'Gästetoilette']} placeholder="Raum hinzufügen" /> },
  },
  behaviours: {
    states: [
      ['Default', 'A recessed well with chips and the caret.', 'The tags are a named list.'],
      ['Focus', 'The dark ring on the well, around the field or a remove key.', 'The field is named by the label.'],
      ['Refused', 'A critical red edge and a printed line with a glyph.', 'The line is announced politely.'],
      ['Disabled', 'The recess shadow goes and the chips flatten.', 'Not focusable.'],
    ],
    interactions: [
      ['Keyboard', 'Enter, comma', 'Turns the text into a tag.', 'native'],
      ['Keyboard', 'Backspace', 'On an empty field, removes the last tag.', 'native'],
      ['Keyboard', 'Tab', 'Reaches each remove key, then the field; Enter or Space on a key removes its tag.', 'native'],
      ['Pointer', 'Press the well', 'Puts the caret in the field.', 'native'],
      ['Screen reader', 'Add, remove, refuse', 'Each is spoken through a polite status line.', 'role=status'],
    ],
    loading: <p>TagInput has no loading state.</p>,
    focus: <p>Focus stays on the text field after a tag is added or removed, so the next word can be typed at once.</p>,
  },
  deepDive: { na: 'TagInput has a single variant, so there is no section per variant.' },
  modifiers: [
    {
      name: 'max',
      rules: <p>Sets the most tags the field takes. Say the limit in the hint. At the limit a new tag is refused and the refusal is printed and read out.</p>,
      pair: { do: rooms({ max: 2, hint: 'Two rooms at most.' }), doNote: 'The limit is in the hint.', dont: rooms({ max: 2 }), dontNote: 'The limit appears only as a surprise.' },
    },
    {
      name: 'allowDuplicates',
      rules: <p>Off by default, and the comparison ignores case. Turn it on only when a repeat means something, such as two heating periods at the same time.</p>,
      pair: { do: <Stack gap="md"><TagInput label="Times" allowDuplicates defaultValue={['06:30']} /></Stack>, doNote: 'Repeats are meaningful here.', dont: rooms({ allowDuplicates: true, defaultValue: ['Kitchen', 'Kitchen'] }), dontNote: 'Two Kitchens are noise.' },
    },
    {
      name: 'removeLabel, duplicateMessage, maxMessage',
      rules: <p>Every built-in word is a prop. Pass your own in the language of the page so the remove keys and refusals match the rest of the screen.</p>,
      pair: { do: rooms({ removeLabel: (t) => `Delete ${t}` }), doNote: 'The remove keys use the product’s words.', dont: rooms(), dontNote: 'Default English words on a page in another language.' },
    },
  ],
  related: [['/components/input', 'Input', 'One value, one string.'], ['/components/chip', 'Chip', 'The removable key used for each tag.'], ['/components/multi-select', 'MultiSelect', 'Choosing from a fixed set.']],
  references: [
    { title: 'WAI-ARIA · live regions', url: 'https://www.w3.org/TR/wai-aria-1.2/#live_region_roles', why: 'How adds, removals and refusals are spoken.' },
    { title: 'WCAG 2.2 · 2.5.8 Target Size (Minimum)', url: 'https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html', why: 'Why each remove key reaches 44px.' },
    { title: 'GOV.UK Design System · Text input', url: 'https://design-system.service.gov.uk/components/text-input/', why: 'Labels above the field and error messages beneath.' },
  ],
};
