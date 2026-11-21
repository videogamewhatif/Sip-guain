import type { Story } from "@/types/content";

/**
 * Historias literarias de Sip Güain.
 *
 * `summary` es un resumen editorial escrito para este sitio. El texto literario
 * original pertenece a la marca: para publicarlo íntegro, pégalo párrafo por
 * párrafo en `originalText` (la página lo mostrará automáticamente en formato libro).
 */
export const stories: Story[] = [
  {
    slug: "el-regalo-de-la-monarca",
    title: "El regalo de la monarca",
    subtitle: "Una mariposa distraída, una compañera temida y una promesa que cruza un continente.",
    excerpt:
      "Una monarca se queda atrás cuando su grupo emprende la migración. Sola, encuentra a la X’mahaná, la mariposa negra que todos temen, y descubre que el miedo también puede ser compañía.",
    summary: [
      "Todo empieza como empiezan las grandes historias: un grupo de mariposas monarca se prepara para migrar hacia tierras más cálidas. Una de ellas, curiosa y distraída, se pierde entre flores y sonidos, y cuando levanta la vista, el cielo ya está vacío.",
      "En su vuelo sin rumbo encuentra a una X’mahaná, la mariposa negra que muchos consideran mensajera de la muerte. La monarca no huye: pregunta. Y descubre a un ser que solo quería ser comprendido.",
      "Juntas emprenden el viaje. Las grandes alas de la X’mahaná cortan el viento; el aleteo delicado de la monarca estabiliza el vuelo. Lo que ninguna podía sola, lo logran unidas.",
      "Al llegar, la monarca —ya sin fuerzas— le pide a su amiga un último favor: cuidar su crisálida y acompañar a la nueva mariposa hasta el lugar del que tanto hablaron. La X’mahaná cumple, y guía a la pequeña de regreso a México.",
    ],
    originalUrl: "https://sipguain.com/el-regalo-de-la-monarca/",
    themes: ["Amistad", "Transformación", "El ciclo de la vida", "El miedo a lo desconocido"],
    symbols: [
      {
        name: "La monarca",
        meaning: "El viaje, la curiosidad y la migración que une a México con el norte del continente.",
      },
      {
        name: "La X’mahaná",
        meaning: "En maya, la mariposa negra. Temida como presagio, en esta historia se vuelve guardiana.",
      },
      {
        name: "La crisálida",
        meaning: "La transformación: lo que termina en una forma continúa en otra.",
      },
    ],
    relatedWineSlugs: ["el-regalo-de-la-monarca", "tempranillo"],
    artistSlug: "danny-sixx",
    cover: {
      src: "/images/art/el-regalo-de-la-monarca-ilustracion.webp",
      alt: "Ilustración de El regalo de la monarca: figura alada entre mariposas sobre un paisaje de montañas al atardecer",
      width: 1555,
      height: 2200,
    },
    accent: "#b46f51",
  },
  {
    slug: "xunan-kab",
    title: "Xunan Kab",
    subtitle: "La chispa que no sabía dónde pertenecer y terminó sosteniendo un mundo.",
    excerpt:
      "Una pequeña chispa, llegada tarde al reparto de identidades, recorre la selva de Yucatán buscando qué ser. De cada criatura toma lo mejor, y así nace la abeja melipona.",
    summary: [
      "Cuando los dioses terminaron de repartir nombres y dones, quedó flotando una chispa que llegó tarde a la fila: ni luz ni sombra, con unas ganas enormes de pertenecer. Le dieron permiso de salir al mundo y elegir.",
      "En la selva de la península de Yucatán, entre copal y tierra mojada, probó la vida de las hormigas, de los escarabajos, de una mariposa enamorada de su reflejo, de las arañas que tejen para atrapar y de las abejas reinas y su protocolo. Ninguna le quedaba del todo.",
      "Entonces eligió como en un buffet: la disciplina de la hormiga, la armadura del escarabajo, el interés de la mariposa —pero puesto en algo más grande que ella— y la astucia de la abeja, sin aguijón.",
      "Así nació Xunan Kab, la abeja melipona: nativa de México, sin aguijón, constructora paciente cuya miel es tan rara como valiosa. Una historia sobre cuidar lo pequeño, porque ahí vive todo lo que importa.",
    ],
    originalUrl: "https://sipguain.com/xunankab/",
    themes: ["Pertenencia", "Comunidad", "Naturaleza", "Cuidado de lo pequeño"],
    symbols: [
      { name: "La chispa", meaning: "Lo que aún no tiene nombre y busca su lugar." },
      {
        name: "Xunan Kab",
        meaning: "La abeja melipona, la «señora abeja» de la tradición maya: dulzura, constancia y equilibrio.",
      },
    ],
    relatedWineSlugs: [],
    accent: "#74745a",
  },
];
