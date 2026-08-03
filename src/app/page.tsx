import { HeritageHero } from "@/components/HeritageHero/HeritageHero";
import { HeritageLocator } from "@/components/HeritageLocator/HeritageLocator";
import { MapCollection } from "@/components/MapCollection/MapCollection";
import { SiteFooter } from "@/components/SiteFooter/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader/SiteHeader";
import { getAllMapSummaries, getGeolocatedMapSummaries } from "@/data/maps";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <HeritageHero />
        <HeritageLocator sites={getGeolocatedMapSummaries()} />
        <MapCollection maps={getAllMapSummaries()} />
      </main>
      <SiteFooter />
    </>
  );
}
