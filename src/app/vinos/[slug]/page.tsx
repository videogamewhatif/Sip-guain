import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PhotoPanel, WineCards } from '@/components/editorial';
import Gallery from '@/components/gallery';
import { stories, wines } from '@/data/content';
import { seo } from '@/lib/seo';

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export const generateStaticParams = () => wines.map(({ slug }) => ({ slug }));

async function getWine(params: Props['params']) {
  const { slug } = await params;
  return wines.find(wine => wine.slug === slug) ?? notFound();
}

export async function generateMetadata({ params }: Props) {
  const wine = await getWine(params);
  return seo(wine.name, wine.description, '/vinos/' + wine.slug, wine.gallery[0]?.src);
}

export default async function WinePage({ params }: Props) {
  const wine = await getWine(params);
  const story = stories.find(entry => entry.slug === wine.story);
  const others = wines.filter(entry => entry.slug !== wine.slug);
  return <>
    <section className="paper-section"><div className="shell split product-hero">
      <div><Link href="/vinos" className="text-link">Nuestros vinos</Link><p className="eyebrow">{wine.variety}</p><h1>{wine.name}</h1><p className="lead">{wine.description}</p></div>
      <PhotoPanel photo={wine.photo} placeholder="Fotografía oficial pendiente" className="wine-photo" priority />
    </div></section>
    {(story || wine.profile) && <section className="section shell split wine-details">
      {story && <div><h2>La historia de la etiqueta</h2><p>{story.paragraphs[0]}</p><Link className="text-link" href={'/arte-y-literatura/' + story.slug}>Descubre el relato</Link></div>}
      {wine.profile && <div><h2>Perfil del vino</h2><dl className="specs">{Object.entries(wine.profile).map(([key, value]) => <div key={key}><dt>{key}</dt><dd>{value}</dd></div>)}</dl></div>}
    </section>}
    {wine.label && <section className="paper-section section"><div className="shell"><h2>El arte de la etiqueta</h2><Gallery photos={[wine.label]} filter={false} /></div></section>}
    {wine.gallery.length > 0 && <section className="section shell"><h2>Galería de {wine.name}</h2><Gallery photos={wine.gallery} filter={false} /></section>}
    {others.length > 0 && <section className="section shell"><h2>Descubre otro capítulo</h2><WineCards wines={others} /></section>}
  </>;
}
