"use client";

import { type ReactNode, useRef } from "react";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import { gsap, useGSAP } from "@/lib/gsap";

/**
 * Parallax muy ligero (transform en GPU, scrub de ScrollTrigger).
 * `amount` es el desplazamiento total en px a lo largo del recorrido.
 */
export function Parallax({ children, amount = 60, className }: { children: ReactNode; amount?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (reduced || !ref.current) return;
      gsap.fromTo(
        ref.current,
        { y: amount / 2 },
        {
          y: -amount / 2,
          ease: "none",
          scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true },
        },
      );
    },
    { dependencies: [reduced, amount] },
  );

  return (
    <div ref={ref} className={className} style={{ willChange: reduced ? undefined : "transform" }}>
      {children}
    </div>
  );
}
