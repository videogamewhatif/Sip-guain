import Link from 'next/link';
import { Botanical, Chapter, PhotoPanel } from '@/components/editorial';
import Reveal from '@/components/reveal';
import { brandPhoto, official, vineyard } from '@/data/content';
import { seo } from '@/lib/seo';

export const metadata = seo('Nuestra historia', 'Tres amigas, el vino mexicano y una manera de compartir historias.', '/nosotros', brandPhoto.src);

export default function About() {
  return <>
    <Chapter kicker="Nosotros" title="Una historia entre amigas." description="Sip Güain nace de una amistad y del gusto por la viticultura mexicana." className="chapter-about" />
    <section className="section shell split">
      <PhotoPanel photo={brandPhoto} placeholder="Fotografía del equipo pendiente" className="cover-photo" />
      <div><h2>El origen de Sip Güain</h2><p>Ale, Jess y María crecieron compartiendo etapas de su vida en Morelia. Sus trayectorias en enología, diseño y mercadotecnia se reunieron en un proyecto para compartir vinos mexicanos y las historias que inspiran.</p><a className="text-link" href={official + '/nosotros/'}>Lee su historia en el sitio oficial</a></div>
    </section>
    <section className="paper-section"><Reveal className="shell quote-block"><Botanical butterfly /><blockquote>«Cada etiqueta es una historia, cada copa un capítulo».</blockquote></Reveal></section>
    <section className="section shell split">
      <div><p className="eyebrow">Naturaleza y territorio</p><h2>El Bajío en nuestra selección</h2><p>La colección busca dar lugar a vinos de la región en ediciones limitadas. El cuidado de la tierra y sus ciclos orienta la selección. En cada capítulo, el arte y la literatura abren otra manera de acercarse al vino.</p><Link className="text-link" href="/vinos">Explora los vinos</Link></div>
      <PhotoPanel photo={vineyard} placeholder="Fotografía del viñedo pendiente" className="cover-photo" />
    </section>
  </>;
}
