// @example The window prints each state with a glyph and a word. It says Loading while the tracks are not ready, Offline when the source is out of reach, and Can’t play this file for a broken file
import { MediaPlayer, Stack } from 'dial-react';

const BROKEN = [{ id: 'broken', title: 'Field recording 3', artist: 'Archive', source: 'Library', src: 'data:audio/wav;base64,AAAA' }];
const STREAM = [{ id: 'stream', title: 'Morning show', artist: 'Radio dial', source: 'Radio', src: 'data:audio/wav;base64,AAAA', duration: 3300 }];

export default function MediaPlayerStates() {
  return (
    <Stack direction="row" gap="lg" align="start">
      <MediaPlayer tracks={[]} loading label="Player, loading" />
      <MediaPlayer tracks={STREAM} offline label="Player, offline" />
      <MediaPlayer tracks={BROKEN} label="Player, file error" />
    </Stack>
  );
}
