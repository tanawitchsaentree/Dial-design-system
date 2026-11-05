// The whitelist sanitiser behind RichTextEditor. No dependency: it reads the HTML with the browser's own parser and
// writes back only p, h2, strong, em, a[href], ul, ol, li and br. Everything else is unwrapped or dropped.

const DROP = new Set(['script', 'style', 'template', 'iframe', 'object', 'embed', 'noscript', 'head', 'title', 'textarea', 'select', 'svg', 'math', 'button', 'input', 'form']);
const BLOCK = new Set(['p', 'div', 'blockquote', 'pre', 'section', 'article', 'header', 'footer', 'aside', 'main', 'figure', 'figcaption', 'table', 'tr', 'dl', 'dt', 'dd']);
const SAFE_PROTOCOLS = ['http:', 'https:', 'mailto:', 'tel:'];

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const escAttr = (s: string) => esc(s).replace(/"/g, '&quot;');

/** Turns what a person typed into an address a link can safely hold, or `null` when it cannot be one. Allowed: http, https, mailto, tel, and paths or fragments that start with / or #. */
export function safeHref(raw: string | null | undefined): string | null {
  const v = (raw ?? '').trim();
  if (!v || /\s/.test(v) || /[\u0000-\u001f]/.test(v)) return null;
  if (/^(\/(?!\/)|#)/.test(v)) return v;
  const scheme = /^([a-z][a-z0-9+.-]*):/i.exec(v);
  if (scheme) return SAFE_PROTOCOLS.includes(`${scheme[1].toLowerCase()}:`) ? v : null;
  if (v.startsWith('//')) return null;
  if (/^[^@/]+@[^@/]+\.[^@/]+$/.test(v)) return `mailto:${v}`;
  if (/^[+\d][\d-]{5,}$/.test(v)) return `tel:${v}`;
  if (!/^[^/.]+\.[^/]+/.test(v) && !/^localhost/.test(v)) return null;
  return `https://${v}`;
}

/** Plain text to editor HTML: one paragraph per line. */
export function textToHtml(text: string): string {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => `<p>${esc(line)}</p>`)
    .join('');
}

/** Without a DOM (server render) the text is kept and every tag is dropped. */
function stripTags(html: string): string {
  const text = html.replace(/<(script|style)[\s\S]*?<\/\1>/gi, '').replace(/<[^>]*>/g, '');
  return textToHtml(text.replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&'));
}

/**
 * Reduces any HTML to the editor's whitelist: `p`, `h2`, `strong`, `em`, `a` with a safe `href`, `ul`, `ol`, `li` and `br`.
 * Other headings become `h2`, `b` and `i` become `strong` and `em`, `div` becomes `p`, and unknown tags are unwrapped.
 * Scripts, styles, event handlers and style attributes are dropped. A nested list is flattened into its item. Empty
 * paragraphs are dropped, so an empty editor gives `''`. The output is stable: sanitising it again changes nothing.
 */
export function sanitizeHtml(html: string): string {
  if (!html) return '';
  if (typeof DOMParser === 'undefined') return stripTags(html);
  const doc = new DOMParser().parseFromString(`<body>${html}`, 'text/html');
  const blocks: string[] = [];
  let run = '';
  const flush = (tag: 'p' | 'h2' = 'p') => {
    const inner = run.replace(/^(\s|<br>)+|(\s|<br>)+$/g, '');
    run = '';
    if (inner.replace(/<[^>]*>/g, '').trim() !== '') blocks.push(`<${tag}>${inner}</${tag}>`);
  };
  const visit = (node: Node, inItem: boolean): void => {
    if (node.nodeType === 3) {
      run += esc((node.nodeValue ?? '').replace(/[\s ]+/g, ' '));
      return;
    }
    if (node.nodeType !== 1) return;
    const el = node as Element;
    const tag = el.tagName.toLowerCase();
    if (DROP.has(tag)) return;
    const kids = () => el.childNodes.forEach((c) => visit(c, inItem));
    if (tag === 'strong' || tag === 'b') { run += '<strong>'; kids(); run += '</strong>'; return; }
    if (tag === 'em' || tag === 'i') { run += '<em>'; kids(); run += '</em>'; return; }
    if (tag === 'a') {
      const href = safeHref(el.getAttribute('href'));
      if (!href) { kids(); return; }
      run += `<a href="${escAttr(href)}" rel="noopener noreferrer">`;
      kids();
      run += '</a>';
      return;
    }
    if (tag === 'br') { run += inItem ? ' ' : '<br>'; return; }
    if (tag === 'ul' || tag === 'ol') {
      if (inItem) { run += ' '; kids(); return; }
      flush();
      const items: string[] = [];
      el.childNodes.forEach((c) => {
        if (c.nodeType === 1 && (c as Element).tagName.toLowerCase() === 'li') {
          c.childNodes.forEach((k) => visit(k, true));
        } else visit(c, true);
        const inner = run.replace(/^\s+|\s+$/g, '');
        run = '';
        if (inner.replace(/<[^>]*>/g, '').trim() !== '') items.push(`<li>${inner}</li>`);
      });
      if (items.length) blocks.push(`<${tag}>${items.join('')}</${tag}>`);
      return;
    }
    if (/^h[1-6]$/.test(tag)) {
      if (inItem) { kids(); return; }
      flush(); kids(); flush('h2');
      return;
    }
    if (BLOCK.has(tag)) {
      if (inItem) { run += ' '; kids(); run += ' '; return; }
      flush(); kids(); flush();
      return;
    }
    kids();
  };
  doc.body.childNodes.forEach((n) => visit(n, false));
  flush();
  let out = blocks.join('');
  // repair tags left open across a block and merge neighbours that the toolbar split
  out = new DOMParser().parseFromString(`<body>${out}`, 'text/html').body.innerHTML;
  for (let i = 0; i < 4; i += 1) {
    out = out.replace(/<(strong|em)><\/\1>/g, '').replace(/<\/(strong|em)><\1>/g, '');
  }
  return out.replace(/ ?<br> ?/g, '<br>');
}
