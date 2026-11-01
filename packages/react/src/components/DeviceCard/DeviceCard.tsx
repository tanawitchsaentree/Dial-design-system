import { forwardRef, useCallback, useState, type ReactNode } from 'react';
import { cx } from '../../cx';
import { Button } from '../Button';
import { Card, type CardBox, type CardProps } from '../Card';
import { Display, type DisplayProps } from '../Display';
import { Grille, type GrilleProps } from '../Grille';
import { IconButton } from '../IconButton';
import { Rotary, type RotaryProps } from '../Rotary';
import { Slider, type SliderProps } from '../Slider';
import styles from './DeviceCard.module.css';

export type DeviceCardLayout = 'a' | 'tall' | 'compact';

/** One secondary key on the device. */
export interface DeviceKey {
  /** What the key does, in words. It is printed on a word key and is the accessible name of an icon key. */
  label: string;
  /** A symbol drawn in `currentColor`. With an icon the key is a round IconButton; without one it is a capsule Button. */
  icon?: ReactNode;
  /** For a key that latches (a mode, a band): whether it is on now. Leave it out for a key that only acts. */
  pressed?: boolean;
  /** Called when the key is pressed. */
  onPress?: () => void;
  /** The key cannot be pressed. */
  disabled?: boolean;
}

/** The unit's main key, used when the device has no knob. */
export interface DevicePrimary {
  /** The word on the key: a verb, such as "Turn off" or "Start wash". */
  label: ReactNode;
  /** Called when the key is pressed. */
  onPress?: () => void;
  /** The key cannot be pressed. */
  disabled?: boolean;
}

export interface DeviceCardProps extends Omit<CardProps, 'as' | 'padding' | 'header' | 'footer' | 'wordmark' | 'model' | 'onMeasure'> {
  /** The model name printed bottom-right, such as "tuner 1". Printed in lowercase. */
  model: string;
  /** The wordmark printed bottom-left. Defaults to "dial". */
  wordmark?: ReactNode;
  /** The window that says what the device is doing now. Always the first part of the unit. */
  display: DisplayProps;
  /** The orange knob, the unit's one loud part. It is sized to corner.knob-ratio (0.36) of the body's short side. */
  knob?: Omit<RotaryProps, 'kind' | 'unitSide' | 'diameter' | 'size'>;
  /** The main key when there is no knob. It is orange only then; next to a knob it is drawn as a plastic key, so the unit never has two orange parts. */
  primary?: DevicePrimary;
  /** Secondary keys, body-coloured: modes, bands, transport. */
  keys?: DeviceKey[];
  /** The accessible name of the row of keys, such as "Band" or "Playback". */
  keysLabel?: string;
  /** A grille meter for a reading that changes, such as volume or heat output. Leave it out when nothing is measured. */
  meter?: GrilleProps;
  /** A ruler fader across the body for a second amount, such as volume or brightness. */
  fader?: SliderProps;
  /** `a` (default) is anchor A: display on top, knob left, keys and grille right, fader across. `tall` is one column with the knob centred, for wall devices. `compact` is a wide body with the knob right of the display. */
  layout?: DeviceCardLayout;
}

/** Width in px below which two columns can no longer hold 44px parts side by side. */
const NARROW: Record<DeviceCardLayout, number> = { a: 300, tall: 0, compact: 420 };

/** One appliance on the screen: a plastic body with its display, one orange control, plain keys, an optional grille and fader, and its printed wordmark and model. */
export const DeviceCard = forwardRef<HTMLElement, DeviceCardProps>(function DeviceCard(
  { model, wordmark = 'dial', display, knob, primary, keys, keysLabel, meter, fader, layout = 'a', className, children, ...rest },
  ref,
) {
  const [box, setBox] = useState<CardBox | null>(null);
  const onMeasure = useCallback((b: CardBox) => {
    setBox((prev) => (prev && prev.inline === b.inline && prev.short === b.short ? prev : b));
  }, []);
  const narrow = box != null && box.inline < NARROW[layout];
  // one orange part per unit (P1): a primary key next to a knob is drawn as a plastic key
  const primaryKind = knob ? 'key' : 'primary';

  return (
    <Card
      ref={ref}
      as="section"
      padding="unit"
      wordmark={wordmark}
      model={model}
      onMeasure={onMeasure}
      aria-label={rest['aria-label'] ?? display.label}
      data-layout={layout}
      data-fit={narrow ? 'narrow' : 'wide'}
      className={cx(styles.root, styles[layout], className)}
      {...rest}
      data-component="DeviceCard"
    >
      <div className={styles.face}>
        <Display {...display} className={cx(styles.display, display.className)} />
        {knob && <Rotary {...knob} kind="primary" unitSide={box ? box.short : undefined} size="lg" className={cx(styles.knob, knob.className)} />}
        {primary && (
          <div className={styles.primary}>
            <Button kind={primaryKind} size="lg" onClick={primary.onPress} disabled={primary.disabled}>{primary.label}</Button>
          </div>
        )}
        {keys && keys.length > 0 && (
          <div className={styles.keys} role="group" aria-label={keysLabel}>
            {keys.map((k) => {
              // a latching key says its state with a printed lamp (ring off, disc on) as well as aria-pressed
              const lamp = k.pressed === undefined ? null : <span className={styles.lamp} data-on={String(k.pressed)} aria-hidden="true" />;
              if (k.icon == null) {
                return <Button key={k.label} aria-pressed={k.pressed} onClick={k.onPress} disabled={k.disabled}>{lamp}{k.label}</Button>;
              }
              const key = <IconButton key={k.label} label={k.label} aria-pressed={k.pressed} onClick={k.onPress} disabled={k.disabled}>{k.icon}</IconButton>;
              return lamp ? <span key={k.label} className={styles.latch}>{key}{lamp}</span> : key;
            })}
          </div>
        )}
        {meter && <Grille {...meter} className={cx(styles.meter, meter.className)} />}
        {fader && <Slider scale {...fader} className={cx(styles.fader, fader.className)} />}
        {children != null && <div className={styles.extra}>{children}</div>}
      </div>
    </Card>
  );
});
