// 'use client';

import LoadingGrid from '@/components/general/loading-grid';
import CityList from '@/app/_components/city-list';

import { City } from '@/utils/types';

export default function CountryPageLayout({ cities }: { cities: City[] }) {
  return (
    <div className="state-page">
      <h1 className="capitalize">
        Cities in {cities[0]?.country ? cities[0].country : ''}
      </h1>
      <div className="flex flex-col items-center mt-4 ">
        <hr className="mt-10" />
        <h3 className="text-lg text-left w-full font-bold select-none pl-8 my-4">
          Top Cities:
        </h3>

        {cities.length === 0 ? <LoadingGrid /> : <CityList cities={cities} />}
      </div>
    </div>
  );
}
