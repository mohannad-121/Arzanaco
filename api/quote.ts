import { createClient } from "@supabase/supabase-js";

const QUOTE_RECIPIENT_EMAIL = "m.saadi@arzanaco.com";
const QUOTE_SENDER_ADDRESS = "quotes@mail.arzanaco.com";
const WHATSAPP_NUMBER = "966566676600";
const MAX_REQUESTS_PER_WINDOW = 5;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const MAX_FIELD_LENGTH = 160;
const MAX_EMAIL_LENGTH = 254;
const MAX_PHONE_LENGTH = 32;
const MAX_PROVIDER_ID_LENGTH = 160;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/u;
const PHONE_ALLOWED_PATTERN = /^[0-9+().\-\s]+$/u;
const PROVIDER_ID_PATTERN = /^[A-Za-z0-9_-]+$/u;
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

type EmailDeliveryResult = {
  emailStatus: Exclude<EmailStatus, "pending">;
  errorCode: string | null;
  providerId: string | null;
};

let catalogModulePromise: Promise<CatalogModule> | undefined;

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

  let validation: QuoteValidation;
  try {
    validation = await validateQuoteRequest(body);
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

  const supabase = createQuoteStorageClient();
  if (!supabase) {
    logQuote("error", "[quote] database unavailable", { reason: "configuration_missing" });
    sendJson(res, 503, {
      success: false,
      code: "DATABASE_SAVE_FAILED",
      message: "We could not save your quote request.",
    });
    return;
  }

  const quoteId = await insertQuoteRequest(supabase, validation.quote);
  if (!quoteId) {
    sendJson(res, 503, {
      success: false,
      code: "DATABASE_SAVE_FAILED",
      message: "We could not save your quote request.",
    });
    return;
  }

  const emailDelivery = await sendQuoteEmail(validation.quote);
  const whatsappUrl = buildWhatsAppUrl(validation.quote);
  const submissionStatus: SubmissionStatus =
    emailDelivery.emailStatus === "sent" ? "completed" : "partially_completed";

  const statusSaved = await updateQuoteRequest(supabase, quoteId, {
    emailStatus: emailDelivery.emailStatus,
    whatsappStatus: "prepared",
    submissionStatus,
    emailProviderId: emailDelivery.providerId,
    errorCode: emailDelivery.errorCode,
  });

  if (!statusSaved) {
    logQuote("error", "[quote] database status update failed", { quoteId });
  }

  const emailDelivered = emailDelivery.emailStatus === "sent";
  sendJson(res, 200, {
    success: true,
    quoteId,
    message: emailDelivered
      ? "Quote request delivered successfully."
      : "Quote request saved. Email delivery could not be confirmed; WhatsApp is ready.",
    productNames: validation.quote.productNames,
    whatsappUrl,
    emailStatus: emailDelivery.emailStatus,
    submissionStatus,
  });
}

async function validateQuoteRequest(body: Record<string, unknown>): Promise<QuoteValidation> {
  const errors: Record<string, string> = {};
  const fullName = cleanText(body.fullName, MAX_FIELD_LENGTH);
  const companyName = cleanText(body.companyName, MAX_FIELD_LENGTH);
  const email = cleanText(body.email, MAX_EMAIL_LENGTH);
  const phone = cleanText(body.phone, MAX_PHONE_LENGTH);
  const language = body.language === "ar" || body.language === "en" ? body.language : null;

  if (!fullName) errors.fullName = "A full name is required.";
  if (!companyName) errors.companyName = "A company or business name is required.";
  if (!email || !EMAIL_PATTERN.test(email)) errors.email = "A valid email address is required.";
  if (!isValidPhone(phone)) errors.phone = "A valid phone number is required.";
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

  const findCatalogProduct = await getCatalogProductFinder();
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
    "Company / Business: " + quote.companyName,
    "Email: " + quote.email,
    "Phone: " + quote.phone,
    "",
    "Interested Products:",
    ...quote.productNames.map((productName) => "- " + productName),
    "",
    "Submitted From: Arzana Website",
    "Submission Language: " + languageLabel,
    "Submission Date: " + submittedAt,
  ].join("\n");

  const html = [
    "<h1>New Quote Request - Arzana Co</h1>",
    "<p><strong>Full Name:</strong> " + escapeHtml(quote.fullName) + "</p>",
    "<p><strong>Company / Business:</strong> " + escapeHtml(quote.companyName) + "</p>",
    "<p><strong>Email:</strong> " + escapeHtml(quote.email) + "</p>",
    "<p><strong>Phone:</strong> " + escapeHtml(quote.phone) + "</p>",
    "<p><strong>Interested Products:</strong></p>",
    "<ul>" + quote.productNames.map((productName) => "<li>" + escapeHtml(productName) + "</li>").join("") + "</ul>",
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
        to: [QUOTE_RECIPIENT_EMAIL],
        reply_to: quote.email,
        subject: "New Quote Request - " + quote.fullName + " - " + quote.companyName,
        html,
        text,
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
          "اسم الشركة أو النشاط التجاري:",
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
          "Company / Business:",
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
  res.end(JSON.stringify(body));
}
