// @example A player with its queue. Pressing a row plays it, the queue reorders by keyboard or by the handle, and the player follows the new order
import { useEffect, useState } from 'react';
import { MediaPlayer, Queue, Stack, type MediaTrack } from 'dial-react';
import { useDemoTracks } from '../system/tones';

export default function MediaPlayerWithQueue() {
  const made = useDemoTracks();
  const [tracks, setTracks] = useState<MediaTrack[]>([]);
  const [current, setCurrent] = useState<string | undefined>();
  useEffect(() => {
    if (made) { setTracks(made); setCurrent(made[0]?.id); }
  }, [made]);
  return (
    <Stack gap="lg" style={{ inlineSize: 352, maxInlineSize: '100%' }}>
      <MediaPlayer tracks={tracks} loading={!made} current={current} onCurrentChange={setCurrent} />
      <Queue
        tracks={tracks}
        onTracksChange={(next) => {
          setTracks(next);
          if (!next.some((t) => t.id === current)) setCurrent(next[0]?.id);
        }}
        playing={current}
        onPlay={setCurrent}
      />
    </Stack>
  );
}
