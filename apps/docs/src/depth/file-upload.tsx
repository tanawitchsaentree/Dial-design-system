// Usage tab for FileUpload (component-depth.md U1–U14). FileUpload is a key and the list of files it chose.
import { Button, FileUpload, Stack } from 'dial-react';
import type { Depth } from './types';

const Unit = ({ children }: { children: React.ReactNode }) => <div className="demo-box demo-card">{children}</div>;
const pdf = (name: string, size: number) => new File([new ArrayBuffer(size)], name, { type: 'application/pdf' });
const plans = () => [pdf('ground-floor.pdf', 1200000), pdf('upstairs.pdf', 340000)];

export const FILE_UPLOAD: Depth = {
  overview: (
    <>
      <p>FileUpload lets a person attach files to a form, such as floor plans for a room or a firmware file for the hub. A key opens the system picker, and the files stand under it, each in a small window with its name, its size and a key to remove it.</p>
      <p>It does not send anything. It tells your code which files are chosen, and you do the upload and report how far it has got.</p>
    </>
  ),
  whenToUse: ['To attach one or more files to a form.', 'To show what is about to be sent, with a way to take a file back out.'],
  whenNot: [
    { situation: 'Choosing from a short list of known options', to: '/components/select', label: 'Select' },
    { situation: 'Showing how far a task has got, with no files to choose', to: '/components/progress', label: 'Progress' },
  ],
  variants: { na: 'FileUpload has one look: a key and a list of windows. One file or many is the multiple prop, covered under Modifiers.' },
  anatomy: {
    render: <FileUpload multiple label="Floor plans" hint="PDF, up to 2 MB each." defaultFiles={plans()} progress={(f) => (f.name === 'upstairs.pdf' ? 60 : undefined)} />,
    parts: [
      { part: 'Key', selector: '[data-component="FileUpload"] > [data-component="Button"]', what: 'Opens the system file picker.' },
      { part: 'Window', selector: '[data-component="FileUpload"] ul > li > div', what: 'A recess that reads out one file: name left, size right.' },
      { part: 'Remove key', selector: '[data-component="FileUpload"] ul > li > [data-component="IconButton"]', what: 'A 44px key that takes the file out of the list.' },
      { part: 'Progress', selector: '[data-component="FileUpload"] [data-component="Progress"]', what: 'An optional groove under the name, shown when progress returns a number.' },
    ],
  },
  sizes: { na: 'FileUpload has one size. The key, the windows and the remove keys are all at least 44px tall.' },
  emphasis: { na: 'FileUpload is never the unit’s loud part. The key is a plain key, and the orange belongs to the key that sends.' },
  placement: {
    rows: [['In a form', 'Under its label, above the orange key that sends the form.'], ['In a sheet', 'The list grows downward, so give it room below.']],
    examples: [{ title: 'Above the sending key', render: <Unit><Stack gap="lg"><FileUpload multiple label="Floor plans" defaultFiles={plans()} /><Button kind="primary">Send to the hub</Button></Stack></Unit> }],
  },
  combinations: {
    good: [['FileUpload + Progress', 'Pass progress and each window grows its own groove.'], ['FileUpload + Button', 'The orange key that sends stands under the list.']],
    avoid: [{ title: 'two FileUploads for the same files', why: 'The person cannot tell which list is sent. Use one with multiple.', render: <Unit><Stack gap="lg"><FileUpload label="Plan A" /><FileUpload label="Plan B" /></Stack></Unit> }],
  },
  content: {
    formula: <p>Label the group with what the files are for, as in <em>Floor plans</em>. Put the type, the size and the count in the hint.</p>,
    pair: {
      do: <FileUpload label="Floor plans" hint="PDF, up to 2 MB each." />, doNote: 'The label says what, the hint says the limits.',
      dont: <FileUpload label="Upload" />, dontNote: 'Upload says what the key does, not what the files are.',
    },
    overflow: { text: 'A long file name wraps inside its window. The size stays on the right and the remove key stays 44px.', render: <FileUpload label="Plans" defaultFiles={[pdf('upstairs-bedrooms-and-landing-plan-revision-seven-final-final.pdf', 340000)]} /> },
    rtl: { text: 'In right-to-left languages the remove key moves to the left of the window and the size to the left of the name.', render: <div dir="rtl"><FileUpload label="المخططات" buttonLabel="اختر ملفات" defaultFiles={[pdf('plan.pdf', 340000)]} /></div> },
    expansion: { text: 'German and Finnish words can run 30% longer. The key grows with its word, and the windows do not move.', render: <FileUpload label="Grundrisse" buttonLabel="Dateien auswählen" defaultFiles={[pdf('erdgeschoss.pdf', 340000)]} /> },
  },
  behaviours: {
    states: [
      ['Empty', 'Only the label and the key.', 'The key is announced with its hint.'],
      ['Chosen', 'One window per file with the name and size.', 'The files are read as a list.'],
      ['Refused', 'An error line under the list and no change to the list.', 'The line is announced without moving focus.'],
      ['Sending', 'A groove in the window of each file that has a number.', 'Announced as a progress bar with its percent.'],
      ['Disabled', 'The keys are off and the windows lose their shadow.', 'The keys are announced as unavailable.'],
    ],
    interactions: [
      ['Keyboard', 'Tab', 'Moves to the key, then to each remove key.', 'native'],
      ['Keyboard', 'Space or Enter', 'On the key it opens the picker. On a remove key it takes the file out and moves focus to the next remove key, or back to the key.', 'button'],
      ['Pointer', 'Click', 'The same as the keys above.', 'native'],
      ['Screen reader', 'Read', 'Read as a group named by the label, with the files as a list. A removal is announced.', 'role=group, aria-live'],
    ],
    loading: <p>FileUpload does not load anything. To show a send in progress, pass progress and each file gets its groove.</p>,
    focus: <p>Focus starts on the key. After a file is removed it goes to the remove key that took its place, or back to the key when the list is empty.</p>,
  },
  deepDive: { na: 'FileUpload has a single variant, so there is no section per variant.' },
  modifiers: [
    {
      name: 'multiple',
      rules: <p>Without it a new choice replaces the file. With it, choices add to the list and a file already in the list is not added twice.</p>,
      pair: { do: <FileUpload multiple label="Floor plans" defaultFiles={plans()} />, doNote: 'Several plans, so multiple.', dont: <FileUpload multiple label="Profile photo" />, dontNote: 'One photo does not need a list.' },
    },
    {
      name: 'maxSize, accept and maxFiles',
      rules: <p>They refuse files after the choice and print one error line per refusal. They do not change what the system picker shows by itself, so say the limits in the hint.</p>,
      pair: { do: <FileUpload label="Floor plan" hint="PDF, up to 2 MB." accept=".pdf" maxSize={2000000} />, doNote: 'The limits are in the hint and in the props.', dont: <FileUpload label="Floor plan" accept=".pdf" maxSize={2000000} />, dontNote: 'The person learns the limit only by being refused.' },
    },
    {
      name: 'progress',
      rules: <p>Return a number from 0 to 100 for a file that is being sent, and nothing for one that is not. FileUpload shows a groove and does no sending.</p>,
      pair: { do: <FileUpload multiple label="Backup" defaultFiles={plans()} progress={(f) => (f.name === 'upstairs.pdf' ? 60 : 100)} />, doNote: 'Every file has its own number.', dont: <FileUpload multiple label="Backup" defaultFiles={plans()} progress={() => 0} />, dontNote: 'A groove stuck at 0 looks like a failure.' },
    },
  ],
  related: [['/components/progress', 'Progress', 'How far a task has got.'], ['/components/button', 'Button', 'The key the picker opens from.'], ['/components/helper-text', 'HelperText', 'The lines under the list.']],
  references: [
    { title: 'MDN · input type=file', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file', why: 'What accept and multiple do, and what the browser enforces.' },
    { title: 'GOV.UK Design System · File upload', url: 'https://design-system.service.gov.uk/components/file-upload/', why: 'Labels, hints and error messages for file fields.' },
    { title: 'WCAG 2.2 · 3.3.1 Error Identification', url: 'https://www.w3.org/WAI/WCAG22/Understanding/error-identification.html', why: 'Why a refused file is named in text.' },
  ],
};
