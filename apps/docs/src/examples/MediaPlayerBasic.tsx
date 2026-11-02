// @example A player that really plays tones rendered in the browser. Play starts only on a press, and Space toggles while focus is in the player
import { MediaPlayer } from 'dial-react';
import { useDemoTracks } from '../system/tones';

export default function MediaPlayerBasic() {
  const tracks = useDemoTracks(3);
  return <MediaPlayer tracks={tracks ?? []} loading={!tracks} />;
}
