import type { MetadataRoute } from 'next';
import { navigation, stories, wines } from '@/data/content';
import { siteURL } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    ...navigation.map(([href]) => href), '/galeria', '/aviso-de-privacidad',
    ...wines.map(wine => '/vinos/' + wine.slug),
    ...stories.map(story => '/arte-y-literatura/' + story.slug),
  ];
  return routes.map(path => ({ url: new URL(path, siteURL).href }));
}
