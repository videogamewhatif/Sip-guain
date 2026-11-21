import type { MerchCategory, MerchItem } from "@/types/content";

/** Colección visual de merchandising. Sin precios, inventario ni compra. */
export const merchCategories: { id: MerchCategory; label: string; description: string }[] = [
  { id: "playeras", label: "Playeras", description: "El distintivo Ü y la ilustración de la monarca, para llevar puestos." },
  { id: "tote-bags", label: "Tote bags", description: "Para cargar botellas, libros y lo que la tarde traiga." },
  { id: "accesorios", label: "Accesorios", description: "Detalles para regalar vino con estilo." },
  { id: "ilustraciones", label: "Ilustraciones", description: "Arte de nuestras etiquetas en edición limitada." },
];

export const merch: MerchItem[] = [
  {
    slug: "playera-sip-guain",
    name: "Playera Sip Güain",
    category: "playeras",
    description: "Playera de algodón orgánico color vino con nuestro distintivo: la Ü que sonríe.",
    details: ["Algodón orgánico", "Tallas XS, S, M y L"],
    inspiration: "La Ü de Güain convertida en sonrisa: así se ve alguien después de la primera copa de una buena historia.",
    images: [
      { src: "/images/merch/playera-sip-guain-lifestyle.webp", alt: "Persona con playera color vino con el logotipo Ü de Sip Güain", width: 1200, height: 1500 },
      { src: "/images/merch/playera-sip-guain.webp", alt: "Playera color vino con el logotipo Ü de Sip Güain en gancho", width: 1200, height: 1200 },
    ],
  },
  {
    slug: "playera-ilustracion-negra",
    name: "Playera Ilustración · Negra",
    category: "playeras",
    description: "Playera de algodón negra con la ilustración de Danny Sixx al frente.",
    details: ["Algodón", "Tallas XS, S, M y L"],
    inspiration: "El universo de El regalo de la monarca, fuera de la botella.",
    images: [{ src: "/images/merch/playera-ilustracion-negra.webp", alt: "Playera negra con la ilustración de la monarca al frente", width: 1080, height: 1080 }],
  },
  {
    slug: "playera-ilustracion-blanca",
    name: "Playera Ilustración · Blanca",
    category: "playeras",
    description: "Playera de algodón blanca con la ilustración de Danny Sixx y el logotipo Sip Güain.",
    details: ["Algodón", "Tallas XS, S, M y L"],
    inspiration: "La misma historia, en clave luminosa.",
    images: [{ src: "/images/merch/playera-ilustracion-blanca.webp", alt: "Playera blanca con la ilustración de la monarca y el logotipo Sip Güain", width: 1080, height: 1080 }],
  },
  {
    slug: "tote-bag-sip-guain",
    name: "Tote bag Sip Güain",
    category: "tote-bags",
    description: "Tote bag de materiales resistentes, con dos asas cortas y una larga. Espaciosa y versátil.",
    details: ["37 × 37 cm", "Caben hasta 3 botellas"],
    inspiration: "Una bolsa para llevar el vino a la sobremesa —y quedarse con ella todos los días.",
    images: [
      { src: "/images/merch/tote-bag-foto-01.webp", alt: "Tote bag Sip Güain de color crudo sobre un sofá terracota", width: 1650, height: 2200 },
      { src: "/images/merch/tote-bag.webp", alt: "Tote bag Sip Güain con asa larga sobre fondo blanco", width: 1080, height: 1080 },
      { src: "/images/merch/tote-bag-foto-03.webp", alt: "Dos tote bags Sip Güain sobre un sofá", width: 1920, height: 1647 },
    ],
  },
  {
    slug: "bolsita-de-yute",
    name: "Bolsita de yute para botella",
    category: "accesorios",
    description: "Bolsa de yute con asas para regalar vino con estilo y llevarlo a tus reuniones.",
    inspiration: "Fibras naturales para envolver una historia.",
    images: [
      { src: "/images/merch/bolsita-yute-01.webp", alt: "Bolsa de yute para botella con asas de algodón", width: 1080, height: 1080 },
      { src: "/images/merch/bolsita-yute-02.webp", alt: "Bolsa de yute para botella vista en ángulo", width: 1080, height: 1080 },
    ],
  },
  {
    slug: "ilustracion-el-regalo-de-la-monarca",
    name: "Ilustración · El regalo de la monarca",
    category: "ilustraciones",
    description: "Póster de 60 × 90 cm con la ilustración que Danny Sixx creó para Sip Güain. Edición limitada.",
    details: ["60 × 90 cm", "Edición limitada"],
    inspiration: "La esencia de la experiencia El regalo de la monarca: la pasión por las letras y el sabor intenso del vino.",
    images: [
      { src: "/images/art/el-regalo-de-la-monarca-poster.webp", alt: "Póster enmarcado de la ilustración El regalo de la monarca junto a una vela", width: 1200, height: 1200 },
      { src: "/images/art/el-regalo-de-la-monarca-ilustracion.webp", alt: "Ilustración completa de El regalo de la monarca", width: 1555, height: 2200 },
    ],
  },
];
