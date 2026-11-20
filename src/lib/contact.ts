export const limits = { name: 100, email: 254, subject: 140, message: 3000 } as const;
export const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function contactConfig() {
  const { RESEND_API_KEY: key, CONTACT_FROM: from, CONTACT_TO: to } = process.env;
  return key && from && to ? { key, from, to } : undefined;
}
