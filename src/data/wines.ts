import type { Wine } from "@/types/content";

/**
 * Catálogo informativo de vinos (sin precios ni inventario).
 *
 * Fuentes de los datos técnicos: fichas públicas en sipguain.com y el texto
 * impreso en las etiquetas de las fotografías oficiales. Para agregar una nueva
 * etiqueta basta con añadir un objeto a este arreglo: la ruta /vinos/[slug]
 * se genera automáticamente.
 */
export const wines: Wine[] = [
  {
    id: "malbec-el-regalo-de-la-monarca",
    slug: "el-regalo-de-la-monarca",
    name: "El regalo de la monarca",
    shortName: "El regalo de la monarca",
    grapeVariety: "Malbec",
    composition: "Malbec 100 %",
    region: "Aguascalientes, México",
    vintage: "2022 (según etiqueta)",
    alcohol: "13.5 % Alc. Vol. (según etiqueta)",
    volume: "750 ml",
    winemaker: "Rolando Orozco Moles",
    description:
      "Nuestra primera etiqueta de edición limitada: un Malbec de Aguascalientes que guarda la historia de una monarca distraída y de la mariposa negra que la acompañó.",
    story: [
      "Esta botella es el primer capítulo de Sip Güain. Su etiqueta muestra a una figura alada rodeada de mariposas monarca: es la escena central de un relato sobre perderse, encontrar compañía donde menos se espera y transformarse.",
      "Quien la descorcha recibe dos cosas: un Malbec intenso y jugoso, y una invitación a leer. La historia completa vive en el sitio y se comparte también en catas narrativas, donde cada sorbo acompaña un momento del viaje.",
    ],
    storySlug: "el-regalo-de-la-monarca",
    tasting: {
      color: "Púrpura intenso con destellos rosas brillantes.",
      aroma: ["Pimienta negra", "Zarzamora madura", "Cerezas en almíbar", "Queso de tuna"],
      palate: ["Jugoso", "Fruta fresca: cereza y ciruela", "Notas ahumadas y acarameladas"],
    },
    pairing: ["Tabla de charcutería", "Quesos frescos", "Lo que se te antoje: aquí se trata de disfrutar"],
    image: {
      src: "/images/wines/malbec-el-regalo-de-la-monarca.webp",
      alt: "Botella de vino tinto Sip Güain Malbec El regalo de la monarca, con etiqueta ilustrada de mariposas monarca",
      width: 1200,
      height: 1200,
      credit: "Fotografía: Sip Güain",
    },
    cutout: {
      src: "/images/wines/malbec-el-regalo-de-la-monarca-cutout.webp",
      alt: "Botella Sip Güain Malbec El regalo de la monarca",
      width: 221,
      height: 960,
    },
    labelArt: {
      src: "/images/art/el-regalo-de-la-monarca-detalle.webp",
      alt: "Ilustración de una figura alada con alas de mariposa monarca y alas negras, rodeada de mariposas sobre fondo gris azulado",
      width: 1200,
      height: 1200,
      artistSlug: "danny-sixx",
      caption: "Ilustración de Danny Sixx para El regalo de la monarca.",
    },
    gallery: [
      {
        src: "/images/wines/malbec-mesa-charcuteria.webp",
        alt: "Botella de Malbec El regalo de la monarca en una mesa al aire libre con uvas, charcutería y copas",
        width: 1496,
        height: 1496,
      },
      {
        src: "/images/experiences/cata-monarca-04.webp",
        alt: "Asistentes a una cata de Sip Güain con botellas sobre la mesa",
        width: 1200,
        height: 1200,
      },
      {
        src: "/images/experiences/brindis.webp",
        alt: "Brindis con copas de vino tinto sobre una mesa con comida",
        width: 1200,
        height: 1200,
      },
    ],
    accent: "#3f5359",
    pendingAssets: [
      "Fotografía de la botella en alta resolución (≥ 2400 px de alto) con fondo transparente para la animación principal.",
      "Fotografías de la etiqueta en detalle (frontal y contraetiqueta).",
    ],
  },
  {
    id: "tempranillo",
    slug: "tempranillo",
    name: "Tempranillo",
    shortName: "Tempranillo",
    grapeVariety: "Tempranillo",
    composition: "Tempranillo 100 %",
    region: "San Luis Potosí, México",
    volume: "750 ml",
    winemaker: "Rolando Orozco Moles",
    description:
      "Un tinto potosino franco y persistente, de taninos aterciopelados, vestido con un paisaje de montañas, bosque y un cielo de mariposas.",
    story: [
      "La etiqueta del Tempranillo abre el paisaje: montañas, bosque, un sol que se pone y una nube de mariposas monarca en pleno viaje. Es la otra mitad del mismo universo ilustrado que acompaña a El regalo de la monarca.",
      "En la copa es elegante y directo: fruta negra, frescura herbal y un final largo. Un vino para compartir sin prisa.",
    ],
    tasting: {
      color: "Violeta intenso con destellos rojo cereza.",
      aroma: ["Ciruela negra", "Frutos frescos", "Hierbabuena", "Rosas"],
      palate: ["Vino franco y persistente", "Taninos nobles y aterciopelados"],
    },
    pairing: ["Pizza cuatro estaciones", "Ensalada de betabel asado con pepitas caramelizadas"],
    image: {
      src: "/images/wines/tempranillo.webp",
      alt: "Botella de vino tinto Sip Güain Tempranillo con etiqueta ilustrada de paisaje con montañas, bosque y mariposas",
      width: 1200,
      height: 1200,
      credit: "Fotografía: Sip Güain",
    },
    cutout: {
      src: "/images/wines/tempranillo-cutout.webp",
      alt: "Botella Sip Güain Tempranillo",
      width: 221,
      height: 960,
    },
    labelArt: {
      src: "/images/art/el-regalo-de-la-monarca-ilustracion.webp",
      alt: "Ilustración vertical: figura alada entre mariposas monarca en la parte superior y un paisaje de montañas y bosque al atardecer en la inferior",
      width: 1555,
      height: 2200,
      artistSlug: "danny-sixx",
      caption:
        "Ilustración completa de El regalo de la monarca. El paisaje de la etiqueta del Tempranillo dialoga con su parte inferior.",
    },
    gallery: [
      {
        src: "/images/wines/malbec-mesa-charcuteria.webp",
        alt: "Botellas de Tempranillo y Malbec Sip Güain en una mesa con uvas, charcutería y copas",
        width: 1496,
        height: 1496,
      },
      {
        src: "/images/experiences/mesa-cata.webp",
        alt: "Mesa de cata con copas, fresas, quesos y pan",
        width: 1080,
        height: 1080,
      },
    ],
    accent: "#c9783f",
    pendingAssets: [
      "Arte de la etiqueta del Tempranillo en gran formato y confirmación de autoría/título.",
      "Añada y graduación alcohólica verificadas (no legibles en la fotografía disponible).",
      "Historia literaria asociada, si existe.",
    ],
  },
];
