import Link from 'next/link';
import { Chapter, EmptyChapter, PhotoPanel } from '@/components/editorial';
import Gallery from '@/components/gallery';
import { experiencePhotos, experiences } from '@/data/content';
import { seo } from '@/lib/seo';

export const metadata = seo('Experiencias', 'Catas y encuentros donde Sip Güain comparte vino, literatura y conversación.', '/experiencias', experiencePhotos[0].src);

export default function Experiences() {
  return <>
    <Chapter kicker="Experiencias" title="Historias para compartir." description="Catas y encuentros en torno a los vinos y los relatos de Sip Güain." className="chapter-experiences" />
    <section className="section shell split">
      <div><h2>Cata literaria de la monarca</h2><p>La experiencia gira en torno al viaje de la protagonista. La lectura acompaña la degustación y abre una conversación sobre la amistad y la transformación.</p><Link className="text-link" href="/contacto">Consulta sobre experiencias</Link></div>
      <PhotoPanel photo={experiencePhotos[0]} placeholder="" className="cover-photo" />
    </section>
    <section className="section paper-section"><div className="shell">
      <h2>Próximas fechas</h2>
      {experiences.length === 0 ? <EmptyChapter>Por ahora no hay fechas confirmadas.</EmptyChapter> : <div className="merch-grid">{experiences.map(event => <article key={event.name + event.date}>
        {event.photo && <PhotoPanel photo={event.photo} placeholder="" className="cover-photo" />}
        <h3>{event.name}</h3><p><time dateTime={event.date}>{new Intl.DateTimeFormat('es-MX', { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(event.date))}</time> · {event.location}</p><p>{event.description}</p>
        {event.contact && <a className="text-link" href={'mailto:' + event.contact}>Consultar por correo</a>}
      </article>)}</div>}
      <h2 className="archive-title">Archivo fotográfico</h2><Gallery photos={experiencePhotos.slice(1)} filter={false} />
    </div></section>
  </>;
}
