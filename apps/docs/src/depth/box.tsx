// Usage tab for Box (component-depth.md U1–U14). Box sets the inset, ground and corner of a block.
import { Box, Stack } from 'dial-react';
import type { Depth } from './types';

const Line = ({ children }: { children: React.ReactNode }) => <p className="flush">{children}</p>;

export const BOX: Depth = {
  overview: (
    <>
      <p>Box is a plain block. You choose its inset from six steps, and if you want, a ground and a corner from short lists. With none of these it adds nothing to the page.</p>
      <p>Use it where a unit needs a space around its content and no component already gives it one. It has no size or position of its own, so it never moves between states.</p>
    </>
  ),
  whenToUse: ['To give content an inset from the token steps.', 'To put a ground and a corner behind a group of parts.', 'To render a section, a list or a list item that needs the same inset.'],
  whenNot: [
    { situation: 'Spacing between siblings', to: '/components/stack', label: 'Stack' },
    { situation: 'A page of units held to a width', to: '/components/container', label: 'Container' },
    { situation: 'A card with its own look', to: '/components/card', label: 'Card' },
  ],
  variants: { na: 'Box has no variants. It has an inset, a ground and a corner, each covered under Modifiers.' },
  anatomy: {
    render: <Box padding="lg" surface="raised" corner="panel"><Line>Content</Line></Box>,
    parts: [
      { part: 'Box', selector: '[data-component="Box"]', what: 'The block. Its padding, ground and corner come from tokens.' },
      { part: 'Content', selector: '[data-component="Box"] > p', what: 'Whatever you put inside, standing at the inset.' },
    ],
  },
  sizes: { na: 'Box has no size. Its inset is the padding prop, covered under Modifiers.' },
  emphasis: { na: 'Box is never loud. It has no ink of its own and nothing in it is orange.' },
  placement: {
    rows: [['Around a group of parts', 'A raised box with the lg inset puts the group on the body inset line.'], ['Behind a display or tray', 'A sunken box with the md inset reads as a recess.']],
    examples: [{ title: 'A recess behind a row of keys', render: <Box padding="md" surface="sunken" corner="inner"><Stack direction="row" gap="sm"><span className="demo-chip">Heat</span><span className="demo-chip">Fan</span></Stack></Box> }],
  },
  combinations: {
    good: [['Box + Stack', 'The box sets the inset and the stack sets the gaps inside it.'], ['Box + Container', 'The container holds the page width and boxes hold the units.']],
    avoid: [{ title: 'a Box inside a Card', why: 'The card already has its inset and ground. A second ground shows as an unwanted band.', render: <Box padding="md" surface="raised" corner="inner"><Box padding="md" surface="raised" corner="inner"><Line>Inside</Line></Box></Box> }],
  },
  content: {
    formula: <p>Box holds no text of its own. Put a heading and a line in it, and let the inset keep both off the edge.</p>,
    pair: {
      do: <Box padding="md" surface="raised" corner="inner"><Line>Living room</Line></Box>, doNote: 'The inset comes from a step.',
      dont: <Box padding="md" surface="raised" corner="inner"><Box padding="xl"><Line>Living room</Line></Box></Box>, dontNote: 'Two insets stack and the text drifts from the edge.',
    },
    overflow: { text: 'A long word wraps inside the inset. The box grows in height and keeps its width.', render: <Box padding="md" surface="sunken" corner="inner"><Line>Configuration of the heating schedule for the whole of the upstairs rooms</Line></Box> },
    rtl: { text: 'Padding is the same on all sides, so nothing flips. The content inside follows the page direction.', render: <div dir="rtl"><Box padding="md" surface="sunken" corner="inner"><Line>غرفة المعيشة</Line></Box></div> },
    expansion: { text: 'German and Finnish text can run 30% longer. The box grows in height and the inset stays.', render: <Box padding="md" surface="sunken" corner="inner"><Line>Allgemeine Einstellungen</Line></Box> },
  },
  behaviours: {
    states: [['Default', 'The chosen padding, ground and corner.', 'Announced as its element, with no role of its own.']],
    interactions: [['Keyboard', 'Tab', 'A Box takes no focus. Children keep their own order.', 'native']],
    loading: <p>Box has no loading state.</p>,
    focus: <p>Box never takes or moves focus.</p>,
  },
  deepDive: { na: 'Box has no variant, so there is no section per variant.' },
  modifiers: [
    {
      name: 'padding',
      rules: <p>Choose from <code>none</code>, <code>xs</code>, <code>sm</code>, <code>md</code>, <code>lg</code> and <code>xl</code>. Use lg for the body inset of a unit.</p>,
      pair: { do: <Box padding="lg" surface="sunken" corner="inner"><Line>Stepped inset</Line></Box>, doNote: 'A named step.', dont: <Box surface="sunken" corner="inner"><Line>No inset</Line></Box>, dontNote: 'Text touches the edge of the ground.' },
    },
    {
      name: 'surface',
      rules: <p><code>page</code>, <code>raised</code> or <code>sunken</code>. The grounds differ from each other by a small step, so do not rely on the ground alone to mark a boundary.</p>,
      pair: { do: <Box padding="md" surface="sunken" corner="inner"><Line>A recess</Line></Box>, doNote: 'Sunken for a recess.', dont: <Box padding="md" surface="raised" corner="inner"><Line>A recess</Line></Box>, dontNote: 'Raised reads as a body, not a window.' },
    },
    {
      name: 'corner',
      rules: <p><code>mark</code>, <code>media</code>, <code>inner</code> or <code>panel</code>. A box inside another takes a smaller corner than its parent.</p>,
      pair: { do: <Box padding="sm" surface="raised" corner="panel"><Box padding="md" surface="sunken" corner="inner"><Line>Nested</Line></Box></Box>, doNote: 'Inner is smaller than panel.', dont: <Box padding="sm" surface="raised" corner="inner"><Box padding="md" surface="sunken" corner="panel"><Line>Nested</Line></Box></Box>, dontNote: 'The inner corner is bigger than the outer.' },
    },
  ],
  related: [['/components/stack', 'Stack', 'Spacing between siblings.'], ['/components/container', 'Container', 'A page held to a width.'], ['/components/card', 'Card', 'A block with a look of its own.']],
  references: [
    { title: 'MDN · box-sizing', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/box-sizing', why: 'Why the inset is inside the box width.' },
    { title: 'MDN · CSS logical properties', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_logical_properties_and_values', why: 'Why nothing in Box flips under right-to-left.' },
  ],
};
