import { Chapter, PhotoPanel } from '@/components/editorial';
import Reveal from '@/components/reveal';
import { merch } from '@/data/content';
import { seo } from '@/lib/seo';

export const metadata = seo('Merch', 'Explora las playeras, tote bags, accesorios e ilustraciones de Sip Güain.', '/merch', merch[0].photo?.src);

export default function Merch() {
  return <>
    <Chapter kicker="Merch" title="La colección ilustrada." description="Playeras, bolsos e impresiones que llevan las imágenes de Sip Güain a otros formatos." className="chapter-merch" />
    <section className="section shell merch-grid" aria-label="Piezas de la colección">
      {merch.map(item => <Reveal key={item.name}><article className="merch-piece"><PhotoPanel photo={item.photo} placeholder="Fotografía oficial pendiente" className="square-photo" /><p className="eyebrow">{item.category}</p><h2>{item.name}</h2><p>{item.description}</p></article></Reveal>)}
    </section>
  </>;
}
