// 'use client';

import LoadingGrid from '@/components/general/loading-grid';
import CityList from '@/app/_components/city-list';

import { City } from '@/utils/types';
import StateBreadcrumbs from './_components/state-breadcrumbs';
import HomeHero from '@/app/_components/home-hero';
import formatPlaceName from '@/utils/functions/formatePlaceName';

export default function StatePageLayout({
  cities,
  stateName,
  countryCode
}: {
  cities: City[];
  stateName: string;
  countryCode: string;
}) {
  const stateNameFormatted = cities[0].name
    ? formatPlaceName(cities[0].name)
    : formatPlaceName(stateName);
  const countryNameFormatted = cities[0].country
    ? formatPlaceName(cities[0].country)
    : countryCode;
  return (
    <div id="state-page">
      <StateBreadcrumbs city={cities[0]} />
      <HomeHero heading={`Find More Cities in ${stateNameFormatted}`} />
      <div className="flex flex-col items-center">
        <h3 className="text-2xl w-full font-bold select-none pl-8 mb-4 border-t-2 mt-6 pt-6 text-center ">
          Top Cities in {stateNameFormatted}, {countryNameFormatted}:
        </h3>

        {cities.length === 0 ? <LoadingGrid /> : <CityList cities={cities} />}
      </div>
    </div>
  );
}
