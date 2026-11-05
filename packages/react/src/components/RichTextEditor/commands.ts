// Formatting commands for RichTextEditor, written with Selection and Range only (no document.execCommand).
// Every command takes the editing root and the current range, changes the DOM and returns the range to select next.
// Limits are on purpose and are listed in the docs: inline formats need a selection, a list changes as a whole,
// headings do not apply inside lists, and the toolbar's changes are not on the browser's undo stack.

export type InlineTag = 'strong' | 'em';
export type ListTag = 'ul' | 'ol';

const INLINE_NAMES: Record<InlineTag, string[]> = { strong: ['STRONG', 'B'], em: ['EM', 'I'] };

/** The current selection's range when it is inside `root`, else `null`. */
export function rangeIn(root: HTMLElement): Range | null {
  const sel = typeof window !== 'undefined' ? window.getSelection() : null;
  if (!sel || sel.rangeCount === 0) return null;
  const r = sel.getRangeAt(0);
  return root.contains(r.commonAncestorContainer) ? r : null;
}

/** Selects a range and returns it. */
export function select(r: Range): Range {
  const sel = window.getSelection();
  sel?.removeAllRanges();
  sel?.addRange(r);
  return r;
}

function closest(root: HTMLElement, node: Node | null, names: string[]): HTMLElement | null {
  let n: Node | null = node;
  while (n && n !== root) {
    if (n.nodeType === 1 && names.includes((n as Element).tagName)) return n as HTMLElement;
    n = n.parentNode;
  }
  return null;
}

/** The top-level block (a direct child of root) that holds a point. */
function topOf(root: HTMLElement, node: Node, offset: number): HTMLElement | null {
  if (node === root) return (root.children[Math.min(offset, root.children.length - 1)] as HTMLElement) ?? null;
  let n: Node | null = node;
  while (n && n.parentNode !== root) n = n.parentNode;
  return n && n.nodeType === 1 ? (n as HTMLElement) : null;
}

/** Wraps loose text and inline nodes that sit directly in root into paragraphs, and keeps the range on the same nodes. */
export function ensureBlocks(root: HTMLElement, r: Range | null): Range | null {
  const keep = r ? { sc: r.startContainer, so: r.startOffset, ec: r.endContainer, eo: r.endOffset } : null;
  let run: Node[] = [];
  const flush = () => {
    if (!run.length) return;
    if (run.every((n) => n.nodeType === 3 && !(n.nodeValue ?? '').trim())) { run = []; return; }
    const p = document.createElement('p');
    root.insertBefore(p, run[0]);
    run.forEach((n) => p.appendChild(n));
    run = [];
  };
  Array.from(root.childNodes).forEach((n) => {
    const block = n.nodeType === 1 && /^(P|H[1-6]|UL|OL|DIV|BLOCKQUOTE)$/.test((n as Element).tagName);
    if (block) flush();
    else run.push(n);
  });
  flush();
  if (!root.firstChild) root.innerHTML = '<p><br></p>';
  if (!keep) return null;
  try {
    const out = document.createRange();
    if (keep.sc === root || keep.ec === root || !root.contains(keep.sc) || !root.contains(keep.ec)) {
      out.setStart(root.firstChild as Node, 0);
      out.collapse(true);
    } else {
      out.setStart(keep.sc, keep.so);
      out.setEnd(keep.ec, keep.eo);
    }
    return select(out);
  } catch {
    return r;
  }
}

function textNodesIn(r: Range): Text[] {
  const host = r.commonAncestorContainer;
  if (host.nodeType === 3) return r.collapsed ? [] : [host as Text];
  const out: Text[] = [];
  const walker = document.createTreeWalker(host, NodeFilter.SHOW_TEXT);
  for (let n = walker.nextNode() as Text | null; n; n = walker.nextNode() as Text | null) {
    if (!r.intersectsNode(n)) continue;
    if (n === r.endContainer && r.endOffset === 0) continue;
    if (n === r.startContainer && r.startOffset === n.length) continue;
    out.push(n);
  }
  return out;
}

function unwrap(el: HTMLElement) {
  const parent = el.parentNode;
  if (!parent) return;
  while (el.firstChild) parent.insertBefore(el.firstChild, el);
  parent.removeChild(el);
}

function selectNodes(first: Text, last: Text, start: number, end: number): Range {
  const out = document.createRange();
  out.setStart(first, start);
  out.setEnd(last, end);
  return select(out);
}

/** Is the format on at the caret, or across the whole selection? */
export function inlineActive(root: HTMLElement, r: Range | null, tag: InlineTag): boolean {
  if (!r) return false;
  const names = INLINE_NAMES[tag];
  if (r.collapsed) return !!closest(root, r.startContainer, names);
  const nodes = textNodesIn(r).filter((t) => (t.nodeValue ?? '').trim());
  return nodes.length > 0 && nodes.every((t) => closest(root, t, names));
}

/** Turns bold or italic on or off for the selected text. A collapsed caret does nothing. Returns the range to select. */
export function toggleInline(root: HTMLElement, r: Range, tag: InlineTag): Range | null {
  if (r.collapsed) return null;
  const names = INLINE_NAMES[tag];
  let nodes = textNodesIn(r);
  if (!nodes.length) return null;
  const sc = r.startContainer;
  const so = r.startOffset;
  const ec = r.endContainer;
  const eo = r.endOffset;
  const first = nodes[0];
  const last = nodes[nodes.length - 1];
  const startAt = sc === first ? so : 0;
  const endAt = ec === last ? eo : last.length;
  if (inlineActive(root, r, tag)) {
    const found = new Set<HTMLElement>();
    nodes.forEach((t) => { const el = closest(root, t, names); if (el) found.add(el); });
    found.forEach(unwrap);
    return selectNodes(first, last, startAt, endAt);
  }
  // split the ends so the wrapped part is whole text nodes
  if (endAt < last.length) last.splitText(endAt);
  let head = first;
  if (startAt > 0) {
    head = first.splitText(startAt);
    nodes = nodes.map((n) => (n === first ? head : n));
  }
  const tail = nodes[nodes.length - 1];
  nodes.forEach((t) => {
    if (closest(root, t, names) || !t.parentNode) return;
    const w = document.createElement(tag);
    t.parentNode.insertBefore(w, t);
    w.appendChild(t);
  });
  return selectNodes(head, tail, 0, tail.length);
}

/** The link around the caret or the selection's start, if any. */
export function linkAt(root: HTMLElement, r: Range | null): HTMLAnchorElement | null {
  if (!r) return null;
  return closest(root, r.startContainer, ['A']) as HTMLAnchorElement | null;
}

/** Puts a link on the selection, edits the link the caret is in, or inserts the address as text when nothing is selected. */
export function applyLink(root: HTMLElement, r: Range, href: string): Range | null {
  const existing = linkAt(root, r);
  if (existing) { existing.setAttribute('href', href); return r; }
  const make = () => {
    const a = document.createElement('a');
    a.setAttribute('href', href);
    a.setAttribute('rel', 'noopener noreferrer');
    return a;
  };
  if (r.collapsed) {
    const a = make();
    a.textContent = href.replace(/^(mailto:|tel:)/, '');
    r.insertNode(a);
    const out = document.createRange();
    out.selectNodeContents(a);
    return select(out);
  }
  const a = make();
  try {
    r.surroundContents(a);
    const out = document.createRange();
    out.selectNodeContents(a);
    return select(out);
  } catch {
    const nodes = textNodesIn(r);
    if (!nodes.length) return null;
    const last = nodes[nodes.length - 1];
    const first = nodes[0];
    const endAt = r.endContainer === last ? r.endOffset : last.length;
    const startAt = r.startContainer === first ? r.startOffset : 0;
    if (endAt < last.length) last.splitText(endAt);
    let head = first;
    if (startAt > 0) {
      head = first.splitText(startAt);
      if (nodes[0] === first) nodes[0] = head;
    }
    nodes.forEach((t) => {
      if (!t.parentNode) return;
      const w = make();
      t.parentNode.insertBefore(w, t);
      w.appendChild(t);
    });
    const tail = nodes[nodes.length - 1];
    return selectNodes(head, tail, 0, tail.length);
  }
}

/** Takes the link off the selection, or off the link the caret is in. */
export function removeLink(root: HTMLElement, r: Range): Range {
  const found = new Set<HTMLElement>();
  const here = linkAt(root, r);
  if (here) found.add(here);
  textNodesIn(r).forEach((t) => { const a = closest(root, t, ['A']); if (a) found.add(a); });
  const sc = r.startContainer;
  const so = r.startOffset;
  const ec = r.endContainer;
  const eo = r.endOffset;
  found.forEach(unwrap);
  try {
    const out = document.createRange();
    out.setStart(sc, so);
    out.setEnd(ec, eo);
    return select(out);
  } catch {
    return r;
  }
}

/** The top-level blocks the range touches. A selection that ends at the very start of a block does not touch it. */
function touched(root: HTMLElement, r: Range): HTMLElement[] {
  const a = topOf(root, r.startContainer, r.startOffset);
  let b = topOf(root, r.endContainer, r.endOffset);
  if (!a || !b) return [];
  if (!r.collapsed && b !== a && r.endContainer !== root) {
    const probe = document.createRange();
    probe.setStart(b, 0);
    probe.setEnd(r.endContainer, r.endOffset);
    if (probe.toString() === '' && b.previousElementSibling) b = b.previousElementSibling as HTMLElement;
  }
  const out: HTMLElement[] = [];
  for (let n: Element | null = a; n; n = n.nextElementSibling) {
    out.push(n as HTMLElement);
    if (n === b) break;
  }
  return out;
}

/** Re-selects a range after blocks were swapped: containers that were replaced map to their replacement. */
type Snap = { sc: Node; so: number; ec: Node; eo: number };
// a live Range is moved by the DOM changes below, so its ends are copied first
const snap = (r: Range): Snap => ({ sc: r.startContainer, so: r.startOffset, ec: r.endContainer, eo: r.endOffset });
function reselect(s: Snap, swaps: Map<Node, Node>): Range {
  const m = (n: Node) => swaps.get(n) ?? n;
  const out = document.createRange();
  try {
    out.setStart(m(s.sc), s.so);
    out.setEnd(m(s.ec), s.eo);
  } catch {
    out.selectNodeContents(m(s.sc));
    out.collapse(true);
  }
  return select(out);
}

function swapTag(el: HTMLElement, tag: string, swaps: Map<Node, Node>): HTMLElement {
  const next = document.createElement(tag);
  while (el.firstChild) next.appendChild(el.firstChild);
  el.parentNode?.replaceChild(next, el);
  swaps.set(el, next);
  return next;
}

/** Is the caret (or the start of the selection) in this kind of list? */
export function listActive(root: HTMLElement, r: Range | null, tag: ListTag): boolean {
  if (!r) return false;
  return !!closest(root, r.startContainer, [tag.toUpperCase()]);
}

/** Is the caret (or the start of the selection) in a heading? */
export function headingActive(root: HTMLElement, r: Range | null): boolean {
  if (!r) return false;
  return !!closest(root, r.startContainer, ['H2']);
}

/** Makes the touched blocks a bulleted or numbered list, or plain paragraphs again when they already are that list. */
export function toggleList(root: HTMLElement, r: Range, tag: ListTag): Range {
  const blocks = touched(root, r);
  if (!blocks.length) return r;
  const s = snap(r);
  const swaps = new Map<Node, Node>();
  const name = tag.toUpperCase();
  if (blocks.every((b) => b.tagName === name)) {
    blocks.forEach((list) => {
      Array.from(list.children).forEach((li) => {
        const p = document.createElement('p');
        while (li.firstChild) p.appendChild(li.firstChild);
        swaps.set(li, p);
        list.parentNode?.insertBefore(p, list);
      });
      list.remove();
    });
    return reselect(s, swaps);
  }
  const list = document.createElement(tag);
  blocks[0].parentNode?.insertBefore(list, blocks[0]);
  blocks.forEach((b) => {
    if (b.tagName === 'UL' || b.tagName === 'OL') {
      Array.from(b.children).forEach((li) => list.appendChild(li));
      swaps.set(b, list);
    } else {
      const li = document.createElement('li');
      while (b.firstChild) li.appendChild(b.firstChild);
      list.appendChild(li);
      swaps.set(b, li);
    }
    b.remove();
  });
  return reselect(s, swaps);
}

/** Turns the touched paragraphs into headings, or back into paragraphs when they all are headings. Lists are left alone. */
export function toggleHeading(root: HTMLElement, r: Range): Range {
  const blocks = touched(root, r).filter((b) => b.tagName !== 'UL' && b.tagName !== 'OL');
  if (!blocks.length) return r;
  const s = snap(r);
  const swaps = new Map<Node, Node>();
  const to = blocks.every((b) => b.tagName === 'H2') ? 'p' : 'h2';
  blocks.forEach((b) => swapTag(b, to, swaps));
  return reselect(s, swaps);
}

/** Inserts sanitised HTML at the range. One paragraph goes in as text at the caret; several paragraphs land after the current block. */
export function insertHtml(root: HTMLElement, r: Range, html: string): Range | null {
  if (!html) return null;
  const tpl = document.createElement('template');
  tpl.innerHTML = html;
  const blocks = Array.from(tpl.content.children);
  if (!r.collapsed) r.deleteContents();
  if (blocks.length === 1 && blocks[0].tagName === 'P') {
    const frag = document.createDocumentFragment();
    while (blocks[0].firstChild) frag.appendChild(blocks[0].firstChild);
    const end = frag.lastChild;
    r.insertNode(frag);
    const out = document.createRange();
    if (end) out.setStartAfter(end);
    out.collapse(true);
    return select(out);
  }
  const host = topOf(root, r.startContainer, r.startOffset);
  const empty = host && !(host.textContent ?? '').trim();
  let anchor: Element | null = host;
  blocks.forEach((b) => {
    if (anchor) anchor.after(b);
    else root.appendChild(b);
    anchor = b;
  });
  if (empty && host) host.remove();
  const out = document.createRange();
  const tail = (anchor as Element | null) ?? root;
  out.selectNodeContents(tail);
  out.collapse(false);
  return select(out);
}
