import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { fileURLToPath } from 'node:url';
import { setTimeout } from 'node:timers/promises';
import { test } from 'node:test';
import { chromium } from 'playwright';

const base = process.env.CONTACT_TEST_URL || 'http://localhost:3361';

test('configured contact form, server validation, provider response and quota', async t => {
  const app = spawn(process.execPath, [
    '--import', fileURLToPath(new URL('./mail-mock.mjs', import.meta.url)),
    'node_modules/next/dist/bin/next', 'start', '--port', new URL(base).port,
  ], {
    env: {
      ...process.env, SITE_URL: base, RESEND_API_KEY: 'local-mock',
      CONTACT_FROM: 'test@example.test', CONTACT_TO: 'owner@example.test',
    },
    stdio: 'ignore',
  });
  const exited = once(app, 'exit');
  t.after(async () => {
    app.kill();
    await exited;
  });
  for (let attempt = 0; ; attempt++) {
    if (app.exitCode !== null) throw new Error('No se pudo iniciar el servidor de integración.');
    const ready = await fetch(base + '/contacto').then(res => res.ok, () => false);
    if (ready) break;
    if (attempt === 80) throw new Error('El servidor de integración tardó demasiado en iniciar.');
    await setTimeout(100);
  }

  const browser = await chromium.launch();
  t.after(() => browser.close());
  const page = await browser.newPage();
  await page.goto(base + '/contacto');
  await page.getByRole('button', { name: 'Sí, tengo 18 o más' }).click();
  await page.getByLabel('Nombre').fill('Visitante');
  await page.getByLabel('Correo electrónico').fill('visitante@example.test');
  await page.getByLabel('Asunto').fill('Consulta editorial');
  await page.getByLabel('Mensaje', { exact: true }).fill('Quiero conocer los vinos.');
  await page.getByRole('checkbox').check();
  await page.getByRole('button', { name: 'Enviar mensaje' }).click();
  await page.getByText('Tu mensaje fue enviado. Gracias por escribirnos.').waitFor();
  assert.equal(await page.getByLabel('Nombre').inputValue(), '');

  const headers = { Origin: base, 'Content-Type': 'application/json' };
  const good = { name: 'Visitante', email: 'visitante@example.test', subject: 'Consulta', message: 'Hola', consent: 'on' };
  const post = data => fetch(base + '/api/contacto', { method: 'POST', headers, body: JSON.stringify(data) });
  assert.equal((await post({ ...good, email: 'incorrecto' })).status, 400);
  assert.equal((await post({ ...good, website: 'filled' })).status, 400);
  assert.equal((await post({ ...good, consent: '' })).status, 400);
  assert.equal((await post({ ...good, message: 'x'.repeat(17_000) })).status, 413);
  assert.equal((await post({ ...good, subject: 'Falla simulada' })).status, 502);
  for (let i = 0; i < 3; i++) assert.equal((await post(good)).status, 200);
  assert.equal((await post(good)).status, 429);
});
