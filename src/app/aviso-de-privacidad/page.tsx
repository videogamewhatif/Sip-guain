import { Chapter } from '@/components/editorial';
import { email, official } from '@/data/content';
import { seo } from '@/lib/seo';

export const metadata = seo('Aviso de privacidad', 'Información sobre el tratamiento de datos de contacto y la confirmación de edad.', '/aviso-de-privacidad');

export default function Privacy() {
  return <>
    <Chapter kicker="Información legal" title="Aviso de privacidad" description="Cómo utiliza Sip Güain los datos de este sitio." />
    <article className="section shell reading">
      <h2>Contacto</h2>
      <p>El formulario solicita nombre, correo electrónico, asunto y mensaje para atender tu consulta. Cuando se habilita, el proveedor de correo procesa esos datos para entregar el mensaje al equipo de Sip Güain.</p>
      <h2>Confirmación de edad</h2>
      <p>El navegador recuerda tu confirmación durante la sesión. La confirmación es una declaración de edad del visitante.</p>
      <h2>Consultas y derechos</h2>
      <p>Escribe a <a href={'mailto:' + email}>{email}</a> para consultas relacionadas con tu privacidad. Consulta el aviso integral publicado por Sip Güain para conocer los datos del responsable y el procedimiento aplicable.</p>
      <a href={official + '/aviso-de-privacidad/'} className="text-link">Consultar el aviso integral</a>
    </article>
  </>;
}
