import { Chapter } from '@/components/editorial';
import Gallery from '@/components/gallery';
import { gallery } from '@/data/content';
import { seo } from '@/lib/seo';

export const metadata = seo('Galería', 'Fotografías de los vinos, las ilustraciones, la colección y los encuentros de Sip Güain.', '/galeria');

export default function GalleryPage() {
  return <>
    <Chapter kicker="Galería" title="El universo Sip Güain en imágenes." description="Botellas, etiquetas, ilustraciones y escenas de nuestros encuentros." className="chapter-gallery" />
    <section className="section shell" aria-label="Galería fotográfica"><Gallery photos={gallery} /></section>
  </>;
}
