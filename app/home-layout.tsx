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
    <div className="">
      <div className="home-hero flex flex-col justify-center items-center w-full mt-10">
        <h1 className="text-3xl font-bold my-12 select-none">
          Find Your Work Space
        </h1>

        <div className="flex flex-row">
          <GooglePlacesAutocomplete />
        </div>
      </div>

      <div className="mt-4">
        <hr className="mt-10" />
        <h3 className="text-lg font-bold select-none ml-4 my-4">Top Cities:</h3>

        {initialCities.length === 0 ? (
          <LoadingGrid />
        ) : (
          <CityList cities={initialCities} />
        )}
      </div>
    </div>
  );
}
