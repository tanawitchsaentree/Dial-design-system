import { forwardRef } from 'react';
import { cx } from '../../cx';
import { messages } from '../../messages';
import { Badge } from '../Badge';
import { Card, type CardProps } from '../Card';
import { Display, type DisplayKind } from '../Display';
import { Grille, type GrilleProps } from '../Grille';
import { Meter, type MeterProps } from '../Meter';
import styles from './Environment.module.css';

/** The kinds of air reading Environment knows the range, regions and unit of. */
export type EnvironmentReadingKind = 'humidity' | 'air' | 'co2' | 'noise';

/** Whether the sensor is answering. `live` (default) is current, `stale` is late, `offline` has stopped answering. */
export type EnvironmentStatus = 'live' | 'stale' | 'offline';

/** One level of the room's air, read on a Meter. The kind fills in the range, the regions and the unit; any Meter prop overrides them. */
export type EnvironmentReading = { kind: EnvironmentReadingKind; value: number } & Partial<Omit<MeterProps, 'value'>>;

export interface EnvironmentProps extends Omit<CardProps, 'as' | 'padding' | 'header' | 'footer' | 'wordmark' | 'model' | 'onMeasure' | 'children'> {
  /** The room, such as "Living room". Printed bottom-left in the wordmark's place and used to name the unit. */
  room: string;
  /** The temperature, the main reading, shown on the LCD window with one decimal. */
  temperature: number;
  /** The unit printed beside the temperature. Default °C. */
  unit?: string;
  /** One short line in the window with the temperature, such as "Feels dry". When the sensor is offline the window says Not answering instead. */
  detail?: string;
  /** `lcd` (default) or `oled`, the window family of the Display. */
  displayKind?: DisplayKind;
  /** The levels read under the window, in order, such as humidity and air quality. Keep it to three or four. */
  readings?: EnvironmentReading[];
  /** A grille for activity in the room, such as noise or a running fan. Its label is printed beside it. */
  activity?: GrilleProps;
  /** When the readings were taken. Printed bottom-right in the model name's place, such as 10:42. */
  readAt: Date | string;
  /** Whether the sensor is answering. A late or offline sensor keeps its last readings and says so in words. */
  status?: EnvironmentStatus;
  /** The words of the notice line, to replace the defaults "Up to date", "No new reading since 10:17" and "Not answering since 09:58". */
  statusText?: string;
}

type Preset = Pick<MeterProps, 'label' | 'min' | 'max' | 'low' | 'high' | 'optimum' | 'regionLabels' | 'formatValue'>;
const PRESETS: Record<EnvironmentReadingKind, Preset> = {
  humidity: { label: 'Humidity', min: 0, max: 100, low: 30, high: 60, optimum: 45, regionLabels: { low: 'Dry', mid: 'Comfort', high: 'Damp' }, formatValue: (v) => `${Math.round(v)} %` },
  air: { label: messages.env.air, min: 0, max: 150, low: 50, high: 100, optimum: 0, regionLabels: { low: messages.env.clean, mid: messages.env.fair, high: messages.env.poor }, formatValue: (v) => `${Math.round(v)} AQI` },
  co2: { label: 'CO₂', min: 400, max: 2000, low: 800, high: 1200, optimum: 400, regionLabels: { low: 'Fresh', mid: 'Stale', high: 'Stuffy' }, formatValue: (v) => `${Math.round(v)} ppm` },
  noise: { label: 'Noise', min: 20, max: 90, low: 40, high: 65, optimum: 30, regionLabels: { low: 'Quiet', mid: 'Normal', high: 'Loud' }, formatValue: (v) => `${Math.round(v)} dB` },
};
const clock = (t: Date | string) => (typeof t === 'string' ? t : `${String(t.getHours()).padStart(2, '0')}:${String(t.getMinutes()).padStart(2, '0')}`);

/** One room's air at a glance: the temperature in a window, the other levels on meters, the room and the time printed on the case. */
export const Environment = forwardRef<HTMLElement, EnvironmentProps>(function Environment(
  { room, temperature, unit = '°C', detail, displayKind = 'lcd', readings = [], activity, readAt, status = 'live', statusText, className, ...rest },
  ref,
) {
  const time = clock(readAt);
  const words = statusText ?? (status === 'stale' ? messages.env.staleSince(time) : status === 'offline' ? messages.env.offlineSince(time) : messages.env.upToDate);
  const tone = status === 'stale' ? 'warning' : status === 'offline' ? 'critical' : 'positive';
  return (
    <Card
      ref={ref}
      as="section"
      padding="unit"
      wordmark={room}
      model={time}
      aria-label={rest['aria-label'] ?? room}
      data-state={status}
      className={cx(styles.root, className)}
      {...rest}
      data-component="Environment"
    >
      <div className={styles.face}>
        <Display
          kind={displayKind}
          label={messages.env.temperature(room)}
          value={Number.isFinite(temperature) ? temperature.toFixed(1) : '--'}
          unit={unit}
          detail={status === 'offline' ? messages.env.notAnswering : detail}
          digits={3}
        />
        <p className={styles.notice} role="status" aria-live="polite">
          <Badge tone={tone}>{words}</Badge>
        </p>
        {readings.length > 0 && (
          <div className={styles.meters}>
            {readings.map(({ kind, ...r }, i) => <Meter key={`${kind}-${i}`} {...PRESETS[kind]} {...r} />)}
          </div>
        )}
        {activity && (
          <div className={styles.activity}>
            <span className={styles.caption} aria-hidden="true">{activity.valueText ? `${activity.label}, ${activity.valueText}` : activity.label}</span>
            <Grille cols={6} rows={3} {...activity} />
          </div>
        )}
      </div>
    </Card>
  );
});
