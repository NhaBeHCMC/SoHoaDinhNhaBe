const unsafeBlocks = /<(script|iframe|object|embed|style)[\s\S]*?<\/\1>/gi;
const unsafeSingleTags = /<(script|iframe|object|embed|style)\b[^>]*>/gi;
const eventAttributes = /\son\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi;
const javascriptUrls = /\s(href|src)\s*=\s*(?:"javascript:[^"]*"|'javascript:[^']*'|javascript:[^\s>]+)/gi;
const htmlTags = /<[^>]+>/g;
const brTags = /<br\s*\/?>/gi;

export function sanitizeLegacyHtml(html: string): string {
  return html
    .replace(unsafeBlocks, "")
    .replace(unsafeSingleTags, "")
    .replace(eventAttributes, "")
    .replace(javascriptUrls, "");
}

export function legacyHtmlToText(html: string): string {
  return decodeHtmlEntities(
    sanitizeLegacyHtml(html)
      .replace(brTags, "\n")
      .replace(htmlTags, "")
      .replace(/\n{3,}/g, "\n\n")
      .trim()
  );
}

export function legacyHtmlToLines(html: string): string[] {
  return legacyHtmlToText(html)
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
}

export function decodeHtmlEntities(value: string): string {
  return value
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'");
}
