// Usage tab for SearchInput (component-depth.md U1–U14). SearchInput is the Input well with a search mark and a Clear key.
import { Button, SearchInput, Stack } from 'dial-react';
import type { Depth } from './types';

const Unit = ({ children }: { children: React.ReactNode }) => <div className="demo-box demo-card">{children}</div>;

export const SEARCH_INPUT: Depth = {
  overview: (
    <>
      <p>SearchInput is the field for finding something in a list, such as a room, a device or a schedule. It is the same well as Input, with a printed search mark at the start and a Clear key at the end that shows once there is text.</p>
      <p>Enter searches and Escape clears. The Clear key is a word on a strip as tall as the well, so it is found by sight and by touch.</p>
    </>
  ),
  whenToUse: ['To find one item in a list that is too long to scan.', 'To filter a page of rooms, devices or schedules as the person types.'],
  whenNot: [
    { situation: 'Entering a value that is not a query, such as a device name', to: '/components/input', label: 'Input' },
    { situation: 'Picking from a list of suggestions as you type', to: '/components/combobox', label: 'Combobox' },
  ],
  variants: { na: 'SearchInput has one look, a recessed well with a search mark. The landmark, the count and the messages are options, covered under Modifiers.' },
  anatomy: {
    render: <SearchInput label="Search rooms" hint="Rooms and devices" defaultValue="Kitchen" />,
    parts: [
      { part: 'Label', selector: '[data-component="SearchInput"] > label', what: 'The printed name, above the start of the well.' },
      { part: 'Search mark', selector: '[data-component="SearchInput"] svg', what: 'A dot-matrix magnifier at the start of the well. It is hidden from assistive tech.' },
      { part: 'Text', selector: '[data-component="SearchInput"] input', what: 'The query in primary ink, on a line box tall enough for Thai marks.' },
      { part: 'Clear key', selector: '[data-component="SearchInput"] button', what: 'A printed word on a strip 44px tall, at the end of the well. It shows only when there is text.' },
      { part: 'Hint', selector: '[data-component="SearchInput"] > p', what: 'A short line under the well in secondary ink.' },
    ],
  },
  sizes: {
    md: { use: '44px well and Clear strip. Fields in a unit and in settings sheets.', pairs: 'Other 44px controls, such as Button, Select and Switch.' },
    lg: { use: '52px well with larger text. The main field of a sheet on a phone.', pairs: 'A large Button below it, one field per row.' },
  },
  emphasis: { na: 'A field is never the loud part of a unit. It has no orange and no emphasis levels; the unit’s one orange key does the action.' },
  placement: {
    rows: [['Above a long list', 'The field stands at the top of the list it filters, full width of the column.'], ['Top of a page or a sheet', 'Use the landmark option once, so assistive tech can jump to it.']],
    examples: [{ title: 'Above a list', render: <Unit><Stack gap="md"><SearchInput label="Find a room" defaultValue="Ha" /><p>Hall</p></Stack></Unit> }],
  },
  combinations: {
    good: [['SearchInput + a list', 'The field filters the list under it and the count is read out.'], ['SearchInput + Button', 'On a page that searches on request, a Button next to the field runs the same search as Enter.']],
    avoid: [{ title: 'two SearchInputs on one page with the landmark option', why: 'Two search landmarks with the same name give a screen reader user no way to tell them apart. Use the option once.', render: <Unit><Stack gap="md"><SearchInput landmark label="Search" /><SearchInput landmark label="Search" /></Stack></Unit> }],
  },
  content: {
    formula: <p>Name what is searched, as in <em>Search rooms</em> or <em>Find a device</em>. Put the kinds of thing it finds in <code>hint</code>. Do not use the placeholder as the name.</p>,
    pair: {
      do: <SearchInput label="Search rooms" hint="Name or floor" />, doNote: 'The label names what is searched and the hint says how.',
      dont: <SearchInput label="Type here" placeholder="Search rooms" />, dontNote: 'The label says nothing and the real name is in a placeholder that goes when you type.',
    },
    overflow: { text: 'A long query scrolls inside the field. The Clear key keeps its place at the end and does not shrink.', render: <SearchInput label="Search" defaultValue="A very long query about the heating schedule of the upstairs rooms in winter" /> },
    rtl: { text: 'In right-to-left languages the mark sits on the right and the Clear key on the left.', render: <div dir="rtl"><SearchInput label="بحث" defaultValue="المطبخ" clearLabel="مسح" /></div> },
    expansion: { text: 'German and Finnish labels can run 30% longer, and so can the Clear word. The key widens and the well does not change.', render: <SearchInput label="Räume und Geräte durchsuchen" defaultValue="Küche" clearLabel="Eingabe löschen" /> },
  },
  behaviours: {
    states: [
      ['Empty', 'The well with the mark and no Clear key.', 'Nothing to clear, so nothing to press.'],
      ['With text', 'The Clear key fades in at the end of the well.', 'The key is in the tab order, after the field.'],
      ['Focus', 'The same dark 2px ring as every part, around the whole well. The key has its own ring.', 'The well does not grow or move.'],
      ['Invalid', 'The edge turns red and the message is printed below with a glyph.', 'Never orange, and never colour alone.'],
      ['Read-only', 'The well stays recessed and the text can be copied.', 'The Clear key is not shown.'],
      ['Disabled', 'The well loses its shadow and the field fades to half.', 'It leaves the tab order, and so does the key.'],
    ],
    interactions: [
      ['Keyboard', 'Enter', 'Calls onSearch with the text. It does nothing while an input method is composing.', 'onKeyDown'],
      ['Keyboard', 'Escape', 'Clears the text and keeps focus in the field. With no text it passes on, so a Dialog still closes.', 'onKeyDown'],
      ['Pointer', 'Press Clear', 'Clears the text, calls onChange with an empty value and puts focus back in the field.', 'native button'],
      ['Screen reader', 'Read', 'Announced as a search field with its label and hint. With resultsCount set, the count is read out politely.', 'type=search, role=status'],
    ],
    loading: <p>SearchInput has no loading state. While results load, say so where the results appear and keep the query where the person typed it.</p>,
    focus: <p>A search field is not focused on page load, except on a screen that exists only to search.</p>,
  },
  deepDive: { na: 'SearchInput has a single variant, so there is no section per variant.' },
  modifiers: [
    {
      name: 'landmark',
      rules: <p>Wraps the field in a <code>search</code> landmark named by the label. Use it once per page, on the field that searches the page or the site.</p>,
      pair: { do: <SearchInput landmark label="Search the home" />, doNote: 'One landmark, named by its label.', dont: <SearchInput landmark label="Filter" />, dontNote: 'A filter on a single list is not a page search; leave the option off.' },
    },
    {
      name: 'resultsCount',
      rules: <p>The number of matches. When it changes, the new count is read out politely, for example “12 results”. Leave it unset when nothing on the page changes.</p>,
      pair: { do: <SearchInput label="Find a room" defaultValue="Ba" resultsCount={2} />, doNote: 'The count follows the filtered list.', dont: <SearchInput label="Find a room" defaultValue="Ba" />, dontNote: 'The list changes and a screen reader user hears nothing.' },
    },
    {
      name: 'clearLabel',
      rules: <p>The word on the Clear key. Pass your own for another language, and keep it to one or two words.</p>,
      pair: { do: <SearchInput label="ค้นหาห้อง" defaultValue="ห้องครัว" clearLabel="ล้าง" />, doNote: 'The word is in the page’s language.', dont: <SearchInput label="ค้นหาห้อง" defaultValue="ห้องครัว" />, dontNote: 'An English word on a Thai page.' },
    },
  ],
  related: [['/components/input', 'Input', 'A value that is not a query.'], ['/components/combobox', 'Combobox', 'Choosing from suggestions while typing.'], ['/components/autocomplete', 'Autocomplete', 'Suggestions that load from a source.']],
  references: [
    { title: 'WAI-ARIA APG · Search landmark', url: 'https://www.w3.org/WAI/ARIA/apg/patterns/landmarks/examples/search.html', why: 'How the search landmark is named and used once per page.' },
    { title: 'WCAG 2.2 · 2.5.8 Target Size (Minimum)', url: 'https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html', why: 'Why the Clear key is a strip and not a small cross.' },
    { title: 'GOV.UK Design System · Search input', url: 'https://design-system.service.gov.uk/components/', why: 'A labelled search field with a visible button.' },
  ],
};
