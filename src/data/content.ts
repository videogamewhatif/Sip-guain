export const official = 'https://sipguain.com';
export const email = 'contacto@sipguain.com';
export const instagram = 'https://www.instagram.com/sip.guain/';

export const navigation = [
  ['/', 'Inicio'], ['/nosotros', 'Nosotros'], ['/vinos', 'Nuestros vinos'],
  ['/arte-y-literatura', 'Arte y literatura'], ['/artistas', 'Artistas'],
  ['/merch', 'Merch'], ['/experiencias', 'Experiencias'], ['/contacto', 'Contacto'],
] as const;

export interface Photo {
  src: string;
  alt: string;
  category: 'Vinos' | 'Etiquetas' | 'Viñedos' | 'Arte' | 'Eventos' | 'Merch' | 'Marca';
}

function photo(file: string, alt: string, category: Photo['category']): Photo {
  return { src: '/images/' + file + '.webp', alt, category };
}

export interface Wine {
  slug: string;
  name: string;
  variety: string;
  description: string;
  source: string;
  photo?: Photo;
  label?: Photo;
  gallery: Photo[];
  profile?: Record<string, string>;
  story?: string;
}

export const wines: Wine[] = [
  {
    slug: 'el-regalo-de-la-monarca',
    name: 'El regalo de la monarca',
    variety: 'Malbec',
    description: 'Una edición limitada de Aguascalientes que lleva a la copa una historia de viaje y transformación.',
    source: official + '/producto/malbec/',
    photo: photo('malbec-cut', 'Botella Malbec El regalo de la monarca, con su etiqueta ilustrada', 'Vinos'),
    label: photo('story', 'Ilustración de la monarca sobre fondo gris', 'Etiquetas'),
    gallery: [photo('malbec', 'Vista frontal de la botella de Malbec', 'Vinos')],
    story: 'el-regalo-de-la-monarca',
    profile: {
      Uva: '100 % Malbec',
      Región: 'Aguascalientes, México',
      'Notas de cata': 'Púrpura intenso. Aromas de zarzamora, pimienta negra y cereza. En boca, ciruela y cereza con notas ahumadas y acarameladas.',
      Maridaje: 'Charcutería y quesos frescos.',
    },
  },
  {
    slug: 'tempranillo',
    name: 'Tempranillo',
    variety: 'Tempranillo',
    description: 'Una segunda expresión de la colección Sip Güain, dedicada a la uva Tempranillo.',
    source: official + '/producto/tempranillo/',
    photo: photo('tempranillo-cut', 'Botella Sip Güain Tempranillo, con etiqueta ilustrada en tonos verdes', 'Vinos'),
    gallery: [photo('tempranillo', 'Vista frontal de la botella de Tempranillo', 'Vinos')],
    profile: {
      Uva: '100 % Tempranillo',
      Región: 'San Luis Potosí, México',
      'Notas de cata': 'Fruta fresca, hierbabuena y rosas, con taninos aterciopelados.',
      Maridaje: 'Pizza cuatro estaciones o ensalada de betabel asado con pepitas caramelizadas.',
    },
  },
];

export interface Story {
  slug: string;
  title: string;
  paragraphs: string[];
  source: string;
  photo?: Photo;
}

export const stories: Story[] = [
  {
    slug: 'el-regalo-de-la-monarca',
    title: 'El regalo de la monarca',
    paragraphs: [
      'Una monarca se aparta de su grupo y emprende por su cuenta un viaje. En el camino descubre la soledad y la amistad, y encuentra compañía en la X’mahaná.',
      'La travesía termina con una promesa. La X’mahaná cuidará la crisálida y acompañará a la nueva mariposa hasta el lugar que las dos habían imaginado.',
    ],
    source: official + '/el-regalo-de-la-monarca/',
    photo: photo('story-full', 'Ilustración de El regalo de la monarca, con mariposas en tonos dorados', 'Arte'),
  },
  {
    slug: 'xunankab',
    title: 'Xunankab',
    paragraphs: ['En la selva de Yucatán, entre el copal y la tierra húmeda, un encuentro da lugar a Xunan Kab, la abeja melipona. El relato recorre la búsqueda de un lugar propio.'],
    source: official + '/xunankab/',
  },
];

interface Artist {
  name: string;
  biography: string;
  contribution: string;
  source: string;
  portrait?: Photo;
  works: Photo[];
}

export const artists: Artist[] = [{
  name: 'Danny Sixx',
  biography: 'En su obra, la pérdida y la trascendencia conviven con imágenes de luz y oscuridad.',
  contribution: 'Su trabajo ilustrado forma parte del universo visual de El regalo de la monarca.',
  source: official + '/',
  works: [photo('monarch-art', 'Ilustración enmarcada de El regalo de la monarca', 'Arte')],
}];

interface MerchItem {
  name: string;
  category: string;
  description: string;
  photo?: Photo;
}

export const merch: MerchItem[] = [
  { name: 'T-shirt Sip Guain', category: 'Playeras', photo: photo('shirt', 'Playera color vino con el símbolo de Sip Güain', 'Merch'), description: 'Playera de la colección con el símbolo de Sip Güain.' },
  { name: 'Tote Bag Sip Guain', category: 'Tote bags', photo: photo('tote', 'Tote bag color natural de Sip Güain', 'Merch'), description: 'Bolsa de la colección de marca.' },
  { name: 'Bolsita de yute para botella', category: 'Accesorios', photo: photo('yute', 'Bolsita de yute para botella', 'Merch'), description: 'Una funda de yute para llevar una botella.' },
  { name: 'Ilustración El Regalo de la Monarca', category: 'Ilustraciones', photo: photo('monarch-art', 'Ilustración enmarcada de El regalo de la monarca', 'Merch'), description: 'La obra gráfica de la colección, en su propio formato.' },
];

export interface Experience {
  name: string;
  date: string;
  location: string;
  description: string;
  photo?: Photo;
  contact?: string;
}

export const experiences: Experience[] = [];
export const brandPhoto = photo('brand', 'Una integrante de Sip Güain abre una botella', 'Marca');
export const experiencePhotos = [
  photo('tasting', 'Asistentes reunidos en una cata de Sip Güain', 'Eventos'),
  photo('table', 'Copas y platos en una mesa de una experiencia Sip Güain', 'Eventos'),
  photo('event', 'Vinos de Sip Güain y alimentos en una mesa al aire libre', 'Eventos'),
];
export const vineyard: Photo | undefined = undefined;
export const gallery: Photo[] = [
  ...wines.flatMap(wine => [wine.photo, wine.label, ...wine.gallery]),
  ...stories.map(story => story.photo),
  ...artists.flatMap(artist => [artist.portrait, ...artist.works]),
  ...merch.map(item => item.photo),
  ...experiences.map(event => event.photo),
  brandPhoto, vineyard, ...experiencePhotos,
].filter((photo): photo is Photo => Boolean(photo))
  .filter((photo, index, photos) => photos.findIndex(item => item.src === photo.src && item.category === photo.category) === index);
