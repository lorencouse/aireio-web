// 'use client';

import LoadingGrid from '@/components/general/loading-grid';
import CityList from './_components/city-list';

import { City } from '@/utils/types';
import HomeHero from './_components/home-hero';

export default function HomeLayout({
  initialCities
}: {
  initialCities: City[];
}) {
  return (
    <div className="aireio-home">


      <HomeHero />
      <div className="flex flex-col items-center mt-4 ">
        <hr className="mt-10" />
        <h3 className="text-lg text-left w-full font-bold select-none pl-8 my-4">
          Top Cities:
        </h3>

        {initialCities.length === 0 ? (
          <LoadingGrid />
        ) : (
          <CityList cities={initialCities} />
        )}
      </div>
    </div>
  );
}
