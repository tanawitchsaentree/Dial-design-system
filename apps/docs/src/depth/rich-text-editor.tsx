// Usage tab for RichTextEditor (component-depth.md U1–U14). RichTextEditor is a note field with formatting keys.
import { RichTextEditor, Textarea } from 'dial-react';
import type { Depth } from './types';

const note = '<h2>Heating</h2><p>Keep the <strong>hall</strong> at 18 until <em>Friday</em>.</p><ul><li>Check the valves</li><li>Bleed the radiators</li></ul>';
const Unit = ({ children }: { children: React.ReactNode }) => <div className="demo-box demo-card"><div style={{ inlineSize: 'var(--ds-layout-frame-md)', maxInlineSize: '100%' }}>{children}</div></div>;

export const RICH_TEXT_EDITOR: Depth = {
  overview: (
    <>
      <p>RichTextEditor is for a note a person writes with a little structure: a bold word, a link, a short list or a heading. Six round keys sit above a recessed well. The well is the same window as Input and Textarea, so writing still reads as cut into the body.</p>
      <p>It reports plain HTML text, cleaned by a small whitelist: paragraphs, one heading level, bold, italic, links, and bulleted and numbered lists. It is not a page builder. Anything past that list is dropped on purpose, so what you store is something you can print back safely.</p>
    </>
  ),
  whenToUse: ['To write a note, a message or a description that needs bold, links or a list.', 'To store the result as a short HTML string.'],
  whenNot: [
    { situation: 'Plain text of several lines', to: '/components/textarea', label: 'Textarea' },
    { situation: 'One short value corrected in place', to: '/components/editable', label: 'Editable' },
    { situation: 'A list of separate short tags', to: '/components/tag-input', label: 'TagInput' },
  ],
  variants: { na: 'RichTextEditor has one look: keys above a well. The states are props, covered under Modifiers.' },
  anatomy: {
    render: <RichTextEditor label="Notes" defaultValue={note} hint="Select a word and press a key." />,
    parts: [
      { part: 'Label', selector: '[data-component="RichTextEditor"] > span:first-child', what: 'The printed name above the keys. It also names the writing area.' },
      { part: 'Toolbar', selector: '[data-component="RichTextEditor"] [role="toolbar"]', what: 'Six 44px round keys. The row is one Tab stop; arrow keys move along it.' },
      { part: 'Latched key', selector: '[data-component="RichTextEditor"] [aria-pressed="true"]', what: 'A key whose format is on at the caret drops and turns to frosted glass.' },
      { part: 'Well', selector: '[data-component="RichTextEditor"] [role="textbox"]', what: 'The recessed writing area. It grows with the text.' },
      { part: 'Hint', selector: '[data-component="RichTextEditor"] > p', what: 'A short line under the well that says what to write.' },
    ],
  },
  sizes: { na: 'RichTextEditor has one size. The keys are 44px and the well grows with its text from about four lines.' },
  emphasis: { na: 'Nothing in RichTextEditor is orange. The latched key is glass, and a form around it keeps its one orange key.' },
  placement: {
    rows: [['In a form or sheet', 'Full width of the column, above the orange key that sends it.'], ['Beside other fields', 'Give it its own row; it is too wide to share one.']],
    examples: [{ title: 'In a form', render: <Unit><RichTextEditor label="Handover note" defaultValue="<p>The spare key is under the <em>blue</em> pot.</p>" /></Unit> }],
  },
  combinations: {
    good: [['RichTextEditor + Button', 'The orange key that sends the note sits under the well.'], ['RichTextEditor + HelperText', 'Say what the note is for in the hint.']],
    avoid: [{ title: 'a RichTextEditor for one word', why: 'Six keys for a single word is a lot of printing. Use Input.', render: <Unit><RichTextEditor label="Room name" defaultValue="<p>Kitchen</p>" /></Unit> }],
  },
  content: {
    formula: <p>Name the note with a noun, as in <em>Handover note</em>. Use the hint for what to put in it, not for how to use the keys.</p>,
    pair: {
      do: <Unit><RichTextEditor label="Handover note" hint="What the sitter needs to know." /></Unit>, doNote: 'A noun, and the hint says what to write.',
      dont: <Unit><RichTextEditor label="Type here" /></Unit>, dontNote: 'The label says nothing about the content.',
    },
    overflow: { text: 'Long lines wrap in the well and the well grows. The keys wrap to a second row on a very narrow screen.', render: <Unit><RichTextEditor label="Notes" defaultValue="<p>Averyveryveryverylongwordwithoutanybreaksinitatallthatmustwrapinsidethewell and then some more text after it.</p>" /></Unit> },
    rtl: { text: 'In right-to-left languages the keys start on the right and the arrows move the other way.', render: <div dir="rtl"><Unit><RichTextEditor label="ملاحظات" defaultValue="<p>اترك التدفئة على <strong>18</strong> درجة.</p>" /></Unit></div> },
    expansion: { text: 'German and Finnish words can run 30% longer. The keys wrap and the well does not move.', render: <Unit><RichTextEditor label="Übergabenotiz" defaultValue="<p>Heizung im Flur auf <strong>18 Grad</strong> lassen.</p>" /></Unit> },
  },
  behaviours: {
    states: [
      ['Empty', 'The prompt in secondary ink.', 'The prompt is the area’s placeholder.'],
      ['Latched key', 'The key drops and turns to glass.', 'The key is pressed (aria-pressed).'],
      ['Focus', 'The ring on the well, or on the key.', 'The writing area is a multi-line textbox.'],
      ['Invalid', 'Critical red edge, a glyph and the message.', 'The area is marked invalid and described by the message.'],
      ['Read-only', 'Full ink, no keys.', 'The area is read-only.'],
      ['Disabled', 'Half ink, keys off.', 'The keys and the area are disabled.'],
    ],
    interactions: [
      ['Keyboard', 'Tab', 'Reaches the toolbar as one stop, then the writing area.', 'native'],
      ['Keyboard', 'Arrow keys, Home, End', 'Move along the keys; the arrows follow the reading direction.', 'toolbar'],
      ['Keyboard', 'Ctrl or Command + B, I, K', 'Bold, italic and the link field, from inside the text.', 'aria-keyshortcuts'],
      ['Pointer', 'Press a key', 'Keeps the caret and the selection where they were.', 'mousedown'],
      ['Clipboard', 'Paste', 'Keeps the whitelist and drops everything else.', 'sanitiser'],
    ],
    loading: <p>RichTextEditor has no loading state.</p>,
    focus: <p>Focus stays in the writing area after a key is pressed. The link field takes focus when it opens and gives it back on Enter, Cancel or Escape.</p>,
  },
  deepDive: { na: 'RichTextEditor has a single look, so there is no section per variant.' },
  modifiers: [
    {
      name: 'readOnly',
      rules: <p>Prints the note at full ink with no keys. Use it for a note someone else wrote. Use <code>disabled</code> only when the field is unavailable for now.</p>,
      pair: { do: <Unit><RichTextEditor label="Filed note" readOnly defaultValue="<p>Filed on <strong>3 November</strong>.</p>" /></Unit>, doNote: 'A reading, at full ink.', dont: <Unit><RichTextEditor label="Filed note" disabled defaultValue="<p>Filed on <strong>3 November</strong>.</p>" /></Unit>, dontNote: 'Half ink makes a finished note look unavailable.' },
    },
    {
      name: 'error',
      rules: <p>Set it from your own check, for example when the note is empty. The message is printed under the well with a glyph.</p>,
      pair: { do: <Unit><RichTextEditor label="Handover note" error="Write at least one line." /></Unit>, doNote: 'The message says what to do.', dont: <Unit><Textarea label="Handover note" error="Invalid." /></Unit>, dontNote: 'The message names nothing.' },
    },
  ],
  related: [['/components/textarea', 'Textarea', 'Plain text of several lines.'], ['/components/editable', 'Editable', 'One short value corrected in place.'], ['/components/input', 'Input', 'One line of text.']],
  references: [
    { title: 'WAI-ARIA Authoring Practices · Toolbar pattern', url: 'https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/', why: 'One tab stop and arrow keys between the keys.' },
    { title: 'Input Events Level 2 · beforeinput', url: 'https://www.w3.org/TR/input-events-2/', why: 'How browser formatting requests reach the editor.' },
    { title: 'OWASP · XSS Prevention Cheat Sheet', url: 'https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html', why: 'Why the HTML is cleaned against a whitelist.' },
  ],
};
