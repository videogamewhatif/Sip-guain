import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import { chromium } from 'playwright';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const base = process.env.TEST_URL || 'http://localhost:3000';
const accept = page => page.getByRole('button', { name: 'Sí, tengo 18 o más' }).click();
const axeSource = await readFile(require.resolve('axe-core/axe.min.js'), 'utf8');

async function scan(page) {
  await page.addScriptTag({ content: axeSource });
  const violations = await page.evaluate(async () => {
    const result = await window.axe.run({
      runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] },
    });
    return result.violations.map(({ id, nodes }) => ({ id, targets: nodes.map(node => node.target) }));
  });
  assert.deepEqual(violations, []);
}

async function seek(page, percentage) {
  await page.locator('.pour-scene').evaluate((root, p) => {
    const start = window.scrollY + root.getBoundingClientRect().top;
    window.scrollTo(0, start + (root.offsetHeight - window.innerHeight) * p);
  }, percentage);
  await page.waitForFunction(p => Math.abs(document.querySelector('progress').value - p) < .012, percentage);
}

function watchErrors(page) {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => {
    if (message.type() === 'error') errors.push(message.text());
  });
  return errors;
}

test('desktop navigation, source imagery, age confirmation, reversible scroll and gallery', async t => {
  const browser = await chromium.launch();
  t.after(() => browser.close());
  const page = await browser.newPage({ viewport: { width: 1440, height: 940 } });
  const errors = watchErrors(page);
  await page.goto(base);
  await page.getByRole('button', { name: 'No', exact: true }).click();
  assert.equal(await page.getByRole('status').isVisible(), true);
  await scan(page);
  await accept(page);
  await page.evaluate(() => document.fonts.ready);
  if (process.env.SCREENSHOT_DIR) await page.screenshot({ path: process.env.SCREENSHOT_DIR + '/hero-desktop.png' });
  await scan(page);
  await seek(page, .50);
  const middle = await page.locator('#liquid').getAttribute('y');
  assert.ok(Number(await page.locator('#pour-stream').getAttribute('opacity')) > .9);
  if (process.env.SCREENSHOT_DIR) await page.screenshot({ path: process.env.SCREENSHOT_DIR + '/pour-desktop.png' });
  await seek(page, .75);
  assert.ok(Number(await page.locator('#liquid').getAttribute('y')) < Number(middle));
  await seek(page, .5);
  assert.equal(await page.locator('#liquid').getAttribute('y'), middle);
  await seek(page, .22);
  assert.equal(await page.locator('#liquid').getAttribute('y'), '427');
  assert.equal(await page.locator('#pour-stream').getAttribute('opacity'), '0');
  await seek(page, 1);
  assert.equal(await page.locator('.end-copy').isVisible(), true);
  await page.getByRole('link', { name: 'Nuestros vinos', exact: true }).click();
  await page.getByRole('link', { name: /Conocer el vino.*monarca/i }).click();
  await page.waitForURL('**/vinos/el-regalo-de-la-monarca');
  await page.getByRole('heading', { name: 'Perfil del vino' }).waitFor();
  assert.equal(await page.locator('.product-hero img').evaluate(img => img.decode().then(() => img.naturalWidth > 0)), true);
  await page.getByRole('link', { name: 'Galería', exact: true }).click();
  await page.getByRole('button', { name: 'Eventos', exact: true }).click();
  const thumbs = page.getByRole('button', { name: /^Ampliar imagen:/ });
  assert.equal(await thumbs.count(), 3);
  await thumbs.first().click();
  const viewer = page.getByRole('dialog', { name: 'Visor de fotografías' });
  await viewer.waitFor();
  await page.keyboard.press('ArrowRight');
  assert.match(await viewer.locator('figcaption').innerText(), /2 de 3/);
  await page.keyboard.press('Escape');
  await viewer.waitFor({ state: 'hidden' });
  assert.equal(await thumbs.first().evaluate(el => el === document.activeElement), true);
  await page.goto(base + '/contacto');
  assert.equal(await page.getByRole('button', { name: 'Enviar mensaje' }).isDisabled(), true);
  assert.equal(await page.getByRole('link', { name: 'contacto@sipguain.com' }).first().getAttribute('href'), 'mailto:contacto@sipguain.com');
  await scan(page);
  assert.deepEqual(errors, []);
});

test('mobile menu, layout, and reduced motion', async t => {
  const browser = await chromium.launch();
  t.after(() => browser.close());
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const errors = watchErrors(page);
  await page.goto(base);
  await accept(page);
  await page.evaluate(() => document.fonts.ready);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth === innerWidth), true);
  if (process.env.SCREENSHOT_DIR) await page.screenshot({ path: process.env.SCREENSHOT_DIR + '/hero-mobile.png' });
  await seek(page, .55);
  assert.ok(Number(await page.locator('#pour-stream').getAttribute('opacity')) > .9);
  await page.getByRole('button', { name: 'Abrir menú' }).click();
  await page.getByRole('link', { name: 'Experiencias', exact: true }).click();
  await page.getByRole('heading', { name: 'Próximas fechas' }).waitFor();
  assert.equal(await page.getByRole('button', { name: 'Abrir menú' }).isVisible(), true);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(base);
  assert.equal(await page.locator('progress').isVisible(), false);
  assert.ok(await page.locator('.pour-scene').evaluate(el => el.offsetHeight < innerHeight));
  assert.deepEqual(errors, []);
});

test('all public routes, canonical metadata, sitemap and contact API availability', async () => {
  const routes = ['/', '/nosotros', '/vinos', '/vinos/el-regalo-de-la-monarca', '/vinos/tempranillo',
    '/arte-y-literatura', '/arte-y-literatura/el-regalo-de-la-monarca', '/arte-y-literatura/xunankab',
    '/artistas', '/merch', '/experiencias', '/galeria', '/contacto', '/aviso-de-privacidad'];
  const sitemap = await fetch(base + '/sitemap.xml').then(response => response.text());
  const titles = new Set();
  for (const route of routes) {
    const response = await fetch(base + route);
    const html = await response.text();
    assert.equal(response.status, 200, route);
    assert.match(html, /<link rel="canonical" href="[^"]+"/, route);
    assert.match(html, /<meta property="og:image" content="[^"]+"/, route);
    assert.ok(sitemap.includes(route + '</loc>'), route);
    const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
    assert.ok(title, route);
    titles.add(title);
  }
  assert.equal(titles.size, routes.length);
  assert.equal((await fetch(base + '/vinos/no-existe')).status, 404);
  assert.match(await fetch(base + '/robots.txt').then(response => response.text()), /Sitemap:/);
  const headers = { Origin: base, 'Content-Type': 'application/json' };
  assert.equal((await fetch(base + '/api/contacto', { method: 'POST', headers, body: '{}' })).status, 503);
  assert.equal((await fetch(base + '/api/contacto', { method: 'POST', headers: { ...headers, Origin: 'https://example.test' }, body: '{}' })).status, 403);
});
