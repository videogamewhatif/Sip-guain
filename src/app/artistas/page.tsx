import { Chapter, PhotoPanel } from '@/components/editorial';
import Reveal from '@/components/reveal';
import { artists } from '@/data/content';
import { seo } from '@/lib/seo';

export const metadata = seo('Artistas', 'Conoce a Danny Sixx y su trabajo en el universo visual de Sip Güain.', '/artistas');

export default function Artists() {
  return <>
    <Chapter kicker="Artistas" title="Las manos detrás del arte." description="Conoce a quienes llevan los relatos de Sip Güain a la imagen." className="chapter-artists" />
    {artists.map(artist => <section className="section shell" key={artist.name}>
      <Reveal className="split">
        <div>
          <h2>{artist.name}</h2><p>{artist.biography}</p><p>{artist.contribution}</p>
          <a href={artist.source} className="text-link">Colaboración en el sitio oficial</a>
        </div>
        <PhotoPanel photo={artist.portrait} placeholder="Retrato autorizado pendiente" className="cover-photo" />
      </Reveal>
      {artist.works.length > 0 && <div className="artist-works"><h3>Obra en la colección</h3><div className="merch-strip">{artist.works.map(work => <PhotoPanel key={work.src} photo={work} placeholder="" className="cover-photo" />)}</div></div>}
    </section>)}
  </>;
}
