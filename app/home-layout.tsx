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
        {initialCities.length === 0 ? (
          <LoadingGrid />
        ) : (
          <CityList cities={initialCities} heading="Explore Popular Cities" />
        )}
      </div>
      <CountryList countries={countries} currentCountry="" />
    </div>
  );
}
