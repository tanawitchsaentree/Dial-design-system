'use client';
import {
  forwardRef,
  useEffect,
  useId,
  useRef,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { cx } from '../../cx';
import { messages } from '../../messages';
import { Checkbox } from '../Checkbox';
import { Form, FormItem, FormSubmit, type FormErrors, type FormProps, type FormValues } from '../Form';
import { Heading, type HeadingLevel } from '../Heading';
import { Icon } from '../Icon';
import { Input } from '../Input';
import { Link } from '../Link';
import { PasswordInput } from '../PasswordInput';
import styles from './AuthForms.module.css';

/** What `onSubmit` may return: nothing, or `{ name: message }` for problems your server found, also from a promise. A promise keeps the key in its Sending state until it settles. */
export type AuthSubmitResult = void | FormErrors | Promise<void | FormErrors>;

/** Props every auth form shares. */
export interface AuthFormBaseProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onSubmit' | 'title' | 'children' | 'defaultValue'>,
    Pick<FormProps, 'messages' | 'summaryTitle' | 'sendingLabel'> {
  /** The screen's heading. Falls back to the built-in title for the form. */
  title?: ReactNode;
  /** Heading level of the title, 1 to 4. The error summary takes the next level. Default 3. */
  level?: HeadingLevel;
  /** The line under the title. Pass `null` to print nothing. Falls back to the built-in line. */
  description?: ReactNode;
  /** Class name for the outer wrapper. */
  className?: string;
  /** Inline style for the outer wrapper. */
  style?: CSSProperties;
}

/** Every word of the sign-in form. Pass only the ones you want to change. */
export interface SignInLabels {
  /** Default "Sign in". */
  title: ReactNode;
  /** Default "Use the email you signed up with." */
  description: ReactNode;
  /** The email field's label. Default "Email". */
  email: string;
  /** The password field's label. Default "Password". */
  password: string;
  /** The remember-me option. Default "Keep me signed in". */
  remember: string;
  /** The link to the reset screen. Default "Forgot password?". */
  forgot: ReactNode;
  /** The submit key. Default "Sign in". */
  submit: ReactNode;
  /** The words before the link to sign up. Default "No account yet?". */
  alternateText: ReactNode;
  /** The link to sign up. Default "Create an account". */
  alternate: ReactNode;
}

/** What the sign-in form hands to `onSubmit`. */
export interface SignInValues {
  /** The email as typed. */
  email: string;
  /** The password as typed. */
  password: string;
  /** Whether the remember-me option was on. Always false when `remember` is not shown. */
  remember: boolean;
}

export interface SignInFormProps extends AuthFormBaseProps {
  /** Called with the values once every field is right. The form does no network work: you sign the person in here. */
  onSubmit?: (values: SignInValues) => AuthSubmitResult;
  /** The email the field starts with. The fields keep their own state; read them in `onSubmit`. */
  defaultEmail?: string;
  /** Show the remember-me option. Default false. */
  remember?: boolean;
  /** Where the forgot-password link goes. Leave it out for no link. */
  forgotHref?: string;
  /** Your own forgot-password link, for example a router link in `Link asChild`. Wins over `forgotHref`. */
  forgotLink?: ReactNode;
  /** Where the link to the sign-up screen goes. Leave it out for no link. */
  alternateHref?: string;
  /** Your own link to the sign-up screen. Wins over `alternateHref`. */
  alternateLink?: ReactNode;
  /** Replace any of the built-in words, for example to translate them. */
  labels?: Partial<SignInLabels>;
}

/** Called with `id` and hooks the form's heading to it. */
function useIds(id: string | undefined) {
  const auto = useId();
  const root = id ?? auto;
  return { root, title: `${root}-title` };
}

const level2 = (level: HeadingLevel) => Math.min(level + 1, 5) as 2 | 3 | 4 | 5;

function LinkRow({ text, link }: { text?: ReactNode; link: ReactNode }) {
  if (link == null || link === false) return null;
  return (
    <div className={styles.alternate}>
      {text != null && <p className={styles.alternateText}>{text}</p>}
      {link}
    </div>
  );
}

/** The sign-in screen: an email, a password, an optional remember-me, a link to reset and the one primary key. It calls `onSubmit(values)` and does no network work. */
export const SignInForm = forwardRef<HTMLDivElement, SignInFormProps>(function SignInForm(
  { title, level = 3, description, onSubmit, defaultEmail, remember = false, forgotHref, forgotLink, alternateHref, alternateLink, labels, messages: constraintWords, summaryTitle, sendingLabel, id, className, style, ...rest },
  ref,
) {
  const words = { ...messages.authForms.signIn, ...labels };
  const ids = useIds(id);
  const forgot = forgotLink ?? (forgotHref != null ? <Link variant="standalone" href={forgotHref}>{words.forgot}</Link> : null);
  const other = alternateLink ?? (alternateHref != null ? <Link variant="standalone" href={alternateHref}>{words.alternate}</Link> : null);
  const lead = description === undefined ? words.description : description;

  return (
    <div ref={ref} id={ids.root} data-component="SignInForm" className={cx(styles.root, className)} style={style} {...rest}>
      <Heading id={ids.title} level={level} className={styles.title}>{title ?? words.title}</Heading>
      {lead != null && <p className={styles.description}>{lead}</p>}
      <Form
        aria-labelledby={ids.title}
        className={styles.form}
        messages={constraintWords}
        summaryTitle={summaryTitle}
        sendingLabel={sendingLabel}
        summaryLevel={level2(level)}
        onSubmit={(v: FormValues) => onSubmit?.({ email: String(v.email ?? ''), password: String(v.password ?? ''), remember: 'remember' in v })}
      >
        <div className={styles.fields}>
          <FormItem name="email">
            <Input label={words.email} type="email" autoComplete="username" autoCapitalize="none" spellCheck={false} required defaultValue={defaultEmail} />
          </FormItem>
          <FormItem name="password">
            <PasswordInput label={words.password} autoComplete="current-password" required />
          </FormItem>
          {remember && <Checkbox name="remember" label={words.remember} />}
        </div>
        <div className={styles.foot}>
          {forgot}
          <FormSubmit>{words.submit}</FormSubmit>
        </div>
      </Form>
      <LinkRow text={words.alternateText} link={other} />
    </div>
  );
});

/** Every word of the sign-up form. Pass only the ones you want to change. */
export interface SignUpLabels {
  /** Default "Create an account". */
  title: ReactNode;
  /** Default "It takes a minute." */
  description: ReactNode;
  /** The name field's label. Default "Name". */
  name: string;
  /** The email field's label. Default "Email". */
  email: string;
  /** The password field's label. Default "Password". */
  password: string;
  /** The rule printed under the password. Receives the minimum length. Default "At least 8 characters." */
  passwordHint: (n: number) => string;
  /** The repeat-password label. Default "Repeat the password". */
  confirm: string;
  /** The problem shown when the two passwords differ. Default "The two passwords are not the same." */
  mismatch: string;
  /** The submit key. Default "Create account". */
  submit: ReactNode;
  /** The words before the link to sign in. Default "Already have an account?". */
  alternateText: ReactNode;
  /** The link to sign in. Default "Sign in". */
  alternate: ReactNode;
}

/** What the sign-up form hands to `onSubmit`. The repeated password is checked and not passed on. */
export interface SignUpValues {
  /** The name as typed. An empty string when `askName` is false. */
  name: string;
  /** The email as typed. */
  email: string;
  /** The new password as typed. */
  password: string;
}

export interface SignUpFormProps extends AuthFormBaseProps {
  /** Called with the values once every field is right and the two passwords match. You create the account here. */
  onSubmit?: (values: SignUpValues) => AuthSubmitResult;
  /** Ask for a name. Default true. */
  askName?: boolean;
  /** The shortest password allowed, also printed in the rule under the field. Default 8. */
  minLength?: number;
  /** The email the field starts with. */
  defaultEmail?: string;
  /** Where the link to the sign-in screen goes. Leave it out for no link. */
  alternateHref?: string;
  /** Your own link to the sign-in screen. Wins over `alternateHref`. */
  alternateLink?: ReactNode;
  /** Replace any of the built-in words, for example to translate them. */
  labels?: Partial<SignUpLabels>;
}

/** The sign-up screen: a name, an email, a new password typed twice and the one primary key. Password managers are told to offer a new password. */
export const SignUpForm = forwardRef<HTMLDivElement, SignUpFormProps>(function SignUpForm(
  { title, level = 3, description, onSubmit, askName = true, minLength = 8, defaultEmail, alternateHref, alternateLink, labels, messages: constraintWords, summaryTitle, sendingLabel, id, className, style, ...rest },
  ref,
) {
  const words = { ...messages.authForms.signUp, ...labels };
  const ids = useIds(id);
  const other = alternateLink ?? (alternateHref != null ? <Link variant="standalone" href={alternateHref}>{words.alternate}</Link> : null);
  const lead = description === undefined ? words.description : description;

  return (
    <div ref={ref} id={ids.root} data-component="SignUpForm" className={cx(styles.root, className)} style={style} {...rest}>
      <Heading id={ids.title} level={level} className={styles.title}>{title ?? words.title}</Heading>
      {lead != null && <p className={styles.description}>{lead}</p>}
      <Form
        aria-labelledby={ids.title}
        className={styles.form}
        messages={constraintWords}
        summaryTitle={summaryTitle}
        sendingLabel={sendingLabel}
        summaryLevel={level2(level)}
        validate={(v) => (v.confirm !== '' && v.confirm !== v.password ? { confirm: words.mismatch } : undefined)}
        onSubmit={(v: FormValues) => onSubmit?.({ name: String(v.name ?? ''), email: String(v.email ?? ''), password: String(v.password ?? '') })}
      >
        <div className={styles.fields}>
          {askName && (
            <FormItem name="name">
              <Input label={words.name} autoComplete="name" required />
            </FormItem>
          )}
          <FormItem name="email">
            <Input label={words.email} type="email" autoComplete="email" autoCapitalize="none" spellCheck={false} required defaultValue={defaultEmail} />
          </FormItem>
          <FormItem name="password">
            <PasswordInput label={words.password} hint={words.passwordHint(minLength)} autoComplete="new-password" minLength={minLength} required />
          </FormItem>
          <FormItem name="confirm">
            <PasswordInput label={words.confirm} autoComplete="new-password" required />
          </FormItem>
        </div>
        <div className={styles.foot}>
          <FormSubmit>{words.submit}</FormSubmit>
        </div>
      </Form>
      <LinkRow text={words.alternateText} link={other} />
    </div>
  );
});

export type ResetPasswordMode = 'request' | 'choose';

/** Every word of the reset-password form. Pass only the ones you want to change. */
export interface ResetPasswordLabels {
  /** The title of the request screen. Default "Reset your password". */
  title: ReactNode;
  /** The line under the request title. Default "Enter your email and we send you a link." */
  description: ReactNode;
  /** The email field's label. Default "Email". */
  email: string;
  /** The key that asks for the link. Default "Send the link". */
  submit: ReactNode;
  /** The link back to sign in. Default "Back to sign in". */
  back: ReactNode;
  /** The confirmation after the link was sent. Receives the address that was typed. */
  sent: (email: string) => string;
  /** The title of the choose screen. Default "Choose a new password". */
  chooseTitle: ReactNode;
  /** The line under the choose title. Default "Pick one you have not used before." */
  chooseDescription: ReactNode;
  /** The new-password label. Default "New password". */
  password: string;
  /** The rule printed under the new password. Receives the minimum length. */
  passwordHint: (n: number) => string;
  /** The repeat label. Default "Repeat the new password". */
  confirm: string;
  /** The problem shown when the two passwords differ. */
  mismatch: string;
  /** The key that saves the password. Default "Save password". */
  chooseSubmit: ReactNode;
}

/** What the reset form hands to `onSubmit`: `email` in `request` mode, `password` in `choose` mode. */
export interface ResetPasswordValues {
  /** The address typed on the request screen. */
  email?: string;
  /** The new password typed on the choose screen. */
  password?: string;
}

export interface ResetPasswordFormProps extends AuthFormBaseProps {
  /** `request` (default) asks for the email so you can send a link. `choose` asks for a new password twice, for the page the link opens. */
  mode?: ResetPasswordMode;
  /** Called with the values once every field is right. In `request` mode send the link here; in `choose` mode save the password. */
  onSubmit?: (values: ResetPasswordValues) => AuthSubmitResult;
  /** In `request` mode, set it to true once you sent the link. The fields give way to a confirmation that names the address, and focus moves to it. */
  sent?: boolean;
  /** The shortest password allowed in `choose` mode, also printed in the rule. Default 8. */
  minLength?: number;
  /** The email the request field starts with. */
  defaultEmail?: string;
  /** Where the link back to sign in goes. Leave it out for no link. */
  backHref?: string;
  /** Your own link back to sign in. Wins over `backHref`. */
  backLink?: ReactNode;
  /** Replace any of the built-in words, for example to translate them. */
  labels?: Partial<ResetPasswordLabels>;
}

/** The reset-password screens: ask for the email to get a link, then choose a new password twice. It does no network work. */
export const ResetPasswordForm = forwardRef<HTMLDivElement, ResetPasswordFormProps>(function ResetPasswordForm(
  { mode = 'request', title, level = 3, description, onSubmit, sent = false, minLength = 8, defaultEmail, backHref, backLink, labels, messages: constraintWords, summaryTitle, sendingLabel, id, className, style, ...rest },
  ref,
) {
  const words = { ...messages.authForms.reset, ...labels };
  const ids = useIds(id);
  const choose = mode === 'choose';
  const last = useRef(defaultEmail ?? '');
  const sentRef = useRef<HTMLDivElement>(null);
  const wasSent = useRef(sent);
  const back = backLink ?? (backHref != null ? <Link variant="standalone" href={backHref}>{words.back}</Link> : null);
  const shown = sent && !choose;
  const lead = description === undefined ? (choose ? words.chooseDescription : words.description) : description;

  // The confirmation takes focus when it appears, so it is read out; it never steals focus on first render.
  useEffect(() => {
    if (shown && !wasSent.current) sentRef.current?.focus();
    wasSent.current = shown;
  }, [shown]);

  return (
    <div ref={ref} id={ids.root} data-component="ResetPasswordForm" data-mode={mode} data-sent={shown || undefined} className={cx(styles.root, className)} style={style} {...rest}>
      <Heading id={ids.title} level={level} className={styles.title}>{title ?? (choose ? words.chooseTitle : words.title)}</Heading>
      {!shown && lead != null && <p className={styles.description}>{lead}</p>}
      {shown ? (
        <>
          <div ref={sentRef} tabIndex={-1} className={styles.sent}>
            <Icon name="check" size="sm" className={styles.mark} />
            <span>{words.sent(last.current)}</span>
          </div>
          <LinkRow link={back} />
        </>
      ) : (
        <Form
          aria-labelledby={ids.title}
          className={styles.form}
          messages={constraintWords}
          summaryTitle={summaryTitle}
          sendingLabel={sendingLabel}
          summaryLevel={level2(level)}
          validate={choose ? (v) => (v.confirm !== '' && v.confirm !== v.password ? { confirm: words.mismatch } : undefined) : undefined}
          onSubmit={(v: FormValues) => {
            if (choose) return onSubmit?.({ password: String(v.password ?? '') });
            last.current = String(v.email ?? '');
            return onSubmit?.({ email: last.current });
          }}
        >
          <div className={styles.fields}>
            {choose ? (
              <>
                <FormItem name="password">
                  <PasswordInput label={words.password} hint={words.passwordHint(minLength)} autoComplete="new-password" minLength={minLength} required />
                </FormItem>
                <FormItem name="confirm">
                  <PasswordInput label={words.confirm} autoComplete="new-password" required />
                </FormItem>
              </>
            ) : (
              <FormItem name="email">
                <Input label={words.email} type="email" autoComplete="email" autoCapitalize="none" spellCheck={false} required defaultValue={defaultEmail} />
              </FormItem>
            )}
          </div>
          <div className={styles.foot}>
            {back}
            <FormSubmit>{choose ? words.chooseSubmit : words.submit}</FormSubmit>
          </div>
        </Form>
      )}
    </div>
  );
});
