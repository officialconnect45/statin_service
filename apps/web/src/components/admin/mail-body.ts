import type { ClipboardEvent, KeyboardEvent } from "react";

/**
 * Mail bodies are plain text with **bold** markers; the API turns those into
 * <strong> (textToHtml in apps/api/src/mail.ts, which uses the same pattern).
 */
export const BOLD = /\*\*(?=\S)([^\n]*?\S)\*\*/g;

/**
 * Look of the sent email. Keep in step with textToHtml in apps/api/src/mail.ts
 * (FONT_STACK, font-size, color, LINK_STYLE, LINKABLE); the editor and the
 * preview both use these so they match what recipients get.
 */
export const MAIL_FONT = `'Trebuchet MS',sans-serif,Arial,-apple-system,BlinkMacSystemFont,Roboto,'Helvetica Neue',sans-serif`;
export const MAIL_FONT_SIZE = "14px";
export const MAIL_LINE_HEIGHT = 1.65;
export const MAIL_TEXT_COLOR = "#1f2933";
export const MAIL_LINK_COLOR = "#0b5cad";

const TLDS =
  "com|net|org|io|eu|se|studio|co|in|dev|app|online|site|store|shop|info|biz|nu|dk|no|fi|de|uk|fr|es|nl|ai|agency|design|tech|xyz|me|us|ca|au|digital|website|cloud|pro|work";
/** Full URLs, www.… and bare domains (pixelflow.studio) become links. Same pattern as the API. */
export const LINKABLE = new RegExp(
  `(https?:\\/\\/[^\\s<]+)|(?<![\\w@./-])((?:www\\.)?(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+(?:${TLDS})(?![\\w@-])(?:\\/[^\\s<]*)?)`,
  "gi",
);

/** Splits a matched link from the sentence punctuation after it. */
export function splitLink(match: string) {
  const [, url, trailing = ""] = match.match(/^(.*?)([.,;:!?)]*)$/) ?? [, match];
  return { url, trailing, href: /^https?:\/\//i.test(url) ? url : `https://${url}` };
}

const BLOCK = /^(P|DIV|LI|H[1-6]|TR|UL|OL|TABLE|BLOCKQUOTE)$/;

function isBoldElement(el: HTMLElement) {
  const weight = el.style.fontWeight;
  // Google Docs wraps everything in <b style="font-weight:normal">.
  if (weight === "normal" || (Number(weight) > 0 && Number(weight) < 600)) return false;
  return el.tagName === "B" || el.tagName === "STRONG" || weight === "bold" || Number(weight) >= 600;
}

/** Copied rich text (a web page, Google Docs, Word) → message text, keeping bold as **text**. */
export function richTextToMessage(html: string) {
  const doc = new DOMParser().parseFromString(html, "text/html");

  const walk = (node: Node, inBold: boolean): string => {
    if (node.nodeType === Node.TEXT_NODE) return (node.textContent ?? "").replace(/\s+/g, " ");
    if (!(node instanceof HTMLElement)) return "";
    if (node.tagName === "BR") return "\n";
    if (node.tagName === "STYLE" || node.tagName === "SCRIPT") return "";

    const bold = !inBold && isBoldElement(node);
    let inner = [...node.childNodes].map((child) => walk(child, inBold || bold)).join("");
    if (bold) {
      // Spaces stay outside the markers, so "** text**" never happens.
      const [, lead, core, trail] = inner.match(/^(\s*)([\s\S]*?)(\s*)$/) ?? ["", "", inner, ""];
      inner = core ? `${lead}**${core}**${trail}` : inner;
    }
    if (node.tagName === "P" || /^H[1-6]$/.test(node.tagName)) return `\n${inner}\n\n`;
    if (BLOCK.test(node.tagName)) return `\n${inner}\n`;
    return inner;
  };

  return walk(doc.body, false)
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n[ \t]+/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function replaceSelection(
  field: HTMLTextAreaElement,
  value: string,
  insert: string,
  setValue: (next: string) => void,
  select: [number, number],
) {
  const start = field.selectionStart;
  setValue(value.slice(0, start) + insert + value.slice(field.selectionEnd));
  requestAnimationFrame(() => field.setSelectionRange(start + select[0], start + select[1]));
}

/** Pasting formatted text keeps its bold; plain text pastes as usual. */
export function pasteKeepingBold(
  event: ClipboardEvent<HTMLTextAreaElement>,
  value: string,
  setValue: (next: string) => void,
) {
  const html = event.clipboardData.getData("text/html");
  if (!html) return;
  const text = richTextToMessage(html);
  if (!text.includes("**")) return;
  event.preventDefault();
  replaceSelection(event.currentTarget, value, text, setValue, [text.length, text.length]);
}

/** Ctrl/Cmd + B wraps the selection in **…**, or unwraps it if it is already bold. */
export function boldShortcut(
  event: KeyboardEvent<HTMLTextAreaElement>,
  value: string,
  setValue: (next: string) => void,
) {
  if (event.key.toLowerCase() !== "b" || !(event.ctrlKey || event.metaKey)) return;
  event.preventDefault();
  const field = event.currentTarget;
  const selected = value.slice(field.selectionStart, field.selectionEnd);
  const wrapped = /^\*\*[\s\S]+\*\*$/.test(selected);
  const core = wrapped ? selected.slice(2, -2) : selected;
  const insert = wrapped ? core : `**${core}**`;
  const offset = wrapped ? 0 : 2;
  replaceSelection(field, value, insert, setValue, [offset, offset + core.length]);
}
