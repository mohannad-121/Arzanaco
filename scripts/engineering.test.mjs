import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFile, readdir, mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve, dirname, basename, relative } from 'node:path';
import { createRequire } from 'node:module';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { engineeringAnswer, engineeringPage, engineeringServices } from '../lib/arzana-catalog/src/engineering.ts';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const pack = resolve(root, 'Engineering Design & Calculations photos');
const metadata = JSON.parse(await readFile(resolve(pack, 'image-metadata.json'), 'utf8'));

test('Exactly four service categories, four real case-correct JPGs per category, complete alt text', async () => {
  assert.deepEqual(engineeringServices.map(item => item.id), ['structural', 'hvac', 'foundations', 'lighting']);
  assert.equal(metadata.length, 16);
  assert.equal(new Set(metadata.map(image => image.file)).size, 16);
  const imports = await readFile(resolve(root, 'artifacts/arzana-website/src/data/engineering-images.ts'), 'utf8');
  for (const service of engineeringServices) {
    const images = metadata.filter(image => image.category === service.id);
    assert.equal(images.length, 4);
    const actualFiles = await readdir(resolve(pack, service.id));
    for (const image of images) {
      assert.ok(image.file.startsWith(`${service.id}/`));
      assert.ok(actualFiles.includes(basename(image.file)), `Case mismatch: ${image.file}`);
      assert.ok(imports.includes(`@engineering/${image.file}`), `Missing production import: ${image.file}`);
      assert.ok(image.alt_text.length > 25);
      assert.ok(image.width > 0 && image.height > 0);
      const bytes = await readFile(resolve(pack, image.file));
      assert.equal(bytes[0], 0xff);
      assert.equal(bytes[1], 0xd8);
    }
  }
  assert.equal([...imports.matchAll(/from '@engineering\/([^']+)'/g)].length, 16);
  assert.ok(!/preview\.jpg/.test(imports));
});

test('Built gallery mapping uses the exact metadata file, not candidate IDs', async () => {
  const require = createRequire(resolve(root, 'artifacts/api-server/package.json'));
  const { build } = require('esbuild');
  const result = await build({
    entryPoints: [resolve(root, 'artifacts/arzana-website/src/data/engineering-images.ts')],
    bundle: true, write: false, format: 'esm', alias: { '@engineering': pack },
    plugins: [{ name: 'test-image-paths', setup(builder) {
      builder.onLoad({ filter: /\.jpg$/ }, ({ path }) => ({ contents: `export default ${JSON.stringify(relative(pack, path).replaceAll('\\', '/'))}`, loader: 'js' }));
    } }],
  });
  const { engineeringImages } = await import('data:text/javascript;base64,' + Buffer.from(result.outputFiles[0].text).toString('base64'));
  for (const image of metadata) {
    const mapped = engineeringImages[image.category].find(item => item.file === image.file);
    assert.equal(mapped.src, image.file);
    assert.equal(mapped.alt, image.alt_text);
    assert.ok(mapped.altAr.length > 25);
    assert.equal(mapped.width, image.width); assert.equal(mapped.height, image.height);
  }
});

const questions = [
  ['What engineering design services do you provide?', ['Structural Analysis', 'HVAC Load', 'Foundation & Anchorage', 'Lighting Calculations']],
  ['What software do you use for structural analysis?', ['SAP2000', 'STAAD.Pro']],
  ['Can you perform wind and seismic calculations?', ['gravity', 'wind', 'seismic', 'deflection']],
  ['Do you provide HVAC load calculations?', ['cooling', 'heating', 'airflow']],
  ['What software do you use for HVAC sizing?', ['Carrier HAP', 'Elite CHVAC']],
  ['Do you design foundations?', ['bearing pressure', 'reinforcement', 'where applicable']],
  ['What is IDEA StatiCa used for?', ['SAFE', 'IDEA StatiCa', 'connection and anchorage checks']],
  ['Do you provide lighting calculations?', ['DIALux evo', 'AGi32']],
  ['Can you calculate lux levels?', ['illuminance (lux)', 'uniformity', 'glare']],
  ['What software do you use for lighting?', ['DIALux evo', 'AGi32']],
];

test('All ten required engineering questions use the approved service knowledge', () => {
  for (const [question, expected] of questions) {
    const answer = engineeringAnswer(question, 'en');
    assert.ok(answer, question);
    expected.forEach(fragment => assert.ok(answer.includes(fragment), `${question}: missing ${fragment}`));
  }
  assert.equal(engineeringAnswer('What is your WhatsApp number?', 'en'), null);
  assert.equal(engineeringAnswer('Tell me about your clients', 'en'), null);
  assert.equal(engineeringAnswer('Are your safety products safe?', 'en'), null);
  assert.ok(engineeringAnswer('What is SAFE used for?', 'en').includes('where applicable'));
});

test('Arabic matching and replies retain the software names and scope qualifiers', () => {
  for (const [question, expected] of [
    ['ما خدمات التصميم والحسابات الهندسية؟', 'التصميم والحسابات الهندسية'],
    ['هل توفرون التحليل الإنشائي وحسابات الرياح والزلازل؟', 'SAP2000'],
    ['ما برامج حسابات أحمال التكييف؟', 'Carrier HAP'],
    ['هل تصممون الأساسات وأنظمة التثبيت؟', 'حيث ينطبق ذلك'],
    ['هل تحسبون مستويات الإضاءة باللوكس؟', 'DIALux evo'],
  ]) assert.ok(engineeringAnswer(question, 'ar')?.includes(expected), question);
});

test('Unapproved engineering price, licensing, timing and partnership claims are not invented', () => {
  for (const question of ['What do engineering design services cost?', 'Are you licensed for structural design?', 'Is your lighting software partnership official?', 'What is the HVAC turnaround time?', 'Show completed engineering design projects', 'Is structural code compliance guaranteed?']) {
    assert.ok(engineeringAnswer(question, 'en')?.includes('does not specify'), question);
  }
});

test('Floating assistant permits the new structured action without broadening other URLs', async () => {
  const source = await readFile(resolve(root, 'artifacts/arzana-website/src/components/ArzanaAssistant.tsx'), 'utf8');
  const internalPattern = source.match(/return (\/\^.*\$\/)\.test\(url\)/)[1];
  const allowed = new RegExp(internalPattern.slice(1, -1));
  assert.ok(allowed.test(engineeringPage.route));
  assert.ok(allowed.test('/request-quote'));
  assert.equal(allowed.test('/admin-panel'), false);
  assert.equal(allowed.test('//evil.example'), false);
});

test('Sitemap, route entry and Vercel rewrite use the same public route', async () => {
  const sitemap = await readFile(resolve(root, 'artifacts/arzana-website/public/sitemap.xml'), 'utf8');
  const config = JSON.parse(await readFile(resolve(root, 'vercel.json'), 'utf8'));
  assert.ok(sitemap.includes(engineeringPage.canonical));
  assert.deepEqual(config.rewrites[0], { source: engineeringPage.route, destination: '/engineering-design-calculations.html' });
  assert.equal(config.installCommand, 'pnpm install --frozen-lockfile');
  assert.equal(config.outputDirectory, 'artifacts/arzana-website/dist/public');
});

test('Existing AI handler returns engineering + quote actions, retains other service routing and input validation', async () => {
  const require = createRequire(resolve(root, 'artifacts/api-server/package.json'));
  const { build } = require('esbuild');
  const temp = await mkdtemp(resolve(tmpdir(), 'arzana-engineering-test-'));
  const output = resolve(temp, 'arzana-ai.mjs');
  await build({ entryPoints: [resolve(root, 'api/arzana-ai.ts')], outfile: output, bundle: true, platform: 'node', format: 'esm', logLevel: 'silent', banner: { js: "import { createRequire } from 'node:module'; const require = createRequire(import.meta.url);" } });
  const originalFetch = globalThis.fetch;
  const originalUrl = process.env.SUPABASE_URL;
  const originalKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  process.env.SUPABASE_URL = 'https://arzana-test.supabase.co';
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-only-public-catalog-key';
  globalThis.fetch = async () => new Response(JSON.stringify({ data: { products: [], categories: [] } }), { headers: { 'content-type': 'application/json' } });
  try {
    const { default: handler } = await import(pathToFileURL(output).href);
    let requestId = 0;
    const request = async (message, language = 'en', method = 'POST') => {
      let body;
      const response = { statusCode: 0, setHeader() {}, end(text) { body = JSON.parse(text); } };
      await handler({ method, body: { message, language }, headers: { 'x-forwarded-for': `test-${requestId++}` } }, response);
      return { status: response.statusCode, body };
    };
    for (const [question] of questions) {
      const result = await request(question);
      assert.equal(result.status, 200);
      assert.deepEqual(result.body.actions.map(action => action.url), [engineeringPage.route, '/request-quote']);
      assert.ok(result.body.actions.every(action => action.type === 'link'));
    }
    assert.equal((await request('ما برامج حسابات الإضاءة؟', 'ar')).body.actions[0].label, engineeringPage.titleAr);
    assert.equal((await request('Tell me about testing and commissioning')).body.actions[0].url, '/testing-commissioning');
    assert.equal((await request('Tell me about safety systems')).body.actions[0].url, '/safety-systems');
    assert.equal((await request('What is your WhatsApp number?')).body.actions[0].url, 'https://wa.me/966566676600');
    assert.equal((await request('')).status, 400);
    assert.equal((await request('x'.repeat(901))).status, 400);
    assert.equal((await request('hello', 'en', 'GET')).status, 405);
  } finally {
    globalThis.fetch = originalFetch;
    if (originalUrl === undefined) delete process.env.SUPABASE_URL; else process.env.SUPABASE_URL = originalUrl;
    if (originalKey === undefined) delete process.env.SUPABASE_SERVICE_ROLE_KEY; else process.env.SUPABASE_SERVICE_ROLE_KEY = originalKey;
  }
});

test('Existing quote handler preserves validation, Resend payload and WhatsApp completion (mocked delivery only)', async () => {
  const require = createRequire(resolve(root, 'artifacts/api-server/package.json'));
  const { build } = require('esbuild');
  const temp = await mkdtemp(resolve(tmpdir(), 'arzana-engineering-test-'));
  const output = resolve(temp, 'quote.mjs');
  await build({ entryPoints: [resolve(root, 'api/quote.ts')], outfile: output, bundle: true, platform: 'node', format: 'esm', logLevel: 'silent', banner: { js: "import { createRequire } from 'node:module'; const require = createRequire(import.meta.url);" } });
  const variables = ['SUPABASE_URL','SUPABASE_SERVICE_ROLE_KEY','RESEND_API_KEY','QUOTE_FROM_EMAIL','QUOTE_TO_EMAIL'];
  const previous = Object.fromEntries(variables.map(key => [key, process.env[key]]));
  const previousFetch = globalThis.fetch;
  delete process.env.SUPABASE_URL; delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  process.env.RESEND_API_KEY = 'mock-only-not-a-real-key';
  process.env.QUOTE_FROM_EMAIL = 'quotes@mail.arzanaco.com';
  delete process.env.QUOTE_TO_EMAIL;
  const sent = [];
  globalThis.fetch = async (url, options) => {
    assert.equal(url, 'https://api.resend.com/emails');
    sent.push(JSON.parse(options.body));
    return new Response(JSON.stringify({ id: 'mock-email-123' }), { headers: { 'content-type': 'application/json' } });
  };
  try {
    const { default: handler } = await import(pathToFileURL(output).href);
    let id = 0;
    const request = async (body, method = 'POST') => {
      let payload;
      const response = { statusCode: 0, setHeader() {}, end(text) { payload = JSON.parse(text); } };
      await handler({ method, body, headers: { 'x-forwarded-for': `quote-test-${id++}` } }, response);
      return { status: response.statusCode, body: payload };
    };
    assert.equal((await request({}, 'GET')).status, 405);
    assert.equal((await request({})).status, 400);
    const valid = { fullName: 'Test User', companyName: 'Test Only', email: 'test@example.com', phone: '+966566676600', productIds: ['p1'], language: 'en', productDetails: 'Engineering quotation discussion' };
    assert.equal((await request({ ...valid, productIds: ['engineering-design-calculations'] })).status, 400);
    assert.equal(sent.length, 0);
    const completed = await request(valid);
    assert.equal(completed.status, 200); assert.equal(completed.body.emailStatus, 'sent');
    assert.equal(completed.body.submissionStatus, 'completed');
    assert.ok(completed.body.whatsappUrl.startsWith('https://wa.me/966566676600?'));
    assert.equal(sent.length, 1); assert.deepEqual(sent[0].to, ['m.saadi@arzanaco.com']);
    assert.equal(sent[0].reply_to, valid.email); assert.ok(sent[0].text.includes('Ring Main Unit (RMU)'));
  } finally {
    globalThis.fetch = previousFetch;
    variables.forEach(key => previous[key] === undefined ? delete process.env[key] : process.env[key] = previous[key]);
  }
});
