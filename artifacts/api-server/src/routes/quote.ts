import { Router, type IRouter } from "express";
import { findCatalogProduct } from "@workspace/arzana-catalog";

const router: IRouter = Router();

const QUOTE_RECIPIENT_EMAIL = "m.saadi@arzanaco.com";
const MAX_REQUESTS_PER_WINDOW = 5;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const MAX_FIELD_LENGTH = 160;
const MAX_EMAIL_LENGTH = 254;
const MAX_PHONE_LENGTH = 32;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/u;
const PHONE_ALLOWED_PATTERN = /^[0-9+().\-\s]+$/u;
const requestTimesByIp = new Map<string, number[]>();

type QuoteLanguage = "en" | "ar";

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

router.post("/quote", async (req, res) => {
  const body = isRecord(req.body) ? req.body : {};

  if (hasHoneypotValue(body.website)) {
    res.status(400).json({ message: "Unable to submit this quote request." });
    return;
  }

  if (!isWithinRateLimit(req.ip ?? "unknown")) {
    res.status(429).json({
      message: "Too many quote requests. Please wait a few minutes and try again.",
    });
    return;
  }

  const validation = validateQuoteRequest(body);
  if ("errors" in validation) {
    res.status(400).json({
      message: "Please correct the highlighted quote details and try again.",
      errors: validation.errors,
    });
    return;
  }

  const deliveryResult = await sendQuoteEmail(validation.quote);
  if (deliveryResult === "not-configured") {
    res.status(503).json({
      message:
        "Quote email delivery is not configured yet. Please try again later or contact Arzana directly.",
    });
    return;
  }

  if (deliveryResult === "failed") {
    res.status(502).json({
      message:
        "We could not deliver your quote email. Your details are still available in this form—please try again.",
    });
    return;
  }

  res.status(201).json({
    success: true,
    productNames: validation.quote.productNames,
  });
});

function validateQuoteRequest(body: Record<string, unknown>): QuoteValidation {
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
  if (normalizedProductIds.some((productId) => !productId) || new Set(normalizedProductIds).size !== normalizedProductIds.length) {
    errors.productIds = "Select valid catalog products.";
  }

  const selectedProducts = normalizedProductIds.map((productId) => findCatalogProduct(productId));
  if (selectedProducts.some((product) => !product)) {
    errors.productIds = "One or more selected products are not in the Arzana catalog.";
  }

  if (Object.keys(errors).length > 0 || !fullName || !companyName || !email || !phone || !language) {
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

async function sendQuoteEmail(quote: QuoteRequest): Promise<"sent" | "not-configured" | "failed"> {
  const resendApiKey = process.env.RESEND_API_KEY?.trim();
  const senderEmail = process.env.QUOTE_FROM_EMAIL?.trim();

  if (!resendApiKey || !senderEmail) return "not-configured";

  const submittedAt = new Date().toISOString();
  const languageLabel = quote.language === "ar" ? "Arabic" : "English";
  const text = [
    "New Quote Request – Arzana Co",
    "",
    `Full Name: ${quote.fullName}`,
    `Company / Business: ${quote.companyName}`,
    `Email: ${quote.email}`,
    `Phone: ${quote.phone}`,
    "",
    "Interested Products:",
    ...quote.productNames.map((productName) => `- ${productName}`),
    "",
    "Submitted From: Arzana Website",
    `Submission Language: ${languageLabel}`,
    `Submission Date: ${submittedAt}`,
  ].join("\n");

  const html = [
    "<h1>New Quote Request – Arzana Co</h1>",
    `<p><strong>Full Name:</strong> ${escapeHtml(quote.fullName)}</p>`,
    `<p><strong>Company / Business:</strong> ${escapeHtml(quote.companyName)}</p>`,
    `<p><strong>Email:</strong> ${escapeHtml(quote.email)}</p>`,
    `<p><strong>Phone:</strong> ${escapeHtml(quote.phone)}</p>`,
    "<p><strong>Interested Products:</strong></p>",
    `<ul>${quote.productNames.map((productName) => `<li>${escapeHtml(productName)}</li>`).join("")}</ul>`,
    "<hr>",
    "<p><strong>Submitted From:</strong> Arzana Website</p>",
    `<p><strong>Submission Language:</strong> ${languageLabel}</p>`,
    `<p><strong>Submission Date:</strong> ${submittedAt}</p>`,
  ].join("");

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: senderEmail,
        to: [QUOTE_RECIPIENT_EMAIL],
        reply_to: quote.email,
        subject: `New Quote Request – ${quote.fullName} – ${quote.companyName}`,
        html,
        text,
      }),
    });

    return response.ok ? "sent" : "failed";
  } catch {
    return "failed";
  }
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

export default router;
