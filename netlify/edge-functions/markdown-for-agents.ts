type NetlifyContext = {
  next: () => Promise<Response>;
};

const decodeEntities = (value: string) =>
  value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)));

const htmlToMarkdown = (html: string, sourceUrl: string) => {
  const title = decodeEntities(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim() ?? "Rast Creative Studio");
  const description = decodeEntities(
    html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["'][^>]*>/i)?.[1] ?? "",
  );
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1] ?? html.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i)?.[1] ?? html;

  let markdown = main
    .replace(/<(script|style|svg|noscript|template)\b[^>]*>[\s\S]*?<\/\1>/gi, "")
    .replace(/<!--([\s\S]*?)-->/g, "")
    .replace(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi, (_, level, text) => `\n${"#".repeat(Number(level))} ${text}\n`)
    .replace(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi, (_, href, text) => `[${text}](${new URL(href, sourceUrl).href})`)
    .replace(/<img\b[^>]*alt=["']([^"']*)["'][^>]*>/gi, (_, alt) => (alt ? `[Görsel: ${alt}]` : ""))
    .replace(/<li\b[^>]*>([\s\S]*?)<\/li>/gi, "\n- $1")
    .replace(/<blockquote\b[^>]*>([\s\S]*?)<\/blockquote>/gi, "\n> $1\n")
    .replace(/<(strong|b)\b[^>]*>([\s\S]*?)<\/\1>/gi, "**$2**")
    .replace(/<(em|i)\b[^>]*>([\s\S]*?)<\/\1>/gi, "*$2*")
    .replace(/<code\b[^>]*>([\s\S]*?)<\/code>/gi, "`$1`")
    .replace(/<br\s*\/?\s*>/gi, "  \n")
    .replace(/<hr\s*\/?\s*>/gi, "\n---\n")
    .replace(/<\/(p|div|section|article|header|footer|nav|ul|ol|figure)>/gi, "\n")
    .replace(/<[^>]+>/g, "");

  markdown = decodeEntities(markdown)
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n[ \t]+/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return `---\ntitle: ${JSON.stringify(title)}\nsource: ${JSON.stringify(sourceUrl)}\n---\n\n${description ? `${description}\n\n` : ""}${markdown}\n`;
};

export default async (request: Request, context: NetlifyContext) => {
  if (request.method !== "GET" || !request.headers.get("accept")?.toLowerCase().includes("text/markdown")) {
    return;
  }

  const response = await context.next();
  if (!response.ok || !response.headers.get("content-type")?.toLowerCase().includes("text/html")) {
    return response;
  }

  const markdown = htmlToMarkdown(await response.text(), request.url);
  const headers = new Headers(response.headers);
  headers.set("content-type", "text/markdown; charset=utf-8");
  headers.set("content-length", new TextEncoder().encode(markdown).byteLength.toString());
  headers.set("x-markdown-tokens", Math.max(1, Math.ceil(markdown.length / 4)).toString());
  headers.set("vary", "Accept");

  return new Response(markdown, { status: response.status, statusText: response.statusText, headers });
};

export const config = {
  path: "/*",
};
