import { createClient } from '@supabase/supabase-js';

/** Vercel compiles root API functions independently of workspace tsconfig files. */
declare const process: { env: Record<string, string | undefined> };

const MAX_MESSAGE_LENGTH = 900;
const MAX_REQUESTS_PER_WINDOW = 18;
const WINDOW_MS = 15 * 60 * 1000;
const requestTimesByIp = new Map<string, number[]>();

type Language = 'en' | 'ar';
type Action = { label: string; url: string; type: 'link' };
type PublicProduct = { id: string; slug: string; categoryId: string; nameEn: string; nameAr: string; descriptionEn?: string; descriptionAr?: string; applicationsEn?: string[]; applicationsAr?: string[] };
type PublicCategory = { id: string; slug: string; nameEn: string; nameAr: string };
type PublicCatalog = { products: PublicProduct[]; categories: PublicCategory[] };
type VercelRequest = { method?: string; body?: unknown; headers: Record<string, string | string[] | undefined>; socket?: { remoteAddress?: string } };
type VercelResponse = { statusCode: number; setHeader(name: string, value: string): void; end(body: string): void };

const CLIENTS = ['ABB', 'Alfanar', 'Algihaz Holding', 'Al Yamama', 'Al Bawani', 'EG&G Middle East', 'El Seif', 'HC Telecom', 'KEC', 'L&T Construction', 'Ministry of Media', 'Saudi Customs', 'Saudi Electricity Company', 'SANS', 'Safari', 'King Saud University', 'Princess Nourah University', 'Al Faisaliah Medical Systems', 'TDP'];
const CONTACTS = {
  whatsapp: '+966 56 667 6600',
  phones: ['+966 56 667 6600', '+966 59 708 0480', '+966 53 063 7156'],
  emails: ['m.saadi@arzanaco.com', 'moath@arzanaco.com', 'projects@arzanaco.com'],
  addressEn: 'Servcorp Building #13, Laysen Valley Complex, Riyadh 12329, Saudi Arabia',
  addressAr: 'مبنى سيرفكورب رقم 13، مجمع ليسن فالي، الرياض 12329، المملكة العربية السعودية',
};

function json(res: VercelResponse, status: number, body: unknown) { res.statusCode = status; res.setHeader('Content-Type', 'application/json; charset=utf-8'); res.setHeader('Cache-Control', 'no-store'); res.end(JSON.stringify(body)); }
function asObject(value: unknown): Record<string, unknown> { return value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {}; }
function getClientIp(req: VercelRequest) { const forwarded = req.headers['x-forwarded-for']; return (Array.isArray(forwarded) ? forwarded[0] : forwarded)?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown'; }
function withinRateLimit(ip: string) { const now = Date.now(); const recent = (requestTimesByIp.get(ip) ?? []).filter((time) => now - time < WINDOW_MS); if (recent.length >= MAX_REQUESTS_PER_WINDOW) { requestTimesByIp.set(ip, recent); return false; } recent.push(now); requestTimesByIp.set(ip, recent); return true; }
function isCatalog(value: unknown): value is PublicCatalog { const candidate = asObject(value); return Array.isArray(candidate.products) && Array.isArray(candidate.categories) && candidate.products.every((product) => { const item = asObject(product); return typeof item.id === 'string' && typeof item.slug === 'string' && typeof item.categoryId === 'string' && typeof item.nameEn === 'string' && typeof item.nameAr === 'string'; }) && candidate.categories.every((category) => { const item = asObject(category); return typeof item.id === 'string' && typeof item.slug === 'string' && typeof item.nameEn === 'string' && typeof item.nameAr === 'string'; }); }

async function getLiveCatalog(): Promise<PublicCatalog | null> {
  const url = process.env.SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) return null;
  const supabase = createClient(url, key, { auth: { persistSession: false } });
  const { data, error } = await supabase.from('catalog_state').select('data').eq('id', 1).maybeSingle();
  return !error && isCatalog(data?.data) ? data.data : null;
}

function actions(language: Language, keys: string[], catalog?: PublicCatalog): Action[] {
  const labels = language === 'ar'
    ? { quote: 'طلب عرض سعر', contact: 'تواصل مع أرزانا', whatsapp: 'تواصل عبر واتساب', map: 'عرض الموقع على الخريطة', phone: 'اتصل بأرزانا', email: 'إرسال بريد إلكتروني', products: 'استعرض المنتجات', testing: 'الاختبار والتشغيل', safety: 'أنظمة السلامة' }
    : { quote: 'Request a Quote', contact: 'Contact Arzana', whatsapp: 'Contact Arzana on WhatsApp', map: 'View on Map', phone: 'Call Arzana', email: 'Email Arzana', products: 'Explore Products', testing: 'Testing & Commissioning', safety: 'Safety Systems' };
  const fixed: Record<string, string> = { quote: '/request-quote', contact: '/contact', whatsapp: 'https://wa.me/966566676600', map: 'https://maps.app.goo.gl/nPuY2zpt2Gx1axCY9', phone: 'tel:+966566676600', email: 'mailto:m.saadi@arzanaco.com', products: '/products', testing: '/testing-commissioning', safety: '/safety-systems' };
  const result: Action[] = [];
  for (const key of keys) {
    if (fixed[key]) result.push({ label: labels[key as keyof typeof labels], url: fixed[key], type: 'link' });
    if (key.startsWith('product:') && catalog) { const product = catalog.products.find((item) => item.slug === key.slice(8)); const category = product && catalog.categories.find((item) => item.id === product.categoryId); if (product && category) result.push({ label: language === 'ar' ? product.nameAr : product.nameEn, url: `/products/${category.slug}/${product.slug}`, type: 'link' }); }
  }
  return result.filter((item, index, all) => all.findIndex((other) => other.url === item.url) === index).slice(0, 3);
}

function has(text: string, expressions: string[]) { return expressions.some((expression) => text.includes(expression)); }
function welcome(language: Language) { return language === 'ar' ? 'مرحبًا بك في بوت أرزانا. يمكنني مساعدتك في المنتجات والخدمات وأنظمة السلامة والاختبار والتشغيل والعملاء وطرق التواصل وطلب عرض السعر.' : 'Welcome to Arzana Bot. I can help with products, services, safety systems, testing and commissioning, clients, contact details, and quotation requests.'; }
function productSearch(query: string, language: Language, catalog: PublicCatalog) {
  const terms = query.toLowerCase().split(/\s+/).filter((term) => term.length > 2 && !['what', 'with', 'about', 'show', 'tell', 'please', 'اريد', 'عن', 'من', 'على', 'الى', 'كيف', 'ماهي'].includes(term));
  return catalog.products.map((product) => {
    const haystack = [product.nameEn, product.nameAr, product.descriptionEn ?? '', product.descriptionAr ?? '', ...(product.applicationsEn ?? []), ...(product.applicationsAr ?? [])].join(' ').toLowerCase();
    return { product, score: terms.reduce((score, term) => score + (haystack.includes(term) ? 1 : 0), 0) };
  }).filter((item) => item.score > 0).sort((a, b) => b.score - a.score).slice(0, 3).map((item) => item.product);
}

function answer(message: string, language: Language, catalog: PublicCatalog): { message: string; actions: Action[] } {
  const query = message.toLowerCase();
  const ar = language === 'ar';
  if (has(query, ['hello', 'hi', 'welcome', 'مرحبا', 'اهلا', 'السلام'])) return { message: welcome(language), actions: actions(language, ['products', 'quote']) };
  if (has(query, ['founder', 'founders', 'owner', 'مؤسس', 'المؤسسين', 'المالك'])) return { message: ar ? 'لا تتوفر معلومات عن المؤسسين ضمن معرفة الموقع العامة المتحقق منها حاليًا. يمكنني مساعدتك في المنتجات والخدمات وطرق التواصل.' : 'Verified founder information is not currently available in the public website knowledge. I can help with products, services, and contact details.', actions: actions(language, ['contact']) };
  if (has(query, ['whatsapp', 'واتساب', 'واتس'])) return { message: ar ? `رقم واتساب أرزانا المعتمد هو ${CONTACTS.whatsapp}.` : `Arzana’s approved WhatsApp number is ${CONTACTS.whatsapp}.`, actions: actions(language, ['whatsapp', 'quote']) };
  if (has(query, ['map', 'location', 'address', 'where', 'خريطة', 'الموقع', 'العنوان', 'اين', 'أين'])) return { message: ar ? `عنوان أرزانا: ${CONTACTS.addressAr}.` : `Arzana’s address is ${CONTACTS.addressEn}.`, actions: actions(language, ['map', 'contact']) };
  if (has(query, ['phone', 'call', 'email', 'contact', 'رقم', 'هاتف', 'اتصال', 'البريد', 'تواصل'])) return { message: ar ? `يمكنك التواصل عبر الأرقام التالية: ${CONTACTS.phones.join('، ')}. البريد الإلكتروني: ${CONTACTS.emails.join('، ')}.` : `You can contact Arzana on ${CONTACTS.phones.join(', ')}. Email: ${CONTACTS.emails.join(', ')}.`, actions: actions(language, ['phone', 'email', 'whatsapp']) };
  if (has(query, ['quote', 'price', 'pricing', 'request', 'عرض سعر', 'سعر', 'طلب'])) return { message: ar ? 'للحصول على سعر أو تأكيد فني، أرسل المنتجات المطلوبة وبيانات التواصل من نموذج طلب عرض السعر.' : 'For pricing or technical confirmation, send the required products and your contact details through the Request a Quote form.', actions: actions(language, ['quote', 'whatsapp']) };
  if (has(query, ['client', 'customer', 'عملاء', 'العملاء'])) return { message: ar ? `تشمل محفظة العملاء المعتمدة: ${CLIENTS.join('، ')}.` : `The approved client portfolio includes: ${CLIENTS.join(', ')}.`, actions: actions(language, ['contact']) };
  if (has(query, ['testing', 'commissioning', 'اختبار', 'التشغيل'])) return { message: ar ? 'تقدم أرزانا خدمات اختبار وتشغيل المحطات الكهربائية للأنظمة المدرجة في ملف الشركة، بما فيها لوحات الجهد المنخفض والمتوسط والمحولات ومرحلات الحماية ولوحات AC/DC والكابلات وبنوك المكثفات.' : 'Arzana provides testing and commissioning for electrical substations and the systems listed in the company profile, including LV/MV switchgear, transformers, protection relays, AC/DC panels, cables, and capacitor banks.', actions: actions(language, ['testing', 'quote']) };
  if (has(query, ['safety', 'fall', 'protection', 'سلامة', 'حماية', 'سقوط'])) return { message: ar ? 'تشمل أنظمة السلامة والحماية من السقوط شبكات السلامة وأنظمة حماية الحواف ومنصات التحميل وبوابات المناور ودعامات ربط الرافعات البرجية.' : 'Safety and fall-protection systems include safety nets, edge-protection systems, loading platforms, shaft gates, and tower-crane tie supports.', actions: actions(language, ['safety', 'quote']) };
  const matches = productSearch(query, language, catalog);
  if (matches.length > 0) { const summary = matches.map((product) => `${ar ? product.nameAr : product.nameEn}: ${ar ? product.descriptionAr : product.descriptionEn}`).join('\n\n'); return { message: summary, actions: actions(language, matches.map((product) => `product:${product.slug}`), catalog) }; }
  if (has(query, ['product', 'products', 'service', 'services', 'everything', 'منتج', 'منتجات', 'خدمات', 'كل'])) { const categories = catalog.categories.map((category) => ar ? category.nameAr : category.nameEn).join(ar ? '، ' : ', '); return { message: ar ? `تشمل فئات منتجات أرزانا: ${categories}. كما نقدم أنظمة السلامة وخدمات الاختبار والتشغيل.` : `Arzana’s product categories include: ${categories}. The company also provides safety systems and testing and commissioning services.`, actions: actions(language, ['products', 'testing', 'safety']) }; }
  return { message: ar ? 'أستطيع مساعدتك بمعلومات الموقع المتحقق منها عن أرزانا: المنتجات والفئات والخدمات والعملاء والعنوان والخرائط والأرقام والبريد وواتساب وطلب عرض السعر.' : 'I can help with verified website information about Arzana: products, categories, services, clients, address, map, phone, email, WhatsApp, and quote requests.', actions: actions(language, ['products', 'contact']) };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); json(res, 405, { error: 'METHOD_NOT_ALLOWED' }); return; }
  if (!withinRateLimit(getClientIp(req))) { json(res, 429, { error: 'RATE_LIMITED', message: 'Please wait a few minutes before sending another message.' }); return; }
  const body = asObject(req.body); const message = typeof body.message === 'string' ? body.message.trim() : ''; const language: Language = body.language === 'ar' ? 'ar' : 'en';
  if (!message || message.length > MAX_MESSAGE_LENGTH) { json(res, 400, { error: 'INVALID_MESSAGE' }); return; }
  let catalog: PublicCatalog | null; try { catalog = await getLiveCatalog(); } catch { catalog = null; }
  if (!catalog) { json(res, 503, { error: 'BOT_UNAVAILABLE', message: language === 'ar' ? 'بوت أرزانا غير متاح مؤقتاً. يرجى التواصل مع أرزانا عبر واتساب أو البريد الإلكتروني.' : 'Arzana Bot is temporarily unavailable. Please contact Arzana through WhatsApp or email.' }); return; }
  const response = answer(message, language, catalog);
  json(res, 200, response);
}
