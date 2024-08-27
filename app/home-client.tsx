'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import LoadingGrid from '@/components/general/loading-grid';
import CityList from '@/components/homepage/city-list';
import GooglePlacesAutocomplete from '@/components/homepage/google-places-search-autocomplete';

import useGetCity from '@/utils/hook/useGetCity';

import { City } from '@/types/place';

interface HomeClientProps {
  initialCities: City[];
}

export default function HomeClient({ initialCities }: HomeClientProps) {
  const router = useRouter();
  const { selectedCityId, handleCitySelected } = useGetCity();

  useEffect(() => {
    if (selectedCityId) {
      router.push(`/places?city_id=${selectedCityId}`);
    }
  }, [selectedCityId, router]);

  return (
    <div className='flex flex-col justify-center items-center w-full mt-[1rem] p-3 '>
      <h1 className='text-3xl font-bold mb-12 select-none'>
        Find Your Work Space
      </h1>

      <div className='flex flex-row'>
        <GooglePlacesAutocomplete onPlaceSelected={handleCitySelected} />
      </div>

      <div className='mt-4'>
        <h3 className='text-lg font-bold select-none ml-4 mb-4'>Top Cities:</h3>
        <hr className='mb-4' />

        {initialCities.length === 0 ? (
          <LoadingGrid />
        ) : (
          <CityList cities={initialCities} />
        )}
      </div>
    </div>
  );
}
