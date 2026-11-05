// @example The sign-up form with every built-in word passed in German, and the problem words too
import { Card, SignUpForm } from 'dial-react';

export default function AuthFormsTranslated() {
  return (
    <div style={{ inlineSize: 'min(100%, var(--ds-layout-frame-md))' }}>
      <Card padding="lg">
        <SignUpForm
          askName={false}
          labels={{
            title: 'Konto anlegen',
            description: 'Das dauert eine Minute.',
            email: 'E-Mail',
            password: 'Passwort',
            passwordHint: (n) => `Mindestens ${n} Zeichen.`,
            confirm: 'Passwort wiederholen',
            mismatch: 'Die beiden Passwörter sind nicht gleich.',
            submit: 'Konto anlegen',
          }}
          sendingLabel="Wird gesendet"
          summaryTitle={(n) => (n === 1 ? 'Feld zu prüfen' : 'Felder zu prüfen')}
          messages={{ valueMissing: (label) => `${label} fehlt.`, typeMismatch: (label) => `${label} hat kein gültiges Format.` }}
        />
      </Card>
    </div>
  );
}
