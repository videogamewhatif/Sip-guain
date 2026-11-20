'use client';

import { useState } from 'react';
import Link from 'next/link';
import { limits } from '@/lib/contact';

export default function ContactForm({ enabled }: { enabled: boolean }) {
  const [result, setResult] = useState<{ text: string; error?: boolean }>();
  const [sending, setSending] = useState(false);

  return <form className="contact-form" onSubmit={async event => {
    event.preventDefault();
    if (!enabled || sending) return;
    const form = event.currentTarget;
    const fields = new FormData(form);
    setSending(true);
    setResult(undefined);
    try {
      const response = await fetch('/api/contacto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(fields)),
      });
      const data = await response.json();
      setResult({ text: data.message, error: !response.ok });
      if (response.ok) form.reset();
    } catch {
      setResult({ text: 'Hubo un problema de conexión. Vuelve a intentarlo o escríbenos directamente.', error: true });
    } finally {
      setSending(false);
    }
  }}>
    <label>Nombre<input name="name" required autoComplete="name" maxLength={limits.name} /></label>
    <label>Correo electrónico<input name="email" required type="email" autoComplete="email" maxLength={limits.email} /></label>
    <label>Asunto<input name="subject" required maxLength={limits.subject} /></label>
    <label>Mensaje<textarea name="message" required rows={6} maxLength={limits.message} /></label>
    <div className="trap" aria-hidden="true"><label>Sitio web<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
    <label className="consent"><input name="consent" required type="checkbox" /> <span>He leído el <Link href="/aviso-de-privacidad">aviso de privacidad</Link> y acepto que Sip Güain use mis datos para responder este mensaje.</span></label>
    {!enabled && <p id="contact-disabled">El envío desde el formulario está pendiente de configuración. Puedes escribirnos al correo indicado.</p>}
    <button className="button" type="submit" disabled={!enabled || sending} aria-describedby={enabled ? undefined : 'contact-disabled'}>{sending ? 'Enviando…' : 'Enviar mensaje'}</button>
    <div aria-live="polite" aria-atomic="true" className={result?.error ? 'form-error' : 'form-success'}>{result?.text}</div>
  </form>;
}
