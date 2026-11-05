// @example A speaker in layout="compact" with an OLED window, transport keys and the volume knob right of the display
import { useState } from 'react';
import { DeviceCard, Icon } from 'dial-react';

export default function DeviceCardSpeaker() {
  const [playing, setPlaying] = useState(true);
  const [volume, setVolume] = useState(5);
  return (
    <DeviceCard
      layout="compact"
      model="speaker 1"
      display={{ kind: 'oled', label: 'Speaker', value: 'So What', detail: `${playing ? 'Playing' : 'Paused'} · Kind of Blue` }}
      knob={{ label: 'Volume', value: volume, onValueChange: setVolume }}
      keysLabel="Playback"
      keys={[
        { label: 'Previous track', icon: <Icon name="previous" /> },
        { label: 'Play', icon: <Icon name="play" />, pressed: playing, onPress: () => setPlaying(!playing) },
        { label: 'Next track', icon: <Icon name="next" /> },
      ]}
    />
  );
}
