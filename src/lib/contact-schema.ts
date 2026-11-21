import { z } from "zod";

export const CONTACT_SUBJECTS = [
  "Información general",
  "Distribución y puntos de venta",
  "Colaboraciones artísticas",
  "Experiencias y catas",
  "Prensa",
  "Otro",
] as const;

/** Esquema compartido por el formulario (cliente) y la API (servidor). */
export const contactSchema = z.object({
  name: z.string().trim().min(2, "Escribe tu nombre (mínimo 2 caracteres).").max(80, "El nombre es demasiado largo."),
  email: z.string().trim().email("Escribe un correo electrónico válido.").max(120),
  subject: z.enum(CONTACT_SUBJECTS, { message: "Elige un asunto." }),
  message: z.string().trim().min(20, "Cuéntanos un poco más (mínimo 20 caracteres).").max(3000, "El mensaje es demasiado largo (máximo 3000 caracteres)."),
  consent: z.literal(true, { message: "Necesitamos tu consentimiento para responderte." }),
  /** Honeypot: debe llegar vacío. */
  website: z.string().max(0).optional().or(z.literal("")),
  /** Marca de tiempo de cuando se mostró el formulario (anti-bots). */
  startedAt: z.number().int().positive(),
});

export type ContactInput = z.infer<typeof contactSchema>;

export type ContactResponse =
  | { ok: true }
  | { ok: false; code: "validation"; fieldErrors: Partial<Record<keyof ContactInput, string>> }
  | { ok: false; code: "not_configured" | "rate_limited" | "spam" | "provider_error" };
