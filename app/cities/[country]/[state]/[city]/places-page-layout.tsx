'use client';

import React from 'react';
import LazyGoogleMap from './_components/lazy-google-map';
import { useSearchParams } from 'next/navigation';
import { Place, City } from '@/utils/types';
import PlacesList from './_components/places-list';
import { filterAndSortPlaces } from '@/utils/places/sortPlacesUtils';
import { useEffect, useState } from 'react';
import Filters from './_components/filters';
import { fetchNewPlaces } from './actions';
import LoadingGrid from '@/components/general/loading-grid';
import LoadingPlace from './[id]/_components/loading-place';
import CityHero from './_components/city-hero';
import DynamicBreadcrumb from '@/components/general/dynamic-breadcrumb';

export default function PlacesPageLayout({
  city,
  places
}: {
  city: City;
  places: Place[];
}) {
  const searchParams = useSearchParams();

  const [filteredPlaces, setFilteredPlaces] = useState<Place[]>(places);
  const [allPlaces, setAllPlaces] = useState<Place[]>(places);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPlace, setIsLoadingPlace] = useState(false);
  const [searchComplete, setSearchComplete] = useState(false);

  const handleSearch = async () => {
    const { type, radius, lat, lng, sortMethod, sortOrder } =
      parseSearchParams();
    const newPlaces = await fetchNewPlaces(city, type, radius, lat, lng);
    const allNewPlaces = [...places, ...newPlaces];
    setAllPlaces(allNewPlaces);
    const newFiltered = filterAndSortPlaces(
      allNewPlaces,
      type,
      sortMethod,
      lat,
      lng,
      radius,
      sortOrder as 'asc' | 'des'
    );

    setFilteredPlaces(newFiltered);
    setSearchComplete(true);
    setIsLoading(false);
  };

  const parseSearchParams = () => {
    const type = searchParams?.get('place_type') || 'cafe';
    const radius = searchParams?.get('radius') || '1000';
    const lat = searchParams?.get('lat') || city.lat.toString();
    const lng = searchParams?.get('lng') || city.lng.toString();
    const sortMethod = searchParams?.get('sort_method') || 'distance';
    const sortOrder = searchParams?.get('sort_order') || 'asc';
    return { type, radius, lat, lng, sortMethod, sortOrder };
  };

  // Update filtered places when search params or allPlaces change
  useEffect(() => {
    const { type, radius, lat, lng, sortMethod, sortOrder } =
      parseSearchParams();

    const filtered = filterAndSortPlaces(
      allPlaces,
      type,
      sortMethod,
      lat,
      lng,
      radius,
      sortOrder as 'asc' | 'des'
    );

    if (filtered.length === 0 && !searchComplete) {
      setFilteredPlaces([]);
      setIsLoading(true);
      handleSearch();
    } else {
      setFilteredPlaces(filtered);
      setSearchComplete(false);
      console.log('Filtered places:', filtered.length);
    }
  }, [searchParams, allPlaces]);

  if (isLoadingPlace) {
    return <LoadingPlace />;
  }

  return (
    <>
      <DynamicBreadcrumb />

      <div className="grid lg:grid-cols-2 w-full">
        <CityHero city={city} />
        <div className="city-map lg:mx-0 sm:mx-12">
          <LazyGoogleMap
            searchParams={searchParams}
            lat={city.lat.toString()}
            lng={city.lng.toString()}
          />
        </div>
      </div>
      <div className="flex flex-row flex-wrap justify-between w-full border-t mt-6 items-center">
        <Filters searchParams={searchParams} />
        {/* <Button onClick={handleSearch} className="m-4" disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Search'}
        </Button> */}
      </div>

      <h1 className="md:text-4xl text-2xl font-bold mx-4 md:mt-8 mt-6 select-none text-center leading-normal w-full">
        Workspaces in{' '}
        <span className="capitalize">
          {city && city.name.replace(/-/g, ' ')}
        </span>
      </h1>
      {isLoading ? (
        <LoadingGrid />
      ) : (
        <PlacesList
          filteredPlaces={filteredPlaces}
          searchParams={searchParams}
          city={city}
          setIsLoadingPlace={setIsLoadingPlace}
        />
      )}
    </>
  );
}
