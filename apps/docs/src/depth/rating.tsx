// Usage tab for Rating (component-depth.md U1–U14). Rating picks or shows a value from 1 to 5.
import { Rating } from 'dial-react';
import type { Depth } from './types';

const Unit = ({ children }: { children: React.ReactNode }) => <div className="demo-box demo-card">{children}</div>;

export const RATING: Depth = {
  overview: (
    <>
      <p>Rating asks for, or shows, a score from 1 to 5 on a short scale. Each mark is a small lattice of round dots: a lit mark is a solid disc and an empty mark is a hollow ring, so the value is read from the shape and does not depend on colour.</p>
      <p>It has two modes. In pick mode it is a radio group, so the arrow keys walk the marks. In display mode (<code>readOnly</code>) it only shows a value, and halves such as 3.5 are allowed there.</p>
    </>
  ),
  whenToUse: ['To ask for a score from 1 to 5, such as how quiet the washer was.', 'To show an average score in a list or a card.'],
  whenNot: [
    { situation: 'Choosing one of several named options', to: '/components/radio', label: 'Radio' },
    { situation: 'Showing how far a task has got', to: '/components/progress', label: 'Progress' },
    { situation: 'Picking a number on a long range', to: '/components/slider', label: 'Slider' },
  ],
  variants: { na: 'Rating has one look, a row of dot lattices. Pick and display are modes set by readOnly, covered under Modifiers.' },
  anatomy: {
    render: <Rating label="Comfort" defaultValue={3} />,
    parts: [
      { part: 'Label', selector: '[data-component="Rating"] > span', what: 'The printed name of the rating, above the marks.' },
      { part: 'Mark', selector: '[data-component="Rating"] label', what: 'One choice: a 24px lattice inside a 44px target.' },
      { part: 'Value', selector: '[data-component="Rating"] > div > span:last-child', what: 'The chosen number over the maximum, in tabular figures.' },
    ],
  },
  sizes: { na: 'Rating has one size. A mark draws at 24px inside a 44px target; display mode draws at 20px.' },
  emphasis: { na: 'A lit mark is told by shape and primary ink. Nothing in a Rating is orange.' },
  placement: {
    rows: [['In a feedback form', 'Stand the Rating under its question, with the orange key under the form.'], ['In a list row', 'Use readOnly with the value hidden, and put the number in the row text.']],
    examples: [{ title: 'Display mode in a card', render: <Unit><Rating label="Average sound score" readOnly value={3.5} /></Unit> }],
  },
  combinations: {
    good: [['Rating + Textarea', 'A score first, then a free note under it.'], ['Rating + Button', 'The orange key that sends the answer comes after the Rating.']],
    avoid: [{ title: 'two Ratings for one question', why: 'Two rows of marks ask the same thing twice. Use one.', render: <Unit><Rating label="Comfort" defaultValue={3} /><Rating label="Comfort again" defaultValue={3} /></Unit> }],
  },
  content: {
    formula: <p>Name the Rating with the question it answers, as in <em>How quiet was the washer?</em> Do not write “out of 5” in the label, because the value is printed beside the marks.</p>,
    pair: {
      do: <Rating label="How quiet was the washer?" defaultValue={4} />, doNote: 'A question, and the value is printed for you.',
      dont: <Rating label="Rate from 1 to 5 stars" defaultValue={4} />, dontNote: 'The scale is spelled out twice, and there are no stars.',
    },
    overflow: { text: 'A long label wraps above the marks. The marks stay on one line and keep their 44px targets.', render: <div style={{ maxInlineSize: 'calc(var(--ds-control-key) * 5)' }}><Rating label="How quiet was the washer during the spin cycle at night?" defaultValue={2} /></div> },
    rtl: { text: 'In right-to-left languages the first mark sits on the right. A half mark mirrors so its lit half stays at the start.', render: <div dir="rtl"><Rating label="الراحة" defaultValue={3} /></div> },
    expansion: { text: 'German and Finnish labels can run 30% longer. They wrap and the marks do not move.', render: <Rating label="Wie leise war die Waschmaschine?" defaultValue={3} /> },
  },
  behaviours: {
    states: [
      ['Empty', 'A hollow ring of dots in secondary ink.', 'Announced as its number, not checked.'],
      ['Lit', 'A solid disc of dots in primary ink.', 'The chosen mark is announced as checked.'],
      ['Half', 'A disc on the start side and a ring on the other. Display mode only.', 'The image is named with its value.'],
      ['Disabled', 'Half-strength ink; marks cannot be chosen.', 'Announced as unavailable.'],
    ],
    interactions: [
      ['Keyboard', 'Arrow keys', 'Walk to the next or previous mark and choose it.', 'native radio'],
      ['Keyboard', 'Home, End', 'Choose the first or the last mark.', 'Rating'],
      ['Keyboard', 'Tab', 'Moves into the group at the chosen mark, or the first one if none is chosen.', 'native'],
      ['Pointer', 'Press a mark', 'Chooses it and every mark before it lights.', 'native radio'],
    ],
    loading: <p>Rating has no loading state.</p>,
    focus: <p>One mark takes focus at a time. The focus ring is drawn around the 44px target of the mark.</p>,
  },
  deepDive: { na: 'Rating has a single variant, so there is no section per variant.' },
  modifiers: [
    {
      name: 'readOnly',
      rules: <p>Use <code>readOnly</code> to show a value that nobody can change. It takes halves, draws smaller marks and is read out as one image named with the value.</p>,
      pair: { do: <Rating label="Average sound score" readOnly value={3.5} />, doNote: 'A shown average, halves allowed.', dont: <Rating label="Your score" readOnly value={3} />, dontNote: 'Read-only for a score the person is meant to give.' },
    },
  ],
  related: [['/components/radio', 'Radio', 'Choosing one named option.'], ['/components/slider', 'Slider', 'Picking a number on a range.'], ['/components/progress', 'Progress', 'How far a task has got.']],
  references: [
    { title: 'WAI-ARIA · radiogroup role', url: 'https://www.w3.org/TR/wai-aria-1.2/#radiogroup', why: 'The pattern pick mode follows.' },
    { title: 'WCAG 2.2 · 1.4.1 Use of Color', url: 'https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html', why: 'Why lit and empty differ by shape and not by colour alone.' },
    { title: 'WCAG 2.2 · 2.5.8 Target Size (Minimum)', url: 'https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html', why: 'Why each mark is a 44px target.' },
  ],
};
