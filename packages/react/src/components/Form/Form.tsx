'use client';
import {
  Children,
  cloneElement,
  createContext,
  forwardRef,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type FormHTMLAttributes,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
} from 'react';
import { cx } from '../../cx';
import { messages } from '../../messages';
import { Button, type ButtonProps } from '../Button';
import { FormField, type FormFieldControlProps, type FormFieldProps } from '../FormField';
import { VisuallyHidden } from '../VisuallyHidden';
import styles from './Form.module.css';

/** What `onSubmit` receives: one entry per named control, an array when a name repeats (checkboxes, multiple select). */
export type FormValues = Record<string, FormDataEntryValue | FormDataEntryValue[]>;
/** A problem per control name. */
export type FormErrors = Record<string, string>;

/** The constraints Form words for you. Each is a string, or a function of the field's printed name and its limit. */
export type FormConstraint = 'valueMissing' | 'typeMismatch' | 'patternMismatch' | 'tooShort' | 'tooLong' | 'rangeUnderflow' | 'rangeOverflow' | 'stepMismatch' | 'badInput';
export type FormMessages = Partial<Record<FormConstraint, string | ((label: string, limit: string) => string)>>;

type Field = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
interface Entry {
  label: string;
  message: string;
}
type Entries = Record<string, Entry>;

const CONSTRAINTS: FormConstraint[] = ['valueMissing', 'typeMismatch', 'patternMismatch', 'tooShort', 'tooLong', 'rangeUnderflow', 'rangeOverflow', 'stepMismatch', 'badInput'];

interface FormContextValue {
  errors: FormErrors;
  submitting: boolean;
  sendingLabel: string;
}
const FormContext = createContext<FormContextValue>({ errors: {}, submitting: false, sendingLabel: messages.form.sending });

const isField = (el: Element): el is Field => el instanceof HTMLInputElement || el instanceof HTMLSelectElement || el instanceof HTMLTextAreaElement;

/** The first control of each name, in the order of the form. Buttons, hidden inputs and disabled controls are left out. */
function fieldsOf(form: HTMLFormElement): Map<string, Field[]> {
  const out = new Map<string, Field[]>();
  for (const el of Array.from(form.elements)) {
    if (!isField(el) || !el.name || !el.willValidate) continue;
    if (el instanceof HTMLInputElement && (el.type === 'submit' || el.type === 'button' || el.type === 'reset' || el.type === 'image')) continue;
    out.set(el.name, [...(out.get(el.name) ?? []), el]);
  }
  return out;
}

/** The printed name of a control, without the required mark or the hidden words next to it. */
function labelOf(el: Field): string {
  const label = el.labels?.[0];
  if (label) {
    const copy = label.cloneNode(true) as HTMLElement;
    copy.querySelectorAll('[data-kind], [data-component="VisuallyHidden"]').forEach((n) => n.remove());
    const text = copy.textContent?.trim();
    if (text) return text;
  }
  return el.getAttribute('aria-label') ?? el.name;
}

function wording(el: Field, custom: FormMessages | undefined): string {
  const label = labelOf(el);
  for (const key of CONSTRAINTS) {
    if (!el.validity[key]) continue;
    const limit =
      key === 'tooShort' ? String((el as HTMLInputElement).minLength)
      : key === 'tooLong' ? String((el as HTMLInputElement).maxLength)
      : key === 'rangeUnderflow' ? String((el as HTMLInputElement).min)
      : key === 'rangeOverflow' ? String((el as HTMLInputElement).max)
      : '';
    const pick = custom?.[key] ?? messages.form[key];
    return typeof pick === 'function' ? pick(label, limit) : pick;
  }
  return el.validationMessage;
}

function valuesOf(form: HTMLFormElement): FormValues {
  const out: FormValues = {};
  new FormData(form).forEach((value, key) => {
    const had = out[key];
    out[key] = had === undefined ? value : Array.isArray(had) ? [...had, value] : [had, value];
  });
  return out;
}

/** Every problem in the form now, in the order of the fields: the browser's constraints worded by Form, then `validate`. */
function check(form: HTMLFormElement, custom: FormMessages | undefined, validate: FormProps['validate']): Entries {
  const found: Entries = {};
  const groups = fieldsOf(form);
  groups.forEach((els, name) => {
    const bad = els.find((el) => !el.validity.valid);
    if (bad) found[name] = { label: labelOf(bad), message: wording(bad, custom) };
  });
  const extra = validate?.(valuesOf(form)) ?? {};
  for (const [name, message] of Object.entries(extra)) {
    if (!message) continue;
    const first = groups.get(name)?.[0];
    found[name] = { label: first ? labelOf(first) : name, message };
  }
  return sortLike(form, found);
}

function sortLike(form: HTMLFormElement, entries: Entries): Entries {
  const order = Array.from(fieldsOf(form).keys());
  const rank = (name: string) => (order.indexOf(name) === -1 ? order.length : order.indexOf(name));
  return Object.fromEntries(Object.entries(entries).sort((a, b) => rank(a[0]) - rank(b[0])));
}

export interface FormProps extends Omit<FormHTMLAttributes<HTMLFormElement>, 'onSubmit' | 'noValidate' | 'children'> {
  /** The fields, usually `FormItem`s, and a `FormSubmit`. Any native control with a `name` is collected, wrapped or not. */
  children: ReactNode;
  /** Runs with the values once every field is right. Return a promise and the form stays in its sending state until it settles. Return an object of `{ name: message }` (also from the promise) to show problems the server found; they join the summary. */
  onSubmit?: (values: FormValues, event: FormEvent<HTMLFormElement>) => void | FormErrors | Promise<void | FormErrors>;
  /** Checks that the browser's constraints cannot express, such as two fields that must match. Receives the values; return `{ name: message }` for each problem, or nothing. Runs on submit and, after the first submit, on change. */
  validate?: (values: FormValues) => FormErrors | undefined | void;
  /** Your own words for the browser's constraints, per constraint, as a string or a function of the field's name and its limit. Anything you leave out uses the built-in English. */
  messages?: FormMessages;
  /** The words after the count in the summary heading. Receives the count. Default "field to fix before sending", plural "fields to fix before sending". */
  summaryTitle?: (count: number) => ReactNode;
  /** The heading level of the summary, 2 to 6. Default 2. */
  summaryLevel?: 2 | 3 | 4 | 5 | 6;
  /** The word read out and printed on the submit key while a send runs. Default "Sending". */
  sendingLabel?: string;
  /** Class name for the form. */
  className?: string;
}

/** A native form with no validation library: it words the browser's checks, tells every problem in one window at the top that takes focus, and holds the submit key while it sends. */
export const Form = forwardRef<HTMLFormElement, FormProps>(function Form(
  { children, onSubmit, validate, messages: custom, summaryTitle = messages.form.summaryTitle, summaryLevel = 2, sendingLabel = messages.form.sending, onChange, className, ...rest },
  ref,
) {
  const auto = useId();
  const formRef = useRef<HTMLFormElement | null>(null);
  const summaryRef = useRef<HTMLDivElement | null>(null);
  const sendingRef = useRef(false);
  const alive = useRef(true);
  const [entries, setEntries] = useState<Entries>({});
  const [attempted, setAttempted] = useState(false);
  const [sending, setSending] = useState(false);
  const [focusToken, setFocusToken] = useState(0);

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  // after a failed send the window takes focus, once the render that prints it has run
  useEffect(() => {
    if (focusToken > 0) summaryRef.current?.focus();
  }, [focusToken]);

  const setRefs = useCallback(
    (node: HTMLFormElement | null) => {
      formRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) ref.current = node;
    },
    [ref],
  );

  const show = (next: Entries) => {
    setEntries(next);
    if (Object.keys(next).length > 0) setFocusToken((t) => t + 1);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (sendingRef.current) return;
    setAttempted(true);
    const found = check(form, custom, validate);
    if (Object.keys(found).length > 0) return show(found);
    setEntries({});
    if (!onSubmit) return;
    sendingRef.current = true;
    setSending(true);
    try {
      const back = await onSubmit(valuesOf(form), event);
      if (back && typeof back === 'object' && alive.current) {
        const named: Entries = {};
        const groups = fieldsOf(form);
        for (const [name, message] of Object.entries(back)) {
          if (message) named[name] = { label: groups.get(name)?.[0] ? labelOf(groups.get(name)![0]) : name, message };
        }
        show(sortLike(form, named));
      }
    } finally {
      sendingRef.current = false;
      if (alive.current) setSending(false);
    }
  };

  // after the first send, the field that changed is checked again; problems already shown go as soon as they are fixed
  const handleChange = (event: ChangeEvent<HTMLFormElement>) => {
    onChange?.(event);
    if (!attempted || !formRef.current) return;
    const target = event.target as Partial<Field>;
    const now = check(formRef.current, custom, validate);
    setEntries((prev) => {
      const next: Entries = {};
      for (const name of Object.keys(now)) if (name in prev || name === target.name) next[name] = now[name];
      return next;
    });
  };

  const names = Object.keys(entries);
  const goTo = (event: MouseEvent<HTMLAnchorElement>, name: string) => {
    event.preventDefault();
    const found = formRef.current?.elements.namedItem(name);
    const el = found instanceof RadioNodeList ? found[0] : found;
    if (el instanceof HTMLElement) el.focus();
  };

  const context = useMemo<FormContextValue>(
    () => ({ errors: Object.fromEntries(Object.entries(entries).map(([name, e]) => [name, e.message])), submitting: sending, sendingLabel }),
    [entries, sending, sendingLabel],
  );
  const Heading = `h${summaryLevel}` as 'h2';
  const titleId = `${auto}-title`;

  return (
    <FormContext.Provider value={context}>
      <form ref={setRefs} noValidate aria-busy={sending || undefined} data-component="Form" data-sending={sending || undefined} className={cx(styles.root, className)} onSubmit={handleSubmit} onChange={handleChange} {...rest}>
        {names.length > 0 && (
          <div ref={summaryRef} tabIndex={-1} role="group" aria-labelledby={titleId} data-component="FormSummary" className={styles.summary}>
            <Heading id={titleId} className={styles.summaryTitle}>
              <span className={styles.count}>{names.length}</span> <span>{summaryTitle(names.length)}</span>
            </Heading>
            <ul className={styles.list}>
              {names.map((name) => {
                const field = formRef.current?.elements.namedItem(name);
                const first = field instanceof RadioNodeList ? field[0] : field;
                const id = first instanceof HTMLElement && first.id ? first.id : undefined;
                return (
                  <li key={name} className={styles.item}>
                    <a href={id ? `#${id}` : '#'} className={styles.link} aria-describedby={`${auto}-${name}`} onClick={(e) => goTo(e, name)}>
                      {entries[name].label}
                    </a>
                    <span id={`${auto}-${name}`} className={styles.message}>{entries[name].message}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
        {children}
        <VisuallyHidden role="status">{sending ? sendingLabel : ''}</VisuallyHidden>
      </form>
    </FormContext.Provider>
  );
});

export interface FormItemProps extends Omit<FormFieldProps, 'error' | 'children' | 'label'> {
  /** The control's `name`. The same name is how the problem found by the form reaches this field. Required. */
  name: string;
  /** The printed name. Set it to wrap a bare control in a `FormField`. Leave it out for a control that prints its own label and takes `error`, such as Input, Textarea or Select. */
  label?: ReactNode;
  /** One control. FormItem adds `name` and, without a `label`, the `error`. Pass a function to receive `name`, `error` and the wired ids and place them yourself. */
  children: ReactElement | ((control: FormFieldControlProps & { name: string; error: string | undefined }) => ReactNode);
}

/** One named field of a Form. It hands the form's problem for this name to the control, so the message prints under the field as well as in the summary. */
export const FormItem = forwardRef<HTMLDivElement, FormItemProps>(function FormItem({ name, label, children, ...rest }, ref) {
  const { errors } = useContext(FormContext);
  const error = errors[name];

  if (label == null) {
    const only = typeof children === 'function' ? children({ id: '', 'aria-describedby': undefined, 'aria-invalid': undefined, required: undefined, name, error }) : Children.only(children);
    return isValidElement(only) ? cloneElement(only as ReactElement<Record<string, unknown>>, { name, error }) : <>{only}</>;
  }
  return (
    <FormField ref={ref} label={label} error={error} {...rest}>
      {typeof children === 'function'
        ? (control) => children({ ...control, name, error })
        : cloneElement(Children.only(children) as ReactElement<Record<string, unknown>>, { name })}
    </FormField>
  );
});

export interface FormSubmitProps extends Omit<ButtonProps, 'type'> {
  /** The word on the key while a send runs. Default: the form's `sendingLabel`, "Sending". */
  sendingLabel?: string;
}

/** The submit key of a Form. It is the unit's one orange key by default; while a send runs it goes flat, says Sending and ignores presses. */
export const FormSubmit = forwardRef<HTMLButtonElement, FormSubmitProps>(function FormSubmit(
  { kind = 'primary', sendingLabel, children, className, onClick, ...rest },
  ref,
) {
  const { submitting, sendingLabel: formWord } = useContext(FormContext);
  return (
    <Button
      ref={ref}
      type="submit"
      kind={kind}
      aria-disabled={submitting || undefined}
      data-sending={submitting || undefined}
      className={cx(styles.submit, className)}
      onClick={(event) => {
        if (submitting) event.preventDefault();
        else onClick?.(event);
      }}
      {...rest}
    >
      {submitting ? (sendingLabel ?? formWord) : (children ?? messages.form.submit)}
    </Button>
  );
});
