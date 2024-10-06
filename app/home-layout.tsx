// 'use client';

import LoadingGrid from '@/components/general/loading-grid';
import CityList from './_components/city-list';
import GooglePlacesAutocomplete from './_components/google-places-search-autocomplete';

import { City } from '@/utils/types';

export default function HomeLayout({
  initialCities
}: {
  initialCities: City[];
}) {
  return (
    <div className="flex flex-col justify-center items-center w-full mt-[1rem] p-3 ">
      <h1 className="text-3xl font-bold mb-12 select-none">
        Find Your Work Space
      </h1>

      <div className="flex flex-row">
        <GooglePlacesAutocomplete />
      </div>

      <div className="mt-4">
        <h3 className="text-lg font-bold select-none ml-4 mb-4">Top Cities:</h3>
        <hr className="mb-4" />

        {initialCities.length === 0 ? (
          <LoadingGrid />
        ) : (
          <CityList cities={initialCities} />
        )}
      </div>
    </div>
  );
}
