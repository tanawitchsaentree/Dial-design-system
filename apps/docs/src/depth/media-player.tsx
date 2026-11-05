// Usage tab for MediaPlayer (component-depth.md U1–U14). MediaPlayer is the reference sheet's MP3 player as one unit.
import { Button, Card, MediaPlayer, Progress, Stack, type MediaPlayerProps } from 'dial-react';
import { useDemoTracks, useToned } from '../system/tones';
import type { MediaTrack } from 'dial-react';
import type { Depth } from './types';

/** A player on the demo tones, rendered in the browser; Loading until they are ready. */
function Demo(p: Partial<MediaPlayerProps> & { count?: number }) {
  const { count = 3, ...rest } = p;
  const tracks = useDemoTracks(count);
  return <MediaPlayer tracks={tracks ?? []} loading={!tracks} {...rest} />;
}

/** Your own titles on the demo tones. */
function Toned({ tracks, ...rest }: Omit<Partial<MediaPlayerProps>, 'tracks'> & { tracks: Array<Omit<MediaTrack, 'src'>> }) {
  const toned = useToned(tracks);
  return <MediaPlayer tracks={toned ?? []} loading={!toned} {...rest} />;
}

const BROKEN = [{ id: 'broken', title: 'Field recording 3', artist: 'Archive', source: 'Library', src: 'data:audio/wav;base64,AAAA' }];

export const MEDIA_PLAYER: Depth = {
  overview: (
    <>
      <p>MediaPlayer is the small MP3 player from the reference sheet, drawn as one unit. The OLED window at the top says what is playing and how, the scrubber under it shows the position, and three round keys play the queue. Play is the large orange disc, the one loud part of the unit. The level shows in a field of holes beside the keys, and volume sits on the ruler fader across the body.</p>
      <p>It really plays. The player drives an HTMLAudioElement with the tracks you pass, and sound starts only when a person presses play, as browsers ask. Space toggles play while focus is anywhere in the player outside a key. The arrow keys move the scrubber five seconds at a time. When one track ends the next one starts, and when the last one ends the window says Ended.</p>
      <p>In this book the tracks are a few seconds of soft tones rendered in the browser with an OfflineAudioContext and turned into a WAV file in memory. Nothing is downloaded, and every demo works offline.</p>
    </>
  ),
  whenToUse: [
    'To play a list of tracks, a radio stream or a podcast in a home app.',
    'When the person needs to see what plays, from where, and change it in a few seconds.',
    'As the one player of a room, beside its Queue.',
  ],
  whenNot: [
    { situation: 'Only the position of something that another part plays', to: '/components/scrubber', label: 'Scrubber' },
    { situation: 'A device that is not a player, such as a heater or a lamp', to: '/components/device-card', label: 'DeviceCard' },
    { situation: 'The list of what plays next', to: '/components/queue', label: 'Queue' },
  ],
  variants: { na: 'MediaPlayer has one look, the MP3 unit. Volume on a rotary and the level meter are options, covered under Modifiers.' },
  anatomy: {
    render: <Demo />,
    parts: [
      { part: 'Window', selector: '[data-component="MediaPlayer"] [role="status"][data-glow]', what: 'The OLED window. The state glyph and word, the place in the queue, the title, the artist and the source.' },
      { part: 'Scrubber', selector: '[data-component="MediaPlayer"] [data-component="Scrubber"]', what: 'The position as a cap in a groove, with the elapsed and remaining time printed under it.' },
      { part: 'Transport keys', selector: '[data-component="MediaPlayer"] [role="group"]', what: 'Previous, play and next, three round keys in one group.' },
      { part: 'Play key', selector: '[data-component="MediaPlayer"] [data-kind="primary"]', what: 'The large orange disc. It shows a pause sign while the track plays.' },
      { part: 'Level', selector: '[data-component="MediaPlayer"] [data-component="Grille"]', what: 'Recessed holes that light in ink with the sound and go dark when it stops.' },
      { part: 'Volume', selector: '[data-component="MediaPlayer"] [data-component="Slider"]', what: 'The ruler fader, from 0 to 100 in steps of five.' },
      { part: 'Print', selector: '[data-component="MediaPlayer"] > div:last-child', what: 'The wordmark at the lower start and the model name in lowercase at the lower end.' },
    ],
  },
  sizes: { na: 'MediaPlayer has one size. The body is eight touch modules wide, 352px, and never wider than its column. On a 375px phone it fills the column.' },
  emphasis: {
    text: <p>A player holds one orange part, the play key. Previous, next, the scrubber, the volume fader and the level holes stay plastic and ink. A screen with a player and other units keeps each unit to its own one loud part.</p>,
    pair: {
      do: <Demo count={2} />,
      doNote: 'Play is the one orange part of the unit.',
      dont: <Card padding="unit" wordmark="dial" model="mp 1"><Stack gap="md"><Progress label="Kiln song" value={83} max={222} valueText="1:23 of 3:42" /><Stack direction="row" gap="md"><Button kind="primary">Previous</Button><Button kind="primary">Play</Button><Button kind="primary">Next</Button></Stack></Stack></Card>,
      dontNote: 'Three orange keys and a filling bar. Nothing is louder than anything else and the position cannot be moved.',
    },
  },
  placement: {
    rows: [['At the top of a room page', 'The usual place, with the Queue under it on a phone and beside it on a wide screen.'], ['In a sheet from a speaker row', 'When a room has several speakers, one player per sheet.'], ['On a dashboard of units', 'As one unit among the device cards, the same width as they are.']],
    examples: [{ title: 'With a room’s queue', render: <Demo count={4} model="mp 3" /> }],
  },
  combinations: {
    good: [['MediaPlayer + Queue', 'The player and the up-next list share one list of tracks.'], ['MediaPlayer + Sheet', 'The player in a sheet opened from a speaker row.'], ['MediaPlayer + Banner', 'A banner above the player when the network is out.']],
    avoid: [{ title: 'two players on one screen', why: 'Two orange play keys side by side, and the person has to guess which one sounds. This book lets only one player sound at a time, and a product should show one player per room.', render: <Stack direction="row" gap="md" align="start"><Demo count={2} /><Demo count={2} model="mp 2" /></Stack> }],
  },
  content: {
    formula: <p>The title is the track’s own title. The artist is who plays it and the source says where it plays from, such as Library or Radio. Keep the source to one word. The state words are short and printed by the player, so do not put a state in the title.</p>,
    pair: {
      do: <Toned tracks={[{ id: 'a', title: 'Kiln song', artist: 'Ulm Quartet', source: 'Library', duration: 222 }]} />,
      doNote: 'Title, artist and source, each in its place.',
      dont: <Toned tracks={[{ id: 'a', title: 'NOW PLAYING: kiln_song_final.wav', artist: 'Unknown', source: 'file:///Music', duration: 222 }]} />,
      dontNote: 'A file name and a state in the title, and a path as the source.',
    },
    overflow: { text: 'A long title wraps onto more lines in the window. The window grows, the keys keep their place and nothing is cut.', render: <div data-overflow-demo="" style={{ inlineSize: 'min(100%, var(--ds-layout-frame-sm))' }}><Toned tracks={[{ id: 'l', title: 'The long interview with the designer of the radio, part two', artist: 'Morning programme', source: 'Radio', duration: 3725 }]} /></div> },
    rtl: { text: 'In right-to-left languages the window prints from the right, the scrubber starts on the right and previous sits on the right of play.', render: <div dir="rtl"><Toned tracks={[{ id: 'r', title: 'نشرة الأخبار', artist: 'إذاعة', source: 'راديو', duration: 1260 }]} words={{ paused: 'متوقف', play: 'تشغيل', previous: 'السابق', next: 'التالي', volume: 'الصوت' }} /></div> },
    expansion: { text: 'German and Finnish words run about 30% longer. The state word and the title wrap, and the body keeps its width.', render: <Toned tracks={[{ id: 'g', title: 'Abendnachrichten mit Wetterbericht', artist: 'Rundfunkorchester', source: 'Bibliothek', duration: 1260 }]} words={{ paused: 'Angehalten', play: 'Wiedergabe', previous: 'Vorheriger Titel', next: 'Nächster Titel', volume: 'Lautstärke' }} /> },
  },
  behaviours: {
    states: [
      ['Loading', 'The window says Loading with three printed squares, and every part waits with its height gone.', 'The player is aria-busy until the tracks are ready.'],
      ['Paused', 'The window says Paused with two bars. Play shows a triangle.', 'The play key is not pressed.'],
      ['Playing', 'The window says Playing with a triangle, play shows a pause sign and the holes follow the sound.', 'The play key is pressed and the cap steps with the time.'],
      ['Ended', 'The window says Ended with a ring when the last track has played.', 'Play starts the last track again from the start.'],
      ['Error', 'The window says Can’t play this file with a square, and play waits.', 'Previous and next still change the track.'],
      ['Offline', 'The window says Offline with a triangle, and play waits for the network.', 'What was playing pauses; the next press is the person’s.'],
    ],
    interactions: [
      ['Keyboard', 'Space', 'Toggles play while focus is in the player outside a key. On a key, Space presses that key.', 'keydown on the body'],
      ['Keyboard', 'Arrow keys on the scrubber', 'Move five seconds. Page Up and Page Down move thirty.', 'role slider'],
      ['Keyboard', 'Enter or Space on a key', 'Presses previous, play or next.', 'button'],
      ['Pointer', 'Press play', 'Starts the sound. The browser allows it because a person pressed.', 'HTMLMediaElement.play()'],
      ['Screen reader', 'Read', 'The window is announced politely with the state and the title, and play says pressed while it plays.', 'role status, aria-pressed'],
      ['System', 'Media keys and the lock screen', 'Play, pause, previous and next work while this player plays.', 'Media Session API'],
    ],
    loading: <p>While the tracks are not ready, pass <code>loading</code>. The window says Loading and the keys, the scrubber and the fader wait. While a track buffers in the middle of playing, the window says Loading by itself and goes back to Playing when the sound comes back.</p>,
    focus: <p>The player never takes focus on page load and never plays on its own. The first press on play starts the sound. Focus stays on the key that was pressed.</p>,
  },
  deepDive: { na: 'MediaPlayer has a single variant, so there is no section per variant.' },
  modifiers: [
    {
      name: 'volume',
      rules: <p><code>slider</code> puts the ruler fader across the body and suits most screens. <code>rotary</code> puts a 44px plastic knob at the end of the key row, for a body with no room for a fader. The knob stays plastic, because play is the loud part.</p>,
      pair: { do: <Demo volume="rotary" />, doNote: 'A plastic knob at the end of the key row.', dont: <Demo volume="rotary" meter={false} count={1} />, dontNote: 'One track and no meter, so the knob sits alone and reads as the main control.' },
    },
    {
      name: 'meter',
      rules: <p>Shows the level as lit holes in a Grille at the end of the key row. The holes follow the sound about ten times a second while it plays and go dark when it stops. Turn it off for speech, where a level says little.</p>,
      pair: { do: <Demo />, doNote: 'The holes beside the keys show the level of music.', dont: <Demo meter={false} />, dontNote: 'Without the meter the key row is shorter. Use this for speech.' },
    },
    {
      name: 'offline',
      rules: <p>Set it when the source cannot be reached. The window says Offline, play waits and what was playing pauses. Clear it when the network is back; the person presses play again.</p>,
      pair: { do: <Toned tracks={[{ id: 'o', title: 'Morning show', artist: 'Radio dial', source: 'Radio', duration: 3300 }]} offline />, doNote: 'The window says Offline with a glyph.', dont: <MediaPlayer tracks={BROKEN} />, dontNote: 'A broken file is a different state, told as the error.' },
    },
  ],
  related: [['/components/queue', 'Queue', 'The list of what plays next.'], ['/components/scrubber', 'Scrubber', 'The position on its own.'], ['/components/device-card', 'DeviceCard', 'A unit for a device that is not a player.']],
  references: [
    { title: 'MDN · Autoplay guide for media and Web Audio APIs', url: 'https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Autoplay', why: 'Why sound starts only on a press, and how play() reports a refusal.' },
    { title: 'MDN · Media Session API', url: 'https://developer.mozilla.org/en-US/docs/Web/API/Media_Session_API', why: 'Metadata and actions for media keys and lock screens.' },
    { title: 'WAI-ARIA Authoring Practices · Button pattern, toggle button', url: 'https://www.w3.org/WAI/ARIA/apg/patterns/button/', why: 'Play keeps its name and says pressed while it plays.' },
    { title: 'Dieter Rams, ten principles for good design (Vitsœ)', url: 'https://www.vitsoe.com/gb/about/good-design', why: 'The source of dial’s principles.' },
  ],
};
