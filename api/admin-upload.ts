import { createClient } from '@supabase/supabase-js';

declare const process: { env: Record<string, string | undefined> };

type Request = { method?: string; body?: unknown };
type Response = { statusCode: number; setHeader(name: string, value: string): void; end(body: string): void };
const MAX_BYTES = 3_500_000;
const BUCKET = 'admin-media';

function send(res: Response, status: number, body: unknown) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}

function isBody(value: unknown): value is { password?: unknown; filename?: unknown; contentType?: unknown; dataUrl?: unknown } {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function extension(contentType: string) {
  return contentType === 'image/png' ? 'png' : contentType === 'image/webp' ? 'webp' : 'jpg';
}

function decodeBase64(value: string): Uint8Array {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  const result: number[] = [];
  let buffer = 0;
  let bits = 0;
  for (const character of value) {
    if (character === '=') break;
    const index = alphabet.indexOf(character);
    if (index < 0) throw new Error('Invalid base64 data.');
    buffer = (buffer << 6) | index;
    bits += 6;
    if (bits >= 8) {
      bits -= 8;
      result.push((buffer >> bits) & 0xff);
    }
  }
  return new Uint8Array(result);
}

export default async function handler(req: Request, res: Response) {
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); send(res, 405, { message: 'Method not allowed.' }); return; }
  if (!isBody(req.body) || typeof req.body.password !== 'string' || typeof req.body.dataUrl !== 'string' || typeof req.body.contentType !== 'string') { send(res, 400, { message: 'Invalid image upload.' }); return; }
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(req.body.contentType)) { send(res, 400, { message: 'Use a PNG, JPG, or WebP image.' }); return; }
  const match = /^data:[^;]+;base64,([A-Za-z0-9+/=]+)$/.exec(req.body.dataUrl);
  if (!match) { send(res, 400, { message: 'Invalid image data.' }); return; }
  const bytes = decodeBase64(match[1]);
  if (!bytes.length || bytes.length > MAX_BYTES) { send(res, 400, { message: 'Images must be 3.5 MB or smaller.' }); return; }
  const url = process.env.SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) { send(res, 503, { message: 'Image storage is not configured.' }); return; }
  const supabase = createClient(url, key, { auth: { persistSession: false } });
  const verified = await supabase.rpc('verify_catalog_admin', { admin_password: req.body.password });
  if (verified.error || verified.data !== true) { send(res, 401, { message: 'Incorrect admin password.' }); return; }
  const bucket = await supabase.storage.getBucket(BUCKET);
  if (bucket.error?.message?.toLowerCase().includes('not found')) {
    const created = await supabase.storage.createBucket(BUCKET, { public: true, allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'], fileSizeLimit: `${MAX_BYTES}` });
    if (created.error) { send(res, 500, { message: 'Could not prepare image storage.' }); return; }
  } else if (bucket.error) { send(res, 500, { message: 'Could not access image storage.' }); return; }
  const filename = `content/${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}.${extension(req.body.contentType)}`;
  const uploaded = await supabase.storage.from(BUCKET).upload(filename, bytes, { contentType: req.body.contentType, upsert: false, cacheControl: '31536000' });
  if (uploaded.error) { send(res, 500, { message: 'The image could not be stored.' }); return; }
  const publicUrl = supabase.storage.from(BUCKET).getPublicUrl(filename).data.publicUrl;
  send(res, 200, { url: publicUrl });
}
