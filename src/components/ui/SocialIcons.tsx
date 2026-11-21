import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.6} aria-hidden focusable="false">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.4" cy="6.6" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden focusable="false">
      <path d="M13.5 21v-7.6h2.6l.4-3h-3V8.5c0-.9.3-1.5 1.5-1.5h1.6V4.3c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H7.8v3h2.6V21h3.1z" />
    </svg>
  );
}

const icons = { instagram: InstagramIcon, facebook: FacebookIcon } as const;

export function SocialLinks({ className, showHandle = false }: { className?: string; showHandle?: boolean }) {
  return (
    <ul className={cn("flex flex-wrap items-center gap-3", className)}>
      {siteConfig.socials.map((s) => {
        const Icon = icons[s.id as keyof typeof icons];
        return (
          <li key={s.id}>
            <a
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-full border border-current/25 px-3 py-2 text-sm transition-colors hover:border-current"
            >
              <Icon className="size-4" />
              <span className={showHandle ? "" : "sr-only"}>{showHandle ? s.handle : s.label}</span>
              <span className="sr-only"> (se abre en una pestaña nueva)</span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
