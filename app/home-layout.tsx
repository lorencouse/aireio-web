// 'use client';

import LoadingGrid from '@/components/general/loading-grid';
import CityList from './_components/city-list';

import { City } from '@/utils/types';
import HomeHero from './_components/home-hero';
import CountryList from './cities/[country]/_components/country-list';

export default function HomeLayout({
  initialCities,
  countries
}: {
  initialCities: City[];
  countries: { country: string; country_code: string }[];
}) {
  return (
    <div id="aireio-home">
      <HomeHero heading="Find Your Work Space" />
      <div className="flex flex-col items-center">
        <h3 className="text-2xl w-full font-bold select-none pl-8 mb-4 border-t-2 mt-6 pt-6 text-center ">
          Explore Popular Cities
        </h3>

        {initialCities.length === 0 ? (
          <LoadingGrid />
        ) : (
          <CityList cities={initialCities} />
        )}
      </div>
      <CountryList countries={countries} currentCountry="" />
    </div>
  );
}
