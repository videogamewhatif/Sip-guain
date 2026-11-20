'use client';

import Image from 'next/image';
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';
import { useRef, useState } from 'react';
import type { Photo } from '@/data/content';

export default function Gallery({ photos, filter = true }: { photos: Photo[]; filter?: boolean }) {
  const [category, setCategory] = useState('Todas');
  const [index, setIndex] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement>(null);
  const categories = ['Todas', ...new Set(photos.map(photo => photo.category))];
  const visible = category === 'Todas' ? photos : photos.filter(photo => photo.category === category);
  const active = visible[index];
  const move = (delta: number) => setIndex(current => (current + delta + visible.length) % visible.length);

  if (!photos.length) return <p>Las imágenes de este capítulo están pendientes.</p>;

  return <div className="gallery">
    {filter && <div className="filters" aria-label="Categorías de imágenes" role="group">
      {categories.map(item => <button type="button" key={item} aria-pressed={category === item} onClick={() => {
        setCategory(item);
        setIndex(0);
      }}>{item}</button>)}
    </div>}
    <div className={filter ? 'gallery-masonry' : 'gallery-inline'}>
      {visible.map(({ src, alt, category }, i) => <button className={'gallery-thumb ' + (src.endsWith('-cut.webp') ? 'contain' : '')} key={src + category} aria-label={'Ampliar imagen: ' + alt} onClick={event => {
        opener.current = event.currentTarget;
        setIndex(i);
        dialog.current?.showModal();
      }}>
        <Image src={src} alt={alt} fill sizes="(max-width: 650px) 46vw, 32vw" />
        <span className="zoom" aria-hidden="true"><Maximize2 size={17} /></span>
      </button>)}
    </div>
    <dialog className="lightbox" ref={dialog} aria-label="Visor de fotografías" onClose={() => opener.current?.focus()} onKeyDown={event => {
      if (visible.length < 2) return;
      if (event.key === 'ArrowLeft') move(-1);
      if (event.key === 'ArrowRight') move(1);
    }}>
      <div className="lightbox-controls">
        <button className="icon-button" aria-label="Cerrar visor" onClick={() => dialog.current?.close()}><X /></button>
      </div>
      {active && <figure>
        <div className="lightbox-photo"><Image src={active.src} alt={active.alt} fill sizes="90vw" /></div>
        <figcaption aria-live="polite">{active.alt} <span>{index + 1} de {visible.length}</span></figcaption>
      </figure>}
      {visible.length > 1 && <div className="lightbox-nav">
        <button className="icon-button" aria-label="Imagen anterior" onClick={() => move(-1)}><ChevronLeft /></button>
        <button className="icon-button" aria-label="Imagen siguiente" onClick={() => move(1)}><ChevronRight /></button>
      </div>}
    </dialog>
  </div>;
}
