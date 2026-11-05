// @example Every built-in word passed in German through title and labels
import { OTPFlow } from 'dial-react';

export default function OTPFlowTranslated() {
  return (
    <OTPFlow
      title="Code eingeben"
      destination="+49 151 2345 6789"
      resendIn={20}
      labels={{
        label: 'Bestätigungscode',
        sentTo: 'Gesendet an',
        hint: 'Tippe die Ziffern oder füge den ganzen Code ein.',
        resend: 'Erneut senden',
        wait: (s) => `Ein neuer Code ist in ${s} Sekunden möglich.`,
        ready: 'Du kannst einen neuen Code senden.',
        resent: (d) => `Ein neuer Code wurde an ${d} gesendet.`,
        verifying: 'Der Code wird geprüft.',
        success: 'Bestätigt',
        error: 'Der Code stimmt nicht. Prüfe ihn und versuche es erneut.',
      }}
    />
  );
}
