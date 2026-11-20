import { contactConfig, limits, validEmail } from '@/lib/contact';

const windowMs = 15 * 60 * 1000;
const requests = new Map<string, { expires: number; count: number }>();
const response = (message: string, status: number) => Response.json({ message }, { status });

export async function POST(request: Request) {
  const origin = request.headers.get('origin');
  const expectedOrigin = new URL(process.env.SITE_URL || request.url).origin;
  if (origin !== expectedOrigin) return response('Origen de solicitud no permitido.', 403);
  const config = contactConfig();
  if (!config) return response('El formulario todavía no está habilitado.', 503);
  if ((request.headers.get('content-type') || '').split(';')[0].trim() !== 'application/json') return response('Formato inválido.', 415);

  const reader = request.body?.getReader();
  if (!reader) return response('Solicitud vacía.', 400);
  const buffer = new Uint8Array(16_384);
  let size = 0;
  try {
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      if (size + value.length > buffer.length) {
        await reader.cancel();
        return response('El mensaje excede el tamaño permitido.', 413);
      }
      buffer.set(value, size);
      size += value.length;
    }
  } catch {
    return response('No se pudo leer la solicitud.', 400);
  }

  let payload: Record<string, unknown>;
  try {
    const candidate = JSON.parse(new TextDecoder().decode(buffer.subarray(0, size)));
    if (!candidate || typeof candidate !== 'object' || Array.isArray(candidate)) throw new Error();
    payload = candidate;
  } catch {
    return response('Solicitud inválida.', 400);
  }

  if (payload.website || payload.consent !== 'on') return response('Revisa los campos del formulario.', 400);
  const fields = Object.keys(limits) as (keyof typeof limits)[];
  const values = Object.fromEntries(fields.map(key => [key, typeof payload[key] === 'string' ? payload[key].trim() : ''])) as Record<keyof typeof limits, string>;
  if (fields.some(key => !values[key] || values[key].length > limits[key]) || !validEmail.test(values.email) || /[\r\n]/.test(values.subject)) {
    return response('Revisa el nombre, correo, asunto y mensaje.', 400);
  }

  const client = process.env.VERCEL === '1' ? request.headers.get('x-vercel-forwarded-for') || 'proxy' : 'local';
  const now = Date.now();
  for (const [key, entry] of requests) {
    if (entry.expires <= now) requests.delete(key);
  }
  const quota = requests.get(client);
  if ((quota && quota.count >= 5) || requests.size >= 1024) return response('Has alcanzado el límite temporal. Intenta más tarde.', 429);
  if (quota) quota.count++;
  else requests.set(client, { count: 1, expires: now + windowMs });

  try {
    const sent = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + config.key, 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(8000),
      body: JSON.stringify({
        from: config.from, to: [config.to], reply_to: values.email,
        subject: 'Sip Güain · ' + values.subject,
        text: 'Nombre: ' + values.name + '\nCorreo: ' + values.email + '\n\n' + values.message,
      }),
    });
    if (sent.ok) return response('Tu mensaje fue enviado. Gracias por escribirnos.', 200);
  } catch { /* Report a generic provider failure to the visitor. */ }

  return response('No se pudo enviar el mensaje. Inténtalo más tarde o escríbenos directamente.', 502);
}
