// 'use client';

import LoadingGrid from '@/components/general/loading-grid';
import CityList from '@/app/_components/city-list';

import { City } from '@/utils/types';
import HomeHero from '@/app/_components/home-hero';

export default function CountryPageLayout({ cities }: { cities: City[] }) {
  return (
    <div className="state-page">
      <HomeHero heading={`Find Work Spaces in ${cities[0]?.country}`} />
      <div className="flex flex-col items-center mt-4 ">
        <h3 className="md:text-2xl text-xl w-full font-bold select-none md:py-8 py-4 mb-4 text-center border-b-2">
          Top Cities in {cities[0]?.country}
        </h3>

        {cities.length === 0 ? <LoadingGrid /> : <CityList cities={cities} />}
      </div>
    </div>
  );
}
