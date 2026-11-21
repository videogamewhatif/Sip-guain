import type { Metadata } from "next";
import { PageHero } from "@/components/ui/primitives";
import { pageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Aviso de privacidad",
  description: "Aviso de privacidad de Sip Güain para los datos personales recabados a través de este sitio web.",
  path: "/aviso-de-privacidad",
});

/**
 * IMPORTANTE: versión adaptada a este sitio (formulario de contacto, sin
 * ventas). Debe revisarla la asesoría legal de la marca antes de publicar y
 * sustituirse, si procede, por el aviso vigente de Sip Güain.
 */
export default function PrivacyPage() {
  const sections = [
    {
      title: "Responsable",
      body: [
        `${siteConfig.legalName}, con domicilio fiscal en San Luis Potosí, S.L.P., México, es responsable del tratamiento de los datos personales que nos proporcionas a través de este sitio, conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares.`,
      ],
    },
    {
      title: "Datos que recabamos",
      body: [
        "A través del formulario de contacto: nombre, correo electrónico, asunto y el contenido de tu mensaje.",
        "No solicitamos datos personales sensibles ni datos de pago. Este sitio no realiza ventas.",
        "La confirmación de mayoría de edad se guarda únicamente en tu navegador (almacenamiento local) y no se envía a nuestros servidores.",
      ],
    },
    {
      title: "Finalidades",
      body: [
        "Responder tus mensajes y solicitudes de información, distribución, colaboración, prensa o experiencias.",
        "De manera secundaria, y solo si nos lo pides expresamente, mantenerte informado sobre nuevas etiquetas y eventos. Puedes negarte en cualquier momento.",
      ],
    },
    {
      title: "Transferencias y encargados",
      body: [
        "Para enviar los mensajes del formulario podemos apoyarnos en un proveedor de correo electrónico que actúa como encargado y trata los datos únicamente por nuestra cuenta. No vendemos ni compartimos tus datos con terceros para fines propios.",
      ],
    },
    {
      title: "Derechos ARCO y revocación",
      body: [
        `Puedes acceder, rectificar, cancelar u oponerte al tratamiento de tus datos, así como revocar tu consentimiento, enviando una solicitud a ${siteConfig.email} con tu nombre, el derecho que deseas ejercer y una descripción clara de tu petición.`,
      ],
    },
    {
      title: "Cookies y tecnologías similares",
      body: [
        "Este sitio no utiliza cookies de publicidad ni de seguimiento. Solo emplea almacenamiento local técnico para recordar la confirmación de edad. Si en el futuro se incorporan herramientas de analítica, este aviso se actualizará antes de activarlas.",
      ],
    },
    {
      title: "Cambios a este aviso",
      body: ["Cualquier modificación se publicará en esta página."],
    },
  ];

  return (
    <>
      <PageHero chapter="§" eyebrow="Legal" title="Aviso de privacidad" intro="Cómo tratamos los datos que compartes con nosotras a través de este sitio." />
      <section className="container-editorial pb-24">
        <div className="mx-auto max-w-3xl space-y-12">
          {sections.map((s, i) => (
            <div key={s.title}>
              <h2 className="font-serif text-2xl text-wine md:text-3xl">
                <span className="mr-3 text-terracotta">{i + 1}.</span>
                {s.title}
              </h2>
              <div className="prose-editorial mt-4">
                {s.body.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </div>
          ))}
          <p className="border-t border-wine/15 pt-6 text-xs text-ink-soft">
            Documento preparado para la versión 3.0 del sitio. Debe ser validado por la asesoría legal de Sip Güain antes de su publicación.
          </p>
        </div>
      </section>
    </>
  );
}
