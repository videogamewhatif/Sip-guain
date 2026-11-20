import type { Metadata } from 'next';
import Link from 'next/link';
import Image from "next/image";
import { Camera } from 'lucide-react';
import { AgeGate, Header } from '@/components/navigation';
import { email, instagram, official } from '@/data/content';
import { siteURL, jsonLd } from '@/lib/seo';
import '@fontsource-variable/playfair-display';
import '@fontsource-variable/playfair-display/wght-italic.css';
import '@fontsource-variable/montserrat';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: siteURL,
  title: { default: 'Sip Güain · Historias que se descorchan', template: '%s · Sip Güain' },
  icons: { icon: '/images/monarch.svg' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <html lang="es-MX">
    <body>
      <a href="#contenido" className="skip-link">Ir al contenido</a>
      <Header />
      <main id="contenido" tabIndex={-1}>{children}</main>
      <footer className="footer">
        <div className="shell footer-grid">
          <div><Link className="footer-logo" href="/" aria-label="Sip Güain, inicio"><Image src="/images/logo-original.svg" alt="Sip Güain" width={154} height={60} unoptimized /></Link><p>Maridaje de vino con letras</p></div>
          <nav aria-label="Enlaces del pie de página"><Link href="/galeria">Galería</Link><Link href="/contacto">Contacto</Link><Link href="/aviso-de-privacidad">Aviso de privacidad</Link></nav>
          <div><a href={instagram} className="social"><Camera size={19} aria-hidden="true" /> Instagram</a><a href={'mailto:' + email}>{email}</a></div>
        </div>
        <div className="shell footer-note">Sip Güain · México <span>Disfruta con moderación. Contenido para mayores de 18 años.</span></div>
      </footer>
      <AgeGate />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd({
        '@context': 'https://schema.org', '@type': 'Organization', name: 'Sip Güain', url: official, email, sameAs: [instagram],
      }) }} />
    </body>
  </html>;
}
