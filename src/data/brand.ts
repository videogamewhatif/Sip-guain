import type { TeamMember } from "@/types/content";

/** Pilares de marca, redactados a partir de lo que Sip Güain comunica públicamente. */
export const pillars = [
  {
    id: "literatura",
    title: "Literatura",
    text: "Cada etiqueta acompaña un relato original. El vino se descorcha; la historia se lee.",
    icon: "book",
  },
  {
    id: "bajio",
    title: "Vino del Bajío",
    text: "Buscamos vinos del Bajío que no siempre llegan a todas las mesas, seleccionados por nuestra enóloga.",
    icon: "grapes",
  },
  {
    id: "transformacion",
    title: "Transformación y naturaleza",
    text: "Monarcas, crisálidas y abejas meliponas: nuestras historias hablan de cambiar sin dejar de ser.",
    icon: "butterfly",
  },
  {
    id: "sostenibilidad",
    title: "Sostenibilidad y territorio",
    text: "100 % mexicano, mínima intervención y viñedos que trabajan con lo que la naturaleza ofrece.",
    icon: "leaf",
  },
  {
    id: "ediciones",
    title: "Ediciones limitadas",
    text: "Cada edición es limitada; la exigencia de calidad nunca cambia.",
    icon: "quill",
  },
] as const;

/** Criterios de selección publicados por la marca. */
export const selectionCriteria = [
  "100 % mexicano.",
  "Procesos con la mínima intervención.",
  "Prácticas sostenibles que respetan la tierra.",
  "Viñedos que trabajan con lo que la naturaleza ofrece, sin químicos innecesarios.",
  "Un homenaje a la comunidad y a los ciclos naturales.",
];

/** Fundadoras (resumen de sipguain.com/nosotros). */
export const team: TeamMember[] = [
  {
    name: "Ale",
    role: "Enología y viticultura",
    bio: "Ingeniera en alimentos con maestría en enología y 15 años dedicada a la viña. Para ella, trabajar la tierra con respeto es la base de un gran vino, y una copa compartida, el inicio de una buena conversación.",
  },
  {
    name: "Jess",
    role: "Diseño y narrativa",
    bio: "Diseñadora de modas, docente y futura instructora de yoga. El proyecto nació durante su maestría, inspirado en una casa donde el vino siempre acompañó la poesía, la cocina y el arte.",
  },
  {
    name: "María",
    role: "Mercadotecnia y comunicación",
    bio: "Mercadóloga y futura instructora de yoga. Aprendió de su padre a maridar el vino con buena charla e historias; hoy cuida que cada botella llegue a quien valora lo que hacen.",
  },
];

/** Procesos de producción descritos en el blog de la marca (resumen). */
export const originNotes = [
  {
    title: "Mínima intervención",
    text: "Trabajamos con productores que comparten una filosofía: máxima calidad, mínima intervención y un profundo respeto por los procesos naturales.",
  },
  {
    title: "Trabajo a mano",
    text: "En la comunidad de Lequeitio, el trabajo en las viñas se hace a mano, en su mayoría por mujeres; los restos de poda se transforman en biocarbono que regresa al suelo.",
  },
  {
    title: "Altura y carácter",
    text: "Las uvas de El Secreto crecen a 2,000 metros sobre el nivel del mar, con un diferencial térmico que da pieles gruesas y colores intensos.",
  },
];
