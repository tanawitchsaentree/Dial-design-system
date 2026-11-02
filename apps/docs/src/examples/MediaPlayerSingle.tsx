// @example One track and no level meter. Previous goes back to the start, next stays off, and the window says Ended when it stops
import { MediaPlayer } from 'dial-react';
import { useDemoTracks } from '../system/tones';

export default function MediaPlayerSingle() {
  const tracks = useDemoTracks(5);
  const one = tracks ? tracks.slice(4) : [];
  return <MediaPlayer tracks={one} loading={!tracks} meter={false} label="Radio player" model="rp 1" />;
}
