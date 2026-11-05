// Usage tab for Autocomplete (component-depth.md U1–U14). Autocomplete suggests completions under a text field.
import { Autocomplete } from 'dial-react';
import type { Depth } from './types';

const Unit = ({ children }: { children: React.ReactNode }) => <div className="demo-box demo-card">{children}</div>;
const ROOMS = [
  { value: 'living', label: 'Living room' },
  { value: 'kitchen', label: 'Kitchen' },
  { value: 'bedroom', label: 'Bedroom' },
  { value: 'bathroom', label: 'Bathroom' },
];
const field = (props: Partial<React.ComponentProps<typeof Autocomplete>> = {}) => <Autocomplete label="Room" options={ROOMS} {...props} />;

export const AUTOCOMPLETE: Depth = {
  overview: (
    <>
      <p>Autocomplete is a text field that offers suggestions while you type, such as the name of a room in a schedule. It is Input’s recessed well with a short plastic panel under it.</p>
      <p>The words in the well are always the person’s own. A suggestion replaces them only when it is reached with the arrows or pressed, so text that is not on the list stays valid.</p>
    </>
  ),
  whenToUse: ['To fill a field with a name the product may already know, while still accepting a new one.', 'To search a list that is too long to show at once, such as devices or places.'],
  whenNot: [
    { situation: 'The answer must be one of a short, fixed set', to: '/components/select', label: 'Select' },
    { situation: 'The list is always on show and takes one or many choices', to: '/components/listbox', label: 'Listbox' },
    { situation: 'A plain value with nothing to suggest', to: '/components/input', label: 'Input' },
  ],
  variants: { na: 'Autocomplete has one look: a well and a panel. How the list is narrowed is a prop, covered under Modifiers.' },
  anatomy: {
    render: <Unit>{field({ defaultValue: 'Ba' })}</Unit>,
    parts: [
      { part: 'Label', selector: '[data-component="Autocomplete"] label', what: 'The printed name above the well. It names the field for assistive tech.' },
      { part: 'Well', selector: '[data-component="Autocomplete"] input', what: 'The recessed text field. It keeps focus the whole time.' },
      { part: 'Panel', selector: '[data-component="Autocomplete"] [role="listbox"]', what: 'The plastic panel of suggestions. It opens when the person types.' },
      { part: 'Suggestion', selector: '[data-component="Autocomplete"] [role="option"]', what: 'One row, 44px tall. The part you typed is printed in medium weight.' },
    ],
  },
  sizes: {
    md: { use: 'Most fields: a 44px well and 44px rows.', pairs: 'Sits beside Input and Select at the same height.' },
    lg: { use: 'The main field of a phone sheet: a 52px well and 52px rows with larger text.', pairs: 'Pairs with a large Input.' },
  },
  emphasis: { na: 'Autocomplete is never loud. The reached suggestion is told by a recess and a hairline, and nothing in it is orange.' },
  placement: {
    rows: [['In a form column', 'Full width of the column, with its label on the inset line.'], ['Near the bottom of a screen', 'The panel opens downward and scrolls inside itself, so leave room below the field.']],
    examples: [{ title: 'In a settings unit', render: <Unit>{field({ hint: 'Pick a suggestion or type your own name.' })}</Unit> }],
  },
  combinations: {
    good: [['Autocomplete + hint', 'The hint says that any name is accepted.'], ['Autocomplete + Button', 'The orange key that saves comes after the field.']],
    avoid: [{ title: 'a list of two options', why: 'Two choices fit in a Select or a Segmented control; a typed search adds work for nothing.', render: <Unit>{field({ options: ROOMS.slice(0, 2) })}</Unit> }],
  },
  content: {
    formula: <p>Name the field for what goes in it, as in <em>Room</em> or <em>Device</em>. Write suggestions as the words the person would type, shortest first.</p>,
    pair: { do: field({ label: 'Room' }), doNote: 'A noun that names the field.', dont: field({ label: 'Type to search…' }), dontNote: 'An instruction in place of a name; it is the accessible name too.' },
    overflow: { text: 'Long suggestions wrap inside the row. The row grows and the panel scrolls.', render: <Unit>{field({ defaultValue: 'Ro', options: [{ value: 'a', label: 'Room above the garage that we use for the guests in summer' }, ...ROOMS] })}</Unit> },
    rtl: { text: 'In right-to-left languages the panel opens flush with the well’s start edge on the right.', render: <div dir="rtl">{field({ label: 'الغرفة', options: [{ value: 'a', label: 'غرفة المعيشة' }, { value: 'b', label: 'غرفة النوم' }] })}</div> },
    expansion: { text: 'German and Finnish suggestions can run 30% longer. They wrap and the row stays 44px or taller.', render: <Unit>{field({ label: 'Raum', options: [{ value: 'a', label: 'Wohnzimmer mit Essbereich' }, { value: 'b', label: 'Schlafzimmer im Obergeschoss' }] })}</Unit> },
  },
  behaviours: {
    states: [
      ['Closed', 'The well alone; aria-expanded="false".', 'Announced as a combobox.'],
      ['Open', 'The panel rises under the well, aria-expanded="true".', 'The count of suggestions is read out.'],
      ['Reached row', 'The row sinks into a well with a hairline and primary ink.', 'Named by aria-activedescendant.'],
      ['Busy', 'A grille Spinner and “Searching” stand in the panel.', 'The wait is read out and aria-busy is set.'],
      ['Empty', 'One line says nothing matched and the text stays as typed.', 'The same line is read out.'],
      ['Disabled', 'The well fades to half and takes no text.', 'Disabled.'],
    ],
    interactions: [
      ['Keyboard', 'Type', 'Opens the panel and narrows the suggestions', 'Autocomplete: typing opens a panel of suggestions that the combobox owns and announces'],
      ['Keyboard', 'Down / Up', 'Walks the suggestions while focus stays in the field. Up from the first row returns to the field', 'Autocomplete: the arrows walk the suggestions while focus stays in the field, Enter takes one and Escape closes'],
      ['Keyboard', 'Enter', 'Takes the reached suggestion, or keeps the typed text when none is reached', 'Autocomplete: text that matches nothing stays valid and says so'],
      ['Keyboard', 'Escape', 'Closes the panel and keeps the text', 'Autocomplete: the arrows walk the suggestions while focus stays in the field, Enter takes one and Escape closes'],
      ['Pointer', 'Press a row', 'Takes it; the field keeps focus', 'Autocomplete: every suggestion row is at least the touch target'],
      ['Screen reader', 'Read', 'A combobox with a list; the count, busy and empty lines are read in a polite status', 'role=combobox, aria-autocomplete, aria-activedescendant'],
    ],
    loading: <p>While the source works, set <code>loading</code>. The panel shows a Spinner and the word Searching, and suggestions already there stay until the new ones arrive.</p>,
    focus: <p>Focus stays in the well from first key to last. The panel and its rows never take focus, so the cursor and the person’s text are never lost.</p>,
  },
  deepDive: { na: 'Autocomplete has a single variant, so there is no section per variant.' },
  modifiers: [
    {
      name: 'filter',
      rules: <p>By default a suggestion stays when its label contains the typed text, ignoring case. Pass your own function for another rule. Pass <code>false</code> when the source has already narrowed the list, as with a search request.</p>,
      pair: { do: field({ filter: false, options: ROOMS.slice(0, 2), defaultValue: 'xx' }), doNote: 'The source decided; the field shows what it sent.', dont: field({ defaultValue: 'xx' }), dontNote: 'The default filter hides everything the source sent that does not contain the text.' },
    },
    {
      name: 'loading',
      rules: <p>Set it while a request runs and clear it when the answer arrives. It adds the Spinner row. It does not clear the suggestions.</p>,
      pair: { do: field({ loading: true, defaultValue: 'Ba' }), doNote: 'The wait is shown and read out.', dont: field({ defaultValue: 'Ba' }), dontNote: 'No sign that more is coming; the person types again.' },
    },
    {
      name: 'onChoose',
      rules: <p><code>onValueChange</code> gets every change of text. <code>onChoose</code> fires only when a suggestion is taken, so use it when the picked item matters and not only its words.</p>,
      pair: { do: field({ onChoose: () => undefined }), doNote: 'The choice is told apart from typing.', dont: field(), dontNote: 'Comparing the text with the list afterwards is guesswork.' },
    },
  ],
  related: [['/components/select', 'Select', 'A closed list with no typing.'], ['/components/listbox', 'Listbox', 'A list that stays open.'], ['/components/input', 'Input', 'The well Autocomplete is built on.'], ['/components/spinner', 'Spinner', 'The busy row.']],
  references: [
    { title: 'WAI-ARIA APG · Combobox with list autocomplete', url: 'https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-autocomplete-list/', why: 'The keyboard map and the roles.' },
    { title: 'WCAG 2.2 · 4.1.3 Status Messages', url: 'https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html', why: 'Why the count, busy and empty lines are announced.' },
    { title: 'GOV.UK Design System · Accessible autocomplete', url: 'https://design-system.service.gov.uk/components/', why: 'When to prefer a plain field over suggestions.' },
  ],
};
