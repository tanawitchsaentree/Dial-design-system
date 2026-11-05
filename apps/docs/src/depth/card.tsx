// Usage tab for Card (component-depth.md U1–U14). Card is the body of a unit: one rounded case of matte plastic.
import { Button, Card, Display, Heading, Stack, Text } from 'dial-react';
import type { Depth } from './types';

const W = ({ children, o, w = 300 }: { children: React.ReactNode; o?: boolean; w?: number }) => <div data-overflow-demo={o ? '' : undefined} style={{ inlineSize: w }}>{children}</div>;

export const CARD: Depth = {
  overview: (
    <>
      <p>Card is the body of a unit. It is one rounded case of the same warm plastic as the keys on it, lit from the top left, with a short shadow down and to the right. Content sits straight on the case at one even inset.</p>
      <p>The corner follows the card’s short side. It is 0.16 of that side, and never more than 28px. A small card gets a small corner and a large panel keeps a firm one. The card also hands its corner and inset to a window inside it, so the window’s corner nests.</p>
    </>
  ),
  whenToUse: ['To hold one device, one room or one topic as a unit on a screen.', 'To group a short state line with the keys that act on it.', 'As the body of a list of rooms or devices.'],
  whenNot: [
    { situation: 'A whole appliance with its display, knob and keys', to: '/components/device-card', label: 'DeviceCard' },
    { situation: 'Only spacing between blocks, with no body', to: '/components/stack', label: 'Stack' },
    { situation: 'Columns that place several cards side by side', to: '/components/grid', label: 'Grid' },
  ],
  variants: { na: 'Card has no variant prop. Every card is the same plastic body, so units look alike wherever they appear.' },
  anatomy: {
    render: (
      <W>
        <Card header={<Heading level={3}>Washer</Heading>} footer={<Button kind="primary">Start wash</Button>} wordmark="dial" model="wash 1">
          <Text tone="secondary">Cotton 40 °C, ready at 18:20.</Text>
        </Card>
      </W>
    ),
    parts: [
      { part: 'Body', selector: '[data-component="Card"]', what: 'The plastic case. Its corner is 0.16 of the short side, at most 28px.' },
      { part: 'Header', selector: '[data-component="Card"] > div:first-child', what: 'An optional title row on the top inset line.' },
      { part: 'Content', selector: '[data-component="Card"] > div:nth-child(2)', what: 'The children, in one column with an even gap.' },
      { part: 'Footer', selector: '[data-component="Card"] > div:nth-child(3)', what: 'An optional row of keys near the bottom.' },
      { part: 'Printing', selector: '[data-component="Card"] > div:last-child', what: 'The wordmark bottom-left and the model bottom-right.' },
    ],
  },
  sizes: { na: 'Card has no size prop. Its width comes from the layout it sits in, and padding sets the inset.' },
  emphasis: {
    text: <p>A card holds at most one orange part, the key or knob the unit exists for. A screen of cards keeps one orange part in each card, never several in one.</p>,
    pair: {
      do: <W w={280}><Card footer={<><Button kind="primary">Start</Button><Button>Schedule</Button></>}><Text>Washer · ready</Text></Card></W>,
      doNote: 'One orange key in the card.',
      dont: <W w={280}><Card footer={<><Button kind="primary">Start</Button><Button kind="primary">Schedule</Button></>}><Text>Washer · ready</Text></Card></W>,
      dontNote: 'Two orange keys in one card, and neither reads as the main one.',
    },
  },
  placement: {
    rows: [['A grid of rooms or devices', 'One card per unit, all the same width in a column.'], ['A list', 'Small cards with padding sm, one per row.'], ['A page section', 'A large card with padding lg around a few lines of text.']],
    examples: [
      { title: 'A grid of two cards', render: <Stack direction="row" gap="lg"><W w={220}><Card><Text>Kitchen · 20 °C</Text></Card></W><W w={220}><Card><Text>Hallway · 18 °C</Text></Card></W></Stack> },
      { title: 'A list of small cards', render: <Stack gap="md" style={{ inlineSize: 'min(100%, var(--ds-layout-frame-sm))' }}><Card padding="sm"><Text>Living room · on</Text></Card><Card padding="sm"><Text>Bedroom · off</Text></Card></Stack> },
    ],
  },
  combinations: {
    good: [['Card + Display', 'A window that says the state, with its corner nested in the card.'], ['Card + Heading + Text', 'A titled unit with a line of state.'], ['Card + Button', 'One orange key for the main action, plastic keys beside it.']],
    avoid: [{ title: 'a card inside a card', why: 'Two plastic bodies stacked add a second shadow and a second corner. Use gaps inside one card.', render: <W><Card><Card padding="sm"><Text>Inner card</Text></Card></Card></W> }],
  },
  content: {
    formula: <p>A title that names the room or device, then one short line of state. For example, <em>Washer</em>, then <em>Cotton 40 °C, ready at 18:20</em>. Sentence case. Print the model in lowercase.</p>,
    pair: {
      do: <W w={260}><Card header={<Heading level={4}>Kitchen lamp</Heading>}><Text tone="secondary">On, 70 %</Text></Card></W>,
      doNote: 'A name and the state.',
      dont: <W w={260}><Card header={<Heading level={4}>Device 3</Heading>}><Text tone="secondary">Status: OK</Text></Card></W>,
      dontNote: 'A number and a word that say nothing about the device.',
    },
    overflow: { text: 'Long text wraps inside the inset and the card grows taller. The corner stays the same, because it follows the short side.', render: <W o w={220}><Card><Text>The dishwasher in the downstairs kitchen finished its eco programme at 14:05.</Text></Card></W> },
    rtl: { text: 'In right-to-left languages the wordmark moves to the bottom right and the model to the bottom left.', render: <div dir="rtl"><W w={260}><Card wordmark="dial" model="wash 1"><Text>الغسالة جاهزة</Text></Card></W></div> },
    expansion: { text: 'German and Finnish run about 30% longer. Titles wrap and the card grows taller.', render: <W w={260}><Card header={<Heading level={4}>Waschmaschine Badezimmer</Heading>}><Text tone="secondary">Fertig um 18:20</Text></Card></W> },
  },
  behaviours: {
    states: [
      ['Rest', 'The body sits 3px above the page with a short shadow down and to the right.', 'It has no hover, press or selected state.'],
      ['Resized', 'The corner and the unit inset follow the new short side.', 'The layout inside does not reflow between states.'],
    ],
    interactions: [
      ['Keyboard', 'Tab', 'Moves through the keys inside the card. The card itself is not a stop.', 'not focusable'],
      ['Pointer', 'Click on the body', 'Nothing happens. Only the parts on it act.', 'none'],
      ['Screen reader', 'Read', 'Read as its element, so it is a group, a region with a name, an article or a list item.', 'as + aria-label'],
    ],
    loading: <p>Card has no loading state. While a device answers, the state line or the display inside the card says so.</p>,
    focus: <p>Card never takes focus. Focus goes to the first control inside it, in source order.</p>,
  },
  deepDive: { na: 'Card has no variant prop, so there is nothing to compare one variant against.' },
  modifiers: [
    {
      name: 'padding',
      rules: <p>sm for small cards in a list, md (the default) for most cards, lg for a large panel, unit to follow the short side like a device body.</p>,
      pair: { do: <W w={280}><Card padding="sm"><Text>Bedroom · off</Text></Card></W>, doNote: 'sm in a list of one-line cards.', dont: <W w={280}><Card padding="lg"><Text>Bedroom · off</Text></Card></W>, dontNote: 'lg around one line wastes the screen.' },
    },
    {
      name: 'header',
      rules: <p>A title row on the top inset line. Put a Heading in it, and a short Text or one key at its end.</p>,
      pair: { do: <W w={280}><Card header={<Heading level={4}>Kitchen</Heading>}><Text tone="secondary">3 lamps</Text></Card></W>, doNote: 'A heading names the card.', dont: <W w={280}><Card header={<><Button>Edit</Button><Button>Share</Button><Button>More</Button></>}><Text tone="secondary">3 lamps</Text></Card></W>, dontNote: 'A row of keys in the header with no name.' },
    },
    {
      name: 'footer',
      rules: <p>A row of keys near the bottom, where the hand expects them. One of them may be orange.</p>,
      pair: { do: <W w={280}><Card footer={<Button kind="primary">Pause</Button>}><Text>Washer · 38 min</Text></Card></W>, doNote: 'The main key at the bottom.', dont: <W w={280}><Card header={<Button kind="primary">Pause</Button>}><Text>Washer · 38 min</Text></Card></W>, dontNote: 'The main key above the state it acts on.' },
    },
    {
      name: 'wordmark and model',
      rules: <p>Printing on the bottom inset line. The model is set in lowercase and is never the only name of the card, so give the card a heading or an aria-label too.</p>,
      pair: { do: <W w={280}><Card wordmark="dial" model="wash 1"><Heading level={4}>Washer</Heading></Card></W>, doNote: 'A heading names it; the model is printing.', dont: <W w={280}><Card wordmark="dial" model="wash 1"><Text>38 min</Text></Card></W>, dontNote: 'Only the model says which device this is.' },
    },
    {
      name: 'nested window',
      rules: <p>A Display inside a card reads the card’s corner and inset, so its own corner is the outer corner minus the inset.</p>,
      pair: { do: <W w={280}><Card padding="unit"><Display label="Washer" value="38" unit="min" digits={3} /></Card></W>, doNote: 'The window nests in the card.', dont: <W w={280}><Card padding="unit"><div className="demo-box">A box with its own 20px corner</div></Card></W>, dontNote: 'A box with a fixed corner that does not nest.' },
    },
  ],
  related: [['/components/device-card', 'DeviceCard', 'The unit is a whole appliance.'], ['/components/stack', 'Stack', 'Only spacing, no body.'], ['/components/display', 'Display', 'A window that says the state, inside a card.']],
  references: [
    { title: 'WAI-ARIA Authoring Practices · Landmark regions', url: 'https://www.w3.org/WAI/ARIA/apg/practices/landmark-regions/', why: 'When a card as section needs a name.' },
    { title: 'WCAG 2.2 · 1.4.11 Non-text Contrast', url: 'https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html', why: 'Why the parts on a card keep 3:1 edges.' },
    { title: 'Dieter Rams, ten principles for good design (Vitsœ)', url: 'https://www.vitsoe.com/gb/about/good-design', why: 'The source of dial’s principles.' },
  ],
};
