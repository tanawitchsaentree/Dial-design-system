'use client';
import {
  forwardRef,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { cx } from '../../cx';
import { messages } from '../../messages';
import { Button } from '../Button';
import { Heading, type HeadingLevel } from '../Heading';
import { HelperText } from '../HelperText';
import { Icon } from '../Icon';
import { PinInput } from '../PinInput';
import { VisuallyHidden } from '../VisuallyHidden';
import styles from './OTPFlow.module.css';

export type OTPFlowStatus = 'idle' | 'verifying' | 'success' | 'error';

/** Every word the flow prints or speaks. Pass only the ones you want to change. */
export interface OTPFlowLabels {
  /** The printed name above the digit row. Default "Verification code". */
  label: ReactNode;
  /** The small word above the destination in the window. Default "Sent to". */
  sentTo: ReactNode;
  /** The line under the digits while nothing has happened yet. */
  hint: ReactNode;
  /** The words on the send-again key. Default "Send again". */
  resend: ReactNode;
  /** Read out for the disabled key while the countdown runs, for example "You can ask for a new code in 24 seconds." */
  wait: (seconds: number) => string;
  /** Spoken once when the countdown ends. */
  ready: string;
  /** Spoken after a new code was asked for. Receives the destination. */
  resent: (destination: string) => string;
  /** Printed and spoken while the host checks the code. */
  verifying: string;
  /** Printed and spoken after a good code. Default "Verified". */
  success: string;
  /** Printed and spoken under a code the host rejected, when you pass no `error` of your own. */
  error: string;
}

export interface OTPFlowProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue' | 'title' | 'children'> {
  /** Where the code went, as the person knows it: a phone number or an address. Printed in the window and spoken with the resent notice. */
  destination: string;
  /** The step's heading. Default "Enter the code". */
  title?: ReactNode;
  /** Heading level of the title, 1 to 4. Default 3. */
  level?: HeadingLevel;
  /** How many digits the code has. Default 6. */
  length?: number;
  /** Seconds before a new code may be asked for. The window counts down from here, and the count starts again when you change this number or the person presses the key. Default 30. */
  resendIn?: number;
  /** Called when the person presses the send-again key after the countdown. Send the code from here; the flow does no network work. */
  onResend?: () => void;
  /** Called once with the full code when the last digit is filled. The flow has no verify key; the code is sent the moment it is complete. */
  onVerify?: (code: string) => void;
  /** Where the host's check has got to. `verifying` and `success` make the digits read-only. Set it back to `idle` when the person edits a rejected code. Default `idle`. */
  status?: OTPFlowStatus;
  /** The message under the digits when `status` is `error`. Falls back to the built-in words. */
  error?: ReactNode;
  /** The code so far, digits only, when you control it. Pair it with `onValueChange`. */
  value?: string;
  /** The code at the start, when the flow keeps its own state. */
  defaultValue?: string;
  /** Called with the digits each time the code changes. */
  onValueChange?: (value: string) => void;
  /** The form field name for the whole code. */
  name?: string;
  /** Put the focus in the first digit when the flow mounts. */
  autoFocus?: boolean;
  /** Replace any of the built-in words, for example to translate them. */
  labels?: Partial<OTPFlowLabels>;
  /** Class name for the outer wrapper. */
  className?: string;
  /** Inline style for the outer wrapper. */
  style?: CSSProperties;
}

const clock = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

/** The whole code step of a sign-in: a title, a window that says where the code went and how long until a new one, the digit row and a send-again key. It does no network work. */
export const OTPFlow = forwardRef<HTMLDivElement, OTPFlowProps>(function OTPFlow(
  {
    destination,
    title,
    level = 3,
    length = 6,
    resendIn = 30,
    onResend,
    onVerify,
    status = 'idle',
    error,
    value,
    defaultValue,
    onValueChange,
    name,
    autoFocus,
    labels,
    id,
    className,
    style,
    ...rest
  },
  ref,
) {
  const words = { ...messages.otpFlow, ...labels };
  const auto = useId();
  const rootId = id ?? auto;
  const titleId = `${rootId}-title`;
  const lineId = `${rootId}-line`;
  const waitId = `${rootId}-wait`;

  const seconds = Math.max(0, Math.floor(resendIn));
  const [left, setLeft] = useState(seconds);
  const [run, setRun] = useState(0);
  const [note, setNote] = useState('');
  const prev = useRef(seconds);
  const fieldRef = useRef<HTMLDivElement>(null);
  const hasCode = useRef(false);

  // The deadline is a clock time, so a throttled background tab catches up instead of drifting.
  useEffect(() => {
    prev.current = seconds;
    setLeft(seconds);
    if (seconds <= 0) return;
    const end = Date.now() + seconds * 1000;
    const timer = setInterval(() => {
      const n = Math.max(0, Math.ceil((end - Date.now()) / 1000));
      setLeft(n);
      if (n === 0) clearInterval(timer);
    }, 250);
    return () => clearInterval(timer);
  }, [seconds, run]);

  // Spoken once when the count reaches zero, never on each tick.
  useEffect(() => {
    if (prev.current > 0 && left === 0) setNote(words.ready);
    prev.current = left;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [left]);

  // After a resend the focus goes back to the first digit, ready for the new code.
  useEffect(() => {
    if (run > 0) fieldRef.current?.querySelector('input')?.focus();
  }, [run]);

  const controlled = value !== undefined;
  const busy = status === 'verifying' || status === 'success';
  const canResend = left === 0 && !busy;

  const resend = () => {
    if (!canResend) return;
    onResend?.();
    setNote(words.resent(destination));
    if (!controlled && hasCode.current) {
      hasCode.current = false;
      onValueChange?.('');
    }
    setLeft(seconds);
    setRun((n) => n + 1);
  };

  const errorText = status === 'error' ? (error ?? words.error) : undefined;
  const announce =
    status === 'success' ? words.success
    : status === 'verifying' ? words.verifying
    : status === 'error' ? (typeof errorText === 'string' ? errorText : words.error)
    : note;
  const line =
    status === 'success' ? (
      <>
        <Icon name="check" size="sm" className={styles.mark} />
        {words.success}
      </>
    ) : status === 'verifying' ? (
      words.verifying
    ) : status === 'idle' ? (
      words.hint
    ) : null;

  return (
    <div
      ref={ref}
      id={rootId}
      role="group"
      aria-labelledby={titleId}
      data-component="OTPFlow"
      data-status={status}
      className={cx(styles.root, className)}
      style={style}
      {...rest}
    >
      <Heading id={titleId} level={level} className={styles.title}>{title ?? messages.otpFlow.title}</Heading>
      <div className={styles.window} data-ready={left === 0 || undefined}>
        <div>
          <p className={styles.sent}>{words.sentTo}</p>
          <p className={styles.destination}>{destination}</p>
        </div>
        <span className={styles.reading} aria-hidden="true">{clock(left)}</span>
      </div>
      <PinInput
        key={run}
        ref={fieldRef}
        className={styles.field}
        label={words.label}
        length={length}
        name={name}
        autoFocus={autoFocus}
        value={value}
        defaultValue={run === 0 ? defaultValue : undefined}
        readOnly={busy}
        error={errorText}
        aria-describedby={line != null ? lineId : undefined}
        onValueChange={(v) => { hasCode.current = v.length > 0; onValueChange?.(v); }}
        onComplete={(code) => onVerify?.(code)}
      />
      <div className={styles.line}>
        {line != null && <HelperText id={lineId}>{line}</HelperText>}
      </div>
      <div className={styles.actions}>
        <Button
          className={styles.resend}
          disabled={!canResend}
          aria-describedby={left > 0 ? waitId : undefined}
          onClick={resend}
        >
          {words.resend}
        </Button>
        {left > 0 && <VisuallyHidden id={waitId}>{words.wait(left)}</VisuallyHidden>}
      </div>
      <VisuallyHidden role="status" aria-live="polite" aria-atomic="true">{announce}</VisuallyHidden>
    </div>
  );
});
