import Link from 'next/link';
import { BookOpen, Grape, Leaf, MapPin, Sparkles } from 'lucide-react';
import Pour from '@/components/pour';
import Reveal from '@/components/reveal';
import { Botanical, PhotoPanel, WineCards } from '@/components/editorial';
import { merch, stories, vineyard, wines } from '@/data/content';
import { seo } from '@/lib/seo';

export const metadata = {
  ...seo('Historias que se descorchan', 'Vinos mexicanos del Bajío, arte y literatura. Descubre las historias de Sip Güain.', '/'),
  title: { absolute: 'Sip Güain · Historias que se descorchan' },
};

const pillars = [
  [BookOpen, 'Literatura', 'Cada etiqueta abre una historia.'],
  [Grape, 'Vino del Bajío', 'Una selección de vinos mexicanos.'],
  [Sparkles, 'Transformación', 'La naturaleza inspira nuestros relatos.'],
  [Leaf, 'Territorio', 'Una mirada atenta a los ciclos de la tierra.'],
  [MapPin, 'Ediciones limitadas', 'Cada selección tiene su propio capítulo.'],
] as const;

export default function Home() {
  return <>
    <Pour />
    <section className="paper-section editorial-intro" id="el-vino-tambien-se-lee" tabIndex={-1}>
      <Reveal className="shell intro-layout">
        <Botanical />
        <div><p className="eyebrow">Vino mexicano del Bajío</p><h2>El vino también se lee.</h2><p className="lead">En Sip Güain creemos que cada vino tiene algo que contar. Historias nacidas de la tierra, transformadas por el arte y compartidas en cada copa.</p></div>
        <Botanical butterfly />
      </Reveal>
    </section>
    <section className="section shell">
      <div className="section-heading"><h2>Nuestros vinos</h2><Link href="/vinos" className="text-link">Ver catálogo</Link></div>
      <WineCards wines={wines} label="Descubrir su historia" />
    </section>
    <section className="split-section wine-dark">
      <Reveal className="shell split">
        <PhotoPanel photo={stories[0].photo} placeholder="Ilustración de la etiqueta pendiente" className="cover-photo" />
        <div><p className="eyebrow">El arte detrás de cada etiqueta</p><h2>No diseñamos etiquetas. <em>Contamos historias.</em></h2><p>La monarca emprende sola un viaje que la transforma. Su relato dio nombre a nuestra primera etiqueta de edición limitada.</p><Link href="/arte-y-literatura" className="button light">Explorar arte y literatura</Link></div>
      </Reveal>
    </section>
    <section className="section shell">
      <h2>Nuestra esencia</h2>
      <div className="pillars">{pillars.map(([Icon, title, description]) => <article key={title}><Icon strokeWidth={1.4} aria-hidden="true" /><h3>{title}</h3><p>{description}</p></article>)}</div>
    </section>
    <section className="olive-section split-section">
      <Reveal className="shell split origin">
        <div><p className="eyebrow">El origen</p><h2>Historias del Bajío</h2><p>Buscamos vinos mexicanos de la región y los reunimos en ediciones limitadas. La selección pone atención al territorio y a la relación de los viñedos con sus ciclos naturales.</p><Link href="/nosotros" className="text-link">Conoce nuestra historia</Link></div>
        <PhotoPanel photo={vineyard} placeholder="Fotografía del viñedo pendiente" className="cover-photo" />
      </Reveal>
    </section>
    <section className="section shell">
      <div className="section-heading"><div><p className="eyebrow">Merch</p><h2>La colección ilustrada</h2></div><Link className="text-link" href="/merch">Explorar la colección</Link></div>
      <div className="merch-strip">{merch.slice(0, 3).map(item => <article key={item.name}><PhotoPanel photo={item.photo} placeholder="Fotografía oficial pendiente" className="cover-photo" /><h3>{item.name}</h3></article>)}</div>
    </section>
    <section className="closing wine-dark">
      <div className="shell">
        <div className="closing-ornament" aria-hidden="true"><Botanical butterfly /><svg viewBox="0 0 56 84" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M10 8h36c0 0 4 14 4 22a22 22 0 0 1-44 0c0-8 4-22 4-22ZM28 52v23m-13 2h26M7 30q17 6 42 0" /></svg></div>
        <h2>Hay historias que se leen.<br /><em>Otras se descorchan.</em></h2><Link className="button light" href="/nosotros">Conoce nuestra historia</Link></div>
    </section>
  </>;
}
