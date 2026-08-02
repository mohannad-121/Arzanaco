import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';

const MAX_MESSAGE_LENGTH = 900;
const MAX_HISTORY_MESSAGES = 8;
const MAX_REQUESTS_PER_WINDOW = 12;
const WINDOW_MS = 15 * 60 * 1000;
const requestTimesByIp = new Map<string, number[]>();

type Language = 'en' | 'ar';
type Action = { label: string; url: string; type: 'link' };
type PublicProduct = { id: string; slug: string; categoryId: string; nameEn: string; nameAr: string; descriptionEn?: string; descriptionAr?: string; applicationsEn?: string[]; applicationsAr?: string[] };
type PublicCategory = { id: string; slug: string; nameEn: string; nameAr: string };
type PublicCatalog = { products: PublicProduct[]; categories: PublicCategory[] };
type VercelRequest = { method?: string; body?: unknown; headers: Record<string, string | string[] | undefined>; socket?: { remoteAddress?: string } };
type VercelResponse = { statusCode: number; setHeader(name: string, value: string): void; end(body: string): void };

const CONTACT_ACTIONS: Record<string, Action> = {
  whatsapp: { label: 'Contact Arzana on WhatsApp', url: 'https://wa.me/966566676600', type: 'link' },
  quote: { label: 'Request a Quote', url: '/request-quote', type: 'link' },
  contact: { label: 'Contact Arzana', url: '/contact', type: 'link' },
  map: { label: 'View on Map', url: 'https://maps.app.goo.gl/nPuY2zpt2Gx1axCY9', type: 'link' },
  phone: { label: 'Call Arzana', url: 'tel:+966566676600', type: 'link' },
  products: { label: 'Explore Products', url: '/products', type: 'link' },
  testing: { label: 'Testing & Commissioning', url: '/testing-commissioning', type: 'link' },
  safety: { label: 'Safety Systems', url: '/safety-systems', type: 'link' },
};

function json(res: VercelResponse, status: number, body: unknown) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}

function asObject(value: unknown): Record<string, unknown> { return value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {}; }
function clientIp(req: VercelRequest) { const forwarded = req.headers['x-forwarded-for']; return (Array.isArray(forwarded) ? forwarded[0] : forwarded)?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown'; }
function withinRateLimit(ip: string) { const now = Date.now(); const recent = (requestTimesByIp.get(ip) ?? []).filter((time) => now - time < WINDOW_MS); if (recent.length >= MAX_REQUESTS_PER_WINDOW) { requestTimesByIp.set(ip, recent); return false; } recent.push(now); requestTimesByIp.set(ip, recent); return true; }

function isCatalog(value: unknown): value is PublicCatalog {
  const candidate = asObject(value);
  return Array.isArray(candidate.products) && Array.isArray(candidate.categories) && candidate.products.every((product) => {
    const item = asObject(product); return typeof item.id === 'string' && typeof item.slug === 'string' && typeof item.categoryId === 'string' && typeof item.nameEn === 'string' && typeof item.nameAr === 'string';
  }) && candidate.categories.every((category) => {
    const item = asObject(category); return typeof item.id === 'string' && typeof item.slug === 'string' && typeof item.nameEn === 'string' && typeof item.nameAr === 'string';
  });
}

async function getPublicCatalog(): Promise<PublicCatalog | null> {
  const url = process.env.SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) return null;
  const supabase = createClient(url, key, { auth: { persistSession: false } });
  const { data, error } = await supabase.from('catalog_state').select('data').eq('id', 1).maybeSingle();
  if (error || !isCatalog(data?.data)) return null;
  return data.data;
}

function buildKnowledge(catalog: PublicCatalog, language: Language) {
  const products = catalog.products.map((product) => ({
    name: language === 'ar' ? product.nameAr : product.nameEn,
    slug: product.slug,
    category: language === 'ar' ? catalog.categories.find((category) => category.id === product.categoryId)?.nameAr : catalog.categories.find((category) => category.id === product.categoryId)?.nameEn,
    description: language === 'ar' ? product.descriptionAr : product.descriptionEn,
    applications: language === 'ar' ? product.applicationsAr : product.applicationsEn,
  }));
  return JSON.stringify({
    company: language === 'ar' ? 'شركة أرزانا العربية المحدودة، شركة هندسية سعودية متخصصة في توزيع الطاقة والطاقة الحرجة والبنية التحتية المعيارية والحلول الكهربائية الصناعية.' : 'Arzana Arabia Company Ltd. is a Saudi-based engineering company specializing in power distribution, critical power, modular infrastructure, and industrial electrical solutions.',
    services: language === 'ar' ? ['أنظمة السلامة والحماية من السقوط', 'اختبار وتشغيل المحطات الكهربائية'] : ['Safety & fall protection systems', 'Testing and commissioning of electrical substations'],
    contacts: { whatsapp: '+966 56 667 6600', phones: ['+966 56 667 6600', '+966 59 708 048', '+966 53 063 7156'], emails: ['m.saadi@arzanaco.com', 'Moath@arzanaco.com', 'projects@arzanaco.com'], address: language === 'ar' ? 'مبنى سيرفكورب رقم 13، مجمع ليسن فالي، الرياض، المملكة العربية السعودية' : 'Servcorp Building #13, Laysen Valley Complex, Riyadh, Saudi Arabia' },
    categories: catalog.categories.map((category) => ({ name: language === 'ar' ? category.nameAr : category.nameEn, slug: category.slug })),
    products,
  });
}

function safeActions(keys: unknown, catalog: PublicCatalog, language: Language): Action[] {
  if (!Array.isArray(keys)) return [];
  const actions: Action[] = [];
  for (const key of keys.slice(0, 3)) {
    if (typeof key !== 'string') continue;
    if (CONTACT_ACTIONS[key]) { actions.push({ ...CONTACT_ACTIONS[key], label: language === 'ar' ? ({ whatsapp: 'تواصل عبر واتساب', quote: 'طلب عرض سعر', contact: 'تواصل مع أرزانا', map: 'عرض الموقع على الخريطة', phone: 'اتصل بأرزانا', products: 'استعرض المنتجات', testing: 'الاختبار والتشغيل', safety: 'أنظمة السلامة' } as Record<string, string>)[key] : CONTACT_ACTIONS[key].label }); continue; }
    if (key.startsWith('product:')) { const product = catalog.products.find((item) => item.slug === key.slice(8)); const category = product && catalog.categories.find((item) => item.id === product.categoryId); if (product && category) actions.push({ label: language === 'ar' ? product.nameAr : product.nameEn, url: `/products/${category.slug}/${product.slug}`, type: 'link' }); }
  }
  return actions.filter((action, index, all) => all.findIndex((candidate) => candidate.url === action.url) === index);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); json(res, 405, { error: 'METHOD_NOT_ALLOWED' }); return; }
  if (!withinRateLimit(clientIp(req))) { json(res, 429, { error: 'RATE_LIMITED', message: 'Please wait a few minutes before sending another message.' }); return; }
  const body = asObject(req.body);
  const message = typeof body.message === 'string' ? body.message.trim() : '';
  const language: Language = body.language === 'ar' ? 'ar' : 'en';
  const history: OpenAI.Chat.ChatCompletionMessageParam[] = Array.isArray(body.history) ? body.history.slice(-MAX_HISTORY_MESSAGES).flatMap((item) => {
    const entry = asObject(item); return typeof entry.content === 'string' && (entry.role === 'user' || entry.role === 'assistant') && entry.content.length <= MAX_MESSAGE_LENGTH ? [{ role: entry.role as 'user' | 'assistant', content: entry.content }] : [];
  }) : [];
  if (!message || message.length > MAX_MESSAGE_LENGTH) { json(res, 400, { error: 'INVALID_MESSAGE' }); return; }
  if (!process.env.OPENAI_API_KEY?.trim()) { json(res, 503, { error: 'AI_UNAVAILABLE', message: language === 'ar' ? 'مساعد أرزانا الذكي غير متاح مؤقتاً. يرجى التواصل مع أرزانا عبر واتساب أو البريد الإلكتروني.' : 'ARZANA AI is temporarily unavailable. Please contact Arzana through WhatsApp or email.' }); return; }
  let catalog: PublicCatalog | null;
  try { catalog = await getPublicCatalog(); } catch { catalog = null; }
  if (!catalog) { json(res, 503, { error: 'AI_UNAVAILABLE', message: language === 'ar' ? 'مساعد أرزانا الذكي غير متاح مؤقتاً. يرجى التواصل مع أرزانا عبر واتساب أو البريد الإلكتروني.' : 'ARZANA AI is temporarily unavailable. Please contact Arzana through WhatsApp or email.' }); return; }
  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const completion = await client.chat.completions.create({ model: process.env.OPENAI_MODEL?.trim() || 'gpt-4.1-mini', temperature: 0.15, response_format: { type: 'json_object' }, messages: [
      { role: 'system', content: `You are ARZANA AI. Reply only in ${language === 'ar' ? 'Arabic' : 'English'} using the verified JSON knowledge below. Do not invent facts, specifications, prices, delivery times, certifications, founders, clients, or private data. If unavailable, say so plainly and suggest a quote or contact. Return strict JSON only: {"message":"short helpful answer","actionKeys":["quote"|"contact"|"whatsapp"|"map"|"phone"|"products"|"testing"|"safety"|"product:<verified product slug>"]}. Knowledge: ${buildKnowledge(catalog, language)}` },
      ...history,
      { role: 'user', content: message },
    ] });
    const answer = asObject(JSON.parse(completion.choices[0]?.message?.content || '{}'));
    const responseMessage = typeof answer.message === 'string' && answer.message.trim() ? answer.message.trim().slice(0, 2400) : (language === 'ar' ? 'لا تتوفر لدي معلومات موثقة كافية للإجابة عن ذلك. يرجى التواصل مع أرزانا للتأكيد.' : 'I do not have enough verified company information to answer that. Please contact Arzana for confirmation.');
    json(res, 200, { message: responseMessage, actions: safeActions(answer.actionKeys, catalog, language) });
  } catch {
    json(res, 502, { error: 'AI_UNAVAILABLE', message: language === 'ar' ? 'مساعد أرزانا الذكي غير متاح مؤقتاً. يرجى التواصل مع أرزانا عبر واتساب أو البريد الإلكتروني.' : 'ARZANA AI is temporarily unavailable. Please contact Arzana through WhatsApp or email.' });
  }
}
