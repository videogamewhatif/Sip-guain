import { Monarch } from "@/components/illustrations/Botanicals";
import { ButtonLink } from "@/components/ui/primitives";

export default function NotFound() {
  return (
    <section className="container-editorial flex min-h-[80svh] flex-col items-center justify-center pt-[var(--header-h)] text-center">
      <Monarch flutter className="w-16 animate-float-slow" />
      <p className="eyebrow mt-8 text-terracotta-ink">Página 404</p>
      <h1 className="display mt-4 max-w-2xl text-[clamp(2.4rem,6vw,4.6rem)] text-wine">Esta página se perdió, como la monarca distraída</h1>
      <p className="mt-6 max-w-md text-ink-soft">Quizá la encuentres volviendo al inicio o explorando nuestros vinos.</p>
      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <ButtonLink href="/">Volver al inicio</ButtonLink>
        <ButtonLink href="/vinos" variant="outline">
          Nuestros vinos
        </ButtonLink>
      </div>
    </section>
  );
}
