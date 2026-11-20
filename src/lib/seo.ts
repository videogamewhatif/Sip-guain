import type { Metadata } from 'next';

export const siteURL = new URL(process.env.SITE_URL || 'https://sipguain.com');

export function seo(title: string, description: string, path: string, image?: string): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: title + ' · Sip Güain',
      description,
      url: path,
      type: 'website',
      siteName: 'Sip Güain',
      locale: 'es_MX',
      images: image ? [image] : ['/images/og.jpg'],
    },
  };
}

export function jsonLd(value: object) {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}
