import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";

const MAX_ATTACHMENT_BYTES = 100 * 1024 * 1024;
const QUOTE_ATTACHMENT_PREFIX = "quote-attachments/";
const MAX_UPLOAD_TOKENS_PER_WINDOW = 3;
const UPLOAD_RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const ALLOWED_ATTACHMENT_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "image/jpeg",
  "image/png",
];
const tokenRequestTimesByIp = new Map<string, number[]>();

type VercelRequest = {
  method?: string;
  body?: unknown;
  headers: Record<string, string | string[] | undefined>;
  socket?: { remoteAddress?: string };
};

type VercelResponse = {
  statusCode: number;
  setHeader(name: string, value: string): void;
  end(body: string): void;
};

/** Issues short-lived, tightly-scoped direct-upload tokens for quote files. */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.statusCode = 405;
    res.setHeader("Allow", "POST");
    res.end(JSON.stringify({ error: "Method not allowed." }));
    return;
  }

  if (!isWithinRateLimit(getClientIp(req))) {
    res.statusCode = 429;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(JSON.stringify({ error: "Too many upload attempts. Please wait a few minutes and try again." }));
    return;
  }

  try {
    const response = await handleUpload({
      body: req.body as HandleUploadBody,
      request: req as never,
      onBeforeGenerateToken: async (pathname) => {
        if (!pathname.startsWith(QUOTE_ATTACHMENT_PREFIX) || pathname.length > 240) {
          throw new Error("Invalid quote attachment path.");
        }

        return {
          allowedContentTypes: ALLOWED_ATTACHMENT_TYPES,
          maximumSizeInBytes: MAX_ATTACHMENT_BYTES,
          validUntil: Date.now() + 15 * 60 * 1000,
          addRandomSuffix: true,
        };
      },
    });

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(JSON.stringify(response));
  } catch {
    res.statusCode = 400;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(JSON.stringify({ error: "Unable to prepare the file upload." }));
  }
}

function getClientIp(req: VercelRequest): string {
  const forwardedFor = req.headers["x-forwarded-for"];
  const value = Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor;
  return value?.split(",")[0]?.trim() || req.socket?.remoteAddress || "unknown";
}

function isWithinRateLimit(ip: string): boolean {
  const now = Date.now();
  const recentRequests = (tokenRequestTimesByIp.get(ip) ?? []).filter(
    (timestamp) => now - timestamp < UPLOAD_RATE_LIMIT_WINDOW_MS,
  );

  if (recentRequests.length >= MAX_UPLOAD_TOKENS_PER_WINDOW) {
    tokenRequestTimesByIp.set(ip, recentRequests);
    return false;
  }

  recentRequests.push(now);
  tokenRequestTimesByIp.set(ip, recentRequests);
  return true;
}
