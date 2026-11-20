import { ExternalLink, Camera, Mail } from 'lucide-react';
import { Chapter } from '@/components/editorial';
import ContactForm from '@/components/contact-form';
import { email, instagram } from '@/data/content';
import { contactConfig } from '@/lib/contact';
import { seo } from '@/lib/seo';

export const dynamic = 'force-dynamic';
export const metadata = seo('Contacto', 'Contacta con Sip Güain para consultas, distribución y colaboraciones.', '/contacto');

export default function Contact() {
  return <>
    <Chapter kicker="Contacto" title="Conversemos." description="Para consultas sobre los vinos, distribución y colaboraciones, escribe a nuestro equipo." className="chapter-contact" />
    <section className="section shell contact-layout">
      <div className="contact-links">
        <h2>Escríbenos</h2>
        <a href={'mailto:' + email}><Mail size={19} aria-hidden="true" />{email}</a>
        <a href={instagram}><Camera size={19} aria-hidden="true" /> Instagram</a>
        <a href="https://www.facebook.com/profile.php?id=61562728695160"><ExternalLink size={19} aria-hidden="true" /> Facebook</a>
      </div>
      <ContactForm enabled={Boolean(contactConfig())} />
    </section>
  </>;
}
