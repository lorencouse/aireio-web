'use client';

import React from 'react';
import SegmentedTypePicker from './_components/segmented-type-picker';
import SortMethod from './_components/sort-method';
import SortOrderPicker from './_components/sort-order-picker';
// import GoogleMap from './_components/google-map';
import LazyGoogleMap from './_components/lazy-google-map';
import { useSearchParams } from 'next/navigation';
import { Place, City } from '@/utils/types';
import PlacesList from './_components/places-list';
import { filterAndSortPlaces } from '@/utils/places/sortPlacesUtils';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { fetchNewPlaces } from './actions';
import LoadingGrid from '@/components/general/loading-grid';
import LoadingPlace from './[id]/_components/loading-place';
import CityHero from './_components/city-hero';

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
    if (!allPlaces || allPlaces.length === 0) return;

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
      <CityHero
        // city={city.name || ''}
        // state={city.state || ''}
        // country={city.country || ''}
        // countryCode={city.country_code || ''}
        city={city}
      />
      <div className="grid lg:grid-cols-2 w-full">
        <div className="city-map lg:mx-0 sm:mx-12">
          <LazyGoogleMap
            searchParams={searchParams}
            lat={city.lat.toString()}
            lng={city.lng.toString()}
          />
        </div>
        <div className="city-filters flex flex-col p-4 md:p-10">
          <span className="text-lg font-bold border-t pt-6">Filter by:</span>
          <SegmentedTypePicker searchParams={searchParams} />
          <div className="flex flex-row gap-4 mb-6 justify-between flex-wrap">
            <SortMethod searchParams={searchParams} />
            <Button onClick={handleSearch}>Search</Button>
            <SortOrderPicker searchParams={searchParams} />
          </div>
        </div>
      </div>
      <h1 className="text-4xl font-bold m-8 border-t pt-6 select-none text-center leading-normal w-full">
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
