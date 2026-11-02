// Usage tab for Queue (component-depth.md U1–U14). Queue is the up-next list of a player, printed like List.
import { List, Queue } from 'dial-react';
import type { Depth } from './types';

const TRACKS = [
  { id: 't1', title: 'Kiln song', artist: 'Ulm Quartet', duration: 222 },
  { id: 't2', title: 'Weniger, aber besser', artist: 'Hochschule', duration: 250 },
  { id: 't3', title: 'Slow return', artist: 'The Faders', duration: 178 },
  { id: 't4', title: 'Detent', artist: 'Rotary Club', duration: 185 },
];
const Col = ({ children, w = 360 }: { children: React.ReactNode; w?: number }) => <div style={{ inlineSize: w, maxInlineSize: '100%' }}>{children}</div>;

export const QUEUE: Depth = {
  overview: (
    <>
      <p>Queue is the list of what plays next, printed on one plastic body like List. Each row holds the track number in tabular figures, the title, the artist and the length. The playing row has List’s ink index mark at its start, its title in medium weight and the word Playing with a small play sign.</p>
      <p>Pressing a row plays its track. A track can be moved in three ways, all doing the same thing. Alt with the up or down arrow moves the focused row, the row’s menu key holds Move up and Move down in words, and the printed handle at the row’s start drags it, with an ink line where it will land. Delete or the menu removes a track. After each change a polite status says where the track went.</p>
    </>
  ),
  whenToUse: [
    'For the up-next list beside a MediaPlayer.',
    'When the person may change the order of a short programme, such as the steps of a wash.',
    'When a track can be removed from what plays next without deleting it from the library.',
  ],
  whenNot: [
    { situation: 'A list of devices or tracks that is never reordered', to: '/components/list', label: 'List' },
    { situation: 'Choosing one track to play from a fixed list', to: '/components/list', label: 'List, selectable' },
    { situation: 'A few actions on one item', to: '/components/menu', label: 'Menu' },
  ],
  variants: { na: 'Queue has one look, rows printed on one body with a handle and a menu key. Removal is an option, covered under Modifiers.' },
  anatomy: {
    render: <Col><Queue defaultTracks={TRACKS} playing="t2" /></Col>,
    parts: [
      { part: 'Body', selector: '[data-component="Queue"] > ol', what: 'One plastic body with the unit shadow. Rows are kept apart by gaps, never by rules.' },
      { part: 'Index mark', selector: '[data-component="Queue"] li:has([aria-current="true"]) > span:first-child', what: 'A 2px ink mark at the start of the playing row.' },
      { part: 'Handle', selector: '[data-component="Queue"] li > span:nth-child(2)', what: 'Six printed dots the full height of the row. A pointer drags the row by it.' },
      { part: 'Row', selector: '[data-component="Queue"] li > button', what: 'The row itself is one key that plays the track.' },
      { part: 'Number', selector: '[data-component="Queue"] li > button > span:first-child', what: 'The place in the queue, in tabular figures.' },
      { part: 'Title and artist', selector: '[data-component="Queue"] li > button > span:nth-child(2)', what: 'The title in body size and the artist under it, with Playing before it on the playing row.' },
      { part: 'Length', selector: '[data-component="Queue"] li > button > span:last-child', what: 'The track’s length, in tabular figures at the row’s end.' },
      { part: 'Menu key', selector: '[data-component="Queue"] li [data-component="Menu"]', what: 'A round key with Move up, Move down and Remove from queue.' },
    ],
  },
  sizes: { na: 'Queue has one size. Rows are at least 52px tall and the queue takes the width of its column.' },
  emphasis: {
    text: <p>A queue is quiet. Nothing in it is orange, because the player’s play key is the loud part of the screen. The playing row is told by ink, weight and a word.</p>,
    pair: {
      do: <Col><Queue defaultTracks={TRACKS.slice(0, 3)} playing="t2" /></Col>,
      doNote: 'The playing row has an ink mark and the word Playing.',
      dont: <Col><List label="Queue" selectable defaultValue="t2">{TRACKS.slice(0, 3).map((t, i) => <List.Item key={t.id} value={t.id} index={i + 1} label={t.title} description={t.artist} />)}</List></Col>,
      dontNote: 'A plain list for a queue. The playing track has no word and nothing can be moved or removed.',
    },
  },
  placement: {
    rows: [['Under the player on a phone', 'The usual place, in the same column as the player.'], ['Beside the player on a wide screen', 'At the inline end of the player, the same height or longer.'], ['In a sheet', 'A long queue in a sheet opened from the player.']],
    examples: [{ title: 'A queue of three under a player', render: <Col><Queue defaultTracks={TRACKS.slice(1)} playing="t3" /></Col> }],
  },
  combinations: {
    good: [['Queue + MediaPlayer', 'One list of tracks shared by both.'], ['Queue + Sheet', 'A long queue in a sheet.'], ['Queue + EmptyState', 'When the queue is empty, say so with one line and a key to add tracks.']],
    avoid: [{ title: 'a queue with no playing row', why: 'Without a playing row the person cannot tell where the queue starts. Pass the playing track’s id, or use List for a plain track list.', render: <Col><Queue defaultTracks={TRACKS.slice(0, 3)} /></Col> }],
  },
  content: {
    formula: <p>Each row shows the track’s own title and its artist. The number and the length are printed by the queue, so leave them out of the title. Name the queue after what it holds, such as Up next or Wash steps.</p>,
    pair: {
      do: <Col><Queue defaultTracks={TRACKS.slice(0, 2)} playing="t1" /></Col>,
      doNote: 'Titles and artists, with the numbers and lengths printed by the queue.',
      dont: <Col><Queue defaultTracks={[{ id: 'x1', title: '01. kiln_song (3:42).mp3', artist: '' }, { id: 'x2', title: '02. weniger (4:10).mp3', artist: '' }]} playing="x1" /></Col>,
      dontNote: 'File names with their own numbers and times, so each is printed twice.',
    },
    overflow: { text: 'A long title wraps onto more lines. The number, the length and the menu key stay where they are.', render: <div data-overflow-demo="" style={{ inlineSize: 300, maxInlineSize: '100%' }}><Queue defaultTracks={[{ id: 'o1', title: 'The long interview with the designer of the radio, part two', artist: 'Morning programme', duration: 3725 }, TRACKS[0]]} playing="o1" /></div> },
    rtl: { text: 'In right-to-left languages the mark and the handle sit on the right and the menu key on the left. Alt with up and down still moves a row up and down.', render: <div dir="rtl"><Col><Queue defaultTracks={[{ id: 'r1', title: 'نشرة الأخبار', artist: 'إذاعة', duration: 1260 }, { id: 'r2', title: 'الطقس', artist: 'إذاعة', duration: 240 }]} playing="r1" words={{ playing: 'قيد التشغيل' }} /></Col></div> },
    expansion: { text: 'German and Finnish titles run about 30% longer. They wrap, and the columns hold.', render: <Col><Queue defaultTracks={[{ id: 'g1', title: 'Abendnachrichten mit Wetterbericht', artist: 'Rundfunkorchester', duration: 1260 }]} playing="g1" words={{ playing: 'Wird gespielt', moveUp: 'Nach oben', moveDown: 'Nach unten', remove: 'Aus der Warteschlange entfernen' }} /></Col> },
  },
  behaviours: {
    states: [
      ['Playing row', 'An ink index mark, the title in medium weight and the word Playing.', 'The row has aria-current true.'],
      ['Hover on the handle', 'The dots darken one step. No lift.', 'The pointer shows a hand that can grab.'],
      ['Pressed', 'The row sinks into a small recess at once.', 'The same recess as a pressed List row.'],
      ['Dragging', 'The dragged row stays in a recess and an ink line shows where it will land.', 'Nothing slides; the row takes its new place on release.'],
      ['Focus', 'A dark 2px ring around the row.', 'The same ring as on every part.'],
      ['Moved', 'The row takes its new place at once and keeps focus.', 'A polite status says Kiln song moved to 3 of 4.'],
      ['Removed', 'The row is gone and focus goes to the next row.', 'A polite status says the track was removed.'],
    ],
    interactions: [
      ['Keyboard', 'Up and Down arrows', 'Move focus to the row above or below. Home and End reach the ends.', 'buttons in a list'],
      ['Keyboard', 'Alt with Up or Down', 'Moves the focused track one place up or down.', 'keydown on the row'],
      ['Keyboard', 'Delete or Backspace', 'Removes the focused track from the queue.', 'keydown on the row'],
      ['Keyboard', 'Enter or Space', 'Plays the focused track.', 'button'],
      ['Pointer', 'Drag the handle', 'Moves the row to where the ink line shows. The menu does the same with one press each.', 'pointer events'],
      ['Screen reader', 'Read', 'Each row is a button named by its title, the word Playing and its artist and length, and the playing row is announced as current.', 'aria-current, role status'],
    ],
    loading: <p>Queue has no loading state of its own. While the tracks load, show the player’s Loading state and render the queue when the tracks are there.</p>,
    focus: <p>Queue never takes focus on page load. After a move focus stays on the moved row, or on its menu key when the menu moved it. After a removal focus goes to the next row, or the one before when the last row was removed.</p>,
  },
  deepDive: { na: 'Queue has a single variant, so there is no section per variant.' },
  modifiers: [
    {
      name: 'removable',
      rules: <p>On by default. The menu holds Remove from queue and Delete removes the focused row. Turn it off for a programme whose steps can be reordered but not cut, such as a wash cycle.</p>,
      pair: { do: <Col><Queue label="Wash steps" defaultTracks={[{ id: 'w1', title: 'Main wash', artist: 'Cotton 40°', duration: 2700 }, { id: 'w2', title: 'Spin', artist: 'Cotton 40°', duration: 600 }]} removable={false} /></Col>, doNote: 'Steps that may move but must all run.', dont: <Col><Queue label="Wash steps" defaultTracks={[{ id: 'w1', title: 'Main wash', artist: 'Cotton 40°', duration: 2700 }, { id: 'w2', title: 'Spin', artist: 'Cotton 40°', duration: 600 }]} /></Col>, dontNote: 'A wash step that can be removed, so the cycle can end without its spin.' },
    },
    {
      name: 'playing',
      rules: <p>The id of the track that plays. Its row gets the ink index mark, the medium title and the word Playing, and it is announced as current. Pass the same id the player uses.</p>,
      pair: { do: <Col><Queue defaultTracks={TRACKS.slice(0, 2)} playing="t1" /></Col>, doNote: 'The first row is playing and says so.', dont: <Col><Queue defaultTracks={TRACKS.slice(0, 2)} /></Col>, dontNote: 'No playing row, so the queue has no start.' },
    },
  ],
  related: [['/components/media-player', 'MediaPlayer', 'The player the queue feeds.'], ['/components/list', 'List', 'Rows that are never reordered.'], ['/components/menu', 'Menu', 'The row’s actions.']],
  references: [
    { title: 'WAI-ARIA Authoring Practices · Listbox, rearrangeable options', url: 'https://www.w3.org/WAI/ARIA/apg/patterns/listbox/examples/listbox-rearrangeable/', why: 'Moving items with keys and announcing the new place.' },
    { title: 'WCAG 2.2 · 2.5.7 Dragging Movements', url: 'https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html', why: 'Why every drag has a single press or key that does the same.' },
    { title: 'Dieter Rams, ten principles for good design (Vitsœ)', url: 'https://www.vitsoe.com/gb/about/good-design', why: 'The source of dial’s principles.' },
  ],
};
