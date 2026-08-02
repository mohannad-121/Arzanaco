import { createClient } from "@supabase/supabase-js";

const DEFAULT_QUOTE_RECIPIENT_EMAIL = "m.saadi@arzanaco.com";
const QUOTE_SENDER_ADDRESS = "quotes@mail.arzanaco.com";
const WHATSAPP_NUMBER = "966566676600";
const MAX_REQUESTS_PER_WINDOW = 5;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const MAX_FIELD_LENGTH = 160;
const MAX_EMAIL_LENGTH = 254;
const MAX_PHONE_LENGTH = 32;
const MAX_PRODUCT_DETAILS_LENGTH = 4000;
const MAX_ATTACHMENT_BYTES = 2.5 * 1024 * 1024;
const MAX_ATTACHMENT_FILENAME_LENGTH = 120;
const MAX_PROVIDER_ID_LENGTH = 160;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/u;
const PHONE_ALLOWED_PATTERN = /^[0-9+().\-\s]+$/u;
const PROVIDER_ID_PATTERN = /^[A-Za-z0-9_-]+$/u;
const BASE64_PATTERN = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/u;
const ALLOWED_ATTACHMENT_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "image/jpeg",
  "image/png",
]);
const requestTimesByIp = new Map<string, number[]>();

type QuoteLanguage = "en" | "ar";
type EmailStatus = "pending" | "sent" | "failed" | "configuration_error";
type SubmissionStatus = "received" | "completed" | "partially_completed" | "failed";

type QuoteRequest = {
  fullName: string;
  companyName: string;
  email: string;
  phone: string;
  productIds: string[];
  language: QuoteLanguage;
  productNames: string[];
  productDetails: string | null;
  attachment: QuoteAttachment | null;
};

type QuoteAttachment = {
  filename: string;
  content: string;
  contentType: string;
};

type QuoteValidation = { quote: QuoteRequest } | { errors: Record<string, string> };

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

type FetchResponse = {
  ok: boolean;
  status: number;
  json?: () => Promise<unknown>;
};

type FetchFunction = (
  input: string,
  init: {
    method: string;
    headers: Record<string, string>;
    body: string;
  },
) => Promise<FetchResponse>;

type SafeLogger = {
  info?: (event: string, context?: Record<string, unknown>) => void;
  warn?: (event: string, context?: Record<string, unknown>) => void;
  error?: (event: string, context?: Record<string, unknown>) => void;
};

type CatalogProduct = {
  id: string;
  nameEn: string;
  nameAr: string;
};

type CatalogModule = {
  findCatalogProduct?: (productId: string) => CatalogProduct | undefined;
};

type QuoteStorageClient = {
  from: (table: string) => {
    insert: (values: Record<string, unknown>) => {
      select: (columns: string) => {
        single: () => Promise<{
          data: { id?: unknown } | null;
          error: { code?: string } | null;
        }>;
      };
    };
    update: (values: Record<string, unknown>) => {
      eq: (column: string, value: string) => Promise<{
        error: { code?: string } | null;
      }>;
    };
  };
};

type CatalogStorageClient = {
  from: (table: "catalog_state") => {
    select: (columns: "data") => {
      eq: (column: "id", value: number) => {
        maybeSingle: () => Promise<{
          data: { data?: unknown } | null;
          error: { code?: string } | null;
        }>;
      };
    };
  };
};

type EmailDeliveryResult = {
  emailStatus: Exclude<EmailStatus, "pending">;
  errorCode: string | null;
  providerId: string | null;
};

let catalogModulePromise: Promise<CatalogModule> | undefined;
const REQUIRED_FALLBACK_PRODUCT_IDS = new Set(["p43"]);

/**
 * The approved catalog package is ESM. Keep this as a native runtime import so
 * Vercel does not transpile it into a CommonJS require call.
 */
async function getCatalogProductFinder(): Promise<NonNullable<CatalogModule["findCatalogProduct"]>> {
  catalogModulePromise ??= import("../lib/arzana-catalog/src/index.js") as Promise<CatalogModule>;
  const { findCatalogProduct } = await catalogModulePromise;

  if (typeof findCatalogProduct !== "function") {
    throw new Error("Approved catalog export is unavailable.");
  }

  return findCatalogProduct;
}

function isLiveCatalog(value: unknown): value is { products: CatalogProduct[] } {
  if (!value || typeof value !== "object") return false;
  const products = (value as { products?: unknown }).products;
  return Array.isArray(products) && products.every((product) =>
    product &&
    typeof product === "object" &&
    typeof (product as CatalogProduct).id === "string" &&
    typeof (product as CatalogProduct).nameEn === "string" &&
    typeof (product as CatalogProduct).nameAr === "string",
  );
}

/**
 * Quotes use the same current catalog document as the public website. The
 * bundled product list remains an emergency fallback only when Supabase is
 * unavailable or the catalog has not been seeded yet.
 */
async function getCurrentCatalogProductFinder(
  supabase: CatalogStorageClient | null,
): Promise<NonNullable<CatalogModule["findCatalogProduct"]>> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("catalog_state")
        .select("data")
        .eq("id", 1)
        .maybeSingle();
      if (!error && isLiveCatalog(data?.data)) {
        const productById = new Map(data.data.products.map((product) => [product.id, product]));
        const findBundledProduct = await getCatalogProductFinder();
        return (productId) =>
          productById.get(productId) ??
          (REQUIRED_FALLBACK_PRODUCT_IDS.has(productId) ? findBundledProduct(productId) : undefined);
      }
      if (error) logQuote("warn", "[quote] live catalog unavailable", { reason: error.code ?? "unknown" });
    } catch {
      logQuote("warn", "[quote] live catalog unavailable", { reason: "request_failed" });
    }
  }

  return getCatalogProductFinder();
}

/**
 * Handles POST /api/quote on Vercel. Quote data is persisted with the
 * server-only Supabase service-role key before any external delivery is tried.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  logQuote("info", "[quote] request received", { method: req.method ?? "unknown" });

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    sendJson(res, 405, {
      success: false,
      code: "METHOD_NOT_ALLOWED",
      message: "Method not allowed.",
    });
    return;
  }

  const body = readJsonBody(req.body);

  if (hasHoneypotValue(body.website)) {
    logQuote("warn", "[quote] request rejected", { reason: "honeypot" });
    sendJson(res, 400, {
      success: false,
      code: "HONEYPOT_REJECTED",
      message: "Unable to submit this quote request.",
    });
    return;
  }

  if (!isWithinRateLimit(getClientIp(req))) {
    logQuote("warn", "[quote] request rejected", { reason: "rate_limited" });
    sendJson(res, 429, {
      success: false,
      code: "RATE_LIMITED",
      message: "Too many quote requests. Please wait a few minutes and try again.",
    });
    return;
  }

  const supabase = createQuoteStorageClient();

  let validation: QuoteValidation;
  try {
    validation = await validateQuoteRequest(body, supabase as unknown as CatalogStorageClient | null);
  } catch {
    logQuote("error", "[quote] catalog unavailable", { reason: "module_import_failed" });
    sendJson(res, 503, {
      success: false,
      code: "QUOTE_SERVICE_UNAVAILABLE",
      message:
        "Quote validation is temporarily unavailable. Please try again later or contact Arzana directly.",
    });
    return;
  }

  if ("errors" in validation) {
    logQuote("warn", "[quote] request rejected", {
      reason: "validation_failed",
      fields: Object.keys(validation.errors),
    });
    sendJson(res, 400, {
      success: false,
      code: "VALIDATION_FAILED",
      message: "Please correct the highlighted quote details and try again.",
      errors: validation.errors,
    });
    return;
  }

  const emailDelivery = await sendQuoteEmail(validation.quote);
  if (emailDelivery.emailStatus !== "sent") {
    sendJson(res, 502, {
      success: false,
      code: "EMAIL_DELIVERY_FAILED",
      message: "We could not deliver your quote request by email.",
    });
    return;
  }

  // Email is the primary delivery path. Storage is attempted afterwards so an
  // unavailable database can never prevent a valid request reaching Arzana.
  const quoteId = supabase ? await insertQuoteRequest(supabase, validation.quote) : null;
  if (quoteId && supabase) {
    const statusSaved = await updateQuoteRequest(supabase, quoteId, {
      emailStatus: emailDelivery.emailStatus,
      whatsappStatus: "not_prepared",
      submissionStatus: "completed",
      emailProviderId: emailDelivery.providerId,
      errorCode: emailDelivery.errorCode,
    });
    if (!statusSaved) logQuote("error", "[quote] database status update failed", { quoteId });
  } else {
    logQuote("warn", "[quote] database storage unavailable after email delivery");
  }

  const referenceId = quoteId ?? emailDelivery.providerId ?? "email-" + Date.now().toString(36);
  sendJson(res, 200, {
    success: true,
    quoteId: referenceId,
    message: "Quote request delivered successfully.",
    productNames: validation.quote.productNames,
    whatsappUrl: buildWhatsAppUrl(validation.quote),
    emailStatus: emailDelivery.emailStatus,
    submissionStatus: "completed",
  });
}

async function validateQuoteRequest(
  body: Record<string, unknown>,
  supabase: CatalogStorageClient | null,
): Promise<QuoteValidation> {
  const errors: Record<string, string> = {};
  const fullName = cleanText(body.fullName, MAX_FIELD_LENGTH);
  const companyName = cleanText(body.companyName, MAX_FIELD_LENGTH);
  const email = cleanText(body.email, MAX_EMAIL_LENGTH);
  const phone = cleanText(body.phone, MAX_PHONE_LENGTH);
  const productDetails = cleanOptionalText(body.productDetails, MAX_PRODUCT_DETAILS_LENGTH);
  const attachment = readAttachment(body.attachment);
  const language = body.language === "ar" || body.language === "en" ? body.language : null;

  if (!fullName) errors.fullName = "A full name is required.";
  if (!companyName) errors.companyName = "A company name is required.";
  if (!email || !EMAIL_PATTERN.test(email)) errors.email = "A valid email address is required.";
  if (!isValidPhone(phone)) errors.phone = "A valid phone number is required.";
  if (typeof body.productDetails === "string" && body.productDetails.trim() && !productDetails) {
    errors.productDetails = "Product details are too long or invalid.";
  }
  if (attachment === "invalid") errors.attachment = "The attachment is invalid or exceeds the size limit.";
  if (!language) errors.language = "A supported language is required.";

  const productIds = Array.isArray(body.productIds)
    ? body.productIds.filter((productId): productId is string => typeof productId === "string")
    : [];

  if (productIds.length === 0) {
    errors.productIds = "Select at least one catalog product.";
  }

  const normalizedProductIds = productIds.map((productId) => productId.trim());
  if (
    normalizedProductIds.some((productId) => !productId) ||
    new Set(normalizedProductIds).size !== normalizedProductIds.length
  ) {
    errors.productIds = "Select valid catalog products.";
  }

  const findCatalogProduct = await getCurrentCatalogProductFinder(supabase);
  const selectedProducts = normalizedProductIds.map((productId) => findCatalogProduct(productId));
  if (selectedProducts.some((product) => !product)) {
    errors.productIds = "One or more selected products are not in the Arzana catalog.";
  }

  if (
    Object.keys(errors).length > 0 ||
    !fullName ||
    !companyName ||
    !email ||
    !phone ||
    !language
  ) {
    return { errors };
  }

  return {
    quote: {
      fullName,
      companyName,
      email,
      phone,
      productIds: normalizedProductIds,
      language,
      productNames: selectedProducts.map((product) =>
        language === "ar" ? product!.nameAr : product!.nameEn,
      ),
      productDetails,
      attachment: attachment === "invalid" ? null : attachment,
    },
  };
}

function createQuoteStorageClient(): QuoteStorageClient | null {
  const environment = getEnvironment();
  const supabaseUrl = environment?.SUPABASE_URL?.trim();
  const serviceRoleKey = environment?.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!supabaseUrl || !serviceRoleKey) return null;

  try {
    return createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
      },
    }) as unknown as QuoteStorageClient;
  } catch {
    return null;
  }
}

async function insertQuoteRequest(supabase: QuoteStorageClient, quote: QuoteRequest): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from("quote_requests")
      .insert({
        full_name: quote.fullName,
        company_name: quote.companyName,
        email: quote.email,
        phone: quote.phone,
        product_ids: quote.productIds,
        product_names: quote.productNames,
        language: quote.language,
        email_status: "pending",
        whatsapp_status: "not_prepared",
        submission_status: "received",
      })
      .select("id")
      .single();

    const quoteId = typeof data?.id === "string" ? data.id : null;
    if (error || !quoteId) {
      logQuote("error", "[quote] database initial insert failed", {
        reason: error?.code ?? "missing_quote_id",
      });
      return null;
    }

    return quoteId;
  } catch {
    logQuote("error", "[quote] database initial insert failed", { reason: "request_failed" });
    return null;
  }
}

async function updateQuoteRequest(
  supabase: QuoteStorageClient,
  quoteId: string,
  values: {
    emailStatus: Exclude<EmailStatus, "pending">;
    whatsappStatus: "prepared" | "not_prepared";
    submissionStatus: SubmissionStatus;
    emailProviderId: string | null;
    errorCode: string | null;
  },
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("quote_requests")
      .update({
        email_status: values.emailStatus,
        whatsapp_status: values.whatsappStatus,
        submission_status: values.submissionStatus,
        email_provider_id: values.emailProviderId,
        error_code: values.errorCode,
        updated_at: new Date().toISOString(),
      })
      .eq("id", quoteId);

    if (error) {
      logQuote("error", "[quote] database status update failed", { reason: error.code ?? "unknown" });
      return false;
    }

    return true;
  } catch {
    logQuote("error", "[quote] database status update failed", { reason: "request_failed" });
    return false;
  }
}

function readJsonBody(value: unknown): Record<string, unknown> {
  if (isRecord(value)) return value;

  if (typeof value !== "string") return {};

  try {
    const parsed: unknown = JSON.parse(value);
    return isRecord(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

function cleanText(value: unknown, maxLength: number): string | null {
  if (typeof value !== "string") return null;

  const cleaned = value
    .replace(/[\u0000-\u001F\u007F]/gu, " ")
    .replace(/\s+/gu, " ")
    .trim();

  return cleaned && cleaned.length <= maxLength ? cleaned : null;
}

function cleanOptionalText(value: unknown, maxLength: number): string | null {
  if (typeof value !== "string") return null;
  const cleaned = value
    .replace(/[\u0000-\u001F\u007F]/gu, " ")
    .replace(/\s+/gu, " ")
    .trim();
  return cleaned && cleaned.length <= maxLength ? cleaned : null;
}

function readAttachment(value: unknown): QuoteAttachment | null | "invalid" {
  if (value === undefined || value === null) return null;
  if (!isRecord(value)) return "invalid";

  const filename = cleanAttachmentFilename(value.filename);
  const content = typeof value.content === "string" ? value.content.trim() : "";
  const contentType = typeof value.contentType === "string" ? value.contentType.trim().toLowerCase() : "";
  const estimatedBytes = Math.floor((content.length * 3) / 4) - (content.endsWith("==") ? 2 : content.endsWith("=") ? 1 : 0);

  if (
    !filename ||
    !content ||
    content.length % 4 !== 0 ||
    !BASE64_PATTERN.test(content) ||
    estimatedBytes <= 0 ||
    estimatedBytes > MAX_ATTACHMENT_BYTES ||
    !ALLOWED_ATTACHMENT_TYPES.has(contentType)
  ) {
    return "invalid";
  }

  return { filename, content, contentType };
}

function cleanAttachmentFilename(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const filename = value
    .replace(/[\\/\u0000-\u001F\u007F]/gu, "-")
    .replace(/\s+/gu, " ")
    .trim();
  return filename && filename.length <= MAX_ATTACHMENT_FILENAME_LENGTH ? filename : null;
}

function isValidPhone(phone: string | null): phone is string {
  if (!phone || !PHONE_ALLOWED_PATTERN.test(phone)) return false;
  const digitCount = phone.replace(/\D/gu, "").length;
  return digitCount >= 7 && digitCount <= 15;
}

function hasHoneypotValue(value: unknown): boolean {
  return typeof value === "string" && value.trim().length > 0;
}

function getClientIp(req: VercelRequest): string {
  const forwardedFor = req.headers["x-forwarded-for"];
  const value = Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor;
  return value?.split(",")[0]?.trim() || req.socket?.remoteAddress || "unknown";
}

function isWithinRateLimit(ip: string): boolean {
  const now = Date.now();
  const recentRequests = (requestTimesByIp.get(ip) ?? []).filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS,
  );

  if (recentRequests.length >= MAX_REQUESTS_PER_WINDOW) {
    requestTimesByIp.set(ip, recentRequests);
    return false;
  }

  recentRequests.push(now);
  requestTimesByIp.set(ip, recentRequests);
  return true;
}

async function sendQuoteEmail(quote: QuoteRequest): Promise<EmailDeliveryResult> {
  const environment = getEnvironment();
  const resendApiKey = environment?.RESEND_API_KEY?.trim();
  const senderEmail = environment?.QUOTE_FROM_EMAIL?.trim();
  const recipientEmail = getQuoteRecipientEmail(environment);

  if (!resendApiKey || !senderEmail || !isExpectedSender(senderEmail)) {
    logQuote("error", "[quote] email configuration unavailable", {
      hasResendApiKey: Boolean(resendApiKey),
      hasSender: Boolean(senderEmail),
      senderMatchesVerifiedAddress: senderEmail ? isExpectedSender(senderEmail) : false,
    });
    return {
      emailStatus: "configuration_error",
      errorCode: "EMAIL_CONFIGURATION_ERROR",
      providerId: null,
    };
  }

  logQuote("info", "[quote] email delivery attempted", {
    language: quote.language,
    productCount: quote.productNames.length,
    hasProductDetails: Boolean(quote.productDetails),
    hasAttachment: Boolean(quote.attachment),
  });

  const fetchFunction = (globalThis as { fetch?: FetchFunction }).fetch;
  if (!fetchFunction) {
    logQuote("error", "[quote] email delivery failed", { reason: "fetch_unavailable" });
    return { emailStatus: "failed", errorCode: "EMAIL_DELIVERY_FAILED", providerId: null };
  }

  const submittedAt = new Date().toISOString();
  const languageLabel = quote.language === "ar" ? "Arabic" : "English";
  const text = [
    "New Quote Request - Arzana Co",
    "",
    "Full Name: " + quote.fullName,
    "Company Name: " + quote.companyName,
    "Email: " + quote.email,
    "Phone: " + quote.phone,
    "",
    "Interested Products:",
    ...quote.productNames.map((productName) => "- " + productName),
    "",
    "Product Details:",
    quote.productDetails ?? "Not provided",
    "",
    "Attached File:",
    quote.attachment ? quote.attachment.filename : "Not provided",
    "",
    "Submitted From: Arzana Website",
    "Submission Language: " + languageLabel,
    "Submission Date: " + submittedAt,
  ].join("\n");

  const html = [
    "<h1>New Quote Request - Arzana Co</h1>",
    "<p><strong>Full Name:</strong> " + escapeHtml(quote.fullName) + "</p>",
    "<p><strong>Company Name:</strong> " + escapeHtml(quote.companyName) + "</p>",
    "<p><strong>Email:</strong> " + escapeHtml(quote.email) + "</p>",
    "<p><strong>Phone:</strong> " + escapeHtml(quote.phone) + "</p>",
    "<p><strong>Interested Products:</strong></p>",
    "<ul>" + quote.productNames.map((productName) => "<li>" + escapeHtml(productName) + "</li>").join("") + "</ul>",
    "<p><strong>Product Details:</strong></p>",
    "<p style=\"white-space:pre-wrap\">" + escapeHtml(quote.productDetails ?? "Not provided") + "</p>",
    "<p><strong>Attached File:</strong> " + escapeHtml(quote.attachment?.filename ?? "Not provided") + "</p>",
    "<hr>",
    "<p><strong>Submitted From:</strong> Arzana Website</p>",
    "<p><strong>Submission Language:</strong> " + languageLabel + "</p>",
    "<p><strong>Submission Date:</strong> " + submittedAt + "</p>",
  ].join("");

  try {
    const response = await fetchFunction("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + resendApiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: senderEmail,
        to: [recipientEmail],
        reply_to: quote.email,
        subject: "New Quote Request - " + quote.fullName + " - " + quote.companyName,
        html,
        text,
        ...(quote.attachment
          ? {
              attachments: [
                {
                  filename: quote.attachment.filename,
                  content: quote.attachment.content,
                  content_type: quote.attachment.contentType,
                },
              ],
            }
          : {}),
      }),
    });

    if (!response.ok) {
      logQuote("error", "[quote] email delivery failed", { resendStatus: response.status });
      return { emailStatus: "failed", errorCode: "EMAIL_DELIVERY_FAILED", providerId: null };
    }

    logQuote("info", "[quote] email delivered");
    return {
      emailStatus: "sent",
      errorCode: null,
      providerId: await readProviderId(response),
    };
  } catch {
    logQuote("error", "[quote] email delivery failed", { reason: "network_error" });
    return { emailStatus: "failed", errorCode: "EMAIL_DELIVERY_FAILED", providerId: null };
  }
}

function buildWhatsAppUrl(quote: QuoteRequest): string {
  const message =
    quote.language === "ar"
      ? [
          "طلب عرض سعر جديد - شركة أرزانا",
          "",
          "الاسم الكامل:",
          quote.fullName,
          "اسم الشركة:",
          quote.companyName,
          "البريد الإلكتروني:",
          quote.email,
          "رقم الهاتف:",
          quote.phone,
          "المنتجات المطلوبة:",
          ...quote.productNames.map((productName) => "- " + productName),
          "",
          "المصدر:",
          "موقع أرزانا",
        ].join("\n")
      : [
          "New Quote Request - Arzana Co",
          "",
          "Full Name:",
          quote.fullName,
          "Company Name:",
          quote.companyName,
          "Email:",
          quote.email,
          "Phone:",
          quote.phone,
          "Interested Products:",
          ...quote.productNames.map((productName) => "- " + productName),
          "",
          "Source:",
          "Arzana Website",
        ].join("\n");

  return "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(message);
}

async function readProviderId(response: FetchResponse): Promise<string | null> {
  if (!response.json) return null;

  try {
    const payload = await response.json();
    const providerId = isRecord(payload) && typeof payload.id === "string" ? payload.id.trim() : "";
    return providerId.length <= MAX_PROVIDER_ID_LENGTH && PROVIDER_ID_PATTERN.test(providerId)
      ? providerId
      : null;
  } catch {
    return null;
  }
}

function getEnvironment(): Record<string, string | undefined> | undefined {
  return (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env;
}

function getQuoteRecipientEmail(environment: Record<string, string | undefined> | undefined): string {
  const configuredRecipient = environment?.QUOTE_TO_EMAIL?.trim();
  return configuredRecipient && EMAIL_PATTERN.test(configuredRecipient)
    ? configuredRecipient
    : DEFAULT_QUOTE_RECIPIENT_EMAIL;
}

function isExpectedSender(value: string): boolean {
  const address = value.match(/<\s*([^<>\s]+@[^<>\s]+)\s*>$/u)?.[1] ?? value.trim();
  return address.toLowerCase() === QUOTE_SENDER_ADDRESS;
}

function logQuote(level: keyof SafeLogger, event: string, context?: Record<string, unknown>) {
  const logger = (globalThis as { console?: SafeLogger }).console;
  logger?.[level]?.(event, context);
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/gu, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[character] ?? character;
  });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function sendJson(res: VercelResponse, statusCode: number, body: unknown) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(body));
}
