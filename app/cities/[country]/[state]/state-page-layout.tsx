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
    : formatPlaceName(stateName)
  const countryNameFormatted = cities[0].country
    ? formatPlaceName(cities[0].country)
    : countryCode;
  return (
    <div className="state-page">
      <HomeHero heading={`Find More Cities in ${stateNameFormatted}`} />
      <div className="flex flex-col items-center mt-4 ">
        <StateBreadcrumbs city={cities[0]} />

        <hr className="mt-10" />
        <h3 className="text-lg text-left w-full font-bold select-none pl-8 my-4 ">
          Top Cities in {stateNameFormatted},{' '}
          {countryNameFormatted}:
        </h3>

        {cities.length === 0 ? <LoadingGrid /> : <CityList cities={cities} />}
      </div>
    </div>
  );
}
