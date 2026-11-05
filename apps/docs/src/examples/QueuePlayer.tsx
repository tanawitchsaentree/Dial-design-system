// @example Beside a MediaPlayer the queue and the player share one list of tracks, so a move in the queue changes what plays next
import { useEffect, useState } from 'react';
import { MediaPlayer, Queue, Stack, type MediaTrack } from 'dial-react';
import { useDemoTracks } from '../system/tones';

export default function QueuePlayer() {
  const made = useDemoTracks(4);
  const [tracks, setTracks] = useState<MediaTrack[]>([]);
  const [current, setCurrent] = useState<string | undefined>();
  useEffect(() => {
    if (made) { setTracks(made); setCurrent(made[0]?.id); }
  }, [made]);
  return (
    <Stack direction="row" gap="lg" align="start">
      <MediaPlayer tracks={tracks} loading={!made} current={current} onCurrentChange={setCurrent} meter={false} model="mp 3" />
      <div style={{ inlineSize: 'min(100%, var(--ds-layout-frame-md))', maxInlineSize: '100%' }}>
        <Queue tracks={tracks} onTracksChange={setTracks} playing={current} onPlay={setCurrent} />
      </div>
    </Stack>
  );
}
