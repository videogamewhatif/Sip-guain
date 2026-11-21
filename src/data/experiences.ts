import type { Experience } from "@/types/content";

/**
 * Experiencias y eventos. Solo se publican actividades reales.
 * Para anunciar una fecha, agrega `date` (ISO 8601) y `location`.
 * Sin reservaciones ni pagos: el contacto se hace desde /contacto.
 */
export const experiences: Experience[] = [
  {
    slug: "cata-el-regalo-de-la-monarca",
    name: "El regalo de la monarca · Cata narrativa",
    kind: "experiencia-literaria",
    summary:
      "Una cata en la que cada vino acompaña un momento de la historia de la monarca y la X’mahaná: amistad, transformación y el ciclo de la vida.",
    description: [
      "La experiencia sigue el viaje de una mariposa que se separa de su grupo y encuentra a la misteriosa X’mahaná. Mientras avanza el relato, se degustan los vinos y las emociones de la historia se entrelazan con sus aromas y notas.",
      "Es una cata íntima, pensada tanto para el paladar como para la conversación: un espacio para sentir, compartir y conocer a otras personas alrededor de una mesa.",
    ],
    includes: ["Cajita de emociones", "Vino para catar", "Comida para explorar sensaciones", "Conexiones nuevas", "Conversaciones increíbles"],
    storySlug: "el-regalo-de-la-monarca",
    images: [
      { src: "/images/experiences/cata-monarca-01.webp", alt: "Participante de una cata levanta una copa de vino tinto", width: 1200, height: 1200 },
      { src: "/images/experiences/cata-monarca-02.webp", alt: "Mesa compartida de cata con quesos, galletas y botellas", width: 1200, height: 1200 },
      { src: "/images/experiences/cata-lectura.webp", alt: "Asistentes leyendo durante una cata de Sip Güain", width: 1294, height: 1053 },
      { src: "/images/experiences/mesa-cata.webp", alt: "Mesa de cata con copas y comida", width: 1080, height: 1080 },
      { src: "/images/experiences/brindis.webp", alt: "Brindis con copas de vino tinto", width: 1200, height: 1200 },
    ],
    contactNote: "Las fechas se anuncian en nuestras redes. Escríbenos para conocer la próxima edición o llevar la cata a tu espacio.",
  },
];

export const experienceKinds: Record<Experience["kind"], string> = {
  cata: "Cata",
  presentacion: "Presentación",
  "evento-cultural": "Evento cultural",
  colaboracion: "Colaboración",
  "experiencia-literaria": "Experiencia literaria",
};
