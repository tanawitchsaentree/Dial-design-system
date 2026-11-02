// Usage tab for Scrubber (component-depth.md U1–U14). Scrubber is the seekable position of a track.
import { Button, Progress, Scrubber, Stack } from 'dial-react';
import type { Depth } from './types';

const Unit = ({ children }: { children: React.ReactNode }) => <div className="demo-box demo-card">{children}</div>;
const CHAPTERS = [{ time: 0, label: 'Intro' }, { time: 41, label: 'Verse' }, { time: 106, label: 'Chorus' }, { time: 180, label: 'Outro' }];

export const SCRUBBER: Depth = {
  overview: (
    <>
      <p>Scrubber shows where a track or a video is, and lets the person move there. It is the fader of a tape deck. A plastic cap rides the narrow groove, the elapsed time is printed under the start and the remaining time under the end. The arrow keys move five seconds, Page Up and Page Down thirty.</p>
      <p>Chapter starts are printed as ink marks above the groove. The stretch that has loaded is a thin ink line along the groove floor. Nothing fills behind the cap and nothing is orange, because the play key is the loud part of a player.</p>
    </>
  ),
  whenToUse: [
    'To show and change the position in a track, a podcast or a video.',
    'When the person needs the elapsed and the remaining time at a glance.',
    'Next to the transport keys of a player, under the title.',
  ],
  whenNot: [
    { situation: 'How far a device task has run, such as a wash cycle', to: '/components/progress', label: 'Progress' },
    { situation: 'An amount the person sets, such as volume', to: '/components/slider', label: 'Slider' },
    { situation: 'A level that is read and never set', to: '/components/meter', label: 'Meter' },
  ],
  variants: { na: 'Scrubber has one look, a plastic cap in a recessed groove with the times under it. Buffered and chapters are options, covered under Modifiers.' },
  anatomy: {
    render: <Scrubber label="Ruhe, side A" duration={225} defaultValue={120} buffered={170} chapters={CHAPTERS} />,
    parts: [
      { part: 'Label', selector: '[data-component="Scrubber"] > div:first-child > span', what: 'What is playing, printed above the start of the groove. It is the accessible name.' },
      { part: 'Chapter marks', selector: '[data-component="Scrubber"] [role="slider"] > div:first-child', what: 'One ink mark above the groove where each chapter starts.' },
      { part: 'Groove', selector: '[data-component="Scrubber"] [role="slider"] > div:nth-child(2)', what: 'A narrow slot recessed into the body. The light falls into it from the top left.' },
      { part: 'Buffered', selector: '[data-component="Scrubber"] [role="slider"] > div:nth-child(2) > span', what: 'The loaded stretch, a thin ink line along the groove floor.' },
      { part: 'Cap', selector: '[data-component="Scrubber"] [role="slider"] > div:last-child', what: 'A raised plastic cap with one ink line, at the current position.' },
      { part: 'Times', selector: '[data-component="Scrubber"] > div:last-child', what: 'Elapsed under the start and remaining under the end, with tabular figures.' },
    ],
  },
  sizes: { na: 'Scrubber has one size. The track is 44px tall and as long as its column, and never shorter than 220px.' },
  emphasis: {
    text: <p>The scrubber is quiet. The play key is the one orange part of a player, and the scrubber sits above it in plastic and ink.</p>,
    pair: {
      do: <Unit><Stack gap="md"><Scrubber label="Ruhe, side A" duration={225} defaultValue={83} /><Button kind="primary">Play</Button></Stack></Unit>,
      doNote: 'The play key is orange and the scrubber stays plastic.',
      dont: <Unit><Stack gap="md"><Progress label="Ruhe, side A" value={83} max={225} valueText="1:23 of 3:45" /><Button kind="primary">Play</Button></Stack></Unit>,
      dontNote: 'A filling Progress bar for a track. It cannot be moved and reads as a task.',
    },
  },
  placement: {
    rows: [['Under the title in a player unit', 'The usual place, between what is playing and the transport keys.'], ['A row in a list of episodes', 'A scrubber per row only for the one that is playing.']],
    examples: [{ title: 'In a player unit', render: <Unit><Stack gap="md"><Scrubber label="Morning show" duration={3300} defaultValue={1210} buffered={1500} /><Button kind="primary">Pause</Button></Stack></Unit> }],
  },
  combinations: {
    good: [['Scrubber + Button', 'The position above the orange play key.'], ['Scrubber + IconButton', 'Skip back and skip forward keys beside the play key.']],
    avoid: [{ title: 'a scrubber for a device task', why: 'A wash cycle cannot be moved to a later minute. Progress shows how far it has run.', render: <Unit><Scrubber label="Cotton 40°" duration={5400} defaultValue={2400} /></Unit> }],
  },
  content: {
    formula: <p>Use what is playing as the label, such as the track and side or the episode title. The times are printed by the scrubber itself, so the label carries no time.</p>,
    pair: {
      do: <Scrubber label="Ruhe, side A" duration={225} defaultValue={83} />, doNote: 'The label says what is playing.',
      dont: <Scrubber label="Seek position (drag to scrub)" duration={225} defaultValue={83} />, dontNote: 'An instruction as the label, and nothing about the track.',
    },
    overflow: { text: 'A long title wraps above the groove. The times stay under the two ends and the track keeps its length.', render: <div data-overflow-demo="" style={{ inlineSize: 240 }}><Scrubber label="The long interview with the designer of the radio, part two" duration={3725} defaultValue={600} /></div> },
    rtl: { text: 'In right-to-left languages the groove starts on the right. The elapsed time is under the right end and the arrow keys follow the groove.', render: <div dir="rtl"><Scrubber label="نشرة الأخبار" duration={1260} defaultValue={240} buffered={600} /></div> },
    expansion: { text: 'German and Finnish titles can run 30% longer. The title wraps and the groove does not change.', render: <Scrubber label="Abendnachrichten mit Wetterbericht" duration={1260} defaultValue={240} /> },
  },
  behaviours: {
    states: [
      ['Playing', 'The cap steps along the groove with the time.', 'It does not spring, because playback is not a hand moving it.'],
      ['Hover', 'The ink line on the cap darkens one step.', 'The cap never lifts or grows.'],
      ['Dragging', 'The cap follows the pointer along the groove.', 'The times change as it moves.'],
      ['Seek by key', 'The cap travels to the new position on the spring, in about 245ms.', 'With reduced motion it jumps there at once.'],
      ['Focus', 'A dark 2px ring around the whole track.', 'The same ring as on every part.'],
      ['Disabled', 'With nothing loaded the cap loses its height and the scrubber fades to half.', 'It leaves the tab order.'],
    ],
    interactions: [
      ['Keyboard', 'Arrow keys', 'Move five seconds.', 'role slider'],
      ['Keyboard', 'Page Up / Page Down', 'Move thirty seconds.', 'role slider'],
      ['Keyboard', 'Home / End', 'Go to the start or the end.', 'role slider'],
      ['Pointer', 'Press, drag, release', 'The cap follows the pointer. onValueCommit fires once on release.', 'pointer capture'],
      ['Screen reader', 'Read', 'Announced as a slider with its label and the position in words, such as 1:23 of 3:45, with the chapter title after it.', 'aria-valuetext'],
    ],
    loading: <p>Before a track is loaded, set <code>disabled</code> and a <code>duration</code> of 0. While it loads, <code>buffered</code> shows how much of the groove is ready.</p>,
    focus: <p>Scrubber is never focused on page load. Pressing the track focuses it, so the arrow keys work right after a drag.</p>,
  },
  deepDive: { na: 'Scrubber has a single variant, so there is no section per variant.' },
  modifiers: [
    {
      name: 'buffered',
      rules: <p>Draws the loaded stretch as a thin ink line along the groove floor. Use it for streams, where the person may wait if they seek past it. Leave it out for files that are already on the device.</p>,
      pair: { do: <Scrubber label="Evening news" duration={1260} defaultValue={240} buffered={610} />, doNote: 'The person can see how far ahead they may seek.', dont: <Scrubber label="Evening news" duration={1260} defaultValue={240} buffered={240} />, dontNote: 'Buffered set to the position itself, so it reads as a played fill.' },
    },
    {
      name: 'chapters',
      rules: <p>Prints an ink mark above the groove where each chapter starts. A chapter with a label adds its title to the announced position. Keep to a few chapters; marks closer than a cap’s width cannot be told apart.</p>,
      pair: { do: <Scrubber label="Ruhe, side A" duration={225} defaultValue={120} chapters={CHAPTERS} />, doNote: 'Four parts of a song, far enough apart to read.', dont: <Scrubber label="Ruhe, side A" duration={225} defaultValue={120} chapters={Array.from({ length: 40 }, (_, i) => ({ time: i * 5 + 3 }))} />, dontNote: 'Forty marks that print as a grey smear.' },
    },
    {
      name: 'onValueCommit',
      rules: <p>Fires once when a drag ends and on each key press. Seek the player here when it cannot seek while the person drags. Use <code>onValueChange</code> to move the times while dragging.</p>,
      pair: { do: <Scrubber label="Ruhe, side A" duration={225} defaultValue={83} />, doNote: 'The times follow the hand and the player seeks once on release.', dont: <Scrubber label="Ruhe, side A" duration={225} defaultValue={83} disabled />, dontNote: 'A scrubber locked while the player seeks, so the hand has nothing to move.' },
    },
  ],
  related: [['/components/progress', 'Progress', 'How far a device task has run.'], ['/components/slider', 'Slider', 'An amount the person sets.'], ['/components/meter', 'Meter', 'A level that is read.']],
  references: [
    { title: 'WAI-ARIA Authoring Practices · Media Seek Slider example', url: 'https://www.w3.org/WAI/ARIA/apg/patterns/slider/examples/slider-seek/', why: 'The value text in minutes and seconds, and the keys a seek slider needs.' },
    { title: 'WCAG 2.2 · 2.5.7 Dragging Movements', url: 'https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html', why: 'Why every position can also be reached with a key or a single press.' },
    { title: 'Dieter Rams, ten principles for good design (Vitsœ)', url: 'https://www.vitsoe.com/gb/about/good-design', why: 'The source of dial’s principles.' },
  ],
};
