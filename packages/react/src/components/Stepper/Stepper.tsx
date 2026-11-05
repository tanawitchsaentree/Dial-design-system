import { type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../cx';
import { messages } from '../../messages';
import { Icon } from '../Icon';
import styles from './Stepper.module.css';

export type StepStatus = 'upcoming' | 'current' | 'done';

export interface StepperProps extends HTMLAttributes<HTMLOListElement> {
  /** The steps, in order. The numbers are counted by position. */
  children: ReactNode;
  /** Class name for the list. */
  className?: string;
  /** Inline style for the list. */
  style?: CSSProperties;
}

export interface StepProps extends Omit<HTMLAttributes<HTMLLIElement>, 'title'> {
  /** The step's printed name, level with its number window. */
  title: ReactNode;
  /** `current` is announced with aria-current="step"; `done` prints a check in the window. Default `upcoming`. */
  status?: StepStatus;
  /** The section's content, stood under the title. */
  children?: ReactNode;
  /** The word read out for a done step's check. Pass your own for another language. */
  doneLabel?: string;
}

/** Numbers the sections of a long form: a digit in a recessed window, a dotted rail down to the next. */
export function Stepper({ children, className, style, ...rest }: StepperProps) {
  return <ol data-component="Stepper" className={cx(styles.root, className)} style={style} {...rest}>{children}</ol>;
}

/** One step of a Stepper. */
export function Step({ title, status = 'upcoming', children, className, doneLabel = messages.stepDone, ...rest }: StepProps) {
  return (
    <li data-status={status} aria-current={status === 'current' ? 'step' : undefined} className={cx(styles.step, className)} {...rest}>
      <span className={styles.marker} aria-hidden={status === 'done' ? undefined : true}>
        {status === 'done' ? <Icon name="check" size="sm" label={doneLabel} /> : null}
      </span>
      <p className={styles.title}>{title}</p>
      <span className={styles.rail} aria-hidden="true" />
      {children != null && <div className={styles.body}>{children}</div>}
    </li>
  );
}
