// Usage tab for Textarea (component-depth.md U1–U14). Textarea is the Input well made tall enough for a few lines.
import { Button, Input, Stack, Textarea } from 'dial-react';
import type { Depth } from './types';

const Unit = ({ children }: { children: React.ReactNode }) => <div className="demo-box demo-card">{children}</div>;

export const TEXTAREA: Depth = {
  overview: (
    <>
      <p>Textarea takes a few lines of text, such as a note for a schedule or a reason for a change. It is the same well as Input, cut into the body with the light falling in from the top left, only taller.</p>
      <p>The name of the field is printed above the well and stays there while you type. A placeholder is never the name.</p>
    </>
  ),
  whenToUse: ['To enter a note or a description that runs over more than one line.', 'To collect free text where the length is not known in advance.'],
  whenNot: [
    { situation: 'A short value such as a device name', to: '/components/input', label: 'Input' },
    { situation: 'Picking one of a known list of options', to: '/components/select', label: 'Select' },
  ],
  variants: { na: 'Textarea has one look, a recessed well with the label above it. The hint and the error are options, covered under Modifiers.' },
  anatomy: {
    render: <Textarea label="Note" hint="Shown to everyone in the home." defaultValue="Guests arrive on Friday." />,
    parts: [
      { part: 'Label', selector: '[data-component="Textarea"] > label', what: 'The printed name, above the start of the well.' },
      { part: 'Well', selector: '[data-component="Textarea"] > div', what: 'A recess the width of the column, with a hairline edge and shade on its top-left inner edge.' },
      { part: 'Text', selector: '[data-component="Textarea"] textarea', what: 'The typed text in primary ink, on a line box tall enough for Thai marks.' },
      { part: 'Hint', selector: '[data-component="Textarea"] > p', what: 'A short line under the well in secondary ink.' },
    ],
  },
  sizes: { na: 'Textarea has one width, the full width of its column. Its height follows the rows prop, four rows by default, and the person can drag it taller.' },
  emphasis: { na: 'A field is never the loud part of a unit. It has no orange and no emphasis levels.' },
  placement: {
    rows: [['One field per row, full width', 'The usual place, in a settings sheet.'], ['Above the action', 'The key that saves the note comes after the last field.']],
    examples: [{ title: 'In a settings sheet', render: <Unit><Stack gap="md"><Textarea label="Note" defaultValue="Guests arrive on Friday." /><Button kind="primary">Save</Button></Stack></Unit> }],
  },
  combinations: {
    good: [['Textarea + Button', 'The field takes the note and the orange key saves it.'], ['Textarea + Input', 'A short title above a longer note, each with its own printed label.']],
    avoid: [{ title: 'a Textarea for a one-word value', why: 'A tall well promises a long answer. Use Input for a short value.', render: <Unit><Textarea label="Room name" defaultValue="Kitchen" rows={4} /></Unit> }],
  },
  content: {
    formula: <p>Name the thing the field holds, as in <em>Note</em> or <em>Reason for the change</em>, and leave the action to the key. Put the limit in <code>hint</code>.</p>,
    pair: {
      do: <Textarea label="Note" hint="Up to 200 characters." defaultValue="Guests arrive on Friday." rows={2} />, doNote: 'The label names the thing and the limit sits in the hint.',
      dont: <Textarea label="Please type your note here" defaultValue="Guests arrive on Friday." rows={2} />, dontNote: 'An instruction as the label.',
    },
    overflow: { text: 'Long text wraps inside the well. When it passes the last row the well scrolls, and it keeps its width.', render: <Textarea label="Note" rows={2} defaultValue={'A long note that wraps over several lines inside the well and then scrolls. '.repeat(4)} /> },
    rtl: { text: 'In right-to-left languages the label starts on the right and the text runs from the right.', render: <div dir="rtl"><Textarea label="ملاحظة" defaultValue="يصل الضيوف يوم الجمعة" rows={2} /></div> },
    expansion: { text: 'German and Finnish labels can run 30% longer. The label wraps and the well does not change.', render: <Textarea label="Hinweis für den Nachtzeitplan im Wohnzimmer" defaultValue="Gäste kommen am Freitag." rows={2} /> },
  },
  behaviours: {
    states: [
      ['Rest', 'A recess with a hairline edge and shade on its top-left inner edge.', 'The label is printed above it.'],
      ['Focus', 'The same dark 2px ring as every part, around the whole well.', 'The well does not grow or move.'],
      ['Typing', 'Text wraps in the well and scrolls when it is long.', 'The well keeps its width, and Thai marks are not cut.'],
      ['Invalid', 'The edge turns red and the message is printed below with a glyph.', 'Never orange, and never colour alone.'],
      ['Read-only', 'The well stays recessed and the text can be selected and copied.', 'It stays in the tab order.'],
      ['Disabled', 'The well loses its shadow and the field fades to half.', 'It leaves the tab order.'],
    ],
    interactions: [
      ['Keyboard', 'Tab', 'Moves focus into the field and shows the ring.', 'native textarea'],
      ['Keyboard', 'Enter', 'Starts a new line. It does not submit.', 'native textarea'],
      ['Pointer', 'Drag the lower edge', 'Makes the well taller. It never gets wider than its column.', 'resize: vertical'],
      ['Screen reader', 'Read', 'Announced with its label, its value, its hint and, when invalid, the error.', 'aria-describedby, aria-invalid'],
    ],
    loading: <p>Textarea has no loading state. If the device checks the text, say so on the unit’s display and keep the text where the person typed it.</p>,
    focus: <p>A field is not focused on page load, except the first field of a sheet that opens only to ask for it.</p>,
  },
  deepDive: { na: 'Textarea has a single variant, so there is no section per variant.' },
  modifiers: [
    {
      name: 'hint',
      rules: <p>A short line under the well that says what to write, such as a limit. One sentence at most.</p>,
      pair: { do: <Textarea label="Note" hint="Up to 200 characters." rows={2} />, doNote: 'The limit, in a few words.', dont: <Textarea label="Note" hint="This is the note that everyone in the home will see on the display of the unit, so write it with care." rows={2} />, dontNote: 'A paragraph where a line would do.' },
    },
    {
      name: 'error',
      rules: <p>Marks the field invalid and prints the problem under the well with a glyph. Say what to do. Show it after the person leaves the field or submits.</p>,
      pair: { do: <Textarea label="Note" rows={2} defaultValue="…" error="Write at least 10 characters." />, doNote: 'The fix, in words, with a glyph.', dont: <Textarea label="Note" rows={2} defaultValue="…" error="Invalid." />, dontNote: 'It says something is wrong but not what to do.' },
    },
  ],
  related: [['/components/input', 'Input', 'A short piece of text.'], ['/components/select', 'Select', 'A choice from a known list.'], ['/components/button', 'Button', 'The action that saves the note.']],
  references: [
    { title: 'WCAG 2.2 · 3.3.2 Labels or Instructions', url: 'https://www.w3.org/WAI/WCAG22/Understanding/labels-or-instructions.html', why: 'Why the label is printed and stays while typing.' },
    { title: 'WCAG 2.2 · 1.4.1 Use of Color', url: 'https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html', why: 'Why the error has a glyph and words as well as a red edge.' },
    { title: 'GOV.UK Design System · Textarea', url: 'https://design-system.service.gov.uk/components/textarea/', why: 'Labels above the field and error messages in words.' },
  ],
};
