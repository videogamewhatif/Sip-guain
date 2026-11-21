"use client";

import Link from "next/link";
import { AlertCircle, CheckCircle2, Loader2, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { CONTACT_SUBJECTS, type ContactInput, type ContactResponse, contactSchema } from "@/lib/contact-schema";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

type Errors = Partial<Record<keyof ContactInput, string>>;
type Status = "idle" | "sending" | "sent" | "not_configured" | "error" | "rate_limited";

const fieldBase =
  "mt-2 w-full rounded-none border-0 border-b border-wine/30 bg-transparent px-0 py-3 text-base text-ink placeholder:text-ink-soft/50 transition-colors focus:border-wine focus:outline-none focus-visible:outline-none focus:ring-0";

export function ContactForm() {
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const startedAt = useRef<number>(0);
  const formRef = useRef<HTMLFormElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  useEffect(() => {
    if (status !== "idle" && status !== "sending") statusRef.current?.focus();
  }, [status]);

  function read(form: HTMLFormElement) {
    const fd = new FormData(form);
    return {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      subject: String(fd.get("subject") ?? ""),
      message: String(fd.get("message") ?? ""),
      consent: fd.get("consent") === "on",
      website: String(fd.get("website") ?? ""),
      startedAt: startedAt.current || Date.now(),
    };
  }

  function validate(values: ReturnType<typeof read>) {
    const result = contactSchema.safeParse(values);
    if (result.success) return {};
    const next: Errors = {};
    for (const issue of result.error.issues) {
      const key = issue.path[0] as keyof ContactInput;
      if (key && key !== "startedAt" && key !== "website" && !next[key]) next[key] = issue.message;
    }
    return next;
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const values = read(form);
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      const first = Object.keys(nextErrors)[0];
      form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const body = (await res.json()) as ContactResponse;
      if (body.ok) {
        setStatus("sent");
        form.reset();
        startedAt.current = Date.now();
      } else if (body.code === "validation") {
        setErrors(body.fieldErrors);
        setStatus("idle");
      } else if (body.code === "not_configured") setStatus("not_configured");
      else if (body.code === "rate_limited") setStatus("rate_limited");
      else setStatus("error");
    } catch {
      setStatus("error");
    }
  }

  const clearError = (name: keyof ContactInput) => errors[name] && setErrors((e) => ({ ...e, [name]: undefined }));

  return (
    <form ref={formRef} noValidate onSubmit={onSubmit} aria-describedby="form-nota" className="space-y-8">
      <p id="form-nota" className="text-sm text-ink-soft">
        Todos los campos son obligatorios.
      </p>

      <div className="grid gap-8 md:grid-cols-2">
        <Field label="Nombre" name="name" error={errors.name}>
          <input id="name" name="name" type="text" autoComplete="name" className={fieldBase} aria-invalid={!!errors.name} aria-describedby={errors.name ? "name-error" : undefined} onChange={() => clearError("name")} />
        </Field>
        <Field label="Correo electrónico" name="email" error={errors.email}>
          <input id="email" name="email" type="email" autoComplete="email" inputMode="email" className={fieldBase} aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-error" : undefined} onChange={() => clearError("email")} />
        </Field>
      </div>

      <Field label="Asunto" name="subject" error={errors.subject}>
        <select id="subject" name="subject" defaultValue="" className={cn(fieldBase, "appearance-none")} aria-invalid={!!errors.subject} aria-describedby={errors.subject ? "subject-error" : undefined} onChange={() => clearError("subject")}>
          <option value="" disabled>
            Elige una opción…
          </option>
          {CONTACT_SUBJECTS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Mensaje" name="message" error={errors.message}>
        <textarea id="message" name="message" rows={6} className={cn(fieldBase, "resize-y")} aria-invalid={!!errors.message} aria-describedby={errors.message ? "message-error" : undefined} onChange={() => clearError("message")} />
      </Field>

      {/* Honeypot: invisible para personas, tentador para bots */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="website">Sitio web</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div>
        <label className="flex items-start gap-3 text-sm leading-relaxed text-ink-soft">
          <input
            type="checkbox"
            name="consent"
            className="mt-1 size-4 shrink-0 accent-wine"
            aria-invalid={!!errors.consent}
            aria-describedby={errors.consent ? "consent-error" : undefined}
            onChange={() => clearError("consent")}
          />
          <span>
            He leído y acepto el{" "}
            <Link href="/aviso-de-privacidad" className="text-wine underline underline-offset-2">
              aviso de privacidad
            </Link>
            . Mis datos se usarán solo para responder este mensaje.
          </span>
        </label>
        {errors.consent && <ErrorText id="consent-error">{errors.consent}</ErrorText>}
      </div>

      <div className="flex flex-wrap items-center gap-5">
        <button
          type="submit"
          disabled={status === "sending"}
          className="inline-flex items-center gap-2 rounded-full bg-wine px-7 py-3.5 text-sm font-semibold text-cream transition-colors hover:bg-wine-deep disabled:opacity-60"
        >
          {status === "sending" ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Send className="size-4" aria-hidden />}
          {status === "sending" ? "Enviando…" : "Enviar mensaje"}
        </button>
      </div>

      <div ref={statusRef} tabIndex={-1} role="status" aria-live="polite" className="outline-none">
        {status === "sent" && (
          <Notice tone="ok" title="¡Gracias! Tu mensaje fue enviado.">
            Te responderemos pronto al correo que nos compartiste.
          </Notice>
        )}
        {status === "not_configured" && (
          <Notice tone="warn" title="Tu mensaje no se envió">
            El envío desde el formulario aún no está activo en esta versión del sitio. Escríbenos directamente a{" "}
            <a className="font-semibold text-wine underline" href={`mailto:${siteConfig.email}`}>
              {siteConfig.email}
            </a>
            .
          </Notice>
        )}
        {status === "rate_limited" && (
          <Notice tone="warn" title="Demasiados intentos">
            Espera unos minutos antes de volver a intentarlo.
          </Notice>
        )}
        {status === "error" && (
          <Notice tone="warn" title="No pudimos enviar tu mensaje">
            Inténtalo de nuevo o escríbenos a{" "}
            <a className="font-semibold text-wine underline" href={`mailto:${siteConfig.email}`}>
              {siteConfig.email}
            </a>
            .
          </Notice>
        )}
      </div>
    </form>
  );
}

function Field({ label, name, error, children }: { label: string; name: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={name} className="eyebrow text-[0.68rem] text-olive-ink">
        {label}
      </label>
      {children}
      {error && <ErrorText id={`${name}-error`}>{error}</ErrorText>}
    </div>
  );
}

function ErrorText({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <p id={id} className="mt-2 flex items-center gap-1.5 text-sm text-[#9b2c2c]">
      <AlertCircle className="size-4 shrink-0" aria-hidden />
      {children}
    </p>
  );
}

function Notice({ tone, title, children }: { tone: "ok" | "warn"; title: string; children: React.ReactNode }) {
  const Icon = tone === "ok" ? CheckCircle2 : AlertCircle;
  return (
    <div className={cn("flex gap-3 rounded-sm border p-5", tone === "ok" ? "border-olive/40 bg-olive/10" : "border-terracotta/50 bg-terracotta/10")}>
      <Icon className={cn("mt-0.5 size-5 shrink-0", tone === "ok" ? "text-olive-ink" : "text-terracotta-ink")} aria-hidden />
      <div>
        <p className="font-semibold text-ink">{title}</p>
        <p className="mt-1 text-sm text-ink-soft">{children}</p>
      </div>
    </div>
  );
}
