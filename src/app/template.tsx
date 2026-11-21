/**
 * Transición entre páginas: un fundido con ascenso corto, en CSS puro
 * (funciona sin JavaScript y no retrasa el LCP). `template` se vuelve a
 * montar en cada navegación, lo que reinicia la animación.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
