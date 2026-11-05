import {
  Children,
  forwardRef,
  isValidElement,
  useCallback,
  useEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from 'react';
import { cx } from '../../cx';
import { messages } from '../../messages';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { Step, Stepper, type StepStatus } from '../Stepper';
import { VisuallyHidden } from '../VisuallyHidden';
import styles from './Wizard.module.css';

export interface WizardStepProps {
  /** The step's printed name. It is also the heading that takes focus when the step opens. */
  title: ReactNode;
  /** The step's fields. They stay mounted while the step is closed, so typed values are kept. */
  children?: ReactNode;
}

export interface WizardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'onChange'> {
  /** The `WizardStep` elements, in order. */
  children: ReactNode;
  /** Zero-based index of the open step, for a controlled Wizard. Pair it with `onCurrentChange`. */
  current?: number;
  /** Zero-based index of the step that opens first, for an uncontrolled Wizard. Default 0. */
  defaultCurrent?: number;
  /** Called with the new index when Back or Next moves to another step. */
  onCurrentChange?: (index: number) => void;
  /** Asked before Next or Finish leaves the step at `index`. Return false to keep the person here and print the blocked message. */
  canAdvance?: (index: number) => boolean;
  /** Called with the step's index when `canAdvance` returned false. */
  onBlocked?: (index: number) => void;
  /** Called when Finish is pressed on the last step and `canAdvance` allowed it. */
  onFinish?: () => void;
  /** Heading level of the open step's title, 2 to 6. Default 2. */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  /** Word on the Back key. Pass your own for another language. */
  backLabel?: string;
  /** Word on the Next key. */
  nextLabel?: string;
  /** Word on the Finish key, shown on the last step. */
  finishLabel?: string;
  /** Line printed when `canAdvance` stops the person. */
  blockedLabel?: string;
  /** Builds the hidden "Step 2 of 3" read out after the title. */
  stepLabel?: (position: number, total: number) => string;
  /** Name of the key row for assistive tech. */
  keysLabel?: string;
  /** Class name for the root. */
  className?: string;
}

/** One step of a Wizard. It only carries props; the Wizard prints it. */
export function WizardStep(_props: WizardStepProps): ReactElement | null {
  return null;
}

const isStep = (n: ReactNode): n is ReactElement<WizardStepProps> => isValidElement(n) && n.type === WizardStep;

/** A Stepper that opens one step at a time, with Back, Next and Finish keys under the rail. */
export const Wizard = forwardRef<HTMLDivElement, WizardProps>(function Wizard(
  {
    children,
    current,
    defaultCurrent = 0,
    onCurrentChange,
    canAdvance,
    onBlocked,
    onFinish,
    headingLevel = 2,
    backLabel = messages.wizard.back,
    nextLabel = messages.wizard.next,
    finishLabel = messages.wizard.finish,
    blockedLabel = messages.wizard.blocked,
    stepLabel = messages.wizard.stepOf,
    keysLabel = messages.wizard.keys,
    className,
    ...rest
  },
  ref,
) {
  const steps = Children.toArray(children).filter(isStep);
  const total = steps.length;
  const controlled = current !== undefined;
  const [inner, setInner] = useState(defaultCurrent);
  const raw = controlled ? current : inner;
  const index = Math.min(Math.max(raw, 0), Math.max(total - 1, 0));
  const [blocked, setBlocked] = useState(false);
  const heading = useRef<HTMLSpanElement | null>(null);
  const first = useRef(true);

  // focus follows the step: the new title is read out before its fields (not on first mount)
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    setBlocked(false);
    heading.current?.focus();
  }, [index]);

  const move = useCallback((to: number) => {
    if (to < 0 || to > total - 1 || to === index) return;
    if (!controlled) setInner(to);
    onCurrentChange?.(to);
  }, [controlled, index, onCurrentChange, total]);

  const advance = () => {
    if (canAdvance && !canAdvance(index)) { setBlocked(true); onBlocked?.(index); return; }
    setBlocked(false);
    if (index >= total - 1) onFinish?.();
    else move(index + 1);
  };

  const last = index >= total - 1;
  return (
    <div ref={ref} data-component="Wizard" className={cx(styles.root, className)} {...rest}>
      <Stepper>
        {steps.map((el, i) => {
          const status: StepStatus = i < index ? 'done' : i === index ? 'current' : 'upcoming';
          const open = i === index;
          const { title, children: body } = el.props;
          return (
            <Step
              key={el.key ?? i}
              className={styles.step}
              status={status}
              title={open ? (
                <span ref={heading} role="heading" aria-level={headingLevel} tabIndex={-1} className={styles.heading}>
                  {title}
                  <VisuallyHidden> {stepLabel(i + 1, total)}</VisuallyHidden>
                </span>
              ) : title}
            >
              <div className={styles.panel} hidden={!open}>
                {body}
                {open && (
                  <p role="status" className={styles.message} data-blocked={blocked ? 'true' : undefined}>
                    {blocked ? (<><Icon name="warning" size="sm" />{blockedLabel}</>) : null}
                  </p>
                )}
              </div>
            </Step>
          );
        })}
      </Stepper>
      <div role="group" aria-label={keysLabel} className={styles.keys}>
        <Button onClick={() => move(index - 1)} disabled={index === 0}>{backLabel}</Button>
        <Button kind={last ? 'primary' : 'key'} onClick={advance}>{last ? finishLabel : nextLabel}</Button>
      </div>
    </div>
  );
});
