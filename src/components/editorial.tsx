import Image from 'next/image';
import Link from 'next/link';
import { BookOpen, Grape, ImageOff } from 'lucide-react';
import type { Photo, Wine } from '@/data/content';

export function PhotoPanel({ photo, placeholder, className = '', priority = false }: {
  photo?: Photo; placeholder: string; className?: string; priority?: boolean;
}) {
  return <div className={`photo-panel ${className}`}>
    {photo ? <Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 720px) 92vw, 48vw" preload={priority} /> :
      <div className="photo-placeholder"><ImageOff aria-hidden="true" size={23} strokeWidth={1.4} /><span>{placeholder}</span></div>}
  </div>;
}

export function Botanical({ butterfly = false }: { butterfly?: boolean }) {
  const file = butterfly ? 'monarch.svg' : 'botanical.svg';
  return <Image src={'/images/' + file} width={butterfly ? 130 : 250} height={butterfly ? 93 : 350} alt="" className="botanical" unoptimized />;
}

export function Chapter({ title, kicker, description, className = '' }: {
  title: string; kicker: string; description: string; className?: string;
}) {
  return <section className={`chapter ${className}`}>
    <div className="shell chapter-inner">
      <div><p className="eyebrow">{kicker}</p><h1>{title}</h1><p className="lead">{description}</p></div>
      <Botanical butterfly />
    </div>
  </section>;
}

export function WineCards({ wines, label = 'Conocer el vino' }: { wines: Wine[]; label?: string }) {
  return <div className="wine-grid">{wines.map(wine =>
    <article className="wine-card" key={wine.slug}>
      <PhotoPanel photo={wine.photo} className="wine-photo" placeholder="Fotografía oficial pendiente" />
      <div className="wine-content">
        <p className="eyebrow"><Grape size={15} aria-hidden="true" /> {wine.variety}</p>
        <h3>{wine.name}</h3><p>{wine.description}</p>
        <Link className="text-link" href={'/vinos/' + wine.slug} aria-label={label + ' · ' + wine.name}>{label}</Link>
      </div>
    </article>)}</div>;
}

export function EmptyChapter({ children }: { children: React.ReactNode }) {
  return <div className="empty"><BookOpen size={28} strokeWidth={1.4} aria-hidden="true" /><p>{children}</p></div>;
}
