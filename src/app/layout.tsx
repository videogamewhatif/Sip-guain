import type { Metadata, Viewport } from "next";
import { Montserrat, Playfair_Display } from "next/font/google";
import { AgeGate, ageGateBootScript } from "@/components/layout/AgeGate";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { jsonLd, organizationJsonLd } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  style: ["normal", "italic"],
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} · ${siteConfig.concept}`,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: ["vino mexicano", "vinos del Bajío", "Malbec", "Tempranillo", "vino y literatura", "Sip Güain", "arte", "Aguascalientes", "San Luis Potosí"],
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    siteName: siteConfig.name,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: "Sip Güain · Maridaje de vino con letras" }],
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#f2e9da",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-MX" className={`${playfair.variable} ${montserrat.variable}`} suppressHydrationWarning>
      <head>
        {/* Se ejecuta antes del primer pintado: marca JS disponible y edad confirmada. */}
        <script dangerouslySetInnerHTML={{ __html: ageGateBootScript }} />
        <noscript>
          <style>{`.age-gate{display:none!important}html body{overflow:auto!important}`}</style>
        </noscript>
        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(organizationJsonLd())} />
      </head>
      <body className="min-h-svh antialiased">
        <Header />
        <main id="contenido" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <Footer />
        <AgeGate />
      </body>
    </html>
  );
}
