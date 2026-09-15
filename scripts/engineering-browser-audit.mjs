import { spawnSync } from 'node:child_process';
import assert from 'node:assert/strict';
import { mkdirSync } from 'node:fs';

const cli = process.env.AGENT_BROWSER_CLI;
assert.ok(cli, 'Set AGENT_BROWSER_CLI to the installed browser CLI');
const base = process.env.AUDIT_BASE_URL || 'http://localhost:5173';
function run(...args) {
  const result = spawnSync(process.execPath, [cli, ...args], { encoding: 'utf8', timeout: 45000 });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  return result.stdout.trim();
}
function evaluate(code) {
  const result = spawnSync(process.execPath, [cli, 'eval', '--stdin'], { input: code, encoding: 'utf8', timeout: 45000 });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  const parsed = JSON.parse(result.stdout.trim());
  return typeof parsed === 'string' ? JSON.parse(parsed) : parsed;
}
const pause = ms => run('wait', String(ms));
const open = path => { run('open', base + path); run('wait', '--load', 'networkidle'); pause(450); };
const ids = ['structural', 'hvac', 'foundations', 'lighting'];
const widths = [1600, 1440, 1280, 1024, 834, 820, 768, 430, 390, 360];
mkdirSync('tmp', { recursive: true });
open('/engineering-design-calculations');
evaluate(`document.querySelector('[aria-label="Close assistant"]')?.click(); JSON.stringify(true)`);
if (!process.env.AUDIT_FLOWS_ONLY) {
for (const language of ['en', 'ar']) {
  const current = evaluate('JSON.stringify(document.documentElement.lang)');
  if (current !== language) {
    run('find', 'role', 'button', 'click', '--name', 'Switch language'); pause(450);
  }
  for (const width of widths) {
    run('set', 'viewport', String(width), '1000');
    evaluate('window.scrollTo({top:0,behavior:"instant"}); JSON.stringify(true)'); pause(200);
    const layout = evaluate(`JSON.stringify({width:innerWidth, overflow:document.documentElement.scrollWidth>innerWidth+1, h1:document.querySelectorAll('h1').length, dir:document.documentElement.dir, sections:document.querySelectorAll('.engineering-service').length, images:document.querySelectorAll('.engineering-photo img').length, smallestBody:Math.min(...[...document.querySelectorAll('.engineering-service__description')].map(el=>parseFloat(getComputedStyle(el).fontSize))), toolsLTR:[...document.querySelectorAll('.engineering-software')].every(el=>getComputedStyle(el).direction==='ltr'), canonical:document.querySelector('link[rel="canonical"]')?.href})`);
    assert.equal(layout.overflow, false, `${language} ${width} overflow`);
    assert.equal(layout.h1, 1); assert.equal(layout.sections, 4); assert.equal(layout.images, 16);
    assert.ok(layout.smallestBody >= 16); assert.ok(layout.toolsLTR);
    assert.equal(layout.dir, language === 'ar' ? 'rtl' : 'ltr');
    assert.equal(layout.canonical, 'https://www.arzanaco.com/engineering-design-calculations');
    if (width < 1280) {
      run('click', 'button[aria-label="Open menu"]'); pause(300);
      const menu = evaluate(`JSON.stringify({shown:!!document.querySelector('#responsive-navigation'), engineering:!!document.querySelector('#responsive-navigation a[href="/engineering-design-calculations"]'), body:document.body.style.position, overflow:document.documentElement.scrollWidth>innerWidth+1})`);
      assert.ok(menu.shown && menu.engineering); assert.equal(menu.body, 'fixed'); assert.equal(menu.overflow, false);
      run('press', 'Escape'); pause(350);
      assert.equal(evaluate('JSON.stringify(document.body.style.position)'), '');
    }
    console.log(`PASS layout/menu ${language} ${width}`);
    if (width === 1600 || width === 390) {
      for (const id of ids) {
        evaluate(`document.querySelector('#${id}').scrollIntoView({behavior:'instant'}); JSON.stringify(true)`); pause(500);
      }
      evaluate('window.scrollTo({top:document.body.scrollHeight,behavior:"instant"}); JSON.stringify(true)'); pause(400);
      const loaded = evaluate(`JSON.stringify([...document.querySelectorAll('.engineering-photo img')].every(img=>img.complete&&img.naturalWidth>0))`);
      assert.ok(loaded, 'All 16 images resolve');
      evaluate('window.scrollTo({top:0,behavior:"instant"}); JSON.stringify(true)'); pause(350);
      run('screenshot', '--full', `tmp/engineering-${width}-${language}.png`);
    }
  }
  for (const id of ids) {
    evaluate(`document.querySelector('.engineering-navigator a[href="#${id}"]').scrollIntoView({block:'nearest',inline:'center',behavior:'instant'}); JSON.stringify(true)`); pause(100);
    run('click', `.engineering-navigator a[href="#${id}"]`); pause(800);
    const active = evaluate(`JSON.stringify({active:document.querySelector('.engineering-navigator a[aria-current="location"]')?.hash,top:document.querySelector('#${id}').getBoundingClientRect().top})`);
    assert.equal(active.active, '#' + id); assert.ok(active.top >= 70 && active.top < 200);
  }
  run('click', '#structural .engineering-photo:first-child'); pause(250);
  assert.equal(evaluate('JSON.stringify(document.querySelector("[role=dialog] [aria-live]").textContent.includes("1 / 4"))'), true);
  run('press', language === 'ar' ? 'ArrowLeft' : 'ArrowRight'); pause(200);
  assert.equal(evaluate('JSON.stringify(document.querySelector("[role=dialog] [aria-live]").textContent.includes("2 / 4"))'), true);
  run('press', 'Escape'); pause(250);
  assert.equal(evaluate('JSON.stringify(document.activeElement.classList.contains("engineering-photo"))'), true);
  console.log(`PASS anchors/lightbox/images ${language}`);
}
}
if (!process.env.AUDIT_QUICK_FLOWS) {
open('/');
assert.ok(evaluate(`JSON.stringify(!!document.querySelector('main a[href="/engineering-design-calculations"]'))`));
const routes = ['/about','/products','/testing-commissioning','/safety-systems','/clients','/contact','/request-quote','/arzana-ai','/privacy','/admin-panel'];
for (const route of routes) {
  open(route);
  const result = evaluate(`JSON.stringify({h1:document.querySelector('h1')?.textContent, text:document.body.innerText.length, error:!!document.querySelector('vite-error-overlay'), top:scrollY, engineeringTitle:document.title.includes('الحسابات الهندسية'), productLink:document.querySelector('main a[href^="/products/"]')?.getAttribute('href')})`);
  assert.ok(result.text > 100); assert.equal(result.error, false); assert.ok(result.top < 5);
  assert.equal(result.engineeringTitle, false, 'Engineering metadata must not leak to other routes');
  console.log(`PASS route ${route}: ${result.h1 || 'admin authentication'}${result.productLink ? ' '+result.productLink : ''}`);
}
}
open('/products');
const productPath = evaluate(`JSON.stringify([...document.querySelectorAll('main a[href^="/products/"]')].map(el=>el.getAttribute('href')).find(path=>path.split('/').length===4))`);
assert.ok(productPath, 'Live product detail link'); open(productPath);
assert.ok(evaluate(`JSON.stringify(!!document.querySelector('h1')&&!document.body.innerText.includes('Product not found'))`));
console.log('PASS live catalog product detail ' + productPath);
open('/request-quote');
const quote = evaluate(`JSON.stringify({products:document.querySelectorAll('input[type="checkbox"]').length, fakeEngineering:[...document.querySelectorAll('input[type="checkbox"]')].some(el=>el.value.includes('engineering'))})`);
// The existing quote UI retains its required p43 fallback beside 42 live products.
assert.equal(quote.products, 43); assert.equal(quote.fakeEngineering, false);
run('click', 'form button[type="submit"]'); pause(250);
assert.ok(evaluate(`JSON.stringify(document.querySelectorAll('form [aria-invalid="true"]').length>=3)`));
evaluate(`document.querySelector('input[type="checkbox"]').click(); JSON.stringify(true)`); pause(100);
assert.equal(evaluate(`JSON.stringify(document.querySelector('input[type="checkbox"]').checked)`), true);
evaluate(`document.querySelector('input[type="checkbox"]').click(); JSON.stringify(true)`);
assert.ok(evaluate(`JSON.stringify([...document.querySelectorAll('a[href^="https://wa.me/"]')].length>0)`));
console.log('PASS quote validation/native checkbox/WhatsApp; no email sent');
open('/engineering-design-calculations');
run('set', 'viewport', '390', '900');
for (const language of ['en', 'ar']) {
  if (evaluate('JSON.stringify(document.documentElement.lang)') !== language) {
    run('find', 'role', 'button', 'click', '--name', 'Switch language'); pause(300);
  }
  run('find', 'role', 'button', 'click', '--name', language === 'ar' ? 'فتح ARZANA BOT' : 'Open ARZANA BOT'); pause(300);
  run('fill', '#arzana-ai-message', language === 'ar' ? 'ما برامج حسابات الإضاءة؟' : 'What software do you use for structural analysis?');
  run('click', '[role="dialog"][aria-label="ARZANA BOT"] button[type="submit"]');
  run('wait', '--text', language === 'ar' ? 'DIALux evo' : 'SAP2000'); pause(250);
  const answer = evaluate(`JSON.stringify({engineering:!!document.querySelector('[aria-label="ARZANA BOT"] a[href="/engineering-design-calculations"]'),quote:!!document.querySelector('[aria-label="ARZANA BOT"] a[href="/request-quote"]'),error:!!document.querySelector('[aria-label="ARZANA BOT"] [role="alert"]'),overflow:document.documentElement.scrollWidth>innerWidth+1})`);
  assert.ok(answer.engineering && answer.quote); assert.equal(answer.error, false); assert.equal(answer.overflow, false);
  run('press', 'Escape'); pause(300);
  console.log('PASS floating chatbot → API → approved reply/actions ' + language);
}
run('click', '.engineering-cta a[href="/request-quote"]'); pause(600);
assert.equal(evaluate('JSON.stringify(location.pathname)'), '/request-quote');
assert.ok(evaluate('JSON.stringify(scrollY<5)'));
assert.equal(evaluate('JSON.stringify(document.title.includes("الحسابات الهندسية"))'), false);
console.log('PASS engineering quote CTA, SPA scroll-to-top and SEO cleanup');
open('/engineering-design-calculations');
console.log('PASS browser audit');
