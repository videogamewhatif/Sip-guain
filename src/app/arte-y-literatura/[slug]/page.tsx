import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Chapter, PhotoPanel } from '@/components/editorial';
import { stories } from '@/data/content';
import { seo } from '@/lib/seo';

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export const generateStaticParams = () => stories.map(({ slug }) => ({ slug }));

async function getStory(params: Props['params']) {
  const { slug } = await params;
  return stories.find(story => story.slug === slug) ?? notFound();
}

export async function generateMetadata({ params }: Props) {
  const story = await getStory(params);
  return seo(story.title + ' (relato)', story.paragraphs[0], '/arte-y-literatura/' + story.slug, story.photo?.src);
}

export default async function StoryPage({ params }: Props) {
  const story = await getStory(params);
  return <>
    <Chapter title={story.title} kicker="Arte y literatura" description="Relato de Sip Güain" className="chapter-literature" />
    <article className="section shell reading">
      {story.photo && <PhotoPanel photo={story.photo} placeholder="" className="art-photo" priority />}
      {story.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
      <a href={story.source} className="text-link">Leer el relato completo en el sitio oficial</a>
      <Link href="/arte-y-literatura" className="text-link">Volver a arte y literatura</Link>
    </article>
  </>;
}
