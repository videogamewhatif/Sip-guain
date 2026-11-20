import { Chapter, WineCards } from '@/components/editorial';
import { wines } from '@/data/content';
import { seo } from '@/lib/seo';

export const metadata = seo('Nuestros vinos', 'Conoce los vinos mexicanos de la colección Sip Güain y la historia de cada etiqueta.', '/vinos');

export default function Wines() {
  return <>
    <Chapter kicker="La colección" title="Nuestros vinos." description="Vinos del Bajío seleccionados en ediciones limitadas." className="chapter-wines" />
    <section className="section shell" aria-label="Catálogo de vinos"><WineCards wines={wines} /></section>
  </>;
}
