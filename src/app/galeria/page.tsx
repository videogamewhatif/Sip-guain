import type { Metadata } from "next";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { PageHero } from "@/components/ui/primitives";
import { galleryCategories } from "@/data/gallery";
import { getGallery } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Galería",
  description: "Galería fotográfica de Sip Güain: vinos, etiquetas, arte, viñedos, experiencias y merchandising.",
  path: "/galeria",
});

export default async function GalleryPage() {
  const images = await getGallery();
  return (
    <>
      <PageHero
        chapter="IX"
        eyebrow="Galería"
        title={
          <>
            Un álbum <em className="text-terracotta">de capítulos</em>
          </>
        }
        intro="Botellas, etiquetas, ilustraciones, mesas compartidas y piezas de la colección. Filtra por categoría y abre cada fotografía para verla en grande."
      />
      <section aria-label="Fotografías" className="container-editorial pb-24 md:pb-32">
        <GalleryGrid images={images} categories={galleryCategories} />
      </section>
    </>
  );
}
