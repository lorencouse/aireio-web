// 'use client';

import LoadingGrid from '@/components/general/loading-grid';
import CityList from '@/app/_components/city-list';

import { City } from '@/utils/types';
import HomeHero from '@/app/_components/home-hero';
import formatPlaceName from '@/utils/functions/formatPlaceName';
import CountryList from '../_components/country-list';
import DynamicBreadcrumb from '@/components/general/dynamic-breadcrumb';

export default function StatePageLayout({
  cities,
  stateName,
  countries
}: {
  cities: City[];
  stateName: string;
  countries: { country: string; country_code: string }[];
}) {
  const stateNameFormatted = cities[0].state
    ? formatPlaceName(cities[0].state)
    : formatPlaceName(stateName);
  const currentCountry = cities[0].country ? cities[0].country : '';

  return (
    <div id="state-page">
      <DynamicBreadcrumb />
      <HomeHero heading={`Find More Cities in ${stateNameFormatted}`} />
      <div className="flex flex-col items-center">
        <h3 className="text-2xl w-full font-bold select-none pl-8 border-b-2 mb-6 py-6 text-center ">
          Top Cities in {stateNameFormatted}
        </h3>

        {cities.length === 0 ? <LoadingGrid /> : <CityList cities={cities} />}
      </div>
      <CountryList countries={countries} currentCountry={currentCountry} />
    </div>
  );
}
