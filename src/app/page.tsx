import type { Metadata } from "next";
import { WinePourHero } from "@/components/animations/wine-pour/WinePourHero";
import {
  ClosingChapter,
  EditorialIntro,
  Essence,
  LabelArt,
  MerchTeaser,
  Origin,
  WinesShowcase,
} from "@/components/sections/home/HomeSections";
import { getMerch, getStory, getWines } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  ...pageMetadata({
    title: siteConfig.concept,
    description: siteConfig.description,
    path: "/",
  }),
  title: { absolute: `${siteConfig.name} · ${siteConfig.concept}` },
};

export default async function HomePage() {
  const [wines, story, merch] = await Promise.all([getWines(), getStory("el-regalo-de-la-monarca"), getMerch()]);
  return (
    <>
      <WinePourHero nextId="universo" />
      <EditorialIntro id="universo" />
      <WinesShowcase wines={wines} />
      {story && <LabelArt story={story} />}
      <Essence />
      <Origin />
      <MerchTeaser items={merch} />
      <ClosingChapter />
    </>
  );
}
