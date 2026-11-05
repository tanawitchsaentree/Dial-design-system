// Usage tab for HelperText (component-depth.md U1–U14). HelperText is the line printed under a part.
import { HelperText, Input, Stack } from 'dial-react';
import type { Depth } from './types';

const Unit = ({ children }: { children: React.ReactNode }) => <div className="demo-box demo-card">{children}</div>;
const field = (id: string, tone: 'neutral' | 'error', text: string) => (
  <Stack gap="sm">
    <Input label="Target temperature" defaultValue={tone === 'error' ? '42' : '21'} unit="°C" aria-invalid={tone === 'error' ? true : undefined} aria-describedby={id} />
    <HelperText id={id} tone={tone}>{text}</HelperText>
  </Stack>
);

export const HELPER_TEXT: Depth = {
  overview: (
    <>
      <p>HelperText is the small line printed under a part. It says what to enter, such as a range or a format, or it says what went wrong. It carries an id so the part can point to it with aria-describedby, and a screen reader reads it after the part’s own name.</p>
      <p>An error is told by a dot-matrix glyph, medium weight and words, never by red alone. Input and Textarea already print their own hint and error; use HelperText for a part that has none, such as a Select, a Switch or a group.</p>
    </>
  ),
  whenToUse: ['To tell the person what a part expects before they use it.', 'To name the problem under a part that failed a check.'],
  whenNot: [
    { situation: 'A message about the whole unit, not one part', to: '/components/banner', label: 'Banner' },
    { situation: 'A short name for the part itself', to: '/components/label', label: 'Label' },
  ],
  variants: {
    neutral: { purpose: 'A hint in secondary ink, regular weight, with no glyph.', pairing: 'Any part that takes a value in a format or range.' },
    error: { purpose: 'The problem, in critical red and medium weight, with a glyph before the words.', pairing: 'A part marked invalid with aria-invalid.' },
  },
  anatomy: {
    render: field('ht-anatomy', 'error', 'Enter a value under 30.'),
    parts: [
      { part: 'Glyph', selector: '[data-component="HelperText"] > svg', what: 'The dot-matrix mark of an error, read out as Error.' },
      { part: 'Words', selector: '[data-component="HelperText"] > span', what: 'The message, in the caption size, wrapping beside the glyph.' },
    ],
  },
  sizes: { na: 'HelperText has one size, the caption size. It sits under a part of any size.' },
  emphasis: { na: 'HelperText is never loud. The error steps up by weight and a glyph, and nothing in it is orange.' },
  placement: {
    rows: [['Under the part', 'Print it directly below, in the same column, with the gap of one small step.'], ['Hint and error together', 'Show one at a time. The error replaces the hint.']],
    examples: [{ title: 'Under a field', render: <Unit>{field('ht-place', 'neutral', 'Between 5 and 30 degrees.')}</Unit> }],
  },
  combinations: {
    good: [['HelperText + Input', 'Point aria-describedby at the id, and set aria-invalid for an error.'], ['HelperText + Select', 'A hint under a Select that has none of its own.']],
    avoid: [{ title: 'a hint and an error at once', why: 'Two lines say two things and the person must read both. Replace the hint with the error.', render: <Unit><Stack gap="sm"><HelperText>Between 5 and 30 degrees.</HelperText><HelperText tone="error">Enter a value under 30.</HelperText></Stack></Unit> }],
  },
  content: {
    formula: <p>Say what to do, in one short sentence. For an error, name the problem and the fix: <em>Enter a value under 30.</em> Do not write “Error:” first, because the glyph is read as Error.</p>,
    pair: {
      do: <HelperText tone="error">Enter a value under 30.</HelperText>, doNote: 'The problem and the fix.',
      dont: <HelperText tone="error">Invalid input.</HelperText>, dontNote: 'It names neither.',
    },
    overflow: { text: 'A long message wraps beside the glyph and the glyph stays at the first line.', render: <HelperText tone="error">The heating schedule for the upstairs rooms overlaps with the night mode that starts at 23:00. Move one of them.</HelperText> },
    rtl: { text: 'In right-to-left languages the glyph moves to the right of the words.', render: <div dir="rtl"><HelperText tone="error">أدخل قيمة أقل من 30.</HelperText></div> },
    expansion: { text: 'German and Finnish lines can run 30% longer. They wrap and the part above does not move.', render: <HelperText tone="error">Geben Sie einen Wert unter 30 ein.</HelperText> },
  },
  behaviours: {
    states: [
      ['Neutral', 'Secondary ink, regular weight, no glyph.', 'Read after the part as its description.'],
      ['Error', 'Critical red, medium weight, a glyph before the words.', 'The glyph is read as Error, then the message.'],
    ],
    interactions: [
      ['Keyboard', 'Tab', 'HelperText takes no focus. The part it describes does.', 'native'],
      ['Screen reader', 'Read', 'Read as the part’s description through aria-describedby.', 'aria-describedby'],
    ],
    loading: <p>HelperText has no loading state.</p>,
    focus: <p>Focus is never moved to a HelperText. When a check fails, move focus to the part and let its description be read.</p>,
  },
  deepDive: {
    neutral: {
      purpose: <p>A neutral line says what the part expects, before the person gets it wrong.</p>,
      context: field('ht-dd-n', 'neutral', 'Between 5 and 30 degrees.'),
      practices: ['Give the format or range, not the part’s name again.', 'Keep it to one line where you can.'],
      pair: { do: <HelperText>Between 5 and 30 degrees.</HelperText>, doNote: 'A range the person can use.', dont: <HelperText>Temperature.</HelperText>, dontNote: 'It repeats the label.' },
    },
    error: {
      purpose: <p>An error names what failed and how to fix it, and it carries a glyph so red is not the only cue.</p>,
      context: field('ht-dd-e', 'error', 'Enter a value under 30.'),
      practices: ['Set aria-invalid on the part as well.', 'Replace the hint, do not stack under it.'],
      pair: { do: <HelperText tone="error">Enter a value under 30.</HelperText>, doNote: 'The fix is in the line.', dont: <HelperText tone="error">Wrong!</HelperText>, dontNote: 'It blames and does not help.' },
    },
  },
  modifiers: [
    {
      name: 'id',
      rules: <p>Pass the id and set the part’s <code>aria-describedby</code> to it. Without a matching id the line is only printed, not read with the part.</p>,
      pair: { do: field('ht-mod', 'neutral', 'Between 5 and 30 degrees.'), doNote: 'The field points at the line.', dont: <Stack gap="sm"><Input label="Target temperature" defaultValue="21" /><HelperText>Between 5 and 30 degrees.</HelperText></Stack>, dontNote: 'Nothing links them, so the hint is not read.' },
    },
  ],
  related: [['/components/input', 'Input', 'A field that prints its own hint and error.'], ['/components/banner', 'Banner', 'A message about the whole unit.'], ['/components/fieldset', 'Fieldset', 'A group of parts with one legend.']],
  references: [
    { title: 'WCAG 2.2 · 3.3.1 Error Identification', url: 'https://www.w3.org/WAI/WCAG22/Understanding/error-identification.html', why: 'The error is named in text.' },
    { title: 'WCAG 2.2 · 1.4.1 Use of Color', url: 'https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html', why: 'Why the error carries a glyph and weight.' },
    { title: 'WAI-ARIA · aria-describedby', url: 'https://www.w3.org/TR/wai-aria-1.2/#aria-describedby', why: 'How the line is read with the part.' },
  ],
};
