import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Logotipo original de Sip Güain (archivo vectorial de sipguain.com).
 * Las variantes de color solo cambian el relleno y eliminan el bloque de
 * fondo verde del archivo fuente; la forma del logotipo no se modifica.
 */
export function Logo({
  variant = "wine",
  lockup = false,
  className,
  priority = false,
}: {
  variant?: "wine" | "cream";
  lockup?: boolean;
  className?: string;
  priority?: boolean;
}) {
  const src = `/images/branding/logo-${lockup ? "lockup" : "wordmark"}-${variant}.svg`;
  return (
    <Image
      src={src}
      alt="Sip Güain"
      width={232}
      height={lockup ? 79 : 57}
      unoptimized
      preload={priority}
      className={cn("h-auto select-none", className)}
      draggable={false}
    />
  );
}
