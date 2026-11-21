/**
 * POST /api/contact
 *
 * Valida, filtra spam y envía el mensaje mediante Resend (API REST).
 * Si faltan RESEND_API_KEY / CONTACT_TO_EMAIL / CONTACT_FROM_EMAIL responde
 * `not_configured` (503): el sitio NUNCA afirma haber enviado un correo sin
 * una integración real.
 */
import { contactSchema, type ContactInput, type ContactResponse } from "@/lib/contact-schema";

const MIN_FILL_MS = 3000;
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;

// Limitador en memoria (por instancia). En producción con varias instancias,
// sustituir por Upstash/Vercel KV u otro almacén compartido.
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const list = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  list.push(now);
  hits.set(ip, list);
  return list.length > MAX_PER_WINDOW;
}

function json(body: ContactResponse, status: number) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

const escapeHtml = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function POST(request: Request) {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return json({ ok: false, code: "validation", fieldErrors: {} }, 400);
  }

  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    // Honeypot lleno: respuesta genérica sin detalles.
    if ((raw as { website?: string })?.website) return json({ ok: false, code: "spam" }, 400);
    const fieldErrors: Partial<Record<keyof ContactInput, string>> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof ContactInput;
      if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return json({ ok: false, code: "validation", fieldErrors }, 422);
  }

  const data = parsed.data;
  if (Date.now() - data.startedAt < MIN_FILL_MS) return json({ ok: false, code: "spam" }, 400);

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "local";
  if (rateLimited(ip)) return json({ ok: false, code: "rate_limited" }, 429);

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!apiKey || !to || !from) return json({ ok: false, code: "not_configured" }, 503);

  const html = `
    <h2 style="font-family:Georgia,serif;color:#532C3B">Nuevo mensaje desde sipguain.com</h2>
    <p><strong>Nombre:</strong> ${escapeHtml(data.name)}</p>
    <p><strong>Correo:</strong> ${escapeHtml(data.email)}</p>
    <p><strong>Asunto:</strong> ${escapeHtml(data.subject)}</p>
    <p style="white-space:pre-wrap">${escapeHtml(data.message)}</p>
    <hr><p style="color:#777;font-size:12px">La persona aceptó el aviso de privacidad al enviar el formulario.</p>`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: to.split(",").map((s) => s.trim()),
        reply_to: data.email,
        subject: `[Sip Güain] ${data.subject} — ${data.name}`,
        html,
        text: `Nombre: ${data.name}\nCorreo: ${data.email}\nAsunto: ${data.subject}\n\n${data.message}`,
      }),
    });
    if (!res.ok) return json({ ok: false, code: "provider_error" }, 502);
  } catch {
    return json({ ok: false, code: "provider_error" }, 502);
  }

  return json({ ok: true }, 200);
}
