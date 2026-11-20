import Link from 'next/link';
import { Chapter, PhotoPanel } from '@/components/editorial';
import Reveal from '@/components/reveal';
import { stories } from '@/data/content';
import { seo } from '@/lib/seo';

export const metadata = seo('Arte y literatura', 'Lee los relatos que inspiran las etiquetas y el universo artístico de Sip Güain.', '/arte-y-literatura', stories[0].photo?.src);

export default function Literature() {
  return <>
    <Chapter kicker="Arte y literatura" title="Relatos que cobran forma." description="Las ilustraciones y los cuentos de Sip Güain comparten un mundo de encuentros y transformaciones." className="chapter-literature" />
    {stories.map((story, index) => <section key={story.slug} className={index % 2 ? 'paper-section section' : 'section'}>
      <Reveal className={'shell split story-spread ' + (index % 2 ? 'reverse' : '')}>
        <PhotoPanel photo={story.photo} placeholder="Ilustración oficial pendiente" className="art-photo" />
        <div><h2>{story.title}</h2><p>{story.paragraphs[0]}</p><Link className="text-link" href={'/arte-y-literatura/' + story.slug}>Leer el capítulo</Link></div>
      </Reveal>
    </section>)}
  </>;
}
