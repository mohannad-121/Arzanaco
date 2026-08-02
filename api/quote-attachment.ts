import { get } from "@vercel/blob";
import { createHmac, timingSafeEqual } from "node:crypto";
import { Readable } from "node:stream";

const QUOTE_ATTACHMENT_PREFIX = "quote-attachments/";
const SIGNATURE_PATTERN = /^[a-f0-9]{64}$/u;

type RequestLike = {
  method?: string;
  url?: string;
};

type ResponseLike = {
  statusCode: number;
  setHeader(name: string, value: string): void;
  end(body?: string): void;
};

/**
 * Streams a private quote attachment only after validating the signed link sent
 * to the quote recipient. The Blob read/write token remains server-only.
 */
export default async function handler(req: RequestLike, res: ResponseLike) {
  if (req.method !== "GET") {
    res.statusCode = 405;
    res.setHeader("Allow", "GET");
    res.end("Method not allowed.");
    return;
  }

  const query = new URL(req.url ?? "/", "https://arzanaco.com").searchParams;
  const pathname = query.get("pathname")?.trim() ?? "";
  const filename = query.get("filename")?.trim() ?? "";
  const signature = query.get("signature")?.trim() ?? "";
  const signingSecret = getEnvironment()?.QUOTE_ATTACHMENT_LINK_SECRET?.trim() || getEnvironment()?.BLOB_READ_WRITE_TOKEN?.trim();

  if (
    !signingSecret ||
    !pathname.startsWith(QUOTE_ATTACHMENT_PREFIX) ||
    pathname.length > 240 ||
    !isSafeFilename(filename) ||
    !SIGNATURE_PATTERN.test(signature) ||
    !hasValidSignature(pathname, filename, signature, signingSecret)
  ) {
    sendNotFound(res);
    return;
  }

  try {
    const result = await get(pathname, { access: "private" });
    if (!result || result.statusCode !== 200 || !result.stream) {
      sendNotFound(res);
      return;
    }

    res.statusCode = 200;
    res.setHeader("Content-Type", result.blob.contentType || "application/octet-stream");
    res.setHeader("Content-Length", result.blob.size.toString());
    res.setHeader("Content-Disposition", "attachment; filename*=UTF-8''" + encodeURIComponent(filename));
    res.setHeader("Cache-Control", "private, no-store");
    Readable.fromWeb(result.stream as never).pipe(res as unknown as NodeJS.WritableStream);
  } catch {
    sendNotFound(res);
  }
}

function hasValidSignature(pathname: string, filename: string, signature: string, secret: string): boolean {
  const expected = createHmac("sha256", secret).update(pathname + "\n" + filename).digest("hex");
  return timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}

function isSafeFilename(filename: string): boolean {
  return Boolean(filename) && filename.length <= 120 && !/[\\/\u0000-\u001F\u007F]/u.test(filename);
}

function getEnvironment(): Record<string, string | undefined> | undefined {
  return (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env;
}

function sendNotFound(res: ResponseLike) {
  res.statusCode = 404;
  res.setHeader("Cache-Control", "no-store");
  res.end("File not found.");
}
