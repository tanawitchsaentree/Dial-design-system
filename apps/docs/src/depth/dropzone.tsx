// Usage tab for Dropzone (component-depth.md U1–U14). Dropzone is a tray window that takes dropped files.
import { Button, Dropzone, Input, Stack } from 'dial-react';
import type { Depth } from './types';

const Unit = ({ children }: { children: React.ReactNode }) => <div className="demo-box demo-card">{children}</div>;

export const DROPZONE: Depth = {
  overview: (
    <>
      <p>Dropzone takes files, such as a PDF of a boiler report or a few photos of a room. It is a tray window cut into the body, with a printed line that says what to do and a real key inside it that opens the file picker.</p>
      <p>Dragging is a shortcut. The key is always there, in the tab order, so a person who cannot drag still gets a file in.</p>
    </>
  ),
  whenToUse: ['To take one or more files that a person already has on their device.', 'To offer drag and drop and a visible way to choose, in one place.'],
  whenNot: [
    { situation: 'A single value typed in', to: '/components/input', label: 'Input' },
    { situation: 'Picking one of a known list of options', to: '/components/select', label: 'Select' },
  ],
  variants: { na: 'Dropzone has one look, a recessed tray. What it accepts and whether it is switched on are props, covered under Modifiers.' },
  anatomy: {
    render: <Dropzone />,
    parts: [
      { part: 'Tray', selector: '[data-component="Dropzone"]', what: 'A recess three keys tall, with a ring edge and shade on its top-left inner edge.' },
      { part: 'Glyph', selector: '[data-component="Dropzone"] > svg', what: 'A dot-matrix mark that changes shape while a file is held over.' },
      { part: 'Title', selector: '[data-component="Dropzone"] > p:first-of-type', what: 'What the tray does now. It changes while a file is held over.' },
      { part: 'Hint', selector: '[data-component="Dropzone"] > p:nth-of-type(2)', what: 'The other way in, in secondary ink.' },
      { part: 'Key', selector: '[data-component="Dropzone"] > button', what: 'A 44px key that opens the picker. It is in the tab order.' },
    ],
  },
  sizes: { na: 'Dropzone has one size. It takes the full width of its column and is three keys tall at least.' },
  emphasis: { na: 'The tray is never the loud part of a unit. Its key is an ordinary key, so the unit’s one orange stays on its main action.' },
  placement: {
    rows: [['A field of a form', 'Stands under the text fields, full width, with the orange key last.'], ['The body of a sheet', 'Stands alone when adding files is the sheet’s whole job.']],
    examples: [{ title: 'In a form', render: <Unit><Stack gap="lg"><Input label="Document name" defaultValue="Boiler service report" /><Dropzone accept=".pdf" /><Button kind="primary">Save</Button></Stack></Unit> }],
  },
  combinations: {
    good: [['Dropzone + Input', 'A name field above, the tray under it.'], ['Dropzone + Button', 'The orange key that saves comes after the tray.']],
    avoid: [{ title: 'two Dropzones side by side', why: 'Two trays make the person choose where to drop. Use one tray and sort the files afterwards.', render: <Unit><Stack gap="md"><Dropzone title="Drop photos" /><Dropzone title="Drop documents" /></Stack></Unit> }],
  },
  content: {
    formula: <p>Say what is taken, as in <em>Drop the PDF here</em>. Put the limit in <code>hint</code>, as in <em>One PDF, up to 10 MB</em>, and name the key after the same thing: <em>Choose a PDF</em>.</p>,
    pair: {
      do: <Dropzone title="Drop the PDF here" hint="One PDF, up to 10 MB" chooseLabel="Choose a PDF" />, doNote: 'The title, the limit and the key all name the same thing.',
      dont: <Dropzone title="Click or drag and drop your files into this area to upload" hint="" chooseLabel="Upload" />, dontNote: 'A long instruction, and a key that says Upload when nothing is sent yet.',
    },
    overflow: { text: 'Long words wrap inside the tray. The tray keeps its width and grows taller.', render: <Dropzone title="Drop the signed copy of the annual boiler service and gas safety report here" /> },
    rtl: { text: 'In right-to-left languages the words centre as before and the key keeps its place under them.', render: <div dir="rtl"><Dropzone title="أفلت الملفات هنا" hint="أو اخترها من هذا الجهاز" chooseLabel="اختر الملفات" /></div> },
    expansion: { text: 'German and Finnish words can run 30% longer. They wrap and the tray does not change width.', render: <Dropzone title="Dateien hier ablegen" hint="oder vom Gerät auswählen" chooseLabel="Dateien auswählen" /> },
  },
  behaviours: {
    states: [
      ['Rest', 'A recess with a ring edge and the title Drop files here.', 'The key is the only part in the tab order.'],
      ['Held over', 'The edge goes heavier, the glyph changes and the title reads Release to add.', 'Nothing moves or resizes. Never colour alone.'],
      ['Taken', 'The tray goes back to rest and onFilesDrop gets the files.', 'A polite status says how many files were added or not accepted.'],
      ['Focus', 'The key shows the same dark ring as every part.', 'The tray itself takes no focus.'],
      ['Disabled', 'The tray loses its shadow and fades to half.', 'No drop is taken and the key leaves the tab order.'],
    ],
    interactions: [
      ['Keyboard', 'Tab', 'Moves focus to the key.', 'native button'],
      ['Keyboard', 'Enter or Space', 'Opens the file picker from the key.', 'native button'],
      ['Pointer', 'Click on the tray', 'Opens the file picker, the same as the key.', 'onClick'],
      ['Pointer', 'Drop a file', 'Hands the files that pass accept to onFilesDrop and the rest to onFilesReject.', 'onDrop'],
      ['Screen reader', 'Read', 'A group named by its title, described by its hint, with the key inside it.', 'role group, aria-labelledby'],
    ],
    loading: <p>Dropzone has no loading state, because it only hands over files. Show the upload on a Progress next to it, and leave the tray as it is.</p>,
    focus: <p>Focus is never moved by the tray. After files are taken it stays on the key, and the status line announces the count.</p>,
  },
  deepDive: { na: 'Dropzone has a single variant, so there is no section per variant.' },
  modifiers: [
    {
      name: 'accept',
      rules: <p>Limits what is taken, in the format of a file input: <code>.pdf</code>, <code>image/*</code> or a type. Say the limit in <code>hint</code> too, because a dropped file that fails it is handed to <code>onFilesReject</code> and not taken.</p>,
      pair: { do: <Dropzone accept="image/*" title="Drop photos here" hint="Pictures only" />, doNote: 'The limit is in the hint.', dont: <Dropzone accept="image/*" />, dontNote: 'The tray says files, then turns pictures away.' },
    },
    {
      name: 'multiple',
      rules: <p>Takes several files at once. Off by default: the first file is taken and the rest go to <code>onFilesReject</code>. Turn it on only when the product can hold more than one.</p>,
      pair: { do: <Dropzone multiple title="Drop photos here" />, doNote: 'More than one file, and the title says photos.', dont: <Dropzone title="Drop photos here" />, dontNote: 'Photos in the plural, but only the first one is taken.' },
    },
    {
      name: 'disabled',
      rules: <p>Switches the tray and its key off. Say why in <code>hint</code>, since a person cannot press the key to find out.</p>,
      pair: { do: <Dropzone disabled hint="Uploads are paused while the sync runs" />, doNote: 'The hint gives the reason.', dont: <Dropzone disabled />, dontNote: 'Off with no reason given.' },
    },
  ],
  related: [['/components/input', 'Input', 'A short piece of text.'], ['/components/button', 'Button', 'The key inside the tray, and the action that saves.'], ['/components/progress', 'Progress', 'How far an upload has got.']],
  references: [
    { title: 'WCAG 2.2 · 2.5.7 Dragging Movements', url: 'https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html', why: 'Why the key is always there and drag is never the only way.' },
    { title: 'WCAG 2.2 · 1.4.1 Use of Color', url: 'https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html', why: 'Why a held-over file changes words and glyph as well as the edge.' },
    { title: 'MDN · HTML Drag and Drop API', url: 'https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API', why: 'How files reach the drop handler.' },
  ],
};
