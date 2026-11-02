// @example With volume="rotary" volume sits on a plastic knob at the end of the key row, for a body without room for a fader
import { MediaPlayer } from 'dial-react';
import { useDemoTracks } from '../system/tones';

export default function MediaPlayerRotary() {
  const tracks = useDemoTracks(3);
  return <MediaPlayer tracks={tracks ?? []} loading={!tracks} volume="rotary" defaultVolume={40} model="mp 2" />;
}
