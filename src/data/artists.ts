import type { Artist } from "@/types/content";

/**
 * Artistas colaboradores. La biografía resume la descripción pública que
 * Sip Güain publica en sipguain.com. Retrato y enlaces oficiales quedan
 * pendientes hasta contar con material autorizado.
 */
export const artists: Artist[] = [
  {
    slug: "danny-sixx",
    name: "Danny Sixx",
    aliases: ["Dany Sixx"],
    role: "Ilustración · El regalo de la monarca",
    bio: [
      "La obra de Danny Sixx explora estados emocionales y espirituales a través de temas crudos: la muerte, la pérdida y la trascendencia.",
      "Su trabajo se reconoce por integrar dualidades —el yo y su sombra, el amor y el miedo, la vida y la muerte, la oscuridad y la luz— hasta encontrar un equilibrio entre ellas y descubrir belleza en lo oscuro.",
    ],
    works: [
      {
        title: "El regalo de la monarca",
        description:
          "Ilustración creada para Sip Güain. Da vida a la etiqueta del Malbec y se editó como póster de edición limitada de 60 × 90 cm.",
        image: {
          src: "/images/art/el-regalo-de-la-monarca-ilustracion.webp",
          alt: "Ilustración completa de El regalo de la monarca",
          width: 1555,
          height: 2200,
        },
        relatedWineSlug: "el-regalo-de-la-monarca",
      },
      {
        title: "Detalle de la etiqueta",
        description: "La figura alada central, con un ala de monarca y otra de mariposa negra: la X’mahaná y la monarca en un mismo cuerpo.",
        image: {
          src: "/images/art/el-regalo-de-la-monarca-detalle.webp",
          alt: "Detalle de la figura alada de El regalo de la monarca sobre fondo gris azulado",
          width: 1200,
          height: 1200,
        },
        relatedWineSlug: "el-regalo-de-la-monarca",
      },
    ],
    participation:
      "Autor de la ilustración de El regalo de la monarca, presente en la etiqueta del Malbec, en el póster de edición limitada y en las playeras ilustradas de la colección.",
    links: [],
    pendingAssets: [
      "Fotografía autorizada del artista.",
      "Enlaces oficiales (sitio web, Instagram u otras redes) confirmados por el artista.",
      "Confirmar la grafía oficial del nombre (en sipguain.com aparece como «Danny Sixx» y «Dany Sixx»).",
    ],
  },
];
